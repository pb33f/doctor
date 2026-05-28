// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"sync"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	. "github.com/pb33f/doctor/printingpress/model"
)

type llmRenderContext struct {
	site                  *Site
	operationLinkPrefix   string
	modelLinkPrefix       string
	cache                 *llmRenderCache
	relatedOperationIndex *llmRelatedOperationIndex
}

type llmRenderCache struct {
	mu              sync.RWMutex
	schemaMaps      map[string]map[string]any
	schemaSummaries map[llmSchemaSummaryKey]string
	rawSchemaNeeds  map[string]bool
}

type llmSchemaSummaryKey struct {
	schemaJSON string
	schemaRef  string
	itemsRef   string
}

func newLLMRenderCache() *llmRenderCache {
	return &llmRenderCache{
		schemaMaps:      make(map[string]map[string]any),
		schemaSummaries: make(map[llmSchemaSummaryKey]string),
		rawSchemaNeeds:  make(map[string]bool),
	}
}

func newLLMRenderContext(site *Site, operationLinkPrefix, modelLinkPrefix string, cache *llmRenderCache) llmRenderContext {
	if cache == nil {
		cache = newLLMRenderCache()
	}
	return llmRenderContext{
		site:                site,
		operationLinkPrefix: operationLinkPrefix,
		modelLinkPrefix:     modelLinkPrefix,
		cache:               cache,
	}
}

func withRelatedOperationIndex(ctx llmRenderContext, index *llmRelatedOperationIndex) llmRenderContext {
	ctx.relatedOperationIndex = index
	return ctx
}

func rootLLMRenderContext(site *Site) llmRenderContext {
	return newLLMRenderContext(site, pppaths.DirOperations+"/", pppaths.DirModels+"/", nil)
}

func operationFileRenderContext(site *Site) llmRenderContext {
	return newLLMRenderContext(site, "", "../"+pppaths.DirModels+"/", nil)
}

func modelFileRenderContext(site *Site) llmRenderContext {
	return newLLMRenderContext(site, "../../"+pppaths.DirOperations+"/", "../../"+pppaths.DirModels+"/", nil)
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

type llmWritePlan struct {
	options               llmOutputOptions
	generateMonoliths     bool
	monolithOmittedReason string
	operationShards       []string
	modelShards           []string
}

func newLLMWritePlan(site *Site) llmWritePlan {
	options := llmOutputOptionsFromSite(site)
	sourceSizeBytes := int64(0)
	if site != nil {
		sourceSizeBytes = site.SourceSizeBytes
	}
	return llmWritePlan{
		options:               options,
		generateMonoliths:     options.shouldGenerateMonoliths(sourceSizeBytes),
		monolithOmittedReason: options.monolithOmittedReason(sourceSizeBytes),
	}
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

	plan := newLLMWritePlan(site)
	relatedOperationIndex := newLLMRelatedOperationIndex(site)
	written := make([]string, 0)
	step := 0
	total := 5 + len(site.Operations) + len(site.Webhooks)
	for _, group := range site.NavModelGroups {
		total += len(site.Models[group.TypeSlug])
	}

	if err := removeLLMShardFiles(resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("removing stale llm shard files: %w", err)
	}

	if plan.generateMonoliths {
		if err := writeLLMAggregateFilesWithRelated(site, resolvedOutputDir, relatedOperationIndex); err != nil {
			return nil, fmt.Errorf("writing llm aggregate files: %w", err)
		}
		written = append(written,
			filepath.Join(resolvedOutputDir, pppaths.FileLLMFull),
			filepath.Join(resolvedOutputDir, pppaths.FileLLMOperations),
			filepath.Join(resolvedOutputDir, pppaths.FileLLMModels),
		)
	} else if err := removeLLMMonolithFiles(resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("removing omitted llm aggregate files: %w", err)
	}
	step++
	if progress != nil {
		progress("writing llm aggregate files", step, total)
	}

	operationShards, err := writeLLMOperationShardsWithRelated(site, resolvedOutputDir, plan.options.MaxAggregateFileBytes, relatedOperationIndex)
	if err != nil {
		return nil, fmt.Errorf("writing llm operation shards: %w", err)
	}
	plan.operationShards = operationShards
	written = append(written, absoluteLLMShardPaths(resolvedOutputDir, operationShards)...)
	step++
	if progress != nil {
		progress("writing llm operation shards", step, total)
	}

	modelShards, err := writeLLMModelShards(site, resolvedOutputDir, plan.options.MaxAggregateFileBytes)
	if err != nil {
		return nil, fmt.Errorf("writing llm model shards: %w", err)
	}
	plan.modelShards = modelShards
	written = append(written, absoluteLLMShardPaths(resolvedOutputDir, modelShards)...)
	step++
	if progress != nil {
		progress("writing llm model shards", step, total)
	}

	if err := writeLLMAgentsGuide(site, resolvedOutputDir, plan); err != nil {
		return nil, fmt.Errorf("writing AGENTS.md: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, pppaths.FileAgentsGuide))
	step++
	if progress != nil {
		progress("writing AGENTS.md", step, total)
	}

	if err := writeLLMIndex(site, resolvedOutputDir, plan); err != nil {
		return nil, fmt.Errorf("writing llms.txt: %w", err)
	}
	written = append(written, filepath.Join(resolvedOutputDir, pppaths.FileLLMIndex))
	step++
	if progress != nil {
		progress("writing llms.txt", step, total)
	}

	operationFiles, err := writeLLMOperationFilesWithRelated(site, resolvedOutputDir, relatedOperationIndex)
	if err != nil {
		return nil, fmt.Errorf("writing operation .md files: %w", err)
	}
	written = append(written, operationFiles...)
	step += len(operationFiles)
	if progress != nil {
		progress("writing llm operation markdown", step, total)
	}

	modelFiles, err := writeLLMModelFiles(site, resolvedOutputDir)
	if err != nil {
		return nil, fmt.Errorf("writing model .md files: %w", err)
	}
	written = append(written, modelFiles...)
	step += len(modelFiles)
	if progress != nil {
		progress("writing llm model markdown", step, total)
	}

	return written, nil
}

func writeLLMAgentsGuide(site *Site, outputDir string, plan llmWritePlan) error {
	return writeBufferedTextFile(filepath.Join(outputDir, pppaths.FileAgentsGuide), func(w io.StringWriter) error {
		title := "API Documentation"
		if site.Root != nil && site.Root.Title != "" {
			title = site.Root.Title
		}
		if err := writeString(w, "# "+title+"\n\n"); err != nil {
			return err
		}

		if site.Root != nil && site.Root.Description != "" {
			if err := writeString(w, "> "+truncateDesc(site.Root.Description, 240)+"\n\n"); err != nil {
				return err
			}
		}
		if src := renderSiteSourceMetadata(site.Source); src != "" {
			if err := writeString(w, src); err != nil {
				return err
			}
		}

		return writeString(w, renderAgentsGuide(site, plan))
	})
}

// writeLLMFull generates the primary llms-full.txt with complete API documentation.
func writeLLMFull(site *Site, outputDir string) error {
	ctx := rootLLMRenderContext(site)
	return writeBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMFull), func(w io.StringWriter) error {
		if err := writeLLMFullPreamble(ctx, w); err != nil {
			return err
		}
		if _, err := writeOperationsSection(ctx, w); err != nil {
			return err
		}
		if _, err := writeWebhooksSection(ctx, w); err != nil {
			return err
		}
		if _, err := writeModelsSection(ctx, w); err != nil {
			return err
		}
		return nil
	})
}

func writeLLMFullPreamble(ctx llmRenderContext, w io.StringWriter) error {
	site := ctx.site
	title := "API Documentation"
	if site.Root != nil && site.Root.Title != "" {
		title = site.Root.Title
	}
	if err := writeString(w, "# "+title+"\n\n"); err != nil {
		return err
	}

	if site.Root != nil && site.Root.Description != "" {
		if err := writeString(w, "> "+singleLine(site.Root.Description)+"\n\n"); err != nil {
			return err
		}
	}
	if site.Root != nil && site.Root.Version != "" {
		if err := writeString(w, "**Version:** "+site.Root.Version+"\n\n"); err != nil {
			return err
		}
	}
	if src := renderSiteSourceMetadata(site.Source); src != "" {
		if err := writeString(w, src); err != nil {
			return err
		}
	}

	howTo := renderHowToUse(site)
	if howTo != "" {
		if err := writeString(w, howTo); err != nil {
			return err
		}
	}
	return nil
}

func writeLLMAggregateFiles(site *Site, outputDir string) error {
	return writeLLMAggregateFilesWithRelated(site, outputDir, newLLMRelatedOperationIndex(site))
}

func writeLLMAggregateFilesWithRelated(site *Site, outputDir string, relatedOperationIndex *llmRelatedOperationIndex) error {
	ctx := withRelatedOperationIndex(rootLLMRenderContext(site), relatedOperationIndex)

	full, err := openBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMFull))
	if err != nil {
		return fmt.Errorf("opening llms-full.txt: %w", err)
	}
	operations, err := openBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMOperations))
	if err != nil {
		_ = full.closeDiscard()
		return fmt.Errorf("opening llms-operations.txt: %w", err)
	}
	models, err := openBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMModels))
	if err != nil {
		_ = full.closeDiscard()
		_ = operations.closeDiscard()
		return fmt.Errorf("opening llms-models.txt: %w", err)
	}

	success := false
	defer func() {
		if !success {
			_ = full.closeDiscard()
			_ = operations.closeDiscard()
			_ = models.closeDiscard()
		}
	}()

	if err := writeLLMFullPreamble(ctx, full.writer); err != nil {
		return err
	}

	operationWriters := multiStringWriter{full.writer, operations.writer}
	wroteOperations, err := writeOperationsSection(ctx, operationWriters)
	if err != nil {
		return err
	}
	wroteWebhooks, err := writeWebhooksSection(ctx, operationWriters)
	if err != nil {
		return err
	}
	if !wroteOperations && !wroteWebhooks {
		if err := writeString(operations.writer, "# Operations\n\nNo operations defined.\n"); err != nil {
			return err
		}
	}

	wroteModels, err := writeModelsSection(ctx, multiStringWriter{full.writer, models.writer})
	if err != nil {
		return err
	}
	if !wroteModels {
		if err := writeString(models.writer, "# Models\n\nNo models defined.\n"); err != nil {
			return err
		}
	}

	success = true
	return closeBufferedTextFiles(full, operations, models)
}

func writeLLMOperationShards(site *Site, outputDir string, maxBytes int64) ([]string, error) {
	return writeLLMOperationShardsWithRelated(site, outputDir, maxBytes, newLLMRelatedOperationIndex(site))
}

func writeLLMOperationShardsWithRelated(site *Site, outputDir string, maxBytes int64, relatedOperationIndex *llmRelatedOperationIndex) ([]string, error) {
	ctx := withRelatedOperationIndex(rootLLMRenderContext(site), relatedOperationIndex)
	writer := newLLMShardWriter(outputDir, "llms-operations", "Operations", maxBytes)
	success := false
	defer func() {
		if !success {
			_ = writer.closeDiscard()
		}
	}()

	wrote := false
	for _, op := range site.Operations {
		if err := writer.writeBlock(renderOperationMD(ctx, op) + "\n---\n\n"); err != nil {
			return nil, err
		}
		wrote = true
	}
	for _, wh := range site.Webhooks {
		if err := writer.writeBlock(renderOperationMD(ctx, wh) + "\n---\n\n"); err != nil {
			return nil, err
		}
		wrote = true
	}
	if !wrote {
		if err := writer.writeBlock("# Operations\n\nNo operations defined.\n"); err != nil {
			return nil, err
		}
	}

	success = true
	return writer.close()
}

func writeLLMModelShards(site *Site, outputDir string, maxBytes int64) ([]string, error) {
	ctx := rootLLMRenderContext(site)
	writer := newLLMShardWriter(outputDir, "llms-models", "Models", maxBytes)
	success := false
	defer func() {
		if !success {
			_ = writer.closeDiscard()
		}
	}()

	wrote := false
	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		for _, page := range pages {
			block := "## " + group.Name + "\n\n" + renderModelMD(ctx, page) + "\n---\n\n"
			if err := writer.writeBlock(block); err != nil {
				return nil, err
			}
			wrote = true
		}
	}
	if !wrote {
		if err := writer.writeBlock("# Models\n\nNo models defined.\n"); err != nil {
			return nil, err
		}
	}

	success = true
	return writer.close()
}

type llmShardWriter struct {
	outputDir    string
	namePrefix   string
	title        string
	maxBytes     int64
	shardIndex   int
	current      *bufferedTextFile
	currentBytes int64
	names        []string
}

func newLLMShardWriter(outputDir, namePrefix, title string, maxBytes int64) *llmShardWriter {
	if maxBytes <= 0 {
		maxBytes = DefaultLLMMaxAggregateFileBytes
	}
	return &llmShardWriter{
		outputDir:  outputDir,
		namePrefix: namePrefix,
		title:      title,
		maxBytes:   maxBytes,
	}
}

func (w *llmShardWriter) writeBlock(block string) error {
	if w.current == nil || (w.currentBytes > 0 && w.currentBytes+int64(len(block)) > w.maxBytes) {
		if err := w.rotate(); err != nil {
			return err
		}
	}
	if _, err := w.current.writer.WriteString(block); err != nil {
		return err
	}
	w.currentBytes += int64(len(block))
	return nil
}

func (w *llmShardWriter) rotate() error {
	if w.current != nil {
		if err := w.current.close(); err != nil {
			return err
		}
	}
	w.shardIndex++
	name := fmt.Sprintf("%s-%04d.txt", w.namePrefix, w.shardIndex)
	file, err := openBufferedTextFile(filepath.Join(w.outputDir, name))
	if err != nil {
		return err
	}
	w.current = file
	w.names = append(w.names, name)
	header := fmt.Sprintf("# %s shard %04d\n\n", w.title, w.shardIndex)
	if _, err := w.current.writer.WriteString(header); err != nil {
		_ = w.current.closeDiscard()
		return err
	}
	w.currentBytes = int64(len(header))
	return nil
}

func (w *llmShardWriter) close() ([]string, error) {
	if w.current == nil {
		return nil, nil
	}
	if err := w.current.close(); err != nil {
		return nil, err
	}
	w.current = nil
	return append([]string(nil), w.names...), nil
}

func (w *llmShardWriter) closeDiscard() error {
	if w.current == nil {
		return nil
	}
	err := w.current.closeDiscard()
	w.current = nil
	return err
}

func absoluteLLMShardPaths(outputDir string, shardNames []string) []string {
	if len(shardNames) == 0 {
		return nil
	}
	paths := make([]string, 0, len(shardNames))
	for _, shardName := range shardNames {
		paths = append(paths, filepath.Join(outputDir, filepath.FromSlash(shardName)))
	}
	return paths
}

func removeLLMMonolithFiles(outputDir string) error {
	for _, name := range []string{pppaths.FileLLMFull, pppaths.FileLLMOperations, pppaths.FileLLMModels} {
		if err := os.Remove(filepath.Join(outputDir, name)); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func removeLLMShardFiles(outputDir string) error {
	entries, err := os.ReadDir(outputDir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	for _, pattern := range []string{"llms-operations-*.txt", "llms-models-*.txt"} {
		for _, entry := range entries {
			match, err := filepath.Match(pattern, entry.Name())
			if err != nil {
				return err
			}
			if !match {
				continue
			}
			if err := os.Remove(filepath.Join(outputDir, entry.Name())); err != nil && !os.IsNotExist(err) {
				return err
			}
		}
	}
	return nil
}

// writeLLMIndex generates the llms.txt discovery index.
func writeLLMIndex(site *Site, outputDir string, plans ...llmWritePlan) error {
	plan := newLLMWritePlan(site)
	if len(plans) > 0 {
		plan = plans[0]
	}
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
	writeLLMFileMap(&b, plan)

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
			if group.TypeSlug == typeSlugPathItems {
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

	return os.WriteFile(filepath.Join(outputDir, pppaths.FileLLMIndex), []byte(b.String()), 0o644)
}

func renderAgentsGuide(site *Site, plans ...llmWritePlan) string {
	plan := newLLMWritePlan(site)
	if len(plans) > 0 {
		plan = plans[0]
	}
	var b strings.Builder

	b.WriteString("## Start Here\n\n")
	b.WriteString("Start with this file to understand the generated artifact set before opening operation or model pages.\n\n")
	b.WriteString("If a page includes **Source** or **Source spec** links, use those for exact provenance and final verification.\n\n")

	if quickStart := renderQuickStart(site); quickStart != "" {
		b.WriteString(quickStart)
	}

	b.WriteString("## Artifact Map\n\n")
	writeLLMFileMap(&b, plan)
	b.WriteString("- `operations/*.md` - One Markdown page per operation or webhook with parameters, security, request/response details, and related links.\n")
	b.WriteString("- `operations/*.json` - One machine-readable JSON artifact per operation or webhook for structured traversal and code generation.\n")
	b.WriteString("- `models/<type>/*.md` - One Markdown page per model or component with schema summaries and cross-links.\n")
	b.WriteString("- `models/<type>/*.json` - One machine-readable JSON artifact per model or component.\n")
	b.WriteString("- `bundle.json`, `index.json`, `nav.json`, `manifest.json` - Top-level machine-readable artifacts for structured traversal of the rendered docs set.\n")
	b.WriteString("- `index.html`, `operations/*.html`, `models/**/*.html` - Optional human-oriented browsing surfaces; use them last for LLM work.\n\n")

	b.WriteString("## Recommended Workflow\n\n")
	b.WriteString("1. Read [llms.txt](llms.txt) to find the most relevant tag, operation, or model family.\n")
	b.WriteString("2. Open the matching `operations/<slug>.md` page for concrete endpoint details and usage guidance.\n")
	b.WriteString("3. Follow links into `models/<type>/<slug>.md` for request and response shapes.\n")
	if plan.generateMonoliths {
		b.WriteString("4. Use [llms-full.txt](llms-full.txt) only when you need broad one-file retrieval or cross-cutting summaries.\n")
	} else {
		b.WriteString("4. Use the sharded LLM aggregate files when you need broad retrieval without loading every detailed page.\n")
	}
	b.WriteString("5. Fall back to source links or optional JSON artifacts when you need exact provenance or structured traversal.\n\n")

	b.WriteString("## Notes\n\n")
	b.WriteString("- [llms.txt](llms.txt) is an index, not the full documentation corpus.\n")
	b.WriteString("- Operation and model Markdown files are the preferred detailed reading surface for agents.\n")
	b.WriteString("- HTML is useful for human browsing, but it carries more layout noise than Markdown or JSON.\n")

	return b.String()
}

func writeLLMFileMap(b *strings.Builder, plan llmWritePlan) {
	b.WriteString("- [AGENTS.md](AGENTS.md) - Start-here guide for agents: artifact map and recommended workflow\n")
	b.WriteString("- [llms.txt](llms.txt) - Compact discovery index for tags, operations, and model groups\n")
	if plan.generateMonoliths {
		b.WriteString("- [llms-full.txt](llms-full.txt) - Complete API documentation in one file\n")
		b.WriteString("- [llms-operations.txt](llms-operations.txt) - All operations only\n")
		b.WriteString("- [llms-models.txt](llms-models.txt) - All models/components only\n")
	} else if plan.monolithOmittedReason != "" {
		b.WriteString("- Monolithic LLM aggregate files were omitted because " + plan.monolithOmittedReason + ".\n")
	}
	writeLLMShardMap(b, "Operation shard", plan.operationShards)
	writeLLMShardMap(b, "Model shard", plan.modelShards)
	b.WriteString("\n")
}

func writeLLMShardMap(b *strings.Builder, title string, shardNames []string) {
	if len(shardNames) == 0 {
		return
	}
	for i, shardName := range shardNames {
		b.WriteString(fmt.Sprintf("- [%s](%s) - %s %d\n", shardName, shardName, title, i+1))
	}
}

// writeLLMOperationsSlice generates llms-operations.txt with all operations and webhooks.
func writeLLMOperationsSlice(site *Site, outputDir string) error {
	return writeLLMOperationsSliceWithRelated(site, outputDir, newLLMRelatedOperationIndex(site))
}

func writeLLMOperationsSliceWithRelated(site *Site, outputDir string, relatedOperationIndex *llmRelatedOperationIndex) error {
	ctx := withRelatedOperationIndex(rootLLMRenderContext(site), relatedOperationIndex)
	return writeBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMOperations), func(w io.StringWriter) error {
		wroteOperations, err := writeOperationsSection(ctx, w)
		if err != nil {
			return err
		}

		wroteWebhooks, err := writeWebhooksSection(ctx, w)
		if err != nil {
			return err
		}

		if !wroteOperations && !wroteWebhooks {
			return writeString(w, "# Operations\n\nNo operations defined.\n")
		}

		return nil
	})
}

// writeLLMModelsSlice generates llms-models.txt with all model/component sections.
func writeLLMModelsSlice(site *Site, outputDir string) error {
	ctx := rootLLMRenderContext(site)
	return writeBufferedTextFile(filepath.Join(outputDir, pppaths.FileLLMModels), func(w io.StringWriter) error {
		wroteModels, err := writeModelsSection(ctx, w)
		if err != nil {
			return err
		}

		if !wroteModels {
			return writeString(w, "# Models\n\nNo models defined.\n")
		}

		return nil
	})
}

// writeLLMOperationFiles writes individual .md files for each operation and webhook.
func writeLLMOperationFiles(site *Site, outputDir string) ([]string, error) {
	return writeLLMOperationFilesWithRelated(site, outputDir, newLLMRelatedOperationIndex(site))
}

func writeLLMOperationFilesWithRelated(site *Site, outputDir string, relatedOperationIndex *llmRelatedOperationIndex) ([]string, error) {
	ctx := withRelatedOperationIndex(operationFileRenderContext(site), relatedOperationIndex)
	tasks := make([]llmMarkdownFileTask, 0, len(site.Operations)+len(site.Webhooks))
	for _, op := range site.Operations {
		path := filepath.Join(outputDir, filepath.FromSlash(pppaths.OperationMarkdown(op.Slug)))
		op := op
		tasks = append(tasks, llmMarkdownFileTask{
			path:  path,
			label: "operation " + op.Slug,
			render: func() string {
				return renderOperationMD(ctx, op)
			},
		})
	}
	for _, wh := range site.Webhooks {
		path := filepath.Join(outputDir, filepath.FromSlash(pppaths.OperationMarkdown(wh.Slug)))
		wh := wh
		tasks = append(tasks, llmMarkdownFileTask{
			path:  path,
			label: "webhook " + wh.Slug,
			render: func() string {
				return renderOperationMD(ctx, wh)
			},
		})
	}
	return writeLLMMarkdownFiles(tasks)
}

// writeLLMModelFiles writes individual .md files for each model.
func writeLLMModelFiles(site *Site, outputDir string) ([]string, error) {
	ctx := modelFileRenderContext(site)
	var tasks []llmMarkdownFileTask
	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		for _, page := range pages {
			path := filepath.Join(outputDir, filepath.FromSlash(pppaths.ModelMarkdown(group.TypeSlug, page.Slug)))
			page := page
			groupSlug := group.TypeSlug
			tasks = append(tasks, llmMarkdownFileTask{
				path:  path,
				label: "model " + groupSlug + "/" + page.Slug,
				render: func() string {
					return renderModelMD(ctx, page)
				},
			})
		}
	}
	return writeLLMMarkdownFiles(tasks)
}

type bufferedTextFile struct {
	file   *os.File
	writer *bufio.Writer
}

func openBufferedTextFile(path string) (*bufferedTextFile, error) {
	file, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		return nil, err
	}
	return &bufferedTextFile{
		file:   file,
		writer: bufio.NewWriterSize(file, 256*1024),
	}, nil
}

func writeBufferedTextFile(path string, write func(io.StringWriter) error) (err error) {
	file, err := openBufferedTextFile(path)
	if err != nil {
		return err
	}
	success := false
	defer func() {
		if !success {
			_ = file.closeDiscard()
		}
	}()
	if err = write(file.writer); err != nil {
		return err
	}
	if err = file.close(); err != nil {
		return err
	}
	success = true
	return nil
}

func closeBufferedTextFiles(files ...*bufferedTextFile) error {
	var firstErr error
	for _, file := range files {
		if err := file.close(); err != nil {
			if firstErr == nil {
				firstErr = err
			}
		}
	}
	return firstErr
}

func (f *bufferedTextFile) close() error {
	if err := f.writer.Flush(); err != nil {
		_ = f.file.Close()
		return err
	}
	return f.file.Close()
}

func (f *bufferedTextFile) closeDiscard() error {
	_ = f.writer.Flush()
	return f.file.Close()
}

func writeString(w io.StringWriter, s string) error {
	_, err := w.WriteString(s)
	return err
}

type multiStringWriter []io.StringWriter

func (w multiStringWriter) WriteString(s string) (int, error) {
	for _, writer := range w {
		if _, err := writer.WriteString(s); err != nil {
			return 0, err
		}
	}
	return len(s), nil
}

type llmMarkdownFileTask struct {
	path   string
	label  string
	render func() string
}

func writeLLMMarkdownFiles(tasks []llmMarkdownFileTask) ([]string, error) {
	if len(tasks) == 0 {
		return nil, nil
	}

	workers := llmMarkdownFileWorkers(len(tasks))
	jobs := make(chan int)
	taskErrors := make([]error, len(tasks))
	written := make([]string, len(tasks))

	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for taskIndex := range jobs {
				task := tasks[taskIndex]
				if err := os.MkdirAll(filepath.Dir(task.path), 0o755); err != nil {
					taskErrors[taskIndex] = fmt.Errorf("creating directory for %s: %w", task.label, err)
					continue
				}
				if err := os.WriteFile(task.path, []byte(task.render()), 0o644); err != nil {
					taskErrors[taskIndex] = fmt.Errorf("writing %s: %w", task.label, err)
					continue
				}
				written[taskIndex] = task.path
			}
		}()
	}

	for i := range tasks {
		jobs <- i
	}
	close(jobs)
	wg.Wait()

	for _, err := range taskErrors {
		if err != nil {
			return nil, err
		}
	}
	return written, nil
}

func llmMarkdownFileWorkers(taskCount int) int {
	if taskCount <= 1 {
		return taskCount
	}
	workers := runtime.GOMAXPROCS(0)
	if workers > 8 {
		workers = 8
	}
	if workers > taskCount {
		workers = taskCount
	}
	return workers
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
	var b strings.Builder
	_, _ = writeOperationsSection(ctx, &b)
	return b.String()
}

func writeOperationsSection(ctx llmRenderContext, w io.StringWriter) (bool, error) {
	site := ctx.site
	if len(site.Operations) == 0 {
		return false, nil
	}

	if err := writeString(w, "## Operations\n\n"); err != nil {
		return false, err
	}

	// Build slug→OperationPage lookup
	opLookup := make(map[string]*OperationPage)
	for _, op := range site.Operations {
		opLookup[op.Slug] = op
	}

	seen := make(map[string]bool)

	// Walk tags tree to render operations grouped by tag
	wrote := false
	var walkTags func(tags []*NavTag, depth int) error
	walkTags = func(tags []*NavTag, depth int) error {
		for _, tag := range tags {
			if len(tag.Operations) == 0 && len(tag.Children) == 0 {
				continue
			}
			heading := strings.Repeat("#", depth+2)
			if err := writeString(w, heading+" "+tag.Name+"\n\n"); err != nil {
				return err
			}
			if tag.Summary != "" {
				if err := writeString(w, tag.Summary+"\n\n"); err != nil {
					return err
				}
			}
			for _, navOp := range tag.Operations {
				if seen[navOp.Slug] {
					continue
				}
				seen[navOp.Slug] = true
				if op, ok := opLookup[navOp.Slug]; ok {
					if err := writeString(w, renderOperationMD(ctx, op)); err != nil {
						return err
					}
					if err := writeString(w, "\n---\n\n"); err != nil {
						return err
					}
					wrote = true
				}
			}
			if err := walkTags(tag.Children, depth+1); err != nil {
				return err
			}
		}
		return nil
	}
	if err := walkTags(site.NavTags, 1); err != nil {
		return false, err
	}

	// Render untagged operations
	var untagged []*OperationPage
	for _, op := range site.Operations {
		if !seen[op.Slug] {
			untagged = append(untagged, op)
		}
	}
	if len(untagged) > 0 {
		if err := writeString(w, "### Untagged Operations\n\n"); err != nil {
			return false, err
		}
		for _, op := range untagged {
			if err := writeString(w, renderOperationMD(ctx, op)); err != nil {
				return false, err
			}
			if err := writeString(w, "\n---\n\n"); err != nil {
				return false, err
			}
			wrote = true
		}
	}

	return wrote, nil
}

// renderWebhooksSection renders the "## Webhooks" section.
func renderWebhooksSection(ctx llmRenderContext) string {
	var b strings.Builder
	_, _ = writeWebhooksSection(ctx, &b)
	return b.String()
}

func writeWebhooksSection(ctx llmRenderContext, w io.StringWriter) (bool, error) {
	site := ctx.site
	if len(site.Webhooks) == 0 {
		return false, nil
	}

	if err := writeString(w, "## Webhooks\n\n"); err != nil {
		return false, err
	}

	for _, wh := range site.Webhooks {
		if err := writeString(w, renderOperationMD(ctx, wh)); err != nil {
			return false, err
		}
		if err := writeString(w, "\n---\n\n"); err != nil {
			return false, err
		}
	}

	return true, nil
}

// renderModelsSection renders all model/component group sections.
func renderModelsSection(ctx llmRenderContext) string {
	var b strings.Builder
	_, _ = writeModelsSection(ctx, &b)
	return b.String()
}

func writeModelsSection(ctx llmRenderContext, w io.StringWriter) (bool, error) {
	site := ctx.site
	if len(site.NavModelGroups) == 0 {
		return false, nil
	}

	wrote := false

	for _, group := range site.NavModelGroups {
		pages := site.Models[group.TypeSlug]
		if len(pages) == 0 {
			continue
		}
		if err := writeString(w, "## "+group.Name+"\n\n"); err != nil {
			return false, err
		}
		for _, page := range pages {
			if err := writeString(w, renderModelMD(ctx, page)); err != nil {
				return false, err
			}
			if err := writeString(w, "\n---\n\n"); err != nil {
				return false, err
			}
			wrote = true
		}
	}

	return wrote, nil
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

	if codeSamples := renderCodeSamplesMD(op.CodeSamples); codeSamples != "" {
		b.WriteString(codeSamples)
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

	summary := renderSchemaSummaryMD(ctx, page.SchemaJSON, nil, nil)
	if summary != "" {
		b.WriteString("#### Schema Summary\n\n")
		b.WriteString(summary)
	}

	if shouldRenderRawSchemaWithContext(ctx, page.SchemaJSON, summary != "", false, modelHasLinkedRefs(page)) {
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
		if shouldRenderRawSchemaWithContext(ctx, mt.SchemaJSON, summary != "", requestMediaTypeHasExample(op, mt), requestMediaTypeHasLinkedRefs(mt)) {
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
				if shouldRenderRawSchemaWithContext(ctx, mt.SchemaJSON, summary != "", mediaTypeHasExample(mt), mediaTypeHasLinkedRefs(mt)) {
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

func renderCodeSamplesMD(samples []*CodeSample) string {
	if len(samples) == 0 {
		return ""
	}
	var b strings.Builder
	for i, sample := range samples {
		if sample == nil || strings.TrimSpace(sample.Source) == "" {
			continue
		}
		if b.Len() == 0 {
			b.WriteString("#### Code Samples\n\n")
		}
		b.WriteString("**" + codeSampleMarkdownLabel(sample, i) + "**\n\n")
		fence := markdownCodeFence(sample.Source)
		language := markdownFenceLanguage(sample.Lang)
		b.WriteString(fence + language + "\n")
		b.WriteString(strings.TrimRight(sample.Source, "\n"))
		b.WriteString("\n" + fence + "\n\n")
	}
	return b.String()
}

func codeSampleMarkdownLabel(sample *CodeSample, index int) string {
	// Markdown has no separate tab label and panel heading, so preserve both names when they differ.
	if sample.Lang != "" && sample.Label != "" && sample.Label != sample.Lang {
		return singleLine(sample.Lang + " - " + sample.Label)
	}
	return sample.DisplayLabel(index)
}

func markdownCodeFence(source string) string {
	fence := "```"
	for strings.Contains(source, fence) {
		fence += "`"
	}
	return fence
}

func markdownFenceLanguage(language string) string {
	language = strings.TrimSpace(language)
	if language == "" {
		return ""
	}
	var b strings.Builder
	for _, r := range language {
		if r >= 'a' && r <= 'z' ||
			r >= 'A' && r <= 'Z' ||
			r >= '0' && r <= '9' ||
			r == '-' || r == '_' || r == '+' || r == '#' || r == '.' {
			b.WriteRune(r)
		}
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
	related := collectRelatedOperationsWithIndex(ctx.site, op, ctx.relatedOperationIndex)
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
	return collectRelatedOperationsWithIndex(site, op, nil)
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
	return shouldRenderRawSchemaWithContext(llmRenderContext{}, schemaJSON, hasSummary, hasExample, hasLinkedRefs)
}

func shouldRenderRawSchemaWithContext(ctx llmRenderContext, schemaJSON string, hasSummary, hasExample, hasLinkedRefs bool) bool {
	if strings.TrimSpace(schemaJSON) == "" {
		return false
	}
	if !hasSummary {
		return true
	}
	if schemaNeedsRawBlockWithContext(ctx, schemaJSON) {
		return true
	}
	return !hasExample && !hasLinkedRefs
}

func schemaNeedsRawBlock(schemaJSON string) bool {
	return schemaNeedsRawBlockWithContext(llmRenderContext{}, schemaJSON)
}

func schemaNeedsRawBlockWithContext(ctx llmRenderContext, schemaJSON string) bool {
	if ctx.cache != nil {
		ctx.cache.mu.RLock()
		needs, ok := ctx.cache.rawSchemaNeeds[schemaJSON]
		ctx.cache.mu.RUnlock()
		if ok {
			return needs
		}
	}

	schema := parseJSONMapWithContext(ctx, schemaJSON)
	if schema == nil {
		cacheRawSchemaNeeds(ctx, schemaJSON, true)
		return true
	}
	for _, key := range []string{"allOf", "oneOf", "anyOf"} {
		if len(arrayAny(schema[key])) > 0 {
			cacheRawSchemaNeeds(ctx, schemaJSON, true)
			return true
		}
	}
	cacheRawSchemaNeeds(ctx, schemaJSON, false)
	return false
}

func renderSchemaSummaryMD(ctx llmRenderContext, schemaJSON string, schemaRef, itemsRef *ComponentLink) string {
	if schemaJSON == "" {
		return ""
	}

	schemaRefLabel := ""
	if schemaRef != nil {
		schemaRefLabel = componentLinkLabel(ctx, schemaRef)
	}
	itemsRefLabel := ""
	if itemsRef != nil {
		itemsRefLabel = componentLinkLabel(ctx, itemsRef)
	}
	key := llmSchemaSummaryKey{
		schemaJSON: schemaJSON,
		schemaRef:  schemaRefLabel,
		itemsRef:   itemsRefLabel,
	}
	if ctx.cache != nil {
		ctx.cache.mu.RLock()
		summary, ok := ctx.cache.schemaSummaries[key]
		ctx.cache.mu.RUnlock()
		if ok {
			return summary
		}
	}

	schema := parseJSONMapWithContext(ctx, schemaJSON)
	if schema == nil {
		cacheSchemaSummary(ctx, key, "")
		return ""
	}

	var b strings.Builder
	if schemaRefLabel != "" {
		b.WriteString("- Reference: " + schemaRefLabel + "\n")
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
		if itemsRefLabel != "" {
			b.WriteString("- Items model: " + itemsRefLabel + "\n")
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
		cacheSchemaSummary(ctx, key, "")
		return ""
	}
	b.WriteString("\n")
	summary := b.String()
	cacheSchemaSummary(ctx, key, summary)
	return summary
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

func parseJSONMapWithContext(ctx llmRenderContext, schemaJSON string) map[string]any {
	if ctx.cache == nil {
		return parseJSONMap(schemaJSON)
	}

	ctx.cache.mu.RLock()
	schema, ok := ctx.cache.schemaMaps[schemaJSON]
	ctx.cache.mu.RUnlock()
	if ok {
		return schema
	}

	schema = parseJSONMap(schemaJSON)
	ctx.cache.mu.Lock()
	ctx.cache.schemaMaps[schemaJSON] = schema
	ctx.cache.mu.Unlock()
	return schema
}

func cacheSchemaSummary(ctx llmRenderContext, key llmSchemaSummaryKey, summary string) {
	if ctx.cache == nil {
		return
	}
	ctx.cache.mu.Lock()
	ctx.cache.schemaSummaries[key] = summary
	ctx.cache.mu.Unlock()
}

func cacheRawSchemaNeeds(ctx llmRenderContext, schemaJSON string, needs bool) {
	if ctx.cache == nil {
		return
	}
	ctx.cache.mu.Lock()
	ctx.cache.rawSchemaNeeds[schemaJSON] = needs
	ctx.cache.mu.Unlock()
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
	segA := operationPathSegments(a)
	segB := operationPathSegments(b)
	shared := sharedPathSegmentCount(segA, segB)
	if shared == 0 {
		return ""
	}
	return "/" + strings.Join(segA[:shared], "/")
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
