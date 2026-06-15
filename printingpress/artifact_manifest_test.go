// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestPrintingPress_WritesHostedArtifactManifestWhenEnabled(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	expiresAt := time.Date(2026, 5, 9, 12, 30, 0, 0, time.UTC)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:              "Burger Shop",
		BaseURL:            "/ppress/docs/doc-123/",
		OutputDir:          outputDir,
		AssetMode:          HTMLAssetModeServed,
		Embedded:           true,
		ExpiresAt:          &expiresAt,
		SharedAssetBaseURL: "/ppress/static/v1",
		Artifact: &ArtifactManifestConfig{
			Enabled:              true,
			DocumentID:           "doc-123",
			Visibility:           ArtifactVisibilityPrivate,
			WorkspaceID:          "workspace-123",
			WorkspaceContentHash: "hash-123",
			AssetVersion:         "asset-123",
			ExpiresAt:            expiresAt.Format(time.RFC3339Nano),
			GzipSidecars:         true,
			Entrypoints: map[string]string{
				"default":  "index.html",
				"embedded": "index.html",
			},
		},
	})
	require.NoError(t, err)

	staleStaticAssets := []string{
		filepath.Join(outputDir, "static", "printing-press.css"),
		filepath.Join(outputDir, "static", "printing-press.js"),
		filepath.Join(outputDir, "static", "printing-press-shared.js"),
		filepath.Join(outputDir, "static", "printing-press-shared.json"),
		filepath.Join(outputDir, "static", "page-data", "operations", "stale.json"),
		filepath.Join(outputDir, "static", "page-viz", "models", "schemas", "stale.json"),
	}
	for _, staleAsset := range staleStaticAssets {
		require.NoError(t, os.MkdirAll(filepath.Dir(staleAsset), 0o755))
		require.NoError(t, os.WriteFile(staleAsset, []byte("stale"), 0o644))
		require.NoError(t, os.WriteFile(staleAsset+".gz", []byte("stale gzip"), 0o644))
	}

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	assert.Contains(t, stats.FileSizes, ArtifactManifestFilename)

	body, err := os.ReadFile(filepath.Join(outputDir, ArtifactManifestFilename))
	require.NoError(t, err)

	var manifest HostedArtifactManifest
	require.NoError(t, json.Unmarshal(body, &manifest))
	assert.Equal(t, ArtifactManifestVersion, manifest.ManifestVersion)
	assert.Equal(t, "doc-123", manifest.DocumentID)
	assert.Equal(t, ArtifactVisibilityPrivate, manifest.Visibility)
	assert.Equal(t, "workspace-123", manifest.WorkspaceID)
	assert.Equal(t, "hash-123", manifest.WorkspaceContentHash)
	assert.Equal(t, "asset-123", manifest.AssetVersion)
	assert.Equal(t, expiresAt.Format(time.RFC3339Nano), manifest.ExpiresAt)
	assert.Equal(t, "index.html", manifest.Entrypoints["embedded"])

	indexMeta, ok := manifest.Files["index.html"]
	require.True(t, ok)
	assert.Equal(t, ArtifactAccessProtected, indexMeta.Access)
	assert.Equal(t, "text/html; charset=utf-8", indexMeta.ContentType)
	assert.NotEmpty(t, indexMeta.ETag)
	assert.True(t, indexMeta.Gzip)
	assert.FileExists(t, filepath.Join(outputDir, "index.html.gz"))

	// shared assets live at the host's shared URL — they must not appear in
	// the per-artifact manifest or on disk under the artifact root.
	_, hasSharedJS := manifest.Files["static/printing-press.js"]
	assert.False(t, hasSharedJS, "static/printing-press.js must not be packed into the artifact when SharedAssetBaseURL is set")
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "printing-press.js"))
	for _, staleAsset := range staleStaticAssets {
		rel, relErr := filepath.Rel(outputDir, staleAsset)
		require.NoError(t, relErr)
		_, hasStaleAsset := manifest.Files[filepath.ToSlash(rel)]
		assert.False(t, hasStaleAsset, "stale static asset %s must not be packed into the artifact", staleAsset)
		assert.NoFileExists(t, staleAsset)
		assert.NoFileExists(t, staleAsset+".gz")
	}

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), `data-pp-embedded-docs`)
	assert.Contains(t, string(indexHTML), `data-pp-document-id="doc-123"`)
	assert.Contains(t, string(indexHTML), `data-docs-expires-at="2026-05-09T12:30:00Z"`)
	assert.Contains(t, string(indexHTML), `type:"ppress:ready"`)
	// generated HTML references shared assets at SharedAssetBaseURL, not under the artifact's static/ dir.
	assert.Contains(t, string(indexHTML), `data-pp-shared-asset-base-url="/ppress/static/v1"`)
	assert.Contains(t, string(indexHTML), `href="/ppress/static/v1/printing-press.css"`)
	assert.Contains(t, string(indexHTML), `src="/ppress/static/v1/printing-press.js"`)
	assert.NotContains(t, string(indexHTML), `frameToken`)
	assert.NotContains(t, string(indexHTML), `ppframe`)
	assert.NotContains(t, string(indexHTML), `ppexpires`)
	assert.NotContains(t, string(indexHTML), `documentID`)
	assert.NotContains(t, string(indexHTML), `pp-layout-fallback-header`)
}

func TestPrintingPress_DoesNotWriteHostedArtifactManifestByDefault(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, ArtifactManifestFilename), []byte("stale manifest"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, ArtifactManifestFilename+".gz"), []byte("stale manifest gzip"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, "index.html.gz"), []byte("stale index gzip"), 0o644))

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:     "Burger Shop",
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	_, err = pp.PrintHTML()
	require.NoError(t, err)
	assert.NoFileExists(t, filepath.Join(outputDir, ArtifactManifestFilename))
	assert.NoFileExists(t, filepath.Join(outputDir, ArtifactManifestFilename+".gz"))
	assert.NoFileExists(t, filepath.Join(outputDir, "index.html.gz"))
}

func TestPrintingPress_RemovesHostedArtifactManifestWhenDisabled(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, ArtifactManifestFilename), []byte("stale manifest"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, ArtifactManifestFilename+".gz"), []byte("stale manifest gzip"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, "index.html.gz"), []byte("stale index gzip"), 0o644))

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:     "Burger Shop",
		OutputDir: outputDir,
		Artifact: &ArtifactManifestConfig{
			Enabled:    false,
			DocumentID: "doc-disabled",
		},
	})
	require.NoError(t, err)

	_, err = pp.PrintHTML()
	require.NoError(t, err)
	assert.NoFileExists(t, filepath.Join(outputDir, ArtifactManifestFilename))
	assert.NoFileExists(t, filepath.Join(outputDir, ArtifactManifestFilename+".gz"))
	assert.NoFileExists(t, filepath.Join(outputDir, "index.html.gz"))
}

func TestWriteHostedArtifactContract_RemovesStaleGzipSidecars(t *testing.T) {
	outputDir := t.TempDir()
	indexPath := filepath.Join(outputDir, "index.html")
	config := &ArtifactManifestConfig{
		Enabled:      true,
		DocumentID:   "doc-123",
		GzipSidecars: true,
	}

	require.NoError(t, os.WriteFile(indexPath, []byte(strings.Repeat("large html ", 200)), 0o644))
	_, err := writeHostedArtifactContract(outputDir, config, []string{indexPath})
	require.NoError(t, err)
	assert.FileExists(t, indexPath+".gz")
	assert.True(t, readHostedArtifactManifestForTest(t, outputDir).Files["index.html"].Gzip)

	require.NoError(t, os.WriteFile(indexPath, []byte("small html"), 0o644))
	_, err = writeHostedArtifactContract(outputDir, config, []string{indexPath})
	require.NoError(t, err)
	assert.NoFileExists(t, indexPath+".gz")
	assert.False(t, readHostedArtifactManifestForTest(t, outputDir).Files["index.html"].Gzip)

	require.NoError(t, os.WriteFile(indexPath+".gz", []byte("stale gzip"), 0o644))
	config.GzipSidecars = false
	_, err = writeHostedArtifactContract(outputDir, config, []string{indexPath})
	require.NoError(t, err)
	assert.NoFileExists(t, indexPath+".gz")
	assert.False(t, readHostedArtifactManifestForTest(t, outputDir).Files["index.html"].Gzip)
}

func TestWriteHostedArtifactContract_OnlyIncludesGeneratedFiles(t *testing.T) {
	outputDir := t.TempDir()
	indexPath := filepath.Join(outputDir, "index.html")
	currentDataPath := filepath.Join(outputDir, "data", "nav.json")
	staleOperationPath := filepath.Join(outputDir, "operations", "stale.html")
	staleJSONPath := filepath.Join(outputDir, "bundle.json")
	tempPath := filepath.Join(outputDir, ".partial.tmp")
	outsidePath := filepath.Join(t.TempDir(), "outside.html")

	for _, path := range []string{indexPath, currentDataPath, staleOperationPath, staleJSONPath, tempPath, outsidePath} {
		require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
		require.NoError(t, os.WriteFile(path, []byte(strings.Repeat(filepath.Base(path)+" ", 200)), 0o644))
		require.NoError(t, os.WriteFile(path+".gz", []byte("stale gzip"), 0o644))
	}

	_, err := writeHostedArtifactContract(outputDir, &ArtifactManifestConfig{
		Enabled:      true,
		DocumentID:   "doc-123",
		GzipSidecars: true,
	}, []string{
		indexPath,
		currentDataPath,
		staleOperationPath + ".gz",
		outsidePath,
		filepath.Join(outputDir, "missing.html"),
	})
	require.NoError(t, err)

	manifest := readHostedArtifactManifestForTest(t, outputDir)
	assert.Contains(t, manifest.Files, "index.html")
	assert.Contains(t, manifest.Files, "data/nav.json")
	assert.NotContains(t, manifest.Files, "operations/stale.html")
	assert.NotContains(t, manifest.Files, "bundle.json")
	assert.NotContains(t, manifest.Files, ".partial.tmp")

	assert.FileExists(t, indexPath+".gz")
	assert.FileExists(t, currentDataPath+".gz")
	assert.FileExists(t, staleOperationPath+".gz")
	assert.True(t, manifest.Files["index.html"].Gzip)
	assert.True(t, manifest.Files["data/nav.json"].Gzip)
}

func TestWriteHostedArtifactContract_NormalizesArtifactVisibility(t *testing.T) {
	outputDir := t.TempDir()
	indexPath := filepath.Join(outputDir, "index.html")
	require.NoError(t, os.WriteFile(indexPath, []byte(strings.Repeat("large html ", 200)), 0o644))

	_, err := writeHostedArtifactContract(outputDir, &ArtifactManifestConfig{
		Enabled:    true,
		DocumentID: "doc-123",
		Visibility: "Private",
	}, []string{indexPath})
	require.NoError(t, err)

	manifest := readHostedArtifactManifestForTest(t, outputDir)
	assert.Equal(t, ArtifactVisibilityPrivate, manifest.Visibility)
	assert.Equal(t, ArtifactAccessProtected, manifest.Files["index.html"].Access)
}

func TestWriteHostedArtifactContract_RejectsUnknownArtifactVisibility(t *testing.T) {
	outputDir := t.TempDir()
	indexPath := filepath.Join(outputDir, "index.html")
	require.NoError(t, os.WriteFile(indexPath, []byte(strings.Repeat("large html ", 200)), 0o644))

	_, err := writeHostedArtifactContract(outputDir, &ArtifactManifestConfig{
		Enabled:      true,
		DocumentID:   "doc-123",
		Visibility:   "internal",
		GzipSidecars: true,
	}, []string{indexPath})
	require.Error(t, err)
	assert.ErrorContains(t, err, `unknown artifact visibility "internal"`)
	assert.NoFileExists(t, filepath.Join(outputDir, ArtifactManifestFilename))
	assert.NoFileExists(t, indexPath+".gz")
}

func readHostedArtifactManifestForTest(t *testing.T, outputDir string) HostedArtifactManifest {
	t.Helper()

	body, err := os.ReadFile(filepath.Join(outputDir, ArtifactManifestFilename))
	require.NoError(t, err)

	var manifest HostedArtifactManifest
	require.NoError(t, json.Unmarshal(body, &manifest))
	return manifest
}
