// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitResponses(ctx context.Context, obj *v3.Responses) {
	if changes, ok := ctx.Value(v3.Context).(*model.ResponsesChanges); ok {
		PushChanges(ctx, obj, &model.ResponsesChanges{})
		nCtx := ctx

		if changes.DefaultChanges != nil && obj.Default != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.DefaultChanges)
			obj.Default.Travel(nCtx, t)
		}
		if len(changes.ResponseChanges) > 0 && obj.Codes != nil && obj.Codes.Len() > 0 {
			ProcessMaps(ctx, changes.ResponseChanges, obj.Codes, t)
		}
		if changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
