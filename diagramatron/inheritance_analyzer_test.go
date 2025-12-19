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

func TestNewInheritanceAnalyzer(t *testing.T) {
	analyzer := NewInheritanceAnalyzer()
	assert.NotNil(t, analyzer)
	assert.NotNil(t, analyzer.cache)
}

func TestInheritanceAnalyzer_FlattenInheritance_NoInheritance(t *testing.T) {
	props := orderedmap.New[string, *base.SchemaProxy]()
	props.Set("id", &base.SchemaProxy{})
	props.Set("name", &base.SchemaProxy{})

	schema := &v3.Schema{
		Value: &base.Schema{
			Title:      "SimpleEntity",
			Properties: props,
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(schema, getID)

	require.Len(t, sources, 2)
	assert.False(t, sources["id"].Inherited)
	assert.False(t, sources["name"].Inherited)
	assert.Equal(t, "SimpleEntity", sources["id"].SourceSchema)
}

func TestInheritanceAnalyzer_FlattenInheritance_SingleInheritance(t *testing.T) {
	// parent schema with properties
	parentProps := orderedmap.New[string, *base.SchemaProxy]()
	parentProps.Set("id", &base.SchemaProxy{})
	parentProps.Set("createdAt", &base.SchemaProxy{})

	parentSchema := &v3.Schema{
		Value: &base.Schema{
			Title:      "BaseEntity",
			Properties: parentProps,
		},
	}

	// child schema with parent in allOf
	childProps := orderedmap.New[string, *base.SchemaProxy]()
	childProps.Set("name", &base.SchemaProxy{})

	childSchema := &v3.Schema{
		Value: &base.Schema{
			Title:      "DerivedEntity",
			Properties: childProps,
		},
		AllOf: []*v3.SchemaProxy{
			{Schema: parentSchema},
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		if sp, ok := obj.(*v3.SchemaProxy); ok && sp.Schema != nil && sp.Schema.Value != nil {
			return sp.Schema.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(childSchema, getID)

	require.Len(t, sources, 3)

	// inherited properties
	assert.True(t, sources["id"].Inherited)
	assert.Equal(t, "BaseEntity", sources["id"].SourceSchema)
	assert.True(t, sources["createdAt"].Inherited)
	assert.Equal(t, "BaseEntity", sources["createdAt"].SourceSchema)

	// local property
	assert.False(t, sources["name"].Inherited)
	assert.Equal(t, "DerivedEntity", sources["name"].SourceSchema)
}

func TestInheritanceAnalyzer_FlattenInheritance_PropertyOverride(t *testing.T) {
	// parent with 'name' property
	parentProps := orderedmap.New[string, *base.SchemaProxy]()
	parentProps.Set("name", &base.SchemaProxy{})

	parentSchema := &v3.Schema{
		Value: &base.Schema{
			Title:      "Parent",
			Properties: parentProps,
		},
	}

	// child also has 'name' property (override)
	childProps := orderedmap.New[string, *base.SchemaProxy]()
	childProps.Set("name", &base.SchemaProxy{})

	childSchema := &v3.Schema{
		Value: &base.Schema{
			Title:      "Child",
			Properties: childProps,
		},
		AllOf: []*v3.SchemaProxy{
			{Schema: parentSchema},
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		if sp, ok := obj.(*v3.SchemaProxy); ok && sp.Schema != nil && sp.Schema.Value != nil {
			return sp.Schema.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(childSchema, getID)

	require.Len(t, sources, 1)
	assert.False(t, sources["name"].Inherited) // redefined locally
	assert.True(t, sources["name"].Overridden)
	assert.Equal(t, "Child", sources["name"].SourceSchema)
}

func TestInheritanceAnalyzer_FlattenInheritance_MultipleInheritance(t *testing.T) {
	// first parent
	props1 := orderedmap.New[string, *base.SchemaProxy]()
	props1.Set("name", &base.SchemaProxy{})

	parent1 := &v3.Schema{
		Value: &base.Schema{
			Title:      "Nameable",
			Properties: props1,
		},
	}

	// second parent
	props2 := orderedmap.New[string, *base.SchemaProxy]()
	props2.Set("createdAt", &base.SchemaProxy{})

	parent2 := &v3.Schema{
		Value: &base.Schema{
			Title:      "Timestamped",
			Properties: props2,
		},
	}

	// child inherits from both
	childSchema := &v3.Schema{
		Value: &base.Schema{
			Title: "Entity",
		},
		AllOf: []*v3.SchemaProxy{
			{Schema: parent1},
			{Schema: parent2},
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		if sp, ok := obj.(*v3.SchemaProxy); ok && sp.Schema != nil && sp.Schema.Value != nil {
			return sp.Schema.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(childSchema, getID)

	require.Len(t, sources, 2)
	assert.True(t, sources["name"].Inherited)
	assert.Equal(t, "Nameable", sources["name"].SourceSchema)
	assert.True(t, sources["createdAt"].Inherited)
	assert.Equal(t, "Timestamped", sources["createdAt"].SourceSchema)
}

func TestInheritanceAnalyzer_FlattenInheritance_ConflictingProperties(t *testing.T) {
	// both parents have same property
	props1 := orderedmap.New[string, *base.SchemaProxy]()
	props1.Set("id", &base.SchemaProxy{})

	parent1 := &v3.Schema{
		Value: &base.Schema{
			Title:      "Parent1",
			Properties: props1,
		},
	}

	props2 := orderedmap.New[string, *base.SchemaProxy]()
	props2.Set("id", &base.SchemaProxy{})

	parent2 := &v3.Schema{
		Value: &base.Schema{
			Title:      "Parent2",
			Properties: props2,
		},
	}

	childSchema := &v3.Schema{
		Value: &base.Schema{
			Title: "Child",
		},
		AllOf: []*v3.SchemaProxy{
			{Schema: parent1},
			{Schema: parent2},
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		if sp, ok := obj.(*v3.SchemaProxy); ok && sp.Schema != nil && sp.Schema.Value != nil {
			return sp.Schema.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(childSchema, getID)

	require.Len(t, sources, 1)
	// conflict detected - marked as overridden
	assert.True(t, sources["id"].Overridden)
}

func TestInheritanceAnalyzer_FlattenInheritance_NilSchema(t *testing.T) {
	getID := func(obj any) string { return "test" }

	analyzer := NewInheritanceAnalyzer()
	sources := analyzer.FlattenInheritance(nil, getID)

	assert.Empty(t, sources)
}

func TestInheritanceAnalyzer_FlattenInheritance_CachesResults(t *testing.T) {
	schema := &v3.Schema{
		Value: &base.Schema{
			Title: "TestSchema",
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()

	sources1 := analyzer.FlattenInheritance(schema, getID)
	sources2 := analyzer.FlattenInheritance(schema, getID)

	// should return same result from cache
	assert.Equal(t, sources1, sources2)
	assert.Equal(t, 1, analyzer.cache.Len())
}

func TestInheritanceAnalyzer_GetInheritedProperties(t *testing.T) {
	sources := map[string]PropertySource{
		"id":        {PropertyName: "id", Inherited: true, SourceSchema: "Base"},
		"name":      {PropertyName: "name", Inherited: false, SourceSchema: "Derived"},
		"createdAt": {PropertyName: "createdAt", Inherited: true, SourceSchema: "Base"},
	}

	analyzer := NewInheritanceAnalyzer()
	inherited := analyzer.GetInheritedProperties(sources)

	require.Len(t, inherited, 2)
	// order may vary, so check by name
	names := make([]string, len(inherited))
	for i, prop := range inherited {
		names[i] = prop.PropertyName
	}
	assert.Contains(t, names, "id")
	assert.Contains(t, names, "createdAt")
}

func TestInheritanceAnalyzer_GetOverriddenProperties(t *testing.T) {
	sources := map[string]PropertySource{
		"id":   {PropertyName: "id", Overridden: false},
		"name": {PropertyName: "name", Overridden: true},
		"age":  {PropertyName: "age", Overridden: true},
	}

	analyzer := NewInheritanceAnalyzer()
	overridden := analyzer.GetOverriddenProperties(sources)

	require.Len(t, overridden, 2)
	names := make([]string, len(overridden))
	for i, prop := range overridden {
		names[i] = prop.PropertyName
	}
	assert.Contains(t, names, "name")
	assert.Contains(t, names, "age")
}

func TestInheritanceAnalyzer_ClearCache(t *testing.T) {
	schema := &v3.Schema{
		Value: &base.Schema{
			Title: "Test",
		},
	}

	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok && s.Value != nil {
			return s.Value.Title
		}
		return "Unknown"
	}

	analyzer := NewInheritanceAnalyzer()
	analyzer.FlattenInheritance(schema, getID)

	assert.Equal(t, 1, analyzer.cache.Len())

	analyzer.ClearCache()

	assert.Equal(t, 0, analyzer.cache.Len())
}
