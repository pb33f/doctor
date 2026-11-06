// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

// Package diffview renders semantic OpenAPI changes and source lines for terminal views.
// Callers own source snapshots, source selection, scrolling, and document comparison.
package diffview

import (
	"fmt"
	"strings"
	"unicode/utf8"

	"charm.land/lipgloss/v2"
	"github.com/charmbracelet/x/ansi"
	changeModel "github.com/pb33f/libopenapi/what-changed/model"
)

// Styles supplies terminal styles without imposing an application theme.
// The zero value renders plain text.
type Styles struct {
	SelectedRow    lipgloss.Style
	RangeHighlight lipgloss.Style
	AddedRow       lipgloss.Style
	AddedRange     lipgloss.Style
	RemovedRow     lipgloss.Style
	RemovedRange   lipgloss.Style
	Added          lipgloss.Style
	Modified       lipgloss.Style
	Removed        lipgloss.Style
	Breaking       lipgloss.Style
	Grey           lipgloss.Style
	Detail         lipgloss.Style
	YAMLKey        lipgloss.Style
}

// Range identifies inclusive physical source lines, starting at one.
type Range struct{ Start, End int }

// Side identifies the document that owns a source location.
type Side uint8

const (
	// Original identifies the document before the change.
	Original Side = iota
	// Candidate identifies the document after the change.
	Candidate
)

// Source is source context whose ownership the caller has checked.
// Line is one-based. A zero Line omits context. External document coordinates
// must never be paired with root document lines.
type Source struct {
	Lines []string
	Line  int
	Side  Side
}

// RenderSummary renders a change's action, impact, and detached values.
// Large values use a marked excerpt; this is not a complete byte diff.
func RenderSummary(ch *changeModel.Change, width int, styles Styles) string {
	return renderDiffSummary(safeChange(ch), max(1, width), styles)
}

// RenderChange renders a summary followed by bounded physical source context.
// It never chooses a source document or substitutes coordinates between sides.
func RenderChange(ch *changeModel.Change, source Source, width int, styles Styles) string {
	ch = safeChange(ch)
	if ch == nil {
		return ""
	}
	summary := renderDiffSummary(ch, max(1, width), styles)
	if source.Line < 1 || source.Line > len(source.Lines) {
		if !hasValueData(ch) {
			return summary + styles.Grey.Render("  no line information")
		}
		return summary
	}
	removed := ch.ChangeType == changeModel.PropertyRemoved || ch.ChangeType == changeModel.ObjectRemoved
	if (removed && source.Side != Original) || (!removed && source.Side != Candidate) {
		return summary
	}
	block := RangeForChange(source.Lines, source.Line, ch)
	start, end := block.Start, block.End
	return summary + renderFileContext(source.Lines, &source.Line, highlightRange{start, end}, ch.ChangeType, max(1, width), styles)
}

// RangeForChange locates the changed block in a caller-validated source snapshot.
func RangeForChange(lines []string, line int, ch *changeModel.Change) Range {
	if line < 1 || line > len(lines) {
		return Range{}
	}
	// Lookup scans only a local window. Very long lines cannot provide useful
	// block indentation, so highlight their physical line without parsing it.
	first, last := max(0, line-1-maxBlockSize), min(len(lines), line+maxBlockSize)
	window := lines[first:last]
	for _, text := range window {
		if len(text) > 4096 {
			return Range{line, line}
		}
	}
	bounded := safeChange(ch)
	start, end := computeBlockRangeForChange(window, line-first, bounded)
	return Range{start + first, end + first}
}

// RenderSource renders all physical source lines without wrapping or clipping.
// It escapes terminal controls. Callers own the viewport and horizontal scrolling.
func RenderSource(lines []string, highlight Range, changeType, width int, styles Styles) string {
	return renderSpecLines(lines, highlightRange{highlight.Start, highlight.End}, changeType, max(1, width), styles)
}

const maxValueBytes = 32 * 1024
const maxValueLines = 256
const maxContextBytes = 64 * 1024
const maxContextLines = 512
const excerptNotice = "[excerpt; open the full source diff for all changes]"

// safeText leaves physical line breaks intact and makes terminal controls visible.
func safeText(s string) string {
	if strings.IndexFunc(s, func(r rune) bool { return (r < 0x20 && r != '\n') || (r >= 0x7f && r <= 0x9f) }) < 0 {
		return s
	}
	var out strings.Builder
	for _, r := range s {
		switch {
		case r == '\n':
			out.WriteRune(r)
		case r < 0x20 || (r >= 0x7f && r <= 0x9f):
			fmt.Fprintf(&out, "\\u%04x", r)
		default:
			out.WriteRune(r)
		}
	}
	return out.String()
}

func safeChange(ch *changeModel.Change) *changeModel.Change {
	if ch == nil {
		return nil
	}
	copy := *ch
	copy.Property = safeText(boundedValue(ch.Property))
	copy.Original = safeText(boundedValue(ch.Original))
	copy.New = safeText(boundedValue(ch.New))
	copy.OriginalEncoded = safeText(boundedValue(ch.OriginalEncoded))
	copy.NewEncoded = safeText(boundedValue(ch.NewEncoded))
	return &copy
}

func boundedValue(value string) string {
	limit := min(len(value), maxValueBytes)
	lines := 0
	for i := 0; i < limit; i++ {
		if value[i] == '\n' {
			lines++
			if lines == maxValueLines {
				limit = i
				break
			}
		}
	}
	if limit == len(value) {
		return value
	}
	for limit > 0 && !utf8.RuneStart(value[limit]) {
		limit--
	}
	return value[:limit] + "\n" + excerptNotice
}

func visualLen(s string) int { return ansi.StringWidth(s) }
func clampRange(line, before, after, total int) (int, int) {
	return max(0, min(line-before, total)), max(0, min(line+after+1, total))
}
