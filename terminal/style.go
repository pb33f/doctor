// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"fmt"

	lipgloss "charm.land/lipgloss/v2"
)

// TextStyler applies semantic terminal styles derived from a Palette.
type TextStyler struct {
	primary   lipgloss.Style
	secondary lipgloss.Style
	success   lipgloss.Style
	warning   lipgloss.Style
	error     lipgloss.Style
	muted     lipgloss.Style
}

// NewTextStyler creates semantic text styles for a terminal palette.
func NewTextStyler(p Palette) TextStyler {
	if !p.SupportsColor {
		return TextStyler{
			primary:   lipgloss.NewStyle(),
			secondary: lipgloss.NewStyle(),
			success:   lipgloss.NewStyle(),
			warning:   lipgloss.NewStyle(),
			error:     lipgloss.NewStyle(),
			muted:     lipgloss.NewStyle(),
		}
	}

	return TextStyler{
		primary:   styleWithForeground(p.Primary),
		secondary: styleWithForeground(p.Secondary),
		success:   styleWithForeground(p.Addition),
		warning:   styleWithForeground(p.Modification),
		error:     styleWithForeground(p.Removal).Bold(true),
		muted:     styleWithForeground(p.Muted),
	}
}

// DefaultTextStyler returns styles for the default dark terminal theme.
func DefaultTextStyler() TextStyler {
	return NewTextStyler(PaletteForTheme(ThemeDark))
}

func renderStyled(style lipgloss.Style, value any) string {
	return style.Render(fmt.Sprint(value))
}

func (t TextStyler) Primary(value any) string {
	return renderStyled(t.primary, value)
}

func (t TextStyler) Secondary(value any) string {
	return renderStyled(t.secondary, value)
}

func (t TextStyler) Success(value any) string {
	return renderStyled(t.success, value)
}

func (t TextStyler) Warning(value any) string {
	return renderStyled(t.warning, value)
}

func (t TextStyler) Error(value any) string {
	return renderStyled(t.error, value)
}

func (t TextStyler) Muted(value any) string {
	return renderStyled(t.muted, value)
}

func PrimaryText(value any) string {
	return DefaultTextStyler().Primary(value)
}

func SecondaryText(value any) string {
	return DefaultTextStyler().Secondary(value)
}

func SuccessText(value any) string {
	return DefaultTextStyler().Success(value)
}

func WarningText(value any) string {
	return DefaultTextStyler().Warning(value)
}

func ErrorText(value any) string {
	return DefaultTextStyler().Error(value)
}

func MutedText(value any) string {
	return DefaultTextStyler().Muted(value)
}
