// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"os"
	"path/filepath"
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
	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-operations.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-models.txt"))

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
	assert.Contains(t, idx, "llms-full.txt")
	assert.Contains(t, idx, "## Operations")
	assert.Contains(t, idx, "## Webhooks")
	assert.Contains(t, idx, "## Models")

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

	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	assert.FileExists(t, filepath.Join(outputDir, "llms-full.txt"))
}

func TestRenderOperationMD(t *testing.T) {
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
				{Name: "Item", ComponentType: "schemas"},
			},
		},
	}

	md := renderOperationMD(op)

	assert.Contains(t, md, "### GET /items")
	assert.Contains(t, md, "List all items")
	assert.Contains(t, md, "`listItems`")
	assert.Contains(t, md, "**Tags:** Items")
	assert.Contains(t, md, "#### Parameters")
	assert.Contains(t, md, "| `limit` | query | No |")
	assert.Contains(t, md, "#### Responses")
	assert.Contains(t, md, "**200**")
	assert.Contains(t, md, "**404**")
	assert.Contains(t, md, "**Models referenced:** Item")
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
	for _, name := range []string{"llms.txt", "llms-full.txt", "llms-operations.txt", "llms-models.txt"} {
		b1, err := os.ReadFile(filepath.Join(dir1, name))
		require.NoError(t, err)
		b2, err := os.ReadFile(filepath.Join(dir2, name))
		require.NoError(t, err)
		assert.Equal(t, string(b1), string(b2), "non-deterministic output in %s", name)
	}
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

	result := renderResponsesMD(responses)

	// 200 and 400 should have full schemas
	assert.Contains(t, result, "**200**")
	assert.Contains(t, result, "**400**")
	// 401 and 500 should reference 400
	assert.Contains(t, result, "*Same schema as 400 response.*")
	// The error schema should appear only once (for 400)
	assert.Equal(t, 1, strings.Count(result, `"message"`))
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

	assert.Contains(t, idx, "[User](models/schemas/user.md) — A user account")
}
