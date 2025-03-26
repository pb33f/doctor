// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type License struct {
	Value *base.License
	Foundation
}

func (l *License) Walk(ctx context.Context, license *base.License) {
	drCtx := GetDrContext(ctx)
	l.PathSegment = "license"
	l.Value = license
	l.ValueNode = license.GoLow().RootNode
	l.KeyNode = license.GoLow().KeyNode
	l.BuildNodesAndEdges(ctx, cases.Title(language.English).String(l.PathSegment), l.PathSegment, license, l)
	drCtx.ObjectChan <- l
}

func (l *License) GetValue() any {
	return l.Value
}

func (l *License) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT
	if l.Value.Identifier != "" || l.Value.URL != "" {
		height += HEIGHT
	}
	if l.Value.Extensions != nil && l.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}
	return height, width
}

func (l *License) Travel(ctx context.Context, traveller Tardis) {
	traveller.Visit(ctx, l)
}
