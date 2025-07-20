// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"time"

	"github.com/google/go-github/v72/github"
)

// convertGitHubUser converts a GitHub user to internal User type
func convertGitHubUser(user *github.User) *User {
	if user == nil {
		return &User{}
	}

	result := &User{
		ID:        getInt64(user.ID),
		Login:     getString(user.Login),
		Name:      getString(user.Name),
		Email:     getString(user.Email),
		AvatarURL: getString(user.AvatarURL),
		URL:       getString(user.HTMLURL),
		Type:      getString(user.Type),
		CreatedAt: getTime(user.CreatedAt),
		UpdatedAt: getTime(user.UpdatedAt),
	}
	return result
}

// convertGitHubRepository converts a GitHub repository to internal Repository type
func convertGitHubRepository(repo *github.Repository) Repository {
	if repo == nil {
		return Repository{}
	}

	result := Repository{
		ID:            getInt64(repo.ID),
		Name:          getString(repo.Name),
		FullName:      getString(repo.FullName),
		Description:   getString(repo.Description),
		Private:       getBool(repo.Private),
		Fork:          getBool(repo.Fork),
		URL:           getString(repo.HTMLURL),
		CloneURL:      getString(repo.CloneURL),
		SSHURL:        getString(repo.SSHURL),
		DefaultBranch: getString(repo.DefaultBranch),
		Language:      getString(repo.Language),
		StarCount:     getInt(repo.StargazersCount),
		ForkCount:     getInt(repo.ForksCount),
		CreatedAt:     getTime(repo.CreatedAt),
		UpdatedAt:     getTime(repo.UpdatedAt),
		PushedAt:      getTime(repo.PushedAt),
	}

	if repo.Owner != nil {
		result.Owner = *convertGitHubUser(repo.Owner)
	}

	return result
}

// convertGitHubOrganization converts a GitHub organization to internal Organization type
func convertGitHubOrganization(org *github.Organization) Organization {
	if org == nil {
		return Organization{}
	}

	return Organization{
		ID:          getInt64(org.ID),
		Login:       getString(org.Login),
		Name:        getString(org.Name),
		Description: getString(org.Description),
		URL:         getString(org.HTMLURL),
		AvatarURL:   getString(org.AvatarURL),
		Type:        getString(org.Type),
		CreatedAt:   getTime(org.CreatedAt),
		UpdatedAt:   getTime(org.UpdatedAt),
	}
}

// convertGitHubCommit converts a GitHub commit to internal Commit type
func convertGitHubCommit(commit *github.RepositoryCommit) Commit {
	if commit == nil {
		return Commit{}
	}

	result := Commit{
		SHA: getString(commit.SHA),
		URL: getString(commit.HTMLURL),
	}

	if commit.Commit != nil {
		result.Message = getString(commit.Commit.Message)

		if commit.Commit.Author != nil {
			result.Author = CommitAuthor{
				Name:  getString(commit.Commit.Author.Name),
				Email: getString(commit.Commit.Author.Email),
				Date:  getTime(commit.Commit.Author.Date),
			}
			result.CreatedAt = getTime(commit.Commit.Author.Date)
		}

		if commit.Commit.Committer != nil {
			result.Committer = CommitAuthor{
				Name:  getString(commit.Commit.Committer.Name),
				Email: getString(commit.Commit.Committer.Email),
				Date:  getTime(commit.Commit.Committer.Date),
			}
		}
	}

	// Convert parents (avoid allocation if empty)
	if commit.Parents != nil && len(commit.Parents) > 0 {
		result.Parents = make([]CommitRef, len(commit.Parents))
		for i, parent := range commit.Parents {
			result.Parents[i] = CommitRef{
				SHA: getString(parent.SHA),
				URL: getString(parent.URL),
			}
		}
	}

	// Convert stats
	if commit.Stats != nil {
		result.Stats = CommitStats{
			Additions: getInt(commit.Stats.Additions),
			Deletions: getInt(commit.Stats.Deletions),
			Total:     getInt(commit.Stats.Total),
		}
	}

	// Convert files (avoid allocation if empty)
	if commit.Files != nil && len(commit.Files) > 0 {
		result.Files = make([]CommitFile, len(commit.Files))
		for i, file := range commit.Files {
			result.Files[i] = CommitFile{
				Filename:  getString(file.Filename),
				Status:    getString(file.Status),
				Additions: getInt(file.Additions),
				Deletions: getInt(file.Deletions),
				Changes:   getInt(file.Changes),
				BlobURL:   getString(file.BlobURL),
				RawURL:    getString(file.RawURL),
				Patch:     getString(file.Patch),
			}
		}
	}

	return result
}

// convertGitHubFileContent converts GitHub file content to internal FileContent type
func convertGitHubFileContent(content *github.RepositoryContent) *FileContent {
	if content == nil {
		return &FileContent{}
	}

	return &FileContent{
		Name:        getString(content.Name),
		Path:        getString(content.Path),
		SHA:         getString(content.SHA),
		Size:        getInt(content.Size),
		Content:     getString(content.Content),
		Encoding:    getString(content.Encoding),
		Type:        getString(content.Type),
		DownloadURL: getString(content.DownloadURL),
		URL:         getString(content.URL),
	}
}

// convertGitHubPullRequest converts GitHub pull request to internal PullRequest type
func convertGitHubPullRequest(pr *github.PullRequest) PullRequest {
	if pr == nil {
		return PullRequest{}
	}

	result := PullRequest{
		ID:        getInt64(pr.ID),
		Number:    getInt(pr.Number),
		Title:     getString(pr.Title),
		Body:      getString(pr.Body),
		State:     getString(pr.State),
		Draft:     getBool(pr.Draft),
		Merged:    getBool(pr.Merged),
		Mergeable: getBool(pr.Mergeable),
		URL:       getString(pr.HTMLURL),
		DiffURL:   getString(pr.DiffURL),
		PatchURL:  getString(pr.PatchURL),
		CreatedAt: getTime(pr.CreatedAt),
		UpdatedAt: getTime(pr.UpdatedAt),
	}

	if pr.MergedAt != nil {
		mergedAt := getTime(pr.MergedAt)
		result.MergedAt = &mergedAt
	}

	if pr.ClosedAt != nil {
		closedAt := getTime(pr.ClosedAt)
		result.ClosedAt = &closedAt
	}

	// Convert head and base branches
	if pr.Head != nil {
		result.Head = convertBranch(pr.Head)
	}
	if pr.Base != nil {
		result.Base = convertBranch(pr.Base)
	}

	// Convert user
	if pr.User != nil {
		result.User = *convertGitHubUser(pr.User)
	}

	// Convert assignees
	if pr.Assignees != nil {
		result.Assignees = make([]User, len(pr.Assignees))
		for i, assignee := range pr.Assignees {
			result.Assignees[i] = *convertGitHubUser(assignee)
		}
	}

	// Convert labels
	if pr.Labels != nil {
		result.Labels = make([]Label, len(pr.Labels))
		for i, label := range pr.Labels {
			result.Labels[i] = Label{
				ID:          getInt64(label.ID),
				Name:        getString(label.Name),
				Description: getString(label.Description),
				Color:       getString(label.Color),
				Default:     getBool(label.Default),
			}
		}
	}

	return result
}

// convertBranch converts GitHub branch to internal Branch type
func convertBranch(branch *github.PullRequestBranch) Branch {
	if branch == nil {
		return Branch{}
	}

	result := Branch{
		Name:  getString(branch.Ref),
		SHA:   getString(branch.SHA),
		Label: getString(branch.Label),
	}

	if branch.Repo != nil {
		result.Repo = convertGitHubRepository(branch.Repo)
	}

	if branch.User != nil {
		result.User = *convertGitHubUser(branch.User)
	}

	return result
}

// convertGitHubComment converts GitHub comment to internal Comment type
func convertGitHubComment(comment *github.IssueComment) *Comment {
	if comment == nil {
		return &Comment{}
	}

	result := &Comment{
		ID:        getInt64(comment.ID),
		Body:      getString(comment.Body),
		URL:       getString(comment.HTMLURL),
		CreatedAt: getTime(comment.CreatedAt),
		UpdatedAt: getTime(comment.UpdatedAt),
	}

	if comment.User != nil {
		result.User = *convertGitHubUser(comment.User)
	}

	return result
}

// convertGitHubTag converts GitHub tag to internal Tag type
func convertGitHubTag(tag *github.RepositoryTag) Tag {
	if tag == nil {
		return Tag{}
	}

	result := Tag{
		Name:       getString(tag.Name),
		ZipballURL: getString(tag.ZipballURL),
		TarballURL: getString(tag.TarballURL),
	}

	if tag.Commit != nil {
		result.Commit = CommitRef{
			SHA: getString(tag.Commit.SHA),
			URL: getString(tag.Commit.URL),
		}
	}

	return result
}

// convertGitHubCreateTag converts GitHub create tag response to internal Tag type
func convertGitHubCreateTag(tag *github.Tag) Tag {
	if tag == nil {
		return Tag{}
	}

	result := Tag{
		Name: getString(tag.Tag),
	}

	if tag.Object != nil {
		result.Commit = CommitRef{
			SHA: getString(tag.Object.SHA),
		}
	}

	return result
}

// Helper functions for safe pointer dereferencing with inline nil checks

func getString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func getInt(i *int) int {
	if i == nil {
		return 0
	}
	return *i
}

func getInt64(i *int64) int64 {
	if i == nil {
		return 0
	}
	return *i
}

func getBool(b *bool) bool {
	if b == nil {
		return false
	}
	return *b
}

func getTime(t *github.Timestamp) time.Time {
	if t == nil {
		return time.Time{}
	}
	return t.Time
}
