// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"gopkg.in/yaml.v3"
	"reflect"
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
}

type HasSize interface {
	GetSize() (height, width int)
}

type Foundation struct {
	PathSegment   string
	InstanceType  string
	IsIndexed     bool
	Index         *int
	Key           string
	PolyType      string
	Parent        any
	NodeParent    any
	RuleResults   []*RuleFunctionResult
	JSONPath      string
	Mutex         sync.Mutex
	Node          *Node
	NodeReference *Node // if the chain was broken, keep a reference
	Edges         []*Edge
	KeyNode       *yaml.Node
	ValueNode     *yaml.Node
	CacheSplit    bool
}

func (f *Foundation) GetInstanceType() string {
	return f.InstanceType
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
	if drCtx != nil && f != nil && f.NodeParent != nil && f.GetNodeParent().GetNode() != nil {
		if !drCtx.BuildGraph {
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
			n.PolyType = f.PolyType
		}

		n.ArrayIndex = arrayIndex
		n.Type = nodeType
		n.Label = label
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
		if f.Node == nil {
			panic("no node")
		}

		return n
	} else {
		panic("no parent node")
	}
	return nil
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

		if f.GetNode() == nil {
			panic("no node dude")
		}

		if drModel != nil {
			n.DrInstance = drModel
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
			drCtx.EdgeChan <- e
		}

		//is this a possible reference?
		if model != nil {
			if r, ok := model.GoLowUntyped().(low.IsReferenced); ok {
				if r.GetReferenceNode() != nil {

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
	return f.Parent.(Foundational)
}

func (f *Foundation) GetNodeParent() Foundational {
	if f.NodeParent == nil {
		return nil
	}
	return f.NodeParent.(Foundational)
}

func (f *Foundation) GetPathSegment() string {
	return f.PathSegment
}

func (f *Foundation) GenerateJSONPath() string {
	if f.JSONPath != "" {
		return f.JSONPath
	}
	path := f.GenerateJSONPathWithLevel(0)
	f.JSONPath = path
	return path
}

func (f *Foundation) GenerateJSONPathWithLevel(level int) string {
	level++
	if level > 150 {
		return f.PathSegment
	}
	sep := "."
	if f.Parent != nil {
		if f.Key != "" {
			if f.PathSegment == "" {
				sep = ""
			}
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "['" + f.Key + "']"
		}
		if f.IsIndexed {
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "[" + fmt.Sprint(*f.Index) + "]"
		}
		if f.CacheSplit {
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "CACHE-SPLIT[" + fmt.Sprint(*f.Index) + "]--"
		}
		if f.PathSegment == "" {
			sep = ""
		}
		return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment

	}
	if f.PathSegment == "document" {
		return "$"
	}
	return f.PathSegment
}

func (f *Foundation) SetNode(node *Node) {
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
	if f.Edges == nil {
		f.Edges = []*Edge{edge}
	} else {
		f.Mutex.Lock()
		f.Edges = append(f.Edges, edge)
		f.Mutex.Unlock()
	}
}

func (f *Foundation) GetNode() *Node {
	return f.Node
}

func (f *Foundation) GetRefNode() *Node {
	return f.NodeReference
}

func (f *Foundation) GetEdges() []*Edge {
	return f.Edges
}
