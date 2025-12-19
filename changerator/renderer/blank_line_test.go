// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestBlankLineBeforeCodeBlock tests if blank lines before code blocks break list continuation
func TestBlankLineBeforeCodeBlock(t *testing.T) {
	testCases := []struct {
		name           string
		markdown       string
		expectCodeInList bool
	}{
		{
			name: "no_blank_line",
			markdown: `- Item:
  ` + "```yaml\n  data: test\n  ```",
			expectCodeInList: true,
		},
		{
			name: "one_blank_line",
			markdown: `- Item:

  ` + "```yaml\n  data: test\n  ```",
			expectCodeInList: true,
		},
		{
			name: "nested_list_no_blank",
			markdown: `- Outer:
  - Inner:
    ` + "```yaml\n    data: test\n    ```",
			expectCodeInList: true,
		},
		{
			name: "nested_list_with_blank",
			markdown: `- Outer:
  - Inner:

    ` + "```yaml\n    data: test\n    ```",
			expectCodeInList: true,
		},
		{
			name: "deep_nested_with_blank",
			markdown: `- Level1:
  - Level2:
    - Level3:

      ` + "```yaml\n      data: test\n      ```",
			expectCodeInList: true,
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

			t.Logf("Markdown:\n%s", tc.markdown)
			t.Logf("HTML:\n%s", html)

			// Check if code block is within a list
			codeInList := !strings.Contains(html, "</ul><pre><code>") &&
				!strings.Contains(html, "</ul>\n<pre><code>") &&
				!strings.Contains(html, "</li>\n</ul>\n<pre><code>")

			if tc.expectCodeInList && !codeInList {
				t.Errorf("❌ Code block should be in list but is outside")
			} else if !tc.expectCodeInList && codeInList {
				t.Errorf("❌ Code block should be outside list but is inside")
			} else {
				t.Logf("✅ Code block position correct")
			}
		})
	}
}
