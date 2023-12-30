// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	drBase "github.com/pb33f/doctor/model/high/base"
	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Parameter struct {
	Value       *v3.Parameter
	SchemaProxy *drBase.SchemaProxy
	Examples    *orderedmap.Map[string, *drBase.Example]
	Content     *orderedmap.Map[string, *MediaType]
	drBase.Foundation
}

func (p *Parameter) Walk(ctx context.Context, param *v3.Parameter) {

	drCtx := drBase.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	p.Value = param

	if param.Schema != nil {
		s := &drBase.SchemaProxy{}
		s.Parent = p
		s.PathSegment = "schema"
		wg.Go(func() { s.Walk(ctx, param.Schema) })
		p.SchemaProxy = s
	}

	if param.Examples != nil {
		examples := orderedmap.New[string, *drBase.Example]()
		for paramPairs := param.Examples.First(); paramPairs != nil; paramPairs = paramPairs.Next() {
			e := &drBase.Example{}
			e.Parent = p
			e.PathSegment = "examples"
			e.Key = paramPairs.Key()
			v := paramPairs.Value()
			wg.Go(func() { e.Walk(ctx, v) })
			examples.Set(paramPairs.Key(), e)
		}
		p.Examples = examples
	}

	if param.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := param.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			mt := &MediaType{}
			mt.Parent = p
			mt.PathSegment = "content"
			mt.Key = contentPairs.Key()
			v := contentPairs.Value()
			wg.Go(func() { mt.Walk(ctx, v) })
			content.Set(contentPairs.Key(), mt)
		}
	}

	drCtx.ParameterChan <- p
}
