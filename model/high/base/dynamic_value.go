// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Walkable interface {
	Walk(context.Context, *base.SchemaProxy)
}

type DynamicValue[A, R, S, E any] struct {
	Value *base.DynamicValue[A, R]
	A     S
	B     E
	Foundation
}

func (d *DynamicValue[A, R, S, E]) Walk(ctx context.Context) {
	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	if d.Value.IsA() {
		if v, ok := any(d.A).(*SchemaProxy); ok {
			p := any(d.Value.A).(*base.SchemaProxy)
			wg.Go(func() { v.Walk(ctx, p, 0) })
		}
	}
	drCtx.ObjectChan <- d
	// there are no models that use the B value for walkable structures.
}

func (d *DynamicValue[A, R, S, E]) GetValue() any {
	return d.Value
}
