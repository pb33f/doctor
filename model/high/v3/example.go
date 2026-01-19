// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Example struct {
	Value *base.Example
	Foundation
}

func (e *Example) Walk(ctx context.Context, example *base.Example) {
	drCtx := GetDrContext(ctx)
	e.BuildNodesAndEdges(ctx, e.Key, "example", example, e)
	e.Value = example
	if example.GoLow().IsReference() {
		BuildReference(drCtx, example.GoLow())
		if drCtx.BuildGraph && e.GetNode() != nil {
			refString := example.GoLow().GetReference()
			drCtx.BuildRefEdgeByLine(ctx, &e.Foundation, refString)
		}
	}
	drCtx.ObjectChan <- e
}

func (e *Example) GetValue() any {
	return e.Value
}

func (e *Example) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, e)
}
