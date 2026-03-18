// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync/atomic"
	"time"
)

const (
	defaultFileHistoryMaxWorkers      = 10
	defaultFileHistorySizeThresholdKB = 50000
	defaultFileHistoryMaxDownloadSize = 100 * 1024 * 1024 // 100MB
	defaultFileHistoryMaxResults      = 1000
)

type historyAPI interface {
	GetCommitList(ctx context.Context, session *GitHubSession, owner, repo, path string, options *CommitListOptions) ([]Commit, error)
	GetCommit(ctx context.Context, session *GitHubSession, owner, repo, sha string) (*Commit, error)
	GetFileContent(ctx context.Context, session *GitHubSession, owner, repo, path, ref string) (*FileContent, error)
}

type fileHistoryResult struct {
	index    int
	revision *FileRevision
	err      error
}

type fileHistorySettings struct {
	baseCommit      string
	limit           int
	limitDays       int
	forceCutoff     bool
	sizeThresholdKB int64
	maxDownloadSize int64
	maxWorkers      int
	maxResults      int
}

// FileHistoryService defines higher-level file history operations that combine
// commit listing, commit detail inspection, and file content retrieval.
type FileHistoryService interface {
	GetFileHistory(ctx context.Context, session *GitHubSession, owner, repo, path string, options *FileHistoryOptions) ([]*FileRevision, error)
}

// GetFileHistory retrieves a file's revision history across matching commits.
// Results are ordered from newest to oldest and omit revisions where the file no
// longer exists at that commit (for example, deletions or renames).
func (s *gitHubService) GetFileHistory(ctx context.Context, session *GitHubSession, owner, repo, path string, options *FileHistoryOptions) ([]*FileRevision, error) {
	return getFileHistory(ctx, s, session, owner, repo, path, options)
}

func getFileHistory(ctx context.Context, api historyAPI, session *GitHubSession, owner, repo, path string, options *FileHistoryOptions) ([]*FileRevision, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}
	if ctx == nil {
		ctx = context.Background()
	}

	settings := normalizeFileHistoryOptions(options)
	commits, err := api.GetCommitList(ctx, session, owner, repo, path, &CommitListOptions{
		Path:       path,
		MaxResults: settings.maxResults,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list commits: %w", err)
	}
	if len(commits) == 0 {
		return nil, nil
	}

	totalCommits := len(commits)
	if settings.limitDays != -1 {
		newLimit := getCommitDayLimit(settings.limitDays, commits)
		if newLimit == 0 {
			return []*FileRevision{}, nil
		}
		settings.limit = newLimit
	}

	if settings.limit > 0 && totalCommits > settings.limit {
		totalCommits = settings.limit + 1
	}

	processCommits := commits[:totalCommits]
	if settings.baseCommit != "" {
		for i, c := range processCommits {
			if c.SHA == settings.baseCommit || strings.HasPrefix(c.SHA, settings.baseCommit) {
				processCommits = processCommits[:i+1]
				break
			}
		}
	}
	totalCommits = len(processCommits)

	results := make([]*FileRevision, totalCommits)
	resultChan := make(chan fileHistoryResult, totalCommits)
	sem := make(chan struct{}, settings.maxWorkers)

	var kbSize atomic.Int64
	var cutoffIndex atomic.Int64

	for i, commit := range processCommits {
		sem <- struct{}{}
		go func(idx int, c Commit) {
			defer func() { <-sem }()

			detail, err := api.GetCommit(ctx, session, owner, repo, c.SHA)
			if err != nil {
				resultChan <- fileHistoryResult{index: idx, err: fmt.Errorf("fetching commit %s: %w", c.SHA, err)}
				return
			}

			var fileBytes []byte
			for _, file := range detail.Files {
				if file.Filename != path {
					continue
				}

				fileBytes, err = getFileBytes(ctx, api, session, owner, repo, path, c.SHA, settings.maxDownloadSize)
				if err != nil {
					if isNotFoundError(err) {
						resultChan <- fileHistoryResult{index: idx, revision: nil}
						return
					}
					resultChan <- fileHistoryResult{index: idx, err: fmt.Errorf("reading file at commit %s: %w", c.SHA, err)}
					return
				}

				fileSizeKB := int64(len(fileBytes)/1024) * 2
				newSize := kbSize.Add(fileSizeKB)
				if newSize > settings.sizeThresholdKB {
					cutoffIndex.CompareAndSwap(0, int64(idx))
				}
				break
			}

			resultChan <- fileHistoryResult{
				index: idx,
				revision: &FileRevision{
					Commit:    *detail,
					FileBytes: fileBytes,
				},
			}
		}(i, commit)
	}

	var firstErr error
	for i := 0; i < totalCommits; i++ {
		r := <-resultChan
		if r.err != nil {
			if firstErr == nil {
				firstErr = r.err
			}
			continue
		}
		results[r.index] = r.revision
	}
	if firstErr != nil {
		return nil, firstErr
	}

	if settings.forceCutoff {
		ci := int(cutoffIndex.Load())
		if ci > 0 {
			results = results[:ci]
		}
	}

	filtered := make([]*FileRevision, 0, len(results))
	for _, result := range results {
		if result != nil {
			filtered = append(filtered, result)
		}
	}
	return filtered, nil
}

func normalizeFileHistoryOptions(options *FileHistoryOptions) fileHistorySettings {
	settings := fileHistorySettings{
		limitDays:       -1,
		sizeThresholdKB: defaultFileHistorySizeThresholdKB,
		maxDownloadSize: defaultFileHistoryMaxDownloadSize,
		maxWorkers:      defaultFileHistoryMaxWorkers,
		maxResults:      defaultFileHistoryMaxResults,
	}
	if options == nil {
		return settings
	}

	settings.baseCommit = options.BaseCommit
	settings.limit = options.Limit
	settings.forceCutoff = options.ForceCutoff
	if options.LimitDays != nil {
		settings.limitDays = *options.LimitDays
	}
	if options.SizeThresholdKB > 0 {
		settings.sizeThresholdKB = int64(options.SizeThresholdKB)
	}
	if options.MaxDownloadSize > 0 {
		settings.maxDownloadSize = options.MaxDownloadSize
	}
	if options.MaxWorkers > 0 {
		settings.maxWorkers = options.MaxWorkers
	}
	if options.Limit > 0 {
		settings.maxResults = options.Limit + 1
	}
	return settings
}

func getFileBytes(ctx context.Context, api historyAPI, session *GitHubSession, owner, repo, path, sha string, maxDownloadSize int64) ([]byte, error) {
	fc, err := api.GetFileContent(ctx, session, owner, repo, path, sha)
	if err != nil {
		return nil, err
	}
	if fc.Content != "" {
		clean := strings.ReplaceAll(fc.Content, "\n", "")
		return base64.StdEncoding.DecodeString(clean)
	}
	if fc.DownloadURL != "" {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, fc.DownloadURL, nil)
		if err != nil {
			return nil, fmt.Errorf("creating download request for %s: %w", fc.DownloadURL, err)
		}
		if session.Token != "" {
			req.Header.Set("Authorization", "Bearer "+session.Token)
		}
		resp, err := newSessionHTTPClient(session.Config).Do(req)
		if err != nil {
			return nil, fmt.Errorf("downloading file from %s: %w", fc.DownloadURL, err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("downloading file from %s: HTTP %d", fc.DownloadURL, resp.StatusCode)
		}
		return io.ReadAll(io.LimitReader(resp.Body, maxDownloadSize))
	}
	return nil, fmt.Errorf("no content available for %s at %s", path, sha)
}

func isNotFoundError(err error) bool {
	if err == nil {
		return false
	}
	errStr := err.Error()
	return strings.Contains(errStr, "404") || strings.Contains(errStr, "Not Found")
}

func getCommitDayLimit(limitDays int, commits []Commit) int {
	if limitDays <= 0 {
		return 0
	}

	commitTimeCutoff := time.Now().Add(time.Duration(-limitDays) * 24 * time.Hour)
	newLimit := 0
	for _, c := range commits {
		if commitTimeCutoff.After(c.Author.Date) {
			break
		}
		newLimit++
	}
	return newLimit
}
