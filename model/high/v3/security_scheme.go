// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type SecurityScheme struct {
	Value *v3.SecurityScheme
	Flows *OAuthFlows
	Foundation
}

func (s *SecurityScheme) Walk(ctx context.Context, securityScheme *v3.SecurityScheme) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	s.Value = securityScheme
	s.SetPathSegment("securitySchemes")
	s.BuildNodesAndEdges(ctx, s.Key, "securityScheme", securityScheme, s)

	if securityScheme.Flows != nil {
		f := &OAuthFlows{}
		f.Parent = s
		f.SetPathSegment("flows")
		wg.Go(func() { f.Walk(ctx, securityScheme.Flows) })
		s.Flows = f
	}
	drCtx.ObjectChan <- s
}

func (s *SecurityScheme) GetValue() any {
	return s.Value
}

func (s *SecurityScheme) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT * 2

	if s.Value.Name != "" {
		if len(s.Value.Name) > HEIGHT {
			width += (len(s.Value.Name) - HEIGHT) * 10
		}
	}

	if s.Value.Flows != nil {
		height += HEIGHT
	}

	if s.Value.Extensions != nil && s.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	return height, width
}

func (s *SecurityScheme) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, s)
}
