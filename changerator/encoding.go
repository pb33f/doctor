// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitEncoding(ctx context.Context, obj *v3.Encoding) {
	if changes, ok := ctx.Value(v3.Context).(*model.EncodingChanges); ok {
		PushChanges(ctx, obj, &model.EncodingChanges{})
		nCtx := ctx
		if changes.HeaderChanges != nil && obj.Headers != nil && obj.Headers.Len() > 0 {
			for k, v := range changes.HeaderChanges {
				if exp := obj.Headers.GetOrZero(k); exp != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					exp.Travel(nCtx, t)
				}
			}
		}
	}
}
