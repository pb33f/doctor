// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/google/go-github/v72/github"
	"github.com/google/uuid"
)

// SessionMetadata contains comprehensive metadata about a GitHub session including
// user information, API usage statistics, rate limiting data, and custom fields.
// All counters are goroutine-safe when accessed through GitHubSession methods.
type SessionMetadata struct {
	UserID       int64                  `json:"user_id"`
	UserLogin    string                 `json:"user_login"`
	UserName     string                 `json:"user_name"`
	UserEmail    string                 `json:"user_email"`
	Scopes       []string               `json:"scopes"`
	RateLimit    *RateLimitInfo         `json:"rate_limit,omitempty"`
	CreatedAt    time.Time              `json:"created_at"`
	LastActivity time.Time              `json:"last_activity"`
	RequestCount int64                  `json:"request_count"`
	ErrorCount   int64                  `json:"error_count"`
	Custom       map[string]interface{} `json:"custom,omitempty"`
}

// SessionConfig defines the configuration options for creating a GitHub session.
// Includes event handling, timeouts, retry behavior, and custom HTTP client support.
// Event channels are optional and can be nil to disable event reporting.
type SessionConfig struct {
	EventChannels    *EventChannels         `json:"-"`
	EnableRateLimit  bool                   `json:"enable_rate_limit"`
	EnableMetrics    bool                   `json:"enable_metrics"`
	Timeout          time.Duration          `json:"timeout"`
	MaxRetries       int                    `json:"max_retries"`
	RetryDelay       time.Duration          `json:"retry_delay"`
	CustomHTTPClient *http.Client           `json:"-"`
	Custom           map[string]interface{} `json:"custom,omitempty"`
}

// DefaultSessionConfig returns a sensible default configuration for GitHub sessions.
// Enables rate limiting and metrics, sets 30-second timeout, and creates event channels
// with a 100-item buffer. Suitable for most production use cases.
func DefaultSessionConfig() *SessionConfig {
	return &SessionConfig{
		EventChannels:   NewEventChannels(100),
		EnableRateLimit: true,
		EnableMetrics:   true,
		Timeout:         30 * time.Second,
		MaxRetries:      3,
		RetryDelay:      1 * time.Second,
		Custom:          make(map[string]interface{}),
	}
}

// GitHubSession represents an authenticated GitHub API session with comprehensive
// metadata tracking, event reporting, and thread-safe operations. Sessions maintain
// user information, request statistics, and rate limit data throughout their lifecycle.
type GitHubSession struct {
	ID       string           `json:"id"`
	Token    string           `json:"-"` // Never serialize the token
	Client   *github.Client   `json:"-"`
	Metadata *SessionMetadata `json:"metadata"`
	Config   *SessionConfig   `json:"config"`

	// Internal state
	mutex    sync.RWMutex
	active   bool
	channels *EventChannels
}

// NewGitHubSession creates a new authenticated GitHub session with security validation.
// Validates token format, creates GitHub client, and initializes session metadata.
// Returns nil if token validation fails. Use Initialize() to fetch user information.
func NewGitHubSession(token string, config *SessionConfig) *GitHubSession {
	// Validate token
	if token == "" {
		LogError("Cannot create session with empty token")
		return nil
	}

	// Basic token format validation (GitHub tokens have specific patterns)
	if len(token) < 20 || len(token) > 200 {
		LogError("Invalid token length", Field("length", len(token)))
		return nil
	}

	// Check for suspicious patterns that might indicate injection attempts
	for _, char := range token {
		if char < 32 || char > 126 { // Only printable ASCII
			LogError("Token contains invalid characters")
			return nil
		}
	}

	if config == nil {
		config = DefaultSessionConfig()
	}

	sessionID := uuid.New().String()

	// Create HTTP client with token
	var client *github.Client
	if config.CustomHTTPClient != nil {
		client = github.NewClient(config.CustomHTTPClient).WithAuthToken(token)
	} else {
		client = github.NewClient(nil).WithAuthToken(token)
	}

	session := &GitHubSession{
		ID:     sessionID,
		Token:  token,
		Client: client,
		Metadata: &SessionMetadata{
			Scopes:       []string{},
			CreatedAt:    time.Now(),
			LastActivity: time.Now(),
			RequestCount: 0,
			ErrorCount:   0,
			Custom:       make(map[string]interface{}),
		},
		Config:   config,
		active:   true,
		channels: config.EventChannels,
	}

	return session
}

// Initialize fetches the authenticated user's information from GitHub and validates
// the provided token. This method should be called after NewGitHubSession to complete
// session setup. Returns error if token is invalid or API call fails.
func (s *GitHubSession) Initialize(ctx context.Context) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if !s.active {
		return fmt.Errorf("session %s is not active", s.ID)
	}

	// Create event builder for initialization
	eb := NewEventBuilder(s.ID, "session_initialize", EventTypeAuthUser)

	// Send start event
	if s.channels != nil {
		s.channels.Events <- eb.BuildStartEvent("Initializing GitHub session")
	}

	// Fetch user information
	user, resp, err := s.Client.Users.Get(ctx, "")
	if err != nil {
		githubErr := eb.BuildError("Failed to fetch user information", err, 0)
		if resp != nil {
			githubErr.StatusCode = resp.StatusCode
		}
		if s.channels != nil {
			s.channels.Errors <- githubErr
		}
		s.Metadata.ErrorCount++
		return fmt.Errorf("failed to initialize session: %w", err)
	}

	// Update metadata with user information
	if user.ID != nil {
		s.Metadata.UserID = *user.ID
	}
	if user.Login != nil {
		s.Metadata.UserLogin = *user.Login
	}
	if user.Name != nil {
		s.Metadata.UserName = *user.Name
	}
	if user.Email != nil {
		s.Metadata.UserEmail = *user.Email
	}

	// Update rate limit information
	if resp != nil {
		s.updateRateLimit(resp)
	}

	s.Metadata.RequestCount++
	s.Metadata.LastActivity = time.Now()

	// Send completion event
	if s.channels != nil {
		s.channels.Events <- eb.BuildCompleteEvent(fmt.Sprintf("Session initialized for user %s", s.Metadata.UserLogin))
	}

	return nil
}

// GetID returns the unique session identifier.
// This method is goroutine-safe.
func (s *GitHubSession) GetID() string {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.ID
}

// GetToken returns the GitHub authentication token for this session.
// This method is goroutine-safe. Never log or expose the returned token.
func (s *GitHubSession) GetToken() string {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.Token
}

// GetMetadata returns a deep copy of the session metadata to prevent race conditions.
// The returned metadata is safe to read and modify without affecting the original.
// Custom metadata map is also deep-copied for complete isolation.
func (s *GitHubSession) GetMetadata() *SessionMetadata {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	// Create a deep copy to avoid race conditions
	metadata := *s.Metadata

	// Deep copy the custom metadata map
	if s.Metadata.Custom != nil {
		metadata.Custom = make(map[string]interface{}, len(s.Metadata.Custom))
		for k, v := range s.Metadata.Custom {
			metadata.Custom[k] = v
		}
	} else {
		metadata.Custom = make(map[string]interface{})
	}

	// Deep copy rate limit info if it exists
	if s.Metadata.RateLimit != nil {
		metadata.RateLimit = &RateLimitInfo{
			Limit:     s.Metadata.RateLimit.Limit,
			Remaining: s.Metadata.RateLimit.Remaining,
			Reset:     s.Metadata.RateLimit.Reset,
		}
	}

	return &metadata
}

// SetCustomMetadata sets a custom key-value pair in the session metadata.
// This method is goroutine-safe and can be called concurrently.
func (s *GitHubSession) SetCustomMetadata(key string, value interface{}) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Metadata.Custom[key] = value
}

// GetCustomMetadata retrieves a custom metadata value by key.
// Returns the value and a boolean indicating if the key exists.
// This method is goroutine-safe.
func (s *GitHubSession) GetCustomMetadata(key string) (interface{}, bool) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	value, exists := s.Metadata.Custom[key]
	return value, exists
}

// UpdateActivity updates the last activity timestamp to the current time.
// Called automatically by API operations to track session usage.
// This method is goroutine-safe.
func (s *GitHubSession) UpdateActivity() {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Metadata.LastActivity = time.Now()
}

// IncrementRequestCount increments the total request counter for this session.
// Called automatically by successful API operations for usage tracking.
// This method is goroutine-safe.
func (s *GitHubSession) IncrementRequestCount() {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Metadata.RequestCount++
}

// IncrementErrorCount increments the error counter for this session.
// Called automatically when API operations fail for monitoring purposes.
// This method is goroutine-safe.
func (s *GitHubSession) IncrementErrorCount() {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Metadata.ErrorCount++
}

// IsActive returns true if the session is active and can be used for API operations.
// Returns false if the session has been closed or is in an invalid state.
// This method is goroutine-safe.
func (s *GitHubSession) IsActive() bool {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.active
}

// Close gracefully shuts down the session, sends a close event, and cleans up resources.
// Closes event channels with a timeout to prevent blocking. Once closed, the session
// cannot be reused. This method is goroutine-safe and idempotent.
func (s *GitHubSession) Close() error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if !s.active {
		return fmt.Errorf("session %s is already closed", s.ID)
	}

	s.active = false

	// Send session close event before closing channels
	if s.channels != nil {
		eb := NewEventBuilder(s.ID, "session_close", EventTypeOperationComplete)
		closeEvent := eb.BuildCompleteEvent("Session closed")

		// Try to send close event with timeout to prevent blocking
		select {
		case s.channels.Events <- closeEvent:
		case <-time.After(100 * time.Millisecond):
			// If we can't send the close event within 100ms, continue with cleanup
		}

		// Close channels after attempting to send close event
		s.channels.Close()
		s.channels = nil
	}

	// Clear other resources
	s.Client = nil
	s.Token = ""

	return nil
}

// GetEventChannels returns the event channels associated with this session.
// Returns nil if event reporting is disabled. The returned channels should not
// be closed directly - use Close() instead. This method is goroutine-safe.
func (s *GitHubSession) GetEventChannels() *EventChannels {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.channels
}

// updateRateLimit updates the session's rate limit information from a GitHub API response.
// Called automatically by request handlers to track remaining API quota.
// This method is goroutine-safe.
func (s *GitHubSession) updateRateLimit(resp *github.Response) {
	if resp == nil || resp.Rate.Limit == 0 {
		return
	}

	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Metadata.RateLimit = &RateLimitInfo{
		Limit:     resp.Rate.Limit,
		Remaining: resp.Rate.Remaining,
		Reset:     resp.Rate.Reset.Time,
	}
}

// GetRateLimit returns a copy of the current rate limit information.
// Returns nil if no rate limit data is available. The returned data is safe
// to read and modify without affecting the session. This method is goroutine-safe.
func (s *GitHubSession) GetRateLimit() *RateLimitInfo {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	if s.Metadata.RateLimit == nil {
		return nil
	}

	// Return a copy
	return &RateLimitInfo{
		Limit:     s.Metadata.RateLimit.Limit,
		Remaining: s.Metadata.RateLimit.Remaining,
		Reset:     s.Metadata.RateLimit.Reset,
	}
}

// WaitForRateLimit blocks if the rate limit has been exceeded, waiting until
// the limit resets. Sends progress events during the wait. Returns immediately
// if rate limit allows more requests. Respects context cancellation.
func (s *GitHubSession) WaitForRateLimit(ctx context.Context) error {
	rateLimit := s.GetRateLimit()
	if rateLimit == nil || rateLimit.Remaining > 0 {
		return nil
	}

	waitTime := time.Until(rateLimit.Reset)
	if waitTime <= 0 {
		return nil
	}

	// Send rate limit event
	if s.channels != nil {
		eb := NewEventBuilder(s.ID, "rate_limit_wait", EventTypeOperationProgress)
		eb.WithMetadata("wait_time", waitTime)
		s.channels.Events <- eb.BuildProgressEvent(fmt.Sprintf("Rate limit exceeded, waiting %v", waitTime))
	}

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(waitTime):
		return nil
	}
}

// String returns a human-readable representation of the session including
// session ID, username, active status, and usage statistics.
// This method is goroutine-safe.
func (s *GitHubSession) String() string {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	return fmt.Sprintf("GitHubSession{ID: %s, User: %s, Active: %v, Requests: %d, Errors: %d}",
		s.ID, s.Metadata.UserLogin, s.active, s.Metadata.RequestCount, s.Metadata.ErrorCount)
}
