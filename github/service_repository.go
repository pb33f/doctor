// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// RepositoryService defines GitHub repository operations including retrieval
// of user repositories and specific repository details. Provides comprehensive
// repository metadata with owner information and statistics.
type RepositoryService interface {
	GetAllUserRepositories(ctx context.Context, session *GitHubSession) ([]Repository, error)
	GetRepository(ctx context.Context, session *GitHubSession, owner, repo string) (*Repository, error)
}

// GetAllUserRepositories retrieves all repositories accessible to the authenticated user.
// Includes both owned repositories and repositories the user has access to through
// organization membership or collaboration. Uses pagination for efficient retrieval.
func (s *gitHubService) GetAllUserRepositories(ctx context.Context, session *GitHubSession) ([]Repository, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_all_user_repositories", EventTypeRepositoryList)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent("Fetching user repositories")

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.Repository, *github.Response, error) {
			repoOpts := &github.RepositoryListOptions{ListOptions: *opts}
			return session.Client.Repositories.List(ctx, "", repoOpts)
		},
		convertGitHubRepository,
		DefaultPaginationConfig(),
		"Failed to fetch user repositories",
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d repositories", len(results)))
	return results, nil
}

// GetRepository retrieves detailed information about a specific repository.
// Returns comprehensive repository metadata including owner details, statistics,
// default branch, language information, and access URLs.
func (s *gitHubService) GetRepository(ctx context.Context, session *GitHubSession, owner, repo string) (*Repository, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_repository", EventTypeRepositoryGet).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching repository %s/%s", owner, repo))

	result, err := FetchSingle(ctx, rh,
		func() (*github.Repository, *github.Response, error) {
			return session.Client.Repositories.Get(ctx, owner, repo)
		},
		convertGitHubRepository,
		fmt.Sprintf("Failed to fetch repository %s/%s", owner, repo),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched repository %s/%s", owner, repo))
	return &result, nil
}
