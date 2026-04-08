// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"fmt"
	"io"
	"os"
	"strings"
)

const pb33fBannerArt = `
@@@@@@@   @@@@@@@   @@@@@@   @@@@@@   @@@@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@  @@@@@@@  @@@@@@@@
@@!  @@@  @@!  @@@      @@@      @@@  @@!
!@!  @!@  !@   @!@      @!@      @!@  !@!
@!@@!@!   @!@!@!@   @!@!!@   @!@!!@   @!!!:!
!!@!!!    !!!@!!!!  !!@!@!   !!@!@!   !!!!!:
!!:       !!:  !!!      !!:      !!:  !!:
:!:       :!:  !:!      :!:      :!:  :!:
 ::        :: ::::  :: ::::  :: ::::   ::
 :        :: : ::    : : :    : : :    :
`

// BannerOptions describes the product metadata to print alongside the shared
// pb33f banner art.
type BannerOptions struct {
	Writer      io.Writer
	Palette     Palette
	ProductName string
	ProductURL  string
	Version     string
	Date        string
}

// PrintBanner renders the shared pb33f banner for a CLI product.
func PrintBanner(opts BannerOptions) {
	writer := opts.Writer
	if writer == nil {
		writer = os.Stdout
	}

	art := styleWithForeground(opts.Palette.Secondary).Bold(true)
	info := styleWithForeground(opts.Palette.Primary).Bold(true)

	fmt.Fprintln(writer, art.Render(pb33fBannerArt))
	if opts.ProductURL != "" {
		fmt.Fprintln(writer, info.Render(opts.ProductURL))
	}

	dividerWidth := 36
	if len(opts.ProductURL) > dividerWidth {
		dividerWidth = len(opts.ProductURL)
	}
	fmt.Fprintln(writer, strings.Repeat("-", dividerWidth))

	version := opts.Version
	if version == "" {
		version = "unknown"
	}

	versionLine := fmt.Sprintf("%s version: %s", opts.ProductName, version)
	if opts.Date != "" {
		fmt.Fprint(writer, info.Render(versionLine))
		fmt.Fprintln(writer, art.Render(fmt.Sprintf(" | compiled: %s", opts.Date)))
	} else {
		fmt.Fprintln(writer, info.Render(versionLine))
	}
	fmt.Fprintln(writer)
}
