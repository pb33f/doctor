// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Encoding struct {
	Value   *v3.Encoding
	Headers *orderedmap.Map[string, *Header]
	Foundation
}

func (e *Encoding) Walk(ctx context.Context, encoding *v3.Encoding) {

	drCtx := GetDrContext(ctx)

	e.Value = encoding
	e.BuildNodesAndEdges(ctx, e.Key, "encoding", encoding, e)

	if encoding.Headers != nil && encoding.Headers.Len() > 0 {
		headers := orderedmap.New[string, *Header]()
		lowHeadFinder := newLowNodeFinder(encoding.GoLow().Headers.Value)
		for headerPairs := encoding.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
			h := &Header{}
			h.Parent = e
			// Key only, deliberately NO SetPathSegment: encoding headers render
			// as encoding['prop']['name'] (no 'headers' segment). The canonical
			// path pre-population (model/walk_model.go prePopulateMediaTypeSchemas)
			// mirrors this shape - change both together or DeterministicPaths
			// paths desynchronize.
			h.Key = headerPairs.Key()
			if keyNode, valueNode, ok := lowHeadFinder.find(h.Key); ok {
				h.KeyNode = keyNode
				h.ValueNode = valueNode
			}
			v := headerPairs.Value()
			h.NodeParent = e
			drCtx.RunWalk(func() { h.Walk(ctx, v) })
			headers.Set(headerPairs.Key(), h)
		}
		e.Headers = headers
	}
	drCtx.ObjectChan <- e
}

func (e *Encoding) GetValue() any {
	return e.Value
}

func (e *Encoding) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, e)
}
