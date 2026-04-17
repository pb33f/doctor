// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	. "github.com/pb33f/doctor/printingpress/model"
)

type llmRenderContext struct {
	site                *Site
	operationLinkPrefix string
	modelLinkPrefix     string
}

func rootLLMRenderContext(site *Site) llmRenderContext {
	return llmRenderContext{
		site:                site,
		operationLinkPrefix: "operations/",
		modelLinkPrefix:     "models/",
	}
}

func operationFileRenderContext(site *Site) llmRenderContext {
	return llmRenderContext{
		site:                site,
		operationLinkPrefix: "",
		modelLinkPrefix:     "../models/",
	}
}

func modelFileRenderContext(site *Site) llmRenderContext {
	return llmRenderContext{
		site:                site,
		operationLinkPrefix: "../../operations/",
		modelLinkPrefix:     "../../models/",
	}
}

// WriteLLMSite writes LLM-oriented markdown docs to disk.
//
// When outputDir is empty, WriteLLMSite uses site.OutputDir. A nil site returns
// ErrNilSite.
func WriteLLMSite(site *Site, outputDir string) error {
	if site == nil {
		return ErrNilSite
	}
	_, err := writeLLMSiteDetailed(site, outputDir, nil)
	return err
}

func writeLLMSiteDetailed(site *Site, outputDir string, progress writeProgressFunc) ([]string, error) {
	if site == nil {
		return nil, ErrNilSite
	}
	resolvedOutputDir, err := resolveWriterOutputDir(site, outputDir)
	if err != nil {
		return nil, err
	}

	if err := os.MkdirAll(resolvedOutputDir, 0o755); err != nil {
		return nil, fmt.Errorf("creating output directory: %w", err)
	}

	written := make([]string, 0)
	step := 0
	total := 5 + len(site.Operations) + len(site.Webhooks)
	for _, group := range site.NavModelGroups {
		total += len(site.Models[group.TypeSlug])
	}

	if err := writeLLMFull(site, resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("writing llms-full.txt: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, "llms-full.txt"))
	step++
	if progress != nil {
		progress("writing llm files", step, total)
	}
	if err := writeLLMAgentsGuide(site, resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("writing AGENTS.md: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, "AGENTS.md"))
	step++
	if progress != nil {
		progress("writing llm files", step, total)
	}
	if err := writeLLMIndex(site, resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("writing llms.txt: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, "llms.txt"))
	step++
	if progress != nil {
		progress("writing llm files", step, total)
	}
	if err := writeLLMOperationsSlice(site, resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("writing llms-operations.txt: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, "llms-operations.txt"))
	step++
	if progress != nil {
		progress("writing llm files", step, total)
	}
	if err := writeLLMModelsSlice(site, resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("writing llms-models.txt: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, "llms-models.txt"))
	step++
	if progress != nil {
		progress("writing llm files", step, total)
	}

	operationFiles, err := writeLLMOperationFiles(site, resolvedOutputDir)
	if err != nil {
		return nil, fmt.Errorf("writing operation .md files: %w", err)
	}
	written = append(written, operationFiles...)
	step += len(operationFiles)
	if progress != nil {
		progress("writing llm files", step, total)
	}

	modelFiles, err := writeLLMModelFiles(site, resolvedOutputDir)
	if err != nil {
		return nil, fmt.Errorf("writing model .md files: %w", err)
	}
	written = append(written, modelFiles...)
	step += len(modelFiles)
	if progress != nil {
		progress("writing llm files", step, total)
	}

	return written, nil
}

func writeLLMAgentsGuide(site *Site, outputDir string) error {
	var b strings.Builder

	title := "API Documentation"
	if site.Root != nil && site.Root.Title != "" {
		title = site.Root.Title
	}
	b.WriteString("# " + title + "\n\n")

	if site.Root != nil && site.Root.Description != "" {
		b.WriteString("> " + truncateDesc(site.Root.Description, 240) + "\n\n")
	}
	if src := renderSiteSourceMetadata(site.Source); src != "" {
		b.WriteString(src)
	}

	b.WriteString(renderAgentsGuide(site))

	return os.WriteFile(filepath.Join(outputDir, "AGENTS.md"), []byte(b.String()), 0o644)
}

// writeLLMFull generates the primary llms-full.txt with complete API documentation.
func writeLLMFull(site *Site, outputDir string) error {
	var b strings.Builder
	ctx := rootLLMRenderContext(site)

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
	if src := renderSiteSourceMetadata(site.Source); src != "" {
		b.WriteString(src)
	}

	// How to Use section
	howTo := renderHowToUse(site)
	if howTo != "" {
		b.WriteString(howTo)
	}

	// Operations section
	opsContent := renderOperationsSection(ctx)
	if opsContent != "" {
		b.WriteString(opsContent)
	}

	// Webhooks section
	whContent := renderWebhooksSection(ctx)
	if whContent != "" {
		b.WriteString(whContent)
	}

	// Models sections
	modelsContent := renderModelsSection(ctx)
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
	if src := renderSiteSourceMetadata(site.Source); src != "" {
		b.WriteString(src)
	}

	b.WriteString("## Files\n\n")
	b.WriteString("- [AGENTS.md](AGENTS.md) — Start-here guide for agents: artifact map and recommended workflow\n")
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

func renderAgentsGuide(site *Site) string {
	var b strings.Builder

	b.WriteString("## Start Here\n\n")
	b.WriteString("Start with this file to understand the generated artifact set before opening operation or model pages.\n\n")
	b.WriteString("If a page includes **Source** or **Source spec** links, use those for exact provenance and final verification.\n\n")

	if quickStart := renderQuickStart(site); quickStart != "" {
		b.WriteString(quickStart)
	}

	b.WriteString("## Artifact Map\n\n")
	b.WriteString("- [llms.txt](llms.txt) — Compact discovery index for tags, operations, and model groups.\n")
	b.WriteString("- [llms-full.txt](llms-full.txt) — Complete API documentation in one file when you need a single retrieval surface.\n")
	b.WriteString("- [llms-operations.txt](llms-operations.txt) — Operations and webhooks only.\n")
	b.WriteString("- [llms-models.txt](llms-models.txt) — Models and components only.\n")
	b.WriteString("- `operations/*.md` — One Markdown page per operation or webhook with parameters, security, request/response details, and related links.\n")
	b.WriteString("- `operations/*.json` — One machine-readable JSON artifact per operation or webhook for structured traversal and code generation.\n")
	b.WriteString("- `models/<type>/*.md` — One Markdown page per model or component with schema summaries and cross-links.\n")
	b.WriteString("- `models/<type>/*.json` — One machine-readable JSON artifact per model or component.\n")
	b.WriteString("- `bundle.json`, `index.json`, `nav.json`, `manifest.json` — Top-level machine-readable artifacts for structured traversal of the rendered docs set.\n")
	b.WriteString("- `index.html`, `operations/*.html`, `models/**/*.html` — Optional human-oriented browsing surfaces; use them last for LLM work.\n\n")

	b.WriteString("## Recommended Workflow\n\n")
	b.WriteString("1. Read [llms.txt](llms.txt) to find the most relevant tag, operation, or model family.\n")
	b.WriteString("2. Open the matching `operations/<slug>.md` page for concrete endpoint details and usage guidance.\n")
	b.WriteString("3. Follow links into `models/<type>/<slug>.md` for request and response shapes.\n")
	b.WriteString("4. Use [llms-full.txt](llms-full.txt) only when you need broad one-file retrieval or cross-cutting summaries.\n")
	b.WriteString("5. Fall back to source links or optional JSON artifacts when you need exact provenance or structured traversal.\n\n")

	b.WriteString("## Notes\n\n")
	b.WriteString("- [llms.txt](llms.txt) is an index, not the full documentation corpus.\n")
	b.WriteString("- Operation and model Markdown files are the preferred detailed reading surface for agents.\n")
	b.WriteString("- HTML is useful for human browsing, but it carries more layout noise than Markdown or JSON.\n")

	return b.String()
}

// writeLLMOperationsSlice generates llms-operations.txt with all operations and webhooks.
func writeLLMOperationsSlice(site *Site, outputDir string) error {
	var b strings.Builder
	ctx := rootLLMRenderContext(site)

	opsContent := renderOperationsSection(ctx)
	if opsContent != "" {
		b.WriteString(opsContent)
	}

	whContent := renderWebhooksSection(ctx)
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
	ctx := rootLLMRenderContext(site)

	modelsContent := renderModelsSection(ctx)
	if modelsContent != "" {
		b.WriteString(modelsContent)
	}

	if b.Len() == 0 {
		b.WriteString("# Models\n\nNo models defined.\n")
	}

	return os.WriteFile(filepath.Join(outputDir, "llms-models.txt"), []byte(b.String()), 0o644)
}

// writeLLMOperationFiles writes individual .md files for each operation and webhook.
func writeLLMOperationFiles(site *Site, outputDir string) ([]string, error) {
	var written []string
	ctx := operationFileRenderContext(site)
	for _, op := range site.Operations {
		content := renderOperationMD(ctx, op)
		path := filepath.Join(outputDir, "operations", op.Slug+".md")
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
			return nil, fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
		written = append(written, path)
	}
	for _, wh := range site.Webhooks {
		content := renderOperationMD(ctx, wh)
		path := filepath.Join(outputDir, "operations", wh.Slug+".md")
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
			return nil, fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
		written = append(written, path)
	}
	return written, nil
}

// writeLLMModelFiles writes individual .md files for each model.
func writeLLMModelFiles(site *Site, outputDir string) ([]string, error) {
	var written []string
	ctx := modelFileRenderContext(site)
	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		for _, page := range pages {
			content := renderModelMD(ctx, page)
			path := filepath.Join(outputDir, "models", group.TypeSlug, page.Slug+".md")
			if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
				return nil, err
			}
			if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
				return nil, fmt.Errorf("writing model %s/%s: %w", group.TypeSlug, page.Slug, err)
			}
			written = append(written, path)
		}
	}
	return written, nil
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
func renderOperationsSection(ctx llmRenderContext) string {
	site := ctx.site
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
					b.WriteString(renderOperationMD(ctx, op))
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
			b.WriteString(renderOperationMD(ctx, op))
			b.WriteString("\n---\n\n")
		}
	}

	return b.String()
}

// renderWebhooksSection renders the "## Webhooks" section.
func renderWebhooksSection(ctx llmRenderContext) string {
	site := ctx.site
	if len(site.Webhooks) == 0 {
		return ""
	}

	var b strings.Builder
	b.WriteString("## Webhooks\n\n")

	for _, wh := range site.Webhooks {
		b.WriteString(renderOperationMD(ctx, wh))
		b.WriteString("\n---\n\n")
	}

	return b.String()
}

// renderModelsSection renders all model/component group sections.
func renderModelsSection(ctx llmRenderContext) string {
	site := ctx.site
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
			b.WriteString(renderModelMD(ctx, page))
			b.WriteString("\n---\n\n")
		}
	}

	return b.String()
}

// renderOperationMD renders a single operation as markdown.
func renderOperationMD(ctx llmRenderContext, op *OperationPage) string {
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

	if src := renderSourceMetadataRef(op.Source); src != "" {
		b.WriteString(src)
		b.WriteString("\n")
	}

	description := sanitizeOperationDescription(ctx, op)
	if description != "" && description != op.Summary {
		b.WriteString(description + "\n\n")
	}

	if sec := renderOperationSecurityMD(ctx, op); sec != "" {
		b.WriteString(sec)
	}

	if curl := renderCurlMD(op); curl != "" {
		b.WriteString(curl)
	}

	if idGuidance := renderOperationIDGuidanceMD(ctx, op); idGuidance != "" {
		b.WriteString(idGuidance)
	}

	// Parameters
	if len(op.Parameters) > 0 {
		b.WriteString("#### Parameters\n\n")
		b.WriteString(renderParamsTable(op.Parameters))
		b.WriteString("\n")
		b.WriteString(renderParameterDetailsMD(ctx, op, op.Parameters))
	}

	// Request Body
	if op.RequestBody != nil {
		b.WriteString(renderRequestBodyMD(ctx, op, op.RequestBody))
	}

	// Responses
	if len(op.Responses) > 0 {
		b.WriteString("#### Responses\n\n")
		b.WriteString(renderResponsesMD(ctx, op.Responses))
	}

	// Cross-references
	if op.CrossRefs != nil && len(op.CrossRefs.ReferencesModels) > 0 {
		var names []string
		for _, ref := range op.CrossRefs.ReferencesModels {
			names = append(names, componentRefLabel(ctx, ref))
		}
		b.WriteString("**Models referenced:** " + strings.Join(names, ", ") + "\n\n")
	}

	if related := renderRelatedOperationsMD(ctx, op); related != "" {
		b.WriteString(related)
	}

	if len(op.Extensions) > 0 {
		b.WriteString("#### Extensions\n\n")
		b.WriteString(renderExtensionsMD(op.Extensions))
		b.WriteString("\n")
	}

	return b.String()
}

// renderModelMD renders a single model/component as markdown.
func renderModelMD(ctx llmRenderContext, page *ModelPage) string {
	var b strings.Builder

	b.WriteString("### " + page.Name + "\n\n")

	if page.Description != "" {
		b.WriteString(page.Description + "\n\n")
	}

	if src := renderSourceMetadataRef(page.Source); src != "" {
		b.WriteString(src)
		b.WriteString("\n")
	}

	if summary := renderSchemaSummaryMD(ctx, page.SchemaJSON, nil, nil); summary != "" {
		b.WriteString("#### Schema Summary\n\n")
		b.WriteString(summary)
	}

	if shouldRenderRawSchema(page.SchemaJSON, page.SchemaJSON != "" && renderSchemaSummaryMD(ctx, page.SchemaJSON, nil, nil) != "", false, modelHasLinkedRefs(page)) {
		b.WriteString(renderSchemaBlock(page.SchemaJSON))
		b.WriteString("\n")
	}

	if len(page.Extensions) > 0 {
		b.WriteString("#### Extensions\n\n")
		b.WriteString(renderExtensionsMD(page.Extensions))
		b.WriteString("\n")
	}

	// Cross-references
	if page.CrossRefs != nil {
		if len(page.CrossRefs.UsedByOperations) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsedByOperations {
				refs = append(refs, operationRefLabel(ctx, ref))
			}
			b.WriteString("**Used by:** " + strings.Join(refs, ", ") + "\n\n")
		}
		if len(page.CrossRefs.UsesModels) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsesModels {
				refs = append(refs, componentRefLabel(ctx, ref))
			}
			b.WriteString("**References:** " + strings.Join(refs, ", ") + "\n\n")
		}
		if len(page.CrossRefs.UsedByModels) > 0 {
			var refs []string
			for _, ref := range page.CrossRefs.UsedByModels {
				refs = append(refs, componentRefLabel(ctx, ref))
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
		desc := escapeTableCell(p.Description)
		b.WriteString(fmt.Sprintf("| `%s` | %s | %s | %s |\n",
			escapeTableCell(p.Name), p.In, required, desc))
	}
	return b.String()
}

func renderOperationSecurityMD(ctx llmRenderContext, op *OperationPage) string {
	groups, explicitNone, ok := effectiveSecurityGroups(ctx.site, op)
	if !ok {
		return ""
	}

	var b strings.Builder
	b.WriteString("#### Security\n\n")
	if explicitNone {
		b.WriteString("No authentication required.\n\n")
		return b.String()
	}

	for i, group := range groups {
		if len(groups) > 1 {
			b.WriteString(fmt.Sprintf("Alternative %d:\n", i+1))
		}
		for _, req := range group.Requirements {
			b.WriteString("- **" + req.Name + "**")
			if req.Ref != nil {
				b.WriteString(" (" + componentLinkLabel(ctx, req.Ref) + ")")
			}
			details := make([]string, 0, 4)
			if req.SchemeType != "" {
				if req.Scheme != "" {
					details = append(details, req.SchemeType+"/"+req.Scheme)
				} else {
					details = append(details, req.SchemeType)
				}
			}
			if req.In != "" {
				if req.ParameterName != "" {
					details = append(details, "in "+req.In+" as `"+req.ParameterName+"`")
				} else {
					details = append(details, "in "+req.In)
				}
			}
			if len(req.Scopes) > 0 {
				details = append(details, "scopes: `"+strings.Join(req.Scopes, "`, `")+"`")
			}
			if len(details) > 0 {
				b.WriteString(" — " + strings.Join(details, "; "))
			}
			b.WriteString("\n")
		}
		if len(groups) > 1 {
			b.WriteString("\n")
		}
	}
	b.WriteString("\n")
	return b.String()
}

func renderParameterDetailsMD(ctx llmRenderContext, op *OperationPage, params []*ParameterInfo) string {
	var b strings.Builder
	b.WriteString("#### Parameter Details\n\n")
	for _, p := range params {
		b.WriteString("##### `" + p.Name + "`\n\n")
		meta := []string{
			"**In:** " + p.In,
			fmt.Sprintf("**Required:** %t", p.Required),
		}
		if p.Deprecated {
			meta = append(meta, "**Deprecated:** true")
		}
		b.WriteString(strings.Join(meta, "  \n") + "\n\n")
		if p.Description != "" {
			b.WriteString(p.Description + "\n\n")
		}
		if src := renderSourceMetadataRef(p.Source); src != "" {
			b.WriteString(src)
			b.WriteString("\n")
		}
		if p.Ref != nil {
			b.WriteString("**Parameter ref:** " + componentLinkLabel(ctx, p.Ref) + "\n\n")
		}
		if related := renderParameterProvenanceMD(ctx, p); related != "" {
			b.WriteString(related)
		}
		if guidance := renderParameterGuidanceMD(op, p); guidance != "" {
			b.WriteString(guidance)
		}
		if summary := renderSchemaSummaryMD(ctx, p.SchemaJSON, nil, nil); summary != "" {
			b.WriteString("**Schema summary**\n\n")
			b.WriteString(summary)
		}
		if len(p.Examples) > 0 {
			b.WriteString("Examples:\n")
			for _, name := range sortedStringMapKeys(p.Examples) {
				b.WriteString("- **" + name + "**\n\n")
				b.WriteString(renderSchemaBlock(p.Examples[name]))
				b.WriteString("\n")
			}
		}
		if len(p.Extensions) > 0 {
			b.WriteString("Extensions:\n\n")
			b.WriteString(renderExtensionsMD(p.Extensions))
			b.WriteString("\n")
		}
	}
	return b.String()
}

// renderRequestBodyMD renders request body documentation.
func renderRequestBodyMD(ctx llmRenderContext, op *OperationPage, rb *RequestBodyInfo) string {
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
		if src := renderSourceMetadataRef(rb.Source); src != "" {
			b.WriteString(src)
			b.WriteString("\n")
		}
		if rb.Ref != nil {
			b.WriteString("**Request body ref:** " + componentLinkLabel(ctx, rb.Ref) + "\n\n")
		}
		summary := renderRequestMediaTypeSummaryMD(ctx, op, mt)
		if summary != "" {
			b.WriteString(summary)
		}
		if shouldRenderRawSchema(mt.SchemaJSON, summary != "", requestMediaTypeHasExample(op, mt), requestMediaTypeHasLinkedRefs(mt)) {
			b.WriteString(renderSchemaBlock(mt.SchemaJSON))
			b.WriteString("\n")
		}
		if len(rb.Extensions) > 0 {
			b.WriteString("**Request body extensions**\n\n")
			b.WriteString(renderExtensionsMD(rb.Extensions))
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
func renderResponsesMD(ctx llmRenderContext, responses []*ResponseInfo) string {
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
				if src := renderSourceMetadataRef(resp.Source); src != "" {
					b.WriteString(src)
					b.WriteString("\n")
				}
				summary := renderMediaTypeSummaryMD(ctx, mt)
				if summary != "" {
					b.WriteString(summary)
				}
				if shouldRenderRawSchema(mt.SchemaJSON, summary != "", mediaTypeHasExample(mt), mediaTypeHasLinkedRefs(mt)) {
					if firstCode, seen := seenSchemas[mt.SchemaJSON]; seen {
						b.WriteString(fmt.Sprintf("*Same schema as %s response.*\n\n", firstCode))
					} else {
						seenSchemas[mt.SchemaJSON] = resp.StatusCode
						b.WriteString(renderSchemaBlock(mt.SchemaJSON))
						b.WriteString("\n")
					}
				}
				if len(resp.Headers) > 0 {
					b.WriteString("Headers:\n")
					for _, h := range resp.Headers {
						b.WriteString("- " + renderHeaderSummary(ctx, h) + "\n")
					}
					b.WriteString("\n")
				}
				if len(resp.Links) > 0 {
					b.WriteString("Links:\n")
					for _, link := range resp.Links {
						b.WriteString("- " + renderLinkSummary(ctx, link) + "\n")
					}
					b.WriteString("\n")
				}
				if len(resp.Extensions) > 0 {
					b.WriteString("Extensions:\n\n")
					b.WriteString(renderExtensionsMD(resp.Extensions))
					b.WriteString("\n")
				}
				desc = "" // only show description once per status code
			}
		} else {
			b.WriteString(fmt.Sprintf("**%s**%s\n\n", resp.StatusCode, desc))
		}
	}

	return b.String()
}

func effectiveSecurityGroups(site *Site, op *OperationPage) ([]*SecurityRequirementGroup, bool, bool) {
	if op == nil {
		return nil, false, false
	}
	if op.HasSecurityOverride {
		if len(op.SecurityGroups) == 0 {
			return nil, true, true
		}
		return op.SecurityGroups, false, true
	}
	if site != nil && site.Root != nil && len(site.Root.SecurityGroups) > 0 {
		return site.Root.SecurityGroups, false, true
	}
	return nil, false, false
}

func sanitizeOperationDescription(ctx llmRenderContext, op *OperationPage) string {
	if op == nil {
		return ""
	}
	desc := strings.TrimSpace(op.Description)
	if desc == "" {
		return ""
	}
	if groups, explicitNone, ok := effectiveSecurityGroups(ctx.site, op); ok && !explicitNone && len(groups) > 0 {
		lines := strings.Split(desc, "\n")
		filtered := make([]string, 0, len(lines))
		skipBulletScopes := false
		for _, line := range lines {
			trimmed := strings.TrimSpace(line)
			lower := strings.ToLower(trimmed)
			if strings.HasPrefix(trimmed, "The request will need the following security scope:") ||
				strings.Contains(lower, "security scope") ||
				strings.Contains(lower, "required scope") ||
				strings.Contains(lower, "requires scope") {
				skipBulletScopes = true
				continue
			}
			if skipBulletScopes {
				if strings.HasPrefix(trimmed, "- ") {
					continue
				}
				if trimmed == "" {
					continue
				}
				skipBulletScopes = false
			}
			filtered = append(filtered, line)
		}
		desc = strings.TrimSpace(strings.Join(filtered, "\n"))
	}
	return desc
}

func renderParameterProvenanceMD(ctx llmRenderContext, p *ParameterInfo) string {
	if p == nil || len(p.Extensions) == 0 {
		return ""
	}
	for _, ext := range p.Extensions {
		if ext == nil || ext.Key != "sailpoint-resource-operation-id" {
			continue
		}
		id, ok := ext.Value.(string)
		if !ok || id == "" {
			return ""
		}
		if op := lookupOperationByID(ctx.site, id); op != nil {
			return "**Resource ID source:** " + operationLink(ctx, op.Slug, op.Method+" "+op.Path) +
				" (`" + id + "`)\n\n"
		}
		return "**Resource ID source:** `" + id + "`\n\n"
	}
	return ""
}

func renderOperationIDGuidanceMD(ctx llmRenderContext, op *OperationPage) string {
	lines := collectOperationIDGuidanceLines(ctx, op)
	if len(lines) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("#### How To Find IDs\n\n")
	for _, line := range lines {
		b.WriteString("- " + line + "\n")
	}
	b.WriteString("\n")
	return b.String()
}

func collectOperationIDGuidanceLines(ctx llmRenderContext, op *OperationPage) []string {
	if op == nil {
		return nil
	}
	seen := make(map[string]bool)
	var lines []string
	for _, p := range op.Parameters {
		if p == nil || len(p.Extensions) == 0 {
			continue
		}
		for _, ext := range p.Extensions {
			if ext == nil || ext.Key != "sailpoint-resource-operation-id" {
				continue
			}
			id, ok := ext.Value.(string)
			if !ok || id == "" || seen[p.Name+":"+id] {
				continue
			}
			seen[p.Name+":"+id] = true
			target := "`" + id + "`"
			if linked := lookupOperationByID(ctx.site, id); linked != nil {
				target = operationLink(ctx, linked.Slug, linked.Method+" "+linked.Path)
			}
			if p.Name != "" {
				lines = append(lines, "Find `"+p.Name+"` via "+target+".")
			} else {
				lines = append(lines, "Find the required resource ID via "+target+".")
			}
		}
	}
	return lines
}

func renderParameterGuidanceMD(op *OperationPage, p *ParameterInfo) string {
	if op == nil || p == nil {
		return ""
	}
	name := strings.ToLower(p.Name)
	desc := strings.ToLower(op.Description)
	if name == "sourceorg" && strings.Contains(desc, "source org should be \"default\"") {
		return "**Guidance:** Use `default` when the object mapping is not associated with any particular source org.\n\n"
	}
	return ""
}

func renderCurlMD(op *OperationPage) string {
	if op == nil || op.CurlJSON == "" {
		return ""
	}
	var variants []*CurlVariant
	if err := json.Unmarshal([]byte(op.CurlJSON), &variants); err != nil || len(variants) == 0 {
		return ""
	}
	variants = uniqueCurlVariants(variants)
	if len(variants) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("#### cURL\n\n")
	first := variants[0]
	if first.Label != "" {
		b.WriteString("**Default example:** " + first.Label + "\n\n")
	}
	b.WriteString("```bash\n" + first.Command + "\n```\n\n")
	if len(variants) > 1 {
		b.WriteString("Additional variants:\n")
		for _, variant := range variants[1:] {
			label := variant.Label
			if label == "" {
				label = variant.SecurityLabel
			}
			if label == "" {
				label = variant.ServerURL
			}
			b.WriteString("- " + label + "\n")
		}
		b.WriteString("\n")
	}
	return b.String()
}

func uniqueCurlVariants(variants []*CurlVariant) []*CurlVariant {
	seen := make(map[string]bool)
	out := make([]*CurlVariant, 0, len(variants))
	for _, variant := range variants {
		if variant == nil {
			continue
		}
		command := strings.TrimSpace(variant.Command)
		if command == "" || seen[command] {
			continue
		}
		seen[command] = true
		out = append(out, variant)
	}
	return out
}

func renderRelatedOperationsMD(ctx llmRenderContext, op *OperationPage) string {
	if ctx.site == nil || op == nil {
		return ""
	}
	related := collectRelatedOperations(ctx.site, op)
	if len(related) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("#### Related Operations\n\n")
	for _, rel := range related {
		b.WriteString("- " + operationLink(ctx, rel.Slug, rel.Method+" "+rel.Path))
		if rel.Summary != "" {
			b.WriteString(" — " + singleLine(rel.Summary))
		}
		b.WriteString("\n")
	}
	b.WriteString("\n")
	return b.String()
}

func collectRelatedOperations(site *Site, op *OperationPage) []*OperationPage {
	if site == nil || op == nil {
		return nil
	}
	type candidate struct {
		op    *OperationPage
		score int
	}
	var candidates []candidate
	seen := make(map[string]bool)
	for _, other := range site.Operations {
		if other == nil || other.Slug == op.Slug {
			continue
		}
		score := 0
		if other.Path == op.Path {
			score += 100
		}
		if operationHasResourceOperationID(op, other.OperationID) {
			score += 50
		}
		if shareTag(op, other) {
			score += 2
		}
		if prefix := sharedPathPrefix(op.Path, other.Path); prefix != "" {
			score += strings.Count(prefix, "/")
		}
		if sharedPathPrefix(op.Path, other.Path) != "" && isComplementaryMethod(op.Method, other.Method) {
			score += 8
		}
		if strings.Contains(other.Path, "/object-mappings/") && strings.Contains(op.Path, "/object-mappings/") {
			score += 4
		}
		if score <= 0 {
			continue
		}
		if seen[other.Slug] {
			continue
		}
		seen[other.Slug] = true
		candidates = append(candidates, candidate{op: other, score: score})
	}
	sort.SliceStable(candidates, func(i, j int) bool {
		if candidates[i].score == candidates[j].score {
			return candidates[i].op.Path < candidates[j].op.Path
		}
		return candidates[i].score > candidates[j].score
	})
	limit := 4
	if len(candidates) < limit {
		limit = len(candidates)
	}
	result := make([]*OperationPage, 0, limit)
	for i := 0; i < limit; i++ {
		result = append(result, candidates[i].op)
	}
	return result
}

func operationHasResourceOperationID(op *OperationPage, operationID string) bool {
	if op == nil || operationID == "" {
		return false
	}
	for _, p := range op.Parameters {
		if p == nil {
			continue
		}
		for _, ext := range p.Extensions {
			if ext == nil || ext.Key != "sailpoint-resource-operation-id" {
				continue
			}
			id, ok := ext.Value.(string)
			if ok && id == operationID {
				return true
			}
		}
	}
	return false
}

func isComplementaryMethod(methodA, methodB string) bool {
	a := strings.ToUpper(strings.TrimSpace(methodA))
	b := strings.ToUpper(strings.TrimSpace(methodB))
	switch a {
	case "PATCH", "PUT", "DELETE":
		return b == "GET" || b == "POST"
	case "POST":
		return b == "GET"
	case "GET":
		return b == "POST" || b == "PATCH" || b == "PUT"
	default:
		return false
	}
}

func renderMediaTypeSummaryMD(ctx llmRenderContext, mt *MediaTypeInfo) string {
	if mt == nil {
		return ""
	}
	var b strings.Builder
	if mt.SchemaRef != nil {
		b.WriteString("**Schema ref:** " + componentLinkLabel(ctx, mt.SchemaRef) + "\n\n")
	}
	if mt.ItemsRef != nil {
		b.WriteString("**Array items:** " + componentLinkLabel(ctx, mt.ItemsRef) + "\n\n")
	}
	if summary := renderSchemaSummaryMD(ctx, mt.SchemaJSON, mt.SchemaRef, mt.ItemsRef); summary != "" {
		b.WriteString(summary)
	}
	if mt.MockJSON != "" {
		b.WriteString("**Example payload**\n\n")
		b.WriteString(renderSchemaBlock(mt.MockJSON))
		b.WriteString("\n")
	}
	if len(mt.Examples) > 0 {
		b.WriteString("Examples:\n")
		for _, name := range sortedStringMapKeys(mt.Examples) {
			b.WriteString("- **" + name + "**\n\n")
			b.WriteString(renderSchemaBlock(mt.Examples[name]))
			b.WriteString("\n")
		}
	}
	if len(mt.Extensions) > 0 {
		b.WriteString("Extensions:\n\n")
		b.WriteString(renderExtensionsMD(mt.Extensions))
		b.WriteString("\n")
	}
	return b.String()
}

func renderRequestMediaTypeSummaryMD(ctx llmRenderContext, op *OperationPage, mt *MediaTypeInfo) string {
	if mt == nil {
		return ""
	}
	var b strings.Builder
	if mt.SchemaRef != nil {
		b.WriteString("**Schema ref:** " + componentLinkLabel(ctx, mt.SchemaRef) + "\n\n")
	}
	if mt.ItemsRef != nil {
		b.WriteString("**Array items:** " + componentLinkLabel(ctx, mt.ItemsRef) + "\n\n")
	}
	if summary := renderSchemaSummaryMD(ctx, mt.SchemaJSON, mt.SchemaRef, mt.ItemsRef); summary != "" {
		b.WriteString(summary)
	}
	if patchable := renderPatchablePathsMD(op, mt); patchable != "" {
		b.WriteString(patchable)
	}
	if example := requestExamplePayload(op, mt); example != "" {
		b.WriteString("**Example payload**\n\n")
		b.WriteString(renderSchemaBlock(example))
		b.WriteString("\n")
	}
	if len(mt.Examples) > 0 {
		b.WriteString("Examples:\n")
		for _, name := range sortedStringMapKeys(mt.Examples) {
			b.WriteString("- **" + name + "**\n\n")
			b.WriteString(renderSchemaBlock(mt.Examples[name]))
			b.WriteString("\n")
		}
	}
	if len(mt.Extensions) > 0 {
		b.WriteString("Extensions:\n\n")
		b.WriteString(renderExtensionsMD(mt.Extensions))
		b.WriteString("\n")
	}
	return b.String()
}

func mediaTypeHasExample(mt *MediaTypeInfo) bool {
	if mt == nil {
		return false
	}
	return strings.TrimSpace(mt.MockJSON) != "" || len(mt.Examples) > 0
}

func requestMediaTypeHasExample(op *OperationPage, mt *MediaTypeInfo) bool {
	return strings.TrimSpace(requestExamplePayload(op, mt)) != "" || len(mt.Examples) > 0
}

func mediaTypeHasLinkedRefs(mt *MediaTypeInfo) bool {
	return mt != nil && (mt.SchemaRef != nil || mt.ItemsRef != nil)
}

func requestMediaTypeHasLinkedRefs(mt *MediaTypeInfo) bool {
	return mediaTypeHasLinkedRefs(mt)
}

func modelHasLinkedRefs(page *ModelPage) bool {
	if page == nil || page.CrossRefs == nil {
		return false
	}
	return len(page.CrossRefs.UsesModels) > 0 ||
		len(page.CrossRefs.UsedByModels) > 0 ||
		len(page.CrossRefs.UsedByOperations) > 0
}

func shouldRenderRawSchema(schemaJSON string, hasSummary, hasExample, hasLinkedRefs bool) bool {
	if strings.TrimSpace(schemaJSON) == "" {
		return false
	}
	if !hasSummary {
		return true
	}
	if schemaNeedsRawBlock(schemaJSON) {
		return true
	}
	return !hasExample && !hasLinkedRefs
}

func schemaNeedsRawBlock(schemaJSON string) bool {
	schema := parseJSONMap(schemaJSON)
	if schema == nil {
		return true
	}
	for _, key := range []string{"allOf", "oneOf", "anyOf"} {
		if len(arrayAny(schema[key])) > 0 {
			return true
		}
	}
	return false
}

func renderSchemaSummaryMD(ctx llmRenderContext, schemaJSON string, schemaRef, itemsRef *ComponentLink) string {
	if schemaJSON == "" {
		return ""
	}
	schema := parseJSONMap(schemaJSON)
	if schema == nil {
		return ""
	}

	var b strings.Builder
	if schemaRef != nil {
		b.WriteString("- Reference: " + componentLinkLabel(ctx, schemaRef) + "\n")
	}
	if ref := stringValue(schema["$ref"]); ref != "" {
		b.WriteString("- Reference path: `" + ref + "`\n")
	}
	if typeLine := formatSchemaTypeLine(schema); typeLine != "" {
		b.WriteString("- Type: " + typeLine + "\n")
	}
	if nullable, ok := schema["nullable"].(bool); ok {
		b.WriteString(fmt.Sprintf("- Nullable: `%t`\n", nullable))
	}
	if required := stringSlice(schema["required"]); len(required) > 0 {
		b.WriteString("- Required: `" + strings.Join(required, "`, `") + "`\n")
	}
	if enumVals := renderEnumValues(schema["enum"]); enumVals != "" {
		if enumBullet := renderEnumBullet(schema["enum"]); enumBullet != "" {
			b.WriteString(enumBullet)
		}
	}
	if example := renderInlineValue(schema["example"]); example != "" {
		b.WriteString("- Example: " + example + "\n")
	}
	if def := renderInlineValue(schema["default"]); def != "" {
		b.WriteString("- Default: " + def + "\n")
	}
	for _, key := range []string{"minimum", "maximum", "minLength", "maxLength", "pattern"} {
		if val := renderInlineValue(schema[key]); val != "" {
			b.WriteString("- " + titleCaseKey(key) + ": " + val + "\n")
		}
	}
	if items := nestedObject(schema, "items"); items != nil {
		if itemsRef != nil {
			b.WriteString("- Items model: " + componentLinkLabel(ctx, itemsRef) + "\n")
		} else if itemsType := formatSchemaTypeLine(items); itemsType != "" {
			b.WriteString("- Items type: " + itemsType + "\n")
		}
	}
	for _, compKey := range []string{"allOf", "oneOf", "anyOf"} {
		entries := arrayAny(schema[compKey])
		if len(entries) == 0 {
			continue
		}
		b.WriteString(fmt.Sprintf("- %s: %d entries\n", compKey, len(entries)))
		for _, entry := range entries {
			if ref := stringValue(objectAny(entry)["$ref"]); ref != "" {
				b.WriteString("  - `" + ref + "`\n")
				continue
			}
			if t := formatSchemaTypeLine(objectAny(entry)); t != "" {
				b.WriteString("  - " + t + "\n")
			}
		}
	}

	props := objectAny(schema["properties"])
	if len(props) > 0 {
		b.WriteString("Properties:\n")
		requiredSet := make(map[string]bool)
		for _, name := range stringSlice(schema["required"]) {
			requiredSet[name] = true
		}
		for _, name := range sortedObjectKeys(props) {
			prop := objectAny(props[name])
			line := "- `" + name + "`"
			if t := formatSchemaTypeLine(prop); t != "" {
				line += " (" + t + ")"
			}
			if requiredSet[name] {
				line += " required"
			}
			if desc := stringValue(prop["description"]); desc != "" {
				line += " — " + singleLine(desc)
			}
			if example := renderInlineValue(prop["example"]); example != "" {
				line += " Example: " + example
			}
			b.WriteString(line + "\n")
			if enumBullet := renderPropertyEnumDetails(prop["enum"]); enumBullet != "" {
				b.WriteString(enumBullet)
			}
		}
	}

	if b.Len() == 0 {
		return ""
	}
	b.WriteString("\n")
	return b.String()
}

func renderPatchablePathsMD(op *OperationPage, mt *MediaTypeInfo) string {
	if mt == nil || !strings.EqualFold(mt.MediaType, "application/json-patch+json") {
		return ""
	}
	paths := collectPatchablePaths(op, mt)
	if len(paths) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("**Supported patch paths**\n\n")
	for _, path := range paths {
		b.WriteString("- `" + path + "`\n")
	}
	b.WriteString("\n")
	return b.String()
}

func requestExamplePayload(op *OperationPage, mt *MediaTypeInfo) string {
	if mt == nil {
		return ""
	}
	if strings.EqualFold(mt.MediaType, "application/json-patch+json") {
		if payload := deriveJSONPatchExample(op, mt); payload != "" {
			return payload
		}
	}
	if example := firstStructuredExample(mt.Examples); example != "" {
		return example
	}
	return mt.MockJSON
}

func firstStructuredExample(examples map[string]string) string {
	for _, name := range sortedStringMapKeys(examples) {
		example := strings.TrimSpace(examples[name])
		if example != "" {
			return example
		}
	}
	return ""
}

func deriveJSONPatchExample(op *OperationPage, mt *MediaTypeInfo) string {
	paths := collectPatchablePaths(op, mt)
	if len(paths) == 0 {
		return ""
	}
	values := patchValueExamplesFromResponses(op)
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
	out, err := json.MarshalIndent(ops, "", "  ")
	if err != nil {
		return ""
	}
	return string(out)
}

func collectPatchablePaths(op *OperationPage, mt *MediaTypeInfo) []string {
	if mt == nil {
		return nil
	}
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
	for _, path := range patchPathsFromMockJSON(mt.MockJSON) {
		addPath(path)
	}
	props := responsePropertySchemasMD(op)
	if len(props) > 0 {
		names := make([]string, 0, len(props))
		for name := range props {
			names = append(names, name)
		}
		sort.Strings(names)
		for _, name := range names {
			addPath("/" + name)
		}
	}
	return paths
}

func patchPathsFromMockJSON(raw string) []string {
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

func responsePropertySchemasMD(op *OperationPage) map[string]map[string]any {
	if op == nil {
		return nil
	}
	for _, resp := range op.Responses {
		if resp == nil || !strings.HasPrefix(resp.StatusCode, "2") {
			continue
		}
		for _, mt := range resp.Content {
			schema := parseJSONMap(mt.SchemaJSON)
			if schema == nil {
				continue
			}
			props := objectAny(schema["properties"])
			if len(props) == 0 {
				continue
			}
			out := make(map[string]map[string]any, len(props))
			for name, raw := range props {
				prop := objectAny(raw)
				if len(prop) == 0 {
					continue
				}
				out[name] = prop
			}
			if len(out) > 0 {
				return out
			}
		}
	}
	return nil
}

func patchValueExamplesFromResponses(op *OperationPage) map[string]any {
	props := responsePropertySchemasMD(op)
	if len(props) == 0 {
		return nil
	}
	values := make(map[string]any, len(props))
	for name, schema := range props {
		if value, ok := schemaExampleValue(schema); ok {
			values[name] = value
		}
	}
	return values
}

func schemaExampleValue(schema map[string]any) (any, bool) {
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
		return placeholderValueForSchemaType(rawType)
	case []any:
		for _, item := range rawType {
			typeName, ok := item.(string)
			if !ok || typeName == "null" {
				continue
			}
			return placeholderValueForSchemaType(typeName)
		}
	}
	return nil, false
}

func placeholderValueForSchemaType(typeName string) (any, bool) {
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

func renderExtensionsMD(exts []*ExtensionEntry) string {
	var b strings.Builder
	for _, ext := range exts {
		if ext == nil {
			continue
		}
		b.WriteString("- `" + ext.Key + "`: " + renderInlineValue(ext.Value) + "\n")
	}
	return b.String()
}

func renderHeaderSummary(ctx llmRenderContext, h *HeaderInfo) string {
	if h == nil {
		return ""
	}
	label := "`" + h.Name + "`"
	if h.Ref != nil {
		label += " (" + componentLinkLabel(ctx, h.Ref) + ")"
	}
	if h.SchemaType != "" {
		label += " — " + h.SchemaType
	}
	if h.Description != "" {
		label += " — " + singleLine(h.Description)
	}
	return label
}

func renderLinkSummary(ctx llmRenderContext, link *LinkInfo) string {
	if link == nil {
		return ""
	}
	label := "`" + link.Name + "`"
	if link.OperationSlug != "" {
		target := link.OperationId
		if target == "" {
			target = link.OperationSlug
		}
		label += " -> " + operationLink(ctx, link.OperationSlug, target)
	} else if link.OperationId != "" {
		label += " -> `" + link.OperationId + "`"
	} else if link.OperationRef != "" {
		label += " -> `" + link.OperationRef + "`"
	}
	if link.Description != "" {
		label += " — " + singleLine(link.Description)
	}
	if link.Ref != nil {
		label += " (" + componentLinkLabel(ctx, link.Ref) + ")"
	}
	return label
}

func renderSiteSourceMetadata(source *SourceRef) string {
	if source == nil {
		return ""
	}
	label := sourceLabel(source)
	if label == "" {
		return ""
	}
	if href := strings.TrimSpace(source.Href); href != "" {
		return "**Source spec:** [" + label + "](" + href + ")\n\n"
	}
	return "**Source spec:** `" + label + "`\n\n"
}

func renderSourceMetadataRef(source *SourceRef) string {
	if source == nil {
		return ""
	}
	label := sourceLabel(source)
	if label == "" {
		return ""
	}
	if href := strings.TrimSpace(source.Href); href != "" {
		return "**Source:** [" + label + "](" + href + ")\n\n"
	}
	return "**Source:** `" + label + "`\n\n"
}

func sourceLabel(source *SourceRef) string {
	if source == nil {
		return ""
	}
	label := source.Path
	if label == "" {
		label = source.Href
	}
	if label == "" {
		return ""
	}
	if source.Line > 0 {
		return label + ":" + fmt.Sprintf("%d", source.Line)
	}
	return label
}

func operationLink(ctx llmRenderContext, slug, label string) string {
	if slug == "" {
		return "`" + label + "`"
	}
	return "[" + label + "](" + ctx.operationLinkPrefix + slug + ".md)"
}

func componentLinkLabel(ctx llmRenderContext, ref *ComponentLink) string {
	if ref == nil {
		return ""
	}
	return "[" + ref.Name + "](" + ctx.modelLinkPrefix + ref.TypeSlug + "/" + ref.Slug + ".md)"
}

func componentRefLabel(ctx llmRenderContext, ref *ComponentRef) string {
	if ref == nil {
		return ""
	}
	return "[" + ref.Name + "](" + ctx.modelLinkPrefix + ref.TypeSlug + "/" + ref.Slug + ".md)"
}

func operationRefLabel(ctx llmRenderContext, ref *OperationRef) string {
	if ref == nil {
		return ""
	}
	return operationLink(ctx, ref.Slug, ref.Method+" "+ref.Path)
}

func lookupOperationByID(site *Site, operationID string) *OperationPage {
	if site == nil || operationID == "" {
		return nil
	}
	for _, op := range site.Operations {
		if op.OperationID == operationID {
			return op
		}
	}
	for _, wh := range site.Webhooks {
		if wh.OperationID == operationID {
			return wh
		}
	}
	return nil
}

func parseJSONMap(schemaJSON string) map[string]any {
	var data map[string]any
	if err := json.Unmarshal([]byte(schemaJSON), &data); err != nil {
		return nil
	}
	return data
}

func objectAny(value any) map[string]any {
	m, _ := value.(map[string]any)
	return m
}

func stringValue(value any) string {
	s, _ := value.(string)
	return s
}

func sortedObjectKeys(m map[string]any) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func sortedStringMapKeys(m map[string]string) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func formatSchemaTypeLine(schema map[string]any) string {
	if schema == nil {
		return ""
	}
	typeVal := schema["type"]
	var typ string
	switch v := typeVal.(type) {
	case string:
		typ = "`" + v + "`"
	case []any:
		var vals []string
		for _, item := range v {
			if s, ok := item.(string); ok {
				vals = append(vals, "`"+s+"`")
			}
		}
		typ = strings.Join(vals, " | ")
	}
	if format := stringValue(schema["format"]); format != "" {
		if typ != "" {
			typ += " format `" + format + "`"
		} else {
			typ = "format `" + format + "`"
		}
	}
	return typ
}

func renderEnumValues(value any) string {
	items := arrayAny(value)
	if len(items) == 0 {
		return ""
	}
	parts := make([]string, 0, len(items))
	for _, item := range items {
		if rendered := renderInlineValue(item); rendered != "" {
			parts = append(parts, rendered)
		}
	}
	return strings.Join(parts, ", ")
}

func renderEnumBullet(value any) string {
	items := arrayAny(value)
	if len(items) == 0 {
		return ""
	}
	enumVals := renderEnumValues(value)
	if len(items) <= 6 && len(enumVals) <= 120 {
		return "- Enum: " + enumVals + "\n"
	}
	var b strings.Builder
	b.WriteString("- Allowed values:\n")
	for _, item := range items {
		if rendered := renderInlineValue(item); rendered != "" {
			b.WriteString("  - " + rendered + "\n")
		}
	}
	return b.String()
}

func renderPropertyEnumDetails(value any) string {
	items := arrayAny(value)
	if len(items) == 0 {
		return ""
	}
	enumVals := renderEnumValues(value)
	if len(items) <= 6 && len(enumVals) <= 120 {
		return "  - Enum: " + enumVals + "\n"
	}
	var b strings.Builder
	b.WriteString("  - Allowed values:\n")
	for _, item := range items {
		if rendered := renderInlineValue(item); rendered != "" {
			b.WriteString("    - " + rendered + "\n")
		}
	}
	return b.String()
}

func renderInlineValue(value any) string {
	if value == nil {
		return ""
	}
	switch v := value.(type) {
	case string:
		return "`" + v + "`"
	case float64, bool, int, int32, int64:
		return fmt.Sprintf("`%v`", v)
	case map[string]any, []any:
		raw, err := json.Marshal(v)
		if err != nil {
			return ""
		}
		return "`" + string(raw) + "`"
	default:
		raw, err := json.Marshal(v)
		if err != nil {
			return fmt.Sprintf("`%v`", v)
		}
		return "`" + string(raw) + "`"
	}
}

func titleCaseKey(key string) string {
	switch key {
	case "minLength":
		return "Min length"
	case "maxLength":
		return "Max length"
	default:
		if key == "" {
			return ""
		}
		return strings.ToUpper(key[:1]) + key[1:]
	}
}

func shareTag(a, b *OperationPage) bool {
	if a == nil || b == nil {
		return false
	}
	for _, tagA := range a.Tags {
		for _, tagB := range b.Tags {
			if tagA == tagB && tagA != "" {
				return true
			}
		}
	}
	return false
}

func sharedPathPrefix(a, b string) string {
	if a == "" || b == "" {
		return ""
	}
	segA := strings.Split(strings.Trim(a, "/"), "/")
	segB := strings.Split(strings.Trim(b, "/"), "/")
	n := len(segA)
	if len(segB) < n {
		n = len(segB)
	}
	var shared []string
	for i := 0; i < n; i++ {
		if segA[i] != segB[i] {
			break
		}
		shared = append(shared, segA[i])
	}
	if len(shared) == 0 {
		return ""
	}
	return "/" + strings.Join(shared, "/")
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
