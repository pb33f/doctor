// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPrintingPress_BurgerShop(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	pp := newPressEngine(&pressEngineConfig{
		DrDoc: drDoc,
		Title: "Burger Shop API",
	})

	site, err := pp.pressSite()
	require.NoError(t, err)
	require.NotNil(t, site)

	// Root page
	assert.NotNil(t, site.Root)
	assert.Equal(t, "Burger Shop API", site.Root.Title)
	assert.NotEmpty(t, site.Root.Version)

	// Operations collected
	assert.NotEmpty(t, site.Operations, "should have collected operations")

	// Check slug uniqueness among operations
	slugs := make(map[string]bool)
	for _, op := range site.Operations {
		assert.NotEmpty(t, op.Slug)
		assert.False(t, slugs[op.Slug], "duplicate operation slug: %s", op.Slug)
		slugs[op.Slug] = true
		assert.NotEmpty(t, op.Method)
		assert.NotEmpty(t, op.Path)
	}

	// Models collected
	if len(site.Models) > 0 {
		for typeSlug, pages := range site.Models {
			modelSlugs := make(map[string]bool)
			for _, page := range pages {
				assert.NotEmpty(t, page.Slug)
				assert.NotEmpty(t, page.Name)
				assert.Equal(t, typeSlug, page.TypeSlug)
				assert.False(t, modelSlugs[page.Slug], "duplicate model slug in %s: %s", typeSlug, page.Slug)
				modelSlugs[page.Slug] = true
			}
		}
	}
}

func TestPrintingPress_PetStoreV3(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/petstorev3.json")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	pp := newPressEngine(&pressEngineConfig{
		DrDoc: drDoc,
	})

	site, err := pp.pressSite()
	require.NoError(t, err)
	require.NotNil(t, site)

	assert.NotNil(t, site.Root)
	assert.NotEmpty(t, site.Operations)

	// Check schemas were collected
	schemas := site.Models["schemas"]
	assert.NotEmpty(t, schemas, "petstore should have schemas")

	// Each schema should have JSON representation and RawYAML
	for _, s := range schemas {
		assert.NotEmpty(t, s.SchemaJSON, "schema %s should have JSON", s.Name)
		assert.NotEmpty(t, s.RawYAML, "schema %s should have RawYAML", s.Name)
	}

	// Operations should have RawYAML, and sub-objects should too
	for _, op := range site.Operations {
		assert.NotEmpty(t, op.RawYAML, "operation %s %s should have RawYAML", op.Method, op.Path)
		assert.NotEmpty(t, op.SchemaJSON, "operation %s %s should have SchemaJSON", op.Method, op.Path)

		for _, p := range op.Parameters {
			assert.NotEmpty(t, p.RawYAML, "param %s should have RawYAML", p.Name)
			assert.NotEmpty(t, p.RawJSON, "param %s should have RawJSON", p.Name)
		}
		for _, r := range op.Responses {
			assert.NotEmpty(t, r.RawYAML, "response %s should have RawYAML", r.StatusCode)
			assert.NotEmpty(t, r.RawJSON, "response %s should have RawJSON", r.StatusCode)
		}
		if op.RequestBody != nil {
			assert.NotEmpty(t, op.RequestBody.RawYAML, "request body for %s %s should have RawYAML", op.Method, op.Path)
			assert.NotEmpty(t, op.RequestBody.RawJSON, "request body for %s %s should have RawJSON", op.Method, op.Path)
		}
	}
}

func TestPrintingPress_PrintJSONArtifacts(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	site, err := pp.pressSite()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = PrintJSONArtifacts(site, outputDir)
	require.NoError(t, err)

	// Verify file structure
	assert.FileExists(t, outputDir+"/bundle.json")
	assert.FileExists(t, outputDir+"/index.json")
	assert.FileExists(t, outputDir+"/nav.json")
	assert.FileExists(t, outputDir+"/manifest.json")

	// Verify operation files exist
	for _, op := range site.Operations {
		assert.FileExists(t, outputDir+"/operations/"+op.Slug+".json")
	}

	// Verify model files exist
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			assert.FileExists(t, outputDir+"/models/"+typeSlug+"/"+page.Slug+".json")
		}
	}
}

func TestPrintingPress_WritersDoNotCreateEmptyModelTypeDirs(t *testing.T) {
	site := &Site{
		SpecFormat: "OpenAPI 3.1",
		Root: &RootPage{
			Title: "Synthetic Test",
		},
		Models: map[string][]*ModelPage{
			"schemas": {
				{
					Name:          "Widget",
					Slug:          "widget",
					TypeSlug:      "schemas",
					ComponentType: "schemas",
					SchemaJSON:    `{"type":"object"}`,
				},
			},
		},
		NavModelGroups: []*NavModelGroup{
			{
				Name:     "Schemas",
				TypeSlug: "schemas",
				Models: []*NavModel{
					{
						Name:     "Widget",
						Slug:     "widget",
						TypeSlug: "schemas",
					},
				},
			},
		},
	}
	unusedTypeSlug := "responses"

	htmlOutputDir := t.TempDir()
	err := WriteHTMLSite(site, htmlOutputDir, "")
	require.NoError(t, err)
	assertNoDirExists(t, filepath.Join(htmlOutputDir, "models", unusedTypeSlug))

	jsonOutputDir := t.TempDir()
	err = PrintJSONArtifacts(site, jsonOutputDir)
	require.NoError(t, err)
	assertNoDirExists(t, filepath.Join(jsonOutputDir, "models", unusedTypeSlug))

	llmOutputDir := t.TempDir()
	err = WriteLLMSite(site, llmOutputDir)
	require.NoError(t, err)
	assertNoDirExists(t, filepath.Join(llmOutputDir, "models", unusedTypeSlug))
}

func assertNoDirExists(t *testing.T, path string) {
	t.Helper()
	info, err := os.Stat(path)
	require.Error(t, err)
	assert.True(t, os.IsNotExist(err), "expected %s to not exist, got %v", path, err)
	assert.Nil(t, info)
}

func TestPrintingPress_PrintJSONArtifacts_BundleAndManifest(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	site, err := pp.pressSite()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = PrintJSONArtifacts(site, outputDir)
	require.NoError(t, err)

	bundleBytes, err := os.ReadFile(filepath.Join(outputDir, "bundle.json"))
	require.NoError(t, err)

	var bundle JSONBundle
	require.NoError(t, json.Unmarshal(bundleBytes, &bundle))

	assert.Equal(t, jsonBundleFormat, bundle.Format)
	require.NotNil(t, bundle.Root)
	assert.Equal(t, site.Root.Title, bundle.Root.Title)
	assert.Equal(t, site.SpecFormat, bundle.SpecFormat)
	assert.Equal(t, site.Lite, bundle.Lite)
	require.NotEmpty(t, bundle.Nav)
	require.NotEmpty(t, bundle.ModelGroups)
	require.NotEmpty(t, bundle.Operations)
	require.NotEmpty(t, bundle.Models["schemas"])
	assert.Equal(t, "operations/"+site.Operations[0].Slug+".json", bundle.Operations[0].Path)
	assert.Equal(t, "model", bundle.Models["schemas"][0].Kind)

	manifestBytes, err := os.ReadFile(filepath.Join(outputDir, "manifest.json"))
	require.NoError(t, err)

	var manifest ArtifactManifest
	require.NoError(t, json.Unmarshal(manifestBytes, &manifest))

	assert.Equal(t, jsonManifestFormat, manifest.Format)
	modelCount := 0
	for _, pages := range site.Models {
		modelCount += len(pages)
	}
	expectedCount := 2 + len(site.Operations) + len(site.Webhooks) + modelCount
	if site.Root != nil {
		expectedCount++
	}
	if site.NavTags != nil {
		expectedCount++
	}
	assert.Len(t, manifest.Artifacts, expectedCount)

	artifactsByPath := make(map[string]JSONArtifactEntry, len(manifest.Artifacts))
	for _, artifact := range manifest.Artifacts {
		artifactsByPath[artifact.Path] = artifact
		assert.FileExists(t, filepath.Join(outputDir, artifact.Path))
	}

	assert.Equal(t, "bundle", artifactsByPath["bundle.json"].Kind)
	assert.Equal(t, "root", artifactsByPath["index.json"].Kind)
	assert.Equal(t, "nav", artifactsByPath["nav.json"].Kind)
	assert.Equal(t, "manifest", artifactsByPath["manifest.json"].Kind)
	assert.NotContains(t, artifactsByPath, "AGENTS.md")
	assert.Equal(t, "operation", artifactsByPath["operations/"+site.Operations[0].Slug+".json"].Kind)
	assert.Equal(t, "model", artifactsByPath["models/schemas/"+site.Models["schemas"][0].Slug+".json"].Kind)
}

func TestPrintingPress_WriteHTMLSite(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop"})
	site, err := pp.pressSite()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = WriteHTMLSite(site, outputDir, "")
	require.NoError(t, err)

	// Verify HTML files exist
	assert.FileExists(t, outputDir+"/index.html")
	assert.FileExists(t, outputDir+"/models/index.html")
	assert.FileExists(t, outputDir+"/static/printing-press.css")
	assert.FileExists(t, outputDir+"/static/printing-press.js")
	assert.FileExists(t, outputDir+"/static/printing-press-shared.js")
	assert.NoFileExists(t, outputDir+"/static/printing-press-shared.json")

	// Verify HTML content
	indexHTML, err := os.ReadFile(outputDir + "/index.html")
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), "<!doctype html>")
	assert.Contains(t, string(indexHTML), "Burger Shop")
	assert.Contains(t, string(indexHTML), "pp-layout")
	assert.Contains(t, string(indexHTML), `data-pp-asset-mode="portable"`)
	assert.Contains(t, string(indexHTML), `data-pp-shared="static/printing-press-shared"`)
	assert.Contains(t, string(indexHTML), `<script defer src="static/printing-press.js"></script>`)
	assert.Contains(t, string(indexHTML), `__PP_BOOTSTRAP__`)
	assert.Contains(t, string(indexHTML), `pp-layout-fallback-header`)
	assert.Contains(t, string(indexHTML), `pp-nav-fallback`)
	assert.Contains(t, string(indexHTML), `localStorage.getItem('pb33f-theme')`)
	assert.NotContains(t, string(indexHTML), "pp-schema-registry")
	assert.NotContains(t, string(indexHTML), "data-nav=")
	assert.NotContains(t, string(indexHTML), "data-models=")
	assert.NotContains(t, string(indexHTML), "data-webhooks=")

	sharedJSON, err := os.ReadFile(filepath.Join(outputDir, "static", "printing-press-shared.js"))
	require.NoError(t, err)
	assert.NotContains(t, string(sharedJSON), `"schemaJson"`)
	assert.NotContains(t, string(sharedJSON), `"mockJson"`)
	assert.Contains(t, string(sharedJSON), `"pageDataBase"`)

	for _, op := range site.Operations {
		assert.FileExists(t, outputDir+"/operations/"+op.Slug+".html")
	}
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			assert.FileExists(t, outputDir+"/models/"+typeSlug+"/"+page.Slug+".html")
		}
	}

	require.NotEmpty(t, site.Operations)
	op := site.Operations[0]
	assert.FileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", op.Slug+".js"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", op.Slug+".json"))
	opHTML, err := os.ReadFile(filepath.Join(outputDir, "operations", op.Slug+".html"))
	require.NoError(t, err)
	assert.Contains(t, string(opHTML), `data-pp-page="static/page-data/operations/`+op.Slug+`"`)
	if op.ParametersJSON != "" {
		assert.Contains(t, string(opHTML), `id="section-parameters" data-nav-label="Parameters" style="display:block;min-height:64px;"`)
	}
	if op.CurlJSON != "" {
		assert.Contains(t, string(opHTML), `id="section-curl" data-nav-label="cURL" style="display:block;min-height:64px;"`)
		assert.Contains(t, string(opHTML), `pp-operation-curl" style="display:block;min-height:156px;"`)
	}
	assert.NotContains(t, string(opHTML), "responses-json=")
	assert.NotContains(t, string(opHTML), "parameters-json=")
	assert.NotContains(t, string(opHTML), "curl-json=")
	assert.NotContains(t, string(opHTML), "content-json=")

	var firstModel *ModelPage
	var visualModel *ModelPage
	for typeSlug, pages := range site.Models {
		if typeSlug == "path-items" {
			continue
		}
		if len(pages) > 0 {
			if firstModel == nil {
				firstModel = pages[0]
			}
			for _, page := range pages {
				if page.MermaidDiagram != "" || page.GraphJSON != "" {
					visualModel = page
					break
				}
			}
		}
		if firstModel != nil && visualModel != nil {
			break
		}
	}
	require.NotNil(t, firstModel)
	assert.FileExists(t, filepath.Join(outputDir, "static", "page-data", "models", firstModel.TypeSlug, firstModel.Slug+".js"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-data", "models", firstModel.TypeSlug, firstModel.Slug+".json"))
	modelAssetJSON, err := os.ReadFile(filepath.Join(outputDir, "static", "page-data", "models", firstModel.TypeSlug, firstModel.Slug+".js"))
	require.NoError(t, err)
	assert.Contains(t, string(modelAssetJSON), `"model":{"name":`)
	assert.Contains(t, string(modelAssetJSON), `"schemaJson"`)
	assert.NotContains(t, string(modelAssetJSON), `"pp-mermaid-data"`)
	assert.NotContains(t, string(modelAssetJSON), `"pp-graph-data"`)
	modelHTML, err := os.ReadFile(filepath.Join(outputDir, "models", firstModel.TypeSlug, firstModel.Slug+".html"))
	require.NoError(t, err)
	assert.Contains(t, string(modelHTML), `data-pp-page="static/page-data/models/`+firstModel.TypeSlug+`/`+firstModel.Slug+`"`)
	if firstModel.TypeSlug == "schemas" {
		assert.Contains(t, string(modelHTML), `layout-mode="`)
		assert.Contains(t, string(modelHTML), `estimated-body-height="`)
	}
	assert.NotContains(t, string(modelHTML), "model-json=")
	assert.NotContains(t, string(modelHTML), "mock-json=")
	assert.NotContains(t, string(modelHTML), "schema-raw-json=")
	assert.NotContains(t, string(modelHTML), "schema-raw-yaml=")
	assert.NotContains(t, string(modelHTML), "scheme-json=")

	var modelWithCrossRefs *ModelPage
	for typeSlug, pages := range site.Models {
		if typeSlug == "path-items" {
			continue
		}
		for _, page := range pages {
			if page.CrossRefsJSON != "" {
				modelWithCrossRefs = page
				break
			}
		}
		if modelWithCrossRefs != nil {
			break
		}
	}
	if modelWithCrossRefs != nil {
		crossRefHTML, err := os.ReadFile(filepath.Join(outputDir, "models", modelWithCrossRefs.TypeSlug, modelWithCrossRefs.Slug+".html"))
		require.NoError(t, err)
		assert.Contains(t, string(crossRefHTML), `style="display:block;min-height:`)
	}

	require.NotNil(t, visualModel)
	visualHTML, err := os.ReadFile(filepath.Join(outputDir, "models", visualModel.TypeSlug, visualModel.Slug+".html"))
	require.NoError(t, err)
	if visualModel.MermaidDiagram != "" {
		assert.Contains(t, string(visualHTML), `data-pp-viz-diagram="static/page-viz/models/`+visualModel.TypeSlug+`/`+visualModel.Slug+`-diagram"`)
		assert.FileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-diagram.js"))
		assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-diagram.json"))
		diagramAssetJS, err := os.ReadFile(filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-diagram.js"))
		require.NoError(t, err)
		assert.Contains(t, string(diagramAssetJS), "pp-mermaid-data")
		assert.NotContains(t, string(diagramAssetJS), "pp-graph-data")
		assert.NotContains(t, string(diagramAssetJS), "pp-mermaid-highlighted")
	}
	if visualModel.GraphJSON != "" {
		assert.Contains(t, string(visualHTML), `data-pp-viz-graph="static/page-viz/models/`+visualModel.TypeSlug+`/`+visualModel.Slug+`-graph"`)
		assert.FileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-graph.js"))
		assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-graph.json"))
		graphAssetJS, err := os.ReadFile(filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-graph.js"))
		require.NoError(t, err)
		assert.Contains(t, string(graphAssetJS), "pp-graph-data")
		assert.NotContains(t, string(graphAssetJS), "pp-mermaid-data")
	}
}

func TestPrintingPress_WriteHTMLSite_UsesConfigOutputDirAndBaseURL(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	outputDir := t.TempDir()
	pp := newPressEngine(&pressEngineConfig{
		DrDoc:     drDoc,
		Title:     "Burger Shop",
		OutputDir: outputDir,
		BaseURL:   "/docs/",
	})
	site, err := pp.pressSite()
	require.NoError(t, err)

	err = WriteHTMLSite(site, "", "")
	require.NoError(t, err)

	assert.FileExists(t, outputDir+"/index.html")
	indexHTML, err := os.ReadFile(outputDir + "/index.html")
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), `<base href="/docs/">`)
}

func TestPrintingPress_WriteHTMLSite_ServedModeWritesJSONAssets(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop", AssetMode: HTMLAssetModeServed})
	site, err := pp.pressSite()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = WriteHTMLSite(site, outputDir, "")
	require.NoError(t, err)

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), `data-pp-asset-mode="served"`)
	assert.FileExists(t, filepath.Join(outputDir, "static", "printing-press-shared.json"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "printing-press-shared.js"))

	require.NotEmpty(t, site.Operations)
	assert.FileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", site.Operations[0].Slug+".json"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", site.Operations[0].Slug+".js"))
}

func TestPrintingPress_WriteHTMLSite_CleansStaleHydrationAssetsBetweenModes(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)
	outputDir := t.TempDir()

	portable := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop", AssetMode: HTMLAssetModePortable})
	portableSite, err := portable.pressSite()
	require.NoError(t, err)
	err = WriteHTMLSite(portableSite, outputDir, "")
	require.NoError(t, err)

	require.NotEmpty(t, portableSite.Operations)
	opSlug := portableSite.Operations[0].Slug
	assert.FileExists(t, filepath.Join(outputDir, "static", "printing-press-shared.js"))
	assert.FileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", opSlug+".js"))

	served := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop", AssetMode: HTMLAssetModeServed})
	servedSite, err := served.pressSite()
	require.NoError(t, err)
	err = WriteHTMLSite(servedSite, outputDir, "")
	require.NoError(t, err)

	assert.FileExists(t, filepath.Join(outputDir, "static", "printing-press-shared.json"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "printing-press-shared.js"))
	assert.FileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", opSlug+".json"))
	assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-data", "operations", opSlug+".js"))

	var visualModel *ModelPage
	for typeSlug, pages := range servedSite.Models {
		if typeSlug == "path-items" {
			continue
		}
		for _, page := range pages {
			if page.MermaidDiagram != "" || page.GraphJSON != "" {
				visualModel = page
				break
			}
		}
		if visualModel != nil {
			break
		}
	}
	require.NotNil(t, visualModel)
	if visualModel.MermaidDiagram != "" {
		assert.FileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-diagram.json"))
		assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-diagram.js"))
	}
	if visualModel.GraphJSON != "" {
		assert.FileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-graph.json"))
		assert.NoFileExists(t, filepath.Join(outputDir, "static", "page-viz", "models", visualModel.TypeSlug, visualModel.Slug+"-graph.js"))
	}
}

func TestPrintingPress_PrintJSONArtifacts_UsesConfigOutputDir(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	outputDir := t.TempDir()
	pp := newPressEngine(&pressEngineConfig{
		DrDoc:     drDoc,
		OutputDir: outputDir,
	})
	site, err := pp.pressSite()
	require.NoError(t, err)

	err = PrintJSONArtifacts(site, "")
	require.NoError(t, err)

	assert.FileExists(t, outputDir+"/index.json")
	assert.FileExists(t, outputDir+"/manifest.json")
}

func TestHTMLLinkReachability(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop"})
	site, err := pp.pressSite()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = WriteHTMLSite(site, outputDir, "")
	require.NoError(t, err)

	hrefRe := regexp.MustCompile(`href="([^"]+)"`)
	baseHrefRe := regexp.MustCompile(`<base\s+href="[^"]*"`)
	skipSchemes := []string{"mailto:", "http://", "https://", "javascript:"}

	var allBroken []string
	var dotDotHrefs []string

	err = filepath.Walk(outputDir, func(path string, info os.FileInfo, walkErr error) error {
		if walkErr != nil || info.IsDir() || !strings.HasSuffix(path, ".html") {
			return walkErr
		}

		data, readErr := os.ReadFile(path)
		if readErr != nil {
			return readErr
		}

		content := string(data)

		// Collect base href values to exclude from link checks
		baseHrefs := make(map[string]bool)
		for _, bm := range baseHrefRe.FindAllStringSubmatch(content, -1) {
			if len(bm) > 0 {
				// Extract href value from the matched <base href="..."> string
				inner := hrefRe.FindStringSubmatch(bm[0])
				if len(inner) > 1 {
					baseHrefs[inner[1]] = true
				}
			}
		}

		matches := hrefRe.FindAllStringSubmatch(content, -1)
		for _, m := range matches {
			href := m[1]

			// Skip <base href> values
			if baseHrefs[href] {
				continue
			}

			// Skip anchors and external links
			if strings.HasPrefix(href, "#") {
				continue
			}
			skip := false
			for _, scheme := range skipSchemes {
				if strings.HasPrefix(href, scheme) {
					skip = true
					break
				}
			}
			if skip {
				continue
			}

			// Strip query and fragment
			clean := strings.SplitN(href, "?", 2)[0]
			clean = strings.SplitN(clean, "#", 2)[0]

			// All hrefs must be root-relative (no ../ prefix with <base href>)
			if strings.HasPrefix(clean, "../") {
				rel, _ := filepath.Rel(outputDir, path)
				dotDotHrefs = append(dotDotHrefs, rel+": "+href)
			}

			// Resolve relative to site root
			target := filepath.Join(outputDir, filepath.FromSlash(clean))
			if _, statErr := os.Stat(target); os.IsNotExist(statErr) {
				rel, _ := filepath.Rel(outputDir, path)
				allBroken = append(allBroken, rel+" -> "+href)
			}
		}
		return nil
	})
	require.NoError(t, err)

	assert.Empty(t, dotDotHrefs, "hrefs must be root-relative (no ../ prefix):\n%s",
		strings.Join(dotDotHrefs, "\n"))
	assert.Empty(t, allBroken, "broken links found:\n%s",
		strings.Join(allBroken, "\n"))
}

func TestPrintingPress_ResponseLinks(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	site, err := pp.pressSite()
	require.NoError(t, err)

	// Find the createBurger operation (POST /burgers) — its 200 response has links
	var createBurger *OperationPage
	for _, op := range site.Operations {
		if op.OperationID == "createBurger" {
			createBurger = op
			break
		}
	}
	require.NotNil(t, createBurger, "createBurger operation should exist")

	// Find the 200 response
	var resp200 *ResponseInfo
	for _, r := range createBurger.Responses {
		if r.StatusCode == "200" {
			resp200 = r
			break
		}
	}
	require.NotNil(t, resp200, "200 response should exist on createBurger")
	require.NotEmpty(t, resp200.Links, "200 response should have links")

	// Check $ref links (LocateBurger, AnotherLocateBurger)
	linksByName := make(map[string]*LinkInfo)
	for _, li := range resp200.Links {
		linksByName[li.Name] = li
	}

	locateBurger, ok := linksByName["LocateBurger"]
	require.True(t, ok, "LocateBurger link should exist")
	assert.Equal(t, "locateBurger", locateBurger.OperationId)
	assert.NotNil(t, locateBurger.Ref, "LocateBurger should have a $ref")
	assert.Equal(t, "links", locateBurger.Ref.TypeSlug)

	anotherLocate, ok := linksByName["AnotherLocateBurger"]
	require.True(t, ok, "AnotherLocateBurger link should exist")
	assert.NotNil(t, anotherLocate.Ref, "AnotherLocateBurger should have a $ref")

	// Check operationSlug resolution — locateBurger operationId should resolve to a slug
	assert.NotEmpty(t, locateBurger.OperationSlug, "LocateBurger should have resolved operationSlug")

	// Verify the slug points to an actual operation
	found := false
	for _, op := range site.Operations {
		if op.Slug == locateBurger.OperationSlug {
			found = true
			break
		}
	}
	assert.True(t, found, "operationSlug %q should match an existing operation", locateBurger.OperationSlug)

	// Find ListBurgerDressings link on the locateBurger 200 response (GET /burgers/{burgerId})
	var locateBurgerOp *OperationPage
	for _, op := range site.Operations {
		if op.OperationID == "locateBurger" {
			locateBurgerOp = op
			break
		}
	}
	require.NotNil(t, locateBurgerOp, "locateBurger operation should exist")

	var locateResp200 *ResponseInfo
	for _, r := range locateBurgerOp.Responses {
		if r.StatusCode == "200" {
			locateResp200 = r
			break
		}
	}
	require.NotNil(t, locateResp200, "200 response should exist on locateBurger")
	require.NotEmpty(t, locateResp200.Links, "locateBurger 200 should have links")

	var dressingsLink *LinkInfo
	for _, li := range locateResp200.Links {
		if li.Name == "ListBurgerDressings" {
			dressingsLink = li
			break
		}
	}
	require.NotNil(t, dressingsLink, "ListBurgerDressings link should exist")
	assert.Equal(t, "listBurgerDressings", dressingsLink.OperationId)
	assert.Equal(t, "Try the ketchup!", dressingsLink.Description)
	assert.Nil(t, dressingsLink.Ref, "inline link should not have a $ref")

	// ResponsesJSON should contain the resolved operationSlug
	assert.Contains(t, createBurger.ResponsesJSON, `"operationSlug"`,
		"ResponsesJSON should include operationSlug after resolution")
}

func TestPrintingPress_WebhookNav(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	site, err := pp.pressSite()
	require.NoError(t, err)

	// Webhooks should be collected
	require.NotEmpty(t, site.Webhooks, "burgershop has webhooks")

	// NavWebhooks should be populated
	require.NotEmpty(t, site.NavWebhooks, "NavWebhooks should be populated")
	assert.Len(t, site.NavWebhooks, len(site.Webhooks),
		"NavWebhooks count should match Webhooks count")

	// Each NavWebhook should have method, path, and slug
	for _, nw := range site.NavWebhooks {
		assert.NotEmpty(t, nw.Method, "webhook nav should have method")
		assert.NotEmpty(t, nw.Path, "webhook nav should have path")
		assert.NotEmpty(t, nw.Slug, "webhook nav should have slug")
	}

	// Root page should include webhooks
	require.NotNil(t, site.Root)
	assert.NotEmpty(t, site.Root.Webhooks, "root page should include webhooks")
	assert.Len(t, site.Root.Webhooks, len(site.NavWebhooks))

	// HTML site should write webhook pages
	outputDir := t.TempDir()
	err = WriteHTMLSite(site, outputDir, "")
	require.NoError(t, err)

	for _, wh := range site.Webhooks {
		assert.FileExists(t, filepath.Join(outputDir, "operations", wh.Slug+".html"),
			"webhook page should exist: %s", wh.Slug)
	}
}

func TestPrintingPress_OperationCallbacks(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	site, err := pp.pressSite()
	require.NoError(t, err)

	// Find locateBurger operation — has burgerCallback with $ref
	var locateBurger *OperationPage
	for _, op := range site.Operations {
		if op.OperationID == "locateBurger" {
			locateBurger = op
			break
		}
	}
	require.NotNil(t, locateBurger, "locateBurger operation should exist")

	// Callbacks should be populated
	require.NotEmpty(t, locateBurger.Callbacks, "locateBurger should have callbacks")

	cb := locateBurger.Callbacks[0]
	assert.Equal(t, "burgerCallback", cb.Name)

	// Should have $ref to components/callbacks/BurgerCallback
	require.NotNil(t, cb.Ref, "callback should have a $ref")
	assert.Equal(t, "callbacks", cb.Ref.TypeSlug)
	assert.Equal(t, "BurgerCallback", cb.Ref.Name)

	// Should have operations from the resolved callback
	require.NotEmpty(t, cb.Operations, "callback should have operations")

	cbOp := cb.Operations[0]
	assert.Equal(t, "POST", cbOp.Method)
	assert.Equal(t, "{$request.query.queryUrl}", cbOp.Expression)

	// Callback operation should have a request body
	require.NotNil(t, cbOp.RequestBody, "callback operation should have request body")
	require.NotEmpty(t, cbOp.RequestBody.Content, "request body should have content")

	// Callback operation should have a 200 response
	require.NotEmpty(t, cbOp.Responses, "callback operation should have responses")
	assert.Equal(t, "200", cbOp.Responses[0].StatusCode)

	// CallbacksJSON should be populated
	assert.NotEmpty(t, locateBurger.CallbacksJSON)
	assert.Contains(t, locateBurger.CallbacksJSON, "burgerCallback")

	// Operations without callbacks should have empty Callbacks
	var createBurger *OperationPage
	for _, op := range site.Operations {
		if op.OperationID == "createBurger" {
			createBurger = op
			break
		}
	}
	require.NotNil(t, createBurger)
	assert.Empty(t, createBurger.Callbacks)
	assert.Empty(t, createBurger.CallbacksJSON)
}

func TestPrintingPress_NoV3Document(t *testing.T) {
	drDoc := &model.DrDocument{}
	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})
	_, err := pp.pressSite()
	assert.ErrorIs(t, err, ErrNoV3Document)
}
