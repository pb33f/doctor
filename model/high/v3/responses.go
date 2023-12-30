// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Responses struct {
	Value   *v3.Responses
	Codes   *orderedmap.Map[string, *Response]
	Default *Response
	base.Foundation
}

func (r *Responses) Walk(ctx context.Context, responses *v3.Responses) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	r.Value = responses
	r.PathSegment = "responses"

	if responses.Codes != nil {
		r.Codes = orderedmap.New[string, *Response]()
		for respPairs := responses.Codes.First(); respPairs != nil; respPairs = respPairs.Next() {
			k := respPairs.Key()
			v := respPairs.Value()
			resp := &Response{}
			resp.Key = k
			resp.Parent = r
			wg.Go(func() { resp.Walk(ctx, v) })
			r.Codes.Set(k, resp)
		}
	}

	if responses.Default != nil {
		resp := &Response{}
		resp.Parent = r
		wg.Go(func() { resp.Walk(ctx, responses.Default) })
		r.Default = resp
	}

}
