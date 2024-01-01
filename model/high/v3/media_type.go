// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	drBase "github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type MediaType struct {
	Value       *v3.MediaType
	SchemaProxy *drBase.SchemaProxy
	Examples    *orderedmap.Map[string, *drBase.Example]
	Encoding    *orderedmap.Map[string, *Encoding]
	drBase.Foundation
}

func (m *MediaType) Walk(ctx context.Context, mediaType *v3.MediaType) {

	drCtx := drBase.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	m.Value = mediaType

	if mediaType.Schema != nil {
		s := &drBase.SchemaProxy{}
		s.Parent = m
		s.PathSegment = "schema"
		s.Value = mediaType.Schema
		m.SchemaProxy = s
		s.Walk(ctx, mediaType.Schema)
	}

	if mediaType.Examples != nil {
		examples := orderedmap.New[string, *drBase.Example]()
		for mediaTypePairs := mediaType.Examples.First(); mediaTypePairs != nil; mediaTypePairs = mediaTypePairs.Next() {
			e := &drBase.Example{}
			e.Parent = m
			e.PathSegment = "examples"
			e.Key = mediaTypePairs.Key()
			v := mediaTypePairs.Value()
			wg.Go(func() { e.Walk(ctx, v) })
			examples.Set(mediaTypePairs.Key(), e)
		}
		m.Examples = examples
	}

	if mediaType.Encoding != nil {
		encoding := orderedmap.New[string, *Encoding]()
		for encodingPairs := mediaType.Encoding.First(); encodingPairs != nil; encodingPairs = encodingPairs.Next() {
			e := &Encoding{}
			e.Parent = m
			e.PathSegment = "encoding"
			e.Key = encodingPairs.Key()
			v := encodingPairs.Value()
			wg.Go(func() { e.Walk(ctx, v) })
			encoding.Set(encodingPairs.Key(), e)
		}
	}
	drCtx.MediaTypeChan <- &drBase.WalkedMediaType{
		MediaType:     m,
		MediaTypeNode: mediaType.GoLow().RootNode,
	}
}
