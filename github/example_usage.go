// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"log"
	"time"
)

// ExampleUsage demonstrates how to use the GitHub service
func ExampleUsage() {
	// Create a GitHub service instance
	service := NewGitHubService()

	// Your GitHub token (in practice, this would come from environment variables or secure storage)
	token := "your_github_token_here"

	// Create a session with default configuration
	session := service.CreateSession(token, nil)

	// Create context
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Initialize the session (validates token and fetches user info)
	err := session.Initialize(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize session: %v", err)
	}

	// Get user information
	user, err := service.AuthenticateUser(ctx, session)
	if err != nil {
		log.Fatalf("Failed to authenticate user: %v", err)
	}
	fmt.Printf("Authenticated as: %s (%s)\n", user.Login, user.Name)

	// Get all user repositories
	repos, err := service.GetAllUserRepositories(ctx, session)
	if err != nil {
		log.Fatalf("Failed to fetch repositories: %v", err)
	}
	fmt.Printf("Found %d repositories\n", len(repos))

	// Example: Get a specific repository
	if len(repos) > 0 {
		repo := repos[0]
		fmt.Printf("First repository: %s (%s)\n", repo.FullName, repo.Description)

		// Get commits for the repository
		commits, err := service.GetCommitList(ctx, session, repo.Owner.Login, repo.Name, "", nil)
		if err != nil {
			log.Printf("Failed to fetch commits: %v", err)
		} else {
			fmt.Printf("Found %d commits\n", len(commits))
		}
	}

	// Get user organizations
	orgs, err := service.GetUserOrganizations(ctx, session)
	if err != nil {
		log.Printf("Failed to fetch organizations: %v", err)
	} else {
		fmt.Printf("Found %d organizations\n", len(orgs))
	}

	// Close the session when done
	session.Close()
}

// ExampleWithEventStreaming demonstrates event streaming
func ExampleWithEventStreaming() {
	// Create a GitHub service instance
	service := NewGitHubService()

	// Create custom configuration with event channels
	config := DefaultSessionConfig()
	config.EventChannels = NewEventChannels(100)

	// Create a session with custom configuration
	session := service.CreateSession("your_token_here", config)

	// Start event listeners
	go func() {
		for event := range session.GetEventChannels().Events {
			fmt.Printf("[EVENT] %s: %s\n", event.Type, event.Message)
		}
	}()

	go func() {
		for err := range session.GetEventChannels().Errors {
			fmt.Printf("[ERROR] %s: %s\n", err.Operation, err.Message)
		}
	}()

	// Now perform operations and watch events stream
	ctx := context.Background()

	// Initialize session (will generate events)
	err := session.Initialize(ctx)
	if err != nil {
		log.Printf("Failed to initialize: %v", err)
	}

	// Close the session when done
	session.Close()
}

// ExamplePullRequestWorkflow demonstrates a typical PR workflow
func ExamplePullRequestWorkflow() {
	service := NewGitHubService()
	session := service.CreateSession("your_token_here", nil)

	ctx := context.Background()

	// Initialize session
	err := session.Initialize(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize session: %v", err)
	}

	owner := "owner"
	repo := "repo"

	// Create a pull request
	prRequest := &CreatePullRequestRequest{
		Title: "Feature: Add new functionality",
		Body:  "This PR adds new functionality to the application",
		Head:  "feature-branch",
		Base:  "main",
		Draft: false,
	}

	pr, err := service.CreatePullRequest(ctx, session, owner, repo, prRequest)
	if err != nil {
		log.Fatalf("Failed to create PR: %v", err)
	}

	fmt.Printf("Created PR #%d: %s\n", pr.Number, pr.Title)

	// Add a comment to the PR
	comment, err := service.AddPullRequestComment(ctx, session, owner, repo, pr.Number, "Great work! LGTM 👍")
	if err != nil {
		log.Printf("Failed to add comment: %v", err)
	} else {
		fmt.Printf("Added comment: %s\n", comment.Body)
	}

	// Get PR comments
	comments, err := service.GetPullRequestComments(ctx, session, owner, repo, pr.Number)
	if err != nil {
		log.Printf("Failed to fetch comments: %v", err)
	} else {
		fmt.Printf("PR has %d comments\n", len(comments))
	}

	// Merge the PR (only if you have permissions)
	// mergedPR, err := service.MergePullRequest(ctx, session, owner, repo, pr.Number, "Merge feature branch")
	// if err != nil {
	//     log.Printf("Failed to merge PR: %v", err)
	// } else {
	//     fmt.Printf("PR merged: %s\n", mergedPR.State)
	// }

	session.Close()
}

// ExampleFileOperations demonstrates file operations
func ExampleFileOperations() {
	service := NewGitHubService()
	session := service.CreateSession("your_token_here", nil)

	ctx := context.Background()

	// Initialize session
	err := session.Initialize(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize session: %v", err)
	}

	owner := "owner"
	repo := "repo"
	filePath := "README.md"

	// Get file content
	content, err := service.GetFileContent(ctx, session, owner, repo, filePath, "main")
	if err != nil {
		log.Printf("Failed to get file content: %v", err)
	} else {
		fmt.Printf("File: %s (%d bytes)\n", content.Name, content.Size)
	}

	// Get commit history for the file
	commits, err := service.GetCommitList(ctx, session, owner, repo, filePath, nil)
	if err != nil {
		log.Printf("Failed to get commit history: %v", err)
	} else {
		fmt.Printf("File has %d commits\n", len(commits))
		if len(commits) > 0 {
			fmt.Printf("Latest commit: %s by %s\n", commits[0].Message, commits[0].Author.Name)
		}
	}

	session.Close()
}

// ExampleSessionMetadata demonstrates session metadata usage
func ExampleSessionMetadata() {
	service := NewGitHubService()
	session := service.CreateSession("your_token_here", nil)

	// Set custom metadata
	session.SetCustomMetadata("app_version", "1.0.0")
	session.SetCustomMetadata("user_role", "admin")

	ctx := context.Background()

	// Initialize session
	err := session.Initialize(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize session: %v", err)
	}

	// Get session metadata
	metadata := session.GetMetadata()
	fmt.Printf("Session for user: %s\n", metadata.UserLogin)
	fmt.Printf("Requests made: %d\n", metadata.RequestCount)
	fmt.Printf("Errors encountered: %d\n", metadata.ErrorCount)

	// Get custom metadata
	if version, exists := session.GetCustomMetadata("app_version"); exists {
		fmt.Printf("App version: %s\n", version)
	}

	if role, exists := session.GetCustomMetadata("user_role"); exists {
		fmt.Printf("User role: %s\n", role)
	}

	// Get rate limit information
	rateLimit := session.GetRateLimit()
	if rateLimit != nil {
		fmt.Printf("Rate limit: %d/%d remaining (resets at %s)\n",
			rateLimit.Remaining, rateLimit.Limit, rateLimit.Reset.Format(time.RFC3339))
	}

	session.Close()
}
