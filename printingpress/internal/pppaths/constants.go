// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package pppaths

import "path"

const (
	ExtHTML     = ".html"
	ExtJSON     = ".json"
	ExtMarkdown = ".md"

	DirStatic     = "static"
	DirFonts      = "fonts"
	DirShoelace   = "shoelace"
	DirAssets     = "assets"
	DirIcons      = "icons"
	DirOperations = "operations"
	DirModels     = "models"
	DirTags       = "tags"
	DirServices   = "services"
	DirVersions   = "versions"
	DirSpecs      = "specs"
	DirPageData   = "page-data"
	DirPageViz    = "page-viz"

	FileIndexHTML       = "index.html"
	FileDiagnosticsHTML = "diagnostics.html"
	FileIndexJSON       = "index.json"
	FileBundleJSON      = "bundle.json"
	FileManifestJSON    = "manifest.json"
	FileNavJSON         = "nav.json"
	FileLLMIndex        = "llms.txt"
	FileLLMFull         = "llms-full.txt"
	FileLLMOperations   = "llms-operations.txt"
	FileLLMModels       = "llms-models.txt"
	FileAgentsGuide     = "AGENTS.md"
	FileStateSQLite     = ".printingpress-state.db"

	FilePB33FThemeCSS             = "pb33f-theme.css"
	FileCowboyComponentsCSS       = "cowboy-components.css"
	FileShoelaceDarkCSS           = "shoelace-dark.css"
	FilePrintingPressCSS          = "printing-press.css"
	FileChromaCSS                 = "chroma.css"
	FilePrintingPressIndexCSS     = "printing-press-index.css"
	FilePrintingPressCatalogCSS   = "printing-press-catalog.css"
	FilePrintingPressOperationCSS = "printing-press-operation.css"
	FilePrintingPressModelCSS     = "printing-press-model.css"
	FilePrintingPressJS           = "printing-press.js"
	FilePrintingPressLiteJS       = "printing-press-lite.js"

	AssetSharedHydration = "printing-press-shared"
	DiagnosticsSlug      = "diagnostics"
	OrphansJSONPath      = "diagnostics-orphans.json"
)

func StaticAsset(name string) string {
	return path.Join(DirStatic, name)
}

func StaticFontsDir() string {
	return path.Join(DirStatic, DirFonts)
}

func StaticShoelaceIconsDir() string {
	return path.Join(DirStatic, DirShoelace, DirAssets, DirIcons)
}

func StaticDirs() []string {
	return []string{DirStatic, StaticFontsDir(), StaticShoelaceIconsDir()}
}

func SharedHydrationAssetBase() string {
	return StaticAsset(AssetSharedHydration)
}

func PageDataAssetDir() string {
	return path.Join(DirStatic, DirPageData)
}

func PageVizAssetDir() string {
	return path.Join(DirStatic, DirPageViz)
}

func OperationHTML(slug string) string {
	return path.Join(DirOperations, slug+ExtHTML)
}

func OperationJSON(slug string) string {
	return path.Join(DirOperations, slug+ExtJSON)
}

func OperationMarkdown(slug string) string {
	return path.Join(DirOperations, slug+ExtMarkdown)
}

func ModelsIndexHTML() string {
	return path.Join(DirModels, FileIndexHTML)
}

func ModelTypeIndexHTML(typeSlug string) string {
	return path.Join(DirModels, typeSlug, FileIndexHTML)
}

func ModelHTML(typeSlug, slug string) string {
	return path.Join(DirModels, typeSlug, slug+ExtHTML)
}

func ModelJSON(typeSlug, slug string) string {
	return path.Join(DirModels, typeSlug, slug+ExtJSON)
}

func ModelMarkdown(typeSlug, slug string) string {
	return path.Join(DirModels, typeSlug, slug+ExtMarkdown)
}

func TagHTML(slug string) string {
	return path.Join(DirTags, slug+ExtHTML)
}

func OperationPageDataBase(slug string) string {
	return path.Join(PageDataAssetDir(), DirOperations, slug)
}

func RootPageDataBase() string {
	return path.Join(PageDataAssetDir(), "root")
}

func DiagnosticsHTMLPath() string {
	return FileDiagnosticsHTML
}

func DiagnosticsPageDataBase() string {
	return path.Join(PageDataAssetDir(), DiagnosticsSlug)
}

func ModelPageDataBase(typeSlug, slug string) string {
	return path.Join(PageDataAssetDir(), DirModels, typeSlug, slug)
}

func ModelDiagramVizBase(typeSlug, slug string) string {
	return path.Join(PageVizAssetDir(), DirModels, typeSlug, slug+"-diagram")
}

func ModelGraphVizBase(typeSlug, slug string) string {
	return path.Join(PageVizAssetDir(), DirModels, typeSlug, slug+"-graph")
}

func AggregateServiceDir(serviceSlug string) string {
	return path.Join(DirServices, serviceSlug)
}

func AggregateServiceIndexHTML(serviceSlug string) string {
	return path.Join(AggregateServiceDir(serviceSlug), FileIndexHTML)
}

func AggregateServiceIndexJSON(serviceSlug string) string {
	return path.Join(AggregateServiceDir(serviceSlug), FileIndexJSON)
}

func AggregateServiceLLM(serviceSlug string) string {
	return path.Join(AggregateServiceDir(serviceSlug), FileLLMIndex)
}

func AggregateServiceVersionsDir(serviceSlug string) string {
	return path.Join(AggregateServiceDir(serviceSlug), DirVersions)
}

func AggregateServiceVersionsIndexHTML(serviceSlug string) string {
	return path.Join(AggregateServiceVersionsDir(serviceSlug), FileIndexHTML)
}

func AggregateServiceVersionsIndexJSON(serviceSlug string) string {
	return path.Join(AggregateServiceVersionsDir(serviceSlug), FileIndexJSON)
}

func AggregateVersionDir(serviceSlug, versionSlug string) string {
	return path.Join(AggregateServiceVersionsDir(serviceSlug), versionSlug)
}

func AggregateVersionIndexHTML(serviceSlug, versionSlug string) string {
	return path.Join(AggregateVersionDir(serviceSlug, versionSlug), FileIndexHTML)
}

func AggregateVersionIndexJSON(serviceSlug, versionSlug string) string {
	return path.Join(AggregateVersionDir(serviceSlug, versionSlug), FileIndexJSON)
}

func AggregateVersionLLM(serviceSlug, versionSlug string) string {
	return path.Join(AggregateVersionDir(serviceSlug, versionSlug), FileLLMIndex)
}

func AggregateSpecDir(serviceSlug, versionSlug, entrySlug string) string {
	return path.Join(AggregateVersionDir(serviceSlug, versionSlug), DirSpecs, entrySlug)
}

func AggregateSpecIndexHTML(serviceSlug, versionSlug, entrySlug string) string {
	return path.Join(AggregateSpecDir(serviceSlug, versionSlug, entrySlug), FileIndexHTML)
}

func AggregateSpecLLM(serviceSlug, versionSlug, entrySlug string) string {
	return path.Join(AggregateSpecDir(serviceSlug, versionSlug, entrySlug), FileLLMIndex)
}

func AggregateSpecAgentsGuide(serviceSlug, versionSlug, entrySlug string) string {
	return path.Join(AggregateSpecDir(serviceSlug, versionSlug, entrySlug), FileAgentsGuide)
}
