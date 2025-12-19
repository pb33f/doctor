// Copyright 2025 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDetectFormat_JSON(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  StructuredDataFormat
	}{
		{
			name:  "JSON object",
			value: `{"key": "value"}`,
			want:  FormatJSON,
		},
		{
			name:  "JSON array",
			value: `["item1", "item2"]`,
			want:  FormatJSON,
		},
		{
			name: "JSON multiline",
			value: `{
  "key": "value",
  "nested": {
    "data": true
  }
}`,
			want: FormatJSON,
		},
		{
			name:  "JSON with whitespace",
			value: `  {"key": "value"}  `,
			want:  FormatJSON,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectFormat(tt.value)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectFormat_YAML(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  StructuredDataFormat
	}{
		{
			name: "YAML document",
			value: `key: value
nested:
  data: true`,
			want: FormatYAML,
		},
		{
			name: "YAML with lists",
			value: `items:
  - item1
  - item2`,
			want: FormatYAML,
		},
		{
			name: "YAML with colons",
			value: `name: John Doe
age: 30
email: john@example.com`,
			want: FormatYAML,
		},
		{
			name: "YAML speakeasy-retries example",
			value: `strategy: backoffish
backoff:
  initialInterval: 500
  maxInterval: 60000
  maxElapsedTime: 3600000
  exponent: 1.5
statusCodes:
  - 5XX
retryConnectionErrors: true`,
			want: FormatYAML,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectFormat(tt.value)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectFormat_XML(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  StructuredDataFormat
	}{
		{
			name:  "XML simple",
			value: `<root><key>value</key></root>`,
			want:  FormatXML,
		},
		{
			name: "XML multiline",
			value: `<configuration>
  <setting>value</setting>
</configuration>`,
			want: FormatXML,
		},
		{
			name:  "XML with attributes",
			value: `<root attr="value"><child>data</child></root>`,
			want:  FormatXML,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectFormat(tt.value)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectFormat_PlainText(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  StructuredDataFormat
	}{
		{
			name:  "plain text",
			value: "just some text",
			want:  FormatPlainText,
		},
		{
			name:  "empty string",
			value: "",
			want:  FormatPlainText,
		},
		{
			name:  "single line with colon",
			value: "key: value without newline",
			want:  FormatPlainText,
		},
		{
			name:  "partial JSON",
			value: `{"incomplete": `,
			want:  FormatPlainText,
		},
		{
			name:  "URL",
			value: "https://example.com/api",
			want:  FormatPlainText,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectFormat(tt.value)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestPrettyPrint_JSON(t *testing.T) {
	input := `{"name":"test","nested":{"value":123,"flag":true}}`

	formatted, format := PrettyPrint(input)

	assert.Equal(t, FormatJSON, format)
	// Check for proper indentation and key presence (order is non-deterministic)
	assert.Contains(t, formatted, "\"name\": \"test\"")
	assert.Contains(t, formatted, "\"nested\":")
	assert.Contains(t, formatted, "\"value\": 123")
	assert.Contains(t, formatted, "\"flag\": true")
	// Verify it's multi-line (pretty-printed)
	lines := strings.Split(formatted, "\n")
	assert.Greater(t, len(lines), 3, "Should have multiple lines for pretty-printed JSON")
}

func TestPrettyPrint_JSON_Array(t *testing.T) {
	input := `["item1","item2","item3"]`
	expected := `[
  "item1",
  "item2",
  "item3"
]`

	formatted, format := PrettyPrint(input)

	assert.Equal(t, FormatJSON, format)
	assert.Equal(t, expected, formatted)
}

func TestPrettyPrint_YAML(t *testing.T) {
	input := `key: value
nested:
  data: true
  number: 42`

	formatted, format := PrettyPrint(input)

	assert.Equal(t, FormatYAML, format)
	assert.Contains(t, formatted, "key: value")
	assert.Contains(t, formatted, "nested:")
	assert.Contains(t, formatted, "data: true")
}

func TestPrettyPrint_InvalidJSON(t *testing.T) {
	input := `{"incomplete": `

	formatted, format := PrettyPrint(input)

	// Should fall back to plain text
	assert.Equal(t, FormatPlainText, format)
	assert.Equal(t, input, formatted)
}

func TestPrettyPrint_PlainText(t *testing.T) {
	input := "just plain text"

	formatted, format := PrettyPrint(input)

	assert.Equal(t, FormatPlainText, format)
	assert.Equal(t, input, formatted)
}

func TestFormatAsCodeBlock(t *testing.T) {
	tests := []struct {
		name   string
		value  string
		format StructuredDataFormat
		want   string
	}{
		{
			name:   "JSON code block",
			value:  `{"key": "value"}`,
			format: FormatJSON,
			want:   "```json\n{\"key\": \"value\"}\n```",
		},
		{
			name:   "YAML code block",
			value:  "key: value",
			format: FormatYAML,
			want:   "```yaml\nkey: value\n```",
		},
		{
			name:   "XML code block",
			value:  "<root></root>",
			format: FormatXML,
			want:   "```xml\n<root></root>\n```",
		},
		{
			name:   "plain text code block",
			value:  "plain text",
			format: FormatPlainText,
			want:   "```\nplain text\n```",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := FormatAsCodeBlock(tt.value, tt.format)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestShouldFormatAsBlock(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  bool
	}{
		{
			name:  "JSON object",
			value: `{"key": "value"}`,
			want:  true,
		},
		{
			name:  "YAML content",
			value: "key: value\nnested: true",
			want:  true,
		},
		{
			name:  "XML content",
			value: "<root></root>",
			want:  true,
		},
		{
			name:  "plain text",
			value: "just text",
			want:  false,
		},
		{
			name:  "empty string",
			value: "",
			want:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ShouldFormatAsBlock(tt.value)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestFormatExtensionValue(t *testing.T) {
	tests := []struct {
		name          string
		value         string
		wantCodeBlock bool
		wantContains  []string
	}{
		{
			name:          "JSON extension",
			value:         `{"config": "value"}`,
			wantCodeBlock: true,
			wantContains:  []string{"```json", "config", "value"},
		},
		{
			name:          "YAML extension",
			value:         "key: value\nnested: true",
			wantCodeBlock: true,
			wantContains:  []string{"```yaml", "key:", "value"},
		},
		{
			name:          "XML extension",
			value:         "<config><value>test</value></config>",
			wantCodeBlock: true,
			wantContains:  []string{"```xml", "config", "value"},
		},
		{
			name:          "plain text extension",
			value:         "simple string value",
			wantCodeBlock: false,
			wantContains:  []string{"simple string value"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			formatted, isCodeBlock := FormatExtensionValue(tt.value)

			assert.Equal(t, tt.wantCodeBlock, isCodeBlock)

			for _, substr := range tt.wantContains {
				assert.Contains(t, formatted, substr)
			}
		})
	}
}

func TestFormatExtensionValue_ComplexJSON(t *testing.T) {
	// Test with a complex nested JSON structure
	input := `{"authentication":{"type":"oauth2","flows":{"implicit":{"authorizationUrl":"https://example.com/oauth","scopes":{"read:users":"Read user data","write:users":"Modify user data"}}}}}`

	formatted, isCodeBlock := FormatExtensionValue(input)

	require.True(t, isCodeBlock)
	assert.Contains(t, formatted, "```json")
	assert.Contains(t, formatted, "authentication")
	assert.Contains(t, formatted, "oauth2")
	assert.Contains(t, formatted, "authorizationUrl")

	// Check that it's indented (pretty-printed)
	lines := strings.Split(formatted, "\n")
	assert.Greater(t, len(lines), 5, "Should have multiple lines for complex JSON")
}

func TestFormatExtensionValue_LargeJSON(t *testing.T) {
	// Test that we handle large JSON without limits
	largeJSON := `{
		"data": [
			{"id": 1, "name": "item1"},
			{"id": 2, "name": "item2"},
			{"id": 3, "name": "item3"},
			{"id": 4, "name": "item4"},
			{"id": 5, "name": "item5"}
		],
		"metadata": {
			"total": 5,
			"page": 1,
			"perPage": 10
		}
	}`

	formatted, isCodeBlock := FormatExtensionValue(largeJSON)

	require.True(t, isCodeBlock)
	assert.Contains(t, formatted, "```json")
	assert.Contains(t, formatted, "data")
	assert.Contains(t, formatted, "metadata")

	// Verify it's not truncated
	assert.Contains(t, formatted, "item5")
	assert.Contains(t, formatted, "perPage")
}

func TestStructuredDataFormat_String(t *testing.T) {
	tests := []struct {
		format StructuredDataFormat
		want   string
	}{
		{FormatJSON, "json"},
		{FormatYAML, "yaml"},
		{FormatXML, "xml"},
		{FormatPlainText, ""},
	}

	for _, tt := range tests {
		t.Run(tt.want, func(t *testing.T) {
			got := tt.format.String()
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestPrettyPrint_PreservesValidFormatting(t *testing.T) {
	// Test that already-formatted JSON stays formatted
	input := `{
  "key": "value",
  "nested": {
    "data": true
  }
}`

	formatted, format := PrettyPrint(input)

	assert.Equal(t, FormatJSON, format)
	// Should still be properly formatted
	assert.Contains(t, formatted, "\"key\":")
	assert.Contains(t, formatted, "\"nested\":")
}

func TestConvertJSONToYAML(t *testing.T) {
	tests := []struct {
		name    string
		json    string
		wantOk  bool
		wantKey string
	}{
		{
			name:    "simple object",
			json:    `{"key": "value"}`,
			wantOk:  true,
			wantKey: "key: value",
		},
		{
			name:    "nested object",
			json:    `{"outer": {"inner": "value"}}`,
			wantOk:  true,
			wantKey: "outer:",
		},
		{
			name:    "array",
			json:    `["item1", "item2"]`,
			wantOk:  true,
			wantKey: "- item1",
		},
		{
			name:    "complex nested",
			json:    `{"config":{"retries":3,"timeout":30}}`,
			wantOk:  true,
			wantKey: "config:",
		},
		{
			name:   "invalid JSON",
			json:   `{"invalid": `,
			wantOk: false,
		},
		{
			name:   "empty string",
			json:   "",
			wantOk: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, ok := ConvertJSONToYAML(tt.json)

			assert.Equal(t, tt.wantOk, ok)

			if tt.wantOk {
				assert.Contains(t, result, tt.wantKey)
				// Verify it's valid YAML (no JSON braces)
				assert.NotContains(t, result, "{")
				assert.NotContains(t, result, "}")
			}
		})
	}
}

func TestFormatExtensionValueWithTargetFormat_JSONToYAML(t *testing.T) {
	tests := []struct {
		name         string
		value        string
		targetFormat StructuredDataFormat
		wantFormat   string
		wantContains []string
	}{
		{
			name:         "JSON to YAML conversion",
			value:        `{"strategy":"backoff","retries":3}`,
			targetFormat: FormatYAML,
			wantFormat:   "```yaml",
			wantContains: []string{"strategy: backoff", "retries: 3"},
		},
		{
			name:         "JSON stays JSON when target is JSON",
			value:        `{"key":"value"}`,
			targetFormat: FormatJSON,
			wantFormat:   "```json",
			wantContains: []string{"\"key\":", "\"value\""},
		},
		{
			name:         "YAML stays YAML when target is YAML",
			value:        "key: value\nnested: true",
			targetFormat: FormatYAML,
			wantFormat:   "```yaml",
			wantContains: []string{"key:", "value"},
		},
		{
			name:         "plain text returns as-is",
			value:        "simple text",
			targetFormat: FormatYAML,
			wantFormat:   "",
			wantContains: []string{"simple text"},
		},
		{
			name:         "XML preserved regardless of target",
			value:        "<root><item>value</item></root>",
			targetFormat: FormatYAML,
			wantFormat:   "```xml",
			wantContains: []string{"<root>", "<item>"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			formatted, isCodeBlock := FormatExtensionValueWithTargetFormat(tt.value, tt.targetFormat)

			if tt.wantFormat == "" {
				// plain text case
				assert.False(t, isCodeBlock)
			} else {
				assert.True(t, isCodeBlock)
				assert.Contains(t, formatted, tt.wantFormat)
			}

			for _, substr := range tt.wantContains {
				assert.Contains(t, formatted, substr)
			}
		})
	}
}

func TestDetectDocumentFormat(t *testing.T) {
	tests := []struct {
		name    string
		content string
		want    StructuredDataFormat
	}{
		{
			name: "JSON document",
			content: `{
  "openapi": "3.1.0",
  "info": {
    "title": "Test"
  }
}`,
			want: FormatJSON,
		},
		{
			name: "JSON array document",
			content: `[
  {"id": 1},
  {"id": 2}
]`,
			want: FormatJSON,
		},
		{
			name: "YAML document",
			content: `openapi: 3.1.0
info:
  title: Test
  version: 1.0.0`,
			want: FormatYAML,
		},
		{
			name:    "empty content",
			content: "",
			want:    FormatPlainText,
		},
		{
			name:    "whitespace only",
			content: "   \n\n  ",
			want:    FormatPlainText,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectDocumentFormat([]byte(tt.content))
			assert.Equal(t, tt.want, got)
		})
	}
}
