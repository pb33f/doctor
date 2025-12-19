// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
)

// SchemaAnalyzer defines the interface for schema relationship analysis
type SchemaAnalyzer interface {
	AnalyzeSchema(schema *v3.Schema, getID func(any) string) []Relationship
	DetectCompositionPattern(schema *v3.Schema, getID func(any) string) CompositionPattern
	AnalyzeProperty(parentSchema, propertySchema *v3.SchemaProxy, propertyName string) *Relationship
	ClearCache()
}

type CompositionPattern string

const (
	PatternInheritance         CompositionPattern = "inheritance"
	PatternMultipleInheritance CompositionPattern = "multiple_inheritance"
	PatternExtension           CompositionPattern = "extension"
	PatternMixin               CompositionPattern = "mixin"
	PatternUnion               CompositionPattern = "union"
	PatternNone                CompositionPattern = "none"
)

type Relationship struct {
	SourceID    string
	TargetID    string
	Type        RelationType
	Label       string
	Cardinality string
	Metadata    map[string]interface{}
}

// CompositionAnalysis provides detailed composition pattern information
type CompositionAnalysis struct {
	Pattern          CompositionPattern
	BaseSchemas      []string
	InlineProperties []string
	IsMixin          bool
	IsExtension      bool
	InheritanceDepth int
}

// RelationshipAnalyzer analyzes schema relationships and composition patterns
type RelationshipAnalyzer struct {
	relCache     *Cache[string, []Relationship]
	patternCache *Cache[string, CompositionPattern]
	maxDepth     int
}

func NewRelationshipAnalyzer(maxDepth int) *RelationshipAnalyzer {
	if maxDepth <= 0 {
		maxDepth = 50
	}
	return &RelationshipAnalyzer{
		relCache:     NewCache[string, []Relationship](1000, 0.2),
		patternCache: NewCache[string, CompositionPattern](1000, 0.2),
		maxDepth:     maxDepth,
	}
}

func (ra *RelationshipAnalyzer) AnalyzeSchema(schema *v3.Schema, getID func(any) string) []Relationship {
	return ra.analyzeSchemaWithDepth(schema, getID, 0)
}

// analyzeSchemaWithDepth analyzes schema relationships with depth tracking to prevent stack overflow
func (ra *RelationshipAnalyzer) analyzeSchemaWithDepth(schema *v3.Schema, getID func(any) string, depth int) []Relationship {
	if schema == nil {
		return nil
	}

	if depth > ra.maxDepth {
		return nil
	}

	schemaID := getID(schema)

	if cached, exists := ra.relCache.Get(schemaID); exists {
		return cached
	}

	var relationships []Relationship

	if schema.AllOf != nil && len(schema.AllOf) > 0 {
		relationships = append(relationships,
			ra.analyzeCompositionSchemas(schema.AllOf, schemaID, RelationInheritance, "allOf", getID)...)
	}

	if schema.OneOf != nil && len(schema.OneOf) > 0 {
		relationships = append(relationships,
			ra.analyzeCompositionSchemas(schema.OneOf, schemaID, RelationAssociation, "oneOf", getID)...)
	}

	if schema.AnyOf != nil && len(schema.AnyOf) > 0 {
		relationships = append(relationships,
			ra.analyzeCompositionSchemas(schema.AnyOf, schemaID, RelationAssociation, "anyOf", getID)...)
	}

	if schema.Items != nil && schema.Items.Value != nil && schema.Items.Value.IsA() {
		if items := schema.Items.A; items != nil {
			rel := Relationship{
				SourceID:    schemaID,
				TargetID:    getID(items),
				Type:        RelationComposition,
				Label:       "items",
				Cardinality: "0..*",
			}
			relationships = append(relationships, rel)
		}
	}

	if schema.AdditionalProperties != nil && schema.AdditionalProperties.Value != nil && schema.AdditionalProperties.Value.IsA() {
		if addProps := schema.AdditionalProperties.A; addProps != nil {
			rel := Relationship{
				SourceID: schemaID,
				TargetID: getID(addProps),
				Type:     RelationComposition,
				Label:    "additionalProperties",
			}
			relationships = append(relationships, rel)
		}
	}

	if schema.Not != nil {
		rel := Relationship{
			SourceID: schemaID,
			TargetID: getID(schema.Not),
			Type:     RelationNegation,
			Label:    "not",
		}
		relationships = append(relationships, rel)
	}

	ra.relCache.Set(schemaID, relationships)
	return relationships
}

// analyzeCompositionSchemas is a helper that eliminates code duplication for allOf/oneOf/anyOf
func (ra *RelationshipAnalyzer) analyzeCompositionSchemas(
	schemas []*v3.SchemaProxy,
	schemaID string,
	relType RelationType,
	label string,
	getID func(any) string,
) []Relationship {
	var relationships []Relationship
	for _, subSchema := range schemas {
		if subSchema != nil {
			relationships = append(relationships, Relationship{
				SourceID: schemaID,
				TargetID: getID(subSchema),
				Type:     relType,
				Label:    label,
			})
		}
	}
	return relationships
}

func (ra *RelationshipAnalyzer) DetectCompositionPattern(schema *v3.Schema, getID func(any) string) CompositionPattern {
	if schema == nil {
		return PatternNone
	}

	schemaID := getID(schema)

	if cached, exists := ra.patternCache.Get(schemaID); exists {
		return cached
	}

	var pattern CompositionPattern

	hasAllOf := schema.AllOf != nil && len(schema.AllOf) > 0
	hasOneOf := schema.OneOf != nil && len(schema.OneOf) > 0
	hasAnyOf := schema.AnyOf != nil && len(schema.AnyOf) > 0
	hasInlineProps := schema.Value != nil && schema.Value.Properties != nil && schema.Value.Properties.Len() > 0

	if hasAllOf {
		allOfCount := len(schema.AllOf)
		hasMixinNaming := false
		hasPropsInAllOfMembers := false

		// check if any allOf member has inline properties (not just top level)
		for _, subSchema := range schema.AllOf {
			if subSchema != nil && subSchema.Schema != nil {
				name := ExtractSchemaNameFromProxy(subSchema)
				if strings.Contains(strings.ToLower(name), "mixin") ||
					strings.Contains(strings.ToLower(name), "trait") {
					hasMixinNaming = true
				}
				// check if this allOf member has inline properties
				if subSchema.Schema.Value != nil && subSchema.Schema.Value.Properties != nil && subSchema.Schema.Value.Properties.Len() > 0 {
					hasPropsInAllOfMembers = true
				}
			}
		}

		// extension pattern: has inline properties either at top level OR in allOf members
		hasAnyInlineProps := hasInlineProps || hasPropsInAllOfMembers

		if hasMixinNaming {
			pattern = PatternMixin
		} else if allOfCount == 1 && !hasAnyInlineProps {
			// pure inheritance: single $ref with no additional properties
			pattern = PatternInheritance
		} else if allOfCount > 1 && !hasAnyInlineProps {
			// multiple inheritance: multiple $refs with no additional properties
			pattern = PatternMultipleInheritance
		} else {
			// extension: has $ref(s) plus additional properties (anywhere in the allOf)
			pattern = PatternExtension
		}
	} else if hasOneOf || hasAnyOf {
		pattern = PatternUnion
	} else {
		pattern = PatternNone
	}

	ra.patternCache.Set(schemaID, pattern)
	return pattern
}

func (ra *RelationshipAnalyzer) AnalyzeProperty(parentSchema, propertySchema *v3.SchemaProxy, propertyName string) *Relationship {
	if parentSchema == nil || propertySchema == nil {
		return nil
	}

	relType := RelationComposition
	if propertySchema.Value != nil && propertySchema.Value.IsReference() {
		relType = RelationAssociation
	}

	return &Relationship{
		Type:  relType,
		Label: propertyName,
	}
}

func (ra *RelationshipAnalyzer) ClearCache() {
	ra.relCache.Clear()
	ra.patternCache.Clear()
}

func (ra *RelationshipAnalyzer) AnalyzeComposition(schema *v3.Schema, getID func(any) string) *CompositionAnalysis {
	if schema == nil {
		return nil
	}

	analysis := &CompositionAnalysis{
		BaseSchemas:      make([]string, 0),
		InlineProperties: make([]string, 0),
	}

	// detect pattern
	analysis.Pattern = ra.DetectCompositionPattern(schema, getID)

	hasAllOf := schema.AllOf != nil && len(schema.AllOf) > 0
	hasInlineProps := schema.Value != nil && schema.Value.Properties != nil && schema.Value.Properties.Len() > 0

	if hasAllOf {
		// separate refs from inline schemas
		for _, allOfSchema := range schema.AllOf {
			if allOfSchema == nil {
				continue
			}

			if allOfSchema.Value != nil && allOfSchema.Value.IsReference() {
				// this is a reference to another schema
				ref := allOfSchema.Value.GetReference()
				analysis.BaseSchemas = append(analysis.BaseSchemas, ref)

				// check for mixin naming
				if strings.Contains(strings.ToLower(ref), "mixin") || strings.Contains(strings.ToLower(ref), "trait") {
					analysis.IsMixin = true
				}
			} else {
				// check if inline schema has a title (could be a base schema or inline extension)
				if allOfSchema.Schema != nil && allOfSchema.Schema.Value != nil {
					title := allOfSchema.Schema.Value.Title
					if title != "" {
						// treat as a base schema
						analysis.BaseSchemas = append(analysis.BaseSchemas, title)

						// check for mixin naming in title
						if strings.Contains(strings.ToLower(title), "mixin") || strings.Contains(strings.ToLower(title), "trait") {
							analysis.IsMixin = true
						}
					}

					// if it has properties, it's also an extension
					if allOfSchema.Schema.Value.Properties != nil && allOfSchema.Schema.Value.Properties.Len() > 0 {
						analysis.IsExtension = true
						// extract inline property names
						for pair := allOfSchema.Schema.Value.Properties.First(); pair != nil; pair = pair.Next() {
							analysis.InlineProperties = append(analysis.InlineProperties, pair.Key())
						}
					}
				}
			}
		}

		// if we have both base schemas and inline properties, it's an extension
		if len(analysis.BaseSchemas) > 0 && (hasInlineProps || len(analysis.InlineProperties) > 0) {
			analysis.IsExtension = true
		}
	}

	return analysis
}
