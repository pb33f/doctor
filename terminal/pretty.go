// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	lipgloss "charm.land/lipgloss/v2"
)

// TimeFormat constants for common timestamp formats.
const (
	TimeFormatFull     = time.RFC3339
	TimeFormatDateTime = "2006-01-02 15:04:05"
	TimeFormatTimeOnly = "15:04:05"
)

// tree drawing characters
const (
	treeBranch = "├─"
	treeCorner = "└─"
	treePipe   = "│ "
	treeSpace  = "  "
)

// LevelSuccess is a custom log level for success messages.
const LevelSuccess = slog.Level(2) // between Info (0) and Warn (4)

// leaderDot is the middle dot character for leader lines.
const leaderDot = "·"

// prettyStyles holds pre-rendered styles derived from a Palette.
// Built once in NewPrettyHandler to avoid per-log allocation.
type prettyStyles struct {
	levelDebug   string
	levelInfo    string
	levelSuccess string
	levelWarn    string
	levelError   string

	msgNormal  lipgloss.Style
	msgSuccess lipgloss.Style
	msgWarn    lipgloss.Style
	msgError   lipgloss.Style

	key        lipgloss.Style
	value      lipgloss.Style
	valueWarn  lipgloss.Style
	valueError lipgloss.Style

	time   lipgloss.Style
	tree   lipgloss.Style
	leader lipgloss.Style

	group      lipgloss.Style
	groupWarn  lipgloss.Style
	groupError lipgloss.Style
}

func buildStyles(p Palette) prettyStyles {
	badgeBase := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("0")).
		Padding(0, 1)

	return prettyStyles{
		levelDebug:   badgeBase.Background(p.Muted).Render("BUG"),
		levelInfo:    badgeBase.Background(p.Primary).Render("INF"),
		levelSuccess: badgeBase.Background(p.Addition).Render("   "),
		levelWarn:    badgeBase.Background(p.Modification).Render("WRN"),
		levelError:   badgeBase.Background(p.Removal).Render("ERR"),

		msgNormal:  lipgloss.NewStyle(),
		msgSuccess: lipgloss.NewStyle().Foreground(p.Addition),
		msgWarn:    lipgloss.NewStyle().Foreground(p.Modification),
		msgError:   lipgloss.NewStyle().Foreground(p.Removal).Bold(true),

		key:        lipgloss.NewStyle(),
		value:      lipgloss.NewStyle().Foreground(p.Primary),
		valueWarn:  lipgloss.NewStyle().Foreground(p.Modification),
		valueError: lipgloss.NewStyle().Foreground(p.Removal),

		time:   lipgloss.NewStyle().Faint(true),
		tree:   lipgloss.NewStyle().Faint(true),
		leader: lipgloss.NewStyle().Faint(true).Foreground(p.Muted),

		group:      lipgloss.NewStyle().Foreground(p.Secondary),
		groupWarn:  lipgloss.NewStyle().Foreground(p.Modification),
		groupError: lipgloss.NewStyle().Foreground(p.Removal),
	}
}

// PrettyHandlerOptions configures the PrettyHandler.
type PrettyHandlerOptions struct {
	// Level is the minimum level to log. Defaults to slog.LevelInfo.
	Level slog.Leveler

	// TimeFormat is the format for timestamps. Defaults to TimeFormatFull (RFC3339).
	TimeFormat string

	// Writer is the output destination. Defaults to os.Stdout.
	Writer io.Writer

	// Palette provides colors for styling. Defaults to PaletteForTheme(ThemeDark).
	Palette *Palette

	// Buffer defers writes until Flush is called.
	Buffer bool
}

// PrettyHandler is a slog.Handler that outputs logs in a tree format
// with colors derived from the terminal Palette.
type PrettyHandler struct {
	opts   PrettyHandlerOptions
	styles prettyStyles
	mu     *sync.Mutex
	buffer *bytes.Buffer
	groups []string
	attrs  []slog.Attr
}

// NewPrettyHandler creates a new PrettyHandler with the given options.
func NewPrettyHandler(opts *PrettyHandlerOptions) *PrettyHandler {
	if opts == nil {
		opts = &PrettyHandlerOptions{}
	}
	if opts.Level == nil {
		opts.Level = slog.LevelInfo
	}
	if opts.TimeFormat == "" {
		opts.TimeFormat = TimeFormatFull
	}
	if opts.Writer == nil {
		opts.Writer = os.Stdout
	}

	var p Palette
	if opts.Palette != nil {
		p = *opts.Palette
	} else {
		p = PaletteForTheme(ThemeDark)
	}

	return &PrettyHandler{
		opts:   *opts,
		styles: buildStyles(p),
		mu:     &sync.Mutex{},
		buffer: newPrettyBuffer(opts.Buffer),
	}
}

// Enabled reports whether the handler handles records at the given level.
func (h *PrettyHandler) Enabled(_ context.Context, level slog.Level) bool {
	return level >= h.opts.Level.Level()
}

// Handle handles the Record.
func (h *PrettyHandler) Handle(_ context.Context, r slog.Record) error {
	h.mu.Lock()
	defer h.mu.Unlock()

	// pre-allocate buffer with reasonable capacity to minimize allocations
	estimatedSize := 200 + (len(h.attrs)+r.NumAttrs())*50
	buf := make([]byte, 0, estimatedSize)

	// timestamp
	ts := h.styles.time.Render(r.Time.Format(h.opts.TimeFormat))
	buf = append(buf, ts...)
	buf = append(buf, ' ')

	// level
	buf = append(buf, h.formatLevel(r.Level)...)
	buf = append(buf, " "...)

	// message (styled based on level)
	buf = append(buf, h.formatMessage(r.Level, r.Message)...)
	buf = append(buf, '\n')

	// collect all attributes (pre-set + record attrs)
	allAttrs := make([]slog.Attr, 0, len(h.attrs)+r.NumAttrs())
	allAttrs = append(allAttrs, h.attrs...)
	r.Attrs(func(a slog.Attr) bool {
		allAttrs = append(allAttrs, a)
		return true
	})

	// render attributes as tree
	if len(allAttrs) > 0 {
		buf = h.renderAttrs(buf, allAttrs, h.groups, "       ", r.Level)
	}

	// blank line between log entries for readability
	buf = append(buf, '\n')

	if h.buffer != nil {
		_, err := h.buffer.Write(buf)
		return err
	}

	_, err := h.opts.Writer.Write(buf)
	return err
}

// WithAttrs returns a new Handler with the given attributes added.
// The returned handler shares the parent's mutex to ensure thread-safe
// writes to the same underlying Writer.
func (h *PrettyHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	newAttrs := make([]slog.Attr, len(h.attrs), len(h.attrs)+len(attrs))
	copy(newAttrs, h.attrs)
	newAttrs = append(newAttrs, attrs...)

	return &PrettyHandler{
		opts:   h.opts,
		styles: h.styles,
		mu:     h.mu,
		buffer: h.buffer,
		groups: h.groups,
		attrs:  newAttrs,
	}
}

// WithGroup returns a new Handler with the given group appended to the receiver's existing groups.
func (h *PrettyHandler) WithGroup(name string) slog.Handler {
	if name == "" {
		return h
	}

	newGroups := make([]string, len(h.groups), len(h.groups)+1)
	copy(newGroups, h.groups)
	newGroups = append(newGroups, name)

	return &PrettyHandler{
		opts:   h.opts,
		styles: h.styles,
		mu:     h.mu,
		buffer: h.buffer,
		groups: newGroups,
		attrs:  h.attrs,
	}
}

// Buffered returns the currently buffered pretty log output.
func (h *PrettyHandler) Buffered() string {
	if h == nil || h.buffer == nil {
		return ""
	}
	h.mu.Lock()
	defer h.mu.Unlock()
	return h.buffer.String()
}

// Reset clears any buffered pretty log output.
func (h *PrettyHandler) Reset() {
	if h == nil || h.buffer == nil {
		return
	}
	h.mu.Lock()
	defer h.mu.Unlock()
	h.buffer.Reset()
}

// Flush writes any buffered pretty log output to the configured writer.
func (h *PrettyHandler) Flush() error {
	if h == nil || h.buffer == nil {
		return nil
	}
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.buffer.Len() == 0 {
		return nil
	}
	if _, err := h.opts.Writer.Write(h.buffer.Bytes()); err != nil {
		return err
	}
	h.buffer.Reset()
	return nil
}

// formatLevel returns the styled level string.
func (h *PrettyHandler) formatLevel(level slog.Level) string {
	switch {
	case level < slog.LevelInfo:
		return h.styles.levelDebug
	case level == LevelSuccess:
		return h.styles.levelSuccess
	case level < slog.LevelWarn:
		return h.styles.levelInfo
	case level < slog.LevelError:
		return h.styles.levelWarn
	default:
		return h.styles.levelError
	}
}

// formatMessage returns the styled message string based on level.
func (h *PrettyHandler) formatMessage(level slog.Level, msg string) string {
	switch {
	case level >= slog.LevelError:
		return h.styles.msgError.Render(msg)
	case level >= slog.LevelWarn:
		return h.styles.msgWarn.Render(msg)
	case level == LevelSuccess:
		return h.styles.msgSuccess.Render(msg)
	default:
		return h.styles.msgNormal.Render(msg)
	}
}

// selectConnector returns the appropriate styled tree connector based on position.
func (h *PrettyHandler) selectConnector(isLast bool) string {
	if isLast {
		return h.styles.tree.Render(treeCorner)
	}
	return h.styles.tree.Render(treeBranch)
}

// calculateChildPrefix returns the prefix for child nodes in the tree.
func (h *PrettyHandler) calculateChildPrefix(parentPrefix string, isLast bool) string {
	if isLast {
		return parentPrefix + treeSpace
	}
	return parentPrefix + h.styles.tree.Render(treePipe)
}

// maxKeyWidth calculates the maximum key width for non-group attributes.
func (h *PrettyHandler) maxKeyWidth(attrs []slog.Attr) int {
	maxWidth := 0
	for _, attr := range attrs {
		if attr.Key == "" {
			continue
		}
		if attr.Value.Kind() != slog.KindGroup && len(attr.Key) > maxWidth {
			maxWidth = len(attr.Key)
		}
	}
	return maxWidth
}

// renderAttrs renders attributes as a tree structure.
func (h *PrettyHandler) renderAttrs(buf []byte, attrs []slog.Attr, groups []string, prefix string, level slog.Level) []byte {
	// if we have groups to render first, nest into them
	if len(groups) > 0 {
		groupName := groups[0]
		isLast := len(attrs) == 0 && len(groups) == 1

		buf = append(buf, prefix...)
		buf = append(buf, h.selectConnector(isLast)...)
		buf = append(buf, ' ')
		buf = append(buf, h.formatGroupStyled(groupName, level)...)
		buf = append(buf, '\n')

		return h.renderAttrs(buf, attrs, groups[1:], h.calculateChildPrefix(prefix, isLast), level)
	}

	// calculate max key width for right-alignment
	keyWidth := h.maxKeyWidth(attrs)

	for i, attr := range attrs {
		isLast := i == len(attrs)-1
		buf = h.renderAttr(buf, attr, prefix, isLast, keyWidth, level)
	}

	return buf
}

// renderAttr renders a single attribute, handling nested groups.
func (h *PrettyHandler) renderAttr(buf []byte, attr slog.Attr, prefix string, isLast bool, keyWidth int, level slog.Level) []byte {
	attr.Value = attr.Value.Resolve()

	if attr.Equal(slog.Attr{}) {
		return buf
	}

	connector := h.selectConnector(isLast)

	// handle group values (nested attributes)
	if attr.Value.Kind() == slog.KindGroup {
		groupAttrs := attr.Value.Group()
		if len(groupAttrs) == 0 {
			return buf
		}

		buf = append(buf, prefix...)
		buf = append(buf, connector...)
		buf = append(buf, ' ')
		buf = append(buf, h.formatGroupStyled(attr.Key, level)...)
		buf = append(buf, '\n')

		childKeyWidth := h.maxKeyWidth(groupAttrs)
		childPrefix := h.calculateChildPrefix(prefix, isLast)
		for j, nested := range groupAttrs {
			nestedIsLast := j == len(groupAttrs)-1
			buf = h.renderAttr(buf, nested, childPrefix, nestedIsLast, childKeyWidth, level)
		}

		return buf
	}

	// render key: value with right-aligned key and leader dots
	buf = append(buf, prefix...)
	buf = append(buf, connector...)
	buf = append(buf, ' ')
	padding := keyWidth - len(attr.Key)
	if padding > 1 {
		dots := strings.Repeat(leaderDot, padding-1)
		buf = append(buf, h.styles.leader.Render(dots)...)
		buf = append(buf, ' ')
	} else if padding == 1 {
		buf = append(buf, ' ')
	}
	buf = append(buf, h.styles.key.Render(attr.Key)...)
	buf = append(buf, ": "...)
	buf = append(buf, h.formatValueStyled(attr.Value, level)...)
	buf = append(buf, '\n')

	return buf
}

// formatValueStyled formats and styles an attribute value based on log level.
func (h *PrettyHandler) formatValueStyled(v slog.Value, level slog.Level) string {
	formatted := h.formatValue(v)
	switch {
	case level >= slog.LevelError:
		return h.styles.valueError.Render(formatted)
	case level >= slog.LevelWarn:
		return h.styles.valueWarn.Render(formatted)
	default:
		return h.styles.value.Render(formatted)
	}
}

// formatGroupStyled formats and styles a group name based on log level.
func (h *PrettyHandler) formatGroupStyled(name string, level slog.Level) string {
	bracketed := "[" + name + "]"
	switch {
	case level >= slog.LevelError:
		return h.styles.groupError.Render(bracketed)
	case level >= slog.LevelWarn:
		return h.styles.groupWarn.Render(bracketed)
	default:
		return h.styles.group.Render(bracketed)
	}
}

// formatValue formats an attribute value as a string.
func (h *PrettyHandler) formatValue(v slog.Value) string {
	switch v.Kind() {
	case slog.KindString:
		return v.String()
	case slog.KindInt64:
		return strconv.FormatInt(v.Int64(), 10)
	case slog.KindUint64:
		return strconv.FormatUint(v.Uint64(), 10)
	case slog.KindFloat64:
		return strconv.FormatFloat(v.Float64(), 'g', -1, 64)
	case slog.KindBool:
		if v.Bool() {
			return "true"
		}
		return "false"
	case slog.KindDuration:
		return v.Duration().String()
	case slog.KindTime:
		return v.Time().Format(h.opts.TimeFormat)
	case slog.KindAny:
		return fmt.Sprintf("%v", v.Any())
	default:
		return v.String()
	}
}

// NewPrettyLogger creates a new slog.Logger with a PrettyHandler.
func NewPrettyLogger(opts *PrettyHandlerOptions) *slog.Logger {
	return slog.New(NewPrettyHandler(opts))
}

func newPrettyBuffer(enabled bool) *bytes.Buffer {
	if !enabled {
		return nil
	}
	return &bytes.Buffer{}
}
