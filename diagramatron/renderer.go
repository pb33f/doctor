// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"strings"
)

// DiagramRenderer defines the interface for rendering diagrams in various formats
type DiagramRenderer interface {
	RenderClass(class *DiagramClass) string
	RenderRelationship(rel *DiagramRelationship) string
	RenderDiagram(diagram *Diagram) string
	GetFormat() RenderFormat
}

// RenderFormat defines supported output formats
type RenderFormat string

const (
	FormatMermaidClass    RenderFormat = "mermaid-class"
	FormatMermaidSequence RenderFormat = "mermaid-sequence"
	FormatPlantUML        RenderFormat = "plantuml"
	FormatD3JSON          RenderFormat = "d3-json"
)

// MermaidClassRenderer renders diagrams in Mermaid class diagram format
type MermaidClassRenderer struct {
	config *MermaidConfig
}

// NewMermaidClassRenderer creates a new Mermaid class diagram renderer
func NewMermaidClassRenderer(config *MermaidConfig) *MermaidClassRenderer {
	if config == nil {
		config = DefaultMermaidConfig()
	}
	return &MermaidClassRenderer{
		config: config,
	}
}

// GetFormat returns the format this renderer produces
func (mcr *MermaidClassRenderer) GetFormat() RenderFormat {
	return FormatMermaidClass
}

// RenderClass renders a single class in Mermaid format
func (mcr *MermaidClassRenderer) RenderClass(class *DiagramClass) string {
	if class == nil {
		return ""
	}

	var sb strings.Builder

	// class definition
	sb.WriteString(fmt.Sprintf("  class %s {\n", sanitizeID(class.ID)))

	// annotations
	for _, annotation := range class.Annotations {
		sb.WriteString(fmt.Sprintf("    <<%s>>\n", annotation))
	}

	// properties (limited by config)
	propCount := len(class.Properties)
	maxProps := mcr.config.MaxProperties
	if maxProps > 0 && propCount > maxProps {
		propCount = maxProps
	}

	for i := 0; i < propCount; i++ {
		prop := class.Properties[i]
		if !mcr.config.IncludePrivate && prop.Visibility == VisibilityPrivate {
			continue
		}

		// build property string with constraints if configured
		propStr := mcr.renderProperty(prop)
		sb.WriteString(fmt.Sprintf("    %s\n", propStr))
	}

	// show truncation message if properties were cut off
	if maxProps > 0 && len(class.Properties) > maxProps {
		sb.WriteString(fmt.Sprintf("    ... +%d more properties\n", len(class.Properties)-maxProps))
	}

	// methods
	if mcr.config.IncludeOperations {
		for _, method := range class.Methods {
			if !mcr.config.IncludePrivate && method.Visibility == VisibilityPrivate {
				continue
			}
			sb.WriteString(fmt.Sprintf("    %s%s(%s) %s\n",
				method.Visibility, method.Name, method.Parameters, method.ReturnType))
		}
	}

	sb.WriteString("  }")
	return sb.String()
}

// renderProperty renders a single property with optional constraints
func (mcr *MermaidClassRenderer) renderProperty(prop *DiagramProperty) string {
	estimatedSize := len(prop.Type) + len(prop.Name) + 20
	if prop.Constraints != nil {
		estimatedSize += 100
	}

	var sb strings.Builder
	sb.Grow(estimatedSize)

	sb.WriteString(string(prop.Visibility))
	sb.WriteString(prop.Type)
	sb.WriteString(" ")
	sb.WriteString(prop.Name)

	if prop.ReadOnly {
		sb.WriteString(" <<readOnly>>")
	}
	if prop.WriteOnly {
		sb.WriteString(" <<writeOnly>>")
	}
	if prop.Deprecated {
		sb.WriteString(" <<deprecated>>")
	}

	if prop.IsDiscriminator {
		sb.WriteString(" <<discriminator>>")
		if len(prop.DiscriminatorValues) > 0 && len(prop.DiscriminatorValues) <= 3 {
			sb.WriteString(" (")
			sb.WriteString(strings.Join(prop.DiscriminatorValues, "|"))
			sb.WriteString(")")
		}
	}

	if prop.Constraints != nil && mcr.shouldShowConstraints(prop.Constraints) {
		sb.WriteString(" <<")
		constraints := mcr.formatConstraints(prop.Constraints)
		sb.WriteString(constraints)
		sb.WriteString(">>")
	}

	if prop.Default != "" {
		sb.WriteString(" = ")
		sb.WriteString(prop.Default)
	}

	return sb.String()
}

// shouldShowConstraints determines if constraints should be displayed
func (mcr *MermaidClassRenderer) shouldShowConstraints(c *PropertyConstraints) bool {
	return c.Format != "" || c.Pattern != "" || len(c.Enum) > 0 ||
		c.MinLength != nil || c.MaxLength != nil ||
		c.Minimum != nil || c.Maximum != nil ||
		c.MinItems != nil || c.MaxItems != nil || c.UniqueItems
}

// formatConstraints formats constraints into a compact string
func (mcr *MermaidClassRenderer) formatConstraints(c *PropertyConstraints) string {
	var parts []string

	if c.Format != "" {
		parts = append(parts, fmt.Sprintf("format:%s", c.Format))
	}

	if len(c.Enum) > 0 {
		if len(c.Enum) <= 3 {
			parts = append(parts, fmt.Sprintf("enum:%s", strings.Join(c.Enum, ",")))
		} else {
			parts = append(parts, fmt.Sprintf("enum:%d values", len(c.Enum)))
		}
	}

	if c.MinLength != nil {
		parts = append(parts, fmt.Sprintf("min:%d", *c.MinLength))
	}

	if c.MaxLength != nil {
		parts = append(parts, fmt.Sprintf("max:%d", *c.MaxLength))
	}

	if c.Pattern != "" && len(c.Pattern) < 30 {
		parts = append(parts, fmt.Sprintf("pattern:%s", c.Pattern))
	}

	if c.Minimum != nil {
		parts = append(parts, fmt.Sprintf("min:%v", *c.Minimum))
	}

	if c.Maximum != nil {
		parts = append(parts, fmt.Sprintf("max:%v", *c.Maximum))
	}

	if c.MinItems != nil {
		parts = append(parts, fmt.Sprintf("minItems:%d", *c.MinItems))
	}

	if c.MaxItems != nil {
		parts = append(parts, fmt.Sprintf("maxItems:%d", *c.MaxItems))
	}

	if c.UniqueItems {
		parts = append(parts, "uniqueItems")
	}

	return strings.Join(parts, ", ")
}

// RenderRelationship renders a single relationship in Mermaid format
func (mcr *MermaidClassRenderer) RenderRelationship(rel *DiagramRelationship) string {
	if rel == nil {
		return ""
	}
	return renderMermaidRelationship(rel.SourceID, rel.TargetID, rel.Type, rel.Label, rel.Cardinality)
}

// RenderDiagram renders a complete diagram in Mermaid format
func (mcr *MermaidClassRenderer) RenderDiagram(diagram *Diagram) string {
	if diagram == nil {
		return ""
	}

	var sb strings.Builder

	// diagram header
	sb.WriteString("classDiagram\n")

	// render classes
	for _, class := range diagram.Classes {
		classStr := mcr.RenderClass(class)
		if classStr != "" {
			sb.WriteString(classStr)
			sb.WriteString("\n")
		}
	}

	// render relationships
	for _, rel := range diagram.Relationships {
		relStr := mcr.RenderRelationship(rel)
		if relStr != "" {
			sb.WriteString(relStr)
			sb.WriteString("\n")
		}
	}

	return sb.String()
}
