// Copyright 2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

// ANSI escape codes retained for compatibility with existing terminal renderers.
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
	Grey = "\033[38;5;240m"
)

// Legacy lipgloss-compatible color constants retained for compatibility.
const (
	LipglossGreen     = "46"
	LipglossYellow    = "220"
	LipglossRed       = "196"
	LipglossGrey      = "240"
	LipglossLightGrey = "246"

	// pb33f dark-theme brand colors from cowboy-components.
	LipglossPrimaryBlue   = "#62c4ff"
	LipglossSecondaryPink = "#f83aff"
)
