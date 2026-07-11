// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package serve

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestRenderArchiveVariantsIncludesSpec(t *testing.T) {
	specBytes := []byte(`openapi: 3.1.0
info:
  title: Archive
  version: 1.0.0
paths: {}
`)
	dirs, err := RenderArchiveVariants(ArchiveRenderOptions{
		BasePath:    t.TempDir(),
		SpecPath:    "openapi.yaml",
		SpecBytes:   specBytes,
		IncludeSpec: true,
	})
	require.NoError(t, err)
	require.NotNil(t, dirs)
	defer dirs.Cleanup()

	included, err := os.ReadFile(filepath.Join(dirs.Plain, "spec", "openapi.yaml"))
	require.NoError(t, err)
	assert.Equal(t, specBytes, included)
}
