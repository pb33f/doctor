// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"fmt"
	"image/color"
	"testing"

	"github.com/charmbracelet/colorprofile"
	"github.com/pb33f/testify/assert"
)

func colorString(c color.Color) string {
	if c == nil {
		return ""
	}
	r, g, b, _ := color.RGBAModel.Convert(c).RGBA()
	return fmt.Sprintf("#%02x%02x%02x", uint8(r>>8), uint8(g>>8), uint8(b>>8))
}

func TestNoColorScheme(t *testing.T) {
	scheme := NoColorScheme{}
	assert.Equal(t, "test", scheme.Addition("test"))
	assert.Equal(t, "test", scheme.Modification("test"))
	assert.Equal(t, "test", scheme.Removal("test"))
	assert.Equal(t, "test", scheme.Breaking("test"))
	assert.Equal(t, "test", scheme.TreeBranch("test"))
	assert.Equal(t, "test", scheme.LocationInfo("test"))
	assert.Equal(t, "test", scheme.Statistics("test"))
}

func TestGrayscaleColorScheme(t *testing.T) {
	scheme := GrayscaleColorScheme{}
	assert.Equal(t, "test", scheme.Addition("test"))
	assert.Equal(t, "test", scheme.Modification("test"))
	assert.Equal(t, "test", scheme.Removal("test"))
	assert.Equal(t, "test", scheme.Breaking("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.TreeBranch("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.LocationInfo("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.Statistics("test"))
}

func TestTerminalColorScheme(t *testing.T) {
	scheme := TerminalColorScheme{}
	assert.Equal(t, Green+"test"+Reset, scheme.Addition("test"))
	assert.Equal(t, Yellow+"test"+Reset, scheme.Modification("test"))
	assert.Equal(t, Red+"test"+Reset, scheme.Removal("test"))
	assert.Equal(t, RedBold+"test"+Reset, scheme.Breaking("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.TreeBranch("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.LocationInfo("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.Statistics("test"))
}

func TestPaletteForProfile_DarkUsesOfficialBrandColors(t *testing.T) {
	palette := PaletteForProfile(ThemeDark, colorprofile.TrueColor, true)
	assert.Equal(t, ThemeDark, palette.Theme)
	assert.True(t, palette.SupportsColor)
	assert.Equal(t, LipglossPrimaryBlue, colorString(palette.Primary))
	assert.Equal(t, LipglossSecondaryPink, colorString(palette.Secondary))
	assert.Equal(t, "#fddb00", colorString(palette.Modification))
}

func TestPaletteForProfile_LightAdaptsToBackground(t *testing.T) {
	lightOnDark := PaletteForProfile(ThemeLight, colorprofile.TrueColor, true)
	lightOnLight := PaletteForProfile(ThemeLight, colorprofile.TrueColor, false)
	assert.NotEqual(t, colorString(lightOnDark.Primary), colorString(lightOnLight.Primary))
	assert.NotEqual(t, colorString(lightOnDark.SelectedBG), colorString(lightOnLight.SelectedBG))
}

func TestPaletteForProfile_TektronixUsesGreenMonochrome(t *testing.T) {
	palette := PaletteForProfile(ThemeTektronix, colorprofile.TrueColor, true)
	assert.Equal(t, "#33ff33", colorString(palette.Primary))
	assert.Equal(t, "#66ff66", colorString(palette.Secondary))
}

func TestPaletteForProfile_NoColorProfile(t *testing.T) {
	palette := PaletteForProfile(ThemeDark, colorprofile.Ascii, true)
	assert.False(t, palette.SupportsColor)
	assert.Nil(t, palette.Primary)
	assert.Nil(t, palette.SelectedBG)
}

func TestNewThemeColorScheme_NoColorProfileFallsBack(t *testing.T) {
	scheme := NewThemeColorScheme(ThemeDark, colorprofile.Ascii, true)
	assert.Equal(t, "test", scheme.Addition("test"))
}

func TestColorConstants(t *testing.T) {
	assert.Equal(t, "\033[0m", Reset)
	assert.Equal(t, "\033[38;5;46m", Green)
	assert.Equal(t, "\033[38;5;220m", Yellow)
	assert.Equal(t, "\033[38;5;196m", Red)
	assert.Equal(t, "\033[1;38;5;196m", RedBold)
	assert.Equal(t, "\033[38;5;240m", Grey)
}

func TestColorSchemeInterface(t *testing.T) {
	var _ ColorScheme = NoColorScheme{}
	var _ ColorScheme = GrayscaleColorScheme{}
	var _ ColorScheme = TerminalColorScheme{}
	var _ ColorScheme = ThemedColorScheme{}
}
