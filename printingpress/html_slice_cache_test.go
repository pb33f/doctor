// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"errors"
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestYAMLSliceHydrationCacheReadsFileOnceForRepeatedSlices(t *testing.T) {
	readCount := 0
	expectedPath := filepath.Clean("/tmp/openapi.yaml")
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		assert.Equal(t, expectedPath, path)
		return []byte("line1: value\nline2: value\nline3: value\nline4: value\n"), nil
	})
	defer cache.Close()

	slices := map[string]*ppmodel.YamlSlice{
		"slice-a": {Key: "slice-a", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 1, LastLine: 2},
		"slice-b": {Key: "slice-b", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 3, LastLine: 4},
	}

	hydrated := hydrateYamlSlicesWithCache(slices, cache)

	require.Len(t, hydrated, 2)
	assert.Equal(t, 1, readCount)
	assert.Equal(t, "line1: value\nline2: value", hydrated["slice-a"].Source)
	assert.Equal(t, "line3: value\nline4: value", hydrated["slice-b"].Source)
	assert.Empty(t, slices["slice-a"].Source, "hydration must not mutate retained site slices")
}

func TestYAMLSliceHydrationCacheReusesIdenticalRange(t *testing.T) {
	readCount := 0
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		return []byte("line1: value\nline2: value\nline3: value\n"), nil
	})
	defer cache.Close()

	slices := map[string]*ppmodel.YamlSlice{
		"slice-a": {Key: "slice-a", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 1, LastLine: 2},
		"slice-b": {Key: "slice-b", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 1, LastLine: 2},
	}

	hydrated := hydrateYamlSlicesWithCache(slices, cache)

	require.Len(t, hydrated, 2)
	assert.Equal(t, 1, readCount)
	assert.Len(t, cache.excerpts, 1)
	assert.Equal(t, hydrated["slice-a"].Source, hydrated["slice-b"].Source)
}

func TestYAMLSliceHydrationCacheSharesExcerptsAcrossDeveloperPayloads(t *testing.T) {
	readCount := 0
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		return []byte("line1: value\nline2: value\nline3: value\n"), nil
	})
	defer cache.Close()

	first := buildDeveloperHydrationPayloadWithCache(
		ppmodel.ViolationCounts{Warns: 1},
		[]*ppmodel.PageProblem{{ID: "lint-1", Severity: 4, SliceKey: "slice-a"}},
		map[string]*ppmodel.YamlSlice{
			"slice-a": {Key: "slice-a", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 1, LastLine: 2},
		},
		ppmodel.ViolationCounts{},
		0,
		cache,
	)
	second := buildDeveloperHydrationPayloadWithCache(
		ppmodel.ViolationCounts{Warns: 1},
		[]*ppmodel.PageProblem{{ID: "lint-2", Severity: 4, SliceKey: "slice-b"}},
		map[string]*ppmodel.YamlSlice{
			"slice-b": {Key: "slice-b", ResolvedFile: "/tmp/openapi.yaml", FirstLine: 1, LastLine: 2},
		},
		ppmodel.ViolationCounts{},
		0,
		cache,
	)

	require.NotNil(t, first)
	require.NotNil(t, second)
	assert.Equal(t, 1, readCount)
	assert.Len(t, cache.excerpts, 1)
	assert.Equal(t, first.Slices["slice-a"].Source, second.Slices["slice-b"].Source)
}

func TestYAMLSliceHydrationCacheDoesNotReadWhenSliceAlreadyHasSource(t *testing.T) {
	readCount := 0
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		return nil, errors.New("unexpected read")
	})
	defer cache.Close()

	hydrated := hydrateYamlSlicesWithCache(map[string]*ppmodel.YamlSlice{
		"slice-a": {
			Key:          "slice-a",
			ResolvedFile: "/tmp/openapi.yaml",
			FirstLine:    1,
			LastLine:     1,
			Source:       "cached source",
		},
	}, cache)

	require.Len(t, hydrated, 1)
	assert.Equal(t, 0, readCount)
	assert.Equal(t, "cached source", hydrated["slice-a"].Source)
}

func TestYAMLSliceHydrationCacheCachesMissingFiles(t *testing.T) {
	readCount := 0
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		return nil, errors.New("missing")
	})
	defer cache.Close()

	slice := &ppmodel.YamlSlice{ResolvedFile: "/tmp/missing.yaml", FirstLine: 1, LastLine: 1}

	assert.Empty(t, readYamlSliceSourceWithCache(slice, cache))
	assert.Empty(t, readYamlSliceSourceWithCache(slice, cache))
	assert.Equal(t, 1, readCount)
}

func TestYAMLSliceHydrationCacheSkipsURLLocations(t *testing.T) {
	readCount := 0
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		readCount++
		return []byte("unexpected"), nil
	})
	defer cache.Close()

	slice := &ppmodel.YamlSlice{File: "https://example.com/openapi.yaml", FirstLine: 1, LastLine: 1}

	assert.Empty(t, readYamlSliceSourceWithCache(slice, cache))
	assert.Equal(t, 0, readCount)
}

func TestYAMLSliceHydrationCacheCloseReleasesState(t *testing.T) {
	cache := newYAMLSliceHydrationCacheWithReader(func(path string) ([]byte, error) {
		return []byte("line1: value\n"), nil
	})

	source := readYamlSliceSourceWithCache(&ppmodel.YamlSlice{
		ResolvedFile: "/tmp/openapi.yaml",
		FirstLine:    1,
		LastLine:     1,
	}, cache)
	require.NotEmpty(t, source)
	require.NotEmpty(t, cache.files)
	require.NotEmpty(t, cache.excerpts)

	cache.Close()

	assert.Nil(t, cache.files)
	assert.Nil(t, cache.excerpts)
	assert.Nil(t, cache.missing)
	assert.Nil(t, cache.readFile)
}

func TestLineIndexedSourceMatchesLegacyLineRange(t *testing.T) {
	tests := []struct {
		name      string
		source    string
		firstLine int
		lastLine  int
	}{
		{name: "first line", source: "a\nb\nc\n", firstLine: 1, lastLine: 1},
		{name: "multi line", source: "a\nb\nc\n", firstLine: 2, lastLine: 3},
		{name: "empty middle line", source: "a\n\nc", firstLine: 2, lastLine: 3},
		{name: "last line without newline", source: "a\nb", firstLine: 2, lastLine: 4},
		{name: "last line with newline", source: "a\n", firstLine: 1, lastLine: 1},
		{name: "line after terminal newline", source: "a\n", firstLine: 2, lastLine: 2},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			source := []byte(tt.source)
			indexed := newLineIndexedSource(source)

			assert.Equal(t, sourceLineRange(source, tt.firstLine, tt.lastLine), indexed.lineRange(tt.firstLine, tt.lastLine))
		})
	}
}
