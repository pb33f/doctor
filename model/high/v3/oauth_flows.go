// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	drBase "github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type OAuthFlows struct {
	Value             *v3.OAuthFlows
	Implicit          *OAuthFlow
	Password          *OAuthFlow
	ClientCredentials *OAuthFlow
	AuthorizationCode *OAuthFlow
	base.Foundation
}

func (o *OAuthFlows) Walk(ctx context.Context, flows *v3.OAuthFlows) {
	o.Value = flows
	drCtx := drBase.GetDrContext(ctx)
	//o.BuildNodesAndEdges(ctx, "oAuthFlows")

	if flows.Implicit != nil {
		i := &OAuthFlow{}
		i.Parent = o
		i.PathSegment = "implicit"
		//i.BuildNodesAndEdges(ctx, "implicit")
		o.Implicit = i
		i.Value = flows.Implicit
		drCtx.ObjectChan <- i
	}

	if flows.Password != nil {
		p := &OAuthFlow{}
		p.Parent = o
		p.PathSegment = "password"
		//p.BuildNodesAndEdges(ctx, "password")
		o.Password = p
		p.Value = flows.Password
		drCtx.ObjectChan <- p
	}

	if flows.ClientCredentials != nil {
		c := &OAuthFlow{}
		c.Parent = o
		c.PathSegment = "clientCredentials"
		//c.BuildNodesAndEdges(ctx, "clientCredentials")
		o.ClientCredentials = c
		c.Value = flows.ClientCredentials
		drCtx.ObjectChan <- c
	}

	if flows.AuthorizationCode != nil {
		a := &OAuthFlow{}
		a.Parent = o
		a.PathSegment = "authorizationCode"
		//a.BuildNodesAndEdges(ctx, "authorizationCode")
		o.AuthorizationCode = a
		a.Value = flows.AuthorizationCode
		drCtx.ObjectChan <- a
	}
	drCtx.ObjectChan <- o

}

func (o *OAuthFlows) GetValue() any {
	return o.Value
}
