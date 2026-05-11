// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"io/fs"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
)

// SharedAssets exposes the renderer's embedded shared-asset tree rooted such
// that top-level entries are the asset files themselves (printing-press.js,
// printing-press.css, fonts/, shoelace/assets/icons/, ...). Hosts mount this
// FS at a public URL prefix and pass that prefix back through
// PrintingPressConfig.SharedAssetBaseURL so generated HTML references the
// hosted location instead of an in-artifact copy.
//
// Contents are immutable for the lifetime of the process and may be hashed
// once at startup to derive a content-version cache buster.
var SharedAssets fs.FS = mustSubStatic()

func mustSubStatic() fs.FS {
	sub, err := fs.Sub(staticFS, pppaths.DirStatic)
	if err != nil {
		panic("printingpress: unable to sub embedded static FS: " + err.Error())
	}
	return sub
}
