// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"context"
	"fmt"
	drBase "github.com/pb33f/doctor/model/high/base"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
)

type DrDocument struct {
	Schemas        []*drBase.Schema
	SkippedSchemas []*drBase.Schema
	V3Document     *drV3.Document
	seenSchemas    map[string]bool
	skippedSchemas map[string]bool
	index          *index.SpecIndex
	rolodex        *index.Rolodex
}

func NewDrDocument(index *index.SpecIndex, rolodex *index.Rolodex) *DrDocument {
	return &DrDocument{index: index, rolodex: rolodex}
}

func (w *DrDocument) WalkV3(doc *v3.Document) *drV3.Document {

	schemaChan := make(chan *drBase.Schema)
	skippedSchemaChan := make(chan *drBase.Schema)

	dctx := &drBase.DrContext{
		SchemaChan:        schemaChan,
		SkippedSchemaChan: skippedSchemaChan,
		Index:             w.index,
		Rolodex:           w.rolodex,
	}

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	var schemas []*drBase.Schema
	var skippedSchemas []*drBase.Schema
	w.skippedSchemas = make(map[string]bool)
	w.seenSchemas = make(map[string]bool)
	done := make(chan bool)
	complete := make(chan bool)
	go func(sChan chan *drBase.Schema, skippedChan chan *drBase.Schema, done chan bool) {
		for {
			select {
			case <-done:
				complete <- true
				return
			case schema := <-sChan:
				if schema != nil {
					if len(schema.Value.Type) == 0 {
						continue
					}
					key := fmt.Sprintf("%d:%d", schema.Value.GoLow().Type.KeyNode.Line,
						schema.Value.GoLow().Type.KeyNode.Column)
					if _, ok := w.seenSchemas[key]; !ok {
						schemas = append(schemas, schema)
						w.seenSchemas[key] = true
					}
				}
			case schema := <-skippedChan:
				if schema != nil {
					key := fmt.Sprintf("%d:%d", schema.Value.GoLow().Type.KeyNode.Line,
						schema.Value.GoLow().Type.KeyNode.Column)

					if _, ok := w.skippedSchemas[key]; !ok {
						skippedSchemas = append(skippedSchemas, schema)
						w.skippedSchemas[key] = true
					}
				}
			}

		}
	}(schemaChan, skippedSchemaChan, done)
	drDoc := &drV3.Document{}
	drDoc.Walk(drCtx, doc)
	done <- true
	<-complete
	w.Schemas = schemas
	w.SkippedSchemas = skippedSchemas
	w.V3Document = drDoc
	return drDoc
}
