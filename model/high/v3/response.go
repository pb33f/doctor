// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Response struct {
	Value   *v3.Response
	Headers *orderedmap.Map[string, *Header]
	Content *orderedmap.Map[string, *MediaType]
	Links   *orderedmap.Map[string, *Link]
	base.Foundation
}

func (r *Response) Walk(ctx context.Context, response *v3.Response) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	r.Value = response

	if response.Headers != nil {
		headers := orderedmap.New[string, *Header]()
		for headerPairs := response.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
			h := &Header{}
			h.PathSegment = "headers"
			h.Parent = r
			h.Key = headerPairs.Key()
			v := headerPairs.Value()
			wg.Go(func() { h.Walk(ctx, v) })
			headers.Set(headerPairs.Key(), h)
		}
		r.Headers = headers
	}

	if response.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := response.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			m := &MediaType{}
			m.Parent = r
			m.PathSegment = "content"
			m.Key = contentPairs.Key()
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
			l.Key = linksPairs.Key()
			v := linksPairs.Value()
			wg.Go(func() { l.Walk(ctx, v) })
			links.Set(linksPairs.Key(), l)
		}
		r.Links = links
	}
}
