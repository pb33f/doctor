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
	Name       string
	Summary    string
	Children   []*NavTag
	Operations []*NavOperation
	IsNavOnly  bool // kind: nav (grouping node with no direct operations)
}

// NavOperation is a lightweight reference to an operation for navigation.
type NavOperation struct {
	Method      string
	Path        string
	OperationID string
	Summary     string
	Slug        string
	Deprecated  bool
}

// NavModelGroup is a group of models of the same component type for navigation.
type NavModelGroup struct {
	Name     string      `json:"Name"`
	TypeSlug string      `json:"TypeSlug"`
	Models   []*NavModel `json:"Models"`
}

// NavModel is a lightweight reference to a model for navigation.
type NavModel struct {
	Name     string `json:"Name"`
	Slug     string `json:"Slug"`
	TypeSlug string `json:"TypeSlug"`
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
}

// ParameterInfo holds operation parameter data.
type ParameterInfo struct {
	Name        string
	In          string // query, header, path, cookie
	Description string
	Required    bool
	Deprecated  bool
	SchemaJSON  string
}

// RequestBodyInfo holds request body data.
type RequestBodyInfo struct {
	Description string
	Required    bool
	Content     []*MediaTypeInfo
}

// MediaTypeInfo holds a single media type entry.
type MediaTypeInfo struct {
	MediaType  string
	SchemaJSON string
	Examples   map[string]string // example name → JSON
}

// ResponseInfo holds a single response entry.
type ResponseInfo struct {
	StatusCode  string
	Description string
	Content     []*MediaTypeInfo
	Headers     map[string]string // header name → JSON
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
	Slug          string
}

// BuildWarning records a non-fatal issue encountered during documentation generation.
type BuildWarning struct {
	Message string
	Context string // e.g. path, component name
	Err     error
}
