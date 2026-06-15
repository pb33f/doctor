//go:build windows

package terminal

import (
	"bytes"
	"context"
	"os"
	"os/exec"
	"syscall"
	"testing"
	"time"

	"github.com/pb33f/testify/require"
)

const createNoWindow = 0x08000000

func TestDetectDarkBackground_NoConsoleRedirectedStdinDoesNotHang(t *testing.T) {
	if os.Getenv("PB33F_TERMINAL_THEME_HELPER") == "1" {
		_ = os.Unsetenv("PB33F_DARK_BACKGROUND")
		_ = os.Unsetenv("COLORFGBG")
		_ = DetectDarkBackground()
		os.Exit(0)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, os.Args[0], "-test.run=TestDetectDarkBackground_NoConsoleRedirectedStdinDoesNotHang")
	cmd.Env = envWithout(os.Environ(), "PB33F_DARK_BACKGROUND", "COLORFGBG")
	cmd.Env = append(cmd.Env, "PB33F_TERMINAL_THEME_HELPER=1")
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: createNoWindow}

	stdin, err := cmd.StdinPipe()
	require.NoError(t, err)
	defer stdin.Close()

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if ctx.Err() == context.DeadlineExceeded {
		t.Fatalf("DetectDarkBackground hung with no console and redirected stdin; stdout=%q stderr=%q", stdout.String(), stderr.String())
	}
	require.NoError(t, err, "stdout=%q stderr=%q", stdout.String(), stderr.String())
}

func envWithout(env []string, keys ...string) []string {
	removed := make(map[string]struct{}, len(keys))
	for _, key := range keys {
		removed[key+"="] = struct{}{}
	}

	filtered := env[:0]
	for _, entry := range env {
		keep := true
		for prefix := range removed {
			if len(entry) >= len(prefix) && entry[:len(prefix)] == prefix {
				keep = false
				break
			}
		}
		if keep {
			filtered = append(filtered, entry)
		}
	}
	return filtered
}
