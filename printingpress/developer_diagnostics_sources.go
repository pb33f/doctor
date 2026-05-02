// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/cespare/xxhash/v2"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type diagnosticBuildCache struct {
	sources        map[string]*diagnosticCachedSource
	slices         map[string]*ppmodel.YamlSlice
	missingSources map[string]struct{}
}

type diagnosticCachedSource struct {
	resolvedFile string
	lineCount    int
}

func newDiagnosticBuildCache() *diagnosticBuildCache {
	return &diagnosticBuildCache{
		sources:        make(map[string]*diagnosticCachedSource),
		slices:         make(map[string]*ppmodel.YamlSlice),
		missingSources: make(map[string]struct{}),
	}
}

func (pp *PrintingPress) resultSourceLocation(result *drV3.RuleFunctionResult, owner drV3.Foundational, startLine int, cache *diagnosticBuildCache) string {
	var candidates []string
	if result != nil && result.Origin != nil {
		if result.Origin.AbsoluteLocation != "" {
			candidates = append(candidates, result.Origin.AbsoluteLocation)
		}
		if result.Origin.AbsoluteLocationValue != "" {
			candidates = append(candidates, result.Origin.AbsoluteLocationValue)
		}
	}
	if owner != nil {
		if file := drV3.SourceFileForFoundational(owner); file != "" {
			candidates = append(candidates, file)
		}
	}
	candidates = append(candidates, pp.defaultProblemSourceLocations()...)
	return pp.bestProblemSourceLocation(candidates, startLine, cache)
}

func (pp *PrintingPress) defaultProblemSourceLocations() []string {
	if pp.engineConfig != nil {
		locations := make([]string, 0, 2)
		if pp.engineConfig.SpecPath != "" {
			locations = append(locations, pp.engineConfig.SpecPath)
		}
		if pp.engineConfig.SpecLocation != "" {
			locations = append(locations, pp.engineConfig.SpecLocation)
		}
		return locations
	}
	return nil
}

func (pp *PrintingPress) bestProblemSourceLocation(candidates []string, startLine int, cache *diagnosticBuildCache) string {
	seen := make(map[string]struct{}, len(candidates))
	filtered := make([]string, 0, len(candidates))
	for _, candidate := range candidates {
		candidate = strings.TrimSpace(candidate)
		if candidate == "" {
			continue
		}
		if _, ok := seen[candidate]; ok {
			continue
		}
		seen[candidate] = struct{}{}
		filtered = append(filtered, candidate)
		if pp.problemLocationHasLine(candidate, startLine, cache) {
			return candidate
		}
	}
	if len(filtered) > 0 {
		return filtered[0]
	}
	return ""
}

func (pp *PrintingPress) buildProblemSlices(problems []*ppmodel.PageProblem) map[string]*ppmodel.YamlSlice {
	return pp.buildProblemSlicesWithCache(problems, nil)
}

func (pp *PrintingPress) buildProblemSlicesWithCache(problems []*ppmodel.PageProblem, cache *diagnosticBuildCache) map[string]*ppmodel.YamlSlice {
	if len(problems) == 0 {
		return nil
	}
	slices := make(map[string]*ppmodel.YamlSlice)
	for _, problem := range problems {
		if problem == nil || problem.StartLineNumber <= 0 {
			continue
		}
		slice := pp.buildProblemSliceWithCache(problem, cache)
		if slice == nil {
			continue
		}
		problem.SliceKey = slice.Key
		slices[slice.Key] = slice
	}
	if len(slices) == 0 {
		return nil
	}
	return slices
}

func (pp *PrintingPress) buildProblemSlice(problem *ppmodel.PageProblem) *ppmodel.YamlSlice {
	return pp.buildProblemSliceWithCache(problem, nil)
}

func (pp *PrintingPress) buildProblemSliceWithCache(problem *ppmodel.PageProblem, cache *diagnosticBuildCache) *ppmodel.YamlSlice {
	location := pp.bestProblemSourceLocation(append([]string{problem.SourceLocation}, pp.defaultProblemSourceLocations()...), problem.StartLineNumber, cache)
	if location == "" {
		pp.warnMissingProblemSource(problem.SourceLocation, cache)
		return nil
	}
	sourceData, ok := pp.diagnosticSource(location, cache)
	if !ok {
		pp.warnMissingProblemSource(location, cache)
		return nil
	}
	start := problem.StartLineNumber - 15
	if start < 1 {
		start = 1
	}
	end := problem.EndLineNumber + 15
	if end < problem.StartLineNumber {
		end = problem.StartLineNumber + 15
	}
	if end > sourceData.lineCount {
		end = sourceData.lineCount
	}
	if start > end {
		return nil
	}
	problem.SourceLocation = location
	cacheKey := problemSliceCacheKey(sourceData.resolvedFile, location, start, end)
	if cache != nil {
		if slice := cache.slices[cacheKey]; slice != nil {
			problem.SliceKey = slice.Key
			return slice
		}
	}
	key := "slice-" + strconv.FormatUint(xxhash.Sum64String(cacheKey), 16)
	slice := &ppmodel.YamlSlice{
		Key:          key,
		File:         location,
		FirstLine:    start,
		LastLine:     end,
		ResolvedFile: sourceData.resolvedFile,
	}
	if cache != nil {
		cache.slices[cacheKey] = slice
	}
	return slice
}

func problemSliceCacheKey(resolvedFile, location string, start, end int) string {
	var builder strings.Builder
	builder.Grow(len(resolvedFile) + len(location) + 24)
	builder.WriteString(resolvedFile)
	builder.WriteByte(':')
	builder.WriteString(location)
	builder.WriteByte(':')
	builder.WriteString(strconv.Itoa(start))
	builder.WriteByte(':')
	builder.WriteString(strconv.Itoa(end))
	return builder.String()
}

func (pp *PrintingPress) warnMissingProblemSource(location string, cache *diagnosticBuildCache) {
	if pp == nil {
		return
	}
	location = strings.TrimSpace(location)
	if location == "" {
		location = "<unspecified>"
	}
	if cache != nil {
		if _, exists := cache.missingSources[location]; exists {
			return
		}
		cache.missingSources[location] = struct{}{}
	}
	pp.warn("diagnostics source slice unavailable; source file could not be read", location, nil)
}

func (pp *PrintingPress) problemLocationHasLine(location string, line int, cache *diagnosticBuildCache) bool {
	sourceData, ok := pp.diagnosticSource(location, cache)
	if !ok {
		return false
	}
	if line <= 0 {
		return true
	}
	return line <= sourceData.lineCount
}

func (pp *PrintingPress) diagnosticSource(location string, cache *diagnosticBuildCache) (*diagnosticCachedSource, bool) {
	file := pp.resolveProblemFile(location)
	if file == "" {
		return nil, false
	}
	if cache != nil {
		if source := cache.sources[file]; source != nil {
			return source, true
		}
	}
	bytes, err := os.ReadFile(file)
	if err != nil {
		return nil, false
	}
	source := &diagnosticCachedSource{
		resolvedFile: file,
		lineCount:    countSourceLines(bytes),
	}
	if cache != nil {
		cache.sources[file] = source
	}
	return source, true
}

func countSourceLines(source []byte) int {
	if len(source) == 0 {
		return 0
	}
	count := bytes.Count(source, []byte{'\n'})
	if source[len(source)-1] != '\n' {
		count++
	}
	return count
}

func (pp *PrintingPress) resolveProblemFile(location string) string {
	location = strings.TrimSpace(location)
	if location == "" || strings.Contains(location, "://") {
		return ""
	}
	if filepath.IsAbs(location) {
		return location
	}
	if pp.engineConfig != nil {
		if pp.engineConfig.SpecRoot != "" {
			return filepath.Join(pp.engineConfig.SpecRoot, location)
		}
		if pp.engineConfig.SpecPath != "" {
			return filepath.Join(filepath.Dir(pp.engineConfig.SpecPath), location)
		}
	}
	return location
}
