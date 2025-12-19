// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

// MermaidConfig configures the mermaid diagram generation
type MermaidConfig struct {
	MaxProperties            int  // max properties to show per class (default 20)
	IncludePrivate           bool // include private members
	IncludeOperations        bool // include operations/methods
	ShowCardinality          bool // show relationship cardinality
	UseNamespaces            bool // group by namespaces
	SimplifyNames            bool // use simplified names when operationId not available
	RenderTitledInlineSchema bool // render inline schemas with titles as separate classes (default true)
}

func DefaultMermaidConfig() *MermaidConfig {
	return &MermaidConfig{
		MaxProperties:            20,
		IncludePrivate:           true,
		IncludeOperations:        true,
		ShowCardinality:          true,
		UseNamespaces:            false,
		SimplifyNames:            true,
		RenderTitledInlineSchema: true, // show inline schemas with titles as separate classes by default
	}
}