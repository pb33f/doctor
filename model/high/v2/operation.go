// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

type Operation struct {
	Tags         []string
	Summary      string
	Description  string
	ExternalDocs *base.ExternalDoc
	OperationId  string
	Consumes     []string
	Produces     []string
	Parameters   []*Parameter
	Responses    *Responses
	Schemes      []string
	Deprecated   bool
	Security     []*base.SecurityRequirement
	Extensions   *orderedmap.Map[string, *yaml.Node]
	low          *low.Operation
}
