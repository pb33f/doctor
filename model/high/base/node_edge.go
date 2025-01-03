// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package base

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/utils"
	"gopkg.in/yaml.v3"
	"reflect"
	"strings"
)

type Node struct {
	Value         *yaml.Node        `json:"-"`
	Id            string            `json:"id"`
	IdHash        string            `json:"idHash,omitempty"`
	ParentId      string            `json:"parentId"`
	Type          string            `json:"type"`
	Label         string            `json:"label"`
	Width         int               `json:"width"`
	Height        int               `json:"height"`
	Children      []*Node           `json:"nodes,omitempty"`
	IsArray       bool              `json:"isArray,omitempty"`
	IsPoly        bool              `json:"isPoly,omitempty"`
	PolyType      string            `json:"polyType,omitempty"`
	PropertyCount int               `json:"propertyCount,omitempty"`
	ArrayIndex    int               `json:"arrayIndex,omitempty"`
	ArrayValues   int               `json:"arrayValues,omitempty"`
	Extensions    int               `json:"extensions,omitempty"`
	Hash          string            `json:"hash,omitempty"`
	Origin        *index.NodeOrigin `json:"origin,omitempty"`
	drModel       any               `json:"-"`
	KeyLine       int               `json:"-"`
	ValueLine     int               `json:"valueLine"`
	Instance      any               `json:"-"`
	DrInstance    any               `json:"-"`
	RenderProps   bool              `json:"-"`
}

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
	if n.Origin != nil {
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
					propMap["results"] = f.GetRuleFunctionResults()
				}
			}
			propMap["instance"] = n.Instance
			if gl, ok := n.Instance.(high.GoesLowUntyped); ok {

				if _, ok := n.Instance.(high.Renderable); ok {

					if rn, ok := gl.GoLowUntyped().(low.HasRootNode); ok {
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

	if !n.RenderProps {
		if n.Children != nil && len(n.Children) > 0 {
			propMap["nodes"] = n.Children
		}
	}

	return json.Marshal(propMap)
}

func GenerateNode(parentId string, instance any, drModel any, ctx *DrContext) *Node {
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

	return &Node{
		Id:        uuidValue,
		ParentId:  parentId,
		KeyLine:   line,
		ValueLine: line,
		drModel:   drModel,
		Origin:    nodeOrigin,
	}
}

func GenerateEdge(sources []string, targets []string) *Edge {
	return &Edge{
		Id:      uuid.New().String(),
		Sources: sources,
		Targets: targets,
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
