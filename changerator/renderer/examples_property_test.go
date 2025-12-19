// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestMediaTypeExamplesProperty tests rendering of media type "examples" property changes
func TestMediaTypeExamplesProperty(t *testing.T) {
	// When an example is added/removed at the media type level, it comes through as a property change
	// with property="examples" and value=example name

	// Simulate what the markdown reporter would generate
	// This is what renderMediaTypePropertyChanges does

	// For context, this appears after a YAML code block for an example value
	markdown := `- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`value`" + ` added:

      ` + "```yaml" + `
      data:
        - item: test
      ` + "```" + `
    - ` + "`examples`" + ` removed *'default'*`

	config := &RenderConfig{
		HTML: &HTMLConfig{
			EnableNestedListFix: true,
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

	t.Logf("Markdown:\n%s", markdown)
	t.Logf("HTML:\n%s", html)

	// Check for the broken pattern
	if strings.Contains(html, "<pre><code>  - `examples`") ||
	   strings.Contains(html, "</code></pre><pre><code>") {
		t.Errorf("❌ BROKEN: 'examples' property rendered as code block")
	} else {
		t.Logf("✅ GOOD: 'examples' property rendered as list item")
	}

	// Verify it's a proper list item
	if strings.Contains(html, "<li") && strings.Contains(html, "examples") && strings.Contains(html, "removed") {
		t.Logf("✅ GOOD: Found as <li> element")
	}
}
