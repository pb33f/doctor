// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"gopkg.in/yaml.v3"
)

type Response struct {
	Description string
	Schema      *base.SchemaProxy
	Headers     *orderedmap.Map[string, *Header]
	Examples    *Example
	Extensions  *orderedmap.Map[string, *yaml.Node]
	low         *low.Response
}
