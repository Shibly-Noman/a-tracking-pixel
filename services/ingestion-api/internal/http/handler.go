package http

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/platform/ingestion-api/internal/event"
	"github.com/platform/ingestion-api/internal/queue"
	"go.uber.org/zap"
)

const maxBatchSize = 100

type Handler struct {
	producer *queue.Producer
	logger   *zap.Logger
	apiKey   string
}

func NewHandler(producer *queue.Producer, apiKey string, logger *zap.Logger) *Handler {
	return &Handler{producer: producer, apiKey: apiKey, logger: logger}
}

func (h *Handler) HandleEventPost(w http.ResponseWriter, r *http.Request) {
	// Validate internal API key (sent by edge worker)
	if h.apiKey != "" && r.Header.Get("X-Api-Key") != h.apiKey {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	var raw json.RawMessage
	if err := json.NewDecoder(r.Body).Decode(&raw); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}

	// Accept both single event and array
	events, err := parseEvents(raw)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if len(events) > maxBatchSize {
		writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "batch exceeds max size"})
		return
	}

	accepted := 0
	for i := range events {
		e := &events[i]

		// Assign received_at and ensure event_id
		e.ReceivedAt = time.Now().UTC()
		if e.EventID == "" {
			e.EventID = uuid.New().String()
		}

		if err := event.Validate(e); err != nil {
			h.logger.Warn("Event validation failed", zap.Error(err), zap.String("project_id", e.ProjectID))
			continue
		}

		if err := h.producer.Publish(r.Context(), e.ProjectID, e); err != nil {
			h.logger.Error("Failed to publish event", zap.Error(err))
			// Don't break — continue with remaining events
			continue
		}
		accepted++
	}

	writeJSON(w, http.StatusOK, map[string]int{"accepted": accepted, "total": len(events)})
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func parseEvents(raw json.RawMessage) ([]event.EventPayload, error) {
	// Try array first
	var batch []event.EventPayload
	if err := json.Unmarshal(raw, &batch); err == nil {
		return batch, nil
	}

	// Fallback: single object
	var single event.EventPayload
	if err := json.Unmarshal(raw, &single); err != nil {
		return nil, err
	}
	return []event.EventPayload{single}, nil
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
