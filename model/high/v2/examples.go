// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v2

import (
	"github.com/pb33f/go-yaml"
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Example struct {
	Values *orderedmap.Map[string, *yaml.Node]
	low    *low.Examples
}
