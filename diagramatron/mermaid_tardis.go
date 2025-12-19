// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
)

// MermaidTardis implements the Tardis visitor pattern for generating mermaid diagrams
type MermaidTardis struct {
	diagram              *MermaidDiagram
	doctor               v3.Doctor
	document             *v3.Document // store document reference for component lookups
	visited              map[string]bool
	depth                int
	relationshipAnalyzer *RelationshipAnalyzer
	discriminatorAnalyzer *discriminatorAnalyzer
	enumAnalyzer         *EnumAnalyzer
	propertyAnalyzer     *PropertyAnalyzer
	inheritanceAnalyzer  *InheritanceAnalyzer
	externalRefHandler   *ExternalReferenceHandler
	usageAnalyzer        *ComponentUsageAnalyzer
	refAggregator        *ReferenceAggregator
}

func NewMermaidTardis(config *MermaidConfig) *MermaidTardis {
	if config == nil {
		config = DefaultMermaidConfig()
	}
	return &MermaidTardis{
		diagram:               NewMermaidDiagram(config),
		visited:               make(map[string]bool),
		depth:                 0,
		relationshipAnalyzer:  NewRelationshipAnalyzer(50),
		discriminatorAnalyzer: NewDiscriminatorAnalyzer(),
		enumAnalyzer:          NewEnumAnalyzer(EnumInline, 5),
		propertyAnalyzer:      NewPropertyAnalyzer(),
		inheritanceAnalyzer:   NewInheritanceAnalyzer(),
		externalRefHandler:    NewExternalReferenceHandler(),
		usageAnalyzer:         NewComponentUsageAnalyzer(5),
		refAggregator:         NewReferenceAggregator(10),
	}
}

// GetDoctor returns the doctor instance
func (mt *MermaidTardis) GetDoctor() v3.Doctor {
	return mt.doctor
}

// GetDiagram returns the generated mermaid diagram
func (mt *MermaidTardis) GetDiagram() *MermaidDiagram {
	return mt.diagram
}

// Visit implements the Tardis interface
func (mt *MermaidTardis) Visit(ctx context.Context, object any) {
	if object == nil {
		return
	}

	// extract foundational interface if available
	var foundational v3.Foundational
	if f, ok := object.(v3.Foundational); ok {
		foundational = f
	}

	// check for circular reference using json path
	if foundational != nil {
		jsonPath := foundational.GenerateJSONPath()
		if mt.visited[jsonPath] {
			// add reference relationship but don't traverse
			mt.addCircularReference(foundational)
			return
		}
		mt.visited[jsonPath] = true
	}

	mt.depth++
	defer func() { mt.depth-- }()

	// visit based on type
	switch obj := object.(type) {
	case *v3.Document:
		mt.visitDocument(ctx, obj)
	case *v3.Info:
		mt.visitInfo(ctx, obj)
	case *v3.Paths:
		mt.visitPaths(ctx, obj)
	case *v3.PathItem:
		mt.visitPathItem(ctx, obj)
	case *v3.Operation:
		mt.visitOperation(ctx, obj)
	case *v3.Components:
		mt.visitComponents(ctx, obj)
	case *v3.Schema:
		// check if this schema is a composition member (allOf/oneOf/anyOf) of a parent
		// if so, skip it (the parent will handle it)
		if mt.isCompositionMemberOfParent(obj) {
			return // skip this composition member
		}
		mt.visitSchema(ctx, obj)
	case *v3.SchemaProxy:
		mt.visitSchemaProxy(ctx, obj)
	case *v3.Parameter:
		mt.visitParameter(ctx, obj)
	case *v3.Response:
		mt.visitResponse(ctx, obj)
	case *v3.RequestBody:
		mt.visitRequestBody(ctx, obj)
	case *v3.MediaType:
		mt.visitMediaType(ctx, obj)
	case *v3.SecurityScheme:
		mt.visitSecurityScheme(ctx, obj)
	case *v3.Server:
		mt.visitServer(ctx, obj)
	case *v3.Tag:
		mt.visitTag(ctx, obj)
	case *v3.Example:
		mt.visitExample(ctx, obj)
	case *v3.Header:
		mt.visitHeader(ctx, obj)
	case *v3.Link:
		mt.visitLink(ctx, obj)
	case *v3.Callback:
		mt.visitCallback(ctx, obj)
	case *v3.Responses:
		mt.visitResponses(ctx, obj)
	}
}

func (mt *MermaidTardis) visitDocument(ctx context.Context, doc *v3.Document) {
	if doc == nil {
		return
	}

	mt.document = doc
	class := NewMermaidClass("Document", "OpenAPI Document")
	class.AddProperty(&MermaidMember{
		Name:       "version",
		Type:       "string",
		Visibility: "+",
	})

	mt.diagram.AddClass(class)

	if doc.Info != nil {
		doc.Info.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: "Document",
			Target: mt.getClassID(doc.Info),
			Type:   RelationComposition,
		})
	}

	if doc.Paths != nil {
		doc.Paths.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: "Document",
			Target: mt.getClassID(doc.Paths),
			Type:   RelationComposition,
		})
	}

	if doc.Components != nil {
		doc.Components.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: "Document",
			Target: mt.getClassID(doc.Components),
			Type:   RelationComposition,
		})
	}

	if doc.Servers != nil {
		for _, server := range doc.Servers {
			if server != nil {
				server.Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source:      "Document",
					Target:      mt.getClassID(server),
					Type:        RelationAggregation,
					Cardinality: "0..*",
				})
			}
		}
	}
}

func (mt *MermaidTardis) visitInfo(ctx context.Context, info *v3.Info) {
	if info == nil {
		return
	}

	class := NewMermaidClass(mt.getClassID(info), "Info")

	// extract properties from libopenapi info
	if info.Value != nil {
		if info.Value.Title != "" {
			class.AddProperty(&MermaidMember{
				Name:       "title",
				Type:       "string",
				Visibility: "+",
			})
		}
		if info.Value.Version != "" {
			class.AddProperty(&MermaidMember{
				Name:       "version",
				Type:       "string",
				Visibility: "+",
			})
		}
		if info.Value.Description != "" {
			class.AddProperty(&MermaidMember{
				Name:       "description",
				Type:       "string",
				Visibility: "+",
			})
		}
	}

	mt.diagram.AddClass(class)
}

func (mt *MermaidTardis) visitPaths(ctx context.Context, paths *v3.Paths) {
	if paths == nil || paths.PathItems == nil {
		return
	}

	class := NewMermaidClass("Paths", "API Paths")
	class.AddProperty(&MermaidMember{
		Name:       "pathCount",
		Type:       fmt.Sprintf("int = %d", paths.PathItems.Len()),
		Visibility: "+",
	})

	mt.diagram.AddClass(class)

	for pair := paths.PathItems.First(); pair != nil; pair = pair.Next() {
		if pair.Value() != nil {
			pair.Value().Travel(ctx, mt)
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source:      "Paths",
				Target:      mt.getClassID(pair.Value()),
				Type:        RelationComposition,
				Label:       pair.Key(),
				Cardinality: "1",
			})
		}
	}
}

func (mt *MermaidTardis) visitPathItem(ctx context.Context, pi *v3.PathItem) {
	if pi == nil {
		return
	}

	id := mt.getClassID(pi)
	name := mt.extractName(pi)
	class := NewMermaidClass(id, name)

	// add operations as methods
	operations := []struct {
		name string
		op   *v3.Operation
	}{
		{"GET", pi.Get},
		{"POST", pi.Post},
		{"PUT", pi.Put},
		{"DELETE", pi.Delete},
		{"PATCH", pi.Patch},
		{"OPTIONS", pi.Options},
		{"HEAD", pi.Head},
		{"TRACE", pi.Trace},
	}

	for _, op := range operations {
		if op.op != nil {
			class.AddMethod(&MermaidMember{
				Name:       strings.ToLower(op.name),
				Type:       "Operation",
				Visibility: "+",
			})
			op.op.Travel(ctx, mt)
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: id,
				Target: mt.getClassID(op.op),
				Type:   RelationComposition,
				Label:  op.name,
			})
		}
	}

	mt.diagram.AddClass(class)

	if pi.Parameters != nil {
		for _, param := range pi.Parameters {
			if param != nil {
				param.Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source:      id,
					Target:      mt.getClassID(param),
					Type:        RelationAggregation,
					Cardinality: "0..*",
				})
			}
		}
	}
}

func (mt *MermaidTardis) visitOperation(ctx context.Context, op *v3.Operation) {
	if op == nil || op.Value == nil {
		return
	}

	id := mt.getClassID(op)
	name := op.Value.OperationId
	if name == "" {
		name = mt.extractName(op)
	}

	class := NewMermaidClass(id, name)
	class.Type = "class"

	// add properties
	if op.Value.Summary != "" {
		class.AddProperty(&MermaidMember{
			Name:       "summary",
			Type:       "string",
			Visibility: "+",
		})
	}

	if op.Value.Deprecated != nil && *op.Value.Deprecated {
		class.Annotations = append(class.Annotations, "deprecated")
	}

	mt.diagram.AddClass(class)

	if op.RequestBody != nil {
		op.RequestBody.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: id,
			Target: mt.getClassID(op.RequestBody),
			Type:   RelationAssociation,
			Label:  "request",
		})
	}

	if op.Responses != nil {
		op.Responses.Travel(ctx, mt)
		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: id,
			Target: mt.getClassID(op.Responses),
			Type:   RelationAssociation,
			Label:  "responses",
		})
	}

	if op.Parameters != nil {
		for _, param := range op.Parameters {
			if param != nil {
				param.Travel(ctx, mt)
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source:      id,
					Target:      mt.getClassID(param),
					Type:        RelationDependency,
					Cardinality: "0..*",
				})
			}
		}
	}
}

func Mermaidify(ctx context.Context, entry v3.Foundational, config *MermaidConfig) *MermaidDiagram {
	if entry == nil {
		return NewMermaidDiagram(config)
	}

	tardis := NewMermaidTardis(config)

	// try to find the document by traversing up the parent chain
	tardis.findAndStoreDocument(entry)

	// check if entry implements companion
	if companion, ok := entry.(v3.Companion); ok {
		companion.Travel(ctx, tardis)
	} else {
		// fallback to direct visit
		tardis.Visit(ctx, entry)
	}

	return tardis.GetDiagram()
}

// findAndStoreDocument traverses up to find the root Document
func (mt *MermaidTardis) findAndStoreDocument(entry v3.Foundational) {
	if entry == nil {
		return
	}

	// check if entry itself is a Document
	if doc, ok := entry.(*v3.Document); ok {
		mt.document = doc
		return
	}

	// traverse up parent chain to find Document
	current := entry.GetParent()
	for current != nil {
		if doc, ok := current.(*v3.Document); ok {
			mt.document = doc
			return
		}
		if f, ok := current.(v3.Foundational); ok {
			current = f.GetParent()
		} else {
			break
		}
	}
}
