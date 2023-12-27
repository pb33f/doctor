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
	if d.Value.IsA() {
		if v, ok := any(d.A).(*SchemaProxy); ok {
			p := any(d.Value.A).(*base.SchemaProxy)
			v.Walk(ctx, p)
		}
	}
	// there are no models that use the B value for walkable structures.
}
