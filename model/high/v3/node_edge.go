// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package v3

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/utils"
	what_changed "github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
	"go.yaml.in/yaml/v4"
	"reflect"
	"strings"
	"sync"
)

// Object pools for Node and Edge to reduce allocations
var (
	nodePool = sync.Pool{
		New: func() interface{} {
			return &Node{}
		},
	}
	edgePool = sync.Pool{
		New: func() interface{} {
			return &Edge{}
		},
	}
)

type Node struct {
	Value           *yaml.Node             `json:"-"`
	Id              string                 `json:"id"`
	IdHash          string                 `json:"idHash,omitempty"`
	ParentId        string                 `json:"parentId"`
	Type            string                 `json:"type"`
	Label           string                 `json:"label"`
	Width           int                    `json:"width"`
	Height          int                    `json:"height"`
	Children        []*Node                `json:"nodes,omitempty"`
	IsArray         bool                   `json:"isArray,omitempty"`
	IsPoly          bool                   `json:"isPoly,omitempty"`
	PolyType        string                 `json:"polyType,omitempty"`
	PropertyCount   int                    `json:"propertyCount,omitempty"`
	ArrayIndex      int                    `json:"arrayIndex,omitempty"`
	ArrayValues     int                    `json:"arrayValues,omitempty"`
	Extensions      int                    `json:"extensions,omitempty"`
	Hash            string                 `json:"hash,omitempty"`
	OriginLocation  string                 `json:"originLocation,omitempty"`
	Origin          *index.NodeOrigin      `json:"nodeOrigin,omitempty"`
	drModel         any                    `json:"-"`
	KeyLine         int                    `json:"-"`
	ValueLine       int                    `json:"valueLine"`
	Instance        any                    `json:"instance"`
	DrInstance      any                    `json:"-"`
	Changes         []what_changed.Changed `json:"-"`
	RenderedChanges []*model.Change        `json:"timeline,omitempty"`
	CleanedChanged  []*model.Change        `json:"cleanedChanges,omitempty"`
	RenderProps     bool                   `json:"-"`
	RenderChanges   bool                   `json:"-"`
	RenderProblems  bool                   `json:"-"`
}

type NodeChangeable interface {
	GetType() string
	GetLabel() string
	GetHash() string
	GetPath() string
}

type NodeChange struct {
	Id         string               `json:"id,omitempty"`
	IdHash     string               `json:"idHash,omitempty"`
	Type       string               `json:"type,omitempty"`
	Label      string               `json:"label,omitempty"`
	Path       string               `json:"path,omitempty"`
	Children   []*Node              `json:"nodes,omitempty"`
	ArrayIndex int                  `json:"arrayIndex,omitempty"`
	Changes    what_changed.Changed `json:"timeline,omitempty"`
}

func (n *NodeChange) GetType() string {
	return n.Type
}

func (n *NodeChange) GetLabel() string {
	return n.Label
}

func (n *NodeChange) GetHash() string {
	return n.IdHash
}

func (n *NodeChange) GetPath() string {
	return n.IdHash
}

func (n *NodeChange) GetAllChanges() []*model.Change {
	return n.Changes.GetAllChanges()
}

func (n *NodeChange) TotalChanges() int {
	return n.Changes.TotalChanges()
}

func (n *NodeChange) TotalBreakingChanges() int {
	return n.Changes.TotalBreakingChanges()
}

func (n *NodeChange) PropertiesOnly() {
	if n.Changes != nil {
		n.Changes.PropertiesOnly()
	}
}

func (n *NodeChange) GetPropertyChanges() []*model.Change {
	if n.Changes != nil {
		return n.Changes.GetPropertyChanges()
	}
	return nil
}

//func (n *NodeChange) MarshalJSON() ([]byte, error) {
//	propMap := map[string]interface{}{}
//	if n.Changes != nil && len(n.Changes.GetAllChanges()) > 0 {
//		propMap["id"] = n.Id
//		propMap["superHacks"] = n.Changes
//	}
//	return json.Marshal(propMap)
//}

type Edge struct {
	Id      string   `json:"id"`
	Sources []string `json:"sources"`
	Targets []string `json:"targets"`
	Poly    string   `json:"poly,omitempty"`
	Ref     string   `json:"ref"`
}

func (n *Node) MarshalJSON() ([]byte, error) {

	_, ref := utils.ConvertComponentIdIntoPath(n.Id)
	propMap := map[string]interface{}{
		"id":        n.Id,
		"idHash":    n.IdHash,
		"nodePath":  ref,
		"parentId":  n.ParentId,
		"type":      n.Type,
		"label":     n.Label,
		"width":     n.Width,
		"height":    n.Height,
		"keyLine":   n.KeyLine,
		"valueLine": n.ValueLine,
		"hash":      n.Hash,
	}
	if n.Origin != nil && n.Origin.AbsoluteLocation != "" {
		propMap["origin"] = n.Origin.AbsoluteLocation
	}

	if n.IsPoly || n.PolyType != "" {
		propMap["isPoly"] = n.IsPoly
		propMap["polyType"] = n.PolyType
	}

	if n.IsArray {
		propMap["isArray"] = true
		propMap["arrayValues"] = n.ArrayValues
	}

	if gl, kk := n.Instance.(high.GoesLowUntyped); kk {
		if ext, ok := gl.GoLowUntyped().(low.HasExtensions[*orderedmap.Map[low.KeyReference[string], low.ValueReference[*yaml.Node]]]); ok {
			if ext.GetExtensions() != nil {
				if ext.GetExtensions().Len() > 0 {
					propMap["extensions"] = ext.GetExtensions().Len()
				}
			}
		}
	}

	if n.Instance != nil {
		if n.RenderProps {
			if n.DrInstance != nil {
				if it, ok := n.DrInstance.(Foundational); ok {
					if it != nil && it.GetInstanceType() != "" {
						propMap["instanceType"] = it.GetInstanceType()
					}
				}
				if f, ok := n.DrInstance.(AcceptsRuleResults); ok {
					if n.RenderProblems && len(f.GetRuleFunctionResults()) > 0 {
						propMap["results"] = f.GetRuleFunctionResults()
					}
				}
			}
			propMap["instance"] = n.Instance
			if gl, ok := n.Instance.(high.GoesLowUntyped); ok {

				if _, kk := n.Instance.(high.Renderable); kk {

					if rn, oo := gl.GoLowUntyped().(low.HasRootNode); oo {
						var enc map[string]interface{}

						// check if this is a reference
						if r, ko := rn.(low.IsReferenced); ko {
							if r.IsReference() {
								enc = make(map[string]interface{})
								enc["$ref"] = r.GetReference()
							} else {
								_ = rn.GetRootNode().Decode(&enc)
							}
						}
						propMap["instance"] = enc
					}
				}
			}
		}
	}

	if n.ArrayIndex >= 0 {
		propMap["arrayIndex"] = n.ArrayIndex
	}
	if n.PropertyCount > 0 {
		propMap["propertyCount"] = n.PropertyCount
	}

	if n.RenderProps {
		if n.Children != nil && len(n.Children) > 0 {
			propMap["nodes"] = n.Children
		}
	}

	if n.RenderChanges {
		if n.Changes != nil && len(n.Changes) > 0 {

			var changes []*model.Change
			for _, ch := range n.Changes {
				changes = append(changes, ch.GetPropertyChanges()...)
			}
			if len(changes) > 0 {
				propMap["timeline"] = changes
			}
		}

		if n.RenderedChanges != nil {
			propMap["timeline"] = n.RenderedChanges
		}
	}

	pm, err := json.Marshal(propMap)

	return pm, err
}

func GenerateNode(parentId string, instance any, drModel any, ctx *DrContext) *Node {
	// Get a node from the pool
	n := nodePool.Get().(*Node)

	// Reset the node to clean state
	*n = Node{}

	// check if instance can go low
	var uuidValue string
	line := 1

	var nodeOrigin *index.NodeOrigin
	if instance != nil {
		uuidValue = instance.(Foundational).GenerateJSONPath()

		if hv, ok := drModel.(HasValue); ok {
			if gl, kk := hv.GetValue().(high.GoesLowUntyped); kk {
				if gl != nil && !reflect.ValueOf(gl).IsNil() {
					l := gl.GoLowUntyped()
					if l != nil {
						if hi, ko := l.(HasIndex); ko {
							idx := hi.GetIndex()
							if idx != nil {

								// check if this has a reference
								var refValue string
								var refNode *yaml.Node
								if ref, kt := l.(low.IsReferenced); kt {
									if ref.IsReference() {
										refValue = ref.GetReference()
										refNode = ref.GetReferenceNode()
									}
								}

								// locate the node origin using the rolodex
								kn := instance.(Foundational).GetKeyNode()
								vn := instance.(Foundational).GetValueNode()
								no := idx.GetRolodex().FindNodeOriginWithValue(kn, vn, refNode, refValue)

								if no != nil {
									// sanitize the absolute location.
									abs := no.AbsoluteLocation
									if ctx.StorageRoot != "" {
										no.AbsoluteLocation = strings.Replace(abs, ctx.StorageRoot, "", 1)
									}
									if ctx.WorkingDirectory != "" {
										no.AbsoluteLocation = strings.Replace(abs, ctx.WorkingDirectory, "", 1)
									}
									nodeOrigin = no
								}
							}
						}
					}
				}
			}
		}

	} else {
		uuidValue = uuid.New().String()
	}

	if nodeOrigin == nil {
		nodeOrigin = &index.NodeOrigin{
			AbsoluteLocation: "",
		}
	}

	// Set the node fields
	n.Id = uuidValue
	n.ParentId = parentId
	n.KeyLine = line
	n.ValueLine = line
	n.drModel = drModel
	n.Origin = nodeOrigin
	n.RenderChanges = ctx.RenderChanges
	n.RenderProblems = true

	return n
}

func GenerateEdge(sources []string, targets []string) *Edge {
	// Get an edge from the pool
	e := edgePool.Get().(*Edge)

	// Reset the edge to clean state
	*e = Edge{}

	// Use a simpler ID generation for edges to reduce UUID overhead
	// Format: source_target for single connections
	var id string
	if len(sources) == 1 && len(targets) == 1 {
		id = sources[0] + "_" + targets[0]
	} else {
		id = uuid.New().String()
	}

	e.Id = id
	e.Sources = sources
	e.Targets = targets

	return e
}

// ReleaseNode returns a node to the pool for reuse
func ReleaseNode(n *Node) {
	if n != nil {
		nodePool.Put(n)
	}
}

// ReleaseEdge returns an edge to the pool for reuse
func ReleaseEdge(e *Edge) {
	if e != nil {
		edgePool.Put(e)
	}
}

func ExtractKeyNodeForLowModel(obj any) *yaml.Node {
	if obj != nil {
		if hkn, ko := obj.(low.HasKeyNode); ko {
			if hkn.GetKeyNode() != nil {
				return hkn.GetKeyNode()
			}
		}
	}

	return nil
}

func ExtractValueNodeForLowModel(obj any) *yaml.Node {
	if obj != nil {
		if ref, ok := obj.(low.IsReferenced); ok {
			if ref.IsReference() {
				if hkn, ko := ref.(low.HasValueNodeUntyped); ko {
					if hkn.GetValueNode() != nil {
						return hkn.GetValueNode()
					}
				}
			}
		}
		if hkn, ko := obj.(low.HasValueNodeUntyped); ko {
			if hkn.GetValueNode() != nil {
				return hkn.GetValueNode()
			}
		}
		if hkn, ko := obj.(low.HasRootNode); ko {
			if hkn.GetRootNode() != nil {
				return hkn.GetRootNode()
			}
		}
	}
	return nil
}
