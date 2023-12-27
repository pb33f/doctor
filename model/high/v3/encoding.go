// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
    "context"
    "github.com/pb33f/doctor/model/high/base"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
    "github.com/pb33f/libopenapi/orderedmap"
)

type Encoding struct {
    Value   *v3.Encoding
    Headers *orderedmap.Map[string, *Header]
    base.Foundation
}

func (e *Encoding) Walk(ctx context.Context, encoding *v3.Encoding) {

    e.Value = encoding

    if encoding.Headers != nil {
        headers := orderedmap.New[string, *Header]()
        for encodingPairs := encoding.Headers.First(); encodingPairs != nil; encodingPairs = encodingPairs.Next() {
            h := &Header{}
            h.Parent = e
            h.Key = encodingPairs.Key()
            h.Walk(ctx, encodingPairs.Value())
            headers.Set(encodingPairs.Key(), h)
        }
        e.Headers = headers
    }
}
