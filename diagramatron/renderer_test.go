// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewMermaidClassRenderer(t *testing.T) {
	t.Run("creates with default config", func(t *testing.T) {
		renderer := NewMermaidClassRenderer(nil)
		assert.NotNil(t, renderer)
		assert.NotNil(t, renderer.config)
		assert.Equal(t, 20, renderer.config.MaxProperties)
	})

	t.Run("creates with custom config", func(t *testing.T) {
		config := &MermaidConfig{MaxProperties: 10}
		renderer := NewMermaidClassRenderer(config)
		assert.Equal(t, 10, renderer.config.MaxProperties)
	})
}

func TestMermaidClassRenderer_RenderClass(t *testing.T) {
	renderer := NewMermaidClassRenderer(nil)

	t.Run("renders simple class", func(t *testing.T) {
		class := NewDiagramClass("User", "User")
		class.AddProperty(&DiagramProperty{
			Name:       "email",
			Type:       "string",
			Visibility: VisibilityPublic,
		})

		result := renderer.RenderClass(class)
		assert.Contains(t, result, "class User {")
		assert.Contains(t, result, "+string email")
		assert.Contains(t, result, "}")
	})

	t.Run("renders class with annotations", func(t *testing.T) {
		class := NewDiagramClass("Pet", "Pet")
		class.Annotations = []string{"abstract"}

		result := renderer.RenderClass(class)
		assert.Contains(t, result, "<<abstract>>")
	})

	t.Run("renders class with methods", func(t *testing.T) {
		class := NewDiagramClass("Service", "Service")
		class.AddMethod(&DiagramMethod{
			Name:       "process",
			Parameters: "data",
			ReturnType: "Result",
			Visibility: VisibilityPublic,
		})

		result := renderer.RenderClass(class)
		assert.Contains(t, result, "+process(data) Result")
	})

	t.Run("limits properties by config", func(t *testing.T) {
		config := &MermaidConfig{MaxProperties: 2}
		renderer := NewMermaidClassRenderer(config)

		class := NewDiagramClass("Large", "Large")
		for i := 0; i < 5; i++ {
			class.AddProperty(&DiagramProperty{
				Name:       fmt.Sprintf("prop%d", i),
				Type:       "string",
				Visibility: VisibilityPublic,
			})
		}

		result := renderer.RenderClass(class)
		assert.Contains(t, result, "prop0")
		assert.Contains(t, result, "prop1")
		assert.NotContains(t, result, "prop2")
		assert.Contains(t, result, "... +3 more properties")
	})

	t.Run("filters private members when configured", func(t *testing.T) {
		config := &MermaidConfig{IncludePrivate: false}
		renderer := NewMermaidClassRenderer(config)

		class := NewDiagramClass("Filtered", "Filtered")
		class.AddProperty(&DiagramProperty{
			Name:       "public",
			Type:       "string",
			Visibility: VisibilityPublic,
		})
		class.AddProperty(&DiagramProperty{
			Name:       "private",
			Type:       "string",
			Visibility: VisibilityPrivate,
		})

		result := renderer.RenderClass(class)
		assert.Contains(t, result, "+string public")
		assert.NotContains(t, result, "-string private")
	})

	t.Run("returns empty for nil class", func(t *testing.T) {
		result := renderer.RenderClass(nil)
		assert.Empty(t, result)
	})
}

func TestMermaidClassRenderer_RenderProperty(t *testing.T) {
	renderer := NewMermaidClassRenderer(nil)

	t.Run("renders property with constraints", func(t *testing.T) {
		minLen := 3
		maxLen := 20
		prop := &DiagramProperty{
			Name:       "username",
			Type:       "string",
			Visibility: VisibilityProtected,
			Constraints: &PropertyConstraints{
				MinLength: &minLen,
				MaxLength: &maxLen,
			},
		}

		result := renderer.renderProperty(prop)
		assert.Contains(t, result, "#string username")
		assert.Contains(t, result, "min:3")
		assert.Contains(t, result, "max:20")
	})

	t.Run("renders property with enum", func(t *testing.T) {
		prop := &DiagramProperty{
			Name:       "status",
			Type:       "string",
			Visibility: VisibilityPublic,
			Constraints: &PropertyConstraints{
				Enum: []string{"ACTIVE", "INACTIVE"},
			},
		}

		result := renderer.renderProperty(prop)
		assert.Contains(t, result, "enum:ACTIVE,INACTIVE")
	})

	t.Run("truncates large enum lists", func(t *testing.T) {
		prop := &DiagramProperty{
			Name:       "code",
			Type:       "string",
			Visibility: VisibilityPublic,
			Constraints: &PropertyConstraints{
				Enum: []string{"A", "B", "C", "D", "E"},
			},
		}

		result := renderer.renderProperty(prop)
		assert.Contains(t, result, "enum:5 values")
	})

	t.Run("renders property with default value", func(t *testing.T) {
		prop := &DiagramProperty{
			Name:       "role",
			Type:       "string",
			Visibility: VisibilityPublic,
			Default:    "user",
		}

		result := renderer.renderProperty(prop)
		assert.Contains(t, result, "= user")
	})
}

func TestMermaidClassRenderer_RenderRelationship(t *testing.T) {
	renderer := NewMermaidClassRenderer(nil)

	t.Run("renders relationship with label and cardinality", func(t *testing.T) {
		rel := &DiagramRelationship{
			SourceID:    "User",
			TargetID:    "Order",
			Type:        RelationComposition,
			Label:       "orders",
			Cardinality: "0..*",
		}

		result := renderer.RenderRelationship(rel)
		assert.Equal(t, "  User *-- Order : orders 0..*", result)
	})

	t.Run("renders relationship with only label", func(t *testing.T) {
		rel := &DiagramRelationship{
			SourceID: "Parent",
			TargetID: "Child",
			Type:     RelationInheritance,
			Label:    "extends",
		}

		result := renderer.RenderRelationship(rel)
		assert.Equal(t, "  Parent <|-- Child : extends", result)
	})

	t.Run("renders simple relationship", func(t *testing.T) {
		rel := &DiagramRelationship{
			SourceID: "A",
			TargetID: "B",
			Type:     RelationAssociation,
		}

		result := renderer.RenderRelationship(rel)
		assert.Equal(t, "  A --> B", result)
	})

	t.Run("returns empty for nil relationship", func(t *testing.T) {
		result := renderer.RenderRelationship(nil)
		assert.Empty(t, result)
	})

	t.Run("sanitizes IDs with special characters", func(t *testing.T) {
		rel := &DiagramRelationship{
			SourceID: "paths/users",
			TargetID: "schemas.User",
			Type:     RelationAssociation,
		}

		result := renderer.RenderRelationship(rel)
		assert.Contains(t, result, "paths_users")
		assert.Contains(t, result, "schemas_User")
	})
}

func TestMermaidClassRenderer_RenderDiagram(t *testing.T) {
	renderer := NewMermaidClassRenderer(nil)

	t.Run("renders complete diagram", func(t *testing.T) {
		diagram := NewDiagram()

		user := NewDiagramClass("User", "User")
		user.AddProperty(&DiagramProperty{
			Name:       "name",
			Type:       "string",
			Visibility: VisibilityPublic,
		})
		diagram.AddClass(user)

		order := NewDiagramClass("Order", "Order")
		diagram.AddClass(order)

		diagram.AddRelationship(&DiagramRelationship{
			SourceID: "User",
			TargetID: "Order",
			Type:     RelationComposition,
		})

		result := renderer.RenderDiagram(diagram)

		assert.Contains(t, result, "classDiagram")
		assert.Contains(t, result, "class User {")
		assert.Contains(t, result, "+string name")
		assert.Contains(t, result, "class Order {")
		assert.Contains(t, result, "User *-- Order")
	})

	t.Run("returns empty for nil diagram", func(t *testing.T) {
		result := renderer.RenderDiagram(nil)
		assert.Empty(t, result)
	})

	t.Run("handles empty diagram", func(t *testing.T) {
		diagram := NewDiagram()
		result := renderer.RenderDiagram(diagram)
		assert.Equal(t, "classDiagram\n", result)
	})
}

func TestFormatConstraints(t *testing.T) {
	renderer := NewMermaidClassRenderer(nil)

	t.Run("formats multiple constraints", func(t *testing.T) {
		minLen := 1
		maxLen := 100
		constraints := &PropertyConstraints{
			Format:    "email",
			MinLength: &minLen,
			MaxLength: &maxLen,
		}

		result := renderer.formatConstraints(constraints)
		assert.Contains(t, result, "format:email")
		assert.Contains(t, result, "min:1")
		assert.Contains(t, result, "max:100")
	})

	t.Run("truncates long patterns", func(t *testing.T) {
		constraints := &PropertyConstraints{
			Pattern: "^[a-zA-Z0-9]{1,50}$_very_long_pattern_that_should_be_truncated",
		}

		result := renderer.formatConstraints(constraints)
		// long patterns are excluded
		assert.Empty(t, result)
	})
}
