// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1
// https://pb33f.io

// If you wish to use this code in a competitive or commercial product, please contact sales@pb33f.io

package model

import (
	"context"
	"fmt"
	drBase "github.com/pb33f/doctor/model/high/base"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"sort"
)

// DrDocument is a turbo charged version of the libopenapi Document model. The doctor
// provides a much more powerful way to navigate an OpenAPI document.
//
// DrDocument also absorbs results from vacuum rules, and allows them to be attached contextually
// to the models they represent.
//
// The doctor is the library we wanted all along. The doctor is the library we deserve.
type DrDocument struct {
	BuildErrors    []*drBase.BuildError
	Schemas        []*drBase.Schema
	SkippedSchemas []*drBase.Schema
	Parameters     []*drV3.Parameter
	Headers        []*drV3.Header
	MediaTypes     []*drV3.MediaType
	V3Document     *drV3.Document

	index *index.SpecIndex
}

func NewDrDocument(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model)
	return doc
}

func (w *DrDocument) walkV3(doc *v3.Document) *drV3.Document {

	schemaChan := make(chan *drBase.WalkedSchema)
	skippedSchemaChan := make(chan *drBase.WalkedSchema)
	parameterChan := make(chan *drBase.WalkedParam)
	headerChan := make(chan *drBase.WalkedHeader)
	mediaTypeChan := make(chan *drBase.WalkedMediaType)
	buildErrorChan := make(chan *drBase.BuildError)

	dctx := &drBase.DrContext{
		SchemaChan:        schemaChan,
		SkippedSchemaChan: skippedSchemaChan,
		ParameterChan:     parameterChan,
		HeaderChan:        headerChan,
		MediaTypeChan:     mediaTypeChan,
		Index:             w.index,
		WaitGroup:         &conc.WaitGroup{},
		ErrorChan:         buildErrorChan,
	}

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	var schemas []*drBase.Schema
	var skippedSchemas []*drBase.Schema
	var parameters []*drV3.Parameter
	var headers []*drV3.Header
	var mediaTypes []*drV3.MediaType
	var buildErrors []*drBase.BuildError
	skippedSchemasState := make(map[string]bool)
	seenSchemasState := make(map[string]bool)
	seenParametersState := make(map[string]bool)
	seenHeadersState := make(map[string]bool)
	seenMediaTypesState := make(map[string]bool)

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

					if _, ok := seenSchemasState[key]; !ok {
						schemas = append(schemas, s.Schema)
						seenSchemasState[key] = true
					}
				}
			case schema := <-skippedChan:
				if schema != nil {
					key := fmt.Sprintf("%d:%d", schema.SchemaNode.Line, schema.SchemaNode.Column)

					if _, ok := skippedSchemasState[key]; !ok {
						skippedSchemas = append(skippedSchemas, schema.Schema)
						skippedSchemasState[key] = true
					}
				}
			case p := <-parameterChan:
				if p != nil {
					key := fmt.Sprintf("%d:%d", p.ParamNode.Line, p.ParamNode.Column)

					if _, ok := seenParametersState[key]; !ok {
						parameters = append(parameters, p.Param.(*drV3.Parameter))
						seenParametersState[key] = true
					}
				}
			case h := <-headerChan:
				if h != nil {
					key := fmt.Sprintf("%d:%d", h.HeaderNode.Line, h.HeaderNode.Column)

					if _, ok := seenHeadersState[key]; !ok {
						headers = append(headers, h.Header.(*drV3.Header))
						seenHeadersState[key] = true
					}
				}
			case mt := <-mediaTypeChan:
				if mt != nil {
					key := fmt.Sprintf("%d:%d", mt.MediaTypeNode.Line, mt.MediaTypeNode.Column)

					if _, ok := seenMediaTypesState[key]; !ok {
						mediaTypes = append(mediaTypes, mt.MediaType.(*drV3.MediaType))
						seenMediaTypesState[key] = true
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
	w.Headers = headers
	w.MediaTypes = mediaTypes
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
