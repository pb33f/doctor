// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

// Package theme renders Printing Press pages through Go templates. A page is
// drawn by layout.html, found in the first of: the site's own layouts folder,
// the selected theme, the embedded base. A site can override one partial,
// one page body (api/operation.html, for example) or every page.
//
// Templates are laid out for people to read. Before a template is parsed, a
// line break and the indentation after it are removed when they sit next to
// a tag or an action, so the markup a page gets is compact. Other whitespace
// stays, and text inside pre, script, style and textarea is not changed.
package theme

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"

	"github.com/pb33f/go-yaml"
)

//go:embed all:themes
var builtins embed.FS

const (
	// DefaultName is the theme used when none is selected.
	DefaultName = "pb33f"
	baseName    = "base"
	layoutsDir  = "layouts"
	assetsDir   = "assets"
	configFile  = "theme.yaml"
	// LayoutTemplate is the template every page starts from.
	LayoutTemplate = "layout.html"
)

// Config is theme.yaml.
type Config struct {
	Name string `yaml:"name"`
	// Palettes are the palette names a palette switcher offers.
	Palettes []string `yaml:"palettes"`
}

// Stack is a loaded theme: its templates, parsed once, and its assets.
type Stack struct {
	config    Config
	templates *template.Template
	assets    fs.FS
}

// Name is the theme's name.
func (s *Stack) Name() string { return s.config.Name }

// Palettes are the theme's palette names.
func (s *Stack) Palettes() []string { return append([]string(nil), s.config.Palettes...) }

// BuiltinNames lists the themes that ship with the engine.
func BuiltinNames() []string {
	entries, err := fs.ReadDir(builtins, "themes")
	if err != nil {
		return nil
	}
	var names []string
	for _, entry := range entries {
		if entry.IsDir() && entry.Name() != baseName {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)
	return names
}

// Load builds the template stack for a theme. selection is a built-in theme
// name or a path to a theme folder; empty selects the default theme.
// siteLayouts, when it exists, is the site's own layouts folder and wins over
// the theme. funcs are the engine's template functions; the page bodies call
// them, so every theme gets them.
func Load(selection, siteLayouts string, funcs template.FuncMap) (*Stack, error) {
	themeFS, err := resolveTheme(selection)
	if err != nil {
		return nil, err
	}
	config, err := readConfig(themeFS, selection)
	if err != nil {
		return nil, err
	}
	base, err := fs.Sub(builtins, path.Join("themes", baseName))
	if err != nil {
		return nil, err
	}
	layers := []fs.FS{base, themeFS}
	if siteLayouts = strings.TrimSpace(siteLayouts); siteLayouts != "" {
		if info, err := os.Stat(siteLayouts); err == nil && info.IsDir() {
			layers = append(layers, siteLayoutFS{os.DirFS(siteLayouts)})
		}
	}
	templates, err := parseLayers(layers, funcs)
	if err != nil {
		return nil, fmt.Errorf("theme %q: %w", config.Name, err)
	}
	if templates.Lookup(LayoutTemplate) == nil {
		return nil, fmt.Errorf("theme %q has no %s", config.Name, LayoutTemplate)
	}
	assets, err := fs.Sub(themeFS, assetsDir)
	if err != nil {
		return nil, err
	}
	return &Stack{config: config, templates: templates, assets: assets}, nil
}

func resolveTheme(selection string) (fs.FS, error) {
	selection = strings.TrimSpace(selection)
	if selection == "" {
		selection = DefaultName
	}
	if selection != baseName && !strings.ContainsAny(selection, `/\`) {
		if sub, err := fs.Sub(builtins, path.Join("themes", selection)); err == nil {
			if _, statErr := fs.Stat(sub, configFile); statErr == nil {
				return sub, nil
			}
		}
	}
	info, err := os.Stat(selection)
	if err != nil {
		return nil, fmt.Errorf("theme %q is not a built-in theme (%s) or a theme folder", selection, strings.Join(BuiltinNames(), ", "))
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("theme %q is not a folder", selection)
	}
	return os.DirFS(selection), nil
}

func readConfig(themeFS fs.FS, selection string) (Config, error) {
	raw, err := fs.ReadFile(themeFS, configFile)
	if err != nil {
		return Config{}, fmt.Errorf("theme %q needs a %s: %w", selection, configFile, err)
	}
	var config Config
	decoder := yaml.NewDecoder(bytes.NewReader(raw))
	decoder.KnownFields(true)
	if err := decoder.Decode(&config); err != nil {
		return Config{}, fmt.Errorf("theme %q: %s: %w", selection, configFile, err)
	}
	if strings.TrimSpace(config.Name) == "" {
		return Config{}, fmt.Errorf("theme %q: %s needs a name", selection, configFile)
	}
	return config, nil
}

// siteLayoutFS presents a site's layouts folder as a layer: its files are
// the layer's layouts.
type siteLayoutFS struct{ fs.FS }

func (s siteLayoutFS) Open(name string) (fs.File, error) {
	rel, ok := strings.CutPrefix(name, layoutsDir)
	if !ok {
		return nil, fs.ErrNotExist
	}
	rel = strings.TrimPrefix(rel, "/")
	if rel == "" {
		rel = "."
	}
	return s.FS.Open(rel)
}

// parseLayers parses every template under layouts/ in each layer. A file in a
// later layer replaces the file with the same path in an earlier one.
func parseLayers(layers []fs.FS, funcs template.FuncMap) (*template.Template, error) {
	sources := make(map[string]string)
	for _, layer := range layers {
		err := fs.WalkDir(layer, layoutsDir, func(filePath string, entry fs.DirEntry, walkErr error) error {
			if walkErr != nil {
				if errors.Is(walkErr, fs.ErrNotExist) {
					return fs.SkipDir
				}
				return walkErr
			}
			if entry.IsDir() || path.Ext(filePath) != ".html" {
				return nil
			}
			raw, err := fs.ReadFile(layer, filePath)
			if err != nil {
				return err
			}
			sources[strings.TrimPrefix(filePath, layoutsDir+"/")] = string(raw)
			return nil
		})
		if err != nil && !errors.Is(err, fs.ErrNotExist) {
			return nil, err
		}
	}
	names := make([]string, 0, len(sources))
	for name := range sources {
		names = append(names, name)
	}
	sort.Strings(names)
	root := template.New("").Funcs(funcs)
	for _, name := range names {
		if _, err := root.New(name).Parse(compactSource(sources[name])); err != nil {
			return nil, err
		}
	}
	return root, nil
}

// Render draws one page through layout.html.
func (s *Stack) Render(w io.Writer, view *PageView) error {
	return s.templates.ExecuteTemplate(w, LayoutTemplate, view)
}

// RenderTemplate draws one named template, such as a page body, and returns
// it, so a failed template writes nothing.
func (s *Stack) RenderTemplate(name string, data any) (template.HTML, error) {
	var buffer bytes.Buffer
	if err := s.templates.ExecuteTemplate(&buffer, name, data); err != nil {
		return "", err
	}
	return template.HTML(buffer.String()), nil
}

// RenderString draws one page and returns it, so a failed page writes
// nothing.
func (s *Stack) RenderString(view *PageView) (string, error) {
	var buffer bytes.Buffer
	if err := s.Render(&buffer, view); err != nil {
		return "", err
	}
	return buffer.String(), nil
}

// AssetDir is where the theme's own assets are written, under the output.
func (s *Stack) AssetDir() string {
	return path.Join("static", "themes", s.config.Name)
}

// CopyAssets writes the theme's assets folder into the output and returns the
// files written.
func (s *Stack) CopyAssets(outputDir string) ([]string, error) {
	var written []string
	target := filepath.Join(outputDir, filepath.FromSlash(s.AssetDir()))
	err := fs.WalkDir(s.assets, ".", func(filePath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			if errors.Is(walkErr, fs.ErrNotExist) {
				return fs.SkipDir
			}
			return walkErr
		}
		if entry.IsDir() {
			return nil
		}
		data, err := fs.ReadFile(s.assets, filePath)
		if err != nil {
			return err
		}
		out := filepath.Join(target, filepath.FromSlash(filePath))
		if err := os.MkdirAll(filepath.Dir(out), 0o755); err != nil {
			return err
		}
		if err := os.WriteFile(out, data, 0o644); err != nil {
			return err
		}
		written = append(written, out)
		return nil
	})
	if err != nil && !errors.Is(err, fs.ErrNotExist) {
		return nil, err
	}
	return written, nil
}
