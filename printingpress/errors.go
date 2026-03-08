// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import "errors"

var (
	ErrNoV3Document = errors.New("printingpress: DrDocument has no V3 document")
)
