// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// BuildMode is what a caller asks a build to be. ppress and vacuum docs both
// take it from --mode or the site.mode config value.
type BuildMode string

const (
	// BuildModeAuto lets DetectBuildTarget decide from the input.
	BuildModeAuto BuildMode = ""
	// BuildModeAPI builds one specification as API documentation.
	BuildModeAPI BuildMode = "api"
	// BuildModeCatalog builds a directory of specifications as an API catalog.
	BuildModeCatalog BuildMode = "catalog"
	// BuildModeDocs builds a docs site: Markdown content, with any
	// specifications as its API references.
	BuildModeDocs BuildMode = "docs"
)

// ParseBuildMode reads a --mode or site.mode value. An empty value is auto.
func ParseBuildMode(value string) (BuildMode, error) {
	switch mode := BuildMode(strings.ToLower(strings.TrimSpace(value))); mode {
	case BuildModeAuto, BuildModeAPI, BuildModeCatalog, BuildModeDocs:
		return mode, nil
	default:
		return BuildModeAuto, fmt.Errorf("unknown build mode %q: use api, catalog or docs", value)
	}
}

// BuildTarget is what DetectBuildTarget decided to build.
type BuildTarget struct {
	// Directory is true for a directory build: a docs site or a catalog.
	// It is false for a single-spec build of Input.
	Directory bool
	// Input is the caller's input, unchanged, for a single-spec build.
	Input string
	// Root is the absolute scan root of a directory build.
	Root string
	// Include limits a directory build's discovery to these root-relative
	// specification paths. A spec file with a docs folder sets it to that
	// one file.
	Include []string
	// SiteKind is the directory build's kind. Empty lets the build decide
	// once it knows whether the directory holds any specifications.
	SiteKind ppmodel.SiteKind
}

// DetectBuildTarget decides what an input builds:
//   - a URL builds one specification;
//   - a directory builds a docs site or a catalog;
//   - a specification file with a docs folder of Markdown beside it builds a
//     docs site, with that one specification as its API reference;
//   - any other specification file builds one specification.
//
// mode overrides the decision where it can. An input that does not exist is
// returned as a single-spec build, so the caller reports the load error as it
// always has.
func DetectBuildTarget(input string, mode BuildMode) (BuildTarget, error) {
	single := BuildTarget{Input: input}
	if isURLString(input) {
		if mode == BuildModeCatalog || mode == BuildModeDocs {
			return BuildTarget{}, fmt.Errorf("--mode %s needs a local directory or file, not a URL", mode)
		}
		return single, nil
	}
	absPath, err := filepath.Abs(input)
	if err != nil {
		return single, nil
	}
	info, err := os.Stat(absPath)
	if err != nil {
		return single, nil
	}
	if info.IsDir() {
		if mode == BuildModeAPI {
			return BuildTarget{}, errors.New("--mode api needs a specification file, not a directory")
		}
		return BuildTarget{Directory: true, Root: absPath, SiteKind: siteKindForMode(mode)}, nil
	}
	switch mode {
	case BuildModeAPI:
		return single, nil
	case BuildModeCatalog:
		return BuildTarget{}, errors.New("--mode catalog needs a directory of specifications, not a file")
	case BuildModeAuto:
		if !hasMarkdownContent(filepath.Join(filepath.Dir(absPath), "docs")) {
			return single, nil
		}
	}
	return BuildTarget{
		Directory: true,
		Root:      filepath.Dir(absPath),
		Include:   []string{filepath.Base(absPath)},
		SiteKind:  ppmodel.SiteKindDocs,
	}, nil
}

func siteKindForMode(mode BuildMode) ppmodel.SiteKind {
	switch mode {
	case BuildModeDocs:
		return ppmodel.SiteKindDocs
	case BuildModeCatalog:
		return ppmodel.SiteKindCatalog
	default:
		return ""
	}
}

// hasMarkdownContent reports whether dir holds at least one Markdown content
// page, skipping the folders content discovery skips.
func hasMarkdownContent(dir string) bool {
	found := false
	_ = filepath.WalkDir(dir, func(walkPath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return filepath.SkipDir
		}
		if entry.IsDir() {
			if walkPath != dir && isContentPageSkipDir(entry.Name()) {
				return filepath.SkipDir
			}
			return nil
		}
		if isContentMarkdownFile(entry) {
			found = true
			return fs.SkipAll
		}
		return nil
	})
	return found
}
