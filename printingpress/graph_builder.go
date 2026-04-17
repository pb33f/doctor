// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"strings"

	drModel "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

const defaultMaxDepth = 5

// SchemaNodeID returns the canonical node ID for a component schema.
func SchemaNodeID(componentType, name string) string {
	ref := fmt.Sprintf("#/components/%s/%s", componentType, name)
	return v3.RefToJSONPath(ref)
}

// focusedGraphResult is the JSON output format matching the explorer's GraphResponse.
type focusedGraphResult struct {
	Mode          drModel.GraphMode `json:"mode"`
	Nodes         []json.RawMessage `json:"nodes"`
	Edges         []*focusedEdge    `json:"edges"`
	Stripped      bool              `json:"stripped,omitempty"`
	StrippedCount int               `json:"strippedCount,omitempty"`
}

type focusedEdge struct {
	Id         string   `json:"id"`
	Sources    []string `json:"sources"`
	Targets    []string `json:"targets"`
	Poly       string   `json:"poly,omitempty"`
	Ref        string   `json:"ref"`
	Dependency bool     `json:"dependency,omitempty"`
}

type edgeEntry struct {
	edge     *v3.Edge
	targetID string
	sourceID string
}

type focusedGraphIndex struct {
	allEdges          []*v3.Edge
	nodesByID         map[string]*v3.Node
	nodeHrefs         map[string]string
	topLevelSchemas   map[string]bool
	schemaSubPaths    map[string][]string
	subPathOwner      map[string]string
	refEdgesBySource  map[string][]edgeEntry
	refEdgesByTarget  map[string][]edgeEntry
	schemaHasIncoming map[string]bool
	schemaHasOutgoing map[string]bool
}

func newFocusedGraphIndex(allNodes []*v3.Node, allEdges []*v3.Edge, nodeHrefs map[string]string) *focusedGraphIndex {
	idx := &focusedGraphIndex{
		allEdges:          allEdges,
		nodesByID:         make(map[string]*v3.Node, len(allNodes)),
		nodeHrefs:         make(map[string]string, len(nodeHrefs)),
		topLevelSchemas:   make(map[string]bool),
		schemaSubPaths:    make(map[string][]string),
		subPathOwner:      make(map[string]string),
		refEdgesBySource:  make(map[string][]edgeEntry),
		refEdgesByTarget:  make(map[string][]edgeEntry),
		schemaHasIncoming: make(map[string]bool),
		schemaHasOutgoing: make(map[string]bool),
	}
	for id, href := range nodeHrefs {
		idx.nodeHrefs[id] = href
	}

	for _, n := range allNodes {
		idx.nodesByID[n.Id] = n
		if n.Type == "schema" && n.ParentId == "$.components.schemas" {
			idx.topLevelSchemas[n.Id] = true
		}
	}

	noTopLevelOwner := make(map[string]bool)
	resolveOwnerByParentChain := func(nodeID string) (string, bool) {
		if idx.topLevelSchemas[nodeID] {
			return nodeID, true
		}
		if owner, ok := idx.subPathOwner[nodeID]; ok {
			return owner, true
		}
		if noTopLevelOwner[nodeID] {
			return "", false
		}

		visited := make([]string, 0, 8)
		currentID := nodeID
		for currentID != "" {
			if idx.topLevelSchemas[currentID] {
				for _, visitedID := range visited {
					idx.subPathOwner[visitedID] = currentID
				}
				return currentID, true
			}
			if owner, ok := idx.subPathOwner[currentID]; ok {
				for _, visitedID := range visited {
					idx.subPathOwner[visitedID] = owner
				}
				return owner, true
			}
			if noTopLevelOwner[currentID] {
				break
			}

			node := idx.nodesByID[currentID]
			if node == nil || node.ParentId == "" || node.ParentId == currentID {
				break
			}
			visited = append(visited, currentID)
			currentID = node.ParentId
		}

		for _, visitedID := range visited {
			noTopLevelOwner[visitedID] = true
		}
		noTopLevelOwner[nodeID] = true
		return "", false
	}

	for _, n := range allNodes {
		if idx.topLevelSchemas[n.Id] {
			continue
		}
		owner, ok := resolveOwnerByParentChain(n.Id)
		if !ok {
			continue
		}
		idx.schemaSubPaths[owner] = append(idx.schemaSubPaths[owner], n.Id)
	}

	for _, e := range allEdges {
		if e.Ref == "" {
			continue
		}
		for _, src := range e.Sources {
			for _, tgt := range e.Targets {
				entry := edgeEntry{edge: e, targetID: tgt, sourceID: src}
				idx.refEdgesBySource[src] = append(idx.refEdgesBySource[src], entry)
				idx.refEdgesByTarget[tgt] = append(idx.refEdgesByTarget[tgt], entry)

				sourceOwner, sourceOK := idx.resolveToTopLevel(src)
				targetOwner, targetOK := idx.resolveToTopLevel(tgt)
				if sourceOK && targetOK {
					idx.schemaHasOutgoing[sourceOwner] = true
					idx.schemaHasIncoming[targetOwner] = true
				}
			}
		}
	}

	return idx
}

func (idx *focusedGraphIndex) resolveToTopLevel(nodeID string) (string, bool) {
	if idx.topLevelSchemas[nodeID] {
		return nodeID, true
	}
	if owner, ok := idx.subPathOwner[nodeID]; ok {
		return owner, true
	}
	return "", false
}

func (idx *focusedGraphIndex) hasTargetNode(nodeID string) bool {
	_, ok := idx.nodesByID[nodeID]
	return ok
}

func (idx *focusedGraphIndex) hasSchemaConnections(schemaID string) bool {
	return idx.schemaHasIncoming[schemaID] || idx.schemaHasOutgoing[schemaID]
}

func (idx *focusedGraphIndex) visitOutgoingEdgesFor(schemaID string, fn func(edgeEntry)) {
	for _, entry := range idx.refEdgesBySource[schemaID] {
		fn(entry)
	}
	for _, subID := range idx.schemaSubPaths[schemaID] {
		for _, entry := range idx.refEdgesBySource[subID] {
			fn(entry)
		}
	}
}

func (idx *focusedGraphIndex) visitIncomingEdgesFor(schemaID string, fn func(edgeEntry)) {
	for _, entry := range idx.refEdgesByTarget[schemaID] {
		fn(entry)
	}
	for _, subID := range idx.schemaSubPaths[schemaID] {
		for _, entry := range idx.refEdgesByTarget[subID] {
			fn(entry)
		}
	}
}

func (idx *focusedGraphIndex) buildFocusedGraph(targetNodeID string, maxDepth int) (string, error) {
	result, err := idx.buildFocusedGraphResult(targetNodeID, maxDepth)
	if err != nil || result == nil {
		return "", err
	}
	b, err := json.Marshal(result)
	if err != nil {
		return "", fmt.Errorf("marshaling focused graph: %w", err)
	}
	return string(b), nil
}

func (idx *focusedGraphIndex) buildFocusedModelGraph(
	targetNodeID string, maxDepth int, usedByOperations []*OperationRef,
) (string, error) {
	result, err := idx.buildFocusedGraphResult(targetNodeID, maxDepth)
	if err != nil {
		return "", err
	}
	if len(usedByOperations) == 0 {
		if result == nil {
			return "", nil
		}
		b, err := json.Marshal(result)
		if err != nil {
			return "", fmt.Errorf("marshaling focused graph: %w", err)
		}
		return string(b), nil
	}

	targetNode := idx.nodesByID[targetNodeID]
	if targetNode == nil {
		return "", nil
	}

	if result == nil {
		nodeBytes, err := marshalFocusedNodeJSON(targetNode, idx.nodeHrefs[targetNodeID])
		if err != nil {
			return "", fmt.Errorf("marshaling target node for operation augmentation: %w", err)
		}
		result = &focusedGraphResult{
			Mode:  drModel.GraphModeStandard,
			Nodes: []json.RawMessage{nodeBytes},
		}
	}

	includedNodeIDs := make(map[string]bool, len(result.Nodes))
	for _, nodeJSON := range result.Nodes {
		var nodeMap map[string]json.RawMessage
		if err := json.Unmarshal(nodeJSON, &nodeMap); err != nil {
			continue
		}
		var nodeID string
		if err := json.Unmarshal(nodeMap["id"], &nodeID); err != nil {
			continue
		}
		includedNodeIDs[nodeID] = true
	}

	seenEdges := make(map[string]bool, len(result.Edges))
	for _, edge := range result.Edges {
		if edge == nil {
			continue
		}
		seenEdges[edge.Id] = true
	}

	for _, op := range usedByOperations {
		if op == nil {
			continue
		}
		syntheticID := syntheticOperationConsumerNodeID(op)
		if !includedNodeIDs[syntheticID] {
			nodeJSON, err := buildSyntheticOperationConsumerNode(op)
			if err != nil {
				return "", err
			}
			result.Nodes = append(result.Nodes, nodeJSON)
			includedNodeIDs[syntheticID] = true
		}

		edgeID := syntheticOperationConsumerEdgeID(op, targetNodeID)
		if seenEdges[edgeID] {
			continue
		}
		result.Edges = append(result.Edges, &focusedEdge{
			Id:         edgeID,
			Sources:    []string{syntheticID},
			Targets:    []string{targetNodeID},
			Ref:        syntheticOperationConsumerRef(op),
			Dependency: true,
		})
		seenEdges[edgeID] = true
	}

	if len(result.Nodes) <= 1 {
		return "", nil
	}

	b, err := json.Marshal(result)
	if err != nil {
		return "", fmt.Errorf("marshaling augmented focused graph: %w", err)
	}
	return string(b), nil
}

func (idx *focusedGraphIndex) buildFocusedGraphResult(targetNodeID string, maxDepth int) (*focusedGraphResult, error) {
	if targetNodeID == "" || len(idx.nodesByID) == 0 {
		return nil, nil
	}
	if maxDepth <= 0 {
		maxDepth = defaultMaxDepth
	}
	if !idx.hasTargetNode(targetNodeID) || !idx.hasSchemaConnections(targetNodeID) {
		return nil, nil
	}

	type bfsEntry struct {
		nodeID string
		depth  int
	}

	included := map[string]bool{targetNodeID: true}
	isDependency := make(map[string]bool)
	outgoingVisited := map[string]bool{targetNodeID: true}
	incomingVisited := map[string]bool{targetNodeID: true}
	strippedCount := 0

	queue := []bfsEntry{{nodeID: targetNodeID, depth: 0}}
	for len(queue) > 0 {
		entry := queue[0]
		queue = queue[1:]
		if entry.depth >= maxDepth {
			continue
		}

		idx.visitOutgoingEdgesFor(entry.nodeID, func(ee edgeEntry) {
			tlID, ok := idx.resolveToTopLevel(ee.targetID)
			if !ok {
				return
			}
			if entry.depth+1 > maxDepth && !outgoingVisited[tlID] {
				strippedCount++
				return
			}
			if outgoingVisited[tlID] {
				return
			}
			outgoingVisited[tlID] = true
			included[tlID] = true
			queue = append(queue, bfsEntry{nodeID: tlID, depth: entry.depth + 1})
		})
	}

	queue = []bfsEntry{{nodeID: targetNodeID, depth: 0}}
	for len(queue) > 0 {
		entry := queue[0]
		queue = queue[1:]
		if entry.depth >= maxDepth {
			continue
		}

		idx.visitIncomingEdgesFor(entry.nodeID, func(ee edgeEntry) {
			tlID, ok := idx.resolveToTopLevel(ee.sourceID)
			if !ok {
				return
			}
			if entry.depth+1 > maxDepth && !incomingVisited[tlID] {
				strippedCount++
				return
			}
			if !incomingVisited[tlID] {
				incomingVisited[tlID] = true
				included[tlID] = true
				if tlID != targetNodeID {
					isDependency[tlID] = true
				}
				queue = append(queue, bfsEntry{nodeID: tlID, depth: entry.depth + 1})
				return
			}
			if tlID != targetNodeID && tlID != "" {
				isDependency[tlID] = true
			}
		})
	}

	if len(included) <= 1 {
		return nil, nil
	}

	nodeJSONs := make([]json.RawMessage, 0, len(included))
	for id := range included {
		node := idx.nodesByID[id]
		if node == nil {
			continue
		}
		nodeBytes, err := marshalFocusedNodeJSON(node, idx.nodeHrefs[id])
		if err != nil {
			continue
		}
		if isDependency[id] {
			nodeBytes, err = injectDependencyFlag(nodeBytes)
			if err != nil {
				continue
			}
		}
		nodeJSONs = append(nodeJSONs, nodeBytes)
	}

	return &focusedGraphResult{
		Mode:          drModel.GraphModeStandard,
		Nodes:         nodeJSONs,
		Edges:         idx.collectFocusedEdges(included, isDependency, targetNodeID),
		Stripped:      strippedCount > 0,
		StrippedCount: strippedCount,
	}, nil
}

func (idx *focusedGraphIndex) collectFocusedEdges(
	included map[string]bool, isDependency map[string]bool, targetNodeID string,
) []*focusedEdge {
	var edges []*focusedEdge
	seenEdges := make(map[string]bool)

	for id := range included {
		idx.visitOutgoingEdgesFor(id, func(ee edgeEntry) {
			e := ee.edge
			normalizedSources := make([]string, 0, len(e.Sources))
			for _, src := range e.Sources {
				tlID, ok := idx.resolveToTopLevel(src)
				if !ok || !included[tlID] {
					return
				}
				normalizedSources = append(normalizedSources, tlID)
			}

			normalizedTargets := make([]string, 0, len(e.Targets))
			for _, tgt := range e.Targets {
				tlID, ok := idx.resolveToTopLevel(tgt)
				if !ok || !included[tlID] {
					return
				}
				normalizedTargets = append(normalizedTargets, tlID)
			}

			edgeKey := strings.Join(normalizedSources, ",") + "->" + strings.Join(normalizedTargets, ",") +
				"|" + e.Ref + "|" + e.Poly
			if seenEdges[edgeKey] {
				return
			}
			seenEdges[edgeKey] = true
			edgeDependency := false
			for _, src := range normalizedSources {
				if src != targetNodeID && isDependency[src] {
					edgeDependency = true
					break
				}
			}
			edges = append(edges, &focusedEdge{
				Id:         edgeKey,
				Sources:    normalizedSources,
				Targets:    normalizedTargets,
				Poly:       e.Poly,
				Ref:        e.Ref,
				Dependency: edgeDependency,
			})
		})
	}

	return edges
}

// BuildFocusedModelGraph builds a focused schema graph for a model page.
//
// It includes nearby schema dependencies and any operations that use the model.
func BuildFocusedModelGraph(
	allNodes []*v3.Node, allEdges []*v3.Edge, targetNodeID string, maxDepth int, usedByOperations []*OperationRef,
) (string, error) {
	idx := newFocusedGraphIndex(allNodes, allEdges, nil)
	return idx.buildFocusedModelGraph(targetNodeID, maxDepth, usedByOperations)
}

// BuildFocusedGraph builds a focused dependency graph around targetNodeID.
//
// It returns explorer JSON, or an empty string when the target has no graph.
func BuildFocusedGraph(allNodes []*v3.Node, allEdges []*v3.Edge, targetNodeID string, maxDepth int) (string, error) {
	idx := newFocusedGraphIndex(allNodes, allEdges, nil)
	return idx.buildFocusedGraph(targetNodeID, maxDepth)
}

func marshalFocusedNodeJSON(node *v3.Node, href string) ([]byte, error) {
	nodeCopy := *node
	nodeCopy.RenderProps = true
	if shouldTrimFocusedSchemaExampleRow(&nodeCopy) {
		nodeCopy.Height -= v3.HEIGHT
		if nodeCopy.Height < v3.HEIGHT {
			nodeCopy.Height = v3.HEIGHT
		}
	}
	nodeJSON, err := json.Marshal(&nodeCopy)
	if err != nil {
		return nil, err
	}
	if href == "" {
		return nodeJSON, nil
	}
	return injectNodeAttrs(nodeJSON, map[string]any{"href": href})
}

func shouldTrimFocusedSchemaExampleRow(node *v3.Node) bool {
	if node == nil || node.Type != "schema" {
		return false
	}
	schema := schemaFromFocusedNode(node)
	if schema == nil {
		return false
	}
	return schemaReservesNoExamplesRow(schema)
}

func schemaFromFocusedNode(node *v3.Node) *base.Schema {
	switch inst := node.DrInstance.(type) {
	case *v3.Schema:
		return inst.Value
	case *v3.SchemaProxy:
		if inst.Value != nil {
			return inst.Value.Schema()
		}
	}
	switch inst := node.Instance.(type) {
	case *base.Schema:
		return inst
	case *base.SchemaProxy:
		return inst.Schema()
	}
	return nil
}

func schemaReservesNoExamplesRow(schema *base.Schema) bool {
	if schema == nil {
		return false
	}

	schemaHasExamples := len(schema.Examples) > 0 || schema.Example != nil

	allPropertiesHaveExamples := false
	if schema.Properties != nil && schema.Properties.Len() > 0 {
		allPropertiesHaveExamples = true
		for prop := schema.Properties.First(); prop != nil; prop = prop.Next() {
			propSchema := prop.Value().Schema()
			if propSchema == nil {
				allPropertiesHaveExamples = false
				break
			}
			hasEnum := len(propSchema.Enum) > 0
			isBoolean := len(propSchema.Type) == 1 && propSchema.Type[0] == "boolean"
			hasDefault := propSchema.Default != nil
			if hasEnum || isBoolean || hasDefault {
				continue
			}
			if propSchema.Example == nil && len(propSchema.Examples) == 0 {
				allPropertiesHaveExamples = false
				break
			}
		}
	}

	allPolyChildrenHaveExamples := false
	polyChildren := append(append(schema.AllOf, schema.AnyOf...), schema.OneOf...)
	if len(polyChildren) > 0 {
		allPolyChildrenHaveExamples = true
		for _, child := range polyChildren {
			childSchema := child.Schema()
			if childSchema == nil {
				allPolyChildrenHaveExamples = false
				break
			}
			hasEnum := len(childSchema.Enum) > 0
			isBoolean := len(childSchema.Type) == 1 && childSchema.Type[0] == "boolean"
			hasDefault := childSchema.Default != nil
			if hasEnum || isBoolean || hasDefault {
				continue
			}
			if childSchema.Example == nil && len(childSchema.Examples) == 0 {
				allPolyChildrenHaveExamples = false
				break
			}
		}
	}

	return !schemaHasExamples && !allPropertiesHaveExamples && !allPolyChildrenHaveExamples
}

// injectNodeAttrs adds extra fields to an already-marshaled JSON node object.
func injectNodeAttrs(nodeJSON []byte, attrs map[string]any) ([]byte, error) {
	var m map[string]json.RawMessage
	if err := json.Unmarshal(nodeJSON, &m); err != nil {
		return nodeJSON, err
	}
	for key, value := range attrs {
		attrJSON, err := json.Marshal(value)
		if err != nil {
			return nodeJSON, err
		}
		m[key] = attrJSON
	}
	return json.Marshal(m)
}

// injectDependencyFlag adds "dependency":true to an already-marshaled JSON node object.
func injectDependencyFlag(nodeJSON []byte) ([]byte, error) {
	return injectNodeAttrs(nodeJSON, map[string]any{"dependency": true})
}

func syntheticOperationConsumerNodeID(op *OperationRef) string {
	return fmt.Sprintf("$.x-pb33f.operationConsumers['%s']", op.Slug)
}

func syntheticOperationConsumerRef(op *OperationRef) string {
	return fmt.Sprintf("operation-consumer:%s:%s", op.Method, op.Path)
}

func syntheticOperationConsumerEdgeID(op *OperationRef, targetNodeID string) string {
	return fmt.Sprintf("%s->%s|%s", syntheticOperationConsumerNodeID(op), targetNodeID, syntheticOperationConsumerRef(op))
}

func buildSyntheticOperationConsumerNode(op *OperationRef) (json.RawMessage, error) {
	methodKey := strings.ToLower(op.Method)
	instance := map[string]any{
		methodKey: map[string]any{},
	}

	node := v3.NewSyntheticNode(
		syntheticOperationConsumerNodeID(op),
		"$.x-pb33f.operationConsumers",
		op.Path,
		"pathItem",
	)
	node.Instance = instance
	node.RenderProps = true
	node.IsArray = false
	node.ArrayValues = 0
	pathWidth := len(op.Path)*10 + 80
	if pathWidth < 320 {
		pathWidth = 320
	}
	if pathWidth > 720 {
		pathWidth = 720
	}
	node.Width = pathWidth

	nodeBytes, err := json.Marshal(node)
	if err != nil {
		return nil, fmt.Errorf("marshaling synthetic operation consumer node: %w", err)
	}
	nodeBytes, err = injectNodeAttrs(nodeBytes, map[string]any{
		"dependency": true,
		"href":       pppaths.OperationHTML(op.Slug),
	})
	if err != nil {
		return nil, fmt.Errorf("injecting dependency flag into synthetic operation consumer node: %w", err)
	}
	return nodeBytes, nil
}
