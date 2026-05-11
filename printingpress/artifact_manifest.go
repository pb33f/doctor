// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"compress/gzip"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"sync"
)

const (
	// ArtifactManifestFilename is the static hosting contract written at the
	// root of hosted Printing Press artifacts.
	ArtifactManifestFilename = "ppress-manifest.json"

	// ArtifactManifestVersion is bumped when the hosted artifact JSON contract
	// changes in a way host applications must explicitly understand.
	ArtifactManifestVersion = 1

	ArtifactVisibilityAnonymous = "anonymous"
	ArtifactVisibilityPrivate   = "private"
	ArtifactVisibilityPublished = "published"

	ArtifactAccessPublic    = "public"
	ArtifactAccessProtected = "protected"
)

// ArtifactManifestConfig enables generation of a hosted docs manifest. It is
// disabled by default so the printing-press CLI keeps the existing standalone
// behavior unless a host explicitly opts in.
type ArtifactManifestConfig struct {
	Enabled              bool
	DocumentID           string
	Visibility           string
	WorkspaceID          string
	WorkspaceContentHash string
	AssetVersion         string
	ExpiresAt            string
	Entrypoints          map[string]string
	GzipSidecars         bool
}

// HostedArtifactManifest is the artifact-level contract consumed by static
// hosts such as Bunkhouse.
type HostedArtifactManifest struct {
	ManifestVersion      int                                   `json:"manifestVersion"`
	DocumentID           string                                `json:"documentId"`
	Visibility           string                                `json:"visibility"`
	WorkspaceID          string                                `json:"workspaceId,omitempty"`
	WorkspaceContentHash string                                `json:"workspaceContentHash,omitempty"`
	AssetVersion         string                                `json:"assetVersion,omitempty"`
	ExpiresAt            string                                `json:"expiresAt,omitempty"`
	Entrypoints          map[string]string                     `json:"entrypoints,omitempty"`
	Files                map[string]HostedArtifactManifestFile `json:"files"`
}

// HostedArtifactManifestFile describes one canonical generated file. Gzip
// sidecars are indicated by Gzip and are not separate manifest entries.
type HostedArtifactManifestFile struct {
	Access      string `json:"access"`
	ContentType string `json:"contentType,omitempty"`
	ETag        string `json:"etag"`
	Size        int64  `json:"size"`
	ModTimeUnix int64  `json:"modTimeUnix"`
	Gzip        bool   `json:"gzip,omitempty"`
}

func cloneArtifactManifestConfig(config *ArtifactManifestConfig) *ArtifactManifestConfig {
	if config == nil {
		return nil
	}
	cloned := *config
	if config.Entrypoints != nil {
		cloned.Entrypoints = make(map[string]string, len(config.Entrypoints))
		for k, v := range config.Entrypoints {
			cloned.Entrypoints[k] = v
		}
	}
	return &cloned
}

func (pp *PrintingPress) writeArtifactContract(generatedPaths []string) ([]string, error) {
	if pp == nil || pp.config == nil {
		return nil, nil
	}
	outputDir, err := pp.resolveOutputDir()
	if err != nil {
		return nil, err
	}
	if pp.config.Artifact == nil || !pp.config.Artifact.Enabled {
		return nil, removeHostedArtifactContract(outputDir, generatedPaths)
	}
	return writeHostedArtifactContract(outputDir, pp.config.Artifact, generatedPaths)
}

func writeHostedArtifactContract(root string, config *ArtifactManifestConfig, generatedPaths []string) ([]string, error) {
	if config == nil || !config.Enabled {
		return nil, removeHostedArtifactContract(root, generatedPaths)
	}
	if strings.TrimSpace(root) == "" {
		return nil, errors.New("artifact manifest output root is required")
	}
	normalizedVisibility, err := normalizeArtifactVisibility(config.Visibility)
	if err != nil {
		return nil, err
	}
	normalizedConfig := *config
	normalizedConfig.Visibility = normalizedVisibility
	entries, err := collectArtifactFileEntries(root, generatedPaths)
	if err != nil {
		return nil, err
	}
	written := make([]string, 0, 16)
	if err := removeArtifactGzipSidecars(entries); err != nil {
		return nil, err
	}
	// hashes captured during gzip avoid a second read of every text file when
	// the manifest builder later hashes for ETags.
	var precomputed map[string]string
	gzipped := make(map[string]struct{})
	if config.GzipSidecars {
		sidecars, hashes, err := writeGzipSidecarsForTextAssets(entries)
		if err != nil {
			return nil, err
		}
		written = append(written, sidecars...)
		precomputed = hashes
		for rel := range hashes {
			gzipped[rel] = struct{}{}
		}
	}
	manifest, err := buildHostedArtifactManifest(&normalizedConfig, entries, precomputed, gzipped)
	if err != nil {
		return nil, err
	}
	body, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		return nil, err
	}
	path := filepath.Join(root, ArtifactManifestFilename)
	if err = writeFileAtomic(path, body, 0o644); err != nil {
		return nil, err
	}
	written = append(written, path)
	return written, nil
}

func removeHostedArtifactContract(root string, generatedPaths []string) error {
	if strings.TrimSpace(root) == "" {
		return nil
	}
	for _, path := range []string{
		filepath.Join(root, ArtifactManifestFilename),
		filepath.Join(root, ArtifactManifestFilename+".gz"),
	} {
		if err := os.Remove(path); err != nil && !errors.Is(err, os.ErrNotExist) {
			return err
		}
	}
	entries, err := collectArtifactFileEntries(root, generatedPaths)
	if err != nil {
		return err
	}
	return removeArtifactGzipSidecars(entries)
}

func writeFileAtomic(path string, body []byte, perm os.FileMode) error {
	tmp, err := os.CreateTemp(filepath.Dir(path), "."+filepath.Base(path)+".*.tmp")
	if err != nil {
		return err
	}
	tmpName := tmp.Name()
	defer func() {
		_ = os.Remove(tmpName)
	}()
	if _, err = tmp.Write(body); err != nil {
		_ = tmp.Close()
		return err
	}
	if err = tmp.Chmod(perm); err != nil {
		_ = tmp.Close()
		return err
	}
	if err = tmp.Close(); err != nil {
		return err
	}
	return os.Rename(tmpName, path)
}

type artifactFileEntry struct {
	rel  string
	path string
	info os.FileInfo
	hash string
}

func buildHostedArtifactManifest(config *ArtifactManifestConfig, entries []*artifactFileEntry, precomputedHashes map[string]string, gzipped map[string]struct{}) (*HostedArtifactManifest, error) {
	visibility, err := normalizeArtifactVisibility(config.Visibility)
	if err != nil {
		return nil, err
	}
	manifest := &HostedArtifactManifest{
		ManifestVersion:      ArtifactManifestVersion,
		DocumentID:           config.DocumentID,
		Visibility:           visibility,
		WorkspaceID:          config.WorkspaceID,
		WorkspaceContentHash: config.WorkspaceContentHash,
		AssetVersion:         config.AssetVersion,
		ExpiresAt:            strings.TrimSpace(config.ExpiresAt),
		Entrypoints:          normalizedArtifactEntrypoints(config.Entrypoints),
		Files:                make(map[string]HostedArtifactManifestFile),
	}
	if err := hashArtifactEntries(entries, precomputedHashes); err != nil {
		return nil, err
	}
	for _, entry := range entries {
		_, hasGzip := gzipped[entry.rel]
		manifest.Files[entry.rel] = HostedArtifactManifestFile{
			Access:      artifactAccessForPath(visibility, entry.rel),
			ContentType: contentTypeForArtifactRel(entry.rel),
			ETag:        artifactETag(config.DocumentID, entry.rel, entry.hash),
			Size:        entry.info.Size(),
			ModTimeUnix: entry.info.ModTime().UTC().Unix(),
			Gzip:        hasGzip,
		}
	}
	if len(manifest.Files) == 0 {
		return nil, errors.New("artifact manifest has no files")
	}
	return manifest, nil
}

func collectArtifactFileEntries(root string, generatedPaths []string) ([]*artifactFileEntry, error) {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return nil, err
	}

	seen := make(map[string]string, len(generatedPaths))
	for _, generatedPath := range generatedPaths {
		abs := generatedPath
		if !filepath.IsAbs(abs) {
			abs = filepath.Join(rootAbs, abs)
		}
		abs = filepath.Clean(abs)
		rel, err := filepath.Rel(rootAbs, abs)
		if err != nil {
			return nil, err
		}
		rel = filepath.ToSlash(rel)
		if rel == "." || strings.HasPrefix(rel, "../") || rel == ".." || filepath.IsAbs(rel) {
			continue
		}
		if rel == ArtifactManifestFilename || strings.HasSuffix(rel, ".gz") || strings.HasPrefix(rel, "exports/") {
			continue
		}
		seen[rel] = abs
	}

	rels := make([]string, 0, len(seen))
	for rel := range seen {
		rels = append(rels, rel)
	}
	sort.Strings(rels)

	entries := make([]*artifactFileEntry, 0, len(rels))
	for _, rel := range rels {
		path := seen[rel]
		info, err := os.Stat(path)
		if err != nil {
			if errors.Is(err, os.ErrNotExist) {
				continue
			}
			return nil, err
		}
		if info.IsDir() {
			continue
		}
		entries = append(entries, &artifactFileEntry{rel: rel, path: path, info: info})
	}
	return entries, nil
}

func hashArtifactEntries(entries []*artifactFileEntry, precomputedHashes map[string]string) error {
	missing := make([]*artifactFileEntry, 0, len(entries))
	for _, entry := range entries {
		if hash, ok := precomputedHashes[entry.rel]; ok {
			entry.hash = hash
			continue
		}
		missing = append(missing, entry)
	}
	if len(missing) == 0 {
		return nil
	}
	workers := runtime.NumCPU()
	if workers < 1 {
		workers = 1
	}
	if workers > len(missing) {
		workers = len(missing)
	}
	jobs := make(chan *artifactFileEntry)
	errCh := make(chan error, 1)
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for entry := range jobs {
				hash, err := hashArtifactFile(entry.path)
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
					return
				}
				entry.hash = hash
			}
		}()
	}
	for _, entry := range missing {
		select {
		case err := <-errCh:
			close(jobs)
			wg.Wait()
			return err
		case jobs <- entry:
		}
	}
	close(jobs)
	wg.Wait()
	select {
	case err := <-errCh:
		return err
	default:
		return nil
	}
}

func normalizedArtifactEntrypoints(entrypoints map[string]string) map[string]string {
	if len(entrypoints) == 0 {
		return map[string]string{
			"default":  "index.html",
			"embedded": "index.html",
		}
	}
	normalized := make(map[string]string, len(entrypoints))
	for key, value := range entrypoints {
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(filepath.ToSlash(value)), "/")
		if key == "" || value == "" {
			continue
		}
		normalized[key] = value
	}
	return normalized
}

func normalizeArtifactVisibility(visibility string) (string, error) {
	normalized := strings.ToLower(strings.TrimSpace(visibility))
	if normalized == "" {
		return ArtifactVisibilityAnonymous, nil
	}
	switch normalized {
	case ArtifactVisibilityAnonymous, ArtifactVisibilityPrivate, ArtifactVisibilityPublished:
		return normalized, nil
	default:
		return "", fmt.Errorf("unknown artifact visibility %q", visibility)
	}
}

func artifactRelHasPrefix(root, path, prefix string) bool {
	rel, err := filepath.Rel(root, path)
	if err != nil {
		return false
	}
	rel = filepath.ToSlash(rel)
	return rel == prefix || strings.HasPrefix(rel, prefix+"/")
}

func artifactAccessForPath(visibility string, rel string) string {
	// hosted artifacts no longer carry shared assets — those live at a host
	// shared URL outside the artifact. every file here is per-spec content.
	// for private artifacts that means protected; for anonymous/published the
	// whole artifact is public.
	normalized, err := normalizeArtifactVisibility(visibility)
	if err != nil {
		return ArtifactAccessProtected
	}
	if normalized == ArtifactVisibilityPrivate {
		return ArtifactAccessProtected
	}
	return ArtifactAccessPublic
}

func contentTypeForArtifactRel(rel string) string {
	if ct := mime.TypeByExtension(strings.ToLower(filepath.Ext(rel))); ct != "" {
		return ct
	}
	return "application/octet-stream"
}

func artifactETag(documentID string, rel string, hash string) string {
	return fmt.Sprintf(`"ppress-%s-%s-%s"`, documentID, strings.NewReplacer("/", "_", "\\", "_").Replace(rel), hash)
}

func hashArtifactFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	h := sha256.New()
	if _, err = io.Copy(h, file); err != nil {
		return "", err
	}
	return hex.EncodeToString(h.Sum(nil)), nil
}

type gzipSidecarResult struct {
	rel     string
	sidecar string
	hash    string
}

func writeGzipSidecarsForTextAssets(entries []*artifactFileEntry) ([]string, map[string]string, error) {
	compressible := collectCompressibleFiles(entries)
	if len(compressible) == 0 {
		return nil, nil, nil
	}
	workers := runtime.NumCPU()
	if workers < 1 {
		workers = 1
	}
	if workers > len(compressible) {
		workers = len(compressible)
	}
	jobs := make(chan *artifactFileEntry)
	written := make(chan gzipSidecarResult, len(compressible))
	errCh := make(chan error, 1)
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for entry := range jobs {
				sidecar, hash, err := writeGzipSidecar(entry.path)
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
					return
				}
				written <- gzipSidecarResult{rel: entry.rel, sidecar: sidecar, hash: hash}
			}
		}()
	}
	for _, entry := range compressible {
		select {
		case err := <-errCh:
			close(jobs)
			wg.Wait()
			return nil, nil, err
		case jobs <- entry:
		}
	}
	close(jobs)
	wg.Wait()
	close(written)
	select {
	case err := <-errCh:
		return nil, nil, err
	default:
	}
	sidecars := make([]string, 0, len(compressible))
	hashes := make(map[string]string, len(compressible))
	for result := range written {
		sidecars = append(sidecars, result.sidecar)
		hashes[result.rel] = result.hash
	}
	sort.Strings(sidecars)
	return sidecars, hashes, nil
}

func collectCompressibleFiles(entries []*artifactFileEntry) []*artifactFileEntry {
	var compressible []*artifactFileEntry
	for _, entry := range entries {
		if entry == nil || !shouldGzipSidecar(entry.rel) || entry.info.Size() < 1024 {
			continue
		}
		compressible = append(compressible, entry)
	}
	sort.Slice(compressible, func(i, j int) bool {
		return compressible[i].rel < compressible[j].rel
	})
	return compressible
}

func shouldGzipSidecar(rel string) bool {
	rel = filepath.ToSlash(rel)
	if rel == ArtifactManifestFilename || strings.HasSuffix(rel, ".gz") || strings.HasPrefix(rel, "exports/") {
		return false
	}
	switch strings.ToLower(filepath.Ext(rel)) {
	case ".html", ".htm", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".yaml", ".yml", ".txt", ".map":
		return true
	default:
		return false
	}
}

func removeArtifactGzipSidecars(entries []*artifactFileEntry) error {
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		err := os.Remove(entry.path + ".gz")
		if err != nil && !errors.Is(err, os.ErrNotExist) {
			return err
		}
	}
	return nil
}

func writeGzipSidecar(path string) (string, string, error) {
	in, err := os.Open(path)
	if err != nil {
		return "", "", err
	}
	defer in.Close()
	tmp := path + ".gz.tmp"
	out, err := os.Create(tmp)
	if err != nil {
		return "", "", err
	}
	gw, err := gzip.NewWriterLevel(out, gzip.BestSpeed)
	if err != nil {
		_ = out.Close()
		_ = os.Remove(tmp)
		return "", "", err
	}
	hash := sha256.New()
	// stream the source through both gzip and sha256 in a single read pass so the
	// manifest builder doesn't have to re-open this file later for an ETag hash.
	_, copyErr := io.Copy(io.MultiWriter(gw, hash), in)
	closeErr := gw.Close()
	fileErr := out.Close()
	if copyErr != nil || closeErr != nil || fileErr != nil {
		_ = os.Remove(tmp)
		if copyErr != nil {
			return "", "", copyErr
		}
		if closeErr != nil {
			return "", "", closeErr
		}
		return "", "", fileErr
	}
	sidecar := path + ".gz"
	if err = os.Rename(tmp, sidecar); err != nil {
		return "", "", err
	}
	return sidecar, hex.EncodeToString(hash.Sum(nil)), nil
}
