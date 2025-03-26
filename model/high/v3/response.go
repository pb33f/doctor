// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

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
	wg := drCtx.WaitGroup

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
			for lowHeaderPairs := response.GoLow().Headers.Value.First(); lowHeaderPairs != nil; lowHeaderPairs = lowHeaderPairs.Next() {
				if lowHeaderPairs.Key().Value == h.Key {
					h.KeyNode = lowHeaderPairs.Key().KeyNode
					h.ValueNode = lowHeaderPairs.Value().ValueNode
					break
				}
			}
			h.PathSegment = "headers"
			h.Parent = r
			h.NodeParent = r
			wg.Go(func() {
				h.Walk(ctx, v)
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
			m.PathSegment = "content"
			m.NodeParent = r
			v := contentPairs.Value()
			wg.Go(func() { m.Walk(ctx, v) })
			content.Set(contentPairs.Key(), m)
		}
		r.Content = content
	}

	if response.Links != nil {
		links := orderedmap.New[string, *Link]()
		for linksPairs := response.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
			l := &Link{}
			l.PathSegment = "links"
			l.Parent = r
			l.NodeParent = r
			l.Key = linksPairs.Key()
			v := linksPairs.Value()
			wg.Go(func() { l.Walk(ctx, v) })
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

	return height, width
}

func (r *Response) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, r)
}
