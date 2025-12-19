// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"testing"

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
