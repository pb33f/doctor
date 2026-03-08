// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

// Collection represents the root opencollection.yml file.
type Collection struct {
	OpenCollection string             `yaml:"opencollection"`
	Bundled        bool               `yaml:"bundled,omitempty"`
	Info           CollectionInfo     `yaml:"info"`
	Request        *CollectionRequest `yaml:"request,omitempty"`
	Extensions     *BrunoExtensions   `yaml:"extensions,omitempty"`
	Items          []*CollectionItem  `yaml:"items,omitempty"`
}

// CollectionInfo holds metadata about the collection.
type CollectionInfo struct {
	Name    string             `yaml:"name"`
	Summary string             `yaml:"summary,omitempty"`
	Version string             `yaml:"version,omitempty"`
	Authors []CollectionAuthor `yaml:"authors,omitempty"`
}

// CollectionAuthor identifies a collection author.
type CollectionAuthor struct {
	Name  string `yaml:"name"`
	Email string `yaml:"email,omitempty"`
}

// CollectionRequest holds collection-level request defaults.
type CollectionRequest struct {
	Auth *Auth `yaml:"auth,omitempty"`
}

// BrunoExtensions holds Bruno-specific configuration.
type BrunoExtensions struct {
	Bruno *BrunoConfig `yaml:"bruno,omitempty"`
}

// BrunoConfig holds Bruno app configuration.
type BrunoConfig struct {
	Ignore []string `yaml:"ignore,omitempty"`
}

// Folder represents a folder.yml file in the collection tree.
type Folder struct {
	Info FolderInfo `yaml:"info"`
}

// FolderInfo holds folder metadata.
type FolderInfo struct {
	Name string `yaml:"name"`
	Seq  int    `yaml:"seq"`
}

// Request represents a single HTTP request .yml file.
type Request struct {
	Info     RequestInfo `yaml:"info"`
	HTTP     RequestHTTP `yaml:"http"`
	Docs     string      `yaml:"docs,omitempty"`
	FileName string      `yaml:"-"`
}

// RequestInfo holds request metadata.
type RequestInfo struct {
	Name string   `yaml:"name"`
	Type string   `yaml:"type"`
	Seq  int      `yaml:"seq"`
	Tags []string `yaml:"tags,omitempty"`
}

// RequestHTTP holds the HTTP details for a request.
type RequestHTTP struct {
	Method  string          `yaml:"method"`
	URL     string          `yaml:"url"`
	Params  []RequestParam  `yaml:"params,omitempty"`
	Headers []RequestHeader `yaml:"headers,omitempty"`
	Body    *RequestBody    `yaml:"body,omitempty"`
	Auth    any             `yaml:"auth,omitempty"`
}

// RequestParam represents a query or path parameter.
// OC params only support query and path types.
type RequestParam struct {
	Name     string `yaml:"name"`
	Value    string `yaml:"value"`
	Type     string `yaml:"type"`
	Disabled bool   `yaml:"disabled,omitempty"`
}

// RequestHeader represents an HTTP header.
type RequestHeader struct {
	Name     string `yaml:"name"`
	Value    string `yaml:"value"`
	Disabled bool   `yaml:"disabled,omitempty"`
}

// RequestBody represents the HTTP request body.
type RequestBody struct {
	Type string `yaml:"type,omitempty"`
	Data string `yaml:"data,omitempty"`
}

// Auth represents authentication configuration, discriminated by the Type field.
type Auth struct {
	Type             string `yaml:"type"`
	Token            string `yaml:"token,omitempty"`
	Username         string `yaml:"username,omitempty"`
	Password         string `yaml:"password,omitempty"`
	Key              string `yaml:"key,omitempty"`
	Value            string `yaml:"value,omitempty"`
	Placement        string `yaml:"placement,omitempty"`
	GrantType        string `yaml:"grantType,omitempty"`
	AuthorizationURL string `yaml:"authorizationUrl,omitempty"`
	TokenURL         string `yaml:"tokenUrl,omitempty"`
	CallbackURL      string `yaml:"callbackUrl,omitempty"`
	Scope            string `yaml:"scope,omitempty"`
}

// Environment represents an environment .yml file.
type Environment struct {
	Name      string                `yaml:"name"`
	Variables []EnvironmentVariable `yaml:"variables"`
}

// EnvironmentVariable represents a single environment variable.
type EnvironmentVariable struct {
	Name  string `yaml:"name"`
	Value string `yaml:"value"`
}

// CollectionItem represents a folder or request in bundled mode.
type CollectionItem struct {
	Info  ItemInfo          `yaml:"info"`
	HTTP  *RequestHTTP      `yaml:"http,omitempty"`
	Docs  string            `yaml:"docs,omitempty"`
	Items []*CollectionItem `yaml:"items,omitempty"`
}

// ItemInfo holds metadata for a bundled collection item.
type ItemInfo struct {
	Name string   `yaml:"name"`
	Type string   `yaml:"type"`
	Seq  int      `yaml:"seq"`
	Tags []string `yaml:"tags,omitempty"`
}
