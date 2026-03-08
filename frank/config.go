// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"log/slog"

	"github.com/pb33f/doctor/model"
)

// OutputMode controls how the collection is rendered.
type OutputMode int

const (
	// OutputExploded renders a directory tree (default).
	OutputExploded OutputMode = iota
	// OutputBundled renders a single YAML file with nested items.
	OutputBundled
)

// FrankConfig configures the Frank generator.
type FrankConfig struct {
	DrDoc                    *model.DrDocument // fully walked DrDocument (required)
	OutputMode               OutputMode        // exploded (default) or bundled
	CollectionName           string            // override info.title
	DefaultTag               string            // folder for untagged ops (default "default")
	IncludeDescriptionAsDocs bool              // operation.description -> docs field
	GenerateEnvironments     bool              // servers[] -> environment files (always on for OutputExploded)
	Logger                   *slog.Logger
}

// FrankResult holds the output of a Generate() call.
type FrankResult struct {
	Collection   *Collection
	Environments []*Environment
	Folders      []*FolderOutput
}

// FolderOutput holds a folder and its requests in source order.
type FolderOutput struct {
	Folder   *Folder
	Requests []*Request
	DirName  string // slugified folder name for filesystem
}
