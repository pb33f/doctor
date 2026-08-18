// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"hash"
	"io/fs"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/cespare/xxhash/v2"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"go.yaml.in/yaml/v4"
)

type aggregateBuildPlan struct {
	catalog     *ppmodel.CatalogSite
	discovered  []*aggregateDiscoveredSpec
	changed     []*aggregateDiscoveredSpec
	removed     []*SpecStateRecord
	existing    map[string]*SpecStateRecord
	completed   map[string]struct{}
	preflighted map[string]struct{}
	duration    time.Duration
}

type aggregatePlanIntent struct {
	selection aggregateOutputSelection
	preflight bool
}

type aggregateDiscoveredSpec struct {
	AbsolutePath             string
	RelativePath             string
	SizeBytes                int64
	Hash                     string
	ConfigHash               string
	EntryConfigHash          string
	MetadataConfigHash       string
	Title                    string
	Summary                  string
	Contact                  *ppmodel.ContactInfo
	ServiceIdentityCandidate string
	ExternalRefs             []string
	MessageHrefs             map[string]string
	DisplayName              string
	ServiceKey               string
	ServiceSlug              string
	PathServiceSlug          string
	ContractID               string
	ContractRole             ppmodel.ContractRoleValue
	ContractDefault          bool
	Version                  string
	VersionSlug              string
	Format                   string
	OutputSubdir             string
	EntrySlug                string
	SpecKind                 SpecKind
	RenderSkipped            bool
	Warnings                 []string
	Source                   *ppmodel.SourceRef
	previousState            *SpecStateRecord
	prebuiltSite             *ppmodel.Site
	externalMessageHrefs     map[string]string
	renderFailed             bool
	HTMLCompletionHash       string
	JSONCompletionHash       string
	LLMCompletionHash        string
}

type aggregateSpecMetadata struct {
	Title                    string
	Summary                  string
	Contact                  *ppmodel.ContactInfo
	Version                  string
	SpecKind                 SpecKind
	ServiceIdentityCandidate string
	ExternalRefs             []string
	Warnings                 []string
	Valid                    bool
}

type aggregateServiceGroup struct {
	key             string
	slug            string
	displayName     string
	summary         string
	primaryPath     string
	versions        []*aggregateVersionGroup
	latest          *aggregateVersionGroup
	contracts       []*aggregateContractGroup
	defaultContract *aggregateContractGroup
	versionIndex    map[string]*aggregateVersionGroup
	contractIndex   map[string]*aggregateContractGroup
}

type aggregateVersionGroup struct {
	label   string
	slug    string
	entries []*aggregateDiscoveredSpec
	latest  bool
}

type aggregateContractGroup struct {
	id              string
	displayName     string
	specKind        SpecKind
	role            ppmodel.ContractRoleValue
	explicitDefault bool
	versions        []*aggregateContractVersionGroup
	latest          *aggregateContractVersionGroup
	versionIndex    map[string]*aggregateContractVersionGroup
}

type aggregateContractVersionGroup struct {
	label string
	slug  string
	spec  *aggregateDiscoveredSpec
	entry *ppmodel.CatalogSpecEntry
}

const (
	aggregateMetadataVersion                = 3
	aggregateRendererContractVersion        = 1
	aggregateServiceIdentityFallbackWarning = "configured service identity metadata pointers did not resolve to a non-empty scalar string; using path-based discovery"
)

var (
	versionDateRE         = regexp.MustCompile(`\b(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})\b`)
	versionTokenRE        = regexp.MustCompile(`(?i)\bv?\d+(?:[._-]\d+){0,3}(?:[-._]?(?:alpha|beta|rc|preview)\d*)?\b`)
	versionDirRE          = regexp.MustCompile(`(?i)^v?\d+(?:[._-]\d+){0,3}(?:[-._]?(?:alpha|beta|rc|preview|pre)\d*)?$`)
	versionPrereleaseRE   = regexp.MustCompile(`(?i)[-._]?(?:alpha|beta|rc|preview|pre)\d*$`)
	catalogHTMLTagRE      = regexp.MustCompile(`</?[^>]+>`)
	catalogMarkdownLinkRE = regexp.MustCompile(`\[(.*?)\]\((.*?)\)`)
	catalogMarkdownRE     = regexp.MustCompile(`[*_` + "`" + `]+`)
)

func (ap *AggregatePrintingPress) buildPlan(intent aggregatePlanIntent) (*aggregateBuildPlan, error) {
	start := time.Now()
	existing, err := ap.stateStore.Load(ap.config.StateNamespace)
	if err != nil {
		return nil, err
	}
	discovered, discoveryWarnings, err := ap.discoverSpecs(existing)
	if err != nil {
		return nil, err
	}
	plan := &aggregateBuildPlan{
		discovered:  discovered,
		existing:    existing,
		completed:   make(map[string]struct{}),
		preflighted: make(map[string]struct{}),
		duration:    time.Since(start),
	}
	plan.removed = aggregateRemovedRecords(existing, discovered)
	plan.catalog, err = ap.buildCatalog(discovered)
	if err != nil {
		return nil, err
	}
	resolveAggregateExternalMessageHrefs(plan.catalog, discovered)
	ap.applyAggregateNavigationFingerprints(plan.catalog, discovered)
	if intent.preflight {
		if err := ap.preflightChangedEntries(plan, intent.selection); err != nil {
			return nil, err
		}
	}
	resolveAggregateExternalMessageHrefs(plan.catalog, discovered)
	ap.finalizeCatalog(plan.catalog)
	ap.applyAggregateNavigationFingerprints(plan.catalog, discovered)
	plan.catalog.Warnings = append(plan.catalog.Warnings, discoveryWarnings...)
	plan.catalog.ContentPages = ap.collectCatalogContentPages()
	for _, spec := range discovered {
		if !spec.RenderSkipped && aggregateSpecSelectedOutputDirty(spec, intent.selection, ap.config.BuildMode) {
			plan.changed = append(plan.changed, spec)
		}
	}
	plan.catalog.OutputDir = ap.config.OutputDir
	plan.catalog.BaseURL = ap.config.BaseURL
	plan.catalog.AssetMode = ap.config.AssetMode
	return plan, nil
}

func (ap *AggregatePrintingPress) discoverSpecs(existing map[string]*SpecStateRecord) ([]*aggregateDiscoveredSpec, []*ppmodel.BuildWarning, error) {
	root := ap.config.ScanRoot
	outputDir := ap.config.OutputDir
	baseConfigHash := aggregateEntryConfigHash(ap.config)
	metadataConfigHash := aggregateMetadataConfigHash(ap.config)
	contentHashBySpecDir := make(map[string]string)
	noise := make(map[string]struct{}, len(ap.config.NoiseSegments))
	for _, segment := range ap.config.NoiseSegments {
		noise[strings.ToLower(strings.TrimSpace(segment))] = struct{}{}
	}

	var discovered []*aggregateDiscoveredSpec
	var discoveryWarnings []*ppmodel.BuildWarning
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
		identity, err := DetectSpecIdentity(content)
		if err != nil {
			if errors.Is(err, ErrUnsupportedAsyncAPI2) {
				discoveryWarnings = append(discoveryWarnings, &ppmodel.BuildWarning{
					Message: "unsupported AsyncAPI 2.x spec omitted from aggregate catalog",
					Context: relPath,
				})
				ap.config.Logger.Warn("printingpress: omitting unsupported AsyncAPI 2.x aggregate candidate", "path", relPath)
			}
			return nil
		}

		hash := hashSpecBytes(content)
		record := existing[relPath]
		metadata := aggregateSpecMetadata{}
		if record == nil || record.Hash != hash || record.MetadataVersion < aggregateMetadataVersion || record.MetadataConfigHash != metadataConfigHash || record.SpecKind != identity.Kind || ap.config.BuildMode == AggregateBuildModeFull {
			metadata, err = parseAggregateSpecMetadata(content, ap.config.ServiceIdentity.MetadataPointers)
			if err != nil {
				ap.config.Logger.Warn("printingpress: skipping candidate that failed metadata parse", "path", relPath, "error", err)
				return nil
			}
		} else {
			metadata = aggregateSpecMetadata{
				Title:                    record.Title,
				Summary:                  record.Summary,
				Contact:                  catalogContactFromFields(record.ContactName, record.ContactEmail),
				Version:                  record.Version,
				SpecKind:                 record.SpecKind,
				ServiceIdentityCandidate: record.ServiceIdentityCandidate,
				ExternalRefs:             append([]string(nil), record.ExternalRefs...),
				Warnings:                 aggregateServiceIdentityWarnings(ap.config.ServiceIdentity.MetadataPointers, record.ServiceIdentityCandidate),
				Valid:                    true,
			}
		}
		if !metadata.Valid {
			return nil
		}
		if !metadata.SpecKind.IsKnown() {
			metadata.SpecKind = identity.Kind
		}
		metadata.Warnings = aggregateServiceIdentityWarningsForSpec(metadata.Warnings, identity.Kind, ap.config.ServiceIdentity.MetadataOptionalForOpenAPI)
		for _, warning := range metadata.Warnings {
			discoveryWarnings = append(discoveryWarnings, &ppmodel.BuildWarning{
				Message: warning,
				Context: relPath,
			})
		}

		specDir := filepath.Dir(filePath)
		// Fast mode must resolve service-local content during discovery so it can
		// decide whether to skip rendering. Changed specs may resolve it again
		// during the build pass; cache by spec directory to avoid repeating that
		// work for sibling specs that share the same content root.
		contentHash, hasContentHash := contentHashBySpecDir[specDir]
		if !hasContentHash {
			contentHash = ap.aggregateEntryContentFingerprint(filePath)
			contentHashBySpecDir[specDir] = contentHash
		}
		configHash := aggregateEntryRenderConfigHash(baseConfigHash, ap.developerMode, ap.specLintResults[relPath], contentHash, metadata.SpecKind)
		pathServiceCandidate := ap.resolvePathServiceCandidate(relPath, metadata.Title, noise)
		pathServiceSlug := slugpkg.Sanitize(pathServiceCandidate)
		serviceKey := ap.normalizePathServiceIdentity(pathServiceSlug)
		if strings.TrimSpace(metadata.ServiceIdentityCandidate) != "" {
			if normalized := ap.normalizeServiceIdentityCandidate(metadata.ServiceIdentityCandidate); normalized != "" {
				serviceKey = normalized
			} else {
				warning := fmt.Sprintf("service identity candidate %q normalized to an empty value; using path-derived service %q from %s", strings.TrimSpace(metadata.ServiceIdentityCandidate), serviceKey, relPath)
				metadata.Warnings = append(metadata.Warnings, warning)
				discoveryWarnings = append(discoveryWarnings, &ppmodel.BuildWarning{Message: warning, Context: relPath})
			}
		}
		displayName := ap.resolveDisplayName(relPath, serviceKey, metadata.Title)
		version := ap.resolveVersion(relPath, metadata.Version)
		spec := &aggregateDiscoveredSpec{
			AbsolutePath:             filePath,
			RelativePath:             relPath,
			SizeBytes:                int64(len(content)),
			Hash:                     hash,
			ConfigHash:               configHash,
			EntryConfigHash:          configHash,
			MetadataConfigHash:       metadataConfigHash,
			Title:                    fallbackValue(metadata.Title, strings.TrimSuffix(filepath.Base(relPath), filepath.Ext(relPath))),
			Summary:                  metadata.Summary,
			Contact:                  cloneCatalogContact(metadata.Contact),
			ServiceIdentityCandidate: metadata.ServiceIdentityCandidate,
			ExternalRefs:             append([]string(nil), metadata.ExternalRefs...),
			MessageHrefs:             cloneAggregateMessageHrefs(recordMessageHrefs(record)),
			DisplayName:              displayName,
			ServiceKey:               serviceKey,
			ServiceSlug:              slugpkg.Sanitize(serviceKey),
			PathServiceSlug:          pathServiceSlug,
			Version:                  version,
			VersionSlug:              slugpkg.Sanitize(version),
			Format:                   DetectSpecFormat(content),
			SpecKind:                 metadata.SpecKind,
			Source: &ppmodel.SourceRef{
				Path: relPath,
				Href: relPath,
			},
			Warnings:      append([]string(nil), metadata.Warnings...),
			previousState: record,
		}
		discovered = append(discovered, spec)
		return nil
	})
	if err != nil {
		return nil, nil, err
	}
	sort.Slice(discovered, func(i, j int) bool {
		return discovered[i].RelativePath < discovered[j].RelativePath
	})
	return discovered, discoveryWarnings, nil
}

func (ap *AggregatePrintingPress) buildCatalog(discovered []*aggregateDiscoveredSpec) (*ppmodel.CatalogSite, error) {
	catalog := &ppmodel.CatalogSite{
		Title:       fallbackValue(ap.config.Title, "API Catalog"),
		Description: ap.config.Description,
		ScanRoot:    ap.config.ScanRoot,
	}
	if len(discovered) == 0 {
		return catalog, nil
	}

	serviceMap := make(map[string]*aggregateServiceGroup)
	serviceOrder := make([]string, 0)
	for _, spec := range discovered {
		group := serviceMap[spec.ServiceKey]
		if group == nil {
			group = &aggregateServiceGroup{
				key:           spec.ServiceKey,
				slug:          spec.ServiceSlug,
				primaryPath:   spec.RelativePath,
				versionIndex:  make(map[string]*aggregateVersionGroup),
				contractIndex: make(map[string]*aggregateContractGroup),
			}
			serviceMap[spec.ServiceKey] = group
			serviceOrder = append(serviceOrder, spec.ServiceKey)
		}
		if spec.RelativePath < group.primaryPath {
			group.primaryPath = spec.RelativePath
		}

		spec.ContractRole, spec.ContractID, spec.ContractDefault = ap.resolveLogicalContract(spec)
		contractGroup := group.contractIndex[spec.ContractID]
		if contractGroup == nil {
			contractGroup = &aggregateContractGroup{
				id:           spec.ContractID,
				specKind:     spec.SpecKind,
				role:         spec.ContractRole,
				versionIndex: make(map[string]*aggregateContractVersionGroup),
			}
			group.contractIndex[spec.ContractID] = contractGroup
			group.contracts = append(group.contracts, contractGroup)
		} else if contractGroup.specKind != spec.SpecKind || contractGroup.role != spec.ContractRole {
			previous := contractGroup.versions[0].spec
			return nil, fmt.Errorf(
				"printingpress: logical contract %q for service %q has incompatible roots: %s (%s/%s) and %s (%s/%s)",
				spec.ContractID,
				group.key,
				previous.RelativePath,
				previous.SpecKind.MachineValue(),
				previous.ContractRole.MachineValue(),
				spec.RelativePath,
				spec.SpecKind.MachineValue(),
				spec.ContractRole.MachineValue(),
			)
		}
		if previous := contractGroup.versionIndex[spec.Version]; previous != nil {
			return nil, fmt.Errorf("printingpress: duplicate logical contract %q version %q for service %q: %s and %s", spec.ContractID, spec.Version, group.key, previous.spec.RelativePath, spec.RelativePath)
		}
		contractVersion := &aggregateContractVersionGroup{
			label: spec.Version,
			slug:  spec.VersionSlug,
			spec:  spec,
		}
		contractGroup.versionIndex[spec.Version] = contractVersion
		contractGroup.versions = append(contractGroup.versions, contractVersion)
		contractGroup.explicitDefault = contractGroup.explicitDefault || spec.ContractDefault

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

	for _, key := range serviceOrder {
		group := serviceMap[key]
		if err := ap.prepareAggregateServiceGroup(group); err != nil {
			return nil, err
		}
	}
	if err := validateAggregateCanonicalServiceSlugs(serviceMap, serviceOrder); err != nil {
		return nil, err
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
			Key:               group.key,
			Slug:              group.slug,
			IdentityKey:       group.key,
			DisplayName:       group.displayName,
			Summary:           group.summary,
			PrimaryPath:       group.primaryPath,
			OverviewHref:      serviceOverview,
			VersionsHref:      versionsIndex,
			DefaultContractID: aggregateDefaultContractID(group),
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
				entry := &ppmodel.CatalogSpecEntry{
					ID:            spec.RelativePath,
					Slug:          spec.EntrySlug,
					SpecKind:      spec.SpecKind,
					SpecKindLabel: spec.SpecKind.DisplayLabel(),
					Title:         spec.Title,
					Summary:       spec.Summary,
					Contact:       cloneCatalogContact(spec.Contact),
					ServiceKey:    group.key,
					ServiceSlug:   group.slug,
					ContractID:    spec.ContractID,
					ContractRole:  spec.ContractRole,
					Version:       spec.Version,
					VersionSlug:   spec.VersionSlug,
					Format:        spec.Format,
					RelativePath:  spec.RelativePath,
					OutputSubdir:  spec.OutputSubdir,
					OverviewHref:  pppaths.AggregateSpecIndexHTML(group.slug, versionGroup.slug, spec.EntrySlug),
					Warnings:      append([]string(nil), spec.Warnings...),
					Source:        spec.Source,
					Counts:        aggregateLintResultCounts(ap.specLintResults[spec.RelativePath]),
				}
				versionModel.Entries = append(versionModel.Entries, entry)
				group.contractIndex[spec.ContractID].versionIndex[spec.Version].entry = entry
				versionModel.SpecCount++
				serviceModel.SpecCount++
				if versionModel.Summary == "" && spec.Summary != "" {
					versionModel.Summary = spec.Summary
				}
			}
			serviceModel.Versions = append(serviceModel.Versions, versionModel)
		}
		for _, contractGroup := range group.contracts {
			contract := &ppmodel.CatalogContract{
				ID:          contractGroup.id,
				DisplayName: contractGroup.displayName,
				SpecKind:    contractGroup.specKind,
				Role:        contractGroup.role,
				Default:     contractGroup.id == serviceModel.DefaultContractID,
			}
			for _, contractVersionGroup := range contractGroup.versions {
				contractVersion := &ppmodel.CatalogContractVersion{
					Label:        contractVersionGroup.label,
					Slug:         contractVersionGroup.slug,
					OverviewHref: contractVersionGroup.entry.OverviewHref,
					Entry:        contractVersionGroup.entry,
				}
				contract.Versions = append(contract.Versions, contractVersion)
				if contractVersionGroup == contractGroup.latest {
					contract.LatestVersion = contractVersion
				}
			}
			serviceModel.Contracts = append(serviceModel.Contracts, contract)
		}
		if len(serviceModel.Versions) > 0 {
			serviceModel.LatestVersion = serviceModel.Versions[0]
		}
		catalog.Services = append(catalog.Services, serviceModel)
	}

	resolveAggregateCatalogRelationships(catalog, discovered)
	ap.finalizeCatalog(catalog)
	return catalog, nil
}

func resolveAggregateCatalogRelationships(catalog *ppmodel.CatalogSite, discovered []*aggregateDiscoveredSpec) {
	if catalog == nil {
		return
	}
	type root struct {
		spec     *aggregateDiscoveredSpec
		contract *ppmodel.CatalogContract
		version  *ppmodel.CatalogContractVersion
	}
	accepted := make(map[string]*root, len(discovered))
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil {
					continue
				}
				accepted[path.Clean(filepath.ToSlash(version.Entry.RelativePath))] = &root{contract: contract, version: version}
			}
		}
	}
	for _, spec := range discovered {
		if spec == nil {
			continue
		}
		if item := accepted[path.Clean(filepath.ToSlash(spec.RelativePath))]; item != nil {
			item.spec = spec
		}
	}

	type edgeKey struct {
		source, target, relation string
	}
	seen := make(map[edgeKey]struct{})
	for sourcePath, source := range accepted {
		if source.spec == nil || source.version == nil || source.version.Entry == nil {
			continue
		}
		for _, rawRef := range source.spec.ExternalRefs {
			document, _, _ := strings.Cut(strings.TrimSpace(rawRef), "#")
			if document == "" || aggregateRelationshipRefIsNonLocal(document) {
				continue
			}
			targetPath := path.Clean(path.Join(path.Dir(sourcePath), filepath.ToSlash(document)))
			target := accepted[targetPath]
			if target == nil || target == source || target.version == nil || target.version.Entry == nil {
				continue
			}
			forward, inverse := "references", "referenced-by"
			forwardLabel, inverseLabel := "References", "Referenced by"
			if source.contract.Role == ppmodel.ContractRoleConsumedEvents &&
				(target.contract.Role == ppmodel.ContractRolePublishedEvents || target.contract.Role == ppmodel.ContractRoleExternalSource) {
				forward, inverse = "consumes-from", "consumed-by"
				forwardLabel, inverseLabel = "Consumes from", "Consumed by"
			}
			key := edgeKey{source: sourcePath, target: targetPath, relation: forward}
			if _, duplicate := seen[key]; duplicate {
				continue
			}
			seen[key] = struct{}{}
			source.version.Relationships = append(source.version.Relationships, &ppmodel.CatalogContractRelationship{
				Relation: forward,
				Label:    forwardLabel + " " + target.contract.DisplayName,
				Href:     target.version.OverviewHref,
				SpecKind: target.contract.SpecKind,
			})
			target.version.Relationships = append(target.version.Relationships, &ppmodel.CatalogContractRelationship{
				Relation: inverse,
				Label:    inverseLabel + " " + source.contract.DisplayName,
				Href:     source.version.OverviewHref,
				SpecKind: source.contract.SpecKind,
			})
		}
	}
	for _, item := range accepted {
		sortCatalogRelationships(item.version.Relationships)
	}
}

func resolveAggregateExternalMessageHrefs(catalog *ppmodel.CatalogSite, discovered []*aggregateDiscoveredSpec) {
	if catalog == nil {
		return
	}
	type root struct {
		spec  *aggregateDiscoveredSpec
		entry *ppmodel.CatalogSpecEntry
	}
	accepted := make(map[string]*root, len(discovered))
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
					continue
				}
				accepted[path.Clean(filepath.ToSlash(version.Entry.RelativePath))] = &root{entry: version.Entry}
			}
		}
	}
	for _, spec := range discovered {
		if spec == nil {
			continue
		}
		spec.externalMessageHrefs = nil
		if item := accepted[path.Clean(filepath.ToSlash(spec.RelativePath))]; item != nil {
			item.spec = spec
		}
	}
	for sourcePath, source := range accepted {
		if source.spec == nil || source.entry == nil {
			continue
		}
		for _, rawRef := range source.spec.ExternalRefs {
			parsed, err := url.Parse(strings.TrimSpace(rawRef))
			if err != nil || parsed.Path == "" || parsed.Fragment == "" || parsed.RawQuery != "" || aggregateRelationshipRefIsNonLocal(parsed.Path) {
				continue
			}
			targetPath := path.Clean(path.Join(path.Dir(sourcePath), filepath.ToSlash(parsed.Path)))
			target := accepted[targetPath]
			if target == nil || target == source || target.spec == nil || target.entry == nil {
				continue
			}
			targetLocalHref := target.spec.MessageHrefs["#"+parsed.Fragment]
			if targetLocalHref == "" {
				continue
			}
			targetHref := path.Join(filepath.ToSlash(filepath.Dir(target.entry.OverviewHref)), targetLocalHref)
			if source.spec.externalMessageHrefs == nil {
				source.spec.externalMessageHrefs = make(map[string]string)
			}
			source.spec.externalMessageHrefs[strings.TrimSpace(rawRef)] = relativeCatalogHref(source.entry.OutputSubdir, targetHref)
		}
	}
}

func aggregateRelationshipRefIsNonLocal(document string) bool {
	if strings.HasPrefix(document, "//") || path.IsAbs(filepath.ToSlash(document)) || filepath.IsAbs(document) {
		return true
	}
	if len(document) >= 3 && ((document[0] >= 'A' && document[0] <= 'Z') || (document[0] >= 'a' && document[0] <= 'z')) && document[1] == ':' && (document[2] == '/' || document[2] == '\\') {
		return true
	}
	parsed, err := url.Parse(document)
	return err != nil || parsed.Scheme != "" || parsed.Host != ""
}

func sortCatalogRelationships(relationships []*ppmodel.CatalogContractRelationship) {
	sort.SliceStable(relationships, func(i, j int) bool {
		left, right := relationships[i], relationships[j]
		if left.Relation != right.Relation {
			return left.Relation < right.Relation
		}
		if left.Label != right.Label {
			return left.Label < right.Label
		}
		if left.Href != right.Href {
			return left.Href < right.Href
		}
		return left.SpecKind.MachineValue() < right.SpecKind.MachineValue()
	})
}

func (ap *AggregatePrintingPress) applyAggregateNavigationFingerprints(catalog *ppmodel.CatalogSite, discovered []*aggregateDiscoveredSpec) {
	if catalog == nil {
		return
	}
	entriesByPath := make(map[string]*ppmodel.CatalogSpecEntry, len(discovered))
	servicesByEntryPath := make(map[string]*ppmodel.CatalogService, len(discovered))
	targetIdentityByHref := make(map[string]string, len(discovered))
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
					continue
				}
				entriesByPath[version.Entry.RelativePath] = version.Entry
				servicesByEntryPath[version.Entry.RelativePath] = service
				targetIdentityByHref[version.OverviewHref] = strings.Join([]string{
					service.IdentityKey, service.Slug, contract.ID, version.Label, version.Slug,
				}, "\x00")
			}
		}
	}

	fingerprintByService := make(map[string]string, len(catalog.Services))
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		type navigationRecord struct {
			ContractID    string                         `json:"contractId"`
			DisplayName   string                         `json:"displayName"`
			Role          ppmodel.ContractRoleValue      `json:"role"`
			Kind          ppmodel.SpecKindValue          `json:"kind"`
			VersionLabel  string                         `json:"versionLabel"`
			VersionSlug   string                         `json:"versionSlug"`
			OverviewHref  string                         `json:"overviewHref"`
			Relationships []navigationRelationshipRecord `json:"relationships,omitempty"`
		}
		type navigationFingerprint struct {
			IdentityKey       string             `json:"identityKey"`
			Slug              string             `json:"slug"`
			DisplayName       string             `json:"displayName"`
			DefaultContractID string             `json:"defaultContractId"`
			Entries           []navigationRecord `json:"entries"`
		}
		payload := navigationFingerprint{
			IdentityKey:       service.IdentityKey,
			Slug:              service.Slug,
			DisplayName:       service.DisplayName,
			DefaultContractID: service.DefaultContractID,
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
					continue
				}
				record := navigationRecord{
					ContractID:   contract.ID,
					DisplayName:  contract.DisplayName,
					Role:         contract.Role,
					Kind:         contract.SpecKind,
					VersionLabel: version.Label,
					VersionSlug:  version.Slug,
					OverviewHref: version.OverviewHref,
				}
				for _, relationship := range version.Relationships {
					if relationship == nil {
						continue
					}
					record.Relationships = append(record.Relationships, navigationRelationshipRecord{
						Relation:       relationship.Relation,
						Label:          relationship.Label,
						Href:           relationship.Href,
						Kind:           relationship.SpecKind,
						TargetIdentity: targetIdentityByHref[relationship.Href],
					})
				}
				sort.Slice(record.Relationships, func(i, j int) bool {
					return navigationRelationshipLess(record.Relationships[i], record.Relationships[j])
				})
				payload.Entries = append(payload.Entries, record)
			}
		}
		sort.Slice(payload.Entries, func(i, j int) bool {
			left, right := payload.Entries[i], payload.Entries[j]
			return strings.Join([]string{left.ContractID, left.DisplayName, left.Role.MachineValue(), left.Kind.MachineValue(), left.VersionLabel, left.VersionSlug, left.OverviewHref}, "\x00") <
				strings.Join([]string{right.ContractID, right.DisplayName, right.Role.MachineValue(), right.Kind.MachineValue(), right.VersionLabel, right.VersionSlug, right.OverviewHref}, "\x00")
		})
		encoded, err := json.Marshal(payload)
		if err == nil {
			fingerprintByService[service.Key] = fmt.Sprintf("%x", xxhash.Sum64(encoded))
		}
	}
	for _, spec := range discovered {
		if spec == nil {
			continue
		}
		service := servicesByEntryPath[spec.RelativePath]
		entry := entriesByPath[spec.RelativePath]
		if service == nil || entry == nil {
			continue
		}
		navigationFingerprint := strings.Join([]string{
			fingerprintByService[service.Key],
			aggregateExternalMessageHrefFingerprint(spec.externalMessageHrefs),
		}, "\x00")
		spec.ConfigHash = aggregateEntryNavigationConfigHash(spec.EntryConfigHash, navigationFingerprint)
		spec.HTMLCompletionHash = aggregateOutputCompletionHash(spec, "html")
		spec.JSONCompletionHash = aggregateOutputCompletionHash(spec, "json")
		spec.LLMCompletionHash = aggregateOutputCompletionHash(spec, "llm")
	}
}

func aggregateExternalMessageHrefFingerprint(hrefs map[string]string) string {
	if len(hrefs) == 0 {
		return ""
	}
	encoded, err := json.Marshal(hrefs)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%x", xxhash.Sum64(encoded))
}

func aggregateOutputCompletionHash(spec *aggregateDiscoveredSpec, family string) string {
	if spec == nil {
		return ""
	}
	encoded, err := json.Marshal(struct {
		Family     string `json:"family"`
		Hash       string `json:"hash"`
		ConfigHash string `json:"configHash"`
		SpecKind   string `json:"specKind"`
		OutputDir  string `json:"outputDir"`
	}{family, spec.Hash, spec.ConfigHash, spec.SpecKind.MachineValue(), spec.OutputSubdir})
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%x", xxhash.Sum64(encoded))
}

func aggregateSpecSelectedOutputDirty(spec *aggregateDiscoveredSpec, selection aggregateOutputSelection, buildMode string) bool {
	if spec == nil || !selection.any() {
		return false
	}
	if buildMode == AggregateBuildModeFull || spec.previousState == nil {
		return true
	}
	previous := spec.previousState
	return selection.html && previous.HTMLCompletionHash != spec.HTMLCompletionHash ||
		selection.json && previous.JSONCompletionHash != spec.JSONCompletionHash ||
		selection.llm && previous.LLMCompletionHash != spec.LLMCompletionHash
}

func (ap *AggregatePrintingPress) preflightChangedEntries(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	if plan == nil || plan.catalog == nil {
		return nil
	}
	if plan.preflighted == nil {
		plan.preflighted = make(map[string]struct{})
	}
	entries := catalogEntryIndex(plan.catalog)
	type preflightResult struct {
		spec  *aggregateDiscoveredSpec
		entry *ppmodel.CatalogSpecEntry
		site  *ppmodel.Site
		err   error
	}
	for iteration := 0; ; iteration++ {
		var candidates []*aggregateDiscoveredSpec
		for _, spec := range plan.discovered {
			if spec == nil || spec.RenderSkipped || !aggregateSpecSelectedOutputDirty(spec, selection, ap.config.BuildMode) {
				continue
			}
			if _, ok := plan.preflighted[spec.RelativePath]; ok {
				continue
			}
			candidates = append(candidates, spec)
		}
		if len(candidates) == 0 {
			return nil
		}
		if iteration >= len(plan.discovered) {
			return fmt.Errorf("printingpress: aggregate preflight did not converge after %d entries", len(plan.discovered))
		}
		for _, spec := range candidates {
			if entries[spec.RelativePath] == nil {
				return fmt.Errorf("printingpress: missing catalog entry for discovered spec %s", spec.RelativePath)
			}
		}
		workerCount := ap.resolvePoolCount(len(candidates))
		jobs := make(chan *aggregateDiscoveredSpec)
		results := make(chan preflightResult, workerCount)
		var wg sync.WaitGroup
		for range workerCount {
			wg.Add(1)
			go func() {
				defer wg.Done()
				for spec := range jobs {
					entry := entries[spec.RelativePath]
					builder := ap.preflightBuildEntrySite
					if builder == nil {
						builder = ap.buildEntrySite
					}
					site, err := builder(spec, entry)
					results <- preflightResult{spec: spec, entry: entry, site: site, err: err}
				}
			}()
		}
		go func() {
			for _, spec := range candidates {
				jobs <- spec
			}
			close(jobs)
			wg.Wait()
			close(results)
		}()
		collected := make([]preflightResult, 0, len(candidates))
		for result := range results {
			collected = append(collected, result)
		}
		sort.Slice(collected, func(i, j int) bool {
			return collected[i].spec.RelativePath < collected[j].spec.RelativePath
		})
		for _, result := range collected {
			plan.preflighted[result.spec.RelativePath] = struct{}{}
			if result.err != nil {
				result.spec.prebuiltSite = nil
				ap.markRenderSkipped(plan, result.spec, result.entry, "skipped render build for discovered spec", result.err)
				continue
			}
			result.spec.prebuiltSite = result.site
		}
		resolveAggregateExternalMessageHrefs(plan.catalog, plan.discovered)
		ap.finalizeCatalog(plan.catalog)
		ap.applyAggregateNavigationFingerprints(plan.catalog, plan.discovered)
	}
}

type navigationRelationshipRecord struct {
	Relation       string                `json:"relation"`
	Label          string                `json:"label"`
	Href           string                `json:"href"`
	Kind           ppmodel.SpecKindValue `json:"kind"`
	TargetIdentity string                `json:"targetIdentity"`
}

func navigationRelationshipLess(left, right navigationRelationshipRecord) bool {
	return strings.Join([]string{left.Relation, left.Label, left.Href, left.Kind.MachineValue(), left.TargetIdentity}, "\x00") <
		strings.Join([]string{right.Relation, right.Label, right.Href, right.Kind.MachineValue(), right.TargetIdentity}, "\x00")
}

func aggregateEntryNavigationConfigHash(entryConfigHash, navigationFingerprint string) string {
	encoded, err := json.Marshal(struct {
		EntryConfigHash       string `json:"entryConfigHash"`
		NavigationFingerprint string `json:"navigationFingerprint"`
	}{entryConfigHash, navigationFingerprint})
	if err != nil {
		return entryConfigHash
	}
	return fmt.Sprintf("%x", xxhash.Sum64(encoded))
}

func validateAggregateCanonicalServiceSlugs(serviceMap map[string]*aggregateServiceGroup, serviceKeys []string) error {
	ordered := append([]string(nil), serviceKeys...)
	sort.Strings(ordered)
	bySlug := make(map[string]*aggregateServiceGroup, len(ordered))
	for _, key := range ordered {
		group := serviceMap[key]
		if group == nil {
			continue
		}
		previous := bySlug[group.slug]
		if previous == nil {
			bySlug[group.slug] = group
			continue
		}
		if previous.key == group.key {
			continue
		}
		return fmt.Errorf(
			"printingpress: canonical service slug %q conflicts between identities %q (%s) and %q (%s)",
			group.slug,
			previous.key,
			previous.primaryPath,
			group.key,
			group.primaryPath,
		)
	}
	return nil
}

func (ap *AggregatePrintingPress) resolveLogicalContract(spec *aggregateDiscoveredSpec) (ppmodel.ContractRoleValue, string, bool) {
	role := ppmodel.ContractRoleEvents
	if spec.SpecKind.IsOpenAPI() {
		role = ppmodel.ContractRoleHTTPAPI
	}
	contractID := ""
	explicitDefault := false
	for _, rule := range ap.config.ContractRoles {
		if !ruleMatches(spec.RelativePath, rule.Pattern) {
			continue
		}
		role = ppmodel.ContractRoleValue(rule.Role)
		if strings.TrimSpace(rule.ContractID) != "" {
			contractID = slugpkg.Sanitize(strings.TrimSpace(rule.ContractID))
		}
		explicitDefault = rule.Default
		break
	}
	if contractID == "" {
		contractID = ap.deriveLogicalContractID(spec.RelativePath, role)
	}
	return role, contractID, explicitDefault
}

func (ap *AggregatePrintingPress) deriveLogicalContractID(relPath string, role ppmodel.ContractRoleValue) string {
	noise := make(map[string]struct{}, len(ap.config.NoiseSegments))
	for _, segment := range ap.config.NoiseSegments {
		noise[strings.ToLower(strings.TrimSpace(segment))] = struct{}{}
	}
	clean := path.Clean(strings.TrimSpace(filepath.ToSlash(relPath)))
	segments := strings.Split(clean, "/")
	if len(segments) > 0 {
		last := strings.TrimSuffix(segments[len(segments)-1], path.Ext(segments[len(segments)-1]))
		lower := strings.ToLower(last)
		if lower == "openapi" || lower == "asyncapi" {
			last = ""
			lower = ""
		}
		for _, suffix := range []string{".openapi", ".asyncapi"} {
			if strings.HasSuffix(lower, suffix) {
				last = last[:len(last)-len(suffix)]
				break
			}
		}
		segments[len(segments)-1] = last
	}
	identitySegments := make([]string, 0, len(segments))
	for _, segment := range segments {
		segment = strings.TrimSpace(segment)
		if segment == "" || segment == "." || isVersionDirectorySegment(segment) {
			continue
		}
		if _, ok := noise[strings.ToLower(segment)]; ok {
			continue
		}
		identitySegments = append(identitySegments, segment)
	}
	sourceCandidate := strings.Join(identitySegments, "-")
	if sourceCandidate == "" {
		return role.MachineValue()
	}
	sourceIdentity := slugpkg.Sanitize(sourceCandidate)
	return role.MachineValue() + "-" + sourceIdentity
}

func (ap *AggregatePrintingPress) prepareAggregateServiceGroup(group *aggregateServiceGroup) error {
	if ap.config.ServiceIdentity.PreferOpenAPISlug {
		openAPISlugs := make(map[string]struct{})
		for _, contract := range group.contracts {
			if !contract.specKind.IsOpenAPI() {
				continue
			}
			for _, version := range contract.versions {
				if version.spec.PathServiceSlug != "" {
					openAPISlugs[version.spec.PathServiceSlug] = struct{}{}
				}
			}
		}
		slugs := make([]string, 0, len(openAPISlugs))
		for slug := range openAPISlugs {
			slugs = append(slugs, slug)
		}
		sort.Strings(slugs)
		if len(slugs) > 1 {
			return fmt.Errorf("printingpress: service identity %q has ambiguous OpenAPI service slugs: %s", group.key, strings.Join(slugs, ", "))
		}
		if len(slugs) == 1 {
			group.slug = slugs[0]
		}
	}

	var explicit []*aggregateContractGroup
	for _, contract := range group.contracts {
		sort.Slice(contract.versions, func(i, j int) bool {
			return compareVersionLabels(contract.versions[i].label, contract.versions[j].label) > 0
		})
		if len(contract.versions) > 0 {
			contract.latest = contract.versions[0]
			contract.displayName = aggregateContractDisplayName(contract.latest.spec)
		}
		if contract.explicitDefault {
			explicit = append(explicit, contract)
		}
	}
	if len(explicit) > 1 {
		ids := make([]string, 0, len(explicit))
		for _, contract := range explicit {
			ids = append(ids, contract.id)
		}
		sort.Strings(ids)
		return fmt.Errorf("printingpress: service %q has multiple explicit default contracts: %s", group.key, strings.Join(ids, ", "))
	}

	sort.Slice(group.contracts, func(i, j int) bool {
		return aggregateContractTieLess(group.contracts[i], group.contracts[j])
	})
	if len(explicit) == 1 {
		group.defaultContract = explicit[0]
	} else {
		group.defaultContract = resolveAggregateDefaultContract(group.contracts)
	}
	if group.defaultContract != nil && group.defaultContract.latest != nil {
		group.displayName = group.defaultContract.latest.spec.DisplayName
		group.summary = group.defaultContract.latest.spec.Summary
		group.primaryPath = group.defaultContract.latest.spec.RelativePath
	}
	return nil
}

func aggregateContractDisplayName(spec *aggregateDiscoveredSpec) string {
	if spec == nil {
		return ""
	}
	if strings.TrimSpace(spec.Title) != "" {
		return strings.TrimSpace(spec.Title)
	}
	return strings.TrimSpace(strings.TrimSuffix(path.Base(spec.RelativePath), path.Ext(spec.RelativePath)))
}

func resolveAggregateDefaultContract(contracts []*aggregateContractGroup) *aggregateContractGroup {
	var openAPI []*aggregateContractGroup
	for _, contract := range contracts {
		if contract.specKind.IsOpenAPI() {
			openAPI = append(openAPI, contract)
		}
	}
	if len(openAPI) > 0 {
		sort.Slice(openAPI, func(i, j int) bool {
			comparison := compareVersionLabels(openAPI[i].latest.label, openAPI[j].latest.label)
			if comparison != 0 {
				return comparison > 0
			}
			return aggregateContractTieLess(openAPI[i], openAPI[j])
		})
		return openAPI[0]
	}
	if len(contracts) == 0 {
		return nil
	}
	events := append([]*aggregateContractGroup(nil), contracts...)
	sort.Slice(events, func(i, j int) bool {
		leftRank := aggregateContractRoleRank(events[i].role)
		rightRank := aggregateContractRoleRank(events[j].role)
		if leftRank != rightRank {
			return leftRank < rightRank
		}
		return aggregateContractTieLess(events[i], events[j])
	})
	return events[0]
}

func aggregateContractRoleRank(role ppmodel.ContractRoleValue) int {
	switch role {
	case ppmodel.ContractRolePublishedEvents:
		return 0
	case ppmodel.ContractRoleConsumedEvents:
		return 1
	case ppmodel.ContractRoleExternalSource:
		return 2
	default:
		return 3
	}
}

func aggregateContractTieLess(left, right *aggregateContractGroup) bool {
	leftName := strings.ToLower(left.displayName)
	rightName := strings.ToLower(right.displayName)
	if leftName != rightName {
		return leftName < rightName
	}
	leftPath, rightPath := "", ""
	if left.latest != nil && left.latest.spec != nil {
		leftPath = left.latest.spec.RelativePath
	}
	if right.latest != nil && right.latest.spec != nil {
		rightPath = right.latest.spec.RelativePath
	}
	if leftPath != rightPath {
		return leftPath < rightPath
	}
	return left.id < right.id
}

func aggregateDefaultContractID(group *aggregateServiceGroup) string {
	if group == nil || group.defaultContract == nil {
		return ""
	}
	return group.defaultContract.id
}

func (ap *AggregatePrintingPress) finalizeCatalog(catalog *ppmodel.CatalogSite) {
	reconcileCatalogContracts(catalog)
	reconcileCatalogRelationships(catalog)
	ap.refreshCatalogLatestState(catalog)
	ap.refreshCatalogDiagnosticCounts(catalog)
	ap.populateHeaderContexts(catalog)
}

func reconcileCatalogRelationships(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	visibleTargets := make(map[string]struct{})
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
					continue
				}
				visibleTargets[version.OverviewHref] = struct{}{}
			}
		}
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, version := range contract.Versions {
				if version == nil {
					continue
				}
				visible := version.Relationships[:0]
				for _, relationship := range version.Relationships {
					if relationship == nil {
						continue
					}
					if _, ok := visibleTargets[relationship.Href]; ok {
						visible = append(visible, relationship)
					}
				}
				version.Relationships = visible
				sortCatalogRelationships(version.Relationships)
			}
		}
	}
}

func reconcileCatalogContracts(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		previousDefaultID := service.DefaultContractID
		previousEntry := catalogContractLatestEntryForID(service, previousDefaultID)
		var previousDefault *ppmodel.CatalogContract
		visibleContracts := make([]*ppmodel.CatalogContract, 0, len(service.Contracts))
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			visibleVersions := contract.Versions[:0]
			for _, version := range contract.Versions {
				if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
					continue
				}
				visibleVersions = append(visibleVersions, version)
			}
			contract.Versions = visibleVersions
			contract.LatestVersion = nil
			contract.Default = false
			if len(contract.Versions) == 0 {
				continue
			}
			sort.Slice(contract.Versions, func(i, j int) bool {
				return compareVersionLabels(contract.Versions[i].Label, contract.Versions[j].Label) > 0
			})
			contract.LatestVersion = contract.Versions[0]
			visibleContracts = append(visibleContracts, contract)
			if contract.ID == previousDefaultID {
				previousDefault = contract
			}
		}

		resolved := previousDefault
		if resolved == nil {
			resolved = resolveVisibleCatalogDefaultContract(visibleContracts)
		}
		service.DefaultContractID = ""
		if resolved != nil {
			resolved.Default = true
			service.DefaultContractID = resolved.ID
		}
		resolvedEntry := catalogContractLatestEntryForID(service, service.DefaultContractID)
		if previousDefaultID == service.DefaultContractID && previousEntry == resolvedEntry {
			continue
		}
		if resolvedEntry == nil {
			service.DisplayName = ""
			service.Summary = ""
			service.PrimaryPath = ""
			continue
		}
		service.DisplayName = fallbackValue(resolvedEntry.Title, resolved.DisplayName)
		service.Summary = resolvedEntry.Summary
		service.PrimaryPath = resolvedEntry.RelativePath
	}
}

func resolveVisibleCatalogDefaultContract(contracts []*ppmodel.CatalogContract) *ppmodel.CatalogContract {
	if len(contracts) == 0 {
		return nil
	}
	var openAPI []*ppmodel.CatalogContract
	for _, contract := range contracts {
		if contract.SpecKind.IsOpenAPI() {
			openAPI = append(openAPI, contract)
		}
	}
	if len(openAPI) > 0 {
		sort.Slice(openAPI, func(i, j int) bool {
			comparison := compareVersionLabels(openAPI[i].LatestVersion.Label, openAPI[j].LatestVersion.Label)
			if comparison != 0 {
				return comparison > 0
			}
			return catalogContractTieLess(openAPI[i], openAPI[j])
		})
		return openAPI[0]
	}
	events := append([]*ppmodel.CatalogContract(nil), contracts...)
	sort.Slice(events, func(i, j int) bool {
		leftRank := aggregateContractRoleRank(events[i].Role)
		rightRank := aggregateContractRoleRank(events[j].Role)
		if leftRank != rightRank {
			return leftRank < rightRank
		}
		return catalogContractTieLess(events[i], events[j])
	})
	return events[0]
}

func catalogContractTieLess(left, right *ppmodel.CatalogContract) bool {
	leftName := strings.ToLower(left.DisplayName)
	rightName := strings.ToLower(right.DisplayName)
	if leftName != rightName {
		return leftName < rightName
	}
	leftPath := catalogContractLatestRelativePath(left)
	rightPath := catalogContractLatestRelativePath(right)
	if leftPath != rightPath {
		return leftPath < rightPath
	}
	return left.ID < right.ID
}

func catalogContractLatestRelativePath(contract *ppmodel.CatalogContract) string {
	if contract == nil || contract.LatestVersion == nil || contract.LatestVersion.Entry == nil {
		return ""
	}
	return contract.LatestVersion.Entry.RelativePath
}

func catalogContractLatestEntryForID(service *ppmodel.CatalogService, contractID string) *ppmodel.CatalogSpecEntry {
	if service == nil || contractID == "" {
		return nil
	}
	for _, contract := range service.Contracts {
		if contract == nil || contract.ID != contractID || contract.LatestVersion == nil {
			continue
		}
		return contract.LatestVersion.Entry
	}
	return nil
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
		if entry := catalogDefaultContractLatestEntry(service); entry != nil {
			service.Summary = entry.Summary
		} else {
			service.Summary = service.LatestVersion.Summary
		}
	}
}

func (ap *AggregatePrintingPress) refreshCatalogDiagnosticCounts(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		var serviceCounts ppmodel.ViolationCounts
		for _, version := range service.Versions {
			if version == nil {
				continue
			}
			var versionCounts ppmodel.ViolationCounts
			for _, entry := range visibleCatalogEntries(version) {
				versionCounts = addViolationCounts(versionCounts, entry.Counts)
			}
			version.Counts = violationCountsPointer(versionCounts)
			serviceCounts = addViolationCounts(serviceCounts, version.Counts)
		}
		service.Counts = violationCountsPointer(serviceCounts)
	}
}

func aggregateLintResultCounts(results []*drV3.RuleFunctionResult) *ppmodel.ViolationCounts {
	var counts ppmodel.ViolationCounts
	for _, result := range results {
		severity, ok := monacoSeverity(resultSeverity(result))
		if !ok {
			continue
		}
		switch severity {
		case 8:
			counts.Errors++
		case 4:
			counts.Warns++
		case 2:
			counts.Infos++
		}
	}
	return violationCountsPointer(counts)
}

func addViolationCounts(counts ppmodel.ViolationCounts, next *ppmodel.ViolationCounts) ppmodel.ViolationCounts {
	if next == nil {
		return counts
	}
	counts.Errors += next.Errors
	counts.Warns += next.Warns
	counts.Infos += next.Infos
	return counts
}

func violationCountsPointer(counts ppmodel.ViolationCounts) *ppmodel.ViolationCounts {
	if counts.Total() == 0 {
		return nil
	}
	cp := counts
	return &cp
}

func (ap *AggregatePrintingPress) populateHeaderContexts(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		relationshipsByEntry := make(map[string][]*ppmodel.CatalogContractRelationship)
		for _, contract := range service.Contracts {
			if contract == nil {
				continue
			}
			for _, contractVersion := range contract.Versions {
				if contractVersion == nil || contractVersion.Entry == nil {
					continue
				}
				relationshipsByEntry[contractVersion.Entry.RelativePath] = contractVersion.Relationships
			}
		}
		navigation := ap.buildCatalogNavigationView(service)
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
					OverviewHref:   relativeCatalogHref(entry.OutputSubdir, entry.OverviewHref),
					OverviewLabel:  siteOverviewLabel(entry.SpecKind),
					ServiceName:    service.DisplayName,
					CurrentVersion: entry.Version,
				}
				for _, relationship := range relationshipsByEntry[entry.RelativePath] {
					if relationship == nil {
						continue
					}
					entry.HeaderContext.Relationships = append(entry.HeaderContext.Relationships, &ppmodel.SiteContractRelationship{
						Relation: relationship.Relation,
						Label:    relationship.Label,
						Href:     relativeCatalogHref(entry.OutputSubdir, relationship.Href),
						SpecKind: relationship.SpecKind,
					})
				}
				activeContract := visibleCatalogContractForEntry(navigation.contracts, entry)
				if activeContract != nil {
					entry.HeaderContext.Versions = siteVersionLinks(entry.OutputSubdir, activeContract, entry)
				}
				if len(navigation.contracts) > 1 {
					entry.HeaderContext.ContractGroups = siteContractGroups(entry.OutputSubdir, navigation.contracts, activeContract, entry)
				}
			}
		}
	}
}

var siteContractRoleOrder = []ppmodel.ContractRoleValue{
	ppmodel.ContractRoleHTTPAPI,
	ppmodel.ContractRolePublishedEvents,
	ppmodel.ContractRoleConsumedEvents,
	ppmodel.ContractRoleExternalSource,
	ppmodel.ContractRoleEvents,
}

func siteOverviewLabel(kind ppmodel.SpecKindValue) string {
	if kind.IsAsyncAPI() {
		return "EVENT OVERVIEW"
	}
	return "API OVERVIEW"
}

type catalogNavigationView struct {
	contracts []*catalogNavigationContract
}

type catalogNavigationContract struct {
	contract   *ppmodel.CatalogContract
	versions   []*ppmodel.CatalogContractVersion
	explicitID bool
}

func (ap *AggregatePrintingPress) buildCatalogNavigationView(service *ppmodel.CatalogService) *catalogNavigationView {
	view := &catalogNavigationView{}
	if service == nil {
		return view
	}
	view.contracts = make([]*catalogNavigationContract, 0, len(service.Contracts))
	for _, contract := range service.Contracts {
		versions := visibleCatalogContractVersions(contract)
		if len(versions) == 0 {
			continue
		}
		explicitID := ap.catalogContractVersionsHaveExplicitID(versions)
		if explicitID {
			view.contracts = append(view.contracts, &catalogNavigationContract{contract: contract, versions: versions, explicitID: true})
			continue
		}
		merged := false
		for _, candidate := range view.contracts {
			if candidate.explicitID || !sameNavigationContract(candidate.contract, contract) || catalogContractVersionsOverlap(candidate.versions, versions) {
				continue
			}
			candidate.versions = mergeCatalogContractVersions(candidate.versions, versions)
			merged = true
			break
		}
		if !merged {
			view.contracts = append(view.contracts, &catalogNavigationContract{contract: contract, versions: versions})
		}
	}
	return view
}

func (ap *AggregatePrintingPress) catalogContractVersionsHaveExplicitID(versions []*ppmodel.CatalogContractVersion) bool {
	if ap == nil || ap.config == nil {
		return false
	}
	for _, version := range versions {
		if version.Entry == nil {
			continue
		}
		for _, rule := range ap.config.ContractRoles {
			if !ruleMatches(version.Entry.RelativePath, rule.Pattern) {
				continue
			}
			if strings.TrimSpace(rule.ContractID) != "" {
				return true
			}
			break
		}
	}
	return false
}

func mergeCatalogContractVersions(left, right []*ppmodel.CatalogContractVersion) []*ppmodel.CatalogContractVersion {
	merged := make([]*ppmodel.CatalogContractVersion, 0, len(left)+len(right))
	leftIndex, rightIndex := 0, 0
	for leftIndex < len(left) && rightIndex < len(right) {
		if compareVersionLabels(left[leftIndex].Label, right[rightIndex].Label) >= 0 {
			merged = append(merged, left[leftIndex])
			leftIndex++
			continue
		}
		merged = append(merged, right[rightIndex])
		rightIndex++
	}
	merged = append(merged, left[leftIndex:]...)
	merged = append(merged, right[rightIndex:]...)
	return merged
}

func sameNavigationContract(left, right *ppmodel.CatalogContract) bool {
	if left == nil || right == nil {
		return false
	}
	return left.Role == right.Role && left.SpecKind == right.SpecKind && siteContractLabel(left) == siteContractLabel(right)
}

func catalogContractVersionsOverlap(left, right []*ppmodel.CatalogContractVersion) bool {
	labels := make(map[string]struct{}, len(left))
	for _, version := range left {
		if version != nil {
			labels[version.Label] = struct{}{}
		}
	}
	for _, version := range right {
		if version == nil {
			continue
		}
		if _, ok := labels[version.Label]; ok {
			return true
		}
	}
	return false
}

func visibleCatalogContractVersions(contract *ppmodel.CatalogContract) []*ppmodel.CatalogContractVersion {
	if contract == nil {
		return nil
	}
	versions := make([]*ppmodel.CatalogContractVersion, 0, len(contract.Versions))
	for _, version := range contract.Versions {
		if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
			continue
		}
		versions = append(versions, version)
	}
	sort.SliceStable(versions, func(i, j int) bool {
		return compareVersionLabels(versions[i].Label, versions[j].Label) > 0
	})
	return versions
}

func visibleCatalogContractForEntry(contracts []*catalogNavigationContract, entry *ppmodel.CatalogSpecEntry) *catalogNavigationContract {
	if entry == nil {
		return nil
	}
	for _, contract := range contracts {
		if contract == nil {
			continue
		}
		for _, version := range contract.versions {
			if sameCatalogEntry(version.Entry, entry) {
				return contract
			}
		}
	}
	return nil
}

func siteVersionLinks(from string, contract *catalogNavigationContract, activeEntry *ppmodel.CatalogSpecEntry) []*ppmodel.SiteVersionLink {
	if contract == nil {
		return nil
	}
	versions := contract.versions
	if len(versions) <= 1 {
		return nil
	}
	links := make([]*ppmodel.SiteVersionLink, 0, len(versions))
	for _, version := range versions {
		links = append(links, &ppmodel.SiteVersionLink{
			Label:  version.Label,
			Href:   relativeCatalogHref(from, version.OverviewHref),
			Active: sameCatalogEntry(version.Entry, activeEntry),
		})
	}
	return links
}

func siteContractGroups(from string, contracts []*catalogNavigationContract, activeContract *catalogNavigationContract, activeEntry *ppmodel.CatalogSpecEntry) []*ppmodel.SiteContractGroup {
	byRole := make(map[ppmodel.ContractRoleValue][]*catalogNavigationContract, len(siteContractRoleOrder))
	for _, contract := range contracts {
		if contract != nil {
			byRole[contract.contract.Role] = append(byRole[contract.contract.Role], contract)
		}
	}
	groups := make([]*ppmodel.SiteContractGroup, 0, len(byRole))
	for _, role := range siteContractRoleOrder {
		roleContracts := byRole[role]
		if len(roleContracts) == 0 {
			continue
		}
		sort.SliceStable(roleContracts, func(i, j int) bool {
			left := siteContractLabel(roleContracts[i].contract)
			right := siteContractLabel(roleContracts[j].contract)
			if left == right {
				return roleContracts[i].contract.ID < roleContracts[j].contract.ID
			}
			return left < right
		})
		group := &ppmodel.SiteContractGroup{Role: role, Label: role.DisplayLabel()}
		for _, contract := range roleContracts {
			versions := contract.versions
			active := contract == activeContract
			target := versions[0]
			link := &ppmodel.SiteContractLink{
				ID:       contract.contract.ID,
				Label:    siteContractLabel(contract.contract),
				SpecKind: contract.contract.SpecKind,
			}
			if active {
				for _, candidate := range versions {
					if sameCatalogEntry(candidate.Entry, activeEntry) {
						target = candidate
						break
					}
				}
				link.Active = true
				link.CurrentVersion = target.Label
				link.Versions = siteVersionLinks(from, contract, activeEntry)
			}
			link.Href = relativeCatalogHref(from, target.OverviewHref)
			group.Contracts = append(group.Contracts, link)
		}
		groups = append(groups, group)
	}
	return groups
}

func siteContractLabel(contract *ppmodel.CatalogContract) string {
	if contract == nil {
		return ""
	}
	if label := strings.TrimSpace(contract.DisplayName); label != "" {
		return label
	}
	return contract.ID
}

func sameCatalogEntry(left, right *ppmodel.CatalogSpecEntry) bool {
	if left == nil || right == nil {
		return false
	}
	return left == right || (left.RelativePath != "" && left.RelativePath == right.RelativePath)
}

func aggregateEntryConfigHash(config *AggregatePrintingPressConfig) string {
	if config == nil {
		return ""
	}
	payload := struct {
		RendererContractVersion            int                            `json:"rendererContractVersion"`
		BaseURL                            string                         `json:"baseURL,omitempty"`
		AssetMode                          string                         `json:"assetMode,omitempty"`
		IncludeSpec                        bool                           `json:"includeSpec,omitempty"`
		EntryConfigFingerprint             string                         `json:"entryConfigFingerprint,omitempty"`
		NoiseSegments                      []string                       `json:"noiseSegments,omitempty"`
		ServiceOverrides                   []AggregatePathOverride        `json:"serviceOverrides,omitempty"`
		DisplayNameOverrides               []AggregatePathOverride        `json:"displayNameOverrides,omitempty"`
		VersionOverrides                   []AggregatePathOverride        `json:"versionOverrides,omitempty"`
		ServiceIdentity                    AggregateServiceIdentityConfig `json:"serviceIdentity,omitempty"`
		ContractRoles                      []AggregateContractRoleRule    `json:"contractRoles,omitempty"`
		Footer                             *ppmodel.FooterConfig          `json:"footer,omitempty"`
		MaxPatternRepeatBudget             int                            `json:"maxPatternRepeatBudget,omitempty"`
		MaxGeneratedStringBytes            int                            `json:"maxGeneratedStringBytes,omitempty"`
		MaxGeneratedMockBytes              int                            `json:"maxGeneratedMockBytes,omitempty"`
		MaxMockDepth                       int                            `json:"maxMockDepth,omitempty"`
		MaxMockNodes                       int                            `json:"maxMockNodes,omitempty"`
		MaxMockProperties                  int                            `json:"maxMockProperties,omitempty"`
		MaxMockRefExpansions               int                            `json:"maxMockRefExpansions,omitempty"`
		MaxMockBytes                       int                            `json:"maxMockBytes,omitempty"`
		LLMAggregateSpecSizeThresholdBytes int64                          `json:"llmAggregateSpecSizeThresholdBytes,omitempty"`
		LLMMaxAggregateFileBytes           int64                          `json:"llmMaxAggregateFileBytes,omitempty"`
		LLMGenerateMonoliths               string                         `json:"llmGenerateMonoliths,omitempty"`
	}{
		RendererContractVersion: aggregateRendererContractVersion,
		BaseURL:                 config.BaseURL,
		AssetMode:               config.AssetMode,
		IncludeSpec:             config.IncludeSpec,
		EntryConfigFingerprint:  config.EntryConfigFingerprint,
		NoiseSegments:           append([]string(nil), config.NoiseSegments...),
		ServiceOverrides:        append([]AggregatePathOverride(nil), config.ServiceOverrides...),
		DisplayNameOverrides:    append([]AggregatePathOverride(nil), config.DisplayNameOverrides...),
		VersionOverrides:        append([]AggregatePathOverride(nil), config.VersionOverrides...),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:           append([]string(nil), config.ServiceIdentity.MetadataPointers...),
			StripPrefixes:              append([]string(nil), config.ServiceIdentity.StripPrefixes...),
			StripSuffixes:              append([]string(nil), config.ServiceIdentity.StripSuffixes...),
			PreferOpenAPISlug:          config.ServiceIdentity.PreferOpenAPISlug,
			MetadataOptionalForOpenAPI: config.ServiceIdentity.MetadataOptionalForOpenAPI,
		},
		ContractRoles:                      append([]AggregateContractRoleRule(nil), config.ContractRoles...),
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

func aggregateMetadataConfigHash(config *AggregatePrintingPressConfig) string {
	payload := struct {
		MetadataPointers           []string `json:"metadataPointers,omitempty"`
		MetadataOptionalForOpenAPI bool     `json:"metadataOptionalForOpenAPI,omitempty"`
	}{}
	if config != nil {
		payload.MetadataPointers = append([]string(nil), config.ServiceIdentity.MetadataPointers...)
		payload.MetadataOptionalForOpenAPI = config.ServiceIdentity.MetadataOptionalForOpenAPI
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%x", xxhash.Sum64(b))
}

func aggregateEntryRenderConfigHash(baseConfigHash string, developerMode bool, lintResults []*drV3.RuleFunctionResult, contentHash string, specKind SpecKind) string {
	if !specKind.IsKnown() {
		specKind = SpecKindOpenAPI
	}
	payload := struct {
		BaseConfigHash string                           `json:"baseConfigHash"`
		DeveloperMode  bool                             `json:"developerMode,omitempty"`
		ContentHash    string                           `json:"contentHash,omitempty"`
		SpecKind       SpecKind                         `json:"specKind,omitempty"`
		LintResults    []aggregateLintResultFingerprint `json:"lintResults,omitempty"`
	}{
		BaseConfigHash: baseConfigHash,
		DeveloperMode:  developerMode,
		ContentHash:    contentHash,
		SpecKind:       specKind,
		LintResults:    aggregateLintResultFingerprints(lintResults),
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return baseConfigHash
	}
	return fmt.Sprintf("%x", xxhash.Sum64(b))
}

func (ap *AggregatePrintingPress) aggregateEntryContentFingerprint(specPath string) string {
	pages, ctx := ap.aggregateEntryResolvedContentPages(specPath)
	if len(pages) == 0 {
		return ""
	}
	sort.SliceStable(pages, func(i, j int) bool {
		left, right := pages[i], pages[j]
		if left == nil || right == nil {
			return right != nil
		}
		if left.Slug != right.Slug {
			return left.Slug < right.Slug
		}
		return left.SourcePath < right.SourcePath
	})
	contentData := make(map[string][]byte, len(pages))

	for _, page := range pages {
		if page == nil {
			continue
		}
		contentData["page:"+page.Slug] = aggregateContentPageFingerprint(page)
		for _, asset := range page.Assets {
			if asset == nil {
				continue
			}
			contentData["asset:"+page.Slug+":"+asset.Href+":"+asset.SourcePath] = aggregateContentAssetFingerprint(asset)
		}
	}
	if ctx != nil {
		for _, missing := range ctx.unresolvedContentAssets() {
			contentData["missing-asset:"+filepath.ToSlash(filepath.Clean(missing))] = nil
		}
	}

	return hashAggregateContent(contentData)
}

func (ap *AggregatePrintingPress) aggregateEntryResolvedContentPages(specPath string) ([]*ppmodel.ContentPage, *contentPageContext) {
	if strings.TrimSpace(specPath) == "" {
		return nil, nil
	}
	pp := &PrintingPress{
		engineConfig: &pressEngineConfig{
			ContentDiscoveryEnabled: true,
			ContentBasePath:         filepath.Dir(specPath),
			ContentSpecPath:         specPath,
			Logger:                  ap.config.Logger,
		},
		site: &ppmodel.Site{},
	}
	return pp.resolveContentPagesOnly()
}

func aggregateContentPageFingerprint(page *ppmodel.ContentPage) []byte {
	if page == nil {
		return nil
	}
	aliases := append([]string(nil), page.SourceAlias...)
	sort.Strings(aliases)
	h := xxhash.New()
	_, _ = fmt.Fprintf(
		h,
		"title\x00%s\x00label\x00%s\x00slug\x00%s\x00href\x00%s\x00description\x00%s\x00source\x00%s\x00source-dir\x00%s\x00order\x00%d\x00hidden\x00%t\x00body\x00",
		page.Title,
		page.Label,
		page.Slug,
		page.Href,
		page.Description,
		page.SourcePath,
		page.SourceDir,
		page.Order,
		page.Hidden,
	)
	_, _ = h.Write([]byte(page.Body))
	_, _ = h.Write([]byte{0})
	_, _ = fmt.Fprintf(h, "body-html\x00%d\x00", len(page.BodyHTML))
	_, _ = h.Write([]byte(page.BodyHTML))
	_, _ = h.Write([]byte{0})
	for _, alias := range aliases {
		_, _ = fmt.Fprintf(h, "alias\x00%s\x00", alias)
	}
	return aggregateUint64Fingerprint(h.Sum64())
}

func aggregateContentAssetFingerprint(asset *ppmodel.ContentPageAsset) []byte {
	if asset == nil {
		return nil
	}
	h := xxhash.New()
	_, _ = fmt.Fprintf(h, "href\x00%s\x00source\x00%s\x00data\x00%d\x00", asset.Href, asset.SourcePath, len(asset.Data))
	_, _ = h.Write(asset.Data)
	_, _ = h.Write([]byte{0})
	return aggregateUint64Fingerprint(h.Sum64())
}

func aggregateUint64Fingerprint(value uint64) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, value)
	return b
}

func hashAggregateContent(contentData map[string][]byte) string {
	if len(contentData) == 0 {
		return ""
	}
	h := xxhash.New()
	hashAggregateContentData(h, contentData)
	return fmt.Sprintf("%x", h.Sum64())
}

func hashAggregateContentData(h hash.Hash64, contentData map[string][]byte) {
	keys := make([]string, 0, len(contentData))
	for key := range contentData {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		_, _ = fmt.Fprintf(h, "content\x00%s\x00%d\x00", filepath.ToSlash(key), len(contentData[key]))
		_, _ = h.Write(contentData[key])
		_, _ = h.Write([]byte{0})
	}
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

func parseAggregateSpecMetadata(content []byte, metadataPointers []string) (aggregateSpecMetadata, error) {
	var parsed struct {
		OpenAPI  string `yaml:"openapi"`
		Swagger  string `yaml:"swagger"`
		AsyncAPI string `yaml:"asyncapi"`
		Info     struct {
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
	var document any
	if err := yaml.Unmarshal(content, &document); err != nil {
		return aggregateSpecMetadata{}, err
	}
	specKind := SpecKindOpenAPI
	if strings.TrimSpace(parsed.AsyncAPI) != "" {
		specKind = SpecKindAsyncAPI
	} else if strings.TrimSpace(parsed.OpenAPI) == "" && strings.TrimSpace(parsed.Swagger) == "" {
		return aggregateSpecMetadata{}, nil
	}
	metadata := aggregateSpecMetadata{
		Title:        strings.TrimSpace(parsed.Info.Title),
		Summary:      chooseCatalogSummary(parsed.Info.Summary, parsed.Info.Description),
		Contact:      catalogContactFromFields(parsed.Info.Contact.Name, parsed.Info.Contact.Email),
		Version:      strings.TrimSpace(parsed.Info.Version),
		SpecKind:     specKind,
		ExternalRefs: collectAggregateExternalRefs(document),
		Valid:        true,
	}
	if len(metadataPointers) > 0 {
		metadata.ServiceIdentityCandidate = resolveAggregateMetadataPointerString(document, metadataPointers)
		metadata.Warnings = aggregateServiceIdentityWarnings(metadataPointers, metadata.ServiceIdentityCandidate)
	}
	return metadata, nil
}

func aggregateServiceIdentityWarnings(metadataPointers []string, candidate string) []string {
	if len(metadataPointers) == 0 || strings.TrimSpace(candidate) != "" {
		return nil
	}
	return []string{aggregateServiceIdentityFallbackWarning}
}

func aggregateServiceIdentityWarningsForSpec(warnings []string, specKind SpecKind, metadataOptionalForOpenAPI bool) []string {
	if !metadataOptionalForOpenAPI || !specKind.IsOpenAPI() {
		return warnings
	}
	filtered := make([]string, 0, len(warnings))
	for _, warning := range warnings {
		if warning != aggregateServiceIdentityFallbackWarning {
			filtered = append(filtered, warning)
		}
	}
	return filtered
}

func resolveAggregateMetadataPointerString(document any, pointers []string) string {
	for _, pointer := range pointers {
		value, ok := resolveAggregateJSONPointer(document, pointer)
		if !ok {
			continue
		}
		text, ok := value.(string)
		if !ok {
			continue
		}
		if text = strings.TrimSpace(text); text != "" {
			return text
		}
	}
	return ""
}

func resolveAggregateJSONPointer(document any, pointer string) (any, bool) {
	if pointer == "" {
		return document, true
	}
	if validateRFC6901JSONPointer(pointer) != nil {
		return nil, false
	}
	current := document
	for _, encodedToken := range strings.Split(pointer[1:], "/") {
		token := strings.ReplaceAll(strings.ReplaceAll(encodedToken, "~1", "/"), "~0", "~")
		switch value := current.(type) {
		case map[string]any:
			current, _ = value[token]
			if current == nil {
				if _, exists := value[token]; !exists {
					return nil, false
				}
			}
		case map[any]any:
			var exists bool
			current, exists = value[token]
			if !exists {
				return nil, false
			}
		case []any:
			if !isAggregateJSONPointerArrayIndex(token) {
				return nil, false
			}
			idx, err := strconv.Atoi(token)
			if err != nil || idx >= len(value) {
				return nil, false
			}
			current = value[idx]
		default:
			return nil, false
		}
	}
	return current, true
}

func isAggregateJSONPointerArrayIndex(token string) bool {
	if token == "0" {
		return true
	}
	if len(token) == 0 || token[0] < '1' || token[0] > '9' {
		return false
	}
	for idx := 1; idx < len(token); idx++ {
		if token[idx] < '0' || token[idx] > '9' {
			return false
		}
	}
	return true
}

func collectAggregateExternalRefs(document any) []string {
	seen := make(map[string]struct{})
	var walk func(any)
	walk = func(value any) {
		switch typed := value.(type) {
		case map[string]any:
			for key, child := range typed {
				if key == "$ref" {
					if ref, ok := child.(string); ok {
						seen[ref] = struct{}{}
					}
				}
				walk(child)
			}
		case map[any]any:
			for key, child := range typed {
				if key == "$ref" {
					if ref, ok := child.(string); ok {
						seen[ref] = struct{}{}
					}
				}
				walk(child)
			}
		case []any:
			for _, child := range typed {
				walk(child)
			}
		}
	}
	walk(document)
	refs := make([]string, 0, len(seen))
	for ref := range seen {
		refs = append(refs, ref)
	}
	sort.Strings(refs)
	return refs
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

func (ap *AggregatePrintingPress) resolvePathServiceCandidate(relPath, title string, noise map[string]struct{}) string {
	if override, ok := findOverrideValue(relPath, ap.config.ServiceOverrides); ok {
		return strings.TrimSpace(override)
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
		return segment
	}
	if stem := strings.TrimSuffix(path.Base(relPath), path.Ext(relPath)); stem != "" {
		return stem
	}
	return strings.TrimSpace(title)
}

func (ap *AggregatePrintingPress) normalizeServiceIdentityCandidate(candidate string) string {
	candidate = strings.ToLower(strings.TrimSpace(candidate))
	if candidate == "" {
		return ""
	}
	candidate = ap.stripServiceIdentityAffixes(candidate)
	if candidate == "" {
		return ""
	}
	return slugpkg.Sanitize(candidate)
}

func (ap *AggregatePrintingPress) normalizePathServiceIdentity(pathServiceSlug string) string {
	candidate := strings.ToLower(strings.TrimSpace(pathServiceSlug))
	if candidate == "" {
		return ""
	}
	candidate = ap.stripServiceIdentityAffixes(candidate)
	if candidate == "" {
		return "unnamed"
	}
	return candidate
}

func (ap *AggregatePrintingPress) stripServiceIdentityAffixes(candidate string) string {
	for {
		previous := candidate
		for _, prefix := range ap.config.ServiceIdentity.StripPrefixes {
			candidate = strings.TrimPrefix(candidate, strings.ToLower(strings.TrimSpace(prefix)))
		}
		for _, suffix := range ap.config.ServiceIdentity.StripSuffixes {
			candidate = strings.TrimSuffix(candidate, strings.ToLower(strings.TrimSpace(suffix)))
		}
		candidate = strings.TrimSpace(candidate)
		if candidate == previous {
			break
		}
	}
	return candidate
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
	cleanRel := path.Clean(strings.ReplaceAll(strings.TrimSpace(relPath), `\`, "/"))
	cleanRule := path.Clean(strings.ReplaceAll(strings.TrimSpace(rule), `\`, "/"))
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
				if idx+2 < len(pattern) && pattern[idx+2] == '/' {
					builder.WriteString(`(?:.*/)?`)
					idx += 2
					continue
				}
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
	leftRelease, leftPrerelease := versionReleaseLabel(left)
	rightRelease, rightPrerelease := versionReleaseLabel(right)
	if lv, ok := parseVersionVector(leftRelease); ok {
		if rv, ok := parseVersionVector(rightRelease); ok {
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
			if leftPrerelease != rightPrerelease {
				if leftPrerelease {
					return -1
				}
				return 1
			}
			if leftPrerelease {
				leftFull, _ := parseVersionVector(left)
				rightFull, _ := parseVersionVector(right)
				for i := 0; i < max(len(leftFull), len(rightFull)); i++ {
					li := versionVectorValue(leftFull, i)
					ri := versionVectorValue(rightFull, i)
					if li != ri {
						if li > ri {
							return 1
						}
						return -1
					}
				}
			}
			return strings.Compare(strings.ToLower(left), strings.ToLower(right))
		}
		return 1
	}
	if _, ok := parseVersionVector(rightRelease); ok {
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

func versionReleaseLabel(label string) (string, bool) {
	trimmed := strings.TrimSpace(label)
	match := versionPrereleaseRE.FindStringIndex(trimmed)
	if match == nil {
		return trimmed, false
	}
	release := strings.TrimRight(trimmed[:match[0]], "-._")
	if _, ok := parseVersionVector(release); !ok {
		return trimmed, false
	}
	return release, true
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
