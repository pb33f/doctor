// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type RequestBody struct {
	Value   *v3.RequestBody
	Content *orderedmap.Map[string, *MediaType]
	base.Foundation
}

func (r *RequestBody) Walk(ctx context.Context, requestBody *v3.RequestBody) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup
	r.Value = requestBody
	if r.PathSegment == "" {
		r.PathSegment = "requestBody"
	}
	instanceType := r.PathSegment
	if r.InstanceType != "" {
		instanceType = r.InstanceType
	}
	label := r.Key

	r.BuildNodesAndEdges(ctx, label, instanceType, requestBody, r)

	if requestBody.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := requestBody.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			mt := &MediaType{}
			mt.Key = contentPairs.Key()
			for lowRespPairs := requestBody.GoLow().Content.Value.First(); lowRespPairs != nil; lowRespPairs = lowRespPairs.Next() {
				if lowRespPairs.Key().Value == mt.Key {
					mt.KeyNode = lowRespPairs.Key().KeyNode
					mt.ValueNode = lowRespPairs.Value().ValueNode
					break
				}
			}

			mt.Parent = r
			mt.PathSegment = "content"

			mt.NodeParent = r
			value := contentPairs.Value()
			wg.Go(func() {
				mt.Walk(ctx, value)
			})
			content.Set(contentPairs.Key(), mt)
		}
		r.Content = content
	}

	if requestBody.GoLow().IsReference() {
		base.BuildReference(drCtx, requestBody.GoLow())
	}

	drCtx.ObjectChan <- r
}

func (r *RequestBody) GetValue() any {
	return r.Value
}

func (r *RequestBody) GetSize() (height, width int) {
	width = base.WIDTH
	height = base.HEIGHT

	if r.Key != "" {
		if len(r.Key) > base.HEIGHT {
			width += (len(r.Key) - base.HEIGHT) * 20
		}
	}

	if r.Value.Required != nil && *r.Value.Required {
		height += base.HEIGHT
	}

	if r.Value.Content != nil && r.Value.Content.Len() > 0 {
		height += base.HEIGHT
	}

	if r.Value.Extensions != nil && r.Value.Extensions.Len() > 0 {
		height += base.HEIGHT
	}

	return height, width
}
