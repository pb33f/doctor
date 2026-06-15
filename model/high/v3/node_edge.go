// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package v3

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"reflect"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/pb33f/doctor/helpers"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/utils"
	what_changed "github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
	"go.yaml.in/yaml/v4"
)

// ChangeSummary holds aggregated change counts for a node's subtree.
type ChangeSummary struct {
	Additions     int `json:"additions"`
	Modifications int `json:"modifications"`
	Removals      int `json:"removals"`
	Breaking      int `json:"breaking"`
	Total         int `json:"total"`
}

// ChildChangeSummary represents one child row in change-view rendering.
// Go field "ChildChangeSummaries" serializes as JSON "childChanges" via MarshalJSON.
type ChildChangeSummary struct {
	Label   string         `json:"label"`
	Type    string         `json:"type"`
	IdHash  string         `json:"idHash"`
	NodeId  string         `json:"nodeId"`
	Changes *ChangeSummary `json:"changes"`
}

type Node struct {
	Value                *yaml.Node             `json:"-"`
	Id                   string                 `json:"id"`
	IdHash               string                 `json:"idHash,omitempty"`
	ParentId             string                 `json:"parentId"`
	Type                 string                 `json:"type"`
	Label                string                 `json:"label"`
	Width                int                    `json:"width"`
	Height               int                    `json:"height"`
	Children             []*Node                `json:"nodes,omitempty"`
	IsArray              bool                   `json:"isArray,omitempty"`
	IsPoly               bool                   `json:"isPoly,omitempty"`
	PolyType             string                 `json:"polyType,omitempty"`
	PropertyCount        int                    `json:"propertyCount,omitempty"`
	ArrayIndex           int                    `json:"arrayIndex,omitempty"`
	ArrayValues          int                    `json:"arrayValues,omitempty"`
	Extensions           int                    `json:"extensions,omitempty"`
	Hash                 string                 `json:"hash,omitempty"`
	OriginLocation       string                 `json:"originLocation,omitempty"`
	Origin               *index.NodeOrigin      `json:"nodeOrigin,omitempty"`
	KeyLine              int                    `json:"-"`
	ValueLine            int                    `json:"valueLine"`
	Instance             any                    `json:"instance"`
	DrInstance           any                    `json:"-"`
	Changes              []what_changed.Changed `json:"-"`
	RenderedChanges      []*model.Change        `json:"timeline,omitempty"`
	CleanedChanged       []*model.Change        `json:"cleanedChanges,omitempty"`
	SubtreeChanges       *ChangeSummary         `json:"-"`
	ChildChangeSummaries []*ChildChangeSummary  `json:"-"`
	RenderProps          bool                   `json:"-"`
	RenderChanges        bool                   `json:"-"`
	RenderProblems       bool                   `json:"-"`
	RenderProblemsAsIds  bool                   `json:"-"` // modified design to stop embedding violations in nodes, uses lookup now.
	ViolationIdMap       map[string]string      `json:"-"`
	Mutex                sync.RWMutex           `json:"-"`
	drModel              any
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
	Mutex      sync.RWMutex         `json:"-"`
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
	n.Mutex.RLock()
	defer n.Mutex.RUnlock()
	return n.Changes.GetAllChanges()
}

func (n *NodeChange) SetChanges(changes what_changed.Changed) {
	n.Mutex.Lock()
	defer n.Mutex.Unlock()
	n.Changes = changes
}

func (n *NodeChange) TotalChanges() int {
	n.Mutex.RLock()
	defer n.Mutex.RUnlock()
	return n.Changes.TotalChanges()
}

func (n *NodeChange) TotalBreakingChanges() int {
	return n.Changes.TotalBreakingChanges()
}

// Node methods for thread-safe access to Changes field
func (n *Node) GetChanges() []what_changed.Changed {
	n.Mutex.RLock()
	defer n.Mutex.RUnlock()
	return n.Changes
}

func (n *Node) AppendChange(change what_changed.Changed) {
	n.Mutex.Lock()
	defer n.Mutex.Unlock()
	n.Changes = append(n.Changes, change)
}

func (n *Node) GetInstance() any {
	n.Mutex.RLock()
	defer n.Mutex.RUnlock()
	return n.Instance
}

func (n *Node) SetInstance(instance any) {
	n.Mutex.Lock()
	defer n.Mutex.Unlock()
	n.Instance = instance
}

// CloneShallow copies node data without copying lock state. Slice and map
// fields remain shared with the source, matching the historical shallow-copy
// behavior.
func (n *Node) CloneShallow() *Node {
	if n == nil {
		return nil
	}
	return &Node{
		Value:                n.Value,
		Id:                   n.Id,
		IdHash:               n.IdHash,
		ParentId:             n.ParentId,
		Type:                 n.Type,
		Label:                n.Label,
		Width:                n.Width,
		Height:               n.Height,
		Children:             n.Children,
		IsArray:              n.IsArray,
		IsPoly:               n.IsPoly,
		PolyType:             n.PolyType,
		PropertyCount:        n.PropertyCount,
		ArrayIndex:           n.ArrayIndex,
		ArrayValues:          n.ArrayValues,
		Extensions:           n.Extensions,
		Hash:                 n.Hash,
		OriginLocation:       n.OriginLocation,
		Origin:               n.Origin,
		KeyLine:              n.KeyLine,
		ValueLine:            n.ValueLine,
		Instance:             n.Instance,
		DrInstance:           n.DrInstance,
		Changes:              n.Changes,
		RenderedChanges:      n.RenderedChanges,
		CleanedChanged:       n.CleanedChanged,
		SubtreeChanges:       n.SubtreeChanges,
		ChildChangeSummaries: n.ChildChangeSummaries,
		RenderProps:          n.RenderProps,
		RenderChanges:        n.RenderChanges,
		RenderProblems:       n.RenderProblems,
		RenderProblemsAsIds:  n.RenderProblemsAsIds,
		ViolationIdMap:       n.ViolationIdMap,
		drModel:              n.drModel,
	}
}

func (n *NodeChange) PropertiesOnly() {
	if n.Changes != nil {
		n.Changes.PropertiesOnly()
	}
}

func (n *NodeChange) GetPropertyChanges() []*model.Change {
	n.Mutex.RLock()
	defer n.Mutex.RUnlock()
	if n.Changes != nil {
		return n.Changes.GetPropertyChanges()
	}
	return nil
}

type Edge struct {
	Id      string   `json:"id"`
	Sources []string `json:"sources"`
	Targets []string `json:"targets"`
	Poly    string   `json:"poly,omitempty"`
	Ref     string   `json:"ref"`

	// TargetLine carries an unresolved reference target as a source line
	// number during the walk; it is resolved to a node id (Targets[0]) or the
	// edge is dropped before edges are published. Never serialized.
	TargetLine int `json:"-"`
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
					results := f.GetRuleFunctionResults()
					if len(results) > 0 {
						if n.RenderProblemsAsIds && n.ViolationIdMap != nil {
							// use ID references - violations map provided separately
							ids := make([]string, 0, len(results))
							for _, r := range results {
								key := r.Path + ":" + r.RuleId
								if id, exists := n.ViolationIdMap[key]; exists {
									ids = append(ids, id)
								}
							}
							if len(ids) > 0 {
								propMap["violationIds"] = ids // use new name!
							}
						} else if n.RenderProblems {
							// legacy mode: embed full violation objects
							propMap["results"] = results
						}
					}
				}
			}
			if gl, ok := n.Instance.(high.GoesLowUntyped); ok {

				if _, kk := n.Instance.(high.Renderable); kk {

					if rn, oo := gl.GoLowUntyped().(low.HasRootNode); oo {
						var enc map[string]interface{}

						// check if this is a reference
						if r, ko := rn.(low.IsReferenced); ko {
							if r.IsReference() {
								enc = make(map[string]interface{})
								enc["$ref"] = r.GetReference()
								propMap["instance"] = enc
							} else {
								_ = rn.GetRootNode().Decode(&enc)
								propMap["instance"] = helpers.ConvertInterfaceMapKeys(enc)
							}
						}
					}
				}
			} else {
				if _, kk := n.Instance.(map[string]interface{}); kk {
					propMap["instance"] = n.Instance
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
		if len(n.Children) > 0 {
			kids := make([]string, 0, len(n.Children))
			for _, c := range n.Children {
				kids = append(kids, c.Id)
			}
			propMap["nodes"] = kids
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

	if n.SubtreeChanges != nil {
		propMap["subtreeChanges"] = n.SubtreeChanges
	}
	if len(n.ChildChangeSummaries) > 0 {
		propMap["childChanges"] = n.ChildChangeSummaries
	}

	pm, err := json.Marshal(propMap)

	return pm, err
}

// NewSyntheticNode creates a minimal Node for use outside the normal model walk.
// It is sufficient for tree/explorer rendering and the report path, but does not
// participate in ELK layout, edges, or object channel emission.
func NewSyntheticNode(id, parentId, label, nodeType string) *Node {
	return &Node{
		Id:            id,
		IdHash:        NodeIDHash(id),
		ParentId:      parentId,
		Label:         label,
		Type:          nodeType,
		Width:         WIDTH,
		Height:        HEIGHT,
		RenderChanges: true,
		RenderProps:   true,
	}
}

func NodeIDHash(id string) string {
	sum := md5.Sum([]byte(id))
	return hex.EncodeToString(sum[:])
}

func GenerateNode(parentId string, instance any, drModel any, ctx *DrContext) *Node {
	n := &Node{}

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
	n.RenderProblems = false // TODO: revisit this and re-review later.

	return n
}

func GenerateEdge(sources []string, targets []string) *Edge {
	e := &Edge{}

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

// ReleaseNode is retained for source compatibility.
func ReleaseNode(n *Node) {
}

// ReleaseEdge is retained for source compatibility.
func ReleaseEdge(e *Edge) {
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
