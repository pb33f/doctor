// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
    "context"
    "github.com/pb33f/doctor/model/high/base"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
    "github.com/pb33f/libopenapi/orderedmap"
)

type Header struct {
    Value    *v3.Header
    Schema   *base.SchemaProxy
    Examples *orderedmap.Map[string, *base.Example]
    Content  *orderedmap.Map[string, *MediaType]
    base.Foundation
}

func (h *Header) Walk(ctx context.Context, header *v3.Header) {
    h.Value = header
    if header.Schema != nil {
        c := &base.SchemaProxy{}
        c.Parent = h
        c.Value = header.Schema
        c.PathSegment = "schema"
        h.Schema = c
    }

    if header.Examples != nil {
        h.Examples = orderedmap.New[string, *base.Example]()
        i := 0
        for examplesPairs := header.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
            v := examplesPairs.Value()
            ex := &base.Example{}
            ex.Parent = h
            ex.Key = examplesPairs.Key()
            ex.PathSegment = "examples"
            ex.Walk(ctx, v)
            h.Examples.Set(examplesPairs.Key(), ex)
            i++
        }
    }

    if header.Content != nil {
        h.Content = orderedmap.New[string, *MediaType]()
        i := 0
        for contentPairs := header.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
            v := contentPairs.Value()
            mt := &MediaType{}
            mt.PathSegment = "content"
            mt.Parent = h
            mt.Key = contentPairs.Key()
            mt.Walk(ctx, v)
            h.Content.Set(contentPairs.Key(), mt)
            i++
        }
    }
}
