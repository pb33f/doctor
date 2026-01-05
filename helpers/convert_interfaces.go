// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package helpers

import "fmt"

// ConvertInterfaceMapKeys takes an arbitrary interface{} and converts any map[interface{}]interface{} it finds
// into map[string]interface{}. It does this recursively, so nested maps and slices are also processed
// YAML is great and annoying, and JSON encoding gets very upset sometimes.
func ConvertInterfaceMapKeys(input interface{}) interface{} {
	// Fast path for common cases
	if m, ok := input.(map[string]interface{}); ok {
		convertMapStringValues(m)
		return m
	}

	// Handle map[interface{}]interface{} at root
	if m, ok := input.(map[interface{}]interface{}); ok {
		return convertInterfaceMap(m)
	}

	// For slice types at root
	if s, ok := input.([]interface{}); ok {
		processSlice(s)
		return s
	}

	// For other types, return as-is
	return input
}

// convertInterfaceMap converts map[interface{}]interface{} to map[string]interface{}
func convertInterfaceMap(m map[interface{}]interface{}) map[string]interface{} {
	result := make(map[string]interface{}, len(m))
	for k, v := range m {
		var strKey string
		if s, ok := k.(string); ok {
			strKey = s
		} else {
			strKey = fmt.Sprintf("%v", k)
		}

		// Recursively handle nested values
		switch val := v.(type) {
		case map[interface{}]interface{}:
			result[strKey] = convertInterfaceMap(val)
		case map[string]interface{}:
			convertMapStringValues(val)
			result[strKey] = val
		case []interface{}:
			processSlice(val)
			result[strKey] = val
		default:
			result[strKey] = val
		}
	}
	return result
}

// convertMapStringValues processes map[string]interface{} in-place
func convertMapStringValues(m map[string]interface{}) {
	for k, v := range m {
		switch val := v.(type) {
		case map[interface{}]interface{}:
			m[k] = convertInterfaceMap(val)
		case map[string]interface{}:
			convertMapStringValues(val)
		case []interface{}:
			processSlice(val)
		}
	}
}

// processSlice processes slices in-place
func processSlice(s []interface{}) {
	for i, v := range s {
		switch val := v.(type) {
		case map[interface{}]interface{}:
			s[i] = convertInterfaceMap(val)
		case map[string]interface{}:
			convertMapStringValues(val)
		case []interface{}:
			processSlice(val)
		}
	}
}