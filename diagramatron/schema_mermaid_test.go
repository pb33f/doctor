// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestMermaidifySchema_ReferencesCollectionsAndInlineObjects(t *testing.T) {
	root := neutralSchemaFromSpec(t, `
openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Event:
      type: object
      required: [sentAt, readings]
      properties:
        sentAt:
          $ref: '#/components/schemas/SentAt'
        readings:
          type: array
          minItems: 1
          items:
            $ref: '#/components/schemas/Reading'
        details:
          type: object
          properties:
            source:
              type: string
      additionalProperties:
        $ref: '#/components/schemas/Metadata'
    SentAt:
      type: string
      format: date-time
    Reading:
      type: object
      properties:
        lumens:
          type: integer
    Metadata:
      type: object
      properties:
        value:
          type: string
`, "Event")

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root: root,
		Identity: SchemaIdentity{
			CanonicalPath: "#/components/schemas/Event",
			Name:          "Event",
		},
	}, DefaultMermaidConfig())

	result := diagram.Render()
	assert.Contains(t, result, "class Event")
	assert.Contains(t, result, "class SentAt")
	assert.Contains(t, result, "class Reading")
	assert.Contains(t, result, "class Event_details")
	assert.Contains(t, result, "class Metadata")
	assert.Contains(t, result, "#SentAt sentAt (format:date-time)")
	assert.Contains(t, result, "#Reading[] readings")
	assert.Contains(t, result, "Event *-- SentAt : sentAt")
	assert.Contains(t, result, "Event *-- Reading : readings 1..*")
	assert.Contains(t, result, "Event *-- Event_details : details")
	assert.Contains(t, result, "Event *-- Metadata : additionalProperties 0..*")
}

func TestMermaidifySchema_CompositionAndCycles(t *testing.T) {
	root := neutralSchemaFromSpec(t, `
openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Envelope:
      allOf:
        - $ref: '#/components/schemas/Base'
        - type: object
          properties:
            payload:
              oneOf:
                - $ref: '#/components/schemas/TextPayload'
                - $ref: '#/components/schemas/BinaryPayload'
    Base:
      type: object
      properties:
        parent:
          $ref: '#/components/schemas/Envelope'
    TextPayload:
      type: object
      properties:
        text: {type: string}
    BinaryPayload:
      type: object
      properties:
        data: {type: string, format: byte}
`, "Envelope")

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/Envelope", Name: "Envelope"},
	}, DefaultMermaidConfig())

	result := diagram.Render()
	assert.Contains(t, result, "Base <|-- Envelope : extends")
	assert.Contains(t, result, "Base *-- Envelope : parent")
	assert.Contains(t, result, "TextPayload | BinaryPayload? payload")
	assert.Contains(t, result, "Envelope_allOf2 --> TextPayload : payload")
	assert.Contains(t, result, "Envelope_allOf2 --> BinaryPayload : payload")
	assert.LessOrEqual(t, len(diagram.Classes), 5, "cycle traversal must not duplicate classes")
}

func TestMermaidifySchema_EmptyAndPrimitive(t *testing.T) {
	assert.Empty(t, MermaidifySchema(context.Background(), SchemaDiagramInput{}, nil).Relationships)
	primitive := base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}})
	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     primitive,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/ID", Name: "ID"},
	}, nil)
	assert.Empty(t, diagram.Relationships)
	assert.Contains(t, diagram.Render(), "class ID")
}

func TestMermaidifySchema_UnresolvedReferenceProducesPartialDiagram(t *testing.T) {
	properties := orderedmap.New[string, *base.SchemaProxy]()
	properties.Set("missing", base.CreateSchemaProxyRef("#/components/schemas/Missing"))
	root := base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}, Properties: properties})

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/Root", Name: "Root"},
	}, nil)

	assert.Contains(t, diagram.Render(), "Root *-- Missing : missing")
	assert.Contains(t, diagram.Render(), "class Root")
	assert.Contains(t, diagram.Render(), "class Missing")
}

func TestMermaidifySchema_AliasesShareResolvedIdentity(t *testing.T) {
	root := neutralSchemaFromSpec(t, `
openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Root:
      type: object
      properties:
        first: {$ref: '#/components/schemas/AliasA'}
        second: {$ref: '#/components/schemas/AliasB'}
    AliasA: {$ref: '#/components/schemas/Target'}
    AliasB: {$ref: '#/components/schemas/Target'}
    Target:
      type: object
      properties:
        value: {type: string}
`, "Root")

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/Root", Name: "Root"},
	}, nil)

	result := diagram.Render()
	assert.Contains(t, result, "Root *-- AliasA : first")
	assert.Contains(t, result, "Root *-- AliasA : second")
	assert.Equal(t, 2, len(diagram.Classes), "aliases of one resolved schema must not duplicate classes")
}

func TestMermaidifySchema_SanitizedNameCollisionsRemainDistinct(t *testing.T) {
	root := neutralSchemaFromSpec(t, `
openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Root:
      type: object
      properties:
        dash: {$ref: '#/components/schemas/foo-bar'}
        underscore: {$ref: '#/components/schemas/foo_bar'}
    foo-bar:
      type: object
      properties: {a: {type: string}}
    foo_bar:
      type: object
      properties: {b: {type: string}}
`, "Root")

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/Root", Name: "Root"},
	}, nil)
	result := diagram.Render()

	assert.Contains(t, result, `class foo_bar["foo-bar"] {`)
	assert.Contains(t, result, `class foo_bar_`)
	assert.Contains(t, result, `["foo_bar"]`)
	assert.Equal(t, 3, len(diagram.Classes))
	assert.Len(t, diagram.Relationships, 2)
	assert.NotEqual(t, diagram.Relationships[0].Target, diagram.Relationships[1].Target)
}

func TestMermaidClass_LabelEscaping(t *testing.T) {
	class := NewMermaidClass("safe_id", "unsafe\nname]\\\"quoted")
	class.DisplayName = class.Name
	result := class.Render(DefaultMermaidConfig())

	assert.Contains(t, result, `class safe_id["unsafe name&#93;\\'quoted"] {`)
	assert.NotContains(t, result, "\nname")
}

func TestMermaidClass_LegacyNameDoesNotBecomeDisplayLabel(t *testing.T) {
	class := NewMermaidClass("BookingPayment", "schemas_BookingPayment")

	result := class.Render(DefaultMermaidConfig())

	assert.Contains(t, result, "class BookingPayment {")
	assert.NotContains(t, result, "schemas_BookingPayment")
}

func TestNewSchemaMermaidClass_PreservesNameWhenIDSanitizes(t *testing.T) {
	class := newSchemaMermaidClass(SchemaIdentity{ClassID: "Order Item", Name: "Order Item"})

	assert.Equal(t, "Order_Item", class.ID)
	assert.Equal(t, "Order Item", class.DisplayName)
	assert.Contains(t, class.Render(DefaultMermaidConfig()), `class Order_Item["Order Item"] {`)
}

func TestMermaidifySchema_TraversalBudgets(t *testing.T) {
	properties := orderedmap.New[string, *base.SchemaProxy]()
	for _, name := range []string{"one", "two", "three"} {
		childProperties := orderedmap.New[string, *base.SchemaProxy]()
		childProperties.Set("value", base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}}))
		properties.Set(name, base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}, Title: name, Properties: childProperties}))
	}
	root := base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}, Properties: properties})
	config := DefaultMermaidConfig()
	config.MaxProperties = 1
	config.MaxSchemas = 2
	config.MaxRelationships = 1
	config.MaxDepth = 2

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "root", Name: "Root"},
	}, config)

	assert.LessOrEqual(t, len(diagram.Classes), 2)
	assert.LessOrEqual(t, len(diagram.Relationships), 1)
	require.NotNil(t, diagram.Classes["Root"])
	assert.Len(t, diagram.Classes["Root"].Properties, 1)
	for _, relationship := range diagram.Relationships {
		assert.True(t, diagram.HasClass(relationship.Source))
		assert.True(t, diagram.HasClass(relationship.Target))
	}
}

func TestMermaidifySchema_RelationshipBudgetStopsWideTraversal(t *testing.T) {
	variants := make([]*base.SchemaProxy, 0, 100)
	for i := 0; i < 100; i++ {
		properties := orderedmap.New[string, *base.SchemaProxy]()
		properties.Set("value", base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}}))
		variants = append(variants, base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}, Title: fmt.Sprintf("Variant%d", i), Properties: properties}))
	}
	root := base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}, OneOf: variants})
	config := DefaultMermaidConfig()
	config.MaxSchemas = 10
	config.MaxRelationships = 2

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "root", Name: "Root"},
	}, config)

	assert.LessOrEqual(t, len(diagram.Classes), 3)
	assert.Len(t, diagram.Relationships, 2)
	for _, relationship := range diagram.Relationships {
		assert.True(t, diagram.HasClass(relationship.Source))
		assert.True(t, diagram.HasClass(relationship.Target))
	}
}

func TestMermaidifySchema_BudgetedReferenceKeepsPropertyType(t *testing.T) {
	config := DefaultMermaidConfig()
	config.MaxSchemas = 1
	w := &schemaMermaidWalker{
		diagram:        NewMermaidDiagram(config),
		identityByPath: make(map[string]SchemaIdentity),
		classIDOwner:   make(map[string]string),
		classIDByName:  make(map[string]string),
		active:         map[string]struct{}{"root": {}},
		completed:      make(map[string]struct{}),
	}

	typeName, target, _ := w.propertyType(
		context.Background(),
		SchemaIdentity{CanonicalPath: "root", Name: "Root"},
		"child",
		base.CreateSchemaProxyRef("#/components/schemas/Child"),
		nil,
		false,
	)

	assert.Equal(t, "Child?", typeName)
	assert.Empty(t, target.Name)
}

func TestMermaidifySchema_MultiFileFragmentsRemainDistinct(t *testing.T) {
	dir := t.TempDir()
	external := func(property string) []byte {
		return []byte("components:\n  schemas:\n    Shared:\n      type: object\n      properties:\n        " + property + ": {type: string}\n")
	}
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.yaml"), external("fromA"), 0o600))
	require.NoError(t, os.WriteFile(filepath.Join(dir, "b.yaml"), external("fromB"), 0o600))
	main := []byte(`openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Root:
      type: object
      properties:
        a: {$ref: 'a.yaml#/components/schemas/Shared'}
        b: {$ref: 'b.yaml#/components/schemas/Shared'}
`)
	config := datamodel.NewDocumentConfiguration()
	config.BasePath = dir
	config.SpecFilePath = "root.yaml"
	config.AllowFileReferences = true
	doc, err := libopenapi.NewDocumentWithConfiguration(main, config)
	require.NoError(t, err)
	model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	root := model.Model.Components.Schemas.GetOrZero("Root")
	require.NotNil(t, root)

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:     root,
		Identity: SchemaIdentity{CanonicalPath: "#/components/schemas/Root", Name: "Root"},
	}, nil)

	assert.Equal(t, 3, len(diagram.Classes))
	assert.Len(t, diagram.Relationships, 2)
	assert.NotEqual(t, diagram.Relationships[0].Target, diagram.Relationships[1].Target)
	assert.Contains(t, diagram.Render(), "fromA")
	assert.Contains(t, diagram.Render(), "fromB")
}

func TestMermaidifySchema_DiscriminatorMappingsUseSourceQualifiedReferences(t *testing.T) {
	dir := t.TempDir()
	external := func(property string) []byte {
		return []byte("components:\n  schemas:\n    Shared:\n      type: object\n      properties:\n        " + property + ": {type: string}\n")
	}
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.yaml"), external("fromA"), 0o600))
	require.NoError(t, os.WriteFile(filepath.Join(dir, "b.yaml"), external("fromB"), 0o600))
	main := []byte(`openapi: 3.1.0
info: {title: Test, version: 1.0.0}
paths: {}
components:
  schemas:
    Root:
      oneOf:
        - $ref: './a.yaml#/components/schemas/Shared'
        - $ref: 'b.yaml#/components/schemas/Shared'
      discriminator:
        propertyName: kind
        mapping:
          a: 'a.yaml#/components/schemas/Shared'
          b: 'b.yaml#/components/schemas/Shared'
`)
	config := datamodel.NewDocumentConfiguration()
	config.BasePath = dir
	config.SpecFilePath = "root.yaml"
	config.AllowFileReferences = true
	doc, err := libopenapi.NewDocumentWithConfiguration(main, config)
	require.NoError(t, err)
	model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	root := model.Model.Components.Schemas.GetOrZero("Root")
	require.NotNil(t, root)

	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root: root,
		Identity: SchemaIdentity{
			CanonicalPath:  "#/components/schemas/Root",
			SourceLocation: filepath.Join(dir, "root.yaml"),
			Name:           "Root",
		},
	}, nil)

	var mappingTargets = make(map[string]string)
	for _, relationship := range diagram.Relationships {
		if relationship.Label == "a" || relationship.Label == "b" {
			mappingTargets[relationship.Label] = relationship.Target
		}
	}
	require.NotEmpty(t, mappingTargets["a"])
	require.NotEmpty(t, mappingTargets["b"])
	assert.NotEqual(t, mappingTargets["a"], mappingTargets["b"])
	assert.True(t, mermaidClassHasProperty(diagram.Classes[mappingTargets["a"]], "fromA"))
	assert.True(t, mermaidClassHasProperty(diagram.Classes[mappingTargets["b"]], "fromB"))
}

func TestMermaidifySchema_IdentityProviderWarningsFallBack(t *testing.T) {
	root := base.CreateSchemaProxy(&base.Schema{Type: []string{"object"}})
	diagram := MermaidifySchema(context.Background(), SchemaDiagramInput{
		Root:       root,
		Identity:   SchemaIdentity{CanonicalPath: "root", Name: "Root"},
		Identities: failingSchemaIdentityProvider{},
	}, nil)

	assert.Contains(t, diagram.Render(), "class Root")
	require.Len(t, diagram.Warnings, 1)
	assert.Contains(t, diagram.Warnings[0].Error(), "identity unavailable")
}

type failingSchemaIdentityProvider struct{}

func (failingSchemaIdentityProvider) Identify(context.Context, *base.SchemaProxy, SchemaIdentity) (SchemaIdentity, error) {
	return SchemaIdentity{}, errors.New("identity unavailable")
}

func mermaidClassHasProperty(class *MermaidClass, name string) bool {
	if class == nil {
		return false
	}
	for _, property := range class.Properties {
		if property != nil && property.Name == name {
			return true
		}
	}
	return false
}

func neutralSchemaFromSpec(t *testing.T, spec, name string) *base.SchemaProxy {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, model.Model.Components)
	proxy := model.Model.Components.Schemas.GetOrZero(name)
	require.NotNil(t, proxy)
	return proxy
}
