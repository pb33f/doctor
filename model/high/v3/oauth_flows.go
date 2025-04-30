// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type OAuthFlows struct {
	Value             *v3.OAuthFlows
	Implicit          *OAuthFlow
	Password          *OAuthFlow
	ClientCredentials *OAuthFlow
	AuthorizationCode *OAuthFlow
	Foundation
}

func (o *OAuthFlows) Walk(ctx context.Context, flows *v3.OAuthFlows) {
	o.Value = flows
	drCtx := GetDrContext(ctx)

	if flows.Implicit != nil {
		i := &OAuthFlow{}
		i.Parent = o
		i.PathSegment = "implicit"
		o.Implicit = i
		i.Value = flows.Implicit
		drCtx.ObjectChan <- i
	}

	if flows.Password != nil {
		p := &OAuthFlow{}
		p.Parent = o
		p.PathSegment = "password"
		o.Password = p
		p.Value = flows.Password
		drCtx.ObjectChan <- p
	}

	if flows.ClientCredentials != nil {
		c := &OAuthFlow{}
		c.Parent = o
		c.PathSegment = "clientCredentials"
		o.ClientCredentials = c
		c.Value = flows.ClientCredentials
		drCtx.ObjectChan <- c
	}

	if flows.AuthorizationCode != nil {
		a := &OAuthFlow{}
		a.Parent = o
		a.PathSegment = "authorizationCode"
		o.AuthorizationCode = a
		a.Value = flows.AuthorizationCode
		drCtx.ObjectChan <- a
	}
	drCtx.ObjectChan <- o

}

func (o *OAuthFlows) GetValue() any {
	return o.Value
}

func (o *OAuthFlows) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, o)
}
