// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestFinalVerification tests the complete markdown generation pattern end-to-end
func TestFinalVerification(t *testing.T) {
	// Test cases covering all the scenarios that were breaking
	testCases := []struct {
		name     string
		markdown string
	}{
		{
			name: "request_body_media_type_with_examples_property",
			markdown: `**Request Body:**

- Media Type ` + "`application/json`" + `:
  - Example ` + "`Card`" + `:
    - ` + "`value`" + ` changed to:

      ` + "```yaml" + `
      amount: 49.99
      currency: gbp
      ` + "```" + `
  - ` + "`examples`" + ` removed *'default'*`,
		},
		{
			name: "response_media_type_with_examples_property",
			markdown: `**Responses:**

- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`value`" + ` added:

      ` + "```yaml" + `
      data:
          - address: Berlin
            id: 123
      ` + "```" + `
    - ` + "`examples`" + ` removed *'default'*`,
		},
		{
			name: "extension_with_complex_value",
			markdown: `### Extensions

---

#### Document Extensions

- Extension ` + "`x-speakeasy-retries`" + ` removed:

  ` + "```yaml" + `
  backoff:
      exponent: 1.5
      initialInterval: 500
  ` + "```" + `

**(💔 breaking)**`,
		},
		{
			name: "nested_response_example_with_multiple_value_changes",
			markdown: `- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`Card`" + `:
      - ` + "`value`" + ` changed to:

        ` + "```yaml" + `
        amount: 49.99
        ` + "```" + `
      - ` + "`value`" + ` changed to:

        ` + "```yaml" + `
        amount: 99.99
        ` + "```" + ``,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := &RenderConfig{
				HTML: &HTMLConfig{
					EnableNestedListFix: true,
				},
			}

			renderer := NewHTMLRenderer(config)
			var buf strings.Builder
			err := renderer.markdown.Convert([]byte(tc.markdown), &buf)
			require.NoError(t, err)

			html := buf.String()
			if config.HTML != nil {
				pp := &postProcessor{config: config.HTML}
				html = pp.process(html)
			}

			// Check for all known broken patterns
			brokenPatterns := []string{
				"</code></pre><pre><code>",
				"</div><pre><code>",
				"</ul><pre><code>",
				"``` **",  // raw markdown in HTML
				"```\n**", // raw markdown in HTML
			}

			foundBroken := false
			for _, pattern := range brokenPatterns {
				if strings.Contains(html, pattern) {
					t.Errorf("❌ Found broken pattern: %s", pattern)
					foundBroken = true

					// Show context
					idx := strings.Index(html, pattern)
					if idx > 0 {
						start := idx - 100
						if start < 0 {
							start = 0
						}
						end := idx + len(pattern) + 100
						if end > len(html) {
							end = len(html)
						}
						t.Logf("Context: %s", html[start:end])
					}
				}
			}

			if !foundBroken {
				t.Logf("✅ No broken patterns found")
			}

			// Verify code fences are recognized
			if strings.Contains(tc.markdown, "```yaml") {
				if !strings.Contains(html, `<code class="language-yaml">`) {
					t.Errorf("❌ Code fence not recognized")
				} else {
					t.Logf("✅ Code fence recognized")
				}
			}
		})
	}
}
