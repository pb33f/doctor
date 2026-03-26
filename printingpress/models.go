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
	Webhooks       []*OperationPage
	NavTags        []*NavTag
	NavModelGroups []*NavModelGroup
	NavWebhooks    []*NavOperation `json:"-"` // webhook nav entries
	Warnings       []*BuildWarning
	SpecFormat     string // "yaml" or "json" — the input spec format
	SchemaRegistry map[string]*SchemaRegistryEntry `json:"-"` // keyed by "componentType/name"
}

// SchemaRegistryEntry holds the data needed for hover popovers on $ref links.
type SchemaRegistryEntry struct {
	Name          string `json:"name"`
	ComponentType string `json:"componentType"`
	Description   string `json:"description,omitempty"`
	SchemaJSON    string `json:"schemaJson"`
	MockJSON      string `json:"mockJson,omitempty"`
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
	Security           []*SecurityRequirement
	ExternalDoc        *ExternalDocInfo
	TagTree            []*NavTag
	UntaggedOperations []*NavOperation
	Webhooks           []*NavOperation
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
	Security               []*SecurityRequirement
	Servers                []*ServerInfo
	ExternalDoc            *ExternalDocInfo
	Extensions             []*ExtensionEntry `json:"extensions,omitempty"`
	ExtensionsJSON         string            `json:"-"` // pre-serialized for Lit component
	PathExtensions         []*ExtensionEntry `json:"pathExtensions,omitempty"`
	PathExtensionsJSON     string            `json:"-"`
	Callbacks              []*CallbackInfo `json:"callbacks,omitempty"`
	CallbacksJSON          string          `json:"-"` // pre-serialized for Lit component
	SchemaJSON             string            // full operation rendered as JSON for cowboy-components
	SchemaHighlightedHTML  string            `json:"-"` // chroma output, templ only
	RawYAML                string            `json:"-"` // re-rendered YAML from Render(), for raw viewer
	SourceLine             int               `json:"-"` // 1-based YAML line number of the operation
	Location               string            `json:"-"` // source file path for multi-file specs
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
	Extensions  []*ExtensionEntry `json:"extensions,omitempty"`
}

// RequestBodyInfo holds request body data.
type RequestBodyInfo struct {
	Description    string            `json:"description,omitempty"`
	DescHTML       string            `json:"descHtml,omitempty"`
	Required       bool              `json:"required,omitempty"`
	Content        []*MediaTypeInfo  `json:"content,omitempty"`
	Ref            *ComponentLink    `json:"ref,omitempty"`
	RawJSON        string            `json:"rawJson,omitempty"`
	RawYAML        string            `json:"rawYaml,omitempty"`
	SourceLine     int               `json:"sourceLine,omitempty"`
	Extensions     []*ExtensionEntry `json:"extensions,omitempty"`
	ExtensionsJSON string            `json:"-"`
}

// MediaTypeInfo holds a single media type entry.
type MediaTypeInfo struct {
	MediaType             string            `json:"mediaType"`
	SchemaJSON            string            `json:"schemaJson"`
	SchemaHighlightedHTML string            `json:"-"` // chroma output, templ only
	MockJSON              string            `json:"mockJson,omitempty"`
	MockYAML              string            `json:"mockYaml,omitempty"`
	MockXML               string            `json:"mockXml,omitempty"`
	Examples              map[string]string `json:"examples,omitempty"`
	SchemaRef             *ComponentLink    `json:"schemaRef,omitempty"`
	IsArray               bool              `json:"isArray,omitempty"`
	ItemsRef              *ComponentLink    `json:"itemsRef,omitempty"`
	ItemsSchemaJSON       string            `json:"itemsSchemaJson,omitempty"`
	Extensions            []*ExtensionEntry `json:"extensions,omitempty"`
}

// ResponseInfo holds a single response entry.
type ResponseInfo struct {
	StatusCode  string           `json:"statusCode"`
	Description string           `json:"description"`
	DescHTML    string           `json:"descHtml,omitempty"`
	Content     []*MediaTypeInfo `json:"content,omitempty"`
	Headers     []*HeaderInfo    `json:"headers,omitempty"`
	Links       []*LinkInfo      `json:"links,omitempty"`
	Ref         *ComponentLink   `json:"ref,omitempty"`
	RawJSON     string           `json:"rawJson,omitempty"`
	RawYAML     string           `json:"rawYaml,omitempty"`
	SourceLine  int              `json:"sourceLine,omitempty"`
	Extensions  []*ExtensionEntry `json:"extensions,omitempty"`
}

// LinkInfo holds a single response link entry.
type LinkInfo struct {
	Name          string         `json:"name"`
	OperationId   string         `json:"operationId,omitempty"`
	OperationSlug string         `json:"operationSlug,omitempty"`
	OperationRef  string         `json:"operationRef,omitempty"`
	Description   string         `json:"description,omitempty"`
	Ref           *ComponentLink `json:"ref,omitempty"`
}

// CallbackInfo holds a single named callback with its expression operations.
type CallbackInfo struct {
	Name       string                   `json:"name"`
	Ref        *ComponentLink           `json:"ref,omitempty"`
	Operations []*CallbackOperationInfo `json:"operations"`
}

// CallbackOperationInfo holds one operation within a callback expression.
type CallbackOperationInfo struct {
	Expression  string           `json:"expression"`
	Method      string           `json:"method"`
	Description string           `json:"description,omitempty"`
	DescHTML    string           `json:"descHtml,omitempty"`
	RequestBody *RequestBodyInfo `json:"requestBody,omitempty"`
	Responses   []*ResponseInfo  `json:"responses,omitempty"`
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
	Pattern     string            `json:"pattern,omitempty"`
	Extensions  []*ExtensionEntry `json:"extensions,omitempty"`
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

// SecurityRequirement holds a resolved security scheme with type info and model link.
type SecurityRequirement struct {
	Name       string         `json:"name"`
	Scopes     []string       `json:"scopes,omitempty"`
	SchemeType string         `json:"schemeType,omitempty"` // apiKey, http, oauth2, openIdConnect
	In         string         `json:"in,omitempty"`         // query, header, cookie (for apiKey)
	Scheme     string         `json:"scheme,omitempty"`     // bearer, basic (for http)
	Ref        *ComponentLink `json:"ref,omitempty"`        // link to model page
}

// ExtensionEntry holds a single x-* extension key-value pair, preserving spec order.
type ExtensionEntry struct {
	Key   string `json:"key"`
	Value any    `json:"value"`
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
