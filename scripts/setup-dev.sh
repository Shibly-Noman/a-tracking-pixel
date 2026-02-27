#!/usr/bin/env bash
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
RESET="\033[0m"

log() { echo -e "${BLUE}→${RESET} $1"; }
success() { echo -e "${GREEN}✓${RESET} $1"; }
header() { echo -e "\n${BOLD}$1${RESET}"; }

header "Platform Analytics - Dev Setup"

# ── Prerequisites check ────────────────────────────────────────────────────────

check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo "❌  $1 is required but not installed. Please install it and re-run."
    exit 1
  fi
}

log "Checking prerequisites..."
check_command docker
check_command docker-compose
check_command go
check_command node
check_command pnpm
success "All prerequisites found"

# ── Node deps ─────────────────────────────────────────────────────────────────

header "Installing Node.js dependencies"
pnpm install
success "Node dependencies installed"

# ── Go deps ───────────────────────────────────────────────────────────────────

header "Downloading Go dependencies"
for svc in services/ingestion-api services/event-transformer services/attribution-engine; do
  log "go mod download: $svc"
  (cd "$svc" && go mod download)
done
success "Go dependencies downloaded"

# ── Environment files ─────────────────────────────────────────────────────────

header "Creating .env files"
for envfile in apps/dashboard apps/query-api services/ingestion-api services/event-transformer services/attribution-engine; do
  if [ -f "$envfile/.env.example" ] && [ ! -f "$envfile/.env" ]; then
    cp "$envfile/.env.example" "$envfile/.env"
    log "Created $envfile/.env"
  fi
done
success "Environment files ready"

# ── Start infrastructure ──────────────────────────────────────────────────────

header "Starting Docker infrastructure"
docker-compose up -d postgres clickhouse kafka zookeeper kafka-init
log "Waiting for services to be healthy..."
sleep 15

# Wait for Postgres
log "Checking Postgres..."
until docker-compose exec -T postgres pg_isready -U platform &>/dev/null; do
  sleep 2
done
success "Postgres is ready"

# Wait for ClickHouse
log "Checking ClickHouse..."
until curl -sf http://localhost:8123/ping &>/dev/null; do
  sleep 2
done
success "ClickHouse is ready"

# ── Done ──────────────────────────────────────────────────────────────────────

header "🚀 Setup complete!"
echo ""
echo "  Start all services:    docker-compose up"
echo "  Start dev mode:        pnpm dev"
echo ""
echo "  Dashboard:             http://localhost:3000"
echo "  Query API:             http://localhost:3001"
echo "  Ingestion API:         http://localhost:8080"
echo "  ClickHouse HTTP:       http://localhost:8123"
echo "  Kafka:                 localhost:9092"
echo ""
echo "  Default API key:       pk_dev_0000000000000000000000000000000000000000000000"
echo ""
