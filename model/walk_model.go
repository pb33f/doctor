// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1
// https://pb33f.io

package model

// Code may be used for internal and open source projects only and may not be distributed commercially.
// If you wish to use this code in a competitive or commercial product, please contact sales@pb33f.io

import (
	"context"
	"fmt"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"gopkg.in/yaml.v3"
	"os"
	"sort"
	"strconv"
	"sync"
)

// DrDocument is a turbocharged version of the libopenapi Document model. The doctor
// provides a much more powerful way to navigate an OpenAPI document.
//
// DrDocument also absorbs results from vacuum rules, and allows them to be attached contextually
// to the models they represent.
//
// The doctor is the library we wanted all along. The doctor is the library we deserve.
type DrDocument struct {
	BuildErrors    []*drV3.BuildError
	Schemas        []*drV3.Schema
	SkippedSchemas []*drV3.Schema
	Parameters     []*drV3.Parameter
	Headers        []*drV3.Header
	MediaTypes     []*drV3.MediaType
	V3Document     *drV3.Document
	Nodes          []*drV3.Node
	Edges          []*drV3.Edge
	StorageRoot    string
	index          *index.SpecIndex
	lineObjects    map[int][]any
}

type DrConfig struct {
	BuildGraph     bool
	RenderChanges  bool
	UseSchemaCache bool
}

type HasValue interface {
	GetValue() interface{}
}

// NewDrDocument Create a new DrDocument from an OpenAPI v3+ document
func NewDrDocument(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, false, true, false)
	return doc
}

// NewDrDocumentWithConfig Create a new DrDocument from an OpenAPI v3+ document and a configuration struct
func NewDrDocumentWithConfig(document *libopenapi.DocumentModel[v3.Document], config *DrConfig) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, config.BuildGraph, config.UseSchemaCache, config.RenderChanges)
	return doc
}

// NewDrDocumentAndGraph Create a new DrDocument from an OpenAPI v3+ document, and create a graph of the model.
func NewDrDocumentAndGraph(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, true, true, true)
	return doc
}

// LocateModelsByKeyAndValue finds the model represented by the line number of the supplied node. This method will
// locate every model that points to the supplied key and value node. There could be many models that point to the same
// key and value node, so this method will return a slice of models.
func (w *DrDocument) LocateModelsByKeyAndValue(key, value *yaml.Node) ([]drV3.Foundational, error) {
	if key == nil {
		return nil, fmt.Errorf("key is nil, cannot locate model")
	}
	if key.Line == 0 {
		return nil, fmt.Errorf("key line is 0, cannot locate model")
	}
	if w == nil {
		return nil, fmt.Errorf("DrDocument is nil, cannot locate model")
	}

	// now we have an origin, we can locate that model.
	if w.lineObjects[key.Line] == nil {
		return nil, fmt.Errorf("model not found at line %d", key.Line)
	}

	// find the origin of the node
	origin := w.index.GetRolodex().FindNodeOriginWithValue(key, value, nil, "")
	if origin == nil {
		return nil, fmt.Errorf("origin not found for key node")
	}

	if origin.AbsoluteLocationValue != "" { // if the key and value have different origins (external refs)
		// extract objects from line
		objects := w.lineObjects[origin.LineValue]
		if objects == nil {
			return nil, fmt.Errorf("model not found at line %d", origin.LineValue)
		}

		if len(objects) > 0 {
			var filteredObjects []drV3.Foundational
			for _, o := range objects {
				if hv, ok := o.(drV3.HasValue); ok {
					if gl, ll := hv.GetValue().(high.GoesLowUntyped); ll {
						if hi, kk := gl.GoLowUntyped().(drV3.HasIndex); kk {
							idx := hi.GetIndex()
							if idx != nil {
								if idx.GetSpecAbsolutePath() == origin.AbsoluteLocationValue {
									// check the parents match.
									if o.(drV3.Foundational).GetParent().GetKeyNode().Line == key.Line {
										filteredObjects = append(filteredObjects, o.(drV3.Foundational))
										continue
									}
								}
							}
						}

						if hrn, ko := gl.GoLowUntyped().(low.HasRootNode); ko {
							rn := hrn.GetRootNode()
							if rn != nil {
								// check root node from low value against parent node

								if o.(drV3.Foundational).GetParent().GetKeyNode() != nil &&
									o.(drV3.Foundational).GetParent().GetKeyNode().Line == key.Line {
									if value == rn { // check if the nodes match
										filteredObjects = append(filteredObjects, o.(drV3.Foundational))
										continue
									}
									// check hash
									if index.HashNode(value) == index.HashNode(rn) {
										filteredObjects = append(filteredObjects, o.(drV3.Foundational))
										continue
									}
								}
							}
						}
					}
				}
			}
			sort.Slice(filteredObjects, func(i, j int) bool {
				return filteredObjects[i].GenerateJSONPath() < filteredObjects[j].GenerateJSONPath()
			})
			if len(filteredObjects) > 0 {
				return filteredObjects, nil
			}
		}
		return nil, fmt.Errorf("model not found at line %d", origin.LineValue)

	} else { // key and value are in the same origin

		objects := w.lineObjects[origin.Line]
		if objects == nil {
			return nil, fmt.Errorf("model not found at line %d", origin.Line)
		}
		var filteredObjects []drV3.Foundational

		if len(objects) > 0 {

			for _, o := range objects {
				if hv, ok := o.(drV3.HasValue); ok {
					if gl, ll := hv.GetValue().(high.GoesLowUntyped); ll {
						if hi, kk := gl.GoLowUntyped().(drV3.HasIndex); kk {
							idx := hi.GetIndex()
							if idx != nil {
								if idx.GetSpecAbsolutePath() == origin.AbsoluteLocation {
									filteredObjects = append(filteredObjects, o.(drV3.Foundational))
									continue
								}
							}
						}
						if hrn, ko := gl.GoLowUntyped().(low.HasRootNode); ko {
							rn := hrn.GetRootNode()
							if rn != nil {

								if value == rn { // check if the nodes match
									filteredObjects = append(filteredObjects, o.(drV3.Foundational))
									continue
								}
								// check hash
								if index.HashNode(value) == index.HashNode(rn) {
									filteredObjects = append(filteredObjects, o.(drV3.Foundational))
									continue
								}
							}
						}
					}
				}
			}
			foLen := len(filteredObjects)
			if foLen > 0 {
				sort.Slice(filteredObjects, func(i, j int) bool {
					return filteredObjects[i].GenerateJSONPath() < filteredObjects[j].GenerateJSONPath()
				})
			}
			if foLen > 0 {
				return filteredObjects, nil
			}
		}
	}
	return nil, fmt.Errorf("model not found at line %d", key.Line)
}

// LocateModel finds the model represented by the line number of the supplied node.
func (w *DrDocument) LocateModel(node *yaml.Node) ([]drV3.Foundational, error) {
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
	if len(w.lineObjects[node.Line]) > 0 {
		r := w.lineObjects[node.Line]
		result := make([]drV3.Foundational, 0, len(r))
		for _, item := range r {
			if f, ok := item.(drV3.Foundational); ok {
				result = append(result, f)
			}
		}
		return result, nil
	}
	return nil, fmt.Errorf("model not found at line %d", node.Line)
}

// LocateModelByLine finds the model represented by the line number of the supplied node.
func (w *DrDocument) LocateModelByLine(line int) ([]drV3.Foundational, error) {
	if line == 0 {
		return nil, fmt.Errorf("line is 0, cannot locate model")
	}
	if w == nil {
		return nil, fmt.Errorf("DrDocument is nil, cannot locate model")
	}
	if w.lineObjects[line] == nil {
		return nil, fmt.Errorf("model not found at line %d", line)
	}
	if len(w.lineObjects[line]) > 0 {
		r := w.lineObjects[line]
		result := make([]drV3.Foundational, 0, len(r))
		for _, item := range r {
			if f, ok := item.(drV3.Foundational); ok {
				result = append(result, f)
			}
		}
		// order by line number
		sort.Slice(result, func(i, j int) bool {
			knA := result[i].GetKeyNode()
			knB := result[j].GetKeyNode()
			if knA != nil && knB != nil {
				return result[i].GetKeyNode().Line < result[j].GetKeyNode().Line
			}
			if knA == nil && knB != nil {
				return false
			}
			return true
		})
		return result, nil
	}
	return nil, fmt.Errorf("model not found at line %d", line)
}

// BuildObjectLocationMap builds a map of line numbers to models in the document.
func (w *DrDocument) BuildObjectLocationMap() map[int]any {
	objectMap := make(map[int]any)
	for k, v := range w.lineObjects {
		objectMap[k] = v
	}
	return objectMap
}

func (w *DrDocument) GetIndex() *index.SpecIndex {
	return w.index
}

func (w *DrDocument) walkV3(doc *v3.Document, buildGraph, useCache, renderChanges bool) *drV3.Document {

	schemaChan := make(chan *drV3.WalkedSchema)
	skippedSchemaChan := make(chan *drV3.WalkedSchema)
	parameterChan := make(chan *drV3.WalkedParam)
	headerChan := make(chan *drV3.WalkedHeader)
	mediaTypeChan := make(chan *drV3.WalkedMediaType)
	buildErrorChan := make(chan *drV3.BuildError)
	objectChan := make(chan any)
	nodeChan := make(chan *drV3.Node)
	edgeChan := make(chan *drV3.Edge)
	var schemaCache sync.Map

	wd, _ := os.Getwd()
	if wd == "/" {
		wd = ""
	}

	dctx := &drV3.DrContext{
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
		RenderChanges:     renderChanges,
		SchemaCache:       &schemaCache,
		StorageRoot:       doc.GoLow().StorageRoot,
		Logger:            doc.Index.GetLogger(),
		UseSchemaCache:    useCache,
		WorkingDirectory:  wd,
	}
	w.StorageRoot = doc.GoLow().StorageRoot

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	var schemas []*drV3.Schema
	var skippedSchemas []*drV3.Schema
	var parameters []*drV3.Parameter
	var headers []*drV3.Header
	var mediaTypes []*drV3.MediaType
	var buildErrors []*drV3.BuildError
	var nodes []*drV3.Node
	var edges []*drV3.Edge
	var refEdges []*drV3.Edge
	var nodeMap = make(map[string]*drV3.Node)
	var nodeValueMap = make(map[string]*drV3.Node)
	var nodeIdMap = make(map[string]*drV3.Node)

	skippedSchemasState := make(map[string]bool)
	seenSchemasState := make(map[string]bool)
	seenParametersState := make(map[string]bool)
	seenHeadersState := make(map[string]bool)
	seenMediaTypesState := make(map[string]bool)
	w.lineObjects = make(map[int][]any)

	done := make(chan bool)
	complete := make(chan bool)

	targets := make(map[string]*drV3.Edge)
	sources := make(map[string]*drV3.Edge)

	// ln is part of debug code, it is not used when not initialized
	//ln := make([]any, doc.Rolodex.GetFullLineCount()+1)
	var ln []any
	drDoc := &drV3.Document{}
	go func(sChan chan *drV3.WalkedSchema, skippedChan chan *drV3.WalkedSchema, done chan bool) {
		for {
			select {
			case <-done:
				complete <- true
				return
			case s := <-sChan:
				if s != nil {
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

	// sort schemas by line number
	orderedFunc := func(i, j int) bool {
		return schemas[i].GetKeyNode().Line < schemas[j].GetKeyNode().Line
	}
	// same for parameters
	orderedFuncParam := func(i, j int) bool {
		return parameters[i].GetKeyNode().Line < parameters[j].GetKeyNode().Line
	}
	// same for headers
	orderedFuncHeader := func(i, j int) bool {
		return headers[i].GetKeyNode().Line < headers[j].GetKeyNode().Line
	}
	if len(schemas) > 0 {
		sort.Slice(schemas, orderedFunc)
	}
	if len(skippedSchemas) > 0 {
		sort.Slice(skippedSchemas, orderedFunc)
	}
	if len(parameters) > 0 {
		sort.Slice(parameters, orderedFuncParam)
	}
	if len(headers) > 0 {
		sort.Slice(headers, orderedFuncHeader)
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
	var cleanedEdges []*drV3.Edge

	if buildGraph {
		for _, edge := range refEdges {
			//extract node id from line map
			// check if the target is an int.
			t, e := strconv.Atoi(edge.Targets[0])
			if e == nil {
				if n, ok := w.lineObjects[t]; ok {
					// iterate through objects in slice,
					for _, o := range n {
						r := o.(drV3.Foundational).GetNode()
						if r != nil {
							edge.Targets[0] = r.Id
						} else {
							if b, ko := nodeValueMap[edge.Targets[0]]; ko {
								edge.Targets[0] = b.Id
							}
						}
						targets[edge.Targets[0]] = edge
						sources[edge.Sources[0]] = edge
					}
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
				if n.Origin == nil {
					origin := doc.Index.GetRolodex().FindNodeOrigin(n.Value)
					if origin != nil {
						n.Origin = origin
					}
				}
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
	if hs, ll := obj.(drV3.HasSize); ll {
		if f, lt := obj.(drV3.Foundational); lt {
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
						if ir, hj := gl.GoLowUntyped().(low.IsReferenced); hj {
							if ir.IsReference() {
								continue
							}
						}

						if w.lineObjects[k] == nil {

							w.lineObjects[k] = []any{obj}

							// Debug code, only use when initialized
							if ln != nil {
								ln[k] = w.lineObjects[k]
							}
						} else {

							// check if the object is already in the line objects
							var found bool
							b := obj.(drV3.Foundational).GenerateJSONPath()
							lo := w.lineObjects[k]
							for _, o := range lo {
								a := o.(drV3.Foundational).GenerateJSONPath()
								if a == b {
									found = true
									break
								}
							}
							if !found {
								w.lineObjects[k] = append(w.lineObjects[k], obj)
							}
						}
					}
				}
			}
		} else {
			if fn, ko := obj.(drV3.Foundational); ko {
				kn := fn.GetKeyNode()
				if kn != nil {

					if w.lineObjects[kn.Line] == nil {
						w.lineObjects[kn.Line] = []any{obj}

						// Debug code, only use when initialized
						if ln != nil {
							ln[kn.Line] = w.lineObjects[kn.Line]
						}
					} else {
						// check if the object is already in the line objects
						var found bool
						b := obj.(drV3.Foundational).GenerateJSONPath()
						lo := w.lineObjects[kn.Line]
						for _, o := range lo {
							a := o.(drV3.Foundational).GenerateJSONPath()
							if a == b {
								found = true
								break
							}
						}
						if !found {
							w.lineObjects[kn.Line] = append(w.lineObjects[kn.Line], obj)
						}
					}
				}
			}
		}
	}
}
