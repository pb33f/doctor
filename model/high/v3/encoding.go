// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Encoding struct {
	Value   *v3.Encoding
	Headers *orderedmap.Map[string, *Header]
	base.Foundation
}

func (e *Encoding) Walk(ctx context.Context, encoding *v3.Encoding) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	e.Value = encoding
	e.BuildNodesAndEdges(ctx, e.Key, "encoding", encoding, e)

	if encoding.Headers != nil && encoding.Headers.Len() > 0 {
		headers := orderedmap.New[string, *Header]()
		for headerPairs := encoding.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
			h := &Header{}
			h.Parent = e
			h.Key = headerPairs.Key()
			for lowHeadPairs := encoding.GoLow().Headers.Value.First(); lowHeadPairs != nil; lowHeadPairs = lowHeadPairs.Next() {
				if lowHeadPairs.Key().Value == h.Key {
					h.KeyNode = lowHeadPairs.Key().KeyNode
					h.ValueNode = lowHeadPairs.Value().ValueNode
					break
				}
			}
			v := headerPairs.Value()
			h.NodeParent = e
			wg.Go(func() { h.Walk(ctx, v) })
			headers.Set(headerPairs.Key(), h)
		}
		e.Headers = headers
	}
	drCtx.ObjectChan <- e
}

func (e *Encoding) GetValue() any {
	return e.Value
}
