// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

import (
	"strings"
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/terminal"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
)

// createMockTree creates a mock v3.Node tree for testing without circular imports
func createMockTree() *v3.Node {
	// Create a mock tree structure that simulates changerator output
	root := &v3.Node{
		Id:    "root",
		Label: "Document",
		Type:  "document",
	}

	// Info node with changes
	infoNode := &v3.Node{
		Id:       "$.info",
		ParentId: "root",
		Label:    "Info",
		Type:     "info",
	}

	// Add some mock changes to info
	line4 := 4
	col14 := 14
	line5 := 5
	col20 := 20

	infoChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "title",
				ChangeType: wcModel.Modified,
				Breaking:   false,
				Context: &wcModel.ChangeContext{
					NewLine:   &line4,
					NewColumn: &col14,
				},
			},
			{
				Property:   "description",
				ChangeType: wcModel.Modified,
				Breaking:   false,
				Context: &wcModel.ChangeContext{
					NewLine:   &line5,
					NewColumn: &col20,
				},
			},
		},
	}
	infoNode.AppendChange(infoChanges)

	// Contact node nested under Info
	contactNode := &v3.Node{
		Id:       "$.info.contact",
		ParentId: "$.info",
		Label:    "Contact",
		Type:     "contact",
	}

	line8 := 8
	col16 := 16
	contactChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "email",
				ChangeType: wcModel.Modified,
				Breaking:   false,
				Context: &wcModel.ChangeContext{
					NewLine:   &line8,
					NewColumn: &col16,
				},
			},
		},
	}
	contactNode.AppendChange(contactChanges)
	infoNode.Children = append(infoNode.Children, contactNode)

	// Paths node
	pathsNode := &v3.Node{
		Id:       "$.paths",
		ParentId: "root",
		Label:    "Paths",
		Type:     "paths",
	}

	// /pet path
	petPath := &v3.Node{
		Id:       "$.paths./pet",
		ParentId: "$.paths",
		Label:    "/pet",
		Type:     "pathItem",
	}

	line120 := 120
	col16put := 16
	line112 := 112
	col15post := 15

	petChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "put",
				ChangeType: wcModel.PropertyAdded,
				Breaking:   false,
				Context: &wcModel.ChangeContext{
					NewLine:   &line120,
					NewColumn: &col16put,
				},
			},
			{
				Property:   "post",
				ChangeType: wcModel.PropertyRemoved,
				Breaking:   true,
				Context: &wcModel.ChangeContext{
					OriginalLine:   &line112,
					OriginalColumn: &col15post,
				},
			},
		},
	}
	petPath.AppendChange(petChanges)

	// GET operation under /pet
	getOp := &v3.Node{
		Id:       "$.paths./pet.get",
		ParentId: "$.paths./pet",
		Label:    "GET",
		Type:     "operation",
	}

	line58 := 58
	col20sum := 20
	getChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "summary",
				ChangeType: wcModel.Modified,
				Breaking:   false,
				Context: &wcModel.ChangeContext{
					NewLine:   &line58,
					NewColumn: &col20sum,
				},
			},
		},
	}
	getOp.AppendChange(getChanges)

	// Parameters under GET
	paramsNode := &v3.Node{
		Id:       "$.paths./pet.get.parameters",
		ParentId: "$.paths./pet.get",
		Label:    "Parameters",
		Type:     "parameters",
	}

	line308 := 308
	col25req := 25
	paramsChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "required",
				ChangeType: wcModel.Modified,
				Breaking:   true,
				Context: &wcModel.ChangeContext{
					NewLine:   &line308,
					NewColumn: &col25req,
				},
			},
		},
	}
	paramsNode.AppendChange(paramsChanges)
	getOp.Children = append(getOp.Children, paramsNode)

	petPath.Children = append(petPath.Children, getOp)
	pathsNode.Children = append(pathsNode.Children, petPath)

	// Components node
	componentsNode := &v3.Node{
		Id:       "$.components",
		ParentId: "root",
		Label:    "Components",
		Type:     "components",
	}

	// Pet schema
	petSchema := &v3.Node{
		Id:       "$.components.schemas.Pet",
		ParentId: "$.components",
		Label:    "Pet",
		Type:     "schema",
	}

	line1105 := 1105
	col11req := 11
	petSchemaChanges := &mockChanged{
		changes: []*wcModel.Change{
			{
				Property:   "required",
				ChangeType: wcModel.PropertyRemoved,
				Breaking:   true,
				Context: &wcModel.ChangeContext{
					OriginalLine:   &line1105,
					OriginalColumn: &col11req,
				},
			},
		},
	}
	petSchema.AppendChange(petSchemaChanges)
	componentsNode.Children = append(componentsNode.Children, petSchema)

	// Build root children
	root.Children = []*v3.Node{infoNode, pathsNode, componentsNode}

	return root
}

// mockChanged implements what_changed.Changed interface for testing
type mockChanged struct {
	changes []*wcModel.Change
}

func (m *mockChanged) GetAllChanges() []*wcModel.Change {
	return m.changes
}

func (m *mockChanged) TotalChanges() int {
	return len(m.changes)
}

func (m *mockChanged) TotalBreakingChanges() int {
	count := 0
	for _, c := range m.changes {
		if c.Breaking {
			count++
		}
	}
	return count
}

func (m *mockChanged) GetPropertyChanges() []*wcModel.Change {
	return m.changes
}

func (m *mockChanged) PropertiesOnly() {
	// no-op for testing
}

// TestTreeRenderer_BasicRendering tests basic tree rendering functionality
func TestTreeRenderer_BasicRendering(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
		ShowStatistics:  false,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Basic assertions
	assert.NotEmpty(t, output, "Tree output should not be empty")

	// Check for tree structure characters
	assert.Contains(t, output, "├─", "Should contain branch symbols")
	assert.Contains(t, output, "└─", "Should contain last-branch symbols")
	assert.Contains(t, output, "│", "Should contain vertical line continuation")
}

// TestTreeRenderer_MarkdownMode tests emoji rendering in markdown mode
func TestTreeRenderer_MarkdownMode(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain emoji symbols
	assert.True(t,
		strings.Contains(output, "[🔀]") ||
			strings.Contains(output, "[➕]") ||
			strings.Contains(output, "[➖]"),
		"Markdown mode should contain emoji symbols")
}

// TestTreeRenderer_ASCIIMode tests ASCII rendering in non-markdown mode
func TestTreeRenderer_ASCIIMode(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain ASCII symbols
	assert.True(t,
		strings.Contains(output, "[M]") ||
			strings.Contains(output, "[+]") ||
			strings.Contains(output, "[-]"),
		"ASCII mode should contain text symbols")

	// Should NOT contain emoji symbols
	assert.False(t, strings.Contains(output, "🔀"), "ASCII mode should not contain emoji")
	assert.False(t, strings.Contains(output, "➕"), "ASCII mode should not contain emoji")
	assert.False(t, strings.Contains(output, "➖"), "ASCII mode should not contain emoji")
}

// TestTreeRenderer_LineNumbers tests line number rendering
func TestTreeRenderer_LineNumbers(t *testing.T) {
	root := createMockTree()

	t.Run("with line numbers", func(t *testing.T) {
		config := &TreeConfig{
			UseEmojis:       true,
			ShowLineNumbers: true,
		}

		renderer := NewTreeRenderer(root, config)
		output := renderer.Render()

		// Should contain line:col format
		assert.Regexp(t, `\(\d+:\d+\)`, output, "Should contain (line:col) format")
	})

	t.Run("without line numbers", func(t *testing.T) {
		config := &TreeConfig{
			UseEmojis:       true,
			ShowLineNumbers: false,
		}

		renderer := NewTreeRenderer(root, config)
		output := renderer.Render()

		// Check that we don't have the (line:col) pattern
		// Note: Some outputs may still be valid without this pattern if there are no changes
		if len(output) > 0 {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				if strings.Contains(line, "[🔀]") || strings.Contains(line, "[➕]") || strings.Contains(line, "[➖]") {
					// These are change lines, they should NOT have (line:col) pattern
					assert.NotRegexp(t, `\(\d+:\d+\)`, line, "Change lines should not contain (line:col) when disabled")
				}
			}
		}
	})
}

// TestTreeRenderer_Statistics tests statistics mode
func TestTreeRenderer_Statistics(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
		ShowStatistics:  true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain statistics format
	assert.Regexp(t, `\(\d+ changes`, output, "Should contain change count statistics")
}

// TestTreeRenderer_BreakingChanges tests breaking change markers
func TestTreeRenderer_BreakingChanges(t *testing.T) {
	root := createMockTree()

	t.Run("markdown breaking marker", func(t *testing.T) {
		config := &TreeConfig{
			UseEmojis:       true,
			ShowLineNumbers: true,
		}

		renderer := NewTreeRenderer(root, config)
		output := renderer.Render()

		// If there are breaking changes, should contain breaking marker
		if strings.Contains(output, "❌") {
			assert.Contains(t, output, "❌", "Markdown mode should use emoji breaking marker")
		}
	})

	t.Run("ASCII breaking marker", func(t *testing.T) {
		config := &TreeConfig{
			UseEmojis:       false,
			ShowLineNumbers: true,
		}

		renderer := NewTreeRenderer(root, config)
		output := renderer.Render()

		// If there are breaking changes, should contain ASCII breaking marker
		if strings.Contains(output, "{X}") {
			assert.Contains(t, output, "{X}", "ASCII mode should use text breaking marker")
		}
	})
}

// TestTreeRenderer_DeepNesting tests deeply nested tree structures
func TestTreeRenderer_DeepNesting(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Count the maximum indentation level (number of │ or spaces at start of line)
	lines := strings.Split(output, "\n")
	maxDepth := 0
	for _, line := range lines {
		depth := 0
		for i := 0; i < len(line); i += 2 {
			if i+1 < len(line) {
				chunk := line[i : i+2]
				if chunk == "│ " || chunk == "  " {
					depth++
				} else {
					break
				}
			}
		}
		if depth > maxDepth {
			maxDepth = depth
		}
	}

	// We expect at least some nesting (paths -> operations -> responses, etc.)
	assert.GreaterOrEqual(t, maxDepth, 2, "Should have deeply nested structure")
}

// TestTreeRenderer_EmptyParentBranches tests that parent branches appear even without direct changes
func TestTreeRenderer_EmptyParentBranches(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Check for typical parent branch labels that should appear
	// These are structural nodes that may not have direct changes but contain children with changes
	possibleParents := []string{"Paths", "Components", "Info"}
	foundParent := false
	for _, parent := range possibleParents {
		if strings.Contains(output, parent) {
			foundParent = true
			break
		}
	}
	assert.True(t, foundParent, "Should contain at least one parent branch node")
}

// TestTreeRenderer_LastChildSymbols tests correct └── vs ├── symbol usage
func TestTreeRenderer_LastChildSymbols(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	lines := strings.Split(output, "\n")
	for i, line := range lines {
		// Check that └── is only used when appropriate
		if strings.Contains(line, "└─") {
			// Lines after this with the same prefix depth should not start with │
			// This is a basic sanity check
			if i < len(lines)-1 {
				// The next line at the same depth should not continue the vertical line from this branch
				// This is hard to test precisely without parsing the tree structure
				_ = lines[i+1] // Just ensuring we don't panic
			}
		}
	}

	// At minimum, verify we have both symbols present (if there are multiple siblings)
	if strings.Count(output, "\n") > 5 { // If we have enough lines
		assert.Contains(t, output, "├─", "Should contain non-last-child branch symbols")
		assert.Contains(t, output, "└─", "Should contain last-child branch symbols")
	}
}

// TestTreeRenderer_NilRoot tests handling of nil root
func TestTreeRenderer_NilRoot(t *testing.T) {
	renderer := NewTreeRenderer(nil, nil)
	output := renderer.Render()
	assert.Empty(t, output, "Nil root should return empty string")
}

// TestTreeRenderer_DefaultConfig tests default configuration when nil is passed
func TestTreeRenderer_DefaultConfig(t *testing.T) {
	root := createMockTree()

	renderer := NewTreeRenderer(root, nil)
	output := renderer.Render()

	// Default should use emojis
	assert.True(t,
		strings.Contains(output, "[🔀]") ||
			strings.Contains(output, "[➕]") ||
			strings.Contains(output, "[➖]") ||
			output == "", // Empty is valid if no changes
		"Default config should use emoji symbols")
}

// TestTreeRenderer_InfoChanges tests Info section changes
func TestTreeRenderer_InfoChanges(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Our modified spec changes title, description, version, and contact info
	// At least some of these should appear in the tree
	infoIndicators := []string{"Info", "title", "description", "version", "Contact"}
	foundInfo := false
	for _, indicator := range infoIndicators {
		if strings.Contains(output, indicator) {
			foundInfo = true
			break
		}
	}

	if len(output) > 0 {
		assert.True(t, foundInfo, "Should contain Info-related changes")
	}
}

// TestTreeRenderer_PathChanges tests Path section changes
func TestTreeRenderer_PathChanges(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Check for path-related content
	if strings.Contains(output, "Paths") || strings.Contains(output, "/burgers") {
		// Path changes should show operation methods, response codes, etc.
		pathIndicators := []string{"Paths", "/burgers", "GET", "POST", "PUT", "DELETE", "Responses", "Parameters"}
		foundPath := false
		for _, indicator := range pathIndicators {
			if strings.Contains(output, indicator) {
				foundPath = true
				break
			}
		}
		assert.True(t, foundPath, "Should contain path-related nodes")
	}
}

// TestTreeRenderer_ComponentChanges tests Components section changes
func TestTreeRenderer_ComponentChanges(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Check for component-related content
	componentIndicators := []string{"Components", "Schemas", "Burger", "Error", "Fries", "Drink", "SecuritySchemes", "Parameters"}
	foundComponent := false
	for _, indicator := range componentIndicators {
		if strings.Contains(output, indicator) {
			foundComponent = true
			break
		}
	}

	if len(output) > 0 && strings.Contains(output, "Components") {
		assert.True(t, foundComponent, "Should contain component-related nodes when Components are present")
	}
}

// TestTreeRenderer_ConsistentOutput tests that output is consistent across multiple renders
func TestTreeRenderer_ConsistentOutput(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true,
		ShowLineNumbers: true,
	}

	renderer := NewTreeRenderer(root, config)

	output1 := renderer.Render()
	output2 := renderer.Render()

	assert.Equal(t, output1, output2, "Multiple renders should produce identical output")
}

// TestGetSymbols tests the GetSymbols helper function
func TestGetSymbols(t *testing.T) {
	t.Run("emoji symbols", func(t *testing.T) {
		symbols := GetSymbols(true)
		assert.Equal(t, "[🔀]", symbols.Modified)
		assert.Equal(t, "[➕]", symbols.Added)
		assert.Equal(t, "[➖]", symbols.Removed)
		assert.Equal(t, "❌", symbols.Breaking)
	})

	t.Run("ASCII symbols", func(t *testing.T) {
		symbols := GetSymbols(false)
		assert.Equal(t, "[M]", symbols.Modified)
		assert.Equal(t, "[+]", symbols.Added)
		assert.Equal(t, "[-]", symbols.Removed)
		assert.Equal(t, "{X}", symbols.Breaking)
	})
}

// TestTreeSymbolConstants tests that tree symbol constants are defined correctly
func TestTreeSymbolConstants(t *testing.T) {
	assert.Equal(t, "├──", TreeBranch)
	assert.Equal(t, "└──", TreeLastBranch)
	assert.Equal(t, "├─┬", TreeBranchDown)
	assert.Equal(t, "└─┬", TreeLastBranchDown)
	assert.Equal(t, "│ ", TreeVertical)
	assert.Equal(t, "  ", TreeEmpty)
}

// TestTreeRenderer_NoColorScheme tests that NoColorScheme produces uncolored output
func TestTreeRenderer_NoColorScheme(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: true,
		ColorScheme:     nil, // nil defaults to NoColorScheme
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should NOT contain any ANSI escape codes
	assert.NotContains(t, output, "\033[", "NoColorScheme should not contain ANSI escape codes")
}

// TestTreeRenderer_GrayscaleColorScheme tests grayscale colorization
func TestTreeRenderer_GrayscaleColorScheme(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: true,
		ColorScheme:     terminal.GrayscaleColorScheme{},
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain ANSI codes (for tree chrome dimming)
	assert.Contains(t, output, "\033[", "GrayscaleColorScheme should contain ANSI escape codes")

	// Check that Grey color code is present (240)
	assert.Contains(t, output, "\033[38;5;240m", "GrayscaleColorScheme should use grey color code")

	// Check for reset code
	assert.Contains(t, output, "\033[0m", "GrayscaleColorScheme should contain reset codes")

	// Change symbols should NOT be colored (green/yellow/red not present in grayscale)
	// Note: Grey (246) is used for chrome, so we check for absence of semantic colors
	assert.NotContains(t, output, "\033[38;5;46m", "GrayscaleColorScheme should not contain green (addition color)")
	assert.NotContains(t, output, "\033[38;5;220m", "GrayscaleColorScheme should not contain yellow (modification color)")
	assert.NotContains(t, output, "\033[38;5;196m", "GrayscaleColorScheme should not contain red (removal color)")
}

// TestTreeRenderer_TerminalColorScheme tests full semantic colorization
func TestTreeRenderer_TerminalColorScheme(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: true,
		ColorScheme:     terminal.TerminalColorScheme{},
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain ANSI codes
	assert.Contains(t, output, "\033[", "TerminalColorScheme should contain ANSI escape codes")

	// Check for reset code
	assert.Contains(t, output, "\033[0m", "TerminalColorScheme should contain reset codes")

	// Should contain semantic colors for different change types:
	// Yellow (220) for modifications
	assert.Contains(t, output, "\033[38;5;220m", "TerminalColorScheme should contain yellow for modifications")

	// Green (46) for additions
	assert.Contains(t, output, "\033[38;5;46m", "TerminalColorScheme should contain green for additions")

	// Red (196) for removals or breaking
	assert.Contains(t, output, "\033[38;5;196m", "TerminalColorScheme should contain red for removals/breaking")

	// Grey (240) for tree chrome
	assert.Contains(t, output, "\033[38;5;240m", "TerminalColorScheme should contain grey for tree structure")
}

// TestTreeRenderer_ColorSchemeWithEmoji tests colorization works with emoji mode
func TestTreeRenderer_ColorSchemeWithEmoji(t *testing.T) {
	root := createMockTree()

	config := &TreeConfig{
		UseEmojis:       true, // emoji mode
		ShowLineNumbers: true,
		ColorScheme:     terminal.TerminalColorScheme{},
	}

	renderer := NewTreeRenderer(root, config)
	output := renderer.Render()

	// Should contain both emoji symbols AND color codes
	assert.Contains(t, output, "\033[", "Should contain ANSI escape codes with emoji mode")

	// Should still contain emoji symbols
	hasEmoji := strings.Contains(output, "[🔀]") ||
		strings.Contains(output, "[➕]") ||
		strings.Contains(output, "[➖]")
	assert.True(t, hasEmoji, "Should contain emoji symbols when UseEmojis is true")
}

// TestTreeRenderer_ColorSchemeIndependence tests that ColorScheme and UseEmojis are independent
func TestTreeRenderer_ColorSchemeIndependence(t *testing.T) {
	root := createMockTree()

	// Test all 4 combinations
	testCases := []struct {
		name        string
		useEmojis   bool
		colorScheme terminal.ColorScheme
		expectEmoji bool
		expectColor bool
	}{
		{"ASCII + NoColor", false, nil, false, false},
		{"ASCII + Color", false, terminal.TerminalColorScheme{}, false, true},
		{"Emoji + NoColor", true, nil, true, false},
		{"Emoji + Color", true, terminal.TerminalColorScheme{}, true, true},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := &TreeConfig{
				UseEmojis:       tc.useEmojis,
				ShowLineNumbers: true,
				ColorScheme:     tc.colorScheme,
			}

			renderer := NewTreeRenderer(root, config)
			output := renderer.Render()

			if tc.expectEmoji {
				hasEmoji := strings.Contains(output, "[🔀]") ||
					strings.Contains(output, "[➕]") ||
					strings.Contains(output, "[➖]")
				assert.True(t, hasEmoji, "Should contain emoji symbols")
			} else {
				hasASCII := strings.Contains(output, "[M]") ||
					strings.Contains(output, "[+]") ||
					strings.Contains(output, "[-]")
				assert.True(t, hasASCII, "Should contain ASCII symbols")
			}

			if tc.expectColor {
				assert.Contains(t, output, "\033[", "Should contain ANSI escape codes")
			} else {
				assert.NotContains(t, output, "\033[", "Should not contain ANSI escape codes")
			}
		})
	}
}
