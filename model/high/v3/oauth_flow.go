// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	"strings"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type OAuthFlow struct {
	Value *v3.OAuthFlow
	Foundation
}

func (o *OAuthFlow) Walk(ctx context.Context, flow *v3.OAuthFlow) {
	drCtx := GetDrContext(ctx)

	o.Value = flow
	o.BuildNodesAndEdges(ctx, humanizeOAuthFlowLabel(o.PathSegment), "oauthFlow", flow, o)
	drCtx.ObjectChan <- o
}

func humanizeOAuthFlowLabel(pathSegment string) string {
	switch pathSegment {
	case "clientCredentials":
		return "Client Credentials"
	case "authorizationCode":
		return "Authorization Code"
	case "":
		return "oAuth Flow"
	default:
		return strings.TrimSpace(titleString(pathSegment))
	}
}

func (o *OAuthFlow) GetValue() any {
	return o.Value
}

func (o *OAuthFlow) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, o)
}
