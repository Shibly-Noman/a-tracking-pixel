export interface WorkerConfig {
  INGESTION_API_URL: string;
  INGESTION_API_KEY: string;
  ALLOWED_ORIGINS: string;    // comma-separated list
  MAX_BODY_SIZE_BYTES: number;
}

export interface EventPayload {
  event_id?: string;
  project_id: string;
  event_type: string;
  timestamp: string;
  page_url: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
  properties?: Record<string, unknown>;
  utm?: Record<string, string | undefined>;
  pixel_version?: string;
}

export type Env = WorkerConfig;
