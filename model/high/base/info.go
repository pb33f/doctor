// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type Info struct {
	Value   *base.Info
	Contact *Contact
	License *License
	Foundation
}

func (i *Info) Walk(ctx context.Context, info *base.Info) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	i.Value = info
	i.PathSegment = "info"
	i.BuildNodesAndEdges(ctx, cases.Title(language.English).String(i.PathSegment), i.PathSegment, info, i)

	if info.Contact != nil {
		i.Contact = &Contact{Value: info.Contact}
		i.Contact.Parent = i
		i.Contact.NodeParent = i
		wg.Go(func() { i.Contact.Walk(ctx, info.Contact) })
	}

	if info.License != nil {
		i.License = &License{Value: info.License}
		i.License.Parent = i
		i.License.NodeParent = i
		wg.Go(func() { i.License.Walk(ctx, info.License) })
	}

	drCtx.ObjectChan <- i
}

func (i *Info) GetValue() any {
	return i.Value
}
