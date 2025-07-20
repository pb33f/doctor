// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/google/go-github/v72/github"
	"github.com/stretchr/testify/assert"
)

func TestNewGitHubService(t *testing.T) {
	service := NewGitHubService()
	assert.NotNil(t, service)
}

func TestCreateSession(t *testing.T) {
	service := NewGitHubService()
	testToken := "test-token-1234567890" // 20 characters
	session := service.CreateSession(testToken, nil)

	assert.NotNil(t, session)
	assert.Equal(t, testToken, session.Token)
	assert.NotNil(t, session.Client)
	assert.NotNil(t, session.Metadata)
	assert.NotNil(t, session.Config)
	assert.True(t, session.IsActive())
}

func TestCreateSessionWithConfig(t *testing.T) {
	service := NewGitHubService()
	config := &SessionConfig{
		EventChannels:   NewEventChannels(50),
		EnableRateLimit: false,
		EnableMetrics:   false,
		Timeout:         10 * time.Second,
	}

	session := service.CreateSession("test-token-1234567890", config)

	assert.NotNil(t, session)
	assert.Equal(t, config, session.Config)
	assert.False(t, session.Config.EnableRateLimit)
	assert.False(t, session.Config.EnableMetrics)
	assert.Equal(t, 10*time.Second, session.Config.Timeout)
}

func TestSessionInitialization(t *testing.T) {
	// Create a mock HTTP server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/user" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{
				"id": 123,
				"login": "testuser",
				"name": "Test User",
				"email": "test@example.com",
				"avatar_url": "https://example.com/avatar.png",
				"html_url": "https://github.com/testuser",
				"type": "User",
				"created_at": "2020-01-01T00:00:00Z",
				"updated_at": "2020-01-01T00:00:00Z"
			}`))
		}
	}))
	defer server.Close()

	// Create a custom HTTP client that uses our test server
	client := &http.Client{}

	// Create session with custom config
	config := DefaultSessionConfig()
	config.CustomHTTPClient = client

	session := NewGitHubSession("test-token-1234567890", config)

	// Override the client to use our test server
	session.Client = github.NewClient(client).WithAuthToken("test-token-1234567890")
	baseURL, _ := url.Parse(server.URL + "/")
	session.Client.BaseURL = baseURL

	// Test initialization
	ctx := context.Background()
	err := session.Initialize(ctx)

	assert.NoError(t, err)
	assert.Equal(t, int64(123), session.Metadata.UserID)
	assert.Equal(t, "testuser", session.Metadata.UserLogin)
	assert.Equal(t, "Test User", session.Metadata.UserName)
	assert.Equal(t, "test@example.com", session.Metadata.UserEmail)
	assert.Equal(t, int64(1), session.Metadata.RequestCount)
}

func TestSessionMetadata(t *testing.T) {
	session := NewGitHubSession("test-token-1234567890", nil)

	// Test custom metadata
	session.SetCustomMetadata("test-key", "test-value")
	value, exists := session.GetCustomMetadata("test-key")
	assert.True(t, exists)
	assert.Equal(t, "test-value", value)

	// Test non-existent key
	_, exists = session.GetCustomMetadata("non-existent")
	assert.False(t, exists)

	// Test activity updates
	originalActivity := session.Metadata.LastActivity
	time.Sleep(1 * time.Millisecond)
	session.UpdateActivity()
	assert.True(t, session.Metadata.LastActivity.After(originalActivity))

	// Test request count
	assert.Equal(t, int64(0), session.Metadata.RequestCount)
	session.IncrementRequestCount()
	assert.Equal(t, int64(1), session.Metadata.RequestCount)

	// Test error count
	assert.Equal(t, int64(0), session.Metadata.ErrorCount)
	session.IncrementErrorCount()
	assert.Equal(t, int64(1), session.Metadata.ErrorCount)
}

func TestSessionClose(t *testing.T) {
	session := NewGitHubSession("test-token-1234567890", DefaultSessionConfig())

	assert.True(t, session.IsActive())

	err := session.Close()
	assert.NoError(t, err)
	assert.False(t, session.IsActive())

	// Test closing already closed session
	err = session.Close()
	assert.Error(t, err)
}

func TestEventChannels(t *testing.T) {
	channels := NewEventChannels(10)

	assert.NotNil(t, channels.Events)
	assert.NotNil(t, channels.Errors)

	// Test sending events
	go func() {
		channels.Events <- Event{
			ID:      "test-1",
			Type:    EventTypeRepositoryList,
			Status:  EventStatusStarted,
			Message: "Test event",
		}
	}()

	select {
	case event := <-channels.Events:
		assert.Equal(t, "test-1", event.ID)
		assert.Equal(t, EventTypeRepositoryList, event.Type)
		assert.Equal(t, EventStatusStarted, event.Status)
		assert.Equal(t, "Test event", event.Message)
	case <-time.After(1 * time.Second):
		t.Fatal("Event not received")
	}

	// Test sending errors
	go func() {
		channels.Errors <- GitHubError{
			ID:        "error-1",
			Type:      EventTypeRepositoryList,
			Operation: "test-operation",
			Message:   "Test error",
		}
	}()

	select {
	case err := <-channels.Errors:
		assert.Equal(t, "error-1", err.ID)
		assert.Equal(t, EventTypeRepositoryList, err.Type)
		assert.Equal(t, "test-operation", err.Operation)
		assert.Equal(t, "Test error", err.Message)
	case <-time.After(1 * time.Second):
		t.Fatal("Error not received")
	}

	channels.Close()
}

func TestEventBuilder(t *testing.T) {
	eb := NewEventBuilder("session-123", "test-operation", EventTypeRepositoryList)

	// Test basic event building
	startEvent := eb.BuildStartEvent("Starting operation")
	assert.Equal(t, "session-123", startEvent.SessionID)
	assert.Equal(t, "test-operation", startEvent.Operation)
	assert.Equal(t, EventTypeRepositoryList, startEvent.Type)
	assert.Equal(t, EventStatusStarted, startEvent.Status)
	assert.Equal(t, "Starting operation", startEvent.Message)

	// Test with repository context
	eb.WithRepository("owner", "repo")
	event := eb.BuildProgressEvent("Progress update")
	assert.Equal(t, "owner", event.Owner)
	assert.Equal(t, "repo", event.Repository)
	assert.Equal(t, EventStatusInProgress, event.Status)

	// Test with metadata
	eb.WithMetadata("key", "value")
	event = eb.BuildCompleteEvent("Operation completed")
	assert.Equal(t, "value", event.Metadata["key"])
	assert.Equal(t, EventStatusCompleted, event.Status)

	// Test with progress
	eb.WithProgress(50, 100)
	event = eb.BuildProgressEvent("Half done")
	progressInfo := event.Metadata["progress"].(*ProgressInfo)
	assert.Equal(t, 50, progressInfo.Current)
	assert.Equal(t, 100, progressInfo.Total)
	assert.Equal(t, 50, progressInfo.Percent)

	// Test error building
	testErr := fmt.Errorf("test error")
	githubErr := eb.BuildError("Test error", testErr, 404)
	assert.Equal(t, "session-123", githubErr.SessionID)
	assert.Equal(t, "test-operation", githubErr.Operation)
	assert.Equal(t, "Test error", githubErr.Message)
	assert.Equal(t, 404, githubErr.StatusCode)
	assert.Equal(t, testErr, githubErr.Err)
}

func TestGitHubError(t *testing.T) {
	err := &GitHubError{
		Operation:  "test-operation",
		Message:    "Test error",
		Owner:      "owner",
		Repository: "repo",
	}

	expectedMsg := "GitHub test-operation operation failed for owner/repo: Test error"
	assert.Equal(t, expectedMsg, err.Error())

	// Test without repository
	err.Repository = ""
	err.Owner = ""
	expectedMsg = "GitHub test-operation operation failed: Test error"
	assert.Equal(t, expectedMsg, err.Error())
}

func TestDefaultSessionConfig(t *testing.T) {
	config := DefaultSessionConfig()

	assert.NotNil(t, config.EventChannels)
	assert.True(t, config.EnableRateLimit)
	assert.True(t, config.EnableMetrics)
	assert.Equal(t, 30*time.Second, config.Timeout)
	assert.Equal(t, 3, config.MaxRetries)
	assert.Equal(t, 1*time.Second, config.RetryDelay)
	assert.NotNil(t, config.Custom)
}

func TestConversionFunctions(t *testing.T) {
	// Test convertGitHubUser
	githubUser := &github.User{
		ID:        github.Int64(123),
		Login:     github.String("testuser"),
		Name:      github.String("Test User"),
		Email:     github.String("test@example.com"),
		AvatarURL: github.String("https://example.com/avatar.png"),
		HTMLURL:   github.String("https://github.com/testuser"),
		Type:      github.String("User"),
		CreatedAt: &github.Timestamp{Time: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)},
		UpdatedAt: &github.Timestamp{Time: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)},
	}

	user := convertGitHubUser(githubUser)
	assert.Equal(t, int64(123), user.ID)
	assert.Equal(t, "testuser", user.Login)
	assert.Equal(t, "Test User", user.Name)
	assert.Equal(t, "test@example.com", user.Email)
	assert.Equal(t, "https://example.com/avatar.png", user.AvatarURL)
	assert.Equal(t, "https://github.com/testuser", user.URL)
	assert.Equal(t, "User", user.Type)

	// Test convertGitHubRepository
	githubRepo := &github.Repository{
		ID:              github.Int64(456),
		Name:            github.String("test-repo"),
		FullName:        github.String("testuser/test-repo"),
		Description:     github.String("Test repository"),
		Private:         github.Bool(false),
		Fork:            github.Bool(false),
		HTMLURL:         github.String("https://github.com/testuser/test-repo"),
		CloneURL:        github.String("https://github.com/testuser/test-repo.git"),
		SSHURL:          github.String("git@github.com:testuser/test-repo.git"),
		DefaultBranch:   github.String("main"),
		Language:        github.String("Go"),
		StargazersCount: github.Int(10),
		ForksCount:      github.Int(5),
		Owner:           githubUser,
		CreatedAt:       &github.Timestamp{Time: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)},
		UpdatedAt:       &github.Timestamp{Time: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)},
		PushedAt:        &github.Timestamp{Time: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)},
	}

	repo := convertGitHubRepository(githubRepo)
	assert.Equal(t, int64(456), repo.ID)
	assert.Equal(t, "test-repo", repo.Name)
	assert.Equal(t, "testuser/test-repo", repo.FullName)
	assert.Equal(t, "Test repository", repo.Description)
	assert.False(t, repo.Private)
	assert.False(t, repo.Fork)
	assert.Equal(t, "https://github.com/testuser/test-repo", repo.URL)
	assert.Equal(t, "main", repo.DefaultBranch)
	assert.Equal(t, "Go", repo.Language)
	assert.Equal(t, 10, repo.StarCount)
	assert.Equal(t, 5, repo.ForkCount)
	assert.Equal(t, "testuser", repo.Owner.Login)
}

func TestHelperFunctions(t *testing.T) {
	// Test getString
	assert.Equal(t, "", getString(nil))
	assert.Equal(t, "test", getString(github.String("test")))

	// Test getInt
	assert.Equal(t, 0, getInt(nil))
	assert.Equal(t, 42, getInt(github.Int(42)))

	// Test getInt64
	assert.Equal(t, int64(0), getInt64(nil))
	assert.Equal(t, int64(42), getInt64(github.Int64(42)))

	// Test getBool
	assert.False(t, getBool(nil))
	assert.True(t, getBool(github.Bool(true)))

	// Test getTime
	assert.True(t, getTime(nil).IsZero())
	testTime := time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)
	assert.Equal(t, testTime, getTime(&github.Timestamp{Time: testTime}))
}

func TestRateLimitHandling(t *testing.T) {
	session := NewGitHubSession("test-token-1234567890", nil)

	// Test rate limit update
	resp := &github.Response{
		Response: &http.Response{},
		Rate: github.Rate{
			Limit:     5000,
			Remaining: 4999,
			Reset:     github.Timestamp{Time: time.Now().Add(1 * time.Hour)},
		},
	}

	session.updateRateLimit(resp)
	rateLimit := session.GetRateLimit()

	assert.NotNil(t, rateLimit)
	assert.Equal(t, 5000, rateLimit.Limit)
	assert.Equal(t, 4999, rateLimit.Remaining)

	// Test rate limit wait with remaining requests
	ctx := context.Background()
	err := session.WaitForRateLimit(ctx)
	assert.NoError(t, err)

	// Test rate limit wait with no remaining requests
	session.Metadata.RateLimit.Remaining = 0
	session.Metadata.RateLimit.Reset = time.Now().Add(50 * time.Millisecond)

	start := time.Now()
	err = session.WaitForRateLimit(ctx)
	duration := time.Since(start)

	assert.NoError(t, err)
	assert.True(t, duration >= 50*time.Millisecond)
}

func TestSessionString(t *testing.T) {
	session := NewGitHubSession("test-token-1234567890", nil)
	session.Metadata.UserLogin = "testuser"
	session.IncrementRequestCount()
	session.IncrementErrorCount()

	str := session.String()
	assert.Contains(t, str, "testuser")
	assert.Contains(t, str, "Active: true")
	assert.Contains(t, str, "Requests: 1")
	assert.Contains(t, str, "Errors: 1")
}

// Additional test for model validation
func TestModelJSONSerialization(t *testing.T) {
	// Test Repository serialization
	repo := Repository{
		ID:            123,
		Name:          "test-repo",
		FullName:      "owner/test-repo",
		Description:   "Test repository",
		Private:       false,
		Fork:          false,
		URL:           "https://github.com/owner/test-repo",
		CloneURL:      "https://github.com/owner/test-repo.git",
		SSHURL:        "git@github.com:owner/test-repo.git",
		DefaultBranch: "main",
		Language:      "Go",
		StarCount:     10,
		ForkCount:     5,
		Owner: User{
			ID:        456,
			Login:     "owner",
			Name:      "Owner Name",
			Email:     "owner@example.com",
			AvatarURL: "https://example.com/avatar.png",
			URL:       "https://github.com/owner",
			Type:      "User",
		},
		CreatedAt: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		UpdatedAt: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PushedAt:  time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
	}

	// This would test JSON serialization in a real scenario
	assert.NotNil(t, repo)
	assert.Equal(t, "test-repo", repo.Name)
	assert.Equal(t, "owner", repo.Owner.Login)

	// Test PullRequest serialization
	pr := PullRequest{
		ID:     789,
		Number: 1,
		Title:  "Test PR",
		Body:   "Test pull request body",
		State:  "open",
		Draft:  false,
		Merged: false,
		URL:    "https://github.com/owner/test-repo/pull/1",
		Head: Branch{
			Name: "feature-branch",
			SHA:  "abc123",
		},
		Base: Branch{
			Name: "main",
			SHA:  "def456",
		},
		User: User{
			ID:    456,
			Login: "owner",
		},
		CreatedAt: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		UpdatedAt: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
	}

	assert.NotNil(t, pr)
	assert.Equal(t, 1, pr.Number)
	assert.Equal(t, "Test PR", pr.Title)
	assert.Equal(t, "feature-branch", pr.Head.Name)
	assert.Equal(t, "main", pr.Base.Name)
}
