// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type yamlSliceHydrationCache struct {
	files    map[string]*lineIndexedSource
	excerpts map[yamlSliceRange]string
	missing  map[string]struct{}
	readFile func(string) ([]byte, error)
}

type yamlSliceRange struct {
	file      string
	firstLine int
	lastLine  int
}

type lineIndexedSource struct {
	source     []byte
	lineStarts []int
}

func newYAMLSliceHydrationCache() *yamlSliceHydrationCache {
	return newYAMLSliceHydrationCacheWithReader(os.ReadFile)
}

func newYAMLSliceHydrationCacheWithReader(readFile func(string) ([]byte, error)) *yamlSliceHydrationCache {
	if readFile == nil {
		readFile = os.ReadFile
	}
	return &yamlSliceHydrationCache{
		files:    make(map[string]*lineIndexedSource),
		excerpts: make(map[yamlSliceRange]string),
		missing:  make(map[string]struct{}),
		readFile: readFile,
	}
}

func (c *yamlSliceHydrationCache) Close() {
	if c == nil {
		return
	}
	for key, source := range c.files {
		if source != nil {
			source.source = nil
			source.lineStarts = nil
		}
		delete(c.files, key)
	}
	for key := range c.excerpts {
		delete(c.excerpts, key)
	}
	for key := range c.missing {
		delete(c.missing, key)
	}
	c.files = nil
	c.excerpts = nil
	c.missing = nil
	c.readFile = nil
}

func (c *yamlSliceHydrationCache) sourceForSlice(slice *ppmodel.YamlSlice) string {
	if slice == nil {
		return ""
	}
	if strings.TrimSpace(slice.Source) != "" {
		return slice.Source
	}
	file := normalizedYAMLSliceFile(slice)
	if file == "" {
		return ""
	}
	key := yamlSliceRange{
		file:      file,
		firstLine: slice.FirstLine,
		lastLine:  slice.LastLine,
	}
	if c != nil {
		if source, ok := c.excerpts[key]; ok {
			return source
		}
	}
	source, ok := c.sourceForFile(file)
	if !ok {
		return ""
	}
	excerpt := source.lineRange(slice.FirstLine, slice.LastLine)
	if c != nil && c.excerpts != nil {
		c.excerpts[key] = excerpt
	}
	return excerpt
}

func (c *yamlSliceHydrationCache) sourceForFile(file string) (*lineIndexedSource, bool) {
	if c == nil {
		source, err := os.ReadFile(file)
		if err != nil {
			return nil, false
		}
		return newLineIndexedSource(source), true
	}
	if c.files == nil {
		c.files = make(map[string]*lineIndexedSource)
	}
	if c.missing == nil {
		c.missing = make(map[string]struct{})
	}
	if source := c.files[file]; source != nil {
		return source, true
	}
	if _, ok := c.missing[file]; ok {
		return nil, false
	}
	readFile := c.readFile
	if readFile == nil {
		readFile = os.ReadFile
	}
	sourceBytes, err := readFile(file)
	if err != nil {
		c.missing[file] = struct{}{}
		return nil, false
	}
	source := newLineIndexedSource(sourceBytes)
	c.files[file] = source
	return source, true
}

func normalizedYAMLSliceFile(slice *ppmodel.YamlSlice) string {
	if slice == nil {
		return ""
	}
	file := strings.TrimSpace(slice.ResolvedFile)
	if file == "" {
		file = strings.TrimSpace(slice.File)
	}
	if file == "" || strings.Contains(file, "://") {
		return ""
	}
	return filepath.Clean(file)
}

func newLineIndexedSource(source []byte) *lineIndexedSource {
	indexed := &lineIndexedSource{source: source}
	if len(source) == 0 {
		return indexed
	}
	indexed.lineStarts = append(indexed.lineStarts, 0)
	for i, b := range source {
		if b == '\n' && i+1 < len(source) {
			indexed.lineStarts = append(indexed.lineStarts, i+1)
		}
	}
	return indexed
}

func (s *lineIndexedSource) lineRange(firstLine, lastLine int) string {
	if s == nil || len(s.source) == 0 || firstLine <= 0 || lastLine < firstLine {
		return ""
	}
	if firstLine > len(s.lineStarts) {
		return ""
	}
	start := s.lineStarts[firstLine-1]
	end := len(s.source)
	if lastLine < len(s.lineStarts) {
		end = s.lineStarts[lastLine] - 1
	} else if end > start && s.source[end-1] == '\n' {
		end--
	}
	if end < start {
		return ""
	}
	return string(s.source[start:end])
}
