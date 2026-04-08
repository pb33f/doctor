// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import "sort"

// modelDirs returns the list of model subdirectory paths derived from refSegmentToTypeSlug.
func modelDirs() []string {
	dirs := make([]string, 0, len(refSegmentToTypeSlug))
	for _, slug := range refSegmentToTypeSlug {
		dirs = append(dirs, "models/"+slug)
	}
	sort.Strings(dirs)
	return dirs
}
