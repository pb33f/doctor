// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package serve

import (
	"archive/zip"
	"bytes"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestStaticServerServesZipArchiveExport(t *testing.T) {
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "index.html"), []byte("<!doctype html><title>burger</title>"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(dir, "diagnostics.html"), []byte("<!doctype html><title>diagnostics</title>"), 0o644))

	server := httptest.NewServer(NewStaticServer(dir, ""))
	defer server.Close()

	resp, err := server.Client().Get(server.URL + ArchiveExportEndpoint)
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, "application/zip", resp.Header.Get("Content-Type"))
	assert.Contains(t, resp.Header.Get("Content-Disposition"), "printing-press-docs.zip")

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	zr, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	require.NoError(t, err)

	names := zipArchiveNames(zr)
	assert.Contains(t, names, "index.html")
	assert.NotContains(t, names, "diagnostics.html")
}

func TestStaticServerArchiveExportSkipsNestedDiagnosticsPayloads(t *testing.T) {
	dir := t.TempDir()
	writeArchiveTestFile(t, dir, "index.html", "catalog")
	writeArchiveTestFile(t, dir, "services/users/versions/v1/specs/users-api/index.html", "entry")
	writeArchiveTestFile(t, dir, "services/users/versions/v1/specs/users-api/diagnostics.html", "diagnostics")
	writeArchiveTestFile(t, dir, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.js", "globalThis.__PP_PAGE_DATA__ = {};")
	writeArchiveTestFile(t, dir, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.json", "{}")
	writeArchiveTestFile(t, dir, "services/users/versions/v1/specs/users-api/data/pages/root.js", "globalThis.__PP_PAGE_DATA__ = {};")

	server := httptest.NewServer(NewStaticServer(dir, ""))
	defer server.Close()

	resp, err := server.Client().Get(server.URL + ArchiveExportEndpoint)
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode)
	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	zr, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	require.NoError(t, err)

	names := zipArchiveNames(zr)
	assert.Contains(t, names, "services/users/versions/v1/specs/users-api/index.html")
	assert.Contains(t, names, "services/users/versions/v1/specs/users-api/data/pages/root.js")
	assert.NotContains(t, names, "services/users/versions/v1/specs/users-api/diagnostics.html")
	assert.NotContains(t, names, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.js")
	assert.NotContains(t, names, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.json")

	diagnosticsResp, err := server.Client().Get(server.URL + ArchiveExportEndpoint + "?diagnostics=1")
	require.NoError(t, err)
	defer diagnosticsResp.Body.Close()
	require.Equal(t, http.StatusOK, diagnosticsResp.StatusCode)
	diagnosticsBody, err := io.ReadAll(diagnosticsResp.Body)
	require.NoError(t, err)
	diagnosticsZip, err := zip.NewReader(bytes.NewReader(diagnosticsBody), int64(len(diagnosticsBody)))
	require.NoError(t, err)

	diagnosticsNames := zipArchiveNames(diagnosticsZip)
	assert.Contains(t, diagnosticsNames, "services/users/versions/v1/specs/users-api/diagnostics.html")
	assert.Contains(t, diagnosticsNames, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.js")
	assert.Contains(t, diagnosticsNames, "services/users/versions/v1/specs/users-api/data/pages/diagnostics.json")
}

func TestStaticServerArchiveExportUsesPortableArchiveDir(t *testing.T) {
	servedDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(servedDir, "index.html"), []byte("served"), 0o644))
	archiveDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(archiveDir, "index.html"), []byte("portable"), 0o644))

	server := httptest.NewServer(NewStaticServerWithOptions(Config{
		Dir:        servedDir,
		ArchiveDir: archiveDir,
	}))
	defer server.Close()

	resp, err := server.Client().Get(server.URL + ArchiveExportEndpoint)
	require.NoError(t, err)
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	zr, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	require.NoError(t, err)

	assert.Equal(t, "portable", zipArchiveFile(t, zr, "index.html"))
}

func TestStaticServerArchiveExportParsesNavToggleValues(t *testing.T) {
	servedDir := writeArchiveExportTestDir(t, "served", false)
	diagnosticsDir := writeArchiveExportTestDir(t, "diagnostics", true)
	llmDir := writeArchiveExportTestDir(t, "llm", false)
	diagnosticsLLMDir := writeArchiveExportTestDir(t, "diagnostics-llm", true)

	server := httptest.NewServer(NewStaticServerWithOptions(Config{
		Dir:                      servedDir,
		DiagnosticsArchiveDir:    diagnosticsDir,
		LLMArchiveDir:            llmDir,
		DiagnosticsLLMArchiveDir: diagnosticsLLMDir,
	}))
	defer server.Close()

	tests := []struct {
		name              string
		query             string
		wantIndex         string
		wantDiagnostics   bool
		wantLLMArchiveDir bool
	}{
		{
			name:            "diagnostics one",
			query:           "?diagnostics=1",
			wantIndex:       "diagnostics",
			wantDiagnostics: true,
		},
		{
			name:              "llm one",
			query:             "?llm=1",
			wantIndex:         "llm",
			wantLLMArchiveDir: true,
		},
		{
			name:              "diagnostics and llm one",
			query:             "?diagnostics=1&llm=1",
			wantIndex:         "diagnostics-llm",
			wantDiagnostics:   true,
			wantLLMArchiveDir: true,
		},
		{
			name:              "diagnostics and llm true",
			query:             "?diagnostics=true&llm=true",
			wantIndex:         "diagnostics-llm",
			wantDiagnostics:   true,
			wantLLMArchiveDir: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := server.Client().Get(server.URL + ArchiveExportEndpoint + tt.query)
			require.NoError(t, err)
			defer resp.Body.Close()
			require.Equal(t, http.StatusOK, resp.StatusCode)
			body, err := io.ReadAll(resp.Body)
			require.NoError(t, err)
			zr, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
			require.NoError(t, err)

			assert.Equal(t, tt.wantIndex, zipArchiveFile(t, zr, "index.html"))
			names := zipArchiveNames(zr)
			if tt.wantDiagnostics {
				assert.Contains(t, names, "diagnostics.html")
			} else {
				assert.NotContains(t, names, "diagnostics.html")
			}
			if tt.wantLLMArchiveDir {
				assert.Contains(t, names, "llms.txt")
			}
		})
	}
}

func TestStaticServerMountedBasePathServesArchiveExport(t *testing.T) {
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "index.html"), []byte("<!doctype html><title>burger</title>"), 0o644))

	server := httptest.NewServer(NewStaticServer(dir, "/docs/"))
	defer server.Close()

	resp, err := server.Client().Get(server.URL + "/docs" + ArchiveExportEndpoint)
	require.NoError(t, err)
	defer resp.Body.Close()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	notFoundResp, err := server.Client().Get(server.URL + ArchiveExportEndpoint)
	require.NoError(t, err)
	defer notFoundResp.Body.Close()
	assert.Equal(t, http.StatusNotFound, notFoundResp.StatusCode)
}

func TestCachePolicyForPathTreatsMountedAssetsAsRevalidating(t *testing.T) {
	assert.Equal(t, "revalidate", CachePolicyForPath("/docs/static/printing-press.css"))
	assert.Equal(t, "revalidate", CachePolicyForPath("/docs/services/users/versions/v1/specs/users-api/data/nav.json"))
	assert.Equal(t, "revalidate", CachePolicyForPath("/docs/services/users/versions/v1/specs/users-api/index.html"))
	assert.Equal(t, "no-store", CachePolicyForPath("/docs/services/users/versions/v1/specs/users-api/llms.txt"))
}

func TestArchiveWritersReturnCloseErrors(t *testing.T) {
	dir := t.TempDir()

	t.Run("zip", func(t *testing.T) {
		err := writeZipArchive(failingArchiveWriter{}, dir, false)
		require.ErrorIs(t, err, errArchiveWriter)
		assert.Contains(t, err.Error(), "close zip archive")
	})

	t.Run("tar gzip", func(t *testing.T) {
		err := writeTarGzArchive(failingArchiveWriter{}, dir, false)
		require.ErrorIs(t, err, errArchiveWriter)
		assert.Contains(t, err.Error(), "close")
	})
}

func writeArchiveExportTestDir(t *testing.T, index string, includeDiagnostics bool) string {
	t.Helper()
	dir := t.TempDir()
	writeArchiveTestFile(t, dir, "index.html", index)
	writeArchiveTestFile(t, dir, "llms.txt", "llm")
	if includeDiagnostics {
		writeArchiveTestFile(t, dir, "diagnostics.html", "diagnostics")
	}
	return dir
}

func writeArchiveTestFile(t *testing.T, root, rel, body string) {
	t.Helper()
	abs := filepath.Join(root, filepath.FromSlash(rel))
	require.NoError(t, os.MkdirAll(filepath.Dir(abs), 0o755))
	require.NoError(t, os.WriteFile(abs, []byte(body), 0o644))
}

var errArchiveWriter = errors.New("archive writer failed")

type failingArchiveWriter struct{}

func (failingArchiveWriter) Write([]byte) (int, error) {
	return 0, errArchiveWriter
}

func zipArchiveNames(zr *zip.Reader) []string {
	names := make([]string, 0, len(zr.File))
	for _, file := range zr.File {
		names = append(names, file.Name)
	}
	return names
}

func zipArchiveFile(t *testing.T, zr *zip.Reader, name string) string {
	t.Helper()
	for _, file := range zr.File {
		if file.Name != name {
			continue
		}
		rc, err := file.Open()
		require.NoError(t, err)
		defer rc.Close()
		body, err := io.ReadAll(rc)
		require.NoError(t, err)
		return string(body)
	}
	t.Fatalf("archive file %q not found", name)
	return ""
}
