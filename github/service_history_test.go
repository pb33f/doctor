// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package github

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

type mockHistoryAPI struct {
	commitList  func(ctx context.Context, session *GitHubSession, owner, repo, path string, options *CommitListOptions) ([]Commit, error)
	commit      func(ctx context.Context, session *GitHubSession, owner, repo, sha string) (*Commit, error)
	fileContent func(ctx context.Context, session *GitHubSession, owner, repo, path, ref string) (*FileContent, error)
}

func (m *mockHistoryAPI) GetCommitList(ctx context.Context, session *GitHubSession, owner, repo, path string, options *CommitListOptions) ([]Commit, error) {
	return m.commitList(ctx, session, owner, repo, path, options)
}

func (m *mockHistoryAPI) GetCommit(ctx context.Context, session *GitHubSession, owner, repo, sha string) (*Commit, error) {
	return m.commit(ctx, session, owner, repo, sha)
}

func (m *mockHistoryAPI) GetFileContent(ctx context.Context, session *GitHubSession, owner, repo, path, ref string) (*FileContent, error) {
	return m.fileContent(ctx, session, owner, repo, path, ref)
}

func makeTestCommit(sha, message, author, email string, date time.Time, files []CommitFile) Commit {
	return Commit{
		SHA:     sha,
		Message: message,
		Author: CommitAuthor{
			Name:  author,
			Email: email,
			Date:  date,
		},
		Files: files,
	}
}

func dummySession() *GitHubSession {
	return NewAnonymousGitHubSession(DefaultSessionConfig())
}

func makeCommitLookup(commits []Commit, filename string) func(context.Context, *GitHubSession, string, string, string) (*Commit, error) {
	return func(_ context.Context, _ *GitHubSession, _, _, sha string) (*Commit, error) {
		for i := range commits {
			if commits[i].SHA == sha {
				c := commits[i]
				c.Files = []CommitFile{{Filename: filename}}
				return &c, nil
			}
		}
		return nil, fmt.Errorf("commit not found: %s", sha)
	}
}

func makeStaticCommitList(commits []Commit) func(context.Context, *GitHubSession, string, string, string, *CommitListOptions) ([]Commit, error) {
	return func(_ context.Context, _ *GitHubSession, _, _, _ string, _ *CommitListOptions) ([]Commit, error) {
		return commits, nil
	}
}

func makeStaticFileContent(content string) func(context.Context, *GitHubSession, string, string, string, string) (*FileContent, error) {
	return func(_ context.Context, _ *GitHubSession, _, _, _, _ string) (*FileContent, error) {
		return &FileContent{Content: content}, nil
	}
}

func intPtr(v int) *int {
	return &v
}

func TestGetFileHistory_Basic(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "alice@test.com", now.Add(-3*time.Hour), nil),
		makeTestCommit("bbb222", "second", "Bob", "bob@test.com", now.Add(-2*time.Hour), nil),
		makeTestCommit("ccc333", "third", "Charlie", "charlie@test.com", now.Add(-1*time.Hour), nil),
	}

	fileContent := base64.StdEncoding.EncodeToString([]byte("openapi: 3.0.0"))
	mock := &mockHistoryAPI{
		commitList:  makeStaticCommitList(commits),
		commit:      makeCommitLookup(commits, "api/spec.yaml"),
		fileContent: makeStaticFileContent(fileContent),
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "api/spec.yaml", nil)

	require.NoError(t, err)
	require.Len(t, result, 3)
	assert.Equal(t, "aaa111", result[0].Commit.SHA)
	assert.Equal(t, "bbb222", result[1].Commit.SHA)
	assert.Equal(t, "ccc333", result[2].Commit.SHA)
	assert.Equal(t, []byte("openapi: 3.0.0"), result[0].FileBytes)
}

func TestGetFileHistory_Limit(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "alice@test.com", now.Add(-4*time.Hour), nil),
		makeTestCommit("bbb222", "second", "Bob", "bob@test.com", now.Add(-3*time.Hour), nil),
		makeTestCommit("ccc333", "third", "Charlie", "charlie@test.com", now.Add(-2*time.Hour), nil),
		makeTestCommit("ddd444", "fourth", "Dave", "dave@test.com", now.Add(-1*time.Hour), nil),
	}

	fileContent := base64.StdEncoding.EncodeToString([]byte("spec"))
	mock := &mockHistoryAPI{
		commitList: func(_ context.Context, _ *GitHubSession, _, _, _ string, opts *CommitListOptions) ([]Commit, error) {
			assert.Equal(t, 3, opts.MaxResults)
			return commits, nil
		},
		commit:      makeCommitLookup(commits, "spec.yaml"),
		fileContent: makeStaticFileContent(fileContent),
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{Limit: 2})

	require.NoError(t, err)
	require.Len(t, result, 3)
}

func TestGetFileHistory_BaseCommitBeyondDefaultWindow(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	const numCommits = 150
	commits := make([]Commit, numCommits)
	for i := 0; i < numCommits; i++ {
		commits[i] = makeTestCommit(
			fmt.Sprintf("sha%03d%036d", i, i),
			fmt.Sprintf("commit %d", i),
			"Author", "a@t.com",
			now.Add(-time.Duration(i)*time.Hour),
			nil,
		)
	}

	baseCommit := commits[120].SHA
	fileContent := base64.StdEncoding.EncodeToString([]byte("data"))
	mock := &mockHistoryAPI{
		commitList: func(_ context.Context, _ *GitHubSession, _, _, _ string, opts *CommitListOptions) ([]Commit, error) {
			assert.Equal(t, defaultFileHistoryMaxResults, opts.MaxResults)
			return commits, nil
		},
		commit:      makeCommitLookup(commits, "spec.yaml"),
		fileContent: makeStaticFileContent(fileContent),
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{BaseCommit: baseCommit})

	require.NoError(t, err)
	require.Len(t, result, 121)
	assert.Equal(t, baseCommit, result[len(result)-1].Commit.SHA)
}

func TestGetFileHistory_TimeLimitBeyondDefaultWindow(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	const numCommits = 150
	commits := make([]Commit, numCommits)
	for i := 0; i < numCommits; i++ {
		commits[i] = makeTestCommit(
			fmt.Sprintf("sha%03d", i),
			fmt.Sprintf("commit %d", i),
			"Author", "a@t.com",
			now.Add(-time.Duration(i)*12*time.Hour),
			nil,
		)
	}

	fileContent := base64.StdEncoding.EncodeToString([]byte("data"))
	mock := &mockHistoryAPI{
		commitList:  makeStaticCommitList(commits),
		commit:      makeCommitLookup(commits, "spec.yaml"),
		fileContent: makeStaticFileContent(fileContent),
	}

	const limitDays = 55
	wantWithin := getCommitDayLimit(limitDays, commits)
	require.Greater(t, wantWithin, 100)

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{LimitDays: intPtr(limitDays)})

	require.NoError(t, err)
	require.Len(t, result, wantWithin+1)
}

func TestGetFileHistory_TimeLimitZeroResults(t *testing.T) {
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "old", "Alice", "a@t.com", time.Now().Add(-72*time.Hour), nil),
	}

	mock := &mockHistoryAPI{
		commitList: func(_ context.Context, _ *GitHubSession, _, _, _ string, _ *CommitListOptions) ([]Commit, error) {
			return commits, nil
		},
		commit: func(_ context.Context, _ *GitHubSession, _, _, _ string) (*Commit, error) {
			t.Fatal("should not be called when time limit filters everything")
			return nil, nil
		},
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, _ string) (*FileContent, error) {
			t.Fatal("should not be called")
			return nil, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{LimitDays: intPtr(0)})

	require.NoError(t, err)
	require.Empty(t, result)
}

func TestGetFileHistory_DeletedFile(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "exists", "Alice", "a@t.com", now.Add(-2*time.Hour), nil),
		makeTestCommit("bbb222", "deleted", "Bob", "b@t.com", now.Add(-1*time.Hour), nil),
	}

	mock := &mockHistoryAPI{
		commitList: makeStaticCommitList(commits),
		commit: func(_ context.Context, _ *GitHubSession, _, _, sha string) (*Commit, error) {
			return &Commit{
				SHA:   sha,
				Files: []CommitFile{{Filename: "spec.yaml"}},
				Author: CommitAuthor{
					Date: now,
				},
			}, nil
		},
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, ref string) (*FileContent, error) {
			if ref == "bbb222" {
				return nil, fmt.Errorf("GET /repos/owner/repo/contents/spec.yaml?ref=%s: 404 Not Found", ref)
			}
			return &FileContent{Content: base64.StdEncoding.EncodeToString([]byte("spec"))}, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", nil)

	require.NoError(t, err)
	require.Len(t, result, 1)
	assert.Equal(t, "aaa111", result[0].Commit.SHA)
}

func TestGetFileHistory_RenameAwayCommitOmitted(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("bbb222", "rename away", "Bob", "b@t.com", now.Add(-1*time.Hour), nil),
		makeTestCommit("aaa111", "exists", "Alice", "a@t.com", now.Add(-2*time.Hour), nil),
	}

	fileContentCalls := 0
	mock := &mockHistoryAPI{
		commitList: makeStaticCommitList(commits),
		commit: func(_ context.Context, _ *GitHubSession, _, _, sha string) (*Commit, error) {
			switch sha {
			case "bbb222":
				return &Commit{
					SHA:   sha,
					Files: []CommitFile{{Filename: "renamed/spec.yaml", Status: "renamed"}},
					Author: CommitAuthor{
						Date: now.Add(-1 * time.Hour),
					},
				}, nil
			case "aaa111":
				return &Commit{
					SHA:   sha,
					Files: []CommitFile{{Filename: "spec.yaml", Status: "modified"}},
					Author: CommitAuthor{
						Date: now.Add(-2 * time.Hour),
					},
				}, nil
			default:
				return nil, fmt.Errorf("unexpected sha: %s", sha)
			}
		},
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, ref string) (*FileContent, error) {
			fileContentCalls++
			return &FileContent{Content: base64.StdEncoding.EncodeToString([]byte("spec@" + ref))}, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", nil)

	require.NoError(t, err)
	require.Len(t, result, 1)
	assert.Equal(t, "aaa111", result[0].Commit.SHA)
	assert.Equal(t, []byte("spec@aaa111"), result[0].FileBytes)
	assert.Equal(t, 1, fileContentCalls)
}

func TestGetFileHistory_SizeCutoff(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "a@t.com", now.Add(-3*time.Hour), nil),
		makeTestCommit("bbb222", "second", "Bob", "b@t.com", now.Add(-2*time.Hour), nil),
		makeTestCommit("ccc333", "third", "Charlie", "c@t.com", now.Add(-1*time.Hour), nil),
	}

	large := base64.StdEncoding.EncodeToString(make([]byte, 30*1024*1024))
	mock := &mockHistoryAPI{
		commitList:  makeStaticCommitList(commits),
		commit:      makeCommitLookup(commits, "spec.yaml"),
		fileContent: makeStaticFileContent(large),
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{
		ForceCutoff:     true,
		SizeThresholdKB: 50000,
		MaxWorkers:      1,
	})

	require.NoError(t, err)
	require.Len(t, result, 1)
	assert.Equal(t, "aaa111", result[0].Commit.SHA)
}

func TestGetFileHistory_SizeCutoffUsesCommitOrder(t *testing.T) {
	now := time.Now()
	session := dummySession()
	defer session.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "a@t.com", now.Add(-3*time.Hour), nil),
		makeTestCommit("bbb222", "second", "Bob", "b@t.com", now.Add(-2*time.Hour), nil),
		makeTestCommit("ccc333", "third", "Charlie", "c@t.com", now.Add(-1*time.Hour), nil),
	}

	contents := map[string]string{
		"aaa111": base64.StdEncoding.EncodeToString(make([]byte, 15*1024)),
		"bbb222": base64.StdEncoding.EncodeToString(make([]byte, 10*1024)),
		"ccc333": base64.StdEncoding.EncodeToString(make([]byte, 10*1024)),
	}
	delays := map[string]time.Duration{
		"aaa111": 50 * time.Millisecond,
		"bbb222": 5 * time.Millisecond,
		"ccc333": 5 * time.Millisecond,
	}

	mock := &mockHistoryAPI{
		commitList: makeStaticCommitList(commits),
		commit:     makeCommitLookup(commits, "spec.yaml"),
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, ref string) (*FileContent, error) {
			time.Sleep(delays[ref])
			return &FileContent{Content: contents[ref]}, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{
		ForceCutoff:     true,
		SizeThresholdKB: 45,
		MaxWorkers:      3,
	})

	require.NoError(t, err)
	require.Len(t, result, 2)
	assert.Equal(t, "aaa111", result[0].Commit.SHA)
	assert.Equal(t, "bbb222", result[1].Commit.SHA)
}

func TestGetFileHistory_DownloadURLFallback(t *testing.T) {
	session := dummySession()
	defer session.Close()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("raw file"))
	}))
	defer server.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "alice@test.com", time.Now(), nil),
	}

	mock := &mockHistoryAPI{
		commitList: makeStaticCommitList(commits),
		commit:     makeCommitLookup(commits, "spec.yaml"),
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, _ string) (*FileContent, error) {
			return &FileContent{DownloadURL: server.URL}, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", nil)

	require.NoError(t, err)
	require.Len(t, result, 1)
	assert.Equal(t, []byte("raw file"), result[0].FileBytes)
}

func TestGetFileHistory_DownloadURLFallbackExceedsMaxSize(t *testing.T) {
	session := dummySession()
	defer session.Close()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(strings.Repeat("x", 9)))
	}))
	defer server.Close()

	commits := []Commit{
		makeTestCommit("aaa111", "first", "Alice", "alice@test.com", time.Now(), nil),
	}

	mock := &mockHistoryAPI{
		commitList: makeStaticCommitList(commits),
		commit:     makeCommitLookup(commits, "spec.yaml"),
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, _ string) (*FileContent, error) {
			return &FileContent{DownloadURL: server.URL}, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", &FileHistoryOptions{
		MaxDownloadSize: 8,
	})

	require.Error(t, err)
	assert.Nil(t, result)
	assert.Contains(t, err.Error(), "exceeds max download size")
}

func TestGetFileHistory_EmptyCommitList(t *testing.T) {
	session := dummySession()
	defer session.Close()

	mock := &mockHistoryAPI{
		commitList: func(_ context.Context, _ *GitHubSession, _, _, _ string, _ *CommitListOptions) ([]Commit, error) {
			return nil, nil
		},
		commit: func(_ context.Context, _ *GitHubSession, _, _, _ string) (*Commit, error) {
			t.Fatal("should not be called")
			return nil, nil
		},
		fileContent: func(_ context.Context, _ *GitHubSession, _, _, _, _ string) (*FileContent, error) {
			t.Fatal("should not be called")
			return nil, nil
		},
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", nil)

	require.NoError(t, err)
	assert.Nil(t, result)
}

func TestGetFileHistory_CommitListError(t *testing.T) {
	session := dummySession()
	defer session.Close()

	mock := &mockHistoryAPI{
		commitList: func(_ context.Context, _ *GitHubSession, _, _, _ string, _ *CommitListOptions) ([]Commit, error) {
			return nil, fmt.Errorf("api failure")
		},
		commit:      makeCommitLookup(nil, "spec.yaml"),
		fileContent: makeStaticFileContent(""),
	}

	result, err := getFileHistory(context.Background(), mock, session, "owner", "repo", "spec.yaml", nil)

	assert.Nil(t, result)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "failed to list commits")
}
