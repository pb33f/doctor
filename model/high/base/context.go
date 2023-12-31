// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

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
	Param any
	ParamNode *yaml.Node
}


type DrContext struct {
	SchemaChan        chan *WalkedSchema
	SkippedSchemaChan chan *WalkedSchema
	ParameterChan     chan *WalkedParam
	ErrorChan         chan *BuildError
	Index             *index.SpecIndex
	Rolodex           *index.Rolodex
	WaitGroup         *conc.WaitGroup
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}
