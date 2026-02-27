-- Platform Analytics - PostgreSQL Schema
-- Run once on first boot via Docker init

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Projects ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    domain          TEXT NOT NULL,
    api_key         TEXT NOT NULL UNIQUE,
    api_key_hash    TEXT,
    timezone        TEXT NOT NULL DEFAULT 'UTC',
    retention_days  INTEGER NOT NULL DEFAULT 90,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_projects_api_key ON projects(api_key) WHERE deleted_at IS NULL;

-- ── Sessions ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
    id              TEXT PRIMARY KEY,  -- session_id from pixel
    project_id      UUID NOT NULL REFERENCES projects(id),
    visitor_id      TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    ended_at        TIMESTAMPTZ,
    duration_ms     INTEGER,
    pageview_count  INTEGER NOT NULL DEFAULT 0,
    entry_page      TEXT,
    exit_page       TEXT,
    referrer        TEXT,
    utm_source      TEXT,
    utm_medium      TEXT,
    utm_campaign    TEXT,
    geo_country     TEXT,
    device_type     TEXT,
    browser         TEXT,
    os              TEXT,
    is_bounced      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_sessions_started_at ON sessions(project_id, started_at DESC);
CREATE INDEX idx_sessions_visitor_id ON sessions(visitor_id);

-- ── Conversions ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID NOT NULL REFERENCES projects(id),
    session_id          TEXT NOT NULL,
    event_id            TEXT NOT NULL,
    conversion_event    TEXT NOT NULL,
    value               NUMERIC(12, 4),
    currency            TEXT DEFAULT 'USD',
    label               TEXT,
    attributed_channel  TEXT,
    attributed_source   TEXT,
    attributed_medium   TEXT,
    attribution_model   TEXT,
    occurred_at         TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversions_project_id ON conversions(project_id);
CREATE INDEX idx_conversions_occurred_at ON conversions(project_id, occurred_at DESC);

-- ── Seed dev project ──────────────────────────────────────────────────────────

INSERT INTO projects (name, domain, api_key, timezone)
VALUES ('Dev Project', 'localhost', 'pk_dev_0000000000000000000000000000000000000000000000', 'UTC')
ON CONFLICT (api_key) DO NOTHING;
