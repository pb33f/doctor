// Copyright 2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNoColorScheme(t *testing.T) {
	scheme := NoColorScheme{}

	// All methods should return input unchanged
	assert.Equal(t, "test", scheme.Addition("test"))
	assert.Equal(t, "test", scheme.Modification("test"))
	assert.Equal(t, "test", scheme.Removal("test"))
	assert.Equal(t, "test", scheme.Breaking("test"))
	assert.Equal(t, "test", scheme.TreeBranch("test"))
	assert.Equal(t, "test", scheme.LocationInfo("test"))
	assert.Equal(t, "test", scheme.Statistics("test"))
}

func TestGrayscaleColorScheme(t *testing.T) {
	scheme := GrayscaleColorScheme{}

	// Semantic methods should return input unchanged
	assert.Equal(t, "test", scheme.Addition("test"))
	assert.Equal(t, "test", scheme.Modification("test"))
	assert.Equal(t, "test", scheme.Removal("test"))
	assert.Equal(t, "test", scheme.Breaking("test"))

	// Chrome methods should wrap with grey
	assert.Equal(t, Grey+"test"+Reset, scheme.TreeBranch("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.LocationInfo("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.Statistics("test"))
}

func TestTerminalColorScheme(t *testing.T) {
	scheme := TerminalColorScheme{}

	// Semantic methods should wrap with appropriate colors
	assert.Equal(t, Green+"test"+Reset, scheme.Addition("test"))
	assert.Equal(t, Yellow+"test"+Reset, scheme.Modification("test"))
	assert.Equal(t, Red+"test"+Reset, scheme.Removal("test"))
	assert.Equal(t, RedBold+"test"+Reset, scheme.Breaking("test"))

	// Chrome methods should wrap with grey
	assert.Equal(t, Grey+"test"+Reset, scheme.TreeBranch("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.LocationInfo("test"))
	assert.Equal(t, Grey+"test"+Reset, scheme.Statistics("test"))
}

func TestColorConstants(t *testing.T) {
	// Verify color constants are valid ANSI escape codes
	assert.Equal(t, "\033[0m", Reset)
	assert.Equal(t, "\033[38;5;46m", Green)
	assert.Equal(t, "\033[38;5;220m", Yellow)
	assert.Equal(t, "\033[38;5;196m", Red)
	assert.Equal(t, "\033[1;38;5;196m", RedBold)
	assert.Equal(t, "\033[38;5;240m", Grey)
}

func TestColorSchemeInterface(t *testing.T) {
	// Verify all schemes implement ColorScheme interface
	var _ ColorScheme = NoColorScheme{}
	var _ ColorScheme = GrayscaleColorScheme{}
	var _ ColorScheme = TerminalColorScheme{}
}
