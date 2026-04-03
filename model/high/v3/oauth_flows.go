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
	Device            *OAuthFlow
	Foundation
}

func (o *OAuthFlows) Walk(ctx context.Context, flows *v3.OAuthFlows) {
	o.Value = flows
	drCtx := GetDrContext(ctx)
	o.BuildNodesAndEdges(ctx, "oAuth Flows", "oauthFlows", flows, o)

	if flows.Implicit != nil {
		i := &OAuthFlow{}
		i.Parent = o
		i.NodeParent = o
		i.SetPathSegment("implicit")
		o.Implicit = i
		i.Value = flows.Implicit
		drCtx.RunWalk(func() { i.Walk(ctx, flows.Implicit) })
	}

	if flows.Password != nil {
		p := &OAuthFlow{}
		p.Parent = o
		p.NodeParent = o
		p.SetPathSegment("password")
		o.Password = p
		p.Value = flows.Password
		drCtx.RunWalk(func() { p.Walk(ctx, flows.Password) })
	}

	if flows.ClientCredentials != nil {
		c := &OAuthFlow{}
		c.Parent = o
		c.NodeParent = o
		c.SetPathSegment("clientCredentials")
		o.ClientCredentials = c
		c.Value = flows.ClientCredentials
		drCtx.RunWalk(func() { c.Walk(ctx, flows.ClientCredentials) })
	}

	if flows.AuthorizationCode != nil {
		a := &OAuthFlow{}
		a.Parent = o
		a.NodeParent = o
		a.SetPathSegment("authorizationCode")
		o.AuthorizationCode = a
		a.Value = flows.AuthorizationCode
		drCtx.RunWalk(func() { a.Walk(ctx, flows.AuthorizationCode) })
	}

	if flows.Device != nil {
		d := &OAuthFlow{}
		d.Parent = o
		d.NodeParent = o
		d.SetPathSegment("device")
		o.Device = d
		d.Value = flows.Device
		drCtx.RunWalk(func() { d.Walk(ctx, flows.Device) })
	}
	drCtx.ObjectChan <- o

}

func (o *OAuthFlows) GetValue() any {
	return o.Value
}

func (o *OAuthFlows) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, o)
}
