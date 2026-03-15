// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"sort"

	"github.com/pb33f/libopenapi/bundler"
)

// Site is the fully rendered output from the PrintingPress.
type Site struct {
	Root           *RootPage
	Operations     []*OperationPage
	Models         map[string][]*ModelPage // keyed by component type slug (e.g. "schemas")
	Webhooks []*OperationPage
	NavTags        []*NavTag
	NavModelGroups []*NavModelGroup
	Warnings       []*BuildWarning
	SpecFormat     string // "yaml" or "json" — the input spec format
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
	Parameters             []*ParameterInfo
	ParametersJSON         string `json:"-"` // pre-serialized for Lit component; excluded from JSON writer
	RequestBody            *RequestBodyInfo
	Responses              []*ResponseInfo
	ResponsesJSON          string `json:"-"` // pre-serialized for Lit component; excluded from JSON writer
	CommonHeaders          []*HeaderInfo
	CommonHeadersJSON      string `json:"-"` // pre-serialized for templ rendering
	Security               []map[string][]string
	Servers                []*ServerInfo
	ExternalDoc            *ExternalDocInfo
	Callbacks              map[string]string // callback name → JSON
	SchemaJSON             string            // full operation rendered as JSON for cowboy-components
	SchemaHighlightedHTML  string            `json:"-"` // chroma output, templ only
	RawYAML                string            `json:"-"` // re-rendered YAML from Render(), for raw viewer
	SourceLine             int               `json:"-"` // 1-based YAML line number of the operation
	CrossRefs              *OperationCrossRefs
}

// OperationCrossRefs holds cross-reference information for an operation.
type OperationCrossRefs struct {
	ReferencesModels []*ComponentRef `json:"referencesModels,omitempty"` // components this operation uses
}

// ParameterInfo holds operation parameter data.
type ParameterInfo struct {
	Name        string            `json:"name"`
	In          string            `json:"in"`
	Description string            `json:"description"`
	Required    bool              `json:"required"`
	Deprecated  bool              `json:"deprecated"`
	SchemaJSON  string            `json:"schemaJson"`
	MockJSON    string            `json:"mockJson,omitempty"`
	Examples    map[string]string `json:"examples,omitempty"`
	Ref         *ComponentLink    `json:"ref,omitempty"`
	RawJSON     string            `json:"rawJson,omitempty"`
	RawYAML     string            `json:"rawYaml,omitempty"`
	SourceLine  int               `json:"sourceLine,omitempty"`
}

// RequestBodyInfo holds request body data.
type RequestBodyInfo struct {
	Description string
	Required    bool
	Content     []*MediaTypeInfo
	Ref         *ComponentLink // set when the request body is a $ref
	RawJSON     string
	RawYAML     string
	SourceLine  int
}

// MediaTypeInfo holds a single media type entry.
type MediaTypeInfo struct {
	MediaType             string            `json:"mediaType"`
	SchemaJSON            string            `json:"schemaJson"`
	SchemaHighlightedHTML string            `json:"-"` // chroma output, templ only
	MockJSON              string            `json:"mockJson,omitempty"`
	Examples              map[string]string `json:"examples,omitempty"`
	SchemaRef             *ComponentLink    `json:"schemaRef,omitempty"`
	IsArray               bool              `json:"isArray,omitempty"`
	ItemsRef              *ComponentLink    `json:"itemsRef,omitempty"`
}

// ResponseInfo holds a single response entry.
type ResponseInfo struct {
	StatusCode  string           `json:"statusCode"`
	Description string           `json:"description"`
	Content     []*MediaTypeInfo `json:"content,omitempty"`
	Headers     []*HeaderInfo    `json:"headers,omitempty"`
	Ref         *ComponentLink   `json:"ref,omitempty"`
	RawJSON     string           `json:"rawJson,omitempty"`
	RawYAML     string           `json:"rawYaml,omitempty"`
	SourceLine  int              `json:"sourceLine,omitempty"`
}

// HeaderInfo holds a single response header entry.
type HeaderInfo struct {
	Name        string         `json:"name"`
	Description string         `json:"description,omitempty"`
	SchemaType  string         `json:"schemaType,omitempty"`
	Ref         *ComponentLink `json:"ref,omitempty"`
	Example     string         `json:"example,omitempty"`
	Minimum     *float64       `json:"minimum,omitempty"`
	Maximum     *float64       `json:"maximum,omitempty"`
	Default     string         `json:"default,omitempty"`
	Enum        []string       `json:"enum,omitempty"`
	Pattern     string         `json:"pattern,omitempty"`
}

// ModelPage is the full data for rendering a component detail page.
type ModelPage struct {
	Name                  string
	ComponentType         string // "schemas", "responses", "parameters", etc.
	TypeSlug              string // URL path segment for the component type
	Slug                  string
	Description           string
	DescHTML              string
	SchemaJSON            string // JSON representation for cowboy-components rendering
	SchemaHighlightedHTML string `json:"-"` // chroma output, templ only
	RawYAML               string `json:"-"` // re-rendered YAML from Render(), for raw viewer
	SchemaRawYAML         string `json:"-"` // schema-only YAML for inline viewer (parameters, headers)
	SchemaRawJSON         string `json:"-"` // schema-only JSON for inline viewer (parameters, headers)
	SchemaStartLine       int    `json:"-"` // 1-based source line where schema content begins (parameters, headers)
	MockJSON              string
	Examples              map[string]string
	ExamplesJSON          string // pre-serialized for Lit component
	Origin                *bundler.ComponentOrigin
	CrossRefs             *ModelCrossRefs
}

// ModelCrossRefs holds cross-reference information for a model.
type ModelCrossRefs struct {
	UsedByOperations []*OperationRef `json:"usedByOperations,omitempty"`
	UsedByModels     []*ComponentRef `json:"usedByModels,omitempty"`
	UsesModels       []*ComponentRef `json:"usesModels,omitempty"`
}

// OperationRef is a lightweight reference to an operation from a cross-ref.
type OperationRef struct {
	Method string `json:"method"`
	Path   string `json:"path"`
	Slug   string `json:"slug"`
}

// ComponentRef is a lightweight reference to a component from a cross-ref.
type ComponentRef struct {
	Name          string `json:"name"`
	ComponentType string `json:"componentType"`
	TypeSlug      string `json:"typeSlug"` // URL path segment: "request-bodies", "path-items", etc.
	Slug          string `json:"slug"`
}

// ComponentLink represents a resolved $ref to a component model page.
type ComponentLink struct {
	Name          string `json:"name"`          // original component name
	ComponentType string `json:"componentType"` // ref segment e.g. "responses"
	TypeSlug      string `json:"typeSlug"`      // URL segment e.g. "responses", "request-bodies"
	Slug          string `json:"slug"`          // URL-safe slug for the model page
}

// BuildWarning records a non-fatal issue encountered during documentation generation.
type BuildWarning struct {
	Message string
	Context string // e.g. path, component name
	Err     error
}

// modelDirs returns the list of model subdirectory paths derived from refSegmentToTypeSlug.
func modelDirs() []string {
	dirs := make([]string, 0, len(refSegmentToTypeSlug))
	for _, slug := range refSegmentToTypeSlug {
		dirs = append(dirs, "models/"+slug)
	}
	sort.Strings(dirs)
	return dirs
}
