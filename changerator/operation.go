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

		if obj.Parameters != nil && len(changes.ParameterChanges) > 0 {
			for _, ch := range changes.ParameterChanges {
				ProcessSlice(ctx, ch, t)
			}
		}

		if obj.Servers != nil && len(changes.ServerChanges) > 0 {
			for i := range obj.Servers {
				nCtx = context.WithValue(ctx, v3.Context, changes.ServerChanges[i])
				obj.Servers[i].Travel(nCtx, t)
			}
		}

		if obj.Security != nil && len(changes.SecurityRequirementChanges) > 0 {
			nCtx = context.WithValue(ctx, v3.Context, changes.SecurityRequirementChanges)
			PushChangesFromSlice(nCtx, obj, []*model.SecurityRequirementChanges{})
		}

		if changes.ExternalDocChanges != nil && obj.ExternalDocs != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ExternalDocChanges)
			PushChanges(ctx, obj, &model.ExternalDocChanges{})
		}

		if changes.RequestBodyChanges != nil && obj.RequestBody != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.RequestBodyChanges)
			obj.RequestBody.Travel(nCtx, t)
		}

		if changes.ResponsesChanges != nil && obj.Responses != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ResponsesChanges)
			obj.Responses.Travel(nCtx, t)
		}

	}
}
