import { Env } from './config';
import { validateBatch, validateEvent } from './validation';

const MAX_BODY_SIZE = 512 * 1024; // 512KB

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // Health check
  if (url.pathname === '/health') {
    return json({ status: 'ok' }, 200);
  }

  // Only accept event ingestion endpoint
  if (url.pathname !== '/e') {
    return json({ error: 'Not found' }, 404);
  }

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors(request, env, new Response(null, { status: 204 }));
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Check content-length header to reject oversized payloads early
  const contentLength = parseInt(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_SIZE) {
    return json({ error: 'Payload too large' }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Support both single event and batch
  const isBatch = Array.isArray(body);
  const events = isBatch ? body : [body];

  const validation = isBatch ? validateBatch(events) : validateEvent(events[0]);
  if (!validation.valid) {
    return handleCors(
      request,
      env,
      json({ error: 'Validation failed', details: validation.errors }, 422)
    );
  }

  // Enrich with edge metadata (IP hash, CF geo)
  const enrichedEvents = events.map((event) =>
    enrichWithEdgeData(event as Record<string, unknown>, request)
  );

  // Forward to ingestion API
  try {
    const upstream = await fetch(env.INGESTION_API_URL + '/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': env.INGESTION_API_KEY,
        'X-Forwarded-From': 'edge-worker',
      },
      body: JSON.stringify(enrichedEvents),
    });

    if (!upstream.ok) {
      console.error('Upstream ingestion failed', upstream.status);
      // Return 200 to client anyway - we don't want to lose events
      // In production: add to dead-letter queue here
    }
  } catch (err) {
    console.error('Failed to forward events', err);
    // Same: don't surface upstream errors to the pixel
  }

  return handleCors(request, env, json({ accepted: events.length }, 200));
}

function enrichWithEdgeData(
  event: Record<string, unknown>,
  request: Request
): Record<string, unknown> {
  const cf = (request as unknown as { cf?: Record<string, unknown> }).cf;
  return {
    ...event,
    // Hash the IP for privacy - never store raw IPs
    ip_hash: hashIP(request.headers.get('cf-connecting-ip') ?? ''),
    edge_country: cf?.country ?? request.headers.get('cf-ipcountry'),
    edge_city: cf?.city,
    edge_region: cf?.region,
  };
}

/** Simple deterministic hash of the IP for privacy-safe visitor identification */
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + new Date().toDateString()); // daily salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleCors(request: Request, env: Env, response: Response): Response {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()) ?? ['*'];
  const isAllowed = allowed.includes('*') || allowed.includes(origin);

  const headers = new Headers(response.headers);
  if (isAllowed) {
    headers.set('Access-Control-Allow-Origin', origin || '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400');
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
