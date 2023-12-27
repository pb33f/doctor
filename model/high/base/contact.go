// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Contact struct {
	Value *base.Contact `json:"contact,omitempty" yaml:"contact,omitempty"`
	Foundation
}

func (c *Contact) Walk(_ context.Context, contact *base.Contact) {
	c.Value = contact
	c.PathSegment = "contact"
}
