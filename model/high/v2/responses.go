// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"gopkg.in/yaml.v3"
)

type Responses struct {
	Codes      *orderedmap.Map[string, *Response]
	Default    *Response
	Extensions *orderedmap.Map[string, *yaml.Node]
	low        *low.Responses
}
