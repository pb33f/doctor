package terminal

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDetectDarkBackgroundFromEnv_DefaultsDark(t *testing.T) {
	assert.True(t, DetectDarkBackgroundFromEnv(nil))
}

func TestDetectDarkBackgroundFromEnv_UsesOverride(t *testing.T) {
	env := []string{
		"COLORFGBG=15;0",
		"PB33F_DARK_BACKGROUND=light",
	}

	assert.False(t, DetectDarkBackgroundFromEnv(env))
}

func TestDetectDarkBackgroundFromEnv_UsesColorFGBGDarkBackground(t *testing.T) {
	assert.True(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=15;0"}))
}

func TestDetectDarkBackgroundFromEnv_UsesColorFGBGLightBackground(t *testing.T) {
	assert.False(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=0;15"}))
}

func TestDetectDarkBackgroundFromEnv_InvalidOverrideFallsBack(t *testing.T) {
	env := []string{
		"PB33F_DARK_BACKGROUND=maybe",
		"COLORFGBG=0;15",
	}

	assert.False(t, DetectDarkBackgroundFromEnv(env))
}

func TestDetectDarkBackgroundFromEnv_UsesColorFGBGXtermGrayscaleLightBackground(t *testing.T) {
	assert.False(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=0;255"}))
}

func TestDetectDarkBackgroundFromEnv_UsesColorFGBGXtermGrayscaleDarkBackground(t *testing.T) {
	assert.True(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=15;232"}))
}

func TestDetectDarkBackgroundFromEnv_UsesColorFGBGXtermCubeLuminance(t *testing.T) {
	assert.True(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=15;17"}))
	assert.False(t, DetectDarkBackgroundFromEnv([]string{"COLORFGBG=15;231"}))
}

func TestDetectDarkBackground_UsesTerminalFallbackWhenEnvHintsMissing(t *testing.T) {
	original := detectTerminalDarkBackground
	detectTerminalDarkBackground = func() bool {
		return false
	}
	t.Cleanup(func() {
		detectTerminalDarkBackground = original
	})

	require.NoError(t, os.Unsetenv("PB33F_DARK_BACKGROUND"))
	require.NoError(t, os.Unsetenv("COLORFGBG"))

	assert.False(t, DetectDarkBackground())
}

func TestDetectDarkBackground_EnvOverrideWinsOverTerminalFallback(t *testing.T) {
	original := detectTerminalDarkBackground
	detectTerminalDarkBackground = func() bool {
		return true
	}
	t.Cleanup(func() {
		detectTerminalDarkBackground = original
	})

	t.Setenv("PB33F_DARK_BACKGROUND", "light")
	t.Setenv("COLORFGBG", "")

	assert.False(t, DetectDarkBackground())
}

func TestCanQueryTerminalBackground_RejectsRedirectedHandles(t *testing.T) {
	stdinReader, stdinWriter, err := os.Pipe()
	require.NoError(t, err)
	t.Cleanup(func() {
		_ = stdinReader.Close()
		_ = stdinWriter.Close()
	})

	stderrReader, stderrWriter, err := os.Pipe()
	require.NoError(t, err)
	t.Cleanup(func() {
		_ = stderrReader.Close()
		_ = stderrWriter.Close()
	})

	assert.False(t, canQueryTerminalBackground(stdinReader, stderrWriter))
}
