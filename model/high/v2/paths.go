// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	v2low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

type Paths struct {
	PathItems  *orderedmap.Map[string, *PathItem]
	Extensions *orderedmap.Map[string, *yaml.Node]
	low        *v2low.Paths
}
