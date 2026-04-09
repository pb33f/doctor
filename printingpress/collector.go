// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/url"
	"reflect"
	"sort"
	"strings"
	"unicode/utf8"

	"github.com/pb33f/doctor/diagramatron"
	v3 "github.com/pb33f/doctor/model/high/v3"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"github.com/pb33f/libopenapi/bundler"
	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	highv3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/libopenapi/renderer"
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
	if idx := strings.Index(ref, "#"); idx >= 0 {
		ref = ref[idx:]
	}
	parts := strings.SplitN(strings.TrimPrefix(ref, "#/components/"), "/", 2)
	if len(parts) != 2 {
		return nil
	}
	segment, name := decodeJSONPointerToken(parts[0]), decodeJSONPointerToken(parts[1])
	typeSlug, ok := refSegmentToTypeSlug[segment]
	if !ok {
		return nil
	}
	page, ok := pp.modelIndex[typeSlug+"/"+name]
	if !ok {
		return nil
	}
	return &ComponentLink{
		Name:          name,
		ComponentType: segment,
		TypeSlug:      typeSlug,
		Slug:          page.Slug,
	}
}

func decodeJSONPointerToken(token string) string {
	if decoded, err := url.PathUnescape(token); err == nil {
		token = decoded
	}
	token = strings.ReplaceAll(token, "~1", "/")
	token = strings.ReplaceAll(token, "~0", "~")
	return token
}

func collectLibopenapiServerVariables(
	variables *orderedmap.Map[string, *highv3.ServerVariable],
) []*ServerVariableInfo {
	if variables == nil || variables.Len() == 0 {
		return nil
	}
	result := make([]*ServerVariableInfo, 0, variables.Len())
	for pair := variables.First(); pair != nil; pair = pair.Next() {
		sv := pair.Value()
		if sv == nil {
			continue
		}
		info := &ServerVariableInfo{
			Name:        pair.Key(),
			Default:     sv.Default,
			Description: sv.Description,
		}
		if len(sv.Enum) > 0 {
			info.Enum = append(info.Enum, sv.Enum...)
		}
		result = append(result, info)
	}
	return result
}

func collectDoctorServerVariables(variables *orderedmap.Map[string, *v3.ServerVariable]) []*ServerVariableInfo {
	if variables == nil || variables.Len() == 0 {
		return nil
	}
	result := make([]*ServerVariableInfo, 0, variables.Len())
	for pair := variables.First(); pair != nil; pair = pair.Next() {
		sv := pair.Value()
		if sv == nil || sv.Value == nil {
			continue
		}
		info := &ServerVariableInfo{
			Name:        pair.Key(),
			Default:     sv.Value.Default,
			Description: sv.Value.Description,
		}
		if len(sv.Value.Enum) > 0 {
			info.Enum = append(info.Enum, sv.Value.Enum...)
		}
		result = append(result, info)
	}
	return result
}

func (pp *PrintingPress) collectSecurityGroups(
	requirements []*highbase.SecurityRequirement,
) ([]*SecurityRequirementGroup, []*SecurityRequirement) {
	if requirements == nil {
		return nil, nil
	}

	groups := make([]*SecurityRequirementGroup, 0, len(requirements))
	var flat []*SecurityRequirement

	for _, requirement := range requirements {
		group := &SecurityRequirementGroup{}
		if requirement != nil && requirement.Requirements != nil {
			for pair := requirement.Requirements.First(); pair != nil; pair = pair.Next() {
				req := pp.resolveSecurityRequirement(pair.Key(), pair.Value())
				group.Requirements = append(group.Requirements, req)
				flat = append(flat, req)
			}
		}
		groups = append(groups, group)
	}

	return groups, flat
}

// buildModelIndex creates an O(1) lookup map from "typeSlug/name" to ModelPage.
func (pp *PrintingPress) buildModelIndex() {
	total := 0
	for _, pages := range pp.site.Models {
		total += len(pages)
	}
	pp.modelIndex = make(map[string]*ModelPage, total)
	for typeSlug, pages := range pp.site.Models {
		for _, page := range pages {
			pp.modelIndex[typeSlug+"/"+page.Name] = page
		}
	}
}

// visitDocument collects all top-level document data: info, tags, servers, components, webhooks.
func (pp *PrintingPress) visitDocument(ctx context.Context, doc *v3.Document) {
	root := &RootPage{}

	if doc.Document != nil {
		if doc.Document.Info != nil {
			info := doc.Document.Info
			root.Title = info.Title
			if pp.engineConfig.Title != "" {
				root.Title = pp.engineConfig.Title
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
					Variables:   collectLibopenapiServerVariables(srv.Variables),
				})
			}
		}

		if doc.Document.ExternalDocs != nil {
			root.ExternalDoc = &ExternalDocInfo{
				URL:         doc.Document.ExternalDocs.URL,
				Description: doc.Document.ExternalDocs.Description,
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

	// Build model index for O(1) ref resolution
	pp.buildModelIndex()

	// Resolve global security AFTER model index is built (for O(1) lookup)
	if doc.Document != nil && doc.Document.Security != nil {
		root.SecurityGroups, root.Security = pp.collectSecurityGroups(doc.Document.Security)
	}

	// Build nav model groups from collected components
	pp.buildNavModelGroups()

	// Build schema registry for hover popovers
	pp.buildSchemaRegistry()

	// Visit paths to collect operations (can now resolve $refs to components)
	if doc.Paths != nil {
		pp.visitPaths(ctx, doc.Paths)
	}

	// assign operations to tags, or treat low-tag/high-volume specs as effectively untagged,
	// then auto-group untagged ops by path prefix and compute breadcrumbs.
	useSyntheticFallback := pp.shouldUseSyntheticTagFallback()
	pp.assignOperationsToTags(useSyntheticFallback)
	pp.autoGroupUntaggedOperations(useSyntheticFallback)
	pp.pruneEmptyTagGroups()
	pp.populateTagPaths()

	// Collect webhooks
	if doc.Webhooks != nil {
		pp.collectWebhooks(doc.Webhooks)
	}

	// Resolve response link operationId → slug after all operations/webhooks are collected
	pp.resolveOperationLinks()
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
			Name:        tag.Value.Name,
			Summary:     tag.Value.Summary,
			Slug:        pp.slugs.Register("tags", slugpkg.Sanitize(tag.Value.Name)),
			Description: tag.Value.Description,
			DescHTML:    renderMarkdown(tag.Value.Description),
			IsNavOnly:   strings.EqualFold(tag.Value.Kind, "nav"),
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
	// Resolve path item origin for multi-file source tracking
	var piOrigin *bundler.ComponentOrigin
	if pp.engineConfig.Origins != nil && pi.Value != nil && pi.Value.GoLow() != nil && pi.Value.GoLow().IsReference() {
		ref := pi.Value.GoLow().GetReference()
		if origin, ok := pp.engineConfig.Origins[ref]; ok {
			piOrigin = origin
		}
	}

	ops := pi.GetOperations()
	for pair := ops.First(); pair != nil; pair = pair.Next() {
		method := pair.Key()
		op := pair.Value()
		pp.collectOperation(method, path, op, pi, piOrigin)
	}
}

// collectOperation builds an OperationPage from a single operation.
func (pp *PrintingPress) collectOperation(method, path string, op *v3.Operation, pi *v3.PathItem, piOrigin *bundler.ComponentOrigin) {
	if op == nil || op.Value == nil {
		return
	}
	val := op.Value

	operationID := val.OperationId
	preferred := slugpkg.OperationSlug(method, path, operationID)
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

	// Compute the path item's bundled line for offset calculation
	var piBundledLine int
	if piOrigin != nil && pi.ValueNode != nil {
		piBundledLine = pi.ValueNode.Line
	}

	// Parameters (operation-level overrides path-level by name+in)
	page.Parameters = mergeOperationParameters(
		pp.collectParameters(op.Parameters, piOrigin, piBundledLine),
		pp.collectParameters(pi.Parameters, piOrigin, piBundledLine),
	)

	if len(page.Parameters) > 0 {
		page.ParametersJSON = render.MustJSON(page.Parameters)
	}

	// Request body
	if op.RequestBody != nil {
		page.RequestBody = pp.collectRequestBody(op.RequestBody, piOrigin, piBundledLine)
	}

	// Responses
	if op.Responses != nil {
		page.Responses = pp.collectResponses(op.Responses, piOrigin, piBundledLine)
	}

	if len(page.Responses) > 0 {
		page.CommonHeaders = computeCommonHeaders(page.Responses)
		if len(page.CommonHeaders) > 0 {
			page.CommonHeadersJSON = render.MustJSON(page.CommonHeaders)
		}
		page.ResponsesJSON = render.MustJSON(page.Responses)
	}

	// Servers
	if op.Servers != nil {
		for _, srv := range op.Servers {
			if srv.Value != nil {
				page.Servers = append(page.Servers, &ServerInfo{
					URL:         srv.Value.URL,
					Description: srv.Value.Description,
					Variables:   collectDoctorServerVariables(srv.Variables),
				})
			}
		}
	}

	// Security
	if op.Security != nil {
		page.HasSecurityOverride = true
		page.SecurityGroups, page.Security = pp.collectSecurityGroups(val.Security)
	}

	// External docs
	if op.ExternalDocs != nil && op.ExternalDocs.Value != nil {
		page.ExternalDoc = &ExternalDocInfo{
			URL:         op.ExternalDocs.Value.URL,
			Description: op.ExternalDocs.Value.Description,
		}
	}

	// Extensions
	page.Extensions = collectExtensions(val.Extensions)
	if page.Extensions != nil {
		page.ExtensionsJSON = render.MustJSON(page.Extensions)
	}

	// Path item extensions
	if pi != nil && pi.Value != nil {
		page.PathExtensions = collectExtensions(pi.Value.Extensions)
		if page.PathExtensions != nil {
			page.PathExtensionsJSON = render.MustJSON(page.PathExtensions)
		}
	}

	// Callbacks
	if op.Callbacks != nil {
		page.Callbacks = pp.collectCallbacks(op.Callbacks)
		if len(page.Callbacks) > 0 {
			page.CallbacksJSON = render.MustJSON(page.Callbacks)
		}
	}

	// Serialize full operation to YAML + JSON for cowboy-components and raw viewer
	pp.captureRawData(val, fmt.Sprintf("%s %s", method, path),
		&page.RawYAML, &page.SchemaJSON, nil)

	// Use ValueNode line only for single-file specs; for multi-file bundled specs
	// the line refers to the bundled output, not the original source file.
	if op.ValueNode != nil && (pp.engineConfig.Origins == nil || len(pp.engineConfig.Origins) == 0) {
		page.SourceLine = op.ValueNode.Line
	}

	if piOrigin != nil && piOrigin.OriginalFile != "" {
		page.Location = pp.formatLocation(piOrigin)
		if piOrigin.Line > 0 {
			page.SourceLine = piOrigin.Line
		}
	}

	pp.site.Operations = append(pp.site.Operations, page)
}

func (pp *PrintingPress) collectParameters(params []*v3.Parameter, piOrigin *bundler.ComponentOrigin, piBundledLine int) []*ParameterInfo {
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
			pi.SourceLine = pp.computeOriginalLine(p.ValueNode.Line, piOrigin, piBundledLine)
		}
		if loc, _ := pp.resolveObjectOrigin(p.Value.GoLow(), piOrigin); loc != "" {
			pi.Location = loc
		}
		if low := p.Value.GoLow(); low != nil && low.IsReference() {
			if link := pp.resolveComponentLink(low.GetReference()); link != nil {
				pi.Ref = link
			}
		}
		var paramSchema *highbase.Schema
		if p.Value.Schema != nil {
			paramSchema = p.Value.Schema.Schema()
			if paramSchema != nil {
				jsonStr, err := paramSchema.MarshalJSON()
				if err == nil {
					pi.SchemaJSON = string(jsonStr)
				}
			}
		}
		if isComplexSchema(paramSchema) {
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
		pi.Extensions = collectExtensions(p.Value.Extensions)
		result = append(result, pi)
	}
	return result
}

func mergeOperationParameters(operationParams, pathParams []*ParameterInfo) []*ParameterInfo {
	if len(operationParams) == 0 && len(pathParams) == 0 {
		return nil
	}

	merged := make([]*ParameterInfo, 0, len(operationParams)+len(pathParams))
	seen := make(map[string]struct{}, len(operationParams)+len(pathParams))

	appendUnique := func(params []*ParameterInfo) {
		for _, param := range params {
			if param == nil {
				continue
			}
			key := param.Name + "\x00" + strings.ToLower(param.In)
			if _, ok := seen[key]; ok {
				continue
			}
			seen[key] = struct{}{}
			merged = append(merged, param)
		}
	}

	appendUnique(operationParams)
	appendUnique(pathParams)
	return merged
}

func (pp *PrintingPress) collectRequestBody(rb *v3.RequestBody, piOrigin *bundler.ComponentOrigin, piBundledLine int) *RequestBodyInfo {
	if rb.Value == nil {
		return nil
	}
	val := rb.Value
	rbi := &RequestBodyInfo{
		Description: val.Description,
		DescHTML:    renderMarkdown(val.Description),
		Required:    ptrBool(val.Required),
	}
	pp.captureRawData(val, "requestBody", &rbi.RawYAML, &rbi.RawJSON, nil)
	if rb.ValueNode != nil {
		rbi.SourceLine = pp.computeOriginalLine(rb.ValueNode.Line, piOrigin, piBundledLine)
	}
	if loc, _ := pp.resolveObjectOrigin(val.GoLow(), piOrigin); loc != "" {
		rbi.Location = loc
	}
	rbi.Extensions = collectExtensions(val.Extensions)
	if rbi.Extensions != nil {
		rbi.ExtensionsJSON = render.MustJSON(rbi.Extensions)
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
	// Use DrDocument's SchemaProxy field (not Value.Schema).
	// Hoist sch to function scope so it's available for XML rendering and complexity check.
	var sch *highbase.Schema
	if mt.SchemaProxy != nil && mt.SchemaProxy.Value != nil {
		if mt.SchemaProxy.Value.IsReference() {
			mti.SchemaRef = pp.resolveComponentLink(mt.SchemaProxy.Value.GetReference())
		}
		sch = mt.SchemaProxy.Value.Schema()
		if sch != nil {
			// Detect array schemas with $ref items (e.g. type: array, items: $ref: ...)
			if len(sch.Type) > 0 && sch.Type[0] == "array" && sch.Items != nil && sch.Items.IsA() {
				mti.IsArray = true
				if sch.Items.A.IsReference() {
					mti.ItemsRef = pp.resolveComponentLink(sch.Items.A.GetReference())
				}
				// Resolve items schema so the UI can render its properties
				if itemsSch := sch.Items.A.Schema(); itemsSch != nil {
					mti.ItemsSchemaJSON = pp.captureSchemaJSON(itemsSch)
				}
			}
			mti.SchemaJSON = pp.captureSchemaJSON(sch)
		}
	}
	lang := mockLanguageForMediaType(mediaTypeName)

	if mt.Examples != nil {
		mti.Examples = make(map[string]string)
		for pair := mt.Examples.First(); pair != nil; pair = pair.Next() {
			ex := pair.Value()
			if ex == nil || ex.Value == nil {
				continue
			}
			yamlBytes, err := ex.Value.Render()
			if err != nil {
				continue
			}
			switch lang {
			case "yaml":
				mti.Examples[pair.Key()] = string(yamlBytes)
			case "xml":
				var decoded any
				if yaml.Unmarshal(yamlBytes, &decoded) != nil {
					continue
				}
				if s, ok := decoded.(string); ok && strings.HasPrefix(strings.TrimSpace(s), "<") {
					mti.Examples[pair.Key()] = s
				} else {
					// TODO: awaiting renderer.XML / RenderXML support in libopenapi
					_ = decoded
				}
			default:
				jsonStr, jsonErr := yamlToJSON(yamlBytes)
				if jsonErr == nil {
					mti.Examples[pair.Key()] = jsonStr
				}
			}
		}
	}
	if isComplexSchema(sch) {
		mti.MockJSON = pp.generateMockAs(mt.Value, "json")
		switch lang {
		case "yaml":
			mti.MockYAML = pp.generateMockAs(mt.Value, "yaml")
		case "xml":
			mti.MockXML = pp.generateMockAs(mt.Value, "xml")
		}
	}
	mti.Extensions = collectExtensions(mt.Value.Extensions)
	return mti
}

func (pp *PrintingPress) captureSchemaJSON(schema *highbase.Schema) string {
	if schema == nil {
		return ""
	}
	if pp.schemaArtifacts != nil {
		if artifact, ok := pp.schemaArtifacts.getByIdentity(schema); ok {
			return pp.schemaArtifacts.snapshot(artifact).jsonStr
		}
	}
	jsonBytes, err := schema.MarshalJSON()
	if err != nil {
		return ""
	}
	jsonStr := string(jsonBytes)
	if pp.schemaArtifacts == nil {
		return jsonStr
	}
	if artifact, ok := pp.schemaArtifacts.getByContent(jsonStr); ok {
		artifact = pp.schemaArtifacts.store(schema, artifact)
		return pp.schemaArtifacts.snapshot(artifact).jsonStr
	}
	artifact := pp.schemaArtifacts.store(schema, &schemaArtifact{jsonStr: jsonStr})
	return pp.schemaArtifacts.snapshot(artifact).jsonStr
}

func (pp *PrintingPress) captureSchemaHighlight(schema *highbase.Schema) string {
	if schema == nil {
		return ""
	}
	jsonStr := pp.captureSchemaJSON(schema)
	if jsonStr == "" {
		return ""
	}
	if pp.schemaArtifacts == nil {
		highlighted, _ := highlightJSON(prettyJSON(jsonStr))
		return highlighted
	}
	artifact, ok := pp.schemaArtifacts.getByIdentity(schema)
	if !ok {
		artifact, ok = pp.schemaArtifacts.getByContent(jsonStr)
		if !ok {
			artifact = pp.schemaArtifacts.store(schema, &schemaArtifact{jsonStr: jsonStr})
		} else {
			artifact = pp.schemaArtifacts.store(schema, artifact)
		}
	}
	pp.schemaArtifacts.ensureHighlight(artifact)
	return pp.schemaArtifacts.snapshot(artifact).highlightHTML
}

func (pp *PrintingPress) collectResponses(responses *v3.Responses, piOrigin *bundler.ComponentOrigin, piBundledLine int) []*ResponseInfo {
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
			DescHTML:    renderMarkdown(resp.Value.Description),
		}
		pp.captureRawData(resp.Value, code, &ri.RawYAML, &ri.RawJSON, nil)
		if resp.ValueNode != nil {
			ri.SourceLine = pp.computeOriginalLine(resp.ValueNode.Line, piOrigin, piBundledLine)
		}
		if loc, _ := pp.resolveObjectOrigin(resp.Value.GoLow(), piOrigin); loc != "" {
			ri.Location = loc
		}
		ri.Extensions = collectExtensions(resp.Value.Extensions)
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
				hi.Extensions = collectExtensions(h.Value.Extensions)
				ri.Headers = append(ri.Headers, hi)
			}
		}
		if resp.Links != nil {
			for lPair := resp.Links.First(); lPair != nil; lPair = lPair.Next() {
				l := lPair.Value()
				if l == nil || l.Value == nil {
					continue
				}
				li := &LinkInfo{
					Name:         lPair.Key(),
					OperationId:  l.Value.OperationId,
					OperationRef: l.Value.OperationRef,
					Description:  l.Value.Description,
				}
				if low := l.Value.GoLow(); low != nil && low.IsReference() {
					if link := pp.resolveComponentLink(low.GetReference()); link != nil {
						li.Ref = link
					}
				}
				ri.Links = append(ri.Links, li)
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
	var mermaidCfg *diagramatron.MermaidConfig
	if !pp.engineConfig.NoMermaid {
		mermaidCfg = diagramatron.DefaultMermaidConfig()
	}
	for pair := schemas.First(); pair != nil; pair = pair.Next() {
		name := pair.Key()
		sp := pair.Value()
		preferred := slugpkg.Sanitize(name)
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
				&page.RawYAML, &page.SchemaJSON, nil)
			if isComplexSchema(sp.Schema.Value) {
				page.MockJSON = pp.generateMock(sp.Schema.Value)
				if mermaidCfg != nil {
					diagram := diagramatron.Mermaidify(context.Background(), sp, mermaidCfg)
					if len(diagram.Relationships) > 0 {
						page.MermaidDiagram = diagram.Render()
					}
				}
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
			page.HasExamplePayload = true
			page.ExamplesJSON = render.MustJSON(struct {
				MockJSON string            `json:"mockJson,omitempty"`
				Examples map[string]string `json:"examples,omitempty"`
			}{page.MockJSON, page.Examples})
		}
		applyModelLayoutHints(page)

		page.Origin = pp.resolveOrigin("schemas", name)

		if sp.Schema != nil && sp.Schema.Value != nil && sp.Schema.Value.Extensions != nil {
			page.Extensions = collectExtensions(sp.Schema.Value.Extensions)
			if page.Extensions != nil {
				page.ExtensionsJSON = render.MustJSON(page.Extensions)
			}
		}

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
	if pp.rawArtifacts != nil {
		if artifact, ok := pp.rawArtifacts.getByIdentity(renderable); ok {
			if highlightedHTML != nil {
				pp.rawArtifacts.ensureHighlight(artifact)
			}
			snapshot := pp.rawArtifacts.snapshot(artifact)
			*rawYAML = snapshot.rawYAML
			*schemaJSON = snapshot.schemaJSON
			if highlightedHTML != nil {
				*highlightedHTML = snapshot.highlightHTML
			}
			return
		}
	}

	yamlBytes, err := renderable.Render()
	if err != nil {
		pp.warn("failed to render to YAML", context, err)
		return
	}

	normalizedYAML := normalizeArtifactYAML(yamlBytes)
	if pp.rawArtifacts != nil {
		if artifact, ok := pp.rawArtifacts.getByContent(normalizedYAML); ok {
			artifact = pp.rawArtifacts.store(renderable, artifact)
			if highlightedHTML != nil {
				pp.rawArtifacts.ensureHighlight(artifact)
			}
			snapshot := pp.rawArtifacts.snapshot(artifact)
			*rawYAML = snapshot.rawYAML
			*schemaJSON = snapshot.schemaJSON
			if highlightedHTML != nil {
				*highlightedHTML = snapshot.highlightHTML
			}
			return
		}
	}

	*rawYAML = normalizedYAML
	jsonStr, jsonErr := yamlToJSON(yamlBytes)
	if jsonErr != nil {
		pp.warn("failed to convert YAML to JSON", context, jsonErr)
		return
	}
	*schemaJSON = jsonStr
	var artifact *rawArtifact
	if pp.rawArtifacts != nil {
		artifact = pp.rawArtifacts.store(renderable, &rawArtifact{
			rawYAML:    normalizedYAML,
			schemaJSON: jsonStr,
		})
	}
	if highlightedHTML != nil {
		if artifact != nil {
			pp.rawArtifacts.ensureHighlight(artifact)
			*highlightedHTML = pp.rawArtifacts.snapshot(artifact).highlightHTML
		} else {
			*highlightedHTML, _ = highlightJSON(prettyJSON(jsonStr))
		}
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
		preferred := slugpkg.Sanitize(name)
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
				&page.RawYAML, &page.SchemaJSON, nil)
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
					page.HasExamplePayload = true
					page.ExamplesJSON = render.MustJSON(struct {
						Examples map[string]string `json:"examples,omitempty"`
					}{page.Examples})
				}
			}
		}
		if page.MockJSON != "" {
			page.HasExamplePayload = true
		}
		applyModelLayoutHints(page)

		page.Origin = pp.resolveOrigin(componentType, name)

		if page.SchemaRawYAML != "" && page.RawYAML != "" {
			page.SchemaStartLine = computeSchemaStartLine(page.RawYAML, page.Origin)
		}

		// Collect extensions from the underlying value via reflection of the Extensions field
		if v := val.GetValue(); v != nil {
			rv := reflect.ValueOf(v)
			if rv.Kind() == reflect.Ptr {
				rv = rv.Elem()
			}
			if rv.Kind() == reflect.Struct {
				if f := rv.FieldByName("Extensions"); f.IsValid() && (f.Kind() == reflect.Ptr || f.Kind() == reflect.Map || f.Kind() == reflect.Interface) && !f.IsNil() {
					if ext, ok := f.Interface().(*orderedmap.Map[string, *yaml.Node]); ok {
						page.Extensions = collectExtensions(ext)
						if page.Extensions != nil {
							page.ExtensionsJSON = render.MustJSON(page.Extensions)
						}
					}
				}
			}
		}

		pp.site.Models[typeSlug] = append(pp.site.Models[typeSlug], page)
	}
}

// collectWebhooks collects webhook path items as operations, reusing collectOperation
// for feature parity (extensions, parameters, responses, etc.) then moving results
// from site.Operations to site.Webhooks.
func (pp *PrintingPress) collectWebhooks(webhooks *orderedmap.Map[string, *v3.PathItem]) {
	before := len(pp.site.Operations)
	for pair := webhooks.First(); pair != nil; pair = pair.Next() {
		pi := pair.Value()
		pp.collectPathItemOperations(pair.Key(), pi)
	}
	// Move newly added operations to Webhooks
	pp.site.Webhooks = append(pp.site.Webhooks, pp.site.Operations[before:]...)
	pp.site.Operations = pp.site.Operations[:before]

	// Build webhook nav entries from all collected webhooks
	for _, wh := range pp.site.Webhooks {
		pp.site.NavWebhooks = append(pp.site.NavWebhooks, &NavOperation{
			Method:      wh.Method,
			Path:        wh.Path,
			OperationID: wh.OperationID,
			Summary:     wh.Summary,
			Slug:        wh.Slug,
			Deprecated:  wh.Deprecated,
		})
	}
	pp.site.Root.Webhooks = pp.site.NavWebhooks
}

// collectCallbacks collects operation-level callbacks into structured CallbackInfo entries.
func (pp *PrintingPress) collectCallbacks(callbacks *orderedmap.Map[string, *v3.Callback]) []*CallbackInfo {
	var result []*CallbackInfo
	for pair := callbacks.First(); pair != nil; pair = pair.Next() {
		cb := pair.Value()
		if cb == nil {
			continue
		}
		ci := &CallbackInfo{Name: pair.Key()}

		// Resolve $ref to component callback
		if cb.Value != nil && cb.Value.GoLow() != nil && cb.Value.GoLow().IsReference() {
			if link := pp.resolveComponentLink(cb.Value.GoLow().GetReference()); link != nil {
				ci.Ref = link
			}
		}

		// Iterate expressions → path items → operations
		if cb.Expression != nil {
			for exprPair := cb.Expression.First(); exprPair != nil; exprPair = exprPair.Next() {
				expression := exprPair.Key()
				pi := exprPair.Value()
				if pi == nil {
					continue
				}
				ops := pi.GetOperations()
				for opPair := ops.First(); opPair != nil; opPair = opPair.Next() {
					method := opPair.Key()
					op := opPair.Value()
					if op == nil || op.Value == nil {
						continue
					}
					coi := &CallbackOperationInfo{
						Expression:  expression,
						Method:      strings.ToUpper(method),
						Description: op.Value.Description,
						DescHTML:    renderMarkdown(op.Value.Description),
					}
					if op.RequestBody != nil {
						coi.RequestBody = pp.collectRequestBody(op.RequestBody, nil, 0)
					}
					if op.Responses != nil {
						coi.Responses = pp.collectResponses(op.Responses, nil, 0)
					}
					ci.Operations = append(ci.Operations, coi)
				}
			}
		}
		if len(ci.Operations) > 0 || ci.Ref != nil {
			result = append(result, ci)
		}
	}
	return result
}

// resolveOperationLinks builds an operationId→slug index from all operations and webhooks,
// then fills in OperationSlug on every response LinkInfo that has an operationId.
func (pp *PrintingPress) resolveOperationLinks() {
	// Build operationId → slug index
	opIndex := make(map[string]string)
	for _, op := range pp.site.Operations {
		if op.OperationID != "" {
			opIndex[op.OperationID] = op.Slug
		}
	}
	for _, wh := range pp.site.Webhooks {
		if wh.OperationID != "" {
			opIndex[wh.OperationID] = wh.Slug
		}
	}
	if len(opIndex) == 0 {
		return
	}

	// Resolve links across all operations and webhooks
	for _, op := range pp.allOperations() {
		resolved := false
		for _, resp := range op.Responses {
			for _, li := range resp.Links {
				if li.OperationId != "" {
					if slug, ok := opIndex[li.OperationId]; ok {
						li.OperationSlug = slug
						resolved = true
					}
				}
			}
		}
		// Re-serialize ResponsesJSON since it was frozen before slug resolution
		if resolved && len(op.Responses) > 0 {
			op.ResponsesJSON = render.MustJSON(op.Responses)
		}
	}
}

func (pp *PrintingPress) shouldUseSyntheticTagFallback() bool {
	if !pp.syntheticTags.Enabled {
		return false
	}
	if len(pp.site.Operations) < pp.syntheticTags.MinOperations {
		return false
	}

	distinctTags := make(map[string]struct{})
	for _, op := range pp.site.Operations {
		for _, tagName := range op.Tags {
			if tagName == "" {
				continue
			}
			distinctTags[tagName] = struct{}{}
			if len(distinctTags) > pp.syntheticTags.MaxDistinctTags {
				return false
			}
		}
	}
	return len(distinctTags) > 0 && len(distinctTags) <= pp.syntheticTags.MaxDistinctTags
}

func (pp *PrintingPress) pruneEmptyTagGroups() {
	pruned := pruneEmptyNavTags(pp.site.NavTags)
	pp.site.NavTags = pruned
	if pp.site.Root != nil {
		pp.site.Root.TagTree = pruned
	}
}

func pruneEmptyNavTags(tags []*NavTag) []*NavTag {
	if len(tags) == 0 {
		return nil
	}

	pruned := make([]*NavTag, 0, len(tags))
	for _, tag := range tags {
		if tag == nil {
			continue
		}
		tag.Children = pruneEmptyNavTags(tag.Children)
		if len(tag.Operations) == 0 && len(tag.Children) == 0 {
			continue
		}
		pruned = append(pruned, tag)
	}
	if len(pruned) == 0 {
		return nil
	}
	return pruned
}

// assignOperationsToTags distributes operations into the NavTag tree by matching tag names.
func (pp *PrintingPress) assignOperationsToTags(forceSynthetic bool) {
	pp.site.Root.UntaggedOperations = nil
	if forceSynthetic {
		pp.site.NavTags = nil
		pp.site.Root.TagTree = nil
		for _, op := range pp.site.Operations {
			pp.site.Root.UntaggedOperations = append(pp.site.Root.UntaggedOperations, &NavOperation{
				Method:      op.Method,
				Path:        op.Path,
				OperationID: op.OperationID,
				Summary:     op.Summary,
				Slug:        op.Slug,
				Deprecated:  op.Deprecated,
			})
		}
		return
	}

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
		matched := false
		for _, tagName := range op.Tags {
			if nt, ok := tagLookup[tagName]; ok {
				nt.Operations = append(nt.Operations, navOp)
				matched = true
			}
		}
		if !matched {
			pp.site.Root.UntaggedOperations = append(pp.site.Root.UntaggedOperations, navOp)
		}
	}
}

// populateTagPaths sets TagPath on each OperationPage by walking the NavTag tree
// to find the full hierarchy from root to the operation's matched tag.
func (pp *PrintingPress) populateTagPaths() {
	// single walk: build parent map, summary map, and slug map
	parentMap := make(map[string]string)
	summaryMap := make(map[string]string)
	slugMap := make(map[string]string)
	var walk func([]*NavTag)
	walk = func(tags []*NavTag) {
		for _, tag := range tags {
			if tag.Summary != "" {
				summaryMap[tag.Name] = tag.Summary
			} else {
				summaryMap[tag.Name] = tag.Name
			}
			slugMap[tag.Name] = tag.Slug
			for _, child := range tag.Children {
				parentMap[child.Name] = tag.Name
			}
			walk(tag.Children)
		}
	}
	walk(pp.site.NavTags)

	for _, op := range pp.site.Operations {
		if len(op.Tags) == 0 {
			continue
		}
		// Use the first tag to build the path
		tagName := op.Tags[0]
		var path []string
		var slugs []string
		for cur := tagName; cur != ""; cur = parentMap[cur] {
			path = append(path, summaryMap[cur])
			slugs = append(slugs, slugMap[cur])
		}
		// Reverse to get root-first order
		for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
			path[i], path[j] = path[j], path[i]
			slugs[i], slugs[j] = slugs[j], slugs[i]
		}
		op.TagPath = path
		op.TagSlugs = slugs
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
			Name:         def.name,
			TypeSlug:     def.typeSlug,
			CardMinWidth: computeNavModelGroupCardMinWidth(pages),
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

func computeNavModelGroupCardMinWidth(pages []*ModelPage) int {
	const (
		baseWidthPx    = 250
		maxWidthPx     = 420
		basePaddingPx  = 120
		perCharWidthPx = 8
		avgBiasChars   = 6
		maxBiasChars   = 16
	)

	if len(pages) == 0 {
		return baseWidthPx
	}

	var totalLen int
	var maxLen int
	var counted int
	for _, page := range pages {
		if page == nil {
			continue
		}
		nameLen := utf8.RuneCountInString(page.Name)
		totalLen += nameLen
		counted++
		if nameLen > maxLen {
			maxLen = nameLen
		}
	}
	if counted == 0 || totalLen == 0 {
		return baseWidthPx
	}

	avgLen := float64(totalLen) / float64(counted)
	targetChars := math.Max(
		avgLen+avgBiasChars,
		math.Min(float64(maxLen), avgLen+maxBiasChars),
	)
	width := basePaddingPx + int(math.Ceil(targetChars))*perCharWidthPx
	if width < baseWidthPx {
		return baseWidthPx
	}
	if width > maxWidthPx {
		return maxWidthPx
	}
	return width
}

// generateMock produces a pretty-printed JSON mock from any mockable object.
func (pp *PrintingPress) generateMock(mockable any) string {
	if schema, ok := mockable.(*highbase.Schema); ok {
		return pp.generateSchemaMockAs(schema, "json")
	}
	mock, err := pp.safeGenerateMock(pp.mockGen, mockable, "")
	if err != nil || mock == nil {
		return ""
	}
	return string(mock)
}

// generateMockAs produces a mock in the specified language format.
func (pp *PrintingPress) generateMockAs(mockable any, lang string) string {
	if schema, ok := mockable.(*highbase.Schema); ok {
		return pp.generateSchemaMockAs(schema, lang)
	}
	var gen *renderer.MockGenerator
	switch lang {
	case "yaml":
		gen = pp.mockGenYAML
	case "xml":
		gen = pp.mockGenXML
	default:
		gen = pp.mockGen
	}
	if gen == nil {
		return ""
	}
	mock, err := pp.safeGenerateMock(gen, mockable, "")
	if err != nil || mock == nil {
		return ""
	}
	return string(mock)
}

type schemaMockable struct {
	Example  *yaml.Node
	Examples *orderedmap.Map[string, *highbase.Example]
	Schema   *highbase.Schema
}

func (pp *PrintingPress) generateSchemaMockAs(schema *highbase.Schema, lang string) string {
	if schema == nil {
		return ""
	}

	mockable := &schemaMockable{
		Example: schema.Example,
		Schema:  schema,
	}
	if len(schema.Examples) > 0 {
		examples := orderedmap.New[string, *highbase.Example]()
		for i, node := range schema.Examples {
			if node == nil {
				continue
			}
			examples.Set(fmt.Sprintf("%d", i), &highbase.Example{Value: node})
		}
		if examples.Len() > 0 {
			mockable.Examples = examples
		}
	}

	var gen *renderer.MockGenerator
	switch lang {
	case "yaml":
		gen = pp.mockGenYAML
	case "xml":
		gen = pp.mockGenXML
	default:
		gen = pp.mockGen
	}
	if gen == nil {
		return ""
	}
	mock, err := pp.safeGenerateMock(gen, mockable, "")
	if err != nil || mock == nil {
		return ""
	}
	return string(mock)
}

func (pp *PrintingPress) safeGenerateMock(gen *renderer.MockGenerator, mockable any, label string) (mock []byte, err error) {
	if gen == nil {
		return nil, nil
	}
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("mock generation panic")
			if pp != nil {
				pp.warn("mock generation failed; omitting generated mock", label, fmt.Errorf("%v", r))
			}
			mock = nil
		}
	}()
	return gen.GenerateMock(mockable, "")
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

// computeOriginalLine converts a bundled spec line number to the original file
// line number using the path item origin offset. For single-file specs (no piOrigin),
// the bundled line IS the original line.
func (pp *PrintingPress) computeOriginalLine(bundledLine int, piOrigin *bundler.ComponentOrigin, piBundledLine int) int {
	if piOrigin == nil || piBundledLine == 0 {
		return bundledLine
	}
	return piOrigin.Line + (bundledLine - piBundledLine) - 1
}

// formatLocation strips the SpecRoot prefix from an origin's file path so rendered
// paths are relative (e.g. "schemas/user.yaml" not "/home/user/project/api-spec/schemas/user.yaml").
func (pp *PrintingPress) formatLocation(origin *bundler.ComponentOrigin) string {
	loc := origin.OriginalFile
	if pp.engineConfig.SpecRoot != "" && strings.HasPrefix(loc, pp.engineConfig.SpecRoot) {
		loc = strings.TrimPrefix(loc, pp.engineConfig.SpecRoot)
		loc = strings.TrimPrefix(loc, "/")
	}
	return loc
}

// resolveObjectOrigin resolves the source file and line number for a sub-object
// (response, parameter, request body) within an operation. It checks if the object
// itself is a $ref with its own origin, then falls back to the path item origin.
func (pp *PrintingPress) resolveObjectOrigin(
	low interface {
		IsReference() bool
		GetReference() string
	},
	piOrigin *bundler.ComponentOrigin,
) (location string, sourceLine int) {
	if pp.engineConfig.Origins != nil && low != nil && low.IsReference() {
		ref := low.GetReference()
		if origin, ok := pp.engineConfig.Origins[ref]; ok && origin != nil {
			return pp.formatLocation(origin), origin.Line
		}
	}
	// fall back to path item origin — file is correct but we don't know the
	// exact line for inline objects, so return 0
	if piOrigin != nil && piOrigin.OriginalFile != "" {
		return pp.formatLocation(piOrigin), 0
	}
	return "", 0
}

// resolveOrigin looks up a component origin and strips the SpecRoot prefix from OriginalFile.
func (pp *PrintingPress) resolveOrigin(componentType, name string) *bundler.ComponentOrigin {
	if pp.engineConfig.Origins == nil {
		return nil
	}
	key := slugpkg.ComponentKey(componentType, name)
	origin, ok := pp.engineConfig.Origins[key]
	if !ok || origin == nil {
		return nil
	}
	cp := *origin
	cp.OriginalFile = pp.formatLocation(origin)
	return &cp
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
				Description:   page.Description,
				SchemaJSON:    page.SchemaJSON,
				MockJSON:      page.MockJSON,
			}
		}
	}
	pp.site.SchemaRegistry = registry
}

// resolveSecurityRequirement builds a SecurityRequirement with type info and model page link.
func (pp *PrintingPress) resolveSecurityRequirement(name string, scopes []string) *SecurityRequirement {
	req := &SecurityRequirement{
		Name:   name,
		Scopes: scopes,
	}
	// O(1) lookup via model index
	page := pp.modelIndex["security/"+name]
	if page != nil && page.SchemaJSON != "" {
		req.Ref = &ComponentLink{
			Name:          page.Name,
			ComponentType: "securitySchemes",
			TypeSlug:      page.TypeSlug,
			Slug:          page.Slug,
		}
		var schema map[string]any
		if json.Unmarshal([]byte(page.SchemaJSON), &schema) == nil {
			if t, ok := schema["type"].(string); ok {
				req.SchemeType = t
			}
			if in, ok := schema["in"].(string); ok {
				req.In = in
			}
			if parameterName, ok := schema["name"].(string); ok {
				req.ParameterName = parameterName
			}
			if s, ok := schema["scheme"].(string); ok {
				req.Scheme = s
			}
		}
	}
	return req
}

// collectExtensions converts an orderedmap of extension yaml.Nodes to an ordered slice.
// Returns nil when there are no extensions (so omitempty works).
// The "x-" prefix is stripped from keys for cleaner documentation display.
func collectExtensions(extensions *orderedmap.Map[string, *yaml.Node]) []*ExtensionEntry {
	if extensions == nil || extensions.Len() == 0 {
		return nil
	}
	result := make([]*ExtensionEntry, 0, extensions.Len())
	for pair := extensions.First(); pair != nil; pair = pair.Next() {
		if pair.Value() == nil {
			continue
		}
		var decoded any
		if err := pair.Value().Decode(&decoded); err == nil {
			result = append(result, &ExtensionEntry{
				Key:   strings.TrimPrefix(pair.Key(), "x-"),
				Value: decoded,
			})
		}
	}
	return result
}

func ptrBool(b *bool) bool {
	if b == nil {
		return false
	}
	return *b
}

// autoGroupUntaggedOperations creates synthetic NavTag entries from path prefixes
// for operations that have no tags, giving them sidebar navigation.
// Groups with 2+ distinct second-level segments get parent/child hierarchy.
// If a path prefix matches an existing tag name, operations merge into that tag.
func (pp *PrintingPress) autoGroupUntaggedOperations(forceSynthetic bool) {
	untagged := pp.site.Root.UntaggedOperations
	if len(untagged) == 0 {
		return
	}

	// Build lookup of existing tags to merge into (avoids duplicate groups
	// when a spec has some tagged + some untagged operations under the same prefix)
	existingTags := make(map[string]*NavTag)
	var walkExisting func([]*NavTag)
	walkExisting = func(tags []*NavTag) {
		for _, tag := range tags {
			existingTags[tag.Name] = tag
			walkExisting(tag.Children)
		}
	}
	walkExisting(pp.site.NavTags)

	// Phase 1: Bucket operations by L1 key, then by L2 key within each L1
	type opBucket struct {
		l2Ops map[string][]*NavOperation
		order []string
	}
	l1Buckets := make(map[string]*opBucket)
	var l1Order []string

	for _, op := range untagged {
		l1, l2 := extractPathGroups(op.Path)
		bucket, exists := l1Buckets[l1]
		if !exists {
			bucket = &opBucket{l2Ops: make(map[string][]*NavOperation)}
			l1Buckets[l1] = bucket
			l1Order = append(l1Order, l1)
		}
		if _, l2Exists := bucket.l2Ops[l2]; !l2Exists {
			bucket.order = append(bucket.order, l2)
		}
		bucket.l2Ops[l2] = append(bucket.l2Ops[l2], op)
	}

	sort.Strings(l1Order)

	// Phase 2: Build NavTags — flat or hierarchical based on L2 diversity
	type tagAssignment struct {
		l1Key string
		l2Key string
	}
	slugAssign := make(map[string]tagAssignment)

	for _, l1Key := range l1Order {
		bucket := l1Buckets[l1Key]

		// If an existing tag matches this L1 key, merge operations into it
		if existing, ok := existingTags[l1Key]; ok {
			for _, l2Key := range bucket.order {
				existing.Operations = append(existing.Operations, bucket.l2Ops[l2Key]...)
			}
			for _, l2Key := range bucket.order {
				for _, op := range bucket.l2Ops[l2Key] {
					slugAssign[op.Slug] = tagAssignment{l1Key, ""}
				}
			}
			continue
		}

		// Count distinct non-empty L2 keys
		distinctL2 := 0
		for _, k := range bucket.order {
			if k != "" {
				distinctL2++
			}
		}

		if distinctL2 >= 2 {
			// Hierarchical: parent tag with child tags
			parent := &NavTag{
				Name:    l1Key,
				Summary: pathGroupDisplayName(l1Key),
				Slug:    pp.slugs.Register("tags", slugpkg.Sanitize(l1Key)),
			}

			sortedL2 := make([]string, len(bucket.order))
			copy(sortedL2, bucket.order)
			sort.Strings(sortedL2)

			for _, l2Key := range sortedL2 {
				ops := bucket.l2Ops[l2Key]
				childName := l1Key + "/" + l2Key
				if l2Key == "" {
					parent.Operations = append(parent.Operations, ops...)
					for _, op := range ops {
						slugAssign[op.Slug] = tagAssignment{l1Key, ""}
					}
					continue
				}
				child := &NavTag{
					Name:       childName,
					Summary:    pathGroupDisplayName(l2Key),
					Slug:       pp.slugs.Register("tags", slugpkg.Sanitize(childName)),
					Operations: ops,
				}
				parent.Children = append(parent.Children, child)
				for _, op := range ops {
					slugAssign[op.Slug] = tagAssignment{l1Key, l2Key}
				}
			}

			pp.site.NavTags = append(pp.site.NavTags, parent)
			pp.site.Root.TagTree = append(pp.site.Root.TagTree, parent)
		} else {
			// Flat: single tag for all operations in this L1 group
			var allOps []*NavOperation
			for _, l2Key := range bucket.order {
				allOps = append(allOps, bucket.l2Ops[l2Key]...)
			}
			nt := &NavTag{
				Name:       l1Key,
				Summary:    pathGroupDisplayName(l1Key),
				Slug:       pp.slugs.Register("tags", slugpkg.Sanitize(l1Key)),
				Operations: allOps,
			}
			pp.site.NavTags = append(pp.site.NavTags, nt)
			pp.site.Root.TagTree = append(pp.site.Root.TagTree, nt)
			for _, op := range allOps {
				slugAssign[op.Slug] = tagAssignment{l1Key, ""}
			}
		}
	}

	// Phase 3: Set synthetic tags on OperationPages so populateTagPaths() builds breadcrumbs
	for _, op := range pp.site.Operations {
		if !forceSynthetic && len(op.Tags) > 0 {
			continue
		}
		if assign, ok := slugAssign[op.Slug]; ok {
			if assign.l2Key != "" {
				op.Tags = []string{assign.l1Key + "/" + assign.l2Key}
			} else {
				op.Tags = []string{assign.l1Key}
			}
		}
	}

	pp.site.Root.UntaggedOperations = nil
}

// extractPathGroups returns the first two meaningful path segments,
// skipping version prefixes (v1, v2, ...) and path parameters ({id}).
func extractPathGroups(path string) (string, string) {
	parts := strings.Split(strings.TrimPrefix(path, "/"), "/")
	var meaningful []string
	for _, p := range parts {
		if p == "" || strings.HasPrefix(p, "{") {
			continue
		}
		if len(p) >= 2 && p[0] == 'v' && p[1] >= '0' && p[1] <= '9' {
			continue
		}
		meaningful = append(meaningful, p)
		if len(meaningful) == 2 {
			break
		}
	}
	switch len(meaningful) {
	case 0:
		return "other", ""
	case 1:
		return meaningful[0], ""
	default:
		if isSyntheticActionSegment(meaningful[1]) {
			return meaningful[0], ""
		}
		return meaningful[0], meaningful[1]
	}
}

var syntheticActionSegments = map[string]struct{}{
	"add":      {},
	"cancel":   {},
	"create":   {},
	"delete":   {},
	"edit":     {},
	"get":      {},
	"list":     {},
	"patch":    {},
	"post":     {},
	"put":      {},
	"refresh":  {},
	"register": {},
	"remove":   {},
	"search":   {},
	"set":      {},
	"sync":     {},
	"unset":    {},
	"update":   {},
	"verify":   {},
}

func isSyntheticActionSegment(segment string) bool {
	normalized := strings.ToLower(strings.TrimSpace(segment))
	normalized = strings.ReplaceAll(normalized, "_", "")
	normalized = strings.ReplaceAll(normalized, "-", "")
	_, ok := syntheticActionSegments[normalized]
	return ok
}

// pathGroupDisplayName converts a path segment to a human-readable display name.
func pathGroupDisplayName(segment string) string {
	words := strings.Split(segment, "_")
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[:1]) + w[1:]
		}
	}
	return strings.Join(words, " ")
}
