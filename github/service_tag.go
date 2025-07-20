// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// TagService defines GitHub tag operations for Git tag management.
// Supports creating both lightweight and annotated tags, and listing
// existing tags with complete metadata and download URLs.
type TagService interface {
	CreateTag(ctx context.Context, session *GitHubSession, owner, repo string, request *CreateTagRequest) (*Tag, error)
	ListTags(ctx context.Context, session *GitHubSession, owner, repo string) ([]Tag, error)
}

// CreateTag creates a new Git tag in the repository pointing to a specific commit.
// Supports both lightweight tags (just a pointer) and annotated tags with
// message and tagger information. Returns the created tag with commit reference.
func (s *gitHubService) CreateTag(ctx context.Context, session *GitHubSession, owner, repo string, request *CreateTagRequest) (*Tag, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "create_tag", EventTypeTagCreate).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Creating tag: %s", request.Tag))

	_, err := FetchCreate(ctx, rh,
		func() (*github.Tag, *github.Response, error) {
			tag := &github.Tag{
				Tag:     &request.Tag,
				Message: &request.Message,
				Object: &github.GitObject{
					SHA:  &request.Object,
					Type: &request.Type,
				},
			}

			if request.Tagger.Name != "" {
				tag.Tagger = &github.CommitAuthor{
					Name:  &request.Tagger.Name,
					Email: &request.Tagger.Email,
					Date:  &github.Timestamp{Time: request.Tagger.Date},
				}
			}

			return session.Client.Git.CreateTag(ctx, owner, repo, tag)
		},
		convertGitHubCreateTag,
		fmt.Sprintf("Failed to create tag: %s", request.Tag),
	)

	if err != nil {
		return nil, err
	}

	// Return a simple tag result since GitHub's CreateTag doesn't return the full tag info
	result := &Tag{
		Name: request.Tag,
		Commit: CommitRef{
			SHA: request.Object,
		},
	}

	rh.SendCompleteEvent(fmt.Sprintf("Created tag: %s", request.Tag))
	return result, nil
}

// ListTags retrieves all Git tags from the repository with pagination support.
// Returns tag information including name, commit SHA, and download URLs
// for zip and tarball archives of the tagged commit.
func (s *gitHubService) ListTags(ctx context.Context, session *GitHubSession, owner, repo string) ([]Tag, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "list_tags", EventTypeTagList).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent("Fetching tags")

	results, err := FetchPaginated(ctx, rh,
		func(opts *github.ListOptions) ([]*github.RepositoryTag, *github.Response, error) {
			return session.Client.Repositories.ListTags(ctx, owner, repo, opts)
		},
		convertGitHubTag,
		DefaultPaginationConfig(),
		"Failed to fetch tags",
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched %d tags", len(results)))
	return results, nil
}
