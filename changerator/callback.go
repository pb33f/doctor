// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitCallback(ctx context.Context, obj *v3.Callback) {
	if changes, ok := ctx.Value(v3.Context).(*model.CallbackChanges); ok {
		PushChanges(ctx, obj, &model.CallbackChanges{})
		if len(changes.ExpressionChanges) > 0 {
			ProcessMaps(ctx, changes.ExpressionChanges, obj.Expression, t)
		}
	}
}
