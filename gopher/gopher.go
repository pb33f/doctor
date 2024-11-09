// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package gopher

import (
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi/index"
)

type Gopher struct {
	DrDocument *model.DrDocument
	config     *index.SpecIndexConfig
}

func NewGopher(drDoc *model.DrDocument) *Gopher {
	return &Gopher{
		DrDocument: drDoc,
		config:     drDoc.V3Document.Document.Index.GetConfig(),
	}
}

func (g *Gopher) CreateRolodexTree() *RolodexTree {
	rolodex := g.DrDocument.V3Document.Document.Rolodex
	return NewRolodexTree(rolodex)
}
