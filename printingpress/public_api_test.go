// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"testing"
	"time"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestPressModel_ReturnsCachedSite(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	first, err := pp.PressModel()
	require.NoError(t, err)
	second, err := pp.PressModel()
	require.NoError(t, err)

	require.NotNil(t, first)
	require.Same(t, first, second)
}

func TestActivityStream_AutoClosesAfterCompletion(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	sub := pp.ActivityStream()
	require.NotNil(t, sub)

	updatesCh := make(chan []ActivityUpdate, 1)
	go func() {
		var updates []ActivityUpdate
		for update := range sub.Updates() {
			updates = append(updates, update)
		}
		updatesCh <- updates
	}()

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	var updates []ActivityUpdate
	select {
	case updates = <-updatesCh:
	case <-time.After(5 * time.Second):
		t.Fatal("timed out waiting for activity stream to close")
	}

	require.NotEmpty(t, updates)
	assert.Equal(t, "completed", updates[len(updates)-1].Status)
}

func TestActivityStream_LateSubscriberWaitsForNextJob(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	sub := pp.ActivityStream()
	require.NotNil(t, sub)

	select {
	case update, ok := <-sub.Updates():
		if ok {
			t.Fatalf("expected idle subscription, received stale update: %+v", update)
		}
		t.Fatal("expected idle subscription, got closed channel")
	case <-time.After(100 * time.Millisecond):
	}

	updatesCh := make(chan []ActivityUpdate, 1)
	go func() {
		var updates []ActivityUpdate
		for update := range sub.Updates() {
			updates = append(updates, update)
		}
		updatesCh <- updates
	}()

	_, err = pp.PrintLLM()
	require.NoError(t, err)

	select {
	case updates := <-updatesCh:
		require.NotEmpty(t, updates)
		assert.Equal(t, jobTypeLLM, updates[0].JobType)
		assert.Equal(t, "completed", updates[len(updates)-1].Status)
	case <-time.After(5 * time.Second):
		t.Fatal("timed out waiting for next job activity stream")
	}
}

func TestActivitySubscription_DrainReturnsBufferedLatestUpdate(t *testing.T) {
	manager := newActivityManager()
	sub := manager.subscribe()
	require.NotNil(t, sub)

	job := manager.startJob(jobTypeModel, "test", t.TempDir(), sourceKindBytes)
	job.snapshot("phase one", 1, 3, 0)
	job.snapshot("phase two", 2, 3, 0)

	drain := sub.Drain()
	require.NotNil(t, drain)

	var tasks []string
	for update := range drain {
		tasks = append(tasks, update.CurrentTask)
	}

	assert.Equal(t, []string{"phase two"}, tasks)
}

func TestActivityStream_SlowConsumerStillReceivesTerminalUpdate(t *testing.T) {
	manager := newActivityManager()
	sub := manager.subscribe()
	require.NotNil(t, sub)

	job := manager.startJob(jobTypeHTML, "test", t.TempDir(), sourceKindBytes)
	job.snapshot("collecting", 1, 4, 0)
	job.snapshot("rendering", 2, 4, 0)
	job.complete("done")

	var tasks []string
	for update := range sub.Updates() {
		tasks = append(tasks, update.CurrentTask)
	}

	require.NotEmpty(t, tasks)
	assert.Equal(t, "done", tasks[len(tasks)-1])
}

func TestWriters_ReturnErrNilSite(t *testing.T) {
	err := PrintJSONArtifacts(nil, t.TempDir())
	require.ErrorIs(t, err, ErrNilSite)

	err = WriteHTMLSite(nil, t.TempDir(), "")
	require.ErrorIs(t, err, ErrNilSite)

	err = WriteLLMSite(nil, t.TempDir())
	require.ErrorIs(t, err, ErrNilSite)
}
