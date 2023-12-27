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
    r.Value = response

    if response.Headers != nil {
        headers := orderedmap.New[string, *Header]()
        for headerPairs := response.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
            h := &Header{}
            h.Parent = r
            h.Key = headerPairs.Key()
            h.Walk(ctx, headerPairs.Value())
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
            m.Walk(ctx, contentPairs.Value())
            content.Set(contentPairs.Key(), m)
        }
        r.Content = content
    }

    if response.Links != nil {
        links := orderedmap.New[string, *Link]()
        for linksPairs := response.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
            l := &Link{}
            l.Parent = r
            l.Key = linksPairs.Key()
            l.Walk(ctx, linksPairs.Value())
            links.Set(linksPairs.Key(), l)
        }
        r.Links = links
    }
}
