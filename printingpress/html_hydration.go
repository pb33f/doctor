package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

const (
	htmlSharedDataAssetBase = "static/printing-press-shared"
	htmlPageDataAssetDir    = "static/page-data"

	sharedHydrationGlobal = "__PP_SHARED_DATA__"
	pageHydrationGlobal   = "__PP_PAGE_DATA__"
)

type htmlHydrationPayload struct {
	Attributes     map[string]map[string]string            `json:"attributes,omitempty"`
	Children       map[string][]htmlHydrationChild         `json:"children,omitempty"`
	SchemaRegistry map[string]*ppmodel.SchemaRegistryEntry `json:"schemaRegistry,omitempty"`
}

type htmlHydrationChild struct {
	Tag   string `json:"tag"`
	Type  string `json:"type,omitempty"`
	ID    string `json:"id,omitempty"`
	Class string `json:"class,omitempty"`
	Text  string `json:"text,omitempty"`
	HTML  string `json:"html,omitempty"`
}

func buildSharedHydrationPayload(site *ppmodel.Site) *htmlHydrationPayload {
	return &htmlHydrationPayload{
		Attributes: map[string]map[string]string{
			"pp-nav": {
				"data-nav":      render.MustJSON(site.NavTags),
				"data-models":   render.MustJSON(site.NavModelGroups),
				"data-webhooks": render.MustJSON(site.NavWebhooks),
			},
		},
		SchemaRegistry: site.SchemaRegistry,
	}
}

func buildModelHydrationPayload(page *ppmodel.ModelPage) *htmlHydrationPayload {
	payload := &htmlHydrationPayload{
		Attributes: make(map[string]map[string]string),
		Children:   make(map[string][]htmlHydrationChild),
	}

	if page.RawYAML != "" || page.SchemaJSON != "" {
		payload.Attributes["pp-model-raw"] = map[string]string{
			"raw-json": page.SchemaJSON,
			"raw-yaml": page.RawYAML,
		}
	}

	if page.ComponentType == "securitySchemes" && page.SchemaJSON != "" {
		payload.Attributes["pp-model-security-scheme"] = map[string]string{
			"scheme-json": page.SchemaJSON,
		}
	} else if page.SchemaJSON != "" {
		attrs := map[string]string{
			"model-json": page.SchemaJSON,
		}
		if page.MockJSON != "" {
			attrs["mock-json"] = page.MockJSON
		}
		if page.SchemaRawYAML != "" {
			attrs["schema-raw-yaml"] = page.SchemaRawYAML
		}
		if page.SchemaRawJSON != "" {
			attrs["schema-raw-json"] = page.SchemaRawJSON
		}
		if page.RawYAML != "" {
			attrs["raw-yaml"] = page.RawYAML
		}
		payload.Attributes["pp-model-page"] = attrs
	}

	if page.MermaidDiagram != "" {
		payload.Children["pp-model-diagram"] = append(payload.Children["pp-model-diagram"], htmlHydrationChild{
			Tag:   "script",
			Type:  "text/plain",
			Class: "pp-mermaid-data",
			Text:  page.MermaidDiagram,
		})
		if page.MermaidHighlightedHTML != "" {
			payload.Children["pp-model-diagram"] = append(payload.Children["pp-model-diagram"], htmlHydrationChild{
				Tag:   "template",
				Class: "pp-mermaid-highlighted",
				HTML:  page.MermaidHighlightedHTML,
			})
		}
	}
	if page.GraphJSON != "" {
		payload.Children["pp-model-explorer"] = append(payload.Children["pp-model-explorer"], htmlHydrationChild{
			Tag:   "script",
			Type:  "application/json",
			Class: "pp-graph-data",
			Text:  page.GraphJSON,
		})
	}

	if len(payload.Attributes) == 0 {
		payload.Attributes = nil
	}
	if len(payload.Children) == 0 {
		payload.Children = nil
	}
	return payload
}

func buildOperationHydrationPayload(page *ppmodel.OperationPage) *htmlHydrationPayload {
	payload := &htmlHydrationPayload{
		Attributes: make(map[string]map[string]string),
	}

	if page.RawYAML != "" || page.SchemaJSON != "" {
		payload.Attributes["pp-operation-raw"] = map[string]string{
			"raw-json": page.SchemaJSON,
			"raw-yaml": page.RawYAML,
		}
	}

	if page.RequestBody != nil {
		if page.RequestBody.RawYAML != "" || page.RequestBody.RawJSON != "" {
			payload.Attributes["pp-request-body-raw"] = map[string]string{
				"raw-json": page.RequestBody.RawJSON,
				"raw-yaml": page.RequestBody.RawYAML,
			}
		}
		if page.RequestBody.Ref == nil && len(page.RequestBody.Content) > 0 {
			payload.Attributes["pp-request-body-content"] = map[string]string{
				"content-json": render.MustJSON(page.RequestBody.Content),
			}
		}
	}

	if page.ResponsesJSON != "" || page.CommonHeadersJSON != "" {
		attrs := make(map[string]string)
		if page.ResponsesJSON != "" {
			attrs["responses-json"] = page.ResponsesJSON
		}
		if page.CommonHeadersJSON != "" {
			attrs["common-headers-json"] = page.CommonHeadersJSON
		}
		payload.Attributes["section-responses"] = attrs
	}

	if page.ParametersJSON != "" {
		payload.Attributes["pp-operation-parameters"] = map[string]string{
			"parameters-json": page.ParametersJSON,
		}
	}

	if page.CurlJSON != "" {
		payload.Attributes["pp-operation-curl"] = map[string]string{
			"curl-json": page.CurlJSON,
		}
	}

	if page.CallbacksJSON != "" {
		payload.Attributes["pp-operation-callbacks"] = map[string]string{
			"callbacks-json": page.CallbacksJSON,
		}
	}

	if len(payload.Attributes) == 0 {
		payload.Attributes = nil
	}
	return payload
}

func writeHydrationAsset(outputDir, assetBase, globalName string, payload *htmlHydrationPayload) ([]string, error) {
	if payload == nil {
		return nil, nil
	}

	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("marshalling hydration asset %s: %w", assetBase, err)
	}

	jsonPath := filepath.Join(outputDir, filepath.FromSlash(assetBase+".json"))
	if err := os.MkdirAll(filepath.Dir(jsonPath), 0o755); err != nil {
		return nil, err
	}
	if err := os.WriteFile(jsonPath, jsonBytes, 0o644); err != nil {
		return nil, err
	}

	jsPath := filepath.Join(outputDir, filepath.FromSlash(assetBase+".js"))
	js := fmt.Sprintf("globalThis.%s = %s;\n", globalName, strings.TrimSpace(string(jsonBytes)))
	if err := os.WriteFile(jsPath, []byte(js), 0o644); err != nil {
		return nil, err
	}

	return []string{jsonPath, jsPath}, nil
}
