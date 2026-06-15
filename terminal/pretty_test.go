// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"bytes"
	"log/slog"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/testify/assert"
)

func TestNewPrettyHandler_Defaults(t *testing.T) {
	h := NewPrettyHandler(nil)

	assert.NotNil(t, h)
	assert.Equal(t, slog.LevelInfo, h.opts.Level.Level())
	assert.Equal(t, TimeFormatFull, h.opts.TimeFormat)
}

func TestNewPrettyHandler_CustomOptions(t *testing.T) {
	var buf bytes.Buffer
	h := NewPrettyHandler(&PrettyHandlerOptions{
		Level:      slog.LevelDebug,
		TimeFormat: TimeFormatTimeOnly,
		Writer:     &buf,
	})

	assert.Equal(t, slog.LevelDebug, h.opts.Level.Level())
	assert.Equal(t, TimeFormatTimeOnly, h.opts.TimeFormat)
}

func TestNewPrettyHandler_CustomPalette(t *testing.T) {
	var buf bytes.Buffer
	p := PaletteForTheme(ThemeTektronix)
	h := NewPrettyHandler(&PrettyHandlerOptions{
		Writer:  &buf,
		Palette: &p,
	})

	assert.NotNil(t, h)
	assert.Equal(t, slog.LevelInfo, h.opts.Level.Level())
}

func TestPrettyHandler_Enabled(t *testing.T) {
	h := NewPrettyHandler(&PrettyHandlerOptions{
		Level: slog.LevelWarn,
	})

	ctx := t.Context()
	assert.False(t, h.Enabled(ctx, slog.LevelDebug))
	assert.False(t, h.Enabled(ctx, slog.LevelInfo))
	assert.True(t, h.Enabled(ctx, slog.LevelWarn))
	assert.True(t, h.Enabled(ctx, slog.LevelError))
}

func TestPrettyHandler_SimpleLog(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
	})

	logger.Info("server started")

	output := buf.String()
	assert.Contains(t, output, "INF")
	assert.Contains(t, output, "server started")
}

func TestPrettyHandler_WithAttributes(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
	})

	logger.Info("request processed",
		"method", "GET",
		"path", "/api/health",
		"status", 200,
	)

	output := buf.String()
	assert.Contains(t, output, "request processed")
	assert.Contains(t, output, "method")
	assert.Contains(t, output, "GET")
	assert.Contains(t, output, "path")
	assert.Contains(t, output, "/api/health")
	assert.Contains(t, output, "status")
	assert.Contains(t, output, "200")
	assert.Contains(t, output, "├─")
	assert.Contains(t, output, "└─")
}

func TestPrettyHandler_WithGroup(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
	})

	logger.WithGroup("database").Info("connected",
		"driver", "postgres",
		"host", "localhost",
	)

	output := buf.String()
	assert.Contains(t, output, "database")
	assert.Contains(t, output, "driver")
	assert.Contains(t, output, "postgres")
}

func TestPrettyHandler_NestedGroups(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
	})

	logger.Info("config loaded",
		slog.Group("database",
			"driver", "postgres",
			slog.Group("pool",
				"max", 10,
				"idle", 5,
			),
		),
	)

	output := buf.String()
	assert.Contains(t, output, "database")
	assert.Contains(t, output, "pool")
	assert.Contains(t, output, "max")
	assert.Contains(t, output, "10")
}

func TestPrettyHandler_AllLevels(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer: &buf,
		Level:  slog.LevelDebug,
	})

	logger.Debug("debug message")
	logger.Info("info message")
	logger.Warn("warn message")
	logger.Error("error message")

	output := buf.String()
	assert.Contains(t, output, "BUG")
	assert.Contains(t, output, "INF")
	assert.Contains(t, output, "WRN")
	assert.Contains(t, output, "ERR")
}

func TestPrettyHandler_ValueTypes(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer: &buf,
	})

	logger.Info("testing types",
		"string", "hello",
		"int", 42,
		"float", 3.14,
		"bool", true,
		"duration", time.Second*5,
	)

	output := buf.String()
	assert.Contains(t, output, "hello")
	assert.Contains(t, output, "42")
	assert.Contains(t, output, "3.14")
	assert.Contains(t, output, "true")
	assert.Contains(t, output, "5s")
}

func TestPrettyHandler_WithAttrs(t *testing.T) {
	var buf bytes.Buffer
	baseLogger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer: &buf,
	})

	logger := baseLogger.With("service", "api", "version", "1.0")
	logger.Info("starting")

	output := buf.String()
	assert.Contains(t, output, "service")
	assert.Contains(t, output, "api")
	assert.Contains(t, output, "version")
	assert.Contains(t, output, "1.0")
}

func TestPrettyHandler_TreeStructure(t *testing.T) {
	var buf bytes.Buffer
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
	})

	logger.Info("test",
		"first", "a",
		"second", "b",
		"third", "c",
	)

	output := buf.String()
	lines := strings.Split(output, "\n")

	branchCount := strings.Count(output, "├─")
	cornerCount := strings.Count(output, "└─")

	// with 3 attrs: 2 branches (├─) and 1 corner (└─)
	assert.Equal(t, 2, branchCount, "expected 2 branch connectors")
	assert.Equal(t, 1, cornerCount, "expected 1 corner connector")
	assert.GreaterOrEqual(t, len(lines), 4, "expected at least 4 lines")
}

func TestPrettyHandler_BufferModeDefersWrites(t *testing.T) {
	var buf bytes.Buffer
	handler := NewPrettyHandler(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
		Buffer:     true,
	})
	logger := slog.New(handler)

	logger.Warn("source bundling failed", "context", "/tmp/spec.yaml")

	assert.Empty(t, buf.String())
	assert.Contains(t, handler.Buffered(), "source bundling failed")
	assert.Contains(t, handler.Buffered(), "/tmp/spec.yaml")
}

func TestPrettyHandler_BufferModeFlushes(t *testing.T) {
	var buf bytes.Buffer
	handler := NewPrettyHandler(&PrettyHandlerOptions{
		Writer:     &buf,
		TimeFormat: TimeFormatTimeOnly,
		Buffer:     true,
	})
	logger := slog.New(handler)

	logger.Warn("source bundling failed", "context", "/tmp/spec.yaml")
	assert.NoError(t, handler.Flush())

	assert.Contains(t, buf.String(), "source bundling failed")
	assert.Contains(t, buf.String(), "/tmp/spec.yaml")
	assert.Empty(t, handler.Buffered())
}
