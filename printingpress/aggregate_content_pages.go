// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// collectCatalogContentPages returns the guides of a directory build and its
// home content (the docs folder top-level _index.md), when there is one.
func (ap *AggregatePrintingPress) collectCatalogContentPages() ([]*ppmodel.ContentPage, *ppmodel.ContentPage) {
	if ap == nil || ap.config == nil {
		return nil, nil
	}
	root := strings.TrimSpace(ap.config.ScanRoot)
	if root == "" {
		return nil, nil
	}
	pp := &PrintingPress{
		engineConfig: &pressEngineConfig{
			ContentDiscoveryEnabled: true,
			ContentBasePath:         root,
			Logger:                  ap.config.Logger,
		},
		site: &ppmodel.Site{},
	}
	pp.collectContentPages()
	return pp.site.ContentPages, pp.contentHome
}
