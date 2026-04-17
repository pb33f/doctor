// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"image/color"
	"io"
	"os"
	"strconv"
	"strings"

	lipgloss "charm.land/lipgloss/v2"
	"github.com/charmbracelet/colorprofile"
)

type ThemeName string

const (
	ThemeDark      ThemeName = "dark"
	ThemeLight     ThemeName = "light"
	ThemeTektronix ThemeName = "tektronix"
)

type colorSpec struct {
	ANSI      string
	ANSI256   string
	TrueColor string
}

type Palette struct {
	Theme          ThemeName
	Profile        colorprofile.Profile
	DarkBackground bool
	SupportsColor  bool

	Primary        color.Color
	Secondary      color.Color
	Addition       color.Color
	Modification   color.Color
	Removal        color.Color
	Breaking       color.Color
	Muted          color.Color
	Detail         color.Color
	Nav            color.Color
	HelpKey        color.Color
	PrimaryBG      color.Color
	SecondaryBG    color.Color
	SubtleBG       color.Color
	SelectedBG     color.Color
	RangeBG        color.Color
	AddedBG        color.Color
	AddedRangeBG   color.Color
	RemovedBG      color.Color
	RemovedRangeBG color.Color
}

func NormalizeThemeName(theme ThemeName) ThemeName {
	switch theme {
	case ThemeLight:
		return ThemeLight
	case ThemeTektronix:
		return ThemeTektronix
	default:
		return ThemeDark
	}
}

func DetectProfile(output io.Writer, env []string) colorprofile.Profile {
	return colorprofile.Detect(output, env)
}

func DetectStdoutProfile() colorprofile.Profile {
	return DetectProfile(os.Stdout, os.Environ())
}

func DetectDarkBackground() bool {
	if dark, ok := detectDarkBackgroundFromEnv(os.Environ()); ok {
		return dark
	}
	return detectTerminalDarkBackground()
}

func DetectDarkBackgroundFromEnv(env []string) bool {
	if dark, ok := detectDarkBackgroundFromEnv(env); ok {
		return dark
	}
	return true
}

var detectTerminalDarkBackground = func() bool {
	return lipgloss.HasDarkBackground(os.Stdin, os.Stderr)
}

func detectDarkBackgroundFromEnv(env []string) (bool, bool) {
	if dark, ok := lookupDarkBackgroundOverride(env); ok {
		return dark, true
	}
	if dark, ok := lookupColorFGBGDarkBackground(env); ok {
		return dark, true
	}
	return false, false
}

func lookupDarkBackgroundOverride(env []string) (bool, bool) {
	raw, ok := lookupEnv(env, "PB33F_DARK_BACKGROUND")
	if !ok {
		return false, false
	}

	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "1", "true", "yes", "on", "dark":
		return true, true
	case "0", "false", "no", "off", "light":
		return false, true
	default:
		return false, false
	}
}

func lookupColorFGBGDarkBackground(env []string) (bool, bool) {
	raw, ok := lookupEnv(env, "COLORFGBG")
	if !ok {
		return false, false
	}

	parts := strings.Split(raw, ";")
	for i := len(parts) - 1; i >= 0; i-- {
		code, err := strconv.Atoi(strings.TrimSpace(parts[i]))
		if err != nil {
			continue
		}

		switch code {
		case 0, 1, 2, 3, 4, 5, 6, 8:
			return true, true
		case 7, 9, 10, 11, 12, 13, 14, 15:
			return false, true
		default:
			return false, false
		}
	}

	return false, false
}

func lookupEnv(env []string, key string) (string, bool) {
	prefix := key + "="
	for _, entry := range env {
		if strings.HasPrefix(entry, prefix) {
			return strings.TrimPrefix(entry, prefix), true
		}
	}
	return "", false
}

func PaletteForTheme(theme ThemeName) Palette {
	return PaletteFor(theme, os.Stdout, os.Environ(), DetectDarkBackground())
}

func PaletteFor(theme ThemeName, output io.Writer, env []string, darkBackground bool) Palette {
	profile := DetectProfile(output, env)
	return PaletteForProfile(theme, profile, darkBackground)
}

func PaletteForProfile(theme ThemeName, profile colorprofile.Profile, darkBackground bool) Palette {
	theme = NormalizeThemeName(theme)
	supportsColor := profile > colorprofile.Ascii
	complete := lipgloss.Complete(profile)
	resolve := func(spec colorSpec) color.Color {
		if !supportsColor {
			return nil
		}
		return complete(
			lipgloss.Color(spec.ANSI),
			lipgloss.Color(spec.ANSI256),
			lipgloss.Color(spec.TrueColor),
		)
	}

	spec := paletteSpecFor(theme, darkBackground)
	return Palette{
		Theme:          theme,
		Profile:        profile,
		DarkBackground: darkBackground,
		SupportsColor:  supportsColor,
		Primary:        resolve(spec.primary),
		Secondary:      resolve(spec.secondary),
		Addition:       resolve(spec.addition),
		Modification:   resolve(spec.modification),
		Removal:        resolve(spec.removal),
		Breaking:       resolve(spec.breaking),
		Muted:          resolve(spec.muted),
		Detail:         resolve(spec.detail),
		Nav:            resolve(spec.nav),
		HelpKey:        resolve(spec.helpKey),
		PrimaryBG:      resolve(spec.primaryBG),
		SecondaryBG:    resolve(spec.secondaryBG),
		SubtleBG:       resolve(spec.subtleBG),
		SelectedBG:     resolve(spec.selectedBG),
		RangeBG:        resolve(spec.rangeBG),
		AddedBG:        resolve(spec.addedBG),
		AddedRangeBG:   resolve(spec.addedRangeBG),
		RemovedBG:      resolve(spec.removedBG),
		RemovedRangeBG: resolve(spec.removedRangeBG),
	}
}

type paletteSpec struct {
	primary        colorSpec
	secondary      colorSpec
	addition       colorSpec
	modification   colorSpec
	removal        colorSpec
	breaking       colorSpec
	muted          colorSpec
	detail         colorSpec
	nav            colorSpec
	helpKey        colorSpec
	primaryBG      colorSpec
	secondaryBG    colorSpec
	subtleBG       colorSpec
	selectedBG     colorSpec
	rangeBG        colorSpec
	addedBG        colorSpec
	addedRangeBG   colorSpec
	removedBG      colorSpec
	removedRangeBG colorSpec
}

func paletteSpecFor(theme ThemeName, darkBackground bool) paletteSpec {
	switch theme {
	case ThemeLight:
		if darkBackground {
			return paletteSpec{
				primary:        colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				secondary:      colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				addition:       colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				modification:   colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				removal:        colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				breaking:       colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				muted:          colorSpec{ANSI: "8", ANSI256: "245", TrueColor: "#a7a7a7"},
				detail:         colorSpec{ANSI: "8", ANSI256: "242", TrueColor: "#787878"},
				nav:            colorSpec{ANSI: "8", ANSI256: "245", TrueColor: "#a7a7a7"},
				helpKey:        colorSpec{ANSI: "15", ANSI256: "15", TrueColor: "#ffffff"},
				primaryBG:      colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#1f1f1f"},
				secondaryBG:    colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2a2a2a"},
				subtleBG:       colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2f2f2f"},
				selectedBG:     colorSpec{ANSI: "8", ANSI256: "238", TrueColor: "#444444"},
				rangeBG:        colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2f2f2f"},
				addedBG:        colorSpec{ANSI: "8", ANSI256: "238", TrueColor: "#444444"},
				addedRangeBG:   colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2f2f2f"},
				removedBG:      colorSpec{ANSI: "8", ANSI256: "238", TrueColor: "#444444"},
				removedRangeBG: colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2f2f2f"},
			}
		}
		return paletteSpec{
			primary:        colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			secondary:      colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			addition:       colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			modification:   colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			removal:        colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			breaking:       colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			muted:          colorSpec{ANSI: "8", ANSI256: "242", TrueColor: "#555555"},
			detail:         colorSpec{ANSI: "8", ANSI256: "245", TrueColor: "#888888"},
			nav:            colorSpec{ANSI: "8", ANSI256: "242", TrueColor: "#555555"},
			helpKey:        colorSpec{ANSI: "0", ANSI256: "0", TrueColor: "#000000"},
			primaryBG:      colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#eaf8fd"},
			secondaryBG:    colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#fdf1fb"},
			subtleBG:       colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#f5f5f5"},
			selectedBG:     colorSpec{ANSI: "7", ANSI256: "252", TrueColor: "#dddddd"},
			rangeBG:        colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#f5f5f5"},
			addedBG:        colorSpec{ANSI: "7", ANSI256: "252", TrueColor: "#dddddd"},
			addedRangeBG:   colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#f5f5f5"},
			removedBG:      colorSpec{ANSI: "7", ANSI256: "252", TrueColor: "#dddddd"},
			removedRangeBG: colorSpec{ANSI: "7", ANSI256: "255", TrueColor: "#f5f5f5"},
		}
	case ThemeTektronix:
		return paletteSpec{
			primary:        colorSpec{ANSI: "10", ANSI256: "83", TrueColor: "#33ff33"},
			secondary:      colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			addition:       colorSpec{ANSI: "10", ANSI256: "83", TrueColor: "#33ff33"},
			modification:   colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			removal:        colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			breaking:       colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			muted:          colorSpec{ANSI: "10", ANSI256: "83", TrueColor: "#33ff33"},
			detail:         colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			nav:            colorSpec{ANSI: "10", ANSI256: "83", TrueColor: "#33ff33"},
			helpKey:        colorSpec{ANSI: "10", ANSI256: "120", TrueColor: "#66ff66"},
			primaryBG:      colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#050a05"},
			secondaryBG:    colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#0a1a0a"},
			subtleBG:       colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#050a05"},
			selectedBG:     colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#1e501e"},
			rangeBG:        colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#143c14"},
			addedBG:        colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#0a1a0a"},
			addedRangeBG:   colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#050a05"},
			removedBG:      colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#0a1a0a"},
			removedRangeBG: colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#050a05"},
		}
	default:
		return paletteSpec{
			primary:        colorSpec{ANSI: "14", ANSI256: "81", TrueColor: LipglossPrimaryBlue},
			secondary:      colorSpec{ANSI: "13", ANSI256: "201", TrueColor: LipglossSecondaryPink},
			addition:       colorSpec{ANSI: "10", ANSI256: LipglossGreen, TrueColor: "#1aff00"},
			modification:   colorSpec{ANSI: "11", ANSI256: LipglossYellow, TrueColor: "#fddb00"},
			removal:        colorSpec{ANSI: "9", ANSI256: LipglossRed, TrueColor: "#ff3c74"},
			breaking:       colorSpec{ANSI: "9", ANSI256: LipglossRed, TrueColor: "#ff246b"},
			muted:          colorSpec{ANSI: "8", ANSI256: LipglossGrey, TrueColor: "#787878"},
			detail:         colorSpec{ANSI: "8", ANSI256: LipglossLightGrey, TrueColor: "#a7a7a7"},
			nav:            colorSpec{ANSI: "8", ANSI256: LipglossLightGrey, TrueColor: "#a7a7a7"},
			helpKey:        colorSpec{ANSI: "13", ANSI256: "201", TrueColor: LipglossSecondaryPink},
			primaryBG:      colorSpec{ANSI: "6", ANSI256: "23", TrueColor: "#002329"},
			secondaryBG:    colorSpec{ANSI: "5", ANSI256: "53", TrueColor: "#2a1a2a"},
			subtleBG:       colorSpec{ANSI: "8", ANSI256: "236", TrueColor: "#2f2f2f"},
			selectedBG:     colorSpec{ANSI: "5", ANSI256: "53", TrueColor: "#4a1a4e"},
			rangeBG:        colorSpec{ANSI: "5", ANSI256: "53", TrueColor: "#4a1a4e"},
			addedBG:        colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#334d00"},
			addedRangeBG:   colorSpec{ANSI: "2", ANSI256: "22", TrueColor: "#1f3000"},
			removedBG:      colorSpec{ANSI: "1", ANSI256: "52", TrueColor: "#250911"},
			removedRangeBG: colorSpec{ANSI: "1", ANSI256: "52", TrueColor: "#0c0000"},
		}
	}
}
