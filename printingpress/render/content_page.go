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

// ContentPageTempl renders a convention-discovered Markdown page inside the
// shared Printing Press page shell.
func ContentPageTempl(page *ppmodel.ContentPage, baseURL string) templ.Component {
	return ContentPageTemplWithBreadcrumb(page, baseURL, contentPageBreadcrumb(page))
}

// ContentPageTemplWithBreadcrumb renders a convention-discovered Markdown page
// with caller-provided breadcrumb items.
func ContentPageTemplWithBreadcrumb(page *ppmodel.ContentPage, baseURL string, breadcrumb []BreadcrumbItem) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if page == nil {
			return nil
		}
		if _, err := io.WriteString(w, `<section class="pp-content-page">`); err != nil {
			return err
		}
		if err := Breadcrumb(baseURL, breadcrumb).Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<header class="pp-content-page-header"><h1>`+templ.EscapeString(page.Title)+`</h1>`); err != nil {
			return err
		}
		if page.Description != "" {
			if _, err := io.WriteString(w, `<p class="pp-content-page-description">`+templ.EscapeString(page.Description)+`</p>`); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `</header><div class="pp-content-page-markdown pp-content-page-body">`); err != nil {
			return err
		}
		if err := templ.Raw(page.BodyHTML).Render(ctx, w); err != nil {
			return err
		}
		_, err := io.WriteString(w, `</div></section>`)
		return err
	})
}
