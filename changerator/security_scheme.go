// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitSecurityScheme(ctx context.Context, obj *v3.SecurityScheme) {
	if changes, ok := ctx.Value(v3.Context).(*model.SecuritySchemeChanges); ok {
		PushChanges(ctx, obj, &model.SecuritySchemeChanges{})
		if changes.ScopesChanges != nil && obj.Flows != nil {
			nCtx := context.WithValue(ctx, v3.Context, changes.OAuthFlowChanges)
			obj.Flows.Travel(nCtx, t)
		}
	}
}
