// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitResponse(ctx context.Context, obj *v3.Response) {
	if changes, ok := ctx.Value(v3.Context).(*model.ResponseChanges); ok {
		PushChanges(ctx, obj, &model.ResponseChanges{})
		if changes.HeadersChanges != nil && obj.Headers != nil {
			ProcessMaps(ctx, changes.HeadersChanges, obj.Headers, t)
		}
		if changes.ContentChanges != nil && obj.Content != nil {
			ProcessMaps(ctx, changes.ContentChanges, obj.Content, t)
		}
		if changes.LinkChanges != nil && obj.Links != nil {
			ProcessMaps(ctx, changes.LinkChanges, obj.Links, t)
		}
		if obj.Value.Extensions != nil && obj.Value.Extensions.Len() > 0 {
			if changes.ExtensionChanges != nil {
				nCtx := context.WithValue(ctx, v3.Context, changes.ExtensionChanges)
				PushChangesWithOverride(nCtx, obj, &model.ExtensionChanges{}, "extension", "")
			}
		}
	}
}
