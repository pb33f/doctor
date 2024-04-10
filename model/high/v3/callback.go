// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Callback struct {
	Value      *v3.Callback
	Expression *orderedmap.Map[string, *PathItem]
	base.Foundation
}

func (c *Callback) Walk(ctx context.Context, callback *v3.Callback) {

	c.Value = callback

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	if callback.Expression != nil {
		expression := orderedmap.New[string, *PathItem]()
		for expressionPairs := callback.Expression.First(); expressionPairs != nil; expressionPairs = expressionPairs.Next() {
			p := &PathItem{}
			p.Parent = c
			p.Key = expressionPairs.Key()
			v := expressionPairs.Value()
			wg.Go(func() { p.Walk(ctx, v) })
			expression.Set(expressionPairs.Key(), p)
		}
		c.Expression = expression
	}
}

func (c *Callback) GetValue() any {
	return c.Value
}
