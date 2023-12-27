// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
    "context"
    "github.com/pb33f/doctor/model/high/base"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type Link struct {
    Value  *v3.Link
    Server *Server
    base.Foundation
}

func (l *Link) Walk(ctx context.Context, link *v3.Link) {

    l.Value = link
    l.PathSegment = "links"

    if link.Server != nil {
        s := &Server{}
        s.Parent = l
        s.Walk(ctx, link.Server)
        l.Server = s
    }
}
