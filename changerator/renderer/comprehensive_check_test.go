// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestComprehensiveIndentationCheck verifies all rendering contexts handle code blocks correctly
func TestComprehensiveIndentationCheck(t *testing.T) {
	testCases := []struct {
		name           string
		markdown       string
		listMarkerPos  int
		expectedCodeAt int
	}{
		{
			name: "top_level_extension",
			markdown: `- Extension ` + "`x-test`" + ` removed:

  ` + "```yaml\n  data: test\n  ```",
			listMarkerPos:  0,
			expectedCodeAt: 2,
		},
		{
			name: "nested_parameter",
			markdown: `- Parameter ` + "`test`" + `:
  - ` + "`type`" + ` changed to:

    ` + "```yaml\n    type: string\n    ```",
			listMarkerPos:  2,
			expectedCodeAt: 4,
		},
		{
			name: "example_value_change",
			markdown: `- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`value`" + ` changed to:

      ` + "```yaml\n      data: test\n      ```",
			listMarkerPos:  4,
			expectedCodeAt: 6,
		},
		{
			name: "deep_nested_response_example",
			markdown: `- Response ` + "`200`" + `:
  - Content ` + "`application/json`" + `:
    - Example ` + "`Card`" + `:
      - ` + "`value`" + ` changed to:

        ` + "```yaml\n        amount: 49.99\n        ```",
			listMarkerPos:  6,
			expectedCodeAt: 8,
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

			// verify code fence was recognized
			if !strings.Contains(html, `<code class="language-yaml">`) {
				t.Errorf("❌ Code fence not recognized - expected code at %d spaces", tc.expectedCodeAt)
				t.Logf("Markdown:\n%s", tc.markdown)
				t.Logf("HTML:\n%s", html)
			} else {
				t.Logf("✅ Code fence recognized correctly")
			}

			// verify no broken patterns
			if strings.Contains(html, "</ul><pre><code>") ||
			   strings.Contains(html, "</code></pre><pre><code>") {
				t.Errorf("❌ BROKEN: List structure broken")
				t.Logf("HTML:\n%s", html)
			} else {
				t.Logf("✅ List structure intact")
			}
		})
	}
}
