// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"strings"
)

// MermaidDiagram represents a complete mermaid class diagram
type MermaidDiagram struct {
	Classes       map[string]*MermaidClass
	Relationships []*MermaidRelationship
	Config        *MermaidConfig
	classOrder    []string // maintain insertion order
}

// NewMermaidDiagram creates a new mermaid diagram
func NewMermaidDiagram(config *MermaidConfig) *MermaidDiagram {
	if config == nil {
		config = DefaultMermaidConfig()
	}
	return &MermaidDiagram{
		Classes:       make(map[string]*MermaidClass),
		Relationships: []*MermaidRelationship{},
		Config:        config,
		classOrder:    []string{},
	}
}

// AddClass adds a class to the diagram
func (md *MermaidDiagram) AddClass(class *MermaidClass) {
	if _, exists := md.Classes[class.ID]; !exists {
		md.Classes[class.ID] = class
		md.classOrder = append(md.classOrder, class.ID)
	}
}

// AddRelationship adds a relationship between classes
func (md *MermaidDiagram) AddRelationship(rel *MermaidRelationship) {
	// check for exact duplicates (including label and cardinality)
	for _, existing := range md.Relationships {
		if existing.Source == rel.Source &&
			existing.Target == rel.Target &&
			existing.Type == rel.Type &&
			existing.Label == rel.Label &&
			existing.Cardinality == rel.Cardinality {
			return
		}
	}
	md.Relationships = append(md.Relationships, rel)
}

// Render generates the mermaid diagram syntax
func (md *MermaidDiagram) Render() string {
	var sb strings.Builder
	sb.WriteString("classDiagram\n")

	for _, id := range md.classOrder {
		class := md.Classes[id]
		sb.WriteString(class.Render(md.Config))
		sb.WriteString("\n")
	}

	for _, rel := range md.Relationships {
		sb.WriteString(rel.Render())
		sb.WriteString("\n")
	}

	return sb.String()
}

// MermaidClass represents a class in the diagram
type MermaidClass struct {
	ID          string
	Name        string
	Type        string // class, interface, abstract
	Annotations []string
	Properties  []*MermaidMember
	Methods     []*MermaidMember
	Namespace   string
}

// NewMermaidClass creates a new mermaid class
func NewMermaidClass(id, name string) *MermaidClass {
	return &MermaidClass{
		ID:         sanitizeID(id),
		Name:       name,
		Type:       "class",
		Properties: []*MermaidMember{},
		Methods:    []*MermaidMember{},
	}
}

// AddProperty adds a property to the class
func (mc *MermaidClass) AddProperty(member *MermaidMember) {
	mc.Properties = append(mc.Properties, member)
}

// AddMethod adds a method to the class
func (mc *MermaidClass) AddMethod(member *MermaidMember) {
	mc.Methods = append(mc.Methods, member)
}

// Render generates the mermaid syntax for this class
func (mc *MermaidClass) Render(config *MermaidConfig) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("  class %s {\n", mc.ID))

	for _, annotation := range mc.Annotations {
		sb.WriteString(fmt.Sprintf("    <<%s>>\n", annotation))
	}

	propCount := len(mc.Properties)
	maxProps := config.MaxProperties
	if maxProps > 0 && propCount > maxProps {
		propCount = maxProps
	}

	for i := 0; i < propCount; i++ {
		prop := mc.Properties[i]
		if !config.IncludePrivate && prop.Visibility == "-" {
			continue
		}
		sb.WriteString(fmt.Sprintf("    %s%s %s\n", prop.Visibility, prop.Type, prop.Name))
	}

	if maxProps > 0 && len(mc.Properties) > maxProps {
		sb.WriteString(fmt.Sprintf("    ... +%d more properties\n", len(mc.Properties)-maxProps))
	}

	if config.IncludeOperations {
		for _, method := range mc.Methods {
			if !config.IncludePrivate && method.Visibility == "-" {
				continue
			}
			sb.WriteString(fmt.Sprintf("    %s%s(%s) %s\n", method.Visibility, method.Name, method.Parameters, method.Type))
		}
	}

	sb.WriteString("  }")
	return sb.String()
}

// MermaidMember represents a class member (property or method)
type MermaidMember struct {
	Name       string
	Type       string
	Visibility string // +, -, #, ~
	Static     bool
	Abstract   bool
	Parameters string // for methods
}

// MermaidRelationship represents a relationship between classes
type MermaidRelationship struct {
	Source      string
	Target      string
	Type        RelationType
	Label       string
	Cardinality string
}

// RelationType defines the type of relationship
type RelationType string

const (
	RelationInheritance  RelationType = "<|--"  // inheritance
	RelationComposition  RelationType = "*--"   // composition
	RelationAggregation  RelationType = "o--"   // aggregation
	RelationAssociation  RelationType = "-->"   // association
	RelationDependency   RelationType = "..>"   // dependency
	RelationRealization  RelationType = "..|>"  // realization
	RelationNegation     RelationType = "-.x"   // negation (A is NOT B)
)

// Render generates the mermaid syntax for this relationship
func (mr *MermaidRelationship) Render() string {
	return renderMermaidRelationship(mr.Source, mr.Target, mr.Type, mr.Label, mr.Cardinality)
}

// renderMermaidRelationship is the shared implementation for rendering Mermaid relationships
func renderMermaidRelationship(source, target string, relType RelationType, label, cardinality string) string {
	source = sanitizeID(source)
	target = sanitizeID(target)

	if label != "" && cardinality != "" {
		return fmt.Sprintf("  %s %s %s : %s %s", source, relType, target, label, cardinality)
	} else if label != "" {
		return fmt.Sprintf("  %s %s %s : %s", source, relType, target, label)
	} else if cardinality != "" {
		return fmt.Sprintf("  %s \"%s\" %s %s", source, cardinality, relType, target)
	}
	return fmt.Sprintf("  %s %s %s", source, relType, target)
}

// sanitizeID ensures the ID is valid for mermaid using single-pass byte manipulation
func sanitizeID(id string) string {
	if id == "" {
		return ""
	}

	result := make([]byte, 0, len(id)+2)

	// ensure starts with letter
	needsPrefix := id[0] < 'A' || (id[0] > 'Z' && id[0] < 'a') || id[0] > 'z'
	if needsPrefix {
		result = append(result, 'C', '_')
	}

	// single pass replacement
	for i := 0; i < len(id); i++ {
		c := id[i]
		switch c {
		case '/', '{', '}', ' ', '-', '.', '$', '#', '[', ']', '\'', '"', '+':
			result = append(result, '_')
		default:
			result = append(result, c)
		}
	}

	return string(result)
}