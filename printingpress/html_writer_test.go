// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"testing"

	"github.com/pb33f/testify/assert"
)

func TestNormalizeBaseURL(t *testing.T) {
	tests := []struct {
		name    string
		baseURL string
		want    string
	}{
		{
			name:    "empty",
			baseURL: "",
			want:    "",
		},
		{
			name:    "root",
			baseURL: "/",
			want:    "/",
		},
		{
			name:    "relative path",
			baseURL: "docs",
			want:    "docs/",
		},
		{
			name:    "absolute path",
			baseURL: "/docs",
			want:    "/docs/",
		},
		{
			name:    "normalized absolute path",
			baseURL: "/docs/",
			want:    "/docs/",
		},
		{
			name:    "absolute url",
			baseURL: "https://example.com/docs",
			want:    "https://example.com/docs/",
		},
		{
			name:    "absolute url preserves query and fragment",
			baseURL: "https://example.com/docs?x=1#top",
			want:    "https://example.com/docs/?x=1#top",
		},
		{
			name:    "host root gains slash",
			baseURL: "https://example.com",
			want:    "https://example.com/",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, normalizeBaseURL(tt.baseURL))
		})
	}
}
