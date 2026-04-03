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
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// pressFromSpecWithConfig builds a Site from an inline spec with custom config options.
func pressFromSpecWithConfig(t *testing.T, spec string, opts func(*PrintingPressConfig)) *Site {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3)
	cfg := &PrintingPressConfig{DrDoc: drDoc}
	if opts != nil {
		opts(cfg)
	}
	pp := New(cfg)
	site, err := pp.Press()
	require.NoError(t, err)
	return site
}

func findSchema(site *Site, name string) *ModelPage {
	for _, p := range site.Models["schemas"] {
		if p.Name == name {
			return p
		}
	}
	return nil
}

func TestMermaid_DirectRef(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Address:
      type: object
      properties:
        street:
          type: string
    Customer:
      type: object
      properties:
        name:
          type: string
        address:
          $ref: '#/components/schemas/Address'
`
	site := pressFromSpec(t, spec)
	customer := findSchema(site, "Customer")
	require.NotNil(t, customer)
	assert.NotEmpty(t, customer.MermaidDiagram, "schema with $ref property should produce a diagram")
	assert.Contains(t, customer.MermaidDiagram, "classDiagram")
}

func TestMermaid_ArrayItemRef(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Item:
      type: object
      properties:
        id:
          type: string
    Order:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Item'
`
	site := pressFromSpec(t, spec)
	order := findSchema(site, "Order")
	require.NotNil(t, order)
	assert.NotEmpty(t, order.MermaidDiagram, "schema with array item $ref should produce a diagram")
	assert.Contains(t, order.MermaidDiagram, "classDiagram")
}

func TestMermaid_AllOfComposition(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Base:
      type: object
      properties:
        id:
          type: string
    Extended:
      allOf:
        - $ref: '#/components/schemas/Base'
        - type: object
          properties:
            extra:
              type: string
`
	site := pressFromSpec(t, spec)
	extended := findSchema(site, "Extended")
	require.NotNil(t, extended)
	assert.NotEmpty(t, extended.MermaidDiagram, "schema with allOf should produce a diagram")
	assert.Contains(t, extended.MermaidDiagram, "classDiagram")
}

func TestMermaid_ScalarNoDiagram(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    UserId:
      type: string
      format: uuid
`
	site := pressFromSpec(t, spec)
	userId := findSchema(site, "UserId")
	require.NotNil(t, userId)
	assert.Empty(t, userId.MermaidDiagram, "scalar schema should not produce a diagram")
}

func TestMermaid_FlatObjectNoDiagram(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Coordinates:
      type: object
      properties:
        lat:
          type: number
        lon:
          type: number
`
	site := pressFromSpec(t, spec)
	coords := findSchema(site, "Coordinates")
	require.NotNil(t, coords)
	assert.Empty(t, coords.MermaidDiagram, "flat object with only primitive properties should not produce a diagram")
}

func TestMermaid_NoMermaidFlag(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Address:
      type: object
      properties:
        street:
          type: string
    Customer:
      type: object
      properties:
        name:
          type: string
        address:
          $ref: '#/components/schemas/Address'
`
	site := pressFromSpecWithConfig(t, spec, func(cfg *PrintingPressConfig) {
		cfg.NoMermaid = true
	})
	customer := findSchema(site, "Customer")
	require.NotNil(t, customer)
	assert.Empty(t, customer.MermaidDiagram, "NoMermaid should suppress all diagram generation")
}

func TestMermaid_HTMLOutput(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    Address:
      type: object
      properties:
        street:
          type: string
    Customer:
      type: object
      properties:
        name:
          type: string
        address:
          $ref: '#/components/schemas/Address'
    Simple:
      type: string
`
	site := pressFromSpec(t, spec)

	outDir := t.TempDir()
	err := WriteHTMLSite(site, outDir, "")
	require.NoError(t, err)

	// Customer page should contain <pp-class-diagram>
	customerHTML, err := os.ReadFile(filepath.Join(outDir, "models", "schemas", "customer.html"))
	require.NoError(t, err)
	assert.True(t, strings.Contains(string(customerHTML), "<pp-class-diagram>"),
		"customer page should contain <pp-class-diagram>")
	assert.True(t, strings.Contains(string(customerHTML), "pp-mermaid-data"),
		"customer page should contain mermaid data script")

	// Simple page should NOT contain <pp-class-diagram>
	simpleHTML, err := os.ReadFile(filepath.Join(outDir, "models", "schemas", "simple.html"))
	require.NoError(t, err)
	assert.False(t, strings.Contains(string(simpleHTML), "<pp-class-diagram>"),
		"simple schema page should not contain <pp-class-diagram>")
}
