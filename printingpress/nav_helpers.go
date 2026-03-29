// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

// operationNavSections builds a JSON array of navigation sections for an operation page.
// Each section corresponds to a rendered block in the templ template.
func operationNavSections(page *OperationPage) string {
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
