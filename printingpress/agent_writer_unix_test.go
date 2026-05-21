// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

//go:build unix

package printingpress

import (
	"os"
	"path/filepath"
	"syscall"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestOpenBufferedTextFilePreserves0644WithPermissiveUmask(t *testing.T) {
	dir := t.TempDir()
	previousUmask := syscall.Umask(0)
	t.Cleanup(func() {
		syscall.Umask(previousUmask)
	})

	path := filepath.Join(dir, "llms.txt")
	file, err := openBufferedTextFile(path)
	require.NoError(t, err)
	require.NoError(t, writeString(file.writer, "content"))
	require.NoError(t, file.close())

	info, err := os.Stat(path)
	require.NoError(t, err)
	assert.Equal(t, os.FileMode(0o644), info.Mode().Perm())
}
