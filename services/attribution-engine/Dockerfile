FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git ca-certificates tzdata

# Copy module files (go.sum may not exist yet)
COPY go.* ./
RUN go mod download
COPY . .

# Ensure go.sum contains all required entries (especially when go.sum was missing/empty)
RUN go mod tidy

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o service ./main.go

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /app/service /service
ENTRYPOINT ["/service"]
