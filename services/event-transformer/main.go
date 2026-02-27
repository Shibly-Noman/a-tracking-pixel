package main

import (
	"context"
	"encoding/json"
	"os"
	"os/signal"
	"syscall"
	"time"

	kafkago "github.com/segmentio/kafka-go"
	"github.com/platform/event-transformer/internal/enricher"
	"github.com/platform/event-transformer/internal/normalizer"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	brokers := getEnv("KAFKA_BROKERS", "localhost:9092")
	rawTopic := getEnv("KAFKA_RAW_EVENTS_TOPIC", "raw_events")
	enrichedTopic := getEnv("KAFKA_ENRICHED_EVENTS_TOPIC", "enriched_events")
	groupID := getEnv("KAFKA_GROUP_ID", "event-transformer")
	mmdbPath := getEnv("MAXMIND_DB_PATH", "")

	geoEnricher, err := enricher.NewGeoEnricher(mmdbPath)
	if err != nil {
		logger.Fatal("Failed to init geo enricher", zap.Error(err))
	}
	defer geoEnricher.Close()

	deviceEnricher := enricher.NewDeviceEnricher()

	reader := kafkago.NewReader(kafkago.ReaderConfig{
		Brokers:        []string{brokers},
		Topic:          rawTopic,
		GroupID:        groupID,
		MinBytes:       1,
		MaxBytes:       10e6, // 10MB
		CommitInterval: time.Second,
		StartOffset:    kafkago.LastOffset,
	})
	defer reader.Close()

	writer := &kafkago.Writer{
		Addr:         kafkago.TCP(brokers),
		Topic:        enrichedTopic,
		Balancer:     &kafkago.Hash{},
		BatchTimeout: 50 * time.Millisecond,
	}
	defer writer.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		<-quit
		logger.Info("Received shutdown signal")
		cancel()
	}()

	logger.Info("Event transformer started", zap.String("raw_topic", rawTopic), zap.String("enriched_topic", enrichedTopic))

	for {
		msg, err := reader.FetchMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				break // context cancelled
			}
			logger.Error("Failed to fetch message", zap.Error(err))
			time.Sleep(time.Second)
			continue
		}

		var raw normalizer.RawEvent
		if err := json.Unmarshal(msg.Value, &raw); err != nil {
			logger.Warn("Failed to unmarshal raw event", zap.Error(err))
			reader.CommitMessages(ctx, msg)
			continue
		}

		norm, err := normalizer.NormalizeEvent(&raw)
		if err != nil {
			logger.Warn("Failed to normalize event", zap.Error(err))
			reader.CommitMessages(ctx, msg)
			continue
		}

		// Enrich with geo and device data
		type EnrichedEvent struct {
			normalizer.NormalizedEvent
			Geo        enricher.GeoData    `json:"geo"`
			Device     enricher.DeviceData `json:"device"`
			EnrichedAt time.Time           `json:"enriched_at"`
		}

		enriched := EnrichedEvent{
			NormalizedEvent: *norm,
			Geo:             geoEnricher.EnrichGeo(raw.EdgeCountry), // use edge country for MVP; in prod use raw IP before hashing
			Device:          deviceEnricher.EnrichDevice(raw.UserAgent),
			EnrichedAt:      time.Now().UTC(),
		}

		data, err := json.Marshal(enriched)
		if err != nil {
			logger.Error("Failed to marshal enriched event", zap.Error(err))
			reader.CommitMessages(ctx, msg)
			continue
		}

		outMsg := kafkago.Message{
			Key:   []byte(raw.ProjectID),
			Value: data,
		}

		if err := writer.WriteMessages(ctx, outMsg); err != nil {
			logger.Error("Failed to write enriched event", zap.Error(err))
			// Don't commit — will retry on restart
			continue
		}

		reader.CommitMessages(ctx, msg)
	}

	logger.Info("Event transformer stopped")
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
