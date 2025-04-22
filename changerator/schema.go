// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func (t *Changerator) VisitSchema(ctx context.Context, schema *v3.Schema) {
	var nCtx = ctx
	if changes, ok := ctx.Value(v3.Context).(*model.SchemaChanges); ok {
		PushChanges(ctx, schema, &model.SchemaChanges{})

		processSlice := func(ch *model.SchemaChanges) {
			// for each change, locate the object
			for _, x := range ch.Changes {
				if x.NewObject != nil {
					if hrn, kk := x.NewObject.(low.HasRootNode); kk {
						located, err := t.Config.Doctor.LocateModel(hrn.GetRootNode())
						if located != nil && err == nil {
							for _, z := range located {
								nCtx = context.WithValue(ctx, v3.Context, ch)
								if tr, yy := z.(v3.Companion); yy {
									tr.Travel(nCtx, t)
								}
							}
						}
					}
				}
			}
		}

		processSchema := func(ch *model.SchemaChanges, sch *v3.Schema) {
			nCtx = context.WithValue(ctx, v3.Context, ch)
			if !sch.Value.GoLow().IsReference() {
				sch.Travel(nCtx, t)
			}
		}

		// anyof
		if len(changes.AnyOfChanges) > 0 {
			for _, ch := range changes.AnyOfChanges {
				processSlice(ch)
			}
		}

		// oneof
		if len(changes.OneOfChanges) > 0 {
			for _, ch := range changes.OneOfChanges {
				processSlice(ch)
			}
		}

		// allof
		if len(changes.AllOfChanges) > 0 {
			for _, ch := range changes.AllOfChanges {
				processSlice(ch)
			}
		}

		// prefixItems
		if len(changes.PrefixItemsChanges) > 0 {
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
		if changes.ContainsChanges != nil && schema.Contains != nil {
			processSchema(changes.ContainsChanges, schema.Contains.Schema)
		}

		// if
		if changes.IfChanges != nil && schema.If != nil {
			processSchema(changes.IfChanges, schema.If.Schema)
		}

		// else
		if changes.ElseChanges != nil && schema.Else != nil {
			processSchema(changes.ElseChanges, schema.Else.Schema)
		}

		// then
		if changes.ThenChanges != nil && schema.Then != nil {
			processSchema(changes.ThenChanges, schema.Then.Schema)
		}

		// else
		if changes.ElseChanges != nil && schema.Else != nil {
			processSchema(changes.ElseChanges, schema.Else.Schema)
		}

		// not
		if changes.NotChanges != nil && schema.Not != nil {
			processSchema(changes.NotChanges, schema.Not.Schema)
		}

		// xml
		if changes.XMLChanges != nil && schema.XML != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.XMLChanges)
			PushChanges(nCtx, schema, &model.XMLChanges{})
		}

		// external doc
		if changes.ExternalDocChanges != nil && schema.ExternalDocs != nil {
			nCtx = context.WithValue(ctx, v3.Context, changes.ExternalDocChanges)
			PushChanges(nCtx, schema, &model.ExternalDocChanges{})
		}

		// property names
		if changes.PropertyNamesChanges != nil && schema.PropertyNames != nil {
			processSchema(changes.PropertyNamesChanges, schema.PropertyNames.Schema)
		}

		// unevaluated items
		if changes.UnevaluatedItemsChanges != nil && schema.UnevaluatedItems != nil {
			processSchema(changes.UnevaluatedItemsChanges, schema.UnevaluatedItems.Schema)
		}

		if len(changes.DependentSchemasChanges) > 0 && schema.DependentSchemas != nil {
			for k, v := range changes.DependentSchemasChanges {
				if sc := schema.DependentSchemas.GetOrZero(k); sc != nil {
					processSchema(v, sc.Schema)
				}
			}
		}

		if len(changes.PatternPropertiesChanges) > 0 && schema.PatternProperties != nil {
			for k, v := range changes.PatternPropertiesChanges {
				if sc := schema.PatternProperties.GetOrZero(k); sc != nil {
					processSchema(v, sc.Schema)
				}
			}
		}

		if len(changes.SchemaPropertyChanges) > 0 && schema.Properties != nil {
			for k, v := range changes.SchemaPropertyChanges {
				if sc := schema.Properties.GetOrZero(k); sc != nil {
					processSchema(v, sc.Schema)
				}
			}
		}

		if changes.UnevaluatedPropertiesChanges != nil {
			if schema.UnevaluatedProperties != nil && schema.UnevaluatedProperties.Value.IsA() {
				processSchema(changes.UnevaluatedPropertiesChanges, schema.UnevaluatedProperties.A.Schema)
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.UnevaluatedPropertiesChanges)
				PushChanges(nCtx, schema, &model.SchemaChanges{})
			}
		}

		if changes.ItemsChanges != nil {
			if schema.Items != nil && schema.Items.Value.IsA() {
				processSchema(changes.UnevaluatedPropertiesChanges, schema.UnevaluatedProperties.A.Schema)
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.ItemsChanges)
				PushChanges(nCtx, schema, &model.ItemsChanges{})
			}
		}

		if changes.AdditionalPropertiesChanges != nil {
			if schema.AdditionalProperties != nil && schema.AdditionalProperties.Value.IsA() {
				processSchema(changes.AdditionalPropertiesChanges, schema.AdditionalProperties.A.Schema)
			} else {
				nCtx = context.WithValue(ctx, v3.Context, changes.AdditionalPropertiesChanges)
				PushChanges(nCtx, schema, &model.SchemaChanges{})
			}
		}
		if schema.Value.Extensions != nil && schema.Value.Extensions.Len() > 0 {
			if changes.ExtensionChanges != nil {
				nCtx = context.WithValue(ctx, v3.Context, changes.ExtensionChanges)
				PushChangesWithOverride(nCtx, schema, &model.ExtensionChanges{}, "extension", "")
			}
		}
	}
}
