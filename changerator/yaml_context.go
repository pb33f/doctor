// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"encoding/json"
	"strings"
)

const (
	maxLineLength    = 200
	yamlContextLines = 2
	jsonContextLines = 4
)

// extractYAMLContext extracts context around a specific line from the document
func (c *Changerator) extractYAMLContext(lineNumber int) string {
	if len(c.rightDocContent) == 0 {
		return ""
	}

	if c.rightDocLines == nil {
		c.cacheDocumentLines()
	}

	contextLines := yamlContextLines
	if c.rightDocFormat == "json" {
		contextLines = jsonContextLines
	}

	idx := lineNumber - 1
	startIdx := max(0, idx-contextLines)
	endIdx := min(len(c.rightDocLines), idx+contextLines+1)

	if idx < 0 || idx >= len(c.rightDocLines) {
		return ""
	}

	var lines []string
	for i := startIdx; i < endIdx; i++ {
		line := c.rightDocLines[i]

		if len(line) > maxLineLength {
			line = line[:maxLineLength-3] + "..."
		}

		lines = append(lines, line)
	}

	minIndent := -1
	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}
		indent := len(line) - len(strings.TrimLeft(line, " \t"))
		if minIndent == -1 || indent < minIndent {
			minIndent = indent
		}
	}

	var snippet strings.Builder
	for _, line := range lines {
		if minIndent > 0 && len(line) >= minIndent {
			line = line[minIndent:]
		}
		snippet.WriteString(line)
		snippet.WriteString("\n")
	}

	return snippet.String()
}

// cacheDocumentLines splits and caches document lines for performance
func (c *Changerator) cacheDocumentLines() {
	c.rightDocFormat = detectFormat(c.rightDocContent)

	if c.rightDocFormat == "json" {
		c.rightDocLines = prettyPrintJSON(c.rightDocContent)
	} else {
		content := string(c.rightDocContent)
		c.rightDocLines = strings.Split(content, "\n")
	}
}

// detectFormat determines if content is YAML or JSON
func detectFormat(content []byte) string {
	trimmed := strings.TrimSpace(string(content))
	if len(trimmed) > 0 && (trimmed[0] == '{' || trimmed[0] == '[') {
		return "json"
	}
	return "yaml"
}

// prettyPrintJSON converts JSON to pretty-printed lines
func prettyPrintJSON(content []byte) []string {
	var v interface{}
	if err := json.Unmarshal(content, &v); err != nil {
		return strings.Split(string(content), "\n")
	}

	prettyBytes, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return strings.Split(string(content), "\n")
	}

	return strings.Split(string(prettyBytes), "\n")
}

// ClearContextCache clears cached lines to free memory
func (c *Changerator) ClearContextCache() {
	c.rightDocLines = nil
	c.rightDocContent = nil
}
