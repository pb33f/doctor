// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewExternalReferenceHandler(t *testing.T) {
	handler := NewExternalReferenceHandler()
	assert.NotNil(t, handler)
	assert.NotNil(t, handler.cache)
}

func TestExternalReferenceHandler_ParseExternalReference_YAMLFile(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("./common/schemas.yaml#/components/schemas/Pet")

	require.NotNil(t, ext)
	assert.Equal(t, "./common/schemas.yaml", ext.FilePath)
	assert.Equal(t, "/components/schemas/Pet", ext.Fragment)
	assert.Equal(t, "Pet", ext.SchemaName)
}

func TestExternalReferenceHandler_ParseExternalReference_JSONFile(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("schemas/user.json#/definitions/User")

	require.NotNil(t, ext)
	assert.Equal(t, "schemas/user.json", ext.FilePath)
	assert.Equal(t, "/definitions/User", ext.Fragment)
	assert.Equal(t, "User", ext.SchemaName)
}

func TestExternalReferenceHandler_ParseExternalReference_LocalReference(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("#/components/schemas/Pet")

	require.NotNil(t, ext)
	assert.Equal(t, "", ext.FilePath) // no file path for local ref
	assert.Equal(t, "#/components/schemas/Pet", ext.Fragment)
	assert.Equal(t, "Pet", ext.SchemaName)
}

func TestExternalReferenceHandler_ParseExternalReference_URLReference(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("https://example.com/api.yaml#/components/schemas/Error")

	require.NotNil(t, ext)
	assert.Equal(t, "https://example.com/api.yaml", ext.FilePath)
	assert.Equal(t, "/components/schemas/Error", ext.Fragment)
	assert.Equal(t, "Error", ext.SchemaName)
}

func TestExternalReferenceHandler_ParseExternalReference_FileWithoutFragment(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("./schemas.yaml")

	require.NotNil(t, ext)
	assert.Equal(t, "./schemas.yaml", ext.FilePath)
	assert.Equal(t, "", ext.Fragment)
	assert.Equal(t, "", ext.SchemaName)
}

func TestExternalReferenceHandler_ParseExternalReference_EmptyString(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ext := handler.ParseExternalReference("")

	assert.Nil(t, ext)
}

func TestExternalReferenceHandler_ParseExternalReference_CachesResults(t *testing.T) {
	handler := NewExternalReferenceHandler()
	ref := "./common/pet.yaml#/Pet"

	ext1 := handler.ParseExternalReference(ref)
	ext2 := handler.ParseExternalReference(ref)

	assert.Equal(t, ext1, ext2) // same object from cache
	assert.Len(t, handler.cache, 1)
}

func TestExternalReferenceHandler_IsExternal_YAMLFile(t *testing.T) {
	handler := NewExternalReferenceHandler()
	assert.True(t, handler.IsExternal("./schemas.yaml#/Pet"))
}

func TestExternalReferenceHandler_IsExternal_LocalReference(t *testing.T) {
	handler := NewExternalReferenceHandler()
	assert.False(t, handler.IsExternal("#/components/schemas/Pet"))
}

func TestExternalReferenceHandler_IsExternal_EmptyString(t *testing.T) {
	handler := NewExternalReferenceHandler()
	assert.False(t, handler.IsExternal(""))
}

func TestExternalReferenceHandler_CreateExternalPlaceholder(t *testing.T) {
	handler := NewExternalReferenceHandler()
	class := handler.CreateExternalPlaceholder("./common/types.yaml#/components/schemas/Address")

	require.NotNil(t, class)
	assert.Equal(t, "Address", class.Name)
	assert.Contains(t, class.Annotations, "external")
	assert.Equal(t, "./common/types.yaml", class.Metadata["file"])
	assert.Equal(t, "/components/schemas/Address", class.Metadata["fragment"])
}

func TestExternalReferenceHandler_CreateExternalPlaceholder_NilRef(t *testing.T) {
	handler := NewExternalReferenceHandler()
	class := handler.CreateExternalPlaceholder("")

	assert.Nil(t, class)
}

func TestExternalReferenceHandler_AnnotateExternalReferences(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "Order",
		TargetID: "./common/address.yaml#/Address",
		Type:     RelationAssociation,
		Label:    "shippingAddress",
	})
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "Order",
		TargetID: "#/components/schemas/LineItem",
		Type:     RelationComposition,
		Label:    "items",
	})

	handler := NewExternalReferenceHandler()
	handler.AnnotateExternalReferences(diagram)

	// first relationship should be marked as external
	assert.True(t, diagram.Relationships[0].Metadata["external"].(bool))
	assert.Equal(t, "./common/address.yaml", diagram.Relationships[0].Metadata["externalFile"])

	// second relationship should not be marked external
	assert.Nil(t, diagram.Relationships[1].Metadata)
}

func TestExternalReferenceHandler_GetExternalReferences(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "A",
		TargetID: "./external1.yaml#/Schema1",
		Type:     RelationAssociation,
	})
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "A",
		TargetID: "./external2.yaml#/Schema2",
		Type:     RelationAssociation,
	})
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "A",
		TargetID: "#/components/schemas/Local",
		Type:     RelationAssociation,
	})

	handler := NewExternalReferenceHandler()
	externalRefs := handler.GetExternalReferences(diagram)

	require.Len(t, externalRefs, 2)
	// verify they're the external ones
	files := make([]string, len(externalRefs))
	for i, ext := range externalRefs {
		files[i] = ext.FilePath
	}
	assert.Contains(t, files, "./external1.yaml")
	assert.Contains(t, files, "./external2.yaml")
}

func TestExternalReferenceHandler_GetExternalReferences_NilDiagram(t *testing.T) {
	handler := NewExternalReferenceHandler()
	refs := handler.GetExternalReferences(nil)

	assert.Nil(t, refs)
}

func TestExternalReferenceHandler_ClearCache(t *testing.T) {
	handler := NewExternalReferenceHandler()
	handler.ParseExternalReference("./test.yaml#/Schema")

	assert.Len(t, handler.cache, 1)

	handler.ClearCache()

	assert.Len(t, handler.cache, 0)
}
