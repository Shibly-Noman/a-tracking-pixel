import { EventPayload } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEvent(payload: unknown): ValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be an object'] };
  }

  const p = payload as Partial<EventPayload>;

  if (!p.project_id || typeof p.project_id !== 'string') {
    errors.push('project_id is required and must be a string');
  }
  if (!p.event_type || typeof p.event_type !== 'string') {
    errors.push('event_type is required and must be a string');
  }
  if (!p.timestamp || typeof p.timestamp !== 'string') {
    errors.push('timestamp is required');
  } else {
    const ts = Date.parse(p.timestamp);
    if (isNaN(ts)) errors.push('timestamp must be a valid ISO 8601 date');
    // Reject events more than 1 hour in the future or 24 hours in the past
    const now = Date.now();
    if (ts > now + 3_600_000) errors.push('timestamp is too far in the future');
    if (ts < now - 86_400_000) errors.push('timestamp is too old');
  }
  if (!p.page_url || typeof p.page_url !== 'string') {
    errors.push('page_url is required');
  }

  return { valid: errors.length === 0, errors };
}

export function validateBatch(items: unknown[]): ValidationResult {
  if (!Array.isArray(items)) {
    return { valid: false, errors: ['Batch must be an array'] };
  }
  if (items.length === 0) {
    return { valid: false, errors: ['Batch cannot be empty'] };
  }
  if (items.length > 100) {
    return { valid: false, errors: ['Batch exceeds maximum size of 100'] };
  }

  const errors: string[] = [];
  items.forEach((item, i) => {
    const result = validateEvent(item);
    if (!result.valid) {
      errors.push(`Event ${i}: ${result.errors.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors };
}
