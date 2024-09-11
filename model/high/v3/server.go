// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Server struct {
	Value     *v3.Server
	Variables *orderedmap.Map[string, *ServerVariable]
	base.Foundation
}

func (s *Server) Walk(ctx context.Context, server *v3.Server) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	s.Value = server
	s.PathSegment = "servers"
	s.BuildNodesAndEdgesWithArray(ctx, s.Value.URL, "server", server, s, false, 0, s.Index)

	if server.Variables != nil {
		s.Variables = orderedmap.New[string, *ServerVariable]()
		for serverVariablePairs := server.Variables.First(); serverVariablePairs != nil; serverVariablePairs = serverVariablePairs.Next() {
			k := serverVariablePairs.Key()
			v := serverVariablePairs.Value()
			sv := &ServerVariable{}
			sv.Parent = s
			wg.Go(func() { sv.Walk(ctx, v, k) })
			s.Variables.Set(k, sv)
		}
	}

	if server.GoLow().IsReference() {
		base.BuildReference(drCtx, server.GoLow())
	}

	drCtx.ObjectChan <- s
}

func (s *Server) GetValue() any {
	return s.Value
}

func (s *Server) GetSize() (height, width int) {
	width = base.WIDTH
	height = base.HEIGHT
	if s.Value.URL != "" {
		height += base.HEIGHT
		if len(s.Value.URL) > base.HEIGHT-10 {
			width += (len(s.Value.URL) - (base.HEIGHT - 10)) * 10
		}
	}
	if s.Variables != nil && s.Variables.Len() > 0 {
		height += base.HEIGHT
	}
	if s.Value.Extensions != nil && s.Value.Extensions.Len() > 0 {
		height += base.HEIGHT
	}
	return height, width
}
