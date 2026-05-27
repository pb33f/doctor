// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/cespare/xxhash/v2"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"go.yaml.in/yaml/v4"
)

type aggregateBuildPlan struct {
	catalog    *ppmodel.CatalogSite
	discovered []*aggregateDiscoveredSpec
	changed    []*aggregateDiscoveredSpec
	removed    []*SpecStateRecord
	existing   map[string]*SpecStateRecord
	duration   time.Duration
}

type aggregateDiscoveredSpec struct {
	AbsolutePath  string
	RelativePath  string
	SizeBytes     int64
	Hash          string
	ConfigHash    string
	Title         string
	Summary       string
	Contact       *ppmodel.ContactInfo
	DisplayName   string
	ServiceKey    string
	ServiceSlug   string
	Version       string
	VersionSlug   string
	Format        string
	OutputSubdir  string
	EntrySlug     string
	Changed       bool
	RenderSkipped bool
	Warnings      []string
	Source        *ppmodel.SourceRef
	previousState *SpecStateRecord
}

type aggregateSpecMetadata struct {
	Title   string
	Summary string
	Contact *ppmodel.ContactInfo
	Version string
	Valid   bool
}

type aggregateServiceGroup struct {
	key          string
	slug         string
	displayName  string
	primaryPath  string
	versions     []*aggregateVersionGroup
	latest       *aggregateVersionGroup
	collisions   []string
	versionIndex map[string]*aggregateVersionGroup
}

type aggregateVersionGroup struct {
	label   string
	slug    string
	entries []*aggregateDiscoveredSpec
	latest  bool
}

const aggregateMetadataVersion = 2

var (
	versionDateRE         = regexp.MustCompile(`\b(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})\b`)
	versionTokenRE        = regexp.MustCompile(`(?i)\bv?\d+(?:[._-]\d+){0,3}(?:[-._]?(?:alpha|beta|rc|preview)\d*)?\b`)
	versionDirRE          = regexp.MustCompile(`(?i)^v?\d+(?:[._-]\d+){0,3}(?:[-._]?(?:alpha|beta|rc|preview|pre)\d*)?$`)
	catalogHTMLTagRE      = regexp.MustCompile(`</?[^>]+>`)
	catalogMarkdownLinkRE = regexp.MustCompile(`\[(.*?)\]\((.*?)\)`)
	catalogMarkdownRE     = regexp.MustCompile(`[*_` + "`" + `]+`)
)

func (ap *AggregatePrintingPress) buildPlan() (*aggregateBuildPlan, error) {
	start := time.Now()
	existing, err := ap.stateStore.Load(ap.config.StateNamespace)
	if err != nil {
		return nil, err
	}
	discovered, err := ap.discoverSpecs(existing)
	if err != nil {
		return nil, err
	}
	plan := &aggregateBuildPlan{
		discovered: discovered,
		existing:   existing,
		duration:   time.Since(start),
	}
	plan.removed = aggregateRemovedRecords(existing, discovered)
	plan.catalog = ap.buildCatalog(discovered)
	for _, spec := range discovered {
		if spec.Changed || ap.config.BuildMode == AggregateBuildModeFull {
			plan.changed = append(plan.changed, spec)
		}
	}
	plan.catalog.OutputDir = ap.config.OutputDir
	plan.catalog.BaseURL = ap.config.BaseURL
	plan.catalog.AssetMode = ap.config.AssetMode
	return plan, nil
}

func (ap *AggregatePrintingPress) discoverSpecs(existing map[string]*SpecStateRecord) ([]*aggregateDiscoveredSpec, error) {
	root := ap.config.ScanRoot
	outputDir := ap.config.OutputDir
	baseConfigHash := aggregateEntryConfigHash(ap.config)
	noise := make(map[string]struct{}, len(ap.config.NoiseSegments))
	for _, segment := range ap.config.NoiseSegments {
		noise[strings.ToLower(strings.TrimSpace(segment))] = struct{}{}
	}

	var discovered []*aggregateDiscoveredSpec
	err := filepath.WalkDir(root, func(filePath string, d fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() {
			if sameOrWithinPath(filePath, outputDir) {
				if filePath == outputDir {
					return fs.SkipDir
				}
				return nil
			}
			return nil
		}
		if !isAggregateCandidateFile(filePath) {
			return nil
		}
		relPath, err := filepath.Rel(root, filePath)
		if err != nil {
			return err
		}
		relPath = filepath.ToSlash(relPath)
		if !matchesIncludeRules(relPath, ap.config.Include) || matchesAnyRule(relPath, ap.config.IgnoreRules) {
			return nil
		}

		content, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}
		if !containsOpenAPIMarkers(string(content), relPath) {
			return nil
		}

		hash := hashSpecBytes(content)
		record := existing[relPath]
		metadata := aggregateSpecMetadata{}
		if record == nil || record.Hash != hash || record.Summary == "" || record.MetadataVersion < aggregateMetadataVersion || ap.config.BuildMode == AggregateBuildModeFull {
			metadata, err = parseAggregateSpecMetadata(content)
			if err != nil {
				ap.config.Logger.Warn("printingpress: skipping candidate that failed metadata parse", "path", relPath, "error", err)
				return nil
			}
		} else {
			metadata = aggregateSpecMetadata{
				Title:   record.Title,
				Summary: record.Summary,
				Contact: catalogContactFromFields(record.ContactName, record.ContactEmail),
				Version: record.Version,
				Valid:   true,
			}
		}
		if !metadata.Valid {
			return nil
		}

		configHash := aggregateEntryRenderConfigHash(baseConfigHash, ap.developerMode, ap.specLintResults[relPath])
		serviceKey := ap.resolveServiceKey(relPath, metadata.Title, noise)
		displayName := ap.resolveDisplayName(relPath, serviceKey, metadata.Title)
		version := ap.resolveVersion(relPath, metadata.Version)
		spec := &aggregateDiscoveredSpec{
			AbsolutePath: filePath,
			RelativePath: relPath,
			SizeBytes:    int64(len(content)),
			Hash:         hash,
			ConfigHash:   configHash,
			Title:        fallbackValue(metadata.Title, strings.TrimSuffix(filepath.Base(relPath), filepath.Ext(relPath))),
			Summary:      metadata.Summary,
			Contact:      cloneCatalogContact(metadata.Contact),
			DisplayName:  displayName,
			ServiceKey:   serviceKey,
			ServiceSlug:  slugpkg.Sanitize(serviceKey),
			Version:      version,
			VersionSlug:  slugpkg.Sanitize(version),
			Format:       DetectSpecFormat(content),
			Changed:      record == nil || record.Hash != hash || record.ConfigHash != configHash || ap.config.BuildMode == AggregateBuildModeFull,
			Source: &ppmodel.SourceRef{
				Path: relPath,
				Href: relPath,
			},
			previousState: record,
		}
		discovered = append(discovered, spec)
		return nil
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(discovered, func(i, j int) bool {
		return discovered[i].RelativePath < discovered[j].RelativePath
	})
	return discovered, nil
}

func (ap *AggregatePrintingPress) buildCatalog(discovered []*aggregateDiscoveredSpec) *ppmodel.CatalogSite {
	catalog := &ppmodel.CatalogSite{
		Title:       fallbackValue(ap.config.Title, "API Catalog"),
		Description: ap.config.Description,
		ScanRoot:    ap.config.ScanRoot,
	}
	if len(discovered) == 0 {
		return catalog
	}

	serviceMap := make(map[string]*aggregateServiceGroup)
	serviceOrder := make([]string, 0)
	for _, spec := range discovered {
		group := serviceMap[spec.ServiceKey]
		if group == nil {
			group = &aggregateServiceGroup{
				key:          spec.ServiceKey,
				slug:         spec.ServiceSlug,
				displayName:  spec.DisplayName,
				primaryPath:  spec.RelativePath,
				versionIndex: make(map[string]*aggregateVersionGroup),
			}
			serviceMap[spec.ServiceKey] = group
			serviceOrder = append(serviceOrder, spec.ServiceKey)
		}
		if group.displayName == "" {
			group.displayName = spec.DisplayName
		}
		if spec.RelativePath < group.primaryPath {
			group.primaryPath = spec.RelativePath
		}
		versionGroup := group.versionIndex[spec.Version]
		if versionGroup == nil {
			versionGroup = &aggregateVersionGroup{
				label: spec.Version,
				slug:  spec.VersionSlug,
			}
			group.versionIndex[spec.Version] = versionGroup
			group.versions = append(group.versions, versionGroup)
		}
		versionGroup.entries = append(versionGroup.entries, spec)
	}

	sort.Slice(serviceOrder, func(i, j int) bool {
		left := serviceMap[serviceOrder[i]]
		right := serviceMap[serviceOrder[j]]
		if left.displayName == right.displayName {
			return left.key < right.key
		}
		return left.displayName < right.displayName
	})

	for _, key := range serviceOrder {
		group := serviceMap[key]
		sort.Slice(group.versions, func(i, j int) bool {
			return compareVersionLabels(group.versions[i].label, group.versions[j].label) > 0
		})
		if len(group.versions) > 0 {
			group.latest = group.versions[0]
			group.latest.latest = true
		}

		serviceOverview := pppaths.AggregateServiceIndexHTML(group.slug)
		versionsIndex := pppaths.AggregateServiceVersionsIndexHTML(group.slug)
		serviceModel := &ppmodel.CatalogService{
			Key:          group.key,
			Slug:         group.slug,
			DisplayName:  group.displayName,
			PrimaryPath:  group.primaryPath,
			OverviewHref: serviceOverview,
			VersionsHref: versionsIndex,
		}
		entryRegistry := slugpkg.NewSlugRegistry()
		for _, versionGroup := range group.versions {
			versionOverview := pppaths.AggregateVersionIndexHTML(group.slug, versionGroup.slug)
			versionModel := &ppmodel.CatalogVersion{
				Label:        versionGroup.label,
				Slug:         versionGroup.slug,
				OverviewHref: versionOverview,
				IsLatest:     versionGroup.latest,
			}
			sort.Slice(versionGroup.entries, func(i, j int) bool {
				if versionGroup.entries[i].Title == versionGroup.entries[j].Title {
					return versionGroup.entries[i].RelativePath < versionGroup.entries[j].RelativePath
				}
				return versionGroup.entries[i].Title < versionGroup.entries[j].Title
			})
			for _, spec := range versionGroup.entries {
				preferred := slugpkg.Sanitize(fallbackValue(spec.Title, strings.TrimSuffix(path.Base(spec.RelativePath), path.Ext(spec.RelativePath))))
				spec.EntrySlug = entryRegistry.Register(group.slug+"/"+versionGroup.slug, preferred)
				spec.OutputSubdir = pppaths.AggregateSpecDir(group.slug, versionGroup.slug, spec.EntrySlug)
				spec.Source.Href = spec.RelativePath
				versionModel.Entries = append(versionModel.Entries, &ppmodel.CatalogSpecEntry{
					ID:           spec.RelativePath,
					Slug:         spec.EntrySlug,
					Title:        spec.Title,
					Summary:      spec.Summary,
					Contact:      cloneCatalogContact(spec.Contact),
					ServiceKey:   spec.ServiceKey,
					ServiceSlug:  spec.ServiceSlug,
					Version:      spec.Version,
					VersionSlug:  spec.VersionSlug,
					Format:       spec.Format,
					RelativePath: spec.RelativePath,
					OutputSubdir: spec.OutputSubdir,
					OverviewHref: pppaths.AggregateSpecIndexHTML(group.slug, versionGroup.slug, spec.EntrySlug),
					Warnings:     append([]string(nil), spec.Warnings...),
					Source:       spec.Source,
				})
				versionModel.SpecCount++
				serviceModel.SpecCount++
				if spec.previousState != nil && spec.previousState.OutputSubdir != spec.OutputSubdir {
					spec.Changed = true
				}
				if versionModel.Summary == "" && spec.Summary != "" {
					versionModel.Summary = spec.Summary
				}
			}
			if len(versionGroup.entries) > 1 {
				message := fmt.Sprintf("%s:%s", group.key, versionGroup.label)
				group.collisions = append(group.collisions, message)
				catalog.Warnings = append(catalog.Warnings, &ppmodel.BuildWarning{
					Message: "multiple specs discovered for the same service version",
					Context: message,
				})
			}
			serviceModel.Versions = append(serviceModel.Versions, versionModel)
		}
		serviceModel.CollisionGroups = append([]string(nil), group.collisions...)
		if len(serviceModel.Versions) > 0 {
			serviceModel.LatestVersion = serviceModel.Versions[0]
			serviceModel.Summary = serviceModel.LatestVersion.Summary
		}
		catalog.Services = append(catalog.Services, serviceModel)
	}

	ap.finalizeCatalog(catalog)
	return catalog
}

func (ap *AggregatePrintingPress) finalizeCatalog(catalog *ppmodel.CatalogSite) {
	ap.refreshCatalogLatestState(catalog)
	ap.populateHeaderContexts(catalog)
}

func (ap *AggregatePrintingPress) refreshCatalogLatestState(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		service.LatestVersion = nil
		service.Summary = ""
		for _, version := range service.Versions {
			if version == nil {
				continue
			}
			version.IsLatest = false
		}
		visible := visibleCatalogVersions(service)
		if len(visible) == 0 {
			continue
		}
		service.LatestVersion = visible[0]
		service.LatestVersion.IsLatest = true
		service.Summary = service.LatestVersion.Summary
	}
}

func (ap *AggregatePrintingPress) populateHeaderContexts(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, version := range service.Versions {
			if version == nil {
				continue
			}
			for _, entry := range version.Entries {
				if entry == nil {
					continue
				}
				entry.HeaderContext = &ppmodel.SiteHeaderContext{
					CatalogHref:    relativeCatalogHref(entry.OutputSubdir, pppaths.FileIndexHTML),
					OverviewHref:   relativeCatalogHref(entry.OutputSubdir, catalogVersionPrimaryHref(version)),
					ServiceName:    service.DisplayName,
					CurrentVersion: version.Label,
				}
				visibleVersions := visibleCatalogVersions(service)
				if len(visibleVersions) > 1 {
					entry.HeaderContext.Versions = make([]*ppmodel.SiteVersionLink, 0, len(visibleVersions))
					for _, candidate := range visibleVersions {
						entry.HeaderContext.Versions = append(entry.HeaderContext.Versions, &ppmodel.SiteVersionLink{
							Label:  candidate.Label,
							Href:   relativeCatalogHref(entry.OutputSubdir, catalogVersionPrimaryHref(candidate)),
							Active: candidate.Label == version.Label,
						})
					}
				}
			}
		}
	}
}

func aggregateEntryConfigHash(config *AggregatePrintingPressConfig) string {
	if config == nil {
		return ""
	}
	payload := struct {
		BaseURL                            string                  `json:"baseURL,omitempty"`
		AssetMode                          string                  `json:"assetMode,omitempty"`
		EntryConfigFingerprint             string                  `json:"entryConfigFingerprint,omitempty"`
		NoiseSegments                      []string                `json:"noiseSegments,omitempty"`
		ServiceOverrides                   []AggregatePathOverride `json:"serviceOverrides,omitempty"`
		DisplayNameOverrides               []AggregatePathOverride `json:"displayNameOverrides,omitempty"`
		VersionOverrides                   []AggregatePathOverride `json:"versionOverrides,omitempty"`
		Footer                             *ppmodel.FooterConfig   `json:"footer,omitempty"`
		MaxPatternRepeatBudget             int                     `json:"maxPatternRepeatBudget,omitempty"`
		MaxGeneratedStringBytes            int                     `json:"maxGeneratedStringBytes,omitempty"`
		MaxGeneratedMockBytes              int                     `json:"maxGeneratedMockBytes,omitempty"`
		MaxMockDepth                       int                     `json:"maxMockDepth,omitempty"`
		MaxMockNodes                       int                     `json:"maxMockNodes,omitempty"`
		MaxMockProperties                  int                     `json:"maxMockProperties,omitempty"`
		MaxMockRefExpansions               int                     `json:"maxMockRefExpansions,omitempty"`
		MaxMockBytes                       int                     `json:"maxMockBytes,omitempty"`
		LLMAggregateSpecSizeThresholdBytes int64                   `json:"llmAggregateSpecSizeThresholdBytes,omitempty"`
		LLMMaxAggregateFileBytes           int64                   `json:"llmMaxAggregateFileBytes,omitempty"`
		LLMGenerateMonoliths               string                  `json:"llmGenerateMonoliths,omitempty"`
	}{
		BaseURL:                            config.BaseURL,
		AssetMode:                          config.AssetMode,
		EntryConfigFingerprint:             config.EntryConfigFingerprint,
		NoiseSegments:                      append([]string(nil), config.NoiseSegments...),
		ServiceOverrides:                   append([]AggregatePathOverride(nil), config.ServiceOverrides...),
		DisplayNameOverrides:               append([]AggregatePathOverride(nil), config.DisplayNameOverrides...),
		VersionOverrides:                   append([]AggregatePathOverride(nil), config.VersionOverrides...),
		Footer:                             cloneFooterConfig(config.Footer),
		MaxPatternRepeatBudget:             config.MaxPatternRepeatBudget,
		MaxGeneratedStringBytes:            config.MaxGeneratedStringBytes,
		MaxGeneratedMockBytes:              config.MaxGeneratedMockBytes,
		MaxMockDepth:                       config.MaxMockDepth,
		MaxMockNodes:                       config.MaxMockNodes,
		MaxMockProperties:                  config.MaxMockProperties,
		MaxMockRefExpansions:               config.MaxMockRefExpansions,
		MaxMockBytes:                       config.MaxMockBytes,
		LLMAggregateSpecSizeThresholdBytes: config.LLMAggregateSpecSizeThresholdBytes,
		LLMMaxAggregateFileBytes:           config.LLMMaxAggregateFileBytes,
		LLMGenerateMonoliths:               config.LLMGenerateMonoliths,
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%x", xxhash.Sum64(b))
}

func aggregateEntryRenderConfigHash(baseConfigHash string, developerMode bool, lintResults []*drV3.RuleFunctionResult) string {
	if !developerMode {
		return baseConfigHash
	}
	payload := struct {
		BaseConfigHash string                           `json:"baseConfigHash"`
		DeveloperMode  bool                             `json:"developerMode"`
		LintResults    []aggregateLintResultFingerprint `json:"lintResults,omitempty"`
	}{
		BaseConfigHash: baseConfigHash,
		DeveloperMode:  developerMode,
		LintResults:    aggregateLintResultFingerprints(lintResults),
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return baseConfigHash
	}
	return fmt.Sprintf("%x", xxhash.Sum64(b))
}

type aggregateLintResultFingerprint struct {
	Message      string                     `json:"message,omitempty"`
	Path         string                     `json:"path,omitempty"`
	RuleID       string                     `json:"ruleId,omitempty"`
	RuleSeverity string                     `json:"ruleSeverity,omitempty"`
	Origin       *aggregateLintOriginHash   `json:"origin,omitempty"`
	Rule         *aggregateLintRuleHash     `json:"rule,omitempty"`
	StartNode    *aggregateLintYAMLNodeHash `json:"startNode,omitempty"`
	EndNode      *aggregateLintYAMLNodeHash `json:"endNode,omitempty"`
}

type aggregateLintOriginHash struct {
	Line                  int    `json:"line,omitempty"`
	Column                int    `json:"column,omitempty"`
	LineValue             int    `json:"lineValue,omitempty"`
	ColumnValue           int    `json:"columnValue,omitempty"`
	AbsoluteLocation      string `json:"absoluteLocation,omitempty"`
	AbsoluteLocationValue string `json:"absoluteLocationValue,omitempty"`
}

type aggregateLintRuleHash struct {
	ID       string `json:"id,omitempty"`
	Message  string `json:"message,omitempty"`
	Severity string `json:"severity,omitempty"`
}

type aggregateLintYAMLNodeHash struct {
	Line   int `json:"line,omitempty"`
	Column int `json:"column,omitempty"`
}

func aggregateLintResultFingerprints(results []*drV3.RuleFunctionResult) []aggregateLintResultFingerprint {
	if len(results) == 0 {
		return nil
	}
	fingerprints := make([]aggregateLintResultFingerprint, 0, len(results))
	for _, result := range results {
		if result == nil {
			continue
		}
		fingerprint := aggregateLintResultFingerprint{
			Message:      result.Message,
			Path:         result.Path,
			RuleID:       result.RuleId,
			RuleSeverity: result.RuleSeverity,
		}
		if result.Origin != nil {
			fingerprint.Origin = &aggregateLintOriginHash{
				Line:                  result.Origin.Line,
				Column:                result.Origin.Column,
				LineValue:             result.Origin.LineValue,
				ColumnValue:           result.Origin.ColumnValue,
				AbsoluteLocation:      result.Origin.AbsoluteLocation,
				AbsoluteLocationValue: result.Origin.AbsoluteLocationValue,
			}
		}
		if result.Rule != nil {
			fingerprint.Rule = &aggregateLintRuleHash{
				ID:       result.Rule.Id,
				Message:  result.Rule.Message,
				Severity: result.Rule.Severity,
			}
		}
		if result.StartNode != nil {
			fingerprint.StartNode = &aggregateLintYAMLNodeHash{
				Line:   result.StartNode.Line,
				Column: result.StartNode.Column,
			}
		}
		if result.EndNode != nil {
			fingerprint.EndNode = &aggregateLintYAMLNodeHash{
				Line:   result.EndNode.Line,
				Column: result.EndNode.Column,
			}
		}
		fingerprints = append(fingerprints, fingerprint)
	}
	return fingerprints
}

func aggregateRemovedRecords(existing map[string]*SpecStateRecord, discovered []*aggregateDiscoveredSpec) []*SpecStateRecord {
	if len(existing) == 0 {
		return nil
	}
	seen := make(map[string]struct{}, len(discovered))
	for _, spec := range discovered {
		seen[spec.RelativePath] = struct{}{}
	}
	var removed []*SpecStateRecord
	for relPath, record := range existing {
		if _, ok := seen[relPath]; !ok {
			removed = append(removed, record)
		}
	}
	sort.Slice(removed, func(i, j int) bool {
		return removed[i].RelativePath < removed[j].RelativePath
	})
	return removed
}

func isAggregateCandidateFile(filePath string) bool {
	switch strings.ToLower(filepath.Ext(filePath)) {
	case ".yaml", ".yml", ".json":
		return true
	default:
		return false
	}
}

func hashSpecBytes(content []byte) string {
	return fmt.Sprintf("%x", xxhash.Sum64(content))
}

func parseAggregateSpecMetadata(content []byte) (aggregateSpecMetadata, error) {
	var parsed struct {
		OpenAPI string `yaml:"openapi"`
		Swagger string `yaml:"swagger"`
		Info    struct {
			Title       string `yaml:"title"`
			Summary     string `yaml:"summary"`
			Description string `yaml:"description"`
			Version     string `yaml:"version"`
			Contact     struct {
				Name  string `yaml:"name"`
				Email string `yaml:"email"`
			} `yaml:"contact"`
		} `yaml:"info"`
	}
	if err := yaml.Unmarshal(content, &parsed); err != nil {
		return aggregateSpecMetadata{}, err
	}
	if strings.TrimSpace(parsed.OpenAPI) == "" && strings.TrimSpace(parsed.Swagger) == "" {
		return aggregateSpecMetadata{}, nil
	}
	return aggregateSpecMetadata{
		Title:   strings.TrimSpace(parsed.Info.Title),
		Summary: chooseCatalogSummary(parsed.Info.Summary, parsed.Info.Description),
		Contact: catalogContactFromFields(parsed.Info.Contact.Name, parsed.Info.Contact.Email),
		Version: strings.TrimSpace(parsed.Info.Version),
		Valid:   true,
	}, nil
}

func catalogContactFromFields(name, email string) *ppmodel.ContactInfo {
	contact := &ppmodel.ContactInfo{
		Name:  strings.TrimSpace(name),
		Email: strings.TrimSpace(email),
	}
	if contact.Name == "" && contact.Email == "" {
		return nil
	}
	return contact
}

func cloneCatalogContact(contact *ppmodel.ContactInfo) *ppmodel.ContactInfo {
	if contact == nil {
		return nil
	}
	copy := *contact
	return &copy
}

func chooseCatalogSummary(summary, description string) string {
	if normalized := normalizeCatalogText(summary); normalized != "" {
		return trimCatalogSummary(normalized, 240)
	}
	return trimCatalogSummary(firstCatalogParagraph(description), 240)
}

func firstCatalogParagraph(value string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return ""
	}
	parts := strings.Split(trimmed, "\n\n")
	for _, part := range parts {
		if normalized := normalizeCatalogText(part); normalized != "" {
			return normalized
		}
	}
	return normalizeCatalogText(trimmed)
}

func normalizeCatalogText(value string) string {
	value = catalogHTMLTagRE.ReplaceAllString(value, " ")
	value = catalogMarkdownLinkRE.ReplaceAllString(value, "$1")
	value = catalogMarkdownRE.ReplaceAllString(value, "")
	return strings.Join(strings.Fields(strings.TrimSpace(value)), " ")
}

func trimCatalogSummary(value string, limit int) string {
	value = normalizeCatalogText(value)
	if value == "" || limit <= 0 || len(value) <= limit {
		return value
	}
	cut := strings.LastIndex(value[:limit], " ")
	if cut < limit/2 {
		cut = limit
	}
	return strings.TrimSpace(value[:cut]) + "..."
}

func (ap *AggregatePrintingPress) resolveServiceKey(relPath, title string, noise map[string]struct{}) string {
	if override, ok := findOverrideValue(relPath, ap.config.ServiceOverrides); ok {
		return slugpkg.Sanitize(override)
	}
	segments := strings.Split(path.Dir(relPath), "/")
	for i := len(segments) - 1; i >= 0; i-- {
		segment := strings.TrimSpace(segments[i])
		if segment == "" || segment == "." {
			continue
		}
		if _, ok := noise[strings.ToLower(segment)]; ok {
			continue
		}
		if isVersionDirectorySegment(segment) {
			continue
		}
		return slugpkg.Sanitize(segment)
	}
	if stem := strings.TrimSuffix(path.Base(relPath), path.Ext(relPath)); stem != "" {
		return slugpkg.Sanitize(stem)
	}
	return slugpkg.Sanitize(title)
}

func isVersionDirectorySegment(segment string) bool {
	trimmed := strings.TrimSpace(segment)
	if trimmed == "" {
		return false
	}
	if versionDateRE.MatchString(trimmed) && versionDateRE.FindString(trimmed) == trimmed {
		return true
	}
	return versionDirRE.MatchString(trimmed)
}

func (ap *AggregatePrintingPress) resolveDisplayName(relPath, serviceKey, title string) string {
	if override, ok := findOverrideValue(relPath, ap.config.DisplayNameOverrides); ok {
		return strings.TrimSpace(override)
	}
	if strings.TrimSpace(title) != "" {
		return strings.TrimSpace(title)
	}
	return strings.TrimSpace(serviceKey)
}

func (ap *AggregatePrintingPress) resolveVersion(relPath, detected string) string {
	if override, ok := findOverrideValue(relPath, ap.config.VersionOverrides); ok {
		return strings.TrimSpace(override)
	}
	if strings.TrimSpace(detected) != "" {
		return strings.TrimSpace(detected)
	}
	if guessed := versionFromFilename(relPath); guessed != "" {
		return guessed
	}
	return "unversioned"
}

func matchesIncludeRules(relPath string, patterns []string) bool {
	if len(patterns) == 0 {
		return true
	}
	return matchesAnyRule(relPath, patterns)
}

func matchesAnyRule(relPath string, patterns []string) bool {
	for _, pattern := range patterns {
		if ruleMatches(relPath, pattern) {
			return true
		}
	}
	return false
}

func ruleMatches(relPath, rule string) bool {
	cleanRel := path.Clean(strings.TrimSpace(relPath))
	cleanRule := path.Clean(strings.TrimSpace(rule))
	if cleanRule == "" || cleanRule == "." {
		return false
	}
	if cleanRel == cleanRule {
		return true
	}
	if strings.Contains(cleanRule, "**") {
		return recursiveGlobMatch(cleanRule, cleanRel)
	}
	matched, err := path.Match(cleanRule, cleanRel)
	return err == nil && matched
}

func recursiveGlobMatch(pattern, candidate string) bool {
	var builder strings.Builder
	builder.WriteString("^")
	for idx := 0; idx < len(pattern); idx++ {
		switch ch := pattern[idx]; ch {
		case '*':
			if idx+1 < len(pattern) && pattern[idx+1] == '*' {
				builder.WriteString(".*")
				idx++
				continue
			}
			builder.WriteString(`[^/]*`)
		case '?':
			builder.WriteString(`[^/]`)
		default:
			builder.WriteString(regexp.QuoteMeta(string(ch)))
		}
	}
	builder.WriteString("$")
	re, err := regexp.Compile(builder.String())
	if err != nil {
		return false
	}
	return re.MatchString(candidate)
}

func findOverrideValue(relPath string, overrides []AggregatePathOverride) (string, bool) {
	for _, override := range overrides {
		if ruleMatches(relPath, override.Pattern) {
			return strings.TrimSpace(override.Value), true
		}
	}
	return "", false
}

func containsOpenAPIMarkers(content string, filePath string) bool {
	const sniffLimit = 4096
	if len(content) > sniffLimit {
		content = content[:sniffLimit]
	}
	lower := strings.ToLower(content)
	switch strings.ToLower(filepath.Ext(filePath)) {
	case ".json":
		return strings.Contains(lower, `"openapi"`) || strings.Contains(lower, `"swagger"`)
	default:
		for _, line := range strings.Split(lower, "\n") {
			trimmed := strings.TrimSpace(line)
			if strings.HasPrefix(trimmed, "openapi:") || strings.HasPrefix(trimmed, "swagger:") ||
				strings.HasPrefix(trimmed, `"openapi":`) || strings.HasPrefix(trimmed, `'openapi':`) ||
				strings.HasPrefix(trimmed, `"swagger":`) || strings.HasPrefix(trimmed, `'swagger':`) {
				return true
			}
		}
		return false
	}
}

func versionFromFilename(relPath string) string {
	stem := strings.TrimSuffix(path.Base(relPath), path.Ext(relPath))
	if stem == "" {
		return ""
	}
	if match := versionDateRE.FindString(stem); match != "" {
		return match
	}
	if match := versionTokenRE.FindString(stem); match != "" {
		return strings.ReplaceAll(match, "_", ".")
	}
	return ""
}

func compareVersionLabels(left, right string) int {
	left = strings.TrimSpace(left)
	right = strings.TrimSpace(right)
	if left == right {
		return 0
	}
	if left == "unversioned" {
		return -1
	}
	if right == "unversioned" {
		return 1
	}
	if lv, ok := parseVersionVector(left); ok {
		if rv, ok := parseVersionVector(right); ok {
			for i := 0; i < max(len(lv), len(rv)); i++ {
				li := versionVectorValue(lv, i)
				ri := versionVectorValue(rv, i)
				if li != ri {
					if li > ri {
						return 1
					}
					return -1
				}
			}
			return strings.Compare(strings.ToLower(left), strings.ToLower(right))
		}
		return 1
	}
	if _, ok := parseVersionVector(right); ok {
		return -1
	}
	if ld, ok := parseDateVersion(left); ok {
		if rd, ok := parseDateVersion(right); ok {
			switch {
			case ld.After(rd):
				return 1
			case ld.Before(rd):
				return -1
			default:
				return 0
			}
		}
		return 1
	}
	if _, ok := parseDateVersion(right); ok {
		return -1
	}
	return strings.Compare(strings.ToLower(left), strings.ToLower(right))
}

func parseVersionVector(label string) ([]int, bool) {
	trimmed := strings.ToLower(strings.TrimSpace(label))
	trimmed = strings.TrimPrefix(trimmed, "v")
	trimmed = versionDateRE.ReplaceAllString(trimmed, "")
	parts := strings.FieldsFunc(trimmed, func(r rune) bool {
		return !(r >= '0' && r <= '9')
	})
	if len(parts) == 0 {
		return nil, false
	}
	vector := make([]int, 0, len(parts))
	for _, part := range parts {
		if part == "" {
			continue
		}
		value, err := strconv.Atoi(part)
		if err != nil {
			return nil, false
		}
		vector = append(vector, value)
	}
	return vector, len(vector) > 0
}

func versionVectorValue(vector []int, idx int) int {
	if idx < len(vector) {
		return vector[idx]
	}
	return 0
}

func parseDateVersion(label string) (time.Time, bool) {
	match := versionDateRE.FindStringSubmatch(label)
	if len(match) != 4 {
		return time.Time{}, false
	}
	year, _ := strconv.Atoi(match[1])
	month, _ := strconv.Atoi(match[2])
	day, _ := strconv.Atoi(match[3])
	if month == 0 || day == 0 {
		return time.Time{}, false
	}
	return time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC), true
}

func fallbackValue(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func sameOrWithinPath(candidate, root string) bool {
	cleanCandidate := filepath.Clean(candidate)
	cleanRoot := filepath.Clean(root)
	if cleanCandidate == cleanRoot {
		return true
	}
	rel, err := filepath.Rel(cleanRoot, cleanCandidate)
	if err != nil {
		return false
	}
	return rel != ".." && !strings.HasPrefix(rel, ".."+string(filepath.Separator))
}

func relativeCatalogHref(fromDir, toPath string) string {
	if fromDir == "" || fromDir == "." {
		return toPath
	}
	rel, err := filepath.Rel(filepath.FromSlash(fromDir), filepath.FromSlash(toPath))
	if err != nil {
		return toPath
	}
	return filepath.ToSlash(rel)
}
