// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
	"log/slog"
)

type ChangeratorConfig struct {
	RightDrDoc      *v3.Document
	LeftDrDoc       *v3.Document
	Doctor          *model.DrDocument
	DocumentChanges *whatChangedModel.DocumentChanges
	Logger          *slog.Logger
	RightDocContent []byte // Raw document content for context extraction
}
