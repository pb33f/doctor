// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"bytes"
	"errors"
	"log/slog"
	"path/filepath"
	"strings"
	"testing"
	"time"

	tea "charm.land/bubbletea/v2"
	"github.com/pb33f/doctor/printingpress"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/require"
)

func TestProgressModelAdvancesAcrossCompletedStages(t *testing.T) {
	model := newProgressModel(PaletteForTheme(ThemeDark), 3)

	updated, _ := model.Update(progressUpdateMsg{stage: "html", status: "running", percent: 0.9, task: "rendering"})
	model = updated.(progressModel)
	runningPercent := model.percent

	updated, _ = model.Update(progressUpdateMsg{stage: "html", status: "completed", elapsed: 850 * time.Millisecond})
	model = updated.(progressModel)
	completedPercent := model.percent

	updated, _ = model.Update(progressUpdateMsg{stage: "llm", status: "running", percent: 0.08, task: "writing llm docs"})
	model = updated.(progressModel)

	require.Greater(t, completedPercent, runningPercent)
	require.Greater(t, model.percent, completedPercent)
	require.Equal(t, 1, model.completedStages)
	require.Equal(t, "LLM", model.stage)
}

func TestProgressModelLabelsHTMLAsPrintingHTML(t *testing.T) {
	model := newProgressModel(PaletteForTheme(ThemeDark), 1)

	updated, _ := model.Update(progressUpdateMsg{stage: "html", status: "running", percent: 0.25, task: "preparing model pages"})
	model = updated.(progressModel)

	require.Equal(t, "PRINTING HTML", model.stage)
	require.Contains(t, model.View().Content, "PRINTING HTML")
}

func TestBuildStageCountIncludesDiagnosticsAndJsonOnlyModelStage(t *testing.T) {
	total := BuildStageCount(OutputSelection{JSON: true, Diagnostics: true})
	require.Equal(t, 3, total)
}

func TestSelectActivityRenderModeDebugOverridesFallback(t *testing.T) {
	mode := SelectActivityRenderMode(&bytes.Buffer{}, true)
	require.Equal(t, ActivityRenderModeDebug, mode)
}

func TestDebugActivityRendererLogsLiveUpdates(t *testing.T) {
	var output bytes.Buffer
	palette := PaletteForTheme(ThemeDark)
	logger := NewPrettyLogger(&PrettyHandlerOptions{
		Level:      slog.LevelDebug,
		TimeFormat: TimeFormatTimeOnly,
		Writer:     &output,
		Palette:    &palette,
	})

	renderer := newDebugActivityRenderer(logger)
	renderer.UpdateManual("json", "writing json artifacts", "running", 0.2, 0, nil)
	renderer.UpdateManual("json", "json artifacts complete", "completed", 1, 125*time.Millisecond, nil)

	require.Contains(t, output.String(), "writing json artifacts")
	require.Contains(t, output.String(), "JSON complete")
	require.Contains(t, output.String(), "percent")
}

func TestAggregatePoolModelViewRendersRuntimeMetrics(t *testing.T) {
	model := newAggregatePoolModel(PaletteForTheme(ThemeDark))

	updated, _ := model.Update(aggregateRuntimeMetricsMsg{snapshot: RuntimeMetricsSnapshot{
		Elapsed:    2 * time.Second,
		HeapAlloc:  64 * 1024,
		TotalAlloc: 256 * 1024,
		Sys:        128 * 1024,
		NumGC:      3,
		Goroutines: 9,
	}})
	model = updated.(aggregatePoolModel)

	view := model.View().Content
	require.Contains(t, view, "elapsed 2s")
	require.Contains(t, view, "heap 64.0 KiB")
	require.Contains(t, view, "reserved 128.0 KiB")
	require.Contains(t, view, "collections 3")
	require.Contains(t, view, "threads 9")
}

func TestAggregatePoolPlainRendererReportsRuntimeMetrics(t *testing.T) {
	var out bytes.Buffer
	renderer := &aggregatePoolPlainRenderer{
		writer: &out,
		last:   make(map[int]aggregatePoolView),
	}

	renderer.ReportRuntimeMetrics(RuntimeMetricsSnapshot{
		Elapsed:    1500 * time.Millisecond,
		HeapAlloc:  1024,
		TotalAlloc: 2048,
		Sys:        4096,
		NumGC:      1,
		Goroutines: 4,
	})

	output := out.String()
	require.True(t, strings.HasPrefix(output, " "), "expected aggregate plain output to keep a left gutter")
	require.Contains(t, output, "METRICS")
	require.Contains(t, output, "elapsed 1.5s")
	require.Contains(t, output, "heap 1.0 KiB")
	require.Contains(t, output, "threads 4")
}

func TestFormatRuntimeMetrics(t *testing.T) {
	formatted := FormatRuntimeMetrics(RuntimeMetricsSnapshot{
		Elapsed:    2500 * time.Millisecond,
		HeapAlloc:  2 * 1024 * 1024,
		TotalAlloc: 8 * 1024 * 1024,
		Sys:        16 * 1024 * 1024,
		NumGC:      5,
		Goroutines: 12,
	})

	require.Contains(t, formatted, "elapsed 2.5s")
	require.Contains(t, formatted, "heap 2.0 MiB")
	require.Contains(t, formatted, "reserved 16.0 MiB")
	require.Contains(t, formatted, "allocated 8.0 MiB")
	require.Contains(t, formatted, "collections 5")
	require.Contains(t, formatted, "threads 12")
}

func TestPrintSummaryRendersStatsAndWarnings(t *testing.T) {
	var stdout bytes.Buffer
	outputDir := filepath.Join(t.TempDir(), "site")
	site := &ppmodel.Site{
		OutputDir: outputDir,
		Models: map[string][]*ppmodel.ModelPage{
			"schemas": {{Name: "Burger", MermaidDiagram: "graph TD", GraphJSON: "{}"}},
		},
		Operations: []*ppmodel.OperationPage{{OperationID: "listBurgers"}},
		Warnings: []*ppmodel.BuildWarning{{
			Message: "source bundling failed; falling back to single-file parse, multi-file output may be incomplete",
			Context: "/tmp/specs",
			Err:     errors.New("invalid model\ninfinite circular reference detected: payment_intent"),
		}},
	}
	htmlStats := &printingpress.PressStatistics{
		Pages:            2676,
		Models:           2183,
		Operations:       324,
		ClassDiagrams:    1385,
		DependencyGraphs: 2087,
	}
	llmStats := &printingpress.PressStatistics{Pages: 4}

	PrintSummary(&stdout, PaletteForTheme(ThemeDark), site, htmlStats, llmStats, 992*time.Millisecond, 13708, 2058*1024)

	output := stdout.String()
	require.True(t, strings.HasPrefix(output, " "), "expected summary output to keep a left gutter")
	require.True(t, strings.HasSuffix(output, "\n\n"), "expected summary output to leave a blank line before the shell prompt")
	require.Contains(t, output, "\n output")
	require.Contains(t, output, "render complete")
	require.Contains(t, output, outputDir)
	require.Contains(t, output, "2,676")
	require.Contains(t, output, "2,183")
	require.Contains(t, output, "1,385")
	require.Contains(t, output, "2,087")
	require.Contains(t, output, "13,708 files, 2.0 MiB")
	require.Contains(t, output, "warnings (1)")
	require.Contains(t, output, "infinite circular reference detected: payment_intent")
	require.Contains(t, output, "├─")
	require.Contains(t, output, "└─")
}

func TestFormatCountUsesThousandsSeparators(t *testing.T) {
	require.Equal(t, "0", FormatCount(0))
	require.Equal(t, "999", FormatCount(999))
	require.Equal(t, "1,000", FormatCount(1000))
	require.Equal(t, "1,234,567", FormatCount(1234567))
	require.Equal(t, "-12,345", FormatCount(-12345))
}

func TestSplitViewLinesUsesTeaViewContent(t *testing.T) {
	lines := splitViewLines(tea.NewView("one\ntwo"))
	require.Equal(t, []string{"one", "two"}, lines)
}

func TestAggregatePoolModelViewUsesGradientProgressBar(t *testing.T) {
	model := newAggregatePoolModel(PaletteForTheme(ThemeDark))

	updated, _ := model.Update(aggregatePoolUpdateMsg{update: printingpress.AggregateProgressUpdate{
		PoolID:         1,
		Status:         printingpress.AggregateProgressStatusRunning,
		CompletedSpecs: 2,
		TotalSpecs:     5,
		CompletedBytes: 256,
		TotalBytes:     1024,
		CurrentSpec:    "APIs/example.com/v1/openapi.yaml",
		CurrentStage:   "building model",
		OverallPercent: 0.42,
	}})
	model = updated.(aggregatePoolModel)

	view := model.View().Content
	require.Contains(t, view, "POOL 1")
	require.Contains(t, view, "42%")
	require.Contains(t, view, "APIs/example.com/v1/openapi.yaml")
	require.True(t, strings.Contains(view, "\x1b["), "expected ANSI-styled gradient bar output")
}
