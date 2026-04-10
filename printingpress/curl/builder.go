// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package curl

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"sort"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

var serverVariablePattern = regexp.MustCompile(`\{([^{}]+)\}`)

type queryPair struct {
	name  string
	value string
}

// BuildCurlCommands builds cURL command variants for an operation.
func BuildCurlCommands(
	op *ppmodel.OperationPage,
	globalServers []*ppmodel.ServerInfo,
	globalSecurityGroups []*ppmodel.SecurityRequirementGroup,
) []*ppmodel.CurlVariant {
	if op == nil {
		return nil
	}

	servers := op.Servers
	if len(servers) == 0 {
		servers = globalServers
	}
	if len(servers) == 0 {
		servers = []*ppmodel.ServerInfo{{URL: "https://api.example.com"}}
	}

	securityGroups := globalSecurityGroups
	if op.HasSecurityOverride {
		securityGroups = op.SecurityGroups
	}
	if len(securityGroups) == 0 {
		securityGroups = []*ppmodel.SecurityRequirementGroup{{}}
	}

	var variants []*ppmodel.CurlVariant
	for _, server := range servers {
		resolvedServerURL := ResolveServerURL(server)
		serverLabel := curlServerLabel(server, resolvedServerURL)

		for _, group := range securityGroups {
			securityLabel := curlSecurityLabel(group)
			command := buildCurlCommand(op, resolvedServerURL, group)
			if command == "" {
				continue
			}

			label := strings.TrimSpace(serverLabel)
			if securityLabel != "" {
				if label != "" {
					label += " · "
				}
				label += securityLabel
			}

			variant := &ppmodel.CurlVariant{
				Label:         label,
				ServerURL:     resolvedServerURL,
				SecurityLabel: securityLabel,
				Command:       command,
			}
			if server != nil {
				variant.ServerDescription = server.Description
			}
			variants = append(variants, variant)
		}
	}

	return variants
}

func ResolveServerURL(server *ppmodel.ServerInfo) string {
	if server == nil || server.URL == "" {
		return "https://api.example.com"
	}

	resolved := server.URL
	if len(server.Variables) == 0 {
		return resolved
	}

	return serverVariablePattern.ReplaceAllStringFunc(resolved, func(match string) string {
		name := strings.TrimSuffix(strings.TrimPrefix(match, "{"), "}")
		for _, variable := range server.Variables {
			if variable == nil || variable.Name != name {
				continue
			}
			switch {
			case variable.Default != "":
				return variable.Default
			case len(variable.Enum) > 0 && variable.Enum[0] != "":
				return variable.Enum[0]
			default:
				return strings.ToUpper(strings.ReplaceAll(name, "-", "_"))
			}
		}
		return strings.ToUpper(strings.ReplaceAll(name, "-", "_"))
	})
}

func curlServerLabel(server *ppmodel.ServerInfo, resolvedURL string) string {
	if server != nil && server.Description != "" {
		return server.Description
	}
	if parsed, err := url.Parse(resolvedURL); err == nil && parsed.Host != "" {
		return parsed.Host
	}
	return resolvedURL
}

func curlSecurityLabel(group *ppmodel.SecurityRequirementGroup) string {
	if group == nil || len(group.Requirements) == 0 {
		return "No Auth"
	}

	labels := make([]string, 0, len(group.Requirements))
	seen := make(map[string]bool)
	addLabel := func(label string) {
		label = strings.TrimSpace(label)
		if label == "" || seen[label] {
			return
		}
		seen[label] = true
		labels = append(labels, label)
	}
	for _, requirement := range group.Requirements {
		if requirement == nil {
			continue
		}
		switch requirement.SchemeType {
		case "apiKey":
			switch {
			case requirement.Name != "":
				addLabel(requirement.Name)
			case requirement.ParameterName != "":
				addLabel(requirement.ParameterName)
			default:
				addLabel("Api Key")
			}
		case "http":
			switch strings.ToLower(requirement.Scheme) {
			case "basic":
				addLabel("Basic Auth")
			case "bearer":
				addLabel("Bearer Auth")
			default:
				addLabel("HTTP Auth")
			}
		case "oauth2":
			addLabel("OAuth2")
		case "openIdConnect":
			addLabel("OpenID Connect")
		default:
			addLabel(requirement.Name)
		}
	}
	if len(labels) == 0 {
		return "No Auth"
	}
	return strings.Join(labels, " + ")
}

func buildCurlCommand(op *ppmodel.OperationPage, serverURL string, group *ppmodel.SecurityRequirementGroup) string {
	method := strings.ToUpper(strings.TrimSpace(op.Method))
	if method == "" {
		method = "GET"
	}

	path := op.Path
	var queryPairs []queryPair
	var parameterHeaders []string
	var cookies []string

	for _, parameter := range op.Parameters {
		if parameter == nil {
			continue
		}
		value := curlParameterValue(parameter)
		switch parameter.In {
		case "path":
			path = strings.ReplaceAll(path, "{"+parameter.Name+"}", url.PathEscape(value))
		case "query":
			queryPairs = append(queryPairs, queryPair{name: parameter.Name, value: value})
		case "header":
			parameterHeaders = append(parameterHeaders, fmt.Sprintf("-H %s", shellQuote(parameter.Name+": "+value)))
		case "cookie":
			cookies = append(cookies, parameter.Name+"="+value)
		}
	}

	fullURL := joinServerAndPath(serverURL, path)

	var authHeaders []string
	if group != nil {
		for _, requirement := range group.Requirements {
			if requirement == nil {
				continue
			}
			switch requirement.SchemeType {
			case "apiKey":
				name := requirement.ParameterName
				if name == "" {
					name = requirement.Name
				}
				if name == "" {
					continue
				}
				switch requirement.In {
				case "header":
					authHeaders = append(authHeaders, fmt.Sprintf("-H %s", shellQuote(name+": YOUR_API_KEY")))
				case "query":
					queryPairs = append(queryPairs, queryPair{name: name, value: "YOUR_API_KEY"})
				case "cookie":
					cookies = append(cookies, name+"=YOUR_API_KEY")
				}
			case "http":
				switch strings.ToLower(requirement.Scheme) {
				case "bearer":
					authHeaders = append(authHeaders, fmt.Sprintf("-H %s", shellQuote("Authorization: Bearer YOUR_TOKEN")))
				case "basic":
					authHeaders = append(authHeaders, fmt.Sprintf("-u %s", shellQuote("USERNAME:PASSWORD")))
				}
			case "oauth2":
				authHeaders = append(authHeaders, fmt.Sprintf("-H %s", shellQuote("Authorization: Bearer YOUR_ACCESS_TOKEN")))
			case "openIdConnect":
				authHeaders = append(authHeaders, fmt.Sprintf("-H %s", shellQuote("Authorization: Bearer YOUR_TOKEN")))
			}
		}
	}

	fullURL = appendQueryPairs(fullURL, queryPairs)

	var bodyFlags []string
	bodyContentType := ""
	if method != "GET" && method != "HEAD" {
		if mediaType := selectRequestMediaType(op.RequestBody); mediaType != nil {
			bodyContentType = mediaType.MediaType
			bodyFlags = buildRequestBodyFlags(op, mediaType)
			if len(bodyFlags) == 0 {
				bodyContentType = ""
			}
		}
	}

	var lines []string
	firstLine := "curl"
	if method != "GET" {
		firstLine += " -X " + method
	}
	lines = append(lines, firstLine)
	lines = append(lines, shellQuote(fullURL))
	lines = append(lines, authHeaders...)
	lines = append(lines, parameterHeaders...)
	if bodyContentType != "" {
		lines = append(lines, fmt.Sprintf("-H %s", shellQuote("Content-Type: "+bodyContentType)))
	}
	if accept := selectAcceptHeader(op.Responses); accept != "" {
		lines = append(lines, fmt.Sprintf("-H %s", shellQuote("Accept: "+accept)))
	}
	if len(cookies) > 0 {
		lines = append(lines, fmt.Sprintf("-b %s", shellQuote(strings.Join(cookies, "; "))))
	}
	lines = append(lines, bodyFlags...)

	return joinCurlLines(lines)
}

func curlParameterValue(parameter *ppmodel.ParameterInfo) string {
	if parameter == nil {
		return "value"
	}
	if value, ok := firstScalarExample(parameter.Examples); ok {
		return value
	}
	if value, ok := scalarFromSchemaField(parameter.SchemaJSON, "example"); ok {
		return value
	}
	if value, ok := scalarFromSchemaField(parameter.SchemaJSON, "default"); ok {
		return value
	}
	if value, ok := firstEnumValue(parameter.SchemaJSON); ok {
		return value
	}
	if value := placeholderForSchemaType(parameter.SchemaJSON); value != "" {
		return value
	}
	if parameter.Name != "" {
		return parameter.Name
	}
	return "value"
}

func firstScalarExample(examples map[string]string) (string, bool) {
	if len(examples) == 0 {
		return "", false
	}

	keys := make([]string, 0, len(examples))
	for key := range examples {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	for _, key := range keys {
		if value, ok := scalarFromJSONString(examples[key]); ok {
			return value, true
		}
	}
	return "", false
}

func scalarFromSchemaField(schemaJSON, field string) (string, bool) {
	var schema map[string]any
	if schemaJSON == "" || json.Unmarshal([]byte(schemaJSON), &schema) != nil {
		return "", false
	}
	value, ok := schema[field]
	if !ok {
		return "", false
	}
	return stringifyScalar(value)
}

func firstEnumValue(schemaJSON string) (string, bool) {
	var schema map[string]any
	if schemaJSON == "" || json.Unmarshal([]byte(schemaJSON), &schema) != nil {
		return "", false
	}
	rawEnum, ok := schema["enum"].([]any)
	if !ok || len(rawEnum) == 0 {
		return "", false
	}
	return stringifyScalar(rawEnum[0])
}

func placeholderForSchemaType(schemaJSON string) string {
	var schema map[string]any
	if schemaJSON == "" || json.Unmarshal([]byte(schemaJSON), &schema) != nil {
		return ""
	}

	switch rawType := schema["type"].(type) {
	case string:
		return placeholderForType(rawType)
	case []any:
		for _, item := range rawType {
			typeName, ok := item.(string)
			if !ok || typeName == "null" {
				continue
			}
			if placeholder := placeholderForType(typeName); placeholder != "" {
				return placeholder
			}
		}
	}
	return ""
}

func placeholderForType(typeName string) string {
	switch typeName {
	case "string":
		return "string"
	case "integer":
		return "0"
	case "number":
		return "0.0"
	case "boolean":
		return "true"
	default:
		return ""
	}
}

func scalarFromJSONString(raw string) (string, bool) {
	if raw == "" {
		return "", false
	}
	var value any
	if json.Unmarshal([]byte(raw), &value) != nil {
		return "", false
	}
	return stringifyScalar(value)
}

func stringifyScalar(value any) (string, bool) {
	switch v := value.(type) {
	case string:
		return v, true
	case float64:
		return strconv.FormatFloat(v, 'f', -1, 64), true
	case bool:
		return strconv.FormatBool(v), true
	case nil:
		return "", false
	default:
		return "", false
	}
}

func joinServerAndPath(serverURL, path string) string {
	if serverURL == "" {
		serverURL = "https://api.example.com"
	}
	if path == "" {
		return serverURL
	}
	switch {
	case strings.HasSuffix(serverURL, "/") && strings.HasPrefix(path, "/"):
		return strings.TrimSuffix(serverURL, "/") + path
	case !strings.HasSuffix(serverURL, "/") && !strings.HasPrefix(path, "/"):
		return serverURL + "/" + path
	default:
		return serverURL + path
	}
}

func appendQueryPairs(rawURL string, pairs []queryPair) string {
	if len(pairs) == 0 {
		return rawURL
	}

	encoded := make([]string, 0, len(pairs))
	for _, pair := range pairs {
		encoded = append(encoded, url.QueryEscape(pair.name)+"="+url.QueryEscape(pair.value))
	}
	if len(encoded) == 0 {
		return rawURL
	}

	parsed, err := url.Parse(rawURL)
	if err != nil {
		separator := "?"
		if strings.Contains(rawURL, "?") {
			separator = "&"
		}
		return rawURL + separator + strings.Join(encoded, "&")
	}

	if parsed.RawQuery != "" {
		parsed.RawQuery += "&" + strings.Join(encoded, "&")
	} else {
		parsed.RawQuery = strings.Join(encoded, "&")
	}
	return parsed.String()
}

func selectRequestMediaType(body *ppmodel.RequestBodyInfo) *ppmodel.MediaTypeInfo {
	if body == nil || len(body.Content) == 0 {
		return nil
	}

	preferred := []string{
		"application/json-patch+json",
		"application/json",
		"application/xml",
		"multipart/form-data",
		"application/x-www-form-urlencoded",
		"application/octet-stream",
	}
	for _, mediaTypeName := range preferred {
		for _, mediaType := range body.Content {
			if mediaType != nil && strings.EqualFold(mediaType.MediaType, mediaTypeName) {
				return mediaType
			}
		}
	}

	for _, mediaType := range body.Content {
		if mediaType != nil {
			return mediaType
		}
	}
	return nil
}

func buildRequestBodyFlags(op *ppmodel.OperationPage, mediaType *ppmodel.MediaTypeInfo) []string {
	if mediaType == nil {
		return nil
	}

	switch strings.ToLower(mediaType.MediaType) {
	case "application/json-patch+json":
		body := selectJSONBodyPayload(op, mediaType)
		if body == "" {
			return nil
		}
		return []string{fmt.Sprintf("-d %s", shellQuote(body))}
	case "application/json":
		body := selectJSONBodyPayload(op, mediaType)
		if body == "" {
			return nil
		}
		return []string{fmt.Sprintf("-d %s", shellQuote(body))}
	case "application/xml":
		body := strings.TrimSpace(mediaType.MockXML)
		if body == "" {
			return nil
		}
		return []string{fmt.Sprintf("--data-raw %s", shellQuote(body))}
	case "multipart/form-data":
		values := flattenObjectMock(mediaType.MockJSON)
		if len(values) == 0 {
			return nil
		}
		flags := make([]string, 0, len(values))
		keys := make([]string, 0, len(values))
		for key := range values {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			flags = append(flags, fmt.Sprintf("-F %s", shellQuote(key+"="+values[key])))
		}
		return flags
	case "application/x-www-form-urlencoded":
		values := flattenObjectMock(mediaType.MockJSON)
		if len(values) == 0 {
			return nil
		}
		flags := make([]string, 0, len(values))
		keys := make([]string, 0, len(values))
		for key := range values {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			flags = append(flags, fmt.Sprintf("--data-urlencode %s", shellQuote(key+"="+values[key])))
		}
		return flags
	case "application/octet-stream":
		return []string{"--data-binary @file.bin"}
	default:
		return nil
	}
}

func selectJSONBodyPayload(op *ppmodel.OperationPage, mediaType *ppmodel.MediaTypeInfo) string {
	if mediaType == nil {
		return ""
	}
	if strings.EqualFold(mediaType.MediaType, "application/json-patch+json") {
		if body := deriveJSONPatchBodyPayload(op, mediaType); body != "" {
			return body
		}
	}
	if body := compactFirstJSONExample(mediaType.Examples); body != "" {
		return body
	}
	return compactJSON(mediaType.MockJSON)
}

func compactFirstJSONExample(examples map[string]string) string {
	if len(examples) == 0 {
		return ""
	}
	keys := make([]string, 0, len(examples))
	for key := range examples {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		if body := compactJSON(examples[key]); body != "" {
			return body
		}
	}
	return ""
}

func deriveJSONPatchBodyPayload(op *ppmodel.OperationPage, mediaType *ppmodel.MediaTypeInfo) string {
	paths := deriveJSONPatchPaths(op, mediaType)
	if len(paths) == 0 {
		return ""
	}

	values := deriveJSONPatchValues(op)
	limit := len(paths)
	if limit > 2 {
		limit = 2
	}

	ops := make([]map[string]any, 0, limit)
	for i := 0; i < limit; i++ {
		path := paths[i]
		prop := strings.TrimPrefix(path, "/")
		value, ok := values[prop]
		if !ok {
			value = "value"
		}
		ops = append(ops, map[string]any{
			"op":    "replace",
			"path":  path,
			"value": value,
		})
	}

	payload, err := json.Marshal(ops)
	if err != nil {
		return ""
	}
	return string(payload)
}

func deriveJSONPatchPaths(op *ppmodel.OperationPage, mediaType *ppmodel.MediaTypeInfo) []string {
	seen := make(map[string]bool)
	var paths []string

	addPath := func(path string) {
		path = strings.TrimSpace(path)
		if path == "" || !strings.HasPrefix(path, "/") || seen[path] {
			return
		}
		seen[path] = true
		paths = append(paths, path)
	}

	for _, path := range patchPathsFromJSONArray(mediaType.MockJSON) {
		addPath(path)
	}
	for _, path := range patchPathsFromResponses(op) {
		addPath(path)
	}

	return paths
}

func patchPathsFromJSONArray(raw string) []string {
	if raw == "" {
		return nil
	}
	var payload []map[string]any
	if json.Unmarshal([]byte(raw), &payload) != nil {
		return nil
	}
	var paths []string
	for _, item := range payload {
		path, ok := item["path"].(string)
		if ok && strings.HasPrefix(path, "/") {
			paths = append(paths, path)
		}
	}
	return paths
}

func patchPathsFromResponses(op *ppmodel.OperationPage) []string {
	props := responsePropertySchemas(op)
	if len(props) == 0 {
		return nil
	}
	names := make([]string, 0, len(props))
	for name := range props {
		names = append(names, name)
	}
	sort.Strings(names)

	paths := make([]string, 0, len(names))
	for _, name := range names {
		paths = append(paths, "/"+name)
	}
	return paths
}

func deriveJSONPatchValues(op *ppmodel.OperationPage) map[string]any {
	props := responsePropertySchemas(op)
	if len(props) == 0 {
		return nil
	}
	values := make(map[string]any, len(props))
	for name, prop := range props {
		if value, ok := exampleValueFromSchemaMap(prop); ok {
			values[name] = value
		}
	}
	return values
}

func responsePropertySchemas(op *ppmodel.OperationPage) map[string]map[string]any {
	if op == nil {
		return nil
	}
	for _, resp := range op.Responses {
		if resp == nil || !strings.HasPrefix(resp.StatusCode, "2") {
			continue
		}
		for _, content := range resp.Content {
			if content == nil || content.SchemaJSON == "" {
				continue
			}
			var schema map[string]any
			if json.Unmarshal([]byte(content.SchemaJSON), &schema) != nil {
				continue
			}
			rawProps, ok := schema["properties"].(map[string]any)
			if !ok || len(rawProps) == 0 {
				continue
			}
			props := make(map[string]map[string]any, len(rawProps))
			for name, raw := range rawProps {
				prop, ok := raw.(map[string]any)
				if !ok {
					continue
				}
				props[name] = prop
			}
			if len(props) > 0 {
				return props
			}
		}
	}
	return nil
}

func exampleValueFromSchemaMap(schema map[string]any) (any, bool) {
	if schema == nil {
		return nil, false
	}
	if value, ok := schema["example"]; ok && value != nil {
		return value, true
	}
	if value, ok := schema["default"]; ok && value != nil {
		return value, true
	}
	switch rawType := schema["type"].(type) {
	case string:
		return placeholderValueForType(rawType)
	case []any:
		for _, item := range rawType {
			typeName, ok := item.(string)
			if !ok || typeName == "null" {
				continue
			}
			return placeholderValueForType(typeName)
		}
	}
	return nil, false
}

func placeholderValueForType(typeName string) (any, bool) {
	switch typeName {
	case "string":
		return "string", true
	case "integer":
		return 0, true
	case "number":
		return 0.0, true
	case "boolean":
		return true, true
	case "array":
		return []any{}, true
	case "object":
		return map[string]any{}, true
	default:
		return nil, false
	}
}

func compactJSON(raw string) string {
	if raw == "" {
		return ""
	}
	var buf bytes.Buffer
	if err := json.Compact(&buf, []byte(raw)); err != nil {
		return strings.TrimSpace(raw)
	}
	return buf.String()
}

func flattenObjectMock(raw string) map[string]string {
	if raw == "" {
		return nil
	}

	var payload any
	if json.Unmarshal([]byte(raw), &payload) != nil {
		return nil
	}
	object, ok := payload.(map[string]any)
	if !ok || len(object) == 0 {
		return nil
	}

	result := make(map[string]string, len(object))
	for key, value := range object {
		switch typed := value.(type) {
		case string:
			result[key] = typed
		case float64:
			result[key] = strconv.FormatFloat(typed, 'f', -1, 64)
		case bool:
			result[key] = strconv.FormatBool(typed)
		default:
			encoded, err := json.Marshal(typed)
			if err != nil {
				continue
			}
			result[key] = string(encoded)
		}
	}
	return result
}

func selectAcceptHeader(responses []*ppmodel.ResponseInfo) string {
	for _, response := range responses {
		if response == nil || !strings.HasPrefix(response.StatusCode, "2") || len(response.Content) == 0 {
			continue
		}
		for _, mediaType := range response.Content {
			if mediaType != nil && mediaType.MediaType != "" {
				return mediaType.MediaType
			}
		}
	}
	return ""
}

func joinCurlLines(lines []string) string {
	if len(lines) == 0 {
		return ""
	}

	var builder strings.Builder
	for i, line := range lines {
		if line == "" {
			continue
		}
		if builder.Len() == 0 {
			builder.WriteString(line)
		} else {
			builder.WriteString(" \\\n  ")
			builder.WriteString(line)
		}
		if i == len(lines)-1 {
			break
		}
	}
	return builder.String()
}

func shellQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "'\\''") + "'"
}
