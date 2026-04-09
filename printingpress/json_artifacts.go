// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"sort"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	jsonBundleFormat   = "printingpress.bundle"
	jsonManifestFormat = "printingpress.artifacts"
)

// JSONBundle is the top-level public JSON entrypoint written by PrintJSONArtifacts.
type JSONBundle struct {
	Format         string                                  `json:"format"`
	Root           *JSONRootPage                           `json:"root,omitempty"`
	Source         *ppmodel.SourceRef                      `json:"source,omitempty"`
	Nav            []*ppmodel.NavTag                       `json:"nav,omitempty"`
	ModelGroups    []*ppmodel.NavModelGroup                `json:"modelGroups,omitempty"`
	SchemaRegistry map[string]*ppmodel.SchemaRegistryEntry `json:"schemaRegistry,omitempty"`
	Operations     []JSONArtifactEntry                     `json:"operations,omitempty"`
	Models         map[string][]JSONArtifactEntry          `json:"models,omitempty"`
	Webhooks       []JSONArtifactEntry                     `json:"webhooks,omitempty"`
	Warnings       []JSONBuildWarning                      `json:"warnings,omitempty"`
	SpecFormat     string                                  `json:"specFormat,omitempty"`
	Lite           bool                                    `json:"lite,omitempty"`
}

// JSONRootPage is the root page content embedded in bundle.json.
type JSONRootPage struct {
	Title              string                              `json:"title,omitempty"`
	Description        string                              `json:"description,omitempty"`
	DescHTML           string                              `json:"descHtml,omitempty"`
	Version            string                              `json:"version,omitempty"`
	Contact            *JSONContactInfo                    `json:"contact,omitempty"`
	License            *JSONLicenseInfo                    `json:"license,omitempty"`
	Servers            []*JSONServerInfo                   `json:"servers,omitempty"`
	Security           []*ppmodel.SecurityRequirement      `json:"security,omitempty"`
	SecurityGroups     []*ppmodel.SecurityRequirementGroup `json:"securityGroups,omitempty"`
	ExternalDoc        *JSONExternalDocInfo                `json:"externalDoc,omitempty"`
	TagTree            []*ppmodel.NavTag                   `json:"tagTree,omitempty"`
	UntaggedOperations []*ppmodel.NavOperation             `json:"untaggedOperations,omitempty"`
	Webhooks           []*ppmodel.NavOperation             `json:"webhooks,omitempty"`
	Warnings           []JSONBuildWarning                  `json:"warnings,omitempty"`
	Source             *ppmodel.SourceRef                  `json:"source,omitempty"`
}

// JSONContactInfo is the bundle-facing contact shape.
type JSONContactInfo struct {
	Name  string `json:"name,omitempty"`
	URL   string `json:"url,omitempty"`
	Email string `json:"email,omitempty"`
}

// JSONLicenseInfo is the bundle-facing license shape.
type JSONLicenseInfo struct {
	Name string `json:"name,omitempty"`
	URL  string `json:"url,omitempty"`
}

// JSONServerInfo is the bundle-facing server shape.
type JSONServerInfo struct {
	URL         string                    `json:"url,omitempty"`
	Description string                    `json:"description,omitempty"`
	Variables   []*JSONServerVariableInfo `json:"variables,omitempty"`
}

// JSONServerVariableInfo is the bundle-facing server variable shape.
type JSONServerVariableInfo struct {
	Name        string   `json:"name,omitempty"`
	Default     string   `json:"default,omitempty"`
	Enum        []string `json:"enum,omitempty"`
	Description string   `json:"description,omitempty"`
}

// JSONExternalDocInfo is the bundle-facing external documentation shape.
type JSONExternalDocInfo struct {
	URL         string `json:"url,omitempty"`
	Description string `json:"description,omitempty"`
}

// JSONBuildWarning is the serialized warning shape used by bundle.json.
type JSONBuildWarning struct {
	Message string `json:"message"`
	Context string `json:"context,omitempty"`
	Error   string `json:"error,omitempty"`
}

// ArtifactManifest lists every JSON artifact written by PrintJSONArtifacts.
type ArtifactManifest struct {
	Format    string              `json:"format"`
	Artifacts []JSONArtifactEntry `json:"artifacts"`
}

// SiteManifest is kept as a compatibility alias for ArtifactManifest.
type SiteManifest = ArtifactManifest

// JSONArtifactEntry describes a single emitted JSON artifact.
type JSONArtifactEntry struct {
	Kind     string `json:"kind"`
	Path     string `json:"path"`
	Name     string `json:"name,omitempty"`
	Slug     string `json:"slug,omitempty"`
	TypeSlug string `json:"typeSlug,omitempty"`
}

// ManifestEntry is kept as a compatibility alias for JSONArtifactEntry.
type ManifestEntry = JSONArtifactEntry

func buildJSONBundle(site *ppmodel.Site) *JSONBundle {
	if site == nil {
		return &JSONBundle{Format: jsonBundleFormat}
	}

	bundle := &JSONBundle{
		Format:         jsonBundleFormat,
		Root:           buildJSONRootPage(site.Root),
		Source:         site.Source,
		Nav:            site.NavTags,
		ModelGroups:    site.NavModelGroups,
		SchemaRegistry: site.SchemaRegistry,
		Operations:     buildOperationArtifactEntries(site.Operations, "operation"),
		Models:         buildModelArtifactEntries(site.Models),
		Webhooks:       buildOperationArtifactEntries(site.Webhooks, "webhook"),
		Warnings:       buildJSONWarnings(site.Warnings),
		SpecFormat:     site.SpecFormat,
		Lite:           site.Lite,
	}
	return bundle
}

func buildJSONRootPage(root *ppmodel.RootPage) *JSONRootPage {
	if root == nil {
		return nil
	}

	return &JSONRootPage{
		Title:              root.Title,
		Description:        root.Description,
		DescHTML:           root.DescHTML,
		Version:            root.Version,
		Contact:            buildJSONContactInfo(root.Contact),
		License:            buildJSONLicenseInfo(root.License),
		Servers:            buildJSONServers(root.Servers),
		Security:           root.Security,
		SecurityGroups:     root.SecurityGroups,
		ExternalDoc:        buildJSONExternalDocInfo(root.ExternalDoc),
		TagTree:            root.TagTree,
		UntaggedOperations: root.UntaggedOperations,
		Webhooks:           root.Webhooks,
		Warnings:           buildJSONWarnings(root.Warnings),
		Source:             root.Source,
	}
}

func buildJSONContactInfo(contact *ppmodel.ContactInfo) *JSONContactInfo {
	if contact == nil {
		return nil
	}
	return &JSONContactInfo{
		Name:  contact.Name,
		URL:   contact.URL,
		Email: contact.Email,
	}
}

func buildJSONLicenseInfo(license *ppmodel.LicenseInfo) *JSONLicenseInfo {
	if license == nil {
		return nil
	}
	return &JSONLicenseInfo{
		Name: license.Name,
		URL:  license.URL,
	}
}

func buildJSONServers(servers []*ppmodel.ServerInfo) []*JSONServerInfo {
	if len(servers) == 0 {
		return nil
	}
	result := make([]*JSONServerInfo, 0, len(servers))
	for _, server := range servers {
		if server == nil {
			continue
		}
		result = append(result, &JSONServerInfo{
			URL:         server.URL,
			Description: server.Description,
			Variables:   buildJSONServerVariables(server.Variables),
		})
	}
	return result
}

func buildJSONServerVariables(variables []*ppmodel.ServerVariableInfo) []*JSONServerVariableInfo {
	if len(variables) == 0 {
		return nil
	}
	result := make([]*JSONServerVariableInfo, 0, len(variables))
	for _, variable := range variables {
		if variable == nil {
			continue
		}
		result = append(result, &JSONServerVariableInfo{
			Name:        variable.Name,
			Default:     variable.Default,
			Enum:        append([]string(nil), variable.Enum...),
			Description: variable.Description,
		})
	}
	return result
}

func buildJSONExternalDocInfo(doc *ppmodel.ExternalDocInfo) *JSONExternalDocInfo {
	if doc == nil {
		return nil
	}
	return &JSONExternalDocInfo{
		URL:         doc.URL,
		Description: doc.Description,
	}
}

func buildJSONWarnings(warnings []*ppmodel.BuildWarning) []JSONBuildWarning {
	if len(warnings) == 0 {
		return nil
	}
	result := make([]JSONBuildWarning, 0, len(warnings))
	for _, warning := range warnings {
		if warning == nil {
			continue
		}
		entry := JSONBuildWarning{
			Message: warning.Message,
			Context: warning.Context,
		}
		if warning.Err != nil {
			entry.Error = warning.Err.Error()
		}
		result = append(result, entry)
	}
	return result
}

func buildOperationArtifactEntries(operations []*ppmodel.OperationPage, kind string) []JSONArtifactEntry {
	if len(operations) == 0 {
		return nil
	}
	result := make([]JSONArtifactEntry, 0, len(operations))
	for _, operation := range operations {
		if operation == nil {
			continue
		}
		result = append(result, JSONArtifactEntry{
			Kind: kind,
			Path: "operations/" + operation.Slug + ".json",
			Name: operation.Method + " " + operation.Path,
			Slug: operation.Slug,
		})
	}
	return result
}

func buildModelArtifactEntries(models map[string][]*ppmodel.ModelPage) map[string][]JSONArtifactEntry {
	if len(models) == 0 {
		return nil
	}

	typeSlugs := make([]string, 0, len(models))
	for typeSlug := range models {
		typeSlugs = append(typeSlugs, typeSlug)
	}
	sort.Strings(typeSlugs)

	result := make(map[string][]JSONArtifactEntry, len(typeSlugs))
	for _, typeSlug := range typeSlugs {
		pages := models[typeSlug]
		entries := make([]JSONArtifactEntry, 0, len(pages))
		for _, page := range pages {
			if page == nil {
				continue
			}
			entries = append(entries, JSONArtifactEntry{
				Kind:     "model",
				Path:     "models/" + typeSlug + "/" + page.Slug + ".json",
				Name:     page.Name,
				Slug:     page.Slug,
				TypeSlug: typeSlug,
			})
		}
		result[typeSlug] = entries
	}
	return result
}

func buildArtifactManifest(site *ppmodel.Site) *ArtifactManifest {
	artifacts := []JSONArtifactEntry{
		{Kind: "bundle", Path: "bundle.json", Name: "JSON bundle"},
	}
	if site != nil && site.Root != nil {
		artifacts = append(artifacts, JSONArtifactEntry{Kind: "root", Path: "index.json", Name: "Root page"})
	}
	if site != nil && site.NavTags != nil {
		artifacts = append(artifacts, JSONArtifactEntry{Kind: "nav", Path: "nav.json", Name: "Navigation"})
	}
	artifacts = append(artifacts, JSONArtifactEntry{Kind: "manifest", Path: "manifest.json", Name: "JSON artifact manifest"})
	artifacts = append(artifacts, buildOperationArtifactEntries(site.Operations, "operation")...)
	artifacts = append(artifacts, buildOperationArtifactEntries(site.Webhooks, "webhook")...)

	models := buildModelArtifactEntries(site.Models)
	typeSlugs := make([]string, 0, len(models))
	for typeSlug := range models {
		typeSlugs = append(typeSlugs, typeSlug)
	}
	sort.Strings(typeSlugs)
	for _, typeSlug := range typeSlugs {
		artifacts = append(artifacts, models[typeSlug]...)
	}

	return &ArtifactManifest{
		Format:    jsonManifestFormat,
		Artifacts: artifacts,
	}
}
