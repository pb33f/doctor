// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"context"
	"io"

	"github.com/a-h/templ"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// ContentIndexTempl renders the generated index for convention-discovered
// Markdown pages.
func ContentIndexTempl(pages []*ppmodel.ContentPage, breadcrumb []BreadcrumbItem, baseURL string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if _, err := io.WriteString(w, `<div class="pp-root pp-content-index">`); err != nil {
			return err
		}
		if err := Breadcrumb(baseURL, breadcrumb).Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<h1>Guides</h1><div class="pp-guide-cards">`); err != nil {
			return err
		}
		wrote := false
		for _, page := range pages {
			if page == nil || page.Hidden {
				continue
			}
			wrote = true
			if _, err := io.WriteString(w, `<a href="`+templ.EscapeString(DocHref(baseURL, page.Href))+`" class="pp-guide-card">`); err != nil {
				return err
			}
			if _, err := io.WriteString(w, `<div class="pp-guide-card-title"><sl-icon name="chevron-right" aria-hidden="true"></sl-icon><strong>`+templ.EscapeString(contentPageIndexLabel(page))+`</strong></div>`); err != nil {
				return err
			}
			if page.Description != "" {
				if _, err := io.WriteString(w, `<p>`+templ.EscapeString(truncateDesc(page.Description, 140))+`</p>`); err != nil {
					return err
				}
			}
			if _, err := io.WriteString(w, `</a>`); err != nil {
				return err
			}
		}
		if !wrote {
			if _, err := io.WriteString(w, `<p class="pp-content-index-empty">No guides are linked.</p>`); err != nil {
				return err
			}
		}
		_, err := io.WriteString(w, `</div></div>`)
		return err
	})
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
