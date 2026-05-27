// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package config

import (
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"go.yaml.in/yaml/v4"
)

type File struct {
	configDir     string
	Title         string         `mapstructure:"title" yaml:"title"`
	Description   string         `mapstructure:"description" yaml:"description"`
	Output        string         `mapstructure:"output" yaml:"output"`
	BaseURL       string         `mapstructure:"baseURL" yaml:"baseURL"`
	BasePath      string         `mapstructure:"basePath" yaml:"basePath"`
	Theme         string         `mapstructure:"theme" yaml:"theme"`
	NoLogo        bool           `mapstructure:"noLogo" yaml:"noLogo"`
	DisableExport bool           `mapstructure:"disableExport" yaml:"disableExport"`
	NoHTML        bool           `mapstructure:"noHTML" yaml:"noHTML"`
	NoLLM         bool           `mapstructure:"noLLM" yaml:"noLLM"`
	NoJSON        bool           `mapstructure:"noJSON" yaml:"noJSON"`
	Publish       bool           `mapstructure:"publish" yaml:"publish"`
	Serve         bool           `mapstructure:"serve" yaml:"serve"`
	Debug         bool           `mapstructure:"debug" yaml:"debug"`
	Metrics       bool           `mapstructure:"metrics" yaml:"metrics"`
	Port          int            `mapstructure:"port" yaml:"port"`
	Scan          ScanConfig     `mapstructure:"scan" yaml:"scan"`
	Grouping      GroupingConfig `mapstructure:"grouping" yaml:"grouping"`
	Build         BuildConfig    `mapstructure:"build" yaml:"build"`
	State         StateConfig    `mapstructure:"state" yaml:"state"`
	Footer        FooterConfig   `mapstructure:"footer" yaml:"footer"`
}

type ScanConfig struct {
	Root        string   `mapstructure:"root" yaml:"root"`
	Include     []string `mapstructure:"include" yaml:"include"`
	IgnoreRules []string `mapstructure:"ignoreRules" yaml:"ignoreRules"`
}

type GroupingConfig struct {
	NoiseSegments        []string       `mapstructure:"noiseSegments" yaml:"noiseSegments"`
	ServiceOverrides     []PathOverride `mapstructure:"serviceOverrides" yaml:"serviceOverrides"`
	DisplayNameOverrides []PathOverride `mapstructure:"displayNameOverrides" yaml:"displayNameOverrides"`
	VersionOverrides     []PathOverride `mapstructure:"versionOverrides" yaml:"versionOverrides"`
}

type PathOverride struct {
	Pattern string `mapstructure:"pattern" yaml:"pattern"`
	Value   string `mapstructure:"value" yaml:"value"`
}

type BuildConfig struct {
	Mode                               string `mapstructure:"mode" yaml:"mode"`
	MaxPools                           int    `mapstructure:"maxPools" yaml:"maxPools"`
	WorkersPerPool                     int    `mapstructure:"workersPerPool" yaml:"workersPerPool"`
	MaxPatternRepeatBudget             int    `mapstructure:"maxPatternRepeatBudget" yaml:"maxPatternRepeatBudget"`
	MaxGeneratedStringBytes            int    `mapstructure:"maxGeneratedStringBytes" yaml:"maxGeneratedStringBytes"`
	MaxGeneratedMockBytes              int    `mapstructure:"maxGeneratedMockBytes" yaml:"maxGeneratedMockBytes"`
	LLMAggregateSpecSizeThresholdBytes int64  `mapstructure:"llmAggregateSpecSizeThresholdBytes" yaml:"llmAggregateSpecSizeThresholdBytes"`
	LLMMaxAggregateFileBytes           int64  `mapstructure:"llmMaxAggregateFileBytes" yaml:"llmMaxAggregateFileBytes"`
	LLMGenerateMonoliths               string `mapstructure:"llmGenerateMonoliths" yaml:"llmGenerateMonoliths"`
	DisableSkippedRendering            bool   `mapstructure:"disableSkippedRendering" yaml:"disableSkippedRendering"`
}

type StateConfig struct {
	Namespace string          `mapstructure:"namespace" yaml:"namespace"`
	SQLite    SQLiteStateFile `mapstructure:"sqlite" yaml:"sqlite"`
}

type SQLiteStateFile struct {
	Path string `mapstructure:"path" yaml:"path"`
}

type FooterConfig struct {
	Enabled   *bool  `mapstructure:"enabled" yaml:"enabled"`
	URL       string `mapstructure:"url" yaml:"url"`
	LinkTitle string `mapstructure:"linkTitle" yaml:"linkTitle"`
	Content   string `mapstructure:"content" yaml:"content"`
}

func Load(configPath, inputArg string) (*File, error) {
	resolvedPath := strings.TrimSpace(configPath)
	var err error
	if resolvedPath != "" {
		resolvedPath, err = ResolvePath(resolvedPath)
		if err != nil {
			return nil, err
		}
	} else {
		var ok bool
		resolvedPath, ok = Discover(AutoSearchPaths(inputArg))
		if !ok {
			return nil, nil
		}
	}

	data, err := os.ReadFile(resolvedPath)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) && strings.TrimSpace(configPath) == "" {
			return nil, nil
		}
		return nil, err
	}

	var fileConfig File
	if err := yaml.Unmarshal(data, &fileConfig); err != nil {
		return nil, err
	}
	if absPath, absErr := filepath.Abs(resolvedPath); absErr == nil {
		fileConfig.configDir = filepath.Dir(absPath)
	} else {
		fileConfig.configDir = filepath.Dir(resolvedPath)
	}
	fileConfig.ResolveRelativePaths()
	return &fileConfig, nil
}

func (c *File) ConfigDir() string {
	if c == nil {
		return ""
	}
	return c.configDir
}

func AutoSearchPaths(inputArg string) []string {
	paths := make([]string, 0, 2)
	if strings.TrimSpace(inputArg) == "" || IsRemoteInput(inputArg) {
		return []string{"."}
	}
	absPath, err := filepath.Abs(inputArg)
	if err != nil {
		return []string{"."}
	}
	info, err := os.Stat(absPath)
	if err != nil {
		return []string{"."}
	}
	if info.IsDir() {
		paths = append(paths, absPath)
	} else {
		paths = append(paths, filepath.Dir(absPath))
	}
	paths = append(paths, ".")
	return DedupeStrings(paths)
}

func Discover(searchPaths []string) (string, bool) {
	candidates := []string{"printing-press.yaml", "printing-press.yml"}
	for _, searchPath := range searchPaths {
		if strings.TrimSpace(searchPath) == "" {
			continue
		}
		for _, candidate := range candidates {
			fullPath := filepath.Join(searchPath, candidate)
			if info, err := os.Stat(fullPath); err == nil && !info.IsDir() {
				return fullPath, true
			}
		}
	}
	return "", false
}

func (c *File) ResolveRelativePaths() {
	if c == nil || c.configDir == "" {
		return
	}
	c.Output = ResolveRelativePath(c.configDir, c.Output)
	c.BasePath = ResolveRelativePath(c.configDir, c.BasePath)
	c.Scan.Root = ResolveRelativePath(c.configDir, c.Scan.Root)
	c.State.SQLite.Path = ResolveRelativePath(c.configDir, c.State.SQLite.Path)
}

func ResolveRelativePath(baseDir, raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" || filepath.IsAbs(raw) || strings.Contains(raw, "://") {
		return raw
	}
	return filepath.Join(baseDir, raw)
}

func ResolvePath(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" || strings.Contains(raw, "://") {
		return raw, nil
	}

	expanded := os.ExpandEnv(raw)
	if strings.HasPrefix(expanded, "~") {
		home, err := os.UserHomeDir()
		if err != nil {
			return "", fmt.Errorf("resolve home directory: %w", err)
		}
		if expanded == "~" {
			expanded = home
		} else if strings.HasPrefix(expanded, "~/") || strings.HasPrefix(expanded, "~\\") {
			expanded = filepath.Join(home, expanded[2:])
		}
	}
	if filepath.IsAbs(expanded) {
		return filepath.Clean(expanded), nil
	}
	abs, err := filepath.Abs(expanded)
	if err != nil {
		return "", fmt.Errorf("resolve path: %w", err)
	}
	return abs, nil
}

func IsRemoteInput(raw string) bool {
	parsed, err := url.Parse(raw)
	if err != nil {
		return false
	}
	return (parsed.Scheme == "http" || parsed.Scheme == "https") && parsed.Host != ""
}

func DedupeStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		cleaned := strings.TrimSpace(value)
		if cleaned == "" {
			continue
		}
		if _, ok := seen[cleaned]; ok {
			continue
		}
		seen[cleaned] = struct{}{}
		result = append(result, cleaned)
	}
	return result
}
