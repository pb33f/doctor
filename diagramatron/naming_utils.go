// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"reflect"
	"regexp"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// Compile regex patterns once at package level for performance
var (
	schemasPattern     = regexp.MustCompile(`\.schemas\['([^']+)'\]`)
	propertiesPattern  = regexp.MustCompile(`\.properties\['([^']+)'\]`)
	compositionPattern = regexp.MustCompile(`\.(allOf|anyOf|oneOf)\[(\d+)\]`)
)

// getClassID returns a meaningful identifier for mermaid class generation
func (mt *MermaidTardis) getClassID(obj any) string {
	if obj == nil {
		return "Unknown"
	}

	// parameters use their actual name (e.g., 'page', 'limit') instead of their json path
	// (e.g., 'components_parameters_page') to ensure readable mermaid class IDs
	if param, ok := obj.(*v3.Parameter); ok {
		if param.Value != nil && param.Value.Name != "" {
			return param.Value.Name
		}
	}

	// headers use their key name (e.g., 'X-Rate-Limit', 'X-Correlation-ID') instead of their json path
	// (e.g., 'components_headers_X_Rate_Limit') to ensure readable mermaid class IDs
	if header, ok := obj.(*v3.Header); ok {
		if header.Key != "" {
			return header.Key
		}
	}

	// responses use parent operation/path context + status code for better readability
	// e.g., 'GetUsers_200' instead of 'paths__users_get_responses_200'
	if response, ok := obj.(*v3.Response); ok {
		if response.Key != "" {
			parentName := mt.getParentContextName(response.Parent)
			if parentName != "" && parentName != "Unknown" {
				return fmt.Sprintf("%s_%s", parentName, response.Key)
			}
			return response.Key
		}
	}

	// request bodies use parent operation/path context for better readability
	// e.g., 'CreateUser_RequestBody' instead of 'paths__users_post_requestBody'
	if reqBody, ok := obj.(*v3.RequestBody); ok {
		parentName := mt.getParentContextName(reqBody.Parent)
		if parentName != "" && parentName != "Unknown" {
			return fmt.Sprintf("%s_RequestBody", parentName)
		}
		if reqBody.Key != "" {
			return reqBody.Key
		}
	}

	// examples use parent context + example name for better readability
	// e.g., 'User_ValidExample' instead of full path
	if example, ok := obj.(*v3.Example); ok {
		if example.Key != "" {
			parentName := mt.getParentContextName(example.Parent)
			if parentName != "" && parentName != "Unknown" {
				return fmt.Sprintf("%s_%s", parentName, example.Key)
			}
			return example.Key
		}
	}

	// links use parent response context + link name for better readability
	// e.g., 'Response200_NextPage' instead of full path
	if link, ok := obj.(*v3.Link); ok {
		if link.Key != "" {
			parentName := mt.getParentContextName(link.Parent)
			if parentName != "" && parentName != "Unknown" {
				return fmt.Sprintf("%s_%s", parentName, link.Key)
			}
			return link.Key
		}
	}

	// callbacks use parent operation context + callback name for better readability
	// e.g., 'CreateUser_OnSuccess' instead of full path
	if callback, ok := obj.(*v3.Callback); ok {
		if callback.Key != "" {
			parentName := mt.getParentContextName(callback.Parent)
			if parentName != "" && parentName != "Unknown" {
				return fmt.Sprintf("%s_%s", parentName, callback.Key)
			}
			return callback.Key
		}
	}

	// media types use parent name + media type key for better readability
	// e.g., 'Unauthorized_application_problem_json' instead of full path
	if mediaType, ok := obj.(*v3.MediaType); ok {
		// try to get parent name for context
		var parentName string
		if mediaType.Parent != nil {
			// check if parent is a Response
			if resp, ok := mediaType.Parent.(*v3.Response); ok && resp.Key != "" {
				parentName = resp.Key
			} else if req, ok := mediaType.Parent.(*v3.RequestBody); ok && req.Key != "" {
				parentName = req.Key
			} else {
				// try to get parent's class ID as fallback
				parentName = mt.getClassID(mediaType.Parent)
			}
		}

		// use media type key if available
		if mediaType.Key != "" {
			// sanitize the media type key (e.g., "application/problem+json" -> "application_problem_json")
			sanitizedKey := strings.ReplaceAll(mediaType.Key, "/", "_")
			sanitizedKey = strings.ReplaceAll(sanitizedKey, "+", "_")
			sanitizedKey = strings.ReplaceAll(sanitizedKey, "-", "_")

			if parentName != "" && parentName != "Unknown" {
				return fmt.Sprintf("%s_%s", parentName, sanitizedKey)
			}
			return sanitizedKey
		}
	}

	// For schemas, try semantic naming first (for response/request schemas)
	if schema, ok := obj.(*v3.Schema); ok {
		// try semantic naming for response/request body schemas
		if semanticName := mt.generateSemanticSchemaName(schema); semanticName != "" {
			return semanticName
		}
		// fall back to schema name if available
		if schema.Name != "" {
			return schema.Name
		}
	}

	// for schema proxies, check if the underlying schema has a name or title
	if proxy, ok := obj.(*v3.SchemaProxy); ok {
		// first check for external references
		if proxy.Value != nil && proxy.Value.IsReference() {
			refPath := proxy.Value.GetReference()
			if refPath != "" && mt.externalRefHandler.IsExternal(refPath) {
				// for external refs, use the reference path itself as the ID
				return refPath
			}
		}
		// check for title first (important for inline composition members)
		if proxy.Schema != nil && proxy.Schema.Value != nil && proxy.Schema.Value.Title != "" {
			return sanitizeID(proxy.Schema.Value.Title)
		}
		// check if the proxy's schema has a name
		if proxy.Schema != nil && proxy.Schema.Name != "" {
			return proxy.Schema.Name
		}
	}

	// try to get json path from foundational and use smart naming
	if f, ok := obj.(v3.Foundational); ok {
		path := f.GenerateJSONPath()
		if path != "" {
			// extract meaningful names from json path patterns to avoid verbose IDs
			// patterns: $.components.schemas['Name'].properties['field'] → Name_field
			//          $.components.schemas['Name'] → Name

			// check if this is a composition member (allOf/anyOf/oneOf)
			// these need unique IDs - use title if available, otherwise index-based ID
			if compositionMatch := compositionPattern.FindStringSubmatch(path); len(compositionMatch) > 0 {
				// try to get title from the schema if it's a SchemaProxy
				if proxy, ok := obj.(*v3.SchemaProxy); ok {
					if proxy.Schema != nil && proxy.Schema.Value != nil && proxy.Schema.Value.Title != "" {
						return sanitizeID(proxy.Schema.Value.Title)
					}
				}
				// fall back to indexed naming to avoid collisions
				return mt.generateCompositionMemberID(path, compositionMatch)
			}

			// check if this is a property schema
			// format: $.components.schemas['SchemaName'].properties['propName']
			if strings.Contains(path, ".properties[") {
				// extract parent schema name and property name using pre-compiled patterns
				schemaMatches := schemasPattern.FindStringSubmatch(path)
				propMatches := propertiesPattern.FindStringSubmatch(path)

				if len(schemaMatches) > 1 && len(propMatches) > 1 {
					// found both schema and property names
					return schemaMatches[1] + "_" + propMatches[1]
				}
			}

			// check if this is a top-level schema in components
			// format: $.components.schemas['SchemaName']
			if strings.Contains(path, ".schemas[") && !strings.Contains(path, ".properties[") {
				// extract just the schema name using pre-compiled pattern
				matches := schemasPattern.FindStringSubmatch(path)
				if len(matches) > 1 {
					return matches[1]
				}
			}

			// default to simplified path for other cases
			return mt.simplifyPath(path)
		}
	}

	// fallback to type name
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	return t.Name()
}

// getParentContextName extracts a meaningful name from parent objects for context
func (mt *MermaidTardis) getParentContextName(parent any) string {
	if parent == nil {
		return ""
	}

	// check for Operation parent (common for RequestBody, Response)
	if op, ok := parent.(*v3.Operation); ok {
		if op.Value != nil && op.Value.OperationId != "" {
			return op.Value.OperationId
		}
		// try to build from method and path
		if op.Key != "" {
			return op.Key
		}
	}

	// check for Responses parent (container for Response objects)
	if responses, ok := parent.(*v3.Responses); ok && responses.Parent != nil {
		// get the operation parent of the Responses container
		return mt.getParentContextName(responses.Parent)
	}

	// check for Response parent (for MediaType, Example, Link)
	if resp, ok := parent.(*v3.Response); ok && resp.Key != "" {
		// if response has an operation parent, combine them
		if resp.Parent != nil {
			// try to get parent context (could be Operation or Responses)
			parentContext := mt.getParentContextName(resp.Parent)
			if parentContext != "" && parentContext != "Unknown" {
				return fmt.Sprintf("%s_%s", parentContext, resp.Key)
			}
		}
		return resp.Key
	}

	// check for RequestBody parent
	if rb, ok := parent.(*v3.RequestBody); ok {
		if rb.Parent != nil {
			return mt.getParentContextName(rb.Parent)
		}
		if rb.Key != "" {
			return rb.Key
		}
	}

	// check for Schema parent (for Example)
	if schema, ok := parent.(*v3.Schema); ok && schema.Name != "" {
		return schema.Name
	}

	// check for Parameter parent (for Example)
	if param, ok := parent.(*v3.Parameter); ok {
		if param.Value != nil && param.Value.Name != "" {
			return param.Value.Name
		}
	}

	// check for PathItem parent
	if pi, ok := parent.(*v3.PathItem); ok && pi.Key != "" {
		// simplify path to something readable
		path := strings.ReplaceAll(pi.Key, "/", "_")
		path = strings.ReplaceAll(path, "{", "")
		path = strings.ReplaceAll(path, "}", "")
		path = strings.TrimPrefix(path, "_")
		return path
	}

	// check for MediaType parent (for Example, Encoding)
	if mt, ok := parent.(*v3.MediaType); ok && mt.Key != "" {
		return strings.ReplaceAll(mt.Key, "/", "_")
	}

	// fallback to getting the class ID of the parent
	return mt.getClassID(parent)
}

// extractName extracts a meaningful name from an object's JSON path
func (mt *MermaidTardis) extractName(obj any) string {
	// try to get a meaningful name from the object
	if f, ok := obj.(v3.Foundational); ok {
		path := f.GenerateJSONPath()
		parts := strings.Split(path, ".")
		if len(parts) > 0 {
			lastPart := parts[len(parts)-1]
			// clean up array indices and quotes
			lastPart = strings.ReplaceAll(lastPart, "[", "_")
			lastPart = strings.ReplaceAll(lastPart, "]", "")
			lastPart = strings.ReplaceAll(lastPart, "'", "")
			if lastPart != "" && lastPart != "$" {
				return lastPart
			}
		}
	}

	// fallback to type name
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	return t.Name()
}

// extractSchemaName extracts the best name for a schema
func (mt *MermaidTardis) extractSchemaName(drSchema any, schema *base.Schema) string {
	// try to get title first
	if schema != nil && schema.Title != "" {
		return schema.Title
	}

	// check if this is a response or request body schema - use semantic naming
	if s, ok := drSchema.(*v3.Schema); ok {
		// traverse parent hierarchy to find operation and response/request context
		semanticName := mt.generateSemanticSchemaName(s)
		if semanticName != "" {
			return semanticName
		}
	}

	// fallback to extracted name
	extractedName := mt.extractName(drSchema)

	// if the extracted name is just "schema" (generic), try to use the JSON path-based name
	if extractedName == "schema" || extractedName == "Schema" {
		// use the class ID as a fallback for inline schemas
		if s, ok := drSchema.(*v3.Schema); ok {
			classID := mt.getClassID(s)
			// if the class ID is more descriptive than just "schema", use it
			if classID != extractedName && classID != "schema" && classID != "Schema" {
				return classID
			}
		}
	}

	return extractedName
}

// generateSemanticSchemaName generates a semantic name for response/request schemas
// ONLY for top-level response/request schemas, not for nested property schemas
func (mt *MermaidTardis) generateSemanticSchemaName(schema *v3.Schema) string {
	if schema == nil {
		return ""
	}

	// Start from schema's parent (which is usually a SchemaProxy)
	current := schema.Parent

	// if parent is SchemaProxy, check if it's a DIRECT child of MediaType
	// (not a nested property schema)
	if proxy, ok := current.(*v3.SchemaProxy); ok {
		// check if this proxy's parent is MediaType (top-level schema)
		// or if it's a Schema (nested property schema)
		if _, isNestedInSchema := proxy.Parent.(*v3.Schema); isNestedInSchema {
			// this is a nested property schema (e.g., Links-Self as a property)
			// don't use semantic naming for these
			return ""
		}

		// jump to proxy's parent to get to MediaType level
		current = proxy.Parent
	}

	var response *v3.Response
	var requestBody *v3.RequestBody
	var operation *v3.Operation

	// walk up the parent chain from MediaType level
	for current != nil && operation == nil {
		switch p := current.(type) {
		case *v3.MediaType:
			current = p.Parent
		case *v3.Response:
			response = p
			current = p.Parent
		case *v3.RequestBody:
			requestBody = p
			current = p.Parent
		case *v3.Responses:
			current = p.Parent
		case *v3.Operation:
			operation = p
			current = nil // found it, stop
		default:
			// check if this parent has a Parent method
			if f, ok := current.(v3.Foundational); ok {
				current = f.GetParent()
			} else {
				break
			}
		}
	}

	// generate semantic name based on context
	if operation != nil {
		if response != nil && response.Key != "" {
			// this is a response schema
			return GenerateResponseSchemaName(operation, response.Key)
		} else if requestBody != nil {
			// this is a request body schema
			return GenerateRequestBodySchemaName(operation)
		}
	}

	return ""
}

// generateCompositionMemberID generates a unique ID for inline composition members (allOf/anyOf/oneOf).
// This prevents ID collisions when multiple inline schemas exist under the same parent.
func (mt *MermaidTardis) generateCompositionMemberID(path string, match []string) string {
	// match[0] = full match (e.g., ".anyOf[0]")
	// match[1] = keyword (e.g., "anyOf", "oneOf", "allOf")
	// match[2] = index (e.g., "0", "1")
	keyword := match[1]
	index := match[2]

	// extract parent context from the path
	schemaMatches := schemasPattern.FindStringSubmatch(path)
	propMatches := propertiesPattern.FindStringSubmatch(path)

	var baseName string
	if len(schemaMatches) > 1 && len(propMatches) > 1 {
		// property-level composition: BookingPayment_source_anyOf_0
		baseName = schemaMatches[1] + "_" + propMatches[1]
	} else if len(schemaMatches) > 1 {
		// schema-level composition: ExtendedPayment_allOf_0
		baseName = schemaMatches[1]
	} else {
		// fallback for edge cases
		baseName = "Inline"
	}

	return fmt.Sprintf("%s_%s_%s", baseName, keyword, index)
}

// simplifyPath converts a JSON path to a valid mermaid class ID
func (mt *MermaidTardis) simplifyPath(path string) string {
	// convert json path to valid mermaid class ID
	path = strings.ReplaceAll(path, "$.", "")
	path = strings.ReplaceAll(path, ".", "_")
	path = strings.ReplaceAll(path, "[", "_")
	path = strings.ReplaceAll(path, "]", "")
	path = strings.ReplaceAll(path, "'", "")
	path = strings.ReplaceAll(path, "/", "_")
	path = strings.ReplaceAll(path, "{", "_")
	path = strings.ReplaceAll(path, "}", "_")
	path = strings.ReplaceAll(path, "-", "_")

	// ensure it starts with a letter
	if len(path) > 0 && (path[0] < 'A' || (path[0] > 'Z' && path[0] < 'a') || path[0] > 'z') {
		path = "C_" + path
	}

	return path
}

// extractPropertyType extracts the type of a property from its schema
func (mt *MermaidTardis) extractPropertyType(schema *base.SchemaProxy) string {
	if schema == nil || schema.Schema() == nil {
		return "any"
	}

	s := schema.Schema()
	if len(s.Type) > 0 {
		t := s.Type[0]
		if t == "array" && s.Items != nil {
			itemType := "any"
			if dv := s.Items; dv != nil && dv.IsA() {
				if items := dv.A; items != nil && items.Schema() != nil {
					itemType = mt.extractPropertyType(items)
				}
			}
			return t + "<" + itemType + ">"
		}
		if t == "object" && s.AdditionalProperties != nil {
			valueType := "any"
			if dv := s.AdditionalProperties; dv != nil && dv.IsA() {
				if addProps := dv.A; addProps != nil {
					valueType = mt.extractPropertyType(addProps)
				}
			}
			return "map<string, " + valueType + ">"
		}
		return t
	}

	// check for reference
	if schema.IsReference() {
		ref := schema.GetReference()
		parts := strings.Split(ref, "/")
		if len(parts) > 0 {
			return parts[len(parts)-1]
		}
	}

	return "any"
}

// addCircularReference adds a relationship to indicate a circular reference
func (mt *MermaidTardis) addCircularReference(obj v3.Foundational) {
	// add a dashed relationship to show circular reference
	parentPath := ""
	if obj.GetParent() != nil {
		parentPath = mt.getClassID(obj.GetParent())
	}

	if parentPath != "" {
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: parentPath,
			Target: mt.getClassID(obj),
			Type:   RelationDependency,
			Label:  "circular",
		})
	}
}
