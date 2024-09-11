// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	drBase "github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Header struct {
	Value       *v3.Header
	SchemaProxy *base.SchemaProxy
	Examples    *orderedmap.Map[string, *base.Example]
	Content     *orderedmap.Map[string, *MediaType]
	base.Foundation
}

func (h *Header) Walk(ctx context.Context, header *v3.Header) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup
	h.BuildNodesAndEdges(ctx, h.Key, "header", header, h)
	h.Value = header

	if header.Schema != nil {
		c := &base.SchemaProxy{}
		c.ValueNode = header.GoLow().RootNode
		c.KeyNode = header.GoLow().KeyNode
		c.Parent = h
		c.Value = header.Schema
		c.PathSegment = "schema"
		c.NodeParent = h
		wg.Go(func() {
			c.Walk(ctx, header.Schema, 0)
		})
		h.SchemaProxy = c
	}

	if header.Examples != nil && header.Examples.Len() > 0 {
		h.Examples = orderedmap.New[string, *base.Example]()
		for examplesPairs := header.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			v := examplesPairs.Value()
			ex := &base.Example{}
			for lowExPairs := header.GoLow().Examples.Value.First(); lowExPairs != nil; lowExPairs = lowExPairs.Next() {
				if lowExPairs.Key().Value == examplesPairs.Key() {
					ex.KeyNode = lowExPairs.Key().KeyNode
					ex.ValueNode = lowExPairs.Value().ValueNode
					break
				}
			}
			ex.Parent = h
			ex.Key = examplesPairs.Key()
			ex.PathSegment = "examples"
			ex.NodeParent = h
			wg.Go(func() { ex.Walk(ctx, v) })
			h.Examples.Set(examplesPairs.Key(), ex)
		}
	}

	if header.Content != nil && header.Content.Len() > 0 {
		h.Content = orderedmap.New[string, *MediaType]()
		for contentPairs := header.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			v := contentPairs.Value()
			mt := &MediaType{}
			for lowMtPairs := header.GoLow().Content.Value.First(); lowMtPairs != nil; lowMtPairs = lowMtPairs.Next() {
				if lowMtPairs.Key().Value == contentPairs.Key() {
					mt.KeyNode = lowMtPairs.Key().KeyNode
					mt.ValueNode = lowMtPairs.Value().ValueNode
					break
				}
			}
			mt.PathSegment = "content"
			mt.Parent = h
			mt.Key = contentPairs.Key()
			mt.NodeParent = h
			wg.Go(func() {
				mt.Walk(ctx, v)
			})
			h.Content.Set(contentPairs.Key(), mt)
		}
	}
	drCtx.HeaderChan <- &drBase.WalkedHeader{
		Header:     h,
		HeaderNode: header.GoLow().RootNode,
	}

	if header.GoLow().IsReference() {
		drBase.BuildReference(drCtx, header.GoLow())
	}

	drCtx.ObjectChan <- h
}

func (h *Header) GetValue() any {
	return h.Value
}

func (h *Header) GetSize() (height, width int) {
	width = drBase.WIDTH
	height = drBase.HEIGHT

	if h.Key != "" {
		if len(h.Key) > drBase.HEIGHT {
			width += (len(h.Key) - drBase.HEIGHT) * 12
		}
	}

	if h.Value.Style != "" {
		height += drBase.HEIGHT
	}

	if h.Value.Deprecated {
		height += drBase.HEIGHT
	}

	if h.Value.Required {
		height += drBase.HEIGHT
	}

	if h.Value.Content != nil && h.Value.Content.Len() > 0 {
		height += drBase.HEIGHT
	}

	if h.Value.Extensions != nil && h.Value.Extensions.Len() > 0 {
		height += drBase.HEIGHT
	}

	if h.Value.Schema != nil && len(h.Value.Schema.Schema().Type) > 0 {
		width += 40 * len(h.Value.Schema.Schema().Type)
	}

	return height, width
}
