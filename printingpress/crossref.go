// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"regexp"
	"sort"
)

// CrossRefIndex maps components to the operations and components that reference them.
type CrossRefIndex struct {
	ComponentToOps       map[string][]*OperationRef  // component key → operations using it
	ComponentToComponent map[string][]*ComponentRef  // component key → components using it
	ComponentUsesModels  map[string][]*ComponentRef  // component key → components it references
}

// buildCrossRefs populates cross-reference information on each ModelPage and OperationPage.
func (pp *PrintingPress) buildCrossRefs() {
	idx, modelSlugLookup := pp.getCrossRefIndex()
	if idx == nil {
		return
	}

	// Apply cross-refs to each model page
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			key := componentKey(page.ComponentType, page.Name)
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
	opCrossRefs := pp.buildOperationCrossRefs(idx, modelSlugLookup)
	for _, op := range pp.site.Operations {
		key := op.Method + " " + op.Path
		if refs, ok := opCrossRefs[key]; ok {
			op.CrossRefs = refs
		}
	}
	for _, wh := range pp.site.Webhooks {
		key := wh.Method + " " + wh.Path
		if refs, ok := opCrossRefs[key]; ok {
			wh.CrossRefs = refs
		}
	}
}

// getCrossRefIndex builds the cross-reference index by scanning SchemaJSON content.
func (pp *PrintingPress) getCrossRefIndex() (*CrossRefIndex, map[string]*ModelPage) {
	if pp.config.DrDoc == nil {
		return nil, nil
	}

	idx := &CrossRefIndex{
		ComponentToOps:       make(map[string][]*OperationRef),
		ComponentToComponent: make(map[string][]*ComponentRef),
		ComponentUsesModels:  make(map[string][]*ComponentRef),
	}

	// Build model slug lookup (exclude path-items — no HTML pages to link to)
	modelSlugLookup := make(map[string]*ModelPage)
	for typeSlug, pages := range pp.site.Models {
		if typeSlug == "path-items" {
			continue
		}
		for _, page := range pages {
			key := componentKey(page.ComponentType, page.Name)
			modelSlugLookup[key] = page
		}
	}

	// Build model→model refs by scanning each model's SchemaJSON for $ref patterns.
	// Skip path-items — they have no HTML pages so cross-ref links would be broken.
	for typeSlug, pages := range pp.site.Models {
		if typeSlug == "path-items" {
			continue
		}
		for _, srcPage := range pages {
			if srcPage.SchemaJSON == "" {
				continue
			}
			srcKey := componentKey(srcPage.ComponentType, srcPage.Name)
			refs := extractRefsFromJSON(srcPage.SchemaJSON, modelSlugLookup)
			for _, compRef := range refs {
				targetKey := componentKey(compRef.ComponentType, compRef.Name)
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
		}
	}

	// Build operation→model and model→operation refs by walking operation pages
	allOps := make([]*OperationPage, 0, len(pp.site.Operations)+len(pp.site.Webhooks))
	allOps = append(allOps, pp.site.Operations...)
	allOps = append(allOps, pp.site.Webhooks...)

	for _, op := range allOps {
		opRef := &OperationRef{
			Method: op.Method,
			Path:   op.Path,
			Slug:   op.Slug,
		}

		referencedModels := pp.extractOperationModelRefs(op, modelSlugLookup)
		for _, compRef := range referencedModels {
			targetKey := componentKey(compRef.ComponentType, compRef.Name)
			addOperationRefUnique(&idx.ComponentToOps, targetKey, opRef)
		}
	}

	// Sort all cross-ref lists for deterministic output
	sortCrossRefIndex(idx)

	return idx, modelSlugLookup
}

// buildOperationCrossRefs builds OperationCrossRefs for each operation by scanning
// its request body and response schemas for component references.
func (pp *PrintingPress) buildOperationCrossRefs(idx *CrossRefIndex, modelSlugLookup map[string]*ModelPage) map[string]*OperationCrossRefs {
	result := make(map[string]*OperationCrossRefs)

	allOps := make([]*OperationPage, 0, len(pp.site.Operations)+len(pp.site.Webhooks))
	allOps = append(allOps, pp.site.Operations...)
	allOps = append(allOps, pp.site.Webhooks...)

	for _, op := range allOps {
		key := op.Method + " " + op.Path
		refs := pp.extractOperationModelRefs(op, modelSlugLookup)
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

	addRef := func(schemaJSON string) {
		for _, compRef := range extractRefsFromJSON(schemaJSON, modelSlugLookup) {
			key := componentKey(compRef.ComponentType, compRef.Name)
			if !seen[key] {
				seen[key] = true
				refs = append(refs, compRef)
			}
		}
	}

	addLink := func(link *ComponentLink) {
		if link == nil {
			return
		}
		key := componentKey(link.ComponentType, link.Name)
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
	}

	// Scan parameter schemas
	for _, p := range op.Parameters {
		addRef(p.SchemaJSON)
		addLink(p.Ref)
	}

	return refs
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
		compType, compName := m[1], m[2]
		key := componentKey(compType, compName)
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
