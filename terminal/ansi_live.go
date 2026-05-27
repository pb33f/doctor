// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"io"
	"strings"
	"sync"

	tea "charm.land/bubbletea/v2"
)

// ansiLiveRenderer redraws a fixed terminal block using output-only ANSI escapes.
// It never sends terminal capability queries, so shells do not receive stray replies.
type ansiLiveRenderer struct {
	writer io.Writer

	mu     sync.Mutex
	active bool
	lines  int
}

func newANSILiveRenderer(writer io.Writer) *ansiLiveRenderer {
	return &ansiLiveRenderer{writer: writer}
}

func (r *ansiLiveRenderer) render(lines []string) {
	if r == nil || len(lines) == 0 {
		return
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	if r.active {
		r.moveToTop()
	}

	maxLines := len(lines)
	if r.lines > maxLines {
		maxLines = r.lines
	}

	for i := 0; i < maxLines; i++ {
		fmt.Fprint(r.writer, "\r\x1b[2K")
		if i < len(lines) {
			fmt.Fprint(r.writer, lines[i])
		}
		if i < maxLines-1 {
			fmt.Fprint(r.writer, "\n")
		}
	}

	r.active = true
	r.lines = len(lines)
}

func (r *ansiLiveRenderer) close() {
	if r == nil {
		return
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	if !r.active || r.lines == 0 {
		return
	}

	r.moveToTop()
	for i := 0; i < r.lines; i++ {
		fmt.Fprint(r.writer, "\r\x1b[2K")
		if i < r.lines-1 {
			fmt.Fprint(r.writer, "\n")
		}
	}
	if r.lines > 1 {
		fmt.Fprintf(r.writer, "\x1b[%dA", r.lines-1)
	}
	fmt.Fprint(r.writer, "\r")

	r.active = false
	r.lines = 0
}

func (r *ansiLiveRenderer) moveToTop() {
	fmt.Fprint(r.writer, "\r")
	if r.lines > 1 {
		fmt.Fprintf(r.writer, "\x1b[%dA", r.lines-1)
	}
}

func splitViewLines(view any) []string {
	rendered := ""
	switch v := view.(type) {
	case tea.View:
		rendered = v.Content
	case *tea.View:
		if v != nil {
			rendered = v.Content
		}
	default:
		rendered = fmt.Sprint(view)
	}
	rendered = strings.TrimRight(rendered, "\n")
	if rendered == "" {
		return nil
	}
	return strings.Split(rendered, "\n")
}
