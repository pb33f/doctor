// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v2

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
	"gopkg.in/yaml.v3"
)

type Swagger struct {
	Swagger             string
	Info                *base.Info
	Host                string
	BasePath            string
	Schemes             []string
	Consumes            []string
	Produces            []string
	Paths               *Paths
	Definitions         *Definitions
	Parameters          *ParameterDefinitions
	Responses           *ResponsesDefinitions
	SecurityDefinitions *SecurityDefinitions
	Security            []*base.SecurityRequirement
	Tags                []*base.Tag
	ExternalDocs        *base.ExternalDoc
	Extensions          *orderedmap.Map[string, *yaml.Node]
	low                 *low.Swagger
}
