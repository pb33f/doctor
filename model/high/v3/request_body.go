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

	if requestBody.Content != nil {
		content := orderedmap.New[string, *MediaType]()
		for contentPairs := requestBody.Content.First(); contentPairs != nil; contentPairs = contentPairs.Next() {
			mt := &MediaType{}
			mt.Parent = r
			mt.PathSegment = "content"
			mt.Key = contentPairs.Key()
			value := contentPairs.Value()
			wg.Go(func() { mt.Walk(ctx, value) })
			content.Set(contentPairs.Key(), mt)
		}
		r.Content = content
	}
}
