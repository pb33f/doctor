// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"image/color"

	lipgloss "charm.land/lipgloss/v2"
	"github.com/charmbracelet/colorprofile"
)

// ColorScheme defines how to colorize different elements of tree output.
// implementations can provide terminal colors, grayscale dimming, or no colors.
type ColorScheme interface {
	Addition(text string) string
	Modification(text string) string
	Removal(text string) string
	Breaking(text string) string
	TreeBranch(text string) string
	LocationInfo(text string) string
	Statistics(text string) string
	Detail(text string) string
}

type NoColorScheme struct{}

func (NoColorScheme) Addition(s string) string     { return s }
func (NoColorScheme) Modification(s string) string { return s }
func (NoColorScheme) Removal(s string) string      { return s }
func (NoColorScheme) Breaking(s string) string     { return s }
func (NoColorScheme) TreeBranch(s string) string   { return s }
func (NoColorScheme) LocationInfo(s string) string { return s }
func (NoColorScheme) Statistics(s string) string   { return s }
func (NoColorScheme) Detail(s string) string       { return s }

type ThemedColorScheme struct {
	addition     lipgloss.Style
	modification lipgloss.Style
	removal      lipgloss.Style
	breaking     lipgloss.Style
	treeBranch   lipgloss.Style
	locationInfo lipgloss.Style
	statistics   lipgloss.Style
	detail       lipgloss.Style
}

func styleWithForeground(c color.Color) lipgloss.Style {
	if c == nil {
		return lipgloss.NewStyle()
	}
	return lipgloss.NewStyle().Foreground(c)
}

func NewThemeColorScheme(theme ThemeName, profile colorprofile.Profile, darkBackground bool) ColorScheme {
	palette := PaletteForProfile(theme, profile, darkBackground)
	if !palette.SupportsColor {
		return NoColorScheme{}
	}

	return ThemedColorScheme{
		addition:     styleWithForeground(palette.Addition),
		modification: styleWithForeground(palette.Modification),
		removal:      styleWithForeground(palette.Removal),
		breaking:     styleWithForeground(palette.Breaking).Bold(true),
		treeBranch:   styleWithForeground(palette.Muted),
		locationInfo: styleWithForeground(palette.Muted),
		statistics:   styleWithForeground(palette.Muted),
		detail:       styleWithForeground(palette.Detail),
	}
}

func (t ThemedColorScheme) Addition(s string) string     { return t.addition.Render(s) }
func (t ThemedColorScheme) Modification(s string) string { return t.modification.Render(s) }
func (t ThemedColorScheme) Removal(s string) string      { return t.removal.Render(s) }
func (t ThemedColorScheme) Breaking(s string) string     { return t.breaking.Render(s) }
func (t ThemedColorScheme) TreeBranch(s string) string   { return t.treeBranch.Render(s) }
func (t ThemedColorScheme) LocationInfo(s string) string { return t.locationInfo.Render(s) }
func (t ThemedColorScheme) Statistics(s string) string   { return t.statistics.Render(s) }
func (t ThemedColorScheme) Detail(s string) string       { return t.detail.Render(s) }

// GrayscaleColorScheme retains backwards-compatible grayscale output.
type GrayscaleColorScheme struct{}

func (GrayscaleColorScheme) Addition(s string) string     { return s }
func (GrayscaleColorScheme) Modification(s string) string { return s }
func (GrayscaleColorScheme) Removal(s string) string      { return s }
func (GrayscaleColorScheme) Breaking(s string) string     { return s }
func (GrayscaleColorScheme) TreeBranch(s string) string   { return Grey + s + Reset }
func (GrayscaleColorScheme) LocationInfo(s string) string { return Grey + s + Reset }
func (GrayscaleColorScheme) Statistics(s string) string   { return Grey + s + Reset }
func (GrayscaleColorScheme) Detail(s string) string       { return "\033[38;5;246m" + s + Reset }

// TerminalColorScheme retains backwards-compatible full semantic ANSI output.
type TerminalColorScheme struct{}

func (TerminalColorScheme) Addition(s string) string     { return Green + s + Reset }
func (TerminalColorScheme) Modification(s string) string { return Yellow + s + Reset }
func (TerminalColorScheme) Removal(s string) string      { return Red + s + Reset }
func (TerminalColorScheme) Breaking(s string) string     { return RedBold + s + Reset }
func (TerminalColorScheme) TreeBranch(s string) string   { return Grey + s + Reset }
func (TerminalColorScheme) LocationInfo(s string) string { return Grey + s + Reset }
func (TerminalColorScheme) Statistics(s string) string   { return Grey + s + Reset }
func (TerminalColorScheme) Detail(s string) string       { return "\033[38;5;246m" + s + Reset }
