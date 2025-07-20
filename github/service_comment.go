// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// CommentService defines comment operations
type CommentService interface {
	AddPullRequestComment(ctx context.Context, session *GitHubSession, owner, repo string, number int, body string) (*Comment, error)
	EditPullRequestComment(ctx context.Context, session *GitHubSession, owner, repo string, commentID int64, body string) (*Comment, error)
	GetPullRequestComments(ctx context.Context, session *GitHubSession, owner, repo string, number int) ([]Comment, error)
}

// AddPullRequestComment adds a comment to a pull request
func (s *gitHubService) AddPullRequestComment(ctx context.Context, session *GitHubSession, owner, repo string, number int, body string) (*Comment, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "add_pull_request_comment", EventTypeCommentAdd).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Adding comment to pull request #%d", number))

	result, err := FetchCreate(ctx, rh,
		func() (*github.IssueComment, *github.Response, error) {
			comment := &github.IssueComment{Body: &body}
			return session.Client.Issues.CreateComment(ctx, owner, repo, number, comment)
		},
		convertGitHubComment,
		fmt.Sprintf("Failed to add comment to pull request #%d", number),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Added comment to pull request #%d", number))
	return result, nil
}

// EditPullRequestComment edits a comment on a pull request
func (s *gitHubService) EditPullRequestComment(ctx context.Context, session *GitHubSession, owner, repo string, commentID int64, body string) (*Comment, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "edit_pull_request_comment", EventTypeCommentEdit).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Editing comment %d", commentID))

	result, err := FetchSingle(ctx, rh,
		func() (*github.IssueComment, *github.Response, error) {
			comment := &github.IssueComment{Body: &body}
			return session.Client.Issues.EditComment(ctx, owner, repo, commentID, comment)
		},
		convertGitHubComment,
		fmt.Sprintf("Failed to edit comment %d", commentID),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Edited comment %d", commentID))
	return result, nil
}

// GetPullRequestComments retrieves comments for a pull request
func (s *gitHubService) GetPullRequestComments(ctx context.Context, session *GitHubSession, owner, repo string, number int) ([]Comment, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_pull_request_comments", EventTypeCommentGet).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching comments for pull request #%d", number))

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.IssueComment, *github.Response, error) {
			commentOpts := &github.IssueListCommentsOptions{ListOptions: *opts}
			return session.Client.Issues.ListComments(ctx, owner, repo, number, commentOpts)
		},
		func(comment *github.IssueComment) Comment {
			return *convertGitHubComment(comment)
		},
		DefaultPaginationConfig(),
		fmt.Sprintf("Failed to fetch comments for pull request #%d", number),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d comments for pull request #%d", len(results), number))
	return results, nil
}
