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
	r.Value = responses
	r.BuildNodesAndEdges(ctx, "Responses", "responses", responses, r)

	if responses.Codes != nil {
		r.Codes = orderedmap.New[string, *Response]()

		for respPairs := responses.Codes.First(); respPairs != nil; respPairs = respPairs.Next() {
			k := respPairs.Key()
			v := respPairs.Value()
			resp := &Response{}
			resp.Key = k
			var refString string
			for lowRespPairs := responses.GoLow().Codes.First(); lowRespPairs != nil; lowRespPairs = lowRespPairs.Next() {
				if lowRespPairs.Key().Value == k {
					resp.KeyNode = lowRespPairs.Key().KeyNode
					resp.ValueNode = lowRespPairs.Value().ValueNode
					// capture reference info from the ValueReference wrapper
					if lowRespPairs.Value().IsReference() {
						refString = lowRespPairs.Value().GetReference()
					}
					break
				}
			}
			resp.Parent = r
			resp.NodeParent = r
			resp.Key = k
			// capture variables for goroutine
			response := resp
			ref := refString
			drCtx.RunWalk(func() {
				walkCtx := drCtx.WalkContextForRef(ctx, ref != "")
				response.Walk(walkCtx, v)
				// if this was a reference, create a reference edge
				if ref != "" && r.GetNode() != nil {
					if !drCtx.BuildRefEdgeByLine(ctx, &r.Foundation, ref) && response.GetNode() != nil {
						r.BuildReferenceEdge(ctx, r.GetNode().Id, response.GetNode().Id, ref, "")
					}
				}
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
		var refString string
		if responses.GoLow().Default.IsReference() {
			refString = responses.GoLow().Default.GetReference()
		}
		response := resp
		ref := refString
		drCtx.RunWalk(func() {
			walkCtx := drCtx.WalkContextForRef(ctx, ref != "")
			response.Walk(walkCtx, responses.Default)
			if ref != "" && r.GetNode() != nil {
				if !drCtx.BuildRefEdgeByLine(ctx, &r.Foundation, ref) && response.GetNode() != nil {
					r.BuildReferenceEdge(ctx, r.GetNode().Id, response.GetNode().Id, ref, "")
				}
			}
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
