// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestExtensionCodeBlockIndentation tests that extension code blocks are properly indented
func TestExtensionCodeBlockIndentation(t *testing.T) {
	// this mimics what happens when an extension with a complex value is rendered
	markdown := `### Extensions

---

#### Document Extensions

- Extension ` + "`x-speakeasy-retries`" + ` removed:

  ` + "```yaml" + `
  backoff:
      exponent: 1.5
      initialInterval: 500
      maxElapsedTime: 3600000
      maxInterval: 60000
  retryConnectionErrors: true
  statusCodes:
      - 5XX
  strategy: burgers and chips and eggs beans and cake and pizza and nice shoes
  ` + "```" + ` **(💔 breaking)**
- Extension ` + "`x-topics`" + ` removed:

  ` + "```yaml" + `
  - content:
      $ref: ./docs/getting-started.md
    title: Getting started nice gams. and slams jams.
  ` + "```" + ` **(💔 breaking)**
`

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

	// check that code blocks are properly within list items, not outside
	t.Logf("HTML Output:\n%s", html)

	// verify no broken patterns
	if strings.Contains(html, "</ul><pre><code>") ||
	   strings.Contains(html, "</ul>\n<pre><code>") {
		t.Errorf("❌ BROKEN: Code block is outside the list structure")
	} else {
		t.Logf("✅ GOOD: Code blocks are within list structure")
	}

	// verify the code blocks are actually rendered as code blocks
	if !strings.Contains(html, `<code class="language-yaml">`) {
		t.Errorf("❌ BROKEN: Code fence not recognized - raw markdown may be showing")
	} else {
		t.Logf("✅ GOOD: Code fences properly recognized")
	}
}