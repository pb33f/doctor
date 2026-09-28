// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v2

import (
	"github.com/pb33f/go-yaml"
	v2low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Paths struct {
	PathItems  *orderedmap.Map[string, *PathItem]
	Extensions *orderedmap.Map[string, *yaml.Node]
	low        *v2low.Paths
}
