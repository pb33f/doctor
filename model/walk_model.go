// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

// If you wish to use this code in a competitive or commercial product, please contact sales@pb33f.io

package model

import (
	"context"
	"fmt"
	drBase "github.com/pb33f/doctor/model/high/base"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"sort"
)

// DrDocument is a turbo charged version of the libopenapi Document struct. The doctor
// provides a much more powerful way to navigate an OpenAPI document.
//
// The doctor is the library we wanted all along.
type DrDocument struct {
	BuildErrors    []*drBase.BuildError
	Schemas        []*drBase.Schema
	SkippedSchemas []*drBase.Schema
	Parameters     []*drV3.Parameter
	V3Document     *drV3.Document
	seenSchemas    map[string]bool
	seenParameters map[string]bool
	skippedSchemas map[string]bool
	index          *index.SpecIndex
	rolodex        *index.Rolodex
}

func NewDrDocument(index *index.SpecIndex, rolodex *index.Rolodex) *DrDocument {
	return &DrDocument{index: index, rolodex: rolodex}
}

func (w *DrDocument) WalkV3(doc *v3.Document) *drV3.Document {

	schemaChan := make(chan *drBase.WalkedSchema)
	skippedSchemaChan := make(chan *drBase.WalkedSchema)
	parameterChan := make(chan *drBase.WalkedParam)
	buildErrorChan := make(chan *drBase.BuildError)

	dctx := &drBase.DrContext{
		SchemaChan:        schemaChan,
		SkippedSchemaChan: skippedSchemaChan,
		ParameterChan:     parameterChan,
		Index:             w.index,
		Rolodex:           w.rolodex,
		WaitGroup:         &conc.WaitGroup{},
		ErrorChan:         buildErrorChan,
	}

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	var schemas []*drBase.Schema
	var skippedSchemas []*drBase.Schema
	var parameters []*drV3.Parameter
	var buildErrors []*drBase.BuildError
	w.skippedSchemas = make(map[string]bool)
	w.seenSchemas = make(map[string]bool)
	w.seenParameters = make(map[string]bool)

	done := make(chan bool)
	complete := make(chan bool)
	go func(sChan chan *drBase.WalkedSchema, skippedChan chan *drBase.WalkedSchema, done chan bool) {
		for {
			select {
			case <-done:
				complete <- true
				return
			case s := <-sChan:
				if s != nil {
					if s.Schema.Value != nil && len(s.Schema.Value.Type) == 0 {
						continue
					}

					key := fmt.Sprintf("%d:%d", s.SchemaNode.Line,
						s.SchemaNode.Column)

					if _, ok := w.seenSchemas[key]; !ok {
						schemas = append(schemas, s.Schema)
						w.seenSchemas[key] = true
					}
				}
			case schema := <-skippedChan:
				if schema != nil {
					key := fmt.Sprintf("%d:%d", schema.SchemaNode.Line, schema.SchemaNode.Column)

					if _, ok := w.skippedSchemas[key]; !ok {
						skippedSchemas = append(skippedSchemas, schema.Schema)
						w.skippedSchemas[key] = true
					}
				}
			case p := <-parameterChan:
				if p != nil {
					key := fmt.Sprintf("%d:%d", p.ParamNode.Line, p.ParamNode.Column)

					if _, ok := w.seenParameters[key]; !ok {
						parameters = append(parameters, p.Param.(*drV3.Parameter))
						w.seenParameters[key] = true
					}
				}
			case buildError := <-buildErrorChan:
				if buildError != nil {
					buildErrors = append(buildErrors, buildError)
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
	w.Parameters = parameters
	w.V3Document = drDoc
	w.BuildErrors = buildErrors

	if len(w.BuildErrors) > 0 {
		orderedFunc := func(i, j int) bool {
			return w.BuildErrors[i].SchemaProxy.GoLow().GetKeyNode().Line < w.BuildErrors[j].SchemaProxy.GoLow().GetKeyNode().Line
		}
		sort.Slice(w.BuildErrors, orderedFunc)
	}

	return drDoc
}
