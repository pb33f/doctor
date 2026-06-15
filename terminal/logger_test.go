// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"bytes"
	"log/slog"
	"testing"

	"github.com/pb33f/testify/assert"
)

func TestNewCLIPrettyLoggerFiltersByLevel(t *testing.T) {
	var buf bytes.Buffer
	logger := NewCLIPrettyLogger(&buf, slog.LevelWarn)

	logger.Info("hidden")
	logger.Warn("shown")

	output := buf.String()
	assert.NotContains(t, output, "hidden")
	assert.Contains(t, output, "shown")
	assert.Contains(t, output, "WRN")
}

func TestLogSuccessUsesSuccessLevel(t *testing.T) {
	var buf bytes.Buffer
	logger := NewCLIPrettyLogger(&buf, slog.LevelInfo)

	LogSuccess(logger, "passed validation", "count", 3)

	output := buf.String()
	assert.Contains(t, output, "passed validation")
	assert.Contains(t, output, "count")
	assert.Contains(t, output, "3")
}
