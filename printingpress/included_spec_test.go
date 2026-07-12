// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestPrintHTMLIncludesOpenAPISpecAndSourceLinks(t *testing.T) {
	specBytes := []byte(`openapi: 3.1.0
info:
  title: Included OpenAPI
  version: 1.0.0
paths:
  /things:
    get:
      operationId: listThings
      responses:
        '200':
          description: OK
`)
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:    t.TempDir(),
		SpecPath:    "openapi.yaml",
		OutputDir:   outputDir,
		IncludeSpec: true,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)

	included, err := os.ReadFile(filepath.Join(outputDir, "spec", "openapi.yaml"))
	require.NoError(t, err)
	assert.Equal(t, specBytes, included)

	operationHTML, err := os.ReadFile(filepath.Join(outputDir, "operations", "list-things.html"))
	require.NoError(t, err)
	assert.Contains(t, string(operationHTML), `class="pp-ref-link pp-source-link" href="spec/openapi.yaml#L`)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(rootHTML), `class="pp-ref-link pp-source-link" href="spec/openapi.yaml"`)
}

func TestPrintHTMLIncludesAsyncAPISpecAndNestedModelLink(t *testing.T) {
	specBytes := streetlightsAsyncAPISpec()
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:    t.TempDir(),
		SpecPath:    "streetlights-asyncapi.yaml",
		OutputDir:   outputDir,
		AssetMode:   HTMLAssetModeServed,
		IncludeSpec: true,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)

	included, err := os.ReadFile(filepath.Join(outputDir, "spec", "streetlights-asyncapi.yaml"))
	require.NoError(t, err)
	assert.Equal(t, specBytes, included)

	modelHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "parameters", "streetlight-id.html"))
	require.NoError(t, err)
	assert.Contains(t, string(modelHTML), `class="pp-ref-link pp-source-link" href="../../spec/streetlights-asyncapi.yaml#L`)
}

func TestPrintHTMLDisabledRemovesStaleIncludedSpec(t *testing.T) {
	outputDir := t.TempDir()
	staleDir := filepath.Join(outputDir, "spec")
	require.NoError(t, os.MkdirAll(staleDir, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(staleDir, "stale.yaml"), []byte("stale"), 0o644))

	pp, err := CreatePrintingPressFromBytes([]byte(`openapi: 3.1.0
info:
  title: Disabled
  version: 1.0.0
paths: {}
`), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "openapi.yaml",
		OutputDir: outputDir,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)

	_, err = os.Stat(staleDir)
	assert.ErrorIs(t, err, os.ErrNotExist)
	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.NotContains(t, string(rootHTML), "pp-source-link")
}

func TestPrintHTMLIncludesContainedReferencedSpecFiles(t *testing.T) {
	root := t.TempDir()
	rootPath := filepath.Join(root, "openapi.yaml")
	schemaPath := filepath.Join(root, "schemas", "pet.yaml")
	pathItemPath := filepath.Join(root, "paths", "pets.yaml")
	require.NoError(t, os.MkdirAll(filepath.Dir(schemaPath), 0o755))
	require.NoError(t, os.MkdirAll(filepath.Dir(pathItemPath), 0o755))
	schemaBytes := []byte("type: object\nproperties:\n  name:\n    type: string\n")
	pathItemBytes := []byte("get:\n  operationId: listPets\n  responses:\n    '200':\n      description: OK\n")
	require.NoError(t, os.WriteFile(schemaPath, schemaBytes, 0o644))
	require.NoError(t, os.WriteFile(pathItemPath, pathItemBytes, 0o644))
	specBytes := []byte(`openapi: 3.1.0
info:
  title: Exploded
  version: 1.0.0
paths:
  /pets:
    $ref: './paths/pets.yaml'
components:
  schemas:
    Pet:
      $ref: './schemas/pet.yaml'
`)
	require.NoError(t, os.WriteFile(rootPath, specBytes, 0o644))
	outputDir := t.TempDir()

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:    root,
		SpecPath:    rootPath,
		OutputDir:   outputDir,
		AssetMode:   HTMLAssetModeServed,
		IncludeSpec: true,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)

	included, err := os.ReadFile(filepath.Join(outputDir, "spec", "schemas", "pet.yaml"))
	require.NoError(t, err)
	assert.Equal(t, schemaBytes, included)
	includedPathItem, err := os.ReadFile(filepath.Join(outputDir, "spec", "paths", "pets.yaml"))
	require.NoError(t, err)
	assert.Equal(t, pathItemBytes, includedPathItem)
	operationHTML, err := os.ReadFile(filepath.Join(outputDir, "operations", "list-pets.html"))
	require.NoError(t, err)
	assert.Contains(t, string(operationHTML), `href="../spec/paths/pets.yaml#L`)
}

func TestIncludeReferencedSpecRejectsSymlinkOutsideSpecRoot(t *testing.T) {
	root := t.TempDir()
	outside := filepath.Join(t.TempDir(), "secret.yaml")
	require.NoError(t, os.WriteFile(outside, []byte("secret"), 0o644))
	link := filepath.Join(root, "linked.yaml")
	require.NoError(t, os.Symlink(outside, link))

	pp := &PrintingPress{
		engineConfig: &pressEngineConfig{IncludeSpec: true, SpecRoot: root},
		site:         &ppmodel.Site{},
	}
	assert.Empty(t, pp.includeReferencedSpec(link))
	assert.Empty(t, pp.site.IncludedSpecs)
}

func TestRemoteSpecTargetDetectionPreservesWindowsLocalPaths(t *testing.T) {
	assert.False(t, isRemoteSpecTarget(`C:\contracts\schemas\pet.yaml`))
	assert.False(t, isRemoteSpecTarget(`C:/contracts/schemas/pet.yaml`))
	assert.True(t, isRemoteSpecTarget(`https://example.com/schemas/pet.yaml`))
}

func TestFormatLocationNormalizesRootRelativeWindowsOrigin(t *testing.T) {
	pp := &PrintingPress{engineConfig: &pressEngineConfig{SpecRoot: t.TempDir()}}
	location := pp.formatLocation(&bundler.ComponentOrigin{OriginalFile: `\paths\pets.yaml`})
	assert.Equal(t, "paths/pets.yaml", location)
}

func TestPrintHTMLIncludesSpecForModelConstructors(t *testing.T) {
	openAPIBytes := []byte(`openapi: 3.1.0
info: {title: Model OpenAPI, version: 1.0.0}
paths: {}
components:
  schemas:
    Thing: {type: object, properties: {id: {type: string}}}
`)
	asyncAPIBytes := []byte(`asyncapi: 3.0.0
info: {title: Model AsyncAPI, version: 1.0.0}
channels: {}
operations: {}
components:
  schemas:
    Thing: {type: object, properties: {id: {type: string}}}
`)

	openAPIDoc, err := libopenapi.NewDocument(openAPIBytes)
	require.NoError(t, err)
	v3Model, err := openAPIDoc.BuildV3Model()
	require.NoError(t, err)
	asyncDoc, err := libasyncapi.NewDocument(asyncAPIBytes)
	require.NoError(t, err)

	tests := []struct {
		name     string
		specData []byte
		create   func(*PrintingPressConfig) (*PrintingPress, error)
	}{
		{name: "v3 model", specData: openAPIBytes, create: func(config *PrintingPressConfig) (*PrintingPress, error) {
			return CreatePrintingPressFromV3Model(v3Model, config)
		}},
		{name: "doctor model", specData: openAPIBytes, create: func(config *PrintingPressConfig) (*PrintingPress, error) {
			return CreatePrintingPressFromDrModel(buildDrDocument(v3Model), config)
		}},
		{name: "asyncapi document", specData: asyncAPIBytes, create: func(config *PrintingPressConfig) (*PrintingPress, error) {
			return CreatePrintingPressFromAsyncAPIDocument(asyncDoc, config)
		}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			root := t.TempDir()
			require.NoError(t, os.WriteFile(filepath.Join(root, "contract.yaml"), tt.specData, 0o600))
			outputDir := t.TempDir()
			pp, err := tt.create(&PrintingPressConfig{
				BasePath:    root,
				SpecPath:    "contract.yaml",
				OutputDir:   outputDir,
				AssetMode:   HTMLAssetModeServed,
				IncludeSpec: true,
			})
			require.NoError(t, err)
			_, err = pp.PrintHTML()
			require.NoError(t, err)

			included, err := os.ReadFile(filepath.Join(outputDir, "spec", "contract.yaml"))
			require.NoError(t, err)
			assert.Equal(t, tt.specData, included)
			modelHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "schemas", "thing.html"))
			require.NoError(t, err)
			assert.Contains(t, string(modelHTML), `href="../../spec/contract.yaml`)
		})
	}
}

func TestPrintHTMLIncludesExternalAsyncAPISchemaSource(t *testing.T) {
	root := t.TempDir()
	externalDir := filepath.Join(root, "schemas")
	require.NoError(t, os.MkdirAll(externalDir, 0o755))
	externalBytes := []byte("type: object\nproperties:\n  id: {type: string}\n")
	require.NoError(t, os.WriteFile(filepath.Join(externalDir, "external.yaml"), externalBytes, 0o600))
	rootBytes := []byte(`asyncapi: 3.0.0
info: {title: External AsyncAPI, version: 1.0.0}
channels: {}
operations: {}
components:
  schemas:
    External:
      $ref: './schemas/external.yaml'
`)
	rootPath := filepath.Join(root, "asyncapi.yaml")
	require.NoError(t, os.WriteFile(rootPath, rootBytes, 0o600))
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(rootBytes, &PrintingPressConfig{
		BasePath:    root,
		SpecPath:    rootPath,
		OutputDir:   outputDir,
		AssetMode:   HTMLAssetModeServed,
		IncludeSpec: true,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)

	included, err := os.ReadFile(filepath.Join(outputDir, "spec", "schemas", "external.yaml"))
	require.NoError(t, err)
	assert.Equal(t, externalBytes, included)
	modelHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "schemas", "external.html"))
	require.NoError(t, err)
	assert.Contains(t, string(modelHTML), `href="../../spec/schemas/external.yaml#L1"`)
}
