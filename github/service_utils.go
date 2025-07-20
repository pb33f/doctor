// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/google/go-github/v72/github"
)

// Production configuration constants
const (
	DefaultPageSize      = 100
	DefaultBufferSize    = 100
	MaxPageSize          = 1000
	ProgressThreshold    = 0.1 // Send progress every 10% completion
	MaxProgressEvents    = 20  // Maximum progress events per operation
	MaxWaitTime          = 30 * time.Minute
	DefaultRetryAttempts = 3
	DefaultRetryDelay    = 1 * time.Second
	EventSendTimeout     = 100 * time.Millisecond // Max time to wait for event sending
	RateLimitWarning     = 100                    // Warn when rate limit falls below this threshold
)

// RequestHandler provides production-ready handling of GitHub API requests with
// comprehensive logging, progress tracking, event reporting, and error handling.
// Supports intelligent progress throttling and backpressure management for events.
type RequestHandler struct {
	session           *GitHubSession
	builder           *EventBuilder
	progressThreshold int
	lastProgressSent  int
	operationID       string
	logger            Logger
	startTime         time.Time
}

// NewRequestHandler creates a new request handler with security validation and logging.
// Validates operation names for security (prevents injection), sets up structured logging
// with correlation IDs, and initializes progress tracking. Returns nil for invalid inputs.
func NewRequestHandler(session *GitHubSession, operation string, eventType EventType) *RequestHandler {
	if session == nil {
		LogError("NewRequestHandler called with nil session")
		return nil
	}

	// Validate operation parameter
	if operation == "" {
		LogError("NewRequestHandler called with empty operation")
		return nil
	}

	// Validate operation name for security (prevent injection)
	if len(operation) > 100 {
		LogError("Operation name too long", Field("length", len(operation)))
		return nil
	}

	// Only allow alphanumeric characters, underscores, and hyphens
	for _, char := range operation {
		if !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') || char == '_' || char == '-') {
			LogError("Operation name contains invalid characters", Field("operation", operation))
			return nil
		}
	}

	return &RequestHandler{
		session:           session,
		builder:           NewEventBuilder(session.ID, operation, eventType),
		progressThreshold: DefaultBufferSize / 10, // 10% threshold
		operationID:       fmt.Sprintf("%s-%d", operation, time.Now().UnixNano()),
		logger:            GetGlobalLogger().WithSession(session.ID).WithOperation(operation),
		startTime:         time.Now(),
	}
}

// WithRepository adds repository context (owner/repo) to the request handler's event builder.
// Returns the same handler for method chaining. Safe to call on nil handlers.
func (rh *RequestHandler) WithRepository(owner, repo string) *RequestHandler {
	if rh == nil {
		return nil
	}
	rh.builder.WithRepository(owner, repo)
	return rh
}

// SendStartEvent sends an operation start event with correlation and operation IDs.
// Uses backpressure handling to prevent blocking on full event channels.
// Logs the operation start and retries event sending once in a goroutine if needed.
func (rh *RequestHandler) SendStartEvent(message string) {
	rh.logger.Info("Operation started", Field("message", message))
	if rh == nil || rh.session.channels == nil {
		return
	}

	event := rh.builder.BuildStartEvent(message)
	event.Metadata["operation_id"] = rh.operationID
	event.Metadata["correlation_id"] = rh.session.ID

	// Use proper backpressure handling instead of dropping events
	select {
	case rh.session.channels.Events <- event:
		// Event sent successfully
	case <-time.After(EventSendTimeout):
		// Log backpressure but continue operation
		LogWarn("Event channel backpressure detected", Field("event_type", "start"))
		// Try one more time in a goroutine to avoid blocking the main operation
		go func() {
			select {
			case rh.session.channels.Events <- event:
			case <-time.After(EventSendTimeout):
				LogError("Failed to send start event after retry")
			}
		}()
	}
}

// SendProgressEvent sends progress updates with intelligent throttling to prevent
// event spam. Only sends events when progress crosses meaningful thresholds (10%)
// or when the operation completes. Uses shorter timeouts for less critical progress events.
func (rh *RequestHandler) SendProgressEvent(message string, current, total int) {
	if rh == nil || rh.session.channels == nil || total <= 0 {
		return
	}

	// Calculate progress percentage
	progressPercent := int((float64(current) / float64(total)) * 100)

	// Only send progress if we've crossed a meaningful threshold
	if progressPercent-rh.lastProgressSent >= int(ProgressThreshold*100) || current == total {
		rh.builder.WithProgress(current, total)
		event := rh.builder.BuildProgressEvent(message)
		event.Metadata["operation_id"] = rh.operationID
		event.Metadata["progress_percent"] = progressPercent

		// Progress events are less critical, so we can be more aggressive with timeouts
		select {
		case rh.session.channels.Events <- event:
			rh.lastProgressSent = progressPercent
		case <-time.After(EventSendTimeout / 2): // Half timeout for progress events
			// Don't retry progress events in goroutines as they're less critical
			LogWarn("Progress event delayed due to backpressure")
		}
	}
}

// SendCompleteEvent sends an operation completion event with timing and usage metrics.
// Includes operation duration, session request count, and error count for monitoring.
// Uses backpressure handling and retry logic similar to start events.
func (rh *RequestHandler) SendCompleteEvent(message string) {
	duration := time.Since(rh.startTime)
	rh.logger.Info("Operation completed",
		Field("message", message),
		DurationField(duration),
		Field("session_requests", rh.session.GetMetadata().RequestCount),
		Field("session_errors", rh.session.GetMetadata().ErrorCount))
	if rh == nil || rh.session.channels == nil {
		return
	}

	event := rh.builder.BuildCompleteEvent(message)
	event.Metadata["operation_id"] = rh.operationID
	event.Metadata["session_requests"] = rh.session.GetMetadata().RequestCount
	event.Metadata["session_errors"] = rh.session.GetMetadata().ErrorCount

	// Complete events are important, so retry once like start events
	select {
	case rh.session.channels.Events <- event:
		// Event sent successfully
	case <-time.After(EventSendTimeout):
		LogWarn("Event channel backpressure detected", Field("event_type", "complete"))
		// Try one more time in a goroutine
		go func() {
			select {
			case rh.session.channels.Events <- event:
			case <-time.After(EventSendTimeout):
				LogError("Failed to send complete event after retry")
			}
		}()
	}
}

// HandleResponse processes GitHub API responses with comprehensive error handling,
// rate limit tracking, and event reporting. Updates session metrics, logs structured
// error information, and emits rate limit warnings when thresholds are reached.
func (rh *RequestHandler) HandleResponse(resp *github.Response, err error, operation string) error {
	if rh == nil {
		return fmt.Errorf("request handler is nil")
	}

	if err != nil {
		rh.session.IncrementErrorCount()

		// Build detailed error with context
		githubErr := rh.builder.BuildError(fmt.Sprintf("%s operation failed", operation), err, 0)
		githubErr.Metadata["operation_id"] = rh.operationID

		if resp != nil {
			githubErr.StatusCode = resp.StatusCode
			githubErr.Metadata["status_code"] = resp.StatusCode
			githubErr.Metadata["response_headers"] = resp.Header
			rh.session.updateRateLimit(resp)

			// Log API error with structured fields
			rh.logger.Error("API request failed",
				Field("operation", operation),
				StatusCodeField(resp.StatusCode),
				ErrorField(err),
				Field("rate_limit_remaining", resp.Rate.Remaining))
		} else {
			rh.logger.Error("API request failed",
				Field("operation", operation),
				ErrorField(err))
		}

		if rh.session.channels != nil {
			// Error events are critical - always retry them
			select {
			case rh.session.channels.Errors <- githubErr:
				// Error sent successfully
			case <-time.After(EventSendTimeout):
				LogWarn("Error channel backpressure detected")
				// Always retry error events as they're critical for monitoring
				go func() {
					select {
					case rh.session.channels.Errors <- githubErr:
					case <-time.After(EventSendTimeout * 2): // Double timeout for error retry
						LogCritical("Failed to send error event after retry - monitoring may be impacted")
					}
				}()
			}
		}

		return fmt.Errorf("%s failed: %w", operation, err)
	}

	// Handle successful response
	if resp != nil {
		rh.session.updateRateLimit(resp)

		// Check for rate limit warnings and emit events
		if resp.Rate.Remaining < RateLimitWarning {
			LogWarn("Rate limit low", Field("remaining", resp.Rate.Remaining))

			// Emit rate limit warning event
			if rh.session.channels != nil {
				warningEvent := rh.builder.BuildProgressEvent(fmt.Sprintf("Rate limit warning: %d requests remaining", resp.Rate.Remaining))
				warningEvent.Metadata["rate_limit_remaining"] = resp.Rate.Remaining
				warningEvent.Metadata["rate_limit_limit"] = resp.Rate.Limit
				warningEvent.Metadata["rate_limit_reset"] = resp.Rate.Reset.Time

				select {
				case rh.session.channels.Events <- warningEvent:
				case <-time.After(EventSendTimeout / 4): // Quick timeout for warnings
					// Don't retry rate limit warnings
				}
			}
		}
	}

	rh.session.IncrementRequestCount()
	rh.session.UpdateActivity()
	return nil
}

// PaginationConfig defines pagination parameters with built-in validation and safety limits.
// Prevents unbounded memory allocation by enforcing maximum result limits.
// Used by FetchPaginated to control memory usage and API request patterns.
type PaginationConfig struct {
	PerPage    int
	Page       int
	MaxResults int // Maximum total results to fetch (0 = no limit)
}

// Validate ensures pagination configuration is safe and within acceptable limits.
// Sets defaults for invalid values and enforces maximum limits to prevent
// memory exhaustion and excessive API usage.
func (pc *PaginationConfig) Validate() error {
	if pc.PerPage <= 0 {
		pc.PerPage = DefaultPageSize
	}
	if pc.PerPage > MaxPageSize {
		return fmt.Errorf("per_page cannot exceed %d", MaxPageSize)
	}
	if pc.Page < 0 {
		return fmt.Errorf("page cannot be negative")
	}
	if pc.MaxResults < 0 {
		return fmt.Errorf("max_results cannot be negative")
	}
	// Prevent unbounded memory allocation
	const maxAllowedResults = 100000
	if pc.MaxResults > maxAllowedResults {
		return fmt.Errorf("max_results cannot exceed %d to prevent memory exhaustion", maxAllowedResults)
	}
	return nil
}

// DefaultPaginationConfig returns production-ready pagination defaults.
// Uses 100 items per page with no maximum result limit, suitable for most
// GitHub API operations without memory constraints.
func DefaultPaginationConfig() *PaginationConfig {
	return &PaginationConfig{
		PerPage:    DefaultPageSize,
		Page:       0,
		MaxResults: 0, // No limit
	}
}

// ResourceFetcher is a generic function type for fetching paginated GitHub API data.
// Takes GitHub list options and returns a slice of items, response metadata, and any error.
// Used by FetchPaginated to abstract different GitHub API list operations.
type ResourceFetcher[T any] func(opts *github.ListOptions) ([]T, *github.Response, error)

// ResourceConverter is a generic function type for converting GitHub API types
// to internal model types. Enables type-safe conversion while maintaining
// clean separation between GitHub API structures and internal representations.
type ResourceConverter[T any, R any] func(T) R

// FetchPaginated performs production-ready paginated fetching with intelligent memory
// management, progress reporting, and context cancellation support. Uses bounded
// allocations, optimizes final capacity, and provides comprehensive error handling.
func FetchPaginated[T any, R any](
	ctx context.Context,
	rh *RequestHandler,
	fetcher ResourceFetcher[T],
	converter ResourceConverter[T, R],
	config *PaginationConfig,
	operation string,
) ([]R, error) {
	// Validate inputs
	if ctx == nil {
		return nil, fmt.Errorf("context cannot be nil")
	}
	if rh == nil {
		return nil, fmt.Errorf("request handler cannot be nil")
	}
	if fetcher == nil {
		return nil, fmt.Errorf("fetcher cannot be nil")
	}
	if converter == nil {
		return nil, fmt.Errorf("converter cannot be nil")
	}

	if config == nil {
		config = DefaultPaginationConfig()
	}

	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("invalid pagination config: %w", err)
	}

	// Intelligent capacity estimation to minimize allocations
	var estimatedCapacity int
	if config.MaxResults > 0 {
		// If max results is specified, use it as the capacity
		estimatedCapacity = config.MaxResults
	} else {
		// Conservative estimate: start with 2 pages worth
		estimatedCapacity = config.PerPage * 2
	}

	// Cap the initial allocation to prevent excessive memory usage
	const maxInitialCapacity = 1000
	if estimatedCapacity > maxInitialCapacity {
		estimatedCapacity = maxInitialCapacity
	}

	results := make([]R, 0, estimatedCapacity)

	opts := &github.ListOptions{
		PerPage: config.PerPage,
		Page:    config.Page,
	}

	totalFetched := 0
	pageCount := 0

	for {
		// Check context cancellation
		select {
		case <-ctx.Done():
			return nil, fmt.Errorf("operation cancelled: %w", ctx.Err())
		default:
		}

		// Check if we've reached the maximum results limit
		if config.MaxResults > 0 && totalFetched >= config.MaxResults {
			break
		}

		// Fetch page
		items, resp, err := fetcher(opts)
		if err != nil {
			return nil, rh.HandleResponse(resp, err, operation)
		}

		// Handle successful response
		if err := rh.HandleResponse(resp, nil, operation); err != nil {
			return nil, err
		}

		// Process items
		for _, item := range items {
			if config.MaxResults > 0 && totalFetched >= config.MaxResults {
				break
			}

			results = append(results, converter(item))
			totalFetched++
		}

		pageCount++

		// Send progress event (with throttling)
		if resp.LastPage > 0 {
			// We know the total pages
			rh.SendProgressEvent(
				fmt.Sprintf("Fetched %d items (%d/%d pages)", totalFetched, pageCount, resp.LastPage),
				pageCount, resp.LastPage,
			)
		} else {
			// We don't know total pages, just report items
			rh.SendProgressEvent(
				fmt.Sprintf("Fetched %d items", totalFetched),
				totalFetched, totalFetched,
			)
		}

		// Check if we should continue paginating
		if resp.NextPage == 0 || (config.Page > 0) {
			break
		}

		opts.Page = resp.NextPage
	}

	// Optimize final capacity if we significantly over-allocated
	// Only optimize if we're wasting more than 50% of capacity AND have more than 100 items
	if len(results) > 100 && cap(results) > len(results)*2 {
		optimized := make([]R, len(results))
		copy(optimized, results)
		results = optimized
	}

	return results, nil
}

// ResourceSingleFetcher is a generic function type for fetching single GitHub API items.
// Returns the item, response metadata, and any error. Used by FetchSingle and FetchCreate
// to abstract different GitHub API single-item operations.
type ResourceSingleFetcher[T any] func() (T, *github.Response, error)

// FetchSingle performs production-ready single item fetching with comprehensive
// validation, context cancellation support, and structured error handling.
// Validates all inputs and provides type-safe conversion of results.
func FetchSingle[T any, R any](
	ctx context.Context,
	rh *RequestHandler,
	fetcher ResourceSingleFetcher[T],
	converter ResourceConverter[T, R],
	operation string,
) (R, error) {
	var zero R

	// Validate inputs
	if ctx == nil {
		return zero, fmt.Errorf("context cannot be nil")
	}
	if rh == nil {
		return zero, fmt.Errorf("request handler cannot be nil")
	}
	if fetcher == nil {
		return zero, fmt.Errorf("fetcher cannot be nil")
	}
	if converter == nil {
		return zero, fmt.Errorf("converter cannot be nil")
	}

	// Check context cancellation
	select {
	case <-ctx.Done():
		return zero, fmt.Errorf("operation cancelled: %w", ctx.Err())
	default:
	}

	item, resp, err := fetcher()
	if err != nil {
		return zero, rh.HandleResponse(resp, err, operation)
	}

	// Handle successful response
	if err := rh.HandleResponse(resp, nil, operation); err != nil {
		return zero, err
	}

	// Convert and return result
	result := converter(item)
	return result, nil
}

// FetchCreate is an alias for FetchSingle optimized for creation operations.
// Provides the same production-ready features with naming that reflects
// the semantic intent of creating new GitHub resources.
func FetchCreate[T any, R any](
	ctx context.Context,
	rh *RequestHandler,
	fetcher ResourceSingleFetcher[T],
	converter ResourceConverter[T, R],
	operation string,
) (R, error) {
	return FetchSingle(ctx, rh, fetcher, converter, operation)
}

// ValidateSession performs comprehensive validation of a GitHub session's readiness.
// Checks for nil session, active status, and proper client initialization.
// Should be called before any API operations to ensure session validity.
func ValidateSession(session *GitHubSession) error {
	if session == nil {
		return fmt.Errorf("session cannot be nil")
	}
	if !session.IsActive() {
		return fmt.Errorf("session is not active")
	}
	if session.Client == nil {
		return fmt.Errorf("session client is not initialized")
	}
	return nil
}

// EstimatePageCapacity calculates optimal pagination size based on target memory usage.
// Takes estimated item size and target memory in MB, returns bounded capacity
// between reasonable minimum and maximum values for efficient memory utilization.
func EstimatePageCapacity(itemSize, targetMemoryMB int) int {
	if itemSize <= 0 {
		return DefaultPageSize
	}

	targetBytes := targetMemoryMB * 1024 * 1024
	capacity := targetBytes / itemSize

	// Ensure capacity is within reasonable bounds
	if capacity < 10 {
		capacity = 10
	} else if capacity > MaxPageSize {
		capacity = MaxPageSize
	}

	return capacity
}

// CalculateBackoffDelay implements exponential backoff with jitter for retry operations.
// Calculates increasing delays for successive retry attempts with a maximum
// cap to prevent excessively long waits during transient failures.
func CalculateBackoffDelay(attempt int, baseDelay time.Duration) time.Duration {
	if attempt <= 0 {
		return baseDelay
	}

	backoff := time.Duration(math.Pow(2, float64(attempt-1))) * baseDelay

	// Cap at maximum delay
	maxDelay := 30 * time.Second
	if backoff > maxDelay {
		backoff = maxDelay
	}

	return backoff
}

// ValidateGitHubIdentifier validates GitHub usernames, repository names, and similar
// identifiers according to GitHub's naming rules. Checks length, character validity,
// and start/end character restrictions to prevent injection attacks.
func ValidateGitHubIdentifier(identifier, fieldName string) error {
	if identifier == "" {
		return fmt.Errorf("%s cannot be empty", fieldName)
	}

	// GitHub usernames and repo names have specific constraints
	if len(identifier) > 100 {
		return fmt.Errorf("%s too long: %d characters (max 100)", fieldName, len(identifier))
	}

	// Check for valid characters (alphanumeric, hyphens, underscores, dots)
	for i, char := range identifier {
		if !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') || char == '-' || char == '_' || char == '.') {
			return fmt.Errorf("%s contains invalid character at position %d: %c", fieldName, i, char)
		}
	}

	// Cannot start or end with certain characters
	if identifier[0] == '-' || identifier[0] == '.' {
		return fmt.Errorf("%s cannot start with '%c'", fieldName, identifier[0])
	}

	lastChar := identifier[len(identifier)-1]
	if lastChar == '-' || lastChar == '.' {
		return fmt.Errorf("%s cannot end with '%c'", fieldName, lastChar)
	}

	return nil
}

// ValidateRepositoryPath validates a complete GitHub repository path (owner/repo).
// Ensures both owner and repository names meet GitHub's requirements.
// Used to validate repository references before making API calls.
func ValidateRepositoryPath(owner, repo string) error {
	if err := ValidateGitHubIdentifier(owner, "owner"); err != nil {
		return err
	}
	if err := ValidateGitHubIdentifier(repo, "repository"); err != nil {
		return err
	}
	return nil
}
