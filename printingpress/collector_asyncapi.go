// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"fmt"
	"strings"

	"github.com/pb33f/doctor/diagramatron"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	highasync "github.com/pb33f/libasyncapi/datamodel/high/asyncapi"
	"github.com/pb33f/libopenapi/bundler"
	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/datamodel/low"
	lowbase "github.com/pb33f/libopenapi/datamodel/low/base"
	"github.com/pb33f/libopenapi/index"
	"go.yaml.in/yaml/v4"
)

type asyncAPIIndex struct {
	channels       map[string]*asyncAPIChannelEntry
	messages       map[string]*asyncAPIMessageEntry
	replies        map[string]*asyncAPIReplyEntry
	replyAddresses map[string]*asyncAPIReplyAddressEntry
	servers        map[string]*highasync.Server
	rootProtocols  []string
}

type asyncAPIChannelEntry struct {
	key     string
	channel *highasync.Channel
	page    *ModelPage
	ref     *AsyncAPIChannelRef
}

type asyncAPIMessageEntry struct {
	key     string
	message *highasync.Message
	page    *ModelPage
	ref     *AsyncAPIMessageRef
}

type asyncAPIReplyEntry struct {
	key   string
	reply *highasync.OperationReply
	page  *ModelPage
}

type asyncAPIReplyAddressEntry struct {
	key     string
	address *highasync.OperationReplyAddress
	page    *ModelPage
}

func (pp *PrintingPress) visitAsyncAPIDocument(_ context.Context, doc *highasync.AsyncAPI) {
	root := &RootPage{
		SpecKind:    SpecKindAsyncAPI,
		SpecVersion: pp.engineConfig.SpecVersion,
		Source:      pp.site.Source,
	}
	pp.site.Root = root
	if doc == nil {
		return
	}
	if root.SpecVersion == "" {
		root.SpecVersion = doc.AsyncAPI
	}
	if doc.Info != nil {
		root.Title = doc.Info.Title
		if pp.engineConfig.Title != "" {
			root.Title = pp.engineConfig.Title
		}
		root.Description = doc.Info.Description
		root.DescHTML = pp.renderMarkdown(doc.Info.Description)
		root.Version = doc.Info.Version
		if doc.Info.Contact != nil {
			root.Contact = &ContactInfo{
				Name:  doc.Info.Contact.Name,
				URL:   doc.Info.Contact.URL,
				Email: doc.Info.Contact.Email,
			}
		}
		if doc.Info.License != nil {
			root.License = &LicenseInfo{
				Name: doc.Info.License.Name,
				URL:  doc.Info.License.URL,
			}
		}
		if doc.Info.ExternalDocs != nil {
			root.ExternalDoc = asyncExternalDoc(doc.Info.ExternalDocs)
		}
		root.TagTree = pp.buildAsyncAPITagTree(doc.Info.Tags)
		pp.site.NavTags = root.TagTree
	}

	if doc.Servers != nil {
		for pair := doc.Servers.First(); pair != nil; pair = pair.Next() {
			if server := pair.Value(); server != nil {
				root.Servers = append(root.Servers, asyncServerInfo(server))
			}
		}
	}

	idx := &asyncAPIIndex{
		channels:       make(map[string]*asyncAPIChannelEntry),
		messages:       make(map[string]*asyncAPIMessageEntry),
		replies:        make(map[string]*asyncAPIReplyEntry),
		replyAddresses: make(map[string]*asyncAPIReplyAddressEntry),
		servers:        make(map[string]*highasync.Server),
	}
	indexAsyncAPIServers(doc, idx)

	pp.collectAsyncAPIComponents(doc, idx)
	pp.buildModelIndex()
	pp.collectAsyncAPIRootSecurity(doc, root)
	pp.collectAsyncAPIChannels(doc, idx)
	pp.refreshAsyncAPIReplyModelInfo(idx)
	pp.buildModelIndex()
	pp.collectAsyncAPIOperations(doc, idx)
	pp.assignOperationsToTags(false)
	pp.groupAsyncAPIUntaggedOperations()
	assignAsyncAPINavTagProtocols(pp.site.NavTags)
	pp.pruneEmptyTagGroups()
	pp.populateTagPaths()
	pp.buildNavModelGroups()
}

func (pp *PrintingPress) buildAsyncAPITagTree(tags []*highasync.Tag) []*NavTag {
	if len(tags) == 0 {
		return nil
	}
	result := make([]*NavTag, 0, len(tags))
	for _, tag := range tags {
		if tag == nil || tag.Name == "" {
			continue
		}
		result = append(result, &NavTag{
			Name:        tag.Name,
			Summary:     tag.Name,
			Slug:        pp.slugs.Register("tags", slugpkg.Sanitize(tag.Name)),
			Description: tag.Description,
			DescHTML:    pp.renderMarkdown(tag.Description),
		})
	}
	return result
}

func (pp *PrintingPress) groupAsyncAPIUntaggedOperations() {
	if pp == nil || pp.site == nil || pp.site.Root == nil || len(pp.site.Root.UntaggedOperations) == 0 {
		return
	}

	operations := append([]*NavOperation(nil), pp.site.Root.UntaggedOperations...)
	tag := &NavTag{
		Name:       "Operations",
		Summary:    "Operations",
		Slug:       pp.slugs.Register("tags", "operations"),
		Operations: operations,
	}
	pp.site.NavTags = append(pp.site.NavTags, tag)
	pp.site.Root.TagTree = append(pp.site.Root.TagTree, tag)
	pp.site.Root.UntaggedOperations = nil
}

func (pp *PrintingPress) collectAsyncAPIComponents(doc *highasync.AsyncAPI, idx *asyncAPIIndex) {
	if doc.Components == nil {
		return
	}
	if doc.Components.Schemas != nil {
		for pair := doc.Components.Schemas.First(); pair != nil; pair = pair.Next() {
			pp.collectAsyncAPISchemaModel(pair.Key(), pair.Value())
		}
	}
	pp.buildModelIndex()
	if doc.Components.Messages != nil {
		for pair := doc.Components.Messages.First(); pair != nil; pair = pair.Next() {
			entry := pp.collectAsyncAPIMessageModel(pair.Key(), pair.Value(), true, idx)
			if entry != nil {
				idx.messages["#/components/messages/"+escapeJSONPointerToken(pair.Key())] = entry
			}
		}
	}
	if doc.Components.Channels != nil {
		for pair := doc.Components.Channels.First(); pair != nil; pair = pair.Next() {
			entry := pp.collectAsyncAPIChannelModel(pair.Key(), pair.Value(), idx, true)
			if entry != nil {
				idx.channels["#/components/channels/"+escapeJSONPointerToken(pair.Key())] = entry
			}
		}
	}
	if doc.Components.Servers != nil {
		for pair := doc.Components.Servers.First(); pair != nil; pair = pair.Next() {
			pp.collectAsyncAPIRenderableModel(pair.Key(), "servers", "servers", pair.Value(), asyncServerDescription(pair.Value()), &AsyncAPIModelInfo{
				Kind:     "server",
				Protocol: asyncServerProtocol(pair.Value()),
			})
		}
	}
	if doc.Components.SecuritySchemes != nil {
		for pair := doc.Components.SecuritySchemes.First(); pair != nil; pair = pair.Next() {
			security := pair.Value()
			info := &AsyncAPIModelInfo{Kind: "securityScheme"}
			if security != nil {
				info.Protocol = security.Type
			}
			pp.collectAsyncAPIRenderableModel(pair.Key(), "securitySchemes", "security", security, asyncSecurityDescription(security), info)
		}
	}
	if doc.Components.Parameters != nil {
		for pair := doc.Components.Parameters.First(); pair != nil; pair = pair.Next() {
			pp.collectAsyncAPIRenderableModel(pair.Key(), "parameters", "parameters", pair.Value(), asyncParameterDescription(pair.Value()), &AsyncAPIModelInfo{Kind: "parameter"})
		}
	}
	if doc.Components.ReplyAddresses != nil {
		for pair := doc.Components.ReplyAddresses.First(); pair != nil; pair = pair.Next() {
			idx.replyAddresses["#/components/replyAddresses/"+escapeJSONPointerToken(pair.Key())] = &asyncAPIReplyAddressEntry{
				key:     pair.Key(),
				address: pair.Value(),
			}
		}
	}
	if doc.Components.Replies != nil {
		for pair := doc.Components.Replies.First(); pair != nil; pair = pair.Next() {
			page := pp.collectAsyncAPIRawModel(pair.Key(), "replies", "replies", pair.Value(), asyncReplyDescription(pair.Value(), idx), pp.asyncReplyModelInfo(pair.Value(), idx))
			if page != nil {
				idx.replies["#/components/replies/"+escapeJSONPointerToken(pair.Key())] = &asyncAPIReplyEntry{
					key:   pair.Key(),
					reply: pair.Value(),
					page:  page,
				}
			}
		}
	}
	if doc.Components.ReplyAddresses != nil {
		for pair := doc.Components.ReplyAddresses.First(); pair != nil; pair = pair.Next() {
			page := pp.collectAsyncAPIRawModel(pair.Key(), "replyAddresses", "reply-addresses", pair.Value(), asyncReplyAddressDescription(pair.Value()), &AsyncAPIModelInfo{
				Kind:    "replyAddress",
				Address: asyncReplyAddressLocation(pair.Value()),
			})
			if entry := idx.replyAddresses["#/components/replyAddresses/"+escapeJSONPointerToken(pair.Key())]; entry != nil {
				entry.page = page
			}
		}
	}
	if doc.Components.CorrelationIDs != nil {
		for pair := doc.Components.CorrelationIDs.First(); pair != nil; pair = pair.Next() {
			pp.collectAsyncAPIRawModel(pair.Key(), "correlationIds", "correlation-ids", pair.Value(), asyncCorrelationIDDescription(pair.Value()), &AsyncAPIModelInfo{
				Kind:    "correlationId",
				Address: asyncCorrelationIDLocation(pair.Value()),
			})
		}
	}
	if doc.Components.OperationTraits != nil {
		for pair := doc.Components.OperationTraits.First(); pair != nil; pair = pair.Next() {
			bindings := asyncOperationBindingNamesFromBindings(pair.Value().Bindings)
			pp.collectAsyncAPIRawModel(pair.Key(), "operationTraits", "operation-traits", pair.Value(), asyncOperationTraitDescription(pair.Value()), &AsyncAPIModelInfo{
				Kind:     "operationTrait",
				Protocol: canonicalAsyncAPIProtocol(pair.Key(), bindings),
				Bindings: bindings,
			})
		}
	}
	if doc.Components.MessageTraits != nil {
		for pair := doc.Components.MessageTraits.First(); pair != nil; pair = pair.Next() {
			bindings := asyncMessageBindingNamesFromBindings(pair.Value().Bindings)
			pp.collectAsyncAPIRawModel(pair.Key(), "messageTraits", "message-traits", pair.Value(), asyncMessageTraitDescription(pair.Value()), &AsyncAPIModelInfo{
				Kind:     "messageTrait",
				Protocol: canonicalAsyncAPIProtocol(pair.Key(), bindings),
				Bindings: bindings,
			})
		}
	}
}

func (pp *PrintingPress) collectAsyncAPISchemaModel(name string, proxy *highbase.SchemaProxy) *ModelPage {
	if proxy == nil {
		return nil
	}
	slug := pp.slugs.Register("schemas", slugpkg.Sanitize(name))
	page := &ModelPage{
		SpecKind:      SpecKindAsyncAPI,
		SpecVersion:   pp.engineConfig.SpecVersion,
		Name:          name,
		ComponentType: "schemas",
		TypeSlug:      "schemas",
		Slug:          slug,
		AsyncAPI:      &AsyncAPIModelInfo{Kind: "schema"},
	}
	if schema := proxy.Schema(); schema != nil {
		page.Description = schema.Description
		page.DescHTML = pp.renderMarkdown(schema.Description)
		pp.captureRawData(schema, "asyncapi/components/schemas/"+name, &page.RawYAML, &page.SchemaJSON, nil)
		page.SchemaHighlightedHTML = pp.captureSchemaHighlight(schema)
		if isComplexSchema(schema) {
			page.MockJSON = pp.generateMockWithLabel(schema, "asyncapi/components/schemas/"+name)
			if !pp.engineConfig.NoMermaid {
				diagram := diagramatron.MermaidifySchema(context.Background(), diagramatron.SchemaDiagramInput{
					Root: proxy,
					Identity: diagramatron.SchemaIdentity{
						CanonicalPath:  "#/components/schemas/" + escapeJSONPointerToken(name),
						SourceLocation: pp.engineConfig.SpecLocation,
						Name:           name,
					},
				}, diagramatron.DefaultMermaidConfig())
				if len(diagram.Relationships) > 0 {
					page.MermaidDiagram = diagram.Render()
				}
			}
		}
		if schema.Example != nil || len(schema.Examples) > 0 {
			page.Examples = make(map[string]string)
			if schema.Example != nil {
				if s := yamlNodeToJSON(schema.Example); s != "" {
					page.Examples["Example"] = s
				}
			}
			for i, ex := range schema.Examples {
				if s := yamlNodeToJSON(ex); s != "" {
					page.Examples[fmt.Sprintf("Example %d", i+1)] = s
				}
			}
		}
		if schema.Extensions != nil {
			page.Extensions = collectExtensions(schema.Extensions)
			if page.Extensions != nil {
				page.ExtensionsJSON = render.MustJSON(page.Extensions)
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
	page.Origin = pp.asyncOrigin(proxy)
	page.Source = pp.buildModelSourceRef(page.Origin)
	applyModelLayoutHints(page)
	pp.site.Models["schemas"] = append(pp.site.Models["schemas"], page)
	return page
}

func (pp *PrintingPress) collectAsyncAPIChannels(doc *highasync.AsyncAPI, idx *asyncAPIIndex) {
	if doc == nil || doc.Channels == nil {
		return
	}
	for pair := doc.Channels.First(); pair != nil; pair = pair.Next() {
		key := pair.Key()
		channel := pair.Value()
		if channel == nil {
			continue
		}
		entry := pp.collectAsyncAPIChannelModel(key, channel, idx, false)
		if entry != nil {
			idx.channels["#/channels/"+escapeJSONPointerToken(key)] = entry
		}
	}
}

func (pp *PrintingPress) refreshAsyncAPIReplyModelInfo(idx *asyncAPIIndex) {
	if idx == nil {
		return
	}
	for _, entry := range idx.replies {
		if entry == nil || entry.page == nil || entry.reply == nil {
			continue
		}
		entry.page.AsyncAPI = pp.asyncReplyModelInfo(entry.reply, idx)
		if description := asyncReplyDescription(entry.reply, idx); description != "" {
			entry.page.Description = description
			entry.page.DescHTML = pp.renderMarkdown(description)
		}
	}
}

func (pp *PrintingPress) collectAsyncAPIChannelModel(key string, channel *highasync.Channel, idx *asyncAPIIndex, component bool) *asyncAPIChannelEntry {
	slug := pp.slugs.Register("channels", slugpkg.Sanitize(firstNonEmpty(key, asyncChannelAddress(channel), "channel")))
	ref := &AsyncAPIChannelRef{
		Name:    key,
		Address: asyncChannelAddress(channel),
		Slug:    slug,
		Href:    pppaths.ModelHTML("channels", slug),
	}
	page := &ModelPage{
		SpecKind:      SpecKindAsyncAPI,
		SpecVersion:   pp.engineConfig.SpecVersion,
		Name:          key,
		ComponentType: "channels",
		TypeSlug:      "channels",
		Slug:          slug,
		Description:   asyncChannelDescription(channel),
		DescHTML:      pp.renderMarkdown(asyncChannelDescription(channel)),
		AsyncAPI: &AsyncAPIModelInfo{
			Kind:     "channel",
			Address:  ref.Address,
			Bindings: asyncChannelProtocols(channel, idx),
		},
	}
	contextPath := "asyncapi/channels/" + key
	refBase := "#/channels/" + escapeJSONPointerToken(key)
	if component {
		contextPath = "asyncapi/components/channels/" + key
		refBase = "#/components/channels/" + escapeJSONPointerToken(key)
	}
	pp.captureRawData(channel, contextPath, &page.RawYAML, &page.SchemaJSON, nil)
	page.Origin = pp.asyncOrigin(channel)
	page.Source = pp.buildModelSourceRef(page.Origin)
	if channel != nil && channel.Extensions != nil {
		page.Extensions = collectExtensions(channel.Extensions)
		if page.Extensions != nil {
			page.ExtensionsJSON = render.MustJSON(page.Extensions)
		}
	}
	entry := &asyncAPIChannelEntry{key: key, channel: channel, page: page, ref: ref}
	if channel != nil && channel.Messages != nil {
		for pair := channel.Messages.First(); pair != nil; pair = pair.Next() {
			msg := pair.Value()
			msgRef := pp.asyncMessageRef(pair.Key(), msg, idx)
			if msgRef != nil {
				page.AsyncAPI.Messages = append(page.AsyncAPI.Messages, msgRef)
				idx.messages[refBase+"/messages/"+escapeJSONPointerToken(pair.Key())] = &asyncAPIMessageEntry{
					key:     pair.Key(),
					message: msg,
					ref:     msgRef,
				}
			}
		}
	}
	pp.site.Models["channels"] = append(pp.site.Models["channels"], page)
	return entry
}

func (pp *PrintingPress) collectAsyncAPIMessageModel(key string, msg *highasync.Message, component bool, idx *asyncAPIIndex) *asyncAPIMessageEntry {
	if msg == nil {
		return nil
	}
	slug := pp.slugs.Register("messages", slugpkg.Sanitize(firstNonEmpty(key, msg.Name, msg.Title, "message")))
	ref := &AsyncAPIMessageRef{
		Name:        firstNonEmpty(msg.Name, key),
		Title:       msg.Title,
		Summary:     msg.Summary,
		Slug:        slug,
		Href:        pppaths.ModelHTML("messages", slug),
		ContentType: msg.ContentType,
	}
	page := &ModelPage{
		SpecKind:      SpecKindAsyncAPI,
		SpecVersion:   pp.engineConfig.SpecVersion,
		Name:          firstNonEmpty(msg.Name, key),
		ComponentType: "messages",
		TypeSlug:      "messages",
		Slug:          slug,
		Description:   firstNonEmpty(msg.Description, msg.Summary),
		DescHTML:      pp.renderMarkdown(firstNonEmpty(msg.Description, msg.Summary)),
		AsyncAPI: &AsyncAPIModelInfo{
			Kind:        "message",
			ContentType: msg.ContentType,
			Bindings:    asyncMessageBindingNames(msg),
		},
	}
	if component {
		pp.captureRawData(msg, "asyncapi/components/messages/"+key, &page.RawYAML, &page.SchemaJSON, nil)
		page.Origin = pp.asyncOrigin(msg)
		page.Source = pp.buildModelSourceRef(page.Origin)
	}
	if surface := pp.asyncSchemaSurface(firstNonEmpty(msg.Name, key)+" payload", "payload", msg.Payload); surface != nil {
		page.AsyncAPI.Schemas = append(page.AsyncAPI.Schemas, surface)
	}
	if mt := pp.asyncMessageMediaType(key, msg); mt != nil {
		page.AsyncAPI.Content = []*MediaTypeInfo{mt}
	}
	if surface := pp.asyncSchemaSurface(firstNonEmpty(msg.Name, key)+" headers", "headers", msg.Headers); surface != nil {
		page.AsyncAPI.Schemas = append(page.AsyncAPI.Schemas, surface)
	}
	if msg.Extensions != nil {
		page.Extensions = collectExtensions(msg.Extensions)
		if page.Extensions != nil {
			page.ExtensionsJSON = render.MustJSON(page.Extensions)
		}
	}
	if component {
		pp.site.Models["messages"] = append(pp.site.Models["messages"], page)
	}
	return &asyncAPIMessageEntry{key: key, message: msg, page: page, ref: ref}
}

func (pp *PrintingPress) collectAsyncAPIOperations(doc *highasync.AsyncAPI, idx *asyncAPIIndex) {
	if doc == nil || doc.Operations == nil {
		return
	}
	for pair := doc.Operations.First(); pair != nil; pair = pair.Next() {
		op := pair.Value()
		if op == nil {
			continue
		}
		operationID := pair.Key()
		channelRef := pp.asyncOperationChannelRef(op, idx)
		pathLabel := asyncOperationPathLabel(operationID, op, channelRef)
		description := firstNonEmpty(op.Description, op.Summary)
		slug := pp.slugs.Register("operations", slugpkg.Sanitize(firstNonEmpty(operationID, op.Action+"-"+pathLabel, "operation")))
		page := &OperationPage{
			SpecKind:    SpecKindAsyncAPI,
			SpecVersion: pp.engineConfig.SpecVersion,
			Method:      strings.ToLower(strings.TrimSpace(op.Action)),
			Path:        pathLabel,
			OperationID: operationID,
			Summary:     firstNonEmpty(op.Summary, op.Title),
			Description: description,
			DescHTML:    pp.renderMarkdown(description),
			Slug:        slug,
			AsyncAPI: &AsyncAPIOperationInfo{
				Action:     op.Action,
				Channel:    channelRef,
				Bindings:   asyncOperationProtocols(op, idx),
				Traits:     asyncOperationTraitLabels(op),
				Extensions: collectExtensions(op.Extensions),
			},
		}
		page.Tags = asyncOperationTagNames(op)
		if groups, flat := pp.collectAsyncAPISecurityGroups(asyncOperationSecuritySchemes(op)); len(flat) > 0 || asyncOperationHasSecurityField(op) {
			page.HasSecurityOverride = true
			page.SecurityGroups = groups
			page.Security = flat
		}
		for _, msgRef := range op.Messages {
			if entry := pp.asyncMessageEntryFromReference(msgRef, idx); entry != nil {
				if entry.ref != nil {
					page.AsyncAPI.Messages = append(page.AsyncAPI.Messages, entry.ref)
				}
				if mt := pp.asyncMessageMediaType(entry.key, entry.message); mt != nil {
					if page.RequestBody == nil {
						page.RequestBody = &RequestBodyInfo{}
					}
					page.RequestBody.Content = append(page.RequestBody.Content, mt)
					if page.RequestBody.Ref == nil && entry.ref != nil {
						page.RequestBody.Ref = &ComponentLink{
							Name:          entry.ref.Name,
							ComponentType: "messages",
							TypeSlug:      "messages",
							Slug:          entry.ref.Slug,
						}
					}
					if entry.ref != nil {
						page.RequestBody.Refs = append(page.RequestBody.Refs, &ComponentLink{
							Name:          entry.ref.Name,
							ComponentType: "messages",
							TypeSlug:      "messages",
							Slug:          entry.ref.Slug,
						})
					}
					if page.RequestBody.Description == "" && entry.ref != nil {
						page.RequestBody.Description = firstNonEmpty(entry.ref.Summary, entry.ref.Title)
						page.RequestBody.DescHTML = pp.renderMarkdown(page.RequestBody.Description)
					}
				}
			}
		}
		page.AsyncAPI.Reply = pp.asyncReplyInfo(op.Reply, idx)
		if op.ExternalDocs != nil {
			page.ExternalDoc = asyncExternalDoc(op.ExternalDocs)
		}
		pp.captureRawData(op, "asyncapi/operations/"+operationID, &page.RawYAML, &page.SchemaJSON, nil)
		if rootNode := asyncRootNode(op); rootNode != nil {
			page.SourceLine = rootNode.Line
		}
		page.Location = pp.engineConfig.SpecLocation
		page.Source = pp.buildSourceRef(page.Location, pp.sourceTargetForLocation(page.Location, nil), page.SourceLine)
		if page.AsyncAPI.Extensions != nil {
			page.Extensions = page.AsyncAPI.Extensions
			page.ExtensionsJSON = render.MustJSON(page.Extensions)
		}
		pp.site.Operations = append(pp.site.Operations, page)
	}
}

func (pp *PrintingPress) collectAsyncAPIRenderableModel(name, componentType, typeSlug string, renderable interface{ Render() ([]byte, error) }, description string, info *AsyncAPIModelInfo) *ModelPage {
	if renderable == nil {
		return nil
	}
	slug := pp.slugs.Register(typeSlug, slugpkg.Sanitize(name))
	page := &ModelPage{
		SpecKind:      SpecKindAsyncAPI,
		SpecVersion:   pp.engineConfig.SpecVersion,
		Name:          name,
		ComponentType: componentType,
		TypeSlug:      typeSlug,
		Slug:          slug,
		Description:   description,
		DescHTML:      pp.renderMarkdown(description),
		AsyncAPI:      info,
	}
	pp.captureRawData(renderable, "asyncapi/components/"+componentType+"/"+name, &page.RawYAML, &page.SchemaJSON, nil)
	page.Origin = pp.asyncOrigin(renderable)
	page.Source = pp.buildModelSourceRef(page.Origin)
	pp.site.Models[typeSlug] = append(pp.site.Models[typeSlug], page)
	return page
}

func (pp *PrintingPress) collectAsyncAPIRawModel(name, componentType, typeSlug string, value any, description string, info *AsyncAPIModelInfo) *ModelPage {
	if value == nil {
		return nil
	}
	slug := pp.slugs.Register(typeSlug, slugpkg.Sanitize(name))
	page := &ModelPage{
		SpecKind:      SpecKindAsyncAPI,
		SpecVersion:   pp.engineConfig.SpecVersion,
		Name:          name,
		ComponentType: componentType,
		TypeSlug:      typeSlug,
		Slug:          slug,
		Description:   description,
		DescHTML:      pp.renderMarkdown(description),
		AsyncAPI:      info,
	}
	if yamlBytes, err := yaml.Marshal(value); err == nil {
		page.RawYAML = normalizeArtifactYAML(yamlBytes)
		if jsonStr, jsonErr := yamlToJSON(yamlBytes); jsonErr == nil {
			page.SchemaJSON = jsonStr
		}
	} else {
		pp.warn("failed to render AsyncAPI model to YAML", componentType+"/"+name, err)
	}
	page.Origin = pp.asyncOrigin(value)
	page.Source = pp.buildModelSourceRef(page.Origin)
	pp.site.Models[typeSlug] = append(pp.site.Models[typeSlug], page)
	return page
}

func (pp *PrintingPress) asyncSchemaSurface(name, role string, proxy *highbase.SchemaProxy) *AsyncAPISchemaSurface {
	if proxy == nil {
		return nil
	}
	surface := &AsyncAPISchemaSurface{Name: name, Role: role}
	if proxy.IsReference() {
		surface.Ref = pp.resolveComponentLink(proxy.GetReference())
		if surface.Ref != nil {
			return surface
		}
	}
	schema := proxy.Schema()
	if schema == nil {
		return surface
	}
	surface.SchemaJSON = pp.captureSchemaJSON(schema)
	if isComplexSchema(schema) {
		surface.MockJSON = pp.generateMockWithLabel(schema, "asyncapi/"+role+"/"+name)
	}
	return surface
}

func (pp *PrintingPress) asyncMessageMediaType(key string, msg *highasync.Message) *MediaTypeInfo {
	if msg == nil || msg.Payload == nil {
		return nil
	}
	cacheKey := asyncMessageMediaTypeCacheKey(msg)
	if cacheKey != "" {
		if cached := pp.asyncMediaArtifacts[cacheKey]; cached != nil {
			return cached
		}
	}
	contentType := strings.TrimSpace(msg.ContentType)
	if contentType == "" {
		contentType = "application/json"
	}
	mt := &MediaTypeInfo{
		MediaType: contentType,
	}
	payloadProxy, schemaFormat, rawSchema, compatible := asyncMessagePayloadSchema(msg)
	mt.SchemaFormat = schemaFormat
	if !compatible {
		mt.RawSchemaJSON = yamlNodeToJSON(rawSchema)
		if mt.RawSchemaJSON == "" {
			if rawYAML, err := yaml.Marshal(rawSchema); err == nil {
				mt.RawSchemaYAML = normalizeArtifactYAML(rawYAML)
			}
		}
		mt.Examples = asyncMessagePayloadExamples(msg)
		return pp.storeAsyncMessageMediaType(cacheKey, mt)
	}
	if msg.Payload.IsReference() {
		mt.SchemaRef = pp.resolveComponentLink(msg.Payload.GetReference())
	}
	if payloadProxy == nil {
		mt.Examples = asyncMessagePayloadExamples(msg)
		return pp.storeAsyncMessageMediaType(cacheKey, mt)
	}
	schema := payloadProxy.Schema()
	if schema != nil {
		if len(schema.Type) > 0 && schema.Type[0] == "array" && schema.Items != nil && schema.Items.IsA() {
			mt.IsArray = true
			if schema.Items.A.IsReference() {
				mt.ItemsRef = pp.resolveComponentLink(schema.Items.A.GetReference())
			}
			if itemsSchema := schema.Items.A.Schema(); itemsSchema != nil {
				mt.ItemsSchemaJSON = pp.captureSchemaJSON(itemsSchema)
			}
		}
		mt.SchemaJSON = pp.captureSchemaJSON(schema)
		if isComplexSchema(schema) {
			mt.MockJSON = pp.generateMockWithLabel(schema, "asyncapi/messages/"+firstNonEmpty(msg.Name, key, "message")+"/payload")
			if !payloadProxy.IsReference() && !pp.engineConfig.NoMermaid {
				owner := firstNonEmpty(msg.Name, key, "message")
				diagram := diagramatron.MermaidifySchema(context.Background(), diagramatron.SchemaDiagramInput{
					Root: payloadProxy,
					Identity: diagramatron.SchemaIdentity{
						CanonicalPath:  "#/messages/" + escapeJSONPointerToken(owner) + "/payload",
						SourceLocation: pp.engineConfig.SpecLocation,
						Name:           owner + "Payload",
					},
				}, diagramatron.DefaultMermaidConfig())
				if len(diagram.Relationships) > 0 {
					mt.MermaidDiagram = diagram.Render()
				}
			}
		}
	}
	mt.Examples = asyncMessagePayloadExamples(msg)
	return pp.storeAsyncMessageMediaType(cacheKey, mt)
}

func (pp *PrintingPress) storeAsyncMessageMediaType(key string, mediaType *MediaTypeInfo) *MediaTypeInfo {
	if key != "" && mediaType != nil {
		if pp.asyncMediaArtifacts == nil {
			pp.asyncMediaArtifacts = make(map[string]*MediaTypeInfo)
		}
		pp.asyncMediaArtifacts[key] = mediaType
	}
	return mediaType
}

func asyncMessageMediaTypeCacheKey(msg *highasync.Message) string {
	if msg == nil || msg.GoLow() == nil {
		return ""
	}
	lowMessage := msg.GoLow()
	location := ""
	if idx := lowMessage.GetIndex(); idx != nil {
		location = idx.GetSpecAbsolutePath()
	}
	if root := lowMessage.GetRootNode(); root != nil {
		return fmt.Sprintf("%s#L%dC%d", location, root.Line, root.Column)
	}
	if ref := asyncReference(msg); ref != "" {
		return location + "|" + ref
	}
	return ""
}

func asyncMessagePayloadSchema(msg *highasync.Message) (*highbase.SchemaProxy, string, *yaml.Node, bool) {
	if msg == nil || msg.Payload == nil || msg.GoLow() == nil {
		return nil, "", nil, true
	}
	payloadNode := msg.GoLow().Payload.ValueNode
	formatNode := yamlMappingValue(payloadNode, "schemaFormat")
	if formatNode == nil {
		return msg.Payload, "", payloadNode, true
	}
	format := yamlScalarString(formatNode)
	schemaNode := yamlMappingValue(payloadNode, "schema")
	if schemaNode == nil || schemaNode.Kind != yaml.MappingNode || !isJSONCompatibleAsyncSchemaFormat(format) {
		return nil, format, firstNonNilYAMLNode(schemaNode, payloadNode), false
	}
	lowProxy := new(lowbase.SchemaProxy)
	if err := lowProxy.Build(msg.GoLow().GetContext(), nil, schemaNode, msg.GoLow().GetIndex()); err != nil {
		return nil, format, schemaNode, false
	}
	highProxy := highbase.NewSchemaProxy(&low.NodeReference[*lowbase.SchemaProxy]{
		Value:     lowProxy,
		ValueNode: schemaNode,
	})
	if highProxy.Schema() == nil {
		return nil, format, schemaNode, false
	}
	return highProxy, format, schemaNode, true
}

func isJSONCompatibleAsyncSchemaFormat(format string) bool {
	mediaType := strings.ToLower(strings.TrimSpace(strings.SplitN(format, ";", 2)[0]))
	switch mediaType {
	case "", "application/json", "application/schema+json", "application/schema+yaml",
		"application/vnd.aai.asyncapi", "application/vnd.aai.asyncapi+json", "application/vnd.aai.asyncapi+yaml",
		"application/vnd.oai.openapi", "application/vnd.oai.openapi+json", "application/vnd.oai.openapi+yaml":
		return true
	default:
		return false
	}
}

func firstNonNilYAMLNode(nodes ...*yaml.Node) *yaml.Node {
	for _, node := range nodes {
		if node != nil {
			return node
		}
	}
	return nil
}

func asyncMessagePayloadExamples(message *highasync.Message) map[string]string {
	if message == nil || len(message.Examples) == 0 {
		return nil
	}
	examples := make(map[string]string, len(message.Examples))
	for i, example := range message.Examples {
		if example == nil || example.Payload == nil {
			continue
		}
		payload := yamlNodeToJSON(example.Payload)
		if payload == "" {
			continue
		}
		name := firstNonEmpty(example.Name, fmt.Sprintf("Example %d", i+1))
		examples[name] = payload
	}
	if len(examples) == 0 {
		return nil
	}
	return examples
}

func (pp *PrintingPress) asyncMessageRef(key string, msg *highasync.Message, idx *asyncAPIIndex) *AsyncAPIMessageRef {
	if msg == nil {
		return nil
	}
	if idx != nil {
		if ref := asyncReference(msg); ref != "" {
			if entry, ok := idx.messages[ref]; ok && entry != nil && entry.ref != nil {
				return entry.ref
			}
		}
		if entry, ok := idx.messages["#/components/messages/"+escapeJSONPointerToken(key)]; ok && entry != nil && entry.ref != nil {
			return entry.ref
		}
	}
	return &AsyncAPIMessageRef{
		Name:        firstNonEmpty(msg.Name, key),
		Title:       msg.Title,
		Summary:     msg.Summary,
		ContentType: msg.ContentType,
	}
}

func (pp *PrintingPress) asyncMessageRefFromReference(ref *low.Reference, idx *asyncAPIIndex) *AsyncAPIMessageRef {
	if entry := pp.asyncMessageEntryFromReference(ref, idx); entry != nil {
		return entry.ref
	}
	return nil
}

func (pp *PrintingPress) asyncMessageEntryFromReference(ref *low.Reference, idx *asyncAPIIndex) *asyncAPIMessageEntry {
	if ref == nil || idx == nil {
		return nil
	}
	key := ref.GetReference()
	if entry, ok := idx.messages[key]; ok && entry != nil {
		return entry
	}
	return nil
}

func (pp *PrintingPress) asyncOperationChannelRef(op *highasync.Operation, idx *asyncAPIIndex) *AsyncAPIChannelRef {
	if op == nil || op.Channel == nil || idx == nil {
		return nil
	}
	if entry, ok := idx.channels[op.Channel.GetReference()]; ok && entry != nil {
		return entry.ref
	}
	return nil
}

func (pp *PrintingPress) asyncReplyInfo(reply *highasync.OperationReply, idx *asyncAPIIndex) *AsyncAPIReplyInfo {
	if reply == nil {
		return nil
	}
	var componentRef *ComponentLink
	if ref := asyncReference(reply); ref != "" && idx != nil {
		if entry, ok := idx.replies[ref]; ok && entry != nil && entry.reply != nil {
			if entry.page != nil {
				componentRef = &ComponentLink{
					Name:          entry.page.Name,
					ComponentType: entry.page.ComponentType,
					TypeSlug:      entry.page.TypeSlug,
					Slug:          entry.page.Slug,
				}
			}
			reply = entry.reply
		}
	}
	info := &AsyncAPIReplyInfo{Ref: componentRef}
	if address := asyncReplyAddress(reply, idx); address != nil {
		info.Address = address.Location
	}
	if reply.Channel != nil && idx != nil {
		if entry, ok := idx.channels[reply.Channel.GetReference()]; ok && entry != nil {
			info.Channel = entry.ref
		}
	}
	for _, ref := range reply.Messages {
		if msg := pp.asyncMessageRefFromReference(ref, idx); msg != nil {
			info.Messages = append(info.Messages, msg)
		}
	}
	if info.Ref == nil && info.Address == "" && info.Channel == nil && len(info.Messages) == 0 {
		return nil
	}
	return info
}

func (pp *PrintingPress) asyncReplyModelInfo(reply *highasync.OperationReply, idx *asyncAPIIndex) *AsyncAPIModelInfo {
	info := &AsyncAPIModelInfo{Kind: "reply"}
	replyInfo := pp.asyncReplyInfo(reply, idx)
	if replyInfo == nil {
		return info
	}
	info.Address = replyInfo.Address
	info.Channel = replyInfo.Channel
	info.Messages = replyInfo.Messages
	return info
}

func asyncReplyAddress(reply *highasync.OperationReply, idx *asyncAPIIndex) *highasync.OperationReplyAddress {
	if reply == nil || reply.Address == nil {
		return nil
	}
	if ref := asyncReference(reply.Address); ref != "" && idx != nil {
		if entry, ok := idx.replyAddresses[ref]; ok && entry != nil && entry.address != nil {
			return entry.address
		}
	}
	return reply.Address
}

func (pp *PrintingPress) asyncOrigin(value any) *bundler.ComponentOrigin {
	line := 0
	if node := asyncRootNode(value); node != nil {
		line = node.Line
	}
	location := pp.engineConfig.SpecLocation
	type lowGetter interface {
		GoLowUntyped() any
	}
	type indexGetter interface {
		GetIndex() *index.SpecIndex
	}
	lowValue := value
	if proxy, ok := value.(*highbase.SchemaProxy); ok && proxy.Schema() != nil {
		lowValue = proxy.Schema().GoLow()
	} else if high, ok := value.(lowGetter); ok {
		lowValue = high.GoLowUntyped()
	}
	if indexed, ok := lowValue.(indexGetter); ok && indexed.GetIndex() != nil {
		objectIndex := indexed.GetIndex()
		rootIndex := pp.engineConfig.AsyncDoc.Index()
		if objectIndex != rootIndex {
			if resolved := objectIndex.GetSpecAbsolutePath(); resolved != "" {
				location = resolved
			}
		} else if location == "" {
			location = objectIndex.GetSpecAbsolutePath()
		}
	}
	if location == "" && line == 0 {
		return nil
	}
	return &bundler.ComponentOrigin{
		OriginalFile: location,
		Line:         line,
	}
}

func (pp *PrintingPress) collectAsyncAPIRootSecurity(doc *highasync.AsyncAPI, root *RootPage) {
	if doc == nil || doc.Servers == nil || root == nil {
		return
	}
	var schemes []*highasync.SecurityScheme
	for pair := doc.Servers.First(); pair != nil; pair = pair.Next() {
		if server := pair.Value(); server != nil {
			schemes = append(schemes, server.Security...)
		}
	}
	root.SecurityGroups, root.Security = pp.collectAsyncAPISecurityGroups(schemes)
}

func (pp *PrintingPress) collectAsyncAPISecurityGroups(schemes []*highasync.SecurityScheme) ([]*SecurityRequirementGroup, []*SecurityRequirement) {
	if len(schemes) == 0 {
		return nil, nil
	}
	groups := make([]*SecurityRequirementGroup, 0, len(schemes))
	flat := make([]*SecurityRequirement, 0, len(schemes))
	seen := make(map[string]struct{}, len(schemes))
	for _, scheme := range schemes {
		req := pp.asyncSecurityRequirement(scheme)
		if req == nil {
			continue
		}
		key := asyncSecurityRequirementKey(req)
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		groups = append(groups, &SecurityRequirementGroup{Requirements: []*SecurityRequirement{req}})
		flat = append(flat, req)
	}
	return groups, flat
}

func (pp *PrintingPress) asyncSecurityRequirement(scheme *highasync.SecurityScheme) *SecurityRequirement {
	if scheme == nil {
		return nil
	}
	ref := asyncReference(scheme)
	link := pp.resolveComponentLink(ref)
	name := firstNonEmpty(asyncReferenceName(ref), scheme.Type, scheme.Scheme, "security")
	if link != nil {
		name = link.Name
	}
	return &SecurityRequirement{
		Name:          name,
		Scopes:        append([]string(nil), scheme.Scopes...),
		SchemeType:    scheme.Type,
		In:            scheme.In,
		Scheme:        scheme.Scheme,
		ParameterName: scheme.Name,
		Ref:           link,
	}
}

func asyncSecurityRequirementKey(req *SecurityRequirement) string {
	if req == nil {
		return ""
	}
	return req.Name + "|" + req.SchemeType + "|" + req.In + "|" + req.Scheme + "|" + req.ParameterName
}

func asyncRootNode(value any) *yaml.Node {
	type rootNoder interface {
		GoLowUntyped() any
	}
	type lowRootNoder interface {
		GetRootNode() *yaml.Node
	}
	if value == nil {
		return nil
	}
	if rn, ok := value.(lowRootNoder); ok {
		return rn.GetRootNode()
	}
	if high, ok := value.(rootNoder); ok {
		if lowValue, ok := high.GoLowUntyped().(lowRootNoder); ok {
			return lowValue.GetRootNode()
		}
	}
	if proxy, ok := value.(*highbase.SchemaProxy); ok {
		return proxy.GetValueNode()
	}
	return nil
}

func asyncServerInfo(server *highasync.Server) *ServerInfo {
	if server == nil {
		return nil
	}
	return &ServerInfo{
		URL:         asyncServerURL(server),
		Description: firstNonEmpty(server.Description, server.Summary, server.Title, server.Protocol),
		Variables:   asyncServerVariables(server),
	}
}

func asyncServerVariables(server *highasync.Server) []*ServerVariableInfo {
	if server == nil || server.Variables == nil {
		return nil
	}
	var result []*ServerVariableInfo
	for pair := server.Variables.First(); pair != nil; pair = pair.Next() {
		variable := pair.Value()
		if variable == nil {
			continue
		}
		result = append(result, &ServerVariableInfo{
			Name:        pair.Key(),
			Default:     variable.Default,
			Enum:        append([]string(nil), variable.Enum...),
			Description: variable.Description,
		})
	}
	return result
}

func asyncServerURL(server *highasync.Server) string {
	if server == nil {
		return ""
	}
	host := strings.TrimSpace(server.Host)
	if host == "" {
		return ""
	}
	pathname := strings.TrimSpace(server.Pathname)
	protocol := strings.TrimSpace(server.Protocol)
	if protocol == "" {
		return host + pathname
	}
	return protocol + "://" + host + pathname
}

func asyncExternalDoc(doc *highasync.ExternalDoc) *ExternalDocInfo {
	if doc == nil {
		return nil
	}
	return &ExternalDocInfo{URL: doc.URL, Description: doc.Description}
}

func asyncChannelAddress(channel *highasync.Channel) string {
	if channel == nil || channel.Address == nil {
		return ""
	}
	return *channel.Address
}

func asyncChannelDescription(channel *highasync.Channel) string {
	if channel == nil {
		return ""
	}
	return firstNonEmpty(channel.Description, channel.Summary, channel.Title)
}

func asyncServerDescription(server *highasync.Server) string {
	if server == nil {
		return ""
	}
	return firstNonEmpty(server.Description, server.Summary, server.Title, server.Protocol)
}

func asyncServerProtocol(server *highasync.Server) string {
	if server == nil {
		return ""
	}
	return server.Protocol
}

func asyncSecurityDescription(security *highasync.SecurityScheme) string {
	if security == nil {
		return ""
	}
	return security.Description
}

func asyncParameterDescription(parameter *highasync.Parameter) string {
	if parameter == nil {
		return ""
	}
	return parameter.Description
}

func asyncReplyDescription(reply *highasync.OperationReply, idx *asyncAPIIndex) string {
	address := asyncReplyAddress(reply, idx)
	if address == nil {
		return ""
	}
	return firstNonEmpty(address.Description, address.Location)
}

func asyncReplyAddressDescription(address *highasync.OperationReplyAddress) string {
	if address == nil {
		return ""
	}
	return firstNonEmpty(address.Description, address.Location)
}

func asyncReplyAddressLocation(address *highasync.OperationReplyAddress) string {
	if address == nil {
		return ""
	}
	return address.Location
}

func asyncCorrelationIDDescription(correlationID *highasync.CorrelationID) string {
	if correlationID == nil {
		return ""
	}
	return firstNonEmpty(correlationID.Description, correlationID.Location)
}

func asyncCorrelationIDLocation(correlationID *highasync.CorrelationID) string {
	if correlationID == nil {
		return ""
	}
	return correlationID.Location
}

func asyncOperationTraitDescription(trait *highasync.OperationTrait) string {
	if trait == nil {
		return ""
	}
	return firstNonEmpty(trait.Description, trait.Summary, trait.Title)
}

func asyncMessageTraitDescription(trait *highasync.MessageTrait) string {
	if trait == nil {
		return ""
	}
	return firstNonEmpty(trait.Description, trait.Summary, trait.Title)
}

func asyncOperationPathLabel(operationID string, op *highasync.Operation, channel *AsyncAPIChannelRef) string {
	if channel != nil {
		return firstNonEmpty(channel.Address, channel.Name, operationID)
	}
	if op != nil {
		return firstNonEmpty(operationID, op.Action)
	}
	return operationID
}

func asyncOperationBindingNames(op *highasync.Operation) []string {
	if op == nil {
		return nil
	}
	var names []string
	names = appendOperationBindingNames(names, op.Bindings)
	for _, trait := range op.Traits {
		if trait != nil {
			names = appendOperationBindingNames(names, trait.Bindings)
		}
	}
	return uniqueAsyncAPIProtocols(names)
}

func appendOperationBindingNames(names []string, bindings *highasync.OperationBindings) []string {
	if bindings == nil {
		return names
	}
	return append(names, bindings.BindingNames()...)
}

func asyncOperationBindingNamesFromBindings(bindings *highasync.OperationBindings) []string {
	return uniqueAsyncAPIProtocols(appendOperationBindingNames(nil, bindings))
}

func indexAsyncAPIServers(doc *highasync.AsyncAPI, idx *asyncAPIIndex) {
	if doc == nil || idx == nil {
		return
	}
	if idx.servers == nil {
		idx.servers = make(map[string]*highasync.Server)
	}
	if doc.Servers != nil {
		for name, server := range doc.Servers.FromOldest() {
			idx.servers["#/servers/"+escapeJSONPointerToken(name)] = server
			if server != nil {
				idx.rootProtocols = append(idx.rootProtocols, server.Protocol)
			}
		}
		idx.rootProtocols = uniqueAsyncAPIProtocols(idx.rootProtocols)
	}
	if doc.Components != nil && doc.Components.Servers != nil {
		for name, server := range doc.Components.Servers.FromOldest() {
			idx.servers["#/components/servers/"+escapeJSONPointerToken(name)] = server
		}
	}
}

func asyncOperationProtocols(op *highasync.Operation, idx *asyncAPIIndex) []string {
	names := asyncOperationBindingNames(op)
	if op == nil || op.Channel == nil || idx == nil {
		return names
	}
	if entry := idx.channels[op.Channel.GetReference()]; entry != nil {
		names = append(names, asyncChannelProtocols(entry.channel, idx)...)
	}
	return uniqueAsyncAPIProtocols(names)
}

func asyncChannelProtocols(channel *highasync.Channel, idx *asyncAPIIndex) []string {
	names := asyncChannelBindingNames(channel)
	if channel == nil || idx == nil {
		return names
	}
	if len(channel.Servers) == 0 {
		names = append(names, idx.rootProtocols...)
	}
	for _, ref := range channel.Servers {
		if ref == nil {
			continue
		}
		if server := idx.servers[ref.GetReference()]; server != nil {
			names = append(names, server.Protocol)
		}
	}
	return uniqueAsyncAPIProtocols(names)
}

func asyncMessageBindingNamesFromBindings(bindings *highasync.MessageBindings) []string {
	if bindings == nil {
		return nil
	}
	return uniqueAsyncAPIProtocols(bindings.BindingNames())
}

func canonicalAsyncAPIProtocol(name string, protocols []string) string {
	unique := uniqueAsyncAPIProtocols(protocols)
	if len(unique) == 1 && asyncAPIProtocolFamily(name) == asyncAPIProtocolFamily(unique[0]) {
		return unique[0]
	}
	return ""
}

func asyncAPIProtocolFamily(protocol string) string {
	normalized := strings.NewReplacer("-", "", "_", "", ".", "", " ", "").Replace(strings.ToLower(strings.TrimSpace(protocol)))
	switch normalized {
	case "ws", "wss", "websocket", "websockets":
		return "websocket"
	case "kafkasecure":
		return "kafka"
	case "amqps":
		return "amqp"
	case "amqp1":
		return "amqp"
	case "mqtts", "securemqtt", "mqttsecure":
		return "mqtt"
	case "mqtt5":
		return "mqtt"
	case "stomps":
		return "stomp"
	case "https":
		return "http"
	case "googlepubsub", "gcppubsub":
		return "googlepubsub"
	default:
		return normalized
	}
}

func uniqueAsyncAPIProtocols(protocols []string) []string {
	seen := make(map[string]struct{}, len(protocols))
	result := make([]string, 0, len(protocols))
	for _, protocol := range protocols {
		protocol = strings.TrimSpace(protocol)
		if protocol == "" {
			continue
		}
		family := asyncAPIProtocolFamily(protocol)
		if _, ok := seen[family]; ok {
			continue
		}
		seen[family] = struct{}{}
		result = append(result, protocol)
	}
	return result
}

func assignAsyncAPINavTagProtocols(tags []*NavTag) []string {
	var collected []string
	for _, tag := range tags {
		if tag == nil {
			continue
		}
		var protocols []string
		for _, operation := range tag.Operations {
			if operation != nil {
				protocols = append(protocols, operation.Protocols...)
			}
		}
		protocols = append(protocols, assignAsyncAPINavTagProtocols(tag.Children)...)
		tag.Protocols = uniqueAsyncAPIProtocols(protocols)
		tag.Protocol = canonicalAsyncAPIProtocol(tag.Name, tag.Protocols)
		collected = append(collected, tag.Protocols...)
	}
	return uniqueAsyncAPIProtocols(collected)
}

func asyncChannelBindingNames(channel *highasync.Channel) []string {
	if channel == nil || channel.Bindings == nil {
		return nil
	}
	return uniqueAsyncAPIProtocols(channel.Bindings.BindingNames())
}

func asyncMessageBindingNames(message *highasync.Message) []string {
	if message == nil || message.Bindings == nil {
		return nil
	}
	return uniqueAsyncAPIProtocols(message.Bindings.BindingNames())
}

func asyncOperationTraitLabels(op *highasync.Operation) []string {
	if op == nil || len(op.Traits) == 0 {
		return nil
	}
	result := make([]string, 0, len(op.Traits))
	for _, trait := range op.Traits {
		if trait == nil {
			continue
		}
		result = append(result, firstNonEmpty(asyncReferenceName(asyncReference(trait)), trait.Title, trait.Summary, trait.Description, "trait"))
	}
	return uniqueNonEmptyStrings(result)
}

func asyncOperationTagNames(op *highasync.Operation) []string {
	if op == nil {
		return nil
	}
	var names []string
	for _, tag := range op.Tags {
		if tag != nil {
			names = append(names, tag.Name)
		}
	}
	for _, trait := range op.Traits {
		if trait == nil {
			continue
		}
		for _, tag := range trait.Tags {
			if tag != nil {
				names = append(names, tag.Name)
			}
		}
	}
	return uniqueNonEmptyStrings(names)
}

func asyncOperationSecuritySchemes(op *highasync.Operation) []*highasync.SecurityScheme {
	if op == nil {
		return nil
	}
	var schemes []*highasync.SecurityScheme
	schemes = append(schemes, op.Security...)
	for _, trait := range op.Traits {
		if trait != nil {
			schemes = append(schemes, trait.Security...)
		}
	}
	return schemes
}

func asyncOperationHasSecurityField(op *highasync.Operation) bool {
	if op == nil || op.GoLow() == nil {
		return false
	}
	if op.GoLow().Security.Value != nil || op.GoLow().Security.KeyNode != nil || op.GoLow().Security.ValueNode != nil {
		return true
	}
	return yamlMappingValue(asyncRootNode(op), "security") != nil
}

func asyncMessageExamples(message *highasync.Message) []*AsyncAPIMessageExample {
	if message == nil || len(message.Examples) == 0 {
		return nil
	}
	result := make([]*AsyncAPIMessageExample, 0, len(message.Examples))
	for _, example := range message.Examples {
		if example == nil {
			continue
		}
		result = append(result, &AsyncAPIMessageExample{
			Name:    example.Name,
			Summary: example.Summary,
			Payload: yamlNodeToJSON(example.Payload),
			Headers: yamlNodeToJSON(example.Headers),
		})
	}
	return result
}

func escapeJSONPointerToken(token string) string {
	token = strings.ReplaceAll(token, "~", "~0")
	return strings.ReplaceAll(token, "/", "~1")
}

func asyncReference(value any) string {
	type referencer interface {
		IsReference() bool
		GetReference() string
	}
	type lowGetter interface {
		GoLowUntyped() any
	}
	if value == nil {
		return ""
	}
	if ref, ok := value.(referencer); ok && ref.IsReference() {
		return ref.GetReference()
	}
	if high, ok := value.(lowGetter); ok {
		if ref, ok := high.GoLowUntyped().(referencer); ok && ref.IsReference() {
			return ref.GetReference()
		}
	}
	return ""
}

func asyncReferenceName(ref string) string {
	if idx := strings.Index(ref, "#"); idx >= 0 {
		ref = ref[idx:]
	}
	ref = strings.Trim(ref, "/")
	if ref == "" {
		return ""
	}
	parts := strings.Split(ref, "/")
	return decodeJSONPointerToken(parts[len(parts)-1])
}

func uniqueNonEmptyStrings(values []string) []string {
	if len(values) == 0 {
		return nil
	}
	result := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if trimmed := strings.TrimSpace(value); trimmed != "" {
			return trimmed
		}
	}
	return ""
}
