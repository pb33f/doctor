// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"fmt"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitServer(ctx context.Context, obj *v3.Server) {
	if changes, ok := ctx.Value(v3.Context).(*model.ServerChanges); ok {
		PushChanges(ctx, obj, &model.ServerChanges{})
		nCtx := ctx
		if obj.Variables != nil && obj.Variables.Len() > 0 {
			if changes != nil && changes.ServerVariableChanges != nil {
				for _, change := range changes.ServerVariableChanges {
					nCtx = context.WithValue(ctx, v3.Context, change)
					PushChangesWithOverride(nCtx, obj, &model.ServerVariableChanges{}, "serverVariable", fmt.Sprintf("%s.variables", obj.GenerateJSONPath()))
				}
			}
		}
	}
}
