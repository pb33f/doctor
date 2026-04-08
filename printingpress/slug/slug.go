// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package slug

import (
	"fmt"
	"regexp"
	"strings"
)

var (
	slugCamelBound = regexp.MustCompile(`([a-z0-9])([A-Z])`)
	slugUnsafe     = regexp.MustCompile(`[^a-z0-9-]`)
	slugMultiDash  = regexp.MustCompile(`-{2,}`)
)

// Sanitize converts an arbitrary string into a URL-safe kebab-case slug.
// Handles camelCase (e.g. "listFunctionDocumentation" → "list-function-documentation").
func Sanitize(input string) string {
	// Insert hyphens at camelCase boundaries before lowercasing.
	s := slugCamelBound.ReplaceAllString(input, "${1}-${2}")
	s = strings.ToLower(s)
	s = strings.NewReplacer("/", "-", "{", "", "}", "", ".", "-", "_", "-", " ", "-").Replace(s)
	s = slugUnsafe.ReplaceAllString(s, "")
	s = slugMultiDash.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	if s == "" {
		s = "unnamed"
	}
	return s
}

// SlugRegistry tracks used slugs per category to prevent collisions.
type SlugRegistry struct {
	used map[string]map[string]int // category → slug → count of registrations
}

// NewSlugRegistry creates a slug registry with per-category collision tracking.
func NewSlugRegistry() *SlugRegistry {
	return &SlugRegistry{
		used: make(map[string]map[string]int),
	}
}

// Register returns the preferred slug if available, otherwise appends -2, -3, etc.
func (r *SlugRegistry) Register(category, preferred string) string {
	if _, ok := r.used[category]; !ok {
		r.used[category] = make(map[string]int)
	}
	cat := r.used[category]
	if _, exists := cat[preferred]; !exists {
		cat[preferred] = 1
		return preferred
	}
	cat[preferred]++
	slug := fmt.Sprintf("%s-%d", preferred, cat[preferred])
	// ensure the suffixed slug itself isn't taken
	for {
		if _, exists := cat[slug]; !exists {
			cat[slug] = 1
			return slug
		}
		cat[preferred]++
		slug = fmt.Sprintf("%s-%d", preferred, cat[preferred])
	}
}

// OperationSlug generates a slug for an operation, preferring operationId.
func OperationSlug(method, path, operationID string) string {
	if operationID != "" {
		return Sanitize(operationID)
	}
	return Sanitize(method + "-" + path)
}

// ComponentKey returns the canonical cross-reference key for a component.
func ComponentKey(componentType, name string) string {
	return fmt.Sprintf("#/components/%s/%s", componentType, name)
}
