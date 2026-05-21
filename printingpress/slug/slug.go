// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package slug

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"regexp"
	"strings"
)

const (
	// MaxSlugLength keeps generated URL and filename segments safely under common filesystem limits.
	MaxSlugLength = 180
	slugHashBytes = 6
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
	return Bound(s)
}

// Bound returns slug capped to MaxSlugLength with a deterministic hash suffix when needed.
func Bound(slug string) string {
	slug = strings.Trim(slug, "-")
	if slug == "" {
		slug = "unnamed"
	}
	if len(slug) <= MaxSlugLength {
		return slug
	}
	hash := slugHash(slug)
	prefixLimit := MaxSlugLength - len(hash) - 1
	prefix := strings.Trim(slug[:prefixLimit], "-")
	return prefix + "-" + hash
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
	preferred = Bound(preferred)
	if _, ok := r.used[category]; !ok {
		r.used[category] = make(map[string]int)
	}
	cat := r.used[category]
	if _, exists := cat[preferred]; !exists {
		cat[preferred] = 1
		return preferred
	}
	cat[preferred]++
	slug := appendSlugSuffix(preferred, cat[preferred])
	// ensure the suffixed slug itself isn't taken
	for {
		if _, exists := cat[slug]; !exists {
			cat[slug] = 1
			return slug
		}
		cat[preferred]++
		slug = appendSlugSuffix(preferred, cat[preferred])
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

func appendSlugSuffix(slug string, count int) string {
	suffix := fmt.Sprintf("-%d", count)
	if len(slug)+len(suffix) <= MaxSlugLength {
		return slug + suffix
	}
	return strings.Trim(slug[:MaxSlugLength-len(suffix)], "-") + suffix
}

func slugHash(slug string) string {
	sum := sha256.Sum256([]byte(slug))
	return hex.EncodeToString(sum[:slugHashBytes])
}
