// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type Contact struct {
	Value *base.Contact `json:"contact,omitempty" yaml:"contact,omitempty"`
	Foundation
}

func (c *Contact) Walk(ctx context.Context, contact *base.Contact) {
	drCtx := GetDrContext(ctx)
	c.Value = contact
	c.PathSegment = "contact"
	c.ValueNode = contact.GoLow().RootNode
	c.KeyNode = contact.GoLow().KeyNode
	c.BuildNodesAndEdges(ctx, cases.Title(language.English).String(c.PathSegment), c.PathSegment, contact, c)

	if contact.GoLow().IsReference() {
		BuildReference(drCtx, contact.GoLow())
	}
	drCtx.ObjectChan <- c
}

func (c *Contact) GetValue() any {
	return c.Value
}

func (c *Contact) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT
	if c.Value.Name != "" {
		height += HEIGHT
		if len(c.Value.Name) > HEIGHT {
			width += (len(c.Value.Name) - HEIGHT) * 10
		}
	}
	if c.Value.Extensions != nil && c.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}
	return height, width
}

func (c *Contact) Travel(ctx context.Context, traveler Tardis) {
	traveler.Visit(ctx, c)
}
