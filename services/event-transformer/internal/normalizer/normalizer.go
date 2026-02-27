package normalizer

import (
	"net/url"
	"strings"
	"time"
)

// RawEvent mirrors the JSON coming off the raw_events Kafka topic.
type RawEvent struct {
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
	EdgeCountry  string                 `json:"edge_country"`
	EdgeCity     string                 `json:"edge_city"`
	ReceivedAt   time.Time              `json:"received_at"`
}

type UTMParams struct {
	Source   string `json:"source"`
	Medium   string `json:"medium"`
	Campaign string `json:"campaign"`
	Term     string `json:"term"`
	Content  string `json:"content"`
}

// NormalizedEvent is the cleaned output ready for enrichment.
type NormalizedEvent struct {
	RawEvent
	PagePath   string `json:"page_path"`
	PageDomain string `json:"page_domain"`
	Normalized bool   `json:"normalized"`
}

// NormalizeEvent cleans and normalizes a raw event.
func NormalizeEvent(raw *RawEvent) (*NormalizedEvent, error) {
	norm := &NormalizedEvent{
		RawEvent:  *raw,
		Normalized: true,
	}

	// Normalize URL
	if raw.PageURL != "" {
		u, err := url.Parse(raw.PageURL)
		if err == nil {
			norm.PagePath = u.Path
			norm.PageDomain = u.Hostname()
			// Strip tracking params from stored URL for privacy
			q := u.Query()
			for _, param := range []string{"fbclid", "gclid", "msclkid", "_ga", "mc_eid"} {
				q.Del(param)
			}
			u.RawQuery = q.Encode()
			norm.PageURL = u.String()
		}
	}

	// Normalize referrer: strip same-domain referrers
	if raw.Referrer != "" {
		refURL, err := url.Parse(raw.Referrer)
		if err == nil && refURL.Hostname() == norm.PageDomain {
			norm.Referrer = "" // internal navigation
		}
	}

	// Normalize UTM values to lowercase
	norm.UTM.Source = strings.ToLower(strings.TrimSpace(raw.UTM.Source))
	norm.UTM.Medium = strings.ToLower(strings.TrimSpace(raw.UTM.Medium))
	norm.UTM.Campaign = strings.ToLower(strings.TrimSpace(raw.UTM.Campaign))

	// Normalize event type
	norm.EventType = strings.ToLower(strings.TrimSpace(raw.EventType))

	return norm, nil
}
