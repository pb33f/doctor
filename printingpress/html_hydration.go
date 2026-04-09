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
	htmlVizDataAssetDir     = "static/page-viz"

	sharedHydrationGlobal  = "__PP_SHARED_DATA__"
	pageHydrationGlobal    = "__PP_PAGE_DATA__"
	graphHydrationGlobal   = "__PP_VIZ_GRAPH_DATA__"
	diagramHydrationGlobal = "__PP_VIZ_DIAGRAM_DATA__"
)

type htmlHydrationPayload struct {
	Attributes     map[string]map[string]string    `json:"attributes,omitempty"`
	Children       map[string][]htmlHydrationChild `json:"children,omitempty"`
	SchemaRegistry map[string]htmlRegistryEntry    `json:"schemaRegistry,omitempty"`
	Model          *htmlModelAssetData             `json:"model,omitempty"`
}

type htmlHydrationChild struct {
	Tag   string `json:"tag"`
	Type  string `json:"type,omitempty"`
	ID    string `json:"id,omitempty"`
	Class string `json:"class,omitempty"`
	Text  string `json:"text,omitempty"`
	HTML  string `json:"html,omitempty"`
}

type htmlRegistryEntry struct {
	Name          string `json:"name"`
	ComponentType string `json:"componentType"`
	Description   string `json:"description,omitempty"`
	TypeSlug      string `json:"typeSlug"`
	Slug          string `json:"slug"`
	Href          string `json:"href"`
	PageDataBase  string `json:"pageDataBase"`
	HasExample    bool   `json:"hasExample,omitempty"`
}

type htmlModelAssetData struct {
	Name          string `json:"name"`
	ComponentType string `json:"componentType"`
	Description   string `json:"description,omitempty"`
	TypeSlug      string `json:"typeSlug"`
	Slug          string `json:"slug"`
	SchemaJSON    string `json:"schemaJson"`
	MockJSON      string `json:"mockJson,omitempty"`
	RawYAML       string `json:"rawYaml,omitempty"`
	SchemaRawYAML string `json:"schemaRawYaml,omitempty"`
	SchemaRawJSON string `json:"schemaRawJson,omitempty"`
}

func buildModelDiagramVisualizationPayload(page *ppmodel.ModelPage) *htmlHydrationPayload {
	if page == nil || page.MermaidDiagram == "" {
		return nil
	}
	return &htmlHydrationPayload{
		Children: map[string][]htmlHydrationChild{
			"pp-model-diagram": {
				{
					Tag:   "script",
					Type:  "text/plain",
					Class: "pp-mermaid-data",
					Text:  page.MermaidDiagram,
				},
			},
		},
	}
}

func buildModelGraphVisualizationPayload(page *ppmodel.ModelPage) *htmlHydrationPayload {
	if page == nil || page.GraphJSON == "" {
		return nil
	}
	return &htmlHydrationPayload{
		Children: map[string][]htmlHydrationChild{
			"pp-model-explorer": {
				{
					Tag:   "script",
					Type:  "application/json",
					Class: "pp-graph-data",
					Text:  page.GraphJSON,
				},
			},
		},
	}
}

func buildSharedHydrationPayload(site *ppmodel.Site) *htmlHydrationPayload {
	registry := make(map[string]htmlRegistryEntry)
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			registry[page.ComponentType+"/"+page.Name] = htmlRegistryEntry{
				Name:          page.Name,
				ComponentType: page.ComponentType,
				Description:   page.Description,
				TypeSlug:      typeSlug,
				Slug:          page.Slug,
				Href:          filepath.ToSlash(filepath.Join("models", typeSlug, page.Slug+".html")),
				PageDataBase:  filepath.ToSlash(filepath.Join(htmlPageDataAssetDir, "models", typeSlug, page.Slug)),
				HasExample:    page.MockJSON != "",
			}
		}
	}
	return &htmlHydrationPayload{
		Attributes: map[string]map[string]string{
			"pp-nav": {
				"data-nav":      render.MustJSON(site.NavTags),
				"data-models":   render.MustJSON(site.NavModelGroups),
				"data-webhooks": render.MustJSON(site.NavWebhooks),
			},
		},
		SchemaRegistry: registry,
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

	if page.SchemaJSON != "" {
		payload.Model = &htmlModelAssetData{
			Name:          page.Name,
			ComponentType: page.ComponentType,
			Description:   page.Description,
			TypeSlug:      page.TypeSlug,
			Slug:          page.Slug,
			SchemaJSON:    page.SchemaJSON,
			MockJSON:      page.MockJSON,
			RawYAML:       page.RawYAML,
			SchemaRawYAML: page.SchemaRawYAML,
			SchemaRawJSON: page.SchemaRawJSON,
		}
	}

	if len(payload.Attributes) == 0 {
		payload.Attributes = nil
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

func writeHydrationAsset(outputDir, assetBase, globalName, assetMode string, payload *htmlHydrationPayload) ([]string, error) {
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
	switch assetMode {
	case "", HTMLAssetModePortable:
		jsPath := filepath.Join(outputDir, filepath.FromSlash(assetBase+".js"))
		js := fmt.Sprintf("globalThis.%s = %s;\n", globalName, strings.TrimSpace(string(jsonBytes)))
		if err := os.WriteFile(jsPath, []byte(js), 0o644); err != nil {
			return nil, err
		}
		return []string{jsPath}, nil
	case HTMLAssetModeServed:
		if err := os.WriteFile(jsonPath, jsonBytes, 0o644); err != nil {
			return nil, err
		}
		return []string{jsonPath}, nil
	default:
		return nil, fmt.Errorf("unsupported html asset mode %q", assetMode)
	}
}
