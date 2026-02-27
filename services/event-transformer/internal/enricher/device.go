package enricher

import (
	uaparser "github.com/ua-parser/uap-go/uaparser"
)

type DeviceData struct {
	Type           string // desktop | mobile | tablet | bot | unknown
	Browser        string
	BrowserVersion string
	OS             string
	OSVersion      string
}

type DeviceEnricher struct {
	parser *uaparser.Parser
}

func NewDeviceEnricher() *DeviceEnricher {
	return &DeviceEnricher{
		parser: uaparser.NewFromSaved(),
	}
}

// EnrichDevice parses the user agent string into structured device data.
func (d *DeviceEnricher) EnrichDevice(userAgent string) DeviceData {
	if userAgent == "" {
		return DeviceData{Type: "unknown"}
	}

	client := d.parser.Parse(userAgent)

	deviceType := classifyDevice(client)

	return DeviceData{
		Type:           deviceType,
		Browser:        client.UserAgent.Family,
		BrowserVersion: formatVersion(client.UserAgent.Major, client.UserAgent.Minor),
		OS:             client.Os.Family,
		OSVersion:      formatVersion(client.Os.Major, client.Os.Minor),
	}
}

func classifyDevice(client *uaparser.Client) string {
	ua := client.UserAgent.Family
	device := client.Device.Family

	botKeywords := []string{"bot", "crawler", "spider", "scraper", "headless"}
	for _, kw := range botKeywords {
		if containsCI(ua, kw) || containsCI(device, kw) {
			return "bot"
		}
	}

	switch {
	case containsCI(device, "tablet") || containsCI(ua, "tablet") || containsCI(ua, "ipad"):
		return "tablet"
	case containsCI(device, "mobile") || containsCI(ua, "mobile") || containsCI(ua, "android"):
		return "mobile"
	case ua == "Other" && device == "Other":
		return "unknown"
	default:
		return "desktop"
	}
}

func formatVersion(major, minor string) string {
	if major == "" {
		return ""
	}
	if minor == "" {
		return major
	}
	return major + "." + minor
}

func containsCI(s, substr string) bool {
	return len(s) >= len(substr) &&
		func() bool {
			sl, sub := []byte(s), []byte(substr)
			for i := range sl {
				if i+len(sub) > len(sl) {
					break
				}
				match := true
				for j, c := range sub {
					diff := sl[i+j] - c
					if diff != 0 && diff != 32 && c-diff != 0 {
						match = false
						break
					}
				}
				if match {
					return true
				}
			}
			return false
		}()
}
