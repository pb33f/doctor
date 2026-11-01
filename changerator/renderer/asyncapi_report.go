// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package renderer

import (
	"slices"
	"sort"
	"strings"

	dr "github.com/pb33f/doctor/model"
	async "github.com/pb33f/libasyncapi/what-changed/model"
	whatChanged "github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
)

// AsyncAPI supplies its native hierarchy to the existing Markdown/HTML report.
// Only the object traversal differs; summary, styling and change rows are shared.
func renderAsyncAPIReport(input *RenderInput, doc *async.DocumentChanges) string {
	r := &MarkdownReporter{changeReport: doc, config: input.Config, rightDocContent: input.RightDocContent,
		sourceFormat: DetectDocumentFormat(input.RightDocContent), deduplicatedChanges: input.DeduplicatedChanges}
	if r.config == nil {
		r.config = DefaultRenderConfig()
	}
	if r.deduplicatedChanges == nil {
		r.deduplicatedChanges = DeduplicateChanges(doc.GetAllChanges())
	}
	changes := r.deduplicatedChanges
	w := asyncReportWriter{reporter: r, remaining: make(map[changeIdentity]*model.Change, len(changes))}
	for _, ch := range changes {
		if ch != nil {
			w.remaining[changeKey(ch)] = ch
		}
	}
	w.output.WriteString("# What Changed Report\n\n")
	r.generateSummary(&w.output)
	w.output.WriteString("## Change Breakdown\n\n")

	// Whole-object additions/removals belong to their native section too.
	sections := map[string]*asyncReportGroup{}
	for _, s := range []struct{ key, title string }{
		{"document", "Document"}, {"info", "Document Info"}, {"servers", "Servers"},
		{"channels", "Channels"}, {"operations", "Operations"}, {"components", "Components"}, {"extensions", "Extensions"},
	} {
		sections[s.key] = &asyncReportGroup{writer: &w, title: s.title, level: 3}
	}
	rootChanges := make(map[string][]*model.Change)
	for _, ch := range doc.GetPropertyChanges() {
		section := ch.Property
		if sections[section] == nil {
			section = "document"
		}
		rootChanges[section] = append(rootChanges[section], ch)
	}
	sections["document"].write(rootChanges["document"])
	info := sections["info"]
	info.write(rootChanges["info"])
	if c := doc.InfoChanges; c != nil {
		infoGroup := &asyncReportGroup{writer: &w, parent: info, title: "Info", scope: "$.info", level: 4}
		infoGroup.write(c.GetPropertyChanges())
		info.object("Contact", "$.info", c.ContactChanges)
		info.object("License", "$.info", c.LicenseChanges)
		asyncArrayGroups(info, "Tag", "$.info.tags", c.TagChanges)
		info.object("External Documentation", "$.info", c.ExternalDocChanges)
		info.object("Extensions", "$.info", c.ExtensionChanges)
	}
	sections["servers"].write(rootChanges["servers"])
	asyncNamedGroups(sections["servers"], "Server", "$.servers", doc.ServerChanges)
	sections["channels"].write(rootChanges["channels"])
	asyncNamedGroups(sections["channels"], "Channel", "$.channels", doc.ChannelChanges)
	sections["operations"].write(rootChanges["operations"])
	asyncNamedGroups(sections["operations"], "Operation", "$.operations", doc.OperationChanges)
	components := sections["components"]
	components.write(rootChanges["components"])
	if c := doc.ComponentsChanges; c != nil {
		components.write(c.GetPropertyChanges())
		asyncNamedGroups(components, "Schema", "$.components.schemas", c.SchemaChanges)
		asyncNamedGroups(components, "Server", "$.components.servers", c.ServerChanges)
		asyncNamedGroups(components, "Channel", "$.components.channels", c.ChannelChanges)
		asyncNamedGroups(components, "Operation", "$.components.operations", c.OperationChanges)
		asyncNamedGroups(components, "Message", "$.components.messages", c.MessageChanges)
		asyncNamedGroups(components, "Security Scheme", "$.components.securitySchemes", c.SecuritySchemeChanges)
		asyncNamedGroups(components, "Server Variable", "$.components.serverVariables", c.ServerVariableChanges)
		asyncNamedGroups(components, "Parameter", "$.components.parameters", c.ParameterChanges)
		asyncNamedGroups(components, "Correlation ID", "$.components.correlationIds", c.CorrelationIDChanges)
		asyncNamedGroups(components, "Reply", "$.components.replies", c.ReplyChanges)
		asyncNamedGroups(components, "Reply Address", "$.components.replyAddresses", c.ReplyAddressChanges)
		asyncNamedGroups(components, "External Documentation", "$.components.externalDocs", c.ExternalDocChanges)
		asyncNamedGroups(components, "Tag", "$.components.tags", c.TagChanges)
		asyncNamedGroups(components, "Operation Trait", "$.components.operationTraits", c.OperationTraitChanges)
		asyncNamedGroups(components, "Message Trait", "$.components.messageTraits", c.MessageTraitChanges)
		asyncNamedGroups(components, "Server Bindings", "$.components.serverBindings", c.ServerBindingsChanges)
		asyncNamedGroups(components, "Channel Bindings", "$.components.channelBindings", c.ChannelBindingsChanges)
		asyncNamedGroups(components, "Operation Bindings", "$.components.operationBindings", c.OperationBindingsChanges)
		asyncNamedGroups(components, "Message Bindings", "$.components.messageBindings", c.MessageBindingsChanges)
		components.object("Extensions", "$.components", c.ExtensionChanges)
	}
	sections["extensions"].object("Extensions", "$", doc.ExtensionChanges)
	// Removing a $ref locates the change at its unchanged target, outside every
	// object's scope. It is still counted, so it must still be listed.
	other := &asyncReportGroup{writer: &w, title: "Other Changes", level: 3}
	for _, ch := range changes {
		if ch = other.eligible(ch); ch != nil {
			group := &asyncReportGroup{writer: &w, parent: other, title: pathCodeSpan(ch.Path), scope: ch.Path, level: 4}
			group.write(changes)
		}
	}
	return w.output.String()
}

// changeIdentity keeps distinct edits to one property (an enum add and remove)
// separate; only repeated comparisons through a shared reference collapse.
type changeIdentity struct {
	path, property, original, modified     string
	originalEncoded, newEncoded, reference string
	changeType                             int
	breaking                               bool
	// Changes without a semantic path are identified by their source position, or
	// by the change itself when that is unknown too.
	position  sourcePosition
	unlocated *model.Change
}

type sourcePosition struct {
	document                                         string
	originalLine, originalColumn, newLine, newColumn int
}

// DeduplicateChanges collapses repeated comparisons of one edit.
func DeduplicateChanges(changes []*model.Change) []*model.Change {
	seen := make(map[changeIdentity]bool, len(changes))
	deduplicated := make([]*model.Change, 0, len(changes))
	for _, ch := range changes {
		if ch == nil || seen[changeKey(ch)] {
			continue
		}
		seen[changeKey(ch)] = true
		deduplicated = append(deduplicated, ch)
	}
	return deduplicated
}

func changeKey(ch *model.Change) changeIdentity {
	key := changeIdentity{
		path: ch.Path, property: ch.Property, original: ch.Original, modified: ch.New,
		originalEncoded: ch.OriginalEncoded, newEncoded: ch.NewEncoded,
		reference: ch.Reference, changeType: ch.ChangeType, breaking: ch.Breaking,
	}
	if ch.Path == "" {
		if position, ok := changePosition(ch.Context); ok {
			key.position = position
		} else {
			key.unlocated = ch
		}
	}
	return key
}

func changePosition(context *model.ChangeContext) (sourcePosition, bool) {
	if context == nil || (context.OriginalLine == nil && context.NewLine == nil) {
		return sourcePosition{}, false
	}
	value := func(number *int) int {
		if number == nil {
			return -1
		}
		return *number
	}
	return sourcePosition{
		document:       context.DocumentLocation,
		originalLine:   value(context.OriginalLine),
		originalColumn: value(context.OriginalColumn),
		newLine:        value(context.NewLine),
		newColumn:      value(context.NewColumn),
	}, true
}

type asyncReportWriter struct {
	reporter  *MarkdownReporter
	output    strings.Builder
	remaining map[changeIdentity]*model.Change
}

type asyncReportGroup struct {
	writer   *asyncReportWriter
	parent   *asyncReportGroup
	title    string
	scope    string
	level    int
	started  bool
	breaking bool
}

func (g *asyncReportGroup) start() {
	if g.started {
		return
	}
	if g.parent != nil {
		g.parent.start()
	}
	b := &g.writer.output
	if g.level == 4 {
		b.WriteString("---\n\n")
	}
	if g.level <= 4 {
		b.WriteString(strings.Repeat("#", g.level) + " " + g.title)
	} else {
		b.WriteString("**" + g.title + "**")
	}
	if g.breaking {
		b.WriteString(" " + Breaking)
	}
	b.WriteString("\n\n")
	g.started = true
}

func (g *asyncReportGroup) eligible(ch *model.Change) *model.Change {
	if ch == nil || (ch.Path != "" && g.scope != "" && ch.Path != g.scope &&
		!strings.HasPrefix(ch.Path, g.scope+".") && !strings.HasPrefix(ch.Path, g.scope+"[")) {
		return nil
	}
	return g.writer.remaining[changeKey(ch)]
}

func (g *asyncReportGroup) write(changes []*model.Change) {
	for _, ch := range changes {
		if ch = g.eligible(ch); ch != nil && ch.Breaking && g.level > 3 {
			g.breaking = true
		}
	}
	wrote := false
	for _, ch := range changes {
		if ch = g.eligible(ch); ch != nil {
			g.start()
			g.writer.reporter.renderChange(&g.writer.output, ch)
			delete(g.writer.remaining, changeKey(ch))
			wrote = true
		}
	}
	if wrote {
		g.writer.output.WriteString("\n")
	}
}

func asyncNamedGroups[T whatChanged.Changed](parent *asyncReportGroup, label, path string, objects map[string]T) {
	for _, name := range sortedMapKeys(objects) {
		parent.object(label+": "+pathCodeSpan(name), dr.AsyncObjectPath(path, name), objects[name])
	}
}

// Tags and examples are named in the change model but indexed in the source.
func asyncArrayGroups[T whatChanged.Changed](parent *asyncReportGroup, label, path string, objects map[string]T) {
	for _, name := range sortedMapKeys(objects) {
		parent.object(label+": "+pathCodeSpan(name), path, objects[name])
	}
}

func (g *asyncReportGroup) object(title, scope string, changes whatChanged.Changed) {
	// Native GetAllChanges methods accept typed nil pointers.
	if changes == nil {
		return
	}
	all := changes.GetAllChanges()
	child := &asyncReportGroup{writer: g.writer, parent: g, title: title, scope: scope, level: g.level + 1}
	visible := false
	for _, ch := range all {
		if ch = child.eligible(ch); ch != nil {
			visible = true
			child.breaking = child.breaking || ch.Breaking
		}
	}
	if !visible {
		return
	}
	switch c := changes.(type) {
	case *async.ChannelChanges:
		child.write(c.GetPropertyChanges())
		asyncNamedGroups(child, "Message", scope+".messages", c.MessageChanges)
		asyncNamedGroups(child, "Parameter", scope+".parameters", c.ParameterChanges)
		asyncArrayGroups(child, "Tag", scope+".tags", c.TagChanges)
		child.object("Bindings", scope, c.BindingsChanges)
		child.object("External Documentation", scope, c.ExternalDocChanges)
		child.object("Extensions", scope, c.ExtensionChanges)
	case *async.ServerChanges:
		child.write(c.GetPropertyChanges())
		asyncNamedGroups(child, "Variable", scope+".variables", c.ServerVariableChanges)
		asyncArrayGroups(child, "Tag", scope+".tags", c.TagChanges)
		child.object("Bindings", scope, c.BindingsChanges)
		child.object("External Documentation", scope, c.ExternalDocChanges)
		child.object("Extensions", scope, c.ExtensionChanges)
	case *async.OperationChanges:
		child.write(c.GetPropertyChanges())
		asyncArrayGroups(child, "Tag", scope+".tags", c.TagChanges)
		child.object("Reply", scope, c.ReplyChanges)
		child.object("Bindings", scope, c.BindingsChanges)
		child.object("External Documentation", scope, c.ExternalDocChanges)
		child.object("Extensions", scope, c.ExtensionChanges)
	case *async.MessageChanges:
		child.write(c.GetPropertyChanges())
		child.object("Headers", scope, c.HeadersChanges)
		child.object("Payload", scope, c.PayloadChanges)
		child.object("Correlation ID", scope, c.CorrelationIDChanges)
		asyncArrayGroups(child, "Tag", scope+".tags", c.TagChanges)
		asyncArrayGroups(child, "Example", scope+".examples", c.ExampleChanges)
		child.object("Bindings", scope, c.BindingsChanges)
		child.object("External Documentation", scope, c.ExternalDocChanges)
		child.object("Extensions", scope, c.ExtensionChanges)
	default:
		// Match OpenAPI's component rendering, with stable order for map children.
		// Extensions expose their owned slice; other native models collect a new one.
		if _, extensions := changes.(*async.ExtensionChanges); extensions {
			all = slices.Clone(all)
		}
		sort.SliceStable(all, func(i, j int) bool {
			if all[i].Path != all[j].Path {
				return all[i].Path < all[j].Path
			}
			return all[i].Property < all[j].Property
		})
		child.write(all)
	}
}
