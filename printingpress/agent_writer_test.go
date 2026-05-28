// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bufio"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func buildTestSite(t *testing.T, specPath string) *Site {
	t.Helper()
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Test API"})
	site, err := pp.pressSite()
	require.NoError(t, err)
	return site
}

func TestWriteLLMSite_BurgerShop(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	// Verify all top-level files exist
	assert.FileExists(t, filepath.Join(outputDir, "AGENTS.md"))
	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models.txt"))

	agentsBytes, err := os.ReadFile(filepath.Join(outputDir, "AGENTS.md"))
	require.NoError(t, err)
	agents := string(agentsBytes)
	assert.Contains(t, agents, "## Start Here")
	assert.Contains(t, agents, "[llms.txt](llms.txt)")
	assert.Contains(t, agents, "`operations/*.md`")
	assert.Contains(t, agents, "`operations/*.json`")
	assert.Contains(t, agents, "`models/<type>/*.json`")
	assert.Contains(t, agents, "`bundle.json`, `index.json`, `nav.json`, `manifest.json`")

	// Verify llms-full.txt content
	fullBytes, err := os.ReadFile(filepath.Join(outputDir, "llms-full.txt"))
	require.NoError(t, err)
	full := string(fullBytes)

	assert.Contains(t, full, "# Test API")
	assert.Contains(t, full, "## How to Use This API")
	assert.Contains(t, full, "## Operations")
	assert.Contains(t, full, "### POST /burgers")
	assert.Contains(t, full, "### GET /burgers")
	assert.Contains(t, full, "## Schemas")
	assert.Contains(t, full, "### Burger")
	assert.Contains(t, full, "### Error")

	// Verify webhooks section
	assert.Contains(t, full, "## Webhooks")
	assert.Contains(t, full, "someHook")

	// Verify llms.txt index content
	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	idx := string(indexBytes)

	assert.Contains(t, idx, "# Test API")
	assert.Contains(t, idx, "AGENTS.md")
	assert.Contains(t, idx, "llms-full.txt")
	assert.Contains(t, idx, "## Operations")
	assert.Contains(t, idx, "## Webhooks")
	assert.Contains(t, idx, "## Models")
	assert.Less(t, strings.Index(idx, "AGENTS.md"), strings.Index(idx, "llms-full.txt"))

	// Verify individual operation files
	for _, op := range site.Operations {
		assert.FileExists(t, filepath.Join(outputDir, "operations", op.Slug+".md"))
	}

	// Verify individual webhook files
	for _, wh := range site.Webhooks {
		assert.FileExists(t, filepath.Join(outputDir, "operations", wh.Slug+".md"))
	}

	// Verify model files
	for _, group := range site.NavModelGroups {
		for _, m := range group.Models {
			assert.FileExists(t, filepath.Join(outputDir, "models", m.TypeSlug, m.Slug+".md"))
		}
	}
}

func TestWriteLLMSite_PetStore(t *testing.T) {
	site := buildTestSite(t, "../test_specs/petstorev3.json")
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	fullBytes, err := os.ReadFile(filepath.Join(outputDir, "llms-full.txt"))
	require.NoError(t, err)
	full := string(fullBytes)

	assert.Contains(t, full, "## Operations")
	assert.Contains(t, full, "## Schemas")

	// Verify schemas exist as individual files
	schemas := site.Models["schemas"]
	for _, s := range schemas {
		assert.FileExists(t, filepath.Join(outputDir, "models", "schemas", s.Slug+".md"))
	}
}

func TestWriteLLMSite_UsesConfigOutputDir(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	outputDir := t.TempDir()
	pp := newPressEngine(&pressEngineConfig{
		DrDoc:     drDoc,
		Title:     "Test API",
		OutputDir: outputDir,
	})
	site, err := pp.pressSite()
	require.NoError(t, err)

	err = WriteLLMSite(site, "")
	require.NoError(t, err)

	assert.FileExists(t, filepath.Join(outputDir, "AGENTS.md"))
	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-full.txt"))
}

func TestWriteLLMSite_OmitsMonolithsForLargeSource(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")
	site.SourceSizeBytes = DefaultLLMAggregateSpecSizeThresholdBytes + 1
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	assert.NoFileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-operations.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-models.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations-0001.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models-0001.txt"))

	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	index := string(indexBytes)
	assert.Contains(t, index, "Monolithic LLM aggregate files were omitted")
	assert.Contains(t, index, "above the 20 MiB monolithic LLM threshold")
	assert.Contains(t, index, "llms-operations-0001.txt")
	assert.Contains(t, index, "llms-models-0001.txt")
	assert.NotContains(t, index, "[llms-full.txt]")

	agentsBytes, err := os.ReadFile(filepath.Join(outputDir, "AGENTS.md"))
	require.NoError(t, err)
	agents := string(agentsBytes)
	assert.Contains(t, agents, "Use the sharded LLM aggregate files")
	assert.NotContains(t, agents, "[llms-full.txt]")
}

func TestWriteLLMSite_AlwaysWritesMonolithsForLargeSource(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")
	site.SourceSizeBytes = DefaultLLMAggregateSpecSizeThresholdBytes + 1
	site.LLM = LLMOutputConfig{GenerateMonoliths: LLMGenerateMonolithsAlways}
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	assert.FileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations-0001.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models-0001.txt"))
}

func TestWriteLLMSite_NeverWritesMonolithsForSmallSource(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")
	site.SourceSizeBytes = 512
	site.LLM = LLMOutputConfig{GenerateMonoliths: LLMGenerateMonolithsNever}
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	assert.NoFileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-operations.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-models.txt"))
	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(indexBytes), "disabled by configuration")
}

func TestWriteLLMSite_SplitsAggregateShardsAndRemovesStaleFiles(t *testing.T) {
	site := llmShardTestSite()
	site.LLM = LLMOutputConfig{
		MaxAggregateFileBytes: 150,
		GenerateMonoliths:     LLMGenerateMonolithsNever,
	}
	outputDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, "llms-full.txt"), []byte("stale"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, "llms-operations-9999.txt"), []byte("stale"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(outputDir, "llms-models-9999.txt"), []byte("stale"), 0o644))

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	assert.NoFileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-operations-9999.txt"))
	assert.NoFileExists(t, filepath.Join(outputDir, "llms-models-9999.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations-0001.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations-0002.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models-0001.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models-0002.txt"))

	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	index := string(indexBytes)
	assert.Less(t, strings.Index(index, "llms-operations-0001.txt"), strings.Index(index, "llms-operations-0002.txt"))
	assert.Less(t, strings.Index(index, "llms-models-0001.txt"), strings.Index(index, "llms-models-0002.txt"))
}

func TestWriteLLMSiteProgressReachesTotal(t *testing.T) {
	site := llmShardTestSite()
	var lastCompleted, lastTotal int

	_, err := writeLLMSiteDetailed(site, t.TempDir(), func(_ string, completed, total int) {
		lastCompleted = completed
		lastTotal = total
	})
	require.NoError(t, err)

	assert.Equal(t, lastTotal, lastCompleted)
	assert.Equal(t, 5+len(site.Operations)+len(site.Webhooks)+len(site.Models["schemas"]), lastTotal)
}

func TestWriteLLMSite_EmptySiteWritesFallbackShards(t *testing.T) {
	site := &Site{Root: &RootPage{Title: "Empty API"}, Models: map[string][]*ModelPage{}}
	outputDir := t.TempDir()

	err := WriteLLMSite(site, outputDir)
	require.NoError(t, err)

	operations, err := os.ReadFile(filepath.Join(outputDir, "llms-operations-0001.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(operations), "No operations defined.")

	models, err := os.ReadFile(filepath.Join(outputDir, "llms-models-0001.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(models), "No models defined.")
}

func TestWriteLLMOperationShards_OpenError(t *testing.T) {
	_, err := writeLLMOperationShards(llmShardTestSite(), filepath.Join(t.TempDir(), "missing"), 128)

	require.Error(t, err)
}

func TestWriteLLMModelShards_OpenError(t *testing.T) {
	_, err := writeLLMModelShards(llmShardTestSite(), filepath.Join(t.TempDir(), "missing"), 128)

	require.Error(t, err)
}

func TestLLMWritePlanNilSiteUsesDefaults(t *testing.T) {
	plan := newLLMWritePlan(nil)

	assert.True(t, plan.generateMonoliths)
	assert.Empty(t, plan.monolithOmittedReason)
	assert.Equal(t, DefaultLLMMaxAggregateFileBytes, plan.options.MaxAggregateFileBytes)
}

func TestLLMShardWriterHelpers(t *testing.T) {
	outputDir := t.TempDir()
	writer := newLLMShardWriter(outputDir, "test-shard", "Test", 0)
	assert.Equal(t, DefaultLLMMaxAggregateFileBytes, writer.maxBytes)
	require.NoError(t, writer.writeBlock("first\n"))
	require.NoError(t, writer.writeBlock("second\n"))

	names, err := writer.close()
	require.NoError(t, err)
	assert.Equal(t, []string{"test-shard-0001.txt"}, names)
	assert.Equal(t, []string{filepath.Join(outputDir, "test-shard-0001.txt")}, absoluteLLMShardPaths(outputDir, names))
	assert.Nil(t, absoluteLLMShardPaths(outputDir, nil))

	closed, err := writer.close()
	require.NoError(t, err)
	assert.Nil(t, closed)

	discard := newLLMShardWriter(outputDir, "discard-shard", "Discard", 32)
	require.NoError(t, discard.closeDiscard())
	require.NoError(t, discard.writeBlock("discard\n"))
	require.NoError(t, discard.closeDiscard())
}

func TestLLMShardWriterReportsCloseError(t *testing.T) {
	writer := newLLMShardWriter(t.TempDir(), "close-error", "Close Error", 64)
	require.NoError(t, writer.writeBlock("body\n"))
	require.NoError(t, writer.current.file.Close())

	_, err := writer.close()

	require.Error(t, err)
}

func TestLLMShardWriterReportsRotateCloseError(t *testing.T) {
	writer := newLLMShardWriter(t.TempDir(), "rotate-error", "Rotate Error", 64)
	require.NoError(t, writer.writeBlock("body\n"))
	require.NoError(t, writer.current.file.Close())

	err := writer.rotate()

	require.Error(t, err)
}

func TestLLMShardWriterReportsLargeBlockWriteError(t *testing.T) {
	writer := newLLMShardWriter(t.TempDir(), "block-error", "Block Error", 512*1024)
	require.NoError(t, writer.rotate())
	require.NoError(t, writer.current.file.Close())

	err := writer.writeBlock(strings.Repeat("x", 300*1024))

	require.Error(t, err)
}

func TestRemoveLLMFilesIgnoresMissingFiles(t *testing.T) {
	outputDir := t.TempDir()

	require.NoError(t, removeLLMMonolithFiles(outputDir))
	require.NoError(t, removeLLMShardFiles(outputDir))
}

func TestRemoveLLMShardFilesMatchesBasenamesInLiteralOutputDir(t *testing.T) {
	root := t.TempDir()
	outputDir := filepath.Join(root, "api[1]")
	siblingDir := filepath.Join(root, "api1")
	require.NoError(t, os.Mkdir(outputDir, 0o755))
	require.NoError(t, os.Mkdir(siblingDir, 0o755))
	selectedShard := filepath.Join(outputDir, "llms-operations-0001.txt")
	siblingShard := filepath.Join(siblingDir, "llms-operations-0001.txt")
	require.NoError(t, os.WriteFile(selectedShard, []byte("stale"), 0o644))
	require.NoError(t, os.WriteFile(siblingShard, []byte("keep"), 0o644))

	require.NoError(t, removeLLMShardFiles(outputDir))

	assert.NoFileExists(t, selectedShard)
	assert.FileExists(t, siblingShard)
}

func TestRemoveLLMFilesReportsRemoveError(t *testing.T) {
	outputDir := t.TempDir()
	blockedMonolith := filepath.Join(outputDir, "llms-full.txt")
	require.NoError(t, os.Mkdir(blockedMonolith, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedMonolith, "child"), []byte("blocked"), 0o644))
	blockedShard := filepath.Join(outputDir, "llms-operations-0001.txt")
	require.NoError(t, os.Mkdir(blockedShard, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedShard, "child"), []byte("blocked"), 0o644))

	assert.Error(t, removeLLMMonolithFiles(outputDir))
	assert.Error(t, removeLLMShardFiles(outputDir))
}

func llmShardTestSite() *Site {
	return &Site{
		Root: &RootPage{Title: "Shard API"},
		Operations: []*OperationPage{
			{Method: "GET", Path: "/alpha", Slug: "get-alpha", Summary: strings.Repeat("alpha ", 20)},
			{Method: "POST", Path: "/beta", Slug: "post-beta", Summary: strings.Repeat("beta ", 20)},
			{Method: "DELETE", Path: "/gamma", Slug: "delete-gamma", Summary: strings.Repeat("gamma ", 20)},
		},
		Models: map[string][]*ModelPage{
			"schemas": {
				{Name: "Alpha", Slug: "alpha", TypeSlug: "schemas", Description: strings.Repeat("alpha model ", 20)},
				{Name: "Beta", Slug: "beta", TypeSlug: "schemas", Description: strings.Repeat("beta model ", 20)},
			},
		},
		NavModelGroups: []*NavModelGroup{
			{Name: "Schemas", TypeSlug: "schemas"},
		},
	}
}

func TestRenderOperationMD(t *testing.T) {
	site := &Site{}
	op := &OperationPage{
		Method:      "GET",
		Path:        "/items",
		OperationID: "listItems",
		Summary:     "List all items",
		Description: "Returns a paginated list of items.",
		Tags:        []string{"Items"},
		Parameters: []*ParameterInfo{
			{Name: "limit", In: "query", Required: false, Description: "Max items to return"},
		},
		Responses: []*ResponseInfo{
			{StatusCode: "200", Description: "Success", Content: []*MediaTypeInfo{
				{MediaType: "application/json", SchemaJSON: `{"type":"array"}`},
			}},
			{StatusCode: "404", Description: "Not found"},
		},
		CrossRefs: &OperationCrossRefs{
			ReferencesModels: []*ComponentRef{
				{Name: "Item", ComponentType: "schemas", TypeSlug: "schemas", Slug: "item"},
			},
		},
	}

	md := renderOperationMD(rootLLMRenderContext(site), op)

	assert.Contains(t, md, "### GET /items")
	assert.Contains(t, md, "List all items")
	assert.Contains(t, md, "`listItems`")
	assert.Contains(t, md, "**Tags:** Items")
	assert.Contains(t, md, "#### Parameters")
	assert.Contains(t, md, "| `limit` | query | No |")
	assert.Contains(t, md, "#### Responses")
	assert.Contains(t, md, "**200**")
	assert.Contains(t, md, "**404**")
	assert.Contains(t, md, "#### Parameter Details")
	assert.Contains(t, md, "[Item](models/schemas/item.md)")
}

func TestRenderParamsTable(t *testing.T) {
	params := []*ParameterInfo{
		{Name: "id", In: "path", Required: true, Description: "The item ID"},
		{Name: "filter|name", In: "query", Required: false, Description: "Filter by name with | pipe"},
	}

	table := renderParamsTable(params)

	assert.Contains(t, table, "| `id` | path | Yes |")
	assert.Contains(t, table, "| `filter\\|name` | query | No |")
	assert.Contains(t, table, "Filter by name with \\| pipe")
}

func TestDetectErrorModel(t *testing.T) {
	site := &Site{
		Models: map[string][]*ModelPage{
			"schemas": {
				{Name: "Burger", SchemaJSON: `{"type":"object"}`},
				{Name: "Error", SchemaJSON: `{"type":"object","properties":{"message":{"type":"string"}}}`},
			},
		},
	}

	errModel := detectErrorModel(site)
	require.NotNil(t, errModel)
	assert.Equal(t, "Error", errModel.Name)

	// No error model
	site2 := &Site{
		Models: map[string][]*ModelPage{
			"schemas": {
				{Name: "Burger"},
			},
		},
	}
	assert.Nil(t, detectErrorModel(site2))
}

func TestPrettyJSON(t *testing.T) {
	compact := `{"type":"object","properties":{"name":{"type":"string"}}}`
	pretty := prettyJSON(compact)

	assert.Contains(t, pretty, "  \"type\": \"object\"")
	assert.Contains(t, pretty, "  \"properties\"")

	// Invalid JSON returns as-is
	assert.Equal(t, "not json", prettyJSON("not json"))

	// Empty returns {}
	assert.Equal(t, "{}", prettyJSON(""))
}

func TestTruncateDesc(t *testing.T) {
	assert.Equal(t, "hello", truncateDesc("hello", 10))
	assert.Equal(t, "hel...", truncateDesc("hello world", 6))
	assert.Equal(t, "hello world", truncateDesc("hello world", 100))
	assert.Equal(t, "hello world", truncateDesc("hello\nworld", 100))
	assert.Equal(t, "hel", truncateDesc("hello", 3))
	assert.Equal(t, "hello", truncateDesc("hello", 0))
}

func TestDeterministicOutput(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")

	dir1 := t.TempDir()
	dir2 := t.TempDir()

	err := WriteLLMSite(site, dir1)
	require.NoError(t, err)

	err = WriteLLMSite(site, dir2)
	require.NoError(t, err)

	// Compare all top-level files
	for _, name := range []string{"AGENTS.md", "llms.txt", "llms-full.txt", "llms-operations.txt", "llms-models.txt"} {
		b1, err := os.ReadFile(filepath.Join(dir1, name))
		require.NoError(t, err)
		b2, err := os.ReadFile(filepath.Join(dir2, name))
		require.NoError(t, err)
		assert.Equal(t, string(b1), string(b2), "non-deterministic output in %s", name)
	}
}

func TestWriteLLMAggregateFiles_MatchesStandaloneOutputs(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")
	separateDir := t.TempDir()
	combinedDir := t.TempDir()

	require.NoError(t, writeLLMFull(site, separateDir))
	require.NoError(t, writeLLMOperationsSlice(site, separateDir))
	require.NoError(t, writeLLMModelsSlice(site, separateDir))
	require.NoError(t, writeLLMAggregateFiles(site, combinedDir))

	for _, name := range []string{"llms-full.txt", "llms-operations.txt", "llms-models.txt"} {
		separate, err := os.ReadFile(filepath.Join(separateDir, name))
		require.NoError(t, err)
		combined, err := os.ReadFile(filepath.Join(combinedDir, name))
		require.NoError(t, err)
		assert.Equal(t, string(separate), string(combined), name)
	}
}

func TestWriteLLMAggregateFiles_EmptySiteFallbacks(t *testing.T) {
	site := &Site{Root: &RootPage{Title: "Empty API"}}
	outputDir := t.TempDir()

	require.NoError(t, writeLLMAggregateFiles(site, outputDir))

	full, err := os.ReadFile(filepath.Join(outputDir, "llms-full.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(full), "# Empty API")
	assert.NotContains(t, string(full), "No operations defined.")
	assert.NotContains(t, string(full), "No models defined.")

	operations, err := os.ReadFile(filepath.Join(outputDir, "llms-operations.txt"))
	require.NoError(t, err)
	assert.Equal(t, "# Operations\n\nNo operations defined.\n", string(operations))

	models, err := os.ReadFile(filepath.Join(outputDir, "llms-models.txt"))
	require.NoError(t, err)
	assert.Equal(t, "# Models\n\nNo models defined.\n", string(models))
}

func TestWriteLLMAggregateFiles_OpenError(t *testing.T) {
	outputDir := filepath.Join(t.TempDir(), "missing")

	err := writeLLMAggregateFiles(&Site{}, outputDir)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "opening llms-full.txt")
}

func TestWriteLLMFullPreamble(t *testing.T) {
	site := &Site{
		Root: &RootPage{
			Title:       "Preamble API",
			Description: "Useful API",
			Version:     "1.2.3",
			Servers:     []*ServerInfo{{URL: "https://api.example.com"}},
		},
		Source: &SourceRef{Path: "openapi.yaml", Line: 7},
	}
	var builder strings.Builder

	require.NoError(t, writeLLMFullPreamble(rootLLMRenderContext(site), &builder))

	got := builder.String()
	assert.Contains(t, got, "# Preamble API")
	assert.Contains(t, got, "> Useful API")
	assert.Contains(t, got, "**Version:** 1.2.3")
	assert.Contains(t, got, "openapi.yaml")
	assert.Contains(t, got, "## How to Use This API")
}

func TestWriteLLMFullPreamble_DefaultTitle(t *testing.T) {
	var builder strings.Builder

	require.NoError(t, writeLLMFullPreamble(rootLLMRenderContext(&Site{}), &builder))

	assert.Equal(t, "# API Documentation\n\n", builder.String())
}

func TestWriteBufferedTextFile_PropagatesWriteError(t *testing.T) {
	expected := errors.New("stop")

	err := writeBufferedTextFile(filepath.Join(t.TempDir(), "out.txt"), func(w io.StringWriter) error {
		require.NoError(t, writeString(w, "before error"))
		return expected
	})

	require.ErrorIs(t, err, expected)
}

func TestBufferedTextFileCloseFlushError(t *testing.T) {
	file, err := os.CreateTemp(t.TempDir(), "closed")
	require.NoError(t, err)
	writer := bufio.NewWriter(file)
	_, err = writer.WriteString("content")
	require.NoError(t, err)
	require.NoError(t, file.Close())

	err = (&bufferedTextFile{file: file, writer: writer}).close()

	require.Error(t, err)
}

func TestCloseBufferedTextFilesReturnsFirstError(t *testing.T) {
	badFile, err := os.CreateTemp(t.TempDir(), "bad")
	require.NoError(t, err)
	badWriter := bufio.NewWriter(badFile)
	_, err = badWriter.WriteString("bad")
	require.NoError(t, err)
	require.NoError(t, badFile.Close())

	goodFile, err := openBufferedTextFile(filepath.Join(t.TempDir(), "good.txt"))
	require.NoError(t, err)
	require.NoError(t, writeString(goodFile.writer, "good"))

	err = closeBufferedTextFiles(&bufferedTextFile{file: badFile, writer: badWriter}, goodFile)

	require.Error(t, err)
}

func TestMultiStringWriter_PropagatesError(t *testing.T) {
	expected := errors.New("write failed")
	writer := multiStringWriter{&strings.Builder{}, errStringWriter{err: expected}}

	_, err := writer.WriteString("content")

	require.ErrorIs(t, err, expected)
}

func TestWriteLLMMarkdownFiles_DeterministicOrder(t *testing.T) {
	outputDir := t.TempDir()
	firstPath := filepath.Join(outputDir, "first.md")
	secondPath := filepath.Join(outputDir, "nested", "second.md")

	written, err := writeLLMMarkdownFiles([]llmMarkdownFileTask{
		{
			path:  firstPath,
			label: "first",
			render: func() string {
				return "first"
			},
		},
		{
			path:  secondPath,
			label: "second",
			render: func() string {
				return "second"
			},
		},
	})

	require.NoError(t, err)
	assert.Equal(t, []string{firstPath, secondPath}, written)
	assert.FileExists(t, firstPath)
	assert.FileExists(t, secondPath)

	first, err := os.ReadFile(firstPath)
	require.NoError(t, err)
	assert.Equal(t, "first", string(first))
	second, err := os.ReadFile(secondPath)
	require.NoError(t, err)
	assert.Equal(t, "second", string(second))
}

func TestWriteLLMMarkdownFiles_Empty(t *testing.T) {
	written, err := writeLLMMarkdownFiles(nil)

	require.NoError(t, err)
	assert.Nil(t, written)
}

func TestWriteLLMMarkdownFiles_ReturnsFirstTaskError(t *testing.T) {
	outputDir := t.TempDir()
	blockedDir := filepath.Join(outputDir, "blocked")
	require.NoError(t, os.WriteFile(blockedDir, []byte("not a directory"), 0o644))

	_, err := writeLLMMarkdownFiles([]llmMarkdownFileTask{
		{
			path:  filepath.Join(blockedDir, "first.md"),
			label: "first",
			render: func() string {
				return "first"
			},
		},
		{
			path:  filepath.Join(outputDir, "second.md"),
			label: "second",
			render: func() string {
				return "second"
			},
		},
	})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "first")
}

func TestWriteLLMSectionsNoContent(t *testing.T) {
	ctx := rootLLMRenderContext(&Site{})
	var builder strings.Builder

	wroteOperations, err := writeOperationsSection(ctx, &builder)
	require.NoError(t, err)
	assert.False(t, wroteOperations)
	wroteWebhooks, err := writeWebhooksSection(ctx, &builder)
	require.NoError(t, err)
	assert.False(t, wroteWebhooks)
	wroteModels, err := writeModelsSection(ctx, &builder)
	require.NoError(t, err)
	assert.False(t, wroteModels)
	assert.Empty(t, builder.String())
}

func TestWriteLLMSectionsPropagateWriterErrors(t *testing.T) {
	expected := errors.New("write failed")
	writer := errStringWriter{err: expected}

	_, err := writeOperationsSection(rootLLMRenderContext(&Site{
		Operations: []*OperationPage{{Method: "GET", Path: "/items", Slug: "get-items"}},
	}), writer)
	require.ErrorIs(t, err, expected)

	_, err = writeWebhooksSection(rootLLMRenderContext(&Site{
		Webhooks: []*OperationPage{{Method: "POST", Path: "/hooks", Slug: "post-hooks"}},
	}), writer)
	require.ErrorIs(t, err, expected)

	_, err = writeModelsSection(rootLLMRenderContext(&Site{
		NavModelGroups: []*NavModelGroup{{Name: "Schemas", TypeSlug: "schemas"}},
		Models: map[string][]*ModelPage{
			"schemas": []*ModelPage{{Name: "Item", Slug: "item", TypeSlug: "schemas"}},
		},
	}), writer)
	require.ErrorIs(t, err, expected)
}

func TestLLMMarkdownFileWorkers(t *testing.T) {
	assert.Equal(t, 0, llmMarkdownFileWorkers(0))
	assert.Equal(t, 1, llmMarkdownFileWorkers(1))

	want := runtime.GOMAXPROCS(0)
	if want > 8 {
		want = 8
	}
	assert.Equal(t, want, llmMarkdownFileWorkers(64))
}

func TestLLMRenderContextCachesSchemaWork(t *testing.T) {
	cache := newLLMRenderCache()
	ctx := newLLMRenderContext(&Site{}, "", "models/", cache)
	schema := `{"type":"object","properties":{"id":{"type":"string"}}}`

	first := renderSchemaSummaryMD(ctx, schema, nil, nil)
	second := renderSchemaSummaryMD(ctx, schema, nil, nil)
	assert.Equal(t, first, second)
	assert.NotEmpty(t, first)

	assert.False(t, schemaNeedsRawBlockWithContext(ctx, schema))
	assert.False(t, schemaNeedsRawBlockWithContext(ctx, schema))

	cache.mu.RLock()
	defer cache.mu.RUnlock()
	assert.Len(t, cache.schemaMaps, 1)
	assert.Len(t, cache.schemaSummaries, 1)
	assert.Contains(t, cache.rawSchemaNeeds, schema)
}

func TestSchemaCacheHelpersIgnoreMissingCache(t *testing.T) {
	ctx := llmRenderContext{}
	key := llmSchemaSummaryKey{schemaJSON: `{"type":"string"}`}

	cacheSchemaSummary(ctx, key, "ignored")
	cacheRawSchemaNeeds(ctx, key.schemaJSON, true)

	assert.Equal(t, map[string]any{"type": "string"}, parseJSONMapWithContext(ctx, key.schemaJSON))
	assert.False(t, schemaNeedsRawBlockWithContext(ctx, key.schemaJSON))
}

type errStringWriter struct {
	err error
}

func (w errStringWriter) WriteString(string) (int, error) {
	return 0, w.err
}

func TestBuildCrossRefs_BurgerShop(t *testing.T) {
	site := buildTestSite(t, "../test_specs/burgershop.openapi.yaml")

	schemas := site.Models["schemas"]
	require.NotEmpty(t, schemas)

	// Build a lookup for easy access
	schemaMap := make(map[string]*ModelPage)
	for _, s := range schemas {
		schemaMap[s.Name] = s
	}

	// --- Burger → Fries (model→model) ---
	burger := schemaMap["Burger"]
	require.NotNil(t, burger, "Burger schema should exist")
	require.NotNil(t, burger.CrossRefs, "Burger should have cross-refs")

	var burgerUses []string
	for _, ref := range burger.CrossRefs.UsesModels {
		burgerUses = append(burgerUses, ref.Name)
	}
	assert.Contains(t, burgerUses, "Fries", "Burger should reference Fries")

	// Burger is used by BurgerRequest (requestBody→schema)
	var burgerUsedBy []string
	for _, ref := range burger.CrossRefs.UsedByModels {
		burgerUsedBy = append(burgerUsedBy, ref.Name)
	}
	assert.Contains(t, burgerUsedBy, "BurgerRequest", "Burger should be referenced by BurgerRequest")

	// --- Fries ---
	fries := schemaMap["Fries"]
	require.NotNil(t, fries, "Fries schema should exist")
	require.NotNil(t, fries.CrossRefs, "Fries should have cross-refs")

	// Fries references Drink (model→model: UsesModels)
	var friesUses []string
	for _, ref := range fries.CrossRefs.UsesModels {
		friesUses = append(friesUses, ref.Name)
	}
	assert.Contains(t, friesUses, "Drink", "Fries should reference Drink")

	// Fries is used by Burger (model→model: UsedByModels)
	var friesUsedBy []string
	for _, ref := range fries.CrossRefs.UsedByModels {
		friesUsedBy = append(friesUsedBy, ref.Name)
	}
	assert.Contains(t, friesUsedBy, "Burger", "Fries should be referenced by Burger")

	// --- SomePayload ---
	somePayload := schemaMap["SomePayload"]
	require.NotNil(t, somePayload, "SomePayload schema should exist")
	require.NotNil(t, somePayload.CrossRefs, "SomePayload should have cross-refs")

	// SomePayload references Drink via allOf/oneOf/anyOf/items
	var payloadUses []string
	for _, ref := range somePayload.CrossRefs.UsesModels {
		payloadUses = append(payloadUses, ref.Name)
	}
	assert.Contains(t, payloadUses, "Drink", "SomePayload should reference Drink")

	// --- Drink ---
	drink := schemaMap["Drink"]
	require.NotNil(t, drink, "Drink schema should exist")
	require.NotNil(t, drink.CrossRefs, "Drink should have cross-refs")

	// Drink is used by Fries and SomePayload (model→model: UsedByModels)
	var drinkUsedBy []string
	for _, ref := range drink.CrossRefs.UsedByModels {
		drinkUsedBy = append(drinkUsedBy, ref.Name)
	}
	assert.Contains(t, drinkUsedBy, "Fries", "Drink should be referenced by Fries")
	assert.Contains(t, drinkUsedBy, "SomePayload", "Drink should be referenced by SomePayload")

	// --- Error ---
	errSchema := schemaMap["Error"]
	require.NotNil(t, errSchema, "Error schema should exist")

	// --- Cross-component-type refs: requestBodies → schemas, responses → schemas ---
	reqBodies := site.Models["request-bodies"]
	for _, rb := range reqBodies {
		if rb.Name == "BurgerRequest" && rb.CrossRefs != nil {
			var rbUses []string
			for _, ref := range rb.CrossRefs.UsesModels {
				rbUses = append(rbUses, ref.Name)
			}
			assert.Contains(t, rbUses, "Burger", "BurgerRequest should reference Burger")
		}
	}

	responses := site.Models["responses"]
	for _, r := range responses {
		if r.Name == "DressingResponse" && r.CrossRefs != nil {
			var rUses []string
			for _, ref := range r.CrossRefs.UsesModels {
				rUses = append(rUses, ref.Name)
			}
			assert.Contains(t, rUses, "Dressing", "DressingResponse should reference Dressing")
		}
	}
}

func TestEscapeTableCell(t *testing.T) {
	assert.Equal(t, "hello", escapeTableCell("hello"))
	assert.Equal(t, "a \\| b", escapeTableCell("a | b"))
	assert.Equal(t, "line1 line2", escapeTableCell("line1\nline2"))
}

func TestSingleLine(t *testing.T) {
	assert.Equal(t, "a b c", singleLine("a\nb\nc"))
	assert.Equal(t, "a b", singleLine("a\r\nb"))
	assert.Equal(t, "hello", singleLine("  hello  "))
}

func TestCommonPrefix(t *testing.T) {
	assert.Equal(t, "", commonPrefix(nil))
	assert.Equal(t, "/burgers", commonPrefix([]string{"/burgers"}))
	assert.Equal(t, "/burgers", commonPrefix([]string{"/burgers", "/burgers/{id}"}))
	assert.Equal(t, "", commonPrefix([]string{"/burgers", "/orders"}))
}

func TestRenderSchemaBlock(t *testing.T) {
	result := renderSchemaBlock(`{"type":"object"}`)
	assert.True(t, strings.HasPrefix(result, "```json\n"))
	assert.True(t, strings.HasSuffix(result, "```\n"))
	assert.Contains(t, result, "\"type\": \"object\"")
}

func TestRenderResponsesMD_Dedup(t *testing.T) {
	errorSchema := `{"type":"object","properties":{"message":{"type":"string"}}}`
	responses := []*ResponseInfo{
		{StatusCode: "200", Description: "Success", Content: []*MediaTypeInfo{
			{MediaType: "application/json", SchemaJSON: `{"type":"array"}`},
		}},
		{StatusCode: "400", Description: "Bad request", Content: []*MediaTypeInfo{
			{MediaType: "application/json", SchemaJSON: errorSchema},
		}},
		{StatusCode: "401", Description: "Unauthorized", Content: []*MediaTypeInfo{
			{MediaType: "application/json", SchemaJSON: errorSchema},
		}},
		{StatusCode: "500", Description: "Server error", Content: []*MediaTypeInfo{
			{MediaType: "application/json", SchemaJSON: errorSchema},
		}},
	}

	result := renderResponsesMD(rootLLMRenderContext(&Site{}), responses)

	// 200 and 400 should have full schemas
	assert.Contains(t, result, "**200**")
	assert.Contains(t, result, "**400**")
	// 401 and 500 should reference 400
	assert.Contains(t, result, "*Same schema as 400 response.*")
	// The error schema should appear only once (for 400)
	assert.Equal(t, 1, strings.Count(result, `"message"`))
}

func TestRenderOperationMD_EffectiveSecurityAndProvenance(t *testing.T) {
	site := &Site{
		Root: &RootPage{
			SecurityGroups: []*SecurityRequirementGroup{
				{
					Requirements: []*SecurityRequirement{
						{
							Name:       "userAuth",
							SchemeType: "oauth2",
							Scopes:     []string{"idn:identity-history:manage"},
						},
					},
				},
			},
		},
		Operations: []*OperationPage{
			{
				Method:      "GET",
				Path:        "/accounts",
				Slug:        "list-accounts",
				OperationID: "listAccounts",
			},
			{
				Method:      "GET",
				Path:        "/configuration-hub/object-mappings/{sourceOrg}",
				Slug:        "get-object-mappings",
				OperationID: "getObjectMappings",
				Tags:        []string{"Configuration Hub"},
				Summary:     "Gets list of object mappings",
			},
			{
				Method:      "POST",
				Path:        "/configuration-hub/object-mappings/{sourceOrg}/bulk-create",
				Slug:        "create-object-mappings",
				OperationID: "createObjectMappings",
				Tags:        []string{"Configuration Hub"},
				Summary:     "Bulk creates object mappings",
			},
		},
	}
	op := &OperationPage{
		Method:      "GET",
		Path:        "/account-usages/{accountId}/summaries",
		OperationID: "getUsagesByAccountId",
		Parameters: []*ParameterInfo{
			{
				Name:        "accountId",
				In:          "path",
				Required:    true,
				Description: "ID of IDN account",
				Extensions: []*ExtensionEntry{
					{Key: "sailpoint-resource-operation-id", Value: "listAccounts"},
				},
			},
		},
	}

	md := renderOperationMD(rootLLMRenderContext(site), op)

	assert.Contains(t, md, "#### Security")
	assert.Contains(t, md, "userAuth")
	assert.Contains(t, md, "idn:identity-history:manage")
	assert.Contains(t, md, "#### How To Find IDs")
	assert.Contains(t, md, "Find `accountId` via [GET /accounts](operations/list-accounts.md).")
	assert.Contains(t, md, "**Resource ID source:** [GET /accounts](operations/list-accounts.md)")
}

func TestRenderOperationMD_CurlRelatedOpsGuidanceAndScopeDedup(t *testing.T) {
	site := &Site{
		Root: &RootPage{
			SecurityGroups: []*SecurityRequirementGroup{
				{
					Requirements: []*SecurityRequirement{
						{Name: "userAuth", SchemeType: "oauth2", Scopes: []string{"sp:config-object-mapping:manage"}},
					},
				},
			},
		},
		Operations: []*OperationPage{
			{
				Method:  "GET",
				Path:    "/configuration-hub/object-mappings/{sourceOrg}",
				Slug:    "get-object-mappings",
				Tags:    []string{"Configuration Hub"},
				Summary: "Gets list of object mappings",
			},
			{
				Method:  "POST",
				Path:    "/configuration-hub/object-mappings/{sourceOrg}/bulk-create",
				Slug:    "create-object-mappings",
				Tags:    []string{"Configuration Hub"},
				Summary: "Bulk creates object mappings",
			},
		},
	}
	curlVariants := []*CurlVariant{
		{Label: "Default", Command: "curl -X POST https://api.example.com/configuration-hub/object-mappings/default"},
		{Label: "Alt", Command: "curl -X POST https://alt.example.com/configuration-hub/object-mappings/default"},
	}
	curlJSON, err := json.Marshal(curlVariants)
	require.NoError(t, err)
	op := &OperationPage{
		Method:      "POST",
		Path:        "/configuration-hub/object-mappings/{sourceOrg}",
		Slug:        "create-object-mapping",
		OperationID: "createObjectMapping",
		Tags:        []string{"Configuration Hub"},
		Summary:     "Creates an object mapping",
		Description: "This creates an object mapping between current org and source org.\nSource org should be \"default\" when creating an object mapping that is not to be associated to any particular org.\nThe request will need the following security scope:\n- sp:config-object-mapping:manage",
		CurlJSON:    string(curlJSON),
		Parameters: []*ParameterInfo{
			{
				Name:        "sourceOrg",
				In:          "path",
				Required:    true,
				Description: "The name of the source org.",
			},
		},
	}

	md := renderOperationMD(rootLLMRenderContext(site), op)

	assert.Contains(t, md, "#### cURL")
	assert.Contains(t, md, "curl -X POST https://api.example.com/configuration-hub/object-mappings/default")
	assert.Contains(t, md, "Additional variants:")
	assert.Contains(t, md, "**Guidance:** Use `default`")
	assert.Contains(t, md, "#### Related Operations")
	assert.Contains(t, md, "[GET /configuration-hub/object-mappings/{sourceOrg}](operations/get-object-mappings.md)")
	assert.Contains(t, md, "[POST /configuration-hub/object-mappings/{sourceOrg}/bulk-create](operations/create-object-mappings.md)")
	assert.Equal(t, 1, strings.Count(md, "sp:config-object-mapping:manage"))
}

func TestRenderOperationMD_CodeSamples(t *testing.T) {
	curlVariants := []*CurlVariant{
		{Label: "Default", Command: "curl https://api.example.com/bookings"},
	}
	curlJSON, err := json.Marshal(curlVariants)
	require.NoError(t, err)

	op := &OperationPage{
		Method:   "POST",
		Path:     "/bookings",
		Summary:  "Create booking",
		CurlJSON: string(curlJSON),
		CodeSamples: []*CodeSample{
			{
				Lang:   "typescript",
				Label:  "create-booking_json",
				Source: "const client = new TrainTravelSDK();\nawait client.bookings.create({ tripId: \"abc\" });\n",
			},
			{
				Label:  "python-sdk",
				Source: "client.bookings.create({\"tripId\": \"abc\"})\n",
			},
		},
	}

	md := renderOperationMD(rootLLMRenderContext(&Site{}), op)

	assert.Contains(t, md, "#### cURL")
	assert.Contains(t, md, "#### Code Samples")
	assert.Contains(t, md, "**typescript - create-booking_json**")
	assert.Contains(t, md, "```typescript\nconst client = new TrainTravelSDK();")
	assert.Contains(t, md, "**python-sdk**")
	assert.Contains(t, md, "```\nclient.bookings.create")
	assert.Less(t, strings.Index(md, "#### cURL"), strings.Index(md, "#### Code Samples"))
}

func TestRenderOperationMD_CurlSuppressesDuplicateVariants(t *testing.T) {
	curlVariants := []*CurlVariant{
		{Label: "Default", Command: "curl https://api.example.com/items"},
		{Label: "Same command, different label", Command: "curl https://api.example.com/items"},
	}
	curlJSON, err := json.Marshal(curlVariants)
	require.NoError(t, err)

	op := &OperationPage{
		Method:   "GET",
		Path:     "/items",
		Summary:  "List items",
		CurlJSON: string(curlJSON),
	}

	md := renderOperationMD(rootLLMRenderContext(&Site{}), op)

	assert.Contains(t, md, "#### cURL")
	assert.Contains(t, md, "curl https://api.example.com/items")
	assert.NotContains(t, md, "Additional variants:")
}

func TestRenderRequestBodyMD_JSONPatchShowsSupportedPathsAndSafeExample(t *testing.T) {
	op := &OperationPage{
		Method: "PATCH",
		Path:   "/auth-org/lockout-config",
		Responses: []*ResponseInfo{
			{
				StatusCode: "200",
				Content: []*MediaTypeInfo{
					{
						MediaType:  "application/json",
						SchemaJSON: `{"type":"object","properties":{"lockoutDuration":{"type":"integer","example":15},"lockoutWindow":{"type":"integer","example":5},"maximumAttempts":{"type":"integer","example":5}}}`,
					},
				},
			},
		},
	}
	rb := &RequestBodyInfo{
		Required: true,
		Content: []*MediaTypeInfo{
			{
				MediaType:  "application/json-patch+json",
				SchemaJSON: `{"type":"array","items":{"$ref":"#/components/schemas/JsonPatchOperation"}}`,
				MockJSON:   "[\n  {\n    \"op\": \"replace\",\n    \"path\": \"/maximumAttempts\",\n    \"value\": \"7,\"\n  },\n  {\n    \"op\": \"add\",\n    \"path\": \"/lockoutDuration\",\n    \"value\": 35\n  }\n]",
				ItemsRef:   &ComponentLink{Name: "JsonPatchOperation", TypeSlug: "schemas", Slug: "json-patch-operation"},
			},
		},
	}

	md := renderRequestBodyMD(rootLLMRenderContext(&Site{}), op, rb)

	assert.Contains(t, md, "**Supported patch paths**")
	assert.Contains(t, md, "- `/maximumAttempts`")
	assert.Contains(t, md, "- `/lockoutDuration`")
	assert.Contains(t, md, "- `/lockoutWindow`")
	assert.Contains(t, md, `"value": 5`)
	assert.Contains(t, md, `"value": 15`)
	assert.NotContains(t, md, `"7,"`)
}

func TestCollectRelatedOperations_PrefersSamePathSibling(t *testing.T) {
	site := &Site{
		Operations: []*OperationPage{
			{
				Method:  "PATCH",
				Path:    "/auth-org/lockout-config",
				Slug:    "patch-auth-org-lockout-config",
				Tags:    []string{"Global Tenant Security Settings"},
				Summary: "Update auth org lockout configuration",
			},
			{
				Method:  "GET",
				Path:    "/auth-org/lockout-config",
				Slug:    "get-auth-org-lockout-config",
				Tags:    []string{"Global Tenant Security Settings"},
				Summary: "Get auth org lockout configuration",
			},
			{
				Method:  "GET",
				Path:    "/auth-org/network-config",
				Slug:    "get-auth-org-network-config",
				Tags:    []string{"Global Tenant Security Settings"},
				Summary: "Get auth org network configuration",
			},
		},
	}

	related := collectRelatedOperations(site, site.Operations[0])
	require.NotEmpty(t, related)
	assert.Equal(t, "get-auth-org-lockout-config", related[0].Slug)
}

func TestRenderModelMD_IncludesSchemaSummaryAndCrossRefLinks(t *testing.T) {
	page := &ModelPage{
		Name:        "AccountUsage",
		TypeSlug:    "schemas",
		Description: "Account usage summary.",
		SchemaJSON:  `{"type":"object","required":["date"],"properties":{"date":{"type":"string","format":"date","description":"Month bucket"},"count":{"type":"integer","format":"int64","description":"Active days"}}}`,
		CrossRefs: &ModelCrossRefs{
			UsedByOperations: []*OperationRef{{Method: "GET", Path: "/account-usages/{accountId}/summaries", Slug: "get-usages-by-account-id"}},
		},
	}

	md := renderModelMD(rootLLMRenderContext(&Site{}), page)

	assert.Contains(t, md, "#### Schema Summary")
	assert.Contains(t, md, "`date` (`string` format `date`) required")
	assert.Contains(t, md, "[GET /account-usages/{accountId}/summaries](operations/get-usages-by-account-id.md)")
	assert.NotContains(t, md, "\"properties\"")
}

func TestRenderModelMD_RetainsRawSchemaForComposedSchemas(t *testing.T) {
	page := &ModelPage{
		Name:       "ComposedThing",
		TypeSlug:   "schemas",
		SchemaJSON: `{"allOf":[{"$ref":"#/components/schemas/BaseThing"},{"type":"object","properties":{"name":{"type":"string"}}}]}`,
	}

	md := renderModelMD(rootLLMRenderContext(&Site{}), page)

	assert.Contains(t, md, "#### Schema Summary")
	assert.Contains(t, md, "\"allOf\"")
}

func TestRenderRequestBodyMD_OmitsRawSchemaWhenSummaryAndExampleExist(t *testing.T) {
	op := &OperationPage{Method: "POST", Path: "/widgets"}
	rb := &RequestBodyInfo{
		Content: []*MediaTypeInfo{
			{
				MediaType:  "application/json",
				SchemaRef:  &ComponentLink{Name: "WidgetRequest", TypeSlug: "schemas", Slug: "widget-request"},
				SchemaJSON: `{"type":"object","properties":{"name":{"type":"string"}}}`,
				MockJSON:   `{"name":"demo"}`,
			},
		},
	}

	md := renderRequestBodyMD(rootLLMRenderContext(&Site{}), op, rb)

	assert.Contains(t, md, "**Schema ref:** [WidgetRequest](models/schemas/widget-request.md)")
	assert.Contains(t, md, "**Example payload**")
	assert.NotContains(t, md, "\"properties\"")
}

func TestRenderResponsesMD_OmitsRawSchemaWhenSummaryAndExampleExist(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode:  "200",
			Description: "Success",
			Content: []*MediaTypeInfo{
				{
					MediaType:  "application/json",
					SchemaRef:  &ComponentLink{Name: "Widget", TypeSlug: "schemas", Slug: "widget"},
					SchemaJSON: `{"type":"object","properties":{"id":{"type":"string"}}}`,
					MockJSON:   `{"id":"123"}`,
				},
			},
		},
	}

	md := renderResponsesMD(rootLLMRenderContext(&Site{}), responses)

	assert.Contains(t, md, "**Schema ref:** [Widget](models/schemas/widget.md)")
	assert.Contains(t, md, "**Example payload**")
	assert.NotContains(t, md, "\"properties\"")
}

func TestRenderSchemaSummaryMD_LongEnumFormatting(t *testing.T) {
	schema := `{"type":"object","properties":{"objectType":{"type":"string","enum":["ACCESS_PROFILE","ACCESS_REQUEST_CONFIG","ATTR_SYNC_SOURCE_CONFIG","AUTH_ORG","CAMPAIGN_FILTER","ENTITLEMENT","FORM_DEFINITION","GOVERNANCE_GROUP"]}}}`

	md := renderSchemaSummaryMD(rootLLMRenderContext(&Site{}), schema, nil, nil)

	assert.Contains(t, md, "Allowed values:")
	assert.Contains(t, md, "    - `ACCESS_PROFILE`")
	assert.NotContains(t, md, "Enum: `ACCESS_PROFILE`, `ACCESS_REQUEST_CONFIG`, `ATTR_SYNC_SOURCE_CONFIG`, `AUTH_ORG`, `CAMPAIGN_FILTER`, `ENTITLEMENT`, `FORM_DEFINITION`, `GOVERNANCE_GROUP`")
}

func TestRenderOperationsIndex_Grouped(t *testing.T) {
	site := &Site{
		Operations: []*OperationPage{
			{Method: "GET", Path: "/pets", Slug: "get-pets", Summary: "List pets", Tags: []string{"Pets"}},
			{Method: "POST", Path: "/pets", Slug: "post-pets", Summary: "Create pet", Tags: []string{"Pets"}},
			{Method: "GET", Path: "/health", Slug: "get-health", Summary: "Health check"},
		},
		NavTags: []*NavTag{
			{
				Name:    "Pets",
				Summary: "Pet management",
				Operations: []*NavOperation{
					{Method: "GET", Path: "/pets", Slug: "get-pets", Summary: "List pets"},
					{Method: "POST", Path: "/pets", Slug: "post-pets", Summary: "Create pet"},
				},
			},
		},
	}

	result := renderOperationsIndex(site)

	assert.Contains(t, result, "## Operations")
	assert.Contains(t, result, "Pets")
	assert.Contains(t, result, "Pet management")
	assert.Contains(t, result, "(2 operations)")
	assert.Contains(t, result, "[GET /pets](operations/get-pets.md)")
	assert.Contains(t, result, "[POST /pets](operations/post-pets.md)")
	assert.Contains(t, result, "### Other Operations")
	assert.Contains(t, result, "[GET /health](operations/get-health.md)")
}

func TestRenderQuickStart(t *testing.T) {
	site := &Site{
		Root: &RootPage{
			Servers:  []*ServerInfo{{URL: "https://api.example.com"}},
			Security: []*SecurityRequirement{{Name: "bearerAuth"}},
		},
		Operations: []*OperationPage{{}, {}, {}},
		Models: map[string][]*ModelPage{
			"schemas":  {{}, {}},
			"security": {{}},
		},
	}

	result := renderQuickStart(site)

	assert.Contains(t, result, "## Quick Start")
	assert.Contains(t, result, "`https://api.example.com`")
	assert.Contains(t, result, "bearerAuth")
	assert.Contains(t, result, "3 operations")
	assert.Contains(t, result, "2 schemas")
	assert.Contains(t, result, "1 security schemes")
}

func TestWriteLLMIndex_SkipsPathItems(t *testing.T) {
	site := &Site{
		Root: &RootPage{Title: "Test"},
		NavModelGroups: []*NavModelGroup{
			{Name: "Schemas", TypeSlug: "schemas", Models: []*NavModel{
				{Name: "Foo", Slug: "foo", TypeSlug: "schemas"},
			}},
			{Name: "Path Items", TypeSlug: "path-items", Models: []*NavModel{
				{Name: "Bar", Slug: "bar", TypeSlug: "path-items"},
			}},
		},
		Models: map[string][]*ModelPage{},
	}

	outputDir := t.TempDir()
	err := writeLLMIndex(site, outputDir)
	require.NoError(t, err)

	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	idx := string(indexBytes)

	assert.Contains(t, idx, "[AGENTS.md](AGENTS.md)")
	assert.Contains(t, idx, "### Schemas")
	assert.NotContains(t, idx, "### Path Items")
	assert.NotContains(t, idx, "path-items")
}

func TestNavModel_Description(t *testing.T) {
	site := &Site{
		Root: &RootPage{Title: "Test"},
		NavModelGroups: []*NavModelGroup{
			{Name: "Schemas", TypeSlug: "schemas", Models: []*NavModel{
				{Name: "User", Slug: "user", TypeSlug: "schemas", Description: "A user account"},
			}},
		},
		Models: map[string][]*ModelPage{},
	}

	outputDir := t.TempDir()
	err := writeLLMIndex(site, outputDir)
	require.NoError(t, err)

	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	idx := string(indexBytes)

	assert.Contains(t, idx, "[AGENTS.md](AGENTS.md)")
	assert.Contains(t, idx, "[User](models/schemas/user.md) — A user account")
}
