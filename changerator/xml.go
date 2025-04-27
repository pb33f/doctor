// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func (t *Changerator) VisitXML(ctx context.Context, obj *v3.XML) {
	if changes, ok := ctx.Value(v3.Context).(*model.SchemaChanges); ok {
		nCtx := context.WithValue(ctx, v3.Context, changes.XMLChanges)
		PushChanges(nCtx, obj, &model.XMLChanges{})
		if changes != nil && changes.XMLChanges.ExtensionChanges != nil {
			HandleExtensions(ctx, obj, changes.XMLChanges.ExtensionChanges)
		}
	}
}
