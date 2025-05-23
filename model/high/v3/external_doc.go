// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type ExternalDoc struct {
	Value *base.ExternalDoc
	Foundation
}

func (ed *ExternalDoc) GetValue() any {
	return ed.Value
}

func (ed *ExternalDoc) Walk(ctx context.Context, externalDoc *base.ExternalDoc) {
	drCtx := GetDrContext(ctx)
	ed.ValueNode = externalDoc.GoLow().RootNode
	ed.KeyNode = externalDoc.GoLow().KeyNode
	ed.BuildNodesAndEdges(ctx, "External Docs", ed.PathSegment, externalDoc, ed)
	drCtx.ObjectChan <- ed
}

func (ed *ExternalDoc) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, ed)
}
