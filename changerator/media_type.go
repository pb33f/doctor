// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitMediaType(ctx context.Context, obj *v3.MediaType) {
	if changes, ok := ctx.Value(v3.Context).(*model.MediaTypeChanges); ok {
		PushChanges(ctx, obj, &model.MediaTypeChanges{})
		nCtx := ctx

		if changes.SchemaChanges != nil && obj.SchemaProxy != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.SchemaChanges)
			obj.SchemaProxy.Schema.Travel(nCtx, t)
		}

		if changes.ExampleChanges != nil && obj.Examples != nil && obj.Examples.Len() > 0 {
			for k, v := range changes.ExampleChanges {
				if exp := obj.Examples.GetOrZero(k); exp != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					exp.Travel(nCtx, t)
				}
			}
		}
		if changes.EncodingChanges != nil && obj.Encoding != nil && obj.Encoding.Len() > 0 {
			for k, v := range changes.EncodingChanges {
				if exp := obj.Encoding.GetOrZero(k); exp != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					exp.Travel(nCtx, t)
				}
			}
		}
		if obj.Value.Extensions != nil && obj.Value.Extensions.Len() > 0 {
			if changes.ExtensionChanges != nil {
				nCtx := context.WithValue(ctx, v3.Context, changes.ExtensionChanges)
				PushChangesWithOverride(nCtx, obj, &model.ExtensionChanges{}, "extension", "")
			}
		}
	}
}
