// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
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

		for _, sc := range docChanges.ServerChanges {

			// iterate through the servers and find the one that matches this server
			for _, ch := range sc.GetAllChanges() {
				var server *v3.Server

				visit := func() {
					modifiedObject := ch.NewObject
					originalObject := ch.OriginalObject
					if modifiedObject != nil {

						hash := sc.Server.Hash()
						seen := false
						for _, server = range doc.Servers {
							if server.Value.GoLow().Hash() == hash {
								nCtx = context.WithValue(ctx, v3.Context, sc)
								server.Travel(nCtx, t)
								seen = true
							}
						}
						if !seen {
							// do the same for the original object
							if originalObject != nil {

								hash = sc.Server.Hash()
								for _, server = range doc.Servers {
									if server.Value.GoLow().Hash() == hash {
										nCtx = context.WithValue(ctx, v3.Context, sc)
										server.Travel(nCtx, t)
									}
								}

							}
						}

					}
				}

				switch ch.ChangeType {
				case model.Modified:
					visit()
				case model.PropertyAdded:
					visit()
				case model.PropertyRemoved:
					visit()
				default:

					docModelNode := doc.Node
					for _, cj := range sc.GetPropertyChanges() {
						cj.Path = "$.servers"
						cj.Type = "server"
					}
					aux := &v3.NodeChange{
						Id:         docModelNode.Id,
						IdHash:     docModelNode.IdHash,
						Type:       docModelNode.Type,
						Label:      docModelNode.Label,
						Path:       "$.tags",
						ArrayIndex: -1,
						Changes:    sc,
					}
					docModelNode.Changes = append(docModelNode.Changes, aux)
					nChan := ctx.Value(NodeChannel)
					if nChan != nil {
						nChan.(chan *modelChange) <- &modelChange{
							model: doc,
							node:  docModelNode,
						}
					}
					break
				}
			}
		}
		//
		//PushChangesFromSlice(nCtx, doc, []*model.ServerChanges{}, "", "")
	}
	if doc.Tags != nil && len(docChanges.TagChanges) > 0 {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.TagChanges)
		for _, tc := range docChanges.TagChanges {

			// iterate through the tags and find the one that matches this tag
			for _, ch := range tc.GetAllChanges() {
				var tag *v3.Tag
				switch ch.ChangeType {
				case model.Modified:
					modifiedObject := ch.NewObject
					if modifiedObject != nil {
						if hashable, ok := modifiedObject.(low.Hashable); ok {
							hash := hashable.Hash()
							for _, tag = range doc.Tags {
								if tag.Value.GoLow().Hash() == hash {
									nCtx = context.WithValue(ctx, v3.Context, tc)
									tag.Travel(nCtx, t)
								}
							}
						}
					}
					break
				default:

					docModelNode := doc.Node
					for _, cj := range tc.GetPropertyChanges() {
						cj.Path = "$.tags"
						cj.Type = "tag"
					}
					aux := &v3.NodeChange{
						Id:         docModelNode.Id,
						IdHash:     docModelNode.IdHash,
						Type:       docModelNode.Type,
						Label:      docModelNode.Label,
						Path:       "$.tags",
						ArrayIndex: -1,
						Changes:    tc,
					}
					docModelNode.Changes = append(docModelNode.Changes, aux)
					nChan := ctx.Value(NodeChannel)
					if nChan != nil {
						nChan.(chan *modelChange) <- &modelChange{
							model: doc,
							node:  docModelNode,
						}
					}
					break
				}
			}
		}
	}
	if doc.Security != nil && len(docChanges.SecurityRequirementChanges) > 0 {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.SecurityRequirementChanges)
		PushChangesFromSlice(nCtx, doc, []*model.SecurityRequirementChanges{}, "", "")
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
