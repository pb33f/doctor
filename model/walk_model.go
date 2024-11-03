// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1
// https://pb33f.io

// Code may be used for internal and open source projects only and may not be distributed commercially.
// If you wish to use this code in a competitive or commercial product, please contact sales@pb33f.io
package model

import (
	"context"
	"fmt"
	drBase "github.com/pb33f/doctor/model/high/base"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel/high"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"gopkg.in/yaml.v3"
	"sort"
	"strconv"
	"sync"
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
	Nodes          []*drBase.Node
	Edges          []*drBase.Edge
	index          *index.SpecIndex
	lineObjects    map[int]any
}

type HasValue interface {
	GetValue() interface{}
}

// NewDrDocument Create a new DrDocument from an OpenAPI v3+ document
func NewDrDocument(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, false)
	return doc
}

// NewDrDocumentAndGraph Create a new DrDocument from an OpenAPI v3+ document, and create a graph of the model.
func NewDrDocumentAndGraph(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, true)
	return doc
}

// LocateModel finds the model represented by the line number of the supplied node.
func (w *DrDocument) LocateModel(node *yaml.Node) (drBase.Foundational, error) {
	if node == nil {
		return nil, fmt.Errorf("node is nil, cannot locate model")
	}
	if node.Line == 0 {
		return nil, fmt.Errorf("node line is 0, cannot locate model")
	}
	if w == nil {
		return nil, fmt.Errorf("DrDocument is nil, cannot locate model")
	}
	if w.lineObjects[node.Line] == nil {
		return nil, fmt.Errorf("model not found at line %d", node.Line)
	}
	return w.lineObjects[node.Line].(drBase.Foundational), nil
}

// LocateModelByLine finds the model represented by the line number of the supplied node.
func (w *DrDocument) LocateModelByLine(line int) (drBase.Foundational, error) {
	if line == 0 {
		return nil, fmt.Errorf("line is 0, cannot locate model")
	}
	if w == nil {
		return nil, fmt.Errorf("DrDocument is nil, cannot locate model")
	}
	if w.lineObjects[line] == nil {
		return nil, fmt.Errorf("model not found at line %d", line)
	}
	return w.lineObjects[line].(drBase.Foundational), nil
}

// BuildObjectLocationMap builds a map of line numbers to models in the document.
func (w *DrDocument) BuildObjectLocationMap() map[int]any {
	objectMap := make(map[int]any)
	for k, v := range w.lineObjects {
		objectMap[k] = v
	}
	return objectMap
}

func (w *DrDocument) walkV3(doc *v3.Document, buildGraph bool) *drV3.Document {

	schemaChan := make(chan *drBase.WalkedSchema)
	skippedSchemaChan := make(chan *drBase.WalkedSchema)
	parameterChan := make(chan *drBase.WalkedParam)
	headerChan := make(chan *drBase.WalkedHeader)
	mediaTypeChan := make(chan *drBase.WalkedMediaType)
	buildErrorChan := make(chan *drBase.BuildError)
	objectChan := make(chan any)
	nodeChan := make(chan *drBase.Node)
	edgeChan := make(chan *drBase.Edge)
	var schemaCache sync.Map

	dctx := &drBase.DrContext{
		SchemaChan:        schemaChan,
		SkippedSchemaChan: skippedSchemaChan,
		ParameterChan:     parameterChan,
		HeaderChan:        headerChan,
		MediaTypeChan:     mediaTypeChan,
		Index:             w.index,
		WaitGroup:         &conc.WaitGroup{},
		ErrorChan:         buildErrorChan,
		NodeChan:          nodeChan,
		EdgeChan:          edgeChan,
		ObjectChan:        objectChan,
		V3Document:        doc,
		BuildGraph:        buildGraph,
		SchemaCache:       &schemaCache,
		Logger:            doc.Index.GetLogger(),
	}

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	var schemas []*drBase.Schema
	var skippedSchemas []*drBase.Schema
	var parameters []*drV3.Parameter
	var headers []*drV3.Header
	var mediaTypes []*drV3.MediaType
	var buildErrors []*drBase.BuildError
	var nodes []*drBase.Node
	var edges []*drBase.Edge
	var refEdges []*drBase.Edge
	var nodeMap = make(map[string]*drBase.Node)
	var nodeValueMap = make(map[string]*drBase.Node)
	var nodeIdMap = make(map[string]*drBase.Node)

	skippedSchemasState := make(map[string]bool)
	seenSchemasState := make(map[string]bool)
	seenParametersState := make(map[string]bool)
	seenHeadersState := make(map[string]bool)
	seenMediaTypesState := make(map[string]bool)
	w.lineObjects = make(map[int]any)

	done := make(chan bool)
	complete := make(chan bool)

	targets := make(map[string]*drBase.Edge)
	sources := make(map[string]*drBase.Edge)

	// ln is part of debug code, it is not used when not initialized
	//ln := make([]any, doc.Rolodex.GetFullLineCount())
	var ln []any
	drDoc := &drV3.Document{}
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
			case nt := <-dctx.NodeChan:
				if nt != nil {
					if _, ok := nodeMap[fmt.Sprint(nt.KeyLine)]; !ok {
						nodeMap[fmt.Sprint(nt.KeyLine)] = nt
					}

					// check if node is a reference node
					if gl, o := nt.Instance.(high.GoesLowUntyped); o {
						if r, k := gl.GoLowUntyped().(low.IsReferenced); k {
							if !r.IsReference() {
								if _, ok := nodeValueMap[fmt.Sprint(nt.ValueLine)]; !ok {
									nodeValueMap[fmt.Sprint(nt.ValueLine)] = nt
								}
							}
						} else {
							if _, ok := nodeValueMap[fmt.Sprint(nt.ValueLine)]; !ok {
								nodeValueMap[fmt.Sprint(nt.ValueLine)] = nt
							}
						}
					} else {
						if _, ok := nodeValueMap[fmt.Sprint(nt.ValueLine)]; !ok {
							nodeValueMap[fmt.Sprint(nt.ValueLine)] = nt
						}
					}
					nodes = append(nodes, nt)
					nodeIdMap[nt.Id] = nt
				}

			case nt := <-dctx.EdgeChan:
				if nt != nil {
					if nt.Ref == "" {
						edges = append(edges, nt)
					} else {
						refEdges = append(refEdges, nt)
					}
				}

			case obj := <-objectChan:
				if obj != nil {
					w.processObject(obj, ln)
				}

			case buildError := <-buildErrorChan:
				if buildError != nil {
					buildErrors = append(buildErrors, buildError)
				}
			}
		}
	}(schemaChan, skippedSchemaChan, done)

	drDoc.Walk(drCtx, doc)

	done <- true
	<-complete

	// wait for any straggling objects
	for val := range objectChan {
		w.processObject(val, ln)
	}

	w.Schemas = schemas
	w.SkippedSchemas = skippedSchemas
	w.Parameters = parameters
	w.Headers = headers
	w.MediaTypes = mediaTypes
	w.V3Document = drDoc
	w.Nodes = nodes
	w.BuildErrors = buildErrors

	roughEdges := edges
	var cleanedEdges []*drBase.Edge

	if buildGraph {
		for _, edge := range refEdges {
			//extract node id from line map

			// check if the target is an int.
			t, e := strconv.Atoi(edge.Targets[0])
			if e == nil {
				if n, ok := w.lineObjects[t]; ok {
					r := n.(drBase.Foundational).GetNode()
					if r != nil {
						edge.Targets[0] = r.Id
					} else {
						if b, ko := nodeValueMap[edge.Targets[0]]; ko {
							edge.Targets[0] = b.Id
						}
					}
					targets[edge.Targets[0]] = edge
					sources[edge.Sources[0]] = edge
				} else {
					if b, ko := nodeValueMap[edge.Targets[0]]; ko {
						edge.Targets[0] = b.Id
						targets[edge.Targets[0]] = edge
						sources[edge.Sources[0]] = edge
					}
				}
			} else {
				if b, ko := nodeValueMap[edge.Targets[0]]; ko {
					edge.Targets[0] = b.Id
					targets[edge.Targets[0]] = edge
					sources[edge.Sources[0]] = edge
				}
			}
			roughEdges = append(roughEdges, edge)
		}

		// run through edges and make sure no stragglers exist
		for _, re := range roughEdges {
			var l, r bool
			for _, t := range re.Sources {
				if _, ok := nodeIdMap[t]; !ok {
					l = true
				}
			}
			for _, t := range re.Targets {
				if _, ok := nodeIdMap[t]; !ok {
					r = true
				}
			}
			if !l && !r {
				cleanedEdges = append(cleanedEdges, re)
			}
		}

		w.Edges = cleanedEdges

		// build node tree
		for _, n := range w.Nodes {
			if p, ok := nodeIdMap[n.ParentId]; ok {
				p.Children = append(p.Children, n)
			}
		}
	}

	if len(w.BuildErrors) > 0 {
		orderedFunc := func(i, j int) bool {
			return w.BuildErrors[i].SchemaProxy.GoLow().GetKeyNode().Line < w.BuildErrors[j].SchemaProxy.GoLow().GetKeyNode().Line
		}
		sort.Slice(w.BuildErrors, orderedFunc)
	}

	// clear schema cache
	drDoc.Document.Rolodex.ClearIndexCaches()

	return drDoc
}

func (w *DrDocument) processObject(obj any, ln []any) {
	if hs, ll := obj.(drBase.HasSize); ll {
		if f, lt := obj.(drBase.Foundational); lt {
			he, wi := hs.GetSize()
			if f.GetNode() != nil {
				f.GetNode().Width = wi
				f.GetNode().Height = he
			}
		}
	}
	if hv, ok := obj.(HasValue); ok {
		if gl, ll := hv.GetValue().(high.GoesLowUntyped); ll {
			if nm, ko := gl.GoLowUntyped().(low.HasNodes); ko {
				if nm != nil {
					no := nm.GetNodes()
					for k, _ := range no {
						if w.lineObjects[k] == nil {
							w.lineObjects[k] = obj

							// Debug code, only use when initialized
							if ln != nil {
								ln[k] = w.lineObjects[k]
							}
						}
					}
				}
			}
		}
	}
}
