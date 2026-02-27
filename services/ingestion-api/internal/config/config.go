package config

import (
	"os"
	"strconv"
)

type Config struct {
	// HTTP server
	Port            string
	ShutdownTimeout int // seconds

	// Kafka
	KafkaBrokers  string
	KafkaTopic    string
	KafkaClientID string

	// Auth
	APIKey string

	// Observability
	MetricsPort string
	LogLevel    string

	// Rate limiting
	RateLimitRPM int // requests per minute per IP
}

func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		ShutdownTimeout: getEnvInt("SHUTDOWN_TIMEOUT_SECS", 15),

		KafkaBrokers:  getEnv("KAFKA_BROKERS", "localhost:9092"),
		KafkaTopic:    getEnv("KAFKA_RAW_EVENTS_TOPIC", "raw_events"),
		KafkaClientID: getEnv("KAFKA_CLIENT_ID", "ingestion-api"),

		APIKey: getEnv("INTERNAL_API_KEY", ""),

		MetricsPort: getEnv("METRICS_PORT", "9090"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),

		RateLimitRPM: getEnvInt("RATE_LIMIT_RPM", 6000),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}
