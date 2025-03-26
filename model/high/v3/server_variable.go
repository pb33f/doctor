// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type ServerVariable struct {
	Value *v3.ServerVariable
	Foundation
}

func (sv *ServerVariable) Walk(ctx context.Context, serverVariable *v3.ServerVariable, key string) {
	drCtx := GetDrContext(ctx)
	sv.Value = serverVariable
	sv.PathSegment = "variables"
	sv.Key = key
	drCtx.ObjectChan <- sv
}

func (sv *ServerVariable) GetValue() any {
	return sv.Value
}
