// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/doctor/model"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestCreatePrintingPress_PrintHTMLAndLLM(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:     "Burger Shop",
		BaseURL:   "/docs/",
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	htmlStats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, htmlStats)
	assert.NotEmpty(t, htmlStats.JobID)
	assert.Equal(t, jobTypeHTML, htmlStats.JobType)
	assert.Greater(t, htmlStats.Pages, 0)
	assert.Greater(t, htmlStats.FilesWritten, 0)
	assert.Greater(t, htmlStats.BytesWritten, int64(0))
	assert.FileExists(t, filepath.Join(outputDir, "index.html"))

	llmStats, err := pp.PrintLLM()
	require.NoError(t, err)
	require.NotNil(t, llmStats)
	assert.Equal(t, jobTypeLLM, llmStats.JobType)
	assert.Greater(t, llmStats.Pages, 0)
	assert.FileExists(t, filepath.Join(outputDir, "AGENTS.md"))
	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
}

func TestCreatePrintingPress_DefaultOutputDir(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	tempWD := t.TempDir()
	originalWD, err := os.Getwd()
	require.NoError(t, err)
	require.NoError(t, os.Chdir(tempWD))
	defer func() {
		_ = os.Chdir(originalWD)
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, nil)
	require.NoError(t, err)

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, stats)
	assert.FileExists(t, filepath.Join(tempWD, "api-docs", "index.html"))
}

func TestCreatePrintingPressFromV3Model_Validation(t *testing.T) {
	_, err := CreatePrintingPressFromV3Model(nil, &PrintingPressConfig{})
	require.Error(t, err)
	assert.ErrorAs(t, err, new(*ValidationError))
	assert.ErrorIs(t, err, ErrNoSourceInput)
}

func TestCreatePrintingPress_ActivityStreamLatestSnapshot(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/stripe.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	errCh := make(chan error, 1)
	go func() {
		_, err := pp.PrintHTML()
		errCh <- err
	}()

	stream := pp.ActivityStream()
	require.NotNil(t, stream)

	var update ActivityUpdate
	require.Eventually(t, func() bool {
		select {
		case next, ok := <-stream.Updates():
			if !ok {
				return false
			}
			update = next
			return true
		default:
			return false
		}
	}, time.Second, 10*time.Millisecond)

	assert.NotEmpty(t, update.JobID)
	assert.Equal(t, jobTypeHTML, update.JobType)
	assert.NotEmpty(t, update.CurrentTask)
	require.NoError(t, <-errCh)
}

func TestCreatePrintingPress_PressModelFromDrModel(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)
	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3Model)

	pp, err := CreatePrintingPressFromDrModel(drDoc, nil)
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.True(t, pp.modelBuilt)
	require.NotNil(t, site)
	require.NotNil(t, site.Root)
	require.Same(t, site, pp.site)
}

func TestCreatePrintingPress_SpecBytesUseConfiguredBasePath(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "test-relative", "spec.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	require.NotEmpty(t, site.Operations)
	require.NotEmpty(t, site.Models["schemas"])

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, stats)
	assert.FileExists(t, filepath.Join(outputDir, "index.html"))
}

func TestCreatePrintingPress_SkipsMissingExtensionReferences(t *testing.T) {
	specBytes := []byte(`openapi: 3.1.0
info:
  title: Extension Docs
  version: 1.0.0
paths:
  /ping:
    get:
      x-docs:
        $ref: ./docs/getting-started.md
      responses:
        '200':
          description: ok
`)

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	for _, warning := range site.Warnings {
		assert.NotContains(t, warning.Message, "getting-started.md")
		if warning.Err != nil {
			assert.NotContains(t, warning.Err.Error(), "getting-started.md")
		}
	}
	assert.Empty(t, site.Warnings)
}

func TestCreatePrintingPress_UsesConfiguredSpecPathForSourceMetadata(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "burgershop.openapi.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		SpecPath:  specPath,
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	_, err = pp.PrintLLM()
	require.NoError(t, err)

	opBytes, err := os.ReadFile(filepath.Join(outputDir, "operations", "locate-burger.md"))
	require.NoError(t, err)
	assert.Contains(t, string(opBytes), "**Source:** [burgershop.openapi.yaml:")
}

func TestCreatePrintingPress_UsesSpecURLForRenderedSourceLinksAndJSON(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "burgershop.openapi.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	outputDir := t.TempDir()
	specURL := "https://example.com/repo/blob/main/burgershop.openapi.yaml"
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		SpecPath:  specPath,
		SpecURL:   specURL,
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	_, err = pp.PrintLLM()
	require.NoError(t, err)

	agentsBytes, err := os.ReadFile(filepath.Join(outputDir, "AGENTS.md"))
	require.NoError(t, err)
	assert.Contains(t, string(agentsBytes), "**Source spec:** [burgershop.openapi.yaml]("+specURL+")")

	indexBytes, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(indexBytes), "**Source spec:** [burgershop.openapi.yaml]("+specURL+")")

	opBytes, err := os.ReadFile(filepath.Join(outputDir, "operations", "locate-burger.md"))
	require.NoError(t, err)
	assert.Contains(t, string(opBytes), "https://example.com/repo/blob/main/burgershop.openapi.yaml#L")

	site, err := pp.PressModel()
	require.NoError(t, err)
	err = PrintJSONArtifacts(site, "")
	require.NoError(t, err)

	bundleJSON, err := os.ReadFile(filepath.Join(outputDir, "bundle.json"))
	require.NoError(t, err)

	var bundle JSONBundle
	require.NoError(t, json.Unmarshal(bundleJSON, &bundle))
	require.NotNil(t, bundle.Source)
	assert.Equal(t, "burgershop.openapi.yaml", bundle.Source.Path)
	assert.Equal(t, specURL, bundle.Source.Href)

	operationJSON, err := os.ReadFile(filepath.Join(outputDir, "operations", "locate-burger.json"))
	require.NoError(t, err)
	var operationArtifact map[string]any
	require.NoError(t, json.Unmarshal(operationJSON, &operationArtifact))
	source, ok := operationArtifact["source"].(map[string]any)
	require.True(t, ok)
	assert.Equal(t, "burgershop.openapi.yaml", source["path"])
	assert.True(t, strings.HasPrefix(source["href"].(string), specURL+"#L"))
}

func TestCreatePrintingPress_DefaultSpecPathMatchesDetectedFormat(t *testing.T) {
	yamlBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	yamlPP, err := CreatePrintingPressFromBytes(yamlBytes, &PrintingPressConfig{})
	require.NoError(t, err)
	require.NotNil(t, yamlPP.config)
	assert.True(t, strings.HasSuffix(yamlPP.config.SpecPath, "openapi.yaml"))

	jsonBytes, err := os.ReadFile("../test_specs/petstorev3.json")
	require.NoError(t, err)

	jsonPP, err := CreatePrintingPressFromBytes(jsonBytes, &PrintingPressConfig{})
	require.NoError(t, err)
	require.NotNil(t, jsonPP.config)
	assert.True(t, strings.HasSuffix(jsonPP.config.SpecPath, "openapi.json"))
}

func TestCreatePrintingPress_DefaultSpecPathMatchesDetectedKind(t *testing.T) {
	yamlPP, err := CreatePrintingPressFromBytes(minimalAsyncAPISpec(), &PrintingPressConfig{})
	require.NoError(t, err)
	require.NotNil(t, yamlPP.config)
	assert.True(t, strings.HasSuffix(yamlPP.config.SpecPath, "asyncapi.yaml"))

	jsonPP, err := CreatePrintingPressFromBytes([]byte(`{"asyncapi":"3.0.0","info":{"title":"Streetlights","version":"1.0.0"}}`), &PrintingPressConfig{})
	require.NoError(t, err)
	require.NotNil(t, jsonPP.config)
	assert.True(t, strings.HasSuffix(jsonPP.config.SpecPath, "asyncapi.json"))
}

func TestCreatePrintingPress_PrepareEngineConfigRoutesAsyncAPIBytes(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(minimalAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	job := pp.activity.startJob(jobTypeModel, "", pp.resolveConfiguredOutputDir(), pp.sourceKind())
	cfg, err := pp.prepareEngineConfig(job)
	require.NoError(t, err)
	require.NotNil(t, cfg)

	assert.Equal(t, SpecKindAsyncAPI, cfg.SpecKind)
	assert.Equal(t, "3.0.0", cfg.SpecVersion)
	assert.NotNil(t, cfg.AsyncDoc)
	assert.Nil(t, cfg.DrDoc)
	assert.Equal(t, sourceKindAsyncAPIBytes, pp.sourceKind())
}

func TestCreatePrintingPress_PressModelFromAsyncAPIStreetlights(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(streetlightsAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "streetlights-kafka.yaml",
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	require.NotNil(t, site.Root)

	assert.Equal(t, SpecKindAsyncAPI, site.SpecKind)
	assert.Equal(t, "3.0.0", site.SpecVersion)
	assert.Equal(t, SpecKindAsyncAPI, site.Root.SpecKind)
	assert.Equal(t, "Streetlights Kafka API", site.Root.Title)
	assert.Len(t, site.Operations, 3)
	require.NotEmpty(t, site.Models["schemas"])
	require.NotEmpty(t, site.Models["messages"])
	require.NotEmpty(t, site.Models["channels"])
	require.NotEmpty(t, site.Models["replies"])
	require.NotEmpty(t, site.Models["reply-addresses"])
	require.NotEmpty(t, site.Models["correlation-ids"])
	require.NotEmpty(t, site.Root.Security)
	assert.Equal(t, "saslScram", site.Root.Security[0].Name)
	assert.Equal(t, "scramSha256", site.Root.Security[0].SchemeType)
	require.NotNil(t, site.Root.Security[0].Ref)

	receive := findOperationByID(site.Operations, "receiveLightMeasurement")
	require.NotNil(t, receive)
	require.NotNil(t, receive.AsyncAPI)
	assert.Equal(t, "receive", receive.AsyncAPI.Action)
	require.Len(t, receive.AsyncAPI.Messages, 2)
	assert.Equal(t, "lightMeasured", receive.AsyncAPI.Messages[0].Name)
	assert.Equal(t, "lightMeasuredAvro", receive.AsyncAPI.Messages[1].Name)
	assert.NotEmpty(t, receive.ExtensionsJSON)
	assert.Contains(t, receive.ExtensionsJSON, "telemetry")

	turnOn := findOperationByID(site.Operations, "turnOn")
	require.NotNil(t, turnOn)
	require.NotNil(t, turnOn.AsyncAPI)
	assert.Equal(t, "send", turnOn.AsyncAPI.Action)
	require.NotNil(t, turnOn.AsyncAPI.Channel)
	assert.Equal(t, "lightTurnOn", turnOn.AsyncAPI.Channel.Name)
	require.Len(t, turnOn.AsyncAPI.Messages, 1)
	assert.Equal(t, "turnOnOff", turnOn.AsyncAPI.Messages[0].Name)
	assert.NotEmpty(t, turnOn.AsyncAPI.Messages[0].Href)
	assert.Contains(t, turnOn.AsyncAPI.Bindings, "kafka")
	assert.Contains(t, turnOn.AsyncAPI.Traits, "kafka")
	assert.Contains(t, turnOn.Tags, "kafka")
	require.NotEmpty(t, turnOn.Security)
	assert.Equal(t, "saslScram", turnOn.Security[0].Name)
	assert.Equal(t, "scramSha256", turnOn.Security[0].SchemeType)
	require.NotNil(t, turnOn.Security[0].Ref)
	assert.Empty(t, turnOn.CurlJSON)
	require.NotNil(t, turnOn.CrossRefs)
	turnOnRefs := componentRefNames(turnOn.CrossRefs.ReferencesModels)
	assert.Contains(t, turnOnRefs, "lightTurnOn")
	assert.Contains(t, turnOnRefs, "turnOnOff")
	assert.Contains(t, turnOnRefs, "turnOnOffPayload")
	assert.Contains(t, turnOnRefs, "turnOnAccepted")
	assert.Contains(t, turnOnRefs, "lightingMeasured")
	assert.Contains(t, turnOnRefs, "lightMeasured")
	assert.Contains(t, turnOnRefs, "saslScram")
	require.NotNil(t, turnOn.AsyncAPI.Reply)
	require.NotNil(t, turnOn.AsyncAPI.Reply.Ref)
	assert.Equal(t, "turnOnAccepted", turnOn.AsyncAPI.Reply.Ref.Name)
	assert.Equal(t, "$message.header#/replyTo", turnOn.AsyncAPI.Reply.Address)
	require.NotNil(t, turnOn.AsyncAPI.Reply.Channel)
	assert.Equal(t, "lightingMeasured", turnOn.AsyncAPI.Reply.Channel.Name)
	require.Len(t, turnOn.AsyncAPI.Reply.Messages, 1)
	assert.Equal(t, "lightMeasured", turnOn.AsyncAPI.Reply.Messages[0].Name)

	reply := findModelByName(site.Models["replies"], "turnOnAccepted")
	require.NotNil(t, reply)
	require.NotNil(t, reply.AsyncAPI)
	assert.Equal(t, "$message.header#/replyTo", reply.AsyncAPI.Address)
	require.NotNil(t, reply.AsyncAPI.Channel)
	assert.Equal(t, "lightingMeasured", reply.AsyncAPI.Channel.Name)
	require.Len(t, reply.AsyncAPI.Messages, 1)
	assert.Equal(t, "lightMeasured", reply.AsyncAPI.Messages[0].Name)

	turnOff := findOperationByID(site.Operations, "turnOff")
	require.NotNil(t, turnOff)
	require.NotNil(t, turnOff.AsyncAPI)
	require.NotNil(t, turnOff.AsyncAPI.Channel)
	assert.Equal(t, "lightTurnOffComponent", turnOff.AsyncAPI.Channel.Name)
	assert.Equal(t, "smartylighting.streetlights.1.0.action.{streetlightId}.turn.off", turnOff.AsyncAPI.Channel.Address)

	message := findModelByName(site.Models["messages"], "lightMeasured")
	require.NotNil(t, message)
	require.NotNil(t, message.AsyncAPI)
	assert.Equal(t, "message", message.AsyncAPI.Kind)
	require.NotEmpty(t, message.AsyncAPI.Schemas)
	assert.Equal(t, "payload", message.AsyncAPI.Schemas[0].Role)
	require.NotNil(t, message.AsyncAPI.Schemas[0].Ref)
	assert.Equal(t, "lightMeasuredPayload", message.AsyncAPI.Schemas[0].Ref.Name)
	assert.Empty(t, message.AsyncAPI.Schemas[0].SchemaJSON)
	assert.Empty(t, message.AsyncAPI.Schemas[0].MockJSON)
	require.Len(t, message.AsyncAPI.Content, 1)
	messageContent := message.AsyncAPI.Content[0]
	assert.Equal(t, "application/json", messageContent.MediaType)
	require.NotNil(t, messageContent.SchemaRef)
	assert.Equal(t, "lightMeasuredPayload", messageContent.SchemaRef.Name)
	assert.NotEmpty(t, messageContent.SchemaJSON)
	assert.NotEmpty(t, messageContent.MockJSON)
	require.Contains(t, messageContent.Examples, "Nominal twilight reading")
	assert.NotEmpty(t, message.ExtensionsJSON)
	assert.Contains(t, message.ExtensionsJSON, "telemetry")
	require.NotNil(t, receive.RequestBody)
	require.NotEmpty(t, receive.RequestBody.Content)
	assert.Same(t, messageContent, receive.RequestBody.Content[0], "shared messages must reuse immutable media artifacts")

	lightMeasuredAvroMessage := findModelByName(site.Models["messages"], "lightMeasuredAvro")
	require.NotNil(t, lightMeasuredAvroMessage)
	require.NotNil(t, lightMeasuredAvroMessage.AsyncAPI)
	assert.Equal(t, "application/cloudevents+json", lightMeasuredAvroMessage.AsyncAPI.ContentType)

	turnOnOffMessage := findModelByName(site.Models["messages"], "turnOnOff")
	require.NotNil(t, turnOnOffMessage)
	require.NotNil(t, turnOnOffMessage.CrossRefs)
	assert.Contains(t, operationRefSlugs(turnOnOffMessage.CrossRefs.UsedByOperations), "turn-on")
	assert.Contains(t, componentRefNames(turnOnOffMessage.CrossRefs.UsesModels), "turnOnOffPayload")
	assert.NotEmpty(t, turnOnOffMessage.CrossRefsJSON)
	assert.NotEmpty(t, turnOnOffMessage.GraphJSON)
	assert.Equal(t, SchemaNodeID("messages", "turnOnOff"), turnOnOffMessage.GraphNodeID)

	schema := findModelByName(site.Models["schemas"], "lightMeasuredPayload")
	require.NotNil(t, schema)
	assert.NotEmpty(t, schema.SchemaJSON)
	assert.NotEmpty(t, schema.MockJSON)
	assert.Contains(t, schema.MermaidDiagram, "class lightMeasuredPayload")
	assert.Contains(t, schema.MermaidDiagram, "class sentAt")
	assert.Contains(t, schema.MermaidDiagram, "lightMeasuredPayload *-- sentAt : sentAt")

	primitiveSchema := findModelByName(site.Models["schemas"], "sentAt")
	require.NotNil(t, primitiveSchema)
	assert.Empty(t, primitiveSchema.MermaidDiagram)

	turnOnOffPayload := findModelByName(site.Models["schemas"], "turnOnOffPayload")
	require.NotNil(t, turnOnOffPayload)
	require.NotNil(t, turnOnOffPayload.CrossRefs)
	assert.Contains(t, operationRefSlugs(turnOnOffPayload.CrossRefs.UsedByOperations), "turn-on")
	assert.Contains(t, componentRefNames(turnOnOffPayload.CrossRefs.UsedByModels), "turnOnOff")
	assert.NotEmpty(t, turnOnOffPayload.GraphJSON)
	assert.Contains(t, turnOnOffPayload.GraphJSON, "turn-on")

	componentChannel := findModelByName(site.Models["channels"], "lightTurnOffComponent")
	require.NotNil(t, componentChannel)
	require.NotNil(t, componentChannel.AsyncAPI)
	require.Len(t, componentChannel.AsyncAPI.Messages, 1)

	lightTurnOnChannel := findModelByName(site.Models["channels"], "lightTurnOn")
	require.NotNil(t, lightTurnOnChannel)
	require.NotNil(t, lightTurnOnChannel.CrossRefs)
	assert.Contains(t, operationRefSlugs(lightTurnOnChannel.CrossRefs.UsedByOperations), "turn-on")
	assert.Contains(t, componentRefNames(lightTurnOnChannel.CrossRefs.UsesModels), "turnOnOff")
}

func TestCreatePrintingPress_AsyncAPIProtocolsFromChannelServers(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(asyncAPIServerProtocolSpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "provider-protocols.yaml",
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)

	natsOperation := findOperationByID(site.Operations, "receiveNatsEvent")
	require.NotNil(t, natsOperation)
	require.NotNil(t, natsOperation.AsyncAPI)
	assert.Equal(t, []string{"pulsar", "nats"}, natsOperation.AsyncAPI.Bindings)

	pubsubOperation := findOperationByID(site.Operations, "sendPubSubEvent")
	require.NotNil(t, pubsubOperation)
	require.NotNil(t, pubsubOperation.AsyncAPI)
	assert.Equal(t, []string{"googlepubsub"}, pubsubOperation.AsyncAPI.Bindings)

	natsChannel := findModelByName(site.Models["channels"], "natsEvents")
	require.NotNil(t, natsChannel)
	assert.Equal(t, []string{"nats"}, natsChannel.AsyncAPI.Bindings)

	pubsubChannel := findModelByName(site.Models["channels"], "pubsubEvents")
	require.NotNil(t, pubsubChannel)
	assert.Equal(t, []string{"googlepubsub"}, pubsubChannel.AsyncAPI.Bindings)

	natsNav := findNavOperationByID(site.NavTags, "receiveNatsEvent")
	require.NotNil(t, natsNav)
	assert.Equal(t, []string{"pulsar", "nats"}, natsNav.Protocols)
	pubsubNav := findNavOperationByID(site.NavTags, "sendPubSubEvent")
	require.NotNil(t, pubsubNav)
	assert.Equal(t, []string{"googlepubsub"}, pubsubNav.Protocols)

	message := findModelByName(site.Models["messages"], "event")
	require.NotNil(t, message)
	require.NotNil(t, message.AsyncAPI)
	assert.Equal(t, []string{"sns"}, message.AsyncAPI.Bindings)
}

func TestCreatePrintingPress_PrintHTMLAndJSONFromAsyncAPIStreetlights(t *testing.T) {
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(streetlightsAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "streetlights-kafka.yaml",
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	turnOn := findOperationByID(site.Operations, "turnOn")
	require.NotNil(t, turnOn)
	receive := findOperationByID(site.Operations, "receiveLightMeasurement")
	require.NotNil(t, receive)
	lightMeasuredMessage := findModelByName(site.Models["messages"], "lightMeasured")
	require.NotNil(t, lightMeasuredMessage)
	lightMeasuredAvroMessage := findModelByName(site.Models["messages"], "lightMeasuredAvro")
	require.NotNil(t, lightMeasuredAvroMessage)
	lightTurnOnChannel := findModelByName(site.Models["channels"], "lightTurnOn")
	require.NotNil(t, lightTurnOnChannel)
	require.NotNil(t, receive.RequestBody)
	require.NotNil(t, receive.RequestBody.Ref)
	assert.Equal(t, "lightMeasured", receive.RequestBody.Ref.Name)
	require.Len(t, receive.RequestBody.Refs, 2)
	assert.Equal(t, "lightMeasuredAvro", receive.RequestBody.Refs[1].Name)
	require.Len(t, receive.RequestBody.Content, 2)
	receiveMessageContent := receive.RequestBody.Content[0]
	assert.Equal(t, "application/json", receiveMessageContent.MediaType)
	require.NotNil(t, receiveMessageContent.SchemaRef)
	assert.Equal(t, "lightMeasuredPayload", receiveMessageContent.SchemaRef.Name)
	assert.NotEmpty(t, receiveMessageContent.SchemaJSON)
	assert.NotEmpty(t, receiveMessageContent.MockJSON)
	require.Contains(t, receiveMessageContent.Examples, "Nominal twilight reading")
	receiveCloudEventsContent := receive.RequestBody.Content[1]
	assert.Equal(t, "application/cloudevents+json", receiveCloudEventsContent.MediaType)
	require.NotNil(t, receiveCloudEventsContent.SchemaRef)
	assert.Equal(t, "lightMeasuredCloudEventPayload", receiveCloudEventsContent.SchemaRef.Name)
	receiveHydration := buildOperationHydrationPayload(receive, nil)
	require.NotNil(t, receiveHydration)
	require.NotNil(t, receiveHydration.Attributes)
	require.Contains(t, receiveHydration.Attributes, "pp-request-body-content")
	receiveContentJSON := receiveHydration.Attributes["pp-request-body-content"]["content-json"]
	assert.Contains(t, receiveContentJSON, "application/json")
	assert.Contains(t, receiveContentJSON, "application/cloudevents+json")
	assert.Contains(t, receiveContentJSON, "lightMeasuredPayload")
	assert.Contains(t, receiveContentJSON, "lightMeasuredCloudEventPayload")
	assert.Contains(t, receiveContentJSON, "lumens")
	assert.Contains(t, receiveContentJSON, "Nominal twilight reading")
	assert.Contains(t, receiveContentJSON, "mockJson")
	messageHydration := buildModelHydrationPayload(lightMeasuredMessage, nil)
	require.NotNil(t, messageHydration)
	require.NotNil(t, messageHydration.Attributes)
	require.Contains(t, messageHydration.Attributes, "pp-message-content")
	assert.Nil(t, messageHydration.Model)
	messageContentJSON := messageHydration.Attributes["pp-message-content"]["content-json"]
	assert.Contains(t, messageContentJSON, "application/json")
	assert.Contains(t, messageContentJSON, "lightMeasuredPayload")
	assert.Contains(t, messageContentJSON, "Nominal twilight reading")
	assert.Contains(t, messageContentJSON, "mockJson")

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, stats)
	assert.GreaterOrEqual(t, stats.ClassDiagrams, 3)
	indexPath := filepath.Join(outputDir, "index.html")
	assert.FileExists(t, indexPath)
	operationPath := filepath.Join(outputDir, "operations", turnOn.Slug+".html")
	assert.FileExists(t, operationPath)
	assert.FileExists(t, filepath.Join(outputDir, "models", "messages", lightMeasuredMessage.Slug+".html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "messages", lightMeasuredAvroMessage.Slug+".html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "channels", lightTurnOnChannel.Slug+".html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "security", "sasl-scram.html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "replies", "turn-on-accepted.html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "reply-addresses", "reply-to-header.html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "correlation-ids", "streetlight-command.html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "operation-traits", "kafka.html"))
	assert.FileExists(t, filepath.Join(outputDir, "models", "message-traits", "common-headers.html"))
	assert.FileExists(t, filepath.Join(outputDir, "data", "viz", "models", "schemas", "light-measured-payload-diagram.js"))

	indexHTML, err := os.ReadFile(indexPath)
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), "SECURITY")
	assert.Contains(t, string(indexHTML), "saslScram")
	assert.Contains(t, string(indexHTML), "scramSha256")
	assert.Contains(t, string(indexHTML), `<pp-asyncapi-action action="receive" size="small">`)
	assert.Contains(t, string(indexHTML), `<pp-asyncapi-action action="send" size="small">`)

	operationHTML, err := os.ReadFile(operationPath)
	require.NoError(t, err)
	operationRendered := string(operationHTML)
	assert.NotContains(t, operationRendered, "MESSAGE FLOW")
	assert.Contains(t, operationRendered, `id="section-asyncapi" data-nav-label="Channel"`)
	assert.Contains(t, operationRendered, `id="section-request-body" data-nav-label="Message"`)
	assert.Contains(t, operationRendered, "smartylighting.streetlights.1.0.action.{streetlightId}.turn.on")
	assert.Contains(t, operationRendered, "$message.header#/replyTo")
	assert.Contains(t, operationRendered, "turnOnOff")
	assert.Contains(t, operationRendered, `href="models/messages/turn-on-off.html"`)
	assert.Contains(t, operationRendered, `<span class="pp-component-ref"><pb33f-model-icon icon="channels" size="medium"></pb33f-model-icon> <a class="pp-component-ref-link" href="models/channels/lighting-measured.html"><span aria-hidden="true">&#10140;</span> lightingMeasured</a></span>`)
	assert.Contains(t, operationRendered, `<span class="pp-component-ref"><pb33f-model-icon icon="messages" size="medium"></pb33f-model-icon> <a class="pp-component-ref-link" href="models/messages/light-measured.html"><span aria-hidden="true">&#10140;</span> lightMeasured</a></span>`)
	assert.NotContains(t, operationRendered, `<a class="pp-ref-link pp-server-url" href="models/channels/lighting-measured.html">`)
	assert.NotContains(t, operationRendered, `<a class="pp-ref-link pp-security-scope" href="models/messages/light-measured.html">`)
	assert.Contains(t, operationRendered, "SECURITY")
	assert.Contains(t, operationRendered, "saslScram")
	assert.Contains(t, operationRendered, "scramSha256")
	assert.Contains(t, operationRendered, `<pp-asyncapi-protocol protocol="kafka" size="small"></pp-asyncapi-protocol>`)
	assert.Contains(t, operationRendered, `class="pp-asyncapi-meta-row pp-asyncapi-bindings-row"`)

	receiveHTML, err := os.ReadFile(filepath.Join(outputDir, "operations", receive.Slug+".html"))
	require.NoError(t, err)
	receiveRendered := string(receiveHTML)
	assert.Contains(t, receiveRendered, `heading="Receive information about environmental lighting conditions of a streetlight."`)
	assert.NotContains(t, receiveRendered, `<div class="pp-operation-path pp-operation-path-asyncapi">`)
	assert.Contains(t, receiveRendered, `<div class="pp-asyncapi-channel-main">`)
	assert.Contains(t, receiveRendered, `<pp-asyncapi-action action="receive" size="large">`)
	assert.Contains(t, receiveRendered, `<sl-icon name="arrow-left">`)
	assert.Contains(t, receiveRendered, `<span>RCV</span>`)
	assert.Contains(t, receiveRendered, `<pb33f-render-operation-path path="smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured">`)
	assert.NotContains(t, receiveRendered, `<pb33f-render-operation-path path="smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured" nowrap>`)
	assert.Contains(t, receiveRendered, "Receive information about environmental lighting conditions of a streetlight.")
	assert.Contains(t, receiveRendered, `<h3>CHANNEL</h3>`)
	assert.Contains(t, receiveRendered, `href="models/channels/lighting-measured.html"`)
	assert.Contains(t, receiveRendered, `href="models/messages/light-measured.html"`)
	assert.Contains(t, receiveRendered, `href="models/messages/light-measured-avro.html"`)
	assert.Contains(t, receiveRendered, `id="section-request-body" data-nav-label="Messages"`)
	assert.Contains(t, receiveRendered, `<pp-media-type-selector id="pp-request-body-content">`)
	assert.Contains(t, receiveRendered, `class="pp-security pp-dotted-section" id="section-security"`)
	assert.Contains(t, receiveRendered, "Operation Extensions")
	assert.Contains(t, receiveRendered, "telemetry")
	assert.Contains(t, receiveRendered, `class="pp-external-docs pp-dotted-section" id="section-external-docs"`)
	assert.NotContains(t, receiveRendered, `pp-asyncapi-card`)
	assert.NotContains(t, receiveRendered, `pp-asyncapi-field`)

	messageHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "messages", lightMeasuredMessage.Slug+".html"))
	require.NoError(t, err)
	messageRendered := string(messageHTML)
	assert.Contains(t, messageRendered, `id="section-message-content" data-nav-label="Content"`)
	assert.Contains(t, messageRendered, `<pp-media-type-selector id="pp-message-content">`)
	assert.NotContains(t, messageRendered, `id="section-message" data-nav-label="Message"`)
	assert.NotContains(t, messageRendered, `<h3>MESSAGE</h3>`)
	assert.NotContains(t, messageRendered, "Content Type")
	assert.NotContains(t, messageRendered, "Message Examples")
	assert.NotContains(t, messageRendered, `<pp-model-page`)

	parameterHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "parameters", "streetlight-id.html"))
	require.NoError(t, err)
	parameterRendered := string(parameterHTML)
	assert.Contains(t, parameterRendered, `component-type="parameters"`)
	assert.NotContains(t, parameterRendered, `<span class="pp-security-badge">parameter</span>`)

	channelHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "channels", lightTurnOnChannel.Slug+".html"))
	require.NoError(t, err)
	channelRendered := string(channelHTML)
	assert.Contains(t, channelRendered, `id="section-channel" data-nav-label="Channel"`)
	assert.Contains(t, channelRendered, `<pb33f-render-operation-path path="smartylighting.streetlights.1.0.action.{streetlightId}.turn.on">`)
	assert.Contains(t, channelRendered, `<pp-asyncapi-protocol protocol="kafka-secure" size="small"></pp-asyncapi-protocol>`)
	assert.Contains(t, channelRendered, `class="pp-asyncapi-meta-row pp-asyncapi-bindings-row"`)
	assert.Contains(t, channelRendered, `href="models/messages/turn-on-off.html"`)
	assert.NotContains(t, channelRendered, `<span class="pp-security-badge">channel</span>`)
	assert.NotContains(t, channelRendered, `<pp-model-page`)

	securityHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "security", "sasl-scram.html"))
	require.NoError(t, err)
	securityRendered := string(securityHTML)
	assert.Contains(t, securityRendered, `<pp-security-scheme id="pp-model-security-scheme"></pp-security-scheme>`)
	assert.NotContains(t, securityRendered, `class="pp-asyncapi-model"`)
	assert.NotContains(t, securityRendered, `<span class="pp-security-badge">securityScheme</span>`)

	replyHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "replies", "turn-on-accepted.html"))
	require.NoError(t, err)
	replyRendered := string(replyHTML)
	assert.Contains(t, replyRendered, `id="section-reply" data-nav-label="Reply"`)
	assert.Contains(t, replyRendered, `<h3>REPLY</h3>`)
	assert.Contains(t, replyRendered, `<pb33f-render-operation-path path="$message.header#/replyTo">`)
	assert.Contains(t, replyRendered, `<pb33f-model-icon icon="channels" size="medium">`)
	assert.Contains(t, replyRendered, `<pb33f-model-icon icon="messages" size="medium">`)
	assert.Contains(t, replyRendered, `class="pp-component-ref-link"`)
	assert.Contains(t, replyRendered, `href="models/channels/lighting-measured.html"`)
	assert.Contains(t, replyRendered, `href="models/messages/light-measured.html"`)
	assert.Contains(t, replyRendered, `lightMeasured`)
	assert.NotContains(t, replyRendered, `<span class="pp-security-badge">reply</span>`)
	assert.NotContains(t, replyRendered, `pp-security-scope`)
	assert.NotContains(t, replyRendered, `<pp-model-page`)

	replyAddressHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "reply-addresses", "reply-to-header.html"))
	require.NoError(t, err)
	replyAddressRendered := string(replyAddressHTML)
	assert.Contains(t, replyAddressRendered, `id="section-reply-address" data-nav-label="Reply Address"`)
	assert.Contains(t, replyAddressRendered, `<h3>REPLY ADDRESS</h3>`)
	assert.Contains(t, replyAddressRendered, `<span class="pp-asyncapi-meta-label">Address</span>`)
	assert.Contains(t, replyAddressRendered, `<span class="pp-asyncapi-address-value">$message.header#/replyTo</span>`)
	assert.NotContains(t, replyAddressRendered, `<span class="pp-security-badge">replyAddress</span>`)
	assert.NotContains(t, replyAddressRendered, `<div class="pp-server-entry">`)
	assert.NotContains(t, replyAddressRendered, `<pb33f-render-operation-path path="$message.header#/replyTo">`)

	correlationIDHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "correlation-ids", "streetlight-command.html"))
	require.NoError(t, err)
	correlationIDRendered := string(correlationIDHTML)
	assert.Contains(t, correlationIDRendered, `id="section-correlation-id" data-nav-label="Correlation ID"`)
	assert.Contains(t, correlationIDRendered, `<h3>CORRELATION ID</h3>`)
	assert.Contains(t, correlationIDRendered, `<span class="pp-asyncapi-meta-label">Location</span>`)
	assert.Contains(t, correlationIDRendered, `<span class="pp-asyncapi-address-value">$message.header#/correlationId</span>`)
	assert.NotContains(t, correlationIDRendered, `<span class="pp-security-badge">correlationId</span>`)
	assert.NotContains(t, correlationIDRendered, `<div class="pp-server-entry">`)
	assert.NotContains(t, correlationIDRendered, `<pb33f-render-operation-path path="$message.header#/correlationId">`)

	operationTraitHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "operation-traits", "kafka.html"))
	require.NoError(t, err)
	operationTraitRendered := string(operationTraitHTML)
	assert.Contains(t, operationTraitRendered, `<pp-model-page id="pp-model-page" name="kafka" component-type="operationTraits"`)
	assert.Contains(t, operationTraitRendered, `<pp-asyncapi-protocol protocol="kafka" size="large" heading></pp-asyncapi-protocol>`)
	assert.NotContains(t, operationTraitRendered, `<pp-icon-title icon="operationTraits" heading="kafka">`)
	assert.NotContains(t, operationTraitRendered, `<span class="pp-security-badge">operationTrait</span>`)
	assert.NotContains(t, operationTraitRendered, `<div class="pp-server-entry">`)
	assert.NotContains(t, operationTraitRendered, `class="pp-asyncapi-model"`)

	messageTraitHTML, err := os.ReadFile(filepath.Join(outputDir, "models", "message-traits", "common-headers.html"))
	require.NoError(t, err)
	messageTraitRendered := string(messageTraitHTML)
	assert.Contains(t, messageTraitRendered, `<pp-model-page id="pp-model-page" name="commonHeaders" component-type="messageTraits"`)
	assert.NotContains(t, messageTraitRendered, `<span class="pp-security-badge">messageTrait</span>`)
	assert.NotContains(t, messageTraitRendered, `<div class="pp-server-entry">`)
	assert.NotContains(t, messageTraitRendered, `class="pp-asyncapi-model"`)

	navTags := readNavTagsFromOutput(t, outputDir)
	require.NotEmpty(t, navTags)
	assert.Equal(t, "kafka", navTags[0].Name)
	assert.Equal(t, "kafka", navTags[0].Protocol)
	receiveNav := findNavOperationByID(navTags, "receiveLightMeasurement")
	require.NotNil(t, receiveNav)
	assert.Equal(t, "receive", receiveNav.Method)
	assert.Equal(t, "Receive information about environmental lighting conditions of a streetlight.", receiveNav.Summary)
	turnOnNav := findNavOperationByID(navTags, "turnOn")
	require.NotNil(t, turnOnNav)
	assert.Equal(t, "turnOn", turnOnNav.Summary)

	err = PrintJSONArtifacts(site, "")
	require.NoError(t, err)
	bundleBytes, err := os.ReadFile(filepath.Join(outputDir, "bundle.json"))
	require.NoError(t, err)
	var bundle JSONBundle
	require.NoError(t, json.Unmarshal(bundleBytes, &bundle))
	assert.Equal(t, SpecKindAsyncAPI, bundle.SpecKind)
	assert.Equal(t, "3.0.0", bundle.SpecVersion)
	require.NotEmpty(t, bundle.Operations)
	assert.Equal(t, SpecKindAsyncAPI, bundle.Operations[0].SpecKind)
}

func TestCreatePrintingPress_AsyncAPIInlinePayloadDiagram(t *testing.T) {
	spec := []byte(`asyncapi: 3.0.0
info:
  title: Inline payload
  version: 1.0.0
channels: {}
operations: {}
components:
  messages:
    inlineEvent:
      name: inlineEvent
      contentType: application/json
      payload:
        type: object
        properties:
          sentAt:
            $ref: '#/components/schemas/sentAt'
          details:
            type: object
            properties:
              source:
                type: string
  schemas:
    sentAt:
      type: string
      format: date-time
`)
	pp, err := CreatePrintingPressFromBytes(spec, &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "inline-asyncapi.yaml",
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)
	site, err := pp.PressModel()
	require.NoError(t, err)

	message := findModelByName(site.Models["messages"], "inlineEvent")
	require.NotNil(t, message)
	require.NotNil(t, message.AsyncAPI)
	require.Len(t, message.AsyncAPI.Content, 1)
	content := message.AsyncAPI.Content[0]
	assert.Contains(t, content.MermaidDiagram, "class inlineEventPayload")
	assert.Contains(t, content.MermaidDiagram, "inlineEventPayload *-- sentAt : sentAt")
	assert.Contains(t, content.MermaidDiagram, "inlineEventPayload *-- inlineEventPayload_details : details")

	hydration := buildModelHydrationPayload(message, nil)
	require.NotNil(t, hydration)
	assert.Contains(t, hydration.Attributes["pp-message-content"]["content-json"], "mermaidDiagram")
	assert.Equal(t, 1, countClassDiagrams(site))

}

func TestCreatePrintingPress_AsyncAPIMultiFormatPayloads(t *testing.T) {
	spec := []byte(`asyncapi: 3.0.0
info:
  title: Multi format payloads
  version: 1.0.0
channels: {}
operations: {}
components:
  messages:
    avroEvent:
      name: avroEvent
      contentType: application/avro
      payload:
        schemaFormat: application/vnd.apache.avro;version=1.9.0
        schema:
          type: record
          name: Event
          fields:
            - name: id
              type: string
    jsonEvent:
      name: jsonEvent
      contentType: application/json
      payload:
        schemaFormat: application/schema+json
        schema:
          type: object
          properties:
            sentAt:
              $ref: '#/components/schemas/sentAt'
    malformedJsonEvent:
      name: malformedJsonEvent
      contentType: application/json
      payload:
        schemaFormat: application/schema+json
        schema: definitely-not-a-schema
  schemas:
    sentAt:
      type: string
      format: date-time
`)
	pp, err := CreatePrintingPressFromBytes(spec, &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "multi-format-asyncapi.yaml",
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)
	site, err := pp.PressModel()
	require.NoError(t, err)

	avro := findModelByName(site.Models["messages"], "avroEvent")
	require.NotNil(t, avro)
	require.Len(t, avro.AsyncAPI.Content, 1)
	avroContent := avro.AsyncAPI.Content[0]
	assert.Equal(t, "application/vnd.apache.avro;version=1.9.0", avroContent.SchemaFormat)
	assert.Contains(t, avroContent.RawSchemaJSON, `"type": "record"`)
	assert.Contains(t, avroContent.RawSchemaJSON, `"fields"`)
	assert.Empty(t, avroContent.RawSchemaYAML)
	assert.Empty(t, avroContent.SchemaJSON)
	assert.Empty(t, avroContent.MockJSON)
	assert.Empty(t, avroContent.MermaidDiagram)

	jsonMessage := findModelByName(site.Models["messages"], "jsonEvent")
	require.NotNil(t, jsonMessage)
	require.Len(t, jsonMessage.AsyncAPI.Content, 1)
	jsonContent := jsonMessage.AsyncAPI.Content[0]
	assert.Equal(t, "application/schema+json", jsonContent.SchemaFormat)
	assert.Contains(t, jsonContent.SchemaJSON, `"sentAt"`)
	assert.Contains(t, jsonContent.MermaidDiagram, "jsonEventPayload *-- sentAt : sentAt")

	malformed := findModelByName(site.Models["messages"], "malformedJsonEvent")
	require.NotNil(t, malformed)
	require.Len(t, malformed.AsyncAPI.Content, 1)
	malformedContent := malformed.AsyncAPI.Content[0]
	assert.Equal(t, "application/schema+json", malformedContent.SchemaFormat)
	assert.Contains(t, malformedContent.RawSchemaJSON, "definitely-not-a-schema")
	assert.Empty(t, malformedContent.SchemaJSON)
	assert.Empty(t, malformedContent.MockJSON)
	assert.Empty(t, malformedContent.MermaidDiagram)
}

func TestCreatePrintingPress_AsyncAPITaglessOperationsPopulateNav(t *testing.T) {
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(taglessOperationAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		SpecPath:  "asyncapi.yaml",
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site.Root)
	require.Empty(t, site.Root.UntaggedOperations)
	require.Len(t, site.NavTags, 1)
	require.Equal(t, "Operations", site.NavTags[0].Name)
	require.Len(t, site.NavTags[0].Operations, 1)
	assert.Equal(t, SpecKindAsyncAPI, site.NavTags[0].Operations[0].SpecKind)
	assert.Equal(t, "turnOn", site.NavTags[0].Operations[0].OperationID)

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	navTags := readNavTagsFromOutput(t, outputDir)
	require.Len(t, navTags, 1)
	assert.Equal(t, "Operations", navTags[0].Name)
	require.Len(t, navTags[0].Operations, 1)
	assert.Equal(t, "turn-on", navTags[0].Operations[0].Slug)
	assert.Equal(t, "turnOn", navTags[0].Operations[0].Summary)
}

func TestCreatePrintingPress_AsyncAPIDiagnosticsAttachByPath(t *testing.T) {
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(streetlightsAsyncAPISpec(), &PrintingPressConfig{
		BasePath:      t.TempDir(),
		SpecPath:      "streetlights-kafka.yaml",
		OutputDir:     outputDir,
		DeveloperMode: true,
		LintResults: []*drV3.RuleFunctionResult{
			{
				Message:      "message should define examples",
				Path:         "$.operations.turnOn.messages[0]",
				RuleId:       "asyncapi-message-examples",
				RuleSeverity: "warn",
				Rule:         &drV3.Rule{Id: "asyncapi-message-examples", Severity: "warn"},
			},
		},
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site.Diagnostics)
	assert.Equal(t, SpecKindAsyncAPI, site.Diagnostics.SpecKind)
	assert.Equal(t, "AsyncAPI", site.Diagnostics.SpecLabel)
	assert.Equal(t, 1, site.Diagnostics.SiteCounts.Total())
	turnOn := findOperationByID(site.Operations, "turnOn")
	require.NotNil(t, turnOn)
	require.Len(t, turnOn.Problems, 1)
	assert.Equal(t, "message should define examples", turnOn.Problems[0].Message)

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	diagnosticsHTML, err := os.ReadFile(filepath.Join(outputDir, "diagnostics.html"))
	require.NoError(t, err)
	assert.Contains(t, string(diagnosticsHTML), "AsyncAPI contract")
	assert.NotContains(t, string(diagnosticsHTML), "OpenAPI Contract")
}

func TestCreatePrintingPress_AsyncAPIDiagnosticsUseExactPathKeys(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(overlappingAsyncAPISpec(), &PrintingPressConfig{
		BasePath:      t.TempDir(),
		OutputDir:     t.TempDir(),
		DeveloperMode: true,
		LintResults: []*drV3.RuleFunctionResult{
			{
				Message:      "operation should define traits",
				Path:         "$.operations.turnOnOff.messages[0]",
				RuleId:       "asyncapi-operation-traits",
				RuleSeverity: "warn",
				Rule:         &drV3.Rule{Id: "asyncapi-operation-traits", Severity: "warn"},
			},
		},
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	turnOn := findOperationByID(site.Operations, "turnOn")
	require.NotNil(t, turnOn)
	turnOnOff := findOperationByID(site.Operations, "turnOnOff")
	require.NotNil(t, turnOnOff)

	assert.Empty(t, turnOn.Problems)
	require.Len(t, turnOnOff.Problems, 1)
	assert.Equal(t, "operation should define traits", turnOnOff.Problems[0].Message)
}

func TestCreatePrintingPress_AsyncAPIDiagnosticsFallbackToSourceLine(t *testing.T) {
	spec := transitiveAsyncAPISpec()
	line := specLineNumber(spec, "          $ref: '#/components/schemas/schemaC'")
	require.NotZero(t, line)
	pp, err := CreatePrintingPressFromBytes(spec, &PrintingPressConfig{
		BasePath:      t.TempDir(),
		OutputDir:     t.TempDir(),
		DeveloperMode: true,
		LintResults: []*drV3.RuleFunctionResult{
			{
				Message:      "schema should define examples",
				RuleId:       "asyncapi-schema-examples",
				RuleSeverity: "warn",
				Origin:       &index.NodeOrigin{Line: line},
				Rule:         &drV3.Rule{Id: "asyncapi-schema-examples", Severity: "warn"},
			},
		},
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	schemaB := findModelByName(site.Models["schemas"], "schemaB")
	require.NotNil(t, schemaB)
	require.Len(t, schemaB.Problems, 1)
	assert.Equal(t, "schema should define examples", schemaB.Problems[0].Message)
}

func TestCreatePrintingPress_AsyncAPIDiagnosticsUnescapeJSONPointerKeys(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(escapedPointerAsyncAPISpec(), &PrintingPressConfig{
		BasePath:      t.TempDir(),
		OutputDir:     t.TempDir(),
		DeveloperMode: true,
		LintResults: []*drV3.RuleFunctionResult{
			{
				Message:      "message should define examples",
				Path:         "#/components/messages/foo~1bar/payload",
				RuleId:       "asyncapi-message-examples",
				RuleSeverity: "warn",
				Rule:         &drV3.Rule{Id: "asyncapi-message-examples", Severity: "warn"},
			},
		},
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	message := findModelByName(site.Models["messages"], "foo/bar")
	require.NotNil(t, message)
	require.Len(t, message.Problems, 1)
	assert.Equal(t, "message should define examples", message.Problems[0].Message)
}

func TestExtractRefsFromJSON_DecodesJSONPointerTokens(t *testing.T) {
	lookup := map[string]*ppmodel.ModelPage{
		slugpkg.ComponentKey("schemas", "foo/bar~baz"): {
			Name:          "foo/bar~baz",
			ComponentType: "schemas",
			TypeSlug:      "schemas",
			Slug:          "foo-bar-baz",
		},
	}

	refs := extractRefsFromJSON(`{"$ref":"#/components/schemas/foo~1bar~0baz"}`, lookup)

	require.Len(t, refs, 1)
	assert.Equal(t, "foo/bar~baz", refs[0].Name)
}

func TestCreatePrintingPress_AsyncAPIFocusedGraphsIncludeTransitiveModels(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(transitiveAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	schemaA := findModelByName(site.Models["schemas"], "schemaA")
	require.NotNil(t, schemaA)
	require.NotNil(t, schemaA.CrossRefs)
	assert.Contains(t, componentRefNames(schemaA.CrossRefs.UsesModels), "schemaB")
	require.NotEmpty(t, schemaA.GraphJSON)
	assert.Contains(t, schemaA.GraphJSON, "schemaB")
	assert.Contains(t, schemaA.GraphJSON, "schemaC")

	schemaB := findModelByName(site.Models["schemas"], "schemaB")
	require.NotNil(t, schemaB)
	require.NotEmpty(t, schemaB.GraphJSON)
	nodes := parseGraphNodes(t, schemaB.GraphJSON)
	schemaAID := SchemaNodeID("schemas", "schemaA")
	schemaBID := SchemaNodeID("schemas", "schemaB")
	schemaCID := SchemaNodeID("schemas", "schemaC")
	assert.Equal(t, true, nodes[schemaAID]["dependency"], "incoming model referrer should be dimmed")
	_, schemaCDependency := nodes[schemaCID]["dependency"]
	assert.False(t, schemaCDependency, "outgoing model referent should not be dimmed")

	graph := parseGraphResult(t, schemaB.GraphJSON)
	var incomingEdges, outgoingEdges int
	for _, edge := range graph.Edges {
		if len(edge.Sources) != 1 || len(edge.Targets) != 1 {
			continue
		}
		if edge.Sources[0] == schemaAID && edge.Targets[0] == schemaBID {
			incomingEdges++
			assert.True(t, edge.Dependency, "incoming model edge should be dimmed")
		}
		if edge.Sources[0] == schemaBID && edge.Targets[0] == schemaCID {
			outgoingEdges++
			assert.False(t, edge.Dependency, "outgoing model edge should not be dimmed")
		}
	}
	assert.Equal(t, 1, incomingEdges)
	assert.Equal(t, 1, outgoingEdges)
}

func TestCreatePrintingPress_AsyncAPIOperationCrossRefsUseUniqueOperationIdentity(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(sharedOperationSurfaceAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	alpha := findOperationByID(site.Operations, "publishAlpha")
	require.NotNil(t, alpha)
	beta := findOperationByID(site.Operations, "publishBeta")
	require.NotNil(t, beta)

	alphaRefs := componentRefNames(alpha.CrossRefs.ReferencesModels)
	assert.Contains(t, alphaRefs, "alphaMessage")
	assert.NotContains(t, alphaRefs, "betaMessage")
	betaRefs := componentRefNames(beta.CrossRefs.ReferencesModels)
	assert.Contains(t, betaRefs, "betaMessage")
	assert.NotContains(t, betaRefs, "alphaMessage")

	alphaMessage := findModelByName(site.Models["messages"], "alphaMessage")
	require.NotNil(t, alphaMessage)
	assert.Contains(t, operationRefSlugs(alphaMessage.CrossRefs.UsedByOperations), alpha.Slug)
	assert.NotContains(t, operationRefSlugs(alphaMessage.CrossRefs.UsedByOperations), beta.Slug)
	betaMessage := findModelByName(site.Models["messages"], "betaMessage")
	require.NotNil(t, betaMessage)
	assert.Contains(t, operationRefSlugs(betaMessage.CrossRefs.UsedByOperations), beta.Slug)
	assert.NotContains(t, operationRefSlugs(betaMessage.CrossRefs.UsedByOperations), alpha.Slug)
}

func TestCreatePrintingPress_AsyncAPIExplicitEmptySecurityDoesNotInherit(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes(explicitEmptySecurityAsyncAPISpec(), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotEmpty(t, site.Root.Security)
	assert.Equal(t, "saslScram", site.Root.Security[0].Name)

	publicOp := findOperationByID(site.Operations, "publicPing")
	require.NotNil(t, publicOp)
	assert.True(t, publicOp.HasSecurityOverride)
	assert.Empty(t, publicOp.Security)
	assert.NotContains(t, componentRefNames(publicOp.CrossRefs.ReferencesModels), "saslScram")
	securityMD := renderOperationSecurityMD(llmRenderContext{site: site}, publicOp)
	assert.Contains(t, securityMD, "No authentication required.")

	privateOp := findOperationByID(site.Operations, "privatePing")
	require.NotNil(t, privateOp)
	assert.False(t, privateOp.HasSecurityOverride)
	assert.Contains(t, componentRefNames(privateOp.CrossRefs.ReferencesModels), "saslScram")
}

func TestCreatePrintingPress_PrepareEngineConfigRejectsAsyncAPI2BeforeOpenAPIParse(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes([]byte(`asyncapi: 2.6.0
info:
	title: Legacy Events
  version: 1.0.0
`), &PrintingPressConfig{
		BasePath:  t.TempDir(),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	job := pp.activity.startJob(jobTypeModel, "", pp.resolveConfiguredOutputDir(), pp.sourceKind())
	_, err = pp.prepareEngineConfig(job)
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrUnsupportedAsyncAPI2)
}

func TestCreatePrintingPressFromAsyncAPIDocument(t *testing.T) {
	doc, err := libasyncapi.NewDocument(minimalAsyncAPISpec())
	require.NoError(t, err)

	pp, err := CreatePrintingPressFromAsyncAPIDocument(doc, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	assert.Equal(t, sourceKindAsyncAPIDocument, pp.sourceKind())
	job := pp.activity.startJob(jobTypeModel, "", pp.resolveConfiguredOutputDir(), pp.sourceKind())
	cfg, err := pp.prepareEngineConfig(job)
	require.NoError(t, err)
	assert.Equal(t, SpecKindAsyncAPI, cfg.SpecKind)
	assert.Equal(t, "3.0.0", cfg.SpecVersion)
	assert.Same(t, doc, cfg.AsyncDoc)
}

func minimalAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Streetlights
  version: 1.0.0
channels: {}
operations: {}
`)
}

func taglessOperationAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Tagless Operations
  version: 1.0.0
channels:
  turnOn:
    address: lighting.turn.on
    messages:
      turnOn:
        $ref: '#/components/messages/turnOn'
operations:
  turnOn:
    action: send
    channel:
      $ref: '#/channels/turnOn'
    messages:
      - $ref: '#/components/messages/turnOn'
components:
  messages:
    turnOn:
      payload:
        type: object
        properties:
          command:
            type: string
`)
}

func overlappingAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Overlapping Operations
  version: 1.0.0
channels:
  turnChannel:
    address: lighting.turn
    messages:
      - $ref: '#/components/messages/turnMessage'
operations:
  turnOn:
    action: send
    channel:
      $ref: '#/channels/turnChannel'
    messages:
      - $ref: '#/components/messages/turnMessage'
  turnOnOff:
    action: send
    channel:
      $ref: '#/channels/turnChannel'
    messages:
      - $ref: '#/components/messages/turnMessage'
components:
  messages:
    turnMessage:
      payload:
        type: object
        properties:
          state:
            type: string
`)
}

func transitiveAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Transitive Events
  version: 1.0.0
channels:
  schemaChannel:
    address: schema.events
    messages:
      - $ref: '#/components/messages/schemaMessage'
operations:
  publishSchema:
    action: send
    channel:
      $ref: '#/channels/schemaChannel'
    messages:
      - $ref: '#/components/messages/schemaMessage'
components:
  messages:
    schemaMessage:
      payload:
        $ref: '#/components/schemas/schemaA'
  schemas:
    schemaA:
      type: object
      properties:
        b:
          $ref: '#/components/schemas/schemaB'
    schemaB:
      type: object
      properties:
        c:
          $ref: '#/components/schemas/schemaC'
    schemaC:
      type: object
      properties:
        id:
          type: string
`)
}

func escapedPointerAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Escaped Pointer Events
  version: 1.0.0
channels:
  escaped:
    address: escaped.events
    messages:
      - $ref: '#/components/messages/foo~1bar'
operations:
  publishEscaped:
    action: send
    channel:
      $ref: '#/channels/escaped'
    messages:
      - $ref: '#/components/messages/foo~1bar'
components:
  messages:
    foo/bar:
      payload:
        type: object
        properties:
          id:
            type: string
`)
}

func sharedOperationSurfaceAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Shared Surface Events
  version: 1.0.0
channels:
  shared:
    address: shared.events
    messages:
      - $ref: '#/components/messages/alphaMessage'
      - $ref: '#/components/messages/betaMessage'
operations:
  publishAlpha:
    action: send
    channel:
      $ref: '#/channels/shared'
    messages:
      - $ref: '#/components/messages/alphaMessage'
  publishBeta:
    action: send
    channel:
      $ref: '#/channels/shared'
    messages:
      - $ref: '#/components/messages/betaMessage'
components:
  messages:
    alphaMessage:
      payload:
        type: object
        properties:
          alpha:
            type: string
    betaMessage:
      payload:
        type: object
        properties:
          beta:
            type: string
`)
}

func explicitEmptySecurityAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Security Override Events
  version: 1.0.0
servers:
  secure:
    host: broker.example.com
    protocol: kafka-secure
    security:
      - $ref: '#/components/securitySchemes/saslScram'
channels:
  pings:
    address: ping.events
    messages:
      - $ref: '#/components/messages/pingMessage'
operations:
  publicPing:
    action: send
    channel:
      $ref: '#/channels/pings'
    security: []
    messages:
      - $ref: '#/components/messages/pingMessage'
  privatePing:
    action: send
    channel:
      $ref: '#/channels/pings'
    messages:
      - $ref: '#/components/messages/pingMessage'
components:
  messages:
    pingMessage:
      payload:
        type: object
        properties:
          id:
            type: string
  securitySchemes:
    saslScram:
      type: scramSha256
      description: SASL/SCRAM authentication
`)
}

func asyncAPIServerProtocolSpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Provider Protocols
  version: 1.0.0
  tags:
    - name: nats
    - name: googlepubsub
servers:
  nats-main:
    host: nats.example.com
    protocol: nats
channels:
  natsEvents:
    address: events.nats
    messages:
      event:
        $ref: '#/components/messages/event'
  pubsubEvents:
    address: projects/example/topics/events
    servers:
      - $ref: '#/components/servers/pubsub-main'
    messages:
      event:
        $ref: '#/components/messages/event'
operations:
  receiveNatsEvent:
    action: receive
    channel:
      $ref: '#/channels/natsEvents'
    tags:
      - name: nats
    bindings:
      pulsar: {}
    messages:
      - $ref: '#/components/messages/event'
  sendPubSubEvent:
    action: send
    channel:
      $ref: '#/channels/pubsubEvents'
    tags:
      - name: googlepubsub
    messages:
      - $ref: '#/components/messages/event'
components:
  servers:
    pubsub-main:
      host: pubsub.googleapis.com
      protocol: googlepubsub
  messages:
    event:
      contentType: application/json
      bindings:
        sns: {}
      payload:
        type: object
        properties:
          id:
            type: string
`)
}

func streetlightsAsyncAPISpec() []byte {
	return []byte(`asyncapi: 3.0.0
info:
  title: Streetlights Kafka API
  version: 1.0.0
  description: The Smartylighting Streetlights API allows you to remotely manage the city lights.
  contact:
    name: API Support
    url: https://www.asyncapi.org/support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  tags:
    - name: streetlights
      description: Streetlight related operations
    - name: kafka
      description: Kafka specific

defaultContentType: application/json

servers:
  scram-connections:
    host: test.mykafkacluster.org:18092
    protocol: kafka-secure
    description: Test broker secured with SASL/SCRAM
    security:
      - $ref: '#/components/securitySchemes/saslScram'
    tags:
      - name: env:test-scram
        description: This environment is a SCRAM test broker
    bindings:
      kafka:
        schemaRegistryUrl: https://my-schema-registry.com
        schemaRegistryVendor: confluent
        bindingVersion: 0.4.0

channels:
  lightingMeasured:
    address: smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured
    messages:
      lightMeasured:
        $ref: '#/components/messages/lightMeasured'
      lightMeasuredAvro:
        $ref: '#/components/messages/lightMeasuredAvro'
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    bindings:
      kafka:
        topic: streetlights-lighting
        partitions: 3
        replicas: 2
        bindingVersion: 0.4.0
    x-channel-tier: telemetry

  lightTurnOn:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.on
    messages:
      turnOn:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'

  lightTurnOff:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.off
    messages:
      turnOff:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'

operations:
  receiveLightMeasurement:
    action: receive
    channel:
      $ref: '#/channels/lightingMeasured'
    summary: Receive information about environmental lighting conditions of a streetlight.
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightingMeasured/messages/lightMeasured'
      - $ref: '#/channels/lightingMeasured/messages/lightMeasuredAvro'
    externalDocs:
      description: Streetlight telemetry guide
      url: https://example.com/docs/streetlights/telemetry
    x-operation-tier: telemetry
    x-owner: city-lighting-platform

  turnOn:
    action: send
    channel:
      $ref: '#/channels/lightTurnOn'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    security:
      - $ref: '#/components/securitySchemes/saslScram'
    messages:
      - $ref: '#/channels/lightTurnOn/messages/turnOn'
    reply:
      $ref: '#/components/replies/turnOnAccepted'

  turnOff:
    action: send
    channel:
      $ref: '#/components/channels/lightTurnOffComponent'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/components/channels/lightTurnOffComponent/messages/turnOff'

components:
  channels:
    lightTurnOffComponent:
      address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.off
      messages:
        turnOff:
          $ref: '#/components/messages/turnOnOff'
      parameters:
        streetlightId:
          $ref: '#/components/parameters/streetlightId'

  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions for a particular streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredPayload'
      examples:
        - name: Nominal twilight reading
          summary: A normal light measurement received during twilight.
          headers:
            my-app-header: 42
            correlationId: light-evt-0001
          payload:
            lumens: 1200
            sentAt: '2026-07-09T12:00:00Z'
            sensorId: sensor-a7
        - name: Low light alert
          summary: A measurement that falls below the city threshold.
          headers:
            my-app-header: 7
            correlationId: light-evt-0002
          payload:
            lumens: 12
            sentAt: '2026-07-09T12:05:00Z'
            sensorId: sensor-a7
      x-message-family: telemetry

    lightMeasuredAvro:
      name: lightMeasuredAvro
      title: Light measured CloudEvent
      summary: Inform about environmental lighting conditions using the CloudEvents envelope.
      contentType: application/cloudevents+json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredCloudEventPayload'
      examples:
        - name: CloudEvents measurement
          summary: A measured light event wrapped in CloudEvents fields.
          headers:
            my-app-header: 88
          payload:
            specversion: '1.0'
            type: io.pb33f.streetlights.light.measured
            source: smartylighting.streetlights
            id: evt-9000
            time: '2026-07-09T12:00:00Z'
            data:
              lumens: 1200
              sentAt: '2026-07-09T12:00:00Z'
              sensorId: sensor-a7
      x-message-family: telemetry

    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn on or off.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/turnOnOffPayload'
      examples:
        - name: Turn on
          summary: Ask a streetlight to turn on.
          headers:
            my-app-header: 11
            replyTo: smartylighting.streetlights.1.0.reply.commands
            correlationId: cmd-0001
          payload:
            command: on
            sentAt: '2026-07-09T12:10:00Z'
        - name: Turn off
          summary: Ask a streetlight to turn off.
          headers:
            my-app-header: 12
            replyTo: smartylighting.streetlights.1.0.reply.commands
            correlationId: cmd-0002
          payload:
            command: off
            sentAt: '2026-07-09T12:20:00Z'

  schemas:
    lightMeasuredPayload:
      type: object
      required:
        - lumens
        - sentAt
        - sensorId
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: '#/components/schemas/sentAt'
        sensorId:
          type: string
          description: Identifier of the reporting streetlight sensor.
      examples:
        - lumens: 1200
          sentAt: '2026-07-09T12:00:00Z'
          sensorId: sensor-a7

    lightMeasuredCloudEventPayload:
      type: object
      required:
        - specversion
        - type
        - source
        - id
        - data
      properties:
        specversion:
          type: string
          const: '1.0'
        type:
          type: string
          examples:
            - io.pb33f.streetlights.light.measured
        source:
          type: string
        id:
          type: string
        time:
          $ref: '#/components/schemas/sentAt'
        data:
          $ref: '#/components/schemas/lightMeasuredPayload'

    turnOnOffPayload:
      type: object
      required:
        - command
        - sentAt
      properties:
        command:
          type: string
          enum:
            - on
            - off
          description: Whether to turn on or off the light.
        sentAt:
          $ref: '#/components/schemas/sentAt'

    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.

  securitySchemes:
    saslScram:
      type: scramSha256
      description: Provide your username and password for SASL/SCRAM authentication

  parameters:
    streetlightId:
      description: The ID of the streetlight.
      examples:
        - '1'
        - '2'
        - '100'

  replies:
    turnOnAccepted:
      address:
        $ref: '#/components/replyAddresses/replyToHeader'
      channel:
        $ref: '#/channels/lightingMeasured'
      messages:
        - $ref: '#/channels/lightingMeasured/messages/lightMeasured'

  replyAddresses:
    replyToHeader:
      location: $message.header#/replyTo
      description: Reply-to header supplied by the command producer.

  correlationIds:
    streetlightCommand:
      location: $message.header#/correlationId
      description: Correlates command replies with the original command message.

  operationTraits:
    kafka:
      tags:
        - name: kafka
      security:
        - $ref: '#/components/securitySchemes/saslScram'
      bindings:
        kafka:
          groupId:
            type: string
            description: Consumer group ID
          clientId:
            type: string
            description: Client ID
          bindingVersion: 0.4.0

  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
`)
}

func findOperationByID(operations []*ppmodel.OperationPage, operationID string) *ppmodel.OperationPage {
	for _, operation := range operations {
		if operation != nil && operation.OperationID == operationID {
			return operation
		}
	}
	return nil
}

func findNavOperationByID(tags []*ppmodel.NavTag, operationID string) *ppmodel.NavOperation {
	for _, tag := range tags {
		if tag == nil {
			continue
		}
		for _, operation := range tag.Operations {
			if operation != nil && operation.OperationID == operationID {
				return operation
			}
		}
		if operation := findNavOperationByID(tag.Children, operationID); operation != nil {
			return operation
		}
	}
	return nil
}

func readNavTagsFromOutput(t *testing.T, outputDir string) []*ppmodel.NavTag {
	t.Helper()

	navBytes, err := os.ReadFile(filepath.Join(outputDir, "data", "nav.js"))
	require.NoError(t, err)
	navPayload := strings.TrimPrefix(string(navBytes), "globalThis.__PP_SHARED_DATA__ = ")
	navPayload = strings.TrimSuffix(strings.TrimSpace(navPayload), ";")
	var shared struct {
		Attributes map[string]map[string]string `json:"attributes"`
	}
	require.NoError(t, json.Unmarshal([]byte(navPayload), &shared))
	navJSON := shared.Attributes["pp-nav"]["data-nav"]
	require.NotEmpty(t, navJSON)
	require.NotEqual(t, "null", navJSON)

	var navTags []*ppmodel.NavTag
	require.NoError(t, json.Unmarshal([]byte(navJSON), &navTags))
	return navTags
}

func findModelByName(models []*ppmodel.ModelPage, name string) *ppmodel.ModelPage {
	for _, model := range models {
		if model != nil && model.Name == name {
			return model
		}
	}
	return nil
}

func componentRefNames(refs []*ppmodel.ComponentRef) []string {
	names := make([]string, 0, len(refs))
	for _, ref := range refs {
		if ref == nil {
			continue
		}
		names = append(names, ref.Name)
	}
	return names
}

func operationRefSlugs(refs []*ppmodel.OperationRef) []string {
	slugs := make([]string, 0, len(refs))
	for _, ref := range refs {
		if ref == nil {
			continue
		}
		slugs = append(slugs, ref.Slug)
	}
	return slugs
}

func specLineNumber(spec []byte, needle string) int {
	for idx, line := range strings.Split(string(spec), "\n") {
		if line == needle {
			return idx + 1
		}
	}
	return 0
}

func TestCreatePrintingPress_BundlingFallbackWarningExposed(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "test-relative", "spec.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	originalBundle := bundleBytesWithOrigins
	bundleBytesWithOrigins = func(specBytes []byte, configuration *datamodel.DocumentConfiguration, compositionConfig *bundler.BundleCompositionConfig) (*bundler.BundleResult, error) {
		assert.True(t, configuration.ExcludeExtensionRefs)
		return nil, errors.New("forced bundle failure")
	}
	defer func() {
		bundleBytesWithOrigins = originalBundle
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotEmpty(t, site.Warnings)
	assert.Contains(t, site.Warnings[0].Message, "source bundling failed")
	require.Error(t, site.Warnings[0].Err)

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotEmpty(t, stats.Warnings)
	assert.Contains(t, stats.Warnings[0].Message, "source bundling failed")
	require.Error(t, stats.Warnings[0].Err)

	indexHTML, err := os.ReadFile(filepath.Join(pp.config.OutputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), "forced bundle failure")
}

func TestCreatePrintingPress_BundlingFallbackStillUsesConfiguredDocumentSettings(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "test-relative", "spec.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	originalBundle := bundleBytesWithOrigins
	bundleBytesWithOrigins = func(specBytes []byte, configuration *datamodel.DocumentConfiguration, compositionConfig *bundler.BundleCompositionConfig) (*bundler.BundleResult, error) {
		return nil, errors.New("forced bundle failure")
	}
	defer func() {
		bundleBytesWithOrigins = originalBundle
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	require.NotEmpty(t, site.Operations)
	require.NotEmpty(t, site.Models["schemas"])
	require.NotEmpty(t, site.Warnings)
	assert.Contains(t, site.Warnings[0].Message, "source bundling failed")
}

func TestCreatePrintingPress_JSONBundleIncludesBundlingFallbackWarning(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "test-relative", "spec.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	originalBundle := bundleBytesWithOrigins
	bundleBytesWithOrigins = func(specBytes []byte, configuration *datamodel.DocumentConfiguration, compositionConfig *bundler.BundleCompositionConfig) (*bundler.BundleResult, error) {
		return nil, errors.New("forced bundle failure")
	}
	defer func() {
		bundleBytesWithOrigins = originalBundle
	}()

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)

	err = PrintJSONArtifacts(site, "")
	require.NoError(t, err)

	bundleJSON, err := os.ReadFile(filepath.Join(outputDir, "bundle.json"))
	require.NoError(t, err)

	var bundle JSONBundle
	require.NoError(t, json.Unmarshal(bundleJSON, &bundle))
	require.NotEmpty(t, bundle.Warnings)
	assert.Contains(t, bundle.Warnings[0].Message, "source bundling failed")
	assert.Contains(t, bundle.Warnings[0].Error, "forced bundle failure")
}

func TestCreatePrintingPress_SingleFileSpecSkipsBundling(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	originalBundle := bundleBytesWithOrigins
	bundleCalled := false
	bundleBytesWithOrigins = func(specBytes []byte, configuration *datamodel.DocumentConfiguration, compositionConfig *bundler.BundleCompositionConfig) (*bundler.BundleResult, error) {
		bundleCalled = true
		return nil, errors.New("forced bundle failure")
	}
	defer func() {
		bundleBytesWithOrigins = originalBundle
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	assert.False(t, bundleCalled)
	assert.Empty(t, site.Warnings)
}

func TestCreatePrintingPress_PressModelMutationsAffectLaterPrints(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site.Root)

	site.Root.Title = "Mutated Burger Shop"

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.True(t, strings.Contains(string(indexHTML), "Mutated Burger Shop"))
}

func TestCreatePrintingPressFromV3Model(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)
	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	pp, err := CreatePrintingPressFromV3Model(v3Model, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.True(t, pp.modelBuilt)
	require.NotNil(t, site)
	require.NotNil(t, site.Root)
	require.Same(t, site, pp.site)
}

func TestCreatePrintingPress_ValidationAggregatesIssues(t *testing.T) {
	_, err := CreatePrintingPressFromBytes(nil, &PrintingPressConfig{
		BasePath: "/definitely/not/a/real/path",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.Len(t, validationErr.Issues, 2)
	assert.ErrorIs(t, err, ErrNoSourceInput)
	assert.ErrorIs(t, err, ErrInvalidBasePath)
}

func TestCreatePrintingPress_ValidationRejectsInvalidAssetMode(t *testing.T) {
	_, err := CreatePrintingPressFromBytes([]byte("openapi: 3.1.0\ninfo:\n  title: x\n  version: 1\npaths: {}\n"), &PrintingPressConfig{
		AssetMode: "wat",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.Contains(t, validationErr.Error(), "asset mode")
}

func TestCreatePrintingPress_ValidationRejectsURLBasePath(t *testing.T) {
	_, err := CreatePrintingPressFromBytes([]byte("openapi: 3.1.0\ninfo:\n  title: x\n  version: 1\npaths: {}\n"), &PrintingPressConfig{
		BasePath: "https://example.com/specs",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.ErrorIs(t, err, ErrInvalidBasePath)
	assert.Contains(t, validationErr.Error(), "basePath")
	assert.Contains(t, validationErr.Error(), "must be a local directory")
}

func TestCreatePrintingPress_ValidationRejectsInvalidLLMMonolithMode(t *testing.T) {
	_, err := CreatePrintingPressFromBytes([]byte("openapi: 3.1.0\ninfo:\n  title: x\n  version: 1\npaths: {}\n"), &PrintingPressConfig{
		LLMGenerateMonoliths: "sometimes",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.Contains(t, validationErr.Error(), "llmGenerateMonoliths")
	assert.Contains(t, validationErr.Error(), "invalid LLM monolith mode")
}

func TestCreatePrintingPress_NormalizesLLMOutputOptions(t *testing.T) {
	pp, err := CreatePrintingPressFromBytes([]byte("openapi: 3.1.0\ninfo:\n  title: x\n  version: 1\npaths: {}\n"), &PrintingPressConfig{
		LLMAggregateSpecSizeThresholdBytes: 1024,
		LLMMaxAggregateFileBytes:           2048,
		LLMGenerateMonoliths:               "ALWAYS",
		OutputDir:                          t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	assert.Equal(t, int64(1024), site.LLM.AggregateSpecSizeThresholdBytes)
	assert.Equal(t, int64(2048), site.LLM.MaxAggregateFileBytes)
	assert.Equal(t, LLMGenerateMonolithsAlways, site.LLM.GenerateMonoliths)
	assert.Greater(t, site.SourceSizeBytes, int64(0))
}

func TestCreatePrintingPress_ValidationRejectsRelativeBaseURL(t *testing.T) {
	_, err := CreatePrintingPressFromBytes([]byte("openapi: 3.1.0\ninfo:\n  title: x\n  version: 1\npaths: {}\n"), &PrintingPressConfig{
		BaseURL: "docs",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.ErrorIs(t, err, ErrInvalidBaseURL)
	assert.Contains(t, validationErr.Error(), "baseURL")
	assert.Contains(t, validationErr.Error(), "absolute path starting with '/' or an absolute URL with scheme and host")
}
