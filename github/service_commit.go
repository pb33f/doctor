// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// CommitService defines commit operations
type CommitService interface {
	GetCommitList(ctx context.Context, session *GitHubSession, owner, repo, path string, options *CommitListOptions) ([]Commit, error)
	GetCommit(ctx context.Context, session *GitHubSession, owner, repo, sha string) (*Commit, error)
	GetCommitRange(ctx context.Context, session *GitHubSession, owner, repo, base, head string) ([]Commit, error)
	GetCommitHistory(ctx context.Context, session *GitHubSession, owner, repo, sha string, forward bool, limit int) ([]Commit, error)
}

// GetCommitList retrieves commits for a file or repository
func (s *gitHubService) GetCommitList(ctx context.Context, session *GitHubSession, owner, repo, path string, options *CommitListOptions) ([]Commit, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_commit_list", EventTypeCommitList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching commits for %s/%s", owner, repo))

	config := DefaultPaginationConfig()
	if options != nil {
		config.Page = options.Page
		config.PerPage = options.PerPage
	}

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.RepositoryCommit, *github.Response, error) {
			commitOpts := &github.CommitsListOptions{
				ListOptions: *opts,
				Path:        path,
			}
			if options != nil {
				commitOpts.SHA = options.SHA
				commitOpts.Author = options.Author
				commitOpts.Since = options.Since
				commitOpts.Until = options.Until
				if options.Path != "" {
					commitOpts.Path = options.Path
				}
			}
			return session.Client.Repositories.ListCommits(ctx, owner, repo, commitOpts)
		},
		convertGitHubCommit,
		config,
		fmt.Sprintf("Failed to fetch commits for %s/%s", owner, repo),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d commits", len(results)))
	return results, nil
}

// GetCommit retrieves a specific commit
func (s *gitHubService) GetCommit(ctx context.Context, session *GitHubSession, owner, repo, sha string) (*Commit, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_commit", EventTypeCommitGet).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching commit %s", sha))

	result, err := FetchSingle(ctx, rh,
		func() (*github.RepositoryCommit, *github.Response, error) {
			return session.Client.Repositories.GetCommit(ctx, owner, repo, sha, nil)
		},
		convertGitHubCommit,
		fmt.Sprintf("Failed to fetch commit %s", sha),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched commit %s", sha))
	return &result, nil
}

// GetCommitRange retrieves commits between two commits
func (s *gitHubService) GetCommitRange(ctx context.Context, session *GitHubSession, owner, repo, base, head string) ([]Commit, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_commit_range", EventTypeCommitList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching commits between %s and %s", base, head))

	// Use single fetch for comparison, then extract commits
	comparison, err := FetchSingle(ctx, rh,
		func() (*github.CommitsComparison, *github.Response, error) {
			return session.Client.Repositories.CompareCommits(ctx, owner, repo, base, head, nil)
		},
		func(comp *github.CommitsComparison) []Commit {
			if comp == nil || comp.Commits == nil {
				return []Commit{}
			}
			commits := make([]Commit, len(comp.Commits))
			for i, commit := range comp.Commits {
				commits[i] = convertGitHubCommit(commit)
			}
			return commits
		},
		fmt.Sprintf("Failed to compare commits %s...%s", base, head),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d commits between %s and %s", len(comparison), base, head))
	return comparison, nil
}

// GetCommitHistory retrieves commit history from a specific commit
func (s *gitHubService) GetCommitHistory(ctx context.Context, session *GitHubSession, owner, repo, sha string, forward bool, limit int) ([]Commit, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_commit_history", EventTypeCommitList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	direction := "backward"
	if forward {
		direction = "forward"
	}
	rh.SendStartEvent(fmt.Sprintf("Fetching %s commit history from %s", direction, sha))

	config := DefaultPaginationConfig()
	if limit > 0 {
		config.PerPage = limit
		config.MaxResults = limit
	}

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.RepositoryCommit, *github.Response, error) {
			commitOpts := &github.CommitsListOptions{
				SHA:         sha,
				ListOptions: *opts,
			}
			return session.Client.Repositories.ListCommits(ctx, owner, repo, commitOpts)
		},
		convertGitHubCommit,
		config,
		fmt.Sprintf("Failed to fetch commit history from %s", sha),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d commits from history", len(results)))
	return results, nil
}
