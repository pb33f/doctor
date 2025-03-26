// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitDocument(ctx context.Context, doc *v3.Document) {
	docChanges := ctx.Value(v3.Context).(*model.DocumentChanges)
	PushChanges(ctx, doc, &model.DocumentChanges{})
	if doc.Info != nil && docChanges.InfoChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.InfoChanges)
		doc.Info.Travel(nCtx, t)
	}
	if doc.Servers != nil && len(docChanges.ServerChanges) > 0 {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ServerChanges)
		PushChangesFromSlice(nCtx, doc, []*model.ServerChanges{})
	}
	if doc.Tags != nil && len(docChanges.TagChanges) > 0 {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.TagChanges)
		PushChangesFromSlice(nCtx, doc, []*model.TagChanges{})
	}
	if doc.Security != nil && len(docChanges.SecurityRequirementChanges) > 0 {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.SecurityRequirementChanges)
		PushChangesFromSlice(nCtx, doc, []*model.SecurityRequirementChanges{})
	}
	if doc.Paths != nil && docChanges.PathsChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.PathsChanges)
		doc.Paths.Travel(nCtx, t)
	}
	if doc.Components != nil && docChanges.ComponentsChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ComponentsChanges)
		doc.Components.Travel(nCtx, t)
	}
	if doc.ExternalDocs != nil && docChanges.ExternalDocChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ExternalDocChanges)
		doc.ExternalDocs.Travel(nCtx, t)
	}
	if doc.Webhooks != nil && doc.Webhooks.Len() > 0 && docChanges.WebhookChanges != nil {
		ProcessMaps(ctx, docChanges.WebhookChanges, doc.Webhooks, t)
	}
	close(t.NodeChan)
}
