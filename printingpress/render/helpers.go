// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"strings"
	"unicode"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// BreadcrumbItem represents a single breadcrumb navigation entry.
type BreadcrumbItem struct {
	Label string
	Href  string
}

func modelBreadcrumb(page *ppmodel.ModelPage) []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS", Href: "models/index.html"},
		{Label: strings.ToUpper(slugToTitle(page.TypeSlug)), Href: "models/" + page.TypeSlug + "/index.html"},
	}
}

func operationBreadcrumb(page *ppmodel.OperationPage) []BreadcrumbItem {
	items := []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "OPERATIONS", Href: "index.html"},
	}
	for i, tag := range page.TagPath {
		item := BreadcrumbItem{Label: tag}
		if i < len(page.TagSlugs) {
			item.Href = "tags/" + page.TagSlugs[i] + ".html"
		}
		items = append(items, item)
	}
	return items
}

// ModelsIndexBreadcrumb builds the breadcrumb for the models index page.
func ModelsIndexBreadcrumb() []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS"},
	}
}

// ModelTypeIndexBreadcrumb builds the breadcrumb for a model type index page.
func ModelTypeIndexBreadcrumb(typeName string) []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS", Href: "models/index.html"},
		{Label: strings.ToUpper(typeName)},
	}
}

// TagIndexBreadcrumb builds the breadcrumb for a tag index page using a pre-computed parent map.
func TagIndexBreadcrumb(tag *ppmodel.NavTag, tagParentMap map[string]*ppmodel.NavTag) []BreadcrumbItem {
	items := []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "OPERATIONS", Href: "index.html"},
	}
	var path []*ppmodel.NavTag
	for cur := tagParentMap[tag.Name]; cur != nil; cur = tagParentMap[cur.Name] {
		path = append(path, cur)
	}
	for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
		path[i], path[j] = path[j], path[i]
	}
	for _, ancestor := range path {
		items = append(items, BreadcrumbItem{Label: ancestor.DisplayName(), Href: "tags/" + ancestor.Slug + ".html"})
	}
	items = append(items, BreadcrumbItem{Label: tag.DisplayName()})
	return items
}

// BuildTagParentMap walks the NavTag tree once and returns a map from tag name to parent NavTag.
func BuildTagParentMap(tags []*ppmodel.NavTag) map[string]*ppmodel.NavTag {
	m := make(map[string]*ppmodel.NavTag)
	var walk func([]*ppmodel.NavTag)
	walk = func(tags []*ppmodel.NavTag) {
		for _, t := range tags {
			for _, child := range t.Children {
				m[child.Name] = t
			}
			walk(t.Children)
		}
	}
	walk(tags)
	return m
}

func slugToTitle(slug string) string {
	words := strings.Split(slug, "-")
	for i, w := range words {
		if len(w) > 0 {
			runes := []rune(w)
			runes[0] = unicode.ToUpper(runes[0])
			words[i] = string(runes)
		}
	}
	return strings.Join(words, " ")
}

func operationNavSections(page *ppmodel.OperationPage) string {
	type navSection struct {
		Label string `json:"label"`
		ID    string `json:"id"`
	}
	var sections []navSection
	if page.DescHTML != "" {
		sections = append(sections, navSection{"Description", "section-description"})
	}
	if len(page.Security) > 0 {
		sections = append(sections, navSection{"Security", "section-security"})
	}
	if len(page.Servers) > 0 {
		sections = append(sections, navSection{"Servers", "section-servers"})
	}
	if page.RequestBody != nil {
		sections = append(sections, navSection{"Request Body", "section-request-body"})
	}
	if page.ResponsesJSON != "" {
		sections = append(sections, navSection{"Responses", "section-responses"})
	}
	if page.ParametersJSON != "" {
		sections = append(sections, navSection{"Parameters", "section-parameters"})
	}
	if page.CurlJSON != "" {
		sections = append(sections, navSection{"cURL", "section-curl"})
	}
	if page.ExtensionsJSON != "" {
		sections = append(sections, navSection{"Extensions", "section-extensions"})
	}
	if page.PathExtensionsJSON != "" {
		sections = append(sections, navSection{"Path Extensions", "section-path-extensions"})
	}
	if page.CallbacksJSON != "" {
		sections = append(sections, navSection{"Callbacks", "section-callbacks"})
	}
	if page.ExternalDoc != nil {
		sections = append(sections, navSection{"External Docs", "section-external-docs"})
	}
	return MustJSON(sections)
}

func truncateDesc(desc string, maxLen int) string {
	desc = strings.TrimSpace(singleLine(desc))
	if len(desc) <= maxLen {
		return desc
	}
	if maxLen <= 3 {
		return desc[:maxLen]
	}
	return desc[:maxLen-3] + "..."
}

func singleLine(s string) string {
	s = strings.ReplaceAll(s, "\n", " ")
	s = strings.ReplaceAll(s, "\r", " ")
	return strings.Join(strings.Fields(s), " ")
}
