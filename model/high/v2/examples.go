// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v2

import (
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

type Example struct {
	Values *orderedmap.Map[string, *yaml.Node]
	low    *low.Examples
}
