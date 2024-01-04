// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"golang.org/x/net/context"
	"gopkg.in/yaml.v3"
)

type BuildError struct {
	Error         error
	SchemaProxy   *base.SchemaProxy
	DrSchemaProxy *SchemaProxy
}

type WalkedSchema struct {
	Schema     *Schema
	SchemaNode *yaml.Node
}

type WalkedParam struct {
	Param     any
	ParamNode *yaml.Node
}

type WalkedHeader struct {
	Header     any
	HeaderNode *yaml.Node
}

type WalkedMediaType struct {
	MediaType     any
	MediaTypeNode *yaml.Node
}

type DrContext struct {
	SchemaChan        chan *WalkedSchema
	SkippedSchemaChan chan *WalkedSchema
	ParameterChan     chan *WalkedParam
	HeaderChan        chan *WalkedHeader
	MediaTypeChan     chan *WalkedMediaType
	ErrorChan         chan *BuildError
	Index             *index.SpecIndex
	Rolodex           *index.Rolodex
	WaitGroup         *conc.WaitGroup
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}
