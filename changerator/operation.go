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

		if changes == nil {
			return
		}

		// Split tag-related PropertyChanges from other operation PropertyChanges.
		// Tag changes are stored as generic PropertyChanges with Property == "tags".
		var tagChanges []*model.Change
		var nonTagChanges []*model.Change
		if changes.PropertyChanges != nil {
			for _, ch := range changes.GetPropertyChanges() {
				if ch.Property == "tags" {
					tagChanges = append(tagChanges, ch)
				} else {
					nonTagChanges = append(nonTagChanges, ch)
				}
			}
		}

		// Build a filtered OperationChanges with only non-tag PropertyChanges
		// and push that to the operation node. This prevents tag additions/removals
		// from appearing as operation-level changes.
		filteredChanges := &model.OperationChanges{
			PropertyChanges:            model.NewPropertyChanges(nonTagChanges),
			ExternalDocChanges:         changes.ExternalDocChanges,
			ParameterChanges:           changes.ParameterChanges,
			ResponsesChanges:           changes.ResponsesChanges,
			SecurityRequirementChanges: changes.SecurityRequirementChanges,
			RequestBodyChanges:         changes.RequestBodyChanges,
			ServerChanges:              changes.ServerChanges,
			ExtensionChanges:           changes.ExtensionChanges,
			CallbackChanges:            changes.CallbackChanges,
		}
		filteredCtx := context.WithValue(ctx, v3.Context, filteredChanges)
		PushChanges(filteredCtx, obj, &model.OperationChanges{})

		// Route tag changes to the Tags child node.
		if len(tagChanges) > 0 {
			// If the Tags child node doesn't exist (all tags removed on right side),
			// create a synthetic one. Walk-time helpers are not available here.
			if obj.Tags == nil && obj.GetNode() != nil {
				tagsFoundation := &v3.Foundation{}
				tagsFoundation.Parent = obj
				tagsFoundation.NodeParent = obj
				tagsFoundation.SetPathSegment("tags")

				opNode := obj.GetNode()
				nodeId := opNode.Id + "-tags"
				tagsNode := v3.NewSyntheticNode(nodeId, opNode.Id, "Tags", "tags")
				tagsFoundation.SetNode(tagsNode)

				opNode.Mutex.Lock()
				opNode.Children = append(opNode.Children, tagsNode)
				opNode.Mutex.Unlock()

				obj.Tags = tagsFoundation
			}

			// Push tag changes to the Tags child node using an OperationChanges
			// wrapper so it satisfies the Changed interface.
			tagOpChanges := &model.OperationChanges{
				PropertyChanges: model.NewPropertyChanges(tagChanges),
			}
			tagCtx := context.WithValue(ctx, v3.Context, tagOpChanges)
			PushChangesWithOverride(tagCtx, obj.Tags, tagOpChanges,
				"tags", obj.GenerateJSONPath()+".tags")

		}

		nCtx := ctx

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

		if len(changes.SecurityRequirementChanges) > 0 {
			if len(obj.Security) > 0 {
				for i := range changes.SecurityRequirementChanges {
					requirement := matchSecurityRequirementChange(obj.Security, changes.SecurityRequirementChanges[i])
					if requirement == nil {
						if i >= len(obj.Security) || obj.Security[i] == nil {
							continue
						}
						requirement = obj.Security[i]
					}
					nCtx = context.WithValue(ctx, v3.Context, changes.SecurityRequirementChanges[i])
					requirement.Travel(nCtx, t)
				}
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.SecurityRequirementChanges)
				PushChangesFromSlice(nCtx, obj, []*model.SecurityRequirementChanges{}, "", "")
			}
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
