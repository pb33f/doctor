// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

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

	i.Value = info
	i.SetPathSegment("info")
	i.BuildNodesAndEdges(ctx, cases.Title(language.English).String(i.PathSegment), i.PathSegment, info, i)

	if info.Contact != nil {
		i.Contact = &Contact{Value: info.Contact}
		i.Contact.Parent = i
		i.Contact.NodeParent = i
		drCtx.RunOrGo(func() { i.Contact.Walk(ctx, info.Contact) })
	}

	if info.License != nil {
		i.License = &License{Value: info.License}
		i.License.Parent = i
		i.License.NodeParent = i
		drCtx.RunOrGo(func() { i.License.Walk(ctx, info.License) })
	}

	drCtx.ObjectChan <- i
}

func (i *Info) GetValue() any {
	return i.Value
}

func (i *Info) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT
	if i.Value.Version != "" {
		height += HEIGHT
	}
	if i.Value.Title != "" {
		height += HEIGHT
		if len(i.Value.Title) > (HEIGHT - 10) {
			width += (len(i.Value.Title) - (HEIGHT - 10)) * 10
		}
	}
	if i.Value.Extensions != nil && i.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range i.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (i *Info) Travel(ctx context.Context, traveller Tardis) {
	traveller.Visit(ctx, i)
}
