// Copyright 2022 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v2

import (
	low "github.com/pb33f/libopenapi/datamodel/low/v2"
	"github.com/pb33f/libopenapi/orderedmap"
)

type SecurityDefinitions struct {
	Definitions *orderedmap.Map[string, *SecurityScheme]
	low         *low.SecurityDefinitions
}
