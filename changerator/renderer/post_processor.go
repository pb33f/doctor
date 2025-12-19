// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"fmt"
	"regexp"
	"strings"
)

var (
	regularMarkerPattern = regexp.MustCompile(`<!-- pb33f-[^>]+ -->`)
	escapedMarkerPattern = regexp.MustCompile(`&lt;!-- pb33f-[^&]+ --&gt;`)
	breakingEmojiPattern = regexp.MustCompile(`<strong>\(💔 breaking\)</strong>`)
)

// objectTypeToIcon maps display names from formatObjectType() to icon names for pb33f-model-icon.
var objectTypeToIcon = map[string]string{
	"Info":         "info",
	"Contact":      "contact",
	"License":      "license",
	"Operation":    "operation",
	"Parameter":    "parameter",
	"Schema":       "schema",
	"Response":     "response",
	"Request Body": "requestBody",
	"Header":       "header",
	"Media Type":   "mediaType",
	"Path":         "path",
	"Tag":          "tag",
	"Security":     "securityScheme",
	"Server":       "server",
	"Webhook":      "webhook",
	"Callback":     "callback",
	"Example":      "example",
	"Extension":    "extension",
	"Components":   "components",
	"Paths":        "path",
	"Path Item":    "path",
}

type postProcessor struct {
	config *HTMLConfig
}

func (p *postProcessor) process(html string) string {
	html = p.processObjectSummaryTable(html)
	html = p.replaceBreakingEmoji(html)

	if p.config != nil && p.config.EnableFloatingSidebar {
		html = p.wrapMetadataSection(html)
	}

	if p.config == nil || !p.config.EnableNestedListFix {
		return html
	}

	return p.removeMarkers(html)
}

func (p *postProcessor) removeMarkers(html string) string {
	result := regularMarkerPattern.ReplaceAllString(html, "")
	result = escapedMarkerPattern.ReplaceAllString(result, "")
	return result
}

func (p *postProcessor) replaceBreakingEmoji(html string) string {
	replacement := `<span class="breaking"><sl-icon name="heartbreak-fill" class="removed" aria-hidden="true" library="default"></sl-icon></span>`
	return breakingEmojiPattern.ReplaceAllString(html, replacement)
}

func (p *postProcessor) wrapMetadataSection(html string) string {
	h1Start := strings.Index(html, "<h1")
	if h1Start == -1 {
		return html
	}

	h1End := strings.Index(html[h1Start:], "</h1>")
	if h1End == -1 {
		return html
	}

	breakdownMarker := "<h2"
	breakdownIdx := strings.Index(html, breakdownMarker)
	if breakdownIdx == -1 {
		return html
	}

	var result strings.Builder
	result.Grow(len(html) + 200)

	result.WriteString(html[:h1Start])

	result.WriteString("<div class=\"report-clearfix\">\n")

	result.WriteString("<aside class=\"metadata-sidebar\">")

	h1FullEnd := h1Start + h1End + 5
	metadataContent := html[h1FullEnd:breakdownIdx]
	result.WriteString(metadataContent)

	result.WriteString("</aside>\n")

	result.WriteString(html[h1Start:h1FullEnd])
	result.WriteString("\n")

	result.WriteString(html[breakdownIdx:])

	result.WriteString("\n</div>")

	return result.String()
}

// processObjectSummaryTable finds the object summary table (with "Object" header) and adds styling class + icons.
func (p *postProcessor) processObjectSummaryTable(html string) string {
	// look for the table with "Object" header in first column
	tableHeaderMarker := "<th>Object"
	headerIdx := strings.Index(html, tableHeaderMarker)
	if headerIdx == -1 {
		return html
	}

	// find the start of the table tag before this header
	tableIdx := strings.LastIndex(html[:headerIdx], "<table")
	if tableIdx == -1 {
		return html
	}
	absoluteTableIdx := tableIdx

	tableTagEnd := strings.Index(html[absoluteTableIdx:], ">")
	if tableTagEnd == -1 {
		return html
	}

	tableEndIdx := strings.Index(html[absoluteTableIdx:], "</table>")
	if tableEndIdx == -1 {
		return html
	}
	tableEndIdx += absoluteTableIdx

	// pre-allocate builder for entire output - estimate icon overhead per row
	var result strings.Builder
	estimatedRows := strings.Count(html[absoluteTableIdx:tableEndIdx], "<tr")
	iconOverhead := estimatedRows * 60 // ~60 bytes per icon element
	result.Grow(len(html) + iconOverhead)

	// write content before table
	result.WriteString(html[:absoluteTableIdx])

	// write table tag with class
	oldTableTag := html[absoluteTableIdx : absoluteTableIdx+tableTagEnd+1]
	if idx := strings.Index(oldTableTag, `class="`); idx != -1 {
		result.WriteString(oldTableTag[:idx+7])
		result.WriteString("object-change-summary ")
		result.WriteString(oldTableTag[idx+7:])
	} else if idx := strings.Index(oldTableTag, `class='`); idx != -1 {
		result.WriteString(oldTableTag[:idx+7])
		result.WriteString("object-change-summary ")
		result.WriteString(oldTableTag[idx+7:])
	} else {
		result.WriteString(`<table class="object-change-summary"`)
		result.WriteString(oldTableTag[6:])
	}

	// process table content with icon injection
	tableContent := html[absoluteTableIdx+tableTagEnd+1 : tableEndIdx]
	p.processTableContent(&result, tableContent)

	// write content after table
	result.WriteString(html[tableEndIdx:])

	return result.String()
}

// processTableContent processes table rows and injects icons into first column cells.
func (p *postProcessor) processTableContent(result *strings.Builder, tableHTML string) {
	pos := 0
	for {
		trIdx := strings.Index(tableHTML[pos:], "<tr")
		if trIdx == -1 {
			result.WriteString(tableHTML[pos:])
			break
		}
		trIdx += pos

		result.WriteString(tableHTML[pos:trIdx])

		trEndIdx := strings.Index(tableHTML[trIdx:], "</tr>")
		if trEndIdx == -1 {
			result.WriteString(tableHTML[trIdx:])
			break
		}
		trEndIdx += trIdx + 5

		rowHTML := tableHTML[trIdx:trEndIdx]

		tdIdx := strings.Index(rowHTML, "<td>")
		if tdIdx != -1 {
			p.processRowWithIcon(result, rowHTML, tdIdx)
		} else {
			result.WriteString(rowHTML)
		}

		pos = trEndIdx
	}
}

// processRowWithIcon injects an icon into the first cell if content matches an object type.
func (p *postProcessor) processRowWithIcon(result *strings.Builder, rowHTML string, tdIdx int) {
	tdEndIdx := strings.Index(rowHTML[tdIdx:], "</td>")
	if tdEndIdx == -1 {
		result.WriteString(rowHTML)
		return
	}
	tdEndIdx += tdIdx

	cellContent := rowHTML[tdIdx+4 : tdEndIdx]
	trimmedContent := strings.TrimSpace(cellContent)

	iconName, found := objectTypeToIcon[trimmedContent]
	if !found {
		result.WriteString(rowHTML)
		return
	}

	result.WriteString(rowHTML[:tdIdx+4])
	result.WriteString(fmt.Sprintf(`<pb33f-model-icon icon="%s" size="tiny"></pb33f-model-icon>`, iconName))
	result.WriteString(cellContent)
	result.WriteString(rowHTML[tdEndIdx:])
}
