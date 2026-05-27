// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package serve

import (
	"compress/gzip"
	"context"
	"errors"
	"io"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
	"time"
)

const shutdownTimeout = 5 * time.Second

// Config controls the local static documentation server.
type Config struct {
	Dir                      string
	BaseURL                  string
	DisableExport            bool
	ArchiveDir               string
	DiagnosticsArchiveDir    string
	LLMArchiveDir            string
	DiagnosticsLLMArchiveDir string
}

// Handler builds an HTTP handler for the configured docs directory.
func (c Config) Handler() http.Handler {
	return NewStaticServerWithOptions(c)
}

// ListenAndServe serves the configured docs directory until the server exits or
// ctx is canceled.
func (c Config) ListenAndServe(ctx context.Context, addr string) error {
	if ctx == nil {
		ctx = context.Background()
	}
	server := &http.Server{
		Addr:    addr,
		Handler: c.Handler(),
	}
	errCh := make(chan error, 1)
	go func() {
		errCh <- server.ListenAndServe()
	}()

	select {
	case err := <-errCh:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			return err
		}
		err := <-errCh
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	}
}

// NewStaticServer returns a docs static file server mounted at baseURL.
func NewStaticServer(dir, baseURL string) http.Handler {
	return NewStaticServerWithOptions(Config{
		Dir:     dir,
		BaseURL: baseURL,
	})
}

// NewStaticServerWithOptions returns a docs static file server configured with
// optional archive export directories.
func NewStaticServerWithOptions(opts Config) http.Handler {
	fileServer := NewStaticFileServer(opts.Dir)
	var exportHandler http.Handler
	if !opts.DisableExport {
		exportHandler = NewStaticExportHandler(opts)
	}
	mountPath := ResolveServeMountPath(opts.BaseURL)
	if mountPath == "/" {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path == ArchiveExportEndpoint {
				if exportHandler != nil {
					exportHandler.ServeHTTP(w, r)
					return
				}
				http.NotFound(w, r)
				return
			}
			fileServer.ServeHTTP(w, r)
		})
	}

	mountPrefix := strings.TrimSuffix(mountPath, "/")
	mountedFileServer := http.StripPrefix(mountPrefix, fileServer)
	mountedExportPath := mountPrefix + ArchiveExportEndpoint
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/":
			http.Redirect(w, r, mountPath, http.StatusTemporaryRedirect)
			return
		case mountPrefix:
			http.Redirect(w, r, mountPath, http.StatusTemporaryRedirect)
			return
		case mountedExportPath:
			if exportHandler != nil {
				exportHandler.ServeHTTP(w, r)
				return
			}
			http.NotFound(w, r)
			return
		}
		if !strings.HasPrefix(r.URL.Path, mountPath) {
			http.NotFound(w, r)
			return
		}
		mountedFileServer.ServeHTTP(w, r)
	})
}

// NewStaticFileServer returns a static file server with preview cache headers
// and gzip support for text assets.
func NewStaticFileServer(dir string) http.Handler {
	fileServer := http.FileServer(http.Dir(dir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestPath := r.URL.Path
		ApplyServeCacheHeaders(w.Header(), requestPath)
		if !shouldGzipResponse(r) || !isCompressibleAsset(requestPath) {
			fileServer.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Content-Encoding", "gzip")
		w.Header().Add("Vary", "Accept-Encoding")
		w.Header().Del("Content-Length")

		gzw := gzip.NewWriter(w)
		defer gzw.Close()

		fileServer.ServeHTTP(&gzipResponseWriter{ResponseWriter: w, writer: gzw}, r)
	})
}

// ResolveServeMountPath extracts a local URL mount path from a base URL.
func ResolveServeMountPath(baseURL string) string {
	if baseURL == "" {
		return "/"
	}

	parsed, err := url.Parse(baseURL)
	if err != nil {
		return "/"
	}

	path := parsed.Path
	if path == "" {
		return "/"
	}
	if !strings.HasPrefix(path, "/") {
		return "/"
	}
	if path != "/" && !strings.HasSuffix(path, "/") {
		path += "/"
	}
	return path
}

type gzipResponseWriter struct {
	http.ResponseWriter
	writer io.Writer
}

func (g *gzipResponseWriter) Write(b []byte) (int, error) {
	return g.writer.Write(b)
}

// ApplyServeCacheHeaders applies preview-friendly cache headers for a request
// path.
func ApplyServeCacheHeaders(header http.Header, requestPath string) {
	switch CachePolicyForPath(requestPath) {
	case "revalidate":
		header.Set("Cache-Control", "no-cache")
	default:
		header.Set("Cache-Control", "no-store")
	}
}

// CachePolicyForPath returns the local preview cache policy for a request path.
func CachePolicyForPath(requestPath string) string {
	if requestPath == "" || requestPath == "/" {
		return "revalidate"
	}
	if hasServeStaticPath(requestPath) {
		return "revalidate"
	}
	if strings.EqualFold(filepath.Ext(requestPath), ".html") {
		return "revalidate"
	}
	return "no-store"
}

func hasServeStaticPath(requestPath string) bool {
	return strings.Contains(requestPath, "/static/") ||
		strings.Contains(requestPath, "/data/")
}

func shouldGzipResponse(r *http.Request) bool {
	if r == nil {
		return false
	}
	if r.Method != http.MethodGet {
		return false
	}
	if r.Header.Get("Range") != "" {
		return false
	}
	return strings.Contains(r.Header.Get("Accept-Encoding"), "gzip")
}

func isCompressibleAsset(requestPath string) bool {
	ext := strings.ToLower(filepath.Ext(requestPath))
	switch ext {
	case "", ".html", ".css", ".js", ".json", ".svg", ".txt", ".xml", ".map", ".md", ".markdown", ".yaml", ".yml":
		return true
	default:
		return false
	}
}
