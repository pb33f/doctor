// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"fmt"
	"io"
	"os"
	"strings"

	lipgloss "charm.land/lipgloss/v2"
)

const (
	boxTopLeft     = "┌"
	boxTopRight    = "┐"
	boxBottomLeft  = "└"
	boxBottomRight = "┘"
	boxHorizontal  = "─"
	boxVertical    = "│"
	bulletMarker   = "•"
)

// BoxOptions configures a simple terminal box renderer.
type BoxOptions struct {
	Title         string
	PaddingLeft   int
	PaddingRight  int
	PaddingTop    int
	PaddingBottom int
}

// PanelOptions configures panel grid rendering.
type PanelOptions struct {
	Gap int
}

// BulletListItem describes one item in a nested bullet list.
type BulletListItem struct {
	Level int
	Text  string
}

// RenderBox renders content inside a deterministic Unicode box.
func RenderBox(content string, opts BoxOptions) string {
	lines := splitRenderLines(content)
	paddingLeft, paddingRight := opts.PaddingLeft, opts.PaddingRight
	if paddingLeft == 0 && paddingRight == 0 {
		paddingLeft = 1
		paddingRight = 1
	}

	innerWidth := lipgloss.Width(opts.Title) + 2
	for _, line := range lines {
		width := paddingLeft + lipgloss.Width(line) + paddingRight
		if width > innerWidth {
			innerWidth = width
		}
	}

	var b strings.Builder
	renderTopBorder(&b, opts.Title, innerWidth)
	for range opts.PaddingTop {
		renderBoxLine(&b, "", innerWidth, 0, 0)
	}
	for _, line := range lines {
		renderBoxLine(&b, line, innerWidth, paddingLeft, paddingRight)
	}
	for range opts.PaddingBottom {
		renderBoxLine(&b, "", innerWidth, 0, 0)
	}
	b.WriteString(boxBottomLeft)
	b.WriteString(strings.Repeat(boxHorizontal, innerWidth))
	b.WriteString(boxBottomRight)

	return b.String()
}

// FprintBox writes a rendered box to writer, defaulting to stdout.
func FprintBox(writer io.Writer, content string, opts BoxOptions) {
	if writer == nil {
		writer = os.Stdout
	}
	fmt.Fprintln(writer, RenderBox(content, opts))
}

// RenderPanelGrid renders a rectangular grid of pre-rendered panel strings.
func RenderPanelGrid(rows [][]string, opts PanelOptions) string {
	if len(rows) == 0 {
		return ""
	}
	gap := opts.Gap
	if gap <= 0 {
		gap = 2
	}
	gapText := strings.Repeat(" ", gap)

	var out strings.Builder
	for rowIndex, row := range rows {
		if len(row) == 0 {
			continue
		}
		cells := make([][]string, len(row))
		widths := make([]int, len(row))
		maxHeight := 0
		for i, panel := range row {
			cells[i] = splitRenderLines(panel)
			if len(cells[i]) > maxHeight {
				maxHeight = len(cells[i])
			}
			for _, line := range cells[i] {
				if width := lipgloss.Width(line); width > widths[i] {
					widths[i] = width
				}
			}
		}

		for lineIndex := range maxHeight {
			for cellIndex := range cells {
				if cellIndex > 0 {
					out.WriteString(gapText)
				}
				line := ""
				if lineIndex < len(cells[cellIndex]) {
					line = cells[cellIndex][lineIndex]
				}
				out.WriteString(line)
				out.WriteString(strings.Repeat(" ", widths[cellIndex]-lipgloss.Width(line)))
			}
			if lineIndex < maxHeight-1 || rowIndex < len(rows)-1 {
				out.WriteByte('\n')
			}
		}
	}

	return out.String()
}

// RenderBulletList renders a nested bullet list.
func RenderBulletList(items []BulletListItem) string {
	if len(items) == 0 {
		return ""
	}

	var b strings.Builder
	for i, item := range items {
		level := item.Level
		if level < 0 {
			level = 0
		}
		b.WriteString(strings.Repeat("  ", level))
		b.WriteString(bulletMarker)
		b.WriteByte(' ')
		b.WriteString(item.Text)
		if i < len(items)-1 {
			b.WriteByte('\n')
		}
	}
	return b.String()
}

// FprintBulletList writes a rendered bullet list to writer, defaulting to stdout.
func FprintBulletList(writer io.Writer, items []BulletListItem) {
	if writer == nil {
		writer = os.Stdout
	}
	rendered := RenderBulletList(items)
	if rendered == "" {
		return
	}
	fmt.Fprintln(writer, rendered)
}

func splitRenderLines(content string) []string {
	content = strings.TrimRight(content, "\n")
	if content == "" {
		return []string{""}
	}
	return strings.Split(content, "\n")
}

func renderTopBorder(b *strings.Builder, title string, innerWidth int) {
	b.WriteString(boxTopLeft)
	if title == "" {
		b.WriteString(strings.Repeat(boxHorizontal, innerWidth))
		b.WriteString(boxTopRight)
		b.WriteByte('\n')
		return
	}

	titled := " " + title + " "
	b.WriteString(titled)
	b.WriteString(strings.Repeat(boxHorizontal, innerWidth-lipgloss.Width(titled)))
	b.WriteString(boxTopRight)
	b.WriteByte('\n')
}

func renderBoxLine(b *strings.Builder, line string, innerWidth, paddingLeft, paddingRight int) {
	b.WriteString(boxVertical)
	b.WriteString(strings.Repeat(" ", paddingLeft))
	b.WriteString(line)
	remaining := innerWidth - paddingLeft - lipgloss.Width(line) - paddingRight
	if remaining < 0 {
		remaining = 0
	}
	b.WriteString(strings.Repeat(" ", remaining+paddingRight))
	b.WriteString(boxVertical)
	b.WriteByte('\n')
}
