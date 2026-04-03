// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/utils"
	"github.com/pb33f/libopenapi/what-changed"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"reflect"
)

type nodePropertyChanges struct {
	changes []*wcModel.Change
}

func (n *nodePropertyChanges) GetAllChanges() []*wcModel.Change {
	return n.changes
}

func (n *nodePropertyChanges) TotalChanges() int {
	return len(n.changes)
}

func (n *nodePropertyChanges) TotalBreakingChanges() int {
	return wcModel.CountBreakingChanges(n.changes)
}

func (n *nodePropertyChanges) GetPropertyChanges() []*wcModel.Change {
	return n.changes
}

func (n *nodePropertyChanges) PropertiesOnly() {}

func nodeScopedChanges(ch what_changed.Changed) what_changed.Changed {
	if ch == nil {
		return nil
	}

	switch typed := any(ch).(type) {
	case *wcModel.SchemaChanges:
		if typed == nil || typed.PropertyChanges == nil {
			return &nodePropertyChanges{}
		}
		return &nodePropertyChanges{changes: typed.PropertyChanges.GetPropertyChanges()}
	default:
		ch.PropertiesOnly()
		return ch
	}
}

func handleChanges[N v3.Foundational](node *v3.Node, ch what_changed.Changed, mo N, nType, nPath string) *v3.NodeChange {
	var q any
	q = ch
	var aux *v3.NodeChange
	if q != nil && !reflect.ValueOf(q).IsNil() {
		nodeChanges := nodeScopedChanges(ch)
		if nodeChanges == nil {
			return nil
		}
		// flesh out the node path and type on the change.
		for _, c := range nodeChanges.GetPropertyChanges() {
			if nType != "" {
				c.Type = nType
			} else {
				c.Type = node.Type
			}
			if nPath != "" {
				c.Path = nPath
			} else {
				c.Path = mo.GenerateJSONPath()
			}
		}


		aux = &v3.NodeChange{
			Id:         node.Id,
			IdHash:     node.IdHash,
			Type:       node.Type,
			Path:       mo.GenerateJSONPath(),
			ArrayIndex: node.ArrayIndex,
		}
		aux.SetChanges(nodeChanges)
	}

	if aux != nil {
		// check if this node already has this change (seen when used as a reference)
		addChange := true
		for _, nch := range node.GetChanges() {
			for _, existing := range nch.GetPropertyChanges() {
				for _, candidate := range aux.GetPropertyChanges() {
					if existing.Path == candidate.Path &&
						existing.Type == candidate.Type &&
						existing.Property == candidate.Property &&
						existing.ChangeType == candidate.ChangeType {
					// found a match, so we can skip this change
						addChange = false
						break
					}
				}
				if !addChange {
					break
				}
			}
			if !addChange {
				break
			}
		}

		if addChange {
			node.AppendChange(aux.Changes)
			mo.AddChange(aux)
		}
	}
	var m interface{}
	m = mo
	if hs, kk := m.(v3.HasSize); kk {
		if !reflect.ValueOf(hs).IsNil() {
			h, w := hs.GetSize()
			if node.Height <= 0 {
				node.Height = h
			} else {
				if h > node.Height {
					node.Height = h
				}
			}
			if node.Width <= 0 {
				node.Width = w
			} else {
				if w > node.Width {
					node.Width = w
				}
			}
		}
	}
	return aux
}

func PushChangesWithOverride[N v3.Foundational, R what_changed.Changed](ctx context.Context, model N, y R, nType, nPath string) {

	if ch, ok := ctx.Value(v3.Context).(R); ok {
		nChan := ctx.Value(NodeChannel)
		if reflect.ValueOf(model).IsNil() {
			return
		}

		if model.GetNode() != nil {

			var node *v3.Node
			node = model.GetNode()
			handleChanges(node, ch, model, nType, nPath)

			if nChan != nil {
				nChan.(chan *modelChange) <- &modelChange{
					model: model,
					node:  node,
				}
			}
		} else {

			var q any
			q = model
			if wf, kq := q.(v3.HasValue); kq {
				if c, kk := wf.GetValue().(high.GoesLowUntyped); kk {
					gl := c.GoLowUntyped()
					if is, kp := gl.(low.IsReferenced); kp {
						if is.IsReference() {
							if nChan != nil {
								_, u := utils.ConvertComponentIdIntoFriendlyPathSearch(is.GetReference())
								nChan.(chan *modelChange) <- &modelChange{
									referenceJSONPath: u,
									model:             model,
									change:            ch,
								}
							}
						}
					}
				}
			}
		}
	}
}

func PushChanges[N v3.Foundational, R what_changed.Changed](ctx context.Context, model N, r R) {
	PushChangesWithOverride[N, R](ctx, model, r, "", "")
}

func PushChangesFromSlice[N v3.Foundational, T what_changed.Changed](ctx context.Context, model N, _ []T, nType, nPath string) {
	if ch, ok := ctx.Value(v3.Context).([]T); ok {

		nChan := ctx.Value(NodeChannel)
		var node *v3.Node
		if model.GetNode() != nil {
			node = model.GetNode()

			for _, change := range ch {
				handleChanges(node, change, model, nType, nPath)
			}

			if nChan != nil {

				nChan.(chan *modelChange) <- &modelChange{
					model: model,
					node:  node,
				}
			}

		} else {

			var q any
			q = model
			if wf, kq := q.(v3.HasValue); kq {
				if c, kk := wf.GetValue().(high.GoesLowUntyped); kk {
					gl := c.GoLowUntyped()
					if is, kp := gl.(low.IsReferenced); kp {
						if is.IsReference() {
							if nChan != nil {
								_, u := utils.ConvertComponentIdIntoFriendlyPathSearch(is.GetReference())
								for _, change := range ch {
									handleChanges(model.GetNodeParent().GetNode(), change, model, nType, nPath)
									nChan.(chan *modelChange) <- &modelChange{
										referenceJSONPath: u,
										model:             model,
										change:            change,
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

func ProcessSlice[C what_changed.Changed](ctx context.Context, ch C, t v3.Tardis) {
	travel := func(located []v3.Foundational, ch C) {
		for _, z := range located {
			nCtx := context.WithValue(ctx, v3.Context, ch)
			if tr, yy := z.(v3.Companion); yy {
				if tr != nil {
					tr.Travel(nCtx, t)
				}
			}
		}
	}
	processSlice := func(ch C) {
		// for each change, locate the object
		for _, x := range ch.GetAllChanges() {
			if x.NewObject != nil {
				if hrn, kk := x.NewObject.(low.HasRootNode); kk {
					located, err := t.GetDoctor().LocateModel(hrn.GetRootNode())
					if located != nil && err == nil {
						travel(located, ch)
					}
				}
				if hrn, kk := x.NewObject.(low.HasKeyNode); kk {
					located, err := t.GetDoctor().LocateModel(hrn.GetKeyNode())
					if located != nil && err == nil {
						travel(located, ch)
					}
				}
			}
		}
	}
	processSlice(ch)
}

func ProcessMaps[T any, R v3.Companion](ctx context.Context,
	changes map[string]*T, obj *orderedmap.Map[string, R], tardis v3.Tardis) {
	for ch, change := range changes {
		value := obj.GetOrZero(ch)
		companion, ok := interface{}(value).(v3.Companion)
		if !ok {
			continue
		}

		nCtx := context.WithValue(ctx, v3.Context, change)
		companion.Travel(nCtx, tardis)
	}
}
