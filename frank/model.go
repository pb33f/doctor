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
	Auth AuthConfig `yaml:"auth,omitempty"`
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
	Body    RequestBody     `yaml:"body,omitempty"`
	Auth    AuthConfig      `yaml:"auth,omitempty"`
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

// RequestBody is the set of body shapes OpenCollection accepts. A raw body carries
// its payload as text and the others carry a list of fields, so no single struct
// holds them all.
type RequestBody interface {
	isRequestBody()
}

func (*RawBody) isRequestBody()            {}
func (*FormUrlEncodedBody) isRequestBody() {}
func (*MultipartFormBody) isRequestBody()  {}

// RawBody's type is one of json, text, xml or sparql.
type RawBody struct {
	Type string `yaml:"type"`
	Data string `yaml:"data"`
}

type FormUrlEncodedBody struct {
	Type string      `yaml:"type"`
	Data []FormField `yaml:"data"`
}

type FormField struct {
	Name     string `yaml:"name"`
	Value    string `yaml:"value"`
	Disabled bool   `yaml:"disabled,omitempty"`
}

type MultipartFormBody struct {
	Type string           `yaml:"type"`
	Data []MultipartField `yaml:"data"`
}

// MultipartField's type is either text or file.
type MultipartField struct {
	Name        string `yaml:"name"`
	Type        string `yaml:"type"`
	Value       string `yaml:"value"`
	ContentType string `yaml:"contentType,omitempty"`
	Disabled    bool   `yaml:"disabled,omitempty"`
}

// AuthConfig is the set of values an auth field can hold. The marker method is
// unexported, so nothing outside this package can add a variant.
type AuthConfig interface {
	isAuthConfig()
}

// AuthInherit renders as the string "inherit", the only non-object value
// OpenCollection accepts for auth.
type AuthInherit struct{}

func (AuthInherit) MarshalYAML() (any, error) { return "inherit", nil }

func (AuthInherit) isAuthConfig() {}
func (*Auth) isAuthConfig()       {}
func (*AuthOAuth2) isAuthConfig() {}

// Auth represents authentication configuration, discriminated by the Type field.
// It covers the auth types whose fields are flat: bearer, basic, digest and apikey.
// oauth2 nests its configuration and differs per flow, so it has its own type.
type Auth struct {
	Type      string `yaml:"type"`
	Token     string `yaml:"token,omitempty"`
	Username  string `yaml:"username,omitempty"`
	Password  string `yaml:"password,omitempty"`
	Key       string `yaml:"key,omitempty"`
	Value     string `yaml:"value,omitempty"`
	Placement string `yaml:"placement,omitempty"`
}

// AuthOAuth2 represents an oauth2 auth block. Each flow permits a different set of
// fields and OpenCollection rejects any it does not recognise, so the mapper sets
// only the ones its flow allows.
type AuthOAuth2 struct {
	Type             string               `yaml:"type"`
	Flow             string               `yaml:"flow"`
	AuthorizationURL string               `yaml:"authorizationUrl,omitempty"`
	AccessTokenURL   string               `yaml:"accessTokenUrl,omitempty"`
	RefreshTokenURL  string               `yaml:"refreshTokenUrl,omitempty"`
	CallbackURL      string               `yaml:"callbackUrl,omitempty"`
	Credentials      *OAuth2Credentials   `yaml:"credentials,omitempty"`
	ResourceOwner    *OAuth2ResourceOwner `yaml:"resourceOwner,omitempty"`
	Scope            string               `yaml:"scope,omitempty"`
	State            string               `yaml:"state,omitempty"`
	Settings         *OAuth2Settings      `yaml:"settings,omitempty"`
}

// OAuth2Credentials holds the client credentials. The implicit flow accepts only
// clientId, so the other two fields stay empty there.
type OAuth2Credentials struct {
	ClientID     string `yaml:"clientId,omitempty"`
	ClientSecret string `yaml:"clientSecret,omitempty"`
	Placement    string `yaml:"placement,omitempty"`
}

// OAuth2ResourceOwner holds the end-user credentials for the password flow.
type OAuth2ResourceOwner struct {
	Username string `yaml:"username,omitempty"`
	Password string `yaml:"password,omitempty"`
}

// OAuth2Settings controls Bruno's token handling.
type OAuth2Settings struct {
	AutoFetchToken   bool `yaml:"autoFetchToken"`
	AutoRefreshToken bool `yaml:"autoRefreshToken"`
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
