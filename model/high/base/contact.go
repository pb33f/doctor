// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

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
	c.Value = contact
	c.PathSegment = "contact"
	c.ValueNode = contact.GoLow().RootNode
	c.KeyNode = contact.GoLow().KeyNode
	c.BuildNodesAndEdges(ctx, cases.Title(language.English).String(c.PathSegment), c.PathSegment, contact, c)
}

func (c *Contact) GetValue() any {
	return c.Value
}
