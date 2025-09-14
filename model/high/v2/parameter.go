// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

type Parameter struct {
	Name             string
	In               string
	Type             string
	Format           string
	Description      string
	Required         *bool
	AllowEmptyValue  *bool
	Schema           *base.SchemaProxy
	Items            *Items
	CollectionFormat string
	Default          *yaml.Node
	Maximum          *int
	ExclusiveMaximum *bool
	Minimum          *int
	ExclusiveMinimum *bool
	MaxLength        *int
	MinLength        *int
	Pattern          string
	MaxItems         *int
	MinItems         *int
	UniqueItems      *bool
	Enum             []*yaml.Node
	MultipleOf       *int
	Extensions       *orderedmap.Map[string, *yaml.Node]
	low              *low.Parameter
}
