// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Paths struct {
	Value     *v3.Paths
	PathItems *orderedmap.Map[string, *PathItem]
	Foundation
}

func (p *Paths) Walk(ctx context.Context, paths *v3.Paths) {

	drCtx := GetDrContext(ctx)
	//wg := drCtx.WaitGroup

	p.Value = paths
	p.SetPathSegment("paths")
	negOne := -1

	p.BuildNodesAndEdgesWithArray(ctx, titleString(p.PathSegment),
		p.PathSegment, paths, p, false, paths.PathItems.Len(), &negOne)

	if paths.PathItems != nil {
		p.PathItems = orderedmap.New[string, *PathItem]()
		lowPathItemsFinder := newLowNodeFinder(paths.GoLow().PathItems)
		for pathItemPairs := paths.PathItems.First(); pathItemPairs != nil; pathItemPairs = pathItemPairs.Next() {
			k := pathItemPairs.Key()
			v := pathItemPairs.Value()
			pi := &PathItem{}

			if keyNode, valueNode, ok := lowPathItemsFinder.find(k); ok {
				pi.KeyNode = keyNode
				pi.ValueNode = valueNode
			}
			pi.Parent = p
			pi.NodeParent = p
			pi.Key = k
			//wg.Go(func() {
			pi.Walk(ctx, v)
			//})
			p.PathItems.Set(k, pi)
		}
	}

	if paths.GoLow().IsReference() {
		BuildReference(drCtx, paths.GoLow())
	}

	drCtx.ObjectChan <- p
}

func (p *Paths) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if p.Value.Extensions != nil && p.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range p.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (p *Paths) GetValue() any {
	return p.Value
}

func (p *Paths) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, p)
}
