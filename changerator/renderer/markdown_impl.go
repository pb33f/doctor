// Copyright 2025 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package renderer

// MarkdownRenderer implements ChangeReportRenderer for markdown output.
type MarkdownRenderer struct{}

// NewMarkdownRenderer creates a new markdown-only renderer.
func NewMarkdownRenderer() *MarkdownRenderer {
	return &MarkdownRenderer{}
}

// RenderMarkdown generates markdown using the existing MarkdownReporter implementation.
func (r *MarkdownRenderer) RenderMarkdown(input *RenderInput) (string, error) {
	return renderInputMarkdown(input)
}

// RenderHTML is not supported by the markdown-only renderer.
func (r *MarkdownRenderer) RenderHTML(input *RenderInput) (string, error) {
	return "", ErrHTMLNotSupported
}
