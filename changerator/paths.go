// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitPaths(ctx context.Context, obj *v3.Paths) {
	if changes, ok := ctx.Value(v3.Context).(*model.PathsChanges); ok {
		PushChanges(ctx, obj, &model.PathsChanges{})
		nCtx := ctx

		if changes.PathItemsChanges != nil && len(changes.PathItemsChanges) > 0 && obj.PathItems.Len() > 0 {
			for k, v := range changes.PathItemsChanges {
				if obj.PathItems.GetOrZero(k) != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					obj.PathItems.GetOrZero(k).Travel(nCtx, t)
				}
			}
		}
	}
}
