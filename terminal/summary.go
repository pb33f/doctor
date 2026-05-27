// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"image/color"
	"io"
	"strings"
	"time"

	lipgloss "charm.land/lipgloss/v2"
	"github.com/pb33f/doctor/printingpress"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type summaryRow struct {
	key   string
	value string
}

const (
	summaryTreeBranch = "├─"
	summaryTreeCorner = "└─"
	summaryTreePipe   = "│ "
	summaryTreeSpace  = "  "
)

func PrintSummary(writer io.Writer, palette Palette, site *ppmodel.Site, htmlStats, llmStats *printingpress.PressStatistics, totalDuration time.Duration, fileCount int, totalBytes int64) {
	if writer == nil {
		return
	}
	defer fmt.Fprintln(writer)
	titleStyle := styleWithForeground(palette.Primary).Bold(true)

	fmt.Fprintln(writer, withPrintingPressGutter(titleStyle.Render("render complete")))
	fmt.Fprintln(writer)
	fmt.Fprintln(writer, withPrintingPressGutterBlock(renderStatsSummary(palette, buildSummaryRows(site, htmlStats, llmStats, totalDuration, fileCount, totalBytes))))

	if site == nil || len(site.Warnings) == 0 {
		return
	}

	fmt.Fprintln(writer)
	fmt.Fprintln(writer, withPrintingPressGutterBlock(renderWarningsSummary(palette, site.Warnings)))
}

func PrintAggregateSummary(writer io.Writer, palette Palette, catalog *ppmodel.CatalogSite, htmlStats, jsonStats, llmStats *printingpress.AggregatePressStatistics, totalDuration time.Duration, fileCount int, totalBytes int64) {
	if writer == nil {
		return
	}
	defer fmt.Fprintln(writer)
	titleStyle := styleWithForeground(palette.Primary).Bold(true)

	fmt.Fprintln(writer, withPrintingPressGutter(titleStyle.Render("render complete")))
	fmt.Fprintln(writer)
	fmt.Fprintln(writer, withPrintingPressGutterBlock(renderStatsSummary(palette, buildAggregateSummaryRows(catalog, htmlStats, jsonStats, llmStats, totalDuration, fileCount, totalBytes))))

	if catalog == nil || len(catalog.Warnings) == 0 {
		return
	}

	fmt.Fprintln(writer)
	fmt.Fprintln(writer, withPrintingPressGutterBlock(renderWarningsSummary(palette, catalog.Warnings)))
}

func buildSummaryRows(site *ppmodel.Site, htmlStats, llmStats *printingpress.PressStatistics, totalDuration time.Duration, fileCount int, totalBytes int64) []summaryRow {
	contentStats := htmlStats
	if contentStats == nil {
		contentStats = llmStats
	}

	pageCount := 0
	if contentStats != nil {
		pageCount = contentStats.Pages
	}

	modelCount := 0
	operationCount := 0
	classDiagramCount := 0
	dependencyDiagramCount := 0
	warningCount := 0
	errorCount := 0
	outputDir := ""
	if site != nil {
		outputDir = site.OutputDir
		modelCount = countModels(site)
		operationCount = len(site.Operations) + len(site.Webhooks)
		classDiagramCount = countClassDiagrams(site)
		dependencyDiagramCount = countDependencyGraphs(site)
		warningCount = len(site.Warnings)
		errorCount = countWarningErrors(site.Warnings)
	}
	if contentStats != nil {
		if contentStats.Models > 0 {
			modelCount = contentStats.Models
		}
		if contentStats.Operations > 0 {
			operationCount = contentStats.Operations
		}
		if contentStats.ClassDiagrams > 0 {
			classDiagramCount = contentStats.ClassDiagrams
		}
		if contentStats.DependencyGraphs > 0 {
			dependencyDiagramCount = contentStats.DependencyGraphs
		}
	}

	return []summaryRow{
		{key: "output", value: outputDir},
		{key: "pages", value: FormatCount(pageCount)},
		{key: "operations", value: FormatCount(operationCount)},
		{key: "models", value: FormatCount(modelCount)},
		{key: "class diagrams", value: FormatCount(classDiagramCount)},
		{key: "dependency diagrams", value: FormatCount(dependencyDiagramCount)},
		{key: "runtime", value: RoundDuration(totalDuration).String()},
		{key: "disk usage", value: fmt.Sprintf("%s files, %s", FormatCount(fileCount), HumanBytes(totalBytes))},
		{key: "warnings", value: FormatCount(warningCount)},
		{key: "errors", value: FormatCount(errorCount)},
	}
}

func renderStatsSummary(palette Palette, rows []summaryRow) string {
	keyStyle := styleWithForeground(palette.Muted)
	valueStyle := styleWithForeground(palette.Detail).Bold(true)

	keyWidth := 0
	for _, row := range rows {
		if len(row.key) > keyWidth {
			keyWidth = len(row.key)
		}
	}

	var b strings.Builder
	for i, row := range rows {
		if i > 0 {
			b.WriteByte('\n')
		}
		b.WriteString(keyStyle.Render(fmt.Sprintf("%-*s", keyWidth, row.key)))
		b.WriteString("  ")
		b.WriteString(valueStyle.Render(row.value))
	}
	return b.String()
}

func buildAggregateSummaryRows(catalog *ppmodel.CatalogSite, htmlStats, jsonStats, llmStats *printingpress.AggregatePressStatistics, totalDuration time.Duration, fileCount int, totalBytes int64) []summaryRow {
	stats := firstAggregateStats(htmlStats, jsonStats, llmStats)

	outputDir := ""
	services := 0
	versions := 0
	specs := 0
	changedSpecs := 0
	poolsUsed := 0
	warningCount := 0
	errorCount := 0
	buildMode := ""

	if catalog != nil {
		outputDir = catalog.OutputDir
		warningCount = len(catalog.Warnings)
		errorCount = countWarningErrors(catalog.Warnings)
	}
	if stats != nil {
		services = stats.Services
		versions = stats.Versions
		specs = stats.Specs
		changedSpecs = stats.ChangedSpecs
		poolsUsed = stats.PoolsUsed
		buildMode = stats.BuildMode
	} else if catalog != nil {
		services = len(catalog.Services)
		for _, service := range catalog.Services {
			if service == nil {
				continue
			}
			versions += len(service.Versions)
			specs += service.SpecCount
		}
	}

	rows := []summaryRow{
		{key: "output", value: outputDir},
		{key: "services", value: FormatCount(services)},
		{key: "versions", value: FormatCount(versions)},
		{key: "specs", value: FormatCount(specs)},
	}
	if changedSpecs > 0 || buildMode != "" {
		rows = append(rows, summaryRow{key: "changed specs", value: FormatCount(changedSpecs)})
	}
	if poolsUsed > 0 {
		rows = append(rows, summaryRow{key: "render pools", value: FormatCount(poolsUsed)})
	}
	if buildMode != "" {
		rows = append(rows, summaryRow{key: "build mode", value: buildMode})
	}
	rows = append(rows,
		summaryRow{key: "runtime", value: RoundDuration(totalDuration).String()},
		summaryRow{key: "disk usage", value: fmt.Sprintf("%s files, %s", FormatCount(fileCount), HumanBytes(totalBytes))},
		summaryRow{key: "warnings", value: FormatCount(warningCount)},
		summaryRow{key: "errors", value: FormatCount(errorCount)},
	)
	return rows
}

func firstAggregateStats(stats ...*printingpress.AggregatePressStatistics) *printingpress.AggregatePressStatistics {
	for _, stat := range stats {
		if stat != nil {
			return stat
		}
	}
	return nil
}

func countModels(site *ppmodel.Site) int {
	if site == nil {
		return 0
	}
	total := 0
	for _, pages := range site.Models {
		total += len(pages)
	}
	return total
}

func countClassDiagrams(site *ppmodel.Site) int {
	total := 0
	for _, pages := range site.Models {
		for _, page := range pages {
			if page.MermaidDiagram != "" {
				total++
			}
		}
	}
	return total
}

func countDependencyGraphs(site *ppmodel.Site) int {
	total := 0
	for _, pages := range site.Models {
		for _, page := range pages {
			if page.GraphJSON != "" {
				total++
			}
		}
	}
	return total
}

func countWarningErrors(warnings []*ppmodel.BuildWarning) int {
	total := 0
	for _, warning := range warnings {
		if warning != nil && warning.Err != nil {
			total++
		}
	}
	return total
}

func renderWarningsSummary(palette Palette, warnings []*ppmodel.BuildWarning) string {
	titleStyle := styleWithForeground(palette.Modification).Bold(true)
	badgeStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("0")).
		Background(summaryColorValue(palette.Modification, "11")).
		Padding(0, 1)

	blocks := make([]string, 0, len(warnings))
	for _, warning := range warnings {
		if warning == nil {
			continue
		}
		blocks = append(blocks, renderWarningBlock(palette, badgeStyle, warning))
	}
	if len(blocks) == 0 {
		return ""
	}

	return titleStyle.Render(fmt.Sprintf("warnings (%d)", len(blocks))) + "\n\n" + strings.Join(blocks, "\n\n")
}

func renderWarningBlock(palette Palette, badgeStyle lipgloss.Style, warning *ppmodel.BuildWarning) string {
	messageStyle := styleWithForeground(palette.Modification)
	keyStyle := lipgloss.NewStyle().Bold(true)
	valueStyle := styleWithForeground(palette.Modification)
	treeStyle := styleWithForeground(palette.Muted)

	var b strings.Builder
	b.WriteString(fmt.Sprintf("%s %s\n", badgeStyle.Render("WRN"), messageStyle.Render(warning.Message)))

	type attr struct {
		key   string
		value string
	}
	attrs := make([]attr, 0, 2)
	if warning.Context != "" {
		attrs = append(attrs, attr{key: "context", value: warning.Context})
	}
	if warning.Err != nil {
		attrs = append(attrs, attr{key: "error", value: warning.Err.Error()})
	}

	for i, item := range attrs {
		lines := splitWarningLines(item.value)
		if len(lines) == 0 {
			continue
		}
		isLast := i == len(attrs)-1
		connector := summaryTreeBranch
		childPrefix := summaryTreePipe
		if isLast {
			connector = summaryTreeCorner
			childPrefix = summaryTreeSpace
		}
		b.WriteString(treeStyle.Render(connector))
		b.WriteString(" ")
		b.WriteString(keyStyle.Render(item.key))
		b.WriteString(": ")
		b.WriteString(valueStyle.Render(lines[0]))
		b.WriteByte('\n')
		for _, line := range lines[1:] {
			b.WriteString(treeStyle.Render(childPrefix))
			b.WriteString("  ")
			b.WriteString(valueStyle.Render(line))
			b.WriteByte('\n')
		}
	}

	return strings.TrimRight(b.String(), "\n")
}

func splitWarningLines(value string) []string {
	parts := strings.Split(strings.TrimSpace(value), "\n")
	lines := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		lines = append(lines, trimmed)
	}
	return lines
}

func summaryColorValue(c color.Color, fallback string) color.Color {
	if c != nil {
		return c
	}
	return lipgloss.Color(fallback)
}
