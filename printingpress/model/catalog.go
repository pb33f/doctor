// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

// SiteHeaderContext configures optional aggregate header controls for a rendered site.
type SiteHeaderContext struct {
	CatalogHref    string             `json:"catalogHref,omitempty"`
	OverviewHref   string             `json:"overviewHref,omitempty"`
	ServiceName    string             `json:"serviceName,omitempty"`
	CurrentVersion string             `json:"currentVersion,omitempty"`
	VersionsHref   string             `json:"versionsHref,omitempty"`
	Versions       []*SiteVersionLink `json:"versions,omitempty"`
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
	Key             string            `json:"key"`
	Slug            string            `json:"slug"`
	DisplayName     string            `json:"displayName"`
	Summary         string            `json:"summary,omitempty"`
	PrimaryPath     string            `json:"primaryPath,omitempty"`
	SpecCount       int               `json:"specCount"`
	OverviewHref    string            `json:"overviewHref,omitempty"`
	VersionsHref    string            `json:"versionsHref,omitempty"`
	LatestVersion   *CatalogVersion   `json:"latestVersion,omitempty"`
	Versions        []*CatalogVersion `json:"versions,omitempty"`
	CollisionGroups []string          `json:"collisionGroups,omitempty"`
	Counts          *ViolationCounts  `json:"counts,omitempty"`
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
	Title         string             `json:"title,omitempty"`
	Summary       string             `json:"summary,omitempty"`
	Contact       *ContactInfo       `json:"contact,omitempty"`
	ServiceKey    string             `json:"serviceKey,omitempty"`
	ServiceSlug   string             `json:"serviceSlug,omitempty"`
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
