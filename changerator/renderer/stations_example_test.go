// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestStationsExampleIssue tests the exact failing case from GET /stations Response 200
func TestStationsExampleIssue(t *testing.T) {
	// this is the exact markdown structure that was causing the issue
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

	t.Logf("Generated HTML:\n%s", html)

	// the specific broken pattern that was appearing
	brokenPatterns := []string{
		"</code></pre><pre><code>  - `examples`",
		"</div><pre><code>  - `examples`",
		"</code></pre><pre><code>  - 'examples'",
	}

	foundBroken := false
	for _, pattern := range brokenPatterns {
		if strings.Contains(html, pattern) {
			t.Errorf("❌ BROKEN: Found pattern: %s", pattern)
			foundBroken = true
		}
	}

	if !foundBroken {
		t.Logf("✅ GOOD: No broken patterns found")
	}

	// verify the 'examples' line is properly rendered as a list item
	if strings.Contains(html, "<li") && strings.Contains(html, "examples") && strings.Contains(html, "removed") {
		t.Logf("✅ GOOD: 'examples' appears to be rendered as a list item")
	}

	// verify code fence was recognized
	if !strings.Contains(html, `<code class="language-yaml">`) {
		t.Errorf("❌ BROKEN: Code fence not recognized")
	} else {
		t.Logf("✅ GOOD: Code fence recognized")
	}
}
