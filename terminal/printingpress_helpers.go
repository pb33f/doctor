// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pb33f/doctor/printingpress"
)

var ActivityRenderWaitTimeout = 2 * time.Second

const printingPressTerminalGutter = " "

// RunWithActivity renders a printing press activity stream while run executes.
func RunWithActivity[T any](pp *printingpress.PrintingPress, renderer ActivityRenderer, run func() (T, error)) (T, error) {
	var zero T
	if pp == nil || run == nil {
		return zero, fmt.Errorf("printing press and run function are required")
	}
	if renderer == nil {
		return run()
	}
	sub := pp.ActivityStream()
	done := make(chan struct{})
	go func() {
		renderer.RenderActivity(sub)
		close(done)
	}()
	result, err := run()
	if sub != nil {
		sub.Close()
	}
	select {
	case <-done:
	case <-time.After(ActivityRenderWaitTimeout):
		slog.Warn("activity renderer did not shut down before timeout", "timeout", RoundDuration(ActivityRenderWaitTimeout).String())
	}
	return result, err
}

// FormatActivity renders a single printing press activity update as plain text.
func FormatActivity(update printingpress.ActivityUpdate) string {
	label := strings.ToUpper(update.JobType)
	if label == "" {
		label = "WORK"
	}

	switch update.Status {
	case "completed":
		return fmt.Sprintf("[%s] completed in %s", label, RoundDuration(update.Elapsed))
	case "failed":
		if update.Error != "" {
			return fmt.Sprintf("[%s] failed: %s", label, update.Error)
		}
		return fmt.Sprintf("[%s] failed", label)
	default:
		if update.TotalTasks > 0 {
			return fmt.Sprintf("[%s] %s (%d/%d %.0f%%)", label, update.CurrentTask, update.CompletedTasks, update.TotalTasks, update.PercentComplete)
		}
		return fmt.Sprintf("[%s] %s", label, update.CurrentTask)
	}
}

// FormatStatusLine renders a stage/status pair as plain text.
func FormatStatusLine(label, message string) string {
	return fmt.Sprintf("[%s] %s", strings.ToUpper(label), message)
}

func withPrintingPressGutter(line string) string {
	return printingPressTerminalGutter + line
}

func withPrintingPressGutterLines(lines []string) []string {
	if len(lines) == 0 {
		return nil
	}
	indented := make([]string, len(lines))
	for i, line := range lines {
		indented[i] = withPrintingPressGutter(line)
	}
	return indented
}

func withPrintingPressGutterBlock(block string) string {
	if block == "" {
		return ""
	}
	lines := strings.Split(block, "\n")
	for i, line := range lines {
		lines[i] = withPrintingPressGutter(line)
	}
	return strings.Join(lines, "\n")
}

// RoundDuration trims terminal-facing durations to millisecond precision.
func RoundDuration(d time.Duration) time.Duration {
	if d < time.Millisecond {
		return d
	}
	return d.Round(time.Millisecond)
}

// ScanOutputDir returns the count and combined size of files below root.
func ScanOutputDir(root string) (int, int64, error) {
	var files int
	var totalBytes int64
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		files++
		totalBytes += info.Size()
		return nil
	})
	if err != nil {
		return 0, 0, fmt.Errorf("scan output directory: %w", err)
	}
	return files, totalBytes, nil
}

// HumanBytes formats a byte count using binary units.
func HumanBytes(size int64) string {
	const unit = 1024
	if size < unit {
		return fmt.Sprintf("%s B", FormatCount(size))
	}
	div, exp := int64(unit), 0
	for n := size / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %ciB", float64(size)/float64(div), "KMGTPE"[exp])
}

func FormatCount[T ~int | ~int64](value T) string {
	negative := value < 0
	n := int64(value)
	if negative {
		n = -n
	}

	raw := fmt.Sprintf("%d", n)
	if len(raw) <= 3 {
		if negative {
			return "-" + raw
		}
		return raw
	}

	firstGroup := len(raw) % 3
	if firstGroup == 0 {
		firstGroup = 3
	}
	var b strings.Builder
	if negative {
		b.WriteByte('-')
	}
	b.WriteString(raw[:firstGroup])
	for i := firstGroup; i < len(raw); i += 3 {
		b.WriteByte(',')
		b.WriteString(raw[i : i+3])
	}
	return b.String()
}
