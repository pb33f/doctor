// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

// Package frank generates OpenCollection (Bruno v3+) collections from OpenAPI specifications.
// Named after Frank Bruno, the famous UK boxer — because OpenCollection is Bruno
// trying to punch out Postman collections.
//
// https://en.wikipedia.org/wiki/Frank_Bruno
//
// Frank is a childhood hero of mine, this is my tribute.
package frank

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	highBase "github.com/pb33f/libopenapi/datamodel/high/base"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

// Frank implements the Tardis visitor interface to walk a DrDocument
// and generate an OpenCollection.
//
// To create a new *Frank (which generates a bruno collection), use KnowWhatIMeanArry and pass in a config.
type Frank struct {
	config       *FrankConfig
	log          *slog.Logger
	drDoc        *v3.Document
	collection   *Collection
	environments []*Environment
	folders      map[string]*folderBuildState
	folderOrder  []string

	// cached references for use during visiting
	docSecurity     []*highBase.SecurityRequirement
	securitySchemes *orderedmap.Map[string, *highV3.SecurityScheme]
}

// discardHandler is a no-op slog.Handler that silently drops all log records.
type discardHandler struct{}

func (discardHandler) Enabled(context.Context, slog.Level) bool  { return false }
func (discardHandler) Handle(context.Context, slog.Record) error { return nil }
func (d discardHandler) WithAttrs([]slog.Attr) slog.Handler      { return d }
func (d discardHandler) WithGroup(string) slog.Handler            { return d }

type folderBuildState struct {
	name     string
	requests []*Request
	nextSeq  int
}

// KnowWhatIMeanArry creates a new Frank generator from config.
func KnowWhatIMeanArry(config *FrankConfig) (*Frank, error) {
	if config == nil {
		return nil, fmt.Errorf("config is required")
	}
	if config.DrDoc == nil || config.DrDoc.V3Document == nil {
		return nil, fmt.Errorf("DrDoc with a walked V3Document is required")
	}
	if config.DefaultTag == "" {
		config.DefaultTag = "default"
	}
	log := config.Logger
	if log == nil {
		log = slog.New(discardHandler{})
	}
	return &Frank{
		config:  config,
		log:     log,
		drDoc:   config.DrDoc.V3Document,
		folders: make(map[string]*folderBuildState),
	}, nil
}

// Generate walks the DrDocument and produces a FrankResult.
func (f *Frank) Generate() (*FrankResult, error) {
	// reset accumulated state so Generate() is safe to call more than once
	f.folders = make(map[string]*folderBuildState)
	f.folderOrder = nil
	f.environments = nil
	f.collection = nil
	f.docSecurity = nil
	f.securitySchemes = nil

	ctx := context.Background()
	f.drDoc.Travel(ctx, f)

	// deduplicate folder slugs — different tag names can normalize to the same slug
	slugSeen := make(map[string]int, len(f.folderOrder))
	folderOutputs := make([]*FolderOutput, 0, len(f.folderOrder))
	for i, tagName := range f.folderOrder {
		state := f.folders[tagName]
		dirName := slugify(tagName)
		if dirName == "" {
			dirName = "default"
		}
		slugSeen[dirName]++
		if slugSeen[dirName] > 1 {
			dirName = fmt.Sprintf("%s-%d", dirName, slugSeen[dirName])
		}
		folderOutputs = append(folderOutputs, &FolderOutput{
			Folder: &Folder{
				Info: FolderInfo{
					Name: state.name,
					Seq:  i + 1,
				},
			},
			Requests: state.requests,
			DirName:  dirName,
		})
	}

	return &FrankResult{
		Collection:   f.collection,
		Environments: f.environments,
		Folders:      folderOutputs,
	}, nil
}

// Visit implements the Tardis interface. Only handles Document, Paths, and PathItem.
func (f *Frank) Visit(ctx context.Context, object any) {
	switch obj := object.(type) {
	case *v3.Document:
		f.visitDocument(ctx, obj)
	case *v3.Paths:
		f.visitPaths(ctx, obj)
	case *v3.PathItem:
		f.visitPathItem(ctx, obj)
	default:
		// no-op for all other types
	}
}

// GetDoctor returns nil — frank doesn't need the doctor.
func (f *Frank) GetDoctor() v3.Doctor {
	return nil
}

// visitDocument builds the collection root, environments, and caches security info.
func (f *Frank) visitDocument(ctx context.Context, doc *v3.Document) {
	d := doc.Document
	if d == nil {
		return
	}

	name := f.config.CollectionName
	if name == "" && d.Info != nil {
		name = d.Info.Title
	}
	if name == "" {
		name = "API Collection"
	}

	col := &Collection{
		OpenCollection: "1.0.0",
		Info: CollectionInfo{
			Name: name,
		},
		Extensions: &BrunoExtensions{
			Bruno: &BrunoConfig{
				Ignore: []string{"node_modules", ".git"},
			},
		},
	}

	if d.Info != nil {
		if d.Info.Description != "" {
			col.Info.Summary = d.Info.Description
		}
		if d.Info.Version != "" {
			col.Info.Version = d.Info.Version
		}
		if d.Info.Contact != nil {
			author := CollectionAuthor{
				Name: d.Info.Contact.Name,
			}
			if d.Info.Contact.Email != "" {
				author.Email = d.Info.Contact.Email
			}
			if author.Name != "" || author.Email != "" {
				col.Info.Authors = []CollectionAuthor{author}
			}
		}
	}

	// cache security info for later use
	if d.Components != nil && d.Components.SecuritySchemes != nil {
		f.securitySchemes = d.Components.SecuritySchemes
	}
	if d.Security != nil {
		f.docSecurity = d.Security
	}

	// resolve collection-level auth
	auth := resolveCollectionAuth(f.docSecurity, f.securitySchemes, f.log)
	if auth != nil {
		col.Request = &CollectionRequest{Auth: auth}
	}

	f.collection = col

	// build environments from servers
	if f.config.GenerateEnvironments || f.config.OutputMode == OutputExploded {
		f.buildEnvironments(d)
	}

	// walk paths
	if doc.Paths != nil {
		doc.Paths.Travel(ctx, f)
	}
}

// buildEnvironments creates Environment entries from OpenAPI servers.
func (f *Frank) buildEnvironments(doc *highV3.Document) {
	if doc.Servers == nil || len(doc.Servers) == 0 {
		// emit default environment so {{baseUrl}} always resolves
		f.environments = []*Environment{{
			Name: "default",
			Variables: []EnvironmentVariable{
				{Name: "baseUrl", Value: "http://localhost"},
			},
		}}
		return
	}

	seen := make(map[string]int)
	for _, server := range doc.Servers {
		envName := deriveEnvironmentName(server.URL, server.Description)
		seen[envName]++
		if seen[envName] > 1 {
			envName = fmt.Sprintf("%s-%d", envName, seen[envName])
		}

		vars := []EnvironmentVariable{
			{Name: "baseUrl", Value: strings.TrimRight(renderServerURLTemplate(server.URL), "/")},
		}

		// add server variables as environment variables
		if server.Variables != nil {
			for name, sv := range server.Variables.FromOldest() {
				vars = append(vars, EnvironmentVariable{
					Name:  sanitizeVarName(name),
					Value: sv.Default,
				})
			}
		}

		f.environments = append(f.environments, &Environment{
			Name:      envName,
			Variables: vars,
		})
	}
}
