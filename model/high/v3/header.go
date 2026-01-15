// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"slices"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Header struct {
	Value    *v3.Header
	Schema   *SchemaProxy
	Examples *orderedmap.Map[string, *Example]
	Content  *orderedmap.Map[string, *MediaType]
	Foundation
}

func (h *Header) Walk(ctx context.Context, header *v3.Header) {

	drCtx := GetDrContext(ctx)

	// Check for canonical path - ensures deterministic paths for $ref'd headers
	if drCtx.DeterministicPaths && drCtx.CanonicalPathCache != nil && header != nil {
		if low := header.GoLow(); low != nil && low.RootNode != nil {
			if canonicalPath, found := drCtx.CanonicalPathCache.Load(index.HashNode(low.RootNode)); found {
				h.JSONPathOnce.Do(func() {
					h.JSONPath = canonicalPath.(string)
				})
			}
		}
	}

	h.Value = header
	h.BuildNodesAndEdges(ctx, h.Key, "header", header, h)

	if header.Schema != nil {
		c := &SchemaProxy{}
		c.ValueNode = header.GoLow().RootNode
		c.KeyNode = header.GoLow().KeyNode
		c.Parent = h
		c.Value = header.Schema
		c.SetPathSegment("schema")
		g := header.Schema.Schema()
		if g != nil {
			if !slices.Contains(g.Type, "string") &&
				!slices.Contains(g.Type, "boolean") &&
				!slices.Contains(g.Type, "integer") &&
				!slices.Contains(g.Type, "number") {
				c.NodeParent = h
			}
		}

		drCtx.RunWalk(func() {
			c.Walk(ctx, header.Schema, 0)
		})
		h.Schema = c
	}

	if header.Examples != nil && header.Examples.Len() > 0 {
		h.Examples = orderedmap.New[string, *Example]()
		for examplesPairs := header.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			v := examplesPairs.Value()
			ex := &Example{}
			for lowExPairs := header.GoLow().Examples.Value.First(); lowExPairs != nil; lowExPairs = lowExPairs.Next() {
				if lowExPairs.Key().Value == examplesPairs.Key() {
					ex.KeyNode = lowExPairs.Key().KeyNode
					ex.ValueNode = lowExPairs.Value().ValueNode
					break
				}
			}
			ex.Parent = h
			ex.Key = examplesPairs.Key()
			ex.SetPathSegment("examples")
			ex.NodeParent = h
			drCtx.RunWalk(func() { ex.Walk(ctx, v) })
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
			mt.SetPathSegment("content")
			mt.Parent = h
			mt.Key = contentPairs.Key()
			mt.NodeParent = h
			drCtx.RunWalk(func() {
				mt.Walk(ctx, v)
			})
			h.Content.Set(contentPairs.Key(), mt)
		}
	}

	if header.GoLow().IsReference() {
		BuildReference(drCtx, header.GoLow())
	}

	drCtx.HeaderChan <- &WalkedHeader{
		Header:     h,
		HeaderNode: header.GoLow().RootNode,
	}

	drCtx.ObjectChan <- h
}

func (h *Header) GetValue() any {
	return h.Value
}

func (h *Header) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT * 2

	if h.Key != "" {
		if len(h.Key) > HEIGHT-10 {
			width += (len(h.Key) - (HEIGHT - 10)) * 15
		}
	}

	if h.Value.Style != "" {
		height += HEIGHT
	}

	if h.Value.Deprecated {
		height += HEIGHT
	}

	if h.Value.Required {
		height += HEIGHT
	}

	if h.Value.Content != nil && h.Value.Content.Len() > 0 {
		height += HEIGHT
	}

	if h.Value.Extensions != nil && h.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	if h.Value.Schema != nil && len(h.Value.Schema.Schema().Type) > 0 {
		width += len(h.Value.Schema.Schema().Type) * 50
		sh, sw := ParseSchemaSize(h.Value.Schema.Schema())
		height += sh
		if width < sw {
			width = sw
		}
	}

	if len(h.Changes) > 0 {
		for _, change := range h.Changes {
			if len(change.GetPropertyChanges()) > 0 {
				height += HEIGHT
				break
			}
		}
	}

	return height, width
}

func (h *Header) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, h)
}
