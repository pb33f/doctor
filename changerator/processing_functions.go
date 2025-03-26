// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/what-changed"
)

func PushChanges[N v3.Foundational, R what_changed.Changed](ctx context.Context, model N, _ R) {
	if ch, ok := ctx.Value(v3.Context).(R); ok {
		var aux *v3.NodeChange
		if model.GetNode() != nil {
			ch.PropertiesOnly()
			aux = &v3.NodeChange{
				Id:         model.GetNode().Id,
				IdHash:     model.GetNode().IdHash,
				Type:       model.GetNode().Type,
				Label:      model.GetNode().Label,
				ArrayIndex: model.GetNode().ArrayIndex,
				Changes:    ch,
			}

			model.GetNode().Changes = aux
			nChan := ctx.Value(NodeChannel)
			if nChan != nil {
				nChan.(chan *v3.Node) <- model.GetNode()
			}
		}
		model.AddChange(aux)

	}
}

func PushChangesFromSlice[N v3.Foundational, T what_changed.Changed](ctx context.Context, model N, _ []T) {
	if ch, ok := ctx.Value(v3.Context).([]T); ok {
		var aux *v3.NodeChange
		if node := model.GetNode(); node != nil {
			for _, change := range ch {
				change.PropertiesOnly()
				aux = &v3.NodeChange{
					Id:         model.GetNode().Id,
					IdHash:     model.GetNode().IdHash,
					Type:       model.GetNode().Type,
					Label:      model.GetNode().Label,
					ArrayIndex: model.GetNode().ArrayIndex,
					Changes:    change,
				}

				node.Changes = aux
			}
			nChan := ctx.Value(NodeChannel)
			if nChan != nil {
				nChan.(chan *v3.Node) <- model.GetNode()
			}
		}

		for _, change := range ch {
			change.PropertiesOnly()
			aux = &v3.NodeChange{
				Id:         model.GetNode().Id,
				IdHash:     model.GetNode().IdHash,
				Type:       model.GetNode().Type,
				Label:      model.GetNode().Label,
				ArrayIndex: model.GetNode().ArrayIndex,
				Changes:    change,
			}

			model.AddChange(aux)
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
