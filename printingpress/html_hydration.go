package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/cespare/xxhash/v2"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

var (
	htmlSharedDataAssetBase = pppaths.SharedHydrationAssetBase()
	htmlPageDataAssetDir    = pppaths.PageDataAssetDir()
	htmlVizDataAssetDir     = pppaths.PageVizAssetDir()
)

const (
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
	Developer      *htmlDeveloperPayload           `json:"developer,omitempty"`
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

type htmlDeveloperPayload struct {
	Counts      ppmodel.ViolationCounts        `json:"counts"`
	SiteCounts  ppmodel.ViolationCounts        `json:"siteCounts,omitempty"`
	Problems    []*ppmodel.PageProblem         `json:"problems,omitempty"`
	Slices      map[string]*ppmodel.YamlSlice  `json:"slices,omitempty"`
	Metadata    map[string]htmlProblemMetadata `json:"metadata,omitempty"`
	OrphanCount int                            `json:"orphanCount,omitempty"`
}

type htmlProblemMetadata struct {
	SliceKey      string `json:"sliceKey,omitempty"`
	PageHref      string `json:"pageHref,omitempty"`
	PageTitle     string `json:"pageTitle,omitempty"`
	PageKind      string `json:"pageKind,omitempty"`
	PageMethod    string `json:"pageMethod,omitempty"`
	PagePath      string `json:"pagePath,omitempty"`
	PageOperation string `json:"pageOperationId,omitempty"`
	PageComponent string `json:"pageComponent,omitempty"`
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
				Href:          pppaths.ModelHTML(typeSlug, page.Slug),
				PageDataBase:  pppaths.ModelPageDataBase(typeSlug, page.Slug),
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
	payload.Developer = buildDeveloperHydrationPayload(page.Counts, page.Problems, page.Slices, ppmodel.ViolationCounts{}, 0)

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
	payload.Developer = buildDeveloperHydrationPayload(page.Counts, page.Problems, page.Slices, ppmodel.ViolationCounts{}, 0)

	if len(payload.Attributes) == 0 {
		payload.Attributes = nil
	}
	return payload
}

func buildRootHydrationPayload(page *ppmodel.RootPage) *htmlHydrationPayload {
	if page == nil {
		return nil
	}
	return &htmlHydrationPayload{
		Developer: buildDeveloperHydrationPayload(page.Counts, page.Problems, page.Slices, ppmodel.ViolationCounts{}, 0),
	}
}

func buildDiagnosticsHydrationPayload(page *ppmodel.DiagnosticsPage) *htmlHydrationPayload {
	if page == nil {
		return nil
	}
	developer := buildDeveloperHydrationPayload(page.SiteCounts, page.Problems, nil, page.SiteCounts, page.OrphanCount)
	if developer == nil {
		developer = &htmlDeveloperPayload{
			Counts:      page.SiteCounts,
			SiteCounts:  page.SiteCounts,
			Problems:    page.Problems,
			OrphanCount: page.OrphanCount,
		}
	}
	return &htmlHydrationPayload{
		Developer: developer,
	}
}

func buildDeveloperHydrationPayload(
	counts ppmodel.ViolationCounts,
	problems []*ppmodel.PageProblem,
	slices map[string]*ppmodel.YamlSlice,
	siteCounts ppmodel.ViolationCounts,
	orphanCount int,
) *htmlDeveloperPayload {
	if counts.Total() == 0 && len(problems) == 0 && len(slices) == 0 && siteCounts.Total() == 0 && orphanCount == 0 {
		return nil
	}
	metadata := make(map[string]htmlProblemMetadata)
	for _, problem := range problems {
		if problem == nil || problem.ID == "" {
			continue
		}
		metadata[problem.ID] = htmlProblemMetadata{
			SliceKey:      problem.SliceKey,
			PageHref:      problem.PageHref,
			PageTitle:     problem.PageTitle,
			PageKind:      problem.PageKind,
			PageMethod:    problem.PageMethod,
			PagePath:      problem.PagePath,
			PageOperation: problem.PageOperationID,
			PageComponent: problem.PageComponent,
		}
	}
	if len(metadata) == 0 {
		metadata = nil
	}
	return &htmlDeveloperPayload{
		Counts:      counts,
		SiteCounts:  siteCounts,
		Problems:    problems,
		Slices:      hydrateYamlSlices(slices),
		Metadata:    metadata,
		OrphanCount: orphanCount,
	}
}

func hydrateYamlSlices(slices map[string]*ppmodel.YamlSlice) map[string]*ppmodel.YamlSlice {
	if len(slices) == 0 {
		return nil
	}
	hydrated := make(map[string]*ppmodel.YamlSlice, len(slices))
	for key, slice := range slices {
		if slice == nil {
			continue
		}
		cp := *slice
		if cp.Source == "" {
			cp.Source = readYamlSliceSource(&cp)
		}
		hydrated[key] = &cp
	}
	if len(hydrated) == 0 {
		return nil
	}
	return hydrated
}

func readYamlSliceSource(slice *ppmodel.YamlSlice) string {
	if slice == nil || slice.FirstLine <= 0 || slice.LastLine < slice.FirstLine {
		return ""
	}
	file := strings.TrimSpace(slice.ResolvedFile)
	if file == "" {
		file = strings.TrimSpace(slice.File)
	}
	if file == "" || strings.Contains(file, "://") {
		return ""
	}
	source, err := os.ReadFile(file)
	if err != nil {
		return ""
	}
	return sourceLineRange(source, slice.FirstLine, slice.LastLine)
}

func sourceLineRange(source []byte, firstLine, lastLine int) string {
	if len(source) == 0 || firstLine <= 0 || lastLine < firstLine {
		return ""
	}
	line := 1
	start := -1
	for i, b := range source {
		if line == firstLine && start == -1 {
			start = i
		}
		if b != '\n' {
			continue
		}
		if line == firstLine && start == -1 {
			start = i
		}
		if line == lastLine {
			if start == -1 {
				start = i
			}
			return string(source[start:i])
		}
		line++
		if line == firstLine {
			start = i + 1
		}
	}
	if start == -1 {
		if line == firstLine {
			start = len(source)
		} else {
			return ""
		}
	}
	return string(source[start:])
}

func marshalHydrationPayload(payload *htmlHydrationPayload) ([]byte, error) {
	if payload == nil {
		return nil, nil
	}
	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	return jsonBytes, nil
}

func hashHydrationPayload(payload *htmlHydrationPayload) (string, error) {
	jsonBytes, err := marshalHydrationPayload(payload)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", xxhash.Sum64(jsonBytes)), nil
}

func writeHydrationAsset(outputDir, assetBase, globalName, assetMode string, payload *htmlHydrationPayload) ([]string, error) {
	if payload == nil {
		return nil, nil
	}

	jsonBytes, err := marshalHydrationPayload(payload)
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
