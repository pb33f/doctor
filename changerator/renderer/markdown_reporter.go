// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"fmt"
	"sort"
	"strings"

	drModel "github.com/pb33f/doctor/model"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	lowV3 "github.com/pb33f/libopenapi/datamodel/low/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

// indentCache pre-allocates common indent strings to avoid repeated allocations.
// most indentation is 2, 4, 6, or 8 spaces, so caching these provides significant performance gains.
var indentCache = map[int]string{
	2: "  ",
	4: "    ",
	6: "      ",
	8: "        ",
}

// MarkdownReporter generates markdown reports directly from DocumentChanges.
// This approach avoids duplication by using the already-deduplicated what-changed model.
type MarkdownReporter struct {
	docChanges      *model.DocumentChanges
	doctor          *drModel.DrDocument
	rightDocContent []byte
	sourceFormat    StructuredDataFormat // Format of the source document (YAML or JSON)
	config          *RenderConfig
}

// TypeStatistic holds change counts for a type
type TypeStatistic struct {
	Total    int
	Breaking int
}

// ReferenceType represents the type of component being referenced
type ReferenceType string

const (
	RefTypeComponentSchema         ReferenceType = "schema"
	RefTypeComponentParameter      ReferenceType = "parameter"
	RefTypeComponentHeader         ReferenceType = "header"
	RefTypeComponentResponse       ReferenceType = "response"
	RefTypeComponentRequestBody    ReferenceType = "requestBody"
	RefTypeComponentSecurityScheme ReferenceType = "securityScheme"
	RefTypeComponentExample        ReferenceType = "example"
	RefTypeComponentLink           ReferenceType = "link"
	RefTypeComponentCallback       ReferenceType = "callback"
	RefTypeOther                   ReferenceType = "other"
	Breaking                       string        = "**(💔 breaking)**"
)

// ReferenceInfo holds structured information about a $ref pointer
type ReferenceInfo struct {
	FullPath  string        // Full reference path (e.g., "#/components/schemas/Pet")
	Type      ReferenceType // Type of component being referenced
	Component string        // Component name (e.g., "Pet")
	FilePath  string        // File path for remote references
	IsLocal   bool          // Whether this is a local reference (#/...)
	IsRemote  bool          // Whether this is a remote reference (file.yaml#/...)
}

// ReferencedChange represents a component change that is referenced in multiple locations
type ReferencedChange struct {
	Reference *ReferenceInfo  // Information about the reference
	Changes   []*model.Change // The actual changes to this component
	UsedIn    []UsageLocation // Locations where this component is used
}

// UsageLocation represents where a referenced component is used
type UsageLocation struct {
	Path        string // Path to the usage (e.g., "/pets GET")
	Description string // Description of how it's used (e.g., "Response 200")
	LineNumber  int    // Line number in the spec (if available)
}

// marker injection helpers
func (r *MarkdownReporter) shouldInjectMarkers() bool {
	return r.config != nil &&
		r.config.HTML != nil &&
		r.config.HTML.EnableNestedListFix
}

// getIndent returns spaces for the given indentation level.
// uses 2 spaces per level to align with markdown list syntax where each level adds 2 spaces.
func getIndent(level int) string {
	if level <= 0 {
		return ""
	}
	return strings.Repeat("  ", level)
}

func (r *MarkdownReporter) wrapExample(report *strings.Builder, name string, indentLevel int, content func()) {
	indent := getIndent(indentLevel)
	if r.shouldInjectMarkers() {
		report.WriteString(fmt.Sprintf("%s<!-- pb33f-example-start:%s -->\n", indent, sanitizeName(name)))
	}
	content()
	if r.shouldInjectMarkers() {
		report.WriteString(fmt.Sprintf("%s<!-- pb33f-example-end:%s -->\n", indent, sanitizeName(name)))
	}
}

func sanitizeName(name string) string {
	return strings.NewReplacer(
		"-", "_",
		">", "gt",
		"<", "lt",
	).Replace(name)
}

// indentMultilineDesc adds indentation to multiline descriptions containing code blocks.
// for code blocks (starting with ```), ALL lines including the first are indented.
// for other content, the first line is not indented (handled by list prefix).
func indentMultilineDesc(desc string, indentSpaces int) string {
	if indentSpaces <= 0 || indentSpaces > 100 || !strings.Contains(desc, "\n") {
		return desc
	}

	lines := strings.Split(desc, "\n")
	if len(lines) <= 1 {
		return desc
	}

	// use cached indent string for common values, or create for uncommon ones
	indent, ok := indentCache[indentSpaces]
	if !ok {
		indent = strings.Repeat(" ", indentSpaces)
	}

	var sb strings.Builder
	// pre-allocate capacity: original length + (indent * number of lines affected)
	estimatedSize := len(desc) + (indentSpaces * len(lines))
	sb.Grow(estimatedSize)

	// check if this is a code block that needs full indentation
	// code blocks start with ``` and need ALL lines indented to stay within list
	isCodeBlock := strings.HasPrefix(strings.TrimSpace(lines[0]), "```")

	if isCodeBlock {
		// for code blocks, indent ALL lines including the first
		for i, line := range lines {
			if i > 0 {
				sb.WriteString("\n")
			}
			sb.WriteString(indent)
			sb.WriteString(line)
		}
	} else {
		// for regular text, first line is not indented (handled by list prefix)
		sb.WriteString(lines[0])
		for i := 1; i < len(lines); i++ {
			sb.WriteString("\n")
			sb.WriteString(indent)
			sb.WriteString(lines[i])
		}
	}

	return sb.String()
}

// writeIndentedChange writes a change description with proper code block indentation.
// this is a DRY helper that consolidates the common pattern of formatting and indenting changes.
func (r *MarkdownReporter) writeIndentedChange(
	report *strings.Builder,
	change *model.Change,
	codeBlockIndent int,
	prefix string,
) {
	desc, hasCodeBlock := r.formatChangeDescription(change)
	if hasCodeBlock {
		desc = indentMultilineDesc(desc, codeBlockIndent)
	}
	report.WriteString(fmt.Sprintf("%s- %s\n", prefix, desc))
}

// writeBreakingMarker writes a breaking marker with proper spacing based on context.
// code blocks need newlines before the marker, scalar values can have it inline.
func (r *MarkdownReporter) writeBreakingMarker(report *strings.Builder, hasCodeBlock bool) {
	if hasCodeBlock {
		report.WriteString("\n\n")
	} else {
		report.WriteString(" ")
	}
	report.WriteString(Breaking)
}

// NewMarkdownReporter creates a new markdown reporter from DocumentChanges
func NewMarkdownReporter(docChanges *model.DocumentChanges, doctor *drModel.DrDocument, rightDocContent []byte, config *RenderConfig) *MarkdownReporter {
	// Detect source document format
	sourceFormat := DetectDocumentFormat(rightDocContent)

	return &MarkdownReporter{
		docChanges:      docChanges,
		doctor:          doctor,
		rightDocContent: rightDocContent,
		sourceFormat:    sourceFormat,
		config:          config,
	}
}

// Generate creates a comprehensive markdown report from DocumentChanges
func (r *MarkdownReporter) Generate() string {
	var report strings.Builder

	report.WriteString("# What Changed Report\n\n")

	r.generateSummary(&report)

	r.generateBreakdown(&report)

	r.generateReferencedChanges(&report)

	return report.String()
}

func (r *MarkdownReporter) generateSummary(report *strings.Builder) {
	if r.docChanges == nil {
		report.WriteString("No changes detected.\n\n")
		return
	}

	totalChanges := r.docChanges.TotalChanges()
	breakingChanges := r.docChanges.TotalBreakingChanges()

	if totalChanges == 0 {
		report.WriteString("No changes detected.\n\n")
		return
	}

	// Summary sentence with proper pluralization
	changeWord := "changes"
	if totalChanges == 1 {
		changeWord = "change"
	}

	report.WriteString(fmt.Sprintf("**%d** %s detected", totalChanges, changeWord))
	if breakingChanges > 0 {
		breakingWord := "is"
		if breakingChanges > 1 || totalChanges > 1 {
			breakingWord = "are"
		}
		report.WriteString(fmt.Sprintf(", **%d** %s %s.\n\n", breakingChanges, breakingWord, Breaking))
	} else {
		report.WriteString(", with **no** breaking changes.\n\n")
	}

	// Calculate statistics by iterating all changes
	allChanges := r.docChanges.GetAllChanges()
	additions := 0
	modifications := 0
	deletions := 0

	for _, change := range allChanges {
		switch change.ChangeType {
		case model.PropertyAdded, model.ObjectAdded:
			additions++
		case model.Modified:
			modifications++
		case model.PropertyRemoved, model.ObjectRemoved:
			deletions++
		}
	}

	// Statistics breakdown - only show non-zero values
	if additions > 0 {
		report.WriteString(fmt.Sprintf("- Additions: **%d**\n", additions))
	}
	if modifications > 0 {
		report.WriteString(fmt.Sprintf("- Modifications: **%d**\n", modifications))
	}
	if deletions > 0 {
		report.WriteString(fmt.Sprintf("- Removals: **%d**\n", deletions))
	}
	report.WriteString("\n")

	// Generate changes by type table - walk hierarchy for accurate counting
	r.generateTypeStatistics(report)
}

// walks the DocumentChanges hierarchy to count changes at each specific level,
// avoiding double-counting nested changes
func (r *MarkdownReporter) generateTypeStatistics(report *strings.Builder) {
	typeStats := make(map[string]*TypeStatistic)

	// count changes by walking the hierarchy, using GetPropertyChanges() at each level
	// to avoid counting nested children multiple times

	// info changes
	if r.docChanges.InfoChanges != nil {
		r.addTypeStats(typeStats, "info", r.docChanges.InfoChanges.GetPropertyChanges())
		if r.docChanges.InfoChanges.ContactChanges != nil {
			r.addTypeStats(typeStats, "contact", r.docChanges.InfoChanges.ContactChanges.GetPropertyChanges())
		}
		if r.docChanges.InfoChanges.LicenseChanges != nil {
			r.addTypeStats(typeStats, "license", r.docChanges.InfoChanges.LicenseChanges.GetPropertyChanges())
		}
	}

	// server changes
	for _, sc := range r.docChanges.ServerChanges {
		if sc != nil {
			r.addTypeStats(typeStats, "server", sc.GetPropertyChanges())
		}
	}

	// Tag changes
	for _, tc := range r.docChanges.TagChanges {
		if tc != nil {
			r.addTypeStats(typeStats, "tag", tc.GetPropertyChanges())
		}
	}

	// Security requirement changes
	for _, src := range r.docChanges.SecurityRequirementChanges {
		if src != nil {
			r.addTypeStats(typeStats, "security", src.GetPropertyChanges())
		}
	}

	// Paths changes
	if r.docChanges.PathsChanges != nil {
		r.addTypeStats(typeStats, "paths", r.docChanges.PathsChanges.GetPropertyChanges())

		// Path item changes - use helper to walk full tree
		for _, pic := range r.docChanges.PathsChanges.PathItemsChanges {
			if pic != nil {
				r.addPathItemStats(typeStats, pic)
			}
		}
	}

	// Webhook changes - walk full tree like paths
	for _, whc := range r.docChanges.WebhookChanges {
		if whc != nil {
			r.addPathItemStats(typeStats, whc)
		}
	}

	// Components changes
	if r.docChanges.ComponentsChanges != nil {
		r.addTypeStats(typeStats, "components", r.docChanges.ComponentsChanges.GetPropertyChanges())

		// Schema changes
		for _, sc := range r.docChanges.ComponentsChanges.SchemaChanges {
			if sc != nil {
				r.addTypeStats(typeStats, "schema", sc.GetPropertyChanges())
			}
		}

		// Security scheme changes
		for _, ssc := range r.docChanges.ComponentsChanges.SecuritySchemeChanges {
			if ssc != nil {
				r.addTypeStats(typeStats, "securityScheme", ssc.GetPropertyChanges())
			}
		}
	}

	// Extension changes
	if r.docChanges.ExtensionChanges != nil {
		r.addTypeStats(typeStats, "extension", r.docChanges.ExtensionChanges.GetPropertyChanges())
	}

	if len(typeStats) == 0 {
		return
	}

	report.WriteString("| Object               | Total Changes | Breaking Changes |\n")
	report.WriteString("|----------------------|---------------|------------------|\n")

	for _, typ := range sortedMapKeys(typeStats) {
		stat := typeStats[typ]
		breakingStr := "-"
		if stat.Breaking > 0 {
			breakingStr = fmt.Sprintf("%d", stat.Breaking)
		}
		report.WriteString(fmt.Sprintf("| %s | %d | %s |\n",
			FormatObjectType(typ), stat.Total, breakingStr))
	}
	report.WriteString("\n")
}

// addTypeStats is a helper that adds statistics for a specific type
func (r *MarkdownReporter) addTypeStats(typeStats map[string]*TypeStatistic, typeName string, changes []*model.Change) {
	if len(changes) == 0 {
		return
	}

	if _, exists := typeStats[typeName]; !exists {
		typeStats[typeName] = &TypeStatistic{}
	}

	for _, change := range changes {
		typeStats[typeName].Total++
		if change.Breaking {
			typeStats[typeName].Breaking++
		}
	}
}

// addPathItemStats walks a PathItemChanges tree and adds statistics for all nested changes.
// used for both paths and webhooks to avoid code duplication.
func (r *MarkdownReporter) addPathItemStats(typeStats map[string]*TypeStatistic, pic *model.PathItemChanges) {
	// Path/webhook item level
	r.addTypeStats(typeStats, "pathItem", pic.GetPropertyChanges())

	// Operation changes
	operations := []*model.OperationChanges{
		pic.GetChanges, pic.PostChanges, pic.PutChanges,
		pic.DeleteChanges, pic.PatchChanges, pic.OptionsChanges,
		pic.HeadChanges, pic.TraceChanges, pic.QueryChanges,
	}
	for _, oc := range operations {
		if oc != nil {
			r.addTypeStats(typeStats, "operation", oc.GetPropertyChanges())

			// Parameter changes
			for _, pc := range oc.ParameterChanges {
				if pc != nil {
					r.addTypeStats(typeStats, "parameter", pc.GetPropertyChanges())
				}
			}

			// Response changes
			if oc.ResponsesChanges != nil {
				for _, rc := range oc.ResponsesChanges.ResponseChanges {
					if rc != nil {
						r.addTypeStats(typeStats, "response", rc.GetPropertyChanges())

						// Header changes within responses
						for _, hc := range rc.HeadersChanges {
							if hc != nil {
								r.addTypeStats(typeStats, "header", hc.GetPropertyChanges())
							}
						}

						// Content/Media type changes within responses
						for _, mtc := range rc.ContentChanges {
							if mtc != nil {
								r.addTypeStats(typeStats, "mediaType", mtc.GetPropertyChanges())

								// Example changes
								for _, ec := range mtc.ExampleChanges {
									if ec != nil {
										r.addTypeStats(typeStats, "example", ec.GetPropertyChanges())
									}
								}
							}
						}
					}
				}
			}

			// Request body changes
			if oc.RequestBodyChanges != nil {
				r.addTypeStats(typeStats, "requestBody", oc.RequestBodyChanges.GetPropertyChanges())

				// Media type changes within request body
				for _, mtc := range oc.RequestBodyChanges.ContentChanges {
					if mtc != nil {
						r.addTypeStats(typeStats, "mediaType", mtc.GetPropertyChanges())

						// Example changes within media types
						for _, ec := range mtc.ExampleChanges {
							if ec != nil {
								r.addTypeStats(typeStats, "example", ec.GetPropertyChanges())
							}
						}
					}
				}
			}

			// Callback changes
			for _, cc := range oc.CallbackChanges {
				if cc != nil {
					r.addTypeStats(typeStats, "callback", cc.GetPropertyChanges())
				}
			}
		}
	}

	// PathItem/webhook parameter changes
	for _, pc := range pic.ParameterChanges {
		if pc != nil {
			r.addTypeStats(typeStats, "parameter", pc.GetPropertyChanges())
		}
	}
}

// inferChangeType determines the actual object type from a change using Doctor's line lookup.
// This provides accurate type information instead of relying on property name heuristics.
func (r *MarkdownReporter) inferChangeType(change *model.Change) string {
	if r.doctor == nil || change.Context == nil {
		return "document"
	}

	// Get line number from context
	var lineNum int
	if change.Context.NewLine != nil {
		lineNum = *change.Context.NewLine
	} else if change.Context.OriginalLine != nil {
		lineNum = *change.Context.OriginalLine
	}

	if lineNum == 0 {
		return "document"
	}

	// Locate the model at this line
	models, err := r.doctor.LocateModelByLine(lineNum)
	if err != nil || len(models) == 0 {
		return "document"
	}

	// Determine type from the model using HasValue interface
	for _, m := range models {
		if hv, ok := m.(drV3.HasValue); ok {
			val := hv.GetValue()
			switch val.(type) {
			case *base.Info:
				return "info"
			case *base.Contact:
				return "contact"
			case *base.License:
				return "license"
			case *base.Tag:
				return "tag"
			case *v3.Operation:
				return "operation"
			case *v3.Parameter:
				return "parameter"
			case *drV3.Schema:
				return "schema"
			case *drV3.Response:
				return "response"
			case *drV3.RequestBody:
				return "requestBody"
			case *drV3.Header:
				return "header"
			case *drV3.MediaType:
				return "mediaType"
			case *drV3.PathItem:
				return "path"
			case *drV3.Server:
				return "server"
			case *drV3.SecurityScheme:
				return "securityScheme"
			case *drV3.Callback:
				return "callback"
			case *drV3.Link:
				return "link"
			case *base.Example:
				return "example"
			case *base.ExternalDoc:
				return "externalDoc"
			}
		}
	}

	return "document"
}

func (r *MarkdownReporter) generateBreakdown(report *strings.Builder) {
	report.WriteString("## Change Breakdown\n\n")

	// Document Info
	if r.docChanges.InfoChanges != nil && r.docChanges.InfoChanges.TotalChanges() > 0 {
		report.WriteString("### Document Info\n\n")
		r.renderInfoChanges(report)
	}

	// Servers
	if len(r.docChanges.ServerChanges) > 0 {
		report.WriteString("### Servers\n\n")
		r.renderServerChanges(report)
	}

	// Security
	if len(r.docChanges.SecurityRequirementChanges) > 0 {
		report.WriteString("### Security\n\n")
		r.renderSecurityChanges(report)
	}

	// Tags
	if len(r.docChanges.TagChanges) > 0 {
		report.WriteString("### Tags\n\n")
		r.renderTagChanges(report)
	}

	// Operations (Paths)
	if r.docChanges.PathsChanges != nil && r.docChanges.PathsChanges.TotalChanges() > 0 {
		report.WriteString("### Operations\n\n")
		r.renderPathsChanges(report)
	}

	// Webhooks
	if len(r.docChanges.WebhookChanges) > 0 {
		report.WriteString("### Webhooks\n\n")
		r.renderWebhookChanges(report)
	}

	// Components
	if r.docChanges.ComponentsChanges != nil && r.docChanges.ComponentsChanges.TotalChanges() > 0 {
		report.WriteString("### Components\n\n")
		r.renderComponentsChanges(report)
	}

	// Extensions
	if r.docChanges.ExtensionChanges != nil && r.docChanges.ExtensionChanges.TotalChanges() > 0 {
		report.WriteString("### Extensions\n\n")
		r.renderExtensionChanges(report)
	}
}

func (r *MarkdownReporter) renderInfoChanges(report *strings.Builder) {
	infoChanges := r.docChanges.InfoChanges
	if infoChanges == nil {
		return
	}

	// Render top-level info property changes
	if len(infoChanges.GetPropertyChanges()) > 0 {
		hasBreaking := infoChanges.TotalBreakingChanges() > 0

		report.WriteString("---\n\n")
		if hasBreaking {
			report.WriteString("#### Info " + Breaking + " \n\n")
		} else {
			report.WriteString("#### Info\n\n")
		}

		for _, change := range infoChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		report.WriteString("\n")
	}

	// Render contact changes
	if infoChanges.ContactChanges != nil && infoChanges.ContactChanges.TotalChanges() > 0 {
		report.WriteString("---\n\n")
		report.WriteString("#### Contact\n\n")

		for _, change := range infoChanges.ContactChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		report.WriteString("\n")
	}

	// Render license changes
	if infoChanges.LicenseChanges != nil && infoChanges.LicenseChanges.TotalChanges() > 0 {
		report.WriteString("---\n\n")
		report.WriteString("#### License\n\n")

		for _, change := range infoChanges.LicenseChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		// Render license extensions
		r.renderNestedExtensions(report, infoChanges.LicenseChanges.ExtensionChanges, false)

		report.WriteString("\n")
	}

	// Render info extensions
	r.renderNestedExtensions(report, infoChanges.ExtensionChanges, false)
}

func (r *MarkdownReporter) renderServerChanges(report *strings.Builder) {
	for _, serverChange := range r.docChanges.ServerChanges {
		if serverChange == nil || serverChange.TotalChanges() == 0 {
			continue
		}

		// Extract server identifier from the changes or the Server object
		serverIdentifier := r.getServerIdentifier(serverChange)

		report.WriteString("---\n\n")
		hasBreaking := serverChange.TotalBreakingChanges() > 0
		if hasBreaking {
			report.WriteString(fmt.Sprintf("#### %s %s\n\n", serverIdentifier, Breaking))
		} else {
			report.WriteString(fmt.Sprintf("#### %s\n\n", serverIdentifier))
		}

		for _, change := range serverChange.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		// Render server extensions
		r.renderNestedExtensions(report, serverChange.ExtensionChanges, false)

		report.WriteString("\n")
	}
}

// getServerIdentifier extracts a meaningful identifier for a server from its changes
func (r *MarkdownReporter) getServerIdentifier(serverChange *model.ServerChanges) string {
	if serverChange.Server != nil && !serverChange.Server.URL.IsEmpty() {
		return fmt.Sprintf("Server: `%s`", serverChange.Server.URL.Value)
	}

	changes := serverChange.GetPropertyChanges()
	var fallbackLineNum *int

	for _, change := range changes {
		if change.Property == "url" {
			if change.New != "" {
				return fmt.Sprintf("Server: `%s`", change.New)
			}
			if change.Original != "" {
				return fmt.Sprintf("Server: `%s`", change.Original)
			}
		}

		// handles cases like "servers removed 'https://...'" where property is "servers"
		if change.ChangeType == model.ObjectAdded || change.ChangeType == model.ObjectRemoved {
			urlValue := change.New
			if urlValue == "" {
				urlValue = change.Original
			}
			if urlValue != "" && isHTTPURL(urlValue) {
				return fmt.Sprintf("Server: `%s`", urlValue)
			}
		}

		if fallbackLineNum == nil && change.Context != nil {
			if change.Context.NewLine != nil {
				fallbackLineNum = change.Context.NewLine
			} else if change.Context.OriginalLine != nil {
				fallbackLineNum = change.Context.OriginalLine
			}
		}
	}

	if fallbackLineNum != nil {
		return fmt.Sprintf("Server (line %d)", *fallbackLineNum)
	}

	return "Server"
}

func isHTTPURL(url string) bool {
	return strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://")
}

func findLineNumber(changes []*model.Change) *int {
	for _, change := range changes {
		if change.Context != nil {
			if change.Context.NewLine != nil {
				return change.Context.NewLine
			}
			if change.Context.OriginalLine != nil {
				return change.Context.OriginalLine
			}
		}
	}
	return nil
}

func (r *MarkdownReporter) getSecurityRequirementName(secChange *model.SecurityRequirementChanges) string {
	// security requirements are key-value pairs where the key is the security scheme name
	for _, change := range secChange.GetPropertyChanges() {
		// for ObjectAdded/ObjectRemoved, the property name is the security scheme name
		if change.ChangeType == model.ObjectAdded || change.ChangeType == model.ObjectRemoved {
			if change.Property != "" && change.Property != "security" {
				return fmt.Sprintf("Security Requirement: `%s`", change.Property)
			}
		}

		if change.Property != "" && change.Property != "security" {
			return fmt.Sprintf("Security Requirement: `%s`", change.Property)
		}
	}

	allChanges := secChange.GetAllChanges()
	for _, change := range allChanges {
		if change.Path != "" && strings.Contains(change.Path, "security[") {
			// extract scheme name from path like "$.security[0]['oauth2']"
			start := strings.LastIndex(change.Path, "['")
			if start != -1 {
				start += 2
				end := strings.Index(change.Path[start:], "']")
				if end != -1 {
					schemeName := change.Path[start : start+end]
					if schemeName != "" {
						return fmt.Sprintf("Security Requirement: `%s`", schemeName)
					}
				}
			}
		}
	}

	return "Security Requirement"
}

func (r *MarkdownReporter) renderSecurityChanges(report *strings.Builder) {
	for _, secChange := range r.docChanges.SecurityRequirementChanges {
		if secChange == nil || secChange.TotalChanges() == 0 {
			continue
		}

		secName := r.getSecurityRequirementName(secChange)

		report.WriteString("---\n\n")
		hasBreaking := secChange.TotalBreakingChanges() > 0
		if hasBreaking {
			report.WriteString(fmt.Sprintf("#### %s %s\n\n", secName, Breaking))
		} else {
			report.WriteString(fmt.Sprintf("#### %s\n\n", secName))
		}

		for _, change := range secChange.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		report.WriteString("\n")
	}
}

func (r *MarkdownReporter) renderTagChanges(report *strings.Builder) {
	for _, tagChange := range r.docChanges.TagChanges {
		if tagChange == nil || tagChange.TotalChanges() == 0 {
			continue
		}

		// Extract tag name from changes
		tagName := r.getTagName(tagChange)

		report.WriteString("---\n\n")
		hasBreaking := tagChange.TotalBreakingChanges() > 0
		if hasBreaking {
			report.WriteString(fmt.Sprintf("#### %s %s\n\n", tagName, Breaking))
		} else {
			report.WriteString(fmt.Sprintf("#### %s\n\n", tagName))
		}

		for _, change := range tagChange.GetPropertyChanges() {
			r.renderChange(report, change)
		}

		// Render tag extensions
		r.renderNestedExtensions(report, tagChange.ExtensionChanges, false)

		report.WriteString("\n")
	}
}

// getTagName extracts the tag name from tag changes using the Doctor's line lookup
func (r *MarkdownReporter) getTagName(tagChange *model.TagChanges) string {
	// When a tag is added/removed, the property name IS the tag name
	for _, change := range tagChange.GetPropertyChanges() {
		if change.ChangeType == model.ObjectAdded || change.ChangeType == model.ObjectRemoved {
			if change.Property != "" && change.Property != "tags" {
				return fmt.Sprintf("Tag: `%s`", change.Property)
			}
		}
	}

	// For modifications, use Doctor's LocateModelByLine to get the actual model
	allChanges := tagChange.GetAllChanges()
	if len(allChanges) > 0 && r.doctor != nil {
		// Try to get line number from any change
		var lineNum int
		for _, change := range allChanges {
			if change.Context != nil {
				if change.Context.NewLine != nil {
					lineNum = *change.Context.NewLine
					break
				}
				if change.Context.OriginalLine != nil {
					lineNum = *change.Context.OriginalLine
					break
				}
			}
		}

		// Use Doctor to locate the model at this line
		if lineNum > 0 {
			models, err := r.doctor.LocateModelByLine(lineNum)
			if err == nil && len(models) > 0 {
				// Look for a Tag model using HasValue interface
				for _, m := range models {
					if hv, ok := m.(drV3.HasValue); ok {
						if tag, ok := hv.GetValue().(*base.Tag); ok {
							if tag.Name != "" {
								return fmt.Sprintf("Tag: `%s`", tag.Name)
							}
						}
					}
				}
			}
		}

		// Fallback: use line number
		if lineNum > 0 {
			return fmt.Sprintf("Tag (__line %d__)", lineNum)
		}
	}

	return "Tag"
}

func (r *MarkdownReporter) renderPathsChanges(report *strings.Builder) {
	pathsChanges := r.docChanges.PathsChanges
	if pathsChanges == nil {
		return
	}

	// Render path-level changes (adding/removing entire paths)
	if len(pathsChanges.GetPropertyChanges()) > 0 {
		for _, change := range pathsChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}
		report.WriteString("\n")
	}

	for _, path := range sortedMapKeys(pathsChanges.PathItemsChanges) {
		pathItemChanges := pathsChanges.PathItemsChanges[path]
		if pathItemChanges == nil || pathItemChanges.TotalChanges() == 0 {
			continue
		}

		// Check if the entire PathItem is a reference
		ref := pathItemChanges.GetChangeReference()
		if ref != "" {
			report.WriteString("---\n\n")
			report.WriteString(fmt.Sprintf("#### Path `%s`: See referenced component `%s`\n\n", path, ref))
			continue
		}

		r.renderPathItemChanges(report, path, pathItemChanges)
	}
}

// renderPathItemChanges renders changes for a specific path
func (r *MarkdownReporter) renderPathItemChanges(report *strings.Builder, path string, pathItemChanges *model.PathItemChanges) {
	// Check if the entire PathItem is a reference
	ref := pathItemChanges.GetChangeReference()
	if ref != "" {
		report.WriteString("---\n\n")
		report.WriteString(fmt.Sprintf("#### Path `%s`: See referenced component `%s`\n\n", path, ref))
		return
	}

	// Render path-level changes with custom header
	hasPathLevelContent := len(pathItemChanges.GetPropertyChanges()) > 0 || len(pathItemChanges.ParameterChanges) > 0

	if hasPathLevelContent {
		hasBreaking := pathItemChanges.TotalBreakingChanges() > 0
		report.WriteString("---\n\n")
		if hasBreaking {
			report.WriteString(fmt.Sprintf("#### Path `%s` %s\n\n", path, Breaking))
		} else {
			report.WriteString(fmt.Sprintf("#### Path `%s`\n\n", path))
		}
	}

	// Render the path item content (properties, parameters, operations)
	r.renderPathItemContent(report, path, pathItemChanges, "Path Parameters")
}

// renderPathItemContent renders the common content of a PathItemChanges (path or webhook).
// parametersLabel is used for the parameters section header (e.g., "Path Parameters" or "Webhook Parameters").
func (r *MarkdownReporter) renderPathItemContent(report *strings.Builder, itemName string, pathItemChanges *model.PathItemChanges, parametersLabel string) {
	// Render path/webhook-level property changes
	for _, change := range pathItemChanges.GetPropertyChanges() {
		r.renderChange(report, change)
	}

	// Render path/webhook-level parameters (shared across all operations)
	if len(pathItemChanges.ParameterChanges) > 0 {
		report.WriteString(fmt.Sprintf("\n**%s:**\n\n", parametersLabel))
		for _, paramChange := range pathItemChanges.ParameterChanges {
			if paramChange != nil && paramChange.TotalChanges() > 0 {
				ref := paramChange.GetChangeReference()
				paramName := r.getParameterName(paramChange)
				if ref != "" {
					report.WriteString(fmt.Sprintf("- %s: See referenced component `%s`\n", paramName, ref))
				} else {
					report.WriteString(fmt.Sprintf("- %s:\n", paramName))
					// Render direct parameter property changes
					for _, change := range paramChange.GetPropertyChanges() {
						r.writeIndentedChange(report, change, 4, "  ")
					}
					// Render schema changes (type, format, etc.)
					if paramChange.SchemaChanges != nil {
						for _, change := range paramChange.SchemaChanges.GetAllChanges() {
							r.writeIndentedChange(report, change, 4, "  ")
						}
					}
					r.renderNestedExtensions(report, paramChange.ExtensionChanges, true)
				}
			}
		}
	}

	// Render path/webhook item extensions
	r.renderNestedExtensions(report, pathItemChanges.ExtensionChanges, false)

	if len(pathItemChanges.GetPropertyChanges()) > 0 || len(pathItemChanges.ParameterChanges) > 0 {
		report.WriteString("\n")
	}

	// Render each operation's detailed changes (GET, POST, PUT, DELETE, etc.)
	// iterate through all HTTP methods to avoid repetitive if-blocks
	operationMethods := []struct {
		name    string
		changes *model.OperationChanges
	}{
		{"GET", pathItemChanges.GetChanges},
		{"POST", pathItemChanges.PostChanges},
		{"PUT", pathItemChanges.PutChanges},
		{"DELETE", pathItemChanges.DeleteChanges},
		{"PATCH", pathItemChanges.PatchChanges},
		{"OPTIONS", pathItemChanges.OptionsChanges},
		{"HEAD", pathItemChanges.HeadChanges},
		{"TRACE", pathItemChanges.TraceChanges},
		{"QUERY", pathItemChanges.QueryChanges}, // OpenAPI 3.1+
	}

	for _, method := range operationMethods {
		if method.changes != nil && method.changes.TotalChanges() > 0 {
			r.renderOperationChanges(report, method.name, itemName, method.changes)
		}
	}
}

// renderOperationChanges renders changes for a specific operation with hierarchical subsections
func (r *MarkdownReporter) renderOperationChanges(report *strings.Builder, method, path string, opChanges *model.OperationChanges) {
	if opChanges == nil {
		return
	}

	hasBreaking := opChanges.TotalBreakingChanges() > 0

	report.WriteString("---\n\n")
	if hasBreaking {
		report.WriteString(fmt.Sprintf("#### **%s** `%s` %s\n\n", method, path, Breaking))
	} else {
		report.WriteString(fmt.Sprintf("#### **%s** `%s`\n\n", method, path))
	}

	// Render direct operation property changes (summary, operationId, description, etc.)
	// Separate parameter-related changes from other property changes
	var parameterChanges []*model.Change
	var otherChanges []*model.Change

	for _, change := range opChanges.GetPropertyChanges() {
		if change.Property == "parameters" || isParameterPropertyChange(change) {
			parameterChanges = append(parameterChanges, change)
		} else {
			otherChanges = append(otherChanges, change)
		}
	}

	// Render non-parameter property changes first
	if len(otherChanges) > 0 {
		r.wrapExample(report, "operation-properties", 0, func() {
			for _, change := range otherChanges {
				r.renderChange(report, change)
			}
		})
		report.WriteString("\n")
	}

	// Parameters subsection - include both simple parameter changes and detailed ParameterChanges
	hasParameterChanges := len(parameterChanges) > 0 || len(opChanges.ParameterChanges) > 0
	if hasParameterChanges {
		report.WriteString("**Parameters:**\n\n")

		// First render simple parameter additions/removals
		for _, change := range parameterChanges {
			r.renderChange(report, change)
		}

		// Then render detailed parameter changes
		for _, paramChange := range opChanges.ParameterChanges {
			if paramChange != nil && paramChange.TotalChanges() > 0 {
				ref := paramChange.GetChangeReference()
				paramName := r.getParameterName(paramChange)
				if ref != "" {
					report.WriteString(fmt.Sprintf("- %s: See referenced component `%s`\n", paramName, ref))
				} else {
					report.WriteString(fmt.Sprintf("- %s:\n", paramName))
					// Render direct parameter property changes
					for _, change := range paramChange.GetPropertyChanges() {
						r.writeIndentedChange(report, change, 4, "  ")
					}
					// Render schema changes (type, format, etc.)
					if paramChange.SchemaChanges != nil {
						for _, change := range paramChange.SchemaChanges.GetAllChanges() {
							r.writeIndentedChange(report, change, 4, "  ")
						}
					}
					r.renderNestedExtensions(report, paramChange.ExtensionChanges, true)
				}
			}
		}
		report.WriteString("\n")
	}

	// External Documentation subsection
	if opChanges.ExternalDocChanges != nil && opChanges.ExternalDocChanges.TotalChanges() > 0 {
		ref := opChanges.ExternalDocChanges.GetChangeReference()
		if ref != "" {
			report.WriteString(fmt.Sprintf("**External Documentation:** See referenced component `%s`\n\n", ref))
		} else {
			report.WriteString("**External Documentation:**\n\n")

			for _, change := range opChanges.ExternalDocChanges.GetPropertyChanges() {
				r.renderChange(report, change)
			}

			r.renderNestedExtensions(report, opChanges.ExternalDocChanges.ExtensionChanges, false)
			report.WriteString("\n")
		}
	}

	// servers subsection
	if len(opChanges.ServerChanges) > 0 {
		headerWritten := false

		for i, serverChange := range opChanges.ServerChanges {
			if serverChange == nil || serverChange.TotalChanges() == 0 {
				continue
			}

			if !headerWritten {
				report.WriteString("**Servers:**\n\n")
				headerWritten = true
			}

			serverID := r.getServerIdentifier(serverChange)
			if serverID == "" {
				serverID = fmt.Sprintf("Server %d", i)
			}

			ref := serverChange.GetChangeReference()
			if ref != "" {
				report.WriteString(fmt.Sprintf("- %s: See referenced component `%s`\n", serverID, ref))
			} else {
				report.WriteString(fmt.Sprintf("- %s:\n", serverID))

				for _, change := range serverChange.GetPropertyChanges() {
					r.writeIndentedChange(report, change, 4, "  ")
				}

				// render server variables in sorted order
				if len(serverChange.ServerVariableChanges) > 0 {
					for _, varName := range sortedMapKeys(serverChange.ServerVariableChanges) {
						varChange := serverChange.ServerVariableChanges[varName]
						if varChange != nil && varChange.TotalChanges() > 0 {
							report.WriteString(fmt.Sprintf("  - Variable `%s`:\n", varName))
							for _, change := range varChange.GetPropertyChanges() {
								r.writeIndentedChange(report, change, 6, "    ")
							}
						}
					}
				}

				r.renderNestedExtensions(report, serverChange.ExtensionChanges, true)
			}
		}

		if headerWritten {
			report.WriteString("\n")
		}
	}

	// Request Body subsection
	if opChanges.RequestBodyChanges != nil && opChanges.RequestBodyChanges.TotalChanges() > 0 {
		ref := opChanges.RequestBodyChanges.GetChangeReference()
		if ref != "" {
			report.WriteString(fmt.Sprintf("**Request Body:** See referenced component `%s`\n\n", ref))
		} else {
			report.WriteString("**Request Body:**\n\n")

			// Render request body property changes (description, required, etc.)
			for _, change := range opChanges.RequestBodyChanges.GetPropertyChanges() {
				r.renderChange(report, change)
			}

			// content/media type changes include properties and examples
			if len(opChanges.RequestBodyChanges.ContentChanges) > 0 {
				for _, mt := range sortedMapKeys(opChanges.RequestBodyChanges.ContentChanges) {
					mtChange := opChanges.RequestBodyChanges.ContentChanges[mt]
					if mtChange != nil && mtChange.TotalChanges() > 0 {
						report.WriteString(fmt.Sprintf("- Media Type `%s`:\n", mt))

						// render example changes first to avoid list context breaking
						// render example changes within media types
						if len(mtChange.ExampleChanges) > 0 {
							for exName, exChange := range mtChange.ExampleChanges {
								if exChange != nil && exChange.TotalChanges() > 0 {
									ref := exChange.GetChangeReference()
									if ref != "" {
										report.WriteString(fmt.Sprintf("  - Example `%s`: See referenced component `%s`\n", exName, ref))
									} else {
										r.wrapExample(report, exName, 1, func() {
											report.WriteString(fmt.Sprintf("  - Example `%s`:\n", exName))
											for _, change := range exChange.GetPropertyChanges() {
												r.writeIndentedChange(report, change, 6, "    ")
											}
										})
									}
								}
							}
						}

						// render media type property changes last to avoid Goldmark list context issues
						r.renderMediaTypePropertyChanges(report, mtChange, mt, 1)

						r.renderNestedExtensions(report, mtChange.ExtensionChanges, true)
					}
				}
			}

			r.renderNestedExtensions(report, opChanges.RequestBodyChanges.ExtensionChanges, false)
			report.WriteString("\n")
		}
	}

	// Responses subsection
	if opChanges.ResponsesChanges != nil && opChanges.ResponsesChanges.TotalChanges() > 0 {
		report.WriteString("**Responses:**\n\n")
		r.renderResponsesBreakdown(report, opChanges.ResponsesChanges)
	}

	// Callbacks subsection
	if len(opChanges.CallbackChanges) > 0 {
		report.WriteString("**Callbacks:**\n\n")
		for _, cbName := range sortedMapKeys(opChanges.CallbackChanges) {
			cbChange := opChanges.CallbackChanges[cbName]
			if cbChange != nil && cbChange.TotalChanges() > 0 {
				ref := cbChange.GetChangeReference()
				if ref != "" {
					report.WriteString(fmt.Sprintf("- Callback `%s`: See referenced component `%s`\n", cbName, ref))
				} else {
					report.WriteString(fmt.Sprintf("- Callback `%s`:\n", cbName))
					for _, change := range cbChange.GetPropertyChanges() {
						r.writeIndentedChange(report, change, 4, "  ")
					}

					// render callback expressions (pathItems)
					if len(cbChange.ExpressionChanges) > 0 {
						for _, exprName := range sortedMapKeys(cbChange.ExpressionChanges) {
							pathItemChange := cbChange.ExpressionChanges[exprName]
							if pathItemChange != nil && pathItemChange.TotalChanges() > 0 {
								report.WriteString(fmt.Sprintf("  - Expression `%s`:\n", exprName))

								// render pathItem-level property changes
								for _, change := range pathItemChange.GetPropertyChanges() {
									r.writeIndentedChange(report, change, 6, "    ")
								}

								// render operation summaries (hybrid approach - not full details)
								r.renderCallbackOperationSummaries(report, pathItemChange)
							}
						}
					}

					r.renderNestedExtensions(report, cbChange.ExtensionChanges, true)
				}
			}
		}
		report.WriteString("\n")
	}

	// Render operation extensions
	if opChanges.ExtensionChanges != nil && opChanges.ExtensionChanges.TotalChanges() > 0 {
		r.renderNestedExtensions(report, opChanges.ExtensionChanges, false)
	}

	report.WriteString("\n")
}

// renderMediaTypePropertyChanges renders property changes for a media type.
// handles both simple text changes and complex values with code blocks.
func (r *MarkdownReporter) renderMediaTypePropertyChanges(
	report *strings.Builder,
	mtChange *model.MediaTypeChanges,
	mediaTypeName string,
	indentLevel int,
) {
	if len(mtChange.GetPropertyChanges()) == 0 {
		return
	}

	indent := getIndent(indentLevel + 1)
	// code blocks need to be indented 2 spaces beyond the list marker
	// list marker is at (indentLevel+1)*2 spaces
	// so code blocks should be at (indentLevel+1)*2 + 2 spaces
	// for indentLevel=1 (request body): 4 + 2 = 6 spaces
	// for indentLevel=2 (responses): 6 + 2 = 8 spaces
	codeIndent := (indentLevel + 1) * 2 + 2

	for _, change := range mtChange.GetPropertyChanges() {
		r.writeIndentedChange(report, change, codeIndent, indent)
	}
}

// renderCallbackOperationSummaries renders operation summaries for callback expressions.
// hybrid approach - operation summaries only, no full request/response details to avoid deep nesting.
func (r *MarkdownReporter) renderCallbackOperationSummaries(report *strings.Builder, pathItemChanges *model.PathItemChanges) {
	if pathItemChanges == nil {
		return
	}

	methods := []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD", "TRACE", "QUERY"}

	for _, method := range methods {
		var opChange *model.OperationChanges

		switch method {
		case "GET":
			opChange = pathItemChanges.GetChanges
		case "POST":
			opChange = pathItemChanges.PostChanges
		case "PUT":
			opChange = pathItemChanges.PutChanges
		case "DELETE":
			opChange = pathItemChanges.DeleteChanges
		case "PATCH":
			opChange = pathItemChanges.PatchChanges
		case "OPTIONS":
			opChange = pathItemChanges.OptionsChanges
		case "HEAD":
			opChange = pathItemChanges.HeadChanges
		case "TRACE":
			opChange = pathItemChanges.TraceChanges
		case "QUERY":
			opChange = pathItemChanges.QueryChanges
		}

		if opChange != nil && opChange.TotalChanges() > 0 {
			changeCount := opChange.TotalChanges()
			report.WriteString(fmt.Sprintf("    - **%s**: %d change(s)\n", method, changeCount))

			for _, change := range opChange.GetPropertyChanges() {
				if change.Property == "summary" || change.Property == "description" || change.Property == "operationId" {
					r.writeIndentedChange(report, change, 8, "      ")
				}
			}
		}
	}
}

// getParameterName extracts a parameter name from parameter changes
func (r *MarkdownReporter) getParameterName(paramChange *model.ParameterChanges) string {
	// Check if ParameterChanges has the Name field populated
	if paramChange.Name != "" {
		return fmt.Sprintf("Parameter `%s`", paramChange.Name)
	}

	// Look for 'name' in property changes
	for _, change := range paramChange.GetPropertyChanges() {
		if change.Property == "name" {
			if change.New != "" {
				return fmt.Sprintf("Parameter `%s`", change.New)
			}
			if change.Original != "" {
				return fmt.Sprintf("Parameter `%s`", change.Original)
			}
		}
	}

	// Try to extract from reference path (e.g., "#/components/parameters/page")
	ref := paramChange.GetChangeReference()
	if ref != "" {
		// Parse the reference to get the parameter name
		// Format: #/components/parameters/page
		if strings.Contains(ref, "/parameters/") {
			parts := strings.Split(ref, "/")
			if len(parts) > 0 {
				paramName := parts[len(parts)-1]
				if paramName != "" {
					return fmt.Sprintf("Parameter `%s`", paramName)
				}
			}
		}
	}

	// Try to extract from change path (e.g., "$.components.parameters['page'].schema")
	for _, change := range paramChange.GetAllChanges() {
		if change.Path != "" && strings.Contains(change.Path, "parameters[") {
			// Extract parameter name from path like "$.components.parameters['page'].schema"
			start := strings.Index(change.Path, "parameters['")
			if start != -1 {
				start += len("parameters['")
				end := strings.Index(change.Path[start:], "']")
				if end != -1 {
					paramName := change.Path[start : start+end]
					if paramName != "" {
						return fmt.Sprintf("Parameter `%s`", paramName)
					}
				}
			}
		}
	}

	// Use Doctor's line lookup as fallback
	if r.doctor != nil {
		for _, change := range paramChange.GetAllChanges() {
			if change.Context != nil {
				var lineNum int
				if change.Context.NewLine != nil {
					lineNum = *change.Context.NewLine
				} else if change.Context.OriginalLine != nil {
					lineNum = *change.Context.OriginalLine
				}

				if lineNum > 0 {
					models, err := r.doctor.LocateModelByLine(lineNum)
					if err == nil && len(models) > 0 {
						for _, m := range models {
							// Try to get parameter directly
							if hv, ok := m.(drV3.HasValue); ok {
								if param, ok := hv.GetValue().(*v3.Parameter); ok {
									if param.Name != "" {
										return fmt.Sprintf("Parameter `%s`", param.Name)
									}
								}
							}
							// Try to walk up to find parent parameter
							if foundational, ok := m.(drV3.Foundational); ok {
								parent := foundational.GetParent()
								for parent != nil {
									if hv, ok := parent.(drV3.HasValue); ok {
										if param, ok := hv.GetValue().(*v3.Parameter); ok {
											if param.Name != "" {
												return fmt.Sprintf("Parameter `%s`", param.Name)
											}
										}
									}
									if foundational, ok := parent.(drV3.Foundational); ok {
										parent = foundational.GetParent()
									} else {
										break
									}
								}
							}
						}
					}
				}
			}
		}
	}

	return "Parameter"
}

// parameterInfo holds extracted parameter information for rendering
type parameterInfo struct {
	Name string
	In   string
}

// extractParameterFromChangeObject extracts a Parameter from various object types.
// Handles both high-level *v3.Parameter and low-level []ValueReference[*Parameter] arrays.
func (r *MarkdownReporter) extractParameterFromChangeObject(obj any) *v3.Parameter {
	if obj == nil {
		return nil
	}

	// Try direct *v3.Parameter
	if param, ok := obj.(*v3.Parameter); ok {
		return param
	}

	// Try low-level []ValueReference[*Parameter] array
	if paramArray, ok := obj.([]low.ValueReference[*lowV3.Parameter]); ok {
		if len(paramArray) > 0 && paramArray[0].Value != nil {
			// Build high-level parameter from low-level
			lowParam := paramArray[0].Value
			return &v3.Parameter{
				Name: lowParam.Name.Value,
				In:   lowParam.In.Value,
			}
		}
	}

	return nil
}

// extractParameterInfo extracts parameter name and location from a change object.
// This is used when rendering parameter additions/removals/modifications.
func (r *MarkdownReporter) extractParameterInfo(change *model.Change) parameterInfo {
	info := parameterInfo{}

	// Try to get from NewObject (for additions) or OriginalObject (for removals)
	// The objects might be low-level arrays, so we need to handle that
	param := r.extractParameterFromChangeObject(change.NewObject)
	if param == nil {
		param = r.extractParameterFromChangeObject(change.OriginalObject)
	}

	if param != nil {
		info.Name = param.Name
		info.In = param.In
		return info
	}

	// Fallback: extract name from change.New or change.Original (simple scalar values)
	if change.New != "" {
		info.Name = change.New
	} else if change.Original != "" {
		info.Name = change.Original
	}

	// Fallback: try Doctor line lookup
	if r.doctor != nil && change.Context != nil {
		var lineNum int
		if change.Context.NewLine != nil {
			lineNum = *change.Context.NewLine
		} else if change.Context.OriginalLine != nil {
			lineNum = *change.Context.OriginalLine
		}

		if lineNum > 0 {
			models, err := r.doctor.LocateModelByLine(lineNum)
			if err == nil && len(models) > 0 {
				for _, m := range models {
					if hv, ok := m.(drV3.HasValue); ok {
						if p, ok := hv.GetValue().(*v3.Parameter); ok {
							info.Name = p.Name
							info.In = p.In
							return info
						}
					}
				}
			}
		}
	}

	return info
}

// capitalizeFirst capitalizes the first letter of a string
func capitalizeFirst(s string) string {
	if s == "" {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

// isParameterPropertyChange checks if a change represents a parameter addition/removal.
// This is used to separate parameter changes from other operation property changes.
func isParameterPropertyChange(change *model.Change) bool {
	if change == nil {
		return false
	}

	// Check if NewObject or OriginalObject is a Parameter
	if change.NewObject != nil {
		_, isParam := change.NewObject.(*v3.Parameter)
		return isParam
	}
	if change.OriginalObject != nil {
		_, isParam := change.OriginalObject.(*v3.Parameter)
		return isParam
	}

	return false
}

// renderResponsesBreakdown renders responses grouped by status code
func (r *MarkdownReporter) renderResponsesBreakdown(report *strings.Builder, responsesChanges *model.ResponsesChanges) {
	if responsesChanges == nil {
		return
	}

	// Render responses-level changes first
	if len(responsesChanges.GetPropertyChanges()) > 0 {
		for _, change := range responsesChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}
	}

	// Render individual response changes grouped by status code
	if len(responsesChanges.ResponseChanges) > 0 {
		for _, code := range sortedMapKeys(responsesChanges.ResponseChanges) {
			respChange := responsesChanges.ResponseChanges[code]
			if respChange == nil || respChange.TotalChanges() == 0 {
				continue
			}

			ref := respChange.GetChangeReference()
			if ref != "" {
				report.WriteString(fmt.Sprintf("- Response `%s`: See referenced component `%s`\n", code, ref))
				continue
			}

			report.WriteString(fmt.Sprintf("- Response `%s`:\n", code))
			for _, change := range respChange.GetPropertyChanges() {
				r.writeIndentedChange(report, change, 4, "  ")
			}

			// Render header changes
			if len(respChange.HeadersChanges) > 0 {
				for _, hName := range sortedMapKeys(respChange.HeadersChanges) {
					headerChange := respChange.HeadersChanges[hName]
					if headerChange != nil && headerChange.TotalChanges() > 0 {
						// Check if this header is a referenced component
						ref := headerChange.GetChangeReference()
						if ref != "" {
							// This is a referenced component - don't render details here
							// Just note the reference; details will be in Referenced Changes section
							report.WriteString(fmt.Sprintf("  - Header `%s`: See referenced component `%s`\n", hName, ref))
						} else {
							// Not a reference - render full details inline
							report.WriteString(fmt.Sprintf("  - Header `%s`:\n", hName))
							for _, change := range headerChange.GetPropertyChanges() {
								r.writeIndentedChange(report, change, 6, "    ")
							}
						}
					}
				}
			}

			// content/media type changes for responses
			if len(respChange.ContentChanges) > 0 {
				for _, ct := range sortedMapKeys(respChange.ContentChanges) {
					mtChange := respChange.ContentChanges[ct]
					if mtChange != nil && mtChange.TotalChanges() > 0 {
						ref := mtChange.GetChangeReference()
						if ref != "" {
							report.WriteString(fmt.Sprintf("  - Content `%s`: See referenced component `%s`\n", ct, ref))
						} else {
							report.WriteString(fmt.Sprintf("  - Content `%s`:\n", ct))

							// render example changes first to avoid list context breaking
							// render example changes in response media types
							if len(mtChange.ExampleChanges) > 0 {
								for exName, exChange := range mtChange.ExampleChanges {
									if exChange != nil && exChange.TotalChanges() > 0 {
										exRef := exChange.GetChangeReference()
										if exRef != "" {
											report.WriteString(fmt.Sprintf("    - Example `%s`: See referenced component `%s`\n", exName, exRef))
										} else {
											r.wrapExample(report, exName, 2, func() {
												report.WriteString(fmt.Sprintf("    - Example `%s`:\n", exName))
												for _, change := range exChange.GetPropertyChanges() {
													r.writeIndentedChange(report, change, 8, "      ")
												}
											})
										}
									}
								}
							}

							// render media type property changes last to avoid Goldmark list context issues
							r.renderMediaTypePropertyChanges(report, mtChange, ct, 2)
						}
					}
				}
			}

			// Render link changes
			if len(respChange.LinkChanges) > 0 {
				for _, lName := range sortedMapKeys(respChange.LinkChanges) {
					linkChange := respChange.LinkChanges[lName]
					if linkChange != nil && linkChange.TotalChanges() > 0 {
						ref := linkChange.GetChangeReference()
						if ref != "" {
							report.WriteString(fmt.Sprintf("  - Link `%s`: See referenced component `%s`\n", lName, ref))
						} else {
							report.WriteString(fmt.Sprintf("  - Link `%s`:\n", lName))
							for _, change := range linkChange.GetPropertyChanges() {
								r.writeIndentedChange(report, change, 6, "    ")
							}
						}
					}
				}
			}

			r.renderNestedExtensions(report, respChange.ExtensionChanges, true)
		}
	}

	report.WriteString("\n")
}

// renderWebhookChanges renders changes to webhooks
func (r *MarkdownReporter) renderWebhookChanges(report *strings.Builder) {
	for _, name := range sortedMapKeys(r.docChanges.WebhookChanges) {
		webhookChanges := r.docChanges.WebhookChanges[name]
		if webhookChanges == nil || webhookChanges.TotalChanges() == 0 {
			continue
		}

		// Check if the entire webhook is a reference
		ref := webhookChanges.GetChangeReference()
		if ref != "" {
			report.WriteString("---\n\n")
			report.WriteString(fmt.Sprintf("#### Webhook: `%s`: See referenced component `%s`\n\n", name, ref))
			continue
		}

		// Render webhook-level changes with custom header
		hasWebhookLevelContent := len(webhookChanges.GetPropertyChanges()) > 0 || len(webhookChanges.ParameterChanges) > 0

		if hasWebhookLevelContent {
			hasBreaking := webhookChanges.TotalBreakingChanges() > 0
			report.WriteString("---\n\n")
			if hasBreaking {
				report.WriteString(fmt.Sprintf("#### Webhook: `%s` %s\n\n", name, Breaking))
			} else {
				report.WriteString(fmt.Sprintf("#### Webhook: `%s`\n\n", name))
			}
		}

		// Render the webhook content (properties, parameters, operations) using shared logic
		r.renderPathItemContent(report, name, webhookChanges, "Webhook Parameters")
	}
}

// renderExtensionChanges renders changes to document-level extensions
func (r *MarkdownReporter) renderExtensionChanges(report *strings.Builder) {
	extensionChanges := r.docChanges.ExtensionChanges
	if extensionChanges == nil || extensionChanges.TotalChanges() == 0 {
		return
	}

	report.WriteString("---\n\n")
	report.WriteString("#### Document Extensions\n\n")

	for _, change := range extensionChanges.GetPropertyChanges() {
		r.renderChange(report, change)
	}

	report.WriteString("\n")
}

// renderNestedExtensions is a DRY helper that renders extensions for any object that has them.
// This avoids duplicating extension rendering logic across all object types.
func (r *MarkdownReporter) renderNestedExtensions(report *strings.Builder, extensionChanges *model.ExtensionChanges, indent bool) {
	if extensionChanges == nil || extensionChanges.TotalChanges() == 0 {
		return
	}

	prefix := ""
	codeBlockIndent := 2 // for non-indented lists
	if indent {
		prefix = "  "
		codeBlockIndent = 4 // for indented lists
	}

	for _, change := range extensionChanges.GetPropertyChanges() {
		changeDesc, hasCodeBlock := r.formatChangeDescription(change)

		// indent code blocks to keep them within the list item
		if hasCodeBlock {
			changeDesc = indentMultilineDesc(changeDesc, codeBlockIndent)
		}

		report.WriteString(fmt.Sprintf("%s- %s", prefix, changeDesc))

		// add breaking marker with proper spacing
		if change.Breaking {
			r.writeBreakingMarker(report, hasCodeBlock)
		}

		report.WriteString("\n")
	}
}

// renderComponentsChanges renders changes to components
func (r *MarkdownReporter) renderComponentsChanges(report *strings.Builder) {
	componentsChanges := r.docChanges.ComponentsChanges
	if componentsChanges == nil {
		return
	}

	// Render component-level changes (adding/removing entire schemas, parameters, etc.)
	if len(componentsChanges.GetPropertyChanges()) > 0 {
		for _, change := range componentsChanges.GetPropertyChanges() {
			r.renderChange(report, change)
		}
		report.WriteString("\n")
	}

	// Render schema changes
	if len(componentsChanges.SchemaChanges) > 0 {
		for _, name := range sortedMapKeys(componentsChanges.SchemaChanges) {
			schemaChange := componentsChanges.SchemaChanges[name]
			if schemaChange == nil || schemaChange.TotalChanges() == 0 {
				continue
			}

			report.WriteString("---\n\n")
			hasBreaking := schemaChange.TotalBreakingChanges() > 0

			if hasBreaking {
				report.WriteString(fmt.Sprintf("#### Schema: `%s` %s\n\n", name, Breaking))
			} else {
				report.WriteString(fmt.Sprintf("#### Schema: `%s`\n\n", name))
			}

			// Use GetAllChanges to get all nested changes within the schema
			allSchemaChanges := schemaChange.GetAllChanges()
			for _, change := range allSchemaChanges {
				r.renderChange(report, change)
			}

			// Render schema extensions
			r.renderNestedExtensions(report, schemaChange.ExtensionChanges, false)

			report.WriteString("\n")
		}
	}

	// Render security scheme changes
	if len(componentsChanges.SecuritySchemeChanges) > 0 {
		for _, name := range sortedMapKeys(componentsChanges.SecuritySchemeChanges) {
			schemeChange := componentsChanges.SecuritySchemeChanges[name]
			if schemeChange == nil || schemeChange.TotalChanges() == 0 {
				continue
			}

			report.WriteString("---\n\n")
			hasBreaking := schemeChange.TotalBreakingChanges() > 0

			if hasBreaking {
				report.WriteString(fmt.Sprintf("#### Security Scheme: `%s` %s\n\n", name, Breaking))
			} else {
				report.WriteString(fmt.Sprintf("#### Security Scheme: `%s`\n\n", name))
			}

			for _, change := range schemeChange.GetPropertyChanges() {
				r.renderChange(report, change)
			}

			// Render security scheme extensions
			r.renderNestedExtensions(report, schemeChange.ExtensionChanges, false)

			report.WriteString("\n")
		}
	}

	// Render component-level extensions
	r.renderNestedExtensions(report, componentsChanges.ExtensionChanges, false)
}

// renderChange renders a single change
func (r *MarkdownReporter) renderChange(report *strings.Builder, change *model.Change) {
	if change == nil {
		return
	}

	changeDesc, hasCodeBlock := r.formatChangeDescription(change)

	// if the description contains a code block, indent it to keep it within the list item
	if hasCodeBlock {
		// code blocks need 2 spaces indentation to stay within a top-level list item
		changeDesc = indentMultilineDesc(changeDesc, 2)
	}

	report.WriteString("- ")
	report.WriteString(changeDesc)

	if change.Breaking {
		r.writeBreakingMarker(report, hasCodeBlock)
	}

	report.WriteString("\n")
}

// formatChangeDescription creates a human-readable description of the change.
// Returns the description and a boolean indicating if it contains a code block.
func (r *MarkdownReporter) formatChangeDescription(change *model.Change) (string, bool) {
	property := change.Property
	if property == "" {
		property = "value"
	}

	// Special handling for path and schema additions/removals
	// These represent adding/removing entire paths or schemas, not property changes
	if property == "path" {
		switch change.ChangeType {
		case model.PropertyAdded, model.ObjectAdded:
			if change.New != "" {
				return fmt.Sprintf("Added path *'%s'*", FormatValue(change.New)), false
			}
			return "Added path", false
		case model.PropertyRemoved, model.ObjectRemoved:
			if change.Original != "" {
				return fmt.Sprintf("Removed path *'%s'*", FormatValue(change.Original)), false
			}
			return "Removed path", false
		}
	}

	if property == "schemas" {
		switch change.ChangeType {
		case model.PropertyAdded, model.ObjectAdded:
			if change.New != "" {
				return fmt.Sprintf("Added schema *'%s'*", FormatValue(change.New)), false
			}
			return "Added schema", false
		case model.PropertyRemoved, model.ObjectRemoved:
			if change.Original != "" {
				return fmt.Sprintf("Removed schema *'%s'*", FormatValue(change.Original)), false
			}
			return "Removed schema", false
		}
	}

	// Special handling for parameter additions/removals to show location (query/path/header/cookie)
	// Check if this is a parameter using multiple strategies
	inferredType := r.inferChangeType(change)
	isParameterChange := property == "parameters" || isParameterPropertyChange(change) || inferredType == "parameter"
	if isParameterChange {
		paramInfo := r.extractParameterInfo(change)
		switch change.ChangeType {
		case model.PropertyAdded, model.ObjectAdded:
			if paramInfo.Name != "" {
				if paramInfo.In != "" {
					return fmt.Sprintf("%s Parameter `%s` added", capitalizeFirst(paramInfo.In), paramInfo.Name), false
				}
				return fmt.Sprintf("Parameter `%s` added", paramInfo.Name), false
			}
			return "Parameter added", false
		case model.PropertyRemoved, model.ObjectRemoved:
			if paramInfo.Name != "" {
				if paramInfo.In != "" {
					return fmt.Sprintf("%s Parameter `%s` removed", capitalizeFirst(paramInfo.In), paramInfo.Name), false
				}
				return fmt.Sprintf("Parameter `%s` removed", paramInfo.Name), false
			}
			return "Parameter removed", false
		case model.Modified:
			if paramInfo.Name != "" {
				if change.Original != "" && change.New != "" {
					if paramInfo.In != "" {
						return fmt.Sprintf("%s Parameter `%s` changed from *'%s'* to *'%s'*",
							capitalizeFirst(paramInfo.In), paramInfo.Name, FormatValue(change.Original), FormatValue(change.New)), false
					}
					return fmt.Sprintf("Parameter `%s` changed from *'%s'* to *'%s'*",
						paramInfo.Name, FormatValue(change.Original), FormatValue(change.New)), false
				}
				if paramInfo.In != "" {
					return fmt.Sprintf("%s Parameter `%s` modified", capitalizeFirst(paramInfo.In), paramInfo.Name), false
				}
				return fmt.Sprintf("Parameter `%s` modified", paramInfo.Name), false
			}
			return "Parameter modified", false
		}
	}

	// Special handling for example property to match icon injection pattern
	// format as "Example `value`" to create Text -> CodeSpan pattern for icon injection
	if property == "example" {
		property = "Example `value`"
	}

	// Special handling for extensions with structured data
	isExtension := strings.HasPrefix(property, "x-")
	if isExtension {
		property = fmt.Sprintf("Extension `%s`", property)
	} else if property != "Example `value`" {
		// Check if this property should have a type prefix for icon rendering
		prefix := getPropertyTypePrefix(property)
		if prefix != "" {
			property = fmt.Sprintf("%s `%s`", prefix, property)
		} else {
			// For ObjectAdded/ObjectRemoved, infer the type to add proper prefix for icon rendering
			if change.ChangeType == model.ObjectAdded || change.ChangeType == model.ObjectRemoved {
				inferredType := r.inferChangeType(change)
				if typePrefix := FormatObjectType(inferredType); typePrefix != "" && inferredType != "document" {
					property = fmt.Sprintf("%s `%s`", typePrefix, property)
				} else {
					property = fmt.Sprintf("`%s`", property)
				}
			} else {
				property = fmt.Sprintf("`%s`", property)
			}
		}
	}

	switch change.ChangeType {
	case model.PropertyAdded, model.ObjectAdded:
		if change.New != "" || change.NewEncoded != "" {
			// For ObjectAdded, skip showing serialized JSON objects (just show the identifier)
			// Only show simple scalar values
			if change.ChangeType == model.ObjectAdded && isSerializedObject(change.New) {
				return fmt.Sprintf("%s added", property), false
			}
			return r.formatValueChangeFromChange(property, change, isExtension, "added", true)
		}
		return fmt.Sprintf("%s added", property), false

	case model.PropertyRemoved, model.ObjectRemoved:
		if change.Original != "" || change.OriginalEncoded != "" {
			// For ObjectRemoved, skip showing serialized JSON objects (just show the identifier)
			// Only show simple scalar values
			if change.ChangeType == model.ObjectRemoved && isSerializedObject(change.Original) {
				return fmt.Sprintf("%s removed", property), false
			}
			return r.formatValueChangeFromChange(property, change, isExtension, "removed", false)
		}
		return fmt.Sprintf("%s removed", property), false

	case model.Modified:
		if change.Original != "" || change.New != "" || change.OriginalEncoded != "" || change.NewEncoded != "" {
			// Show the full updated value - no smart diffing
			return r.formatValueChangeFromChange(property, change, isExtension, "changed to", true)
		}
		return fmt.Sprintf("%s modified", property), false

	default:
		return fmt.Sprintf("%s changed", property), false
	}
}

// formatValueChangeFromChange formats a property value change from a Change object.
// Uses NewEncoded/OriginalEncoded if available (for complex types like objects/arrays).
// Otherwise falls back to New/Original fields for scalar values.
// Returns the formatted string and a boolean indicating if it contains a code block.
func (r *MarkdownReporter) formatValueChangeFromChange(property string, change *model.Change, isExtension bool, verb string, useNew bool) (string, bool) {
	var value string
	var encodedValue string

	// Get the value - check for encoded version first (complex types: arrays/objects)
	if useNew {
		encodedValue = change.NewEncoded
		value = change.New
	} else {
		encodedValue = change.OriginalEncoded
		value = change.Original
	}

	// If we have an encoded value, this is a complex type (object/array)
	// Render as YAML code block for readability
	if encodedValue != "" {
		// Use target format matching the source document (YAML or JSON)
		formattedValue, isCodeBlock := FormatExtensionValueWithTargetFormat(encodedValue, r.sourceFormat)

		if isCodeBlock {
			return fmt.Sprintf("%s %s:\n\n%s", property, verb, formattedValue), true
		}

		return fmt.Sprintf("%s %s *'%s'*", property, verb, FormatValue(encodedValue)), false
	}

	// For scalar values (no encoded version), check if extensions need special formatting
	if isExtension {
		// Extensions might have structured data even without encoded values
		// (for backward compatibility with older what-changed versions)
		formattedValue, isCodeBlock := FormatExtensionValueWithTargetFormat(value, r.sourceFormat)

		if isCodeBlock {
			return fmt.Sprintf("%s %s:\n\n%s", property, verb, formattedValue), true
		}
	}

	// Use inline format for scalar values
	return fmt.Sprintf("%s %s *'%s'*", property, verb, FormatValue(value)), false
}

// formatValueChange formats a property value change, using code blocks for structured extension data.
// For extensions with JSON/YAML/XML, formats as a code block. Otherwise, formats inline.
// If the source document is YAML and the value is JSON, it converts to YAML.
// Deprecated: Use formatValueChangeFromChange instead which properly handles NewEncoded/OriginalEncoded.
func (r *MarkdownReporter) formatValueChange(property, value string, isExtension bool, verb string) string {
	if !isExtension {
		// Non-extensions always use inline format
		return fmt.Sprintf("%s %s *'%s'*", property, verb, FormatValue(value))
	}

	// For extensions, check if the value is structured data
	// Use target format matching the source document
	formattedValue, isCodeBlock := FormatExtensionValueWithTargetFormat(value, r.sourceFormat)

	if isCodeBlock {
		// Use code block format with line break
		return fmt.Sprintf("%s %s:\n\n%s", property, verb, formattedValue)
	}

	// Use inline format for plain text extensions
	return fmt.Sprintf("%s %s *'%s'*", property, verb, FormatValue(value))
}

// FormatValue formats a value for display, handling multi-line values.
func FormatValue(value string) string {
	if value == "" {
		return "(empty)"
	}

	// For multi-line values, escape newlines for inline display
	if strings.Contains(value, "\n") {
		// Replace newlines with spaces for inline display
		cleaned := strings.ReplaceAll(value, "\n", " ")
		// Collapse multiple spaces
		cleaned = strings.Join(strings.Fields(cleaned), " ")
		return cleaned
	}

	return value
}

// isSerializedObject checks if a value appears to be a JSON-serialized object.
// This is used to detect when what-changed has serialized an entire object (like a tag)
// vs when it's a simple scalar value (like a security requirement value).
func isSerializedObject(value string) bool {
	trimmed := strings.TrimSpace(value)

	// Must start with { to be a JSON object
	if !strings.HasPrefix(trimmed, "{") {
		return false
	}

	// Quick check: does it look like a serialized object with common OpenAPI fields?
	// This avoids false positives for simple values that happen to contain braces
	hasNameField := strings.Contains(trimmed, `"name"`)
	hasDescField := strings.Contains(trimmed, `"description"`)
	hasTypeField := strings.Contains(trimmed, `"type"`)

	// If it has typical object fields, it's likely a serialized object
	return hasNameField || hasDescField || hasTypeField
}

// getPropertyTypePrefix returns a type prefix for properties that should have icons.
// This enables the HTML renderer to detect the object type and inject icons.
// Returns empty string if the property doesn't need a prefix.
func getPropertyTypePrefix(property string) string {
	switch property {
	case "tags":
		return "Tag"
	case "servers":
		return "Server:"
	case "security":
		return "Security"
	case "externalDocs":
		return "External Doc"
	case "callbacks":
		return "Callback"
	case "requestBodies":
		return "Request Bodies"
	case "deprecated":
		return "Deprecated"
	case "responses":
		return "Responses"
	default:
		return ""
	}
}

// FormatObjectType formats an object type for display.
// It converts internal type identifiers (e.g., "requestBody", "mediaType") to
// human-readable display names (e.g., "Request Body", "Media Type").
func FormatObjectType(objType string) string {
	switch objType {
	case "info":
		return "Info"
	case "contact":
		return "Contact"
	case "license":
		return "License"
	case "operation":
		return "Operation"
	case "parameter":
		return "Parameter"
	case "schema":
		return "Schema"
	case "response":
		return "Response"
	case "requestBody":
		return "Request Body"
	case "header":
		return "Header"
	case "mediaType":
		return "Media Type"
	case "path":
		return "Path"
	case "tag":
		return "Tag"
	case "security", "securityScheme":
		return "Security"
	case "server":
		return "Server"
	case "webhook":
		return "Webhook"
	case "callback":
		return "Callback"
	case "link":
		return "Link"
	case "example":
		return "Example"
	case "externalDoc":
		return "External Doc"
	case "extension":
		return "Extension"
	case "paths":
		return "Paths"
	case "components":
		return "Component"
	case "document":
		return "Document"
	default:
		// Capitalize first letter as fallback
		if len(objType) > 0 {
			return strings.ToUpper(string(objType[0])) + objType[1:]
		}
		return objType
	}
}

// generateReferencedChanges renders a section for all referenced component changes
func (r *MarkdownReporter) generateReferencedChanges(report *strings.Builder) {
	referenced := r.collectReferencedChanges()
	if len(referenced) == 0 {
		return
	}

	report.WriteString("\n\n---\n\n")
	report.WriteString("## Referenced Changes\n\n")
	report.WriteString("The following component changes are referenced in multiple locations throughout the document.\n\n")

	// Render component types in a consistent order
	for _, refType := range sortedReferenceTypes() {
		components := referenced[refType]
		if len(components) == 0 {
			continue
		}

		// Render section for this component type
		report.WriteString(fmt.Sprintf("### %s\n\n", getComponentTypeName(refType)))

		for _, name := range sortedMapKeys(components) {
			refChange := components[name]
			r.renderReferencedChange(report, refChange)
		}
	}
}

// renderReferencedChange renders a single referenced component change with usage locations
func (r *MarkdownReporter) renderReferencedChange(report *strings.Builder, refChange *ReferencedChange) {
	if refChange == nil || refChange.Reference == nil {
		return
	}

	report.WriteString("---\n\n")

	// Render component header
	refInfo := refChange.Reference
	report.WriteString(fmt.Sprintf("#### `%s`\n\n", refInfo.Component))
	report.WriteString(fmt.Sprintf("**Reference:** `%s`\n\n", refInfo.FullPath))

	// Render the actual changes
	for _, change := range refChange.Changes {
		r.renderChange(report, change)
	}

	// Render usage locations
	if len(refChange.UsedIn) > 0 {
		report.WriteString("\n**Used in:**\n\n")

		// Sort usage locations
		sorted := sortUsageLocations(refChange.UsedIn)

		for _, usage := range sorted {
			// Format the path with custom components by splitting path and method
			formattedPath := r.formatOperationPath(usage.Path)

			// Render operation path as top-level item
			report.WriteString(fmt.Sprintf("- %s\n", formattedPath))

			// Parse and render description as nested list items
			if usage.Description != "" {
				r.renderNestedUsageDescription(report, usage.Description)
			}
		}
	}

	report.WriteString("\n")
}

// renderNestedUsageDescription parses a description string and renders it as nested list items.
// Descriptions like "Response `200`, Header `Cache-Control`" become:
//   - Response `200`
//   - Header `Cache-Control`
func (r *MarkdownReporter) renderNestedUsageDescription(report *strings.Builder, description string) {
	// Split description on ", " to create hierarchy
	parts := strings.Split(description, ", ")

	for i, part := range parts {
		// Indent based on depth (2 spaces per level)
		indent := strings.Repeat("  ", i+1)
		report.WriteString(fmt.Sprintf("%s- %s\n", indent, part))
	}
}

// analyzeReference parses a JSON Pointer reference and returns structured information
func (r *MarkdownReporter) analyzeReference(ref string) *ReferenceInfo {
	if ref == "" {
		return nil
	}

	info := &ReferenceInfo{
		FullPath: ref,
	}

	// Determine if local or remote
	if strings.HasPrefix(ref, "#/") {
		info.IsLocal = true
		info.IsRemote = false
	} else {
		info.IsRemote = true
		// Split file path from fragment
		parts := strings.SplitN(ref, "#", 2)
		if len(parts) == 2 {
			info.FilePath = parts[0]
			ref = "#" + parts[1] // Continue parsing with the fragment
		}
	}

	// Parse the JSON Pointer to extract component type and name
	if strings.HasPrefix(ref, "#/components/") {
		// OpenAPI 3.x component reference
		path := strings.TrimPrefix(ref, "#/components/")
		parts := strings.SplitN(path, "/", 2)

		if len(parts) >= 2 {
			componentType := parts[0]
			info.Component = parts[1]

			switch componentType {
			case "schemas":
				info.Type = RefTypeComponentSchema
			case "parameters":
				info.Type = RefTypeComponentParameter
			case "headers":
				info.Type = RefTypeComponentHeader
			case "responses":
				info.Type = RefTypeComponentResponse
			case "requestBodies":
				info.Type = RefTypeComponentRequestBody
			case "securitySchemes":
				info.Type = RefTypeComponentSecurityScheme
			case "examples":
				info.Type = RefTypeComponentExample
			case "links":
				info.Type = RefTypeComponentLink
			case "callbacks":
				info.Type = RefTypeComponentCallback
			default:
				info.Type = RefTypeOther
			}
		}
	} else if strings.HasPrefix(ref, "#/definitions/") {
		// Swagger 2.0 schema reference
		info.Component = strings.TrimPrefix(ref, "#/definitions/")
		info.Type = RefTypeComponentSchema
	} else if strings.HasPrefix(ref, "#/parameters/") {
		// Swagger 2.0 parameter reference
		info.Component = strings.TrimPrefix(ref, "#/parameters/")
		info.Type = RefTypeComponentParameter
	} else if strings.HasPrefix(ref, "#/responses/") {
		// Swagger 2.0 response reference
		info.Component = strings.TrimPrefix(ref, "#/responses/")
		info.Type = RefTypeComponentResponse
	} else {
		// Other reference (e.g., to a path, operation, etc.)
		info.Type = RefTypeOther
		info.Component = ref
	}

	return info
}

// collectReferencedChanges walks through all changes and collects those with references
// Returns a map grouped by reference type, then by component name
func (r *MarkdownReporter) collectReferencedChanges() map[ReferenceType]map[string]*ReferencedChange {
	if r.docChanges == nil {
		return nil
	}

	referenced := make(map[ReferenceType]map[string]*ReferencedChange)

	addReferencedChange := func(changeObj interface {
		GetChangeReference() string
		GetPropertyChanges() []*model.Change
	}, ref string, usedIn UsageLocation) {
		if ref == "" {
			return
		}

		refInfo := r.analyzeReference(ref)
		if refInfo == nil {
			return
		}

		if referenced[refInfo.Type] == nil {
			referenced[refInfo.Type] = make(map[string]*ReferencedChange, 64)
		}

		key := refInfo.FullPath

		// Only collect referenced components that actually have changes
		changes := changeObj.GetPropertyChanges()
		if len(changes) == 0 {
			return
		}

		if referenced[refInfo.Type][key] == nil {
			referenced[refInfo.Type][key] = &ReferencedChange{
				Reference: refInfo,
				Changes:   changes,
				UsedIn:    make([]UsageLocation, 0, 32),
			}
		}

		referenced[refInfo.Type][key].UsedIn = append(referenced[refInfo.Type][key].UsedIn, usedIn)
	}

	// Walk through paths/operations to find all referenced changes
	if r.docChanges.PathsChanges != nil {
		for path, pathItemChanges := range r.docChanges.PathsChanges.PathItemsChanges {
			if pathItemChanges == nil {
				continue
			}

			// Check if the entire PathItem is a reference
			if pathItemChanges.GetChangeReference() != "" {
				addReferencedChange(
					pathItemChanges,
					pathItemChanges.GetChangeReference(),
					UsageLocation{
						Path:        "Path `" + path + "`",
						Description: "PathItem",
					},
				)
				continue
			}

			// Check path-level parameters
			for _, paramChange := range pathItemChanges.ParameterChanges {
				if paramChange != nil && paramChange.GetChangeReference() != "" {
					addReferencedChange(
						paramChange,
						paramChange.GetChangeReference(),
						UsageLocation{
							Path:        "Path `" + path + "`",
							Description: "Parameter",
						},
					)
				}
			}

			r.collectOperationReferences(path, "GET", pathItemChanges.GetChanges, addReferencedChange)
			r.collectOperationReferences(path, "POST", pathItemChanges.PostChanges, addReferencedChange)
			r.collectOperationReferences(path, "PUT", pathItemChanges.PutChanges, addReferencedChange)
			r.collectOperationReferences(path, "DELETE", pathItemChanges.DeleteChanges, addReferencedChange)
			r.collectOperationReferences(path, "PATCH", pathItemChanges.PatchChanges, addReferencedChange)
			r.collectOperationReferences(path, "OPTIONS", pathItemChanges.OptionsChanges, addReferencedChange)
			r.collectOperationReferences(path, "HEAD", pathItemChanges.HeadChanges, addReferencedChange)
			r.collectOperationReferences(path, "TRACE", pathItemChanges.TraceChanges, addReferencedChange)
			r.collectOperationReferences(path, "QUERY", pathItemChanges.QueryChanges, addReferencedChange)
		}
	}

	if r.docChanges.ComponentsChanges != nil {
		for name, schemaChange := range r.docChanges.ComponentsChanges.SchemaChanges {
			if schemaChange != nil && schemaChange.GetChangeReference() != "" {
				addReferencedChange(
					schemaChange,
					schemaChange.GetChangeReference(),
					UsageLocation{
						Path:        "Components",
						Description: "Schema `" + name + "`",
					},
				)
			}
		}

		for name, schemeChange := range r.docChanges.ComponentsChanges.SecuritySchemeChanges {
			if schemeChange != nil && schemeChange.GetChangeReference() != "" {
				addReferencedChange(
					schemeChange,
					schemeChange.GetChangeReference(),
					UsageLocation{
						Path:        "Components",
						Description: "Security Scheme `" + name + "`",
					},
				)
			}
		}
	}

	return referenced
}

// collectOperationReferences collects all referenced changes for a single operation
func (r *MarkdownReporter) collectOperationReferences(
	path, method string,
	opChanges *model.OperationChanges,
	addRef func(changeObj interface {
		GetChangeReference() string
		GetPropertyChanges() []*model.Change
	}, ref string, usedIn UsageLocation),
) {
	if opChanges == nil || opChanges.TotalChanges() == 0 {
		return
	}

	opPath := path + " " + method

	for _, paramChange := range opChanges.ParameterChanges {
		if paramChange != nil && paramChange.GetChangeReference() != "" {
			addRef(
				paramChange,
				paramChange.GetChangeReference(),
				UsageLocation{
					Path:        opPath,
					Description: "Parameter",
				},
			)
		}
	}

	// Check request body
	if opChanges.RequestBodyChanges != nil {
		if opChanges.RequestBodyChanges.GetChangeReference() != "" {
			addRef(
				opChanges.RequestBodyChanges,
				opChanges.RequestBodyChanges.GetChangeReference(),
				UsageLocation{
					Path:        opPath,
					Description: "Request Body",
				},
			)
		}

		// Check media types and examples in request body
		for mediaType, mtChange := range opChanges.RequestBodyChanges.ContentChanges {
			if mtChange != nil && mtChange.GetChangeReference() != "" {
				addRef(
					mtChange,
					mtChange.GetChangeReference(),
					UsageLocation{
						Path:        opPath,
						Description: "Request Body, Media Type `" + mediaType + "`",
					},
				)
			}

			// Check examples in request body media types
			if mtChange != nil {
				for exName, exChange := range mtChange.ExampleChanges {
					if exChange != nil && exChange.GetChangeReference() != "" {
						addRef(
							exChange,
							exChange.GetChangeReference(),
							UsageLocation{
								Path:        opPath,
								Description: "Request Body, " + mediaType + ", Example " + exName,
							},
						)
					}
				}
			}
		}
	}

	// Check responses
	if opChanges.ResponsesChanges != nil {
		for statusCode, respChange := range opChanges.ResponsesChanges.ResponseChanges {
			if respChange == nil {
				continue
			}

			// Check response itself
			if respChange.GetChangeReference() != "" {
				addRef(
					respChange,
					respChange.GetChangeReference(),
					UsageLocation{
						Path:        opPath,
						Description: "Response `" + statusCode + "`",
					},
				)
			}

			// Check headers in responses
			for headerName, headerChange := range respChange.HeadersChanges {
				if headerChange != nil && headerChange.GetChangeReference() != "" {
					addRef(
						headerChange,
						headerChange.GetChangeReference(),
						UsageLocation{
							Path:        opPath,
							Description: "Response `" + statusCode + "`, Header `" + headerName + "`",
						},
					)
				}
			}

			// Check content/media types in responses
			for mediaType, mtChange := range respChange.ContentChanges {
				if mtChange != nil && mtChange.GetChangeReference() != "" {
					addRef(
						mtChange,
						mtChange.GetChangeReference(),
						UsageLocation{
							Path:        opPath,
							Description: "Response `" + statusCode + "`, Media Type `" + mediaType + "`",
						},
					)
				}

				// Check examples in media types
				if mtChange != nil {
					for exName, exChange := range mtChange.ExampleChanges {
						if exChange != nil && exChange.GetChangeReference() != "" {
							addRef(
								exChange,
								exChange.GetChangeReference(),
								UsageLocation{
									Path:        opPath,
									Description: "Response `" + statusCode + "`, `" + mediaType + "`, Example `" + exName + "`",
								},
							)
						}
					}
				}
			}

			// Check links in responses
			for linkName, linkChange := range respChange.LinkChanges {
				if linkChange != nil && linkChange.GetChangeReference() != "" {
					addRef(
						linkChange,
						linkChange.GetChangeReference(),
						UsageLocation{
							Path:        opPath,
							Description: "Response `" + statusCode + "`, Link `" + linkName + "`",
						},
					)
				}
			}
		}
	}

	// Check callbacks
	for callbackName, callbackChange := range opChanges.CallbackChanges {
		if callbackChange != nil && callbackChange.GetChangeReference() != "" {
			addRef(
				callbackChange,
				callbackChange.GetChangeReference(),
				UsageLocation{
					Path:        opPath,
					Description: "Callback  `" + callbackName + "`",
				},
			)
		}
	}
}

// getComponentTypeName returns a human-readable name for a component type
func getComponentTypeName(refType ReferenceType) string {
	switch refType {
	case RefTypeComponentSchema:
		return "Schemas"
	case RefTypeComponentParameter:
		return "Parameters"
	case RefTypeComponentHeader:
		return "Headers"
	case RefTypeComponentResponse:
		return "Responses"
	case RefTypeComponentRequestBody:
		return "Request Bodies"
	case RefTypeComponentSecurityScheme:
		return "Security Schemes"
	case RefTypeComponentExample:
		return "Examples"
	case RefTypeComponentLink:
		return "Links"
	case RefTypeComponentCallback:
		return "Callbacks"
	case RefTypeOther:
		return "Other References"
	default:
		return "Unknown"
	}
}

// sortedReferenceTypes returns reference types in a consistent order for rendering
func sortedReferenceTypes() []ReferenceType {
	return []ReferenceType{
		RefTypeComponentSchema,
		RefTypeComponentParameter,
		RefTypeComponentHeader,
		RefTypeComponentResponse,
		RefTypeComponentRequestBody,
		RefTypeComponentSecurityScheme,
		RefTypeComponentExample,
		RefTypeComponentLink,
		RefTypeComponentCallback,
		RefTypeOther,
	}
}

// sortUsageLocations sorts usage locations by line number (if available) then by path
func sortUsageLocations(locations []UsageLocation) []UsageLocation {
	sorted := make([]UsageLocation, len(locations))
	copy(sorted, locations)

	sort.Slice(sorted, func(i, j int) bool {
		if sorted[i].LineNumber != 0 && sorted[j].LineNumber != 0 {
			return sorted[i].LineNumber < sorted[j].LineNumber
		}
		return sorted[i].Path < sorted[j].Path
	})

	return sorted
}

// sortedMapKeys returns sorted keys from a map with pre-allocated slice
func sortedMapKeys[K ~string, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Slice(keys, func(i, j int) bool { return keys[i] < keys[j] })
	return keys
}

// formatOperationPath formats an operation path string (e.g., "/bookings GET")
// into markdown that will be properly detected by the HTML renderer for custom components.
// Returns: "**GET** `/bookings`" which will be converted to custom components in HTML.
func (r *MarkdownReporter) formatOperationPath(opPath string) string {
	if opPath == "" {
		return ""
	}

	// Split on last space to separate path from method
	// Handle cases like "/bookings/{bookingId} GET" or "Components"
	lastSpace := strings.LastIndex(opPath, " ")
	if lastSpace == -1 {
		// No space, might be just a path or just a component name
		// If it starts with /, treat as path
		if strings.HasPrefix(opPath, "/") {
			return fmt.Sprintf("`%s`", opPath)
		}
		// Otherwise return as bold (for things like "Components")
		return fmt.Sprintf("**%s**", opPath)
	}

	// Split into path and method
	path := opPath[:lastSpace]
	method := opPath[lastSpace+1:]

	// Check if the method part is actually an HTTP method
	httpMethods := map[string]bool{
		"GET": true, "POST": true, "PUT": true, "DELETE": true,
		"PATCH": true, "HEAD": true, "OPTIONS": true, "TRACE": true,
		"CONNECT": true, "QUERY": true,
	}

	if httpMethods[method] {
		// Format as: **METHOD** `/path`
		// This allows the HTML renderer to detect and use custom components
		return fmt.Sprintf("**%s** `%s`", method, path)
	}

	// Not an HTTP method, return as bold text (for non-operation paths)
	return fmt.Sprintf("**%s**", opPath)
}
