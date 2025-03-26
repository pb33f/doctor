// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	libopenapibase "github.com/pb33f/libopenapi/datamodel/high/base"
)

type Tag struct {
	Value        *libopenapibase.Tag
	ExternalDocs *ExternalDoc
	Foundation
}

func (t *Tag) Walk(ctx context.Context, tag *libopenapibase.Tag) {
	t.Value = tag
	drCtx := GetDrContext(ctx)

	if tag.ExternalDocs != nil {
		ed := &ExternalDoc{}
		ed.Parent = t
		ed.ValueNode = ExtractValueNodeForLowModel(tag.GoLow().ExternalDocs)
		ed.KeyNode = ExtractKeyNodeForLowModel(tag.GoLow().ExternalDocs)
		ed.PathSegment = "externalDocs"
		ed.Value = tag.ExternalDocs
		t.ExternalDocs = ed
		drCtx.ObjectChan <- ed
	}
	drCtx.ObjectChan <- t
}

func (t *Tag) GetValue() any {
	return t.Value
}

func (t *Tag) GetSize() (height, width int) {
	width = WIDTH - 75
	height = HEIGHT
	if t.Value.Name != "" {
		height += HEIGHT
		if len(t.Value.Name) > HEIGHT {
			width += (len(t.Value.Name) - HEIGHT) * 10
		}
	}
	if t.Value.Extensions != nil && t.Value.Extensions.Len() > 0 {
		height += HEIGHT
		if width < 170 {
			width = 170
		}
	}
	return height, width
}

func (t *Tag) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, t)
}
