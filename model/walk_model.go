// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0
// https://pb33f.io

package model

// Code may be used for internal and open source projects only and may not be distributed commercially.
// If you wish to use this code in a competitive or commercial product, please contact sales@pb33f.io

import (
	"context"
	"fmt"
	"os"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"sync"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel/high"
	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
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
	lineObjectPtrs map[int]map[uintptr]struct{}
}

// Release nils all fields that can pin YAML node trees, SpecIndex maps, or
// libopenapi documents in memory. This includes unexported fields (index,
// lineObjects) that callers outside this package cannot reach directly.
// Call this once all serialization work is done with the DrDocument.
func (d *DrDocument) Release() {
	if d == nil {
		return
	}
	d.index = nil
	d.lineObjects = nil
	d.lineObjectPtrs = nil
	d.BuildErrors = nil
	d.Schemas = nil
	d.SkippedSchemas = nil
	d.Parameters = nil
	d.Headers = nil
	d.MediaTypes = nil
	d.V3Document = nil
	d.Nodes = nil
	d.Edges = nil
}

type DrConfig struct {
	BuildGraph         bool
	RenderChanges      bool
	UseSchemaCache     bool
	DeterministicPaths bool // When true, schemas always return their definition-site path
	SyncWalk           bool // When true, walk all branches synchronously for reproducible output
	WalkWorkers        int  // Optional bounded worker count; <= 0 uses the default
}

type walkOptions struct {
	SyncWalk    bool
	WalkWorkers int
}

func shouldRunCachedWalkSynchronously(config *DrConfig, options walkOptions) bool {
	// The schema cache needs a strict happens-before relationship: one schema
	// owner must finish building before repeated occurrences hydrate from it.
	// Worker-pool walking breaks that contract by allowing concurrent cache
	// misses to build and publish the same subtree more than once. Cached walks
	// therefore run synchronously; uncached walks can still use the pool.
	return config != nil && config.UseSchemaCache && !options.SyncWalk
}

type HasValue interface {
	GetValue() interface{}
}

// createKey packs line and column into a single uint64 key for efficient map lookups.
// This eliminates string allocations from fmt.Sprintf("%d:%d", line, column).
func createKey(line, column int) uint64 {
	return uint64(line)<<32 | uint64(column)
}

// collectFoundational is a generic collector that handles deduplication with canonical selection.
// When the same object (by line:column) is encountered via multiple concurrent paths,
// it keeps the one with the earliest parent position (the lowest line:column).
func collectFoundational[T drV3.Foundational](
	items []T,
	state map[uint64]int,
	item T,
	nodeKey uint64,
) []T {
	if existingIdx, exists := state[nodeKey]; !exists {
		state[nodeKey] = len(items)
		items = append(items, item)
	} else {
		if drV3.CompareByParentPosition(item, items[existingIdx]) {
			items[existingIdx] = item
		}
	}
	return items
}

// NewDrDocument Create a new DrDocument from an OpenAPI v3+ document
func NewDrDocument(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	if document == nil {
		return nil
	}
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3(&document.Model, false, true, false)
	return doc
}

// NewDrDocumentWithConfig Create a new DrDocument from an OpenAPI v3+ document and a configuration struct
func NewDrDocumentWithConfig(document *libopenapi.DocumentModel[v3.Document], config *DrConfig) *DrDocument {
	if document == nil {
		return nil
	}
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3WithConfig(&document.Model, config)
	return doc
}

// NewDrDocumentAndGraph Create a new DrDocument from an OpenAPI v3+ document, and create a graph of the model.
func NewDrDocumentAndGraph(document *libopenapi.DocumentModel[v3.Document]) *DrDocument {
	if document == nil {
		return nil
	}
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

	// Cache the hash of the value node to avoid recomputing it in loops
	var valueHash string

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
									// check hash - compute value hash once and reuse
									if valueHash == "" {
										valueHash = index.HashNode(value)
									}
									if valueHash == index.HashNode(rn) {
										filteredObjects = append(filteredObjects, o.(drV3.Foundational))
										continue
									}
								}
							}
						}
					}
				}
			}
			if len(filteredObjects) > 0 {
				return stableLocatedModels(filteredObjects), nil
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
								// check hash - compute value hash once and reuse
								if valueHash == "" {
									valueHash = index.HashNode(value)
								}
								if valueHash == index.HashNode(rn) {
									filteredObjects = append(filteredObjects, o.(drV3.Foundational))
									continue
								}
							}
						}
					}
				}
			}
			if len(filteredObjects) > 0 {
				return stableLocatedModels(filteredObjects), nil
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
		return stableLocatedModels(result), nil
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
		return stableLocatedModels(result), nil
	}
	return nil, fmt.Errorf("model not found at line %d", line)
}

func stableLocatedModels(models []drV3.Foundational) []drV3.Foundational {
	if len(models) < 2 {
		return models
	}

	seen := make(map[string]struct{}, len(models))
	stable := make([]drV3.Foundational, 0, len(models))
	for _, model := range models {
		if model == nil {
			continue
		}
		path := model.GenerateJSONPath()
		if path != "" {
			if _, ok := seen[path]; ok {
				continue
			}
			seen[path] = struct{}{}
		}
		stable = append(stable, model)
	}

	type locatedModelSortEntry struct {
		model drV3.Foundational
		key   string
	}
	entries := make([]locatedModelSortEntry, len(stable))
	for i, model := range stable {
		entries[i] = locatedModelSortEntry{
			model: model,
			key:   locatedModelSortKey(model),
		}
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].key < entries[j].key
	})
	for i, entry := range entries {
		stable[i] = entry.model
	}
	return stable
}

func locatedModelSortKey(model drV3.Foundational) string {
	if model == nil {
		return ""
	}
	path := model.GenerateJSONPath()
	keyNode := model.GetKeyNode()
	valueNode := model.GetValueNode()
	return fmt.Sprintf("%s|%08d:%08d|%08d:%08d|%T",
		path,
		nodeLine(keyNode),
		nodeColumn(keyNode),
		nodeLine(valueNode),
		nodeColumn(valueNode),
		model,
	)
}

func nodeLine(node *yaml.Node) int {
	if node == nil {
		return 0
	}
	return node.Line
}

func nodeColumn(node *yaml.Node) int {
	if node == nil {
		return 0
	}
	return node.Column
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
	return w.walkV3WithConfig(doc, &DrConfig{
		BuildGraph:         buildGraph,
		UseSchemaCache:     useCache,
		RenderChanges:      renderChanges,
		DeterministicPaths: false, // Default to false for backwards compatibility
	})
}

func (w *DrDocument) walkV3WithConfig(doc *v3.Document, config *DrConfig) *drV3.Document {
	if config == nil {
		config = &DrConfig{}
	}
	return w.walkV3WithConfigAndOptions(doc, config, walkOptions{
		SyncWalk:    config.SyncWalk,
		WalkWorkers: config.WalkWorkers,
	})
}

func (w *DrDocument) walkV3WithConfigAndOptions(doc *v3.Document, config *DrConfig, options walkOptions) *drV3.Document {
	if config == nil {
		config = &DrConfig{}
	}
	if shouldRunCachedWalkSynchronously(config, options) {
		options.SyncWalk = true
	}

	const objectCollectorBufferSize = drV3.DefaultWalkWorkQueueSize

	schemaChan := make(chan *drV3.WalkedSchema)
	skippedSchemaChan := make(chan *drV3.WalkedSchema)
	parameterChan := make(chan *drV3.WalkedParam)
	headerChan := make(chan *drV3.WalkedHeader)
	mediaTypeChan := make(chan *drV3.WalkedMediaType)
	buildErrorChan := make(chan *drV3.BuildError)
	objectChan := make(chan any, objectCollectorBufferSize)
	nodeChan := make(chan *drV3.Node)
	edgeChan := make(chan *drV3.Edge)
	var schemaCache sync.Map

	wd, _ := os.Getwd()
	if wd == "/" {
		wd = ""
	}

	var canonicalPathCache sync.Map
	var canonicalPathsApplied sync.Map
	dctx := &drV3.DrContext{
		SchemaChan:            schemaChan,
		SkippedSchemaChan:     skippedSchemaChan,
		ParameterChan:         parameterChan,
		HeaderChan:            headerChan,
		MediaTypeChan:         mediaTypeChan,
		Index:                 w.index,
		ErrorChan:             buildErrorChan,
		NodeChan:              nodeChan,
		EdgeChan:              edgeChan,
		ObjectChan:            objectChan,
		V3Document:            doc,
		BuildGraph:            config.BuildGraph,
		RenderChanges:         config.RenderChanges,
		SchemaCache:           &schemaCache,
		CanonicalPathCache:    &canonicalPathCache,
		CanonicalPathsApplied: &canonicalPathsApplied,
		CircularRefs:          &drV3.CircularRefSets{},
		HashCache:             drV3.NewHashCache(),
		StorageRoot:           doc.GoLow().StorageRoot,
		Logger:                doc.Index.GetLogger(),
		UseSchemaCache:        config.UseSchemaCache,
		DeterministicPaths:    config.DeterministicPaths,
		SyncWalk:              options.SyncWalk,
		WorkingDirectory:      wd,
	}
	w.StorageRoot = doc.GoLow().StorageRoot

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	// Create the bounded worker pool for document-level branches. Schema
	// subtrees are walked inline so a schema is fully built before it is
	// published to the schema cache.
	if !options.SyncWalk {
		workers := options.WalkWorkers
		if workers <= 0 {
			workers = drV3.DefaultWalkWorkers()
		}
		dctx.WalkPool = drV3.NewWalkPool(workers)
		defer dctx.WalkPool.Shutdown()
	}

	var schemas []*drV3.Schema
	var skippedSchemas []*drV3.Schema
	var parameters []*drV3.Parameter
	var headers []*drV3.Header
	var mediaTypes []*drV3.MediaType
	var buildErrors []*drV3.BuildError
	var nodes []*drV3.Node
	var edges []*drV3.Edge
	var refEdges []*drV3.Edge
	var nodeValueMap = make(map[int]*drV3.Node)
	var nodeIdMap = make(map[string]*drV3.Node)

	// Maps use uint64 keys (packed line:column) for zero-allocation lookups.
	// Pre-allocated for large specs (Stripe has ~5000+ schemas). Maps auto-grow if needed.
	const estimatedSchemas = 5000
	skippedSchemasState := make(map[uint64]int, estimatedSchemas)
	seenSchemasState := make(map[uint64]int, estimatedSchemas)
	seenParametersState := make(map[uint64]int, estimatedSchemas/4)
	seenHeadersState := make(map[uint64]int, estimatedSchemas/4)
	seenMediaTypesState := make(map[uint64]int, estimatedSchemas/2)
	w.lineObjects = make(map[int][]any)
	w.lineObjectPtrs = make(map[int]map[uintptr]struct{})

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
					key := createKey(s.SchemaNode.Line, s.SchemaNode.Column)
					schemas = collectFoundational(schemas, seenSchemasState, s.Schema, key)
				}
			case schema := <-skippedChan:
				if schema != nil {
					key := createKey(schema.SchemaNode.Line, schema.SchemaNode.Column)
					skippedSchemas = collectFoundational(skippedSchemas, skippedSchemasState, schema.Schema, key)
				}
			case p := <-parameterChan:
				if p != nil {
					key := createKey(p.ParamNode.Line, p.ParamNode.Column)
					parameters = collectFoundational(parameters, seenParametersState, p.Param.(*drV3.Parameter), key)
				}
			case h := <-headerChan:
				if h != nil {
					key := createKey(h.HeaderNode.Line, h.HeaderNode.Column)
					headers = collectFoundational(headers, seenHeadersState, h.Header.(*drV3.Header), key)
				}
			case mt := <-mediaTypeChan:
				if mt != nil {
					key := createKey(mt.MediaTypeNode.Line, mt.MediaTypeNode.Column)
					mediaTypes = collectFoundational(mediaTypes, seenMediaTypesState, mt.MediaType.(*drV3.MediaType), key)
				}
			case nt := <-dctx.NodeChan:
				if nt != nil {
					// check if a node is a reference node
					isRef := false
					if gl, o := nt.GetInstance().(high.GoesLowUntyped); o {
						if r, k := gl.GoLowUntyped().(low.IsReferenced); k {
							isRef = r.IsReference()
						}
					}
					if !isRef {
						if _, ok := nodeValueMap[nt.ValueLine]; !ok {
							nodeValueMap[nt.ValueLine] = nt
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

	// PRE-POPULATE canonical paths for ALL component types BEFORE concurrent walking.
	// This must happen synchronously before any goroutines run to avoid races.
	// The cache maps *yaml.Node pointer -> canonical JSONPath (definition-site path).
	if config.DeterministicPaths && doc.Components != nil {
		// Schemas
		if doc.Components.Schemas != nil {
			for pair := doc.Components.Schemas.First(); pair != nil; pair = pair.Next() {
				if resolved := pair.Value().Schema(); resolved != nil {
					if low := resolved.GoLow(); low != nil && low.RootNode != nil {
						canonicalPathCache.Store(low.RootNode,
							"$.components.schemas['"+pair.Key()+"']")
					}
				}
			}
		}
		// Responses
		if doc.Components.Responses != nil {
			for pair := doc.Components.Responses.First(); pair != nil; pair = pair.Next() {
				if low := pair.Value().GoLow(); low != nil && low.RootNode != nil {
					canonicalPathCache.Store(low.RootNode,
						"$.components.responses['"+pair.Key()+"']")
				}
			}
		}
		// Parameters
		if doc.Components.Parameters != nil {
			for pair := doc.Components.Parameters.First(); pair != nil; pair = pair.Next() {
				if low := pair.Value().GoLow(); low != nil && low.RootNode != nil {
					canonicalPathCache.Store(low.RootNode,
						"$.components.parameters['"+pair.Key()+"']")
				}
			}
		}
		// RequestBodies
		if doc.Components.RequestBodies != nil {
			for pair := doc.Components.RequestBodies.First(); pair != nil; pair = pair.Next() {
				if low := pair.Value().GoLow(); low != nil && low.RootNode != nil {
					canonicalPathCache.Store(low.RootNode,
						"$.components.requestBodies['"+pair.Key()+"']")
				}
			}
		}
		// Headers
		if doc.Components.Headers != nil {
			for pair := doc.Components.Headers.First(); pair != nil; pair = pair.Next() {
				if low := pair.Value().GoLow(); low != nil && low.RootNode != nil {
					canonicalPathCache.Store(low.RootNode,
						"$.components.headers['"+pair.Key()+"']")
				}
			}
		}

		// Recursively pre-populate nested schema paths for all component types.
		visited := make(map[*yaml.Node]bool)

		// Schemas
		if doc.Components.Schemas != nil {
			for pair := doc.Components.Schemas.First(); pair != nil; pair = pair.Next() {
				if resolved := pair.Value().Schema(); resolved != nil {
					basePath := drV3.AppendKeySegment("$.components.schemas", pair.Key())
					prePopulateNestedSchemaPaths(&canonicalPathCache, resolved, basePath, visited, false)
				}
			}
		}

		// Responses
		if doc.Components.Responses != nil {
			for pair := doc.Components.Responses.First(); pair != nil; pair = pair.Next() {
				response := pair.Value()
				if response == nil || response.Content == nil {
					continue
				}
				basePath := drV3.AppendKeySegment("$.components.responses", pair.Key())
				prePopulateMediaTypeSchemas(&canonicalPathCache, response.Content, basePath, visited, false)
			}
		}

		// Parameters
		if doc.Components.Parameters != nil {
			for pair := doc.Components.Parameters.First(); pair != nil; pair = pair.Next() {
				parameter := pair.Value()
				if parameter == nil {
					continue
				}
				basePath := drV3.AppendKeySegment("$.components.parameters", pair.Key())
				if parameter.Schema != nil {
					populateSchemaProxyPath(&canonicalPathCache, parameter.Schema, basePath+".schema", visited, false)
				}
				if parameter.Content != nil {
					prePopulateMediaTypeSchemas(&canonicalPathCache, parameter.Content, basePath, visited, false)
				}
			}
		}

		// RequestBodies
		if doc.Components.RequestBodies != nil {
			for pair := doc.Components.RequestBodies.First(); pair != nil; pair = pair.Next() {
				requestBody := pair.Value()
				if requestBody == nil || requestBody.Content == nil {
					continue
				}
				basePath := drV3.AppendKeySegment("$.components.requestBodies", pair.Key())
				prePopulateMediaTypeSchemas(&canonicalPathCache, requestBody.Content, basePath, visited, false)
			}
		}

		// Headers
		if doc.Components.Headers != nil {
			for pair := doc.Components.Headers.First(); pair != nil; pair = pair.Next() {
				header := pair.Value()
				if header == nil {
					continue
				}
				basePath := drV3.AppendKeySegment("$.components.headers", pair.Key())
				if header.Schema != nil {
					populateSchemaProxyPath(&canonicalPathCache, header.Schema, basePath+".schema", visited, false)
				}
				if header.Content != nil {
					prePopulateMediaTypeSchemas(&canonicalPathCache, header.Content, basePath, visited, false)
				}
			}
		}

		// PathItems (OpenAPI 3.1+) - operations carry schemas via parameters,
		// request bodies, responses and nested callbacks.
		if doc.Components.PathItems != nil {
			for pair := doc.Components.PathItems.First(); pair != nil; pair = pair.Next() {
				if pi := pair.Value(); pi != nil {
					prePopulatePathItemSchemas(&canonicalPathCache, pi,
						"$.components.pathItems['"+pair.Key()+"']", visited, false)
				}
			}
		}

		// Callbacks - expression path items carry the same operation shapes.
		if doc.Components.Callbacks != nil {
			for pair := doc.Components.Callbacks.First(); pair != nil; pair = pair.Next() {
				prePopulateCallbackSchemas(&canonicalPathCache, pair.Value(),
					"$.components.callbacks['"+pair.Key()+"']", visited, false)
			}
		}
	}

	drDoc.Walk(drCtx, doc)

	done <- true
	<-complete

	// wait for any straggling objects
	for val := range objectChan {
		w.processObject(val, ln)
	}

	// safe line comparator that handles nil references
	safeCmp := func(left, right *yaml.Node) bool {
		if left == nil || right == nil {
			// if nodes are nil, give precedence to left node by returning false
			return false
		}
		return left.Line < right.Line
	}
	// sort schemas by line number
	orderedFunc := func(i, j int) bool {
		return safeCmp(schemas[i].GetKeyNode(), schemas[j].GetKeyNode())
	}
	// sort skipped schemas by line number
	orderedFuncSkipped := func(i, j int) bool {
		return safeCmp(skippedSchemas[i].GetKeyNode(), skippedSchemas[j].GetKeyNode())
	}
	// same for parameters
	orderedFuncParam := func(i, j int) bool {
		return safeCmp(parameters[i].GetKeyNode(), parameters[j].GetKeyNode())
	}
	// same for headers
	orderedFuncHeader := func(i, j int) bool {
		return safeCmp(headers[i].GetKeyNode(), headers[j].GetKeyNode())
	}
	orderedFuncMediaType := func(i, j int) bool {
		return safeCmp(mediaTypes[i].GetKeyNode(), mediaTypes[j].GetKeyNode())
	}
	if len(schemas) > 0 {
		sort.Slice(schemas, orderedFunc)
	}
	if len(skippedSchemas) > 0 {
		sort.Slice(skippedSchemas, orderedFuncSkipped)
	}
	if len(parameters) > 0 {
		sort.Slice(parameters, orderedFuncParam)
	}
	if len(headers) > 0 {
		sort.Slice(headers, orderedFuncHeader)
	}
	if len(mediaTypes) > 0 {
		sort.Slice(mediaTypes, orderedFuncMediaType)
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

	if config.BuildGraph {
		for _, edge := range refEdges {
			if edge.TargetLine > 0 {
				// Line-targeted edge - resolve the line to a node ID
				if targetNode, ok := nodeValueMap[edge.TargetLine]; ok {
					edge.Targets[0] = targetNode.Id
					edge.TargetLine = 0
					// Skip self-referencing edges (source == target after conversion)
					if edge.Sources[0] == edge.Targets[0] {
						continue
					}
					targets[edge.Targets[0]] = edge
					sources[edge.Sources[0]] = edge
				}
			} else if _, ok := nodeIdMap[edge.Targets[0]]; ok {
				// Target is already a node ID
				// Skip self-referencing edges (source == target)
				if edge.Sources[0] == edge.Targets[0] {
					continue
				}
				targets[edge.Targets[0]] = edge
				sources[edge.Sources[0]] = edge
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
		childrenByParent := make(map[string]map[string]struct{})
		for _, n := range w.Nodes {
			if p, ok := nodeIdMap[n.ParentId]; ok {
				seenChildren := childrenByParent[p.Id]
				if seenChildren == nil {
					seenChildren = make(map[string]struct{}, len(p.Children)+1)
					for _, c := range p.Children {
						if c != nil {
							seenChildren[c.Id] = struct{}{}
						}
					}
					childrenByParent[p.Id] = seenChildren
				}
				if _, exists := seenChildren[n.Id]; !exists {
					p.Children = append(p.Children, n)
					seenChildren[n.Id] = struct{}{}
				}

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

// prePopulatePathItemSchemas seeds canonical paths for every schema reachable
// from a path item (operations, parameters, request bodies, responses,
// response headers, nested callbacks). Segment shapes mirror the walkers:
// operations are lowercase method segments, response codes are key-only
// segments under 'responses', callback expressions are key-only segments
// under the callback's own key.
func prePopulatePathItemSchemas(
	cache *sync.Map,
	pathItem *v3.PathItem,
	basePath string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	if cache == nil || pathItem == nil {
		return
	}
	// guard recursive callback -> pathItem chains ($ref'd path items)
	if low := pathItem.GoLow(); low != nil && low.RootNode != nil {
		if visited[low.RootNode] {
			return
		}
		visited[low.RootNode] = true
	}

	for i, param := range pathItem.Parameters {
		prePopulateParameterSchemas(cache, param, basePath+".parameters["+strconv.Itoa(i)+"]", visited, followRefs)
	}

	operations := []struct {
		method string
		op     *v3.Operation
	}{
		{"get", pathItem.Get}, {"put", pathItem.Put}, {"post", pathItem.Post},
		{"delete", pathItem.Delete}, {"options", pathItem.Options},
		{"head", pathItem.Head}, {"patch", pathItem.Patch}, {"trace", pathItem.Trace},
	}
	if followRefs {
		operations[1], operations[2] = operations[2], operations[1]
	}
	for _, entry := range operations {
		if entry.op == nil {
			continue
		}
		opPath := basePath + "." + entry.method
		for i, param := range entry.op.Parameters {
			prePopulateParameterSchemas(cache, param, opPath+".parameters["+strconv.Itoa(i)+"]", visited, followRefs)
		}
		if entry.op.RequestBody != nil && entry.op.RequestBody.Content != nil {
			prePopulateMediaTypeSchemas(cache, entry.op.RequestBody.Content, opPath+".requestBody", visited, followRefs)
		}
		if entry.op.Responses != nil && entry.op.Responses.Codes != nil {
			for pair := entry.op.Responses.Codes.First(); pair != nil; pair = pair.Next() {
				response := pair.Value()
				if response == nil {
					continue
				}
				respPath := drV3.AppendKeySegment(opPath+".responses", pair.Key())
				if response.Content != nil {
					prePopulateMediaTypeSchemas(cache, response.Content, respPath, visited, followRefs)
				}
				if response.Headers != nil {
					for hPair := response.Headers.First(); hPair != nil; hPair = hPair.Next() {
						header := hPair.Value()
						if header == nil {
							continue
						}
						headerPath := drV3.AppendKeySegment(respPath+".headers", hPair.Key())
						if header.Schema != nil {
							populateSchemaProxyPath(cache, header.Schema, headerPath+".schema", visited, followRefs)
						}
						if header.Content != nil {
							prePopulateMediaTypeSchemas(cache, header.Content, headerPath, visited, followRefs)
						}
					}
				}
			}
		}
		if entry.op.Callbacks != nil {
			for cbPair := entry.op.Callbacks.First(); cbPair != nil; cbPair = cbPair.Next() {
				prePopulateCallbackSchemas(cache, cbPair.Value(), opPath+".callbacks['"+cbPair.Key()+"']", visited, followRefs)
			}
		}
	}
}

// prePopulateCallbackSchemas seeds canonical paths for schemas under a
// callback's expression path items (expressions are key-only segments).
func prePopulateCallbackSchemas(
	cache *sync.Map,
	callback *v3.Callback,
	basePath string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	if cache == nil || callback == nil || callback.Expression == nil {
		return
	}
	for pair := callback.Expression.First(); pair != nil; pair = pair.Next() {
		if pi := pair.Value(); pi != nil {
			prePopulatePathItemSchemas(cache, pi, drV3.AppendKeySegment(basePath, pair.Key()), visited, followRefs)
		}
	}
}

// prePopulateParameterSchemas seeds canonical paths for a parameter's schema
// and content media types.
func prePopulateParameterSchemas(
	cache *sync.Map,
	parameter *v3.Parameter,
	basePath string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	if cache == nil || parameter == nil {
		return
	}
	if parameter.Schema != nil {
		populateSchemaProxyPath(cache, parameter.Schema, basePath+".schema", visited, followRefs)
	}
	if parameter.Content != nil {
		prePopulateMediaTypeSchemas(cache, parameter.Content, basePath, visited, followRefs)
	}
}

func prePopulateMediaTypeSchemas(
	cache *sync.Map,
	content *orderedmap.Map[string, *v3.MediaType],
	basePath string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	if cache == nil || content == nil {
		return
	}
	for pair := content.First(); pair != nil; pair = pair.Next() {
		mediaType := pair.Value()
		if mediaType == nil {
			continue
		}
		mediaPath := drV3.AppendKeySegment(basePath+".content", pair.Key())
		if mediaType.Schema != nil {
			populateSchemaProxyPath(cache, mediaType.Schema, mediaPath+".schema", visited, followRefs)
		}
		if mediaType.Encoding != nil {
			for encPair := mediaType.Encoding.First(); encPair != nil; encPair = encPair.Next() {
				encoding := encPair.Value()
				if encoding == nil || encoding.Headers == nil {
					continue
				}
				// headers under an encoding carry a key segment only (no
				// 'headers' path segment), matching the walked model's paths.
				encodingPath := drV3.AppendKeySegment(mediaPath+".encoding", encPair.Key())
				for headerPair := encoding.Headers.First(); headerPair != nil; headerPair = headerPair.Next() {
					header := headerPair.Value()
					if header == nil {
						continue
					}
					headerPath := drV3.AppendKeySegment(encodingPath, headerPair.Key())
					if header.Schema != nil {
						populateSchemaProxyPath(cache, header.Schema, headerPath+".schema", visited, followRefs)
					}
					if header.Content != nil {
						prePopulateMediaTypeSchemas(cache, header.Content, headerPath, visited, followRefs)
					}
				}
			}
		}
	}
}

func prePopulateNestedSchemaPaths(
	cache *sync.Map,
	schema *highbase.Schema,
	basePath string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	// This walks libopenapi highbase.Schema objects before doctor v3.Schema
	// cache aliases exist, so alias-safe *ForRead accessors do not apply here.
	if cache == nil || schema == nil {
		return
	}

	if schema.Properties != nil {
		for pair := schema.Properties.First(); pair != nil; pair = pair.Next() {
			path := drV3.AppendKeySegment(basePath+".properties", pair.Key())
			populateSchemaProxyPath(cache, pair.Value(), path, visited, followRefs)
		}
	}

	for i, proxy := range schema.AllOf {
		path := drV3.AppendIndexSegment(basePath, "allOf", i)
		populateSchemaProxyPath(cache, proxy, path, visited, followRefs)
	}
	for i, proxy := range schema.OneOf {
		path := drV3.AppendIndexSegment(basePath, "oneOf", i)
		populateSchemaProxyPath(cache, proxy, path, visited, followRefs)
	}
	for i, proxy := range schema.AnyOf {
		path := drV3.AppendIndexSegment(basePath, "anyOf", i)
		populateSchemaProxyPath(cache, proxy, path, visited, followRefs)
	}
	for i, proxy := range schema.PrefixItems {
		path := drV3.AppendIndexSegment(basePath, "prefixItems", i)
		populateSchemaProxyPath(cache, proxy, path, visited, followRefs)
	}

	populateSchemaProxyPath(cache, schema.Not, basePath+".not", visited, followRefs)
	populateSchemaProxyPath(cache, schema.Contains, basePath+".contains", visited, followRefs)
	populateSchemaProxyPath(cache, schema.If, basePath+".if", visited, followRefs)
	populateSchemaProxyPath(cache, schema.Then, basePath+".then", visited, followRefs)
	populateSchemaProxyPath(cache, schema.Else, basePath+".else", visited, followRefs)
	populateSchemaProxyPath(cache, schema.PropertyNames, basePath+".propertyNames", visited, followRefs)
	populateSchemaProxyPath(cache, schema.UnevaluatedItems, basePath+".unevaluatedItems", visited, followRefs)
	populateSchemaProxyPath(cache, schema.ContentSchema, basePath+".contentSchema", visited, followRefs)

	if schema.Items != nil && schema.Items.IsA() && schema.Items.A != nil {
		populateSchemaProxyPath(cache, schema.Items.A, basePath+".items", visited, followRefs)
	}
	if schema.AdditionalProperties != nil && schema.AdditionalProperties.IsA() && schema.AdditionalProperties.A != nil {
		populateSchemaProxyPath(cache, schema.AdditionalProperties.A, basePath+".additionalProperties", visited, followRefs)
	}
	if schema.UnevaluatedProperties != nil && schema.UnevaluatedProperties.IsA() && schema.UnevaluatedProperties.A != nil {
		populateSchemaProxyPath(cache, schema.UnevaluatedProperties.A, basePath+".unevaluatedProperties", visited, followRefs)
	}

	if schema.DependentSchemas != nil {
		for pair := schema.DependentSchemas.First(); pair != nil; pair = pair.Next() {
			path := drV3.AppendKeySegment(basePath+".dependentSchemas", pair.Key())
			populateSchemaProxyPath(cache, pair.Value(), path, visited, followRefs)
		}
	}
	if schema.PatternProperties != nil {
		for pair := schema.PatternProperties.First(); pair != nil; pair = pair.Next() {
			path := drV3.AppendKeySegment(basePath+".patternProperties", pair.Key())
			populateSchemaProxyPath(cache, pair.Value(), path, visited, followRefs)
		}
	}
}

func populateSchemaProxyPath(
	cache *sync.Map,
	proxy *highbase.SchemaProxy,
	path string,
	visited map[*yaml.Node]bool,
	followRefs bool,
) {
	if cache == nil || proxy == nil {
		return
	}
	if proxy.IsReference() && !followRefs {
		return
	}

	resolved := proxy.Schema()
	if resolved == nil {
		return
	}
	low := resolved.GoLow()
	if low == nil || low.RootNode == nil {
		return
	}

	root := low.RootNode
	if visited[root] {
		return
	}

	cache.LoadOrStore(root, path)
	visited[root] = true
	prePopulateNestedSchemaPaths(cache, resolved, path, visited, followRefs)
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
					for k := range no {
						if ir, hj := gl.GoLowUntyped().(low.IsReferenced); hj {
							if ir.IsReference() {
								continue
							}
						}
						w.addLineObject(k, obj, ln)
					}
				}
			}
		} else {
			if fn, ko := obj.(drV3.Foundational); ko {
				kn := fn.GetKeyNode()
				if kn != nil {
					w.addLineObject(kn.Line, obj, ln)
				}
			}
		}
	}
}

func (w *DrDocument) addLineObject(line int, obj any, ln []any) {
	if w.lineObjects == nil {
		w.lineObjects = make(map[int][]any)
	}
	if w.lineObjectPtrs == nil {
		w.lineObjectPtrs = make(map[int]map[uintptr]struct{})
	}

	ptr := objectIdentity(obj)
	objects := w.lineObjects[line]

	if objects == nil {
		w.lineObjects[line] = []any{obj}
		if ptr != 0 {
			w.lineObjectPtrs[line] = map[uintptr]struct{}{ptr: {}}
		}

		if ln != nil {
			ln[line] = w.lineObjects[line]
		}
		return
	}

	if ptr != 0 {
		ptrs := w.lineObjectPtrs[line]
		if ptrs == nil {
			ptrs = make(map[uintptr]struct{}, len(objects))
			for _, existing := range objects {
				existingPtr := objectIdentity(existing)
				if existingPtr != 0 {
					ptrs[existingPtr] = struct{}{}
				}
			}
			w.lineObjectPtrs[line] = ptrs
		}
		if _, exists := ptrs[ptr]; exists {
			return
		}
	}

	path := obj.(drV3.Foundational).GenerateJSONPath()
	for _, existing := range objects {
		foundational, ok := existing.(drV3.Foundational)
		if ok && foundational.GenerateJSONPath() == path {
			if ptr != 0 {
				w.lineObjectPtrs[line][ptr] = struct{}{}
			}
			return
		}
	}

	w.lineObjects[line] = append(objects, obj)
	if ptr != 0 {
		w.lineObjectPtrs[line][ptr] = struct{}{}
	}
}

func objectIdentity(obj any) uintptr {
	if obj == nil {
		return 0
	}
	value := reflect.ValueOf(obj)
	if value.Kind() != reflect.Pointer || value.IsNil() {
		return 0
	}
	return value.Pointer()
}

func (w *DrDocument) BuildGraphMap() map[int]string {
	graphMap := make(map[int]string)
	graphLocationMap := w.BuildObjectLocationMap()
	for i, gi := range graphLocationMap {
		if d, k := gi.([]interface{}); k {
			for _, t := range d {
				if f, p := t.(drV3.Foundational); p {
					if f != nil {
						if f.GetNode() != nil {
							graphMap[i] = f.GetNode().Id
						}
					}
				}
			}
		}
		if f, k := gi.(drV3.Foundational); k {
			if f != nil {
				if f.GetNode() != nil {
					graphMap[i] = f.GetNode().Id
				}
			}
		}
	}
	return graphMap
}

func SanitizeGraph(nodes []*drV3.Node, santizePaths []string) {
	if nodes == nil {
		return
	}
	dive(nodes, 0, 10000, 0, 999999, santizePaths)
}

func dive(n []*drV3.Node, depth, limit, count, countLimit int, santizePaths []string) {
	if count >= countLimit {
		return
	}
	for _, node := range n {
		node.RenderChanges = true
		node.RenderProps = true
		node.RenderProblems = false
		//node.DrInstance = nil
		//node.Children = nil
		if len(node.Changes) > 0 {
			for _, ch := range node.Changes {
				for _, c := range ch.GetPropertyChanges() {
					if c.Context != nil {
						for _, p := range santizePaths {
							c.Context.DocumentLocation = strings.Replace(c.Context.DocumentLocation, p, "", 1)
						}
					}
				}
			}
		}

		if node.Origin != nil {
			o := node.Origin
			if o.AbsoluteLocation != "" {
				for _, p := range santizePaths {
					if strings.Contains(o.AbsoluteLocation, p) {
						if p != "" && p != "/" {
							o.AbsoluteLocation = strings.Replace(o.AbsoluteLocation, p, "", 1)
						}
					}
				}
			}
		}

		if node.DrInstance != nil {
			if f, ok := node.DrInstance.(drV3.AcceptsRuleResults); ok {
				if node.RenderProblems && len(f.GetRuleFunctionResults()) > 0 {
					for _, p := range f.GetRuleFunctionResults() {
						if p.Origin != nil {
							for _, sp := range santizePaths {
								p.Origin.AbsoluteLocation = strings.Replace(p.Origin.AbsoluteLocation, sp, "", 1)
							}
						}
					}
				}
			}
		}

		if node.Children != nil && depth < limit {
			dive(node.Children, depth+1, limit, count+1, countLimit, santizePaths)
		}
		if depth >= limit {
			node.Children = nil
		}
	}
	depth--
}
