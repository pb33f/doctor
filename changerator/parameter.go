// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitParameter(ctx context.Context, obj *v3.Parameter) {
	if changes, ok := ctx.Value(v3.Context).(*model.ParameterChanges); ok {
		PushChanges(ctx, obj, &model.ParameterChanges{})
		nCtx := ctx
		if obj.Examples != nil && obj.Examples.Len() > 0 && len(changes.ExamplesChanges) > 0 {
			ProcessMaps(ctx, changes.ExamplesChanges, obj.Examples, t)
		}

		if obj.Content != nil && obj.Content.Len() > 0 && len(changes.ContentChanges) > 0 {
			ProcessMaps(ctx, changes.ContentChanges, obj.Content, t)
		}

		if changes.SchemaChanges != nil && obj.SchemaProxy != nil && !obj.SchemaProxy.Value.IsReference() && obj.SchemaProxy.Schema != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.SchemaChanges)
			obj.SchemaProxy.Schema.Travel(nCtx, t)
		}
		if obj.Value.Extensions != nil && obj.Value.Extensions.Len() > 0 {
			if changes.ExtensionChanges != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.ExtensionChanges)
				PushChangesWithOverride(nCtx, obj, &model.ExtensionChanges{}, "extension", "")
			}
		}
	}
}
