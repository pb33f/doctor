// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Info struct {
	Value   *base.Info
	Contact *Contact
	License *License
	Foundation
}

func (i *Info) Walk(ctx context.Context, info *base.Info) {

	i.Value = info
	i.PathSegment = "info"

	if info.Contact != nil {
		i.Contact = &Contact{Value: info.Contact}
		i.Contact.Parent = i
		i.Contact.Walk(ctx, info.Contact)
	}

	if info.License != nil {
		i.License = &License{Value: info.License}
		i.License.Parent = i
		i.License.Walk(ctx, info.License)
	}
}
