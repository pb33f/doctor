// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"reflect"

	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/what-changed/model"
	"go.yaml.in/yaml/v4"
)

func (t *Changerator) VisitSchema(ctx context.Context, schema *v3.Schema) {
	v3.EnsureSchemaChildrenForRead(schema)
	var nCtx = ctx
	if changes, ok := ctx.Value(v3.Context).(*model.SchemaChanges); ok {
		PushChanges(ctx, schema, &model.SchemaChanges{})
		if changes == nil {
			return
		}

		traveller := func(rootNode *yaml.Node, ch *model.SchemaChanges) {
			located, err := t.Config.Doctor.LocateModel(rootNode)
			if located != nil && err == nil {
				for _, z := range located {
					nCtx = context.WithValue(ctx, v3.Context, ch)
					if tr, yy := z.(v3.Companion); yy {
						if !reflect.ValueOf(tr).IsNil() {
							if !reflect.ValueOf(tr).IsNil() {
								tr.Travel(nCtx, t)
							}
						}
					}
				}
			}
		}
		processObj := func(x *model.Change, ch *model.SchemaChanges) {
			if x.NewObject != nil {
				if hrn, kk := x.NewObject.(low.HasRootNode); kk {
					traveller(hrn.GetRootNode(), ch)
				} else {
					// check if this is a reference
					if ir, kl := x.NewObject.(low.IsReferenced); kl {
						if ir.IsReference() {
							//println("is a reference")
						}
					}
				}
			} else {
				if x.OriginalObject != nil {
					if hrn, kk := x.OriginalObject.(low.HasRootNode); kk {
						traveller(hrn.GetRootNode(), ch)
					}
				}
			}
		}
		processSlice := func(ch *model.SchemaChanges) {
			// Early return if ch is nil to prevent nil pointer dereference
			if ch == nil {
				return
			}

			// for each change, locate the object
			for _, x := range ch.Changes {
				processObj(x, ch)
			}

			for _, x := range ch.SchemaPropertyChanges {
				if x != nil {
					for _, y := range x.GetPropertyChanges() {
						processObj(y, x)
					}
				}
			}
		}

		processSchema := func(ch *model.SchemaChanges, sch *v3.Schema) {
			nCtx = context.WithValue(ctx, v3.Context, ch)
			if sch != nil && sch.Value != nil && sch.Value.GoLow() != nil && !sch.Value.GoLow().IsReference() {
				ensureSchemaChangeNode(sch)
				sch.Travel(nCtx, t)
			}
		}

		// anyof
		if changes.AnyOfChanges != nil && len(changes.AnyOfChanges) > 0 {
			for _, ch := range changes.AnyOfChanges {
				processSlice(ch)
			}
		}

		// oneof
		if changes.OneOfChanges != nil && len(changes.OneOfChanges) > 0 {
			for _, ch := range changes.OneOfChanges {
				processSlice(ch)
			}
		}

		// allof
		if changes.AllOfChanges != nil && len(changes.AllOfChanges) > 0 {
			for _, ch := range changes.AllOfChanges {
				processSlice(ch)
			}
		}

		// prefixItems
		if changes.PrefixItemsChanges != nil && len(changes.PrefixItemsChanges) > 0 {
			for _, ch := range changes.PrefixItemsChanges {
				processSlice(ch)
			}
		}

		// discriminator
		if changes.DiscriminatorChanges != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.DiscriminatorChanges)
			PushChanges(nCtx, schema, &model.DiscriminatorChanges{})
		}

		// contains
		if changes.ContainsChanges != nil {
			if contains := schema.ContainsForRead(); contains != nil {
				processSchema(changes.ContainsChanges, contains.SchemaForRead())
			}
		}

		// if
		if changes.IfChanges != nil {
			if ifSchema := schema.IfForRead(); ifSchema != nil {
				processSchema(changes.IfChanges, ifSchema.SchemaForRead())
			}
		}

		// else
		if changes.ElseChanges != nil {
			if elseSchema := schema.ElseForRead(); elseSchema != nil {
				processSchema(changes.ElseChanges, elseSchema.SchemaForRead())
			}
		}

		// then
		if changes.ThenChanges != nil {
			if thenSchema := schema.ThenForRead(); thenSchema != nil {
				processSchema(changes.ThenChanges, thenSchema.SchemaForRead())
			}
		}

		// not
		if changes.NotChanges != nil {
			if notSchema := schema.NotForRead(); notSchema != nil {
				processSchema(changes.NotChanges, notSchema.SchemaForRead())
			}
		}

		// xml
		if changes.XMLChanges != nil && schema.XML != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.XMLChanges)
			schema.XML.Travel(nCtx, t)
		}

		// external doc
		if changes.ExternalDocChanges != nil && schema.ExternalDocs != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ExternalDocChanges)
			PushChanges(nCtx, schema, &model.ExternalDocChanges{})
		}

		// property names
		if changes.PropertyNamesChanges != nil {
			if propertyNames := schema.PropertyNamesForRead(); propertyNames != nil {
				processSchema(changes.PropertyNamesChanges, propertyNames.SchemaForRead())
			}
		}

		// unevaluated items
		if changes.UnevaluatedItemsChanges != nil {
			if unevaluatedItems := schema.UnevaluatedItemsForRead(); unevaluatedItems != nil {
				processSchema(changes.UnevaluatedItemsChanges, unevaluatedItems.SchemaForRead())
			}
		}

		dependentSchemas := schema.DependentSchemasForRead()
		if len(changes.DependentSchemasChanges) > 0 && dependentSchemas != nil {
			for k, v := range changes.DependentSchemasChanges {
				if sc := dependentSchemas.GetOrZero(k); sc != nil {
					processSchema(v, sc.SchemaForRead())
				}
			}
		}

		patternProperties := schema.PatternPropertiesForRead()
		if len(changes.PatternPropertiesChanges) > 0 && patternProperties != nil {
			for k, v := range changes.PatternPropertiesChanges {
				if sc := patternProperties.GetOrZero(k); sc != nil {
					processSchema(v, sc.SchemaForRead())
				}
			}
		}

		properties := schema.PropertiesForRead()
		if len(changes.SchemaPropertyChanges) > 0 && properties != nil {
			for k, v := range changes.SchemaPropertyChanges {
				if sc := properties.GetOrZero(k); sc != nil {
					processSchema(v, sc.SchemaForRead())
				}
			}
		}

		if changes.UnevaluatedPropertiesChanges != nil {
			unevaluatedProperties := schema.UnevaluatedPropertiesForRead()
			if unevaluatedProperties != nil && unevaluatedProperties.Value != nil &&
				unevaluatedProperties.Value.IsA() {
				processSchema(changes.UnevaluatedPropertiesChanges, unevaluatedProperties.A.SchemaForRead())
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.UnevaluatedPropertiesChanges)
				PushChanges(nCtx, schema, &model.SchemaChanges{})
			}
		}

		if changes.ItemsChanges != nil {
			items := schema.ItemsForRead()
			if items != nil && items.Value != nil && items.Value.IsA() {
				processSchema(changes.ItemsChanges, items.A.SchemaForRead())
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.ItemsChanges)
				PushChanges(nCtx, schema, &model.ItemsChanges{})
			}
		}

		if changes.AdditionalPropertiesChanges != nil {
			additionalProperties := schema.AdditionalPropertiesForRead()
			if additionalProperties != nil && additionalProperties.Value != nil &&
				additionalProperties.Value.IsA() {
				processSchema(changes.AdditionalPropertiesChanges, additionalProperties.A.SchemaForRead())
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.AdditionalPropertiesChanges)
				PushChanges(nCtx, schema, &model.SchemaChanges{})
			}
		}
		if changes.ExtensionChanges != nil {
			HandleExtensions(ctx, schema, changes.ExtensionChanges)
		}
	}
}

func ensureSchemaChangeNode(schema *v3.Schema) {
	if schema == nil || schema.GetNode() != nil {
		return
	}
	parent := schema.GetNodeParent()
	if parent == nil || parent.GetNode() == nil {
		return
	}
	id := schema.GenerateJSONPath()
	if id == "" {
		return
	}
	label := schema.Name
	if label == "" {
		label = schema.GetKeyValue()
	}
	if label == "" {
		label = schema.GetPathSegment()
	}
	if label == "" {
		label = "schema"
	}
	node := v3.NewSyntheticNode(id, parent.GetNode().Id, label, "schema")
	node.DrInstance = schema
	node.Value = schema.GetValueNode()
	if schema.GetValueNode() != nil {
		node.ValueLine = schema.GetValueNode().Line
	}
	schema.SetNode(node)

	parentNode := parent.GetNode()
	for _, child := range parentNode.Children {
		if child != nil && child.Id == node.Id {
			return
		}
	}
	parentNode.Children = append(parentNode.Children, node)
}
