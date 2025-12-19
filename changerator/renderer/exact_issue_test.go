// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestExactIssueFromOutput tests the exact pattern we're seeing in the broken output
func TestExactIssueFromOutput(t *testing.T) {
	// this is exactly what's happening - the indented line after the code block
	// is being treated as a code block itself
	markdown := `#### **GET** ` + "`/stations`" + `

**Responses:**

- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`value`" + ` added:

` + "```yaml" + `
data:
  - address: Invalidenstraße 10557 Berlin, Germany
    country_code: DE
    id: efdbb9d1-02c2-4bc3-afb7-6788d8782b1e
  - address: 18 Rue de Dunkerque 75010 Paris, France
    country_code: FR
    id: b2e783e1-c824-4d63-b37a-d8d698862f1d
    name: Paris Gare du Nord
    timezone: Europe/Paris
links:
  next: https://api.example.com/stations?page=3
  prev: https://api.example.com/stations?page=1
  self: https://api.example.com/stations&page=2
` + "```" + `
  - ` + "`examples`" + ` removed *'default'*`

	testCases := []struct {
		name            string
		enableFix       bool
	}{
		{
			name:      "without_fix",
			enableFix: false,
		},
		{
			name:      "with_fix",
			enableFix: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := &RenderConfig{
				HTML: &HTMLConfig{
					EnableNestedListFix: tc.enableFix,
				},
			}

			renderer := NewHTMLRenderer(config)
			var buf strings.Builder
			err := renderer.markdown.Convert([]byte(markdown), &buf)
			require.NoError(t, err)

			html := buf.String()
			if config.HTML != nil {
				pp := &postProcessor{config: config.HTML}
				html = pp.process(html)
			}

			t.Logf("EnableFix: %v", tc.enableFix)

			// check if the 'examples' line is wrongly treated as a code block
			if strings.Contains(html, "<pre><code>  - `examples`") ||
			   strings.Contains(html, "<pre><code>  - <code") ||
			   strings.Contains(html, "</code></pre><pre><code>") {
				t.Logf("❌ BROKEN: 'examples' line is being rendered as a code block")
				// find and log the problematic section
				idx := strings.Index(html, "examples")
				if idx > 0 {
					start := idx - 100
					if start < 0 {
						start = 0
					}
					end := idx + 100
					if end > len(html) {
						end = len(html)
					}
					t.Logf("Context around 'examples':\n%s", html[start:end])
				}
			} else {
				t.Logf("✅ GOOD: 'examples' line is properly rendered as a list item")
			}

			// log full HTML for inspection
			t.Logf("Full HTML:\n%s", html)
		})
	}
}

// TestMarkdownIndentationAfterCodeBlock tests the specific case where indentation after code block breaks
func TestMarkdownIndentationAfterCodeBlock(t *testing.T) {
	// test with code block NOT indented within the list (incorrect markdown)
	brokenMarkdown := `- Response 200:
  - Content application/json:
    - Example value added:

` + "```yaml" + `
data:
  - item: test
` + "```" + `
  - Property removed`

	// test with code block properly indented (correct markdown)
	correctMarkdown := `- Response 200:
  - Content application/json:
    - Example value added:

      ` + "```yaml" + `
      data:
        - item: test
      ` + "```" + `
  - Property removed`

	testCases := []struct {
		name     string
		markdown string
		label    string
	}{
		{
			name:     "broken_indentation",
			markdown: brokenMarkdown,
			label:    "Code block not indented",
		},
		{
			name:     "correct_indentation",
			markdown: correctMarkdown,
			label:    "Code block properly indented",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// test with fix disabled
			configNoFix := &RenderConfig{
				HTML: &HTMLConfig{
					EnableNestedListFix: false,
				},
			}

			renderer := NewHTMLRenderer(configNoFix)
			var buf strings.Builder
			err := renderer.markdown.Convert([]byte(tc.markdown), &buf)
			require.NoError(t, err)

			html := buf.String()

			t.Logf("%s - No Fix:", tc.label)
			if strings.Contains(html, "<pre><code>  - Property") ||
			   strings.Contains(html, "</code></pre><pre><code>") {
				t.Logf("  ❌ BROKEN: List item rendered as code block")
			} else {
				t.Logf("  ✅ GOOD: List item rendered correctly")
			}

			// test with fix enabled
			configWithFix := &RenderConfig{
				HTML: &HTMLConfig{
					EnableNestedListFix: true,
				},
			}

			renderer2 := NewHTMLRenderer(configWithFix)
			var buf2 strings.Builder
			err = renderer2.markdown.Convert([]byte(tc.markdown), &buf2)
			require.NoError(t, err)

			html2 := buf2.String()
			if configWithFix.HTML != nil {
				pp := &postProcessor{config: configWithFix.HTML}
				html2 = pp.process(html2)
			}

			t.Logf("%s - With Fix:", tc.label)
			if strings.Contains(html2, "<pre><code>  - Property") ||
			   strings.Contains(html2, "</code></pre><pre><code>") {
				t.Logf("  ❌ BROKEN: List item rendered as code block")
			} else {
				t.Logf("  ✅ GOOD: List item rendered correctly")
			}
		})
	}
}