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

    if callback.Expression != nil {
        expression := orderedmap.New[string, *PathItem]()
        for expressionPairs := callback.Expression.First(); expressionPairs != nil; expressionPairs = expressionPairs.Next() {
            p := &PathItem{}
            p.Parent = c
            p.Key = expressionPairs.Key()
            p.Walk(ctx, expressionPairs.Value())
            expression.Set(expressionPairs.Key(), p)
        }
        c.Expression = expression
    }
}
