// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

// MarkdownRenderer implements ChangeReportRenderer for markdown output.
type MarkdownRenderer struct{}

// NewMarkdownRenderer creates a new markdown-only renderer.
func NewMarkdownRenderer() *MarkdownRenderer {
	return &MarkdownRenderer{}
}

// RenderMarkdown generates markdown using the existing MarkdownReporter implementation.
func (r *MarkdownRenderer) RenderMarkdown(input *RenderInput) (string, error) {
	if input == nil {
		return "", ErrInvalidInput
	}

	if input.DocumentChanges == nil {
		return "# What Changed?\n\nNo changes detected between the API versions.\n\n", nil
	}

	reporter := NewMarkdownReporter(
		input.DocumentChanges,
		input.Doctor,
		input.RightDocContent,
		input.Config,
	)

	return reporter.Generate(), nil
}

// RenderHTML is not supported by the markdown-only renderer.
func (r *MarkdownRenderer) RenderHTML(input *RenderInput) (string, error) {
	return "", ErrHTMLNotSupported
}
