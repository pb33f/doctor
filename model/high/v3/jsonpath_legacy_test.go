package v3

import (
	"strconv"
	"strings"
)

// frozen pre-optimization oracle; keep independent of the new encoder.
func legacyJSONPath(f *Foundation) string {
	// Collect path segments bottom-up
	segments := make([]string, 0, 16) // Pre-allocate reasonable capacity
	var current Foundational = f
	depth := 0

	for current != nil && depth < 150 { // Keep the depth limit for safety
		depth++

		// Build the segment for current level
		var segment string
		key := current.GetKeyValue()
		pathSeg := current.GetPathSegment()
		index := current.GetIndexValue()

		// Check if this is a cache split (Foundation specific)
		cacheSplit := false
		if found, ok := current.(*Foundation); ok {
			cacheSplit = found.CacheSplit
		}

		if key != "" {
			if pathSeg == "" {
				segment = "['" + key + "']"
			} else {
				segment = pathSeg + "['" + key + "']"
			}
		} else if index != nil {
			if cacheSplit {
				segment = pathSeg + "CACHE-SPLIT[" + strconv.Itoa(*index) + "]--"
			} else {
				segment = pathSeg + "[" + strconv.Itoa(*index) + "]"
			}
		} else {
			segment = pathSeg
		}

		if segment != "" {
			segments = append(segments, segment)
		}

		// Move up the chain using the interface method
		parent := current.GetParent()
		if parent != nil {
			current = parent
		} else {
			break
		}
	}

	// Handle edge cases
	if len(segments) == 0 {
		if f.PathSegment == "document" || f.PathSegment == "$" {
			return "$"
		}
		return f.PathSegment
	}

	// Reverse segments (we collected bottom-up, need top-down)
	for i, j := 0, len(segments)-1; i < j; i, j = i+1, j-1 {
		segments[i], segments[j] = segments[j], segments[i]
	}

	// Handle document root
	if segments[0] == "document" || segments[0] == "$" {
		segments[0] = "$"
	}

	// Build the final path efficiently
	var result strings.Builder
	result.Grow(128) // Pre-allocate for typical paths

	for i, segment := range segments {
		if i == 0 {
			result.WriteString(segment)
		} else {
			// Add separator if needed (not for array/map access)
			if !strings.HasPrefix(segment, "[") && !strings.HasPrefix(segment, "CACHE-SPLIT[") {
				result.WriteByte('.')
			}
			result.WriteString(segment)
		}
	}

	return result.String()
}
