// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"fmt"
	"os"
	"path"
	"path/filepath"

	"go.yaml.in/yaml/v4"
)

// ExplodedFile represents a single file in the exploded output.
type ExplodedFile struct {
	Path    string // relative path, e.g. "users/list-users.yml"
	Content []byte
}

// RenderExploded generates exploded output files from a FrankResult.
func RenderExploded(result *FrankResult) ([]ExplodedFile, error) {
	if result == nil {
		return nil, fmt.Errorf("result is required")
	}

	var files []ExplodedFile

	// opencollection.yml — root collection metadata
	colBytes, err := yaml.Marshal(result.Collection)
	if err != nil {
		return nil, fmt.Errorf("marshaling collection: %w", err)
	}
	files = append(files, ExplodedFile{
		Path:    "opencollection.yml",
		Content: colBytes,
	})

	// per folder: folder.yml + request files
	for _, fo := range result.Folders {
		folderBytes, err := yaml.Marshal(fo.Folder)
		if err != nil {
			return nil, fmt.Errorf("marshaling folder %s: %w", fo.DirName, err)
		}
		files = append(files, ExplodedFile{
			Path:    path.Join(fo.DirName, "folder.yml"),
			Content: folderBytes,
		})

		requestNames := make(map[string]int)
		for _, req := range fo.Requests {
			reqBytes, err := yaml.Marshal(req)
			if err != nil {
				return nil, fmt.Errorf("marshaling request %s: %w", req.Info.Name, err)
			}
			baseName := req.FileName
			if baseName == "" {
				baseName = slugify(req.Info.Name)
			}
			requestNames[baseName]++
			fileName := baseName
			if requestNames[baseName] > 1 {
				fileName = fmt.Sprintf("%s-%d", baseName, requestNames[baseName])
			}
			fileName += ".yml"
			files = append(files, ExplodedFile{
				Path:    path.Join(fo.DirName, fileName),
				Content: reqBytes,
			})
		}
	}

	// environment files
	for _, env := range result.Environments {
		envBytes, err := yaml.Marshal(env)
		if err != nil {
			return nil, fmt.Errorf("marshaling environment %s: %w", env.Name, err)
		}
		files = append(files, ExplodedFile{
			Path:    path.Join("environments", slugify(env.Name)+".yml"),
			Content: envBytes,
		})
	}

	return files, nil
}

// WriteExploded writes the exploded files to a directory.
func WriteExploded(baseDir string, files []ExplodedFile) error {
	for _, f := range files {
		fullPath := filepath.Join(baseDir, f.Path)
		dir := filepath.Dir(fullPath)
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
		if err := os.WriteFile(fullPath, f.Content, 0o644); err != nil {
			return fmt.Errorf("writing file %s: %w", fullPath, err)
		}
	}
	return nil
}
