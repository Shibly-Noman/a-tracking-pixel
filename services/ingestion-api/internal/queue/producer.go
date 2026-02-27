package queue

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	kafkago "github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Producer wraps the Kafka writer.
type Producer struct {
	writer *kafkago.Writer
	logger *zap.Logger
}

func NewProducer(brokers, topic, clientID string, logger *zap.Logger) *Producer {
	writer := &kafkago.Writer{
		Addr:         kafkago.TCP(brokers),
		Topic:        topic,
		Balancer:     &kafkago.Hash{},
		BatchTimeout: 50 * time.Millisecond,
		BatchSize:    100,
		Async:        false, // synchronous for durability at MVP scale
		Logger:       kafkago.LoggerFunc(func(msg string, args ...interface{}) { logger.Sugar().Debugf(msg, args...) }),
		ErrorLogger:  kafkago.LoggerFunc(func(msg string, args ...interface{}) { logger.Sugar().Errorf(msg, args...) }),
	}

	return &Producer{writer: writer, logger: logger}
}

// Publish encodes the payload as JSON and writes it to the Kafka topic.
// The project_id is used as the partition key for ordered per-project processing.
func (p *Producer) Publish(ctx context.Context, projectID string, payload interface{}) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	msg := kafkago.Message{
		Key:   []byte(projectID),
		Value: data,
		Headers: []kafkago.Header{
			{Key: "message_id", Value: []byte(uuid.New().String())},
			{Key: "produced_at", Value: []byte(time.Now().UTC().Format(time.RFC3339))},
		},
	}

	if err := p.writer.WriteMessages(ctx, msg); err != nil {
		p.logger.Error("Failed to write message to Kafka", zap.Error(err), zap.String("project_id", projectID))
		return err
	}

	return nil
}

func (p *Producer) Close() error {
	return p.writer.Close()
}
