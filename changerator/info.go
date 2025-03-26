// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitInfo(ctx context.Context, obj *v3.Info) {
	if changes, ok := ctx.Value(v3.Context).(*model.InfoChanges); ok {
		PushChanges(ctx, obj, &model.InfoChanges{})
		nCtx := ctx
		if obj.Contact != nil {
			if changes != nil && changes.ContactChanges != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.ContactChanges)
			}
			obj.Contact.Travel(nCtx, t)
		}
		if obj.License != nil {
			if changes != nil && changes.LicenseChanges != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.LicenseChanges)
			}
			obj.License.Travel(nCtx, t)
		}
	}
}
