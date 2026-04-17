// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"runtime"
	"sync"
	"time"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	AggregateBuildModeFull  = "full"
	AggregateBuildModeFast  = "fast"
	AggregateBuildModeWatch = "watch"
)

// AggregatePathOverride maps a relative spec path or glob to an explicit value.
type AggregatePathOverride struct {
	Pattern string
	Value   string
}

// AggregatePrintingPressConfig configures repo-tree discovery and multi-spec output.
type AggregatePrintingPressConfig struct {
	Title                   string
	Description             string
	ScanRoot                string
	OutputDir               string
	BaseURL                 string
	AssetMode               string
	BuildMode               string
	DisableSkippedRendering bool
	Include                 []string
	IgnoreRules             []string
	NoiseSegments           []string
	ServiceOverrides        []AggregatePathOverride
	DisplayNameOverrides    []AggregatePathOverride
	VersionOverrides        []AggregatePathOverride
	StateNamespace          string
	StateSQLitePath         string
	StateStore              SpecStateStore
	Logger                  *slog.Logger
	MaxPools                int
	WorkersPerPool          int
}

// AggregatePressStatistics reports the outcome of an aggregate print run.
type AggregatePressStatistics struct {
	BuildMode          string
	Services           int
	Versions           int
	Specs              int
	ChangedSpecs       int
	PoolsUsed          int
	WorkersPerPool     int
	AvailableCores     int
	FilesWritten       int
	BytesWritten       int64
	FileSizes          map[string]int64
	Warnings           []*ppmodel.BuildWarning
	DiscoveryDuration  time.Duration
	GenerationDuration time.Duration
	TotalDuration      time.Duration
}

// SpecStateStore persists lightweight discovery/build state between runs.
type SpecStateStore interface {
	Load(namespace string) (map[string]*SpecStateRecord, error)
	Upsert(namespace string, records []*SpecStateRecord) error
	Delete(namespace string, paths []string) error
	Close() error
}

// SpecStateRecord stores one discovered root spec fingerprint and metadata.
type SpecStateRecord struct {
	RelativePath string
	Hash         string
	ConfigHash   string
	Title        string
	Summary      string
	ServiceKey   string
	DisplayName  string
	Version      string
	Format       string
	OutputSubdir string
	UpdatedAt    time.Time
}

// AggregatePrintingPress discovers and renders a multi-spec documentation catalog.
type AggregatePrintingPress struct {
	mu         sync.Mutex
	config     *AggregatePrintingPressConfig
	stateStore SpecStateStore
	plan       *aggregateBuildPlan
	catalog    *ppmodel.CatalogSite
}

// CreateAggregatePrintingPressFromPath creates a multi-spec printing press rooted at scanRoot.
func CreateAggregatePrintingPressFromPath(scanRoot string, config *AggregatePrintingPressConfig) (*AggregatePrintingPress, error) {
	normalized, store, err := validateAndNormalizeAggregateConfig(scanRoot, config)
	if err != nil {
		return nil, err
	}
	return &AggregatePrintingPress{
		config:     normalized,
		stateStore: store,
	}, nil
}

// PressModel discovers specs, groups them into services and versions, and caches the catalog.
func (ap *AggregatePrintingPress) PressModel() (*ppmodel.CatalogSite, error) {
	ap.mu.Lock()
	defer ap.mu.Unlock()

	plan, err := ap.refreshPlanLocked()
	if err != nil {
		return nil, err
	}
	return plan.catalog, nil
}

func cloneAggregateConfig(config *AggregatePrintingPressConfig) *AggregatePrintingPressConfig {
	if config == nil {
		return nil
	}
	cloned := *config
	cloned.Include = append([]string(nil), config.Include...)
	cloned.IgnoreRules = append([]string(nil), config.IgnoreRules...)
	cloned.NoiseSegments = append([]string(nil), config.NoiseSegments...)
	cloned.ServiceOverrides = append([]AggregatePathOverride(nil), config.ServiceOverrides...)
	cloned.DisplayNameOverrides = append([]AggregatePathOverride(nil), config.DisplayNameOverrides...)
	cloned.VersionOverrides = append([]AggregatePathOverride(nil), config.VersionOverrides...)
	return &cloned
}

func validateAndNormalizeAggregateConfig(scanRoot string, config *AggregatePrintingPressConfig) (*AggregatePrintingPressConfig, SpecStateStore, error) {
	if config == nil {
		config = &AggregatePrintingPressConfig{}
	}
	normalized := cloneAggregateConfig(config)
	if normalized == nil {
		normalized = &AggregatePrintingPressConfig{}
	}
	if normalized.Logger == nil {
		normalized.Logger = slog.Default()
	}
	if normalized.MaxPools <= 0 {
		normalized.MaxPools = 3
	}
	availableCores := runtime.GOMAXPROCS(0)
	if availableCores < 1 {
		availableCores = 1
	}
	if normalized.MaxPools > availableCores {
		normalized.MaxPools = availableCores
	}
	if normalized.WorkersPerPool <= 0 {
		normalized.WorkersPerPool = max(1, availableCores/3)
	}
	if normalized.WorkersPerPool > availableCores {
		normalized.WorkersPerPool = availableCores
	}
	if normalized.BuildMode == "" {
		normalized.BuildMode = AggregateBuildModeFull
	}
	switch normalized.BuildMode {
	case AggregateBuildModeFull, AggregateBuildModeFast, AggregateBuildModeWatch:
	default:
		return nil, nil, fmt.Errorf("printingpress: invalid aggregate build mode %q", normalized.BuildMode)
	}
	switch normalized.AssetMode {
	case "", HTMLAssetModePortable:
		normalized.AssetMode = HTMLAssetModePortable
	case HTMLAssetModeServed:
	default:
		return nil, nil, fmt.Errorf("printingpress: invalid aggregate asset mode %q", normalized.AssetMode)
	}

	root := scanRoot
	if root == "" {
		root = normalized.ScanRoot
	}
	if root == "" {
		wd, err := os.Getwd()
		if err != nil {
			return nil, nil, fmt.Errorf("printingpress: resolving scan root: %w", err)
		}
		root = wd
	}
	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, nil, fmt.Errorf("printingpress: resolving scan root: %w", err)
	}
	info, err := os.Stat(absRoot)
	if err != nil || !info.IsDir() {
		if err == nil {
			err = fmt.Errorf("not a directory")
		}
		return nil, nil, fmt.Errorf("printingpress: invalid scan root: %w", err)
	}
	normalized.ScanRoot = absRoot

	if normalized.OutputDir == "" {
		normalized.OutputDir = filepath.Join(absRoot, "api-docs")
	}
	normalized.OutputDir, err = filepath.Abs(normalized.OutputDir)
	if err != nil {
		return nil, nil, fmt.Errorf("printingpress: resolving output dir: %w", err)
	}
	if normalized.BaseURL != "" {
		normalized.BaseURL, err = resolveExplicitBaseURL(normalized.BaseURL)
		if err != nil {
			return nil, nil, err
		}
	}
	if len(normalized.NoiseSegments) == 0 {
		normalized.NoiseSegments = defaultAggregateNoiseSegments()
	}
	if normalized.StateNamespace == "" {
		normalized.StateNamespace = normalized.ScanRoot
	}

	store := normalized.StateStore
	if store == nil {
		sqlitePath := normalized.StateSQLitePath
		if sqlitePath == "" {
			sqlitePath = filepath.Join(normalized.OutputDir, pppaths.FileStateSQLite)
		}
		absSQLite, absErr := filepath.Abs(sqlitePath)
		if absErr != nil {
			return nil, nil, fmt.Errorf("printingpress: resolving sqlite state path: %w", absErr)
		}
		normalized.StateSQLitePath = absSQLite
		store, err = NewSQLiteSpecStateStore(absSQLite)
		if err != nil {
			return nil, nil, err
		}
	}
	return normalized, store, nil
}

func defaultAggregateNoiseSegments() []string {
	return []string{"spec", "specs", "src", "files", "file", "openapi", "api", "docs"}
}
