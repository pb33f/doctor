// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"time"
)

// Repository represents a GitHub repository containing metadata, ownership details,
// and repository statistics. All time fields use Go's time.Time for consistency.
type Repository struct {
	ID            int64     `json:"id"`
	Name          string    `json:"name"`
	FullName      string    `json:"full_name"`
	Description   string    `json:"description,omitempty"`
	Private       bool      `json:"private"`
	Fork          bool      `json:"fork"`
	URL           string    `json:"html_url"`
	CloneURL      string    `json:"clone_url"`
	SSHURL        string    `json:"ssh_url"`
	DefaultBranch string    `json:"default_branch"`
	Language      string    `json:"language,omitempty"`
	StarCount     int       `json:"stargazers_count"`
	ForkCount     int       `json:"forks_count"`
	Owner         User      `json:"owner"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	PushedAt      time.Time `json:"pushed_at"`
}

// Organization represents a GitHub organization with basic profile information
// and timestamps for creation and last update.
type Organization struct {
	ID          int64     `json:"id"`
	Login       string    `json:"login"`
	Name        string    `json:"name,omitempty"`
	Description string    `json:"description,omitempty"`
	URL         string    `json:"html_url"`
	AvatarURL   string    `json:"avatar_url"`
	Type        string    `json:"type"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// User represents a GitHub user account with profile information.
// This structure is used for repository owners, pull request authors, assignees, and commenters.
type User struct {
	ID        int64     `json:"id"`
	Login     string    `json:"login"`
	Name      string    `json:"name,omitempty"`
	Email     string    `json:"email,omitempty"`
	AvatarURL string    `json:"avatar_url"`
	URL       string    `json:"html_url"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PullRequest represents a GitHub pull request with complete metadata including
// branch information, review state, labels, and timestamps. MergedAt and ClosedAt
// are pointers to support nil values for open pull requests.
type PullRequest struct {
	ID        int64      `json:"id"`
	Number    int        `json:"number"`
	Title     string     `json:"title"`
	Body      string     `json:"body,omitempty"`
	State     string     `json:"state"`
	Draft     bool       `json:"draft"`
	Merged    bool       `json:"merged"`
	Mergeable bool       `json:"mergeable"`
	URL       string     `json:"html_url"`
	DiffURL   string     `json:"diff_url"`
	PatchURL  string     `json:"patch_url"`
	Head      Branch     `json:"head"`
	Base      Branch     `json:"base"`
	User      User       `json:"user"`
	Assignees []User     `json:"assignees"`
	Labels    []Label    `json:"labels"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	MergedAt  *time.Time `json:"merged_at,omitempty"`
	ClosedAt  *time.Time `json:"closed_at,omitempty"`
}

// Branch represents a GitHub branch reference used in pull requests.
// Contains the branch name, commit SHA, associated repository, and user information.
type Branch struct {
	Name  string     `json:"ref"`
	SHA   string     `json:"sha"`
	Repo  Repository `json:"repo"`
	User  User       `json:"user"`
	Label string     `json:"label"`
}

// Label represents a GitHub issue or pull request label with color and metadata.
// Used for categorizing and filtering issues and pull requests.
type Label struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Color       string `json:"color"`
	Default     bool   `json:"default"`
}

// Commit represents a GitHub commit with full details including author information,
// file changes, and statistics. Used for repository history and pull request commits.
type Commit struct {
	SHA       string       `json:"sha"`
	Message   string       `json:"message"`
	Author    CommitAuthor `json:"author"`
	Committer CommitAuthor `json:"committer"`
	URL       string       `json:"html_url"`
	Parents   []CommitRef  `json:"parents"`
	Stats     CommitStats  `json:"stats"`
	Files     []CommitFile `json:"files"`
	CreatedAt time.Time    `json:"created_at"`
}

// CommitAuthor represents the author or committer of a Git commit.
// Contains identity and timestamp information.
type CommitAuthor struct {
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Date  time.Time `json:"date"`
}

// CommitRef represents a lightweight reference to a Git commit.
// Used in commit parent relationships and tag references.
type CommitRef struct {
	SHA string `json:"sha"`
	URL string `json:"url"`
}

// CommitStats represents the statistical summary of changes in a commit.
// Provides counts for lines added, deleted, and total changes.
type CommitStats struct {
	Additions int `json:"additions"`
	Deletions int `json:"deletions"`
	Total     int `json:"total"`
}

// CommitFile represents a single file modification within a commit.
// Includes change statistics and URLs for accessing file content and diffs.
type CommitFile struct {
	Filename  string `json:"filename"`
	Status    string `json:"status"`
	Additions int    `json:"additions"`
	Deletions int    `json:"deletions"`
	Changes   int    `json:"changes"`
	BlobURL   string `json:"blob_url"`
	RawURL    string `json:"raw_url"`
	Patch     string `json:"patch,omitempty"`
}

// FileContent represents the content and metadata of a file retrieved from a GitHub repository.
// Includes file size, encoding type, and download URLs for accessing the raw content.
type FileContent struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	SHA         string `json:"sha"`
	Size        int    `json:"size"`
	Content     string `json:"content"`
	Encoding    string `json:"encoding"`
	Type        string `json:"type"`
	DownloadURL string `json:"download_url"`
	URL         string `json:"url"`
}

// Tag represents a Git tag in a GitHub repository.
// Provides access to tagged commit and downloadable archives.
type Tag struct {
	Name       string    `json:"name"`
	ZipballURL string    `json:"zipball_url"`
	TarballURL string    `json:"tarball_url"`
	Commit     CommitRef `json:"commit"`
}

// Comment represents a comment on a GitHub issue or pull request.
// Contains the comment content, author information, and timestamps.
type Comment struct {
	ID        int64     `json:"id"`
	Body      string    `json:"body"`
	User      User      `json:"user"`
	URL       string    `json:"html_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PullRequestComment represents a code review comment on a specific line in a pull request.
// Extends Comment with diff context, file path, and line position information.
type PullRequestComment struct {
	Comment
	PullRequestURL   string `json:"pull_request_url"`
	DiffHunk         string `json:"diff_hunk,omitempty"`
	Path             string `json:"path,omitempty"`
	Position         int    `json:"position,omitempty"`
	OriginalPosition int    `json:"original_position,omitempty"`
	CommitID         string `json:"commit_id,omitempty"`
	OriginalCommitID string `json:"original_commit_id,omitempty"`
}

// CreatePullRequestRequest represents the payload for creating a new pull request.
// Supports creating from branches, converting issues, and setting draft status.
type CreatePullRequestRequest struct {
	Title               string `json:"title"`
	Body                string `json:"body,omitempty"`
	Head                string `json:"head"`
	Base                string `json:"base"`
	MaintainerCanModify bool   `json:"maintainer_can_modify,omitempty"`
	Draft               bool   `json:"draft,omitempty"`
	Issue               int    `json:"issue,omitempty"`
}

// CreateTagRequest represents the payload for creating a Git tag.
// Supports both lightweight and annotated tags with optional tagger information.
type CreateTagRequest struct {
	Tag     string       `json:"tag"`
	Message string       `json:"message"`
	Object  string       `json:"object"`
	Type    string       `json:"type"`
	Tagger  CommitAuthor `json:"tagger,omitempty"`
}

// ListOptions provides common pagination parameters for GitHub API list operations.
// Used as a base for more specific list option types.
type ListOptions struct {
	Page    int `json:"page,omitempty"`
	PerPage int `json:"per_page,omitempty"`
}

// PullRequestListOptions extends ListOptions with pull request specific filtering.
// Supports filtering by state, branch references, and sorting options.
type PullRequestListOptions struct {
	ListOptions
	State     string `json:"state,omitempty"`
	Head      string `json:"head,omitempty"`
	Base      string `json:"base,omitempty"`
	Sort      string `json:"sort,omitempty"`
	Direction string `json:"direction,omitempty"`
}

// CommitListOptions extends ListOptions with commit history filtering.
// Supports filtering by SHA, file path, author, and date ranges.
type CommitListOptions struct {
	ListOptions
	SHA    string    `json:"sha,omitempty"`
	Path   string    `json:"path,omitempty"`
	Author string    `json:"author,omitempty"`
	Since  time.Time `json:"since,omitempty"`
	Until  time.Time `json:"until,omitempty"`
}
