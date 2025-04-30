// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type Link struct {
	Value  *v3.Link
	Server *Server
	Foundation
}

func (l *Link) Walk(ctx context.Context, link *v3.Link) {

	l.Value = link
	l.PathSegment = "links"

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup
	l.BuildNodesAndEdges(ctx, l.Key, "link", link, l)

	if link.Server != nil {
		s := &Server{}
		s.Parent = l
		wg.Go(func() { s.Walk(ctx, link.Server) })
		l.Server = s
	}

	if link.GoLow().IsReference() {
		BuildReference(drCtx, link.GoLow())
	}

	drCtx.ObjectChan <- l
}

func (l *Link) GetValue() any {
	return l.Value
}

func (l *Link) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if l.Key != "" {
		if len(l.Key) > HEIGHT {
			width += (len(l.Key) - (HEIGHT)) * 15
		}
	}

	if l.Value.Parameters.Len() > 0 {
		height += HEIGHT
	}

	if l.Value.OperationRef != "" {
		height += HEIGHT
		if len(l.Value.OperationRef) > HEIGHT {
			width += (len(l.Value.OperationRef) - (HEIGHT)) * 20
		}
	}

	if l.Value.OperationId != "" {
		height += HEIGHT
		if len(l.Value.OperationId) > HEIGHT {
			width += (len(l.Value.OperationId) - (HEIGHT)) * 20
		}
	}

	if l.Value.Server != nil {
		height += HEIGHT
	}

	if l.Value.Extensions != nil && l.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range l.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (l *Link) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, l)
}
