// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

// AuthenticationService defines GitHub user authentication operations.
// Provides methods for validating tokens and retrieving authenticated user information
// with comprehensive error handling and event reporting.
type AuthenticationService interface {
	AuthenticateUser(ctx context.Context, session *GitHubSession) (*User, error)
}

// AuthenticateUser validates the session token and retrieves authenticated user information.
// Returns complete user profile data including ID, login, name, email, and account details.
// This operation validates that the session token is valid and has appropriate permissions.
func (s *gitHubService) AuthenticateUser(ctx context.Context, session *GitHubSession) (*User, error) {
	if err := ValidateSession(session); err != nil {
		return nil, err
	}

	rh := NewRequestHandler(session, "authenticate_user", EventTypeAuthUser)
	if rh == nil {
		return nil, fmt.Errorf("failed to create request handler")
	}

	rh.SendStartEvent("Authenticating user")

	result, err := FetchSingle(ctx, rh,
		func() (*github.User, *github.Response, error) {
			return session.Client.Users.Get(ctx, "")
		},
		convertGitHubUser,
		"Failed to authenticate user",
	)

	if err != nil {
		return nil, err
	}

	rh.SendCompleteEvent(fmt.Sprintf("User authenticated: %s", result.Login))
	return result, nil
}
