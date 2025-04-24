// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitOAuthFlows(ctx context.Context, obj *v3.OAuthFlows) {
	if changes, ok := ctx.Value(v3.Context).(*model.OAuthFlowsChanges); ok {
		PushChanges(ctx, obj, &model.OAuthFlowsChanges{})
		nCtx := ctx
		if changes.ImplicitChanges != nil && obj.Implicit != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ImplicitChanges)
			obj.Implicit.Travel(nCtx, t)
		}
		if changes.PasswordChanges != nil && obj.Password != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.PasswordChanges)
			obj.Password.Travel(nCtx, t)
		}
		if changes.AuthorizationCodeChanges != nil && obj.AuthorizationCode != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.AuthorizationCodeChanges)
			obj.AuthorizationCode.Travel(nCtx, t)
		}
		if changes.ClientCredentialsChanges != nil && obj.ClientCredentials != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ClientCredentialsChanges)
			obj.ClientCredentials.Travel(nCtx, t)
		}
		if changes != nil && changes.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.ExtensionChanges)
		}
	}
}
