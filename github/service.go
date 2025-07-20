// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

// GitHubService provides a comprehensive interface for GitHub API operations.
// Combines session management with specialized services for repositories, pull requests,
// commits, files, tags, and user authentication. All methods are goroutine-safe.
type GitHubService interface {
	// Session management
	CreateSession(token string, config *SessionConfig) *GitHubSession

	// Authentication operations
	AuthenticationService

	// Repository operations
	RepositoryService

	// Organization operations
	OrganizationService

	// Commit operations
	CommitService

	// File operations
	FileService

	// Pull request operations
	PullRequestService

	// Comment operations
	CommentService

	// Tag operations
	TagService
}

// gitHubService is the production implementation of GitHubService with dependency injection.
// Uses pluggable components for session management, validation, metrics, and logging
// to support testing and different deployment environments.
type gitHubService struct {
	sessionManager    SessionManager
	validationService ValidationService
	metricsCollector  MetricsCollector
	logger            Logger
}

// NewGitHubService creates a GitHub service with production-ready default dependencies.
// Uses default session manager, validation service, no-op metrics collector, and global logger.
// Suitable for most applications that don't require custom dependency injection.
func NewGitHubService() GitHubService {
	return NewGitHubServiceWithDependencies(
		NewDefaultSessionManager(
			NewDefaultHTTPClientProvider(),
			NewDefaultValidationService(),
			GetGlobalLogger(),
		),
		NewDefaultValidationService(),
		NewNoOpMetricsCollector(),
		GetGlobalLogger(),
	)
}

// NewGitHubServiceWithDependencies creates a GitHub service with custom dependencies.
// Allows injection of custom session managers, validation services, metrics collectors,
// and loggers for testing, monitoring, or specialized deployment requirements.
func NewGitHubServiceWithDependencies(
	sessionManager SessionManager,
	validationService ValidationService,
	metricsCollector MetricsCollector,
	logger Logger,
) GitHubService {
	return &gitHubService{
		sessionManager:    sessionManager,
		validationService: validationService,
		metricsCollector:  metricsCollector,
		logger:            logger,
	}
}

// CreateSession creates a new authenticated GitHub session with the provided token.
// Validates the token and returns a configured session ready for API operations.
// Returns nil if session creation fails due to invalid token or configuration.
func (s *gitHubService) CreateSession(token string, config *SessionConfig) *GitHubSession {
	session := s.sessionManager.CreateSession(token, config)
	if session == nil {
		return nil
	}
	// Return the concrete type (this is a limitation of the current interface design)
	if concreteSession, ok := session.(*GitHubSession); ok {
		return concreteSession
	}
	return nil
}
