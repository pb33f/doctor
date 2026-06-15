// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestPageForResultDefaultsDocumentLevelFindingsToOverview(t *testing.T) {
	pp := &PrintingPress{
		site: &ppmodel.Site{
			Root: &ppmodel.RootPage{Title: "Example API"},
		},
	}
	result := &drV3.RuleFunctionResult{ParentObject: &drV3.Foundation{}}

	href, title := pp.pageForResult(result)

	assert.Equal(t, pppaths.FileIndexHTML, href)
	assert.Equal(t, "Example API", title)
}

func TestPageForResultDefaultsUnownedFindingsToOverview(t *testing.T) {
	pp := &PrintingPress{}

	href, title := pp.pageForResult(&drV3.RuleFunctionResult{})

	assert.Equal(t, pppaths.FileIndexHTML, href)
	assert.Equal(t, "API Overview", title)
}

func TestRegisterDeveloperModelPageSkipsPathItems(t *testing.T) {
	pp := &PrintingPress{
		engineConfig: &pressEngineConfig{DeveloperMode: true},
		site: &ppmodel.Site{
			Root: &ppmodel.RootPage{Title: "Example API"},
		},
	}
	owner := &drV3.Foundation{}
	page := &ppmodel.ModelPage{
		Name:          "SharedPath",
		Slug:          "shared-path",
		TypeSlug:      typeSlugPathItems,
		ComponentType: "pathItems",
	}

	pp.registerDeveloperModelPage(page, owner)

	assert.Empty(t, pp.devModelPages)
	href, title := pp.pageForResult(&drV3.RuleFunctionResult{ParentObject: owner})
	assert.Equal(t, pppaths.FileIndexHTML, href)
	assert.Equal(t, "Example API", title)
}

func TestApplyDeveloperNavCountsOmitsZeroCountsFromJSON(t *testing.T) {
	pp := &PrintingPress{
		site: &ppmodel.Site{
			Root: &ppmodel.RootPage{
				UntaggedOperations: []*ppmodel.NavOperation{
					{Slug: "empty", Method: "GET", Path: "/empty"},
					{Slug: "warn", Method: "GET", Path: "/warn"},
				},
			},
			NavTags: []*ppmodel.NavTag{
				{
					Slug: "tag",
					Operations: []*ppmodel.NavOperation{
						{Slug: "empty-tag", Method: "GET", Path: "/empty-tag"},
						{Slug: "error-tag", Method: "GET", Path: "/error-tag"},
					},
				},
			},
			NavModelGroups: []*ppmodel.NavModelGroup{
				{
					TypeSlug: "schemas",
					Models: []*ppmodel.NavModel{
						{TypeSlug: "schemas", Slug: "empty-model"},
						{TypeSlug: "schemas", Slug: "info-model"},
					},
				},
			},
		},
	}

	pp.applyDeveloperNavCounts(
		map[string]ppmodel.ViolationCounts{
			"empty":     {},
			"warn":      {Warns: 1},
			"empty-tag": {},
			"error-tag": {Errors: 2},
		},
		map[string]ppmodel.ViolationCounts{
			"schemas/empty-model": {},
			"schemas/info-model":  {Infos: 3},
		},
	)

	assert.Nil(t, pp.site.Root.UntaggedOperations[0].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Warns: 1}, pp.site.Root.UntaggedOperations[1].Counts)
	assert.Nil(t, pp.site.NavTags[0].Operations[0].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Errors: 2}, pp.site.NavTags[0].Operations[1].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Errors: 2}, pp.site.NavTags[0].Counts)
	assert.Nil(t, pp.site.NavModelGroups[0].Models[0].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Infos: 3}, pp.site.NavModelGroups[0].Models[1].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Infos: 3}, pp.site.NavModelGroups[0].Counts)

	zeroJSON, err := json.Marshal(pp.site.Root.UntaggedOperations[0])
	assert.NoError(t, err)
	assert.NotContains(t, string(zeroJSON), `"counts"`)

	nonZeroJSON, err := json.Marshal(pp.site.Root.UntaggedOperations[1])
	assert.NoError(t, err)
	assert.Contains(t, string(nonZeroJSON), `"counts"`)
}

func TestBuildDeveloperProblemBucketsAssignsPathLevelFindingsToPathOperations(t *testing.T) {
	pathItem := &drV3.PathItem{}
	getOperation := &drV3.Operation{}
	postOperation := &drV3.Operation{}
	pp := &PrintingPress{
		site: &ppmodel.Site{Root: &ppmodel.RootPage{Title: "Example API"}},
		devOperationPages: []*developerOperationPage{
			{
				page:      &ppmodel.OperationPage{Method: "GET", Path: "/pets", OperationID: "listPets", Slug: "list-pets"},
				pathItem:  pathItem,
				operation: getOperation,
			},
			{
				page:      &ppmodel.OperationPage{Method: "POST", Path: "/pets", OperationID: "createPet", Slug: "create-pet"},
				pathItem:  pathItem,
				operation: postOperation,
			},
		},
	}
	result := &drV3.RuleFunctionResult{
		RuleId:       "path-level",
		RuleSeverity: "warn",
		Path:         "$.paths['/pets'].parameters",
		ParentObject: pathItem,
	}

	buckets := pp.buildDeveloperProblemBuckets([]*drV3.RuleFunctionResult{result}, newDiagnosticBuildCache(), nil)

	assert.Len(t, buckets.operations["list-pets"], 1)
	assert.Len(t, buckets.operations["create-pet"], 1)
	if assert.Len(t, buckets.diagnostics, 1) {
		assert.Equal(t, pppaths.OperationHTML("list-pets"), buckets.diagnostics[0].PageHref)
		assert.Same(t, buckets.diagnostics[0], buckets.operations["list-pets"][0])
		assert.NotSame(t, buckets.diagnostics[0], buckets.operations["create-pet"][0])
	}
}

func TestDeveloperPageIndexOrdersMatchedModelsByRegistrationOrder(t *testing.T) {
	grandparent := &drV3.Foundation{}
	parent := &drV3.Foundation{Parent: grandparent}
	child := &drV3.Foundation{Parent: parent}

	grandparentPage := &developerModelPage{page: &ppmodel.ModelPage{Name: "Grandparent"}}
	parentPage := &developerModelPage{page: &ppmodel.ModelPage{Name: "Parent"}}
	childPage := &developerModelPage{page: &ppmodel.ModelPage{Name: "Child"}}
	index := &developerPageIndex{
		models: map[drV3.Foundational]indexedDeveloperModelPage{
			grandparent: {ref: grandparentPage, order: 1},
			parent:      {ref: parentPage, order: 0},
			child:       {ref: childPage, order: 2},
		},
	}

	matches := index.matchResultOwner(child)

	if assert.Len(t, matches.models, 3) {
		assert.Same(t, parentPage, matches.models[0])
		assert.Same(t, grandparentPage, matches.models[1])
		assert.Same(t, childPage, matches.models[2])
	}
}

func TestDeveloperHydrationDoesNotSerializeServerHighlightedSlices(t *testing.T) {
	payload := buildDeveloperHydrationPayload(
		ppmodel.ViolationCounts{Warns: 1},
		[]*ppmodel.PageProblem{
			{
				ID:              "lint-1",
				Message:         "bad field",
				Severity:        4,
				StartLineNumber: 2,
				SourceLocation:  "openapi.yaml",
				SliceKey:        "slice-1",
			},
		},
		map[string]*ppmodel.YamlSlice{
			"slice-1": {
				Key:       "slice-1",
				File:      "openapi.yaml",
				FirstLine: 1,
				Source:    "openapi: 3.0.3\ninfo:",
			},
		},
		ppmodel.ViolationCounts{},
		0,
	)

	encoded, err := json.Marshal(payload)
	assert.NoError(t, err)
	assert.NotContains(t, string(encoded), "highlighted")
	assert.Contains(t, string(encoded), `"source"`)
}

func TestProblemFromResultFallsBackToConfiguredSpecPathWhenOriginLineIsOutsideFile(t *testing.T) {
	tempDir := t.TempDir()
	shortFile := filepath.Join(tempDir, "root.yaml")
	specFile := filepath.Join(tempDir, "train-travel.yaml")
	writeNumberedSource(t, shortFile, 3)
	writeNumberedSource(t, specFile, 25)

	pp := &PrintingPress{engineConfig: &pressEngineConfig{SpecPath: specFile, SpecFormat: "yaml"}}
	result := &drV3.RuleFunctionResult{
		Message:      "bad field",
		RuleSeverity: "warn",
		Origin: &index.NodeOrigin{
			Line:             20,
			Column:           5,
			AbsoluteLocation: shortFile,
		},
	}

	problem := pp.problemFromResult(result, "models/example.html", "Example", nil)

	if assert.NotNil(t, problem) {
		assert.Equal(t, specFile, problem.SourceLocation)
		assert.Equal(t, 20, problem.StartLineNumber)
	}
}

func TestBuildProblemSlicesFallsBackToConfiguredSpecPathWhenProblemLocationIsOutsideRange(t *testing.T) {
	tempDir := t.TempDir()
	shortFile := filepath.Join(tempDir, "root.yaml")
	specFile := filepath.Join(tempDir, "train-travel.yaml")
	writeNumberedSource(t, shortFile, 3)
	writeNumberedSource(t, specFile, 25)

	pp := &PrintingPress{engineConfig: &pressEngineConfig{SpecPath: specFile, SpecFormat: "yaml"}}
	problem := &ppmodel.PageProblem{
		StartLineNumber: 20,
		EndLineNumber:   20,
		SourceLocation:  shortFile,
	}

	slices := pp.buildProblemSlices([]*ppmodel.PageProblem{problem})

	if assert.Len(t, slices, 1) {
		assert.Equal(t, specFile, problem.SourceLocation)
		assert.NotEmpty(t, problem.SliceKey)
		assert.Empty(t, slices[problem.SliceKey].Source)
		assert.Equal(t, 5, slices[problem.SliceKey].FirstLine)
		assert.Equal(t, 25, slices[problem.SliceKey].LastLine)

		payload := buildDeveloperHydrationPayload(
			ppmodel.ViolationCounts{Warns: 1},
			[]*ppmodel.PageProblem{problem},
			slices,
			ppmodel.ViolationCounts{},
			0,
		)
		require.NotNil(t, payload)
		assert.Contains(t, payload.Slices[problem.SliceKey].Source, "line20: value")
		assert.Empty(t, slices[problem.SliceKey].Source, "hydration must not mutate retained site slices")
	}
}

func TestBuildProblemSlicesWarnsWhenSourceCannotBeResolved(t *testing.T) {
	pp := &PrintingPress{}
	problem := &ppmodel.PageProblem{
		StartLineNumber: 1,
		EndLineNumber:   1,
	}

	slices := pp.buildProblemSlices([]*ppmodel.PageProblem{problem})

	assert.Nil(t, slices)
	if assert.Len(t, pp.warnings, 1) {
		assert.Contains(t, pp.warnings[0].Message, "diagnostics source slice unavailable")
		assert.Equal(t, "<unspecified>", pp.warnings[0].Context)
	}
}

func TestMonacoSeverityTreatsHintAsInfo(t *testing.T) {
	severity, ok := monacoSeverity("hint")

	assert.True(t, ok)
	assert.Equal(t, 2, severity)
}

func writeNumberedSource(t *testing.T, path string, lines int) {
	t.Helper()
	var builder strings.Builder
	for line := 1; line <= lines; line++ {
		_, _ = fmt.Fprintf(&builder, "line%d: value\n", line)
	}
	assert.NoError(t, os.WriteFile(path, []byte(builder.String()), 0o644))
}
