// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"

	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Parameter struct {
	Value       *v3.Parameter
	SchemaProxy *SchemaProxy
	Examples    *orderedmap.Map[string, *Example]
	Content     *orderedmap.Map[string, *MediaType]
	Foundation
}

func (p *Parameter) Walk(ctx context.Context, param *v3.Parameter) {

	drCtx := GetDrContext(ctx)

	// Check for canonical path - ensures deterministic paths for $ref'd parameters
	if drCtx.DeterministicPaths && drCtx.CanonicalPathCache != nil && param != nil {
		if low := param.GoLow(); low != nil && low.RootNode != nil {
			if canonicalPath, found := drCtx.CanonicalPathCache.Load(index.HashNode(low.RootNode)); found {
				p.JSONPathOnce.Do(func() {
					p.JSONPath = canonicalPath.(string)
				})
			}
		}
	}

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
		s := &SchemaProxy{}
		s.ValueNode = param.Schema.GoLow().GetValueNode()
		s.KeyNode = param.Schema.GetSchemaKeyNode()
		s.Parent = p
		s.SetPathSegment("schema")
		g := param.Schema.Schema()
		if g != nil {
			//if !slices.Contains(g.Type, "string") &&
			//	!slices.Contains(g.Type, "boolean") &&
			//	!slices.Contains(g.Type, "integer") &&
			//	!slices.Contains(g.Type, "number") {
			s.NodeParent = p
			//}
		}
		drCtx.RunOrGo(func() { s.Walk(ctx, param.Schema, 0) })
		p.SchemaProxy = s
	}

	if param.Examples != nil && param.Examples.Len() > 0 {
		examples := orderedmap.New[string, *Example]()
		for paramPairs := param.Examples.First(); paramPairs != nil; paramPairs = paramPairs.Next() {
			e := &Example{}
			e.Key = paramPairs.Key()
			for lowExpPairs := param.GoLow().Examples.Value.First(); lowExpPairs != nil; lowExpPairs = lowExpPairs.Next() {
				if lowExpPairs.Key().Value == e.Key {
					e.KeyNode = lowExpPairs.Key().KeyNode
					e.ValueNode = lowExpPairs.Value().ValueNode
					break
				}
			}
			e.Parent = p
			e.SetPathSegment("examples")
			v := paramPairs.Value()
			e.NodeParent = p
			drCtx.RunOrGo(func() { e.Walk(ctx, v) })
			examples.Set(paramPairs.Key(), e)
		}
		p.Examples = examples
	}

	if param.Content != nil && param.Content.Len() > 0 {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := param.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			mt := &MediaType{}
			mt.Parent = p
			mt.SetPathSegment("content")
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
			drCtx.RunOrGo(func() { mt.Walk(ctx, v) })
			content.Set(contentPairs.Key(), mt)
		}
		p.Content = content
	}

	drCtx.ParameterChan <- &WalkedParam{
		Param:     p,
		ParamNode: param.GoLow().RootNode,
	}

	if param.GoLow().IsReference() {
		BuildReference(drCtx, param.GoLow())
	}

	drCtx.ObjectChan <- p
}

func (p *Parameter) GetValue() any {
	return p.Value
}

func (p *Parameter) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if p.Key != "" {
		if len(p.Key) > HEIGHT-15 {
			width += (len(p.Key) - (HEIGHT - 15)) * 20
		}
	}

	if p.Value.Name != "" {
		height += HEIGHT
		if len(p.Value.Name) > HEIGHT-15 {
			width += (len(p.Value.Name) - (HEIGHT - 15)) * 10
		}
	}

	if p.Value.In != "" {
		height += HEIGHT
	}

	if p.Value.Deprecated {
		height += HEIGHT
	}

	if p.Value.Required != nil && *p.Value.Required {
		height += HEIGHT
	}

	if p.Value.Content != nil && p.Value.Content.Len() > 0 {
		height += HEIGHT
	}

	if p.Value.Extensions != nil && p.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	if p.Value.Schema != nil && p.Value.Schema.Schema() != nil && len(p.Value.Schema.Schema().Type) > 0 {
		width += 40 * len(p.Value.Schema.Schema().Type)
	}

	for _, change := range p.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (p *Parameter) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, p)
}
