// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"

	v3 "github.com/pb33f/doctor/model/high/v3"
)

// visitComponents visits the components section of an OpenAPI document
func (mt *MermaidTardis) visitComponents(ctx context.Context, comp *v3.Components) {
	if comp == nil || comp.Value == nil {
		return
	}

	class := NewMermaidClass("Components", "Components")
	mt.diagram.AddClass(class)

	if comp.Schemas != nil {
		for pair := comp.Schemas.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				mt.visitSchemaProxy(ctx, pair.Value())
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: "Components",
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  "schema",
				})
			}
		}
	}

	if comp.Responses != nil {
		for pair := comp.Responses.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: "Components",
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  "response",
				})
			}
		}
	}

	if comp.Parameters != nil {
		for pair := comp.Parameters.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: "Components",
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  "parameter",
				})
			}
		}
	}

	if comp.RequestBodies != nil {
		for pair := comp.RequestBodies.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: "Components",
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  "requestBody",
				})
			}
		}
	}

	if comp.SecuritySchemes != nil {
		for pair := comp.SecuritySchemes.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: "Components",
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  "security",
				})
			}
		}
	}
}

// visitParameter visits a parameter definition
func (mt *MermaidTardis) visitParameter(ctx context.Context, param *v3.Parameter) {
	if param == nil || param.Value == nil {
		return
	}

	id := mt.getClassID(param)
	name := param.Value.Name
	if name == "" {
		name = "Parameter"
	}

	class := NewMermaidClass(id, name)
	class.AddProperty(&MermaidMember{
		Name:       "in",
		Type:       param.Value.In,
		Visibility: "+",
	})

	if param.Value.Required != nil && *param.Value.Required {
		class.AddProperty(&MermaidMember{
			Name:       "required",
			Type:       "boolean = true",
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)

	if param.SchemaProxy != nil {
		mt.visitSchemaProxy(ctx, param.SchemaProxy)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: id,
			Target: mt.getClassID(param.SchemaProxy),
			Type:   RelationComposition,
			Label:  "schema",
		})
	}
}

// visitResponse visits a response definition
func (mt *MermaidTardis) visitResponse(ctx context.Context, resp *v3.Response) {
	if resp == nil {
		return
	}

	id := mt.getClassID(resp)
	// use the response key (status code) as name if available
	name := resp.Key
	if name == "" {
		name = mt.extractName(resp)
	}

	class := NewMermaidClass(id, name)
	if resp.Value != nil && resp.Value.Description != "" {
		class.AddProperty(&MermaidMember{
			Name:       "description",
			Type:       "string",
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)

	if resp.Content != nil {
		for pair := resp.Content.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
			}
		}
	}

	if resp.Headers != nil {
		for pair := resp.Headers.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: id,
					Target: mt.getClassID(pair.Value()),
					Type:   RelationAggregation,
					Label:  "header",
				})
			}
		}
	}
}

// visitResponses visits a responses container
func (mt *MermaidTardis) visitResponses(ctx context.Context, responses *v3.Responses) {
	if responses == nil || responses.Value == nil {
		return
	}

	id := mt.getClassID(responses)
	class := NewMermaidClass(id, "Responses")
	mt.diagram.AddClass(class)

	if responses.Codes != nil {
		for pair := responses.Codes.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: id,
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  pair.Key(),
				})
			}
		}
	}

	if responses.Default != nil {
		responses.Default.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: id,
			Target: mt.getClassID(responses.Default),
			Type:   RelationComposition,
			Label:  "default",
		})
	}
}

// visitRequestBody visits a request body definition
func (mt *MermaidTardis) visitRequestBody(ctx context.Context, rb *v3.RequestBody) {
	if rb == nil {
		return
	}

	id := mt.getClassID(rb)
	// use key if available, otherwise default to "RequestBody"
	name := rb.Key
	if name == "" {
		name = "RequestBody"
	}
	class := NewMermaidClass(id, name)

	if rb.Value != nil && rb.Value.Required != nil && *rb.Value.Required {
		class.AddProperty(&MermaidMember{
			Name:       "required",
			Type:       "boolean = true",
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)

	if rb.Content != nil {
		for pair := rb.Content.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
			}
		}
	}
}

// visitMediaType visits a media type definition
func (mt *MermaidTardis) visitMediaType(ctx context.Context, media *v3.MediaType) {
	if media == nil {
		return
	}

	if media.SchemaProxy != nil {
		mt.visitSchemaProxy(ctx, media.SchemaProxy)
	}
}

// visitSecurityScheme visits a security scheme definition
func (mt *MermaidTardis) visitSecurityScheme(ctx context.Context, ss *v3.SecurityScheme) {
	if ss == nil || ss.Value == nil {
		return
	}

	id := mt.getClassID(ss)
	class := NewMermaidClass(id, "SecurityScheme")
	class.AddProperty(&MermaidMember{
		Name:       "type",
		Type:       ss.Value.Type,
		Visibility: "+",
	})

	if ss.Value.Scheme != "" {
		class.AddProperty(&MermaidMember{
			Name:       "scheme",
			Type:       ss.Value.Scheme,
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)
}

// visitServer visits a server definition
func (mt *MermaidTardis) visitServer(ctx context.Context, server *v3.Server) {
	if server == nil || server.Value == nil {
		return
	}

	id := mt.getClassID(server)
	class := NewMermaidClass(id, "Server")
	class.AddProperty(&MermaidMember{
		Name:       "url",
		Type:       "string",
		Visibility: "+",
	})

	if server.Value.Description != "" {
		class.AddProperty(&MermaidMember{
			Name:       "description",
			Type:       "string",
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)
}

// visitTag visits a tag definition
func (mt *MermaidTardis) visitTag(ctx context.Context, tag *v3.Tag) {
	if tag == nil || tag.Value == nil {
		return
	}

	id := mt.getClassID(tag)
	class := NewMermaidClass(id, tag.Value.Name)
	class.Annotations = []string{"tag"}

	if tag.Value.Description != "" {
		class.AddProperty(&MermaidMember{
			Name:       "description",
			Type:       "string",
			Visibility: "+",
		})
	}

	mt.diagram.AddClass(class)
}

// visitExample visits an example definition
func (mt *MermaidTardis) visitExample(ctx context.Context, example *v3.Example) {
	if example == nil {
		return
	}

	id := mt.getClassID(example)
	// prioritize key, then summary, then default
	name := example.Key
	if name == "" && example.Value != nil && example.Value.Summary != "" {
		name = example.Value.Summary
	}
	if name == "" {
		name = "Example"
	}

	class := NewMermaidClass(id, name)
	class.Annotations = []string{"example"}
	mt.diagram.AddClass(class)
}

// visitHeader visits a header definition
func (mt *MermaidTardis) visitHeader(ctx context.Context, header *v3.Header) {
	if header == nil {
		return
	}

	id := mt.getClassID(header)
	name := header.Key
	if name == "" {
		name = "Header"
	}
	class := NewMermaidClass(id, name)

	if header.Value != nil {
		if header.Value.Required {
			class.AddProperty(&MermaidMember{
				Name:       "required",
				Type:       "boolean = true",
				Visibility: "+",
			})
		}
		if header.Value.Deprecated {
			class.Annotations = append(class.Annotations, "deprecated")
		}
	}

	mt.diagram.AddClass(class)

	// handle schema
	if header.Schema != nil {
		mt.visitSchemaProxy(ctx, header.Schema)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: id,
			Target: mt.getClassID(header.Schema),
			Type:   RelationComposition,
			Label:  "schema",
		})
	}
}

// visitLink visits a link definition
func (mt *MermaidTardis) visitLink(ctx context.Context, link *v3.Link) {
	if link == nil {
		return
	}

	id := mt.getClassID(link)
	// prioritize key, then operationId, then default
	name := link.Key
	if name == "" && link.Value != nil && link.Value.OperationId != "" {
		name = link.Value.OperationId
	}
	if name == "" {
		name = "Link"
	}

	class := NewMermaidClass(id, name)
	class.Annotations = []string{"link"}
	mt.diagram.AddClass(class)
}

// visitCallback visits a callback definition
func (mt *MermaidTardis) visitCallback(ctx context.Context, callback *v3.Callback) {
	if callback == nil {
		return
	}

	id := mt.getClassID(callback)
	// use key if available, otherwise default
	name := callback.Key
	if name == "" {
		name = "Callback"
	}
	class := NewMermaidClass(id, name)
	class.Annotations = []string{"callback"}
	mt.diagram.AddClass(class)

	if callback.Expression != nil {
		for pair := callback.Expression.First(); pair != nil; pair = pair.Next() {
			if pair.Value() != nil {
				pair.Value().Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source: id,
					Target: mt.getClassID(pair.Value()),
					Type:   RelationComposition,
					Label:  pair.Key(),
				})
			}
		}
	}
}
