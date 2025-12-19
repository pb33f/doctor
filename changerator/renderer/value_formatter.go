// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"encoding/json"
	"encoding/xml"
	"io"
	"strings"

	"go.yaml.in/yaml/v4"
)

// StructuredDataFormat represents the detected format of a value.
type StructuredDataFormat int

const (
	FormatPlainText StructuredDataFormat = iota
	FormatJSON
	FormatYAML
	FormatXML
)

// String returns the string representation of the format for use in markdown code fences.
func (f StructuredDataFormat) String() string {
	switch f {
	case FormatJSON:
		return "json"
	case FormatYAML:
		return "yaml"
	case FormatXML:
		return "xml"
	default:
		return ""
	}
}

// DetectFormat analyzes a value string and determines its structured data format.
// YAML is checked first since JSON syntax is valid YAML (subset relationship).
func DetectFormat(value string) StructuredDataFormat {
	if value == "" {
		return FormatPlainText
	}

	trimmed := strings.TrimSpace(value)

	// check YAML first: multi-line + colon patterns + no JSON object/array delimiters
	// prevents {"key": "value"} from being misdetected as YAML
	if strings.Contains(trimmed, "\n") &&
		(strings.Contains(trimmed, ": ") || strings.Contains(trimmed, ":\n")) &&
		!strings.HasPrefix(trimmed, "{") &&
		!strings.HasPrefix(trimmed, "[") {
		return FormatYAML
	}

	if (strings.HasPrefix(trimmed, "{") && strings.HasSuffix(trimmed, "}")) ||
		(strings.HasPrefix(trimmed, "[") && strings.HasSuffix(trimmed, "]")) {
		return FormatJSON
	}

	if strings.HasPrefix(trimmed, "<") && strings.HasSuffix(trimmed, ">") {
		return FormatXML
	}

	return FormatPlainText
}

// PrettyPrint attempts to format structured data for better readability.
// Returns the formatted string and the detected format.
func PrettyPrint(value string) (formatted string, format StructuredDataFormat) {
	format = DetectFormat(value)

	switch format {
	case FormatJSON:
		if formatted, ok := prettyPrintJSON(value); ok {
			return formatted, FormatJSON
		}
	case FormatYAML:
		if formatted, ok := prettyPrintYAML(value); ok {
			return formatted, FormatYAML
		}
	case FormatXML:
		if formatted, ok := prettyPrintXML(value); ok {
			return formatted, FormatXML
		}
	}

	return value, FormatPlainText
}

// parseJSON parses a JSON string into an interface{} for manipulation.
func parseJSON(jsonStr string) (interface{}, bool) {
	var data interface{}
	if err := json.Unmarshal([]byte(jsonStr), &data); err != nil {
		return nil, false
	}
	return data, true
}

// parseYAML parses a YAML string into an interface{} for manipulation.
func parseYAML(yamlStr string) (interface{}, bool) {
	var data interface{}
	if err := yaml.Unmarshal([]byte(yamlStr), &data); err != nil {
		return nil, false
	}
	return data, true
}

// formatJSON formats data as indented JSON.
func formatJSON(data interface{}) (string, bool) {
	formatted, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return "", false
	}
	return string(formatted), true
}

// formatYAML formats data as YAML.
func formatYAML(data interface{}) (string, bool) {
	formatted, err := yaml.Marshal(data)
	if err != nil {
		return "", false
	}
	return strings.TrimRight(string(formatted), "\n"), true
}

// prettyPrintJSON attempts to parse and format JSON with indentation.
func prettyPrintJSON(value string) (string, bool) {
	data, ok := parseJSON(value)
	if !ok {
		return "", false
	}
	return formatJSON(data)
}

// prettyPrintYAML attempts to parse and format YAML.
func prettyPrintYAML(value string) (string, bool) {
	data, ok := parseYAML(value)
	if !ok {
		return "", false
	}
	return formatYAML(data)
}

// prettyPrintXML validates XML and returns it as-is.
// Go's xml package doesn't support pretty-printing arbitrary XML without
// a concrete struct definition, so we only validate.
func prettyPrintXML(value string) (string, bool) {
	decoder := xml.NewDecoder(strings.NewReader(value))
	for {
		_, err := decoder.Token()
		if err != nil {
			if err == io.EOF {
				break
			}
			return "", false
		}
	}

	return value, true
}

// FormatAsCodeBlock wraps a value in a markdown code fence with the appropriate language.
func FormatAsCodeBlock(value string, format StructuredDataFormat) string {
	lang := format.String()

	var sb strings.Builder
	sb.Grow(len(value) + len(lang) + 10)
	sb.WriteString("```")
	if lang != "" {
		sb.WriteString(lang)
	}
	sb.WriteString("\n")
	sb.WriteString(value)
	sb.WriteString("\n```")
	return sb.String()
}

// IndentCodeBlock adds indentation to each line of a code block (including fences).
// preserves the code block structure while making it part of a list continuation.
func IndentCodeBlock(codeBlock string, indentSpaces int) string {
	if indentSpaces <= 0 {
		return codeBlock
	}

	indent := strings.Repeat(" ", indentSpaces)
	lines := strings.Split(codeBlock, "\n")
	var sb strings.Builder

	for i, line := range lines {
		if i > 0 {
			sb.WriteString("\n")
		}
		sb.WriteString(indent)
		sb.WriteString(line)
	}

	return sb.String()
}

// ShouldFormatAsBlock determines if a value should be rendered as a code block.
// For extensions, we always format structured data as code blocks (no size limits).
func ShouldFormatAsBlock(value string) bool {
	if value == "" {
		return false
	}

	format := DetectFormat(value)
	return format != FormatPlainText
}

// FormatExtensionValue formats an extension value for display.
// If the value is structured data (JSON/YAML/XML), it returns a code block.
func FormatExtensionValue(value string) (formatted string, isCodeBlock bool) {
	if !ShouldFormatAsBlock(value) {
		return value, false
	}

	prettyValue, format := PrettyPrint(value)
	codeBlock := FormatAsCodeBlock(prettyValue, format)

	return codeBlock, true
}

// FormatExtensionValueWithTargetFormat formats an extension value with a target output format.
// If the value is JSON but targetFormat is YAML, it converts JSON → YAML.
// This is used when the source document is YAML but libopenapi serializes values as JSON.
func FormatExtensionValueWithTargetFormat(value string, targetFormat StructuredDataFormat) (formatted string, isCodeBlock bool) {
	// detect format once to avoid redundant work
	valueFormat := DetectFormat(value)

	if valueFormat == FormatPlainText {
		return value, false
	}

	// if value is JSON and target is YAML, convert
	if valueFormat == FormatJSON && targetFormat == FormatYAML {
		if converted, ok := ConvertJSONToYAML(value); ok {
			codeBlock := FormatAsCodeBlock(converted, FormatYAML)
			return codeBlock, true
		}
	}

	// pretty print using the already-detected format (avoid re-detection)
	var prettyValue string
	var ok bool

	switch valueFormat {
	case FormatJSON:
		prettyValue, ok = prettyPrintJSON(value)
	case FormatYAML:
		prettyValue, ok = prettyPrintYAML(value)
	case FormatXML:
		prettyValue, ok = prettyPrintXML(value)
	}

	if !ok {
		prettyValue = value
	}

	codeBlock := FormatAsCodeBlock(prettyValue, valueFormat)
	return codeBlock, true
}

// ConvertJSONToYAML converts a JSON string to YAML format.
func ConvertJSONToYAML(jsonStr string) (string, bool) {
	data, ok := parseJSON(jsonStr)
	if !ok {
		return "", false
	}
	return formatYAML(data)
}

// DetectDocumentFormat detects whether a document is YAML or JSON based on its content.
func DetectDocumentFormat(content []byte) StructuredDataFormat {
	if len(content) == 0 {
		return FormatPlainText
	}

	trimmed := strings.TrimSpace(string(content))
	if len(trimmed) == 0 {
		return FormatPlainText
	}

	firstChar := trimmed[0]
	if firstChar == '{' || firstChar == '[' {
		return FormatJSON
	}

	return FormatYAML
}
