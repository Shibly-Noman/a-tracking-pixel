FROM golang:1.22-alpine AS builder
WORKDIR /app

# Install dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy module files (go.sum may not exist yet)
COPY go.* ./
RUN go mod download

COPY . .

# Ensure go.sum contains all required entries (especially when go.sum was missing/empty)
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -extldflags '-static'" \
    -o ingestion-api ./main.go

# Final minimal image
FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /app/ingestion-api /ingestion-api

EXPOSE 8080 9090
ENTRYPOINT ["/ingestion-api"]
