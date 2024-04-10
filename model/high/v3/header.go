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

	h.Value = header
	if header.Schema != nil {
		c := &base.SchemaProxy{}
		c.Parent = h
		c.Value = header.Schema
		c.PathSegment = "schema"
		wg.Go(func() { c.Walk(ctx, header.Schema) })
		h.SchemaProxy = c
	}

	if header.Examples != nil {
		h.Examples = orderedmap.New[string, *base.Example]()
		for examplesPairs := header.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			v := examplesPairs.Value()
			ex := &base.Example{}
			ex.Parent = h
			ex.Key = examplesPairs.Key()
			ex.PathSegment = "examples"
			wg.Go(func() { ex.Walk(ctx, v) })
			h.Examples.Set(examplesPairs.Key(), ex)
		}
	}

	if header.Content != nil {
		h.Content = orderedmap.New[string, *MediaType]()
		for contentPairs := header.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			v := contentPairs.Value()
			mt := &MediaType{}
			mt.PathSegment = "content"
			mt.Parent = h
			mt.Key = contentPairs.Key()
			wg.Go(func() { mt.Walk(ctx, v) })
			h.Content.Set(contentPairs.Key(), mt)
		}
	}
	drCtx.HeaderChan <- &drBase.WalkedHeader{
		Header:     h,
		HeaderNode: header.GoLow().RootNode,
	}
}

func (h *Header) GetValue() any {
	return h.Value
}
