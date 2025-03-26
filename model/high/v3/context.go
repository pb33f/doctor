// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"gopkg.in/yaml.v3"
	"log/slog"
	"sync"
)

const HEIGHT = 25
const WIDTH = 200

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
	ObjectChan        chan any
	SkippedSchemaChan chan *WalkedSchema
	ParameterChan     chan *WalkedParam
	HeaderChan        chan *WalkedHeader
	MediaTypeChan     chan *WalkedMediaType
	ErrorChan         chan *BuildError
	NodeChan          chan *Node
	EdgeChan          chan *Edge
	Index             *index.SpecIndex
	Rolodex           *index.Rolodex
	V3Document        *v3.Document
	WaitGroup         *conc.WaitGroup
	BuildGraph        bool
	RenderChanges     bool
	UseSchemaCache    bool
	SchemaCache       *sync.Map
	StorageRoot       string
	WorkingDirectory  string
	Logger            *slog.Logger
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}
