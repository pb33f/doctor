// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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
	sv.KeyNode = serverVariable.GoLow().KeyNode
	sv.BuildNodesAndEdges(ctx, cases.Title(language.English).String(sv.PathSegment), sv.PathSegment, serverVariable, sv)
	drCtx.ObjectChan <- sv
}

func (sv *ServerVariable) GetValue() any {
	return sv.Value
}

func (sv *ServerVariable) Travel(ctx context.Context, traveler Tardis) {
	traveler.Visit(ctx, sv)
}
