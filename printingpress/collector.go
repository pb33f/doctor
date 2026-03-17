// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
)

// refSegmentToTypeSlug maps OpenAPI $ref component segments to URL type slugs.
var refSegmentToTypeSlug = map[string]string{
	"schemas":         "schemas",
	"responses":       "responses",
	"parameters":      "parameters",
	"requestBodies":   "request-bodies",
	"headers":         "headers",
	"securitySchemes": "security",
	"examples":        "examples",
	"links":           "links",
	"callbacks":       "callbacks",
	"pathItems":       "path-items",
}

// resolveComponentLink parses a $ref string and looks up the model page.
// Returns nil if the ref doesn't point to a known component.
func (pp *PrintingPress) resolveComponentLink(ref string) *ComponentLink {
	parts := strings.SplitN(strings.TrimPrefix(ref, "#/components/"), "/", 2)
	if len(parts) != 2 {
		return nil
	}
	segment, name := parts[0], parts[1]
	typeSlug, ok := refSegmentToTypeSlug[segment]
	if !ok {
		return nil
	}
	for _, page := range pp.site.Models[typeSlug] {
		if page.Name == name {
			return &ComponentLink{
				Name:          name,
				ComponentType: segment,
				TypeSlug:      typeSlug,
				Slug:          page.Slug,
			}
		}
	}
	return nil
}

// visitDocument collects all top-level document data: info, tags, servers, components, webhooks.
func (pp *PrintingPress) visitDocument(ctx context.Context, doc *v3.Document) {
	root := &RootPage{}

	if doc.Document != nil {
		if doc.Document.Info != nil {
			info := doc.Document.Info
			root.Title = info.Title
			if pp.config.Title != "" {
				root.Title = pp.config.Title
			}
			root.Description = info.Description
			root.DescHTML = renderMarkdown(info.Description)
			root.Version = info.Version

			if info.Contact != nil {
				root.Contact = &ContactInfo{
					Name:  info.Contact.Name,
					URL:   info.Contact.URL,
					Email: info.Contact.Email,
				}
			}
			if info.License != nil {
				root.License = &LicenseInfo{
					Name: info.License.Name,
					URL:  info.License.URL,
				}
			}
		}

		if doc.Document.Servers != nil {
			for _, srv := range doc.Document.Servers {
				root.Servers = append(root.Servers, &ServerInfo{
					URL:         srv.URL,
					Description: srv.Description,
				})
			}
		}

		if doc.Document.ExternalDocs != nil {
			root.ExternalDoc = &ExternalDocInfo{
				URL:         doc.Document.ExternalDocs.URL,
				Description: doc.Document.ExternalDocs.Description,
			}
		}

		if doc.Document.Security != nil {
			for _, sec := range doc.Document.Security {
				secMap := make(map[string][]string)
				for pair := sec.Requirements.First(); pair != nil; pair = pair.Next() {
					secMap[pair.Key()] = pair.Value()
				}
				root.Security = append(root.Security, secMap)
			}
		}
	}

	// Build hierarchical tag tree
	root.TagTree = pp.buildTagTree(doc.Tags)
	pp.site.NavTags = root.TagTree
	pp.site.Root = root

	// Collect all component types FIRST (needed for ref resolution in operations)
	if doc.Components != nil {
		pp.collectComponents(doc.Components)
	}

	// Build nav model groups from collected components
	pp.buildNavModelGroups()

	// Build schema registry for hover popovers
	pp.buildSchemaRegistry()

	// Visit paths to collect operations (can now resolve $refs to components)
	if doc.Paths != nil {
		pp.visitPaths(ctx, doc.Paths)
	}

	// Assign operations to tags
	pp.assignOperationsToTags()

	// Collect webhooks
	if doc.Webhooks != nil {
		pp.collectWebhooks(doc.Webhooks)
	}
}

// buildTagTree creates a hierarchical NavTag tree from flat tag list using Parent/Kind fields.
func (pp *PrintingPress) buildTagTree(tags []*v3.Tag) []*NavTag {
	if tags == nil {
		return nil
	}

	tagMap := make(map[string]*NavTag)
	var allTags []*NavTag

	// First pass: create all NavTag nodes
	for _, tag := range tags {
		if tag.Value == nil {
			continue
		}
		nt := &NavTag{
			Name:      tag.Value.Name,
			Summary:   tag.Value.Summary,
			IsNavOnly: strings.EqualFold(tag.Value.Kind, "nav"),
		}
		tagMap[tag.Value.Name] = nt
		allTags = append(allTags, nt)
	}

	// Second pass: build parent-child relationships
	var roots []*NavTag
	for _, tag := range tags {
		if tag.Value == nil {
			continue
		}
		nt := tagMap[tag.Value.Name]
		if tag.Value.Parent != "" {
			if parent, ok := tagMap[tag.Value.Parent]; ok {
				parent.Children = append(parent.Children, nt)
			} else {
				roots = append(roots, nt)
			}
		} else {
			roots = append(roots, nt)
		}
	}

	if len(roots) == 0 {
		return allTags
	}
	return roots
}

// visitPaths collects all operations from all paths.
func (pp *PrintingPress) visitPaths(ctx context.Context, paths *v3.Paths) {
	if paths.PathItems == nil {
		return
	}
	for pair := paths.PathItems.First(); pair != nil; pair = pair.Next() {
		pathStr := pair.Key()
		pathItem := pair.Value()
		pp.collectPathItemOperations(pathStr, pathItem)
	}
}

// collectPathItemOperations iterates all HTTP methods on a PathItem.
func (pp *PrintingPress) collectPathItemOperations(path string, pi *v3.PathItem) {
	ops := pi.GetOperations()
	for pair := ops.First(); pair != nil; pair = pair.Next() {
		method := pair.Key()
		op := pair.Value()
		pp.collectOperation(method, path, op, pi)
	}
}

// collectOperation builds an OperationPage from a single operation.
func (pp *PrintingPress) collectOperation(method, path string, op *v3.Operation, pi *v3.PathItem) {
	if op == nil || op.Value == nil {
		return
	}
	val := op.Value

	operationID := val.OperationId
	preferred := operationSlug(method, path, operationID)
	slug := pp.slugs.Register("operations", preferred)

	page := &OperationPage{
		Method:      strings.ToUpper(method),
		Path:        path,
		OperationID: operationID,
		Summary:     val.Summary,
		Description: val.Description,
		DescHTML:    renderMarkdown(val.Description),
		Deprecated:  ptrBool(val.Deprecated),
		Slug:        slug,
	}

	for _, t := range val.Tags {
		page.Tags = append(page.Tags, t)
	}

	// Parameters (operation-level + path-level)
	page.Parameters = pp.collectParameters(op.Parameters)
	if pi.Parameters != nil {
		page.Parameters = append(page.Parameters, pp.collectParameters(pi.Parameters)...)
	}

	if len(page.Parameters) > 0 {
		page.ParametersJSON = MustJSON(page.Parameters)
	}

	// Request body
	if op.RequestBody != nil {
		page.RequestBody = pp.collectRequestBody(op.RequestBody)
	}

	// Responses
	if op.Responses != nil {
		page.Responses = pp.collectResponses(op.Responses)
	}

	if len(page.Responses) > 0 {
		page.CommonHeaders = computeCommonHeaders(page.Responses)
		if len(page.CommonHeaders) > 0 {
			page.CommonHeadersJSON = MustJSON(page.CommonHeaders)
		}
		page.ResponsesJSON = MustJSON(page.Responses)
	}

	// Servers
	if op.Servers != nil {
		for _, srv := range op.Servers {
			if srv.Value != nil {
				page.Servers = append(page.Servers, &ServerInfo{
					URL:         srv.Value.URL,
					Description: srv.Value.Description,
				})
			}
		}
	}

	// Security
	if op.Security != nil {
		for _, sec := range op.Security {
			if sec.Value != nil && sec.Value.Requirements != nil {
				secMap := make(map[string][]string)
				for p := sec.Value.Requirements.First(); p != nil; p = p.Next() {
					secMap[p.Key()] = p.Value()
				}
				page.Security = append(page.Security, secMap)
			}
		}
	}

	// External docs
	if op.ExternalDocs != nil && op.ExternalDocs.Value != nil {
		page.ExternalDoc = &ExternalDocInfo{
			URL:         op.ExternalDocs.Value.URL,
			Description: op.ExternalDocs.Value.Description,
		}
	}

	// Serialize full operation to YAML + JSON for cowboy-components and raw viewer
	pp.captureRawData(val, fmt.Sprintf("%s %s", method, path),
		&page.RawYAML, &page.SchemaJSON, &page.SchemaHighlightedHTML)

	if op.ValueNode != nil {
		page.SourceLine = op.ValueNode.Line
	}

	pp.site.Operations = append(pp.site.Operations, page)
}

func (pp *PrintingPress) collectParameters(params []*v3.Parameter) []*ParameterInfo {
	var result []*ParameterInfo
	for _, p := range params {
		if p.Value == nil {
			continue
		}
		pi := &ParameterInfo{
			Name:        p.Value.Name,
			In:          p.Value.In,
			Description: p.Value.Description,
			Required:    ptrBool(p.Value.Required),
			Deprecated:  p.Value.Deprecated,
		}
		pp.captureRawData(p.Value, p.Value.Name, &pi.RawYAML, &pi.RawJSON, nil)
		if p.ValueNode != nil {
			pi.SourceLine = p.ValueNode.Line
		}
		if low := p.Value.GoLow(); low != nil && low.IsReference() {
			if link := pp.resolveComponentLink(low.GetReference()); link != nil {
				pi.Ref = link
			}
		}
		if p.Value.Schema != nil {
			sch := p.Value.Schema.Schema()
			if sch != nil {
				jsonStr, err := sch.MarshalJSON()
				if err == nil {
					pi.SchemaJSON = string(jsonStr)
				}
			}
		}
		// Generate mock only for complex schemas (objects, arrays, compositions)
		if isComplexSchemaJSON(pi.SchemaJSON) {
			pi.MockJSON = pp.generateMock(p.Value)
		}
		// Collect named examples
		if p.Examples != nil {
			pi.Examples = make(map[string]string)
			for pair := p.Examples.First(); pair != nil; pair = pair.Next() {
				ex := pair.Value()
				if ex != nil && ex.Value != nil {
					yamlBytes, err := ex.Value.Render()
					if err == nil {
						jsonStr, err := yamlToJSON(yamlBytes)
						if err == nil {
							pi.Examples[pair.Key()] = jsonStr
						}
					}
				}
			}
		}
		result = append(result, pi)
	}
	return result
}

func (pp *PrintingPress) collectRequestBody(rb *v3.RequestBody) *RequestBodyInfo {
	if rb.Value == nil {
		return nil
	}
	val := rb.Value
	rbi := &RequestBodyInfo{
		Description: val.Description,
		Required:    ptrBool(val.Required),
	}
	pp.captureRawData(val, "requestBody", &rbi.RawYAML, &rbi.RawJSON, nil)
	if rb.ValueNode != nil {
		rbi.SourceLine = rb.ValueNode.Line
	}
	if val.IsReference() {
		if link := pp.resolveComponentLink(val.GetReference()); link != nil {
			rbi.Ref = link
			return rbi
		}
	}
	if rb.Content != nil {
		for pair := rb.Content.First(); pair != nil; pair = pair.Next() {
			mt := pp.collectMediaType(pair.Key(), pair.Value())
			if mt != nil {
				rbi.Content = append(rbi.Content, mt)
			}
		}
	}
	return rbi
}

func (pp *PrintingPress) collectMediaType(mediaTypeName string, mt *v3.MediaType) *MediaTypeInfo {
	if mt == nil || mt.Value == nil {
		return nil
	}
	mti := &MediaTypeInfo{
		MediaType: mediaTypeName,
	}
	// Use DrDocument's SchemaProxy field (not Value.Schema)
	if mt.SchemaProxy != nil && mt.SchemaProxy.Value != nil {
		if mt.SchemaProxy.Value.IsReference() {
			mti.SchemaRef = pp.resolveComponentLink(mt.SchemaProxy.Value.GetReference())
		}
		sch := mt.SchemaProxy.Value.Schema()
		if sch != nil {
			// Detect array schemas with $ref items (e.g. type: array, items: $ref: ...)
			if len(sch.Type) > 0 && sch.Type[0] == "array" && sch.Items != nil && sch.Items.IsA() {
				mti.IsArray = true
				if sch.Items.A.IsReference() {
					mti.ItemsRef = pp.resolveComponentLink(sch.Items.A.GetReference())
				}
			}
			jsonStr, err := sch.MarshalJSON()
			if err == nil {
				mti.SchemaJSON = string(jsonStr)
				// Only generate highlighted HTML for inline schemas (not refs — they link out)
				if mti.SchemaRef == nil && mti.ItemsRef == nil {
					mti.SchemaHighlightedHTML, _ = highlightJSON(prettyJSON(string(jsonStr)))
				}
			}
		}
	}
	if mt.Examples != nil {
		mti.Examples = make(map[string]string)
		for pair := mt.Examples.First(); pair != nil; pair = pair.Next() {
			ex := pair.Value()
			if ex != nil && ex.Value != nil {
				yamlBytes, err := ex.Value.Render()
				if err == nil {
					jsonStr, err := yamlToJSON(yamlBytes)
					if err == nil {
						mti.Examples[pair.Key()] = jsonStr
					}
				}
			}
		}
	}
	// Generate mock only for complex schemas (objects, arrays, compositions)
	if isComplexSchemaJSON(mti.SchemaJSON) {
		mti.MockJSON = pp.generateMock(mt.Value)
	}
	return mti
}

func (pp *PrintingPress) collectResponses(responses *v3.Responses) []*ResponseInfo {
	if responses.Codes == nil {
		return nil
	}
	var result []*ResponseInfo
	for pair := responses.Codes.First(); pair != nil; pair = pair.Next() {
		code := pair.Key()
		resp := pair.Value()
		if resp == nil || resp.Value == nil {
			continue
		}
		ri := &ResponseInfo{
			StatusCode:  code,
			Description: resp.Value.Description,
		}
		pp.captureRawData(resp.Value, code, &ri.RawYAML, &ri.RawJSON, nil)
		if resp.ValueNode != nil {
			ri.SourceLine = resp.ValueNode.Line
		}
		if resp.Value.IsReference() {
			if link := pp.resolveComponentLink(resp.Value.GetReference()); link != nil {
				ri.Ref = link
				result = append(result, ri)
				continue
			}
		}
		if resp.Content != nil {
			for mtPair := resp.Content.First(); mtPair != nil; mtPair = mtPair.Next() {
				mt := pp.collectMediaType(mtPair.Key(), mtPair.Value())
				if mt != nil {
					ri.Content = append(ri.Content, mt)
				}
			}
		}
		if resp.Headers != nil {
			for hPair := resp.Headers.First(); hPair != nil; hPair = hPair.Next() {
				h := hPair.Value()
				if h == nil || h.Value == nil {
					continue
				}
				hi := &HeaderInfo{Name: hPair.Key()}
				if low := h.Value.GoLow(); low != nil && low.IsReference() {
					if link := pp.resolveComponentLink(low.GetReference()); link != nil {
						hi.Ref = link
					}
				}
				hi.Description = h.Value.Description
				if h.Schema != nil && h.Schema.Value != nil {
					sch := h.Schema.Value.Schema()
					if sch != nil {
						t := ""
						if sch.Type != nil {
							for i, st := range sch.Type {
								if i > 0 {
									t += " | "
								}
								t += st
							}
						}
						if sch.Format != "" && t != "" {
							t += " (" + sch.Format + ")"
						}
						hi.SchemaType = t
						hi.Minimum = sch.Minimum
						hi.Maximum = sch.Maximum
						if sch.Example != nil {
							hi.Example = yamlNodeToJSON(sch.Example)
						}
						if sch.Default != nil {
							hi.Default = yamlNodeToJSON(sch.Default)
						}
						if sch.Pattern != "" {
							hi.Pattern = sch.Pattern
						}
						if len(sch.Enum) > 0 {
							for _, e := range sch.Enum {
								hi.Enum = append(hi.Enum, yamlNodeToJSON(e))
							}
						}
					}
				}
				ri.Headers = append(ri.Headers, hi)
			}
		}
		result = append(result, ri)
	}
	return result
}

// collectComponents processes all component types from the DrDocument.
func (pp *PrintingPress) collectComponents(comp *v3.Components) {
	if comp.Schemas != nil {
		pp.collectSchemaComponents(comp.Schemas)
	}
	if comp.Responses != nil {
		collectRenderable(pp, comp.Responses, "responses", "responses", descResponse, nil, nil)
	}
	if comp.Parameters != nil {
		collectRenderable(pp, comp.Parameters, "parameters", "parameters", descParameter, schemaFromParameter, examplesFromParameter)
	}
	if comp.Examples != nil {
		collectRenderable(pp, comp.Examples, "examples", "examples", descExample, nil, nil)
	}
	if comp.RequestBodies != nil {
		collectRenderable(pp, comp.RequestBodies, "requestBodies", "request-bodies", descRequestBody, nil, nil)
	}
	if comp.Headers != nil {
		collectRenderable(pp, comp.Headers, "headers", "headers", descHeader, schemaFromHeader, examplesFromHeader)
	}
	if comp.SecuritySchemes != nil {
		collectRenderable(pp, comp.SecuritySchemes, "securitySchemes", "security", descSecurityScheme, nil, nil)
	}
	if comp.Links != nil {
		collectRenderable(pp, comp.Links, "links", "links", descLink, nil, nil)
	}
	if comp.Callbacks != nil {
		collectRenderable(pp, comp.Callbacks, "callbacks", "callbacks", descNone[*v3.Callback], nil, nil)
	}
	if comp.PathItems != nil {
		collectRenderable(pp, comp.PathItems, "pathItems", "path-items", descPathItem, nil, nil)
	}
}

// collectSchemaComponents handles schemas specifically since Schema has MarshalJSON.
func (pp *PrintingPress) collectSchemaComponents(schemas *orderedmap.Map[string, *v3.SchemaProxy]) {
	for pair := schemas.First(); pair != nil; pair = pair.Next() {
		name := pair.Key()
		sp := pair.Value()
		preferred := sanitizeSlug(name)
		slug := pp.slugs.Register("schemas", preferred)

		page := &ModelPage{
			Name:          name,
			ComponentType: "schemas",
			TypeSlug:      "schemas",
			Slug:          slug,
		}

		if sp.Schema != nil && sp.Schema.Value != nil {
			page.Description = sp.Schema.Value.Description
			page.DescHTML = renderMarkdown(sp.Schema.Value.Description)
			pp.captureRawData(sp.Schema.Value, name,
				&page.RawYAML, &page.SchemaJSON, &page.SchemaHighlightedHTML)
			// Generate mock only for complex schemas (objects, arrays, compositions)
			if isComplexSchemaJSON(page.SchemaJSON) {
				page.MockJSON = pp.generateMock(sp.Value)
			}
			// Collect inline example(s) from schema
			if sp.Schema.Value.Example != nil || len(sp.Schema.Value.Examples) > 0 {
				page.Examples = make(map[string]string)
				if sp.Schema.Value.Example != nil {
					if s := yamlNodeToJSON(sp.Schema.Value.Example); s != "" {
						page.Examples["Example"] = s
					}
				}
				for i, ex := range sp.Schema.Value.Examples {
					if s := yamlNodeToJSON(ex); s != "" {
						page.Examples[fmt.Sprintf("Example %d", i+1)] = s
					}
				}
			}
		}
		if page.MockJSON != "" || len(page.Examples) > 0 {
			page.ExamplesJSON = MustJSON(struct {
				MockJSON string            `json:"mockJson,omitempty"`
				Examples map[string]string `json:"examples,omitempty"`
			}{page.MockJSON, page.Examples})
		}

		page.Origin = pp.resolveOrigin("schemas", name)

		pp.site.Models["schemas"] = append(pp.site.Models["schemas"], page)
	}
}

// description extractors for each DrDocument component wrapper type
func descResponse(v *v3.Response) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descParameter(v *v3.Parameter) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descExample(v *v3.Example) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descRequestBody(v *v3.RequestBody) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descHeader(v *v3.Header) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descSecurityScheme(v *v3.SecurityScheme) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descLink(v *v3.Link) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descPathItem(v *v3.PathItem) string {
	if v.Value != nil {
		return v.Value.Description
	}
	return ""
}
func descNone[V any](_ V) string { return "" }

// schema extractors for component types that have a nested schema
func schemaFromParameter(v *v3.Parameter) valueRenderer {
	if v.Value != nil && v.Value.Schema != nil {
		return v.Value.Schema
	}
	return nil
}

func schemaFromHeader(v *v3.Header) valueRenderer {
	if v.Value != nil && v.Value.Schema != nil {
		return v.Value.Schema
	}
	return nil
}

func examplesFromParameter(v *v3.Parameter) examplesMap {
	if v != nil && v.Examples != nil {
		return v.Examples
	}
	return nil
}

func examplesFromHeader(v *v3.Header) examplesMap {
	if v != nil && v.Examples != nil {
		return v.Examples
	}
	return nil
}

// captureRawData calls Render() on renderable, populating rawYAML, schemaJSON, and
// highlightedHTML progressively. If Render() fails, nothing is set. If yamlToJSON()
// fails, only rawYAML is set (the drawer supports YAML-only display).
func (pp *PrintingPress) captureRawData(renderable interface{ Render() ([]byte, error) }, context string, rawYAML, schemaJSON, highlightedHTML *string) {
	yamlBytes, err := renderable.Render()
	if err != nil {
		pp.warn("failed to render to YAML", context, err)
		return
	}
	*rawYAML = strings.TrimRight(string(yamlBytes), "\n")
	jsonStr, jsonErr := yamlToJSON(yamlBytes)
	if jsonErr != nil {
		pp.warn("failed to convert YAML to JSON", context, jsonErr)
		return
	}
	*schemaJSON = jsonStr
	if highlightedHTML != nil {
		*highlightedHTML, _ = highlightJSON(prettyJSON(jsonStr))
	}
}

// valueRenderer extracts the libopenapi Value that has Render() from a DrDocument wrapper.
type valueRenderer interface {
	Render() ([]byte, error)
}

// getValueRenderer returns the underlying libopenapi type's Render() if available.
func getValueRenderer(drObj any) valueRenderer {
	type hasValue interface {
		GetValue() any
	}
	if hv, ok := drObj.(hasValue); ok {
		if r, ok := hv.GetValue().(valueRenderer); ok {
			return r
		}
	}
	return nil
}

// examplesMap is the common ordered map type for named examples.
type examplesMap = *orderedmap.Map[string, *v3.Example]

// collectRenderable is a generic collector for component types with a .Value that has Render().
func collectRenderable[V interface{ GetValue() any }](
	pp *PrintingPress,
	m *orderedmap.Map[string, V],
	componentType, typeSlug string,
	getDesc func(V) string,
	getSchema func(V) valueRenderer,
	getExamples func(V) examplesMap,
) {
	for pair := m.First(); pair != nil; pair = pair.Next() {
		name := pair.Key()
		val := pair.Value()
		preferred := sanitizeSlug(name)
		slug := pp.slugs.Register(typeSlug, preferred)

		page := &ModelPage{
			Name:          name,
			ComponentType: componentType,
			TypeSlug:      typeSlug,
			Slug:          slug,
		}

		desc := getDesc(val)
		page.Description = desc
		page.DescHTML = renderMarkdown(desc)

		if r := getValueRenderer(val); r != nil {
			pp.captureRawData(r, fmt.Sprintf("%s/%s", componentType, name),
				&page.RawYAML, &page.SchemaJSON, &page.SchemaHighlightedHTML)
		}

		if getSchema != nil {
			if sr := getSchema(val); sr != nil {
				pp.captureRawData(sr, fmt.Sprintf("%s/%s/schema", componentType, name),
					&page.SchemaRawYAML, &page.SchemaRawJSON, nil)
			}
		}

		if getExamples != nil {
			if examples := getExamples(val); examples != nil {
				page.Examples = make(map[string]string)
				for exPair := examples.First(); exPair != nil; exPair = exPair.Next() {
					ex := exPair.Value()
					if ex != nil && ex.Value != nil {
						yamlBytes, err := ex.Value.Render()
						if err == nil {
							jsonStr, err := yamlToJSON(yamlBytes)
							if err == nil {
								page.Examples[exPair.Key()] = jsonStr
							}
						}
					}
				}
				if len(page.Examples) > 0 {
					page.ExamplesJSON = MustJSON(struct {
						Examples map[string]string `json:"examples,omitempty"`
					}{page.Examples})
				}
			}
		}

		page.Origin = pp.resolveOrigin(componentType, name)

		if page.SchemaRawYAML != "" && page.RawYAML != "" {
			page.SchemaStartLine = computeSchemaStartLine(page.RawYAML, page.Origin)
		}

		pp.site.Models[typeSlug] = append(pp.site.Models[typeSlug], page)
	}
}

// collectWebhooks collects webhook path items as operations.
func (pp *PrintingPress) collectWebhooks(webhooks *orderedmap.Map[string, *v3.PathItem]) {
	for pair := webhooks.First(); pair != nil; pair = pair.Next() {
		name := pair.Key()
		pi := pair.Value()
		ops := pi.GetOperations()
		for opPair := ops.First(); opPair != nil; opPair = opPair.Next() {
			method := opPair.Key()
			op := opPair.Value()
			if op == nil || op.Value == nil {
				continue
			}
			val := op.Value
			preferred := sanitizeSlug(fmt.Sprintf("webhook-%s-%s", name, method))
			slug := pp.slugs.Register("webhooks", preferred)

			page := &OperationPage{
				Method:      strings.ToUpper(method),
				Path:        name,
				OperationID: val.OperationId,
				Summary:     val.Summary,
				Description: val.Description,
				DescHTML:    renderMarkdown(val.Description),
				Deprecated:  ptrBool(val.Deprecated),
				Slug:        slug,
			}

			for _, t := range val.Tags {
				page.Tags = append(page.Tags, t)
			}

			pp.captureRawData(val, fmt.Sprintf("webhook %s %s", name, method),
				&page.RawYAML, &page.SchemaJSON, &page.SchemaHighlightedHTML)

			pp.site.Webhooks = append(pp.site.Webhooks, page)
		}
	}
}

// assignOperationsToTags distributes operations into the NavTag tree by matching tag names.
func (pp *PrintingPress) assignOperationsToTags() {
	tagLookup := make(map[string]*NavTag)
	var walk func([]*NavTag)
	walk = func(tags []*NavTag) {
		for _, tag := range tags {
			tagLookup[tag.Name] = tag
			walk(tag.Children)
		}
	}
	walk(pp.site.NavTags)

	for _, op := range pp.site.Operations {
		navOp := &NavOperation{
			Method:      op.Method,
			Path:        op.Path,
			OperationID: op.OperationID,
			Summary:     op.Summary,
			Slug:        op.Slug,
			Deprecated:  op.Deprecated,
		}
		if len(op.Tags) == 0 {
			pp.site.Root.UntaggedOperations = append(pp.site.Root.UntaggedOperations, navOp)
			continue
		}
		for _, tagName := range op.Tags {
			if nt, ok := tagLookup[tagName]; ok {
				nt.Operations = append(nt.Operations, navOp)
			}
		}
	}
}

// buildNavModelGroups creates NavModelGroup entries from collected site.Models in a fixed display order.
func (pp *PrintingPress) buildNavModelGroups() {
	type groupDef struct {
		name     string
		typeSlug string
	}
	order := []groupDef{
		{"Schemas", "schemas"},
		{"Responses", "responses"},
		{"Parameters", "parameters"},
		{"Request Bodies", "request-bodies"},
		{"Headers", "headers"},
		{"Security Schemes", "security"},
		{"Examples", "examples"},
		{"Links", "links"},
		{"Callbacks", "callbacks"},
		// path-items omitted from nav — after bundling they duplicate operation pages
	}
	for _, def := range order {
		pages := pp.site.Models[def.typeSlug]
		if len(pages) == 0 {
			continue
		}
		group := &NavModelGroup{
			Name:     def.name,
			TypeSlug: def.typeSlug,
		}
		for _, p := range pages {
			group.Models = append(group.Models, &NavModel{
				Name:        p.Name,
				Slug:        p.Slug,
				TypeSlug:    p.TypeSlug,
				Description: p.Description,
			})
		}
		pp.site.NavModelGroups = append(pp.site.NavModelGroups, group)
	}
}

// generateMock produces a pretty-printed JSON mock from any mockable object.
func (pp *PrintingPress) generateMock(mockable any) string {
	mock, err := pp.mockGen.GenerateMock(mockable, "")
	if err != nil || mock == nil {
		return ""
	}
	return string(mock)
}

// yamlNodeToJSON converts a *yaml.Node to a JSON string.
func yamlNodeToJSON(node *yaml.Node) string {
	if node == nil {
		return ""
	}
	var raw any
	if err := node.Decode(&raw); err != nil {
		return ""
	}
	b, err := json.MarshalIndent(raw, "", "  ")
	if err != nil {
		return ""
	}
	return string(b)
}

// computeCommonHeaders finds headers that appear in 2+ responses and returns the
// first occurrence of each. Used to deduplicate repeated headers (e.g. RateLimit-*)
// into a single "Common Headers" section on the operation page.
func computeCommonHeaders(responses []*ResponseInfo) []*HeaderInfo {
	counts := make(map[string]int)
	first := make(map[string]*HeaderInfo)
	for _, resp := range responses {
		for _, h := range resp.Headers {
			counts[h.Name]++
			if _, ok := first[h.Name]; !ok {
				first[h.Name] = h
			}
		}
	}
	var common []*HeaderInfo
	// Preserve insertion order by iterating responses again
	seen := make(map[string]bool)
	for _, resp := range responses {
		for _, h := range resp.Headers {
			if counts[h.Name] >= 2 && !seen[h.Name] {
				common = append(common, first[h.Name])
				seen[h.Name] = true
			}
		}
	}
	return common
}

// resolveOrigin looks up a component origin and strips the SpecRoot prefix from OriginalFile
// so rendered paths are relative (e.g. "schemas/user.yaml" not "/home/user/project/api-spec/schemas/user.yaml").
func (pp *PrintingPress) resolveOrigin(componentType, name string) *bundler.ComponentOrigin {
	if pp.config.Origins == nil {
		return nil
	}
	key := componentKey(componentType, name)
	origin, ok := pp.config.Origins[key]
	if !ok || origin == nil {
		return nil
	}
	if pp.config.SpecRoot != "" && strings.HasPrefix(origin.OriginalFile, pp.config.SpecRoot) {
		trimmed := strings.TrimPrefix(origin.OriginalFile, pp.config.SpecRoot)
		trimmed = strings.TrimPrefix(trimmed, "/")
		cp := *origin
		cp.OriginalFile = trimmed
		return &cp
	}
	return origin
}

// computeSchemaStartLine finds where schema content begins within the rendered
// parent YAML and returns the 1-based source line number. This makes the Schema
// inline code block line numbers match the raw viewer.
func computeSchemaStartLine(rawYAML string, origin *bundler.ComponentOrigin) int {
	originLine := 1
	if origin != nil && origin.Line > 0 {
		originLine = origin.Line
	}
	lines := strings.Split(rawYAML, "\n")
	for i, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "schema:" || strings.HasPrefix(trimmed, "schema: ") {
			// Schema content starts on the line after "schema:"
			return originLine + i + 1
		}
	}
	return 1
}

// buildSchemaRegistry populates Site.SchemaRegistry from all collected model pages.
func (pp *PrintingPress) buildSchemaRegistry() {
	total := 0
	for _, pages := range pp.site.Models {
		total += len(pages)
	}
	registry := make(map[string]*SchemaRegistryEntry, total)
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			key := page.ComponentType + "/" + page.Name
			registry[key] = &SchemaRegistryEntry{
				Name:          page.Name,
				ComponentType: page.ComponentType,
				SchemaJSON:    page.SchemaJSON,
				MockJSON:      page.MockJSON,
			}
		}
	}
	pp.site.SchemaRegistry = registry
}

func ptrBool(b *bool) bool {
	if b == nil {
		return false
	}
	return *b
}
