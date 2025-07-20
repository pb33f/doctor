// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"fmt"
	"time"
)

// EventType represents the type of GitHub operation event
type EventType string

const (
	// Repository events
	EventTypeRepositoryList EventType = "repository_list"
	EventTypeRepositoryGet  EventType = "repository_get"

	// Organization events
	EventTypeOrganizationList EventType = "organization_list"
	EventTypeOrganizationGet  EventType = "organization_get"

	// Pull request events
	EventTypePullRequestList   EventType = "pull_request_list"
	EventTypePullRequestGet    EventType = "pull_request_get"
	EventTypePullRequestCreate EventType = "pull_request_create"
	EventTypePullRequestMerge  EventType = "pull_request_merge"

	// Comment events
	EventTypeCommentAdd  EventType = "comment_add"
	EventTypeCommentEdit EventType = "comment_edit"
	EventTypeCommentGet  EventType = "comment_get"

	// Commit events
	EventTypeCommitList EventType = "commit_list"
	EventTypeCommitGet  EventType = "commit_get"

	// File events
	EventTypeFileGet        EventType = "file_get"
	EventTypeFileGetContent EventType = "file_get_content"

	// Tag events
	EventTypeTagCreate EventType = "tag_create"
	EventTypeTagList   EventType = "tag_list"

	// Authentication events
	EventTypeAuthUser EventType = "auth_user"

	// General events
	EventTypeOperationStart    EventType = "operation_start"
	EventTypeOperationComplete EventType = "operation_complete"
	EventTypeOperationProgress EventType = "operation_progress"
)

// EventStatus represents the status of an operation
type EventStatus string

const (
	EventStatusStarted    EventStatus = "started"
	EventStatusInProgress EventStatus = "in_progress"
	EventStatusCompleted  EventStatus = "completed"
	EventStatusFailed     EventStatus = "failed"
)

// Event represents a GitHub service event with metadata
type Event struct {
	ID         string                 `json:"id"`
	Type       EventType              `json:"type"`
	Status     EventStatus            `json:"status"`
	Message    string                 `json:"message"`
	SessionID  string                 `json:"session_id"`
	Repository string                 `json:"repository,omitempty"`
	Owner      string                 `json:"owner,omitempty"`
	Operation  string                 `json:"operation"`
	Timestamp  time.Time              `json:"timestamp"`
	Duration   time.Duration          `json:"duration,omitempty"`
	Metadata   map[string]interface{} `json:"metadata,omitempty"`
	Progress   *ProgressInfo          `json:"progress,omitempty"`
	RateLimit  *RateLimitInfo         `json:"rate_limit,omitempty"`
}

// ProgressInfo represents progress information for long-running operations
type ProgressInfo struct {
	Current int `json:"current"`
	Total   int `json:"total"`
	Percent int `json:"percent"`
}

// RateLimitInfo represents GitHub API rate limit information
type RateLimitInfo struct {
	Limit     int       `json:"limit"`
	Remaining int       `json:"remaining"`
	Reset     time.Time `json:"reset"`
}

// GitHubError represents a GitHub service error with context
type GitHubError struct {
	ID         string                 `json:"id"`
	Type       EventType              `json:"type"`
	Operation  string                 `json:"operation"`
	Message    string                 `json:"message"`
	Err        error                  `json:"error"`
	SessionID  string                 `json:"session_id"`
	Repository string                 `json:"repository,omitempty"`
	Owner      string                 `json:"owner,omitempty"`
	Timestamp  time.Time              `json:"timestamp"`
	StatusCode int                    `json:"status_code,omitempty"`
	Metadata   map[string]interface{} `json:"metadata,omitempty"`
	RateLimit  *RateLimitInfo         `json:"rate_limit,omitempty"`
}

// Error implements the error interface
func (e *GitHubError) Error() string {
	if e.Repository != "" {
		return fmt.Sprintf("GitHub %s operation failed for %s/%s: %s",
			e.Operation, e.Owner, e.Repository, e.Message)
	}
	return fmt.Sprintf("GitHub %s operation failed: %s", e.Operation, e.Message)
}

// Unwrap returns the underlying error
func (e *GitHubError) Unwrap() error {
	return e.Err
}

// EventChannels represents the dual channel system for events and errors
type EventChannels struct {
	Events chan Event       `json:"-"`
	Errors chan GitHubError `json:"-"`
}

// NewEventChannels creates a new set of event channels with the specified buffer size
func NewEventChannels(bufferSize int) *EventChannels {
	return &EventChannels{
		Events: make(chan Event, bufferSize),
		Errors: make(chan GitHubError, bufferSize),
	}
}

// Close closes both event channels
func (ec *EventChannels) Close() {
	close(ec.Events)
	close(ec.Errors)
}

// EventBuilder helps build events with common metadata
type EventBuilder struct {
	sessionID  string
	operation  string
	eventType  EventType
	repository string
	owner      string
	metadata   map[string]interface{}
	startTime  time.Time
}

// NewEventBuilder creates a new event builder
func NewEventBuilder(sessionID, operation string, eventType EventType) *EventBuilder {
	return &EventBuilder{
		sessionID: sessionID,
		operation: operation,
		eventType: eventType,
		metadata:  make(map[string]interface{}),
		startTime: time.Now(),
	}
}

// WithRepository sets the repository context
func (eb *EventBuilder) WithRepository(owner, repo string) *EventBuilder {
	eb.owner = owner
	eb.repository = repo
	return eb
}

// WithMetadata adds metadata to the event
func (eb *EventBuilder) WithMetadata(key string, value interface{}) *EventBuilder {
	eb.metadata[key] = value
	return eb
}

// WithProgress adds progress information
func (eb *EventBuilder) WithProgress(current, total int) *EventBuilder {
	eb.metadata["progress"] = &ProgressInfo{
		Current: current,
		Total:   total,
		Percent: int((float64(current) / float64(total)) * 100),
	}
	return eb
}

// WithRateLimit adds rate limit information
func (eb *EventBuilder) WithRateLimit(limit, remaining int, reset time.Time) *EventBuilder {
	eb.metadata["rate_limit"] = &RateLimitInfo{
		Limit:     limit,
		Remaining: remaining,
		Reset:     reset,
	}
	return eb
}

// BuildStartEvent creates a start event
func (eb *EventBuilder) BuildStartEvent(message string) Event {
	return Event{
		ID:         generateEventID(),
		Type:       eb.eventType,
		Status:     EventStatusStarted,
		Message:    message,
		SessionID:  eb.sessionID,
		Repository: eb.repository,
		Owner:      eb.owner,
		Operation:  eb.operation,
		Timestamp:  eb.startTime,
		Metadata:   eb.metadata,
	}
}

// BuildProgressEvent creates a progress event
func (eb *EventBuilder) BuildProgressEvent(message string) Event {
	return Event{
		ID:         generateEventID(),
		Type:       EventTypeOperationProgress,
		Status:     EventStatusInProgress,
		Message:    message,
		SessionID:  eb.sessionID,
		Repository: eb.repository,
		Owner:      eb.owner,
		Operation:  eb.operation,
		Timestamp:  time.Now(),
		Duration:   time.Since(eb.startTime),
		Metadata:   eb.metadata,
	}
}

// BuildCompleteEvent creates a completion event
func (eb *EventBuilder) BuildCompleteEvent(message string) Event {
	return Event{
		ID:         generateEventID(),
		Type:       EventTypeOperationComplete,
		Status:     EventStatusCompleted,
		Message:    message,
		SessionID:  eb.sessionID,
		Repository: eb.repository,
		Owner:      eb.owner,
		Operation:  eb.operation,
		Timestamp:  time.Now(),
		Duration:   time.Since(eb.startTime),
		Metadata:   eb.metadata,
	}
}

// BuildError creates a GitHub error
func (eb *EventBuilder) BuildError(message string, err error, statusCode int) GitHubError {
	return GitHubError{
		ID:         generateEventID(),
		Type:       eb.eventType,
		Operation:  eb.operation,
		Message:    message,
		Err:        err,
		SessionID:  eb.sessionID,
		Repository: eb.repository,
		Owner:      eb.owner,
		Timestamp:  time.Now(),
		StatusCode: statusCode,
		Metadata:   eb.metadata,
	}
}

// generateEventID generates a unique event ID
func generateEventID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
