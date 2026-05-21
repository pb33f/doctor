// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package slug

import (
	"strings"
	"testing"
)

func TestSanitize(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "path", input: "/api/v1/users/{userId}", want: "api-v1-users-user-id"},
		{name: "method path", input: "GET /pets", want: "get-pets"},
		{name: "camel case", input: "listFunctionDocumentation", want: "list-function-documentation"},
		{name: "dotted", input: "my.dotted.name", want: "my-dotted-name"},
		{name: "underscore", input: "UPPER_CASE", want: "upper-case"},
		{name: "unsafe", input: "a@b#c", want: "abc"},
		{name: "multi dash", input: "multiple---dashes", want: "multiple-dashes"},
		{name: "empty", input: "", want: "unnamed"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Sanitize(tt.input); got != tt.want {
				t.Fatalf("Sanitize(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestBound(t *testing.T) {
	if got := Bound("--"); got != "unnamed" {
		t.Fatalf("Bound empty = %q, want unnamed", got)
	}

	short := "already-short"
	if got := Bound(short); got != short {
		t.Fatalf("Bound short = %q, want %q", got, short)
	}

	long := strings.Repeat("identity-governance-entitlement-management-", 8) + "resource"
	got := Bound(long)
	other := Bound(long + "-other")

	if len(got) > MaxSlugLength {
		t.Fatalf("Bound long length = %d, want <= %d", len(got), MaxSlugLength)
	}
	if got == other {
		t.Fatalf("different long slugs produced same bound slug %q", got)
	}
	if got == Bound(long[:MaxSlugLength]) {
		t.Fatalf("long slug should include a hash suffix, got %q", got)
	}
}

func TestSlugRegistryRegister(t *testing.T) {
	r := NewSlugRegistry()

	if got := r.Register("schemas", "user"); got != "user" {
		t.Fatalf("first registration = %q, want user", got)
	}
	if got := r.Register("schemas", "user"); got != "user-2" {
		t.Fatalf("second registration = %q, want user-2", got)
	}
	if got := r.Register("schemas", "user"); got != "user-3" {
		t.Fatalf("third registration = %q, want user-3", got)
	}
	if got := r.Register("responses", "user"); got != "user" {
		t.Fatalf("different category registration = %q, want user", got)
	}
}

func TestSlugRegistryRegisterSkipsTakenSuffix(t *testing.T) {
	r := NewSlugRegistry()
	r.used["schemas"] = map[string]int{"user": 1, "user-2": 1}

	if got := r.Register("schemas", "user"); got != "user-3" {
		t.Fatalf("registration with taken suffix = %q, want user-3", got)
	}
}

func TestSlugRegistryRegisterBoundsLongCollisions(t *testing.T) {
	r := NewSlugRegistry()
	long := strings.Repeat("access-package-resource-scope-", 10) + "environment"

	first := r.Register("operations", long)
	second := r.Register("operations", long)

	if len(first) > MaxSlugLength {
		t.Fatalf("first slug length = %d, want <= %d", len(first), MaxSlugLength)
	}
	if len(second) > MaxSlugLength {
		t.Fatalf("second slug length = %d, want <= %d", len(second), MaxSlugLength)
	}
	if first == second {
		t.Fatalf("colliding long slugs should differ, both were %q", first)
	}
	if !strings.HasSuffix(second, "-2") {
		t.Fatalf("second slug = %q, want -2 suffix", second)
	}
}

func TestOperationSlug(t *testing.T) {
	if got := OperationSlug("get", "/users", "getUsers"); got != "get-users" {
		t.Fatalf("OperationSlug with operation id = %q, want get-users", got)
	}
	if got := OperationSlug("post", "/api/v1/pets/{petId}", ""); got != "post-api-v1-pets-pet-id" {
		t.Fatalf("OperationSlug without operation id = %q, want post-api-v1-pets-pet-id", got)
	}
}

func TestComponentKey(t *testing.T) {
	if got := ComponentKey("schemas", "User"); got != "#/components/schemas/User" {
		t.Fatalf("ComponentKey = %q, want #/components/schemas/User", got)
	}
}
