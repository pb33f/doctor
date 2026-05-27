// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"io"
	"log/slog"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"charm.land/bubbles/v2/progress"
	"github.com/pb33f/doctor/printingpress"

	"charm.land/bubbles/v2/spinner"
	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
)

// AggregatePoolRenderer renders aggregate printing press pool progress.
type AggregatePoolRenderer interface {
	Report(update printingpress.AggregateProgressUpdate)
	ReportRuntimeMetrics(snapshot RuntimeMetricsSnapshot)
	Close()
}

type aggregatePoolProgressUI struct {
	writer      io.Writer
	interactive bool
	model       aggregatePoolModel
	live        *ansiLiveRenderer
	stop        chan struct{}
	mu          sync.Mutex
	closed      bool
	closeOnce   sync.Once
}

type aggregatePoolUpdateMsg struct {
	update printingpress.AggregateProgressUpdate
}

type aggregateRuntimeMetricsMsg struct {
	snapshot RuntimeMetricsSnapshot
}

type aggregatePoolQuitMsg struct{}

type aggregatePoolModel struct {
	spinner    spinner.Model
	bar        progress.Model
	titleStyle lipgloss.Style
	poolStyle  lipgloss.Style
	taskStyle  lipgloss.Style
	errorStyle lipgloss.Style
	mutedStyle lipgloss.Style
	pools      map[int]aggregatePoolView
	order      []int
	metrics    *RuntimeMetricsSnapshot
	quitting   bool
}

type aggregatePoolView struct {
	id             int
	label          string
	status         string
	completedSpecs int
	totalSpecs     int
	completedBytes int64
	totalBytes     int64
	currentSpec    string
	lastSpec       string
	currentStage   string
	currentPercent float64
	overallPercent float64
	errorText      string
}

type aggregatePoolPlainRenderer struct {
	writer io.Writer
	mu     sync.Mutex
	last   map[int]aggregatePoolView
}

type aggregatePoolDebugRenderer struct {
	logger *slog.Logger
	mu     sync.Mutex
	last   map[int]aggregatePoolView
}

func NewAggregatePoolRenderer(mode ActivityRenderMode, writer io.Writer, palette Palette, logger *slog.Logger) AggregatePoolRenderer {
	switch mode {
	case ActivityRenderModeDebug:
		return &aggregatePoolDebugRenderer{
			logger: logger,
			last:   make(map[int]aggregatePoolView),
		}
	case ActivityRenderModeProgress:
		return newAggregatePoolProgressUI(writer, palette)
	default:
		return &aggregatePoolPlainRenderer{
			writer: writer,
			last:   make(map[int]aggregatePoolView),
		}
	}
}

func newAggregatePoolProgressUI(writer io.Writer, palette Palette) *aggregatePoolProgressUI {
	ui := &aggregatePoolProgressUI{
		writer: writer,
		live:   newANSILiveRenderer(writer),
		stop:   make(chan struct{}),
	}
	if !supportsInteractiveProgress(writer) {
		return ui
	}

	ui.model = newAggregatePoolModel(palette)
	ui.interactive = true
	ui.startSpinner()
	return ui
}

func newAggregatePoolModel(palette Palette) aggregatePoolModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = styleWithForeground(palette.Secondary).Bold(true)

	return aggregatePoolModel{
		spinner:    s,
		bar:        newGradientProgressBar(palette, 38),
		titleStyle: styleWithForeground(palette.Primary).Bold(true),
		poolStyle:  styleWithForeground(palette.Secondary).Bold(true),
		taskStyle:  styleWithForeground(palette.Detail),
		errorStyle: styleWithForeground(palette.Breaking).Bold(true),
		mutedStyle: styleWithForeground(palette.Muted),
		pools:      make(map[int]aggregatePoolView),
	}
}

func (ui *aggregatePoolProgressUI) Report(update printingpress.AggregateProgressUpdate) {
	if !ui.interactive {
		return
	}
	ui.applyMsg(aggregatePoolUpdateMsg{update: update})
}

func (ui *aggregatePoolProgressUI) ReportRuntimeMetrics(snapshot RuntimeMetricsSnapshot) {
	if !ui.interactive {
		return
	}
	ui.applyMsg(aggregateRuntimeMetricsMsg{snapshot: snapshot})
}

func (ui *aggregatePoolProgressUI) applyMsg(msg tea.Msg) {
	if !ui.interactive {
		return
	}
	ui.mu.Lock()
	defer ui.mu.Unlock()
	if ui.closed {
		return
	}
	updated, _ := ui.model.Update(msg)
	ui.model = updated.(aggregatePoolModel)
	ui.live.render(withPrintingPressGutterLines(splitViewLines(ui.model.View())))
}

func (ui *aggregatePoolProgressUI) Close() {
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

func (ui *aggregatePoolProgressUI) startSpinner() {
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

func (ui *aggregatePoolProgressUI) tickSpinner() {
	ui.mu.Lock()
	defer ui.mu.Unlock()
	if ui.closed {
		return
	}
	updated, _ := ui.model.Update(ui.model.spinner.Tick())
	ui.model = updated.(aggregatePoolModel)
	ui.live.render(withPrintingPressGutterLines(splitViewLines(ui.model.View())))
}

func (m aggregatePoolModel) Init() tea.Cmd {
	return m.spinner.Tick
}

func (m aggregatePoolModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		if m.quitting {
			return m, nil
		}
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	case aggregatePoolUpdateMsg:
		update := msg.update
		pool := m.pools[update.PoolID]
		if pool.id == 0 {
			pool.id = update.PoolID
			pool.label = poolLabel(update)
			m.order = append(m.order, update.PoolID)
		}
		pool.status = update.Status
		pool.completedSpecs = update.CompletedSpecs
		pool.totalSpecs = update.TotalSpecs
		pool.completedBytes = update.CompletedBytes
		pool.totalBytes = update.TotalBytes
		pool.currentSpec = update.CurrentSpec
		pool.lastSpec = update.LastSpec
		pool.currentStage = update.CurrentStage
		pool.currentPercent = clampPercent(update.CurrentPercent)
		pool.overallPercent = clampPercent(update.OverallPercent)
		pool.errorText = update.Error
		m.pools[update.PoolID] = pool
		return m, nil
	case aggregateRuntimeMetricsMsg:
		snapshot := msg.snapshot
		m.metrics = &snapshot
		return m, nil
	case aggregatePoolQuitMsg:
		m.quitting = true
		return m, tea.Quit
	}
	return m, nil
}

func (m aggregatePoolModel) View() tea.View {
	if m.quitting {
		return tea.NewView("")
	}
	headline := fmt.Sprintf("%s %s", m.spinner.View(), m.titleStyle.Render("Rendering Specs"))
	lines := []string{headline}
	if m.metrics != nil {
		lines = append(lines, m.mutedStyle.Render(FormatRuntimeMetrics(*m.metrics)))
	}
	if len(m.order) == 0 {
		lines = append(lines, m.mutedStyle.Render("waiting for render pools"))
		return tea.NewView(strings.Join(lines, "\n"))
	}

	for _, id := range m.order {
		pool := m.pools[id]
		meta := fmt.Sprintf("%d/%d specs · %s/%s", pool.completedSpecs, pool.totalSpecs, HumanBytes(pool.completedBytes), HumanBytes(pool.totalBytes))
		lines = append(lines, fmt.Sprintf("%s %s", m.poolStyle.Render(pool.label), m.mutedStyle.Render(meta)))
		lines = append(lines, fmt.Sprintf("%s %s", m.bar.ViewAs(pool.overallPercent), renderAggregateTask(pool, m.taskStyle, m.errorStyle, m.mutedStyle)))
	}
	return tea.NewView(strings.Join(lines, "\n"))
}

func renderAggregateTask(pool aggregatePoolView, taskStyle, errorStyle, mutedStyle lipgloss.Style) string {
	task := aggregatePoolTask(pool)
	if pool.status == printingpress.AggregateProgressStatusSkipped && pool.errorText != "" {
		return errorStyle.Render(task + " · " + pool.errorText)
	}
	if pool.status == printingpress.AggregateProgressStatusSkipped {
		return errorStyle.Render(task)
	}
	if pool.status == printingpress.AggregateProgressStatusCompleted && pool.completedSpecs == pool.totalSpecs {
		return mutedStyle.Render(task)
	}
	return taskStyle.Render(task)
}

func aggregatePoolTask(pool aggregatePoolView) string {
	switch pool.status {
	case printingpress.AggregateProgressStatusQueued:
		return "waiting for work"
	case printingpress.AggregateProgressStatusCompleted:
		if pool.completedSpecs == pool.totalSpecs {
			return "pool complete"
		}
		return fmt.Sprintf("completed %s", aggregatePoolSpecLabel(pool.lastSpec))
	case printingpress.AggregateProgressStatusSkipped:
		return fmt.Sprintf("skipped %s", aggregatePoolSpecLabel(pool.lastSpec))
	default:
		spec := aggregatePoolSpecLabel(pool.currentSpec)
		if spec == "" {
			spec = aggregatePoolSpecLabel(pool.lastSpec)
		}
		stage := strings.TrimSpace(pool.currentStage)
		if spec == "" && stage == "" {
			return "running"
		}
		if spec == "" {
			return stage
		}
		if stage == "" {
			return spec
		}
		return spec + " · " + stage
	}
}

func aggregatePoolSpecLabel(path string) string {
	path = strings.TrimSpace(path)
	if path == "" {
		return ""
	}
	return filepath.ToSlash(path)
}

func poolLabel(update printingpress.AggregateProgressUpdate) string {
	if strings.TrimSpace(update.PoolLabel) != "" {
		return strings.ToUpper(strings.ReplaceAll(update.PoolLabel, "-", " "))
	}
	if update.PoolID > 0 {
		return fmt.Sprintf("POOL %d", update.PoolID)
	}
	return "POOL"
}

func (r *aggregatePoolPlainRenderer) Report(update printingpress.AggregateProgressUpdate) {
	r.mu.Lock()
	defer r.mu.Unlock()

	next := aggregatePoolViewFromUpdate(update)
	prev, ok := r.last[update.PoolID]
	if ok && !shouldLogAggregatePoolUpdate(prev, next) {
		r.last[update.PoolID] = next
		return
	}
	r.last[update.PoolID] = next
	fmt.Fprintln(r.writer, withPrintingPressGutter(FormatStatusLine(poolLabel(update), aggregatePoolLogMessage(next))))
}

func (r *aggregatePoolPlainRenderer) ReportRuntimeMetrics(snapshot RuntimeMetricsSnapshot) {
	r.mu.Lock()
	defer r.mu.Unlock()

	fmt.Fprintln(r.writer, withPrintingPressGutter(FormatStatusLine("METRICS", FormatRuntimeMetrics(snapshot))))
}

func (r *aggregatePoolPlainRenderer) Close() {}

func (r *aggregatePoolDebugRenderer) Report(update printingpress.AggregateProgressUpdate) {
	r.mu.Lock()
	defer r.mu.Unlock()

	next := aggregatePoolViewFromUpdate(update)
	prev, ok := r.last[update.PoolID]
	if ok && !shouldLogAggregatePoolUpdate(prev, next) {
		r.last[update.PoolID] = next
		return
	}
	r.last[update.PoolID] = next
	if r.logger == nil {
		return
	}

	attrs := []any{
		"pool", update.PoolID,
		"status", update.Status,
		"completed_specs", update.CompletedSpecs,
		"total_specs", update.TotalSpecs,
		"completed_bytes", HumanBytes(update.CompletedBytes),
		"total_bytes", HumanBytes(update.TotalBytes),
		"percent", fmt.Sprintf("%.0f%%", clampPercent(update.OverallPercent)*100),
	}
	if strings.TrimSpace(update.CurrentSpec) != "" {
		attrs = append(attrs, "current_spec", update.CurrentSpec)
	}
	if strings.TrimSpace(update.LastSpec) != "" {
		attrs = append(attrs, "last_spec", update.LastSpec)
	}
	if strings.TrimSpace(update.CurrentStage) != "" {
		attrs = append(attrs, "stage", update.CurrentStage)
	}
	if strings.TrimSpace(update.Error) != "" {
		attrs = append(attrs, "error", update.Error)
	}
	r.logger.Info("aggregate pool", attrs...)
}

func (r *aggregatePoolDebugRenderer) ReportRuntimeMetrics(snapshot RuntimeMetricsSnapshot) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.logger == nil {
		return
	}
	r.logger.Info("aggregate metrics",
		"elapsed", RoundDuration(snapshot.Elapsed).String(),
		"heap", HumanRuntimeBytes(snapshot.HeapAlloc),
		"reserved", HumanRuntimeBytes(snapshot.Sys),
		"allocated", HumanRuntimeBytes(snapshot.TotalAlloc),
		"collections", snapshot.NumGC,
		"threads", snapshot.Goroutines,
	)
}

func (r *aggregatePoolDebugRenderer) Close() {}

func aggregatePoolViewFromUpdate(update printingpress.AggregateProgressUpdate) aggregatePoolView {
	return aggregatePoolView{
		id:             update.PoolID,
		label:          poolLabel(update),
		status:         update.Status,
		completedSpecs: update.CompletedSpecs,
		totalSpecs:     update.TotalSpecs,
		completedBytes: update.CompletedBytes,
		totalBytes:     update.TotalBytes,
		currentSpec:    update.CurrentSpec,
		lastSpec:       update.LastSpec,
		currentStage:   update.CurrentStage,
		currentPercent: clampPercent(update.CurrentPercent),
		overallPercent: clampPercent(update.OverallPercent),
		errorText:      update.Error,
	}
}

func shouldLogAggregatePoolUpdate(prev, next aggregatePoolView) bool {
	if prev.status != next.status {
		return true
	}
	if prev.currentSpec != next.currentSpec && next.currentSpec != "" {
		return true
	}
	if prev.completedSpecs != next.completedSpecs {
		return true
	}
	if next.status == printingpress.AggregateProgressStatusSkipped {
		return true
	}
	return false
}

func aggregatePoolLogMessage(pool aggregatePoolView) string {
	return fmt.Sprintf("%s · %d/%d specs · %s/%s · %s",
		pool.status,
		pool.completedSpecs,
		pool.totalSpecs,
		HumanBytes(pool.completedBytes),
		HumanBytes(pool.totalBytes),
		aggregatePoolTask(pool),
	)
}
