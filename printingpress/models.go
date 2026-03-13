// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"github.com/pb33f/libopenapi/bundler"
)

// Site is the fully rendered output from the PrintingPress.
type Site struct {
	Root           *RootPage
	Operations     []*OperationPage
	Models         map[string][]*ModelPage // keyed by component type slug (e.g. "schemas")
	Webhooks       []*OperationPage
	NavTags        []*NavTag
	NavModelGroups []*NavModelGroup
	Warnings       []*BuildWarning
}

// RootPage is the landing page data for the generated documentation.
type RootPage struct {
	Title              string
	Description        string
	DescHTML           string
	Version            string
	Contact            *ContactInfo
	License            *LicenseInfo
	Servers            []*ServerInfo
	Security           []map[string][]string
	ExternalDoc        *ExternalDocInfo
	TagTree            []*NavTag
	UntaggedOperations []*NavOperation
	Warnings           []*BuildWarning
}

// ContactInfo holds API contact metadata.
type ContactInfo struct {
	Name  string
	URL   string
	Email string
}

// LicenseInfo holds API license metadata.
type LicenseInfo struct {
	Name string
	URL  string
}

// ServerInfo holds server endpoint data.
type ServerInfo struct {
	URL         string
	Description string
}

// ExternalDocInfo holds external documentation reference.
type ExternalDocInfo struct {
	URL         string
	Description string
}

// NavTag represents a tag node in the hierarchical navigation tree.
type NavTag struct {
	Name       string          `json:"name"`
	Summary    string          `json:"summary"`
	Children   []*NavTag       `json:"children"`
	Operations []*NavOperation `json:"operations"`
	IsNavOnly  bool            `json:"isNavOnly"` // kind: nav (grouping node with no direct operations)
}

// NavOperation is a lightweight reference to an operation for navigation.
type NavOperation struct {
	Method      string `json:"method"`
	Path        string `json:"path"`
	OperationID string `json:"operationId"`
	Summary     string `json:"summary"`
	Slug        string `json:"slug"`
	Deprecated  bool   `json:"deprecated"`
}

// NavModelGroup is a group of models of the same component type for navigation.
type NavModelGroup struct {
	Name     string      `json:"name"`
	TypeSlug string      `json:"typeSlug"`
	Models   []*NavModel `json:"models"`
}

// NavModel is a lightweight reference to a model for navigation.
type NavModel struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	TypeSlug    string `json:"typeSlug"`
	Description string `json:"description,omitempty"`
}

// OperationPage is the full data for rendering an operation detail page.
type OperationPage struct {
	Method       string
	Path         string
	OperationID  string
	Summary      string
	Description  string
	DescHTML     string
	Tags         []string
	Deprecated   bool
	Slug         string
	Parameters   []*ParameterInfo
	RequestBody  *RequestBodyInfo
	Responses    []*ResponseInfo
	Security     []map[string][]string
	Servers      []*ServerInfo
	ExternalDoc  *ExternalDocInfo
	Callbacks    map[string]string // callback name → JSON
	SchemaJSON   string            // full operation rendered as JSON for cowboy-components
	CrossRefs    *OperationCrossRefs
}

// OperationCrossRefs holds cross-reference information for an operation.
type OperationCrossRefs struct {
	ReferencesModels []*ComponentRef // components this operation uses
}

// ParameterInfo holds operation parameter data.
type ParameterInfo struct {
	Name        string
	In          string // query, header, path, cookie
	Description string
	Required    bool
	Deprecated  bool
	SchemaJSON  string
	Ref         *ComponentLink // set when the parameter is a $ref
}

// RequestBodyInfo holds request body data.
type RequestBodyInfo struct {
	Description string
	Required    bool
	Content     []*MediaTypeInfo
	Ref         *ComponentLink // set when the request body is a $ref
}

// MediaTypeInfo holds a single media type entry.
type MediaTypeInfo struct {
	MediaType  string
	SchemaJSON string
	Examples   map[string]string // example name → JSON
	SchemaRef  *ComponentLink    // set when the schema is a $ref
}

// ResponseInfo holds a single response entry.
type ResponseInfo struct {
	StatusCode  string
	Description string
	Content     []*MediaTypeInfo
	Headers     map[string]string // header name → JSON
	Ref         *ComponentLink    // set when the response is a $ref
}

// ModelPage is the full data for rendering a component detail page.
type ModelPage struct {
	Name          string
	ComponentType string // "schemas", "responses", "parameters", etc.
	TypeSlug      string // URL path segment for the component type
	Slug          string
	Description   string
	DescHTML      string
	SchemaJSON    string // JSON representation for cowboy-components rendering
	Origin        *bundler.ComponentOrigin
	CrossRefs     *ModelCrossRefs
}

// ModelCrossRefs holds cross-reference information for a model.
type ModelCrossRefs struct {
	UsedByOperations []*OperationRef
	UsedByModels     []*ComponentRef
	UsesModels       []*ComponentRef
}

// OperationRef is a lightweight reference to an operation from a cross-ref.
type OperationRef struct {
	Method string
	Path   string
	Slug   string
}

// ComponentRef is a lightweight reference to a component from a cross-ref.
type ComponentRef struct {
	Name          string
	ComponentType string
	TypeSlug      string // URL path segment: "request-bodies", "path-items", etc.
	Slug          string
}

// ComponentLink represents a resolved $ref to a component model page.
type ComponentLink struct {
	Name          string // original component name
	ComponentType string // ref segment e.g. "responses"
	TypeSlug      string // URL segment e.g. "responses", "request-bodies"
	Slug          string // URL-safe slug for the model page
}

// BuildWarning records a non-fatal issue encountered during documentation generation.
type BuildWarning struct {
	Message string
	Context string // e.g. path, component name
	Err     error
}
