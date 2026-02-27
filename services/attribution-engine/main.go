package main

import (
	"context"
	"encoding/json"
	"os"
	"os/signal"
	"syscall"
	"time"

	kafkago "github.com/segmentio/kafka-go"
	"github.com/platform/attribution-engine/internal/attribution"
	sessionstore "github.com/platform/attribution-engine/internal/session_store"
	"go.uber.org/zap"
)

// EnrichedEvent is the input from the enriched_events Kafka topic.
type EnrichedEvent struct {
	EventID    string    `json:"event_id"`
	ProjectID  string    `json:"project_id"`
	EventType  string    `json:"event_type"`
	Timestamp  time.Time `json:"timestamp"`
	PageURL    string    `json:"page_url"`
	PagePath   string    `json:"page_path"`
	SessionID  string    `json:"session_id"`
	IPHash     string    `json:"ip_hash"`
	EnrichedAt time.Time `json:"enriched_at"`
	UTM        struct {
		Source   string `json:"source"`
		Medium   string `json:"medium"`
		Campaign string `json:"campaign"`
	} `json:"utm"`
	Geo struct {
		CountryCode string `json:"country_code"`
	} `json:"geo"`
	Device struct {
		Type    string `json:"type"`
		Browser string `json:"browser"`
		OS      string `json:"os"`
	} `json:"device"`
	Properties map[string]interface{} `json:"properties"`
}

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	brokers := getEnv("KAFKA_BROKERS", "localhost:9092")
	enrichedTopic := getEnv("KAFKA_ENRICHED_EVENTS_TOPIC", "enriched_events")
	groupID := getEnv("KAFKA_GROUP_ID", "attribution-engine")

	store := sessionstore.NewStore(35 * time.Minute) // 30min session + 5min buffer

	reader := kafkago.NewReader(kafkago.ReaderConfig{
		Brokers:        []string{brokers},
		Topic:          enrichedTopic,
		GroupID:        groupID,
		MinBytes:       1,
		MaxBytes:       10e6,
		CommitInterval: time.Second,
	})
	defer reader.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		<-quit
		logger.Info("Shutting down attribution engine")
		cancel()
	}()

	logger.Info("Attribution engine started", zap.String("topic", enrichedTopic))

	for {
		msg, err := reader.FetchMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				break
			}
			logger.Error("Fetch error", zap.Error(err))
			time.Sleep(time.Second)
			continue
		}

		var event EnrichedEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			logger.Warn("Unmarshal error", zap.Error(err))
			reader.CommitMessages(ctx, msg)
			continue
		}

		processEvent(event, store, logger)
		reader.CommitMessages(ctx, msg)
	}

	logger.Info("Attribution engine stopped")
}

func processEvent(event EnrichedEvent, store *sessionstore.Store, logger *zap.Logger) {
	if event.SessionID == "" {
		return
	}

	// Generate a stable visitor ID from the IP hash
	visitorID := event.IPHash

	sess := store.GetOrCreate(
		event.SessionID,
		event.ProjectID,
		visitorID,
		event.PagePath,
		event.Timestamp,
	)

	sess.PageCount++
	sess.CurrentPage = event.PagePath
	sess.LastSeen = event.Timestamp

	// Record touchpoint if there's UTM data
	if event.UTM.Source != "" {
		tp := attribution.Touchpoint{
			SessionID: event.SessionID,
			Source:    event.UTM.Source,
			Medium:    event.UTM.Medium,
			Campaign:  event.UTM.Campaign,
			Timestamp: event.Timestamp,
		}
		sess.Touchpoints = append(sess.Touchpoints, tp)
	}

	// Handle conversion events
	if event.EventType == "conversion" {
		handleConversion(event, sess, logger)
	}

	store.Update(sess)
}

func handleConversion(event EnrichedEvent, sess *sessionstore.Session, logger *zap.Logger) {
	model := attribution.NewModel("last_touch") // configurable per project in production
	credits := model.Attribute(sess.Touchpoints, getConversionValue(event))

	logger.Info("Conversion attributed",
		zap.String("session_id", event.SessionID),
		zap.String("project_id", event.ProjectID),
		zap.Any("credits", credits),
	)

	// TODO: Persist conversion + attribution credits to PostgreSQL
	// In production: call repository.SaveConversion(event, credits)
}

func getConversionValue(event EnrichedEvent) float64 {
	if v, ok := event.Properties["value"]; ok {
		switch val := v.(type) {
		case float64:
			return val
		}
	}
	return 1.0 // default value for unvalued conversions
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
