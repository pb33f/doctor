// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import ppmodel "github.com/pb33f/doctor/printingpress/model"

// The page body templates. A theme replaces a body by shipping a file of the
// same name under layouts/.
const (
	TemplateRoot           = "api/root.html"
	TemplateOperation      = "api/operation.html"
	TemplateModel          = "api/model.html"
	TemplateTagIndex       = "api/tag-index.html"
	TemplateModelsIndex    = "api/models-index.html"
	TemplateModelTypeIndex = "api/model-type-index.html"
	TemplateDiagnostics    = "api/diagnostics.html"
)

// Body is one page body: the template that draws it, and its data.
type Body struct {
	Template string
	Data     any
}

// PageData is what a page body template gets: the page, its breadcrumb, and
// the base URL its links resolve against.
type PageData[T any] struct {
	Page       T
	Breadcrumb []BreadcrumbItem
	Base       string
}

// Crumbs is the page's breadcrumb, ready for api/partials/breadcrumb.html.
func (d PageData[T]) Crumbs() BreadcrumbArgs {
	return BreadcrumbArgs{Base: d.Base, Items: d.Breadcrumb}
}

func body[T any](name string, page T, breadcrumb []BreadcrumbItem, base string) Body {
	return Body{Template: name, Data: PageData[T]{Page: page, Breadcrumb: breadcrumb, Base: base}}
}

// RootBody is the API overview page.
func RootBody(page *ppmodel.RootPage, base string) Body {
	return body(TemplateRoot, page, nil, base)
}

// OperationBody is one operation or webhook page.
func OperationBody(page *ppmodel.OperationPage, base string) Body {
	return body(TemplateOperation, page, operationBreadcrumb(page), base)
}

// ModelBody is one model page.
func ModelBody(page *ppmodel.ModelPage, base string) Body {
	return body(TemplateModel, page, modelBreadcrumb(page), base)
}

// TagIndexBody is one tag's page.
func TagIndexBody(tag *ppmodel.NavTag, breadcrumb []BreadcrumbItem, base string) Body {
	return body(TemplateTagIndex, tag, breadcrumb, base)
}

// ModelsIndexBody is the page that lists every model group.
func ModelsIndexBody(groups []*ppmodel.NavModelGroup, breadcrumb []BreadcrumbItem, base string) Body {
	return body(TemplateModelsIndex, groups, breadcrumb, base)
}

// ModelTypeIndexBody is the page of one model group.
func ModelTypeIndexBody(group *ppmodel.NavModelGroup, breadcrumb []BreadcrumbItem, base string) Body {
	return body(TemplateModelTypeIndex, group, breadcrumb, base)
}

// DiagnosticsBody is the developer diagnostics page.
func DiagnosticsBody(page *ppmodel.DiagnosticsPage) Body {
	return body(TemplateDiagnostics, page, nil, "")
}
