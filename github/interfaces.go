// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"time"

	"github.com/google/go-github/v72/github"
)

// SessionManager defines the interface for creating and validating GitHub sessions.
// Provides abstraction for session lifecycle management with pluggable validation
// and HTTP client configuration for different deployment environments.
type SessionManager interface {
	CreateSession(token string, config *SessionConfig) GitHubSessionInterface
	ValidateSession(session GitHubSessionInterface) error
}

// GitHubSessionInterface defines the complete interface for GitHub session operations.
// Provides access to session metadata, event channels, rate limiting, and lifecycle
// management while maintaining abstraction from concrete implementation details.
type GitHubSessionInterface interface {
	GetID() string
	GetToken() string
	// GetClient() *github.Client // Removed to avoid coupling
	GetMetadata() *SessionMetadata
	GetEventChannels() *EventChannels
	GetRateLimit() *RateLimitInfo
	Initialize(ctx context.Context) error
	IsActive() bool
	Close() error
	UpdateActivity()
	IncrementRequestCount()
	IncrementErrorCount()
	SetCustomMetadata(key string, value interface{})
	GetCustomMetadata(key string) (interface{}, bool)
	WaitForRateLimit(ctx context.Context) error
	String() string
}

// EventChannelManager defines the interface for creating and managing event channels.
// Abstracts event channel creation and provides safe event sending with error handling
// for different event types (events, errors) in the GitHub service.
type EventChannelManager interface {
	CreateEventChannels(bufferSize int) *EventChannels
	SendEvent(channels *EventChannels, event Event) error
	SendError(channels *EventChannels, err GitHubError) error
}

// MetricsCollector defines the interface for collecting operational metrics from
// GitHub API operations. Supports recording API call performance, error rates,
// rate limit usage, and session activity for monitoring and observability.
type MetricsCollector interface {
	RecordAPICall(operation string, duration time.Duration, statusCode int)
	RecordError(operation string, errorType string)
	RecordRateLimit(remaining, limit int)
	RecordSessionActivity(sessionID string, requestCount, errorCount int64)
}

// HTTPClientProvider defines the interface for creating configured GitHub HTTP clients.
// Abstracts client creation with token authentication and custom configuration
// to support different HTTP client implementations and middleware.
type HTTPClientProvider interface {
	GetClient(token string) *github.Client
	GetClientWithConfig(token string, config *SessionConfig) *github.Client
}

// RequestHandlerInterface defines the interface for handling GitHub API requests
// with event reporting, progress tracking, and repository context management.
// Provides abstraction for different request handling implementations.
type RequestHandlerInterface interface {
	SendStartEvent(message string)
	SendProgressEvent(message string, current, total int)
	SendCompleteEvent(message string)
	HandleResponse(resp *github.Response, err error, operation string) error
	WithRepository(owner, repo string) RequestHandlerInterface
}

// ValidationService defines the interface for validating GitHub-related inputs.
// Provides comprehensive validation for tokens, identifiers, repository paths,
// and operation names to ensure security and API compatibility.
type ValidationService interface {
	ValidateGitHubIdentifier(identifier, fieldName string) error
	ValidateRepositoryPath(owner, repo string) error
	ValidateToken(token string) error
	ValidateOperation(operation string) error
}

// DefaultSessionManager is the production implementation of SessionManager
// with dependency injection for HTTP client providers, validation services,
// and logging. Provides comprehensive session creation with security validation.
type DefaultSessionManager struct {
	httpClientProvider HTTPClientProvider
	validationService  ValidationService
	logger             Logger
}

// NewDefaultSessionManager creates a production-ready session manager with
// injected dependencies. Combines HTTP client provider, validation service,
// and logger for comprehensive session management capabilities.
func NewDefaultSessionManager(
	httpClientProvider HTTPClientProvider,
	validationService ValidationService,
	logger Logger,
) *DefaultSessionManager {
	return &DefaultSessionManager{
		httpClientProvider: httpClientProvider,
		validationService:  validationService,
		logger:             logger,
	}
}

// CreateSession creates a new GitHub session with comprehensive validation.
// Validates the provided token, creates an HTTP client, and initializes
// session metadata. Returns nil if validation fails or session creation errors.
func (sm *DefaultSessionManager) CreateSession(token string, config *SessionConfig) GitHubSessionInterface {
	// Validate token
	if err := sm.validationService.ValidateToken(token); err != nil {
		sm.logger.Error("Invalid token provided", ErrorField(err))
		return nil
	}

	// Create HTTP client
	client := sm.httpClientProvider.GetClientWithConfig(token, config)
	if client == nil {
		sm.logger.Error("Failed to create HTTP client")
		return nil
	}

	// Create session
	session := NewGitHubSession(token, config)
	if session == nil {
		sm.logger.Error("Failed to create session")
		return nil
	}

	// Override client with the one from provider
	session.Client = client

	sm.logger.Info("Session created successfully", Field("session_id", session.ID))
	return session
}

// ValidateSession performs comprehensive validation of a GitHub session.
// Ensures the session is properly initialized, active, and ready for API operations.
// Uses type assertion to work with the concrete GitHubSession implementation.
func (sm *DefaultSessionManager) ValidateSession(session GitHubSessionInterface) error {
	if concreteSession, ok := session.(*GitHubSession); ok {
		return ValidateSession(concreteSession)
	}
	return fmt.Errorf("invalid session type")
}

// DefaultHTTPClientProvider is the standard implementation of HTTPClientProvider
// that creates GitHub API clients with authentication tokens and optional
// custom HTTP client configuration for different deployment scenarios.
type DefaultHTTPClientProvider struct{}

// NewDefaultHTTPClientProvider creates a standard HTTP client provider
// suitable for most GitHub API operations. Uses the default GitHub client
// configuration with token-based authentication.
func NewDefaultHTTPClientProvider() *DefaultHTTPClientProvider {
	return &DefaultHTTPClientProvider{}
}

// GetClient creates a new GitHub API client with token authentication.
// Uses the default HTTP client configuration suitable for most applications.
// The token should be a valid GitHub personal access token or OAuth token.
func (p *DefaultHTTPClientProvider) GetClient(token string) *github.Client {
	return github.NewClient(nil).WithAuthToken(token)
}

// GetClientWithConfig creates a GitHub API client with custom configuration.
// Supports custom HTTP client injection for proxy configuration, timeouts,
// or other middleware requirements while maintaining token authentication.
func (p *DefaultHTTPClientProvider) GetClientWithConfig(token string, config *SessionConfig) *github.Client {
	if config != nil && config.CustomHTTPClient != nil {
		return github.NewClient(config.CustomHTTPClient).WithAuthToken(token)
	}
	return github.NewClient(nil).WithAuthToken(token)
}

// DefaultValidationService is the standard implementation of ValidationService
// that provides comprehensive validation for GitHub tokens, identifiers,
// and repository paths according to GitHub's API requirements and security best practices.
type DefaultValidationService struct{}

// NewDefaultValidationService creates a standard validation service with
// GitHub-compliant validation rules. Suitable for most applications requiring
// input validation for GitHub API operations.
func NewDefaultValidationService() *DefaultValidationService {
	return &DefaultValidationService{}
}

// ValidateGitHubIdentifier validates GitHub usernames, repository names, and other
// identifiers according to GitHub's naming conventions. Delegates to the utility
// function while maintaining interface compliance.
func (v *DefaultValidationService) ValidateGitHubIdentifier(identifier, fieldName string) error {
	return ValidateGitHubIdentifier(identifier, fieldName)
}

// ValidateRepositoryPath validates complete GitHub repository paths (owner/repo).
// Ensures both components meet GitHub's requirements and are safe for API operations.
// Delegates to the utility function while maintaining interface compliance.
func (v *DefaultValidationService) ValidateRepositoryPath(owner, repo string) error {
	return ValidateRepositoryPath(owner, repo)
}

// ValidateToken performs basic validation of GitHub authentication tokens.
// Checks token length and format to prevent obviously invalid tokens from
// being used in API operations. Does not verify token validity with GitHub.
func (v *DefaultValidationService) ValidateToken(token string) error {
	if token == "" {
		return fmt.Errorf("token cannot be empty")
	}
	if len(token) < 20 || len(token) > 200 {
		return fmt.Errorf("invalid token length: %d characters", len(token))
	}
	return nil
}

// ValidateOperation validates operation names used in logging and event reporting.
// Ensures operation names are reasonable length and safe for use in structured
// logging and monitoring systems.
func (v *DefaultValidationService) ValidateOperation(operation string) error {
	if operation == "" {
		return fmt.Errorf("operation cannot be empty")
	}
	if len(operation) > 100 {
		return fmt.Errorf("operation name too long: %d characters", len(operation))
	}
	return nil
}

// NoOpMetricsCollector is a metrics collector implementation that performs no operations.
// Useful for environments where metrics collection is disabled or not required,
// providing a safe default that satisfies the MetricsCollector interface.
type NoOpMetricsCollector struct{}

// NewNoOpMetricsCollector creates a metrics collector that discards all metrics.
// Suitable for development environments or deployments where metrics collection
// is not needed but the interface must be satisfied.
func NewNoOpMetricsCollector() *NoOpMetricsCollector {
	return &NoOpMetricsCollector{}
}

// RecordAPICall records API call metrics (no-op implementation).
// In a real metrics collector, this would record operation duration,
// status codes, and other performance metrics.
func (m *NoOpMetricsCollector) RecordAPICall(operation string, duration time.Duration, statusCode int) {
	// No-op
}

// RecordError records error metrics (no-op implementation).
// In a real metrics collector, this would record error types,
// frequencies, and operation context for monitoring.
func (m *NoOpMetricsCollector) RecordError(operation string, errorType string) {
	// No-op
}

// RecordRateLimit records rate limit metrics (no-op implementation).
// In a real metrics collector, this would track rate limit usage
// and remaining quota for capacity planning.
func (m *NoOpMetricsCollector) RecordRateLimit(remaining, limit int) {
	// No-op
}

// RecordSessionActivity records session usage metrics (no-op implementation).
// In a real metrics collector, this would track session duration,
// request counts, and error rates for user activity monitoring.
func (m *NoOpMetricsCollector) RecordSessionActivity(sessionID string, requestCount, errorCount int64) {
	// No-op
}
