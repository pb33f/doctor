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

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup
	l.BuildNodesAndEdges(ctx, l.Key, "link", link, l)

	if link.Server != nil {
		s := &Server{}
		s.Parent = l
		wg.Go(func() { s.Walk(ctx, link.Server) })
		l.Server = s
	}

	if link.GoLow().IsReference() {
		base.BuildReference(drCtx, link.GoLow())
	}

	drCtx.ObjectChan <- l
}

func (l *Link) GetValue() any {
	return l.Value
}

func (l *Link) GetSize() (height, width int) {
	width = base.WIDTH
	height = base.HEIGHT

	if l.Key != "" {
		if len(l.Key) > base.HEIGHT {
			width += (len(l.Key) - (base.HEIGHT)) * 15
		}
	}

	if l.Value.Parameters.Len() > 0 {
		height += base.HEIGHT
	}

	if l.Value.OperationRef != "" {
		height += base.HEIGHT
		if len(l.Value.OperationRef) > base.HEIGHT {
			width += (len(l.Value.OperationRef) - (base.HEIGHT)) * 20
		}
	}

	if l.Value.OperationId != "" {
		height += base.HEIGHT
		if len(l.Value.OperationId) > base.HEIGHT {
			width += (len(l.Value.OperationId) - (base.HEIGHT)) * 20
		}
	}

	if l.Value.Server != nil {
		height += base.HEIGHT
	}

	if l.Value.Extensions != nil && l.Value.Extensions.Len() > 0 {
		height += base.HEIGHT
	}

	return height, width
}
