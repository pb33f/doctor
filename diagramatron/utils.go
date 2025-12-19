// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"regexp"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
)

var delimiterPattern = regexp.MustCompile(`[-_\s]+`)

// ExtractSchemaNameFromReference extracts the schema name from a reference path
func ExtractSchemaNameFromReference(ref string) string {
	if lastSlash := strings.LastIndex(ref, "/"); lastSlash >= 0 {
		return ref[lastSlash+1:]
	}
	return ref
}

// ExtractSchemaNameFromProxy extracts a schema name from a proxy
func ExtractSchemaNameFromProxy(proxy *v3.SchemaProxy) string {
	if proxy == nil {
		return ""
	}

	if proxy.Value != nil && proxy.Value.IsReference() {
		return ExtractSchemaNameFromReference(proxy.Value.GetReference())
	}

	if proxy.Schema != nil && proxy.Schema.Value != nil && proxy.Schema.Value.Title != "" {
		return proxy.Schema.Value.Title
	}

	return "Schema"
}

// GenerateResponseSchemaName generates a semantic name for a response schema
// based on operationId and status code (e.g., "GetBookings200Response")
func GenerateResponseSchemaName(operation *v3.Operation, statusCode string) string {
	if operation == nil || operation.Value == nil {
		return fmt.Sprintf("Response%s", statusCode)
	}

	baseName := ""
	if operation.Value.OperationId != "" {
		baseName = toPascalCase(operation.Value.OperationId)
	} else {
		baseName = generateNameFromContext(operation)
	}

	return fmt.Sprintf("%s%sResponse", baseName, statusCode)
}

// GenerateRequestBodySchemaName generates a semantic name for a request body schema
// based on operationId (e.g., "CreateBookingRequest")
func GenerateRequestBodySchemaName(operation *v3.Operation) string {
	if operation == nil || operation.Value == nil {
		return "Request"
	}

	baseName := ""
	if operation.Value.OperationId != "" {
		baseName = toPascalCase(operation.Value.OperationId)
	} else {
		baseName = generateNameFromContext(operation)
	}

	return fmt.Sprintf("%sRequest", baseName)
}

// toPascalCase converts a string to PascalCase
// Examples: "get-bookings" -> "GetBookings", "create_booking" -> "CreateBooking"
func toPascalCase(s string) string {
	if s == "" {
		return ""
	}

	words := delimiterPattern.Split(s, -1)

	var result strings.Builder
	for _, word := range words {
		if word == "" {
			continue
		}
		result.WriteString(strings.ToUpper(word[:1]))
		if len(word) > 1 {
			result.WriteString(word[1:])
		}
	}

	return result.String()
}

// generateNameFromContext generates a name from HTTP method and path
// when operationId is not available
func generateNameFromContext(operation *v3.Operation) string {
	if operation == nil {
		return "Unknown"
	}

	var method string
	var path string

	if operation.Parent != nil {
		if pathItem, ok := operation.Parent.(*v3.PathItem); ok {
			path = pathItem.Key
			switch {
			case pathItem.Get == operation:
				method = "Get"
			case pathItem.Post == operation:
				method = "Post"
			case pathItem.Put == operation:
				method = "Put"
			case pathItem.Delete == operation:
				method = "Delete"
			case pathItem.Patch == operation:
				method = "Patch"
			case pathItem.Options == operation:
				method = "Options"
			case pathItem.Head == operation:
				method = "Head"
			case pathItem.Trace == operation:
				method = "Trace"
			}
		}
	}

	// convert path to readable name: /bookings/{id} -> BookingsId
	if path != "" {
		path = strings.TrimPrefix(path, "/")
		path = strings.ReplaceAll(path, "/", "_")
		path = strings.ReplaceAll(path, "{", "")
		path = strings.ReplaceAll(path, "}", "")
		path = toPascalCase(path)
	}

	if method != "" && path != "" {
		return method + path
	} else if method != "" {
		return method
	} else if path != "" {
		return path
	}

	return "Unknown"
}
