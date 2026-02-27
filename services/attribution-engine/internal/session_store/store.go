package session_store

import (
	"sync"
	"time"

	"github.com/platform/attribution-engine/internal/attribution"
)

// Session holds the in-flight state for an active user session.
type Session struct {
	ID          string
	ProjectID   string
	VisitorID   string
	StartedAt   time.Time
	LastSeen    time.Time
	PageCount   int
	EntryPage   string
	CurrentPage string
	Touchpoints []attribution.Touchpoint
}

// Store is a thread-safe in-memory session store.
// For production, replace with Redis or RocksDB for durability.
type Store struct {
	mu       sync.RWMutex
	sessions map[string]*Session // key: session_id
	ttl      time.Duration
}

func NewStore(ttl time.Duration) *Store {
	s := &Store{
		sessions: make(map[string]*Session),
		ttl:      ttl,
	}
	// Start background cleanup goroutine
	go s.cleanup()
	return s
}

func (s *Store) GetOrCreate(sessionID, projectID, visitorID, entryPage string, startedAt time.Time) *Session {
	s.mu.Lock()
	defer s.mu.Unlock()

	if sess, ok := s.sessions[sessionID]; ok {
		sess.LastSeen = time.Now()
		return sess
	}

	sess := &Session{
		ID:        sessionID,
		ProjectID: projectID,
		VisitorID: visitorID,
		StartedAt: startedAt,
		LastSeen:  time.Now(),
		EntryPage: entryPage,
	}
	s.sessions[sessionID] = sess
	return sess
}

func (s *Store) Get(sessionID string) (*Session, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sess, ok := s.sessions[sessionID]
	return sess, ok
}

func (s *Store) Update(sess *Session) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessions[sess.ID] = sess
}

func (s *Store) Delete(sessionID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.sessions, sessionID)
}

func (s *Store) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		s.mu.Lock()
		cutoff := time.Now().Add(-s.ttl)
		for id, sess := range s.sessions {
			if sess.LastSeen.Before(cutoff) {
				delete(s.sessions, id)
			}
		}
		s.mu.Unlock()
	}
}
