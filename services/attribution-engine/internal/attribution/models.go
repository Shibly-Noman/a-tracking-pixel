package attribution

import "time"

// Touchpoint represents a single marketing touchpoint in a user journey.
type Touchpoint struct {
	SessionID string
	Source    string
	Medium    string
	Campaign  string
	Timestamp time.Time
}

// AttributionModel defines how credit is distributed across touchpoints.
type AttributionModel interface {
	Attribute(touchpoints []Touchpoint, conversionValue float64) map[string]float64
}

// ─── Last Touch ──────────────────────────────────────────────────────────────

type LastTouch struct{}

func (LastTouch) Attribute(touchpoints []Touchpoint, value float64) map[string]float64 {
	result := make(map[string]float64)
	if len(touchpoints) == 0 {
		return result
	}
	last := touchpoints[len(touchpoints)-1]
	key := channelKey(last)
	result[key] = value
	return result
}

// ─── First Touch ─────────────────────────────────────────────────────────────

type FirstTouch struct{}

func (FirstTouch) Attribute(touchpoints []Touchpoint, value float64) map[string]float64 {
	result := make(map[string]float64)
	if len(touchpoints) == 0 {
		return result
	}
	first := touchpoints[0]
	key := channelKey(first)
	result[key] = value
	return result
}

// ─── Linear ──────────────────────────────────────────────────────────────────

type Linear struct{}

func (Linear) Attribute(touchpoints []Touchpoint, value float64) map[string]float64 {
	result := make(map[string]float64)
	if len(touchpoints) == 0 {
		return result
	}
	share := value / float64(len(touchpoints))
	for _, tp := range touchpoints {
		result[channelKey(tp)] += share
	}
	return result
}

// ─── Time Decay ───────────────────────────────────────────────────────────────

type TimeDecay struct {
	HalfLifeDays float64 // default 7
}

func (td TimeDecay) Attribute(touchpoints []Touchpoint, value float64) map[string]float64 {
	result := make(map[string]float64)
	if len(touchpoints) == 0 {
		return result
	}

	halfLife := td.HalfLifeDays
	if halfLife <= 0 {
		halfLife = 7
	}

	// Use the last touchpoint as the reference time (closest to conversion)
	ref := touchpoints[len(touchpoints)-1].Timestamp
	weights := make([]float64, len(touchpoints))
	totalWeight := 0.0

	for i, tp := range touchpoints {
		daysDiff := ref.Sub(tp.Timestamp).Hours() / 24
		// Weight decays exponentially: w = 2^(-days/halfLife)
		w := 1.0
		for d := 0.0; d < daysDiff; d += halfLife {
			w *= 0.5
		}
		weights[i] = w
		totalWeight += w
	}

	if totalWeight == 0 {
		return result
	}

	for i, tp := range touchpoints {
		credit := (weights[i] / totalWeight) * value
		result[channelKey(tp)] += credit
	}
	return result
}

// ─── Factory ─────────────────────────────────────────────────────────────────

func NewModel(name string) AttributionModel {
	switch name {
	case "first_touch":
		return FirstTouch{}
	case "linear":
		return Linear{}
	case "time_decay":
		return TimeDecay{HalfLifeDays: 7}
	default: // last_touch
		return LastTouch{}
	}
}

func channelKey(tp Touchpoint) string {
	if tp.Source == "" {
		return "direct"
	}
	if tp.Medium != "" {
		return tp.Source + "/" + tp.Medium
	}
	return tp.Source
}
