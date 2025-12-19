// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestRealisticExtensionRendering tests extension rendering as it would actually be generated
func TestRealisticExtensionRendering(t *testing.T) {
	// simulate what formatChangeDescription returns for an extension with complex value
	changeDesc := "`x-speakeasy-retries` removed:\n\n```yaml\nbackoff:\n    exponent: 1.5\n    initialInterval: 500\nretryConnectionErrors: true\nstatusCodes:\n    - 5XX\nstrategy: test\n```"

	// simulate what renderChange does
	hasCodeBlock := true

	// apply indentation (what renderChange does now)
	if hasCodeBlock {
		changeDesc = indentMultilineDesc(changeDesc, 2)
	}

	// build the final markdown as renderChange would
	var markdown strings.Builder
	markdown.WriteString("- ")
	markdown.WriteString(changeDesc)

	// add breaking marker
	isBreaking := true
	if isBreaking {
		if hasCodeBlock {
			markdown.WriteString("\n\n")
		} else {
			markdown.WriteString(" ")
		}
		markdown.WriteString("**(💔 breaking)**")
	}
	markdown.WriteString("\n")

	markdownStr := markdown.String()

	t.Logf("Generated markdown:\n%s", markdownStr)

	// now test HTML conversion
	config := &RenderConfig{
		HTML: &HTMLConfig{
			EnableNestedListFix: true,
		},
	}

	renderer := NewHTMLRenderer(config)
	var buf strings.Builder
	err := renderer.markdown.Convert([]byte(markdownStr), &buf)
	require.NoError(t, err)

	html := buf.String()
	if config.HTML != nil {
		pp := &postProcessor{config: config.HTML}
		html = pp.process(html)
	}

	t.Logf("Generated HTML:\n%s", html)

	// verify the code block is properly closed BEFORE the breaking marker
	if strings.Contains(html, "```") {
		t.Errorf("❌ BROKEN: Raw markdown ``` appears in HTML")
	}

	// verify the breaking marker is OUTSIDE the code block
	if strings.Contains(html, "</code></pre><p><strong>(💔 breaking)</strong></p>") ||
	   strings.Contains(html, "</code></pre>\n<p><strong>(💔 breaking)</strong></p>") {
		t.Logf("✅ GOOD: Breaking marker is outside code block")
	} else if strings.Contains(html, "breaking)**</code></pre>") {
		t.Errorf("❌ BROKEN: Breaking marker is inside code block")
		// find and show the problematic section
		idx := strings.Index(html, "breaking)")
		if idx > 0 {
			start := idx - 200
			if start < 0 {
				start = 0
			}
			end := idx + 100
			if end > len(html) {
				end = len(html)
			}
			t.Logf("Context: %s", html[start:end])
		}
	}
}