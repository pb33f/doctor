// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewDiscriminatorAnalyzer(t *testing.T) {
	analyzer := NewDiscriminatorAnalyzer()
	assert.NotNil(t, analyzer)
	assert.NotNil(t, analyzer.cache)
}

func TestDiscriminatorAnalyzer_AnalyzeDiscriminator_ExplicitMapping(t *testing.T) {
	// create a schema with explicit discriminator mapping
	mapping := orderedmap.New[string, string]()
	mapping.Set("dog", "#/components/schemas/Dog")
	mapping.Set("cat", "#/components/schemas/Cat")

	discriminator := &base.Discriminator{
		PropertyName: "petType",
		Mapping:      mapping,
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "Pet"
	}

	analyzer := NewDiscriminatorAnalyzer()
	info := analyzer.AnalyzeDiscriminator(schema, getID)

	require.NotNil(t, info)
	assert.Equal(t, "petType", info.PropertyName)
	assert.Equal(t, "Pet", info.BaseSchema)
	assert.False(t, info.Implicit)
	assert.Len(t, info.Mapping, 2)
	assert.Equal(t, "#/components/schemas/Dog", info.Mapping["dog"])
	assert.Equal(t, "#/components/schemas/Cat", info.Mapping["cat"])
}

func TestDiscriminatorAnalyzer_AnalyzeDiscriminator_NoDiscriminator(t *testing.T) {
	schema := &v3.Schema{}

	getID := func(obj any) string {
		return "SimpleSchema"
	}

	analyzer := NewDiscriminatorAnalyzer()
	info := analyzer.AnalyzeDiscriminator(schema, getID)

	assert.Nil(t, info)
}

func TestDiscriminatorAnalyzer_AnalyzeDiscriminator_NilSchema(t *testing.T) {
	getID := func(obj any) string {
		return "Test"
	}

	analyzer := NewDiscriminatorAnalyzer()
	info := analyzer.AnalyzeDiscriminator(nil, getID)

	assert.Nil(t, info)
}

func TestDiscriminatorAnalyzer_AnalyzeDiscriminator_CachesResults(t *testing.T) {
	mapping := orderedmap.New[string, string]()
	mapping.Set("dog", "#/components/schemas/Dog")

	discriminator := &base.Discriminator{
		PropertyName: "petType",
		Mapping:      mapping,
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "Pet"
	}

	analyzer := NewDiscriminatorAnalyzer()

	// first call
	info1 := analyzer.AnalyzeDiscriminator(schema, getID)
	require.NotNil(t, info1)

	// second call should return cached result
	info2 := analyzer.AnalyzeDiscriminator(schema, getID)
	require.NotNil(t, info2)

	// should be the same object (from cache)
	assert.Equal(t, info1, info2)
}

func TestDiscriminatorAnalyzer_DetectImplicitMapping_NoComposition(t *testing.T) {
	discriminator := &base.Discriminator{
		PropertyName: "type",
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "Schema"
	}

	analyzer := NewDiscriminatorAnalyzer()
	mapping := analyzer.DetectImplicitMapping(schema, getID)

	assert.Empty(t, mapping)
}

func TestDiscriminatorAnalyzer_ClearCache(t *testing.T) {
	mapping := orderedmap.New[string, string]()
	mapping.Set("dog", "#/components/schemas/Dog")

	discriminator := &base.Discriminator{
		PropertyName: "petType",
		Mapping:      mapping,
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "Pet"
	}

	analyzer := NewDiscriminatorAnalyzer()
	info := analyzer.AnalyzeDiscriminator(schema, getID)
	require.NotNil(t, info)

	analyzer.ClearCache()

	assert.Equal(t, 0, analyzer.cache.Len())
}

func TestDiscriminatorAnalyzer_GetDiscriminatorForProperty(t *testing.T) {
	mapping := orderedmap.New[string, string]()
	mapping.Set("dog", "#/components/schemas/Dog")

	discriminator := &base.Discriminator{
		PropertyName: "petType",
		Mapping:      mapping,
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "Pet"
	}

	analyzer := NewDiscriminatorAnalyzer()

	// test with matching property name
	info := analyzer.GetDiscriminatorForProperty(schema, "petType", getID)
	require.NotNil(t, info)
	assert.Equal(t, "petType", info.PropertyName)

	// test with non-matching property name
	info2 := analyzer.GetDiscriminatorForProperty(schema, "otherProperty", getID)
	assert.Nil(t, info2)
}

func TestDiscriminatorAnalyzer_EmptyMapping(t *testing.T) {
	discriminator := &base.Discriminator{
		PropertyName: "type",
		Mapping:      orderedmap.New[string, string](),
	}

	schema := &v3.Schema{
		Discriminator: &v3.Discriminator{
			Value: discriminator,
		},
	}

	getID := func(obj any) string {
		return "BaseSchema"
	}

	analyzer := NewDiscriminatorAnalyzer()
	info := analyzer.AnalyzeDiscriminator(schema, getID)

	require.NotNil(t, info)
	assert.Equal(t, "type", info.PropertyName)
	assert.True(t, info.Implicit) // empty mapping triggers implicit detection
	assert.Equal(t, "BaseSchema", info.BaseSchema)
}
