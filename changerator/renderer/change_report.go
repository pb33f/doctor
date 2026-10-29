package renderer

import (
	asyncModel "github.com/pb33f/libasyncapi/what-changed/model"
	"github.com/pb33f/libopenapi/what-changed/model"
	"strings"
)

// renderChangeReport shares the existing summary, statistics and per-change
// formatting with engines whose native document tree is not OpenAPI-shaped.
func renderChangeReport(input *RenderInput) string {
	r := &MarkdownReporter{changeReport: input.ChangeReport, config: input.Config, rightDocContent: input.RightDocContent, deduplicatedChanges: input.DeduplicatedChanges}
	if r.config == nil {
		r.config = DefaultRenderConfig()
	}
	if r.deduplicatedChanges == nil {
		r.deduplicatedChanges = input.ChangeReport.GetAllChanges()
	}
	var report strings.Builder
	report.WriteString("# What Changed Report\n\n")
	r.generateSummary(&report)
	report.WriteString("## Change Breakdown\n\n")
	path := ""
	for _, ch := range r.deduplicatedChanges {
		if ch.Path != path {
			path = ch.Path
			report.WriteString("\n### " + pathCodeSpan(path) + "\n\n")
		}
		r.renderChange(&report, ch)
	}
	return report.String()
}

// pathCodeSpan keeps user-controlled identifiers literal, including backticks.
func pathCodeSpan(path string) string {
	longest, run := 0, 0
	for _, c := range path {
		if c == '`' {
			run++
			if run > longest {
				longest = run
			}
		} else {
			run = 0
		}
	}
	fence := strings.Repeat("`", longest+1)
	return fence + " " + strings.NewReplacer("\n", " ", "\r", " ").Replace(path) + " " + fence
}

func renderInputMarkdown(input *RenderInput) (string, error) {
	if input == nil {
		return "", ErrInvalidInput
	}
	if input.ChangeReport != nil {
		if native, ok := input.ChangeReport.(*asyncModel.DocumentChanges); ok {
			return renderAsyncAPIReport(input, native), nil
		}
		if native, ok := input.ChangeReport.(*model.DocumentChanges); ok {
			return MarkdownReport(native, input.Doctor, input.RightDocContent, input.Config, input.DeduplicatedChanges).Generate(), nil
		}
		return renderChangeReport(input), nil
	}
	if input.DocumentChanges == nil {
		return "# What Changed?\n\nNo changes detected between the API versions.\n\n", nil
	}
	return MarkdownReport(input.DocumentChanges, input.Doctor, input.RightDocContent, input.Config, input.DeduplicatedChanges).Generate(), nil
}
