// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type countingRenderable struct {
	renderCount int
	output      []byte
	err         error
}

func (c *countingRenderable) Render() ([]byte, error) {
	c.renderCount++
	return c.output, c.err
}

// helper to build a Site from an inline OpenAPI spec string.
func pressFromSpec(t *testing.T, spec string) *Site {
	return pressSiteFromSpecWithConfig(t, spec, nil)
}

func pressSiteFromSpecWithConfig(t *testing.T, spec string, configure func(*pressEngineConfig)) *Site {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3)
	cfg := &pressEngineConfig{DrDoc: drDoc}
	if configure != nil {
		configure(cfg)
	}
	pp := newPressEngine(cfg)
	site, err := pp.pressSite()
	require.NoError(t, err)
	return site
}

func buildSyntheticFallbackSpec(operationCount int, usedTags []string, declaredTags []string) string {
	methods := []string{"get", "post", "put", "patch", "delete"}
	pathPrefixes := []string{"accounts", "institutions", "reports", "transactions", "users", "wallets"}
	type operationSpec struct {
		Method  string
		ID      string
		Summary string
		Tag     string
	}
	pathOperations := make(map[string][]operationSpec)
	pathOrder := make([]string, 0, len(pathPrefixes))

	var builder strings.Builder
	builder.WriteString("openapi: \"3.1.0\"\n")
	builder.WriteString("info:\n")
	builder.WriteString("  title: Synthetic Fallback Test\n")
	builder.WriteString("  version: \"1.0\"\n")
	if len(declaredTags) > 0 {
		builder.WriteString("tags:\n")
		for _, tag := range declaredTags {
			builder.WriteString(fmt.Sprintf("  - name: %s\n", tag))
		}
	}
	builder.WriteString("paths:\n")

	for i := 0; i < operationCount; i++ {
		pathPrefix := pathPrefixes[(i/len(methods))%len(pathPrefixes)]
		method := methods[i%len(methods)]
		path := "/" + pathPrefix
		if _, exists := pathOperations[path]; !exists {
			pathOrder = append(pathOrder, path)
		}
		op := operationSpec{
			Method:  method,
			ID:      fmt.Sprintf("op-%d", i),
			Summary: fmt.Sprintf("Operation %d", i),
		}
		if len(usedTags) > 0 {
			op.Tag = usedTags[i%len(usedTags)]
		}
		pathOperations[path] = append(pathOperations[path], op)
	}

	for _, path := range pathOrder {
		builder.WriteString(fmt.Sprintf("  %s:\n", path))
		for _, op := range pathOperations[path] {
			builder.WriteString(fmt.Sprintf("    %s:\n", op.Method))
			builder.WriteString(fmt.Sprintf("      operationId: %s\n", op.ID))
			builder.WriteString(fmt.Sprintf("      summary: %s\n", op.Summary))
			if op.Tag != "" {
				builder.WriteString("      tags:\n")
				builder.WriteString(fmt.Sprintf("        - %s\n", op.Tag))
			}
			builder.WriteString("      responses:\n")
			builder.WriteString("        '200':\n")
			builder.WriteString("          description: ok\n")
		}
	}

	return builder.String()
}

func navTagNames(tags []*NavTag) []string {
	names := make([]string, 0, len(tags))
	for _, tag := range tags {
		names = append(names, tag.Name)
	}
	return names
}

func findNavTag(tags []*NavTag, name string) *NavTag {
	for _, tag := range tags {
		if tag.Name == name {
			return tag
		}
		if child := findNavTag(tag.Children, name); child != nil {
			return child
		}
	}
	return nil
}

func TestSchemaRawData_Parameter_SimpleSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    MyParam:
      name: myParam
      in: query
      required: true
      schema:
        type: string
        format: uuid
        maxLength: 36
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	// SchemaRawYAML must be set and contain only schema fields
	assert.NotEmpty(t, p.SchemaRawYAML, "SchemaRawYAML should be populated for parameters")
	assert.Contains(t, p.SchemaRawYAML, "type: string")
	assert.Contains(t, p.SchemaRawYAML, "format: uuid")
	assert.Contains(t, p.SchemaRawYAML, "maxLength: 36")
	// Must NOT contain parent-level parameter fields
	assert.NotContains(t, p.SchemaRawYAML, "name:")
	assert.NotContains(t, p.SchemaRawYAML, "in:")
	assert.NotContains(t, p.SchemaRawYAML, "required:")

	// No trailing newline
	assert.False(t, strings.HasSuffix(p.SchemaRawYAML, "\n"),
		"SchemaRawYAML should not end with a trailing newline")

	// SchemaRawJSON must be valid JSON containing schema fields
	assert.NotEmpty(t, p.SchemaRawJSON, "SchemaRawJSON should be populated for parameters")
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &schemaObj),
		"SchemaRawJSON must be valid JSON")
	assert.Equal(t, "string", schemaObj["type"])
	assert.Equal(t, "uuid", schemaObj["format"])
	assert.EqualValues(t, 36, schemaObj["maxLength"])
	// Must NOT contain parent-level parameter fields in the JSON
	assert.NotContains(t, p.SchemaRawJSON, `"name"`)
	assert.NotContains(t, p.SchemaRawJSON, `"in"`)

	// RawYAML (full parameter) must still contain all fields
	assert.Contains(t, p.RawYAML, "name:")
	assert.Contains(t, p.RawYAML, "in:")
	assert.False(t, strings.HasSuffix(p.RawYAML, "\n"),
		"RawYAML should not end with a trailing newline")

	// SchemaStartLine must point to the schema content line within the rendered YAML
	// "schema:" appears on some line in RawYAML, and content starts on the next line
	assert.Greater(t, p.SchemaStartLine, 1,
		"SchemaStartLine should be > 1 (schema is not the first line of the parent)")
	// Verify schema: is found in RawYAML by checking the line is reasonable
	schemaKeyLine := 0
	for i, line := range strings.Split(p.RawYAML, "\n") {
		if strings.TrimSpace(line) == "schema:" || strings.HasPrefix(strings.TrimSpace(line), "schema:") {
			schemaKeyLine = i + 1
			break
		}
	}
	assert.Greater(t, schemaKeyLine, 0, "RawYAML should contain schema:")
	// Without origin, SchemaStartLine = 1 + schemaKeyLine (origin defaults to 1)
	assert.Equal(t, schemaKeyLine+1, p.SchemaStartLine,
		"SchemaStartLine should be schema: line + 1 (content starts after the key)")
}

func TestComputeNavModelGroupCardMinWidth(t *testing.T) {
	t.Run("empty uses baseline", func(t *testing.T) {
		assert.Equal(t, 250, computeNavModelGroupCardMinWidth(nil))
	})

	t.Run("short names stay near baseline", func(t *testing.T) {
		pages := []*ModelPage{
			{Name: "User"},
			{Name: "Pet"},
			{Name: "Order"},
		}
		assert.Equal(t, 250, computeNavModelGroupCardMinWidth(pages))
	})

	t.Run("long names increase card width", func(t *testing.T) {
		pages := []*ModelPage{
			{Name: "account_business_profile"},
			{Name: "account_monthly_estimated_revenue"},
			{Name: "account_capability_requirements"},
		}
		assert.Greater(t, computeNavModelGroupCardMinWidth(pages), 250)
	})

	t.Run("very long names clamp to max width", func(t *testing.T) {
		pages := []*ModelPage{
			{Name: strings.Repeat("promotion_code_currency_option", 3)},
		}
		assert.Equal(t, 420, computeNavModelGroupCardMinWidth(pages))
	})
}

func TestBuildNavModelGroups_AssignsAdaptiveCardWidth(t *testing.T) {
	pp := newPressEngine(&pressEngineConfig{})
	pp.site.Models = map[string][]*ModelPage{
		"schemas": {
			{Name: "User", Slug: "user", TypeSlug: "schemas"},
			{Name: "account_monthly_estimated_revenue", Slug: "account-monthly-estimated-revenue", TypeSlug: "schemas"},
		},
	}

	pp.buildNavModelGroups()
	require.Len(t, pp.site.NavModelGroups, 1)

	group := pp.site.NavModelGroups[0]
	assert.Equal(t, "Schemas", group.Name)
	assert.GreaterOrEqual(t, group.CardMinWidth, 250)
	assert.NotEmpty(t, group.CardGridStyle())
	assert.Contains(t, group.CardGridStyle(), "--pp-model-card-min:")
}

func TestCaptureRawData_UsesIdentityCacheAndLazyHighlight(t *testing.T) {
	pp := newPressEngine(&pressEngineConfig{})
	renderable := &countingRenderable{
		output: []byte("type: object\nproperties:\n  id:\n    type: string\n"),
	}

	var rawYAML string
	var schemaJSON string
	pp.captureRawData(renderable, "test", &rawYAML, &schemaJSON, nil)

	require.Equal(t, 1, renderable.renderCount)
	require.NotEmpty(t, rawYAML)
	require.NotEmpty(t, schemaJSON)

	var highlighted string
	pp.captureRawData(renderable, "test", &rawYAML, &schemaJSON, &highlighted)

	assert.Equal(t, 1, renderable.renderCount, "second capture should come from cache")
	assert.NotEmpty(t, highlighted, "highlight should be computed lazily from cached JSON")
	assert.Contains(t, highlighted, "<span")
}

func TestSchemaRawData_Parameter_ObjectSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    FilterParam:
      name: filter
      in: query
      schema:
        type: object
        properties:
          status:
            type: string
          limit:
            type: integer
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	assert.NotEmpty(t, p.SchemaRawYAML)
	assert.Contains(t, p.SchemaRawYAML, "type: object")
	assert.Contains(t, p.SchemaRawYAML, "properties:")
	assert.NotContains(t, p.SchemaRawYAML, "name:")
	assert.NotContains(t, p.SchemaRawYAML, "in:")

	assert.NotEmpty(t, p.SchemaRawJSON)
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &schemaObj))
	assert.Equal(t, "object", schemaObj["type"])
	assert.NotNil(t, schemaObj["properties"])
}

func TestSchemaRawData_Header(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  headers:
    RateLimit:
      description: Rate limit remaining
      schema:
        type: integer
        format: int32
        minimum: 0
`
	site := pressFromSpec(t, spec)

	headers := site.Models["headers"]
	require.Len(t, headers, 1)
	h := headers[0]

	// SchemaRawYAML must contain only schema fields
	assert.NotEmpty(t, h.SchemaRawYAML, "SchemaRawYAML should be populated for headers")
	assert.Contains(t, h.SchemaRawYAML, "type: integer")
	assert.Contains(t, h.SchemaRawYAML, "minimum: 0")
	assert.NotContains(t, h.SchemaRawYAML, "description:")

	assert.False(t, strings.HasSuffix(h.SchemaRawYAML, "\n"),
		"SchemaRawYAML should not end with a trailing newline")

	// SchemaRawJSON must be valid JSON containing schema fields
	assert.NotEmpty(t, h.SchemaRawJSON, "SchemaRawJSON should be populated for headers")
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(h.SchemaRawJSON), &schemaObj))
	assert.Equal(t, "integer", schemaObj["type"])
	assert.Equal(t, "int32", schemaObj["format"])
	assert.EqualValues(t, 0, schemaObj["minimum"])
	assert.NotContains(t, h.SchemaRawJSON, `"description"`)

	// Full RawYAML must contain the description
	assert.Contains(t, h.RawYAML, "description:")

	// SchemaStartLine must be > 1 for headers with fields before schema
	assert.Greater(t, h.SchemaStartLine, 1,
		"SchemaStartLine should be > 1 for header with description before schema")
}

func TestSchemaRawData_Schema_NoSchemaRawFields(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
`
	site := pressFromSpec(t, spec)

	schemas := site.Models["schemas"]
	require.Len(t, schemas, 1)
	s := schemas[0]

	// Schema components must NOT have SchemaRawYAML/JSON (they ARE the schema)
	assert.Empty(t, s.SchemaRawYAML, "schemas should not have SchemaRawYAML")
	assert.Empty(t, s.SchemaRawJSON, "schemas should not have SchemaRawJSON")

	// But must have RawYAML and SchemaJSON
	assert.NotEmpty(t, s.RawYAML)
	assert.NotEmpty(t, s.SchemaJSON)
	assert.False(t, strings.HasSuffix(s.RawYAML, "\n"),
		"RawYAML should not end with a trailing newline")
}

func TestSchemaRawData_ParameterWithoutSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    NoSchemaParam:
      name: noSchema
      in: header
      content:
        application/json:
          schema:
            type: string
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	// Parameter without a direct schema field should have empty schema-specific fields
	assert.Empty(t, p.SchemaRawYAML, "parameter without schema should have no SchemaRawYAML")
	assert.Empty(t, p.SchemaRawJSON, "parameter without schema should have no SchemaRawJSON")
}

func TestAssignOperationsToTags_UnknownTagsFallBackToUntagged(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /pets:
    get:
      operationId: listPets
      tags:
        - Pets
      responses:
        '200':
          description: ok
`
	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 1)
	assert.Empty(t, site.Root.UntaggedOperations)
	require.Len(t, site.NavTags, 1)
	require.Len(t, site.NavTags[0].Operations, 1)
	assert.Equal(t, site.Operations[0].Slug, site.NavTags[0].Operations[0].Slug)
}

func TestPruneEmptyNavTags_RemovesEmptyLeavesAndParents(t *testing.T) {
	tags := []*NavTag{
		{
			Name: "preview",
			Children: []*NavTag{
				{Name: "region"},
			},
		},
		{
			Name: "projects",
			Children: []*NavTag{
				{
					Name: "branches",
					Operations: []*NavOperation{
						{Slug: "list-branches", Path: "/projects/{id}/branches", Method: "GET"},
					},
				},
			},
		},
	}

	pruned := pruneEmptyNavTags(tags)

	require.Len(t, pruned, 1)
	assert.Equal(t, "projects", pruned[0].Name)
	require.Len(t, pruned[0].Children, 1)
	assert.Equal(t, "branches", pruned[0].Children[0].Name)
}

func TestAssignOperationsToTags_PrunesUnusedDeclaredTags(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Neon-ish
  version: "1.0"
tags:
  - name: Preview
  - name: Region
  - name: Projects
paths:
  /projects:
    get:
      operationId: listProjects
      tags: [Projects]
      responses:
        '200':
          description: ok
`

	site := pressFromSpec(t, spec)

	require.Len(t, site.NavTags, 1)
	assert.Equal(t, []string{"Projects"}, navTagNames(site.NavTags))
	assert.Nil(t, findNavTag(site.NavTags, "Preview"))
	assert.Nil(t, findNavTag(site.NavTags, "Region"))
}

func TestAssignOperationsToTags_UsesSyntheticFallbackForLargeSingleTagSpecs(t *testing.T) {
	spec := buildSyntheticFallbackSpec(25, []string{"plaid"}, []string{"plaid"})

	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 25)
	assert.Equal(t, []string{"accounts", "institutions", "reports", "transactions", "users"}, navTagNames(site.NavTags))
	assert.Empty(t, site.Root.UntaggedOperations)
	assert.Equal(t, []string{"accounts"}, site.Operations[0].Tags)
	assert.Equal(t, []string{"Accounts"}, site.Operations[0].TagPath)
}

func TestAssignOperationsToTags_DoesNotUseSyntheticFallbackBelowThreshold(t *testing.T) {
	spec := buildSyntheticFallbackSpec(24, []string{"plaid"}, []string{"plaid"})

	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 24)
	assert.Equal(t, []string{"plaid"}, navTagNames(site.NavTags))
	require.Len(t, site.NavTags[0].Operations, 24)
	assert.Equal(t, []string{"plaid"}, site.Operations[0].Tags)
}

func TestAssignOperationsToTags_DoesNotUseSyntheticFallbackWhenUsedTagsExceedThreshold(t *testing.T) {
	spec := buildSyntheticFallbackSpec(25, []string{"plaid", "balances", "transfers"}, []string{"plaid", "balances", "transfers"})

	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 25)
	assert.Equal(t, []string{"plaid", "balances", "transfers"}, navTagNames(site.NavTags))
	assert.Equal(t, "plaid", site.Operations[0].Tags[0])
}

func TestAssignOperationsToTags_SyntheticFallbackCountsOnlyUsedTags(t *testing.T) {
	spec := buildSyntheticFallbackSpec(25, []string{"plaid"}, []string{"plaid", "unused-a", "unused-b"})

	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 25)
	assert.Equal(t, []string{"accounts", "institutions", "reports", "transactions", "users"}, navTagNames(site.NavTags))
}

func TestAssignOperationsToTags_SyntheticFallbackCanBeDisabled(t *testing.T) {
	spec := buildSyntheticFallbackSpec(25, []string{"plaid"}, []string{"plaid"})

	site := pressSiteFromSpecWithConfig(t, spec, func(cfg *pressEngineConfig) {
		cfg.SyntheticTagFallback = &SyntheticTagFallbackConfig{
			Enabled: false,
		}
	})

	require.Len(t, site.Operations, 25)
	assert.Equal(t, []string{"plaid"}, navTagNames(site.NavTags))
	require.Len(t, site.NavTags[0].Operations, 25)
}

func TestExtractPathGroups_SuppressesVerbOnlySecondSegment(t *testing.T) {
	tests := []struct {
		path     string
		expected [2]string
	}{
		{path: "/cashflow_report/get", expected: [2]string{"cashflow_report", ""}},
		{path: "/cashflow_report/update", expected: [2]string{"cashflow_report", ""}},
		{path: "/cashflow_report/delete", expected: [2]string{"cashflow_report", ""}},
		{path: "/cashflow_report/refresh", expected: [2]string{"cashflow_report", ""}},
		{path: "/cashflow_report/register", expected: [2]string{"cashflow_report", ""}},
		{path: "/cashflow_report/insights", expected: [2]string{"cashflow_report", "insights"}},
		{path: "/v1/cashflow_report/{client_id}/get", expected: [2]string{"cashflow_report", ""}},
	}

	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			l1, l2 := extractPathGroups(tt.path)
			assert.Equal(t, tt.expected[0], l1)
			assert.Equal(t, tt.expected[1], l2)
		})
	}
}

func TestAssignOperationsToTags_SyntheticFallbackSuppressesVerbOnlyChildTags(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Plaid Style Test
  version: "1.0"
tags:
  - name: plaid
paths:
  /cashflow_report/get:
    post:
      operationId: cashflowReportGet
      tags: [plaid]
      responses:
        '200':
          description: ok
  /cashflow_report/refresh:
    post:
      operationId: cashflowReportRefresh
      tags: [plaid]
      responses:
        '200':
          description: ok
  /cashflow_report/insights:
    post:
      operationId: cashflowReportInsights
      tags: [plaid]
      responses:
        '200':
          description: ok
  /cashflow_report/transactions:
    post:
      operationId: cashflowReportTransactions
      tags: [plaid]
      responses:
        '200':
          description: ok
  /accounts/get:
    post:
      operationId: accountsGet
      tags: [plaid]
      responses:
        '200':
          description: ok
`

	site := pressSiteFromSpecWithConfig(t, spec, func(cfg *pressEngineConfig) {
		cfg.SyntheticTagFallback = &SyntheticTagFallbackConfig{
			Enabled:         true,
			MaxDistinctTags: 2,
			MinOperations:   1,
		}
	})

	require.Len(t, site.NavTags, 2)
	assert.Equal(t, []string{"accounts", "cashflow_report"}, navTagNames(site.NavTags))

	var cashflowTag *NavTag
	for _, tag := range site.NavTags {
		if tag.Name == "cashflow_report" {
			cashflowTag = tag
			break
		}
	}
	require.NotNil(t, cashflowTag)
	require.Len(t, cashflowTag.Children, 2)
	assert.Equal(t, []string{"cashflow_report/insights", "cashflow_report/transactions"}, navTagNames(cashflowTag.Children))
	require.Len(t, cashflowTag.Operations, 2)

	opByID := make(map[string]*OperationPage)
	for _, op := range site.Operations {
		opByID[op.OperationID] = op
	}
	assert.Equal(t, []string{"cashflow_report"}, opByID["cashflowReportGet"].Tags)
	assert.Equal(t, []string{"Cashflow Report"}, opByID["cashflowReportGet"].TagPath)
	assert.Equal(t, []string{"cashflow_report"}, opByID["cashflowReportRefresh"].Tags)
	assert.Equal(t, []string{"cashflow_report/insights"}, opByID["cashflowReportInsights"].Tags)
	assert.Equal(t, []string{"Cashflow Report", "Insights"}, opByID["cashflowReportInsights"].TagPath)
	assert.Equal(t, []string{"cashflow_report/transactions"}, opByID["cashflowReportTransactions"].Tags)
	assert.Equal(t, []string{"Cashflow Report", "Transactions"}, opByID["cashflowReportTransactions"].TagPath)
	assert.Equal(t, []string{"accounts"}, opByID["accountsGet"].Tags)
}

func TestCollectOperation_OperationParametersOverridePathParameters(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /pets/{id}:
    parameters:
      - name: id
        in: path
        required: true
        description: path-level
        schema:
          type: string
    get:
      operationId: getPet
      parameters:
        - name: id
          in: path
          required: true
          description: operation-level
          schema:
            type: integer
      responses:
        '200':
          description: ok
`
	site := pressFromSpec(t, spec)

	require.Len(t, site.Operations, 1)
	op := site.Operations[0]
	require.Len(t, op.Parameters, 1)
	assert.Equal(t, "operation-level", op.Parameters[0].Description)

	var schema map[string]any
	require.NoError(t, json.Unmarshal([]byte(op.Parameters[0].SchemaJSON), &schema))
	assert.Equal(t, "integer", schema["type"])

	var paramsJSON []map[string]any
	require.NoError(t, json.Unmarshal([]byte(op.ParametersJSON), &paramsJSON))
	require.Len(t, paramsJSON, 1)
	assert.Equal(t, "operation-level", paramsJSON[0]["description"])
}

func TestResolveComponentLink_DecodesJSONPointerEscapes(t *testing.T) {
	pp := &PrintingPress{
		modelIndex: map[string]*ModelPage{
			"schemas/Foo~/Bar": {Slug: "foo-bar"},
		},
	}

	ref := pp.resolveComponentLink("#/components/schemas/Foo~0~1Bar")
	require.NotNil(t, ref)
	assert.Equal(t, "Foo~/Bar", ref.Name)
	assert.Equal(t, "foo-bar", ref.Slug)
}

func TestSchemaRawData_OtherComponentTypes_NoSchemaRawFields(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  responses:
    NotFound:
      description: Not found
  examples:
    SampleExample:
      summary: A sample
      value: hello
  links:
    GetUser:
      operationId: getUser
      description: Get user by ID
`
	site := pressFromSpec(t, spec)

	for _, typeSlug := range []string{"responses", "examples", "links"} {
		pages := site.Models[typeSlug]
		for _, p := range pages {
			assert.Empty(t, p.SchemaRawYAML, "%s/%s should not have SchemaRawYAML", typeSlug, p.Name)
			assert.Empty(t, p.SchemaRawJSON, "%s/%s should not have SchemaRawJSON", typeSlug, p.Name)
		}
	}
}

func TestSchemaRawData_BurgerShop_Integration(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)
	site := pressFromSpec(t, string(spec))

	// Parameters
	params := site.Models["parameters"]
	require.NotEmpty(t, params, "burgershop should have component parameters")
	for _, p := range params {
		assert.NotEmpty(t, p.SchemaRawYAML, "param %s should have SchemaRawYAML", p.Name)
		assert.NotEmpty(t, p.SchemaRawJSON, "param %s should have SchemaRawJSON", p.Name)
		assert.NotContains(t, p.SchemaRawYAML, "name:", "param %s SchemaRawYAML should not contain name:", p.Name)
		assert.NotContains(t, p.SchemaRawYAML, "in:", "param %s SchemaRawYAML should not contain in:", p.Name)
		assert.False(t, strings.HasSuffix(p.SchemaRawYAML, "\n"),
			"param %s SchemaRawYAML should not end with trailing newline", p.Name)

		var obj map[string]any
		require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &obj),
			"param %s SchemaRawJSON must be valid JSON", p.Name)
	}

	// Headers
	headers := site.Models["headers"]
	require.NotEmpty(t, headers, "burgershop should have component headers")
	for _, h := range headers {
		assert.NotEmpty(t, h.SchemaRawYAML, "header %s should have SchemaRawYAML", h.Name)
		assert.NotEmpty(t, h.SchemaRawJSON, "header %s should have SchemaRawJSON", h.Name)
		assert.False(t, strings.HasSuffix(h.SchemaRawYAML, "\n"),
			"header %s SchemaRawYAML should not end with trailing newline", h.Name)
	}

	// SchemaStartLine must be set and > 1 for params/headers with fields before schema
	for _, p := range params {
		assert.Greater(t, p.SchemaStartLine, 1,
			"param %s SchemaStartLine should be > 1", p.Name)
	}
	for _, h := range headers {
		assert.Greater(t, h.SchemaStartLine, 1,
			"header %s SchemaStartLine should be > 1", h.Name)
	}

	// Schemas must NOT have schema-specific fields
	schemas := site.Models["schemas"]
	require.NotEmpty(t, schemas)
	for _, s := range schemas {
		assert.Empty(t, s.SchemaRawYAML, "schema %s should not have SchemaRawYAML", s.Name)
		assert.Empty(t, s.SchemaRawJSON, "schema %s should not have SchemaRawJSON", s.Name)
		assert.Equal(t, 0, s.SchemaStartLine, "schema %s should have SchemaStartLine=0", s.Name)
	}
}

func TestComputeSchemaStartLine(t *testing.T) {
	tests := []struct {
		name     string
		rawYAML  string
		origin   *bundler.ComponentOrigin
		expected int
	}{
		{
			name:     "schema on line 4, origin line 1",
			rawYAML:  "name: foo\nin: query\nrequired: true\nschema:\n    type: string",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 5, // origin(1) + schemaKeyLine(3, 0-based) + 1
		},
		{
			name:     "schema on line 2, origin line 10",
			rawYAML:  "description: a header\nschema:\n    type: integer",
			origin:   &bundler.ComponentOrigin{Line: 10},
			expected: 12, // origin(10) + schemaKeyLine(1, 0-based) + 1
		},
		{
			name:     "schema on first line, nil origin",
			rawYAML:  "schema:\n    type: string",
			origin:   nil,
			expected: 2, // default origin(1) + schemaKeyLine(0, 0-based) + 1
		},
		{
			name:     "no schema key",
			rawYAML:  "name: foo\nin: query",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 1, // fallback
		},
		{
			name:     "schema with value on same line",
			rawYAML:  "description: test\nschema: {type: string}",
			origin:   &bundler.ComponentOrigin{Line: 5},
			expected: 7, // origin(5) + schemaKeyLine(1, 0-based) + 1
		},
		{
			name:     "schemaVersion key should not match",
			rawYAML:  "schemaVersion: 2\nschema:\n    type: string",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 3, // origin(1) + schemaKeyLine(1, 0-based for "schema:") + 1
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := computeSchemaStartLine(tt.rawYAML, tt.origin)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestComputeCommonHeaders_SharedHeaders(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
			},
		},
		{
			StatusCode: "429",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
				{Name: "Retry-After", SchemaType: "integer", Description: "Seconds to wait"},
			},
		},
	}

	common := computeCommonHeaders(responses)

	// All 4 headers appear in 2+ responses (RateLimit-* in 3, Retry-After only in 1)
	assert.Len(t, common, 3)
	assert.Equal(t, "RateLimit-Limit", common[0].Name)
	assert.Equal(t, "RateLimit-Remaining", common[1].Name)
	assert.Equal(t, "RateLimit-Reset", common[2].Name)
}

func TestComputeCommonHeaders_NoCommon(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "X-Request-Id", SchemaType: "string"},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "X-Error-Code", SchemaType: "string"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_SingleResponse(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_NoHeaders(t *testing.T) {
	responses := []*ResponseInfo{
		{StatusCode: "200"},
		{StatusCode: "404"},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_MixedCommonAndUnique(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "X-Common", SchemaType: "string"},
				{Name: "X-Only-200", SchemaType: "string"},
			},
		},
		{
			StatusCode: "500",
			Headers: []*HeaderInfo{
				{Name: "X-Common", SchemaType: "string"},
				{Name: "X-Only-500", SchemaType: "string"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Len(t, common, 1)
	assert.Equal(t, "X-Common", common[0].Name)
}

func TestComputeCommonHeaders_PreservesFirstOccurrenceData(t *testing.T) {
	ref := &ComponentLink{Name: "RateLimit", TypeSlug: "headers", Slug: "rate-limit"}
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "First desc", Ref: ref},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer", Description: "Second desc"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Len(t, common, 1)
	assert.Equal(t, "integer (int32)", common[0].SchemaType)
	assert.Equal(t, "First desc", common[0].Description)
	assert.Equal(t, ref, common[0].Ref)
}

func TestCollectExtensions_PreservesOrder(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /test:
    get:
      operationId: testOp
      summary: Test
      x-beta: true
      x-sunset-date: "2026-06-01"
      x-rate-limit:
        requests: 120
        window: 60s
      responses:
        '200':
          description: OK
`
	site := pressFromSpec(t, spec)
	require.Len(t, site.Operations, 1)
	op := site.Operations[0]

	require.Len(t, op.Extensions, 3)
	assert.Equal(t, "beta", op.Extensions[0].Key)
	assert.Equal(t, true, op.Extensions[0].Value)
	assert.Equal(t, "sunset-date", op.Extensions[1].Key)
	assert.Equal(t, "2026-06-01", op.Extensions[1].Value)
	assert.Equal(t, "rate-limit", op.Extensions[2].Key)
	// Object value decoded as map
	rateLimit, ok := op.Extensions[2].Value.(map[string]any)
	require.True(t, ok)
	assert.EqualValues(t, 120, rateLimit["requests"])

	// ExtensionsJSON should be non-empty
	assert.NotEmpty(t, op.ExtensionsJSON)
	assert.Contains(t, op.ExtensionsJSON, "beta")
}

func TestCollectExtensions_NoExtensions(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /test:
    get:
      operationId: testOp
      summary: Test
      responses:
        '200':
          description: OK
`
	site := pressFromSpec(t, spec)
	require.Len(t, site.Operations, 1)
	assert.Nil(t, site.Operations[0].Extensions)
	assert.Empty(t, site.Operations[0].ExtensionsJSON)
}

func TestCollectExtensions_NilMap(t *testing.T) {
	result := collectExtensions(nil)
	assert.Nil(t, result)
}

func TestModelExtensions(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: ext-test
  version: "1.0"
paths:
  /test:
    get:
      parameters:
        - $ref: '#/components/parameters/WithExt'
      responses:
        '200':
          description: ok
components:
  schemas:
    WithScalarExt:
      type: string
      x-stability: stable
      x-since-version: "1.0.0"
    WithObjectExt:
      type: object
      x-metadata:
        team: platform
        priority: high
    NoExt:
      type: integer
  parameters:
    WithExt:
      name: token
      in: header
      schema:
        type: string
      x-custom: param-ext-value
`
	site := pressFromSpec(t, spec)

	findModel := func(typeSlug, name string) *ModelPage {
		for _, m := range site.Models[typeSlug] {
			if m.Name == name {
				return m
			}
		}
		return nil
	}

	t.Run("schema with scalar extensions", func(t *testing.T) {
		m := findModel("schemas", "WithScalarExt")
		require.NotNil(t, m)
		require.Len(t, m.Extensions, 2)
		assert.NotEmpty(t, m.ExtensionsJSON)

		extMap := make(map[string]any)
		for _, e := range m.Extensions {
			extMap[e.Key] = e.Value
		}
		assert.Equal(t, "stable", extMap["stability"])
		assert.Equal(t, "1.0.0", extMap["since-version"])
	})

	t.Run("schema with object-valued extension", func(t *testing.T) {
		m := findModel("schemas", "WithObjectExt")
		require.NotNil(t, m)
		require.Len(t, m.Extensions, 1)
		assert.Equal(t, "metadata", m.Extensions[0].Key)

		obj, ok := m.Extensions[0].Value.(map[string]any)
		require.True(t, ok, "object extension value should be a map")
		assert.Equal(t, "platform", obj["team"])
		assert.Equal(t, "high", obj["priority"])
	})

	t.Run("schema with no extensions", func(t *testing.T) {
		m := findModel("schemas", "NoExt")
		require.NotNil(t, m)
		assert.Nil(t, m.Extensions)
		assert.Empty(t, m.ExtensionsJSON)
	})

	t.Run("parameter with extensions via collectRenderable", func(t *testing.T) {
		m := findModel("parameters", "WithExt")
		require.NotNil(t, m)
		require.Len(t, m.Extensions, 1)
		assert.NotEmpty(t, m.ExtensionsJSON)
		assert.Equal(t, "custom", m.Extensions[0].Key)
		assert.Equal(t, "param-ext-value", m.Extensions[0].Value)
	})
}
