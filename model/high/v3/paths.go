// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Paths struct {
	Value     *v3.Paths
	PathItems *orderedmap.Map[string, *PathItem]
	base.Foundation
}

func (p *Paths) Walk(ctx context.Context, paths *v3.Paths) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	p.Value = paths
	p.PathSegment = "paths"

	if paths.PathItems != nil {
		p.PathItems = orderedmap.New[string, *PathItem]()
		for pathItemPairs := paths.PathItems.First(); pathItemPairs != nil; pathItemPairs = pathItemPairs.Next() {
			k := pathItemPairs.Key()
			v := pathItemPairs.Value()
			pi := &PathItem{}
			pi.Parent = p
			pi.Key = k
			wg.Go(func() { pi.Walk(ctx, v) })
			p.PathItems.Set(k, pi)
		}
	}
}
