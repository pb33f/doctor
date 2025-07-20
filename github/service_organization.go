// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// OrganizationService defines organization operations
type OrganizationService interface {
	GetUserOrganizations(ctx context.Context, session *GitHubSession) ([]Organization, error)
	GetOrganizationRepositories(ctx context.Context, session *GitHubSession, org string) ([]Repository, error)
}

// GetUserOrganizations retrieves organizations for the authenticated user
func (s *gitHubService) GetUserOrganizations(ctx context.Context, session *GitHubSession) ([]Organization, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_user_organizations", EventTypeOrganizationList)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent("Fetching user organizations")

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.Organization, *github.Response, error) {
			return session.Client.Organizations.List(ctx, "", opts)
		},
		convertGitHubOrganization,
		DefaultPaginationConfig(),
		"Failed to fetch user organizations",
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d organizations", len(results)))
	return results, nil
}

// GetOrganizationRepositories retrieves repositories for a specific organization
func (s *gitHubService) GetOrganizationRepositories(ctx context.Context, session *GitHubSession, org string) ([]Repository, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_organization_repositories", EventTypeRepositoryList).WithRepository(org, "")
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching repositories for organization %s", org))

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.Repository, *github.Response, error) {
			repoOpts := &github.RepositoryListByOrgOptions{ListOptions: *opts}
			return session.Client.Repositories.ListByOrg(ctx, org, repoOpts)
		},
		convertGitHubRepository,
		DefaultPaginationConfig(),
		fmt.Sprintf("Failed to fetch repositories for organization %s", org),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d repositories for %s", len(results), org))
	return results, nil
}
