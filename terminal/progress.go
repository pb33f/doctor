// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"strings"
	"sync"
	"time"

	"charm.land/bubbles/v2/progress"
	"charm.land/bubbles/v2/spinner"
	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
	"github.com/charmbracelet/x/term"
	"github.com/pb33f/doctor/printingpress"
)

// ActivityRenderMode controls how printing press activity is presented.
type ActivityRenderMode int

const (
	ActivityRenderModePlain ActivityRenderMode = iota
	ActivityRenderModeProgress
	ActivityRenderModeDebug
)

// ActivityRenderer renders single-spec printing press progress.
type ActivityRenderer interface {
	RenderActivity(sub *printingpress.ActivitySubscription)
	UpdateManual(stage, task, status string, percent float64, elapsed time.Duration, err error)
	Close()
}

// OutputSelection describes which output stages a build will run.
type OutputSelection struct {
	HTML        bool
	LLM         bool
	JSON        bool
	Diagnostics bool
}

type buildProgressUI struct {
	writer      io.Writer
	interactive bool
	model       progressModel
	live        *ansiLiveRenderer
	stop        chan struct{}
	mu          sync.Mutex
	closed      bool
	closeOnce   sync.Once
}

type progressUpdateMsg struct {
	stage   string
	task    string
	status  string
	percent float64
	elapsed time.Duration
	error   string
}

type progressQuitMsg struct{}

type progressModel struct {
	spinner         spinner.Model
	bar             progress.Model
	titleStyle      lipgloss.Style
	taskStyle       lipgloss.Style
	errorStyle      lipgloss.Style
	mutedStyle      lipgloss.Style
	totalStages     int
	completed       map[string]bool
	stage           string
	stagePercent    float64
	task            string
	percent         float64
	failed          bool
	errorText       string
	quitting        bool
	completedStages int
}

type plainActivityRenderer struct {
	writer io.Writer
}

type debugActivityRenderer struct {
	logger *slog.Logger
}

func SelectActivityRenderMode(writer io.Writer, debug bool) ActivityRenderMode {
	if debug {
		return ActivityRenderModeDebug
	}
	if supportsInteractiveProgress(writer) {
		return ActivityRenderModeProgress
	}
	return ActivityRenderModePlain
}

func NewActivityRenderer(mode ActivityRenderMode, writer io.Writer, palette Palette, totalStages int, logger *slog.Logger) ActivityRenderer {
	switch mode {
	case ActivityRenderModeDebug:
		return newDebugActivityRenderer(logger)
	case ActivityRenderModeProgress:
		return newBuildProgressUI(writer, palette, totalStages)
	default:
		return &plainActivityRenderer{writer: writer}
	}
}

func newBuildProgressUI(writer io.Writer, palette Palette, totalStages int) *buildProgressUI {
	ui := &buildProgressUI{
		writer: writer,
		live:   newANSILiveRenderer(writer),
		stop:   make(chan struct{}),
	}
	if totalStages < 1 {
		totalStages = 1
	}
	if !supportsInteractiveProgress(writer) {
		return ui
	}

	ui.model = newProgressModel(palette, totalStages)
	ui.interactive = true
	ui.startSpinner()
	return ui
}

func newProgressModel(palette Palette, totalStages int) progressModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = styleWithForeground(palette.Secondary).Bold(true)

	return progressModel{
		spinner:     s,
		bar:         newGradientProgressBar(palette, 38),
		titleStyle:  styleWithForeground(palette.Primary).Bold(true),
		taskStyle:   styleWithForeground(palette.Detail),
		errorStyle:  styleWithForeground(palette.Breaking).Bold(true),
		mutedStyle:  styleWithForeground(palette.Muted),
		totalStages: totalStages,
		completed:   make(map[string]bool),
		task:        "warming up printing press",
	}
}

func newGradientProgressBar(palette Palette, width int) progress.Model {
	start, end := progressRamp(palette.Theme)
	return progress.New(
		progress.WithWidth(width),
		progress.WithColors(lipgloss.Color(start), lipgloss.Color(end)),
		progress.WithScaled(true),
		progress.WithFillCharacters('█', '░'),
	)
}

func progressRamp(theme ThemeName) (string, string) {
	switch theme {
	case ThemeLight:
		return "#606060", "#ffffff"
	case ThemeTektronix:
		return "#33ff33", "#66ff66"
	default:
		return "#62c4ff", "#f83aff"
	}
}

func supportsInteractiveProgress(writer io.Writer) bool {
	file, ok := writer.(*os.File)
	if !ok {
		return false
	}
	if os.Getenv("TERM") == "dumb" {
		return false
	}
	if !term.IsTerminal(file.Fd()) {
		return false
	}
	return true
}

func (ui *buildProgressUI) RenderActivity(sub *printingpress.ActivitySubscription) {
	if sub == nil {
		return
	}
	if !ui.interactive {
		renderActivityFallback(ui.writer, sub)
		return
	}
	for update := range sub.Updates() {
		ui.applyMsg(progressUpdateMsg{
			stage:   update.JobType,
			task:    update.CurrentTask,
			status:  update.Status,
			percent: stagePercent(update),
			elapsed: update.Elapsed,
			error:   update.Error,
		})
	}
}

func (ui *buildProgressUI) UpdateManual(stage, task, status string, percent float64, elapsed time.Duration, err error) {
	if !ui.interactive {
		if status == "completed" {
			fmt.Fprintln(ui.writer, withPrintingPressGutter(FormatStatusLine(stage, fmt.Sprintf("completed in %s", RoundDuration(elapsed)))))
			return
		}
		fmt.Fprintln(ui.writer, withPrintingPressGutter(FormatStatusLine(stage, task)))
		return
	}
	msg := progressUpdateMsg{
		stage:   stage,
		task:    task,
		status:  status,
		percent: clampPercent(percent),
		elapsed: elapsed,
	}
	if err != nil {
		msg.error = err.Error()
	}
	ui.applyMsg(msg)
}

func (ui *buildProgressUI) Close() {
	ui.closeOnce.Do(func() {
		if !ui.interactive {
			return
		}
		ui.mu.Lock()
		ui.closed = true
		ui.mu.Unlock()
		close(ui.stop)
		ui.live.close()
	})
}

func (ui *buildProgressUI) applyMsg(msg tea.Msg) {
	if !ui.interactive {
		return
	}
	ui.mu.Lock()
	defer ui.mu.Unlock()
	if ui.closed {
		return
	}
	updated, _ := ui.model.Update(msg)
	ui.model = updated.(progressModel)
	ui.live.render(withPrintingPressGutterLines(splitViewLines(ui.model.View())))
}

func (ui *buildProgressUI) startSpinner() {
	if !ui.interactive {
		return
	}
	interval := ui.model.spinner.Spinner.FPS
	if interval <= 0 {
		interval = 100 * time.Millisecond
	}
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			select {
			case <-ui.stop:
				return
			case <-ticker.C:
				ui.tickSpinner()
			}
		}
	}()
}

func (ui *buildProgressUI) tickSpinner() {
	ui.mu.Lock()
	defer ui.mu.Unlock()
	if ui.closed {
		return
	}
	updated, _ := ui.model.Update(ui.model.spinner.Tick())
	ui.model = updated.(progressModel)
	ui.live.render(withPrintingPressGutterLines(splitViewLines(ui.model.View())))
}

func enqueueLatest[T any](queue chan T, value T) bool {
	select {
	case queue <- value:
		return true
	default:
	}

	select {
	case <-queue:
	default:
	}

	select {
	case queue <- value:
		return true
	default:
		return false
	}
}

func (r *plainActivityRenderer) RenderActivity(sub *printingpress.ActivitySubscription) {
	if sub == nil {
		return
	}
	renderActivityFallback(r.writer, sub)
}

func (r *plainActivityRenderer) UpdateManual(stage, task, status string, elapsedPercent float64, elapsed time.Duration, err error) {
	if status == "completed" {
		fmt.Fprintln(r.writer, withPrintingPressGutter(FormatStatusLine(stage, fmt.Sprintf("completed in %s", RoundDuration(elapsed)))))
		return
	}
	fmt.Fprintln(r.writer, withPrintingPressGutter(FormatStatusLine(stage, task)))
}

func (r *plainActivityRenderer) Close() {}

func newDebugActivityRenderer(logger *slog.Logger) *debugActivityRenderer {
	if logger == nil {
		logger = slog.Default()
	}
	return &debugActivityRenderer{logger: logger}
}

func (r *debugActivityRenderer) RenderActivity(sub *printingpress.ActivitySubscription) {
	if sub == nil {
		return
	}
	for update := range sub.Updates() {
		r.logActivity(update.JobType, update.CurrentTask, update.Status, update.CompletedTasks, update.TotalTasks, update.PercentComplete/100, update.Elapsed, update.Error)
	}
}

func (r *debugActivityRenderer) UpdateManual(stage, task, status string, percent float64, elapsed time.Duration, err error) {
	errorText := ""
	if err != nil {
		errorText = err.Error()
	}
	r.logActivity(stage, task, status, 0, 0, percent, elapsed, errorText)
}

func (r *debugActivityRenderer) Close() {}

func (r *debugActivityRenderer) logActivity(stage, task, status string, completed, total int64, percent float64, elapsed time.Duration, errorText string) {
	if r == nil || r.logger == nil {
		return
	}
	stageLabel := strings.ToUpper(strings.TrimSpace(stage))
	if stageLabel == "" {
		stageLabel = "BUILD"
	}
	message := task
	if strings.TrimSpace(message) == "" {
		message = strings.ToLower(stageLabel)
	}
	attrs := []any{
		"stage", stageLabel,
		"status", status,
	}
	if total > 0 {
		attrs = append(attrs,
			"completed", completed,
			"total", total,
			"percent", fmt.Sprintf("%.0f%%", clampPercent(percent)*100),
		)
	} else if percent > 0 {
		attrs = append(attrs, "percent", fmt.Sprintf("%.0f%%", clampPercent(percent)*100))
	}
	if elapsed > 0 {
		attrs = append(attrs, "elapsed", RoundDuration(elapsed).String())
	}
	if errorText != "" {
		attrs = append(attrs, "error", errorText)
	}
	switch status {
	case "completed":
		r.logger.Log(context.Background(), LevelSuccess, stageLabel+" complete", attrs...)
	case "failed":
		r.logger.Warn(stageLabel+" failed", attrs...)
	default:
		r.logger.Info(message, attrs...)
	}
}

func renderActivityFallback(writer io.Writer, sub *printingpress.ActivitySubscription) {
	printed := false
	lastLen := 0
	for update := range sub.Updates() {
		line := FormatActivity(update)
		if line == "" {
			continue
		}
		line = withPrintingPressGutter(line)
		padding := ""
		if diff := lastLen - len(line); diff > 0 {
			padding = strings.Repeat(" ", diff)
		}
		fmt.Fprintf(writer, "\r%s%s", line, padding)
		printed = true
		lastLen = len(line)
	}
	if printed {
		fmt.Fprintln(writer)
	}
}

func stagePercent(update printingpress.ActivityUpdate) float64 {
	if update.Status == "completed" {
		return 1
	}
	if update.TotalTasks > 0 {
		return clampPercent(update.PercentComplete / 100)
	}
	if update.Status == "running" {
		return 0.08
	}
	return 0
}

func clampPercent(p float64) float64 {
	if p < 0 {
		return 0
	}
	if p > 1 {
		return 1
	}
	return p
}

func BuildStageCount(selection OutputSelection) int {
	total := 0
	if selection.Diagnostics {
		total++
	}
	if selection.HTML {
		total++
	}
	if selection.LLM {
		total++
	}
	if selection.JSON {
		total++
		if !selection.HTML && !selection.LLM {
			total++
		}
	}
	if total == 0 {
		return 1
	}
	return total
}

func (m progressModel) Init() tea.Cmd {
	return m.spinner.Tick
}

func (m progressModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		if m.quitting {
			return m, nil
		}
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	case progress.FrameMsg:
		var cmd tea.Cmd
		m.bar, cmd = m.bar.Update(msg)
		return m, cmd
	case progressUpdateMsg:
		stage := progressStageTitle(msg.stage)
		if stage == "" {
			stage = "BUILD"
		}
		stageChanged := m.stage != "" && m.stage != stage
		m.stage = stage
		m.task = msg.task
		if m.task == "" {
			m.task = strings.ToLower(m.stage)
		}
		if msg.status == "failed" {
			m.failed = true
			m.errorText = msg.error
		}
		stagePercent := clampPercent(msg.percent)
		if msg.status == "completed" {
			if !m.completed[msg.stage] {
				m.completed[msg.stage] = true
				m.completedStages++
			}
			m.task = fmt.Sprintf("completed in %s", RoundDuration(msg.elapsed))
			m.stagePercent = 0
		} else if msg.status == "failed" {
			m.stagePercent = 0
		} else {
			if stageChanged {
				m.stagePercent = 0
			}
			if stagePercent > m.stagePercent {
				m.stagePercent = stagePercent
			}
		}
		nextPercent := clampPercent((float64(m.completedStages) + m.stagePercent) / float64(m.totalStages))
		if nextPercent < m.percent {
			nextPercent = m.percent
		}
		m.percent = nextPercent
		cmd := m.bar.SetPercent(m.percent)
		return m, cmd
	case progressQuitMsg:
		m.quitting = true
		return m, tea.Quit
	}
	return m, nil
}

func (m progressModel) View() tea.View {
	if m.quitting {
		return tea.NewView("")
	}
	headline := fmt.Sprintf("%s %s", m.spinner.View(), m.titleStyle.Render(m.stage))
	if m.failed {
		headline = fmt.Sprintf("%s %s", m.spinner.View(), m.errorStyle.Render(m.stage+" failed"))
	}
	task := m.taskStyle.Render(m.task)
	if m.failed && m.errorText != "" {
		task = m.errorStyle.Render(m.errorText)
	}
	meta := m.mutedStyle.Render(fmt.Sprintf("%d/%d stages", m.completedStages, m.totalStages))
	return tea.NewView(fmt.Sprintf("%s\n%s %s\n%s", headline, m.bar.ViewAs(m.percent), meta, task))
}

func progressStageTitle(stage string) string {
	switch strings.ToLower(strings.TrimSpace(stage)) {
	case "html":
		return "PRINTING HTML"
	default:
		return strings.ToUpper(strings.TrimSpace(stage))
	}
}
