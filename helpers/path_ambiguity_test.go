// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: MIT

package helpers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCheckPaths(t *testing.T) {
	tests := []struct {
		name    string
		pathA   string
		pathB   string
		paramsA map[string]string
		paramsB map[string]string
		want    bool
	}{
		{
			name:  "identical literal paths",
			pathA: "/users",
			pathB: "/users",
			want:  true,
		},
		{
			name:  "same shape variables",
			pathA: "/users/{id}/posts",
			pathB: "/users/{userId}/posts",
			want:  true,
		},
		{
			name:  "literal mismatch",
			pathA: "/users/{id}/posts",
			pathB: "/accounts/{id}/posts",
			want:  false,
		},
		{
			name:  "concrete path takes precedence over templated path",
			pathA: "/foo/baz",
			pathB: "/foo/{bar}",
			want:  false,
		},
		{
			name:  "conflicting variable literal positions",
			pathA: "/a/{id1}/b/c/{id3}",
			pathB: "/a/{id1}/b/{id2}/d",
			want:  false,
		},
		{
			name:  "different segment counts",
			pathA: "/users/{id}",
			pathB: "/users/{id}/posts",
			want:  false,
		},
		{
			name:    "incompatible parameter types",
			pathA:   "/users/{id}",
			pathB:   "/users/{slug}",
			paramsA: map[string]string{"id": "integer"},
			paramsB: map[string]string{"slug": "string"},
			want:    false,
		},
		{
			name:    "compatible numeric parameter types",
			pathA:   "/users/{id}",
			pathB:   "/users/{accountId}",
			paramsA: map[string]string{"id": "integer"},
			paramsB: map[string]string{"accountId": "number"},
			want:    true,
		},
		{
			name:    "literal cannot match typed variable",
			pathA:   "/users/{id}",
			pathB:   "/users/current",
			paramsA: map[string]string{"id": "integer"},
			want:    false,
		},
		{
			name:    "numeric literal still not ambiguous with typed variable",
			pathA:   "/users/{id}",
			pathB:   "/users/123",
			paramsA: map[string]string{"id": "integer"},
			want:    false,
		},
		{
			name:    "different RFC 6570 operators",
			pathA:   "/users/{id}",
			pathB:   "/users/{;id}",
			paramsA: map[string]string{"id": "number"},
			paramsB: map[string]string{"id": "number"},
			want:    false,
		},
		{
			name:    "same RFC 6570 operator",
			pathA:   "/users/{;id}",
			pathB:   "/users/{;userId}",
			paramsA: map[string]string{"id": "number"},
			paramsB: map[string]string{"userId": "number"},
			want:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, CheckPaths(tt.pathA, tt.pathB, tt.paramsA, tt.paramsB))
		})
	}
}

func TestParseTemplateSegment(t *testing.T) {
	tests := []struct {
		name string
		in   string
		want TemplateSegment
	}{
		{
			name: "literal",
			in:   "users",
			want: TemplateSegment{Raw: "users"},
		},
		{
			name: "simple variable",
			in:   "{id}",
			want: TemplateSegment{Raw: "{id}", Name: "id", IsVariable: true},
		},
		{
			name: "operator and explode",
			in:   "{;id*}",
			want: TemplateSegment{Raw: "{;id*}", Operator: ";", Name: "id", Explode: true, IsVariable: true},
		},
		{
			name: "prefix modifier",
			in:   "{+path:3}",
			want: TemplateSegment{Raw: "{+path:3}", Operator: "+", Name: "path", Prefix: 3, IsVariable: true},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, ParseTemplateSegment(tt.in))
		})
	}
}

func TestCanLiteralMatchType(t *testing.T) {
	assert.True(t, CanLiteralMatchType("-10", "integer"))
	assert.False(t, CanLiteralMatchType("10.1", "integer"))
	assert.True(t, CanLiteralMatchType("-10.1", "number"))
	assert.False(t, CanLiteralMatchType("10.1.2", "number"))
	assert.True(t, CanLiteralMatchType("false", "boolean"))
	assert.False(t, CanLiteralMatchType("no", "boolean"))
	assert.True(t, CanLiteralMatchType("anything", "string"))
}
