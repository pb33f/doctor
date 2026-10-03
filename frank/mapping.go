// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"regexp"
	"strings"
	"unicode"

	highBase "github.com/pb33f/libopenapi/datamodel/high/base"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

var nonAlnum = regexp.MustCompile(`[^a-z0-9]+`)
var paramBracePattern = regexp.MustCompile(`\{([^}]+)\}`)

type selectedRequestBody struct {
	contentType string
	mediaType   *highV3.MediaType
	bodyType    string
}

// slugify converts a string to a URL/filesystem-safe slug.
func slugify(s string) string {
	s = strings.ToLower(s)
	s = nonAlnum.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	return s
}

// humanizeOperationId converts camelCase, snake_case, or kebab-case to title-case words.
func humanizeOperationId(id string) string {
	if id == "" {
		return ""
	}
	// split camelCase boundaries
	var words []string
	var current []rune
	var prevRune rune
	for i, r := range id {
		if r == '_' || r == '-' {
			if len(current) > 0 {
				words = append(words, string(current))
				current = nil
			}
			prevRune = r
			continue
		}
		if unicode.IsUpper(r) && i > 0 {
			if unicode.IsLower(prevRune) || prevRune == '_' || prevRune == '-' {
				if len(current) > 0 {
					words = append(words, string(current))
					current = nil
				}
			}
		}
		current = append(current, r)
		prevRune = r
	}
	if len(current) > 0 {
		words = append(words, string(current))
	}
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[:1]) + strings.ToLower(w[1:])
		}
	}
	return strings.Join(words, " ")
}

// buildRequestName returns the display name for a request.
// priority: summary > humanized operationId > "METHOD /path"
func buildRequestName(summary, operationId, method, path string) string {
	if summary != "" {
		return summary
	}
	if operationId != "" {
		return humanizeOperationId(operationId)
	}
	return strings.ToUpper(method) + " " + path
}

// buildRequestFileName returns a filesystem-safe filename slug for a request.
func buildRequestFileName(operationId, method, path string) string {
	if operationId != "" {
		return slugify(operationId)
	}
	return slugify(method + "-" + path)
}

// buildURL prepends {{baseUrl}} and converts OpenAPI {param} to Bruno :param colon syntax.
func buildURL(path string) string {
	// convert {paramName} to :paramName
	url := paramBracePattern.ReplaceAllString(path, ":$1")
	return "{{baseUrl}}" + url
}

// renderServerURLTemplate converts OpenAPI server variables to Bruno environment variables.
func renderServerURLTemplate(url string) string {
	return paramBracePattern.ReplaceAllStringFunc(url, func(match string) string {
		name := strings.TrimSuffix(strings.TrimPrefix(match, "{"), "}")
		return fmt.Sprintf("{{%s}}", sanitizeVarName(name))
	})
}

// deriveEnvironmentName returns a name for an environment from a server URL or description.
func deriveEnvironmentName(url, description string) string {
	if description != "" {
		return slugify(description)
	}
	// try to extract hostname
	cleaned := strings.TrimPrefix(strings.TrimPrefix(url, "https://"), "http://")
	if idx := strings.Index(cleaned, "/"); idx > 0 {
		cleaned = cleaned[:idx]
	}
	if idx := strings.Index(cleaned, ":"); idx > 0 {
		cleaned = cleaned[:idx]
	}
	if cleaned == "" {
		return "default"
	}
	return slugify(cleaned)
}

// sanitizeVarName cleans a variable name for {{}} template syntax.
func sanitizeVarName(name string) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' {
			return r
		}
		return '_'
	}, name)
}

// mapSecuritySchemeToAuth converts an OpenAPI security scheme to an OC Auth struct.
// scopes come from the security requirement, not the scheme. For oauth2 that is the
// set the token is requested with, which is usually far smaller than the set the
// scheme advertises.
func mapSecuritySchemeToAuth(scheme *highV3.SecurityScheme, scopes []string, log *slog.Logger) AuthConfig {
	if scheme == nil {
		return nil
	}
	switch scheme.Type {
	case "http":
		if strings.EqualFold(scheme.Scheme, "bearer") {
			return &Auth{Type: "bearer", Token: "{{token}}"}
		}
		if strings.EqualFold(scheme.Scheme, "basic") {
			return &Auth{Type: "basic", Username: "{{username}}", Password: "{{password}}"}
		}
		if strings.EqualFold(scheme.Scheme, "digest") {
			return &Auth{Type: "digest", Username: "{{username}}", Password: "{{password}}"}
		}
		log.Warn("unsupported HTTP auth scheme ignored; OpenCollection only supports bearer, basic, and digest",
			"scheme", scheme.Scheme)
		return nil
	case "apiKey":
		placement := "header"
		switch scheme.In {
		case "", "header":
		case "query":
			placement = "query"
		default:
			log.Warn("apiKey security scheme ignored; OpenCollection only supports header and query placement",
				"name", scheme.Name, "in", scheme.In)
			return nil
		}
		return &Auth{
			Type:      "apikey",
			Key:       scheme.Name,
			Value:     fmt.Sprintf("{{%s}}", sanitizeVarName(scheme.Name)),
			Placement: placement,
		}
	case "oauth2":
		if auth := mapOAuth2ToAuth(scheme.Flows, scopes, log); auth != nil {
			return auth
		}
		return nil
	case "openIdConnect":
		log.Warn("openIdConnect discovery URL dropped; OpenCollection has no openIdConnect auth type, mapping to bearer",
			"openIdConnectUrl", scheme.OpenIdConnectUrl)
		return &Auth{Type: "bearer", Token: "{{token}}"}
	case "mutualTLS":
		log.Warn("mutualTLS security scheme ignored; OpenCollection has no equivalent auth type")
		return nil
	}
	log.Warn("unrecognised security scheme type ignored", "type", scheme.Type)
	return nil
}

// Placeholder variable names match the ones Bruno's own OpenAPI importer emits, so a
// collection generated here and one imported there want the same environment.
const (
	oauthClientID     = "{{oauth_client_id}}"
	oauthClientSecret = "{{oauth_client_secret}}"
	oauthCallbackURL  = "{{oauth_callback_url}}"
	oauthState        = "{{oauth_state}}"
	oauthUsername     = "{{oauth_username}}"
	oauthPassword     = "{{oauth_password}}"
)

// mapOAuth2ToAuth maps OAuth2 flows to the best OC Auth representation.
func mapOAuth2ToAuth(flows *highV3.OAuthFlows, scopes []string, log *slog.Logger) *AuthOAuth2 {
	if flows == nil {
		log.Warn("oauth2 security scheme ignored; it declares no flows")
		return nil
	}
	// preference order: authorization_code > client_credentials > password > implicit
	switch {
	case flows.AuthorizationCode != nil:
		return mapAuthorizationCodeFlow(flows.AuthorizationCode, scopes)
	case flows.ClientCredentials != nil:
		return mapClientCredentialsFlow(flows.ClientCredentials, scopes)
	case flows.Password != nil:
		return mapPasswordFlow(flows.Password, scopes)
	case flows.Implicit != nil:
		return mapImplicitFlow(flows.Implicit, scopes)
	case flows.Device != nil:
		log.Warn("oauth2 device flow ignored; OpenCollection supports client_credentials, resource_owner_password_credentials, authorization_code and implicit")
		return nil
	}
	log.Warn("oauth2 security scheme ignored; it declares no supported flow")
	return nil
}

func mapClientCredentialsFlow(flow *highV3.OAuthFlow, scopes []string) *AuthOAuth2 {
	return &AuthOAuth2{
		Type:            "oauth2",
		Flow:            "client_credentials",
		AccessTokenURL:  flow.TokenUrl,
		RefreshTokenURL: flow.RefreshUrl,
		Credentials:     clientCredentials(),
		Scope:           strings.Join(scopes, " "),
		Settings:        defaultOAuth2Settings(),
	}
}

func mapPasswordFlow(flow *highV3.OAuthFlow, scopes []string) *AuthOAuth2 {
	return &AuthOAuth2{
		Type:            "oauth2",
		Flow:            "resource_owner_password_credentials",
		AccessTokenURL:  flow.TokenUrl,
		RefreshTokenURL: flow.RefreshUrl,
		Credentials:     clientCredentials(),
		ResourceOwner:   &OAuth2ResourceOwner{Username: oauthUsername, Password: oauthPassword},
		Scope:           strings.Join(scopes, " "),
		Settings:        defaultOAuth2Settings(),
	}
}

func mapAuthorizationCodeFlow(flow *highV3.OAuthFlow, scopes []string) *AuthOAuth2 {
	return &AuthOAuth2{
		Type:             "oauth2",
		Flow:             "authorization_code",
		AuthorizationURL: flow.AuthorizationUrl,
		AccessTokenURL:   flow.TokenUrl,
		RefreshTokenURL:  flow.RefreshUrl,
		CallbackURL:      oauthCallbackURL,
		Credentials:      clientCredentials(),
		Scope:            strings.Join(scopes, " "),
		State:            oauthState,
		Settings:         defaultOAuth2Settings(),
	}
}

// The implicit flow has no token endpoint, and its credentials object accepts only
// clientId. Setting anything else here makes the document invalid.
func mapImplicitFlow(flow *highV3.OAuthFlow, scopes []string) *AuthOAuth2 {
	return &AuthOAuth2{
		Type:             "oauth2",
		Flow:             "implicit",
		AuthorizationURL: flow.AuthorizationUrl,
		CallbackURL:      oauthCallbackURL,
		Credentials:      &OAuth2Credentials{ClientID: oauthClientID},
		Scope:            strings.Join(scopes, " "),
		State:            oauthState,
		Settings:         defaultOAuth2Settings(),
	}
}

// OpenAPI has no field for a client secret, so frank emits placeholders. Nor does it
// say where the authorization server wants them, and RFC 6749 section 2.3.1 requires
// every server to accept HTTP Basic while making the request body optional and
// discouraged, so Basic is the safer default.
func clientCredentials() *OAuth2Credentials {
	return &OAuth2Credentials{
		ClientID:     oauthClientID,
		ClientSecret: oauthClientSecret,
		Placement:    "basic_auth_header",
	}
}

func defaultOAuth2Settings() *OAuth2Settings {
	return &OAuth2Settings{AutoFetchToken: true, AutoRefreshToken: true}
}

// resolveCollectionAuth resolves document-level security to a collection Auth.
// returns nil if no security requirements or security: []
func resolveCollectionAuth(
	docSecurity []*highBase.SecurityRequirement,
	securitySchemes *orderedmap.Map[string, *highV3.SecurityScheme],
	log *slog.Logger,
) AuthConfig {
	if len(docSecurity) == 0 || securitySchemes == nil {
		return nil
	}
	// if any requirement is empty {}, anonymous access is allowed (requirements are OR-ed)
	for _, req := range docSecurity {
		if req.Requirements == nil || req.Requirements.Len() == 0 {
			return nil
		}
	}
	return firstSupportedAuth(docSecurity, securitySchemes, log)
}

// resolveOperationAuth resolves per-operation auth.
// returns AuthInherit if no op security, nil if security: [] or the scheme cannot be
// represented, or an auth block. A nil result means the auth key is omitted entirely,
// since OpenCollection has no variant for "no auth".
func resolveOperationAuth(
	opSecurity []*highBase.SecurityRequirement,
	securitySchemes *orderedmap.Map[string, *highV3.SecurityScheme],
	log *slog.Logger,
) AuthConfig {
	// no security field on operation -> inherit from collection
	if opSecurity == nil {
		return AuthInherit{}
	}
	// security: [] -> explicit opt-out
	if len(opSecurity) == 0 {
		return nil
	}
	if securitySchemes == nil {
		return AuthInherit{}
	}
	// if any requirement is empty {}, anonymous access is allowed (requirements are OR-ed)
	for _, req := range opSecurity {
		if req.Requirements == nil || req.Requirements.Len() == 0 {
			return nil
		}
	}
	if auth := firstSupportedAuth(opSecurity, securitySchemes, log); auth != nil {
		return auth
	}
	return nil
}

// firstSupportedAuth returns the first requirement whose scheme maps to an auth type
// OpenCollection can express. Requirements are OR-ed, so skipping one frank cannot
// represent and trying the next is the correct reading.
func firstSupportedAuth(
	security []*highBase.SecurityRequirement,
	securitySchemes *orderedmap.Map[string, *highV3.SecurityScheme],
	log *slog.Logger,
) AuthConfig {
	for _, req := range security {
		if req.Requirements.Len() > 1 {
			log.Warn("security requirement with multiple schemes (AND) simplified to first scheme; OpenCollection supports one auth type per request")
		}
		for name, scopes := range req.Requirements.FromOldest() {
			scheme, ok := securitySchemes.Get(name)
			if !ok {
				continue
			}
			if auth := mapSecuritySchemeToAuth(scheme, scopes, log); auth != nil {
				return auth
			}
		}
	}
	return nil
}

// buildParams merges operation and pathItem parameters, returning only query and path types.
// operation params take precedence over pathItem params with the same name+in.
func buildParams(opParams, piParams []*highV3.Parameter) []RequestParam {
	seen := make(map[string]bool, len(opParams)+len(piParams))
	var result []RequestParam

	// operation params first (higher precedence), then pathItem
	for _, params := range [][]*highV3.Parameter{opParams, piParams} {
		for _, p := range params {
			if p.In != "query" && p.In != "path" {
				continue
			}
			key := p.Name + ":" + p.In
			if seen[key] {
				continue
			}
			seen[key] = true
			result = append(result, RequestParam{
				Name:  p.Name,
				Value: deriveParamValue(p),
				Type:  p.In,
			})
		}
	}
	return result
}

// buildHeaders extracts headers from parameters and content negotiation.
func buildHeaders(opParams, piParams []*highV3.Parameter, selected *selectedRequestBody, responses *highV3.Responses) []RequestHeader {
	seen := make(map[string]bool)
	var result []RequestHeader

	// header-type parameters (operation first, then pathItem)
	for _, params := range [][]*highV3.Parameter{opParams, piParams} {
		for _, p := range params {
			if p.In != "header" {
				continue
			}
			lowerName := strings.ToLower(p.Name)
			if seen[lowerName] {
				continue
			}
			seen[lowerName] = true
			result = append(result, RequestHeader{
				Name:  p.Name,
				Value: deriveHeaderValue(p),
			})
		}
	}

	// Content-Type from request body
	if selected != nil && !seen["content-type"] {
		seen["content-type"] = true
		result = append(result, RequestHeader{
			Name:  "Content-Type",
			Value: selected.contentType,
		})
	}

	// Accept from responses — prefer 2xx with content-type preference
	if responses != nil && responses.Codes != nil {
		var successCTs []string
		var fallbackCT string
		for code, resp := range responses.Codes.FromOldest() {
			if resp.Content == nil {
				continue
			}
			for ct := range resp.Content.FromOldest() {
				if fallbackCT == "" {
					fallbackCT = ct
				}
				if strings.HasPrefix(code, "2") {
					successCTs = append(successCTs, ct)
				}
				break // first content type per response
			}
		}
		acceptCT := selectPreferredContentType(successCTs)
		if acceptCT == "" {
			acceptCT = fallbackCT
		}
		if acceptCT != "" && !seen["accept"] {
			seen["accept"] = true
			result = append(result, RequestHeader{
				Name:  "Accept",
				Value: acceptCT,
			})
		}
	}

	return result
}

// deriveParamValue produces a value for a parameter.
// path params -> {{name}}, query -> example > default > enum[0] > type placeholder > ""
func deriveParamValue(p *highV3.Parameter) string {
	if p.In == "path" {
		return fmt.Sprintf("{{%s}}", sanitizeVarName(p.Name))
	}
	return deriveSchemaValue(p, true)
}

// deriveHeaderValue produces a value for a header parameter.
func deriveHeaderValue(p *highV3.Parameter) string {
	return deriveSchemaValue(p, false)
}

// deriveSchemaValue extracts a value from a parameter's example or schema.
// when includeEnum is true, enum[0] is tried before type placeholders.
func deriveSchemaValue(p *highV3.Parameter, includeEnum bool) string {
	if p.Example != nil {
		return renderYAMLNode(p.Example)
	}
	if p.Schema != nil {
		s := p.Schema.Schema()
		if s != nil {
			if s.Default != nil {
				return renderYAMLNode(s.Default)
			}
			if includeEnum && len(s.Enum) > 0 {
				return renderYAMLNode(s.Enum[0])
			}
			if len(s.Type) > 0 {
				return typePlaceholder(s.Type[0])
			}
		}
	}
	return ""
}

// typePlaceholder returns a sensible placeholder for a JSON Schema type.
func typePlaceholder(t string) string {
	switch t {
	case "string":
		return ""
	case "integer", "number":
		return "0"
	case "boolean":
		return "false"
	case "array":
		return "[]"
	case "object":
		return "{}"
	default:
		return ""
	}
}

// renderYAMLNode extracts a scalar value from a yaml.Node or other value as a string.
func renderYAMLNode(node any) string {
	if node == nil {
		return ""
	}
	if hv, ok := node.(interface{ GetValue() string }); ok {
		return hv.GetValue()
	}
	switch v := node.(type) {
	case *yaml.Node:
		if v.Kind == yaml.ScalarNode {
			return v.Value
		}
		var decoded any
		if err := v.Decode(&decoded); err != nil {
			return fmt.Sprintf("%v", v)
		}
		b, err := json.Marshal(decoded)
		if err != nil {
			return fmt.Sprintf("%v", decoded)
		}
		return string(b)
	case string:
		return v
	case fmt.Stringer:
		return v.String()
	default:
		b, err := json.Marshal(v)
		if err != nil {
			return fmt.Sprintf("%v", v)
		}
		s := string(b)
		if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
			return s[1 : len(s)-1]
		}
		return s
	}
}

// contentTypePreference defines the preference order for content types.
var contentTypePreference = []string{
	"application/json",
	"application/xml",
	"text/xml",
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain",
	"text/html",
}

// selectPreferredContentType returns the best content type from candidates
// based on contentTypePreference order. Returns first candidate if no preferred match.
func selectPreferredContentType(candidates []string) string {
	if len(candidates) == 0 {
		return ""
	}
	for _, preferred := range contentTypePreference {
		for _, ct := range candidates {
			if matchesContentTypePreference(ct, preferred) {
				return ct
			}
		}
	}
	return candidates[0]
}

func selectRequestBody(rb *highV3.RequestBody) *selectedRequestBody {
	if rb == nil || rb.Content == nil {
		return nil
	}

	for _, preferred := range contentTypePreference {
		for ct, mt := range rb.Content.FromOldest() {
			if matchesContentTypePreference(ct, preferred) {
				return &selectedRequestBody{
					contentType: ct,
					mediaType:   mt,
					bodyType:    mapContentType(ct),
				}
			}
		}
	}

	for ct, mt := range rb.Content.FromOldest() {
		return &selectedRequestBody{
			contentType: ct,
			mediaType:   mt,
			bodyType:    mapContentType(ct),
		}
	}

	return nil
}

func matchesContentTypePreference(contentType, preferred string) bool {
	ct := strings.ToLower(contentType)
	switch preferred {
	case "application/json":
		return strings.Contains(ct, "json")
	case "application/xml":
		return strings.HasPrefix(ct, "application/xml")
	case "text/xml":
		return strings.HasPrefix(ct, "text/xml")
	case "application/x-www-form-urlencoded":
		return strings.Contains(ct, "form-urlencoded")
	case "multipart/form-data":
		return strings.Contains(ct, "multipart")
	case "text/plain":
		return strings.HasPrefix(ct, "text/plain")
	case "text/html":
		return strings.HasPrefix(ct, "text/html")
	default:
		return ct == strings.ToLower(preferred)
	}
}

// buildBody maps request body to an OC RequestBody.
func buildBody(selected *selectedRequestBody) *RequestBody {
	if selected == nil {
		return nil
	}

	return &RequestBody{
		Type: selected.bodyType,
		Data: extractBodyData(selected.mediaType),
	}
}

// extractBodyData tries to extract example data from a media type.
func extractBodyData(mt *highV3.MediaType) string {
	if mt == nil {
		return ""
	}
	if mt.Example != nil {
		return renderYAMLNode(mt.Example)
	}
	return ""
}

// mapContentType maps a MIME type to an OC body type string.
func mapContentType(ct string) string {
	ct = strings.ToLower(ct)
	switch {
	case strings.Contains(ct, "json"):
		return "json"
	case strings.Contains(ct, "xml"):
		return "xml"
	case strings.Contains(ct, "form-urlencoded"):
		return "form-urlencoded"
	case strings.Contains(ct, "multipart"):
		return "multipart-form"
	case strings.HasPrefix(ct, "text/"):
		return "text"
	default:
		return "text"
	}
}
