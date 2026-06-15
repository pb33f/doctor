// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"strings"
	"testing"

	"github.com/charmbracelet/colorprofile"
	"github.com/pb33f/testify/assert"
)

func TestTextStylerNoColor(t *testing.T) {
	palette := PaletteForProfile(ThemeDark, colorprofile.Ascii, true)
	styler := NewTextStyler(palette)

	assert.Equal(t, "primary", styler.Primary("primary"))
	assert.Equal(t, "secondary", styler.Secondary("secondary"))
	assert.Equal(t, "success", styler.Success("success"))
	assert.Equal(t, "warning", styler.Warning("warning"))
	assert.Equal(t, "error", styler.Error("error"))
	assert.Equal(t, "muted", styler.Muted("muted"))
}

func TestTextStylerColor(t *testing.T) {
	palette := PaletteForProfile(ThemeDark, colorprofile.TrueColor, true)
	styler := NewTextStyler(palette)

	rendered := styler.Error("boom")

	assert.Contains(t, rendered, "boom")
	assert.True(t, strings.Contains(rendered, "\x1b["), "expected ANSI styling")
}
