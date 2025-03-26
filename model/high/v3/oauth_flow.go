// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"golang.org/x/net/context"
)

type OAuthFlow struct {
	Value *v3.OAuthFlow
	Foundation
}

func (o *OAuthFlow) GetValue() any {
	return o.Value
}

func (o *OAuthFlow) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, o)
}
