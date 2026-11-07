// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import ppmodel "github.com/pb33f/doctor/printingpress/model"

// The content page templates.
const (
	TemplateContentPage  = "content/page.html"
	TemplateContentIndex = "content/index.html"
)

// ContentPageBody is one Markdown page with its default breadcrumb.
func ContentPageBody(page *ppmodel.ContentPage, base string) Body {
	return ContentPageBodyWithBreadcrumb(page, base, contentPageBreadcrumb(page))
}

// ContentPageBodyWithBreadcrumb is one Markdown page with its own breadcrumb.
func ContentPageBodyWithBreadcrumb(page *ppmodel.ContentPage, base string, breadcrumb []BreadcrumbItem) Body {
	return body(TemplateContentPage, page, breadcrumb, base)
}

// GuideCard is one card in a list of pages, as content/partials/guide-card.html
// draws it. Href is ready to place; Description is already shortened.
type GuideCard struct {
	Href        string
	Title       string
	Description string
	// Rel is the link relation, such as prev or next.
	Rel string
	// Chevron puts the chevron icon before the title.
	Chevron bool
}

// guideCardDescriptionLength is how much of a description a card shows.
const guideCardDescriptionLength = 140

// NewGuideCard is a card with the chevron and a shortened description.
func NewGuideCard(href, title, description string) GuideCard {
	return GuideCard{Href: href, Title: title, Description: truncateDesc(description, guideCardDescriptionLength), Chevron: true}
}

// ContentIndexBody is the guides index. Hidden pages are left out.
func ContentIndexBody(pages []*ppmodel.ContentPage, breadcrumb []BreadcrumbItem, base string) Body {
	cards := make([]GuideCard, 0, len(pages))
	for _, page := range pages {
		if page != nil && !page.Hidden {
			cards = append(cards, NewGuideCard(DocHref(base, page.Href), contentPageIndexLabel(page), page.Description))
		}
	}
	return body(TemplateContentIndex, cards, breadcrumb, base)
}

func contentPageIndexLabel(page *ppmodel.ContentPage) string {
	if page == nil {
		return "Untitled"
	}
	if page.Label != "" {
		return page.Label
	}
	if page.Title != "" {
		return page.Title
	}
	if page.Slug != "" {
		return slugToTitle(pathBaseSlug(page.Slug))
	}
	return "Untitled"
}
