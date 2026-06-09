// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

var (
	errContentNotFound       = errors.New("content not found")
	errContentOutsideRoot    = errors.New("content path resolves outside the allowed root")
	errContentSizeLimit      = errors.New("content exceeds size limit")
	errContentUnsupportedURL = errors.New("unsupported content URL")
)

type pageLoadResult struct {
	Path     string
	Size     int64
	Status   int
	NotFound bool
}

type pageLoader interface {
	Read(rawPath string, limit int64) ([]byte, pageLoadResult, error)
	Exists(rawPath string) (bool, error)
	Resolve(base, ref string) (string, error)
}

type contentLoader struct {
	allowedRoots []string
	client       *http.Client
}

func newContentLoader(allowedRoots ...string) *contentLoader {
	roots := make([]string, 0, len(allowedRoots))
	for _, root := range allowedRoots {
		trimmed := strings.TrimSpace(root)
		if trimmed == "" || isURLString(trimmed) {
			continue
		}
		abs, err := filepath.Abs(trimmed)
		if err != nil {
			continue
		}
		evaluated, err := filepath.EvalSymlinks(abs)
		if err == nil {
			abs = evaluated
		}
		roots = append(roots, filepath.Clean(abs))
	}
	return &contentLoader{
		allowedRoots: roots,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (l *contentLoader) Exists(rawPath string) (bool, error) {
	if isURLString(rawPath) {
		_, result, err := l.Read(rawPath, contentPageReadLimit)
		if err == nil {
			return true, nil
		}
		if result.NotFound || errors.Is(err, errContentNotFound) {
			return false, nil
		}
		return false, err
	}
	resolved, err := l.resolveLocalPath(rawPath)
	if err != nil {
		if errors.Is(err, errContentNotFound) {
			return false, nil
		}
		return false, err
	}
	info, err := os.Stat(resolved)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return !info.IsDir(), nil
}

func (l *contentLoader) Read(rawPath string, limit int64) ([]byte, pageLoadResult, error) {
	if limit <= 0 {
		limit = 1 << 20
	}
	if isURLString(rawPath) {
		return l.readURL(rawPath, limit)
	}
	return l.readLocal(rawPath, limit)
}

func (l *contentLoader) Resolve(base, ref string) (string, error) {
	ref = strings.TrimSpace(ref)
	if ref == "" {
		return "", fmt.Errorf("empty content reference")
	}
	if isURLString(ref) {
		return ref, nil
	}
	if isURLString(base) {
		return resolveURLReference(ensureURLDirectory(base), ref)
	}
	if filepath.IsAbs(ref) {
		return filepath.Clean(ref), nil
	}
	return filepath.Clean(filepath.Join(base, filepath.FromSlash(ref))), nil
}

func (l *contentLoader) readLocal(rawPath string, limit int64) ([]byte, pageLoadResult, error) {
	resolved, err := l.resolveLocalPath(rawPath)
	result := pageLoadResult{Path: resolved}
	if err != nil {
		if errors.Is(err, errContentNotFound) {
			result.NotFound = true
		}
		return nil, result, err
	}
	info, err := os.Stat(resolved)
	if err != nil {
		if os.IsNotExist(err) {
			result.NotFound = true
			return nil, result, errContentNotFound
		}
		return nil, result, err
	}
	if info.IsDir() {
		result.NotFound = true
		return nil, result, errContentNotFound
	}
	if info.Size() > limit {
		result.Size = info.Size()
		return nil, result, errContentSizeLimit
	}
	file, err := os.Open(resolved)
	if err != nil {
		return nil, result, err
	}
	defer file.Close()
	data, err := readLimited(file, limit)
	result.Size = int64(len(data))
	return data, result, err
}

func (l *contentLoader) resolveLocalPath(rawPath string) (string, error) {
	if strings.TrimSpace(rawPath) == "" {
		return "", errContentNotFound
	}
	abs, err := filepath.Abs(rawPath)
	if err != nil {
		return "", err
	}
	if _, err := os.Lstat(abs); err != nil {
		if os.IsNotExist(err) {
			return filepath.Clean(abs), errContentNotFound
		}
		return "", err
	}
	evaluated, err := filepath.EvalSymlinks(abs)
	if err != nil {
		if os.IsNotExist(err) {
			return filepath.Clean(abs), errContentNotFound
		}
		return "", err
	}
	evaluated = filepath.Clean(evaluated)
	if len(l.allowedRoots) == 0 {
		return evaluated, nil
	}
	for _, root := range l.allowedRoots {
		if isWithinRoot(evaluated, root) {
			return evaluated, nil
		}
	}
	return evaluated, errContentOutsideRoot
}

func (l *contentLoader) readURL(rawURL string, limit int64) ([]byte, pageLoadResult, error) {
	result := pageLoadResult{Path: rawURL}
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return nil, result, err
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return nil, result, errContentUnsupportedURL
	}
	req, err := http.NewRequest(http.MethodGet, rawURL, nil)
	if err != nil {
		return nil, result, err
	}
	resp, err := l.client.Do(req)
	if err != nil {
		return nil, result, err
	}
	defer resp.Body.Close()
	result.Status = resp.StatusCode
	if resp.StatusCode == http.StatusNotFound {
		result.NotFound = true
		return nil, result, errContentNotFound
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		return nil, result, fmt.Errorf("unexpected HTTP status %d", resp.StatusCode)
	}
	if resp.ContentLength > limit {
		result.Size = resp.ContentLength
		return nil, result, errContentSizeLimit
	}
	data, err := readLimited(resp.Body, limit)
	result.Size = int64(len(data))
	return data, result, err
}

func readLimited(reader io.Reader, limit int64) ([]byte, error) {
	limited := &io.LimitedReader{R: reader, N: limit + 1}
	data, err := io.ReadAll(limited)
	if err != nil {
		return nil, err
	}
	if int64(len(data)) > limit {
		return nil, errContentSizeLimit
	}
	return data, nil
}

func isWithinRoot(file, root string) bool {
	rel, err := filepath.Rel(root, file)
	if err != nil {
		return false
	}
	return rel == "." || (!strings.HasPrefix(rel, ".."+string(filepath.Separator)) && rel != "..")
}

func isURLString(value string) bool {
	parsed, err := url.Parse(strings.TrimSpace(value))
	return err == nil && parsed.Scheme != "" && parsed.Host != ""
}

func resolveURLReference(base, ref string) (string, error) {
	parsedBase, err := url.Parse(base)
	if err != nil {
		return "", err
	}
	parsedRef, err := url.Parse(ref)
	if err != nil {
		return "", err
	}
	if parsedRef.IsAbs() {
		return parsedRef.String(), nil
	}
	parsedBase = ensureParsedURLDirectory(parsedBase)
	resolved := parsedBase.ResolveReference(parsedRef)
	resolved.Path = path.Clean(resolved.Path)
	return resolved.String(), nil
}

func ensureURLDirectory(raw string) string {
	parsed, err := url.Parse(raw)
	if err != nil {
		return raw
	}
	return ensureParsedURLDirectory(parsed).String()
}

func ensureParsedURLDirectory(parsed *url.URL) *url.URL {
	if parsed == nil {
		return parsed
	}
	copy := *parsed
	if copy.Path == "" {
		copy.Path = "/"
	}
	if !strings.HasSuffix(copy.Path, "/") {
		copy.Path += "/"
	}
	return &copy
}
