// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestIndentMultilineDesc tests the indentMultilineDesc function
func TestIndentMultilineDesc(t *testing.T) {
	testCases := []struct {
		name           string
		input          string
		indentSpaces   int
		expected       string
	}{
		{
			name: "code_block_should_be_fully_indented",
			input: "```yaml\ndata:\n  - item: test\n```",
			indentSpaces: 4,
			expected: "    ```yaml\n    data:\n      - item: test\n    ```",
		},
		{
			name: "regular_text_first_line_not_indented",
			input: "First line\nSecond line\nThird line",
			indentSpaces: 4,
			expected: "First line\n    Second line\n    Third line",
		},
		{
			name: "single_line_unchanged",
			input: "Single line",
			indentSpaces: 4,
			expected: "Single line",
		},
		{
			name: "zero_indent_unchanged",
			input: "Line 1\nLine 2",
			indentSpaces: 0,
			expected: "Line 1\nLine 2",
		},
		{
			name: "code_block_with_blank_line_before",
			input: "\n```yaml\ndata: test\n```",
			indentSpaces: 6,
			expected: "\n      ```yaml\n      data: test\n      ```",
		},
		{
			name: "mixed_content_after_colon",
			input: "value changed to:\n\n```yaml\ndata:\n  - test\n```",
			indentSpaces: 6,
			expected: "value changed to:\n      \n      ```yaml\n      data:\n        - test\n      ```",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := indentMultilineDesc(tc.input, tc.indentSpaces)

			if result != tc.expected {
				t.Logf("Input:\n%s", tc.input)
				t.Logf("Expected:\n%s", tc.expected)
				t.Logf("Got:\n%s", result)

				// show differences line by line
				expectedLines := strings.Split(tc.expected, "\n")
				resultLines := strings.Split(result, "\n")

				for i := 0; i < len(expectedLines) || i < len(resultLines); i++ {
					var exp, got string
					if i < len(expectedLines) {
						exp = expectedLines[i]
					}
					if i < len(resultLines) {
						got = resultLines[i]
					}
					if exp != got {
						t.Logf("Line %d differs:", i+1)
						t.Logf("  Expected: %q", exp)
						t.Logf("  Got:      %q", got)
					}
				}
			}

			assert.Equal(t, tc.expected, result)
		})
	}
}

// TestIndentCodeBlockIntegration tests how indentMultilineDesc works with actual change descriptions
func TestIndentCodeBlockIntegration(t *testing.T) {
	// simulate what formatValueChangeFromChange would return
	desc := "`value` changed to:\n\n```yaml\ndata:\n  - address: Berlin\n    id: 123\n```"

	// this is what would happen at line 1545 of markdown_reporter.go
	indented := indentMultilineDesc(desc, 6)

	// the expected markdown for a list item at indent level 3 (6 spaces)
	expected := "`value` changed to:\n      \n      ```yaml\n      data:\n        - address: Berlin\n          id: 123\n      ```"

	assert.Equal(t, expected, indented)

	// verify this creates valid markdown when used in a list
	markdown := "- Media Type `application/json`:\n  - Example `test`:\n    - " + indented + "\n  - `examples` removed"

	// the code block should be indented enough to stay within the list
	assert.Contains(t, markdown, "      ```yaml")
	assert.NotContains(t, markdown, "\n```yaml") // should not have unindented code block

	t.Logf("Generated markdown:\n%s", markdown)
}