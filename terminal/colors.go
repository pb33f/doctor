// Copyright 2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

// ansi 256-color escape codes for terminal output.
// these codes match vacuum's existing color palette for consistency across pb33f tools.
const (
	// reset clears all formatting
	Reset = "\033[0m"

	// green is used for additions (ANSI 256-color code 46)
	Green = "\033[38;5;46m"

	// yellow is used for modifications (ANSI 256-color code 220)
	Yellow = "\033[38;5;220m"

	// red is used for removals (ANSI 256-color code 196)
	Red = "\033[38;5;196m"

	// redBold is used for breaking changes - bold red for emphasis
	RedBold = "\033[1;38;5;196m"

	// grey is used for tree structure and location info (ANSI 256-color code 240)
	// this is a "sub 2" level grey (~60% opacity equivalent) for subtle dimming
	Grey = "\033[38;5;240m"
)

// lipgloss-compatible color constants for use with lipgloss.Color().
// these are the same ANSI 256 palette values as above, plus the pb33f brand colors.
// use these across all pb33f tools for a consistent terminal color palette.
const (
	LipglossGreen  = "46"
	LipglossYellow = "220"
	LipglossRed    = "196"
	LipglossGrey   = "240"

	// pb33f brand colors (hex, for lipgloss true-color support)
	LipglossPrimaryBlue   = "#62c4ff"
	LipglossSecondaryPink = "#f83aff"
)
