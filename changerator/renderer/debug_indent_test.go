// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"
)

// TestIndentMultilineDescDetection tests if code block detection works correctly
func TestIndentMultilineDescDetection(t *testing.T) {
	// this is what formatValueChangeFromChange actually returns
	realDesc := "`value` changed to:\n\n```yaml\ndata:\n  - item: test\n```"

	// apply 6 spaces indentation
	result := indentMultilineDesc(realDesc, 6)

	t.Logf("Input:\n%s", realDesc)
	t.Logf("Output:\n%s", result)

	// the code block starts on line 3, not line 1
	// so the function will NOT detect it as a code block
	// and will only indent lines 2+, not the first line

	lines := strings.Split(result, "\n")
	t.Logf("Line 0: %q", lines[0])
	if len(lines) > 1 {
		t.Logf("Line 1: %q", lines[1])
	}
	if len(lines) > 2 {
		t.Logf("Line 2: %q", lines[2])
	}

	// check if the code fence line is indented
	for i, line := range lines {
		if strings.Contains(line, "```yaml") {
			t.Logf("Code fence at line %d: %q", i, line)
			leadingSpaces := len(line) - len(strings.TrimLeft(line, " "))
			t.Logf("  Leading spaces: %d", leadingSpaces)

			if leadingSpaces != 6 {
				t.Errorf("❌ Code fence should have 6 spaces but has %d", leadingSpaces)
			} else {
				t.Logf("✅ Code fence correctly indented")
			}
		}
	}
}

// TestActualFormatPattern tests what formatValueChangeFromChange actually generates
func TestActualFormatPattern(t *testing.T) {
	// simulate the actual format
	desc := "`value` changed to:\n\n```yaml\ndata: test\n```"

	lines := strings.Split(desc, "\n")
	t.Logf("Total lines: %d", len(lines))
	for i, line := range lines {
		t.Logf("Line %d: %q (starts with ```?: %v)", i, line, strings.HasPrefix(strings.TrimSpace(line), "```"))
	}

	// the first line is NOT a code block
	firstLineIsCodeBlock := strings.HasPrefix(strings.TrimSpace(lines[0]), "```")
	t.Logf("First line is code block?: %v", firstLineIsCodeBlock)

	// but we DO have a code block in the content
	hasCodeBlock := strings.Contains(desc, "```")
	t.Logf("Contains code block?: %v", hasCodeBlock)
}
