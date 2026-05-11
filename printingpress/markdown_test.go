// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRenderMarkdown(t *testing.T) {
	assert.Equal(t, "", renderMarkdown("", false))
	assert.Contains(t, renderMarkdown("**bold**", false), "<strong>bold</strong>")
	assert.Contains(t, renderMarkdown("# Heading", false), "<h1")
	assert.Contains(t, renderMarkdown("[link](http://example.com)", false), `href="http://example.com"`)
}

func TestRenderMarkdown_GFM(t *testing.T) {
	md := "| A | B |\n|---|---|\n| 1 | 2 |"
	result := renderMarkdown(md, false)
	assert.Contains(t, result, "<table>")
}

func TestRenderMarkdown_FencedCodeHighlighted(t *testing.T) {
	md := "```json\n{\"key\": \"value\"}\n```"
	result := renderMarkdown(md, false)
	assert.Contains(t, result, `class="chroma"`)
	assert.Contains(t, result, "<span")
}

func TestRenderMarkdown_FencedCodeUntagged(t *testing.T) {
	md := "```\nplain text\n```"
	result := renderMarkdown(md, false)
	assert.Contains(t, result, "<pre")
	assert.Contains(t, result, "<code>")
	assert.NotContains(t, result, `class="chroma"`)
}
