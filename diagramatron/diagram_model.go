// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

// Diagram represents a format-agnostic diagram model
type Diagram struct {
	Classes       []*DiagramClass
	Relationships []*DiagramRelationship
	Metadata      *DiagramMetadata
}

// DiagramMetadata holds metadata about the diagram
type DiagramMetadata struct {
	Title       string
	Description string
	Version     string
	Generated   string
	Source      string
}

// DiagramClass represents a class/node in the diagram
type DiagramClass struct {
	ID          string
	Name        string
	Type        ClassType
	Annotations []string
	Properties  []*DiagramProperty
	Methods     []*DiagramMethod
	Namespace   string
	Metadata    map[string]interface{}
}

// ClassType defines the type of class
type ClassType string

const (
	ClassTypeClass     ClassType = "class"
	ClassTypeInterface ClassType = "interface"
	ClassTypeAbstract  ClassType = "abstract"
	ClassTypeEnum      ClassType = "enum"
)

// DiagramProperty represents a property/field in a class
type DiagramProperty struct {
	Name                string
	Type                string
	Visibility          Visibility
	Required            bool
	ReadOnly            bool
	WriteOnly           bool
	Deprecated          bool
	Nullable            bool
	Default             string
	Constraints         *PropertyConstraints
	IsDiscriminator     bool     // true if this property is a discriminator
	DiscriminatorValues []string // possible values if this is a discriminator
}

// DiagramMethod represents a method/operation in a class
type DiagramMethod struct {
	Name       string
	Parameters string
	ReturnType string
	Visibility Visibility
	Static     bool
	Abstract   bool
}

// Visibility defines member visibility
type Visibility string

const (
	VisibilityPublic    Visibility = "+"
	VisibilityProtected Visibility = "#"
	VisibilityPrivate   Visibility = "-"
	VisibilityPackage   Visibility = "~"
)

// PropertyConstraints holds validation constraints for a property
type PropertyConstraints struct {
	Format      string
	Pattern     string
	MinLength   *int
	MaxLength   *int
	Minimum     *float64
	Maximum     *float64
	MinItems    *int
	MaxItems    *int
	UniqueItems bool
	Enum        []string
}

// DiagramRelationship represents a relationship between classes
type DiagramRelationship struct {
	SourceID    string
	TargetID    string
	Type        RelationType
	Label       string
	Cardinality string
	Metadata    map[string]interface{}
}

// NewDiagram creates a new empty diagram
func NewDiagram() *Diagram {
	return &Diagram{
		Classes:       make([]*DiagramClass, 0, 64),
		Relationships: make([]*DiagramRelationship, 0, 128),
		Metadata:      &DiagramMetadata{},
	}
}

func (d *Diagram) AddClass(class *DiagramClass) {
	if class == nil {
		return
	}
	d.Classes = append(d.Classes, class)
}

func (d *Diagram) AddRelationship(rel *DiagramRelationship) {
	if rel == nil {
		return
	}

	// check for exact duplicates (including label and cardinality)
	for _, existing := range d.Relationships {
		if existing.SourceID == rel.SourceID &&
			existing.TargetID == rel.TargetID &&
			existing.Type == rel.Type &&
			existing.Label == rel.Label &&
			existing.Cardinality == rel.Cardinality {
			return
		}
	}

	d.Relationships = append(d.Relationships, rel)
}

// GetClass retrieves a class by ID
func (d *Diagram) GetClass(id string) *DiagramClass {
	for _, class := range d.Classes {
		if class.ID == id {
			return class
		}
	}
	return nil
}

// NewDiagramClass creates a new diagram class
func NewDiagramClass(id, name string) *DiagramClass {
	return &DiagramClass{
		ID:         id,
		Name:       name,
		Type:       ClassTypeClass,
		Properties: make([]*DiagramProperty, 0, 16),
		Methods:    make([]*DiagramMethod, 0, 8),
		Metadata:   make(map[string]interface{}),
	}
}

// AddProperty adds a property to the class
func (dc *DiagramClass) AddProperty(prop *DiagramProperty) {
	if prop == nil {
		return
	}
	dc.Properties = append(dc.Properties, prop)
}

// AddMethod adds a method to the class
func (dc *DiagramClass) AddMethod(method *DiagramMethod) {
	if method == nil {
		return
	}
	dc.Methods = append(dc.Methods, method)
}
