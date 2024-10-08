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

	if p.Index != nil {
		n := p.Value.Name
		if n == "" {
			n = p.Value.In
		}
		p.BuildNodesAndEdgesWithArray(ctx, n, "parameter", param, p, false, 0, p.Index)
	} else {
		p.BuildNodesAndEdges(ctx, p.Key, "parameter", param, p)
	}

	if param.Schema != nil {
		s := &drBase.SchemaProxy{}
		s.ValueNode = param.Schema.GoLow().GetValueNode()
		s.KeyNode = param.Schema.GetSchemaKeyNode()
		s.Parent = p
		s.PathSegment = "schema"
		s.NodeParent = p
		wg.Go(func() { s.Walk(ctx, param.Schema, 0) })
		p.SchemaProxy = s
	}

	if param.Examples != nil && param.Examples.Len() > 0 {
		examples := orderedmap.New[string, *drBase.Example]()
		for paramPairs := param.Examples.First(); paramPairs != nil; paramPairs = paramPairs.Next() {
			e := &drBase.Example{}
			e.Key = paramPairs.Key()
			for lowExpPairs := param.GoLow().Examples.Value.First(); lowExpPairs != nil; lowExpPairs = lowExpPairs.Next() {
				if lowExpPairs.Key().Value == e.Key {
					e.KeyNode = lowExpPairs.Key().KeyNode
					e.ValueNode = lowExpPairs.Value().ValueNode
					break
				}
			}
			e.Parent = p
			e.PathSegment = "examples"
			v := paramPairs.Value()
			e.NodeParent = p
			wg.Go(func() { e.Walk(ctx, v) })
			examples.Set(paramPairs.Key(), e)
		}
		p.Examples = examples
	}

	if param.Content != nil && param.Content.Len() > 0 {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := param.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			mt := &MediaType{}
			mt.Parent = p
			mt.PathSegment = "content"
			mt.NodeParent = p
			mt.Key = contentPairs.Key()
			for lowExpPairs := param.GoLow().Content.Value.First(); lowExpPairs != nil; lowExpPairs = lowExpPairs.Next() {
				if lowExpPairs.Key().Value == mt.Key {
					mt.KeyNode = lowExpPairs.Key().KeyNode
					mt.ValueNode = lowExpPairs.Value().ValueNode
					break
				}
			}
			v := contentPairs.Value()
			wg.Go(func() { mt.Walk(ctx, v) })
			content.Set(contentPairs.Key(), mt)
		}
		p.Content = content
	}

	drCtx.ParameterChan <- &drBase.WalkedParam{
		Param:     p,
		ParamNode: param.GoLow().RootNode,
	}

	if param.GoLow().IsReference() {
		drBase.BuildReference(drCtx, param.GoLow())
	}

	drCtx.ObjectChan <- p
}

func (p *Parameter) GetValue() any {
	return p.Value
}

func (p *Parameter) GetSize() (height, width int) {
	width = drBase.WIDTH
	height = drBase.HEIGHT

	if p.Key != "" {
		if len(p.Key) > drBase.HEIGHT-15 {
			width += (len(p.Key) - (drBase.HEIGHT - 15)) * 20
		}
	}

	if p.Value.Name != "" {
		height += drBase.HEIGHT
		if len(p.Value.Name) > drBase.HEIGHT-15 {
			width += (len(p.Value.Name) - (drBase.HEIGHT - 15)) * 30
		}
	}

	if p.Value.In != "" {
		height += drBase.HEIGHT
	}

	if p.Value.Deprecated {
		height += drBase.HEIGHT
	}

	if p.Value.Required != nil && *p.Value.Required {
		height += drBase.HEIGHT
	}

	if p.Value.Content != nil && p.Value.Content.Len() > 0 {
		height += drBase.HEIGHT
	}

	if p.Value.Extensions != nil && p.Value.Extensions.Len() > 0 {
		height += drBase.HEIGHT
	}

	if p.Value.Schema != nil && len(p.Value.Schema.Schema().Type) > 0 {
		width += 40 * len(p.Value.Schema.Schema().Type)
	}

	return height, width
}
