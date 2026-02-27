package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/platform/ingestion-api/internal/config"
	internalhttp "github.com/platform/ingestion-api/internal/http"
	"github.com/platform/ingestion-api/internal/queue"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	cfg := config.Load()
	logger := buildLogger(cfg.LogLevel)
	defer logger.Sync()

	producer := queue.NewProducer(cfg.KafkaBrokers, cfg.KafkaTopic, cfg.KafkaClientID, logger)
	defer producer.Close()

	handler := internalhttp.NewHandler(producer, cfg.APIKey, logger)
	server := internalhttp.NewServer(cfg.Port, cfg.RateLimitRPM, handler, logger)

	// Graceful shutdown on SIGTERM / SIGINT
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		if err := server.Start(); err != nil {
			logger.Fatal("Server failed to start", zap.Error(err))
		}
	}()

	<-quit
	logger.Info("Received shutdown signal, draining...")

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.ShutdownTimeout)*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Error("Graceful shutdown failed", zap.Error(err))
	}

	logger.Info("Server stopped cleanly")
}

func buildLogger(level string) *zap.Logger {
	lvl := zapcore.InfoLevel
	_ = lvl.UnmarshalText([]byte(level))

	cfg := zap.NewProductionConfig()
	cfg.Level = zap.NewAtomicLevelAt(lvl)
	logger, _ := cfg.Build()
	return logger
}
