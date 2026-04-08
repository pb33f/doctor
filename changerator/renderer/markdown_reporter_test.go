// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
)

func TestGetIndent(t *testing.T) {
	tests := []struct {
		name     string
		level    int
		expected string
	}{
		{
			name:     "level 0 returns empty string",
			level:    0,
			expected: "",
		},
		{
			name:     "level 1 returns 2 spaces",
			level:    1,
			expected: "  ",
		},
		{
			name:     "level 2 returns 4 spaces",
			level:    2,
			expected: "    ",
		},
		{
			name:     "level 3 returns 6 spaces",
			level:    3,
			expected: "      ",
		},
		{
			name:     "negative level returns empty string",
			level:    -1,
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := getIndent(tt.level)
			assert.Equal(t, tt.expected, result)
			if tt.level > 0 {
				assert.Equal(t, tt.level*2, len(result), "should be 2 spaces per level")
			}
		})
	}
}

func TestGenerateSummary_UsesDeduplicatedCounts(t *testing.T) {
	// Create a reporter with empty docChanges but with deduplicated changes.
	// The summary should reflect deduplicated counts, not docChanges counts.
	docChanges := &model.DocumentChanges{
		PropertyChanges: &model.PropertyChanges{},
	}
	deduped := []*model.Change{
		{ChangeType: model.Modified, Property: "name", Breaking: false, Type: "info"},
		{ChangeType: model.PropertyRemoved, Property: "email", Breaking: true, Type: "contact"},
	}

	reporter := MarkdownReport(docChanges, nil, nil, nil, deduped)
	output := reporter.Generate()

	// The summary should reflect deduplicated counts (2 total, 1 breaking)
	assert.Contains(t, output, "**2**")
	assert.Contains(t, output, "**1**")
	assert.Contains(t, output, "Modifications: **1**")
	assert.Contains(t, output, "Removals: **1**")
}

func TestGenerateTypeStatisticsFromDeduplicated_GroupsByType(t *testing.T) {
	deduped := []*model.Change{
		{ChangeType: model.Modified, Type: "info"},
		{ChangeType: model.Modified, Type: "info"},
		{ChangeType: model.PropertyRemoved, Type: "schema", Breaking: true},
		{ChangeType: model.PropertyAdded, Type: "tags"},
	}

	reporter := MarkdownReport(&model.DocumentChanges{
		PropertyChanges: &model.PropertyChanges{},
	}, nil, nil, nil, deduped)
	var sb strings.Builder
	reporter.generateTypeStatisticsFromDeduplicated(&sb)
	table := sb.String()

	assert.Contains(t, table, "| Info | 2 | - |")
	assert.Contains(t, table, "| Schema | 1 | 1 |")
	assert.Contains(t, table, "| Tag | 1 | - |") // "tags" normalized to "tag"
}

func TestNormalizeChangeType(t *testing.T) {
	assert.Equal(t, "tag", normalizeChangeType("tags"))
	assert.Equal(t, "info", normalizeChangeType("info"))
	assert.Equal(t, "schema", normalizeChangeType("schema"))
	assert.Equal(t, "", normalizeChangeType(""))
}
