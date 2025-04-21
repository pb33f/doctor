// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitTag(ctx context.Context, obj *v3.Tag) {
	if changes, ok := ctx.Value(v3.Context).(*model.TagChanges); ok {
		PushChanges(ctx, obj, &model.TagChanges{})
		nCtx := ctx
		if obj.ExternalDocs != nil {
			if changes != nil && changes.ExternalDocs != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.ExternalDocs)
			}
			obj.ExternalDocs.Travel(nCtx, t)
		}
	}
}
