// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/a-h/templ"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// PrintHTML renders the aggregate catalog and all changed spec sub-sites.
func (ap *AggregatePrintingPress) PrintHTML() (*AggregatePressStatistics, error) {
	return ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
}

// PrintJSONArtifacts writes aggregate JSON metadata and JSON artifacts for all changed spec sub-sites.
func (ap *AggregatePrintingPress) PrintJSONArtifacts() (*AggregatePressStatistics, error) {
	return ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
}

// PrintLLM writes aggregate llms.txt files and per-entry llms output for changed specs.
func (ap *AggregatePrintingPress) PrintLLM() (*AggregatePressStatistics, error) {
	return ap.PrintSelectedOutputs(AggregateRenderOptions{LLM: true})
}

func (ap *AggregatePrintingPress) refreshPlanLocked() (*aggregateBuildPlan, error) {
	plan, err := ap.buildPlan()
	if err != nil {
		return nil, err
	}
	ap.plan = plan
	ap.catalog = plan.catalog
	return plan, nil
}

func (ap *AggregatePrintingPress) renderEntryHTML(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) ([]string, error) {
	site, err := ap.buildEntrySite(spec, entry)
	if err != nil {
		return nil, err
	}
	entryOutput := filepath.Join(ap.config.OutputDir, filepath.FromSlash(spec.OutputSubdir))
	if err := removeAndRecreateDir(entryOutput); err != nil {
		return nil, err
	}
	return writeHTMLSiteDetailed(site, entryOutput, "", nil)
}

func (ap *AggregatePrintingPress) buildEntrySite(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
	specBytes, err := os.ReadFile(spec.AbsolutePath)
	if err != nil {
		return nil, fmt.Errorf("printingpress: reading discovered spec %s: %w", spec.RelativePath, err)
	}
	entryOutput := filepath.Join(ap.config.OutputDir, filepath.FromSlash(spec.OutputSubdir))
	config := &PrintingPressConfig{
		BasePath:  filepath.Dir(spec.AbsolutePath),
		SpecPath:  spec.AbsolutePath,
		OutputDir: entryOutput,
		AssetMode: ap.config.AssetMode,
		Footer:    cloneFooterConfig(ap.config.Footer),
	}
	if ap.config.BaseURL != "" {
		if joined, err := joinBaseURLPath(ap.config.BaseURL, spec.OutputSubdir); err == nil {
			config.BaseURL = joined
		}
	}
	pp, err := CreatePrintingPressFromBytes(specBytes, config)
	if err != nil {
		return nil, err
	}
	site, err := pp.PressModel()
	if err != nil {
		return nil, err
	}
	site.HeaderContext = entry.HeaderContext
	site.Source = entry.Source
	return site, nil
}

func (ap *AggregatePrintingPress) pruneObsoleteOutputs(plan *aggregateBuildPlan, clearChangedOutputs bool) error {
	seen := make(map[string]struct{})
	removeSubdir := func(subdir string) error {
		subdir = strings.TrimSpace(subdir)
		if subdir == "" {
			return nil
		}
		if _, ok := seen[subdir]; ok {
			return nil
		}
		seen[subdir] = struct{}{}
		return os.RemoveAll(filepath.Join(ap.config.OutputDir, filepath.FromSlash(subdir)))
	}
	for _, removed := range plan.removed {
		if err := removeSubdir(removed.OutputSubdir); err != nil {
			return err
		}
	}
	for _, spec := range plan.changed {
		if clearChangedOutputs {
			if err := removeSubdir(spec.OutputSubdir); err != nil {
				return err
			}
		}
		if record := plan.existing[spec.RelativePath]; record != nil && record.OutputSubdir != spec.OutputSubdir {
			if err := removeSubdir(record.OutputSubdir); err != nil {
				return err
			}
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) pruneObsoleteAggregateArtifacts(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	previous := aggregateTopologyFromState(plan.existing)
	current := aggregateTopologyFromCatalog(plan.catalog)

	for serviceSlug, previousVersions := range previous {
		currentVersions, serviceStillVisible := current[serviceSlug]
		if !serviceStillVisible {
			if err := ap.removeAggregateServiceArtifacts(serviceSlug, previousVersions, selection); err != nil {
				return err
			}
			continue
		}
		for versionSlug := range previousVersions {
			if _, ok := currentVersions[versionSlug]; ok {
				continue
			}
			if err := ap.removeAggregateVersionArtifacts(serviceSlug, versionSlug, selection); err != nil {
				return err
			}
		}
	}
	return nil
}

func aggregateTopologyFromState(records map[string]*SpecStateRecord) map[string]map[string]struct{} {
	topology := make(map[string]map[string]struct{})
	for _, record := range records {
		serviceSlug, versionSlug, ok := aggregateTopologyKeys(record.OutputSubdir)
		if !ok {
			continue
		}
		if _, ok := topology[serviceSlug]; !ok {
			topology[serviceSlug] = make(map[string]struct{})
		}
		topology[serviceSlug][versionSlug] = struct{}{}
	}
	return topology
}

func aggregateTopologyFromCatalog(catalog *ppmodel.CatalogSite) map[string]map[string]struct{} {
	topology := make(map[string]map[string]struct{})
	if catalog == nil {
		return topology
	}
	for _, service := range catalog.Services {
		visibleVersions := visibleCatalogVersions(service)
		if len(visibleVersions) == 0 {
			continue
		}
		if _, ok := topology[service.Slug]; !ok {
			topology[service.Slug] = make(map[string]struct{})
		}
		for _, version := range visibleVersions {
			topology[service.Slug][version.Slug] = struct{}{}
		}
	}
	return topology
}

func aggregateTopologyKeys(outputSubdir string) (string, string, bool) {
	parts := strings.Split(strings.Trim(filepath.ToSlash(outputSubdir), "/"), "/")
	if len(parts) < 6 {
		return "", "", false
	}
	if parts[0] != pppaths.DirServices || parts[2] != pppaths.DirVersions || parts[4] != pppaths.DirSpecs {
		return "", "", false
	}
	return parts[1], parts[3], true
}

func (ap *AggregatePrintingPress) removeAggregateServiceArtifacts(serviceSlug string, versions map[string]struct{}, selection aggregateOutputSelection) error {
	if selection.html {
		if err := ap.removeAggregateFile(pppaths.AggregateServiceIndexHTML(serviceSlug)); err != nil {
			return err
		}
		if err := ap.removeAggregateFile(pppaths.AggregateServiceVersionsIndexHTML(serviceSlug)); err != nil {
			return err
		}
	}
	if selection.json {
		if err := ap.removeAggregateFile(pppaths.AggregateServiceIndexJSON(serviceSlug)); err != nil {
			return err
		}
		if err := ap.removeAggregateFile(pppaths.AggregateServiceVersionsIndexJSON(serviceSlug)); err != nil {
			return err
		}
	}
	if selection.llm {
		if err := ap.removeAggregateFile(pppaths.AggregateServiceLLM(serviceSlug)); err != nil {
			return err
		}
	}
	for versionSlug := range versions {
		if err := ap.removeAggregateVersionArtifacts(serviceSlug, versionSlug, selection); err != nil {
			return err
		}
	}
	return ap.removeAggregateDirIfEmpty(pppaths.AggregateServiceVersionsDir(serviceSlug), pppaths.AggregateServiceDir(serviceSlug))
}

func (ap *AggregatePrintingPress) removeAggregateVersionArtifacts(serviceSlug, versionSlug string, selection aggregateOutputSelection) error {
	versionRoot := pppaths.AggregateVersionDir(serviceSlug, versionSlug)
	if selection.html {
		if err := ap.removeAggregateFile(pppaths.AggregateVersionIndexHTML(serviceSlug, versionSlug)); err != nil {
			return err
		}
	}
	if selection.json {
		if err := ap.removeAggregateFile(pppaths.AggregateVersionIndexJSON(serviceSlug, versionSlug)); err != nil {
			return err
		}
	}
	if selection.llm {
		if err := ap.removeAggregateFile(pppaths.AggregateVersionLLM(serviceSlug, versionSlug)); err != nil {
			return err
		}
	}
	return ap.removeAggregateDirIfEmpty(versionRoot)
}

func (ap *AggregatePrintingPress) removeAggregateFile(relPath string) error {
	err := os.Remove(filepath.Join(ap.config.OutputDir, filepath.FromSlash(relPath)))
	if err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func (ap *AggregatePrintingPress) removeAggregateDirIfEmpty(relPaths ...string) error {
	for _, relPath := range relPaths {
		absPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(relPath))
		entries, err := os.ReadDir(absPath)
		if os.IsNotExist(err) {
			continue
		}
		if err != nil {
			return err
		}
		if len(entries) > 0 {
			continue
		}
		if err := os.Remove(absPath); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) persistState(plan *aggregateBuildPlan) error {
	records := make([]*SpecStateRecord, 0, len(plan.discovered))
	skipped := make([]string, 0)
	for _, spec := range plan.discovered {
		if spec.RenderSkipped {
			skipped = append(skipped, spec.RelativePath)
			continue
		}
		records = append(records, &SpecStateRecord{
			RelativePath:    spec.RelativePath,
			Hash:            spec.Hash,
			ConfigHash:      spec.ConfigHash,
			MetadataVersion: aggregateMetadataVersion,
			Title:           spec.Title,
			Summary:         spec.Summary,
			ContactName:     catalogContactName(spec.Contact),
			ContactEmail:    catalogContactEmail(spec.Contact),
			ServiceKey:      spec.ServiceKey,
			DisplayName:     spec.DisplayName,
			Version:         spec.Version,
			Format:          spec.Format,
			OutputSubdir:    spec.OutputSubdir,
			UpdatedAt:       time.Now().UTC(),
		})
	}
	if err := ap.stateStore.Upsert(ap.config.StateNamespace, records); err != nil {
		return err
	}
	paths := make([]string, 0, len(plan.removed))
	for _, record := range plan.removed {
		paths = append(paths, record.RelativePath)
	}
	paths = append(paths, skipped...)
	if len(paths) == 0 {
		return nil
	}
	return ap.stateStore.Delete(ap.config.StateNamespace, paths)
}

func (ap *AggregatePrintingPress) buildAggregateStatistics(plan *aggregateBuildPlan, written []string, discoveryDuration, generationDuration, totalDuration time.Duration) *AggregatePressStatistics {
	stats := &AggregatePressStatistics{
		BuildMode:          ap.config.BuildMode,
		ChangedSpecs:       len(plan.changed),
		FileSizes:          make(map[string]int64),
		DiscoveryDuration:  discoveryDuration,
		GenerationDuration: generationDuration,
		TotalDuration:      totalDuration,
		Warnings:           append([]*ppmodel.BuildWarning(nil), plan.catalog.Warnings...),
	}
	for _, service := range plan.catalog.Services {
		visibleVersions := visibleCatalogVersions(service)
		if len(visibleVersions) == 0 {
			continue
		}
		stats.Services++
		stats.Versions += len(visibleVersions)
		for _, version := range visibleVersions {
			stats.Specs += len(visibleCatalogEntries(version))
		}
	}
	for _, writtenPath := range written {
		info, err := os.Stat(writtenPath)
		if err != nil {
			continue
		}
		rel, relErr := filepath.Rel(ap.config.OutputDir, writtenPath)
		if relErr != nil {
			rel = writtenPath
		}
		stats.FileSizes[filepath.ToSlash(rel)] = info.Size()
		stats.FilesWritten++
		stats.BytesWritten += info.Size()
	}
	return stats
}

func (ap *AggregatePrintingPress) markRenderSkipped(plan *aggregateBuildPlan, spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry, message string, err error) {
	if spec == nil {
		return
	}
	spec.RenderSkipped = true
	if entry != nil {
		entry.RenderSkipped = true
		entry.Warnings = append(entry.Warnings, catalogWarningDetail(message, err))
	}
	warning := &ppmodel.BuildWarning{
		Message: message,
		Context: spec.RelativePath,
		Err:     err,
	}
	if plan != nil && plan.catalog != nil {
		plan.catalog.Warnings = append(plan.catalog.Warnings, warning)
	}
	if ap != nil && ap.config != nil && ap.config.Logger != nil {
		ap.config.Logger.Warn("printingpress: "+message, "path", spec.RelativePath, "error", err)
	}
}

func catalogWarningDetail(message string, err error) string {
	if err == nil {
		return message
	}
	return message + ": " + err.Error()
}

func catalogEntryIndex(catalog *ppmodel.CatalogSite) map[string]*ppmodel.CatalogSpecEntry {
	index := make(map[string]*ppmodel.CatalogSpecEntry)
	if catalog == nil {
		return index
	}
	for _, service := range catalog.Services {
		for _, version := range service.Versions {
			for _, entry := range version.Entries {
				index[entry.RelativePath] = entry
			}
		}
	}
	return index
}

func removeAndRecreateDir(dir string) error {
	if err := os.RemoveAll(dir); err != nil {
		return err
	}
	return os.MkdirAll(dir, 0o755)
}

func joinBaseURLPath(baseURL, relPath string) (string, error) {
	baseURL, err := resolveExplicitBaseURL(baseURL)
	if err != nil {
		return "", err
	}
	cleanRel := strings.TrimPrefix(filepath.ToSlash(relPath), "/")
	if cleanRel == "" {
		return baseURL, nil
	}
	return resolveExplicitBaseURL(baseURL + cleanRel)
}

func (ap *AggregatePrintingPress) writeCatalogHTML(catalog *ppmodel.CatalogSite) ([]string, error) {
	var written []string
	if err := ap.removeObsoleteCatalogHTML(catalog); err != nil {
		return nil, err
	}
	rootPath := filepath.Join(ap.config.OutputDir, pppaths.FileIndexHTML)
	if err := writeCatalogPage(rootPath, ap.catalogPageData(pppaths.FileIndexHTML, catalog.Title, catalog.Description, nil, false, catalogRootContent(catalog, ap.config.DisableSkippedRendering))); err != nil {
		return nil, err
	}
	written = append(written, rootPath)

	for _, service := range catalog.Services {
		if !hasVisibleCatalogVersions(service) {
			continue
		}
		for _, version := range service.Versions {
			if !shouldWriteVersionOverview(version) {
				continue
			}
			versionPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(version.OverviewHref))
			if err := writeCatalogPage(versionPath, ap.catalogPageData(version.OverviewHref, service.DisplayName+" "+version.Label, versionSubtitle(version), service, true, catalogVersionContent(service, version))); err != nil {
				return nil, err
			}
			written = append(written, versionPath)
		}
	}
	return written, nil
}

func (ap *AggregatePrintingPress) removeObsoleteCatalogHTML(catalog *ppmodel.CatalogSite) error {
	if catalog == nil {
		return nil
	}
	removeFile := func(relPath string) error {
		relPath = strings.TrimSpace(relPath)
		if relPath == "" {
			return nil
		}
		err := os.Remove(filepath.Join(ap.config.OutputDir, filepath.FromSlash(relPath)))
		if err != nil && !os.IsNotExist(err) {
			return err
		}
		return nil
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		if err := removeFile(service.OverviewHref); err != nil {
			return err
		}
		if err := removeFile(service.VersionsHref); err != nil {
			return err
		}
		for _, version := range service.Versions {
			if version == nil || shouldWriteVersionOverview(version) {
				continue
			}
			if err := removeFile(version.OverviewHref); err != nil {
				return err
			}
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) writeCatalogJSON(catalog *ppmodel.CatalogSite) ([]string, error) {
	var written []string
	rootBundle := struct {
		Format   string               `json:"format"`
		Catalog  *ppmodel.CatalogSite `json:"catalog"`
		Services int                  `json:"services"`
	}{
		Format:   "printingpress.catalog",
		Catalog:  catalog,
		Services: len(catalog.Services),
	}
	rootBundlePath := filepath.Join(ap.config.OutputDir, pppaths.FileBundleJSON)
	if err := writeJSONFile(rootBundlePath, rootBundle); err != nil {
		return nil, err
	}
	written = append(written, rootBundlePath)

	rootIndexPath := filepath.Join(ap.config.OutputDir, pppaths.FileIndexJSON)
	if err := writeJSONFile(rootIndexPath, catalog); err != nil {
		return nil, err
	}
	written = append(written, rootIndexPath)

	type manifestEntry struct {
		Kind string `json:"kind"`
		Path string `json:"path"`
	}
	manifest := struct {
		Format    string          `json:"format"`
		Artifacts []manifestEntry `json:"artifacts"`
	}{
		Format: "printingpress.catalog.artifacts",
	}
	manifest.Artifacts = append(manifest.Artifacts, manifestEntry{Kind: "catalog", Path: pppaths.FileIndexJSON})

	for _, service := range catalog.Services {
		serviceJSONPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(strings.TrimSuffix(service.OverviewHref, pppaths.ExtHTML)+pppaths.ExtJSON))
		if err := writeJSONFile(serviceJSONPath, service); err != nil {
			return nil, err
		}
		written = append(written, serviceJSONPath)
		relServiceJSON, _ := filepath.Rel(ap.config.OutputDir, serviceJSONPath)
		manifest.Artifacts = append(manifest.Artifacts, manifestEntry{Kind: "service", Path: filepath.ToSlash(relServiceJSON)})

		versionsJSONPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(strings.TrimSuffix(service.VersionsHref, pppaths.ExtHTML)+pppaths.ExtJSON))
		if err := writeJSONFile(versionsJSONPath, service.Versions); err != nil {
			return nil, err
		}
		written = append(written, versionsJSONPath)
		relVersionsJSON, _ := filepath.Rel(ap.config.OutputDir, versionsJSONPath)
		manifest.Artifacts = append(manifest.Artifacts, manifestEntry{Kind: "versions", Path: filepath.ToSlash(relVersionsJSON)})

		for _, version := range service.Versions {
			versionJSONPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(strings.TrimSuffix(version.OverviewHref, pppaths.ExtHTML)+pppaths.ExtJSON))
			if err := writeJSONFile(versionJSONPath, version); err != nil {
				return nil, err
			}
			written = append(written, versionJSONPath)
			relVersionJSON, _ := filepath.Rel(ap.config.OutputDir, versionJSONPath)
			manifest.Artifacts = append(manifest.Artifacts, manifestEntry{Kind: "version", Path: filepath.ToSlash(relVersionJSON)})
		}
	}
	manifestPath := filepath.Join(ap.config.OutputDir, pppaths.FileManifestJSON)
	if err := writeJSONFile(manifestPath, manifest); err != nil {
		return nil, err
	}
	written = append(written, manifestPath)
	return written, nil
}

func (ap *AggregatePrintingPress) writeCatalogLLM(catalog *ppmodel.CatalogSite) ([]string, error) {
	var written []string
	rootAgentsPath := filepath.Join(ap.config.OutputDir, pppaths.FileAgentsGuide)
	if err := os.WriteFile(rootAgentsPath, []byte(buildCatalogAgentsGuide(catalog)), 0o644); err != nil {
		return nil, err
	}
	written = append(written, rootAgentsPath)

	rootPath := filepath.Join(ap.config.OutputDir, pppaths.FileLLMIndex)
	if err := os.WriteFile(rootPath, []byte(buildCatalogLLMIndex(catalog)), 0o644); err != nil {
		return nil, err
	}
	written = append(written, rootPath)

	for _, service := range visibleCatalogServices(catalog) {
		servicePath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(service.Slug)))
		if err := os.MkdirAll(filepath.Dir(servicePath), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(servicePath, []byte(buildServiceLLMIndex(service)), 0o644); err != nil {
			return nil, err
		}
		written = append(written, servicePath)

		for _, version := range visibleCatalogVersions(service) {
			versionPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(service.Slug, version.Slug)))
			if err := os.MkdirAll(filepath.Dir(versionPath), 0o755); err != nil {
				return nil, err
			}
			if err := os.WriteFile(versionPath, []byte(buildVersionLLMIndex(service, version)), 0o644); err != nil {
				return nil, err
			}
			written = append(written, versionPath)
		}
	}
	return written, nil
}

type catalogPageData struct {
	RelPath       string
	HeaderTitle   string
	Title         string
	Subtitle      string
	Service       *ppmodel.CatalogService
	Content       templ.Component
	AssetBase     string
	ShowHeroTitle bool
	Footer        *ppmodel.FooterConfig
}

func (ap *AggregatePrintingPress) catalogPageData(relPath, title, subtitle string, service *ppmodel.CatalogService, showHeroTitle bool, content templ.Component) catalogPageData {
	headerTitle := title
	if ap.catalog != nil && strings.TrimSpace(ap.catalog.Title) != "" {
		headerTitle = ap.catalog.Title
	}
	return catalogPageData{
		RelPath:       relPath,
		HeaderTitle:   headerTitle,
		Title:         title,
		Subtitle:      subtitle,
		Service:       service,
		Content:       content,
		AssetBase:     ap.catalogAssetBase(relPath),
		ShowHeroTitle: showHeroTitle,
		Footer:        cloneFooterConfig(ap.config.Footer),
	}
}

func (ap *AggregatePrintingPress) catalogAssetBase(relPath string) string {
	if ap.config.BaseURL != "" {
		return ap.config.BaseURL
	}
	dir := path.Dir(relPath)
	if dir == "." || dir == "" {
		return ""
	}
	depth := len(strings.Split(dir, "/"))
	return strings.Repeat("../", depth)
}

func writeCatalogPage(filePath string, page catalogPageData) error {
	if err := os.MkdirAll(filepath.Dir(filePath), 0o755); err != nil {
		return err
	}
	f, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	shell := catalogShell(page)
	return shell.Render(context.Background(), f)
}

func writeCatalogHead(w io.Writer, title, assetBase string) error {
	assets := []string{
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FilePB33FThemeCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FileCowboyComponentsCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FileShoelaceDarkCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FilePrintingPressCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FileChromaCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)),
		catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FilePrintingPressCatalogCSS)),
	}
	if _, err := io.WriteString(w, `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script>
			(function() {
				try {
					var root = document.documentElement;
					var storedTheme = localStorage.getItem('pb33f-theme');
					var theme = storedTheme === 'tektronix' ? 'tektronix' : (storedTheme === 'light' ? 'light' : 'dark');
					var splitPos = sessionStorage.getItem('pp-split-position');
					root.setAttribute('theme', theme);
					root.style.setProperty('--pp-split-position', splitPos ? splitPos + '%' : '20%');
					if (theme === 'light') {
						root.classList.remove('sl-theme-dark');
					} else {
						root.classList.add('sl-theme-dark');
					}
				} catch (_) {}
			})();
		</script><title>`+templ.EscapeString(title)+`</title>`); err != nil {
		return err
	}
	for _, asset := range assets {
		if _, err := io.WriteString(w, `<link rel="stylesheet" href="`+templ.EscapeString(asset)+`">`); err != nil {
			return err
		}
	}
	if _, err := io.WriteString(w, `<script defer src="`+templ.EscapeString(catalogAssetHref(assetBase, pppaths.StaticAsset(pppaths.FilePrintingPressJS)))+`"></script></head>`); err != nil {
		return err
	}
	return nil
}

func catalogAssetHref(assetBase, href string) string {
	if strings.TrimSpace(assetBase) == "" {
		return href
	}
	return assetBase + href
}

func catalogShell(page catalogPageData) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if _, err := io.WriteString(w, `<!doctype html><html lang="en" class="sl-theme-dark">`); err != nil {
			return err
		}
		if err := writeCatalogHead(w, page.Title, page.AssetBase); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<body class="pp-catalog-body"><pb33f-header name="`+templ.EscapeString(page.HeaderTitle)+`" url="`+templ.EscapeString(relativeCatalogHref(path.Dir(page.RelPath), pppaths.FileIndexHTML))+`" fluid><div class="header-tools">`); err != nil {
			return err
		}
		if hasCatalogVersionSwitcher(page.Service) {
			if _, err := io.WriteString(w, catalogVersionPickerHTML(path.Dir(page.RelPath), page.RelPath, page.Service, "version-picker version-picker--catalog", "pp-catalog-select", true)); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `<div class="theme-controls"><pb33f-theme-switcher></pb33f-theme-switcher></div></div></pb33f-header>`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<div class="pp-layout-fallback-header" aria-hidden="true"><span class="pp-layout-fallback-caret">$</span><span class="pp-layout-fallback-name">`+templ.EscapeString(page.HeaderTitle)+`</span></div><main class="pp-catalog-shell">`); err != nil {
			return err
		}
		if page.ShowHeroTitle || strings.TrimSpace(page.Subtitle) != "" {
			if _, err := io.WriteString(w, `<section class="pp-catalog-hero">`); err != nil {
				return err
			}
			if page.ShowHeroTitle {
				if _, err := io.WriteString(w, `<h1 class="pp-catalog-title">`+templ.EscapeString(page.Title)+`</h1>`); err != nil {
					return err
				}
			}
			if strings.TrimSpace(page.Subtitle) != "" {
				if _, err := io.WriteString(w, `<p class="pp-catalog-subtitle">`+templ.EscapeString(page.Subtitle)+`</p>`); err != nil {
					return err
				}
			}
			if _, err := io.WriteString(w, `</section>`); err != nil {
				return err
			}
		}
		if err := page.Content.Render(ctx, w); err != nil {
			return err
		}
		if err := render.WriteFooter(w, page.Footer); err != nil {
			return err
		}
		_, err := io.WriteString(w, `</main><script>
			document.addEventListener('sl-select', function(event) {
				const menu = event.target && event.target.closest ? event.target.closest('sl-menu[data-catalog-version-menu]') : null;
				if (!menu) return;
				const item = event.detail && event.detail.item;
				const value = item && item.value;
				if (value) window.location.href = value;
			});
		</script></body></html>`)
		return err
	})
}

func catalogRootContent(catalog *ppmodel.CatalogSite, disableSkippedRendering bool) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if catalog == nil {
			return nil
		}
		if !disableSkippedRendering {
			if err := renderCatalogWarnings(w, catalog.Warnings); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `<section class="pp-catalog-section"><div class="pp-model-cards">`); err != nil {
			return err
		}
		for _, service := range catalog.Services {
			if !hasVisibleCatalogVersions(service) {
				continue
			}
			if _, err := io.WriteString(w, `<article class="pp-catalog-card pp-model-card">`); err != nil {
				return err
			}
			if _, err := io.WriteString(w, `<h2 class="pp-catalog-card-title"><a href="`+templ.EscapeString(servicePrimaryHref(service))+`">`+templ.EscapeString(service.DisplayName)+`</a></h2>`); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogSummaryHTML(catalogServiceSummary(service))); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogContactHTML(catalogServiceContact(service))); err != nil {
				return err
			}
			if hasCatalogVersionSwitcher(service) {
				if _, err := io.WriteString(w, catalogVersionPickerHTML(".", "", service, "version-picker version-picker--card", "pp-catalog-select", false)); err != nil {
					return err
				}
			}
			if _, err := io.WriteString(w, `</article>`); err != nil {
				return err
			}
		}
		_, err := io.WriteString(w, `</div></section>`)
		return err
	})
}

func servicePrimaryHref(service *ppmodel.CatalogService) string {
	version := catalogVisibleLatestVersion(service)
	if version == nil {
		return ""
	}
	return catalogVersionPrimaryHref(version)
}

func catalogVersionContent(service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if version == nil || len(visibleCatalogEntries(version)) == 0 {
			return nil
		}
		if _, err := io.WriteString(w, `<section class="pp-catalog-section"><article class="pp-catalog-card pp-model-card"><h2 class="pp-catalog-card-title"><a href="`+templ.EscapeString(relativeCatalogHref(path.Dir(version.OverviewHref), catalogVersionPrimaryHref(version)))+`">`+templ.EscapeString(version.Label)+`</a></h2>`+
			catalogSummaryHTML(version.Summary)+
			`</article></section>`); err != nil {
			return err
		}
		return catalogVersionEntriesContent(service, version).Render(ctx, w)
	})
}

func catalogVersionEntriesContent(service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if version == nil {
			return nil
		}
		entries := visibleCatalogEntries(version)
		if len(entries) > 1 {
			if _, err := io.WriteString(w, `<pb33f-attention-box class="pp-catalog-warning" type="warning" headerText="Multiple Specification Entries"><p>Multiple specs were discovered for this service version. Each entry remains available separately.</p></pb33f-attention-box>`); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `<section class="pp-catalog-section"><h2>Specification Entries</h2><div class="pp-model-cards">`); err != nil {
			return err
		}
		for _, entry := range entries {
			if _, err := io.WriteString(w, `<article class="pp-catalog-entry pp-model-card">`); err != nil {
				return err
			}
			if _, err := io.WriteString(w, `<h3 class="pp-catalog-card-title"><a href="`+templ.EscapeString(relativeCatalogHref(path.Dir(version.OverviewHref), entry.OverviewHref))+`">`+templ.EscapeString(entry.Title)+`</a></h3>`); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogSummaryHTML(entry.Summary)); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogContactHTML(entry.Contact)); err != nil {
				return err
			}
			if _, err := io.WriteString(w, `</article>`); err != nil {
				return err
			}
		}
		_, err := io.WriteString(w, `</div></section>`)
		return err
	})
}

func versionSubtitle(version *ppmodel.CatalogVersion) string {
	if version == nil {
		return ""
	}
	if version.Summary != "" {
		return version.Summary
	}
	return fmt.Sprintf("%d discovered specification entries for this version.", version.SpecCount)
}

func hasCatalogVersionSwitcher(service *ppmodel.CatalogService) bool {
	return len(visibleCatalogVersions(service)) > 1
}

func catalogVersionTarget(service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) string {
	if service == nil || version == nil {
		return ""
	}
	return catalogVersionPrimaryHref(version)
}

func catalogVersionPickerHTML(fromDir, relPath string, service *ppmodel.CatalogService, wrapperClass, selectClass string, showLabel bool) string {
	if !hasCatalogVersionSwitcher(service) {
		return ""
	}
	visible := visibleCatalogVersions(service)
	var builder strings.Builder
	builder.WriteString(`<div class="`)
	builder.WriteString(templ.EscapeString(wrapperClass))
	builder.WriteString(`">`)
	if showLabel {
		builder.WriteString(`<span>Version</span>`)
	}
	builder.WriteString(`<sl-dropdown skidding="5" distance="5"><sl-button slot="trigger" caret class="`)
	builder.WriteString(templ.EscapeString(selectClass))
	builder.WriteString(`">`)
	builder.WriteString(templ.EscapeString(catalogVersionTriggerLabel(relPath, service)))
	builder.WriteString(`</sl-button><sl-menu data-catalog-version-menu>`)
	for _, version := range visible {
		target := relativeCatalogHref(fromDir, catalogVersionTarget(service, version))
		builder.WriteString(`<sl-menu-item value="`)
		builder.WriteString(templ.EscapeString(target))
		builder.WriteString(`"`)
		if catalogVersionSelected(relPath, service, version) {
			builder.WriteString(` checked`)
		}
		builder.WriteString(`>`)
		builder.WriteString(templ.EscapeString(catalogVersionOptionLabel(version)))
		builder.WriteString(`</sl-menu-item>`)
	}
	builder.WriteString(`</sl-menu></sl-dropdown></div>`)
	return builder.String()
}

func catalogVersionTriggerLabel(relPath string, service *ppmodel.CatalogService) string {
	if service == nil {
		return "Version"
	}
	for _, version := range visibleCatalogVersions(service) {
		if catalogVersionSelected(relPath, service, version) {
			return catalogVersionOptionLabel(version)
		}
	}
	if latest := catalogVisibleLatestVersion(service); latest != nil {
		return catalogVersionOptionLabel(latest)
	}
	return "Version"
}

func catalogVersionSelected(relPath string, service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) bool {
	if service == nil || version == nil {
		return false
	}
	latestVisible := catalogVisibleLatestVersion(service)
	if relPath == "" {
		return latestVisible == version
	}
	if relPath == version.OverviewHref {
		return true
	}
	if relPath == service.VersionsHref {
		return latestVisible == version
	}
	return latestVisible == version && relPath == service.OverviewHref
}

func catalogVersionOptionLabel(version *ppmodel.CatalogVersion) string {
	if version == nil {
		return ""
	}
	if version.IsLatest {
		return version.Label + " (latest)"
	}
	return version.Label
}

func catalogVersionPrimaryHref(version *ppmodel.CatalogVersion) string {
	if version == nil {
		return ""
	}
	entries := visibleCatalogEntries(version)
	if len(entries) == 1 && strings.TrimSpace(entries[0].OverviewHref) != "" {
		return entries[0].OverviewHref
	}
	return version.OverviewHref
}

func shouldWriteVersionOverview(version *ppmodel.CatalogVersion) bool {
	return len(visibleCatalogEntries(version)) > 1
}

func visibleCatalogEntries(version *ppmodel.CatalogVersion) []*ppmodel.CatalogSpecEntry {
	if version == nil {
		return nil
	}
	entries := make([]*ppmodel.CatalogSpecEntry, 0, len(version.Entries))
	for _, entry := range version.Entries {
		if entry == nil || entry.RenderSkipped {
			continue
		}
		entries = append(entries, entry)
	}
	return entries
}

func visibleCatalogVersions(service *ppmodel.CatalogService) []*ppmodel.CatalogVersion {
	if service == nil {
		return nil
	}
	versions := make([]*ppmodel.CatalogVersion, 0, len(service.Versions))
	for _, version := range service.Versions {
		if len(visibleCatalogEntries(version)) == 0 {
			continue
		}
		versions = append(versions, version)
	}
	return versions
}

func hasVisibleCatalogVersions(service *ppmodel.CatalogService) bool {
	return len(visibleCatalogVersions(service)) > 0
}

func catalogVisibleLatestVersion(service *ppmodel.CatalogService) *ppmodel.CatalogVersion {
	versions := visibleCatalogVersions(service)
	if len(versions) == 0 {
		return nil
	}
	return versions[0]
}

func catalogServiceSummary(service *ppmodel.CatalogService) string {
	if latest := catalogVisibleLatestVersion(service); latest != nil && strings.TrimSpace(latest.Summary) != "" {
		return latest.Summary
	}
	return service.Summary
}

func catalogServiceContact(service *ppmodel.CatalogService) *ppmodel.ContactInfo {
	latest := catalogVisibleLatestVersion(service)
	if latest == nil {
		return nil
	}
	entries := visibleCatalogEntries(latest)
	if len(entries) != 1 {
		return nil
	}
	return entries[0].Contact
}

func catalogSummaryHTML(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	var builder strings.Builder
	builder.WriteString(`<div class="pp-catalog-card-summary">`)
	builder.WriteString(`<p class="pp-catalog-summary">`)
	builder.WriteString(templ.EscapeString(value))
	builder.WriteString(`</p>`)
	builder.WriteString(`</div>`)
	return builder.String()
}

func catalogContactHTML(contact *ppmodel.ContactInfo) string {
	name := catalogContactName(contact)
	email := catalogContactEmail(contact)
	if name == "" && email == "" {
		return ""
	}
	var builder strings.Builder
	builder.WriteString(`<dl class="pp-catalog-contact-grid">`)
	if name != "" {
		builder.WriteString(`<dt>Name</dt><dd>`)
		builder.WriteString(templ.EscapeString(name))
		builder.WriteString(`</dd>`)
	}
	if email != "" {
		builder.WriteString(`<dt>Email</dt><dd><a href="mailto:`)
		builder.WriteString(templ.EscapeString(email))
		builder.WriteString(`">`)
		builder.WriteString(templ.EscapeString(email))
		builder.WriteString(`</a></dd>`)
	}
	builder.WriteString(`</dl>`)
	return builder.String()
}

func catalogContactName(contact *ppmodel.ContactInfo) string {
	if contact == nil {
		return ""
	}
	return strings.TrimSpace(contact.Name)
}

func catalogContactEmail(contact *ppmodel.ContactInfo) string {
	if contact == nil {
		return ""
	}
	return strings.TrimSpace(contact.Email)
}

func renderCatalogWarnings(w io.Writer, warnings []*ppmodel.BuildWarning) error {
	if len(warnings) == 0 {
		return nil
	}

	headerText := "Skipped Render Build"
	if len(warnings) > 1 {
		headerText = "Skipped Render Builds"
	}
	if _, err := io.WriteString(w, `<pb33f-attention-box class="pp-catalog-warning" type="warning" headerText="`+templ.EscapeString(headerText)+`">`); err != nil {
		return err
	}
	if len(warnings) == 1 {
		if _, err := io.WriteString(w, `<p>`+templ.EscapeString(catalogWarningText(warnings[0]))+`</p>`); err != nil {
			return err
		}
	} else {
		if _, err := io.WriteString(w, `<ul class="pp-catalog-warning-list">`); err != nil {
			return err
		}
		for _, warning := range warnings {
			if _, err := io.WriteString(w, `<li>`+templ.EscapeString(catalogWarningText(warning))+`</li>`); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `</ul>`); err != nil {
			return err
		}
	}
	_, err := io.WriteString(w, `</pb33f-attention-box>`)
	return err
}

func catalogWarningText(warning *ppmodel.BuildWarning) string {
	if warning == nil {
		return ""
	}
	if warning.Context == "" {
		return warning.Message
	}
	return warning.Message + " (" + warning.Context + ")"
}

func buildCatalogAgentsGuide(catalog *ppmodel.CatalogSite) string {
	var builder strings.Builder
	builder.WriteString("# ")
	builder.WriteString(catalogLLMTitle(catalog))
	builder.WriteString("\n\n")

	if summary := strings.TrimSpace(catalogLLMSummary(catalog)); summary != "" {
		builder.WriteString("> ")
		builder.WriteString(summary)
		builder.WriteString("\n\n")
	}

	builder.WriteString("## Files\n\n")
	builder.WriteString("- [llms.txt](llms.txt) — Aggregate discovery index for all visible services, versions, and spec entry indexes.\n\n")
	builder.WriteString("## Services\n\n")
	for _, service := range visibleCatalogServices(catalog) {
		serviceLLM := pppaths.AggregateServiceLLM(service.Slug)
		builder.WriteString("- [")
		builder.WriteString(service.DisplayName)
		builder.WriteString("](")
		builder.WriteString(serviceLLM)
		builder.WriteString(")")
		if latest := catalogVisibleLatestVersion(service); latest != nil {
			builder.WriteString(" — latest ")
			builder.WriteString(latest.Label)
		}
		builder.WriteString("\n")
		for _, version := range visibleCatalogVersions(service) {
			versionLLM := pppaths.AggregateVersionLLM(service.Slug, version.Slug)
			builder.WriteString("  - [")
			builder.WriteString(version.Label)
			builder.WriteString("](")
			builder.WriteString(versionLLM)
			builder.WriteString(")")
			if version.IsLatest {
				builder.WriteString(" (latest)")
			}
			builder.WriteString("\n")
			for _, entry := range visibleCatalogEntries(version) {
				builder.WriteString("    - [")
				builder.WriteString(catalogEntryTitle(entry))
				builder.WriteString(" llms.txt](")
				builder.WriteString(catalogEntryLLMPath(entry))
				builder.WriteString(")")
				builder.WriteString(" | [AGENTS.md](")
				builder.WriteString(catalogEntryAgentsPath(entry))
				builder.WriteString(")")
				if strings.TrimSpace(entry.RelativePath) != "" {
					builder.WriteString(" — ")
					builder.WriteString(entry.RelativePath)
				}
				builder.WriteString("\n")
			}
		}
	}
	return builder.String()
}

func buildCatalogLLMIndex(catalog *ppmodel.CatalogSite) string {
	var builder strings.Builder
	builder.WriteString("# ")
	builder.WriteString(catalogLLMTitle(catalog))
	builder.WriteString("\n\n")
	if summary := strings.TrimSpace(catalogLLMSummary(catalog)); summary != "" {
		builder.WriteString("> ")
		builder.WriteString(summary)
		builder.WriteString("\n\n")
	}
	builder.WriteString("## Files\n\n")
	builder.WriteString("- [AGENTS.md](AGENTS.md) — Start-here guide for traversing the aggregate catalog and spec entry indexes\n\n")
	builder.WriteString("## Services\n\n")
	for _, service := range visibleCatalogServices(catalog) {
		serviceLLM := pppaths.AggregateServiceLLM(service.Slug)
		builder.WriteString("- [")
		builder.WriteString(service.DisplayName)
		builder.WriteString("](")
		builder.WriteString(serviceLLM)
		builder.WriteString(")")
		if latest := catalogVisibleLatestVersion(service); latest != nil {
			builder.WriteString(" — latest ")
			builder.WriteString(latest.Label)
			builder.WriteString("\n")
			for _, version := range visibleCatalogVersions(service) {
				builder.WriteString("  - [")
				builder.WriteString(version.Label)
				builder.WriteString("](")
				builder.WriteString(pppaths.AggregateVersionLLM(service.Slug, version.Slug))
				builder.WriteString(")")
				if version.IsLatest {
					builder.WriteString(" (latest)")
				}
				builder.WriteString("\n")
				for _, entry := range visibleCatalogEntries(version) {
					builder.WriteString("    - [")
					builder.WriteString(catalogEntryTitle(entry))
					builder.WriteString("](")
					builder.WriteString(catalogEntryLLMPath(entry))
					builder.WriteString(")")
					if strings.TrimSpace(entry.RelativePath) != "" {
						builder.WriteString(" — ")
						builder.WriteString(entry.RelativePath)
					}
					builder.WriteString("\n")
				}
			}
			continue
		}
		builder.WriteString("\n")
	}
	return builder.String()
}

func buildServiceLLMIndex(service *ppmodel.CatalogService) string {
	var builder strings.Builder
	current := pppaths.AggregateServiceLLM(service.Slug)
	builder.WriteString("# ")
	builder.WriteString(service.DisplayName)
	builder.WriteString("\n\n")
	if summary := strings.TrimSpace(catalogServiceSummary(service)); summary != "" {
		builder.WriteString("> ")
		builder.WriteString(summary)
		builder.WriteString("\n\n")
	}
	builder.WriteString("## Files\n\n")
	builder.WriteString("- [Catalog AGENTS.md](")
	builder.WriteString(relativeMarkdownLink(current, pppaths.FileAgentsGuide))
	builder.WriteString(")\n")
	builder.WriteString("- [Catalog llms.txt](")
	builder.WriteString(relativeMarkdownLink(current, pppaths.FileLLMIndex))
	builder.WriteString(")\n\n")
	builder.WriteString("## Versions\n\n")
	for _, version := range visibleCatalogVersions(service) {
		versionLLM := pppaths.AggregateVersionLLM(service.Slug, version.Slug)
		builder.WriteString("- [")
		builder.WriteString(version.Label)
		builder.WriteString("](")
		builder.WriteString(relativeMarkdownLink(current, versionLLM))
		builder.WriteString(")")
		if version.IsLatest {
			builder.WriteString(" (latest)")
		}
		builder.WriteString(" — ")
		builder.WriteString(fmt.Sprintf("%d specs", len(visibleCatalogEntries(version))))
		builder.WriteString("\n")
		for _, entry := range visibleCatalogEntries(version) {
			builder.WriteString("  - [")
			builder.WriteString(catalogEntryTitle(entry))
			builder.WriteString("](")
			builder.WriteString(relativeMarkdownLink(current, catalogEntryLLMPath(entry)))
			builder.WriteString(")")
			if strings.TrimSpace(entry.RelativePath) != "" {
				builder.WriteString(" — ")
				builder.WriteString(entry.RelativePath)
			}
			builder.WriteString("\n")
		}
	}
	return builder.String()
}

func buildVersionLLMIndex(service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) string {
	var builder strings.Builder
	current := pppaths.AggregateVersionLLM(service.Slug, version.Slug)
	builder.WriteString("# ")
	builder.WriteString(service.DisplayName)
	builder.WriteString(" ")
	builder.WriteString(version.Label)
	builder.WriteString("\n\n")
	if summary := strings.TrimSpace(version.Summary); summary != "" {
		builder.WriteString("> ")
		builder.WriteString(summary)
		builder.WriteString("\n\n")
	}
	builder.WriteString("## Files\n\n")
	builder.WriteString("- [Catalog AGENTS.md](")
	builder.WriteString(relativeMarkdownLink(current, pppaths.FileAgentsGuide))
	builder.WriteString(")\n")
	builder.WriteString("- [Catalog llms.txt](")
	builder.WriteString(relativeMarkdownLink(current, pppaths.FileLLMIndex))
	builder.WriteString(")\n")
	builder.WriteString("- [")
	builder.WriteString(service.DisplayName)
	builder.WriteString(" llms.txt](")
	builder.WriteString(relativeMarkdownLink(current, pppaths.AggregateServiceLLM(service.Slug)))
	builder.WriteString(")\n\n")
	builder.WriteString("## Spec Entries\n\n")
	for _, entry := range visibleCatalogEntries(version) {
		builder.WriteString("- [")
		builder.WriteString(catalogEntryTitle(entry))
		builder.WriteString("](")
		builder.WriteString(relativeMarkdownLink(current, catalogEntryLLMPath(entry)))
		builder.WriteString(")")
		builder.WriteString(" | [AGENTS.md](")
		builder.WriteString(relativeMarkdownLink(current, catalogEntryAgentsPath(entry)))
		builder.WriteString(")")
		if strings.TrimSpace(entry.RelativePath) != "" {
			builder.WriteString(" — ")
			builder.WriteString(entry.RelativePath)
		}
		builder.WriteString("\n")
	}
	return builder.String()
}

func catalogLLMTitle(catalog *ppmodel.CatalogSite) string {
	if catalog == nil || strings.TrimSpace(catalog.Title) == "" {
		return "API Catalog"
	}
	return catalog.Title
}

func catalogLLMSummary(catalog *ppmodel.CatalogSite) string {
	if catalog == nil {
		return ""
	}
	return strings.TrimSpace(catalog.Description)
}

func visibleCatalogServices(catalog *ppmodel.CatalogSite) []*ppmodel.CatalogService {
	if catalog == nil {
		return nil
	}
	services := make([]*ppmodel.CatalogService, 0, len(catalog.Services))
	for _, service := range catalog.Services {
		if service == nil || !hasVisibleCatalogVersions(service) {
			continue
		}
		services = append(services, service)
	}
	return services
}

func catalogEntryTitle(entry *ppmodel.CatalogSpecEntry) string {
	if entry == nil {
		return ""
	}
	if strings.TrimSpace(entry.Title) != "" {
		return entry.Title
	}
	if strings.TrimSpace(entry.Slug) != "" {
		return entry.Slug
	}
	return entry.RelativePath
}

func catalogEntryLLMPath(entry *ppmodel.CatalogSpecEntry) string {
	if entry == nil {
		return ""
	}
	if entry.ServiceSlug != "" && entry.VersionSlug != "" && entry.Slug != "" {
		return pppaths.AggregateSpecLLM(entry.ServiceSlug, entry.VersionSlug, entry.Slug)
	}
	return path.Join(entry.OutputSubdir, pppaths.FileLLMIndex)
}

func catalogEntryAgentsPath(entry *ppmodel.CatalogSpecEntry) string {
	if entry == nil {
		return ""
	}
	if entry.ServiceSlug != "" && entry.VersionSlug != "" && entry.Slug != "" {
		return pppaths.AggregateSpecAgentsGuide(entry.ServiceSlug, entry.VersionSlug, entry.Slug)
	}
	return path.Join(entry.OutputSubdir, pppaths.FileAgentsGuide)
}

func relativeMarkdownLink(fromPath, toPath string) string {
	fromDir := path.Dir(strings.TrimSpace(fromPath))
	if fromDir == "." {
		fromDir = ""
	}
	rel, err := filepath.Rel(filepath.FromSlash(fromDir), filepath.FromSlash(strings.TrimSpace(toPath)))
	if err != nil || rel == "" {
		return toPath
	}
	return filepath.ToSlash(rel)
}

var managedHeaderContextAttrs = []string{
	"data-pp-catalog-href",
	"data-pp-overview-href",
	"data-pp-service-name",
	"data-pp-current-version",
	"data-pp-versions-href",
	"data-pp-versions",
}

func (ap *AggregatePrintingPress) refreshRenderedEntryHeaderContexts(catalog *ppmodel.CatalogSite, impactedServices map[string]struct{}) error {
	if catalog == nil || len(impactedServices) == 0 {
		return nil
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		if _, ok := impactedServices[service.Key]; !ok {
			continue
		}
		for _, version := range visibleCatalogVersions(service) {
			for _, entry := range visibleCatalogEntries(version) {
				if entry == nil || entry.HeaderContext == nil {
					continue
				}
				if err := rewriteEntryHeaderContextFiles(filepath.Join(ap.config.OutputDir, filepath.FromSlash(entry.OutputSubdir)), entry.HeaderContext); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func rewriteEntryHeaderContextFiles(root string, header *ppmodel.SiteHeaderContext) error {
	info, err := os.Stat(root)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	if !info.IsDir() {
		return nil
	}
	return filepath.WalkDir(root, func(filePath string, d os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() || strings.ToLower(filepath.Ext(filePath)) != ".html" {
			return nil
		}
		return rewriteHTMLHeaderContextFile(filePath, header)
	})
}

func rewriteHTMLHeaderContextFile(filePath string, header *ppmodel.SiteHeaderContext) error {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}
	updated, changed, err := rewriteHTMLHeaderContext(content, header)
	if err != nil || !changed {
		return err
	}
	return os.WriteFile(filePath, updated, 0o644)
}

func rewriteHTMLHeaderContext(content []byte, header *ppmodel.SiteHeaderContext) ([]byte, bool, error) {
	doc := string(content)
	bodyStart := strings.Index(doc, "<body")
	if bodyStart < 0 {
		return content, false, nil
	}
	bodyEnd := strings.Index(doc[bodyStart:], ">")
	if bodyEnd < 0 {
		return nil, false, fmt.Errorf("printingpress: malformed html body tag")
	}
	bodyEnd += bodyStart
	openTag := doc[bodyStart : bodyEnd+1]
	updated := openTag
	for _, attr := range managedHeaderContextAttrs {
		updated = removeManagedHTMLAttribute(updated, attr)
	}
	attrValues, err := headerContextAttributeValues(header)
	if err != nil {
		return nil, false, err
	}
	var attrs strings.Builder
	for _, attr := range managedHeaderContextAttrs {
		value := strings.TrimSpace(attrValues[attr])
		if value == "" {
			continue
		}
		attrs.WriteString(` `)
		attrs.WriteString(attr)
		attrs.WriteString(`="`)
		attrs.WriteString(templ.EscapeString(value))
		attrs.WriteString(`"`)
	}
	updated = strings.TrimSuffix(updated, ">") + attrs.String() + ">"
	if updated == openTag {
		return content, false, nil
	}
	rewritten := doc[:bodyStart] + updated + doc[bodyEnd+1:]
	return []byte(rewritten), true, nil
}

func headerContextAttributeValues(header *ppmodel.SiteHeaderContext) (map[string]string, error) {
	values := make(map[string]string, len(managedHeaderContextAttrs))
	if header == nil {
		return values, nil
	}
	values["data-pp-catalog-href"] = header.CatalogHref
	values["data-pp-overview-href"] = header.OverviewHref
	values["data-pp-service-name"] = header.ServiceName
	values["data-pp-current-version"] = header.CurrentVersion
	values["data-pp-versions-href"] = header.VersionsHref
	if len(header.Versions) > 0 {
		encoded, err := json.Marshal(header.Versions)
		if err != nil {
			return nil, err
		}
		values["data-pp-versions"] = string(encoded)
	}
	return values, nil
}

func removeManagedHTMLAttribute(tag, attr string) string {
	pattern := ` ` + attr + `="`
	start := strings.Index(tag, pattern)
	if start < 0 {
		return tag
	}
	valueStart := start + len(pattern)
	valueEnd := strings.Index(tag[valueStart:], `"`)
	if valueEnd < 0 {
		return tag
	}
	valueEnd += valueStart
	return tag[:start] + tag[valueEnd+1:]
}

func collectFiles(root string) ([]string, error) {
	var files []string
	err := filepath.WalkDir(root, func(filePath string, d os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() {
			return nil
		}
		files = append(files, filePath)
		return nil
	})
	sort.Strings(files)
	return files, err
}
