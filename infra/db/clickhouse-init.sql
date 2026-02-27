-- Platform Analytics - ClickHouse Schema

-- ── Pageviews (high-volume event table) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.pageviews
(
    event_id        String,
    project_id      String,
    session_id      String,
    visitor_id      String,
    timestamp       DateTime64(3, 'UTC'),
    page_url        String,
    page_path       String,
    page_title      String,
    referrer        String,
    utm_source      LowCardinality(String),
    utm_medium      LowCardinality(String),
    utm_campaign    String,
    geo_country     LowCardinality(String),
    geo_city        String,
    device_type     LowCardinality(String),
    browser         LowCardinality(String),
    os              LowCardinality(String),
    duration_ms     UInt32,
    is_bounced      UInt8,
    received_at     DateTime64(3, 'UTC')
)
ENGINE = MergeTree()
PARTITION BY (toYYYYMM(timestamp))
ORDER BY (project_id, timestamp, session_id)
TTL toDateTime(timestamp) + INTERVAL 90 DAY DELETE
SETTINGS index_granularity = 8192;

-- ── Raw events (all event types) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.events
(
    event_id        String,
    project_id      String,
    session_id      String,
    visitor_id      String,
    event_type      LowCardinality(String),
    event_name      String,
    timestamp       DateTime64(3, 'UTC'),
    page_url        String,
    page_path       String,
    utm_source      LowCardinality(String),
    utm_medium      LowCardinality(String),
    utm_campaign    String,
    geo_country     LowCardinality(String),
    device_type     LowCardinality(String),
    properties      String,  -- JSON
    received_at     DateTime64(3, 'UTC')
)
ENGINE = MergeTree()
PARTITION BY (toYYYYMM(timestamp))
ORDER BY (project_id, event_type, timestamp, session_id)
TTL toDateTime(timestamp) + INTERVAL 90 DAY DELETE
SETTINGS index_granularity = 8192;

-- ── Conversions (mirrored from Postgres for fast aggregation) ────────────────

CREATE TABLE IF NOT EXISTS analytics.conversions
(
    id                  String,
    project_id          String,
    session_id          String,
    conversion_event    String,
    value               Float64,
    currency            LowCardinality(String),
    attributed_channel  LowCardinality(String),
    attributed_source   String,
    attributed_medium   LowCardinality(String),
    attribution_model   LowCardinality(String),
    occurred_at         DateTime64(3, 'UTC')
)
ENGINE = MergeTree()
PARTITION BY (toYYYYMM(occurred_at))
ORDER BY (project_id, attribution_model, occurred_at)
TTL toDateTime(occurred_at) + INTERVAL 90 DAY DELETE
SETTINGS index_granularity = 8192;

-- ── Materialized view: daily metrics rollup ───────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_metrics_mv
ENGINE = AggregatingMergeTree()
PARTITION BY (toYYYYMM(date))
ORDER BY (project_id, date)
AS
SELECT
    project_id,
    toDate(timestamp) AS date,
    countState() AS pageviews,
    uniqExactState(session_id) AS sessions,
    uniqExactState(visitor_id) AS visitors,
    avgState(duration_ms) AS avg_duration_ms
FROM analytics.pageviews
GROUP BY project_id, date;
