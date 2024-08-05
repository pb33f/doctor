// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

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
