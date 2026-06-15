// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Response struct {
	Value   *v3.Response
	Headers *orderedmap.Map[string, *Header]
	Content *orderedmap.Map[string, *MediaType]
	Links   *orderedmap.Map[string, *Link]
	Foundation
}

func (r *Response) Walk(ctx context.Context, response *v3.Response) {

	drCtx := GetDrContext(ctx)

	// Check for canonical path - ensures deterministic paths for $ref'd responses
	if response != nil {
		if low := response.GoLow(); low != nil && low.RootNode != nil {
			r.setCanonicalJSONPathFromContext(drCtx, low.RootNode)
		}
	}

	r.Value = response
	label := r.PathSegment
	if r.Key != "" {
		label = r.Key
	}
	r.BuildNodesAndEdges(ctx, label, "response", response, r)

	if response.Headers != nil {
		headers := orderedmap.New[string, *Header]()
		lowHeadersFinder := newLowNodeFinder(response.GoLow().Headers.Value)
		for headerPairs := response.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
			v := headerPairs.Value()
			h := &Header{}
			h.Key = headerPairs.Key()
			var refString string
			if lowPair, ok := lowHeadersFinder.findPair(h.Key); ok {
				h.KeyNode = lowPair.Key().KeyNode
				h.ValueNode = lowPair.Value().ValueNode
				// capture reference info from the ValueReference wrapper
				if lowPair.Value().IsReference() {
					refString = lowPair.Value().GetReference()
				}
			}
			h.SetPathSegment("headers")
			h.Parent = r
			h.NodeParent = r
			// capture variables for goroutine
			header := h
			ref := refString
			drCtx.RunWalk(func() {
				walkCtx := drCtx.WalkContextForRef(ctx, ref != "")
				header.Walk(walkCtx, v)
				// if this was a reference, create a reference edge
				if ref != "" && r.GetNode() != nil {
					if !drCtx.BuildRefEdgeByLine(ctx, &r.Foundation, ref) && header.GetNode() != nil {
						r.BuildReferenceEdge(ctx, r.GetNode().Id, header.GetNode().Id, ref, "")
					}
				}
			})
			headers.Set(headerPairs.Key(), h)
		}
		r.Headers = headers
	}

	if response.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		lowMtFinder := newLowNodeFinder(response.GoLow().Content.Value)
		for contentPairs := response.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			m := &MediaType{}
			m.Key = contentPairs.Key()
			if keyNode, valueNode, ok := lowMtFinder.find(m.Key); ok {
				m.KeyNode = keyNode
				m.ValueNode = valueNode
			}
			m.Parent = r
			m.SetPathSegment("content")
			m.NodeParent = r
			v := contentPairs.Value()
			drCtx.RunWalk(func() { m.Walk(ctx, v) })
			content.Set(contentPairs.Key(), m)
		}
		r.Content = content
	}

	if response.Links != nil {
		links := orderedmap.New[string, *Link]()
		lowLinksFinder := newLowNodeFinder(response.GoLow().Links.Value)
		for linksPairs := response.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
			l := &Link{}
			l.SetPathSegment("links")
			l.Parent = r
			l.NodeParent = r
			l.Key = linksPairs.Key()
			var refString string
			if lowPair, ok := lowLinksFinder.findPair(l.Key); ok {
				l.KeyNode = lowPair.Key().KeyNode
				l.ValueNode = lowPair.Value().ValueNode
				if lowPair.Value().IsReference() {
					refString = lowPair.Value().GetReference()
				}
			}
			v := linksPairs.Value()
			link := l
			ref := refString
			drCtx.RunWalk(func() {
				walkCtx := drCtx.WalkContextForRef(ctx, ref != "")
				link.Walk(walkCtx, v)
				if ref != "" && r.GetNode() != nil {
					if !drCtx.BuildRefEdgeByLine(ctx, &r.Foundation, ref) && link.GetNode() != nil {
						r.BuildReferenceEdge(ctx, r.GetNode().Id, link.GetNode().Id, ref, "")
					}
				}
			})
			links.Set(linksPairs.Key(), l)
		}
		r.Links = links
	}

	if response.GoLow().IsReference() {
		BuildReference(drCtx, response.GoLow())
	}

	drCtx.ObjectChan <- r
}

func (r *Response) GetValue() any {
	return r.Value
}

func (r *Response) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if r.Key != "" {
		if len(r.Key) > HEIGHT-10 {
			width += (len(r.Key) - (HEIGHT - 10)) * 15
		}
	}

	if r.Value.Content != nil && r.Value.Content.Len() > 0 {
		height += HEIGHT
	}

	if r.Value.Headers != nil && r.Value.Headers.Len() > 0 {
		height += HEIGHT
	}

	if r.Value.Links != nil && r.Value.Links.Len() > 0 {
		height += HEIGHT
	}

	if r.Value.Extensions != nil && r.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range r.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}
	return height, width
}

func (r *Response) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, r)
}
