// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitPathItem(ctx context.Context, obj *v3.PathItem) {
	if changes, ok := ctx.Value(v3.Context).(*model.PathItemChanges); ok {
		PushChanges(ctx, obj, &model.PathItemChanges{})
		nCtx := ctx
		checkOperation := func(op *v3.Operation, changes what_changed.Changed) {
			if op != nil && changes != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes)
				op.Travel(nCtx, t)
			}
		}
		if obj.Servers != nil && len(changes.ServerChanges) > 0 {
			for i := range obj.Servers {
				nCtx = context.WithValue(ctx, v3.Context, changes.ServerChanges[i])
				obj.Servers[i].Travel(nCtx, t)
			}
		}
		if len(changes.ParameterChanges) > 0 {
			for _, ch := range changes.ParameterChanges {
				ProcessSlice(ctx, ch, t)
			}
		}

		if obj.Value.Extensions != nil && obj.Value.Extensions.Len() > 0 {
			if changes.ExtensionChanges != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.ExtensionChanges)
				PushChangesWithOverride(nCtx, obj, &model.ExtensionChanges{}, "extension", "")
			}
		}

		checkOperation(obj.Get, changes.GetChanges)
		checkOperation(obj.Put, changes.PutChanges)
		checkOperation(obj.Post, changes.PostChanges)
		checkOperation(obj.Patch, changes.PatchChanges)
		checkOperation(obj.Head, changes.HeadChanges)
		checkOperation(obj.Options, changes.OptionsChanges)
		checkOperation(obj.Trace, changes.TraceChanges)
		checkOperation(obj.Delete, changes.DeleteChanges)
	}
}
