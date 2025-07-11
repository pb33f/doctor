// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitComponents(ctx context.Context, obj *v3.Components) {
	if changes, ok := ctx.Value(v3.Context).(*model.ComponentsChanges); ok {
		PushChanges(ctx, obj, &model.ComponentsChanges{})
		nCtx := ctx

		if changes.SchemaChanges != nil && len(changes.SchemaChanges) > 0 && obj.Schemas.Len() > 0 {
			for k, v := range changes.SchemaChanges {
				if obj.Schemas.GetOrZero(k) != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					if obj.Schemas.GetOrZero(k).Schema.Value != nil &&
						!obj.Schemas.GetOrZero(k).Schema.Value.GoLow().IsReference() {
						obj.Schemas.GetOrZero(k).Schema.Travel(nCtx, t)
					}
				}
			}
		}

		if changes.SecuritySchemeChanges != nil && obj.SecuritySchemes != nil && obj.SecuritySchemes.Len() > 0 {
			for k, v := range changes.SecuritySchemeChanges {
				if obj.SecuritySchemes != nil &&
					obj.SecuritySchemes.GetOrZero(k) != nil &&
					obj.Schemas != nil && obj.Schemas.GetOrZero(k) != nil &&
					obj.Schemas.GetOrZero(k).Schema != nil {
					nCtx = context.WithValue(ctx, v3.Context, v)
					if obj.Schemas.GetOrZero(k).Schema.Value != nil &&
						!obj.SecuritySchemes.GetOrZero(k).Value.GoLow().IsReference() {
						obj.SecuritySchemes.GetOrZero(k).Travel(nCtx, t)
					}
				}
			}
		}

		if changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
