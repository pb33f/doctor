// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitRequestBody(ctx context.Context, obj *v3.RequestBody) {
	if changes, ok := ctx.Value(v3.Context).(*model.RequestBodyChanges); ok {
		PushChanges(ctx, obj, &model.RequestBodyChanges{})
		if obj.Content != nil && obj.Content.Len() > 0 && len(changes.ContentChanges) > 0 {
			ProcessMaps(ctx, changes.ContentChanges, obj.Content, t)
		}
	}
}
