// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitHeader(ctx context.Context, obj *v3.Header) {
	if changes, ok := ctx.Value(v3.Context).(*model.HeaderChanges); ok {
		PushChanges(ctx, obj, &model.HeaderChanges{})
		nCtx := ctx
		if obj.Examples != nil && obj.Examples.Len() > 0 && len(changes.ExamplesChanges) > 0 {
			ProcessMaps(ctx, changes.ExamplesChanges, obj.Examples, t)
		}

		if obj.Content != nil && obj.Content.Len() > 0 && len(changes.ContentChanges) > 0 {
			ProcessMaps(ctx, changes.ContentChanges, obj.Content, t)
		}

		if obj.Schema != nil && !obj.Schema.Value.IsReference() {
			nCtx = context.WithValue(ctx, v3.Context, changes.SchemaChanges)
			obj.Schema.Schema.Travel(nCtx, t)
		}
		if changes != nil && changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
