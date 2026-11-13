// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package diffview

import (
	"fmt"
	"regexp"
	"strings"
	"unicode/utf8"

	"charm.land/lipgloss/v2"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pmezard/go-difflib/difflib"
)

const (
	contextBefore = 5   // lines above change for spec context view
	contextAfter  = 120 // lines below change for spec context view
	diffContext   = 3   // context lines in unified diff output
)

var hunkHeaderRe = regexp.MustCompile(`@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@`)

// hasValueData returns true if the Change carries authoritative value data
// (Original/New/OriginalEncoded/NewEncoded or their object counterparts).
func hasValueData(ch *whatChangedModel.Change) bool {
	return ch.OriginalObject != nil || ch.NewObject != nil ||
		ch.Original != "" || ch.New != "" ||
		ch.OriginalEncoded != "" || ch.NewEncoded != ""
}

// resolveOldValue returns the best available old value, preferring Encoded.
func resolveOldValue(ch *whatChangedModel.Change) string {
	if ch.OriginalEncoded != "" {
		return ch.OriginalEncoded
	}
	return ch.Original
}

// resolveNewValue returns the best available new value, preferring Encoded.
func resolveNewValue(ch *whatChangedModel.Change) string {
	if ch.NewEncoded != "" {
		return ch.NewEncoded
	}
	return ch.New
}

// renderFileContext renders a bounded region without changing physical lines.
func renderFileContext(lines []string, centerLine *int, hl highlightRange, changeType, width int, styles Styles) string {
	if centerLine == nil || len(lines) == 0 {
		return ""
	}

	idx := *centerLine - 1
	if idx < 0 {
		idx = 0
	}

	// Extend the region to include the full highlight range with a little context.
	beforeStart := contextBefore
	if hl.start > 0 {
		desiredStart := hl.start - 3
		if desiredStart < 1 {
			desiredStart = 1
		}
		neededBefore := idx - (desiredStart - 1)
		if neededBefore > beforeStart {
			beforeStart = neededBefore
		}
	}

	afterEnd := contextAfter
	if hl.end > 0 {
		neededAfter := hl.end + 3 - (idx + 1)
		if neededAfter > afterEnd {
			afterEnd = neededAfter
		}
	}
	start, end := clampRange(idx, beforeStart, afterEnd, len(lines))
	if start >= end {
		return ""
	}
	clipped := end > start+maxContextLines
	end = min(end, start+maxContextLines)
	region := lines[start:end]
	contextBytes := 0
	bounded := make([]string, 0, len(region))
	for _, line := range region {
		remaining := maxContextBytes - contextBytes
		if len(line) > remaining {
			for remaining > 0 && !utf8.RuneStart(line[remaining]) {
				remaining--
			}
			bounded = append(bounded, line[:remaining])
			clipped = true
			break
		}
		bounded = append(bounded, line)
		contextBytes += len(line) + 1
		if contextBytes >= maxContextBytes {
			clipped = true
			break
		}
	}
	region = bounded
	startOffset := start

	// Pick styles and gutter chars based on change type.
	primaryStyle, rangeStyle, bodyGutter := contextHighlightStyles(changeType, styles)

	var sb strings.Builder
	sb.WriteByte('\n')
	sb.WriteString(styles.Grey.Render("  ── spec context ──"))
	sb.WriteByte('\n')

	lastLine := startOffset + len(region)
	numWidth := digitCount(lastLine)

	for i, line := range region {
		line = safeText(line)
		lineNo := startOffset + i + 1
		numStr := fmt.Sprintf("%*d", numWidth, lineNo)

		if lineNo == hl.start {
			// Primary line — bold with > arrow.
			content := fmt.Sprintf("  > %s │ %s", numStr, line)
			if pad := width - visualLen(content); pad > 0 {
				content += strings.Repeat(" ", pad)
			}
			sb.WriteString(primaryStyle.Render(content))
		} else if lineNo > hl.start && lineNo <= hl.end {
			// Body line — gutter marker (+/-/│) before line number.
			content := fmt.Sprintf("  %s %s │ %s", bodyGutter, numStr, line)
			if pad := width - visualLen(content); pad > 0 {
				content += strings.Repeat(" ", pad)
			}
			sb.WriteString(rangeStyle.Render(content))
		} else {
			// Normal context line
			sb.WriteString(fmt.Sprintf("  %s %s %s %s",
				styles.Grey.Render(" "),
				styles.Grey.Render(numStr),
				styles.Grey.Render("│"),
				highlightLine(line, styles)))
		}
		sb.WriteByte('\n')
	}
	if clipped {
		sb.WriteString(styles.Grey.Render("  "+excerptNotice) + "\n")
	}
	return sb.String()
}

// contextHighlightStyles returns the primary/range styles and body gutter char
// for a given change type.
func contextHighlightStyles(changeType int, styles Styles) (primary, rangeS lipgloss.Style, gutter string) {
	switch changeType {
	case whatChangedModel.PropertyAdded, whatChangedModel.ObjectAdded:
		return styles.AddedRow, styles.AddedRange, "+"
	case whatChangedModel.PropertyRemoved, whatChangedModel.ObjectRemoved:
		return styles.RemovedRow, styles.RemovedRange, "-"
	default:
		return styles.SelectedRow, styles.RangeHighlight, "│"
	}
}

// renderDiffSummary renders the diff header and value diff for a change,
// without spec context. Used as a fixed header in the code modal.
func renderDiffSummary(ch *whatChangedModel.Change, width int, styles Styles) string {
	if ch == nil {
		return ""
	}
	var sb strings.Builder
	sb.WriteString(renderDiffHeader(ch, width, styles, false))

	switch ch.ChangeType {
	case whatChangedModel.PropertyAdded, whatChangedModel.ObjectAdded:
		if hasValueData(ch) {
			val := resolveNewValue(ch)
			sb.WriteString(renderValueOneSided(ch.Property, val, "+", styles.Added))
		}
	case whatChangedModel.PropertyRemoved, whatChangedModel.ObjectRemoved:
		if hasValueData(ch) {
			val := resolveOldValue(ch)
			sb.WriteString(renderValueOneSided(ch.Property, val, "-", styles.Removed))
		}
	case whatChangedModel.Modified:
		if hasValueData(ch) {
			oldVal := resolveOldValue(ch)
			newVal := resolveNewValue(ch)
			sb.WriteString(renderValueDiff(ch.Property, oldVal, newVal, styles))
		}
	}
	return sb.String()
}

// renderValueDiff renders a diff of the change's own values (primary path for Modified).
func renderValueDiff(property, oldVal, newVal string, styles Styles) string {
	oldVal, newVal = boundedValue(oldVal), boundedValue(newVal)
	var sb strings.Builder

	isMultiOld := strings.Contains(oldVal, "\n")
	isMultiNew := strings.Contains(newVal, "\n")

	if !isMultiOld && !isMultiNew {
		// Single-line path
		if oldVal == newVal && !strings.Contains(oldVal, excerptNotice) {
			sb.WriteString(styles.Grey.Render("  (values are identical)"))
			sb.WriteByte('\n')
			return sb.String()
		}
		sb.WriteString(styles.Removed.Render(fmt.Sprintf("  - %s: %s", property, oldVal)))
		sb.WriteByte('\n')
		sb.WriteString(styles.Added.Render(fmt.Sprintf("  + %s: %s", property, newVal)))
		sb.WriteByte('\n')
		return sb.String()
	}

	// Clipped values cannot prove equality or support a complete line diff.
	if strings.Contains(oldVal, excerptNotice) || strings.Contains(newVal, excerptNotice) {
		return renderValueOneSided(property, oldVal, "-", styles.Removed) + renderValueOneSided(property, newVal, "+", styles.Added)
	}
	// Multi-line path: use difflib
	diff, err := difflib.GetUnifiedDiffString(difflib.UnifiedDiff{
		A:       appendNewlines(strings.Split(oldVal, "\n")),
		B:       appendNewlines(strings.Split(newVal, "\n")),
		Context: diffContext,
	})
	if err != nil || diff == "" {
		sb.WriteString(styles.Grey.Render("  (values are identical)"))
		sb.WriteByte('\n')
		return sb.String()
	}

	for _, line := range strings.Split(strings.TrimRight(diff, "\n"), "\n") {
		if hunkHeaderRe.MatchString(line) {
			// Line numbers are already 1-based relative to the value — no rewriting needed
			sb.WriteString(styles.Grey.Render("  " + line))
		} else if strings.HasPrefix(line, "-") {
			sb.WriteString(styles.Removed.Render("  " + line))
		} else if strings.HasPrefix(line, "+") {
			sb.WriteString(styles.Added.Render("  " + line))
		} else {
			sb.WriteString("  " + highlightLine(strings.TrimPrefix(line, " "), styles))
		}
		sb.WriteByte('\n')
	}
	return sb.String()
}

// renderValueOneSided renders a one-sided view of a change's value (primary path for Added/Removed).
func renderValueOneSided(property, val, prefix string, style lipgloss.Style) string {
	val = boundedValue(val)
	var sb strings.Builder

	if !strings.Contains(val, "\n") {
		// Single-line
		sb.WriteString(style.Render(fmt.Sprintf("  %s %s: %s", prefix, property, val)))
		sb.WriteByte('\n')
		return sb.String()
	}

	// Multi-line
	for _, line := range strings.Split(val, "\n") {
		sb.WriteString(style.Render(fmt.Sprintf("  %s %s", prefix, line)))
		sb.WriteByte('\n')
	}
	return sb.String()
}

// extractRegion extracts a region of lines centered on lineNum with the given radius.
// Returns nil if lineNum is nil or lines is empty.
// The returned int is the 0-based start offset of the region within lines.
func renderDiffHeader(ch *whatChangedModel.Change, width int, styles Styles, showValues bool) string {
	var sb strings.Builder

	// Action label
	action := changeAction(ch.ChangeType)
	actionStyle := changeStyle(ch.ChangeType, styles)

	sb.WriteString(actionStyle.Render(fmt.Sprintf("  %s: %s", action, ch.Property)))
	sb.WriteByte('\n')

	// Breaking indicator
	if ch.Breaking {
		sb.WriteString(styles.Breaking.Render("  BREAKING CHANGE"))
		sb.WriteByte('\n')
	}

	// Values (only when diff body doesn't show them)
	if showValues {
		origVal := resolveOldValue(ch)
		newVal := resolveNewValue(ch)

		// Truncate long values
		maxVal := width/2 - 20
		if maxVal < 20 {
			maxVal = 20
		}

		switch ch.ChangeType {
		case whatChangedModel.PropertyAdded, whatChangedModel.ObjectAdded:
			if newVal != "" {
				sb.WriteString(styles.Added.Render(fmt.Sprintf("  Value: %s", truncateStr(newVal, maxVal))))
				sb.WriteByte('\n')
			}
		case whatChangedModel.PropertyRemoved, whatChangedModel.ObjectRemoved:
			if origVal != "" {
				sb.WriteString(styles.Removed.Render(fmt.Sprintf("  Value: %s", truncateStr(origVal, maxVal))))
				sb.WriteByte('\n')
			}
		case whatChangedModel.Modified:
			if origVal != "" || newVal != "" {
				sb.WriteString(fmt.Sprintf("  %s %s  %s  %s",
					styles.Grey.Render("Original:"),
					truncateStr(origVal, maxVal),
					styles.Grey.Render("->"),
					truncateStr(newVal, maxVal)))
				sb.WriteByte('\n')
			}
		}
	}

	// Blank line separating header from diff content
	sb.WriteByte('\n')

	return sb.String()
}

func changeAction(ct int) string {
	switch ct {
	case whatChangedModel.PropertyAdded, whatChangedModel.ObjectAdded:
		return "Added"
	case whatChangedModel.PropertyRemoved, whatChangedModel.ObjectRemoved:
		return "Removed"
	case whatChangedModel.Modified:
		return "Modified"
	default:
		return "Changed"
	}
}

func changeStyle(ct int, styles Styles) lipgloss.Style {
	switch ct {
	case whatChangedModel.PropertyAdded, whatChangedModel.ObjectAdded:
		return styles.Added
	case whatChangedModel.PropertyRemoved, whatChangedModel.ObjectRemoved:
		return styles.Removed
	case whatChangedModel.Modified:
		return styles.Modified
	default:
		return styles.Grey
	}
}

// appendNewlines converts lines to the newline-terminated format difflib expects.
func appendNewlines(lines []string) []string {
	out := make([]string, len(lines))
	for i, l := range lines {
		out[i] = l + "\n"
	}
	return out
}

func truncateStr(s string, max int) string {
	runes := []rune(s)
	if len(runes) <= max {
		return s
	}
	return string(runes[:max-3]) + "..."
}

func digitCount(n int) int {
	if n <= 0 {
		return 1
	}
	d := 0
	for n > 0 {
		n /= 10
		d++
	}
	return d
}

// renderSpecLines renders all physical source lines for a caller-owned viewport.
func renderSpecLines(lines []string, hl highlightRange, changeType int, contentW int, styles Styles) string {
	primaryStyle, rangeStyle, bodyGutter := contextHighlightStyles(changeType, styles)

	numWidth := digitCount(len(lines))
	var sb strings.Builder
	sb.Grow(min(len(lines), 1024) * (numWidth + min(contentW, 256) + 20))

	for i, line := range lines {
		line = safeText(line)
		if i > 0 {
			sb.WriteByte('\n')
		}
		lineNo := i + 1
		numStr := fmt.Sprintf("%*d", numWidth, lineNo)
		if lineNo == hl.start {
			content := fmt.Sprintf("> %s│ %s", numStr, line)
			if pad := contentW - visualLen(content); pad > 0 {
				content += strings.Repeat(" ", pad)
			}
			sb.WriteString(primaryStyle.Render(content))
		} else if lineNo > hl.start && lineNo <= hl.end {
			content := fmt.Sprintf("%s %s│ %s", bodyGutter, numStr, line)
			if pad := contentW - visualLen(content); pad > 0 {
				content += strings.Repeat(" ", pad)
			}
			sb.WriteString(rangeStyle.Render(content))
		} else {
			sb.WriteString(fmt.Sprintf("  %s%s %s",
				styles.Grey.Render(numStr),
				styles.Grey.Render("│"),
				highlightLine(line, styles)))
		}
	}
	return sb.String()
}
