// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
    "context"
    "fmt"
    drBase "github.com/pb33f/doctor/model/high/base"
    drV3 "github.com/pb33f/doctor/model/high/v3"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type DrDocument struct {
    Schemas     []*drBase.Schema
    seenSchemas map[string]bool
}

func (w *DrDocument) WalkV3(doc *v3.Document) *drV3.Document {

    schemaChan := make(chan *drBase.Schema)
    ctx := context.WithValue(context.Background(), "schemaChan", schemaChan)
    var schemas []*drBase.Schema
    w.seenSchemas = make(map[string]bool)
    done := make(chan bool)
    complete := make(chan bool)
    go func(sChan chan *drBase.Schema, done chan bool) {
        for {
            select {
            case <-done:
                complete <- true
                return
            case schema := <-sChan:
                if schema != nil {
                    if len(schema.Value.Type) == 0 {
                        continue
                    }
                    key := fmt.Sprintf("%d:%d", schema.Value.GoLow().Type.KeyNode.Line,
                        schema.Value.GoLow().Type.KeyNode.Column)
                    if _, ok := w.seenSchemas[key]; !ok {
                        schemas = append(schemas, schema)
                        w.seenSchemas[key] = true
                    }
                }
            }
        }
    }(schemaChan, done)
    drDoc := &drV3.Document{}
    drDoc.Walk(ctx, doc)
    done <- true
    <-complete
    w.Schemas = schemas
    return drDoc
}
