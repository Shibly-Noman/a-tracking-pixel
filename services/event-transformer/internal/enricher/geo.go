package enricher

import (
	"net"

	"github.com/oschwald/maxminddb-golang"
)

type GeoRecord struct {
	Country struct {
		ISOCode string            `maxminddb:"iso_code"`
		Names   map[string]string `maxminddb:"names"`
	} `maxminddb:"country"`
	City struct {
		Names map[string]string `maxminddb:"names"`
	} `maxminddb:"city"`
	Subdivisions []struct {
		Names map[string]string `maxminddb:"names"`
	} `maxminddb:"subdivisions"`
	Location struct {
		TimeZone string `maxminddb:"time_zone"`
	} `maxminddb:"location"`
}

type GeoData struct {
	CountryCode string
	CountryName string
	Region      string
	City        string
	Timezone    string
}

type GeoEnricher struct {
	db *maxminddb.Reader
}

func NewGeoEnricher(mmdbPath string) (*GeoEnricher, error) {
	if mmdbPath == "" {
		// Return a no-op enricher if no DB path provided (development mode)
		return &GeoEnricher{}, nil
	}
	db, err := maxminddb.Open(mmdbPath)
	if err != nil {
		return nil, err
	}
	return &GeoEnricher{db: db}, nil
}

// EnrichGeo looks up geo data for the given IP hash.
// In production, the raw IP should be passed here (before hashing).
// The raw IP is never stored; only the enriched geo fields are persisted.
func (g *GeoEnricher) EnrichGeo(ipOrHash string) GeoData {
	if g.db == nil {
		return GeoData{CountryCode: "XX", CountryName: "Unknown"}
	}

	ip := net.ParseIP(ipOrHash)
	if ip == nil {
		return GeoData{CountryCode: "XX", CountryName: "Unknown"}
	}

	var record GeoRecord
	if err := g.db.Lookup(ip, &record); err != nil {
		return GeoData{CountryCode: "XX", CountryName: "Unknown"}
	}

	data := GeoData{
		CountryCode: record.Country.ISOCode,
		CountryName: record.Country.Names["en"],
		Timezone:    record.Location.TimeZone,
		City:        record.City.Names["en"],
	}
	if len(record.Subdivisions) > 0 {
		data.Region = record.Subdivisions[0].Names["en"]
	}
	return data
}

func (g *GeoEnricher) Close() error {
	if g.db != nil {
		return g.db.Close()
	}
	return nil
}
