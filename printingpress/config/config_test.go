// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package config

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestLoadServiceIdentityAndContractRoles(t *testing.T) {
	projectDir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(projectDir, "printing-press.yaml"), []byte(`
grouping:
  serviceIdentity:
    metadataPointers:
      - /info/x-owner/service
    stripPrefixes:
      - platform-
    stripSuffixes:
      - -api
    preferOpenAPISlug: true
    metadataOptionalForOpenAPI: true
  contractRoles:
    - pattern: "**/openapi.yaml"
      role: http-api
      contractID: primary
      default: true
    - pattern: "**/published/*.yaml"
      role: published-events
`), 0o644))

	cfg, err := Load(filepath.Join(projectDir, "printing-press.yaml"), "")
	require.NoError(t, err)
	require.NotNil(t, cfg)
	assert.Equal(t, ServiceIdentityConfig{
		MetadataPointers:           []string{"/info/x-owner/service"},
		StripPrefixes:              []string{"platform-"},
		StripSuffixes:              []string{"-api"},
		PreferOpenAPISlug:          true,
		MetadataOptionalForOpenAPI: true,
	}, cfg.Grouping.ServiceIdentity)
	assert.Equal(t, []ContractRoleRule{
		{Pattern: "**/openapi.yaml", Role: "http-api", ContractID: "primary", Default: true},
		{Pattern: "**/published/*.yaml", Role: "published-events"},
	}, cfg.Grouping.ContractRoles)
}

func TestLoadDiscoversAndResolvesRelativePaths(t *testing.T) {
	projectDir := t.TempDir()
	require.NoError(t, os.MkdirAll(filepath.Join(projectDir, "apis"), 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(projectDir, "printing-press.yaml"), []byte(`
output: ./site
basePath: ./specs
includeSpec: true
scan:
  root: ./apis
state:
  sqlite:
    path: ./state/cache.db
`), 0o644))

	cfg, err := Load("", projectDir)
	require.NoError(t, err)
	require.NotNil(t, cfg)
	require.Equal(t, filepath.Join(projectDir, "site"), cfg.Output)
	require.Equal(t, filepath.Join(projectDir, "specs"), cfg.BasePath)
	require.True(t, cfg.IncludeSpec)
	require.Equal(t, filepath.Join(projectDir, "apis"), cfg.Scan.Root)
	require.Equal(t, filepath.Join(projectDir, "state", "cache.db"), cfg.State.SQLite.Path)
}

func TestLoadReturnsNilWhenConfigMissing(t *testing.T) {
	cfg, err := Load("", filepath.Join(t.TempDir(), "openapi.yaml"))
	require.NoError(t, err)
	require.Nil(t, cfg)
}

func TestResolveRelativePathLeavesURLsAlone(t *testing.T) {
	require.Equal(t, "https://example.com/openapi.yaml", ResolveRelativePath("/tmp", "https://example.com/openapi.yaml"))
}
