// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/pb33f/libopenapi/datamodel/high"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/utils"
	"gopkg.in/yaml.v3"
	"sync"
)

type HasValue interface {
	GetValue() any
}

type AcceptsRuleResults interface {
	AddRuleFunctionResult(result *RuleFunctionResult)
	GetRuleFunctionResults() []*RuleFunctionResult
}

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
	GetEdges() []*Edge
	GetKeyNode() *yaml.Node
	GetValueNode() *yaml.Node
}

type Foundation struct {
	PathSegment string
	IsIndexed   bool
	Index       int
	Key         string
	Parent      any
	NodeParent  any
	RuleResults []*RuleFunctionResult
	JSONPath    string
	Mutex       sync.Mutex
	Node        *Node
	Edges       []*Edge
	KeyNode     *yaml.Node
	ValueNode   *yaml.Node
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

func (f *Foundation) BuildNode(ctx context.Context, label, nodeType string) *Node {
	drCtx := GetDrContext(ctx)
	if drCtx != nil && f != nil && f.NodeParent != nil && f.GetNodeParent().GetNode() != nil {
		if !drCtx.BuildGraph {
			return nil
		}
		minWidth := 170
		n := GenerateNode(f.GetNodeParent().GetNode().Id, f)
		f.SetNode(n)
		n.Type = nodeType
		n.Label = label
		calc := len(label)*10 + 20
		if calc > minWidth {
			n.Width = calc
		} else {
			n.Width = minWidth
		}

		n.Height = 25
		if f.ValueNode != nil {
			n.ValueLine = f.ValueNode.Line
		}
		if f.KeyNode != nil {
			n.KeyLine = f.KeyNode.Line
		}
		return n
	}
	return nil
}

func (f *Foundation) BuildNodesAndEdges(ctx context.Context, label, nodeType string, model high.GoesLowUntyped, drModel any) {
	drCtx := GetDrContext(ctx)
	parent := f.GetNodeParent()

	if drCtx != nil && f != nil && parent != nil && parent.GetNode() != nil {

		if !drCtx.BuildGraph {
			return
		}

		var n *Node
		n = f.BuildNode(ctx, label, nodeType)
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
			n.Id = n.ParentId

			if parent.GetNode() == nil {
				fmt.Println("no parent node")
			} else {
				n.ParentId = parent.GetNode().Id
			}
		}

		if label != "" && parent.GetNode() != nil {
			e := GenerateEdge([]string{
				parent.GetNode().Id,
			}, []string{
				f.GetNode().Id,
			})
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
								f.SetNode(nil)
							}
						}
					}
				}
			}
		}
	}
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
			//if f.PathSegment == "" {
			//	sep = ""
			//}
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "[" + fmt.Sprint(f.Index) + "]"
		}
		if f.PathSegment == "" {
			sep = ""
		}
		return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment

	}
	return f.PathSegment
}

func (f *Foundation) SetNode(node *Node) {
	f.Node = node
}

func (f *Foundation) AddEdge(edge *Edge) {
	if f == nil {
		panic("hweeeeeyyyyyy")
	}
	if edge == nil {
		panic("hweeeeeyyyyyy")
	}
	if f.Edges == nil {
		f.Edges = []*Edge{edge}
	} else {
		f.Edges = append(f.Edges, edge)
	}

}

func (f *Foundation) GetNode() *Node {
	return f.Node
}

func (f *Foundation) GetEdges() []*Edge {
	return f.Edges
}

type Node struct {
	Value       *yaml.Node `json:"-"`
	Id          string     `json:"id"`
	IdHash      string     `json:"idHash,omitempty"`
	ParentId    string     `json:"parentId"`
	Type        string     `json:"type"`
	Label       string     `json:"label"`
	Width       int        `json:"width"`
	Height      int        `json:"height"`
	Children    []*Node    `json:"nodes,omitempty"`
	Hash        string     `json:"hash,omitempty"`
	KeyLine     int        `json:"-"`
	ValueLine   int        `json:"valueLine"`
	Instance    any        `json:"-"`
	DrInstance  any        `json:"-"`
	RenderProps bool       `json:"-"`
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
	if !n.RenderProps {
		if n.Children != nil && len(n.Children) > 0 {
			propMap["nodes"] = n.Children
		}
	}

	//instancePropMap := make(map[string]interface{})

	if n.Instance != nil {
		//v := reflect.ValueOf(n.Instance).Elem()
		//num := v.NumField()
		//for i := 0; i < num; i++ {
		//	field := v.Type().Field(i)
		//	if field.Name == "low" {
		//		continue
		//	}
		//
		//	tag := field.Tag.Get("json")
		//	tagName := strings.Split(tag, ",")[0]
		//
		//	if tag == "-" {
		//		continue // ignore this field
		//	}
		//
		//	var fv reflect.Value
		//	if n.Type == "schema" {
		//		fv = v.Field(i)
		//		if sp, ok := n.Instance.(*base.SchemaProxy); ok {
		//			v = reflect.ValueOf(sp.Schema()).Elem()
		//		}
		//
		//		//if field.Type == reflect.TypeOf(&base.SchemaProxy{}) {
		//		//fmt.Println("schema proxy")
		//
		//		//reflect.ValueOf(n).Elem()
		//		//}
		//
		//	}
		//
		//	fv = v.Field(i)
		//	fmt.Println(field.Name + " -- " + n.Id)
		//	var value reflect.Value
		//	if !fv.IsZero() {
		//		fieldValue := fv.Interface()
		//		value = reflect.ValueOf(fieldValue)
		//		fmt.Println(value.Kind().String())
		//	} else {
		//		fmt.Println("zero my man!")
		//		continue
		//	}
		//	switch value.Kind() {
		//	case reflect.Float64, reflect.Float32:
		//		//nodeEntry.Value = value.Float()
		//		//x := float64(int(value.Float()*100)) / 100 // trim this down
		//		//nodeEntry.StringValue = strconv.FormatFloat(x, 'f', -1, 64)
		//		instancePropMap[tagName] = value.Float()
		//	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		//		//nodeEntry.Value = value.Int()
		//		//nodeEntry.StringValue = value.String()
		//		instancePropMap[tagName] = value.Int()
		//
		//	case reflect.String:
		//
		//		instancePropMap[tagName] = value.String()
		//		//nodeEntry.Value = value.String()
		//	case reflect.Bool:
		//		//nodeEntry.Value = value.Bool()
		//		instancePropMap[tagName] = value.Bool()
		//	case reflect.Slice:
		//		fmt.Println("deng")
		//
		//		// check if this is a string slice
		//		r := value.Interface()
		//		t := reflect.ValueOf(r)
		//
		//		switch t.Type() {
		//
		//		case reflect.TypeOf([]int{}):
		//		case reflect.TypeOf([]string{}):
		//		case reflect.TypeOf([]int32{}):
		//		case reflect.TypeOf([]int64{}):
		//			instancePropMap[tagName] = r
		//			continue
		//
		//		case reflect.TypeOf([]*base.SchemaProxy{}):
		//			var schemaPropMap []interface{}
		//			for _, sv := range r.([]*base.SchemaProxy) {
		//				if sv.IsReference() {
		//					_, ref := utils.ConvertComponentIdIntoFriendlyPathSearch(sv.GetReference())
		//					schemaPropMap = append(schemaPropMap, fmt.Sprintf("$ref:%s", ref))
		//				} else {
		//					schemaPropMap = append(schemaPropMap, sv.Schema())
		//				}
		//			}
		//			instancePropMap[tagName] = schemaPropMap
		//		}
		//
		//	case reflect.Ptr:
		//
		//		r := value.Interface()
		//		t := reflect.ValueOf(r)
		//
		//		switch t.Type() {
		//
		//		case reflect.TypeOf(&orderedmap.Map[string, *base.SchemaProxy]{}):
		//			schemaMap := t.Interface().(*orderedmap.Map[string, *base.SchemaProxy])
		//			schemaPropMap := make(map[string]interface{})
		//			for pairs := schemaMap.First(); pairs != nil; pairs = pairs.Next() {
		//				k := pairs.Key()
		//				sv := pairs.Value()
		//				if sv.IsReference() {
		//					_, ref := utils.ConvertComponentIdIntoFriendlyPathSearch(sv.GetReference())
		//					schemaPropMap[k] = fmt.Sprintf("$ref:%s", ref)
		//				} else {
		//					schemaPropMap[k] = sv.Schema()
		//				}
		//			}
		//			instancePropMap[tagName] = schemaPropMap
		//
		//		}
		//
		//		//fmt.Println("drig")
		//		//if !value.IsNil() {
		//		//	nodeEntry.Value = f
		//		//}
		//	default:
		//		r := value.Interface()
		//		instancePropMap[tagName] = r
		//	}
		//
		//	/*
		//
		//		// extract the value of the field
		//			fieldValue := reflect.ValueOf(n.High).Elem().FieldByName(key)
		//			f := fieldValue.Interface()
		//			value := reflect.ValueOf(f)
		//			var isZero bool
		//			if (value.Kind() == reflect.Interface || value.Kind() == reflect.Ptr) && value.IsNil() {
		//				isZero = true
		//			} else if zeroer, ok := f.(yaml.IsZeroer); ok && zeroer.IsZero() {
		//				isZero = true
		//			} else if f == nil || value.IsZero() {
		//				isZero = true
		//			}
		//			if !renderZeroFlag && isZero || omitEmptyFlag && isZero {
		//				return
		//			}
		//
		//			// create a new node entry
		//			nodeEntry := &nodes.NodeEntry{Tag: tagName, Key: key}
		//			nodeEntry.RenderZero = renderZeroFlag
		//			switch value.Kind() {
		//			case reflect.Float64, reflect.Float32:
		//				nodeEntry.Value = value.Float()
		//				x := float64(int(value.Float()*100)) / 100 // trim this down
		//				nodeEntry.StringValue = strconv.FormatFloat(x, 'f', -1, 64)
		//			case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		//				nodeEntry.Value = value.Int()
		//				nodeEntry.StringValue = value.String()
		//			case reflect.String:
		//				nodeEntry.Value = value.String()
		//			case reflect.Bool:
		//				nodeEntry.Value = value.Bool()
		//			case reflect.Slice:
		//				if tagName == "type" {
		//					if value.Len() == 1 {
		//						nodeEntry.Value = value.Index(0).String()
		//					} else {
		//						nodeEntry.Value = f
		//					}
		//				} else {
		//					if renderZeroFlag || (!value.IsNil() && !isZero) {
		//						nodeEntry.Value = f
		//					}
		//				}
		//			case reflect.Ptr:
		//				if !value.IsNil() {
		//					nodeEntry.Value = f
		//				}
		//			default:
		//				nodeEntry.Value = f
		//			}
		//
		//
		//	*/
		//
		//	// check is value is a pointer, if so, ignore
		//
		//}

		//if len(instancePropMap) > 0 {
		//	propMap["instanceProperties"] = instancePropMap
		//}
		if n.RenderProps {
			propMap["instance"] = n.Instance
			if gl, ok := n.Instance.(high.GoesLowUntyped); ok {

				if _, ok := n.Instance.(high.Renderable); ok {

					if rn, ok := gl.GoLowUntyped().(low.HasRootNode); ok {
						var enc map[string]interface{}

						// check if this is a reference
						if r, ok := rn.(low.IsReferenced); ok {
							if r.IsReference() {
								enc = make(map[string]interface{})
								enc["$ref"] = r.GetReference()
							} else {
								rn.GetRootNode().Decode(&enc)
							}
						}
						propMap["instance"] = enc
					}
				}
			}
		}
	}

	return json.Marshal(propMap)
}

func GenerateNode(parentId string, instance any) *Node {
	// check if instance can go low
	var uuidValue string
	line := 1
	//if instance != nil {
	//	if goesLow, ok := instance.(high.GoesLowUntyped); ok {
	//		low := goesLow.GoLowUntyped()
	//		// check if hashable
	//		if hashable, ko := low.(lowModel.Hashable); ko {
	//			uuidValue = fmt.Sprintf("%x", hashable.Hash())
	//		}
	//	}
	//	if foundational, ok := instance.(Foundational); ok {
	//		if foundational.GetKeyNode() != nil {
	//			line = foundational.GetKeyNode().Line
	//		}
	//	}
	//}
	if uuidValue == "" {
		if instance != nil {
			uuidValue = instance.(Foundational).GenerateJSONPath()
		} else {
			uuidValue = uuid.New().String()
		}
	}

	return &Node{
		Id:       uuidValue,
		ParentId: parentId,
		//Instance: instance,
		KeyLine:   line,
		ValueLine: line,
	}
}

func GenerateEdge(sources []string, targets []string) *Edge {
	return &Edge{
		Id:      uuid.New().String(),
		Sources: sources,
		Targets: targets,
	}
}

func ExtractRootNodeForHighModel(obj high.GoesLowUntyped) *yaml.Node {
	if obj != nil {
		if ref, ok := obj.GoLowUntyped().(low.IsReferenced); ok {
			if ref.IsReference() {
				if hkn, ko := ref.(low.HasKeyNode); ko {
					if hkn.GetKeyNode() != nil {
						return hkn.GetKeyNode()
					}
				}
			}
		}
		if hvn, ok := obj.GoLowUntyped().(low.HasValueNodeUntyped); ok {
			if hvn.GetValueNode() != nil {
				return hvn.GetValueNode()
			}
		}
	}
	return nil
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
