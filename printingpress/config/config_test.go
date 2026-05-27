// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package config

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestLoadDiscoversAndResolvesRelativePaths(t *testing.T) {
	projectDir := t.TempDir()
	require.NoError(t, os.MkdirAll(filepath.Join(projectDir, "apis"), 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(projectDir, "printing-press.yaml"), []byte(`
output: ./site
basePath: ./specs
scan:
  root: ./apis
state:
  sqlite:
    path: ./state/cache.db
`), 0o644))

	cfg, err := Load("", projectDir)
	require.NoError(t, err)
	require.NotNil(t, cfg)
	require.Equal(t, filepath.Join(projectDir, "site"), cfg.Output)
	require.Equal(t, filepath.Join(projectDir, "specs"), cfg.BasePath)
	require.Equal(t, filepath.Join(projectDir, "apis"), cfg.Scan.Root)
	require.Equal(t, filepath.Join(projectDir, "state", "cache.db"), cfg.State.SQLite.Path)
}

func TestLoadReturnsNilWhenConfigMissing(t *testing.T) {
	cfg, err := Load("", filepath.Join(t.TempDir(), "openapi.yaml"))
	require.NoError(t, err)
	require.Nil(t, cfg)
}

func TestResolveRelativePathLeavesURLsAlone(t *testing.T) {
	require.Equal(t, "https://example.com/openapi.yaml", ResolveRelativePath("/tmp", "https://example.com/openapi.yaml"))
}
