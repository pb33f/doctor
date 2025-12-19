// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
)

// PropertySource tracks where a property originated in the inheritance hierarchy
type PropertySource struct {
	PropertyName string
	SourceSchema string
	Inherited    bool
	Overridden   bool
}

type InheritanceAnalyzer struct {
	cache *Cache[string, map[string]PropertySource]
}

func NewInheritanceAnalyzer() *InheritanceAnalyzer {
	return &InheritanceAnalyzer{
		cache: NewCache[string, map[string]PropertySource](256, 0.2),
	}
}

// FlattenInheritance analyzes inheritance hierarchy and returns property source information
func (ia *InheritanceAnalyzer) FlattenInheritance(schema *v3.Schema, getID func(any) string) map[string]PropertySource {
	if schema == nil {
		return make(map[string]PropertySource)
	}

	schemaID := getID(schema)

	if cached, exists := ia.cache.Get(schemaID); exists {
		return cached
	}

	sources := make(map[string]PropertySource)

	if schema.AllOf == nil {
		ia.addLocalProperties(schema, getID, sources)
		ia.cache.Set(schemaID, sources)
		return sources
	}

	// walk through allOf schemas to collect inherited properties
	for _, allOfSchema := range schema.AllOf {
		if allOfSchema == nil {
			continue
		}

		ia.processAllOfSchema(allOfSchema, getID, sources)
	}

	// mark local properties (not inherited) and detect overrides
	if schema.Value != nil && schema.Value.Properties != nil {
		for pair := schema.Value.Properties.First(); pair != nil; pair = pair.Next() {
			propName := pair.Key()

			if _, exists := sources[propName]; exists {
				sources[propName] = PropertySource{
					PropertyName: propName,
					SourceSchema: schemaID,
					Inherited:    false,
					Overridden:   true,
				}
			} else {
				sources[propName] = PropertySource{
					PropertyName: propName,
					SourceSchema: schemaID,
					Inherited:    false,
					Overridden:   false,
				}
			}
		}
	}

	ia.cache.Set(schemaID, sources)
	return sources
}

func (ia *InheritanceAnalyzer) processAllOfSchema(allOfSchema *v3.SchemaProxy, getID func(any) string, sources map[string]PropertySource) {
	if allOfSchema.Schema == nil || allOfSchema.Schema.Value == nil {
		return
	}

	props := allOfSchema.Schema.Value.Properties
	if props == nil {
		return
	}

	sourceSchemaID := getID(allOfSchema)

	for pair := props.First(); pair != nil; pair = pair.Next() {
		propName := pair.Key()

		if existing, exists := sources[propName]; exists {
			// property conflict from multiple allOf schemas
			existing.Overridden = true
			sources[propName] = existing
		} else {
			sources[propName] = PropertySource{
				PropertyName: propName,
				SourceSchema: sourceSchemaID,
				Inherited:    true,
				Overridden:   false,
			}
		}
	}
}

func (ia *InheritanceAnalyzer) addLocalProperties(schema *v3.Schema, getID func(any) string, sources map[string]PropertySource) {
	if schema.Value == nil || schema.Value.Properties == nil {
		return
	}

	schemaID := getID(schema)

	for pair := schema.Value.Properties.First(); pair != nil; pair = pair.Next() {
		propName := pair.Key()
		sources[propName] = PropertySource{
			PropertyName: propName,
			SourceSchema: schemaID,
			Inherited:    false,
			Overridden:   false,
		}
	}
}

// GetInheritedProperties returns only the inherited properties from a flattened hierarchy
func (ia *InheritanceAnalyzer) GetInheritedProperties(sources map[string]PropertySource) []PropertySource {
	inherited := make([]PropertySource, 0)
	for _, source := range sources {
		if source.Inherited {
			inherited = append(inherited, source)
		}
	}
	return inherited
}

// GetOverriddenProperties returns properties that override inherited definitions
func (ia *InheritanceAnalyzer) GetOverriddenProperties(sources map[string]PropertySource) []PropertySource {
	overridden := make([]PropertySource, 0)
	for _, source := range sources {
		if source.Overridden {
			overridden = append(overridden, source)
		}
	}
	return overridden
}

func (ia *InheritanceAnalyzer) ClearCache() {
	ia.cache.Clear()
}
