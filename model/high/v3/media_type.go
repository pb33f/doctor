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
	m.BuildNodesAndEdges(ctx, m.Key, "mediaType", mediaType, m)

	if mediaType.Schema != nil {
		s := &drBase.SchemaProxy{}
		s.ValueNode = mediaType.Schema.GoLow().GetValueNode()
		s.KeyNode = mediaType.Schema.GetSchemaKeyNode()
		s.Parent = m
		s.PathSegment = "schema"
		s.Value = mediaType.Schema
		s.NodeParent = m
		m.SchemaProxy = s
		wg.Go(func() { s.Walk(ctx, mediaType.Schema, 0) })
	}

	if mediaType.Examples != nil && mediaType.Examples.Len() > 0 {
		examples := orderedmap.New[string, *drBase.Example]()
		for mediaTypePairs := mediaType.Examples.First(); mediaTypePairs != nil; mediaTypePairs = mediaTypePairs.Next() {
			e := &drBase.Example{}
			e.Parent = m
			e.PathSegment = "examples"
			e.Key = mediaTypePairs.Key()
			v := mediaTypePairs.Value()
			for lowExpPairs := mediaType.GoLow().Examples.Value.First(); lowExpPairs != nil; lowExpPairs = lowExpPairs.Next() {
				if lowExpPairs.Key().Value == e.Key {
					e.KeyNode = lowExpPairs.Key().KeyNode
					e.ValueNode = lowExpPairs.Value().ValueNode
					break
				}
			}
			e.Value = v
			e.NodeParent = m
			wg.Go(func() {
				e.Walk(ctx, v)
			})
			examples.Set(mediaTypePairs.Key(), e)
		}
		m.Examples = examples
	}

	if mediaType.Encoding != nil && mediaType.Encoding.Len() > 0 {
		encoding := orderedmap.New[string, *Encoding]()
		for encodingPairs := mediaType.Encoding.First(); encodingPairs != nil; encodingPairs = encodingPairs.Next() {
			e := &Encoding{}
			e.Parent = m
			e.PathSegment = "encoding"
			e.Key = encodingPairs.Key()
			v := encodingPairs.Value()
			for lowEncPairs := mediaType.GoLow().Encoding.Value.First(); lowEncPairs != nil; lowEncPairs = lowEncPairs.Next() {
				if lowEncPairs.Key().Value == e.Key {
					e.KeyNode = lowEncPairs.Key().KeyNode
					e.ValueNode = lowEncPairs.Value().ValueNode
					break
				}
			}
			e.NodeParent = m
			wg.Go(func() { e.Walk(ctx, v) })
			encoding.Set(encodingPairs.Key(), e)
		}
	}
	drCtx.MediaTypeChan <- &drBase.WalkedMediaType{
		MediaType:     m,
		MediaTypeNode: mediaType.GoLow().RootNode,
	}

	if mediaType.GoLow().IsReference() {
		drBase.BuildReference(drCtx, mediaType.GoLow())
	}

	drCtx.ObjectChan <- m
}

func (m *MediaType) GetValue() any {
	return m.Value
}
