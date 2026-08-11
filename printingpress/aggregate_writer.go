// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"encoding/json"
	"errors"
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

func (ap *AggregatePrintingPress) refreshPlanLocked(intent aggregatePlanIntent) (*aggregateBuildPlan, error) {
	plan, err := ap.buildPlan(intent)
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
		BasePath:                           filepath.Dir(spec.AbsolutePath),
		SpecPath:                           spec.AbsolutePath,
		OutputDir:                          entryOutput,
		AssetMode:                          ap.config.AssetMode,
		IncludeSpec:                        ap.config.IncludeSpec,
		SharedAssetBaseURL:                 ap.entrySharedAssetBaseURL(spec),
		Footer:                             cloneFooterConfig(ap.config.Footer),
		MaxPatternRepeatBudget:             ap.config.MaxPatternRepeatBudget,
		MaxGeneratedStringBytes:            ap.config.MaxGeneratedStringBytes,
		MaxGeneratedMockBytes:              ap.config.MaxGeneratedMockBytes,
		MaxMockDepth:                       ap.config.MaxMockDepth,
		MaxMockNodes:                       ap.config.MaxMockNodes,
		MaxMockProperties:                  ap.config.MaxMockProperties,
		MaxMockRefExpansions:               ap.config.MaxMockRefExpansions,
		MaxMockBytes:                       ap.config.MaxMockBytes,
		LLMAggregateSpecSizeThresholdBytes: ap.config.LLMAggregateSpecSizeThresholdBytes,
		LLMMaxAggregateFileBytes:           ap.config.LLMMaxAggregateFileBytes,
		LLMGenerateMonoliths:               ap.config.LLMGenerateMonoliths,
		DeveloperMode:                      ap.developerMode,
		LintResults:                        ap.specLintResults[spec.RelativePath],
		EnableContentPages:                 true,
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
	spec.MessageHrefs = aggregateMessageHrefsFromSite(site)
	applyAggregateExternalMessageHrefs(site, spec.externalMessageHrefs)
	site.HeaderContext = entry.HeaderContext
	renderedSource := site.Source
	site.Source = entry.Source
	if ap.config.IncludeSpec && entry.Source != nil && renderedSource != nil {
		includedSource := *entry.Source
		includedSource.Href = renderedSource.Href
		includedSource.LinkEnabled = renderedSource.LinkEnabled
		site.Source = &includedSource
	}
	return site, nil
}

func aggregateMessageHrefsFromSite(site *ppmodel.Site) map[string]string {
	if site == nil {
		return nil
	}
	hrefs := make(map[string]string)
	for _, page := range site.Models["messages"] {
		if page == nil || page.Reference == "" || page.Slug == "" {
			continue
		}
		hrefs[page.Reference] = pppaths.ModelHTML(page.TypeSlug, page.Slug)
	}
	if len(hrefs) == 0 {
		return nil
	}
	return hrefs
}

func applyAggregateExternalMessageHrefs(site *ppmodel.Site, hrefs map[string]string) {
	if site == nil {
		return
	}
	applyMessage := func(message *ppmodel.AsyncAPIMessageRef) {
		if message == nil || !aggregateExternalMessageReference(message.Reference) {
			return
		}
		message.Href = hrefs[strings.TrimSpace(message.Reference)]
	}
	applyComponent := func(component *ppmodel.ComponentLink) {
		if component == nil || !aggregateExternalMessageReference(component.Reference) {
			return
		}
		component.Href = hrefs[strings.TrimSpace(component.Reference)]
	}
	for _, operation := range site.Operations {
		if operation == nil {
			continue
		}
		if operation.AsyncAPI != nil {
			for _, message := range operation.AsyncAPI.Messages {
				applyMessage(message)
			}
			if operation.AsyncAPI.Reply != nil {
				for _, message := range operation.AsyncAPI.Reply.Messages {
					applyMessage(message)
				}
			}
		}
		if operation.RequestBody != nil {
			applyComponent(operation.RequestBody.Ref)
			for _, component := range operation.RequestBody.Refs {
				applyComponent(component)
			}
		}
	}
	for _, models := range site.Models {
		for _, model := range models {
			if model == nil || model.AsyncAPI == nil {
				continue
			}
			for _, message := range model.AsyncAPI.Messages {
				applyMessage(message)
			}
		}
	}
}

func aggregateExternalMessageReference(reference string) bool {
	document, _, found := strings.Cut(strings.TrimSpace(reference), "#")
	return found && document != ""
}

func (ap *AggregatePrintingPress) entrySharedAssetBaseURL(spec *aggregateDiscoveredSpec) string {
	if ap == nil || ap.config == nil || spec == nil {
		return ""
	}
	if ap.config.BaseURL != "" {
		assetBase, err := joinBaseURLPath(ap.config.BaseURL, pppaths.DirStatic)
		if err == nil {
			return strings.TrimRight(assetBase, "/")
		}
	}
	return relativeSharedAssetBase(spec.OutputSubdir)
}

func relativeSharedAssetBase(outputSubdir string) string {
	clean := path.Clean(strings.Trim(filepath.ToSlash(outputSubdir), "/"))
	if clean == "." || clean == "" {
		return pppaths.DirStatic
	}
	depth := len(strings.Split(clean, "/"))
	return strings.Repeat("../", depth) + pppaths.DirStatic
}

type aggregateOutputLocations struct {
	html string
	json string
	llm  string
}

const (
	aggregateOutputFamilyHTML = "html"
	aggregateOutputFamilyJSON = "json"
	aggregateOutputFamilyLLM  = "llm"
)

type aggregateActiveOutputOwner struct {
	RelativePath string
	ServiceKey   string
	ContractID   string
	OutputSubdir string
}

type aggregateActiveOutputOwnership struct {
	byFamily map[string]map[string][]aggregateActiveOutputOwner
}

func aggregateActiveOutputOwnershipFromPlan(plan *aggregateBuildPlan, selection aggregateOutputSelection) aggregateActiveOutputOwnership {
	ownership := aggregateActiveOutputOwnership{byFamily: make(map[string]map[string][]aggregateActiveOutputOwner)}
	if plan == nil {
		return ownership
	}
	for _, spec := range plan.discovered {
		if spec == nil || spec.RenderSkipped {
			continue
		}
		if selection.html {
			ownership.add(aggregateOutputFamilyHTML, spec)
		}
		if selection.json {
			ownership.add(aggregateOutputFamilyJSON, spec)
		}
		if selection.llm {
			ownership.add(aggregateOutputFamilyLLM, spec)
		}
	}
	for _, byLocation := range ownership.byFamily {
		for location := range byLocation {
			sort.Slice(byLocation[location], func(i, j int) bool {
				return byLocation[location][i].RelativePath < byLocation[location][j].RelativePath
			})
		}
	}
	return ownership
}

func (ownership *aggregateActiveOutputOwnership) add(family string, spec *aggregateDiscoveredSpec) {
	if ownership == nil || spec == nil {
		return
	}
	clean, ok := cleanAggregateEntryOutputSubdir(spec.OutputSubdir)
	if !ok {
		return
	}
	if ownership.byFamily == nil {
		ownership.byFamily = make(map[string]map[string][]aggregateActiveOutputOwner)
	}
	if ownership.byFamily[family] == nil {
		ownership.byFamily[family] = make(map[string][]aggregateActiveOutputOwner)
	}
	ownership.byFamily[family][clean] = append(ownership.byFamily[family][clean], aggregateActiveOutputOwner{
		RelativePath: spec.RelativePath,
		ServiceKey:   spec.ServiceKey,
		ContractID:   spec.ContractID,
		OutputSubdir: clean,
	})
}

func (ownership aggregateActiveOutputOwnership) owners(family, subdir string) []aggregateActiveOutputOwner {
	clean, ok := cleanAggregateEntryOutputSubdir(subdir)
	if !ok {
		return nil
	}
	return ownership.byFamily[family][clean]
}

func aggregateRecordOutputLocations(record *SpecStateRecord) aggregateOutputLocations {
	if record == nil {
		return aggregateOutputLocations{}
	}
	copy := *record
	normalizeSpecStateOutputLocations(&copy)
	return aggregateOutputLocations{
		html: strings.TrimSpace(copy.HTMLOutputSubdir),
		json: strings.TrimSpace(copy.JSONOutputSubdir),
		llm:  strings.TrimSpace(copy.LLMOutputSubdir),
	}
}

func (locations aggregateOutputLocations) each(visit func(string)) {
	visit(locations.html)
	visit(locations.json)
	visit(locations.llm)
}

func aggregateCompletedPaths(plan *aggregateBuildPlan) map[string]struct{} {
	completed := make(map[string]struct{}, len(plan.changed))
	for _, spec := range plan.changed {
		if spec != nil {
			completed[spec.RelativePath] = struct{}{}
		}
	}
	return completed
}

func aggregateResultingOutputLocations(spec *aggregateDiscoveredSpec, selection aggregateOutputSelection, completed bool) aggregateOutputLocations {
	if spec == nil {
		return aggregateOutputLocations{}
	}
	locations := aggregateRecordOutputLocations(spec.previousState)
	if completed {
		if selection.html {
			locations.html = spec.OutputSubdir
		}
		if selection.json {
			locations.json = spec.OutputSubdir
		}
		if selection.llm {
			locations.llm = spec.OutputSubdir
		}
	}
	return locations
}

func cleanAggregateEntryOutputSubdir(subdir string) (string, bool) {
	trimmed := strings.TrimSpace(filepath.ToSlash(subdir))
	if trimmed == "" || path.IsAbs(trimmed) {
		return "", false
	}
	clean := path.Clean(trimmed)
	if clean == "." || clean == ".." || strings.HasPrefix(clean, "../") {
		return "", false
	}
	parts := strings.Split(clean, "/")
	if len(parts) != 6 || parts[0] != pppaths.DirServices || parts[1] == "" ||
		parts[2] != pppaths.DirVersions || parts[3] == "" || parts[4] != pppaths.DirSpecs || parts[5] == "" {
		return "", false
	}
	return clean, true
}

func (ap *AggregatePrintingPress) removeAggregateEntryOutputSubdir(subdir string) error {
	target, ok := ap.aggregateEntryOutputPath(subdir)
	if !ok {
		return nil
	}
	return os.RemoveAll(target)
}

func (ap *AggregatePrintingPress) aggregateEntryOutputPath(subdir string) (string, bool) {
	clean, ok := cleanAggregateEntryOutputSubdir(subdir)
	if !ok || ap == nil || ap.config == nil || strings.TrimSpace(ap.config.OutputDir) == "" {
		return "", false
	}
	root := filepath.Clean(ap.config.OutputDir)
	target := filepath.Join(root, filepath.FromSlash(clean))
	rel, err := filepath.Rel(root, target)
	if err != nil || rel == "." || rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return "", false
	}
	return target, true
}

func aggregateCleanupTombstones(plan *aggregateBuildPlan) []*SpecStateRecord {
	if plan == nil {
		return nil
	}
	byPath := make(map[string]*SpecStateRecord, len(plan.removed))
	for _, record := range plan.removed {
		if record != nil {
			byPath[record.RelativePath] = record
		}
	}
	for _, spec := range plan.discovered {
		if spec != nil && spec.RenderSkipped && spec.previousState != nil {
			byPath[spec.RelativePath] = spec.previousState
		}
	}
	paths := make([]string, 0, len(byPath))
	for relPath := range byPath {
		paths = append(paths, relPath)
	}
	sort.Strings(paths)
	records := make([]*SpecStateRecord, 0, len(paths))
	for _, relPath := range paths {
		records = append(records, byPath[relPath])
	}
	return records
}

func aggregateCleanupTombstoneAfterSelection(record *SpecStateRecord, selection aggregateOutputSelection) *SpecStateRecord {
	if record == nil {
		return nil
	}
	copy := *record
	copy.ExternalRefs = append([]string(nil), record.ExternalRefs...)
	copy.MessageHrefs = cloneAggregateMessageHrefs(record.MessageHrefs)
	normalizeSpecStateOutputLocations(&copy)
	if selection.html {
		copy.HTMLCompletionHash = ""
		copy.HTMLOutputSubdir = ""
	}
	if selection.json {
		copy.JSONCompletionHash = ""
		copy.JSONOutputSubdir = ""
	}
	if selection.llm {
		copy.LLMCompletionHash = ""
		copy.LLMOutputSubdir = ""
	}
	copy.OutputSubdir = ""
	copy.UpdatedAt = time.Now().UTC()
	return &copy
}

func aggregateRecordHasOutputFamilyState(record *SpecStateRecord) bool {
	if record == nil {
		return false
	}
	return strings.TrimSpace(record.HTMLCompletionHash) != "" || strings.TrimSpace(record.JSONCompletionHash) != "" ||
		strings.TrimSpace(record.LLMCompletionHash) != "" || strings.TrimSpace(record.HTMLOutputSubdir) != "" ||
		strings.TrimSpace(record.JSONOutputSubdir) != "" || strings.TrimSpace(record.LLMOutputSubdir) != ""
}

func (ap *AggregatePrintingPress) reconcileCleanupTombstoneEntryArtifacts(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	ownership := aggregateActiveOutputOwnershipFromPlan(plan, selection)
	return ap.reconcileCleanupTombstoneEntryArtifactsWithOwnership(plan, selection, ownership)
}

func (ap *AggregatePrintingPress) reconcileCleanupTombstoneEntryArtifactsWithOwnership(plan *aggregateBuildPlan, selection aggregateOutputSelection, ownership aggregateActiveOutputOwnership) error {
	groups := make(map[string]aggregateOutputSelection)
	for _, record := range aggregateCleanupTombstones(plan) {
		locations := aggregateRecordOutputLocations(record)
		add := func(family, subdir string, update func(*aggregateOutputSelection)) {
			clean, ok := cleanAggregateEntryOutputSubdir(subdir)
			if !ok || len(ownership.owners(family, clean)) > 0 {
				return
			}
			group := groups[clean]
			update(&group)
			groups[clean] = group
		}
		if selection.html {
			add(aggregateOutputFamilyHTML, locations.html, func(group *aggregateOutputSelection) { group.html = true })
		}
		if selection.json {
			add(aggregateOutputFamilyJSON, locations.json, func(group *aggregateOutputSelection) { group.json = true })
		}
		if selection.llm {
			add(aggregateOutputFamilyLLM, locations.llm, func(group *aggregateOutputSelection) { group.llm = true })
		}
	}
	locations := make([]string, 0, len(groups))
	for subdir := range groups {
		locations = append(locations, subdir)
	}
	sort.Strings(locations)
	for _, subdir := range locations {
		entryOutput, ok := ap.aggregateEntryOutputPath(subdir)
		if !ok {
			continue
		}
		if _, err := os.Stat(entryOutput); err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return err
		}
		stagedOutput, err := stageAggregateEntryOutput(entryOutput, groups[subdir])
		if err != nil {
			return err
		}
		if err := prepareAggregateEntryOutputDir(stagedOutput, groups[subdir]); err != nil {
			_ = os.RemoveAll(stagedOutput)
			return err
		}
		if err := promoteAggregateEntryOutput(stagedOutput, entryOutput); err != nil {
			_ = os.RemoveAll(stagedOutput)
			return err
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) pruneObsoleteOutputs(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	if plan == nil {
		return nil
	}
	completed := aggregateCompletedPaths(plan)
	resultingReferences := make(map[string]struct{})
	for _, spec := range plan.discovered {
		if spec == nil || spec.RenderSkipped {
			continue
		}
		_, wasCompleted := completed[spec.RelativePath]
		aggregateResultingOutputLocations(spec, selection, wasCompleted).each(func(subdir string) {
			if clean, ok := cleanAggregateEntryOutputSubdir(subdir); ok {
				resultingReferences[clean] = struct{}{}
			}
		})
	}
	for _, record := range aggregateCleanupTombstones(plan) {
		tombstone := aggregateCleanupTombstoneAfterSelection(record, selection)
		aggregateRecordOutputLocations(tombstone).each(func(subdir string) {
			if clean, ok := cleanAggregateEntryOutputSubdir(subdir); ok {
				resultingReferences[clean] = struct{}{}
			}
		})
	}

	candidates := make(map[string]struct{})
	addCandidate := func(subdir string) {
		if clean, ok := cleanAggregateEntryOutputSubdir(subdir); ok {
			candidates[clean] = struct{}{}
		}
	}
	for _, record := range aggregateCleanupTombstones(plan) {
		aggregateRecordOutputLocations(record).each(addCandidate)
	}
	for _, spec := range plan.changed {
		if spec != nil {
			aggregateRecordOutputLocations(spec.previousState).each(addCandidate)
		}
	}

	ordered := make([]string, 0, len(candidates))
	for subdir := range candidates {
		if _, referenced := resultingReferences[subdir]; !referenced {
			ordered = append(ordered, subdir)
		}
	}
	sort.Strings(ordered)
	for _, subdir := range ordered {
		if err := ap.removeAggregateEntryOutputSubdir(subdir); err != nil {
			return err
		}
	}
	return nil
}

func stageAggregateEntryOutput(entryOutput string, selection aggregateOutputSelection) (string, error) {
	parent := filepath.Dir(entryOutput)
	if err := os.MkdirAll(parent, 0o755); err != nil {
		return "", err
	}
	staged, err := os.MkdirTemp(parent, "."+filepath.Base(entryOutput)+".ppress-stage-")
	if err != nil {
		return "", err
	}
	if err := copyAggregateEntryOutput(entryOutput, staged, selection); err != nil {
		_ = os.RemoveAll(staged)
		return "", err
	}
	return staged, nil
}

func copyAggregateEntryOutput(source, target string, selection aggregateOutputSelection) error {
	info, err := os.Stat(source)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}
	if !info.IsDir() {
		return fmt.Errorf("entry output is not a directory: %s", source)
	}
	return filepath.WalkDir(source, func(filePath string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		relPath, err := filepath.Rel(source, filePath)
		if err != nil || relPath == "." {
			return err
		}
		targetPath := filepath.Join(target, relPath)
		info, err := entry.Info()
		if err != nil {
			return err
		}
		if entry.IsDir() {
			if selection.html && relPath != "." {
				return nil
			}
			return os.MkdirAll(targetPath, info.Mode().Perm())
		}
		if selection.html && !aggregateEntryArtifactPreservedForSelection(relPath, selection) {
			return nil
		}
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return err
		}
		if entry.Type()&os.ModeSymlink != 0 {
			linkTarget, err := os.Readlink(filePath)
			if err != nil {
				return err
			}
			return os.Symlink(linkTarget, targetPath)
		}
		if !info.Mode().IsRegular() {
			return fmt.Errorf("unsupported entry output file type: %s", filePath)
		}
		input, err := os.Open(filePath)
		if err != nil {
			return err
		}
		defer input.Close()
		output, err := os.OpenFile(targetPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, info.Mode().Perm())
		if err != nil {
			_ = input.Close()
			return err
		}
		_, copyErr := io.Copy(output, input)
		inputCloseErr := input.Close()
		outputCloseErr := output.Close()
		return errors.Join(copyErr, inputCloseErr, outputCloseErr)
	})
}

func aggregateEntryArtifactPreservedForSelection(relPath string, selection aggregateOutputSelection) bool {
	extension := strings.ToLower(filepath.Ext(relPath))
	return !selection.json && extension == ".json" || !selection.llm && (extension == ".md" || extension == ".txt")
}

func promoteAggregateEntryOutput(stagedOutput, entryOutput string) error {
	parent := filepath.Dir(entryOutput)
	backup, err := os.MkdirTemp(parent, "."+filepath.Base(entryOutput)+".ppress-backup-")
	if err != nil {
		return err
	}
	if err := os.Remove(backup); err != nil {
		return err
	}
	hadExisting := false
	if _, err := os.Stat(entryOutput); err == nil {
		hadExisting = true
		if err := os.Rename(entryOutput, backup); err != nil {
			return err
		}
	} else if !os.IsNotExist(err) {
		return err
	}
	if err := os.Rename(stagedOutput, entryOutput); err != nil {
		if hadExisting {
			return errors.Join(err, os.Rename(backup, entryOutput))
		}
		return err
	}
	if hadExisting {
		if err := os.RemoveAll(backup); err != nil {
			return err
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) pruneObsoleteAggregateArtifacts(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	if plan == nil {
		return nil
	}
	current := aggregateTopologyFromDiscovered(plan.discovered)
	families := []struct {
		selected  bool
		name      string
		selection aggregateOutputSelection
	}{
		{selection.html, aggregateOutputFamilyHTML, aggregateOutputSelection{html: true}},
		{selection.json, aggregateOutputFamilyJSON, aggregateOutputSelection{json: true}},
		{selection.llm, aggregateOutputFamilyLLM, aggregateOutputSelection{llm: true}},
	}
	for _, family := range families {
		if !family.selected {
			continue
		}
		previous := aggregateTopologyFromState(plan.existing, family.name)
		if err := ap.pruneObsoleteAggregateFamily(previous, current, family.selection); err != nil {
			return err
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) pruneObsoleteAggregateFamily(previous, current map[string]map[string]struct{}, selection aggregateOutputSelection) error {
	serviceSlugs := make([]string, 0, len(previous))
	for serviceSlug := range previous {
		serviceSlugs = append(serviceSlugs, serviceSlug)
	}
	sort.Strings(serviceSlugs)
	for _, serviceSlug := range serviceSlugs {
		previousVersions := previous[serviceSlug]
		currentVersions, serviceStillVisible := current[serviceSlug]
		if !serviceStillVisible {
			if err := ap.removeAggregateServiceArtifacts(serviceSlug, previousVersions, selection); err != nil {
				return err
			}
			continue
		}
		versionSlugs := make([]string, 0, len(previousVersions))
		for versionSlug := range previousVersions {
			versionSlugs = append(versionSlugs, versionSlug)
		}
		sort.Strings(versionSlugs)
		for _, versionSlug := range versionSlugs {
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

func aggregateTopologyFromState(records map[string]*SpecStateRecord, family string) map[string]map[string]struct{} {
	topology := make(map[string]map[string]struct{})
	for _, record := range records {
		locations := aggregateRecordOutputLocations(record)
		var outputSubdir string
		switch family {
		case aggregateOutputFamilyHTML:
			outputSubdir = locations.html
		case aggregateOutputFamilyJSON:
			outputSubdir = locations.json
		case aggregateOutputFamilyLLM:
			outputSubdir = locations.llm
		}
		addAggregateTopologyLocation(topology, outputSubdir)
	}
	return topology
}

func aggregateTopologyFromDiscovered(discovered []*aggregateDiscoveredSpec) map[string]map[string]struct{} {
	topology := make(map[string]map[string]struct{})
	for _, spec := range discovered {
		if spec == nil || spec.RenderSkipped {
			continue
		}
		addAggregateTopologyLocation(topology, spec.OutputSubdir)
	}
	return topology
}

func addAggregateTopologyLocation(topology map[string]map[string]struct{}, outputSubdir string) {
	serviceSlug, versionSlug, ok := aggregateTopologyKeys(outputSubdir)
	if !ok {
		return
	}
	if _, ok := topology[serviceSlug]; !ok {
		topology[serviceSlug] = make(map[string]struct{})
	}
	topology[serviceSlug][versionSlug] = struct{}{}
}

func aggregateTopologyKeys(outputSubdir string) (string, string, bool) {
	clean, ok := cleanAggregateEntryOutputSubdir(outputSubdir)
	if !ok {
		return "", "", false
	}
	parts := strings.Split(clean, "/")
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
	return ap.removeAggregateDirIfEmpty(path.Join(versionRoot, pppaths.DirSpecs), versionRoot)
}

func (ap *AggregatePrintingPress) removeAggregateFile(relPath string) error {
	absPath, ok := ap.safeAggregateOutputPath(relPath)
	if !ok {
		return nil
	}
	err := os.Remove(absPath)
	if err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func (ap *AggregatePrintingPress) removeAggregateDirIfEmpty(relPaths ...string) error {
	for _, relPath := range relPaths {
		absPath, ok := ap.safeAggregateOutputPath(relPath)
		if !ok {
			continue
		}
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

func (ap *AggregatePrintingPress) safeAggregateOutputPath(relPath string) (string, bool) {
	if ap == nil || ap.config == nil || strings.TrimSpace(ap.config.OutputDir) == "" {
		return "", false
	}
	clean := path.Clean(strings.TrimSpace(filepath.ToSlash(relPath)))
	if clean == "." || clean == ".." || path.IsAbs(clean) || strings.HasPrefix(clean, "../") {
		return "", false
	}
	root := filepath.Clean(ap.config.OutputDir)
	target := filepath.Join(root, filepath.FromSlash(clean))
	rel, err := filepath.Rel(root, target)
	if err != nil || rel == "." || rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return "", false
	}
	return target, true
}

func (ap *AggregatePrintingPress) persistState(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	tombstones := aggregateCleanupTombstones(plan)
	records := make([]*SpecStateRecord, 0, len(plan.discovered)+len(tombstones))
	completed := make(map[string]struct{}, len(plan.changed))
	for _, spec := range plan.changed {
		if spec != nil {
			completed[spec.RelativePath] = struct{}{}
		}
	}
	for _, spec := range plan.discovered {
		if spec.RenderSkipped {
			continue
		}
		record := &SpecStateRecord{
			RelativePath:             spec.RelativePath,
			Hash:                     spec.Hash,
			ConfigHash:               spec.ConfigHash,
			MetadataConfigHash:       spec.MetadataConfigHash,
			MetadataVersion:          aggregateMetadataVersion,
			SpecKind:                 spec.SpecKind,
			Title:                    spec.Title,
			Summary:                  spec.Summary,
			ContactName:              catalogContactName(spec.Contact),
			ContactEmail:             catalogContactEmail(spec.Contact),
			ServiceIdentityCandidate: spec.ServiceIdentityCandidate,
			ExternalRefs:             append([]string(nil), spec.ExternalRefs...),
			MessageHrefs:             cloneAggregateMessageHrefs(spec.MessageHrefs),
			ServiceKey:               spec.ServiceKey,
			DisplayName:              spec.DisplayName,
			Version:                  spec.Version,
			Format:                   spec.Format,
			OutputSubdir:             spec.OutputSubdir,
			UpdatedAt:                time.Now().UTC(),
		}
		if previous := spec.previousState; previous != nil {
			record.HTMLCompletionHash = previous.HTMLCompletionHash
			record.JSONCompletionHash = previous.JSONCompletionHash
			record.LLMCompletionHash = previous.LLMCompletionHash
			locations := aggregateRecordOutputLocations(previous)
			record.HTMLOutputSubdir = locations.html
			record.JSONOutputSubdir = locations.json
			record.LLMOutputSubdir = locations.llm
		}
		if _, ok := completed[spec.RelativePath]; ok {
			if selection.html {
				record.HTMLCompletionHash = spec.HTMLCompletionHash
				record.HTMLOutputSubdir = spec.OutputSubdir
			}
			if selection.json {
				record.JSONCompletionHash = spec.JSONCompletionHash
				record.JSONOutputSubdir = spec.OutputSubdir
			}
			if selection.llm {
				record.LLMCompletionHash = spec.LLMCompletionHash
				record.LLMOutputSubdir = spec.OutputSubdir
			}
		}
		records = append(records, record)
	}
	deletePaths := make([]string, 0, len(tombstones))
	for _, previous := range tombstones {
		tombstone := aggregateCleanupTombstoneAfterSelection(previous, selection)
		if aggregateRecordHasOutputFamilyState(tombstone) {
			records = append(records, tombstone)
			continue
		}
		deletePaths = append(deletePaths, previous.RelativePath)
	}
	if err := ap.stateStore.Upsert(ap.config.StateNamespace, records); err != nil {
		return err
	}
	if len(deletePaths) == 0 {
		return nil
	}
	return ap.stateStore.Delete(ap.config.StateNamespace, deletePaths)
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
	contentStatePaths := make([]string, 0, len(catalog.ContentPages)+1)
	for _, page := range catalog.ContentPages {
		assetPaths, err := writeContentPageAssets(ap.config.OutputDir, page)
		if err != nil {
			return nil, err
		}
		written = append(written, assetPaths...)
		for _, asset := range page.Assets {
			if asset != nil {
				contentStatePaths = append(contentStatePaths, asset.Href)
			}
		}
	}
	rootPath := filepath.Join(ap.config.OutputDir, pppaths.FileIndexHTML)
	rootPage := ap.catalogPageData(pppaths.FileIndexHTML, catalog.Title, catalog.Description, nil, false, catalogRootContent(catalog, ap.config.DisableSkippedRendering))
	rootPage = withCatalogContentNav(rootPage, catalog, "catalog")
	if err := writeCatalogPage(rootPath, rootPage); err != nil {
		return nil, err
	}
	written = append(written, rootPath)

	if len(catalog.ContentPages) > 0 {
		guidesPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(pppaths.GuidesIndexHTML()))
		guidesPage := ap.catalogPageData(pppaths.GuidesIndexHTML(), "Guides", "", nil, false, render.ContentIndexTempl(catalog.ContentPages, render.GuidesIndexBreadcrumb(), ""))
		guidesPage = withCatalogContentNav(guidesPage, catalog, "guides")
		if err := writeCatalogPage(guidesPath, guidesPage); err != nil {
			return nil, err
		}
		written = append(written, guidesPath)
		contentStatePaths = append(contentStatePaths, pppaths.GuidesIndexHTML())
	}

	for _, contentPage := range catalog.ContentPages {
		if contentPage == nil {
			continue
		}
		contentPath := filepath.Join(ap.config.OutputDir, filepath.FromSlash(contentPage.Href))
		content := render.ContentPageTemplWithBreadcrumb(contentPage, "", catalogContentPageBreadcrumb(contentPage))
		page := ap.catalogPageData(contentPage.Href, fmt.Sprintf("%s - %s", contentPage.Title, catalog.Title), "", nil, false, content)
		page = withCatalogContentNav(page, catalog, "content/"+contentPage.Slug)
		if err := writeCatalogPage(contentPath, page); err != nil {
			return nil, err
		}
		written = append(written, contentPath)
		contentStatePaths = append(contentStatePaths, contentPage.Href)
	}

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
	if err := ap.removePreviousCatalogContentArtifacts(contentStatePaths); err != nil {
		return nil, err
	}
	if err := ap.writeCatalogContentState(contentStatePaths); err != nil {
		return nil, err
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

type catalogContentState struct {
	Paths []string `json:"paths"`
}

func (ap *AggregatePrintingPress) removePreviousCatalogContentArtifacts(currentPaths []string) error {
	paths, err := ap.readCatalogContentState()
	if err != nil {
		if ap != nil && ap.config != nil && ap.config.Logger != nil {
			ap.config.Logger.Warn("printingpress: unable to read previous catalog content state", "error", err)
		}
		return nil
	}
	current := make(map[string]struct{}, len(currentPaths))
	for _, relPath := range currentPaths {
		clean, ok := cleanCatalogContentStatePath(relPath)
		if ok {
			current[clean] = struct{}{}
		}
	}
	for _, relPath := range paths {
		clean, ok := cleanCatalogContentStatePath(relPath)
		if !ok {
			continue
		}
		if _, keep := current[clean]; keep {
			continue
		}
		err := os.Remove(filepath.Join(ap.config.OutputDir, filepath.FromSlash(clean)))
		if err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func (ap *AggregatePrintingPress) readCatalogContentState() ([]string, error) {
	statePath := filepath.Join(ap.config.OutputDir, pppaths.FileCatalogContentStateJSON)
	data, err := os.ReadFile(statePath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}
	var state catalogContentState
	if err := json.Unmarshal(data, &state); err != nil {
		return nil, err
	}
	return state.Paths, nil
}

func (ap *AggregatePrintingPress) writeCatalogContentState(paths []string) error {
	statePath := filepath.Join(ap.config.OutputDir, pppaths.FileCatalogContentStateJSON)
	if len(paths) == 0 {
		err := os.Remove(statePath)
		if err != nil && !os.IsNotExist(err) {
			return err
		}
		return nil
	}
	cleaned := make([]string, 0, len(paths))
	seen := make(map[string]struct{}, len(paths))
	for _, relPath := range paths {
		clean, ok := cleanCatalogContentStatePath(relPath)
		if !ok {
			continue
		}
		if _, exists := seen[clean]; exists {
			continue
		}
		seen[clean] = struct{}{}
		cleaned = append(cleaned, clean)
	}
	if len(cleaned) == 0 {
		return nil
	}
	sort.Strings(cleaned)
	data, err := json.Marshal(catalogContentState{Paths: cleaned})
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(statePath), 0o755); err != nil {
		return err
	}
	return os.WriteFile(statePath, data, 0o644)
}

func cleanCatalogContentStatePath(relPath string) (string, bool) {
	relPath = strings.TrimSpace(filepath.ToSlash(relPath))
	if relPath == "" || strings.Contains(relPath, "\x00") || strings.HasPrefix(relPath, "/") {
		return "", false
	}
	clean := path.Clean(relPath)
	if clean == "." || clean == ".." || strings.HasPrefix(clean, "../") {
		return "", false
	}
	if clean == pppaths.GuidesIndexHTML() || strings.HasPrefix(clean, path.Join(pppaths.DirAssets, "docs")+"/") {
		return clean, true
	}
	if strings.ToLower(path.Ext(clean)) == pppaths.ExtHTML {
		slugPath := strings.TrimSuffix(clean, pppaths.ExtHTML)
		if isReservedContentSlug(slugPath) {
			return "", false
		}
		return clean, true
	}
	return "", false
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
	RelPath        string
	HeaderTitle    string
	Title          string
	Subtitle       string
	Service        *ppmodel.CatalogService
	Content        templ.Component
	AssetBase      string
	ShowHeroTitle  bool
	Footer         *ppmodel.FooterConfig
	ShowCatalogNav bool
	CatalogPages   []*ppmodel.ContentPage
	ActiveNavSlug  string
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

func withCatalogContentNav(page catalogPageData, catalog *ppmodel.CatalogSite, activeSlug string) catalogPageData {
	if catalog == nil {
		return page
	}
	page.ShowCatalogNav = hasContentPagesForNav(catalog.ContentPages)
	page.CatalogPages = catalog.ContentPages
	page.ActiveNavSlug = activeSlug
	return page
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
		showNav := catalogPageHasNav(page)
		if _, err := io.WriteString(w, `<!doctype html><html lang="en" class="sl-theme-dark">`); err != nil {
			return err
		}
		if err := writeCatalogHead(w, page.Title, page.AssetBase); err != nil {
			return err
		}
		if showNav {
			return renderCatalogNavShell(ctx, w, page)
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
		if _, err := io.WriteString(w, `<div class="pp-layout-fallback-header" aria-hidden="true"><span class="pp-layout-fallback-caret">$</span><span class="pp-layout-fallback-name">`+templ.EscapeString(page.HeaderTitle)+`</span></div>`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<main class="pp-catalog-shell">`); err != nil {
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
		if _, err := io.WriteString(w, `</main>`); err != nil {
			return err
		}
		_, err := io.WriteString(w, catalogVersionSelectScriptHTML()+`</body></html>`)
		return err
	})
}

func renderCatalogNavShell(ctx context.Context, w io.Writer, page catalogPageData) error {
	if _, err := io.WriteString(w, `<body class="pp-catalog-body"`); err != nil {
		return err
	}
	if strings.TrimSpace(page.AssetBase) != "" {
		if err := writeCatalogOptionalAttr(w, "data-pp-base-url", page.AssetBase); err != nil {
			return err
		}
	}
	if _, err := io.WriteString(w, `><pp-layout data-title="`+templ.EscapeString(page.HeaderTitle)+`">`); err != nil {
		return err
	}
	if _, err := io.WriteString(w, `<div class="pp-layout-fallback-header" aria-hidden="true"><span class="pp-layout-fallback-caret">$</span><span class="pp-layout-fallback-name">`+templ.EscapeString(page.HeaderTitle)+`</span></div>`); err != nil {
		return err
	}
	if _, err := io.WriteString(w, `<pp-nav id="pp-nav" slot="nav" data-active="`+templ.EscapeString(page.ActiveNavSlug)+`" data-pp-preview-hold="true">`+catalogNavHTML(page)+`</pp-nav>`); err != nil {
		return err
	}
	if _, err := io.WriteString(w, `<main slot="content" class="pp-catalog-shell">`); err != nil {
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
	_, err := io.WriteString(w, `</main></pp-layout>`+catalogVersionSelectScriptHTML()+`</body></html>`)
	return err
}

func catalogVersionSelectScriptHTML() string {
	return `<script>
			document.addEventListener('sl-select', function(event) {
				const menu = event.target && event.target.closest ? event.target.closest('sl-menu[data-catalog-version-menu]') : null;
				if (!menu) return;
				const item = event.detail && event.detail.item;
				const value = item && item.value;
				if (value) window.location.href = value;
			});
		</script>`
}

func writeCatalogOptionalAttr(w io.Writer, key, value string) error {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	_, err := io.WriteString(w, ` `+key+`="`+templ.EscapeString(value)+`"`)
	return err
}

func catalogPageHasNav(page catalogPageData) bool {
	return page.ShowCatalogNav && hasContentPagesForNav(page.CatalogPages)
}

func catalogNavHTML(page catalogPageData) string {
	if !catalogPageHasNav(page) {
		return ""
	}
	fromDir := path.Dir(page.RelPath)
	var builder strings.Builder
	builder.WriteString(`<div class="pp-nav-preview">`)
	builder.WriteString(catalogNavHomeHTML("API Catalog", relativeCatalogHref(fromDir, pppaths.FileIndexHTML), page.ActiveNavSlug == "catalog"))
	builder.WriteString(`<div class="nav-section nav-pages-section"><h4>Guides</h4><ul class="nav-pages-list">`)
	for _, contentPage := range contentPagesForNav(page.CatalogPages) {
		active := page.ActiveNavSlug == "content/"+contentPage.Slug
		builder.WriteString(`<li>`)
		builder.WriteString(catalogNavPageLinkHTML(catalogContentPageNavLabel(contentPage), relativeCatalogHref(fromDir, contentPage.Href), active))
		builder.WriteString(`</li>`)
	}
	builder.WriteString(`</ul></div></div>`)
	return builder.String()
}

func catalogNavHomeHTML(label, href string, active bool) string {
	classAttr := "nav-home"
	if active {
		classAttr += " active"
	}
	var builder strings.Builder
	builder.WriteString(`<a class="`)
	builder.WriteString(templ.EscapeString(classAttr))
	builder.WriteString(`" href="`)
	builder.WriteString(templ.EscapeString(href))
	builder.WriteString(`"`)
	if active {
		builder.WriteString(` aria-current="page"`)
	}
	builder.WriteString(`><span class="nav-home-chevron" aria-hidden="true"></span>`)
	builder.WriteString(templ.EscapeString(label))
	builder.WriteString(`</a>`)
	return builder.String()
}

func catalogNavPageLinkHTML(label, href string, active bool) string {
	classAttr := "nav-page-link"
	if active {
		classAttr += " active"
	}
	var builder strings.Builder
	builder.WriteString(`<a class="`)
	builder.WriteString(templ.EscapeString(classAttr))
	builder.WriteString(`" href="`)
	builder.WriteString(templ.EscapeString(href))
	builder.WriteString(`"`)
	if active {
		builder.WriteString(` aria-current="page"`)
	}
	builder.WriteString(`><span class="nav-page-chevron" aria-hidden="true"></span><span>`)
	builder.WriteString(templ.EscapeString(label))
	builder.WriteString(`</span></a>`)
	return builder.String()
}

func catalogContentPageBreadcrumb(page *ppmodel.ContentPage) []render.BreadcrumbItem {
	fromDir := "."
	if page != nil {
		fromDir = path.Dir(page.Href)
	}
	return []render.BreadcrumbItem{
		{Label: "HOME", Href: relativeCatalogHref(fromDir, pppaths.FileIndexHTML)},
		{Label: "GUIDES", Href: relativeCatalogHref(fromDir, pppaths.GuidesIndexHTML())},
		{Label: catalogContentPageBreadcrumbLabel(page)},
	}
}

func catalogContentPageBreadcrumbLabel(page *ppmodel.ContentPage) string {
	return strings.ToUpper(catalogContentPageNavLabel(page))
}

func catalogContentPageNavLabel(page *ppmodel.ContentPage) string {
	if page == nil {
		return "Untitled"
	}
	if strings.TrimSpace(page.Label) != "" {
		return strings.TrimSpace(page.Label)
	}
	if strings.TrimSpace(page.Title) != "" {
		return strings.TrimSpace(page.Title)
	}
	if strings.TrimSpace(page.Slug) != "" {
		return strings.ReplaceAll(path.Base(strings.Trim(page.Slug, "/")), "-", " ")
	}
	return "Untitled"
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
			if _, err := io.WriteString(w, catalogDiagnosticsHTML(service.Counts, catalogServiceDiagnosticsHref(".", service))); err != nil {
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

func servicePrimaryHref(service *ppmodel.CatalogService) string {
	if entry := catalogDefaultContractLatestEntry(service); entry != nil && strings.TrimSpace(entry.OverviewHref) != "" {
		return entry.OverviewHref
	}
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
		fromDir := path.Dir(version.OverviewHref)
		if _, err := io.WriteString(w, `<section class="pp-catalog-section"><article class="pp-catalog-card pp-model-card"><h2 class="pp-catalog-card-title"><a href="`+templ.EscapeString(relativeCatalogHref(fromDir, catalogVersionPrimaryHref(version)))+`">`+templ.EscapeString(version.Label)+`</a></h2>`+
			catalogSummaryHTML(version.Summary)+
			catalogDiagnosticsHTML(version.Counts, catalogVersionDiagnosticsHref(fromDir, version))+
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
		if catalogVersionHasCollision(service, version) {
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
			if _, err := io.WriteString(w, catalogSpecKindBadgeHTML(entry)); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogSummaryHTML(entry.Summary)); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogContactHTML(entry.Contact)); err != nil {
				return err
			}
			if _, err := io.WriteString(w, catalogDiagnosticsHTML(entry.Counts, catalogEntryDiagnosticsHref(path.Dir(version.OverviewHref), entry))); err != nil {
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
	if entry := catalogDefaultContractLatestEntry(service); entry != nil {
		return entry.Summary
	}
	if latest := catalogVisibleLatestVersion(service); latest != nil && strings.TrimSpace(latest.Summary) != "" {
		return latest.Summary
	}
	return service.Summary
}

func catalogServiceContact(service *ppmodel.CatalogService) *ppmodel.ContactInfo {
	if entry := catalogDefaultContractLatestEntry(service); entry != nil {
		return entry.Contact
	}
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

func catalogDefaultContractLatestEntry(service *ppmodel.CatalogService) *ppmodel.CatalogSpecEntry {
	if service == nil {
		return nil
	}
	for _, contract := range service.Contracts {
		if contract == nil || contract.ID != service.DefaultContractID {
			continue
		}
		for _, version := range contract.Versions {
			if version == nil || version.Entry == nil || version.Entry.RenderSkipped {
				continue
			}
			return version.Entry
		}
	}
	return nil
}

func catalogVersionHasCollision(service *ppmodel.CatalogService, version *ppmodel.CatalogVersion) bool {
	if service == nil || version == nil {
		return false
	}
	context := service.Key + ":" + version.Label
	for _, collision := range service.CollisionGroups {
		if collision == context {
			return true
		}
	}
	return false
}

func visibleCatalogServiceEntries(service *ppmodel.CatalogService) []*ppmodel.CatalogSpecEntry {
	if service == nil {
		return nil
	}
	var entries []*ppmodel.CatalogSpecEntry
	for _, version := range visibleCatalogVersions(service) {
		entries = append(entries, visibleCatalogEntries(version)...)
	}
	return entries
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

func catalogSpecKindBadgeHTML(entry *ppmodel.CatalogSpecEntry) string {
	label := catalogEntrySpecKindLabel(entry)
	if label == "" {
		return ""
	}
	return `<p class="pp-catalog-spec-kind"><span class="pp-catalog-spec-kind-badge" data-spec-kind="` +
		templ.EscapeString(entry.SpecKind.MachineValue()) + `">` + templ.EscapeString(label) + `</span></p>`
}

func catalogEntrySpecKindLabel(entry *ppmodel.CatalogSpecEntry) string {
	if entry == nil {
		return ""
	}
	if strings.TrimSpace(entry.SpecKindLabel) != "" {
		return strings.TrimSpace(entry.SpecKindLabel)
	}
	return entry.SpecKind.DisplayLabel()
}

func catalogServiceDiagnosticsHref(fromDir string, service *ppmodel.CatalogService) string {
	entries := visibleCatalogServiceEntries(service)
	if len(entries) != 1 {
		return ""
	}
	return catalogEntryDiagnosticsHref(fromDir, entries[0])
}

func catalogVersionDiagnosticsHref(fromDir string, version *ppmodel.CatalogVersion) string {
	entries := visibleCatalogEntries(version)
	if len(entries) != 1 {
		return ""
	}
	return catalogEntryDiagnosticsHref(fromDir, entries[0])
}

func catalogEntryDiagnosticsHref(fromDir string, entry *ppmodel.CatalogSpecEntry) string {
	if entry == nil || strings.TrimSpace(entry.OverviewHref) == "" {
		return ""
	}
	diagnosticsPath := path.Join(path.Dir(entry.OverviewHref), pppaths.FileDiagnosticsHTML)
	return relativeCatalogHref(fromDir, diagnosticsPath)
}

func catalogDiagnosticsHTML(counts *ppmodel.ViolationCounts, href string) string {
	if counts == nil || counts.Total() == 0 {
		return ""
	}
	var builder strings.Builder
	tag := "div"
	if strings.TrimSpace(href) != "" {
		tag = "a"
	}
	builder.WriteString(`<`)
	builder.WriteString(tag)
	builder.WriteString(` class="pp-catalog-diagnostics"`)
	if tag == "a" {
		builder.WriteString(` href="`)
		builder.WriteString(templ.EscapeString(href))
		builder.WriteString(`"`)
	}
	builder.WriteString(` aria-label="`)
	builder.WriteString(templ.EscapeString(catalogDiagnosticsLabel(counts)))
	builder.WriteString(`">`)
	builder.WriteString(`<span class="pp-catalog-diagnostics-title">Diagnostics</span>`)
	builder.WriteString(catalogDiagnosticCountHTML("err", "exclamation-square", counts.Errors, "error", "errors"))
	builder.WriteString(catalogDiagnosticCountHTML("warn", "exclamation-triangle", counts.Warns, "warning", "warnings"))
	builder.WriteString(catalogDiagnosticCountHTML("info", "info-square", counts.Infos, "info", "infos"))
	builder.WriteString(`</`)
	builder.WriteString(tag)
	builder.WriteString(`>`)
	return builder.String()
}

func catalogDiagnosticCountHTML(className, icon string, count int, singular, plural string) string {
	if count <= 0 {
		return ""
	}
	noun := plural
	if count == 1 {
		noun = singular
	}
	var builder strings.Builder
	builder.WriteString(`<span class="pp-catalog-diagnostic-count `)
	builder.WriteString(templ.EscapeString(className))
	builder.WriteString(`"><sl-icon name="`)
	builder.WriteString(templ.EscapeString(icon))
	builder.WriteString(`" aria-hidden="true"></sl-icon><span class="pp-catalog-diagnostic-number">`)
	builder.WriteString(templ.EscapeString(fmt.Sprintf("%d", count)))
	builder.WriteString(`</span><span class="pp-catalog-sr-only"> `)
	builder.WriteString(templ.EscapeString(noun))
	builder.WriteString(`</span></span>`)
	return builder.String()
}

func catalogDiagnosticsLabel(counts *ppmodel.ViolationCounts) string {
	if counts == nil || counts.Total() == 0 {
		return "Diagnostics"
	}
	parts := make([]string, 0, 3)
	appendPart := func(count int, singular, plural string) {
		if count <= 0 {
			return
		}
		noun := plural
		if count == 1 {
			noun = singular
		}
		parts = append(parts, fmt.Sprintf("%d %s", count, noun))
	}
	appendPart(counts.Errors, "error", "errors")
	appendPart(counts.Warns, "warning", "warnings")
	appendPart(counts.Infos, "info", "infos")
	return "Diagnostics: " + strings.Join(parts, ", ")
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
		builder.WriteString(`<dt>Contact:</dt><dd>`)
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
				if label := catalogEntrySpecKindLabel(entry); label != "" {
					builder.WriteString(" — ")
					builder.WriteString(label)
				}
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
					if label := catalogEntrySpecKindLabel(entry); label != "" {
						builder.WriteString(" — ")
						builder.WriteString(label)
					}
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
			if label := catalogEntrySpecKindLabel(entry); label != "" {
				builder.WriteString(" — ")
				builder.WriteString(label)
			}
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
		if label := catalogEntrySpecKindLabel(entry); label != "" {
			builder.WriteString(" — ")
			builder.WriteString(label)
		}
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
	"data-pp-overview-label",
	"data-pp-service-name",
	"data-pp-current-version",
	"data-pp-versions-href",
	"data-pp-versions",
	"data-pp-contracts",
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
	values["data-pp-overview-label"] = header.OverviewLabel
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
	if len(header.ContractGroups) > 0 {
		encoded, err := json.Marshal(header.ContractGroups)
		if err != nil {
			return nil, err
		}
		values["data-pp-contracts"] = string(encoded)
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
