package v3

import (
	"testing"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/testify/assert"
	"go.yaml.in/yaml/v4"
)

func TestParseSchemaSize_ExampleStatusRow(t *testing.T) {
	noExamplesProps := orderedmap.New[string, *base.SchemaProxy]()
	noExamplesProps.Set("self", base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}}))

	coveredProps := orderedmap.New[string, *base.SchemaProxy]()
	coveredProps.Set("id", base.CreateSchemaProxy(&base.Schema{
		Type:    []string{"string"},
		Example: &yaml.Node{Kind: yaml.ScalarNode, Value: "booking-1"},
	}))
	coveredProps.Set("has_bicycle", base.CreateSchemaProxy(&base.Schema{Type: []string{"boolean"}}))

	directExampleProps := orderedmap.New[string, *base.SchemaProxy]()
	directExampleProps.Set("id", base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}}))

	tests := []struct {
		name   string
		schema *base.Schema
		height int
	}{
		{
			name: "missing coverage reserves no examples row",
			schema: &base.Schema{
				Type:       []string{"object"},
				Properties: noExamplesProps,
			},
			height: HEIGHT * 3,
		},
		{
			name: "property coverage does not reserve an aggregate examples row",
			schema: &base.Schema{
				Type:       []string{"object"},
				Properties: coveredProps,
			},
			height: HEIGHT * 2,
		},
		{
			name: "direct schema examples reserve examples row",
			schema: &base.Schema{
				Type:       []string{"object"},
				Example:    &yaml.Node{Kind: yaml.MappingNode},
				Properties: directExampleProps,
			},
			height: HEIGHT * 3,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			height, _ := ParseSchemaSize(tt.schema)
			assert.Equal(t, tt.height, height)
		})
	}
}
