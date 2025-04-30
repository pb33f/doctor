// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitOperation(ctx context.Context, obj *v3.Operation) {
	if changes, ok := ctx.Value(v3.Context).(*model.OperationChanges); ok {
		PushChanges(ctx, obj, &model.OperationChanges{})
		nCtx := ctx

		if changes == nil {
			return
		}

		if len(changes.ParameterChanges) > 0 {
			if len(obj.Parameters) > 0 {
				for i := range changes.ParameterChanges {
					nCtx = context.WithValue(ctx, v3.Context, changes.ParameterChanges[i])
					obj.Parameters[i].Travel(nCtx, t)
				}
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.ParameterChanges)
				PushChangesFromSlice(nCtx, obj, []*model.ParameterChanges{}, "", "")
			}
		}

		if len(changes.ServerChanges) > 0 {
			if len(obj.Servers) > 0 {
				for i := range obj.Servers {
					nCtx = context.WithValue(ctx, v3.Context, changes.ServerChanges[i])
					obj.Servers[i].Travel(nCtx, t)
				}
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.ServerChanges)
				PushChangesFromSlice(nCtx, obj, []*model.ServerChanges{}, "", "")
			}
		}

		if obj.Security != nil && len(changes.SecurityRequirementChanges) > 0 {
			nCtx = context.WithValue(ctx, v3.Context, changes.SecurityRequirementChanges)
			PushChangesFromSlice(nCtx, obj, []*model.SecurityRequirementChanges{}, "", "")
		}

		if changes.ExternalDocChanges != nil && obj.ExternalDocs != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ExternalDocChanges)
			obj.ExternalDocs.Travel(nCtx, t)
		}

		if changes.RequestBodyChanges != nil && obj.RequestBody != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.RequestBodyChanges)
			obj.RequestBody.Travel(nCtx, t)
		}

		if changes.ResponsesChanges != nil && obj.Responses != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ResponsesChanges)
			obj.Responses.Travel(nCtx, t)
		}

		if obj.Callbacks != nil && obj.Callbacks.Len() > 0 {
			if changes.CallbackChanges != nil {
				for key, change := range changes.CallbackChanges {
					nCtx = context.WithValue(ctx, v3.Context, change)
					if obj.Callbacks.GetOrZero(key) != nil {
						callback := obj.Callbacks.GetOrZero(key)
						callback.Travel(nCtx, t)
					}
				}
			}
		}
		if changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
