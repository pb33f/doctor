// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"strings"
)

type ExternalReference struct {
	FilePath   string
	Fragment   string
	Resolved   bool
	SchemaName string
	Error      error
}

type ExternalReferenceHandler struct {
	cache map[string]*ExternalReference
}

func NewExternalReferenceHandler() *ExternalReferenceHandler {
	return &ExternalReferenceHandler{
		cache: make(map[string]*ExternalReference),
	}
}

// ParseExternalReference parses a reference string into components
func (erh *ExternalReferenceHandler) ParseExternalReference(ref string) *ExternalReference {
	if ref == "" {
		return nil
	}

	// check cache first
	if cached, exists := erh.cache[ref]; exists {
		return cached
	}

	ext := &ExternalReference{}

	// check for file-based references (.yaml# or .json#)
	if strings.Contains(ref, ".yaml#") || strings.Contains(ref, ".json#") {
		parts := strings.SplitN(ref, "#", 2)
		ext.FilePath = parts[0]
		if len(parts) > 1 {
			ext.Fragment = parts[1]
		}
	} else if !strings.HasPrefix(ref, "#") && strings.Contains(ref, "#") {
		// could be a URL or other external reference
		parts := strings.SplitN(ref, "#", 2)
		ext.FilePath = parts[0]
		if len(parts) > 1 {
			ext.Fragment = parts[1]
		}
	} else if strings.HasPrefix(ref, "#") {
		// local reference - not external
		ext.Fragment = ref
		ext.SchemaName = ExtractSchemaNameFromReference(ref)
		erh.cache[ref] = ext
		return ext
	} else {
		// no fragment - entire file reference
		ext.FilePath = ref
	}

	// extract schema name from fragment
	if ext.Fragment != "" {
		ext.SchemaName = ExtractSchemaNameFromReference(ext.Fragment)
	}

	erh.cache[ref] = ext
	return ext
}

// IsExternal determines if a reference points to an external file
func (erh *ExternalReferenceHandler) IsExternal(ref string) bool {
	if ref == "" {
		return false
	}

	ext := erh.ParseExternalReference(ref)
	return ext != nil && ext.FilePath != ""
}

// CreateExternalPlaceholder creates a placeholder class for an external schema
func (erh *ExternalReferenceHandler) CreateExternalPlaceholder(ref string) *DiagramClass {
	ext := erh.ParseExternalReference(ref)
	if ext == nil {
		return nil
	}

	className := ext.SchemaName
	if className == "" {
		className = "ExternalSchema"
	}

	class := NewDiagramClass(ref, className)
	class.Annotations = []string{"external"}

	if ext.FilePath != "" {
		class.Metadata["file"] = ext.FilePath
	}
	if ext.Fragment != "" {
		class.Metadata["fragment"] = ext.Fragment
	}

	return class
}

// AnnotateExternalReferences adds external reference information to relationships
func (erh *ExternalReferenceHandler) AnnotateExternalReferences(diagram *Diagram) {
	if diagram == nil {
		return
	}

	for _, rel := range diagram.Relationships {
		if rel == nil {
			continue
		}

		// check if target is external
		if erh.IsExternal(rel.TargetID) {
			if rel.Metadata == nil {
				rel.Metadata = make(map[string]interface{})
			}
			rel.Metadata["external"] = true

			ext := erh.ParseExternalReference(rel.TargetID)
			if ext != nil && ext.FilePath != "" {
				rel.Metadata["externalFile"] = ext.FilePath
			}
		}
	}
}

// GetExternalReferences returns all external references found in a diagram
func (erh *ExternalReferenceHandler) GetExternalReferences(diagram *Diagram) []*ExternalReference {
	if diagram == nil {
		return nil
	}

	externalRefs := make(map[string]*ExternalReference)

	for _, rel := range diagram.Relationships {
		if rel == nil {
			continue
		}

		if erh.IsExternal(rel.TargetID) {
			ext := erh.ParseExternalReference(rel.TargetID)
			if ext != nil {
				externalRefs[rel.TargetID] = ext
			}
		}
	}

	// convert to slice
	refs := make([]*ExternalReference, 0, len(externalRefs))
	for _, ext := range externalRefs {
		refs = append(refs, ext)
	}

	return refs
}

// ClearCache clears the reference parsing cache
func (erh *ExternalReferenceHandler) ClearCache() {
	erh.cache = make(map[string]*ExternalReference)
}
