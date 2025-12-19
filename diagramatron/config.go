// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

// VisualizationConfig is the master configuration for diagram generation
type VisualizationConfig struct {
	General  *GeneralConfig
	Schema   *SchemaConfig
	Relation *RelationshipConfig
	Filter   *FilterConfig
	Output   *OutputConfig
}

// GeneralConfig holds general diagram settings
type GeneralConfig struct {
	Title       string
	Description string
	MaxDepth    int
}

// SchemaConfig configures schema visualization behavior
type SchemaConfig struct {
	MaxProperties         int
	MaxDepth              int
	ShowConstraints       bool
	ShowEnums             bool
	ShowDiscriminators    bool
	ShowFormat            bool
	InheritedProperties   bool
	CollapseLargeSchemas  bool
	LargeSchemaThreshold  int
	ShowPropertyDefaults  bool
	ShowDeprecated        bool
	EnumVisualization     EnumVisualization // how to render enums (inline, class, comment)
	MaxInlineEnumValues   int               // max enum values to show inline (default: 5)
}

// RelationshipConfig configures relationship detection and display
type RelationshipConfig struct {
	DetectPolymorphism  bool
	SimplifyReferences  bool
	ShowCardinality      bool
	AnalyzePropertyTypes bool
	DetectBidirectional  bool
	MergeDuplicateRefs   bool
}

// FilterConfig defines filtering rules for diagram generation
type FilterConfig struct {
	IncludeTags       []string
	ExcludeTags       []string
	IncludePaths      []string
	ExcludePaths      []string
	OnlyOperations    []string
	OnlySchemas       []string
	ExcludeDeprecated bool
	MaxComplexity     int
}

// OutputConfig configures output formatting
type OutputConfig struct {
	Format          RenderFormat
	IncludePrivate  bool
	IncludeOperations bool
	UseNamespaces   bool
	SimplifyNames   bool
	ShowMetadata    bool
}

// DefaultVisualizationConfig returns a sensible default configuration
func DefaultVisualizationConfig() *VisualizationConfig {
	return &VisualizationConfig{
		General: &GeneralConfig{
			MaxDepth: 50,
		},
		Schema: &SchemaConfig{
			MaxProperties:        20,
			MaxDepth:             10,
			ShowConstraints:      true,
			ShowEnums:            true,
			ShowDiscriminators:   true,
			ShowFormat:           true,
			InheritedProperties:  false,
			CollapseLargeSchemas: true,
			LargeSchemaThreshold: 50,
			ShowPropertyDefaults: true,
			ShowDeprecated:       true,
			EnumVisualization:    EnumInline,
			MaxInlineEnumValues:  5,
		},
		Relation: &RelationshipConfig{
			DetectPolymorphism:   true,
			SimplifyReferences:   false,
			ShowCardinality:      true,
			AnalyzePropertyTypes: true,
			DetectBidirectional:  true,
			MergeDuplicateRefs:   false,
		},
		Filter: &FilterConfig{
			IncludeTags:       []string{},
			ExcludeTags:       []string{},
			IncludePaths:      []string{},
			ExcludePaths:      []string{},
			OnlyOperations:    []string{},
			OnlySchemas:       []string{},
			ExcludeDeprecated: false,
			MaxComplexity:     1000,
		},
		Output: &OutputConfig{
			Format:            FormatMermaidClass,
			IncludePrivate:    true,
			IncludeOperations: true,
			UseNamespaces:     false,
			SimplifyNames:     true,
			ShowMetadata:      false,
		},
	}
}

// Validate checks configuration for invalid values and returns errors
func (vc *VisualizationConfig) Validate() []string {
	errors := make([]string, 0)

	if vc.General != nil {
		if vc.General.MaxDepth < 1 {
			errors = append(errors, "general.maxDepth must be at least 1")
		}
		if vc.General.MaxDepth > 200 {
			errors = append(errors, "general.maxDepth should not exceed 200 (risk of stack overflow)")
		}
	}

	if vc.Schema != nil {
		if vc.Schema.MaxProperties < 0 {
			errors = append(errors, "schema.maxProperties cannot be negative")
		}
		if vc.Schema.MaxDepth < 1 {
			errors = append(errors, "schema.maxDepth must be at least 1")
		}
		if vc.Schema.LargeSchemaThreshold < 10 {
			errors = append(errors, "schema.largeSchemaThreshold should be at least 10")
		}
	}

	if vc.Filter != nil {
		if vc.Filter.MaxComplexity < 0 {
			errors = append(errors, "filter.maxComplexity cannot be negative")
		}
		// check for conflicting filters
		if len(vc.Filter.IncludeTags) > 0 && len(vc.Filter.ExcludeTags) > 0 {
			for _, includeTag := range vc.Filter.IncludeTags {
				for _, excludeTag := range vc.Filter.ExcludeTags {
					if includeTag == excludeTag {
						errors = append(errors, "filter.includeTags and filter.excludeTags contain same tag: "+includeTag)
					}
				}
			}
		}
	}

	return errors
}

// ApplyDefaults fills in missing configuration with defaults
func (vc *VisualizationConfig) ApplyDefaults() {
	defaults := DefaultVisualizationConfig()

	if vc.General == nil {
		vc.General = defaults.General
	}
	if vc.Schema == nil {
		vc.Schema = defaults.Schema
	}
	if vc.Relation == nil {
		vc.Relation = defaults.Relation
	}
	if vc.Filter == nil {
		vc.Filter = defaults.Filter
	}
	if vc.Output == nil {
		vc.Output = defaults.Output
	}
}

// ToMermaidConfig converts VisualizationConfig to legacy MermaidConfig for backwards compatibility
func (vc *VisualizationConfig) ToMermaidConfig() *MermaidConfig {
	mc := &MermaidConfig{
		MaxProperties:     20,
		IncludePrivate:    true,
		IncludeOperations: true,
		ShowCardinality:   true,
		UseNamespaces:     false,
		SimplifyNames:     true,
	}

	if vc.Schema != nil {
		mc.MaxProperties = vc.Schema.MaxProperties
	}

	if vc.Output != nil {
		mc.IncludePrivate = vc.Output.IncludePrivate
		mc.IncludeOperations = vc.Output.IncludeOperations
		mc.UseNamespaces = vc.Output.UseNamespaces
		mc.SimplifyNames = vc.Output.SimplifyNames
	}

	if vc.Relation != nil {
		mc.ShowCardinality = vc.Relation.ShowCardinality
	}

	return mc
}
