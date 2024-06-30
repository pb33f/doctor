// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Example struct {
	Value *base.Example
	Foundation
}

func (e *Example) Walk(ctx context.Context, example *base.Example) {
	e.BuildNodesAndEdges(ctx, e.Key, "example", example, e)
	e.Value = example
}

func (e *Example) GetValue() *base.Example {
	return e.Value
}
