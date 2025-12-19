// Copyright 2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

// ColorScheme defines how to colorize different elements of tree output.
// implementations can provide terminal colors, grayscale dimming, or no colors.
type ColorScheme interface {
	// Addition colorizes text representing added elements
	Addition(text string) string

	// Modification colorizes text representing modified elements
	Modification(text string) string

	// Removal colorizes text representing removed elements
	Removal(text string) string

	// Breaking colorizes text representing breaking changes
	Breaking(text string) string

	// TreeBranch colorizes tree structure characters (├──, └──, │, etc.)
	TreeBranch(text string) string

	// LocationInfo colorizes location information like (line:col)
	LocationInfo(text string) string

	// Statistics colorizes statistics text like (N changes, M breaking)
	Statistics(text string) string
}

// NoColorScheme returns text unchanged.
// use this for piped output, non-TTY contexts, or when --no-style is specified.
type NoColorScheme struct{}

func (NoColorScheme) Addition(s string) string     { return s }
func (NoColorScheme) Modification(s string) string { return s }
func (NoColorScheme) Removal(s string) string      { return s }
func (NoColorScheme) Breaking(s string) string     { return s }
func (NoColorScheme) TreeBranch(s string) string   { return s }
func (NoColorScheme) LocationInfo(s string) string { return s }
func (NoColorScheme) Statistics(s string) string   { return s }

// GrayscaleColorScheme dims decorative elements only, without semantic colors.
// this is the default scheme when colors are enabled.
// use case: cleaner output that highlights content without color distraction.
// tree branches, location info, and statistics are dimmed; change symbols remain unchanged.
type GrayscaleColorScheme struct{}

func (GrayscaleColorScheme) Addition(s string) string     { return s }
func (GrayscaleColorScheme) Modification(s string) string { return s }
func (GrayscaleColorScheme) Removal(s string) string      { return s }
func (GrayscaleColorScheme) Breaking(s string) string     { return s }
func (GrayscaleColorScheme) TreeBranch(s string) string   { return Grey + s + Reset }
func (GrayscaleColorScheme) LocationInfo(s string) string { return Grey + s + Reset }
func (GrayscaleColorScheme) Statistics(s string) string   { return Grey + s + Reset }

// TerminalColorScheme applies full semantic colors for terminal display.
// this is an opt-in scheme for colorful output with semantic meaning.
// additions are green, modifications are yellow, removals are red, breaking changes are bold red.
// tree branches, location info, and statistics are dimmed grey.
type TerminalColorScheme struct{}

func (TerminalColorScheme) Addition(s string) string     { return Green + s + Reset }
func (TerminalColorScheme) Modification(s string) string { return Yellow + s + Reset }
func (TerminalColorScheme) Removal(s string) string      { return Red + s + Reset }
func (TerminalColorScheme) Breaking(s string) string     { return RedBold + s + Reset }
func (TerminalColorScheme) TreeBranch(s string) string   { return Grey + s + Reset }
func (TerminalColorScheme) LocationInfo(s string) string { return Grey + s + Reset }
func (TerminalColorScheme) Statistics(s string) string   { return Grey + s + Reset }
