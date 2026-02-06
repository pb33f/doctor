// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"go.yaml.in/yaml/v4"
	"reflect"
	"strings"
	"sync"
)

type HasValue interface {
	GetValue() any
}
type HasIndex interface {
	GetIndex() *index.SpecIndex
}

type AcceptsRuleResults interface {
	AddRuleFunctionResult(result *RuleFunctionResult)
	GetRuleFunctionResults() []*RuleFunctionResult
}

// Foundational is the base interface for all models in the doctor. It provides a way to navigate the model
type Foundational interface {
	GetParent() Foundational
	GetNodeParent() Foundational
	GetPathSegment() string
	GetKeyValue() string
	GetIndexValue() *int
	GenerateJSONPath() string
	GenerateJSONPathWithLevel(level int) string
	GetRoot() Foundational
	SetNode(node *Node)
	AddEdge(edge *Edge)
	GetNode() *Node
	GetRefNode() *Node
	GetEdges() []*Edge
	GetKeyNode() *yaml.Node
	GetValueNode() *yaml.Node
	GetInstanceType() string
	SetInstanceType(instanceType string)
	GetChanges() []*NodeChange
	AddChanges(changes []*NodeChange)
	AddChange(changes *NodeChange)
}

type HasSize interface {
	GetSize() (height, width int)
}

type Foundation struct {
	PathSegment      string
	InstanceType     string
	IsIndexed        bool
	Index            *int
	Key              string
	PolyType         string
	Parent           any
	NodeParent       any
	RuleResults      []*RuleFunctionResult
	JSONPath         string
	Mutex            sync.RWMutex
	PathSegmentMutex sync.RWMutex // Separate mutex for PathSegment
	JSONPathOnce     sync.Once
	Node             *Node
	NodeReference    *Node // if the chain was broken, keep a reference
	Edges            []*Edge
	KeyNode          *yaml.Node
	ValueNode        *yaml.Node
	Changes          []*NodeChange
	CacheSplit       bool
}

func (f *Foundation) GetChanges() []*NodeChange {
	f.Mutex.RLock()
	defer f.Mutex.RUnlock()
	return f.Changes
}

func (f *Foundation) AddChanges(changes []*NodeChange) {
	f.Mutex.Lock()
	defer f.Mutex.Unlock()
	f.Changes = append(f.Changes, changes...)
}

func (f *Foundation) AddChange(change *NodeChange) {
	f.Mutex.Lock()
	defer f.Mutex.Unlock()
	f.Changes = append(f.Changes, change)
}

func (f *Foundation) GetKeyValue() string {
	return f.Key
}

func (f *Foundation) GetIndexValue() *int {
	return f.Index
}

func (f *Foundation) GetInstanceType() string {
	return f.InstanceType
}

func (f *Foundation) SetInstanceType(instanceType string) {
	f.InstanceType = instanceType
}

func (f *Foundation) GetKeyNode() *yaml.Node {
	return f.KeyNode
}

func (f *Foundation) GetValueNode() *yaml.Node {
	return f.ValueNode
}

func (f *Foundation) BuildReferenceEdge(ctx context.Context, source, destination, ref string, poly string) *Edge {
	drCtx := GetDrContext(ctx)
	if drCtx != nil && f != nil {
		if !drCtx.BuildGraph {
			return nil
		}
		e := GenerateEdge([]string{
			source,
		}, []string{
			destination,
		})
		if poly != "" {
			e.Poly = poly
		}
		e.Ref = ref
		f.AddEdge(e)
		drCtx.EdgeChan <- e
		return e
	}
	return nil
}

func AddChunkDefaultHeight(element any, height int) int {
	if element != nil && !reflect.ValueOf(element).IsNil() {
		return height + HEIGHT
	}
	return height
}

func (f *Foundation) BuildNode(ctx context.Context, label, nodeType string, arrayType bool, arrayCount, arrayIndex int, drModel any) *Node {
	drCtx := GetDrContext(ctx)

	// Early return if not building graph
	if drCtx == nil || !drCtx.BuildGraph {
		return nil
	}

	// Check prerequisites for node building
	if f == nil || f.NodeParent == nil || f.GetNodeParent().GetNode() == nil {
		// When BuildGraph is false or prerequisites not met, return nil without panic
		return nil
	}

	minWidth := 170
	n := GenerateNode(f.GetNodeParent().GetNode().Id, f, drModel, drCtx)
	f.SetNode(n)
	if arrayType {
		n.IsArray = true
		n.ArrayValues = arrayCount
	} else {
		n.PropertyCount = arrayCount
	}

	if f.PolyType != "" {
		n.IsPoly = true
		n.PolyType = drCtx.internString(f.PolyType)
	}

	n.RenderChanges = drCtx.RenderChanges
	n.ArrayIndex = arrayIndex
	n.Type = drCtx.internString(nodeType)
	n.Label = drCtx.internString(label)
	calc := len(label)*10 + 20
	if calc > minWidth {
		n.Width = calc
	} else {
		n.Width = minWidth
	}

	n.Height = 25

	switch nodeType {
	case "securitySchemes":
		n.Width = 230
	case "requestBodies":
		n.Width = 210
	}

	if f.ValueNode != nil {
		n.ValueLine = f.ValueNode.Line
	}
	if f.KeyNode != nil {
		n.KeyLine = f.KeyNode.Line
	}

	return n
}

func (f *Foundation) BuildNodesAndEdgesWithArray(ctx context.Context, label, nodeType string, model high.GoesLowUntyped, drModel any, arrayType bool, arrayCount int, arrayIndex *int) {
	f.ProcessNodesAndEdges(ctx, label, nodeType, model, drModel, arrayType, arrayCount, arrayIndex, false)
}

func (f *Foundation) ProcessNodesAndEdges(ctx context.Context, label, nodeType string, model high.GoesLowUntyped, drModel any, arrayType bool, arrayCount int, arrayIndex *int, schema bool) {
	drCtx := GetDrContext(ctx)
	parent := f.GetNodeParent()

	if drCtx != nil && f != nil && parent != nil && parent.GetNode() != nil {

		if !drCtx.BuildGraph {
			return
		}
		var n *Node
		n = f.BuildNode(ctx, label, nodeType, arrayType, arrayCount, *arrayIndex, drModel)

		// If the node wasn't created (e.g., prerequisites not met), return early
		if n == nil || f.GetNode() == nil {
			return
		}

		if drModel != nil {
			n.DrInstance = drModel
			// Set instance type on the drModel so GetInstanceType() returns correctly during serialization
			if foundational, ok := drModel.(Foundational); ok {
				foundational.SetInstanceType(nodeType)
			}
		}
		if model != nil {
			n.Instance = model
			if lowModel, ok := model.GoLowUntyped().(low.Hashable); ok {
				n.Hash = fmt.Sprintf("%x", lowModel.Hash())
			}
		}
		// hash this id. This is used to identify the node in the graph in a DOM friendly way.
		idHash := md5.Sum([]byte(n.Id))
		n.IdHash = hex.EncodeToString(idHash[:])

		if label != "" {
			drCtx.NodeChan <- n
		}

		if label == "" {
			parent = parent.GetNodeParent()

			f.NodeParent = parent
			if parent != nil && parent.GetNode() != nil {
				n.ParentId = parent.GetNode().Id
			}
		}

		var parentChildEdge *Edge
		if label != "" && parent != nil && parent.GetNode() != nil {
			e := GenerateEdge([]string{
				parent.GetNode().Id,
			}, []string{
				f.GetNode().Id,
			})

			if f.PolyType != "" {
				e.Poly = f.PolyType
			}

			parent.AddEdge(e)
			f.AddEdge(e)
			parentChildEdge = e
		}

		//is this a possible reference?
		if model != nil {
			if r, ok := model.GoLowUntyped().(low.IsReferenced); ok {
				if r.GetReferenceNode() != nil {
					// Set ref on the parent-child edge so it renders as a reference edge
					if parentChildEdge != nil {
						parentChildEdge.Ref = r.GetReference()
					}

					// check if the ref supports a root node
					if root, ko := model.GoLowUntyped().(low.HasValueNodeUntyped); ko {
						if root.GetValueNode() != nil {
							sourceId := fmt.Sprintf("%s", n.Id)
							target := fmt.Sprintf("%d", root.GetValueNode().Line)

							// build edge from the source
							f.BuildReferenceEdge(ctx, sourceId, target, r.GetReference(), "")

							// break the chain, no more rendering down this branch.
							copyNode := *f.GetNode()
							f.SetRefNode(&copyNode)
							f.SetNode(nil)
						}
					} else {
						if root, ko := model.GoLowUntyped().(low.HasRootNode); ko {
							if root.GetRootNode() != nil {
								sourceId := fmt.Sprintf("%s", n.Id)
								target := fmt.Sprintf("%d", root.GetRootNode().Line)

								// build edge from the source
								f.BuildReferenceEdge(ctx, sourceId, target, r.GetReference(), "")

								// break the chain, no more rendering down this branch.
								copyNode := *f.GetNode()
								f.SetRefNode(&copyNode)
								f.SetNode(nil)

							}
						}
					}
				}
			}
		}

		// Send edge after all fields (including Ref) are fully populated
		if parentChildEdge != nil {
			drCtx.EdgeChan <- parentChildEdge
		}
	}
}

func (f *Foundation) BuildSchemaNodeAndEdge(ctx context.Context, label string, model high.GoesLowUntyped, drModel any) {
	negOne := -1
	f.ProcessNodesAndEdges(ctx, label, "schema", model, drModel, false, 0, &negOne, true)
}

func (f *Foundation) BuildNodesAndEdges(ctx context.Context, label, nodeType string, model high.GoesLowUntyped, drModel any) {
	negOne := -1
	f.BuildNodesAndEdgesWithArray(ctx, label, nodeType, model, drModel, false, 0, &negOne)
}

func (f *Foundation) AddRuleFunctionResult(result *RuleFunctionResult) {
	result.ParentObject = f
	f.Mutex.Lock()
	if f.RuleResults == nil {
		f.RuleResults = []*RuleFunctionResult{result}
		if f.Parent != nil {
			root := f.GetRoot()
			root.(AcceptsRuleResults).AddRuleFunctionResult(result)
		}
		f.Mutex.Unlock()
		return
	}
	f.RuleResults = append(f.RuleResults, result)
	f.Mutex.Unlock()
	if f.Parent != nil {
		f.Mutex.Lock()
		f.GetRoot().(AcceptsRuleResults).AddRuleFunctionResult(result)
		f.Mutex.Unlock()
	}
}

func (f *Foundation) GetRoot() Foundational {
	if f.Parent == nil {
		return f
	}
	return f.Parent.(Foundational).GetRoot()
}

func (f *Foundation) GetRuleFunctionResults() []*RuleFunctionResult {
	return f.RuleResults
}

func (f *Foundation) GetParent() Foundational {
	if f.Parent == nil {
		return nil
	}
	return f.Parent.(Foundational)
}

func (f *Foundation) GetNodeParent() Foundational {
	if f.NodeParent == nil {
		return nil
	}
	return f.NodeParent.(Foundational)
}

func (f *Foundation) GetPathSegment() string {
	f.PathSegmentMutex.RLock()
	defer f.PathSegmentMutex.RUnlock()
	return f.PathSegment
}

func (f *Foundation) SetPathSegment(segment string) {
	f.PathSegmentMutex.Lock()
	defer f.PathSegmentMutex.Unlock()
	f.PathSegment = segment
}

func (f *Foundation) GenerateJSONPath() string {
	f.JSONPathOnce.Do(func() {
		f.JSONPath = f.buildJSONPathIterative()
	})
	return f.JSONPath
}

func (f *Foundation) buildJSONPathIterative() string {
	// Collect path segments bottom-up
	segments := make([]string, 0, 16) // Pre-allocate reasonable capacity
	var current Foundational = f
	depth := 0

	for current != nil && depth < 150 { // Keep the depth limit for safety
		depth++

		// Build the segment for current level
		var segment string
		key := current.GetKeyValue()
		pathSeg := current.GetPathSegment()
		index := current.GetIndexValue()

		// Check if this is a cache split (Foundation specific)
		cacheSplit := false
		if found, ok := current.(*Foundation); ok {
			cacheSplit = found.CacheSplit
		}

		if key != "" {
			if pathSeg == "" {
				segment = "['" + key + "']"
			} else {
				segment = pathSeg + "['" + key + "']"
			}
		} else if index != nil {
			if cacheSplit {
				segment = pathSeg + "CACHE-SPLIT[" + fmt.Sprint(*index) + "]--"
			} else {
				segment = pathSeg + "[" + fmt.Sprint(*index) + "]"
			}
		} else {
			segment = pathSeg
		}

		if segment != "" {
			segments = append(segments, segment)
		}

		// Move up the chain using the interface method
		parent := current.GetParent()
		if parent != nil {
			current = parent
		} else {
			break
		}
	}

	// Handle edge cases
	if len(segments) == 0 {
		if f.PathSegment == "document" || f.PathSegment == "$" {
			return "$"
		}
		return f.PathSegment
	}

	// Reverse segments (we collected bottom-up, need top-down)
	for i, j := 0, len(segments)-1; i < j; i, j = i+1, j-1 {
		segments[i], segments[j] = segments[j], segments[i]
	}

	// Handle document root
	if segments[0] == "document" || segments[0] == "$" {
		segments[0] = "$"
	}

	// Build the final path efficiently
	var result strings.Builder
	result.Grow(128) // Pre-allocate for typical paths

	for i, segment := range segments {
		if i == 0 {
			result.WriteString(segment)
		} else {
			// Add separator if needed (not for array/map access)
			if !strings.HasPrefix(segment, "[") && !strings.HasPrefix(segment, "CACHE-SPLIT[") {
				result.WriteByte('.')
			}
			result.WriteString(segment)
		}
	}

	return result.String()
}

func (f *Foundation) GenerateJSONPathWithLevel(level int) string {
	// For backward compatibility, just use the cached version
	// This ensures the same result with better performance
	return f.GenerateJSONPath()
}

func (f *Foundation) SetNode(node *Node) {
	f.Mutex.Lock()
	defer f.Mutex.Unlock()
	f.Node = node
}

func (f *Foundation) SetRefNode(node *Node) {
	f.NodeReference = node
}

func (f *Foundation) AddEdge(edge *Edge) {
	if f == nil {
		return
	}
	if edge == nil {
		return
	}
	f.Mutex.Lock()
	if f.Edges == nil {
		f.Edges = []*Edge{edge}
	} else {
		f.Edges = append(f.Edges, edge)
	}
	f.Mutex.Unlock()
}

func (f *Foundation) GetNode() *Node {
	f.Mutex.RLock()
	defer f.Mutex.RUnlock()
	return f.Node
}

func (f *Foundation) GetRefNode() *Node {
	return f.NodeReference
}

func (f *Foundation) GetEdges() []*Edge {
	return f.Edges
}

// CompareByParentPosition returns true if a's parent comes before b's parent
// in document order (lower line, or same line with lower column).
// This is used to ensure a deterministic schema collection when the same schema
// is encountered via multiple concurrent paths (e.g., via anyOf/oneOf refs).
// A nil parent (definition site) is always considered canonical.
func CompareByParentPosition(a, b Foundational) bool {
	aParent := a.GetNodeParent()
	bParent := b.GetNodeParent()

	// nil parent = definition site, always canonical
	if aParent == nil {
		return true
	}
	if bParent == nil {
		return false
	}

	aKey := aParent.GetKeyNode()
	bKey := bParent.GetKeyNode()

	// If either has no KeyNode, prefer the one without (likely definition site)
	if aKey == nil || bKey == nil {
		return aKey == nil
	}

	// Compare by line first, then column
	if aKey.Line != bKey.Line {
		return aKey.Line < bKey.Line
	}
	return aKey.Column < bKey.Column
}
