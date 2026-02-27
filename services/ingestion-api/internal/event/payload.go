package event

import (
	"errors"
	"time"
)

// EventPayload represents a raw event received from the edge worker.
type EventPayload struct {
	EventID      string                 `json:"event_id"`
	ProjectID    string                 `json:"project_id"`
	EventType    string                 `json:"event_type"`
	Timestamp    time.Time              `json:"timestamp"`
	PageURL      string                 `json:"page_url"`
	Referrer     string                 `json:"referrer"`
	UserAgent    string                 `json:"user_agent"`
	SessionID    string                 `json:"session_id"`
	IPHash       string                 `json:"ip_hash"`
	Properties   map[string]interface{} `json:"properties"`
	UTM          UTMParams              `json:"utm"`
	PixelVersion string                 `json:"pixel_version"`
	// Added by edge worker
	EdgeCountry string `json:"edge_country"`
	EdgeCity    string `json:"edge_city"`
	EdgeRegion  string `json:"edge_region"`
	// Added by ingestion API
	ReceivedAt time.Time `json:"received_at"`
}

type UTMParams struct {
	Source   string `json:"source"`
	Medium   string `json:"medium"`
	Campaign string `json:"campaign"`
	Term     string `json:"term"`
	Content  string `json:"content"`
}

var validEventTypes = map[string]bool{
	"page_view":     true,
	"custom_event":  true,
	"conversion":    true,
	"session_start": true,
	"session_end":   true,
}

// Validate checks the payload for required fields and constraints.
func Validate(p *EventPayload) error {
	if p.ProjectID == "" {
		return errors.New("project_id is required")
	}
	if p.EventType == "" {
		return errors.New("event_type is required")
	}
	if !validEventTypes[p.EventType] {
		return errors.New("event_type is not valid")
	}
	if p.PageURL == "" {
		return errors.New("page_url is required")
	}
	if p.Timestamp.IsZero() {
		return errors.New("timestamp is required")
	}

	// Reject events more than 1 hour in the future or 24 hours old
	now := time.Now()
	if p.Timestamp.After(now.Add(time.Hour)) {
		return errors.New("timestamp is too far in the future")
	}
	if p.Timestamp.Before(now.Add(-24 * time.Hour)) {
		return errors.New("timestamp is too old")
	}

	return nil
}
