// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"sync/atomic"
	"time"
)

const (
	jobTypeModel = "model"
	jobTypeHTML  = "html"
	jobTypeLLM   = "llm"

	sourceKindBytes   = "bytes"
	sourceKindV3Model = "v3-model"
	sourceKindDrModel = "dr-model"
)

type activityManager struct {
	subscriberSeq atomic.Uint64

	mu          sync.Mutex
	subscribers map[uint64]*ActivitySubscription
	latest      ActivityUpdate
	hasLast     bool
	activeJobID string
	dropped     int64
}

type activityJob struct {
	mu        sync.Mutex
	manager   *activityManager
	job       *jobState
	startedAt time.Time
	taskStart time.Time
	closed    bool
}

type jobState struct {
	ID         string
	Type       string
	Title      string
	OutputDir  string
	SourceKind string
	Status     string
	StartedAt  time.Time
	UpdatedAt  time.Time
}

// ActivityUpdate reports a point-in-time snapshot of a printing press job.
type ActivityUpdate struct {
	JobID              string
	JobType            string
	Status             string
	Title              string
	OutputDir          string
	SourceKind         string
	CurrentTask        string
	CompletedTasks     int64
	TotalTasks         int64
	PercentComplete    float64
	Elapsed            time.Duration
	TaskDuration       time.Duration
	DroppedUpdateCount int64
	Error              string
}

// ActivitySubscription is a managed stream of activity updates.
//
// Updates are delivered in publish order. A subscription created while a job is
// running immediately receives the latest snapshot for that job. A subscription
// created after a job has finished stays idle until the next job starts.
//
// Unsubscribe, Drain, and Close all detach the subscription from future
// publishes. The channel returned by Updates is closed only after any already
// queued updates have been delivered.
type ActivitySubscription struct {
	manager *activityManager
	id      uint64

	mu            sync.Mutex
	cond          *sync.Cond
	updates       chan ActivityUpdate
	queue         []ActivityUpdate
	attachedJobID string
	closing       bool
	closed        bool
}

func newActivityManager() *activityManager {
	return &activityManager{
		subscribers: make(map[uint64]*ActivitySubscription),
	}
}

func (am *activityManager) subscribe() *ActivitySubscription {
	sub := newActivitySubscription(am)

	am.mu.Lock()
	id := am.subscriberSeq.Add(1)
	sub.id = id
	am.subscribers[id] = sub

	activeJobID := am.activeJobID
	latest := am.latest
	hasActiveSnapshot := am.hasLast && activeJobID != "" && latest.JobID == activeJobID
	am.mu.Unlock()

	if hasActiveSnapshot {
		sub.attachAndEnqueue(activeJobID, latest)
	}
	return sub
}

func newActivitySubscription(manager *activityManager) *ActivitySubscription {
	sub := &ActivitySubscription{
		manager: manager,
		updates: make(chan ActivityUpdate, 1),
	}
	sub.cond = sync.NewCond(&sub.mu)
	go sub.run()
	return sub
}

func (am *activityManager) startJob(jobType, title, outputDir, sourceKind string) *activityJob {
	startedAt := time.Now()
	job := &jobState{
		ID:         newJobID(),
		Type:       jobType,
		Title:      title,
		OutputDir:  outputDir,
		SourceKind: sourceKind,
		Status:     "running",
		StartedAt:  startedAt,
		UpdatedAt:  startedAt,
	}
	aj := &activityJob{
		manager:   am,
		job:       job,
		startedAt: startedAt,
		taskStart: startedAt,
	}
	aj.snapshot("starting "+jobType, 0, 0, 0)
	return aj
}

func (aj *activityJob) snapshot(task string, completed, total int64, taskDuration time.Duration) {
	if aj == nil || aj.manager == nil || aj.job == nil {
		return
	}
	aj.mu.Lock()
	defer aj.mu.Unlock()
	aj.job.UpdatedAt = time.Now()
	update := ActivityUpdate{
		JobID:              aj.job.ID,
		JobType:            aj.job.Type,
		Status:             aj.job.Status,
		Title:              aj.job.Title,
		OutputDir:          aj.job.OutputDir,
		SourceKind:         aj.job.SourceKind,
		CurrentTask:        task,
		CompletedTasks:     completed,
		TotalTasks:         total,
		Elapsed:            time.Since(aj.startedAt),
		TaskDuration:       taskDuration,
		PercentComplete:    calculatePercent(completed, total, aj.job.Status),
		DroppedUpdateCount: aj.manager.currentDroppedCount(),
	}
	aj.manager.publish(update)
	aj.taskStart = time.Now()
}

func (aj *activityJob) complete(task string) {
	if aj == nil || aj.job == nil {
		return
	}
	aj.mu.Lock()
	aj.job.Status = "completed"
	aj.mu.Unlock()
	aj.snapshot(task, 1, 1, time.Since(aj.taskStart))
}

func (aj *activityJob) fail(err error) {
	if aj == nil || aj.job == nil {
		return
	}
	aj.mu.Lock()
	defer aj.mu.Unlock()
	aj.job.Status = "failed"
	update := ActivityUpdate{
		JobID:              aj.job.ID,
		JobType:            aj.job.Type,
		Status:             aj.job.Status,
		Title:              aj.job.Title,
		OutputDir:          aj.job.OutputDir,
		SourceKind:         aj.job.SourceKind,
		CurrentTask:        "failed",
		CompletedTasks:     0,
		TotalTasks:         1,
		Elapsed:            time.Since(aj.startedAt),
		TaskDuration:       time.Since(aj.taskStart),
		PercentComplete:    0,
		DroppedUpdateCount: aj.manager.currentDroppedCount(),
	}
	if err != nil {
		update.Error = err.Error()
	}
	aj.manager.publish(update)
}

func (aj *activityJob) finish() {
	if aj == nil {
		return
	}
	aj.mu.Lock()
	defer aj.mu.Unlock()
	if aj.closed {
		return
	}
	aj.closed = true
}

func (am *activityManager) publish(update ActivityUpdate) {
	if am == nil {
		return
	}

	am.mu.Lock()
	update.DroppedUpdateCount = am.dropped
	am.latest = update
	am.hasLast = true
	if isTerminalStatus(update.Status) {
		if am.activeJobID == update.JobID {
			am.activeJobID = ""
		}
	} else {
		am.activeJobID = update.JobID
	}
	subscribers := make([]*ActivitySubscription, 0, len(am.subscribers))
	for _, sub := range am.subscribers {
		subscribers = append(subscribers, sub)
	}
	am.mu.Unlock()

	var closing []*ActivitySubscription
	for _, sub := range subscribers {
		if isTerminalStatus(update.Status) {
			if sub.belongsToJob(update.JobID) {
				sub.enqueue(update)
				closing = append(closing, sub)
			}
			continue
		}
		sub.attachAndEnqueue(update.JobID, update)
	}

	for _, sub := range closing {
		am.unsubscribe(sub)
		sub.closeAfterDrain()
	}
}

func (am *activityManager) unsubscribe(sub *ActivitySubscription) {
	if am == nil || sub == nil {
		return
	}
	am.mu.Lock()
	delete(am.subscribers, sub.id)
	am.mu.Unlock()
}

func (am *activityManager) currentDroppedCount() int64 {
	if am == nil {
		return 0
	}
	am.mu.Lock()
	defer am.mu.Unlock()
	return am.dropped
}

// Updates returns the ordered stream of activity updates for this subscription.
//
// The channel closes automatically after the attached job reaches a terminal
// state, or after Unsubscribe, Drain, or Close has flushed any queued updates.
func (s *ActivitySubscription) Updates() <-chan ActivityUpdate {
	if s == nil {
		return nil
	}
	return s.updates
}

// Unsubscribe detaches the subscription from future publishes.
//
// Any updates already queued for delivery are still sent before the Updates
// channel is closed.
func (s *ActivitySubscription) Unsubscribe() {
	if s == nil {
		return
	}
	if s.manager != nil {
		s.manager.unsubscribe(s)
	}
	s.closeAfterDrain()
}

// Drain detaches the subscription and returns the Updates channel.
//
// Callers can continue receiving any updates that were already queued before the
// subscription was detached. The returned channel closes after that queue is
// exhausted.
func (s *ActivitySubscription) Drain() <-chan ActivityUpdate {
	if s == nil {
		return nil
	}
	s.Unsubscribe()
	return s.updates
}

// Close detaches the subscription and closes it after queued updates drain.
//
// Close is idempotent.
func (s *ActivitySubscription) Close() {
	if s == nil {
		return
	}
	s.Unsubscribe()
}

func (s *ActivitySubscription) run() {
	for {
		update, ok := s.nextUpdate()
		if !ok {
			return
		}
		s.updates <- update
	}
}

func (s *ActivitySubscription) nextUpdate() (ActivityUpdate, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for len(s.queue) == 0 && !s.closing {
		s.cond.Wait()
	}

	if len(s.queue) == 0 && s.closing {
		if !s.closed {
			s.closed = true
			close(s.updates)
		}
		return ActivityUpdate{}, false
	}

	update := s.queue[0]
	s.queue = s.queue[1:]
	return update, true
}

func (s *ActivitySubscription) attachAndEnqueue(jobID string, update ActivityUpdate) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.closing || s.closed {
		return false
	}
	if s.attachedJobID == "" {
		s.attachedJobID = jobID
	}
	if s.attachedJobID != jobID {
		return false
	}
	s.queue = append(s.queue, update)
	s.cond.Signal()
	return true
}

func (s *ActivitySubscription) enqueue(update ActivityUpdate) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.closing || s.closed {
		return false
	}
	s.queue = append(s.queue, update)
	s.cond.Signal()
	return true
}

func (s *ActivitySubscription) belongsToJob(jobID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return !s.closed && s.attachedJobID == jobID
}

func (s *ActivitySubscription) closeAfterDrain() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.closing || s.closed {
		return
	}
	s.closing = true
	s.cond.Signal()
}

func calculatePercent(completed, total int64, status string) float64 {
	if isTerminalStatus(status) {
		return 100
	}
	if total <= 0 {
		return 0
	}
	if completed >= total {
		return 100
	}
	return (float64(completed) / float64(total)) * 100
}

func isTerminalStatus(status string) bool {
	return status == "completed" || status == "failed"
}

func newJobID() string {
	var b [8]byte
	if _, err := rand.Read(b[:]); err != nil {
		now := time.Now().UnixNano()
		return hex.EncodeToString([]byte{
			byte(now >> 56), byte(now >> 48), byte(now >> 40), byte(now >> 32),
			byte(now >> 24), byte(now >> 16), byte(now >> 8), byte(now),
		})
	}
	return hex.EncodeToString(b[:])
}
