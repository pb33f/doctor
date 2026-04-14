// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"crypto/md5"
	"encoding/hex"

	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) ensureDocumentCollectionNode(
	doc *v3.Document,
	path,
	label,
	nodeType string,
) *v3.Node {
	if doc == nil || doc.Node == nil {
		return nil
	}

	for _, child := range doc.Node.Children {
		if child != nil && child.Id == path {
			return child
		}
	}

	sum := md5.Sum([]byte(path))
	node := &v3.Node{
		Id:            path,
		IdHash:        hex.EncodeToString(sum[:]),
		ParentId:      doc.Node.Id,
		Type:          nodeType,
		Label:         label,
		Width:         170,
		Height:        v3.HEIGHT,
		IsArray:       true,
		ArrayIndex:    -1,
		RenderChanges: doc.Node.RenderChanges,
	}

	doc.Node.Children = append(doc.Node.Children, node)
	if t.Config != nil && t.Config.Doctor != nil {
		t.Config.Doctor.Nodes = append(t.Config.Doctor.Nodes, node)
		t.Config.Doctor.Edges = append(t.Config.Doctor.Edges, v3.GenerateEdge([]string{doc.Node.Id}, []string{node.Id}))
	}
	return node
}

func emitDocumentCollectionChanges(
	ctx context.Context,
	doc *v3.Document,
	node *v3.Node,
	changes *model.ServerChanges,
	changeType,
	changePath string,
) {
	if doc == nil || node == nil || changes == nil {
		return
	}

	for _, cj := range changes.GetPropertyChanges() {
		cj.Path = changePath
		cj.Type = changeType
	}

	aux := &v3.NodeChange{
		Id:         node.Id,
		IdHash:     node.IdHash,
		Type:       node.Type,
		Label:      node.Label,
		Path:       changePath,
		ArrayIndex: node.ArrayIndex,
	}
	aux.SetChanges(changes)

	node.Mutex.Lock()
	if len(node.Changes) == 0 {
		node.Height += v3.HEIGHT
	}
	node.Changes = append(node.Changes, aux)
	node.Mutex.Unlock()

	nChan := ctx.Value(NodeChannel)
	if nChan != nil {
		nChan.(chan *modelChange) <- &modelChange{
			model: doc,
			node:  node,
		}
	}
}

func (t *Changerator) VisitDocument(ctx context.Context, doc *v3.Document) {
	docChanges := ctx.Value(v3.Context).(*model.DocumentChanges)
	PushChanges(ctx, doc, &model.DocumentChanges{})
	if docChanges != nil && docChanges.InfoChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.InfoChanges)
		doc.Info.Travel(nCtx, t)
	}
	if docChanges != nil && len(docChanges.ServerChanges) > 0 {
		serversNode := t.ensureDocumentCollectionNode(doc, "$.servers", "Servers", "servers")
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ServerChanges)

		for _, sc := range docChanges.ServerChanges {
			handled := false

			if sc.Server != nil {
				hash := sc.Server.Hash()
				for _, server := range doc.Servers {
					if server.Value.GoLow().Hash() == hash {
						nCtx = context.WithValue(ctx, v3.Context, sc)
						server.Travel(nCtx, t)
						handled = true
					}
				}
			}

			if !handled {
				emitDocumentCollectionChanges(ctx, doc, serversNode, sc, "server", "$.servers")
			}
		}
	}
	if docChanges != nil && len(docChanges.TagChanges) > 0 {
		tagsContainerNode := func() *v3.Node {
			for _, tag := range doc.Tags {
				if tag != nil && tag.GetNodeParent() != nil && tag.GetNodeParent().GetNode() != nil {
					return tag.GetNodeParent().GetNode()
				}
			}
			return nil
		}
		for _, tc := range docChanges.TagChanges {

			// iterate through the tags and find the one that matches this tag
			for _, ch := range tc.GetAllChanges() {
				var tag *v3.Tag
				switch ch.ChangeType {
				case model.ObjectAdded:
					fallthrough
				case model.ObjectRemoved:
					tagsNode := tagsContainerNode()
					if tagsNode == nil {
						break
					}
					for _, cj := range tc.GetAllChanges() {
						cj.Path = "$.tags"
						cj.Type = "tags"
					}
					aux := &v3.NodeChange{
						Id:         tagsNode.Id,
						IdHash:     tagsNode.IdHash,
						Type:       tagsNode.Type,
						Label:      tagsNode.Label,
						Path:       "$.tags",
						ArrayIndex: tagsNode.ArrayIndex,
					}
					aux.SetChanges(tc)
					tagsNode.Mutex.Lock()
					if len(tagsNode.Changes) == 0 {
						tagsNode.Height += v3.HEIGHT
					}
					tagsNode.Changes = append(tagsNode.Changes, aux)
					tagsNode.Mutex.Unlock()
					nChan := ctx.Value(NodeChannel)
					if nChan != nil {
						nChan.(chan *modelChange) <- &modelChange{
							model: doc,
							node:  tagsNode,
						}
					}
					break
				case model.Modified:
					modifiedObject := ch.NewObject
					if modifiedObject != nil {
						if hashable, ok := modifiedObject.(low.Hashable); ok {
							hash := hashable.Hash()
							for _, tag = range doc.Tags {
								if tag.Value.GoLow().Hash() == hash {
									nCtx := context.WithValue(ctx, v3.Context, tc)
									tag.Travel(nCtx, t)
								}
							}
						} else {
							// iterate through all the tags, check if they have an extension of the same name
							for _, tag = range doc.Tags {
								if !tag.Value.Extensions.IsZero() {
									tagExt := tag.Value.Extensions.GetOrZero(ch.Property)
									if tagExt != nil {
										if tagExt == modifiedObject {
											nCtx := context.WithValue(ctx, v3.Context, tc)
											tag.Travel(nCtx, t)
										}
									}
								}
							}
						}
					}
					break
				default:
					break
				}
			}
		}
	}
	if docChanges != nil && len(docChanges.SecurityRequirementChanges) > 0 {
		if len(doc.Security) > 0 {
			for i := range docChanges.SecurityRequirementChanges {
				requirement := matchSecurityRequirementChange(doc.Security, docChanges.SecurityRequirementChanges[i], i)
				if requirement == nil {
					if i >= len(doc.Security) || doc.Security[i] == nil {
						continue
					}
					requirement = doc.Security[i]
				}
				nCtx := context.WithValue(ctx, v3.Context, docChanges.SecurityRequirementChanges[i])
				requirement.Travel(nCtx, t)
			}
		} else {
			nCtx := context.WithValue(ctx, v3.Context, docChanges.SecurityRequirementChanges)
			PushChangesFromSlice(nCtx, doc, []*model.SecurityRequirementChanges{}, "", "")
		}
	}
	if docChanges != nil && docChanges.PathsChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.PathsChanges)
		doc.Paths.Travel(nCtx, t)
	}
	if docChanges != nil && docChanges.ComponentsChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ComponentsChanges)
		doc.Components.Travel(nCtx, t)
	}
	if docChanges != nil && docChanges.ExternalDocChanges != nil {
		nCtx := context.WithValue(ctx, v3.Context, docChanges.ExternalDocChanges)
		doc.ExternalDocs.Travel(nCtx, t)
	}
	if docChanges != nil && docChanges.WebhookChanges != nil {
		ProcessMaps(ctx, docChanges.WebhookChanges, doc.Webhooks, t)
	}

	if docChanges != nil && docChanges.ExtensionChanges != nil {
		HandleExtensions(ctx, doc, docChanges.ExtensionChanges)
	}
	close(t.NodeChan)
}
