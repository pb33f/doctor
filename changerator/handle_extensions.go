// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"golang.org/x/net/context"
)

func HandleExtensions(ctx context.Context, v v3.Foundational, changes *model.ExtensionChanges) {
	if v != nil && changes != nil {
		nCtx := context.WithValue(ctx, v3.Context, changes)
		PushChangesWithOverride(nCtx, v, &model.ExtensionChanges{}, "extension", "")
	}
}
