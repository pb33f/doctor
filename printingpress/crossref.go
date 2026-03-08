// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"strings"

	"github.com/pb33f/libopenapi/index"
)

// CrossRefIndex maps components to the operations and components that reference them.
type CrossRefIndex struct {
	ComponentToOps       map[string][]*OperationRef  // component key → operations using it
	ComponentToComponent map[string][]*ComponentRef  // component key → components using it
	ComponentUsesModels  map[string][]*ComponentRef  // component key → components it references
}

// buildCrossRefs populates cross-reference information on each ModelPage.
func (pp *PrintingPress) buildCrossRefs() {
	idx := pp.getCrossRefIndex()
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
}

// getCrossRefIndex builds the cross-reference index from the DrDocument's SpecIndex.
func (pp *PrintingPress) getCrossRefIndex() *CrossRefIndex {
	if pp.config.DrDoc == nil {
		return nil
	}

	// Get the spec index from the DrDocument's underlying model
	var specIdx *index.SpecIndex
	if pp.config.DrDoc.V3Document != nil &&
		pp.config.DrDoc.V3Document.Document != nil {
		low := pp.config.DrDoc.V3Document.Document.GoLow()
		if low != nil && low.Index != nil {
			specIdx = low.Index
		}
	}
	if specIdx == nil {
		return nil
	}

	idx := &CrossRefIndex{
		ComponentToOps:       make(map[string][]*OperationRef),
		ComponentToComponent: make(map[string][]*ComponentRef),
		ComponentUsesModels:  make(map[string][]*ComponentRef),
	}

	// Build slug lookups for operations and models
	opSlugLookup := make(map[string]*OperationPage) // "METHOD /path" → page
	for _, op := range pp.site.Operations {
		key := op.Method + " " + op.Path
		opSlugLookup[key] = op
	}

	modelSlugLookup := make(map[string]*ModelPage) // component key → page
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			key := componentKey(page.ComponentType, page.Name)
			modelSlugLookup[key] = page
		}
	}

	// Get all mapped references from the spec index
	allRefs := specIdx.GetMappedReferences()
	for ref := range allRefs {
		// Only handle #/components/ refs
		if !strings.HasPrefix(ref, "#/components/") {
			continue
		}

		// Parse ref into component type and name
		parts := strings.SplitN(strings.TrimPrefix(ref, "#/components/"), "/", 2)
		if len(parts) != 2 {
			continue
		}
		targetType := parts[0]
		targetName := parts[1]
		targetKey := componentKey(targetType, targetName)

		// Check if targetKey exists in our models
		if _, exists := modelSlugLookup[targetKey]; !exists {
			continue
		}

		targetPage := modelSlugLookup[targetKey]
		targetRef := &ComponentRef{
			Name:          targetName,
			ComponentType: targetType,
			Slug:          targetPage.Slug,
		}
		_ = targetRef
	}

	return idx
}
