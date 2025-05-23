// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Responses struct {
	Value   *v3.Responses
	Codes   *orderedmap.Map[string, *Response]
	Default *Response
	Foundation
}

func (r *Responses) Walk(ctx context.Context, responses *v3.Responses) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup
	r.Value = responses
	r.BuildNodesAndEdges(ctx, "Responses", "responses", responses, r)

	if responses.Codes != nil {
		r.Codes = orderedmap.New[string, *Response]()

		for respPairs := responses.Codes.First(); respPairs != nil; respPairs = respPairs.Next() {
			k := respPairs.Key()
			v := respPairs.Value()
			resp := &Response{}
			resp.Key = k
			for lowRespPairs := responses.GoLow().Codes.First(); lowRespPairs != nil; lowRespPairs = lowRespPairs.Next() {
				if lowRespPairs.Key().Value == k {
					resp.KeyNode = lowRespPairs.Key().KeyNode
					resp.ValueNode = lowRespPairs.Value().ValueNode
					break
				}
			}
			resp.Parent = r
			resp.NodeParent = r
			resp.Key = k
			wg.Go(func() {
				resp.Walk(ctx, v)
			})
			r.Codes.Set(k, resp)
		}
	}

	if responses.Default != nil {
		resp := &Response{}
		resp.Parent = r
		resp.NodeParent = r
		resp.KeyNode = responses.Default.GoLow().KeyNode
		resp.ValueNode = responses.GoLow().Default.ValueNode
		resp.Key = "default"
		wg.Go(func() {
			resp.Walk(ctx, responses.Default)
		})
		r.Default = resp
	}

	if responses.GoLow().IsReference() {
		BuildReference(drCtx, responses.GoLow())
	}

	drCtx.ObjectChan <- r
}

func (r *Responses) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

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

func (r *Responses) GetValue() any {
	return r.Value
}

func (r *Responses) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, r)
}
