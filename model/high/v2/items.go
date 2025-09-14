// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"go.yaml.in/yaml/v4"
)

type Items struct {
	Type             string
	Format           string
	CollectionFormat string
	Items            *Items
	Default          *yaml.Node
	Maximum          int
	ExclusiveMaximum bool
	Minimum          int
	ExclusiveMinimum bool
	MaxLength        int
	MinLength        int
	Pattern          string
	MaxItems         int
	MinItems         int
	UniqueItems      bool
	Enum             []*yaml.Node
	MultipleOf       int
	low              *low.Items
}
