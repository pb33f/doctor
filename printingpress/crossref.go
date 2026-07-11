// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"regexp"
	"sort"

	. "github.com/pb33f/doctor/printingpress/model"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
)

// CrossRefIndex maps components to the operations and components that reference them.
type CrossRefIndex struct {
	ComponentToOps       map[string][]*OperationRef // component key → operations using it
	ComponentToComponent map[string][]*ComponentRef // component key → components using it
	ComponentUsesModels  map[string][]*ComponentRef // component key → components it references
}

// buildCrossRefs populates cross-reference information on each ModelPage and OperationPage.
func (pp *PrintingPress) buildCrossRefs() {
	idx, _, opRefsCache := pp.getCrossRefIndex()
	if idx == nil {
		return
	}

	// Apply cross-refs to each model page
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			key := slugpkg.ComponentKey(page.ComponentType, page.Name)
			refs := &ModelCrossRefs{}
			if ops, ok := idx.ComponentToOps[key]; ok {
				refs.UsedByOperations = ops
			}
			if comps, ok := idx.ComponentToComponent[key]; ok {
				refs.UsedByModels = comps
			}
			if uses, ok := idx.ComponentUsesModels[key]; ok {
				refs.UsesModels = uses
			}
			page.CrossRefs = refs
		}
	}

	// Apply cross-refs to each operation page
	opCrossRefs := pp.buildOperationCrossRefs(opRefsCache)
	for _, op := range pp.site.Operations {
		key := operationCrossRefKey(op)
		if refs, ok := opCrossRefs[key]; ok {
			op.CrossRefs = refs
		}
	}
	for _, wh := range pp.site.Webhooks {
		key := operationCrossRefKey(wh)
		if refs, ok := opCrossRefs[key]; ok {
			wh.CrossRefs = refs
		}
	}
}

// getCrossRefIndex builds the cross-reference index by scanning SchemaJSON content.
func (pp *PrintingPress) getCrossRefIndex() (*CrossRefIndex, map[string]*ModelPage, map[string][]*ComponentRef) {
	if pp == nil || pp.site == nil {
		return nil, nil, nil
	}

	idx := &CrossRefIndex{
		ComponentToOps:       make(map[string][]*OperationRef),
		ComponentToComponent: make(map[string][]*ComponentRef),
		ComponentUsesModels:  make(map[string][]*ComponentRef),
	}

	// Build model slug lookup (exclude path-items — no HTML pages to link to)
	modelSlugLookup := make(map[string]*ModelPage)
	for typeSlug, pages := range pp.site.Models {
		if typeSlug == typeSlugPathItems {
			continue
		}
		for _, page := range pages {
			key := slugpkg.ComponentKey(page.ComponentType, page.Name)
			modelSlugLookup[key] = page
		}
	}

	// Build model→model refs by scanning each model's SchemaJSON for $ref patterns.
	// Skip path-items — they have no HTML pages so cross-ref links would be broken.
	for typeSlug, pages := range pp.site.Models {
		if typeSlug == typeSlugPathItems {
			continue
		}
		for _, srcPage := range pages {
			if srcPage.SchemaJSON == "" {
				continue
			}
			srcKey := slugpkg.ComponentKey(srcPage.ComponentType, srcPage.Name)
			refs := extractRefsFromJSON(srcPage.SchemaJSON, modelSlugLookup)
			for _, compRef := range refs {
				targetKey := slugpkg.ComponentKey(compRef.ComponentType, compRef.Name)
				if targetKey == srcKey {
					continue // skip self-references
				}
				// src uses target
				addComponentRefUnique(&idx.ComponentUsesModels, srcKey, compRef)
				// target is used by src
				addComponentRefUnique(&idx.ComponentToComponent, targetKey, &ComponentRef{
					Name:          srcPage.Name,
					ComponentType: srcPage.ComponentType,
					TypeSlug:      srcPage.TypeSlug,
					Slug:          srcPage.Slug,
				})
			}
			for _, compRef := range pp.extractAsyncAPIModelRefs(srcPage, modelSlugLookup) {
				targetKey := slugpkg.ComponentKey(compRef.ComponentType, compRef.Name)
				if targetKey == srcKey {
					continue
				}
				addComponentRefUnique(&idx.ComponentUsesModels, srcKey, compRef)
				addComponentRefUnique(&idx.ComponentToComponent, targetKey, modelPageComponentRef(srcPage))
			}
		}
	}

	// Build operation→model and model→operation refs by walking operation pages.
	// Cache per-operation refs to avoid double extraction in buildOperationCrossRefs.
	allOps := pp.allOperations()
	opRefsCache := make(map[string][]*ComponentRef, len(allOps))
	for _, op := range allOps {
		opRef := &OperationRef{
			Method:      op.Method,
			Path:        op.Path,
			Slug:        op.Slug,
			OperationID: op.OperationID,
		}

		key := operationCrossRefKey(op)
		referencedModels := pp.extractOperationModelRefs(op, modelSlugLookup)
		opRefsCache[key] = referencedModels
		for _, compRef := range referencedModels {
			targetKey := slugpkg.ComponentKey(compRef.ComponentType, compRef.Name)
			addOperationRefUnique(&idx.ComponentToOps, targetKey, opRef)
		}
	}

	// Sort all cross-ref lists for deterministic output
	sortCrossRefIndex(idx)

	return idx, modelSlugLookup, opRefsCache
}

// buildOperationCrossRefs builds OperationCrossRefs from cached per-operation refs.
func (pp *PrintingPress) buildOperationCrossRefs(opRefsCache map[string][]*ComponentRef) map[string]*OperationCrossRefs {
	result := make(map[string]*OperationCrossRefs, len(opRefsCache))

	for key, refs := range opRefsCache {
		if len(refs) > 0 {
			sort.Slice(refs, func(i, j int) bool {
				return refs[i].Name < refs[j].Name
			})
			result[key] = &OperationCrossRefs{ReferencesModels: refs}
		}
	}

	return result
}

// extractOperationModelRefs finds all component references in an operation by scanning
// SchemaJSON content for $ref patterns AND checking explicit ComponentLink fields.
func (pp *PrintingPress) extractOperationModelRefs(op *OperationPage, modelSlugLookup map[string]*ModelPage) []*ComponentRef {
	seen := make(map[string]bool)
	var refs []*ComponentRef

	addComponentRef := func(compRef *ComponentRef) {
		if compRef == nil {
			return
		}
		key := slugpkg.ComponentKey(compRef.ComponentType, compRef.Name)
		if seen[key] {
			return
		}
		seen[key] = true
		refs = append(refs, compRef)
	}
	addNamedModel := func(componentType, name string) {
		if name == "" {
			return
		}
		if page := modelSlugLookup[slugpkg.ComponentKey(componentType, name)]; page != nil {
			addComponentRef(modelPageComponentRef(page))
		}
	}
	addRef := func(schemaJSON string) {
		for _, compRef := range extractRefsFromJSON(schemaJSON, modelSlugLookup) {
			addComponentRef(compRef)
		}
	}

	addLink := func(link *ComponentLink) {
		if link == nil {
			return
		}
		key := slugpkg.ComponentKey(link.ComponentType, link.Name)
		if seen[key] {
			return
		}
		if _, ok := modelSlugLookup[key]; ok {
			seen[key] = true
			refs = append(refs, &ComponentRef{
				Name:          link.Name,
				ComponentType: link.ComponentType,
				TypeSlug:      link.TypeSlug,
				Slug:          link.Slug,
			})
		}
	}

	// Scan request body
	if op.RequestBody != nil {
		addLink(op.RequestBody.Ref)
		for _, mt := range op.RequestBody.Content {
			addRef(mt.SchemaJSON)
			addLink(mt.SchemaRef)
			addLink(mt.ItemsRef)
		}
	}

	// Scan responses
	for _, resp := range op.Responses {
		addLink(resp.Ref)
		for _, mt := range resp.Content {
			addRef(mt.SchemaJSON)
			addLink(mt.SchemaRef)
			addLink(mt.ItemsRef)
		}
		for _, h := range resp.Headers {
			addLink(h.Ref)
		}
	}

	// Scan parameter schemas
	for _, p := range op.Parameters {
		addRef(p.SchemaJSON)
		addLink(p.Ref)
	}

	// Scan the same effective security requirements rendered on the operation page.
	if groups, explicitNone, ok := effectiveSecurityGroups(pp.site, op); ok && !explicitNone {
		for _, group := range groups {
			for _, sec := range group.Requirements {
				addLink(sec.Ref)
			}
		}
	} else {
		for _, sec := range op.Security {
			addLink(sec.Ref)
		}
	}

	if op.SpecKind.IsAsyncAPI() && op.AsyncAPI != nil {
		addAsyncChannel := func(channel *AsyncAPIChannelRef) {
			if channel == nil {
				return
			}
			addNamedModel("channels", channel.Name)
		}
		addAsyncMessage := func(message *AsyncAPIMessageRef) {
			if message == nil {
				return
			}
			addNamedModel("messages", message.Name)
			if page := modelSlugLookup[slugpkg.ComponentKey("messages", message.Name)]; page != nil {
				for _, compRef := range pp.extractAsyncAPIModelRefs(page, modelSlugLookup) {
					addComponentRef(compRef)
				}
			}
		}
		addAsyncChannel(op.AsyncAPI.Channel)
		for _, message := range op.AsyncAPI.Messages {
			addAsyncMessage(message)
		}
		if op.AsyncAPI.Reply != nil {
			addLink(op.AsyncAPI.Reply.Ref)
			addAsyncChannel(op.AsyncAPI.Reply.Channel)
			for _, message := range op.AsyncAPI.Reply.Messages {
				addAsyncMessage(message)
			}
		}
	}

	return refs
}

func operationCrossRefKey(op *OperationPage) string {
	if op == nil {
		return ""
	}
	if op.Slug != "" {
		return op.Slug
	}
	return op.Method + " " + op.Path
}

func (pp *PrintingPress) extractAsyncAPIModelRefs(page *ModelPage, modelSlugLookup map[string]*ModelPage) []*ComponentRef {
	if page == nil || page.AsyncAPI == nil {
		return nil
	}
	seen := make(map[string]bool)
	var refs []*ComponentRef
	add := func(ref *ComponentRef) {
		if ref == nil {
			return
		}
		key := slugpkg.ComponentKey(ref.ComponentType, ref.Name)
		if seen[key] {
			return
		}
		seen[key] = true
		refs = append(refs, ref)
	}
	addNamed := func(componentType, name string) {
		if name == "" {
			return
		}
		if target := modelSlugLookup[slugpkg.ComponentKey(componentType, name)]; target != nil {
			add(modelPageComponentRef(target))
		}
	}
	addLink := func(link *ComponentLink) {
		if link == nil {
			return
		}
		addNamed(link.ComponentType, link.Name)
	}

	if page.AsyncAPI.Channel != nil {
		addNamed("channels", page.AsyncAPI.Channel.Name)
	}
	for _, message := range page.AsyncAPI.Messages {
		if message != nil {
			addNamed("messages", message.Name)
		}
	}
	for _, surface := range page.AsyncAPI.Schemas {
		if surface == nil {
			continue
		}
		addLink(surface.Ref)
		for _, compRef := range extractRefsFromJSON(surface.SchemaJSON, modelSlugLookup) {
			add(compRef)
		}
	}
	for _, compRef := range extractRefsFromJSON(page.SchemaJSON, modelSlugLookup) {
		add(compRef)
	}
	return refs
}

func modelPageComponentRef(page *ModelPage) *ComponentRef {
	if page == nil {
		return nil
	}
	return &ComponentRef{
		Name:          page.Name,
		ComponentType: page.ComponentType,
		TypeSlug:      page.TypeSlug,
		Slug:          page.Slug,
	}
}

var refPattern = regexp.MustCompile(`"\$ref"\s*:\s*"#/components/([^"]+)/([^"]+)"`)

// extractRefsFromJSON finds $ref component references in a JSON schema string
// using regex matching, then looks up each match in the provided map.
func extractRefsFromJSON(jsonStr string, lookup map[string]*ModelPage) []*ComponentRef {
	if jsonStr == "" {
		return nil
	}
	matches := refPattern.FindAllStringSubmatch(jsonStr, -1)
	if len(matches) == 0 {
		return nil
	}
	var refs []*ComponentRef
	seen := make(map[string]bool)
	for _, m := range matches {
		compType, compName := decodeJSONPointerToken(m[1]), decodeJSONPointerToken(m[2])
		key := slugpkg.ComponentKey(compType, compName)
		if seen[key] {
			continue
		}
		seen[key] = true
		if page, ok := lookup[key]; ok {
			refs = append(refs, &ComponentRef{
				Name:          compName,
				ComponentType: compType,
				TypeSlug:      page.TypeSlug,
				Slug:          page.Slug,
			})
		}
	}
	return refs
}

func addComponentRefUnique(m *map[string][]*ComponentRef, key string, ref *ComponentRef) {
	for _, existing := range (*m)[key] {
		if existing.Name == ref.Name && existing.ComponentType == ref.ComponentType {
			return
		}
	}
	(*m)[key] = append((*m)[key], ref)
}

func addOperationRefUnique(m *map[string][]*OperationRef, key string, ref *OperationRef) {
	for _, existing := range (*m)[key] {
		if existing.Slug != "" || ref.Slug != "" {
			if existing.Slug == ref.Slug {
				return
			}
			continue
		}
		if existing.Method == ref.Method && existing.Path == ref.Path {
			return
		}
	}
	(*m)[key] = append((*m)[key], ref)
}

func sortCrossRefIndex(idx *CrossRefIndex) {
	for _, refs := range idx.ComponentToOps {
		sort.Slice(refs, func(i, j int) bool {
			return refs[i].Method+" "+refs[i].Path < refs[j].Method+" "+refs[j].Path
		})
	}
	for _, refs := range idx.ComponentToComponent {
		sort.Slice(refs, func(i, j int) bool {
			return refs[i].Name < refs[j].Name
		})
	}
	for _, refs := range idx.ComponentUsesModels {
		sort.Slice(refs, func(i, j int) bool {
			return refs[i].Name < refs[j].Name
		})
	}
}
