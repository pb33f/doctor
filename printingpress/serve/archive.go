// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package serve

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// ArchiveExportEndpoint is the local preview endpoint used to download a
// portable archive of served docs.
const ArchiveExportEndpoint = "/_printing-press/export"

// ArchiveExportPathForBaseURL returns the export endpoint mounted under baseURL.
func ArchiveExportPathForBaseURL(baseURL string) string {
	mountPath := ResolveServeMountPath(baseURL)
	if mountPath == "/" {
		return ArchiveExportEndpoint
	}
	return strings.TrimSuffix(mountPath, "/") + ArchiveExportEndpoint
}

// NewStaticExportHandler returns the archive export HTTP handler.
func NewStaticExportHandler(opts Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodOptions:
			w.Header().Set("Allow", "GET, HEAD, OPTIONS")
			w.WriteHeader(http.StatusNoContent)
			return
		case http.MethodGet, http.MethodHead:
		default:
			w.Header().Set("Allow", "GET, HEAD, OPTIONS")
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		format, filename, err := archiveFormat(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		includeDiagnostics := archiveIncludesDiagnostics(r)
		includeLLM := archiveIncludesLLM(r)
		archiveDir := opts.ArchiveDir
		switch {
		case includeDiagnostics && includeLLM && opts.DiagnosticsLLMArchiveDir != "":
			archiveDir = opts.DiagnosticsLLMArchiveDir
		case includeDiagnostics && opts.DiagnosticsArchiveDir != "":
			archiveDir = opts.DiagnosticsArchiveDir
		case includeLLM && opts.LLMArchiveDir != "":
			archiveDir = opts.LLMArchiveDir
		}
		if archiveDir == "" {
			archiveDir = opts.Dir
		}
		if err := serveStaticArchive(w, r, archiveDir, format, filename, includeDiagnostics); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})
}

func archiveFormat(r *http.Request) (format string, filename string, err error) {
	value := ""
	if r != nil && r.URL != nil {
		value = strings.ToLower(strings.TrimSpace(r.URL.Query().Get("format")))
	}
	switch value {
	case "", "zip":
		return "zip", "printing-press-docs.zip", nil
	case "tar.gz", "tgz":
		return "tar.gz", "printing-press-docs.tar.gz", nil
	default:
		return "", "", fmt.Errorf("unsupported archive format %q", value)
	}
}

func archiveIncludesDiagnostics(r *http.Request) bool {
	return archiveQueryBool(r, "diagnostics")
}

func archiveIncludesLLM(r *http.Request) bool {
	return archiveQueryBool(r, "llm")
}

func archiveQueryBool(r *http.Request, key string) bool {
	if r == nil || r.URL == nil {
		return false
	}
	value := strings.TrimSpace(r.URL.Query().Get(key))
	if value == "" {
		return false
	}
	enabled, err := strconv.ParseBool(value)
	return err == nil && enabled
}

func serveStaticArchive(w http.ResponseWriter, r *http.Request, dir, format, filename string, includeDiagnostics bool) error {
	suffix := ".zip"
	if format == "tar.gz" {
		suffix = ".tar.gz"
	}
	tmp, err := os.CreateTemp("", "printing-press-docs-*"+suffix)
	if err != nil {
		return fmt.Errorf("create archive: %w", err)
	}
	defer os.Remove(tmp.Name())
	defer tmp.Close()

	switch format {
	case "zip":
		err = writeZipArchive(tmp, dir, includeDiagnostics)
	case "tar.gz":
		err = writeTarGzArchive(tmp, dir, includeDiagnostics)
	default:
		err = fmt.Errorf("unsupported archive format %q", format)
	}
	if err != nil {
		return err
	}
	if _, err := tmp.Seek(0, io.SeekStart); err != nil {
		return fmt.Errorf("rewind archive: %w", err)
	}

	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, filename))
	switch format {
	case "zip":
		w.Header().Set("Content-Type", "application/zip")
	case "tar.gz":
		w.Header().Set("Content-Type", "application/gzip")
	}
	http.ServeContent(w, r, filename, time.Now(), tmp)
	return nil
}

func writeZipArchive(out io.Writer, root string, includeDiagnostics bool) error {
	archive := zip.NewWriter(out)

	if err := filepath.WalkDir(root, func(filePath string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			return nil
		}

		rel, err := filepath.Rel(root, filePath)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		if skipServedArchiveFile(rel, includeDiagnostics) {
			return nil
		}

		info, err := entry.Info()
		if err != nil {
			return err
		}
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = rel
		header.Method = zip.Deflate
		writer, err := archive.CreateHeader(header)
		if err != nil {
			return err
		}

		file, err := os.Open(filePath)
		if err != nil {
			return err
		}
		_, copyErr := io.Copy(writer, file)
		closeErr := file.Close()
		if copyErr != nil {
			return copyErr
		}
		return closeErr
	}); err != nil {
		return err
	}
	if err := archive.Close(); err != nil {
		return fmt.Errorf("close zip archive: %w", err)
	}
	return nil
}

func writeTarGzArchive(out io.Writer, root string, includeDiagnostics bool) error {
	gzipWriter := gzip.NewWriter(out)

	archive := tar.NewWriter(gzipWriter)

	if err := filepath.WalkDir(root, func(filePath string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			return nil
		}

		rel, err := filepath.Rel(root, filePath)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		if skipServedArchiveFile(rel, includeDiagnostics) {
			return nil
		}

		info, err := entry.Info()
		if err != nil {
			return err
		}
		header, err := tar.FileInfoHeader(info, "")
		if err != nil {
			return err
		}
		header.Name = rel
		if err := archive.WriteHeader(header); err != nil {
			return err
		}

		file, err := os.Open(filePath)
		if err != nil {
			return err
		}
		_, copyErr := io.Copy(archive, file)
		closeErr := file.Close()
		if copyErr != nil {
			return copyErr
		}
		return closeErr
	}); err != nil {
		return err
	}
	if err := archive.Close(); err != nil {
		return fmt.Errorf("close tar archive: %w", err)
	}
	if err := gzipWriter.Close(); err != nil {
		return fmt.Errorf("close gzip archive: %w", err)
	}
	return nil
}

func skipServedArchiveFile(rel string, includeDiagnostics bool) bool {
	if includeDiagnostics {
		return false
	}
	clean := strings.TrimPrefix(path.Clean("/"+rel), "/")
	base := path.Base(clean)
	return base == "diagnostics.html" ||
		base == "diagnostics-orphans.json" ||
		strings.HasPrefix(clean, "data/pages/diagnostics")
}
