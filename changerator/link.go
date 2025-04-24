// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitLink(ctx context.Context, obj *v3.Link) {
	if changes, ok := ctx.Value(v3.Context).(*model.LinkChanges); ok {
		PushChanges(ctx, obj, &model.LinkChanges{})
		if changes.ServerChanges != nil {
			nCtx := context.WithValue(ctx, v3.Context, changes.ServerChanges)
			obj.Server.Travel(nCtx, t)
		}
		if changes != nil && changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
