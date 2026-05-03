// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"context"
	"io"
	"log/slog"
	"os"
)

// NewCLIPrettyLogger creates a PrettyHandler-backed logger for CLI output.
func NewCLIPrettyLogger(writer io.Writer, level slog.Leveler) *slog.Logger {
	if writer == nil {
		writer = os.Stdout
	}
	if level == nil {
		level = slog.LevelInfo
	}
	return NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     writer,
		Level:      level,
		TimeFormat: TimeFormatDateTime,
	})
}

// LogSuccess writes a success-style log record using the PrettyHandler success level.
func LogSuccess(logger *slog.Logger, msg string, args ...any) {
	if logger == nil {
		logger = slog.Default()
	}
	logger.Log(context.Background(), LevelSuccess, msg, args...)
}
