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

}
