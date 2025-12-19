// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func loadTestSpec(t *testing.T, path string) *model.DrDocument {
	specBytes, err := os.ReadFile(path)
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	// build the model
	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)

	return drDoc
}

// loadTestSpecWithCircularRefs loads a spec that may have circular references (like stripe.yaml)
func loadTestSpecWithCircularRefs(t *testing.T, path string) *model.DrDocument {
	specBytes, err := os.ReadFile(path)
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	// build the model - allow circular reference errors for complex specs like stripe.yaml
	v3Model, _ := doc.BuildV3Model()
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)

	return drDoc
}

func TestMermaidify_BasicSchema(t *testing.T) {
	drDoc := loadTestSpec(t, "../test_specs/burgershop.openapi.yaml")
	require.NotNil(t, drDoc)

	// get a schema to test
	var schema *v3.SchemaProxy
	if drDoc.V3Document.Components != nil && drDoc.V3Document.Components.Schemas != nil {
		for pair := drDoc.V3Document.Components.Schemas.First(); pair != nil; pair = pair.Next() {
			schema = pair.Value()
			break
		}
	}
	require.NotNil(t, schema)

	config := &MermaidConfig{
		MaxProperties:     5,
		IncludeOperations: true,
	}

	diagram := Mermaidify(context.Background(), schema, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	assert.Contains(t, result, "classDiagram")
	assert.Contains(t, result, "class ")

	// verify it contains expected properties (first schema is Error which has message)
	assert.Contains(t, result, "message")
	assert.Contains(t, result, "string")
}

func TestMermaidify_CompleteDocument(t *testing.T) {
	drDoc := loadTestSpec(t, "../test_specs/burgershop.openapi.yaml")
	require.NotNil(t, drDoc)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), drDoc.V3Document, config)
	require.NotNil(t, diagram)

	result := diagram.Render()

	// verify basic structure
	assert.Contains(t, result, "classDiagram")
	assert.Contains(t, result, "class Document")
	assert.Contains(t, result, "class info") // info is lowercase in output
	assert.Contains(t, result, "class Paths")

	// verify relationships
	assert.Contains(t, result, "*--") // composition
	assert.Contains(t, result, "-->") // association
}

func TestMermaidify_CircularReference(t *testing.T) {
	drDoc := loadTestSpecWithCircularRefs(t, "../test_specs/array_circle.yaml")
	require.NotNil(t, drDoc)

	config := DefaultMermaidConfig()

	// test with a schema that has circular references
	diagram := Mermaidify(context.Background(), drDoc.V3Document, config)
	require.NotNil(t, diagram)

	result := diagram.Render()

	// should handle circular refs gracefully
	assert.Contains(t, result, "classDiagram")
	assert.NotContains(t, result, "panic") // no panics in output
}

func TestMermaidify_PathsAndOperations(t *testing.T) {
	drDoc := loadTestSpec(t, "../test_specs/burgershop.openapi.yaml")
	require.NotNil(t, drDoc)

	paths := drDoc.V3Document.Paths
	require.NotNil(t, paths)

	config := &MermaidConfig{
		MaxProperties:     10,
		IncludeOperations: true,
	}

	diagram := Mermaidify(context.Background(), paths, config)
	require.NotNil(t, diagram)

	result := diagram.Render()

	// verify paths structure
	assert.Contains(t, result, "class Paths")
	assert.Contains(t, result, "pathCount")

	// verify operations are referenced
	assert.Contains(t, result, "*--") // composition relationships
}

func TestMermaidify_Components(t *testing.T) {
	drDoc := loadTestSpecWithCircularRefs(t, "../test_specs/stripe.yaml")
	require.NotNil(t, drDoc)

	components := drDoc.V3Document.Components
	require.NotNil(t, components)

	config := &MermaidConfig{
		MaxProperties: 15,
		SimplifyNames: true,
	}

	diagram := Mermaidify(context.Background(), components, config)
	require.NotNil(t, diagram)

	result := diagram.Render()

	// verify components structure
	assert.Contains(t, result, "class Components")
	assert.Contains(t, result, "schema")

	// verify multiple schemas are included
	lines := strings.Split(result, "\n")
	classCount := 0
	for _, line := range lines {
		if strings.Contains(line, "class ") {
			classCount++
		}
	}
	assert.Greater(t, classCount, 5) // should have multiple classes
}

func TestMermaidify_MaxPropertiesConfig(t *testing.T) {
	drDoc := loadTestSpecWithCircularRefs(t, "../test_specs/stripe.yaml")
	require.NotNil(t, drDoc)

	// find a schema with many properties
	var schemaWithManyProps *v3.SchemaProxy
	for pair := drDoc.V3Document.Components.Schemas.First(); pair != nil; pair = pair.Next() {
		if pair.Value().Value != nil && pair.Value().Value.Schema() != nil {
			if pair.Value().Value.Schema().Properties != nil && pair.Value().Value.Schema().Properties.Len() > 5 {
				schemaWithManyProps = pair.Value()
				break
			}
		}
	}
	require.NotNil(t, schemaWithManyProps)

	// test with limited properties
	config := &MermaidConfig{
		MaxProperties: 3,
	}

	diagram := Mermaidify(context.Background(), schemaWithManyProps, config)
	require.NotNil(t, diagram)

	result := diagram.Render()

	// should show "more properties" indicator
	assert.Contains(t, result, "... +")
	assert.Contains(t, result, "more")
}

func TestMermaidify_SecuritySchemes(t *testing.T) {
	drDoc := loadTestSpecWithCircularRefs(t, "../test_specs/stripe.yaml")
	require.NotNil(t, drDoc)

	if drDoc.V3Document.Components.SecuritySchemes != nil {
		for pair := drDoc.V3Document.Components.SecuritySchemes.First(); pair != nil; pair = pair.Next() {
			scheme := pair.Value()
			require.NotNil(t, scheme)

			config := DefaultMermaidConfig()
			diagram := Mermaidify(context.Background(), scheme, config)
			require.NotNil(t, diagram)

			result := diagram.Render()
			assert.Contains(t, result, "securitySchemes") // class name includes path
			assert.Contains(t, result, "type")
			break // test just one
		}
	}
}

func TestMermaidify_RequestBodyAndResponses(t *testing.T) {
	drDoc := loadTestSpec(t, "../test_specs/burgershop.openapi.yaml")
	require.NotNil(t, drDoc)

	// find an operation with request body and responses
	var testOp *v3.Operation
	for pair := drDoc.V3Document.Paths.PathItems.First(); pair != nil; pair = pair.Next() {
		pathItem := pair.Value()
		if pathItem.Post != nil && pathItem.Post.RequestBody != nil {
			testOp = pathItem.Post
			break
		}
	}

	if testOp != nil {
		config := DefaultMermaidConfig()
		diagram := Mermaidify(context.Background(), testOp, config)
		require.NotNil(t, diagram)

		result := diagram.Render()

		// verify request body and responses (responses is lowercase in output)
		assert.Contains(t, result, "RequestBody")
		assert.Contains(t, result, "responses") // lowercase in output
		assert.Contains(t, result, "request")
	}
}

func TestMermaidify_EmptyInput(t *testing.T) {
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), nil, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	assert.Contains(t, result, "classDiagram")
}

func TestMermaidify_RelationshipTypes(t *testing.T) {
	// test different relationship types
	relationships := []struct {
		rel      *MermaidRelationship
		expected string
	}{
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationInheritance},
			"A <|-- B",
		},
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationComposition},
			"A *-- B",
		},
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationAggregation},
			"A o-- B",
		},
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationAssociation},
			"A --> B",
		},
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationDependency},
			"A ..> B",
		},
		{
			&MermaidRelationship{Source: "A", Target: "B", Type: RelationRealization},
			"A ..|> B",
		},
	}

	for _, test := range relationships {
		rendered := test.rel.Render()
		assert.Contains(t, rendered, string(test.rel.Type))
	}
}

func TestSanitizeID(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"simple", "simple"},
		{"path/with/slashes", "path_with_slashes"},
		{"$.components.schemas['Pet']", "C___components_schemas__Pet__"},
		{"123start", "C_123start"},
		{"has-dashes", "has_dashes"},
		{"has.dots", "has_dots"},
		{"has spaces", "has_spaces"},
		{"{brackets}", "C__brackets_"},
	}

	for _, test := range tests {
		result := sanitizeID(test.input)
		assert.Equal(t, test.expected, result, "Failed for input: %s", test.input)
	}
}

func TestMermaidClass_Render(t *testing.T) {
	class := NewMermaidClass("TestClass", "Test Class")
	class.Annotations = []string{"interface"}

	class.AddProperty(&MermaidMember{
		Name:       "id",
		Type:       "string",
		Visibility: "+",
	})

	class.AddProperty(&MermaidMember{
		Name:       "secret",
		Type:       "string",
		Visibility: "-",
	})

	class.AddMethod(&MermaidMember{
		Name:       "getId",
		Type:       "string",
		Visibility: "+",
		Parameters: "",
	})

	// test with private members included
	config := &MermaidConfig{
		IncludePrivate:    true,
		IncludeOperations: true,
		MaxProperties:     10,
	}

	rendered := class.Render(config)
	assert.Contains(t, rendered, "<<interface>>")
	assert.Contains(t, rendered, "+string id")
	assert.Contains(t, rendered, "-string secret")
	assert.Contains(t, rendered, "+getId() string")

	// test with private members excluded
	config.IncludePrivate = false
	rendered = class.Render(config)
	assert.Contains(t, rendered, "+string id")
	assert.NotContains(t, rendered, "-string secret")
}

func TestMermaidRelationship_RenderWithLabelsAndCardinality(t *testing.T) {
	tests := []struct {
		rel      *MermaidRelationship
		contains string
	}{
		{
			&MermaidRelationship{
				Source: "A", Target: "B", Type: RelationComposition,
				Label: "contains",
			},
			": contains",
		},
		{
			&MermaidRelationship{
				Source: "A", Target: "B", Type: RelationAggregation,
				Cardinality: "0..*",
			},
			"\"0..*\"",
		},
		{
			&MermaidRelationship{
				Source: "A", Target: "B", Type: RelationAssociation,
				Label: "uses", Cardinality: "1",
			},
			": uses 1",
		},
	}

	for _, test := range tests {
		rendered := test.rel.Render()
		assert.Contains(t, rendered, test.contains)
	}
}