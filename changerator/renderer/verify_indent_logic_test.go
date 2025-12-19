// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// TestIndentLogicWithRealFormat verifies indentMultilineDesc with actual formatValueChangeFromChange output
func TestIndentLogicWithRealFormat(t *testing.T) {
	// This is EXACTLY what formatValueChangeFromChange returns (line 2019)
	input := "`value` changed to:\n\n```yaml\ndata:\n  - item: test\n```"

	// Apply 6-space indentation (what we use for response examples at line 1606)
	result := indentMultilineDesc(input, 6)

	t.Logf("Input:\n%s", input)
	t.Logf("\nResult:\n%s", result)

	// Parse and verify each line
	lines := strings.Split(result, "\n")

	expectations := []struct {
		lineNum int
		content string
		indent  int
	}{
		{0, "`value` changed to:", 0},  // first line not indented
		{1, "", 6},                       // blank line indented
		{2, "```yaml", 6},               // code fence indented
		{3, "data:", 6},                 // code content indented
		{4, "  - item: test", 6},        // code content indented
		{5, "```", 6},                   // closing fence indented
	}

	for _, exp := range expectations {
		if exp.lineNum >= len(lines) {
			t.Errorf("❌ Missing line %d", exp.lineNum)
			continue
		}

		line := lines[exp.lineNum]
		actualIndent := len(line) - len(strings.TrimLeft(line, " "))
		expectedContent := strings.Repeat(" ", exp.indent) + exp.content

		if line != expectedContent {
			t.Errorf("❌ Line %d mismatch:", exp.lineNum)
			t.Logf("   Expected: %q (indent=%d)", expectedContent, exp.indent)
			t.Logf("   Got:      %q (indent=%d)", line, actualIndent)
		} else {
			t.Logf("✅ Line %d correct: %q (indent=%d)", exp.lineNum, exp.content, actualIndent)
		}
	}

	// Now test that this markdown works correctly
	// Simulate the full list context
	fullMarkdown := "- Response `200`:\n  - Content `application/json`:\n    - Example `test`:\n      - " + result

	t.Logf("\nFull markdown:\n%s", fullMarkdown)

	config := &RenderConfig{
		HTML: &HTMLConfig{
			EnableNestedListFix: true,
		},
	}

	renderer := NewHTMLRenderer(config)
	var buf strings.Builder
	err := renderer.markdown.Convert([]byte(fullMarkdown), &buf)
	require.NoError(t, err)

	html := buf.String()

	t.Logf("\nGenerated HTML:\n%s", html)

	// Verify code fence is recognized
	if !strings.Contains(html, `<code class="language-yaml">`) {
		t.Errorf("❌ Code fence not recognized")
	} else {
		t.Logf("✅ Code fence recognized")
	}

	// Verify no broken patterns
	if strings.Contains(html, "<pre><code>  -") {
		t.Errorf("❌ BROKEN: Found list item as code block")
	}
}
