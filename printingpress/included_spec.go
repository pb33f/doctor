// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func (pp *PrintingPress) prepareIncludedSpec(config *pressEngineConfig) error {
	if config == nil || !config.IncludeSpec {
		return nil
	}

	specBytes := pp.source.specBytes
	if len(specBytes) == 0 && strings.TrimSpace(config.SpecPath) != "" {
		var err error
		specBytes, err = os.ReadFile(config.SpecPath)
		if err != nil {
			return fmt.Errorf("%w: %v", ErrIncludedSpecUnavailable, err)
		}
	}
	if len(specBytes) == 0 {
		return ErrIncludedSpecUnavailable
	}

	fileName := includedSpecFileName(config.SpecPath, config.SpecKind, config.SpecFormat)
	includedPath := pppaths.IncludedSpec(fileName)
	config.IncludedSpecs = []*ppmodel.IncludedSpecAsset{{Path: fileName, Data: specBytes}}
	config.SpecURL = includedPath
	return nil
}

func includedSpecFileName(specPath string, kind SpecKind, format string) string {
	candidate := strings.TrimSpace(specPath)
	if parsed, err := url.Parse(candidate); err == nil && parsed.Path != "" {
		candidate = parsed.Path
	}
	candidate = filepath.Base(filepath.Clean(candidate))
	if candidate != "." && candidate != string(filepath.Separator) && candidate != "" {
		ext := strings.ToLower(filepath.Ext(candidate))
		if ext == ".yaml" || ext == ".yml" || ext == ".json" {
			return candidate
		}
	}
	return defaultSpecFilename(kind, format)
}

func (pp *PrintingPress) includeReferencedSpec(target string) string {
	if pp == nil || pp.engineConfig == nil || pp.site == nil || !pp.engineConfig.IncludeSpec {
		return ""
	}
	parsed, err := url.Parse(strings.TrimSpace(target))
	if err != nil || parsed.Scheme != "" || pp.engineConfig.SpecRoot == "" {
		return ""
	}

	root, err := filepath.EvalSymlinks(pp.engineConfig.SpecRoot)
	if err != nil {
		return ""
	}
	localTarget := target
	if !filepath.IsAbs(localTarget) {
		localTarget = filepath.Join(pp.engineConfig.SpecRoot, filepath.FromSlash(localTarget))
	}
	absoluteTarget, err := filepath.Abs(localTarget)
	if err != nil {
		return ""
	}
	resolvedTarget, err := filepath.EvalSymlinks(absoluteTarget)
	if err != nil {
		return ""
	}
	relativeTarget, err := filepath.Rel(root, resolvedTarget)
	if err != nil || relativeTarget == ".." || strings.HasPrefix(relativeTarget, ".."+string(filepath.Separator)) {
		return ""
	}

	relativePath := filepath.ToSlash(relativeTarget)
	includedPath := pppaths.IncludedSpec(relativePath)
	for _, asset := range pp.site.IncludedSpecs {
		if asset != nil && asset.Path == relativePath {
			return includedPath
		}
	}
	data, err := os.ReadFile(resolvedTarget)
	if err != nil {
		return ""
	}
	pp.site.IncludedSpecs = append(pp.site.IncludedSpecs, &ppmodel.IncludedSpecAsset{Path: relativePath, Data: data})
	return includedPath
}
