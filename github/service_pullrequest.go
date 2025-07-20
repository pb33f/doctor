// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"time"

	"github.com/google/go-github/v72/github"
)

// PullRequestService defines comprehensive GitHub pull request operations including
// creation, retrieval, listing with filters, tag-based searching, and merging.
// All methods require an authenticated session and return structured error information.
type PullRequestService interface {
	CreatePullRequest(ctx context.Context, session *GitHubSession, owner, repo string, request *CreatePullRequestRequest) (*PullRequest, error)
	GetPullRequest(ctx context.Context, session *GitHubSession, owner, repo string, number int) (*PullRequest, error)
	GetPullRequestsWithTag(ctx context.Context, session *GitHubSession, owner, repo, tag string) ([]PullRequest, error)
	ListPullRequests(ctx context.Context, session *GitHubSession, owner, repo string, options *PullRequestListOptions) ([]PullRequest, error)
	MergePullRequest(ctx context.Context, session *GitHubSession, owner, repo string, number int, commitMessage string) (*PullRequest, error)
}

// CreatePullRequest creates a new pull request in the specified repository.
// Supports all GitHub pull request creation options including draft status,
// maintainer modification permissions, and issue conversion.
func (s *gitHubService) CreatePullRequest(ctx context.Context, session *GitHubSession, owner, repo string, request *CreatePullRequestRequest) (*PullRequest, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "create_pull_request", EventTypePullRequestCreate).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Creating pull request: %s", request.Title))

	result, err := FetchCreate(ctx, rh,
		func() (*github.PullRequest, *github.Response, error) {
			newPR := &github.NewPullRequest{
				Title:               &request.Title,
				Head:                &request.Head,
				Base:                &request.Base,
				MaintainerCanModify: &request.MaintainerCanModify,
				Draft:               &request.Draft,
			}

			if request.Body != "" {
				newPR.Body = &request.Body
			}

			if request.Issue > 0 {
				newPR.Issue = &request.Issue
			}

			return session.Client.PullRequests.Create(ctx, owner, repo, newPR)
		},
		convertGitHubPullRequest,
		fmt.Sprintf("Failed to create pull request: %s", request.Title),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Created pull request #%d: %s", result.Number, result.Title))
	return &result, nil
}

// GetPullRequest retrieves a specific pull request by number from the repository.
// Returns complete pull request information including branch details, labels,
// assignees, and current state.
func (s *gitHubService) GetPullRequest(ctx context.Context, session *GitHubSession, owner, repo string, number int) (*PullRequest, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_pull_request", EventTypePullRequestGet).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching pull request #%d", number))

	result, err := FetchSingle(ctx, rh,
		func() (*github.PullRequest, *github.Response, error) {
			return session.Client.PullRequests.Get(ctx, owner, repo, number)
		},
		convertGitHubPullRequest,
		fmt.Sprintf("Failed to fetch pull request #%d", number),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched pull request #%d", number))
	return &result, nil
}

// GetPullRequestsWithTag retrieves all pull requests that have a specific label/tag.
// Performs efficient filtering to find pull requests marked with the specified label.
// Uses optimized memory allocation to reduce overhead for large result sets.
func (s *gitHubService) GetPullRequestsWithTag(ctx context.Context, session *GitHubSession, owner, repo, tag string) ([]PullRequest, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	// Validate inputs
	if err := ValidateRepositoryPath(owner, repo); err != nil {
		return nil, fmt.Errorf("invalid repository path: %w", err)
	}
	if err := ValidateGitHubIdentifier(tag, "tag"); err != nil {
		return nil, fmt.Errorf("invalid tag: %w", err)
	}

	rh := NewRequestHandler(session, "get_pull_requests_with_tag", EventTypePullRequestList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching pull requests with tag: %s", tag))

	allPRs, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.PullRequest, *github.Response, error) {
			prOpts := &github.PullRequestListOptions{
				State:       "all",
				ListOptions: *opts,
			}
			return session.Client.PullRequests.List(ctx, owner, repo, prOpts)
		},
		convertGitHubPullRequest,
		DefaultPaginationConfig(),
		fmt.Sprintf("Failed to fetch pull requests with tag: %s", tag),
	)

	if err != nil {
		return nil, err
	}

	// Filter for the specific tag efficiently
	// Pre-allocate slice with estimated capacity to reduce allocations
	results := make([]PullRequest, 0, len(allPRs)/10) // Estimate 10% might match

	for _, pr := range allPRs {
		// Check if PR has the target label
		for _, label := range pr.Labels {
			if label.Name == tag {
				results = append(results, pr)
				break // Found the label, no need to check other labels
			}
		}
	}

	rh.SendCompleteEvent(fmt.Sprintf("Found %d pull requests with tag %s", len(results), tag))
	return results, nil
}

// ListPullRequests retrieves pull requests with comprehensive filtering options.
// Supports pagination, state filtering (open/closed/all), branch filtering,
// and sorting by various criteria with configurable direction.
func (s *gitHubService) ListPullRequests(ctx context.Context, session *GitHubSession, owner, repo string, options *PullRequestListOptions) ([]PullRequest, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "list_pull_requests", EventTypePullRequestList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent("Fetching pull requests")

	// Build pagination config
	config := DefaultPaginationConfig()
	if options != nil {
		config.Page = options.Page
		config.PerPage = options.PerPage
	}

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.PullRequest, *github.Response, error) {
			prOpts := &github.PullRequestListOptions{
				State:       "open",
				ListOptions: *opts,
			}

			if options != nil {
				prOpts.State = options.State
				prOpts.Head = options.Head
				prOpts.Base = options.Base
				prOpts.Sort = options.Sort
				prOpts.Direction = options.Direction
			}

			return session.Client.PullRequests.List(ctx, owner, repo, prOpts)
		},
		convertGitHubPullRequest,
		config,
		"Failed to fetch pull requests",
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d pull requests", len(results)))
	return results, nil
}

// MergePullRequest merges a pull request after validating it can be merged.
// Performs pre-merge validation, executes the merge operation, and verifies
// completion with retry logic to handle GitHub's eventual consistency.
func (s *gitHubService) MergePullRequest(ctx context.Context, session *GitHubSession, owner, repo string, number int, commitMessage string) (*PullRequest, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "merge_pull_request", EventTypePullRequestMerge).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Merging pull request #%d", number))

	// First, get the current PR state to validate it can be merged
	// Use direct API call to avoid double validation
	githubPR, _, err := session.Client.PullRequests.Get(ctx, owner, repo, number)
	if err != nil {
		return nil, fmt.Errorf("failed to get PR state before merge: %w", err)
	}

	// Convert to our internal type
	currentPR := convertGitHubPullRequest(githubPR)

	// Validate PR can be merged
	if currentPR.State != "open" {
		return nil, fmt.Errorf("cannot merge PR #%d: state is %s (must be open)", number, currentPR.State)
	}

	if currentPR.Merged {
		return nil, fmt.Errorf("PR #%d is already merged", number)
	}

	if !currentPR.Mergeable {
		return nil, fmt.Errorf("PR #%d is not mergeable (conflicts or checks failed)", number)
	}

	// Attempt to merge
	mergeResult, err := FetchSingle(ctx, rh,
		func() (*github.PullRequestMergeResult, *github.Response, error) {
			options := &github.PullRequestOptions{}
			return session.Client.PullRequests.Merge(ctx, owner, repo, number, commitMessage, options)
		},
		func(result *github.PullRequestMergeResult) *github.PullRequestMergeResult {
			return result
		},
		fmt.Sprintf("Failed to merge pull request #%d", number),
	)

	if err != nil {
		return nil, err
	}

	// Verify the merge was successful
	if mergeResult.Merged == nil || !*mergeResult.Merged {
		return nil, fmt.Errorf("merge operation failed: %s", getString(mergeResult.Message))
	}

	// Use retry logic to get the updated PR state
	var finalPR *PullRequest
	maxRetries := 3

	for attempt := 0; attempt < maxRetries; attempt++ {
		// Wait a bit for GitHub to update the PR state
		if attempt > 0 {
			backoffDelay := CalculateBackoffDelay(attempt, DefaultRetryDelay)

			select {
			case <-ctx.Done():
				return nil, fmt.Errorf("operation cancelled while waiting for PR state update: %w", ctx.Err())
			case <-time.After(backoffDelay):
			}
		}

		updatedPR, err := s.GetPullRequest(ctx, session, owner, repo, number)
		if err != nil {
			if attempt == maxRetries-1 {
				// If we can't get the updated PR, return a constructed result
				finalPR = &PullRequest{
					ID:     currentPR.ID,
					Number: number,
					Title:  currentPR.Title,
					State:  "closed",
					Merged: true,
					Base:   currentPR.Base,
					Head:   currentPR.Head,
					User:   currentPR.User,
				}
				if mergeResult.SHA != nil {
					finalPR.Head.SHA = *mergeResult.SHA
				}
				break
			}
			continue
		}

		// Check if the PR is now merged
		if updatedPR.Merged {
			finalPR = updatedPR
			break
		}

		// If not merged yet, continue retrying
		if attempt == maxRetries-1 {
			return nil, fmt.Errorf("PR #%d merge succeeded but state not updated after %d attempts", number, maxRetries)
		}
	}

	if finalPR == nil {
		return nil, fmt.Errorf("failed to retrieve final PR state after merge")
	}

	rh.SendCompleteEvent(fmt.Sprintf("Successfully merged pull request #%d", number))
	return finalPR, nil
}
