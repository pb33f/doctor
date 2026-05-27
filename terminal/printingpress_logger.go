// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"io"
	"log/slog"
)

// BuildLoggerSession routes slog output so it does not fight live progress.
type BuildLoggerSession struct {
	previous *slog.Logger
	Logger   *slog.Logger
	handler  *PrettyHandler
	buffered bool
}

func ConfigureBuildLogger(writer io.Writer, palette Palette, mode ActivityRenderMode) *BuildLoggerSession {
	buffered := mode == ActivityRenderModeProgress
	level := slog.LevelWarn
	if mode == ActivityRenderModeDebug {
		level = slog.LevelDebug
	}
	handler := NewPrettyHandler(&PrettyHandlerOptions{
		Level:      level,
		TimeFormat: TimeFormatTimeOnly,
		Writer:     writer,
		Palette:    &palette,
		Buffer:     buffered,
	})
	previous := slog.Default()
	logger := slog.New(handler)
	slog.SetDefault(logger)
	return &BuildLoggerSession{
		previous: previous,
		Logger:   logger,
		handler:  handler,
		buffered: buffered,
	}
}

func (s *BuildLoggerSession) Finish(runErr error) {
	if s == nil {
		return
	}
	if s.buffered && runErr != nil && s.handler != nil {
		_ = s.handler.Flush()
	}
	if s.previous != nil {
		slog.SetDefault(s.previous)
	}
}
