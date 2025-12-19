// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

// Tree structure symbols for ASCII tree rendering
const (
	// TreeBranch Branch symbols
	TreeBranch     = "├──" // Non-last child, leaf node
	TreeLastBranch = "└──" // Last child, leaf node

	// TreeBranchDown Branch symbols with children
	TreeBranchDown     = "├─┬" // Non-last child, has children
	TreeLastBranchDown = "└─┬" // Last child, has children

	// TreeVertical Prefix continuation
	TreeVertical = "│ " // Continue vertical line from parent
	TreeEmpty    = "  " // No vertical line (parent was last child)
)

// ChangeSymbols defines the symbols used for different change types
type ChangeSymbols struct {
	Modified string // Symbol for modified properties
	Added    string // Symbol for added properties
	Removed  string // Symbol for removed properties
	Breaking string // Suffix for breaking changes
}

// MarkdownSymbols uses emoji for markdown/GitHub rendering
var MarkdownSymbols = ChangeSymbols{
	Modified: "[🔀]",
	Added:    "[➕]",
	Removed:  "[➖]",
	Breaking: "❌",
}

// ASCIISymbols uses plain ASCII characters for terminal/non-markdown rendering
var ASCIISymbols = ChangeSymbols{
	Modified: "[M]",
	Added:    "[+]",
	Removed:  "[-]",
	Breaking: "{X}",
}

// GetSymbols returns the appropriate symbol set based on the useEmojis flag
func GetSymbols(useEmojis bool) ChangeSymbols {
	if useEmojis {
		return MarkdownSymbols
	}
	return ASCIISymbols
}
