// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"testing"

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
			assert.Equal(t, tt.expected, sanitizeSlug(tt.input))
		})
	}
}

func TestSlugRegistry_Register(t *testing.T) {
	r := NewSlugRegistry()

	// First registration succeeds with preferred slug
	assert.Equal(t, "user", r.Register("schemas", "user"))

	// Second registration of same slug gets suffix
	assert.Equal(t, "user-2", r.Register("schemas", "user"))

	// Third gets -3
	assert.Equal(t, "user-3", r.Register("schemas", "user"))

	// Different category allows same slug
	assert.Equal(t, "user", r.Register("responses", "user"))
}

func TestOperationSlug(t *testing.T) {
	assert.Equal(t, "get-users", operationSlug("get", "/users", "getUsers"))
	assert.Equal(t, "get-users", operationSlug("get", "/users", ""))
	assert.Equal(t, "post-api-v1-pets-pet-id", operationSlug("post", "/api/v1/pets/{petId}", ""))
}

func TestComponentKey(t *testing.T) {
	assert.Equal(t, "#/components/schemas/User", componentKey("schemas", "User"))
	assert.Equal(t, "#/components/responses/NotFound", componentKey("responses", "NotFound"))
}
