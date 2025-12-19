// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

// NestedListFixStrategy defines how code blocks in deeply nested lists are handled
type NestedListFixStrategy int

const (
	NestedListFixInline NestedListFixStrategy = iota
	NestedListFixExtract  // reserved for future
	NestedListFixFlatten  // reserved for future
)

// RenderConfig provides high-level customization options for report rendering.
type RenderConfig struct {
	Breaking  *BreakingConfig
	Styling   *StylingConfig
	CodeBlock *CodeBlockConfig
	HTML      *HTMLConfig
	Custom    *CustomConfig
}

// BreakingConfig controls how breaking changes are presented.
type BreakingConfig struct {
	Badge    string
	Class    string
	DataAttr string
}

// StylingConfig controls CSS classes for different change types.
type StylingConfig struct {
	PropertyNameClass  string
	PropertyNamePrefix string
	PropertyNameSuffix string
	AdditionClass      string
	ModificationClass  string
	RemovalClass       string
}

// CodeBlockConfig controls code block rendering.
type CodeBlockConfig struct {
	EnableSyntaxHighlighting bool
	Class                    string
	HeaderGenerator          CodeBlockHeaderGenerator
}

// CodeBlockHeaderGenerator generates header HTML for code blocks.
type CodeBlockHeaderGenerator interface {
	Generate(language string) string
}

// HTMLConfig controls general HTML output options.
type HTMLConfig struct {
	ExternalLinksNewTab   bool
	LinkClass             string
	HeadingIDPrefix       string
	HeadingClass          string
	AddHeadingAnchors     bool
	TableClass            string
	TableHeaderClass      string
	TableRowClass         string
	WrapSectionsInDivs    bool
	SectionDivClass       string
	AllowRawHTML          bool
	XHTMLOutput           bool
	HardWraps             bool
	EnableObjectIcons     bool
	EnableNestedListFix   bool
	NestedListFixStrategy NestedListFixStrategy
	EnableFloatingSidebar bool
	SidebarWidth          string
}

// CustomConfig holds user-defined custom element renderers.
type CustomConfig struct {
	ElementRenderers map[string]ElementRenderer
}

// DefaultRenderConfig returns sensible defaults for change report rendering.
func DefaultRenderConfig() *RenderConfig {
	return &RenderConfig{
		Breaking: &BreakingConfig{
			Badge:    "💔",
			Class:    "breaking-change",
			DataAttr: "data-breaking",
		},
		Styling: &StylingConfig{
			PropertyNameClass:  "property-name",
			PropertyNamePrefix: "`",
			PropertyNameSuffix: "`",
			AdditionClass:      "change-addition",
			ModificationClass:  "change-modification",
			RemovalClass:       "change-removal",
		},
		CodeBlock: &CodeBlockConfig{
			EnableSyntaxHighlighting: false,
			Class:                    "code-block",
			HeaderGenerator:          nil,
		},
		HTML: &HTMLConfig{
			ExternalLinksNewTab: true,
			LinkClass:           "doc-link",
			HeadingIDPrefix:     "change-",
			HeadingClass:        "change-heading",
			AddHeadingAnchors:   true,
			TableClass:          "change-table",
			TableHeaderClass:    "table-header",
			TableRowClass:       "table-row",
			WrapSectionsInDivs:  false,
			SectionDivClass:     "change-section",
			AllowRawHTML:        false,
			XHTMLOutput:         false,
			HardWraps:           false,
			EnableObjectIcons:   true,
			EnableNestedListFix:   false,
			NestedListFixStrategy: NestedListFixInline,
		},
		Custom: &CustomConfig{
			ElementRenderers: nil,
		},
	}
}

// MergeConfigs merges override config into base config, with override taking precedence.
// returns a new config without modifying the originals.
func MergeConfigs(base, override *RenderConfig) *RenderConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	merged := &RenderConfig{
		Breaking:  mergeBreakingConfig(base.Breaking, override.Breaking),
		Styling:   mergeStylingConfig(base.Styling, override.Styling),
		CodeBlock: mergeCodeBlockConfig(base.CodeBlock, override.CodeBlock),
		HTML:      mergeHTMLConfig(base.HTML, override.HTML),
		Custom:    mergeCustomConfig(base.Custom, override.Custom),
	}

	return merged
}

func mergeBreakingConfig(base, override *BreakingConfig) *BreakingConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	if override.Badge == "" && override.Class == "" && override.DataAttr == "" {
		return base
	}

	return &BreakingConfig{
		Badge:    mergeString(base.Badge, override.Badge),
		Class:    mergeString(base.Class, override.Class),
		DataAttr: mergeString(base.DataAttr, override.DataAttr),
	}
}

func mergeStylingConfig(base, override *StylingConfig) *StylingConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	if override.PropertyNameClass == "" &&
		override.PropertyNamePrefix == "" &&
		override.PropertyNameSuffix == "" &&
		override.AdditionClass == "" &&
		override.ModificationClass == "" &&
		override.RemovalClass == "" {
		return base
	}

	return &StylingConfig{
		PropertyNameClass:  mergeString(base.PropertyNameClass, override.PropertyNameClass),
		PropertyNamePrefix: mergeString(base.PropertyNamePrefix, override.PropertyNamePrefix),
		PropertyNameSuffix: mergeString(base.PropertyNameSuffix, override.PropertyNameSuffix),
		AdditionClass:      mergeString(base.AdditionClass, override.AdditionClass),
		ModificationClass:  mergeString(base.ModificationClass, override.ModificationClass),
		RemovalClass:       mergeString(base.RemovalClass, override.RemovalClass),
	}
}

func mergeCodeBlockConfig(base, override *CodeBlockConfig) *CodeBlockConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	// note: EnableSyntaxHighlighting always uses override value (boolean has no "unset" state).
	// if you need three-state logic (true/false/unset), use *bool instead.

	return &CodeBlockConfig{
		EnableSyntaxHighlighting: override.EnableSyntaxHighlighting,
		Class:                    mergeString(base.Class, override.Class),
		HeaderGenerator:          mergeable(base.HeaderGenerator, override.HeaderGenerator),
	}
}

func mergeHTMLConfig(base, override *HTMLConfig) *HTMLConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	// note: all boolean fields use override values (no three-state logic).
	// if all string fields are empty, return base to avoid unnecessary allocation.
	if override.LinkClass == "" &&
		override.HeadingIDPrefix == "" &&
		override.HeadingClass == "" &&
		override.TableClass == "" &&
		override.TableHeaderClass == "" &&
		override.TableRowClass == "" &&
		override.SectionDivClass == "" &&
		override.SidebarWidth == "" {
		// check if booleans differ from base
		if override.ExternalLinksNewTab == base.ExternalLinksNewTab &&
			override.AddHeadingAnchors == base.AddHeadingAnchors &&
			override.WrapSectionsInDivs == base.WrapSectionsInDivs &&
			override.AllowRawHTML == base.AllowRawHTML &&
			override.XHTMLOutput == base.XHTMLOutput &&
			override.HardWraps == base.HardWraps &&
			override.EnableObjectIcons == base.EnableObjectIcons &&
			override.EnableNestedListFix == base.EnableNestedListFix &&
			override.NestedListFixStrategy == base.NestedListFixStrategy &&
			override.EnableFloatingSidebar == base.EnableFloatingSidebar {
			return base
		}
	}

	return &HTMLConfig{
		ExternalLinksNewTab:   override.ExternalLinksNewTab,
		LinkClass:             mergeString(base.LinkClass, override.LinkClass),
		HeadingIDPrefix:       mergeString(base.HeadingIDPrefix, override.HeadingIDPrefix),
		HeadingClass:          mergeString(base.HeadingClass, override.HeadingClass),
		AddHeadingAnchors:     override.AddHeadingAnchors,
		TableClass:            mergeString(base.TableClass, override.TableClass),
		TableHeaderClass:      mergeString(base.TableHeaderClass, override.TableHeaderClass),
		TableRowClass:         mergeString(base.TableRowClass, override.TableRowClass),
		WrapSectionsInDivs:    override.WrapSectionsInDivs,
		SectionDivClass:       mergeString(base.SectionDivClass, override.SectionDivClass),
		AllowRawHTML:          override.AllowRawHTML,
		XHTMLOutput:           override.XHTMLOutput,
		HardWraps:             override.HardWraps,
		EnableObjectIcons:     override.EnableObjectIcons,
		EnableNestedListFix:   override.EnableNestedListFix,
		NestedListFixStrategy: override.NestedListFixStrategy,
		EnableFloatingSidebar: override.EnableFloatingSidebar,
		SidebarWidth:          mergeString(base.SidebarWidth, override.SidebarWidth),
	}
}

func mergeCustomConfig(base, override *CustomConfig) *CustomConfig {
	if override == nil {
		return base
	}
	if base == nil {
		return override
	}

	var renderers map[string]ElementRenderer
	if base.ElementRenderers != nil || override.ElementRenderers != nil {
		renderers = make(map[string]ElementRenderer)
		for k, v := range base.ElementRenderers {
			renderers[k] = v
		}
		for k, v := range override.ElementRenderers {
			renderers[k] = v
		}
	}

	return &CustomConfig{
		ElementRenderers: renderers,
	}
}

// mergeString returns override if non-empty, otherwise base.
func mergeString(base, override string) string {
	if override != "" {
		return override
	}
	return base
}

// mergeable returns override if non-nil, otherwise base (for interface types).
func mergeable[T any](base, override T) T {
	var zero T
	if any(override) != any(zero) {
		return override
	}
	return base
}
