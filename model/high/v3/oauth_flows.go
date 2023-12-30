// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
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

func (o *OAuthFlows) Walk(_ context.Context, flows *v3.OAuthFlows) {
	o.Value = flows

	if flows.Implicit != nil {
		i := &OAuthFlow{}
		i.Parent = o
		i.PathSegment = "implicit"
		o.Implicit = i
	}

	if flows.Password != nil {
		p := &OAuthFlow{}
		p.Parent = o
		p.PathSegment = "password"
		o.Password = p
	}

	if flows.ClientCredentials != nil {
		c := &OAuthFlow{}
		c.Parent = o
		c.PathSegment = "clientCredentials"
		o.ClientCredentials = c
	}

	if flows.AuthorizationCode != nil {
		a := &OAuthFlow{}
		a.Parent = o
		a.PathSegment = "authorizationCode"
		o.AuthorizationCode = a
	}

}
