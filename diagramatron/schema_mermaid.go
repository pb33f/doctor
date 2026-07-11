// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"
	"hash/fnv"
	"net/url"
	"path/filepath"
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// SchemaIdentity is the stable name and location of a schema in an API contract.
// CanonicalPath must remain stable across aliases so recursive schemas terminate.
type SchemaIdentity struct {
	CanonicalPath  string
	SourceLocation string
	Name           string
	ClassID        string
}

// SchemaIdentityProvider identifies resolved schema proxies without resolving refs itself.
type SchemaIdentityProvider interface {
	Identify(ctx context.Context, proxy *base.SchemaProxy, fallback SchemaIdentity) (SchemaIdentity, error)
}

// SchemaDiagramInput contains the protocol-neutral inputs required to diagram a schema.
type SchemaDiagramInput struct {
	Root       *base.SchemaProxy
	Identity   SchemaIdentity
	Identities SchemaIdentityProvider
}

// MermaidifySchema creates a class diagram directly from a libopenapi schema proxy.
// It does not depend on Doctor parent chains or an OpenAPI document model.
func MermaidifySchema(ctx context.Context, input SchemaDiagramInput, config *MermaidConfig) *MermaidDiagram {
	w := &schemaMermaidWalker{
		diagram:        NewMermaidDiagram(config),
		identities:     input.Identities,
		identityByPath: make(map[string]SchemaIdentity),
		classIDOwner:   make(map[string]string),
		classIDByName:  make(map[string]string),
		classIDByRef:   make(map[string]string),
		active:         make(map[string]struct{}),
		completed:      make(map[string]struct{}),
		properties:     NewPropertyAnalyzer(),
		enums:          NewEnumAnalyzer(EnumInline, 5),
	}
	if input.Root == nil {
		return w.diagram
	}
	w.visit(ctx, input.Root, normalizeSchemaIdentity(input.Identity, "Schema"))
	return w.diagram
}

type schemaMermaidWalker struct {
	diagram        *MermaidDiagram
	identities     SchemaIdentityProvider
	identityByPath map[string]SchemaIdentity
	classIDOwner   map[string]string
	classIDByName  map[string]string
	classIDByRef   map[string]string
	active         map[string]struct{}
	completed      map[string]struct{}
	properties     *PropertyAnalyzer
	enums          *EnumAnalyzer
	depth          int
	relationships  int
}

func (w *schemaMermaidWalker) visit(ctx context.Context, proxy *base.SchemaProxy, fallback SchemaIdentity) SchemaIdentity {
	if proxy == nil || ctx.Err() != nil {
		return SchemaIdentity{}
	}
	referenceSource := fallback.SourceLocation
	identity := w.identify(ctx, proxy, fallback)
	known, exists := w.identityByPath[identity.CanonicalPath]
	if exists {
		identity = known
	}
	if _, ok := w.completed[identity.CanonicalPath]; ok {
		return identity
	}
	if _, ok := w.active[identity.CanonicalPath]; ok {
		return identity
	}
	if w.depth > 0 && w.relationshipBudgetReached() {
		return SchemaIdentity{}
	}
	if w.diagram.Config.MaxDepth > 0 && w.depth >= w.diagram.Config.MaxDepth {
		return SchemaIdentity{}
	}
	if w.diagram.Config.MaxSchemas > 0 && len(w.active)+len(w.completed) >= w.diagram.Config.MaxSchemas {
		return SchemaIdentity{}
	}
	if !exists {
		identity.ClassID = w.assignClassID(identity)
		w.identityByPath[identity.CanonicalPath] = identity
		w.recordClassName(identity.Name, identity.ClassID)
	}
	w.recordClassReference(referenceSource, proxy.GetReference(), identity.ClassID)

	schema := proxy.Schema()
	if schema == nil {
		w.diagram.AddClass(newSchemaMermaidClass(identity))
		w.completed[identity.CanonicalPath] = struct{}{}
		return identity
	}
	w.active[identity.CanonicalPath] = struct{}{}
	w.depth++
	defer delete(w.active, identity.CanonicalPath)
	defer func() { w.depth-- }()

	class := newSchemaMermaidClass(identity)
	if len(schema.Type) > 0 {
		class.Annotations = append(class.Annotations, strings.Join(schema.Type, " | "))
	}
	// Materialize the class before descending so recursive relationships never
	// create implicit Mermaid classes outside the traversal budget.
	w.diagram.AddClass(class)
	w.addProperties(ctx, class, identity, schema)
	w.addComposition(ctx, identity, schema)
	w.addAdditionalProperties(ctx, identity, schema)
	w.addSchemaKeywords(ctx, identity, schema)
	w.addDiscriminatorMappings(ctx, identity, schema)
	w.completed[identity.CanonicalPath] = struct{}{}
	return identity
}

func (w *schemaMermaidWalker) addProperties(ctx context.Context, class *MermaidClass, parent SchemaIdentity, schema *base.Schema) {
	if schema.Properties == nil {
		return
	}
	required := CreateRequiredMap(schema.Required)
	count := 0
	for pair := schema.Properties.First(); pair != nil; pair = pair.Next() {
		if w.traversalBudgetReached(ctx) {
			break
		}
		if w.diagram.Config.MaxProperties > 0 && count >= w.diagram.Config.MaxProperties {
			break
		}
		name, proxy := pair.Key(), pair.Value()
		if proxy == nil {
			continue
		}
		propertySchema := proxy.Schema()
		typeName, target, cardinality := "", SchemaIdentity{}, ""
		if !proxy.IsReference() && propertySchema != nil && (len(propertySchema.OneOf) > 0 || len(propertySchema.AnyOf) > 0 || len(propertySchema.AllOf) > 0) {
			typeName = w.propertyComposition(ctx, parent, name, propertySchema, required[name])
		} else {
			typeName, target, cardinality = w.propertyType(ctx, parent, name, proxy, propertySchema, required[name])
		}
		displayName := name
		if schema.Discriminator != nil && schema.Discriminator.PropertyName == name {
			displayName += " (discriminator)"
		}
		if propertySchema != nil {
			if enum := w.enums.AnalyzeEnum(propertySchema, name); enum != nil {
				if value := w.enums.FormatEnumForInline(enum); value != "" {
					displayName += fmt.Sprintf(" (enum:%s)", value)
				}
			}
			if propertySchema.Format != "" {
				displayName += fmt.Sprintf(" (format:%s)", propertySchema.Format)
			}
		}
		class.AddProperty(&MermaidMember{
			Name:       displayName,
			Type:       typeName,
			Visibility: string(w.properties.DetermineVisibility(name, propertySchema, required)),
		})
		count++
		if target.Name != "" {
			w.addRelationship(&MermaidRelationship{
				Source:      parent.ClassID,
				Target:      target.ClassID,
				Type:        RelationComposition,
				Label:       name,
				Cardinality: cardinality,
			})
		}
	}
}

func (w *schemaMermaidWalker) propertyComposition(ctx context.Context, parent SchemaIdentity, propertyName string, schema *base.Schema, required bool) string {
	variants, relation, role := schema.OneOf, RelationAssociation, "oneOf"
	if len(variants) == 0 {
		variants, role = schema.AnyOf, "anyOf"
	}
	if len(variants) == 0 {
		variants, relation, role = schema.AllOf, RelationComposition, "allOf"
	}
	types := make([]string, 0, len(variants))
	for i, proxy := range variants {
		if w.traversalBudgetReached(ctx) {
			break
		}
		if proxy == nil {
			continue
		}
		if isSimplePrimitiveSchema(proxy.Schema()) {
			typeName := "any"
			if variant := proxy.Schema(); variant != nil && len(variant.Type) > 0 {
				typeName = variant.Type[0]
			}
			types = append(types, typeName)
			continue
		}
		fallback := childIdentity(parent, fmt.Sprintf("%s_%s%d", propertyName, role, i+1), referenceName(proxy.GetReference()))
		target := w.visit(ctx, proxy, fallback)
		if target.Name == "" {
			types = append(types, sanitizeID(fallback.Name))
			break
		}
		types = append(types, sanitizeID(target.Name))
		w.addRelationship(&MermaidRelationship{Source: parent.ClassID, Target: target.ClassID, Type: relation, Label: propertyName})
	}
	if len(types) == 0 {
		types = append(types, "any")
	}
	result := strings.Join(types, " | ")
	if !required {
		result += "?"
	}
	return result
}

func (w *schemaMermaidWalker) propertyType(ctx context.Context, parent SchemaIdentity, name string, proxy *base.SchemaProxy, schema *base.Schema, required bool) (string, SchemaIdentity, string) {
	optional := ""
	if !required {
		optional = "?"
	}
	if proxy.IsReference() {
		fallback := childIdentity(parent, name, referenceName(proxy.GetReference()))
		target := w.visit(ctx, proxy, fallback)
		return sanitizeID(firstNonEmptyString(target.Name, fallback.Name, "any")) + optional, target, ""
	}
	if schema == nil {
		return "any" + optional, SchemaIdentity{}, ""
	}
	if schema.Items != nil && schema.Items.IsA() && schema.Items.A != nil {
		item := schema.Items.A
		if item.IsReference() || isRelationalSchema(item.Schema()) {
			fallback := childIdentity(parent, name+"Item", referenceName(item.GetReference()))
			target := w.visit(ctx, item, fallback)
			return sanitizeID(firstNonEmptyString(target.Name, fallback.Name, "any")) + "[]" + optional, target, w.collectionCardinality(schema)
		}
	}
	if isRelationalSchema(schema) && schema.Properties != nil && schema.Properties.Len() > 0 {
		fallback := childIdentity(parent, name, firstNonEmptyString(schema.Title, parent.Name+"_"+name))
		target := w.visit(ctx, proxy, fallback)
		return sanitizeID(firstNonEmptyString(target.Name, fallback.Name, "any")) + optional, target, ""
	}
	typeName := w.properties.GenerateTypeString(schema, name, map[string]bool{name: required})
	return typeName, SchemaIdentity{}, ""
}

func (w *schemaMermaidWalker) addComposition(ctx context.Context, parent SchemaIdentity, schema *base.Schema) {
	w.addCompositionMembers(ctx, parent, schema.AllOf, RelationInheritance, "extends", "allOf")
	w.addCompositionMembers(ctx, parent, schema.OneOf, RelationRealization, "oneOf", "oneOf")
	w.addCompositionMembers(ctx, parent, schema.AnyOf, RelationRealization, "anyOf", "anyOf")
	for i, proxy := range schema.PrefixItems {
		if w.traversalBudgetReached(ctx) {
			break
		}
		w.addRelatedProxy(ctx, parent, proxy, RelationComposition, fmt.Sprintf("prefixItems[%d]", i), "")
	}
}

func (w *schemaMermaidWalker) addCompositionMembers(ctx context.Context, parent SchemaIdentity, proxies []*base.SchemaProxy, relation RelationType, label, role string) {
	for i, proxy := range proxies {
		if w.traversalBudgetReached(ctx) {
			break
		}
		if proxy == nil || isSimplePrimitiveSchema(proxy.Schema()) {
			continue
		}
		fallback := childIdentity(parent, fmt.Sprintf("%s%d", role, i+1), referenceName(proxy.GetReference()))
		target := w.visit(ctx, proxy, fallback)
		if target.Name == "" {
			continue
		}
		source, destination := parent.ClassID, target.ClassID
		if relation == RelationInheritance {
			source, destination = target.ClassID, parent.ClassID
		}
		w.addRelationship(&MermaidRelationship{Source: source, Target: destination, Type: relation, Label: label})
	}
}

func (w *schemaMermaidWalker) addAdditionalProperties(ctx context.Context, parent SchemaIdentity, schema *base.Schema) {
	if schema.AdditionalProperties == nil || !schema.AdditionalProperties.IsA() || schema.AdditionalProperties.A == nil {
		return
	}
	w.addRelatedProxy(ctx, parent, schema.AdditionalProperties.A, RelationComposition, "additionalProperties", "0..*")
}

func (w *schemaMermaidWalker) addSchemaKeywords(ctx context.Context, parent SchemaIdentity, schema *base.Schema) {
	if schema.Items != nil && schema.Items.IsA() {
		w.addRelatedProxy(ctx, parent, schema.Items.A, RelationComposition, "items", w.collectionCardinality(schema))
	}
	w.addRelatedProxy(ctx, parent, schema.Contains, RelationComposition, "contains", "")
	w.addRelatedProxy(ctx, parent, schema.If, RelationDependency, "if", "")
	w.addRelatedProxy(ctx, parent, schema.Then, RelationDependency, "then", "")
	w.addRelatedProxy(ctx, parent, schema.Else, RelationDependency, "else", "")
	w.addRelatedProxy(ctx, parent, schema.Not, RelationNegation, "not", "")
	w.addRelatedProxy(ctx, parent, schema.PropertyNames, RelationDependency, "propertyNames", "")
	w.addRelatedProxy(ctx, parent, schema.UnevaluatedItems, RelationComposition, "unevaluatedItems", "")
	w.addRelatedProxy(ctx, parent, schema.ContentSchema, RelationComposition, "contentSchema", "")
	if schema.UnevaluatedProperties != nil && schema.UnevaluatedProperties.IsA() {
		w.addRelatedProxy(ctx, parent, schema.UnevaluatedProperties.A, RelationComposition, "unevaluatedProperties", "0..*")
	}
	if schema.DependentSchemas != nil {
		for pair := schema.DependentSchemas.First(); pair != nil; pair = pair.Next() {
			if w.traversalBudgetReached(ctx) {
				break
			}
			w.addRelatedProxy(ctx, parent, pair.Value(), RelationDependency, "dependentSchemas."+pair.Key(), "")
		}
	}
	if schema.PatternProperties != nil {
		for pair := schema.PatternProperties.First(); pair != nil; pair = pair.Next() {
			if w.traversalBudgetReached(ctx) {
				break
			}
			w.addRelatedProxy(ctx, parent, pair.Value(), RelationComposition, "patternProperties."+pair.Key(), "0..*")
		}
	}
}

func (w *schemaMermaidWalker) addDiscriminatorMappings(ctx context.Context, parent SchemaIdentity, schema *base.Schema) {
	if schema.Discriminator == nil || schema.Discriminator.Mapping == nil {
		return
	}
	for pair := schema.Discriminator.Mapping.First(); pair != nil; pair = pair.Next() {
		ref := pair.Value()
		if ref == "" {
			continue
		}
		// Mappings are normally also represented by oneOf/anyOf proxies. Add a
		// relationship only when the mapped class has already been materialized.
		classID := w.classIDByRef[schemaReferenceKey(parent.SourceLocation, ref)]
		if classID == "" {
			classID = w.classIDByName[referenceName(ref)]
		}
		if classID != "" && w.diagram.HasClass(classID) {
			w.addRelationship(&MermaidRelationship{Source: parent.ClassID, Target: classID, Type: RelationRealization, Label: pair.Key()})
		}
	}
}

func (w *schemaMermaidWalker) addRelatedProxy(ctx context.Context, parent SchemaIdentity, proxy *base.SchemaProxy, relation RelationType, label, cardinality string) {
	if proxy == nil || w.traversalBudgetReached(ctx) || (!proxy.IsReference() && isSimplePrimitiveSchema(proxy.Schema())) {
		return
	}
	target := w.visit(ctx, proxy, childIdentity(parent, label, referenceName(proxy.GetReference())))
	if target.Name != "" {
		w.addRelationship(&MermaidRelationship{Source: parent.ClassID, Target: target.ClassID, Type: relation, Label: label, Cardinality: cardinality})
	}
}

func (w *schemaMermaidWalker) addRelationship(relationship *MermaidRelationship) {
	if relationship == nil || relationship.Source == "" || relationship.Target == "" {
		return
	}
	if w.diagram.Config.MaxRelationships > 0 && w.relationships >= w.diagram.Config.MaxRelationships {
		return
	}
	before := len(w.diagram.Relationships)
	w.diagram.AddRelationship(relationship)
	if len(w.diagram.Relationships) > before {
		w.relationships++
	}
}

func (w *schemaMermaidWalker) relationshipBudgetReached() bool {
	return w.diagram.Config.MaxRelationships > 0 && w.relationships >= w.diagram.Config.MaxRelationships
}

func (w *schemaMermaidWalker) traversalBudgetReached(ctx context.Context) bool {
	if ctx.Err() != nil || w.relationshipBudgetReached() {
		return true
	}
	if w.diagram.Config.MaxDepth > 0 && w.depth >= w.diagram.Config.MaxDepth {
		return true
	}
	return w.diagram.Config.MaxSchemas > 0 && len(w.active)+len(w.completed) >= w.diagram.Config.MaxSchemas
}

func (w *schemaMermaidWalker) assignClassID(identity SchemaIdentity) string {
	baseID := sanitizeID(firstNonEmptyString(identity.ClassID, identity.Name, "Schema"))
	if owner := w.classIDOwner[baseID]; owner == "" || owner == identity.CanonicalPath {
		w.classIDOwner[baseID] = identity.CanonicalPath
		return baseID
	}
	hash := fnv.New32a()
	_, _ = hash.Write([]byte(identity.CanonicalPath))
	classID := fmt.Sprintf("%s_%08x", baseID, hash.Sum32())
	for w.classIDOwner[classID] != "" && w.classIDOwner[classID] != identity.CanonicalPath {
		_, _ = hash.Write([]byte("_"))
		classID = fmt.Sprintf("%s_%08x", baseID, hash.Sum32())
	}
	w.classIDOwner[classID] = identity.CanonicalPath
	return classID
}

func (w *schemaMermaidWalker) recordClassName(name, classID string) {
	if name == "" || classID == "" {
		return
	}
	if existing, ok := w.classIDByName[name]; ok && existing != classID {
		w.classIDByName[name] = ""
		return
	}
	w.classIDByName[name] = classID
}

func (w *schemaMermaidWalker) recordClassReference(source, ref, classID string) {
	key := schemaReferenceKey(source, ref)
	if key == "" || classID == "" {
		return
	}
	if existing, ok := w.classIDByRef[key]; ok && existing != classID {
		w.classIDByRef[key] = ""
		return
	}
	w.classIDByRef[key] = classID
}

func newSchemaMermaidClass(identity SchemaIdentity) *MermaidClass {
	class := NewMermaidClass(identity.ClassID, identity.Name)
	if identity.Name != "" && class.ID != identity.Name {
		class.DisplayName = identity.Name
	}
	return class
}

func schemaReferenceKey(source, ref string) string {
	source = strings.TrimSpace(source)
	ref = strings.TrimSpace(ref)
	if ref == "" {
		return ""
	}
	if sourceURL, err := url.Parse(source); err == nil && sourceURL.Scheme != "" {
		if refURL, parseErr := url.Parse(ref); parseErr == nil {
			return sourceURL.ResolveReference(refURL).String()
		}
	}
	refPath, fragment, hasFragment := strings.Cut(ref, "#")
	target := source
	if refPath != "" {
		if filepath.IsAbs(refPath) {
			target = filepath.Clean(refPath)
		} else if source != "" {
			target = filepath.Join(filepath.Dir(source), filepath.FromSlash(refPath))
		} else {
			target = filepath.Clean(filepath.FromSlash(refPath))
		}
	}
	target = filepath.ToSlash(filepath.Clean(target))
	if hasFragment {
		return target + "#" + fragment
	}
	return target
}

func (w *schemaMermaidWalker) identify(ctx context.Context, proxy *base.SchemaProxy, fallback SchemaIdentity) SchemaIdentity {
	fallback = normalizeSchemaIdentity(fallback, "Schema")
	if w.identities != nil {
		if identity, err := w.identities.Identify(ctx, proxy, fallback); err == nil {
			return normalizeSchemaIdentity(identity, fallback.Name)
		} else {
			w.diagram.Warnings = append(w.diagram.Warnings, fmt.Errorf("identify schema %q: %w", fallback.Name, err))
		}
	}
	if proxy == nil {
		return fallback
	}
	ref := proxy.GetReference()
	if name := referenceName(ref); name != "" {
		fallback.Name = name
	}
	resolvedSchema := proxy.Schema()
	if resolvedSchema != nil && fallback.Name == "Schema" && resolvedSchema.Title != "" {
		fallback.Name = resolvedSchema.Title
	}
	if resolvedSchema != nil && resolvedSchema.GoLow() != nil {
		resolved := resolvedSchema.GoLow()
		if idx := resolved.GetIndex(); idx != nil {
			fallback.SourceLocation = idx.GetSpecAbsolutePath()
		}
		if root := resolved.GetRootNode(); root != nil {
			fallback.CanonicalPath = fmt.Sprintf("%s#L%dC%d", fallback.SourceLocation, root.Line, root.Column)
		}
		return normalizeSchemaIdentity(fallback, "Schema")
	}
	if origin := proxy.GetReferenceOrigin(); origin != nil {
		location := firstNonEmptyString(origin.AbsoluteLocationValue, origin.AbsoluteLocation)
		line := origin.LineValue
		if line == 0 {
			line = origin.Line
		}
		fallback.SourceLocation = location
		if !strings.HasPrefix(ref, "#") && location != "" && line > 0 {
			fallback.CanonicalPath = fmt.Sprintf("%s#L%d", location, line)
		}
	}
	if strings.HasPrefix(ref, "#") {
		fallback.CanonicalPath = fallback.SourceLocation + "|" + ref
	} else if ref != "" && fallback.CanonicalPath == "" {
		fallback.CanonicalPath = fallback.SourceLocation + "|" + ref
	}
	if low := proxy.GoLow(); low != nil {
		if idx := low.GetIndex(); idx != nil {
			if fallback.SourceLocation == "" {
				fallback.SourceLocation = idx.GetSpecAbsolutePath()
			}
		}
		if node := low.GetValueNode(); node != nil && ref == "" {
			fallback.CanonicalPath = fmt.Sprintf("%s#L%dC%d", fallback.SourceLocation, node.Line, node.Column)
		}
	}
	return normalizeSchemaIdentity(fallback, "Schema")
}

func (w *schemaMermaidWalker) collectionCardinality(schema *base.Schema) string {
	if !w.diagram.Config.ShowCardinality {
		return ""
	}
	min, max := "0", "*"
	if schema.MinItems != nil {
		min = fmt.Sprintf("%d", *schema.MinItems)
	}
	if schema.MaxItems != nil {
		max = fmt.Sprintf("%d", *schema.MaxItems)
	}
	return min + ".." + max
}

func childIdentity(parent SchemaIdentity, role, preferredName string) SchemaIdentity {
	name := firstNonEmptyString(preferredName, parent.Name+"_"+role)
	return SchemaIdentity{
		CanonicalPath:  strings.TrimSuffix(parent.CanonicalPath, "/") + "/" + role,
		SourceLocation: parent.SourceLocation,
		Name:           name,
	}
}

func normalizeSchemaIdentity(identity SchemaIdentity, fallbackName string) SchemaIdentity {
	identity.Name = firstNonEmptyString(identity.Name, fallbackName, "Schema")
	if identity.CanonicalPath == "" {
		identity.CanonicalPath = identity.SourceLocation + "#" + identity.Name
	}
	return identity
}

func referenceName(ref string) string {
	if ref == "" {
		return ""
	}
	return ExtractSchemaNameFromReference(ref)
}

func isRelationalSchema(schema *base.Schema) bool {
	if schema == nil {
		return false
	}
	return (schema.Properties != nil && schema.Properties.Len() > 0) || len(schema.AllOf) > 0 || len(schema.OneOf) > 0 || len(schema.AnyOf) > 0 ||
		(schema.Items != nil && schema.Items.IsA() && schema.Items.A != nil) ||
		(schema.AdditionalProperties != nil && schema.AdditionalProperties.IsA() && schema.AdditionalProperties.A != nil)
}

func isSimplePrimitiveSchema(schema *base.Schema) bool {
	if schema == nil || isRelationalSchema(schema) || schema.Title != "" {
		return false
	}
	if len(schema.Type) == 0 {
		return false
	}
	switch schema.Type[0] {
	case "string", "number", "integer", "boolean", "null":
		return true
	default:
		return false
	}
}

func firstNonEmptyString(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
