// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestDetectBuildTargetSpecFileWithoutDocsIsSingle(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "openapi.yaml", "openapi: 3.1.0\n")
	writeGoldenFile(t, root, "about.md", "# About\n")
	input := filepath.Join(root, "openapi.yaml")

	target, err := DetectBuildTarget(input, BuildModeAuto)
	require.NoError(t, err)
	assert.False(t, target.Directory)
	assert.Equal(t, input, target.Input)
}

func TestDetectBuildTargetSpecFileWithDocsIsDocsSite(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "openapi.yaml", "openapi: 3.1.0\n")
	writeGoldenFile(t, root, "other.yaml", "openapi: 3.1.0\n")
	writeGoldenFile(t, root, "docs/guides/install.md", "# Install\n")

	target, err := DetectBuildTarget(filepath.Join(root, "openapi.yaml"), BuildModeAuto)
	require.NoError(t, err)
	assert.True(t, target.Directory)
	assert.Equal(t, root, target.Root)
	assert.Equal(t, []string{"openapi.yaml"}, target.Include, "only the named spec")
	assert.Equal(t, ppmodel.SiteKindDocs, target.SiteKind)
}

func TestDetectBuildTargetDocsFolderWithOnlyPartialsIsSingle(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "openapi.yaml", "openapi: 3.1.0\n")
	writeGoldenFile(t, root, "docs/_partials/note.md", "a partial\n")

	target, err := DetectBuildTarget(filepath.Join(root, "openapi.yaml"), BuildModeAuto)
	require.NoError(t, err)
	assert.False(t, target.Directory)
}

func TestDetectBuildTargetDirectoryLetsTheBuildDecide(t *testing.T) {
	root := t.TempDir()

	target, err := DetectBuildTarget(root, BuildModeAuto)
	require.NoError(t, err)
	assert.True(t, target.Directory)
	assert.Equal(t, root, target.Root)
	assert.Empty(t, target.SiteKind)
	assert.Empty(t, target.Include)
}

func TestDetectBuildTargetModeOverrides(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "openapi.yaml", "openapi: 3.1.0\n")
	writeGoldenFile(t, root, "docs/guide.md", "# Guide\n")
	spec := filepath.Join(root, "openapi.yaml")

	target, err := DetectBuildTarget(spec, BuildModeAPI)
	require.NoError(t, err)
	assert.False(t, target.Directory, "--mode api keeps a spec with docs a single-spec build")

	bare := t.TempDir()
	writeGoldenFile(t, bare, "openapi.yaml", "openapi: 3.1.0\n")
	target, err = DetectBuildTarget(filepath.Join(bare, "openapi.yaml"), BuildModeDocs)
	require.NoError(t, err)
	assert.True(t, target.Directory, "--mode docs makes a docs site even without a docs folder")
	assert.Equal(t, ppmodel.SiteKindDocs, target.SiteKind)

	target, err = DetectBuildTarget(root, BuildModeDocs)
	require.NoError(t, err)
	assert.Equal(t, ppmodel.SiteKindDocs, target.SiteKind)

	target, err = DetectBuildTarget(root, BuildModeCatalog)
	require.NoError(t, err)
	assert.Equal(t, ppmodel.SiteKindCatalog, target.SiteKind)

	_, err = DetectBuildTarget(root, BuildModeAPI)
	assert.ErrorContains(t, err, "needs a specification file")
	_, err = DetectBuildTarget(spec, BuildModeCatalog)
	assert.ErrorContains(t, err, "needs a directory")
	_, err = DetectBuildTarget("https://example.com/openapi.yaml", BuildModeDocs)
	assert.ErrorContains(t, err, "not a URL")
}

func TestDetectBuildTargetURLAndMissingInputAreSingle(t *testing.T) {
	target, err := DetectBuildTarget("https://example.com/openapi.yaml", BuildModeAuto)
	require.NoError(t, err)
	assert.False(t, target.Directory)

	target, err = DetectBuildTarget(filepath.Join(t.TempDir(), "missing.yaml"), BuildModeAuto)
	require.NoError(t, err)
	assert.False(t, target.Directory, "the caller reports the load error")
}

func TestParseBuildMode(t *testing.T) {
	for value, want := range map[string]BuildMode{"": BuildModeAuto, "api": BuildModeAPI, " Docs ": BuildModeDocs, "catalog": BuildModeCatalog} {
		got, err := ParseBuildMode(value)
		require.NoError(t, err, value)
		assert.Equal(t, want, got, value)
	}
	_, err := ParseBuildMode("site")
	assert.ErrorContains(t, err, "unknown build mode")
}

func TestSpecFileWithDocsBuildsDocsSiteWithOneService(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, root, "burgers.yaml", readGoldenSource(t, "../test_specs/burgershop.openapi.yaml"))
	writeGoldenFile(t, root, "docs/quickstart.md", "---\ntitle: Quickstart\n---\n# Quickstart\n")

	target, err := DetectBuildTarget(filepath.Join(root, "openapi.yaml"), BuildModeAuto)
	require.NoError(t, err)
	require.True(t, target.Directory)

	catalog, outputDir := buildDocsSiteFixture(t, target.Root, &AggregatePrintingPressConfig{
		Include:  target.Include,
		SiteKind: target.SiteKind,
	})
	assert.Equal(t, ppmodel.SiteKindDocs, catalog.Kind)
	require.Len(t, visibleCatalogServices(catalog), 1, "only the named spec is built")
	assert.Contains(t, readOutput(t, outputDir, "llms.txt"), "## APIs")
	assert.FileExists(t, filepath.Join(outputDir, "quickstart.html"))
}
