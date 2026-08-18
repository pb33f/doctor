// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

// ContractRole identifies a specification's role within a service catalog.
type ContractRole string

// ContractRoleValue is the public catalog value for a logical contract role.
type ContractRoleValue = ContractRole

const (
	ContractRoleHTTPAPI         ContractRole = "http-api"
	ContractRolePublishedEvents ContractRole = "published-events"
	ContractRoleConsumedEvents  ContractRole = "consumed-events"
	ContractRoleExternalSource  ContractRole = "external-source"
	ContractRoleEvents          ContractRole = "events"
)

func (r ContractRole) MachineValue() string {
	return string(r)
}

func (r ContractRole) IsKnown() bool {
	switch r {
	case ContractRoleHTTPAPI, ContractRolePublishedEvents, ContractRoleConsumedEvents, ContractRoleExternalSource, ContractRoleEvents:
		return true
	default:
		return false
	}
}

func (r ContractRole) DisplayLabel() string {
	switch r {
	case ContractRoleHTTPAPI:
		return "HTTP API"
	case ContractRolePublishedEvents:
		return "Published Events"
	case ContractRoleConsumedEvents:
		return "Consumed Events"
	case ContractRoleExternalSource:
		return "External Sources"
	default:
		return "Events"
	}
}

// SiteHeaderContext configures optional aggregate header controls for a rendered site.
type SiteHeaderContext struct {
	CatalogHref    string                      `json:"catalogHref,omitempty"`
	OverviewHref   string                      `json:"overviewHref,omitempty"`
	OverviewLabel  string                      `json:"overviewLabel,omitempty"`
	ServiceName    string                      `json:"serviceName,omitempty"`
	CurrentVersion string                      `json:"currentVersion,omitempty"`
	VersionsHref   string                      `json:"versionsHref,omitempty"`
	Versions       []*SiteVersionLink          `json:"versions,omitempty"`
	ContractGroups []*SiteContractGroup        `json:"contractGroups,omitempty"`
	Relationships  []*SiteContractRelationship `json:"relationships,omitempty"`
}

// SiteContractGroup groups contract links by their role in page navigation.
type SiteContractGroup struct {
	Role      ContractRoleValue   `json:"role"`
	Label     string              `json:"label"`
	Contracts []*SiteContractLink `json:"contracts"`
}

// SiteContractLink describes one logical contract in page navigation.
type SiteContractLink struct {
	ID             string             `json:"id"`
	Label          string             `json:"label"`
	SpecKind       SpecKindValue      `json:"specKind"`
	Href           string             `json:"href"`
	Active         bool               `json:"active,omitempty"`
	CurrentVersion string             `json:"currentVersion,omitempty"`
	Versions       []*SiteVersionLink `json:"versions,omitempty"`
}

// SiteContractRelationship describes a contract relationship rendered in an entry site.
type SiteContractRelationship struct {
	Relation string        `json:"relation"`
	Label    string        `json:"label"`
	Href     string        `json:"href"`
	SpecKind SpecKindValue `json:"specKind,omitempty"`
}

// SiteVersionLink describes one available version in the header switcher.
type SiteVersionLink struct {
	Label  string `json:"label"`
	Href   string `json:"href"`
	Active bool   `json:"active,omitempty"`
}

// CatalogSite is the aggregate multi-spec documentation catalog.
type CatalogSite struct {
	Title        string            `json:"title,omitempty"`
	Description  string            `json:"description,omitempty"`
	ScanRoot     string            `json:"scanRoot,omitempty"`
	OutputDir    string            `json:"-"`
	BaseURL      string            `json:"-"`
	AssetMode    string            `json:"-"`
	Services     []*CatalogService `json:"services,omitempty"`
	ContentPages []*ContentPage    `json:"contentPages,omitempty"`
	Warnings     []*BuildWarning   `json:"warnings,omitempty"`
}

// CatalogService represents one grouped service in the aggregate catalog.
type CatalogService struct {
	Key               string             `json:"key"`
	Slug              string             `json:"slug"`
	DisplayName       string             `json:"displayName"`
	Summary           string             `json:"summary,omitempty"`
	PrimaryPath       string             `json:"primaryPath,omitempty"`
	SpecCount         int                `json:"specCount"`
	OverviewHref      string             `json:"overviewHref,omitempty"`
	VersionsHref      string             `json:"versionsHref,omitempty"`
	LatestVersion     *CatalogVersion    `json:"latestVersion,omitempty"`
	Versions          []*CatalogVersion  `json:"versions,omitempty"`
	Counts            *ViolationCounts   `json:"counts,omitempty"`
	IdentityKey       string             `json:"identityKey,omitempty"`
	DefaultContractID string             `json:"defaultContractId,omitempty"`
	Contracts         []*CatalogContract `json:"contracts,omitempty"`
}

// CatalogContract groups the independent versions of one logical service contract.
type CatalogContract struct {
	ID            string                    `json:"id"`
	DisplayName   string                    `json:"displayName"`
	SpecKind      SpecKindValue             `json:"specKind"`
	Role          ContractRoleValue         `json:"role"`
	Default       bool                      `json:"default,omitempty"`
	LatestVersion *CatalogContractVersion   `json:"latestVersion,omitempty"`
	Versions      []*CatalogContractVersion `json:"versions,omitempty"`
}

// CatalogContractVersion represents one discovered specification root.
type CatalogContractVersion struct {
	Label         string                         `json:"label"`
	Slug          string                         `json:"slug"`
	OverviewHref  string                         `json:"overviewHref"`
	Entry         *CatalogSpecEntry              `json:"entry,omitempty"`
	Relationships []*CatalogContractRelationship `json:"relationships,omitempty"`
}

// CatalogContractRelationship is the structural catalog representation of a related contract.
type CatalogContractRelationship struct {
	Relation string        `json:"relation"`
	Label    string        `json:"label"`
	Href     string        `json:"href"`
	SpecKind SpecKindValue `json:"specKind,omitempty"`
}

// CatalogVersion groups one or more spec entries under the same service version.
type CatalogVersion struct {
	Label        string              `json:"label"`
	Slug         string              `json:"slug"`
	Summary      string              `json:"summary,omitempty"`
	OverviewHref string              `json:"overviewHref,omitempty"`
	SpecCount    int                 `json:"specCount"`
	IsLatest     bool                `json:"isLatest,omitempty"`
	Entries      []*CatalogSpecEntry `json:"entries,omitempty"`
	Counts       *ViolationCounts    `json:"counts,omitempty"`
}

// CatalogSpecEntry is one discovered root specification rendered within the catalog.
type CatalogSpecEntry struct {
	ID            string             `json:"id"`
	Slug          string             `json:"slug"`
	SpecKind      SpecKindValue      `json:"specKind,omitempty"`
	SpecKindLabel string             `json:"specKindLabel,omitempty"`
	Title         string             `json:"title,omitempty"`
	Summary       string             `json:"summary,omitempty"`
	Contact       *ContactInfo       `json:"contact,omitempty"`
	ServiceKey    string             `json:"serviceKey,omitempty"`
	ServiceSlug   string             `json:"serviceSlug,omitempty"`
	ContractID    string             `json:"contractId,omitempty"`
	ContractRole  ContractRoleValue  `json:"contractRole,omitempty"`
	Version       string             `json:"version,omitempty"`
	VersionSlug   string             `json:"versionSlug,omitempty"`
	Format        string             `json:"format,omitempty"`
	RelativePath  string             `json:"relativePath,omitempty"`
	OutputSubdir  string             `json:"outputSubdir,omitempty"`
	OverviewHref  string             `json:"overviewHref,omitempty"`
	RenderSkipped bool               `json:"renderSkipped,omitempty"`
	Warnings      []string           `json:"warnings,omitempty"`
	Source        *SourceRef         `json:"source,omitempty"`
	HeaderContext *SiteHeaderContext `json:"headerContext,omitempty"`
	Counts        *ViolationCounts   `json:"counts,omitempty"`
}
