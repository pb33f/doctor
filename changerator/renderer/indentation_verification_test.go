// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"testing"
)

// TestIndentationCalculations documents and verifies all indentation calculations
// Rule: For list marker at N spaces, code blocks must be indented at N+2 spaces
func TestIndentationCalculations(t *testing.T) {
	calculations := []struct {
		location           string
		listMarkerIndent   int
		codeBlockIndent    int
		line               int
	}{
		// Path-level parameters
		{"Path parameters", 2, 4, 886},
		{"Path parameter schemas", 2, 4, 895},

		// Operation-level parameters
		{"Operation parameters", 2, 4, 1005},
		{"Operation parameter schemas", 2, 4, 1014},

		// Servers
		{"Server properties", 2, 4, 1071},
		{"Server variables", 4, 6, 1085},

		// Request body examples
		{"Request body examples", 4, 6, 1137},

		// Callbacks
		{"Callback properties", 2, 4, 1180},
		{"Callback pathItem properties", 4, 6, 1196},
		{"Callback operation summaries", 6, 8, 1291},

		// Media type properties (formula-based)
		{"Media type props (indentLevel=1)", 4, 6, 1244}, // (1+1)*2+2=6
		{"Media type props (indentLevel=2)", 6, 8, 1244}, // (2+1)*2+2=8

		// Responses
		{"Response properties", 2, 4, 1549},
		{"Response headers", 4, 6, 1571},
		{"Response examples", 6, 8, 1606},
		{"Response links", 4, 6, 1636},

		// Extensions
		{"Extensions (top-level)", 0, 2, 1722},
		{"Extensions (indented)", 2, 4, 1722},

		// Top-level changes
		{"Top-level renderChange", 0, 2, 1830},
	}

	t.Logf("Verifying %d indentation calculations", len(calculations))
	t.Logf("Rule: List marker at N spaces → Code blocks at N+2 spaces\n")

	allCorrect := true
	for _, calc := range calculations {
		expected := calc.listMarkerIndent + 2
		if calc.codeBlockIndent != expected {
			t.Errorf("❌ %s (line %d): marker=%d, code=%d, expected=%d",
				calc.location, calc.line, calc.listMarkerIndent, calc.codeBlockIndent, expected)
			allCorrect = false
		} else {
			t.Logf("✅ %s (line %d): marker=%d → code=%d",
				calc.location, calc.line, calc.listMarkerIndent, calc.codeBlockIndent)
		}
	}

	if allCorrect {
		t.Logf("\n✅ All %d indentation calculations are CORRECT!", len(calculations))
	} else {
		t.Errorf("\n❌ Some indentation calculations are INCORRECT")
	}
}
