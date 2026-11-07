// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"encoding/json"
	"html"
	"strings"
)

// orderedEntry is one key of a JSON object and its raw value.
type orderedEntry struct {
	Key   string
	Value json.RawMessage
}

// orderedObject is a JSON object's entries in the order the JSON has them,
// the order Object.keys gives the client.
type orderedObject []orderedEntry

func (o *orderedObject) UnmarshalJSON(raw []byte) error {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	token, err := decoder.Token()
	if err != nil {
		return err
	}
	if delim, ok := token.(json.Delim); !ok || delim != '{' {
		*o = nil
		return nil
	}
	var entries orderedObject
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return err
		}
		name, _ := key.(string)
		var value json.RawMessage
		if err := decoder.Decode(&value); err != nil {
			return err
		}
		entries = append(entries, orderedEntry{Key: name, Value: value})
	}
	*o = entries
	return nil
}

// securitySchemeData is the part of a security scheme pp-security-scheme
// draws.
type securitySchemeData struct {
	Type             string        `json:"type"`
	Name             string        `json:"name"`
	In               string        `json:"in"`
	Scheme           string        `json:"scheme"`
	BearerFormat     string        `json:"bearerFormat"`
	OpenIDConnectURL string        `json:"openIdConnectUrl"`
	Flows            orderedObject `json:"flows"`
}

type securityFlowData struct {
	AuthorizationURL string        `json:"authorizationUrl"`
	TokenURL         string        `json:"tokenUrl"`
	RefreshURL       string        `json:"refreshUrl"`
	Scopes           orderedObject `json:"scopes"`
}

var securityFlowNames = map[string]string{
	"implicit":          "IMPLICIT",
	"authorizationCode": "AUTHORIZATION CODE",
	"clientCredentials": "CLIENT CREDENTIALS",
	"password":          "PASSWORD",
}

func securitySchemeIcon(scheme *securitySchemeData) string {
	switch scheme.Type {
	case "apiKey":
		switch scheme.In {
		case "cookie":
			return "cookie"
		case "header":
			return "envelope"
		case "query":
			return "signpost"
		}
		return "key"
	case "http":
		switch scheme.Scheme {
		case "bearer":
			return "shield-lock"
		case "basic":
			return "person-lock"
		}
		return "lock"
	case "oauth2":
		return "key"
	case "openIdConnect":
		return "fingerprint"
	}
	return "lock"
}

func securityProperty(name, value string) string {
	return `<div class="property"><div class="prop-name-col"><span class="prop-name">` + html.EscapeString(name) +
		`</span></div><div class="prop-type-col"><span class="prop-type">` + html.EscapeString(value) + `</span></div></div>`
}

func securityURLProperty(name, url string) string {
	return `<div class="property"><div class="prop-name-col"><span class="prop-name">` + html.EscapeString(name) +
		`</span></div><div class="prop-type-col"><a class="url-link" href="` + html.EscapeString(url) + `" target="_blank" rel="noopener noreferrer">` + html.EscapeString(url) + `</a></div></div>`
}

// securityScheme writes pp-security-scheme with the scheme's properties and,
// for OAuth2, each flow and its scopes.
func securityScheme(schemaJSON string) string {
	var scheme securitySchemeData
	if err := json.Unmarshal([]byte(schemaJSON), &scheme); err != nil {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<pp-security-scheme id="pp-model-security-scheme" data-pp-owner="page" data-pp-ssr><div class="scheme-properties">`)
	if scheme.Type != "" {
		w.WriteString(`<div class="property"><div class="prop-name-col"><span class="prop-name">type</span></div><div class="prop-type-col"><wa-icon name="` +
			securitySchemeIcon(&scheme) + `" class="type-icon"></wa-icon><span class="prop-type">` + html.EscapeString(strings.ToUpper(scheme.Type)) + `</span></div></div>`)
	}
	for _, field := range [][2]string{{"name", scheme.Name}, {"in", scheme.In}, {"scheme", scheme.Scheme}, {"bearerFormat", scheme.BearerFormat}} {
		if field[1] != "" {
			w.WriteString(securityProperty(field[0], field[1]))
		}
	}
	if scheme.OpenIDConnectURL != "" {
		w.WriteString(securityURLProperty("openIdConnectUrl", scheme.OpenIDConnectURL))
	}
	if scheme.Type == "oauth2" {
		for _, entry := range scheme.Flows {
			var flow securityFlowData
			if err := json.Unmarshal(entry.Value, &flow); err != nil || string(entry.Value) == "null" {
				continue
			}
			heading := securityFlowNames[entry.Key]
			if heading == "" {
				heading = strings.ToUpper(entry.Key)
			}
			w.WriteString(`<div class="flow-section"><div class="flow-heading">` + html.EscapeString(heading) + `</div>`)
			for _, field := range [][2]string{{"authorizationUrl", flow.AuthorizationURL}, {"tokenUrl", flow.TokenURL}, {"refreshUrl", flow.RefreshURL}} {
				if field[1] != "" {
					w.WriteString(securityURLProperty(field[0], field[1]))
				}
			}
			if len(flow.Scopes) > 0 {
				w.WriteString(`<div class="scopes-section"><div class="property scope-header"><div class="prop-name-col"><span class="scope-heading">SCOPES</span></div><div class="prop-type-col"></div></div>`)
				for _, scope := range flow.Scopes {
					var desc string
					if json.Unmarshal(scope.Value, &desc) != nil {
						desc = jsStringify(scope.Value)
					}
					w.WriteString(`<div class="property scope-row"><div class="prop-name-col"><code class="scope-name">` + html.EscapeString(scope.Key) +
						`</code></div><div class="prop-type-col"><span class="scope-desc">` + html.EscapeString(desc) + `</span></div></div>`)
				}
				w.WriteString(`</div>`)
			}
			w.WriteString(`</div>`)
		}
	}
	w.WriteString(`</div></pp-security-scheme>`)
	return w.String()
}
