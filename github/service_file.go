// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// FileService defines file operations
type FileService interface {
	GetFileContent(ctx context.Context, session *GitHubSession, owner, repo, path, ref string) (*FileContent, error)
	GetFileRevision(ctx context.Context, session *GitHubSession, owner, repo, path, sha string) (*FileContent, error)
}

// GetFileContent retrieves the content of a file
func (s *gitHubService) GetFileContent(ctx context.Context, session *GitHubSession, owner, repo, path, ref string) (*FileContent, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "get_file_content", EventTypeFileGetContent).WithRepository(owner, repo)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent(fmt.Sprintf("Fetching content for %s", path))

	result, err := FetchSingle(ctx, rh,
		func() (*github.RepositoryContent, *github.Response, error) {
			opts := &github.RepositoryContentGetOptions{}
			if ref != "" {
				opts.Ref = ref
			}
			fileContent, _, resp, err := session.Client.Repositories.GetContents(ctx, owner, repo, path, opts)
			return fileContent, resp, err
		},
		convertGitHubFileContent,
		fmt.Sprintf("Failed to fetch content for %s", path),
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("Fetched content for %s", path))
	return result, nil
}

// GetFileRevision retrieves a specific revision of a file
func (s *gitHubService) GetFileRevision(ctx context.Context, session *GitHubSession, owner, repo, path, sha string) (*FileContent, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	return s.GetFileContent(ctx, session, owner, repo, path, sha)
}
