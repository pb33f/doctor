// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
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
	if drCtx.DeterministicPaths && drCtx.CanonicalPathCache != nil && response != nil {
		if low := response.GoLow(); low != nil && low.RootNode != nil {
			if canonicalPath, found := drCtx.CanonicalPathCache.Load(index.HashNode(low.RootNode)); found {
				r.JSONPathOnce.Do(func() {
					r.JSONPath = canonicalPath.(string)
				})
			}
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
		for headerPairs := response.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
			v := headerPairs.Value()
			h := &Header{}
			h.Key = headerPairs.Key()
			var refString string
			for lowHeaderPairs := response.GoLow().Headers.Value.First(); lowHeaderPairs != nil; lowHeaderPairs = lowHeaderPairs.Next() {
				if lowHeaderPairs.Key().Value == h.Key {
					h.KeyNode = lowHeaderPairs.Key().KeyNode
					h.ValueNode = lowHeaderPairs.Value().ValueNode
					// capture reference info from the ValueReference wrapper
					if lowHeaderPairs.Value().IsReference() {
						refString = lowHeaderPairs.Value().GetReference()
					}
					break
				}
			}
			h.SetPathSegment("headers")
			h.Parent = r
			h.NodeParent = r
			// capture variables for goroutine
			header := h
			ref := refString
			drCtx.RunWalk(func() {
				header.Walk(ctx, v)
				// if this was a reference, create a reference edge
				if ref != "" && header.GetNode() != nil && r.GetNode() != nil {
					r.BuildReferenceEdge(ctx, r.GetNode().Id, header.GetNode().Id, ref, "")
				}
			})
			headers.Set(headerPairs.Key(), h)
		}
		r.Headers = headers
	}

	if response.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := response.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			m := &MediaType{}
			m.Key = contentPairs.Key()
			for lowMtPairs := response.GoLow().Content.Value.First(); lowMtPairs != nil; lowMtPairs = lowMtPairs.Next() {
				if lowMtPairs.Key().Value == m.Key {
					m.KeyNode = lowMtPairs.Key().KeyNode
					m.ValueNode = lowMtPairs.Value().ValueNode
					break
				}
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
		for linksPairs := response.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
			l := &Link{}
			l.SetPathSegment("links")
			l.Parent = r
			l.NodeParent = r
			l.Key = linksPairs.Key()
			var refString string
			for lowLinkPairs := response.GoLow().Links.Value.First(); lowLinkPairs != nil; lowLinkPairs = lowLinkPairs.Next() {
				if lowLinkPairs.Key().Value == l.Key {
					l.KeyNode = lowLinkPairs.Key().KeyNode
					l.ValueNode = lowLinkPairs.Value().ValueNode
					if lowLinkPairs.Value().IsReference() {
						refString = lowLinkPairs.Value().GetReference()
					}
					break
				}
			}
			v := linksPairs.Value()
			link := l
			ref := refString
			drCtx.RunWalk(func() {
				link.Walk(ctx, v)
				if ref != "" && link.GetNode() != nil && r.GetNode() != nil {
					r.BuildReferenceEdge(ctx, r.GetNode().Id, link.GetNode().Id, ref, "")
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
