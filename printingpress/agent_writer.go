// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// WriteLLMSite generates agent-optimized markdown documentation alongside the HTML site.
func WriteLLMSite(site *Site, outputDir string) error {
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		return fmt.Errorf("creating output directory: %w", err)
	}

	// Create subdirectories for individual files
	dirs := append([]string{"operations"}, modelDirs()...)
	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(outputDir, dir), 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	if err := writeLLMFull(site, outputDir); err != nil {
		return fmt.Errorf("writing llms-full.txt: %w", err)
	}
	if err := writeLLMIndex(site, outputDir); err != nil {
		return fmt.Errorf("writing llms.txt: %w", err)
	}
	if err := writeLLMOperationsSlice(site, outputDir); err != nil {
		return fmt.Errorf("writing llms-operations.txt: %w", err)
	}
	if err := writeLLMModelsSlice(site, outputDir); err != nil {
		return fmt.Errorf("writing llms-models.txt: %w", err)
	}
	if err := writeLLMOperationFiles(site, outputDir); err != nil {
		return fmt.Errorf("writing operation .md files: %w", err)
	}
	if err := writeLLMModelFiles(site, outputDir); err != nil {
		return fmt.Errorf("writing model .md files: %w", err)
	}

	return nil
}

// writeLLMFull generates the primary llms-full.txt with complete API documentation.
func writeLLMFull(site *Site, outputDir string) error {
	var b strings.Builder

	title := "API Documentation"
	if site.Root != nil && site.Root.Title != "" {
		title = site.Root.Title
	}
	b.WriteString("# " + title + "\n\n")

	if site.Root != nil && site.Root.Description != "" {
		b.WriteString("> " + singleLine(site.Root.Description) + "\n\n")
	}
	if site.Root != nil && site.Root.Version != "" {
		b.WriteString("**Version:** " + site.Root.Version + "\n\n")
	}

	// How to Use section
	howTo := renderHowToUse(site)
	if howTo != "" {
		b.WriteString(howTo)
	}

	// Operations section
	opsContent := renderOperationsSection(site)
	if opsContent != "" {
		b.WriteString(opsContent)
	}

	// Webhooks section
	whContent := renderWebhooksSection(site)
	if whContent != "" {
		b.WriteString(whContent)
	}

	// Models sections
	modelsContent := renderModelsSection(site)
	if modelsContent != "" {
		b.WriteString(modelsContent)
	}

	return os.WriteFile(filepath.Join(outputDir, "llms-full.txt"), []byte(b.String()), 0o644)
}

// writeLLMIndex generates the llms.txt discovery index.
func writeLLMIndex(site *Site, outputDir string) error {
	var b strings.Builder

	title := "API Documentation"
	if site.Root != nil && site.Root.Title != "" {
		title = site.Root.Title
	}
	b.WriteString("# " + title + "\n\n")

	if site.Root != nil && site.Root.Description != "" {
		b.WriteString("> " + truncateDesc(site.Root.Description, 200) + "\n\n")
	}

	b.WriteString("## Files\n\n")
	b.WriteString("- [llms-full.txt](llms-full.txt) — Complete API documentation in one file\n")
	b.WriteString("- [llms-operations.txt](llms-operations.txt) — All operations only\n")
	b.WriteString("- [llms-models.txt](llms-models.txt) — All models/components only\n\n")

	// Quick Start section
	quickStart := renderQuickStart(site)
	if quickStart != "" {
		b.WriteString(quickStart)
	}

	// Operations index grouped by tags
	opsIndex := renderOperationsIndex(site)
	if opsIndex != "" {
		b.WriteString(opsIndex)
	}

	// Webhooks index
	if len(site.Webhooks) > 0 {
		b.WriteString("## Webhooks\n\n")
		for _, wh := range site.Webhooks {
			summary := ""
			if wh.Summary != "" {
				summary = " — " + singleLine(wh.Summary)
			}
			b.WriteString(fmt.Sprintf("- [%s %s](operations/%s.md)%s\n", wh.Method, wh.Path, wh.Slug, summary))
		}
		b.WriteString("\n")
	}

	// Models index by group
	if len(site.NavModelGroups) > 0 {
		b.WriteString("## Models\n\n")
		for _, group := range site.NavModelGroups {
			if group.TypeSlug == "path-items" {
				continue
			}
			b.WriteString("### " + group.Name + "\n\n")
			for _, model := range group.Models {
				desc := ""
				if model.Description != "" {
					desc = " — " + truncateDesc(model.Description, 80)
				}
				b.WriteString(fmt.Sprintf("- [%s](models/%s/%s.md)%s\n", model.Name, model.TypeSlug, model.Slug, desc))
			}
			b.WriteString("\n")
		}
	}

	return os.WriteFile(filepath.Join(outputDir, "llms.txt"), []byte(b.String()), 0o644)
}

// writeLLMOperationsSlice generates llms-operations.txt with all operations and webhooks.
func writeLLMOperationsSlice(site *Site, outputDir string) error {
	var b strings.Builder

	opsContent := renderOperationsSection(site)
	if opsContent != "" {
		b.WriteString(opsContent)
	}

	whContent := renderWebhooksSection(site)
	if whContent != "" {
		b.WriteString(whContent)
	}

	if b.Len() == 0 {
		b.WriteString("# Operations\n\nNo operations defined.\n")
	}

	return os.WriteFile(filepath.Join(outputDir, "llms-operations.txt"), []byte(b.String()), 0o644)
}

// writeLLMModelsSlice generates llms-models.txt with all model/component sections.
func writeLLMModelsSlice(site *Site, outputDir string) error {
	var b strings.Builder

	modelsContent := renderModelsSection(site)
	if modelsContent != "" {
		b.WriteString(modelsContent)
	}

	if b.Len() == 0 {
		b.WriteString("# Models\n\nNo models defined.\n")
	}

	return os.WriteFile(filepath.Join(outputDir, "llms-models.txt"), []byte(b.String()), 0o644)
}

// writeLLMOperationFiles writes individual .md files for each operation and webhook.
func writeLLMOperationFiles(site *Site, outputDir string) error {
	for _, op := range site.Operations {
		content := renderOperationMD(op)
		path := filepath.Join(outputDir, "operations", op.Slug+".md")
		if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
			return fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
	}
	for _, wh := range site.Webhooks {
		content := renderOperationMD(wh)
		path := filepath.Join(outputDir, "operations", wh.Slug+".md")
		if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
			return fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
	}
	return nil
}

// writeLLMModelFiles writes individual .md files for each model.
func writeLLMModelFiles(site *Site, outputDir string) error {
	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		for _, page := range pages {
			content := renderModelMD(page)
			path := filepath.Join(outputDir, "models", group.TypeSlug, page.Slug+".md")
			if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
				return fmt.Errorf("writing model %s/%s: %w", group.TypeSlug, page.Slug, err)
			}
		}
	}
	return nil
}

// renderQuickStart builds a compact Quick Start section for the llms.txt index.
func renderQuickStart(site *Site) string {
	if site.Root == nil {
		return ""
	}

	var b strings.Builder
	b.WriteString("## Quick Start\n\n")

	// Base URL
	if len(site.Root.Servers) > 0 {
		b.WriteString("**Base URL:** `" + site.Root.Servers[0].URL + "`\n\n")
	}

	// Auth scheme names
	if len(site.Root.Security) > 0 {
		var names []string
		for _, secReq := range site.Root.Security {
			names = append(names, secReq.Name)
		}
		if len(names) > 0 {
			sort.Strings(names)
			b.WriteString("**Authentication:** " + strings.Join(names, ", ") + "\n\n")
		}
	}

	// Stats line
	var stats []string
	if len(site.Operations) > 0 {
		stats = append(stats, fmt.Sprintf("%d operations", len(site.Operations)))
	}
	schemaCount := len(site.Models["schemas"])
	if schemaCount > 0 {
		stats = append(stats, fmt.Sprintf("%d schemas", schemaCount))
	}
	secCount := len(site.Models["security"])
	if secCount > 0 {
		stats = append(stats, fmt.Sprintf("%d security schemes", secCount))
	}
	if len(stats) > 0 {
		b.WriteString(strings.Join(stats, " · ") + "\n\n")
	}

	return b.String()
}

// renderOperationsIndex builds a tag-grouped operations index for llms.txt.
func renderOperationsIndex(site *Site) string {
	if len(site.Operations) == 0 {
		return ""
	}

	var b strings.Builder
	b.WriteString("## Operations\n\n")

	// Build slug lookup for operation pages
	opLookup := make(map[string]*OperationPage)
	for _, op := range site.Operations {
		opLookup[op.Slug] = op
	}

	seen := make(map[string]bool)

	var walkTags func(tags []*NavTag, depth int)
	walkTags = func(tags []*NavTag, depth int) {
		for _, tag := range tags {
			if len(tag.Operations) == 0 && len(tag.Children) == 0 {
				continue
			}
			heading := strings.Repeat("#", depth+2)
			title := tag.Name
			if tag.Summary != "" {
				title += " — " + singleLine(tag.Summary)
			}
			opCount := countTagOperations(tag)
			if opCount > 0 {
				title += fmt.Sprintf(" (%d operations)", opCount)
			}
			b.WriteString(heading + " " + title + "\n\n")
			for _, navOp := range tag.Operations {
				if seen[navOp.Slug] {
					continue
				}
				seen[navOp.Slug] = true
				summary := ""
				if navOp.Summary != "" {
					summary = " — " + singleLine(navOp.Summary)
				}
				b.WriteString(fmt.Sprintf("- [%s %s](operations/%s.md)%s\n",
					navOp.Method, navOp.Path, navOp.Slug, summary))
			}
			if len(tag.Operations) > 0 {
				b.WriteString("\n")
			}
			walkTags(tag.Children, depth+1)
		}
	}
	walkTags(site.NavTags, 1)

	// Untagged operations
	var untagged []*OperationPage
	for _, op := range site.Operations {
		if !seen[op.Slug] {
			untagged = append(untagged, op)
		}
	}
	if len(untagged) > 0 {
		b.WriteString("### Other Operations\n\n")
		for _, op := range untagged {
			summary := ""
			if op.Summary != "" {
				summary = " — " + singleLine(op.Summary)
			}
			b.WriteString(fmt.Sprintf("- [%s %s](operations/%s.md)%s\n", op.Method, op.Path, op.Slug, summary))
		}
		b.WriteString("\n")
	}

	return b.String()
}

// countTagOperations recursively counts all operations under a tag and its children.
func countTagOperations(tag *NavTag) int {
	count := len(tag.Operations)
	for _, child := range tag.Children {
		count += countTagOperations(child)
	}
	return count
}

// renderHowToUse builds the "How to Use This API" section.
func renderHowToUse(site *Site) string {
	if site.Root == nil {
		return ""
	}

	var b strings.Builder
	b.WriteString("## How to Use This API\n\n")

	// Base URL
	if len(site.Root.Servers) > 0 {
		b.WriteString("### Base URL\n\n")
		srv := site.Root.Servers[0]
		b.WriteString("`" + srv.URL + "`")
		if srv.Description != "" {
			b.WriteString(" — " + singleLine(srv.Description))
		}
		b.WriteString("\n\n")
		if len(site.Root.Servers) > 1 {
			b.WriteString("Additional servers:\n")
			for _, s := range site.Root.Servers[1:] {
				b.WriteString("- `" + s.URL + "`")
				if s.Description != "" {
					b.WriteString(" — " + singleLine(s.Description))
				}
				b.WriteString("\n")
			}
			b.WriteString("\n")
		}
	}

	// Authentication
	if len(site.Root.Security) > 0 {
		b.WriteString("### Authentication\n\n")
		for _, secReq := range site.Root.Security {
			b.WriteString("- **" + secReq.Name + "**")
			if secReq.SchemeType != "" {
				b.WriteString(": " + secReq.SchemeType)
				if secReq.Scheme != "" {
					b.WriteString(" / " + secReq.Scheme)
				}
				if secReq.In != "" {
					b.WriteString(" (in: " + secReq.In + ")")
				}
			}
			if len(secReq.Scopes) > 0 {
				b.WriteString(" (scopes: `" + strings.Join(secReq.Scopes, "`, `") + "`)")
			}
			b.WriteString("\n")
		}
		b.WriteString("\n")
	}

	// Primary Resources
	resourceTable := buildResourceTable(site)
	if resourceTable != "" {
		b.WriteString("### Primary Resources\n\n")
		b.WriteString(resourceTable)
		b.WriteString("\n")
	}

	// Common Error Model
	errModel := detectErrorModel(site)
	if errModel != nil {
		b.WriteString("### Common Error Model\n\n")
		if errModel.Description != "" {
			b.WriteString(errModel.Description + "\n\n")
		}
		b.WriteString(renderSchemaBlock(errModel.SchemaJSON))
		b.WriteString("\n")
	}

	b.WriteString("---\n\n")
	return b.String()
}

// Removed: renderSecuritySchemeInfo — replaced by SecurityRequirement.SchemeType/Scheme/In fields

// buildResourceTable derives a resources summary table from NavTags.
func buildResourceTable(site *Site) string {
	if len(site.NavTags) == 0 {
		return ""
	}

	var b strings.Builder
	b.WriteString("| Resource | Operations | Description |\n")
	b.WriteString("|----------|-----------|-------------|\n")

	var walkTags func(tags []*NavTag)
	walkTags = func(tags []*NavTag) {
		for _, tag := range tags {
			if len(tag.Operations) > 0 {
				methods := make(map[string]bool)
				paths := make(map[string]bool)
				for _, op := range tag.Operations {
					methods[op.Method] = true
					paths[op.Path] = true
				}
				methodList := sortedKeys(methods)
				pathList := sortedKeys(paths)
				commonPath := commonPrefix(pathList)
				opsStr := strings.Join(methodList, ", ")
				if commonPath != "" {
					opsStr += " " + commonPath
				}
				desc := escapeTableCell(tag.Summary)
				b.WriteString(fmt.Sprintf("| %s | %s | %s |\n", tag.Name, escapeTableCell(opsStr), desc))
			}
			walkTags(tag.Children)
		}
	}
	walkTags(site.NavTags)

	return b.String()
}

// detectErrorModel finds a common error schema by name heuristic.
func detectErrorModel(site *Site) *ModelPage {
	schemas := site.Models["schemas"]
	if schemas == nil {
		return nil
	}
	errorNames := []string{"Error", "ApiError", "ErrorResponse", "ProblemDetail", "ErrorModel"}
	for _, name := range errorNames {
		for _, page := range schemas {
			if strings.EqualFold(page.Name, name) {
				return page
			}
		}
	}
	return nil
}

// renderOperationsSection renders the full "## Operations" section grouped by tags.
func renderOperationsSection(site *Site) string {
	if len(site.Operations) == 0 {
		return ""
	}

	var b strings.Builder
	b.WriteString("## Operations\n\n")

	// Build slug→OperationPage lookup
	opLookup := make(map[string]*OperationPage)
	for _, op := range site.Operations {
		opLookup[op.Slug] = op
	}

	seen := make(map[string]bool)

	// Walk tags tree to render operations grouped by tag
	var walkTags func(tags []*NavTag, depth int)
	walkTags = func(tags []*NavTag, depth int) {
		for _, tag := range tags {
			if len(tag.Operations) == 0 && len(tag.Children) == 0 {
				continue
			}
			heading := strings.Repeat("#", depth+2)
			b.WriteString(heading + " " + tag.Name + "\n\n")
			if tag.Summary != "" {
				b.WriteString(tag.Summary + "\n\n")
			}
			for _, navOp := range tag.Operations {
				if seen[navOp.Slug] {
					continue
				}
				seen[navOp.Slug] = true
				if op, ok := opLookup[navOp.Slug]; ok {
					b.WriteString(renderOperationMD(op))
					b.WriteString("\n---\n\n")
				}
			}
			walkTags(tag.Children, depth+1)
		}
	}
	walkTags(site.NavTags, 1)

	// Render untagged operations
	var untagged []*OperationPage
	for _, op := range site.Operations {
		if !seen[op.Slug] {
			untagged = append(untagged, op)
		}
	}
	if len(untagged) > 0 {
		b.WriteString("### Untagged Operations\n\n")
		for _, op := range untagged {
			b.WriteString(renderOperationMD(op))
			b.WriteString("\n---\n\n")
		}
	}

	return b.String()
}

// renderWebhooksSection renders the "## Webhooks" section.
func renderWebhooksSection(site *Site) string {
	if len(site.Webhooks) == 0 {
		return ""
	}

	var b strings.Builder
	b.WriteString("## Webhooks\n\n")

	for _, wh := range site.Webhooks {
		b.WriteString(renderOperationMD(wh))
		b.WriteString("\n---\n\n")
	}

	return b.String()
}

// renderModelsSection renders all model/component group sections.
func renderModelsSection(site *Site) string {
	if len(site.NavModelGroups) == 0 {
		return ""
	}

	var b strings.Builder

	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		if len(pages) == 0 {
			continue
		}
		b.WriteString("## " + group.Name + "\n\n")
		for _, page := range pages {
			b.WriteString(renderModelMD(page))
			b.WriteString("\n---\n\n")
		}
	}

	return b.String()
}

// renderOperationMD renders a single operation as markdown.
func renderOperationMD(op *OperationPage) string {
	var b strings.Builder

	b.WriteString("### " + op.Method + " " + op.Path + "\n\n")

	if op.Summary != "" {
		b.WriteString(op.Summary + "\n\n")
	}

	// Metadata line
	var meta []string
	if op.OperationID != "" {
		meta = append(meta, "**Operation ID:** `"+op.OperationID+"`")
	}
	if len(op.Tags) > 0 {
		meta = append(meta, "**Tags:** "+strings.Join(op.Tags, ", "))
	}
	if op.Deprecated {
		meta = append(meta, "**Deprecated**")
	}
	if len(meta) > 0 {
		b.WriteString(strings.Join(meta, "  \n") + "\n\n")
	}

	if op.Description != "" && op.Description != op.Summary {
		b.WriteString(op.Description + "\n\n")
	}

	// Parameters
	if len(op.Parameters) > 0 {
		b.WriteString("#### Parameters\n\n")
		b.WriteString(renderParamsTable(op.Parameters))
		b.WriteString("\n")
	}

	// Request Body
	if op.RequestBody != nil {
		b.WriteString(renderRequestBodyMD(op.RequestBody))
	}

	// Responses
	if len(op.Responses) > 0 {
		b.WriteString("#### Responses\n\n")
		b.WriteString(renderResponsesMD(op.Responses))
	}

	// Cross-references
	if op.CrossRefs != nil && len(op.CrossRefs.ReferencesModels) > 0 {
		var names []string
		for _, ref := range op.CrossRefs.ReferencesModels {
			names = append(names, ref.Name)
		}
		b.WriteString("**Models referenced:** " + strings.Join(names, ", ") + "\n\n")
	}

	return b.String()
}

// renderModelMD renders a single model/component as markdown.
func renderModelMD(page *ModelPage) string {
	var b strings.Builder

	b.WriteString("### " + page.Name + "\n\n")

	if page.Description != "" {
		b.WriteString(page.Description + "\n\n")
	}

	if page.SchemaJSON != "" {
		b.WriteString(renderSchemaBlock(page.SchemaJSON))
		b.WriteString("\n")
	}

	// Cross-references
	if page.CrossRefs != nil {
		if len(page.CrossRefs.UsedByOperations) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsedByOperations {
				refs = append(refs, ref.Method+" "+ref.Path)
			}
			b.WriteString("**Used by:** " + strings.Join(refs, ", ") + "\n\n")
		}
		if len(page.CrossRefs.UsesModels) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsesModels {
				refs = append(refs, ref.Name)
			}
			b.WriteString("**References:** " + strings.Join(refs, ", ") + "\n\n")
		}
		if len(page.CrossRefs.UsedByModels) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsedByModels {
				refs = append(refs, ref.Name)
			}
			b.WriteString("**Referenced by:** " + strings.Join(refs, ", ") + "\n\n")
		}
	}

	return b.String()
}

// renderParamsTable renders a markdown table of operation parameters.
func renderParamsTable(params []*ParameterInfo) string {
	var b strings.Builder
	b.WriteString("| Name | In | Required | Description |\n")
	b.WriteString("|------|------|----------|-------------|\n")
	for _, p := range params {
		required := "No"
		if p.Required {
			required = "Yes"
		}
		desc := escapeTableCell(truncateDesc(p.Description, 100))
		b.WriteString(fmt.Sprintf("| `%s` | %s | %s | %s |\n",
			escapeTableCell(p.Name), p.In, required, desc))
	}
	return b.String()
}

// renderRequestBodyMD renders request body documentation.
func renderRequestBodyMD(rb *RequestBodyInfo) string {
	var b strings.Builder

	required := ""
	if rb.Required {
		required = " — Required"
	}

	for _, mt := range rb.Content {
		b.WriteString(fmt.Sprintf("#### Request Body (`%s`)%s\n\n", mt.MediaType, required))
		if rb.Description != "" {
			b.WriteString(rb.Description + "\n\n")
		}
		if mt.SchemaJSON != "" {
			b.WriteString(renderSchemaBlock(mt.SchemaJSON))
			b.WriteString("\n")
		}
	}

	if len(rb.Content) == 0 && rb.Description != "" {
		b.WriteString("#### Request Body" + required + "\n\n")
		b.WriteString(rb.Description + "\n\n")
	}

	return b.String()
}

// renderResponsesMD renders all response entries, deduplicating identical schemas.
func renderResponsesMD(responses []*ResponseInfo) string {
	var b strings.Builder

	// Track schema JSON → first status code that rendered it, for dedup
	seenSchemas := make(map[string]string)

	for _, resp := range responses {
		desc := ""
		if resp.Description != "" {
			desc = " — " + singleLine(resp.Description)
		}

		if len(resp.Content) > 0 {
			for _, mt := range resp.Content {
				b.WriteString(fmt.Sprintf("**%s** (`%s`)%s\n\n", resp.StatusCode, mt.MediaType, desc))
				if mt.SchemaJSON != "" {
					if firstCode, seen := seenSchemas[mt.SchemaJSON]; seen {
						b.WriteString(fmt.Sprintf("*Same schema as %s response.*\n\n", firstCode))
					} else {
						seenSchemas[mt.SchemaJSON] = resp.StatusCode
						b.WriteString(renderSchemaBlock(mt.SchemaJSON))
						b.WriteString("\n")
					}
				}
				desc = "" // only show description once per status code
			}
		} else {
			b.WriteString(fmt.Sprintf("**%s**%s\n\n", resp.StatusCode, desc))
		}
	}

	return b.String()
}

// renderSchemaBlock pretty-prints a JSON schema string as a fenced code block.
func renderSchemaBlock(schemaJSON string) string {
	pretty := prettyJSON(schemaJSON)
	return "```json\n" + pretty + "\n```\n"
}

// prettyJSON formats a compact JSON string with indentation.
func prettyJSON(compact string) string {
	if compact == "" {
		return "{}"
	}
	var buf bytes.Buffer
	if err := json.Indent(&buf, []byte(compact), "", "  "); err != nil {
		return compact
	}
	return buf.String()
}

// truncateDesc truncates a description to maxLen characters, appending "..." if truncated.
func truncateDesc(desc string, maxLen int) string {
	if maxLen <= 0 {
		return desc
	}
	s := singleLine(desc)
	if len(s) <= maxLen {
		return s
	}
	if maxLen <= 3 {
		return s[:maxLen]
	}
	return s[:maxLen-3] + "..."
}

// singleLine replaces newlines with spaces for inline use.
func singleLine(s string) string {
	s = strings.ReplaceAll(s, "\r\n", " ")
	s = strings.ReplaceAll(s, "\n", " ")
	s = strings.TrimSpace(s)
	return s
}

// escapeTableCell escapes pipe characters and newlines for markdown table cells.
func escapeTableCell(s string) string {
	s = singleLine(s)
	s = strings.ReplaceAll(s, "|", "\\|")
	return s
}

// sortedKeys returns sorted keys from a map[string]bool.
func sortedKeys(m map[string]bool) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

// commonPrefix finds the longest common path prefix from a list of URL paths.
func commonPrefix(paths []string) string {
	if len(paths) == 0 {
		return ""
	}
	if len(paths) == 1 {
		return paths[0]
	}
	prefix := paths[0]
	for _, p := range paths[1:] {
		for !strings.HasPrefix(p, prefix) {
			idx := strings.LastIndex(prefix, "/")
			if idx <= 0 {
				return ""
			}
			prefix = prefix[:idx]
		}
	}
	// Include trailing wildcard indicator for partial paths
	if prefix != "" && prefix != paths[0] {
		prefix += "/*"
	}
	return prefix
}
