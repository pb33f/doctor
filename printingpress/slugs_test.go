// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"
	"testing"

	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"github.com/stretchr/testify/assert"
)

func TestSanitizeSlug(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"/api/v1/users/{userId}", "api-v1-users-user-id"},
		{"GET /pets", "get-pets"},
		{"DrLintResult", "dr-lint-result"},
		{"my.dotted.name", "my-dotted-name"},
		{"UPPER_CASE", "upper-case"},
		{"listFunctionDocumentation", "list-function-documentation"},
		{"multiple---dashes", "multiple-dashes"},
		{"-leading-trailing-", "leading-trailing"},
		{"", "unnamed"},
		{"simple", "simple"},
		{"with spaces", "with-spaces"},
	}
	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			assert.Equal(t, tt.expected, slugpkg.Sanitize(tt.input))
		})
	}
}

func TestSanitizeSlug_BoundsLongInput(t *testing.T) {
	long := strings.Repeat("identity-governance-entitlement-management-", 8) + "resource"

	got := slugpkg.Sanitize(long)
	other := slugpkg.Sanitize(long + "-other")

	assert.LessOrEqual(t, len(got), slugpkg.MaxSlugLength)
	assert.Regexp(t, `[a-f0-9]{12}$`, got)
	assert.NotEqual(t, got, other)
}

func TestSlugRegistry_Register(t *testing.T) {
	r := slugpkg.NewSlugRegistry()

	// First registration succeeds with preferred slug
	assert.Equal(t, "user", r.Register("schemas", "user"))

	// Second registration of same slug gets suffix
	assert.Equal(t, "user-2", r.Register("schemas", "user"))

	// Third gets -3
	assert.Equal(t, "user-3", r.Register("schemas", "user"))

	// Different category allows same slug
	assert.Equal(t, "user", r.Register("responses", "user"))
}

func TestSlugRegistry_RegisterBoundsLongCollisions(t *testing.T) {
	r := slugpkg.NewSlugRegistry()
	long := strings.Repeat("access-package-resource-scope-", 10) + "environment"

	first := r.Register("operations", long)
	second := r.Register("operations", long)

	assert.LessOrEqual(t, len(first), slugpkg.MaxSlugLength)
	assert.LessOrEqual(t, len(second), slugpkg.MaxSlugLength)
	assert.NotEqual(t, first, second)
	assert.True(t, strings.HasSuffix(second, "-2"))
}

func TestOperationSlug(t *testing.T) {
	assert.Equal(t, "get-users", slugpkg.OperationSlug("get", "/users", "getUsers"))
	assert.Equal(t, "get-users", slugpkg.OperationSlug("get", "/users", ""))
	assert.Equal(t, "post-api-v1-pets-pet-id", slugpkg.OperationSlug("post", "/api/v1/pets/{petId}", ""))
}

func TestComponentKey(t *testing.T) {
	assert.Equal(t, "#/components/schemas/User", slugpkg.ComponentKey("schemas", "User"))
	assert.Equal(t, "#/components/responses/NotFound", slugpkg.ComponentKey("responses", "NotFound"))
}
