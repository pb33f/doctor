// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"strings"
)

func ParsePrintingPressTheme(raw string) (ThemeName, error) {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "", string(ThemeDark):
		return ThemeDark, nil
	case "roger", string(ThemeLight):
		return ThemeLight, nil
	case string(ThemeTektronix):
		return ThemeTektronix, nil
	default:
		return "", fmt.Errorf("invalid theme %q: expected dark, roger, or tektronix", raw)
	}
}

func PaletteForPrintingPressArgs(args []string) Palette {
	theme := ThemeDark
	for i := 0; i < len(args); i++ {
		arg := args[i]
		switch {
		case arg == "--theme" && i+1 < len(args):
			if parsed, err := ParsePrintingPressTheme(args[i+1]); err == nil {
				theme = parsed
			}
			i++
		case strings.HasPrefix(arg, "--theme="):
			if parsed, err := ParsePrintingPressTheme(strings.TrimPrefix(arg, "--theme=")); err == nil {
				theme = parsed
			}
		}
	}
	return PaletteForTheme(theme)
}
