// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"context"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

// pathKey is used to pass the current path string through context.
type pathKey struct{}

// visitPaths iterates path items in order and delegates to Travel.
func (f *Frank) visitPaths(ctx context.Context, paths *v3.Paths) {
	if paths.PathItems == nil {
		return
	}
	for pair := paths.PathItems.First(); pair != nil; pair = pair.Next() {
		pathStr := pair.Key()
		pi := pair.Value()
		piCtx := context.WithValue(ctx, pathKey{}, pathStr)
		pi.Travel(piCtx, f)
	}
}

// visitPathItem processes all operations on a path item.
func (f *Frank) visitPathItem(ctx context.Context, pi *v3.PathItem) {
	pathStr, _ := ctx.Value(pathKey{}).(string)
	if pathStr == "" {
		pathStr = pi.Key
	}

	if pi.Value != nil && len(pi.Value.Servers) > 0 {
		f.log.Warn("path-level servers are not supported by OpenCollection; using document-level baseUrl",
			"path", pathStr)
	}

	ops := pi.GetOperations()
	for pair := ops.First(); pair != nil; pair = pair.Next() {
		method := pair.Key()
		drOp := pair.Value()
		f.processOperation(pathStr, method, drOp, pi)
	}
}

// processOperation maps one OpenAPI operation to one OC request.
func (f *Frank) processOperation(path, method string, op *v3.Operation, pathItem *v3.PathItem) {
	if op == nil || op.Value == nil {
		return
	}

	opVal := op.Value

	if len(opVal.Servers) > 0 {
		f.log.Warn("operation-level servers are not supported by OpenCollection; using document-level baseUrl",
			"path", path, "method", method)
	}

	folderName := f.config.DefaultTag
	if len(opVal.Tags) > 0 {
		folderName = opVal.Tags[0]
	}

	state, exists := f.folders[folderName]
	if !exists {
		state = &folderBuildState{name: folderName}
		f.folders[folderName] = state
		f.folderOrder = append(f.folderOrder, folderName)
	}
	state.nextSeq++

	var opParams []*highV3.Parameter
	for _, p := range op.Parameters {
		if p != nil && p.Value != nil {
			if p.Value.In == "cookie" {
				f.log.Warn("cookie parameter ignored; OpenCollection does not support cookie params",
					"path", path, "method", method, "param", p.Value.Name)
			}
			opParams = append(opParams, p.Value)
		}
	}
	var piParams []*highV3.Parameter
	for _, p := range pathItem.Parameters {
		if p != nil && p.Value != nil {
			if p.Value.In == "cookie" {
				f.log.Warn("cookie parameter ignored; OpenCollection does not support cookie params",
					"path", path, "param", p.Value.Name)
			}
			piParams = append(piParams, p.Value)
		}
	}

	var requestBody *highV3.RequestBody
	if op.RequestBody != nil {
		requestBody = op.RequestBody.Value
	}
	selected := selectRequestBody(requestBody)

	var responses *highV3.Responses
	if op.Responses != nil {
		responses = op.Responses.Value
	}

	req := &Request{
		Info: RequestInfo{
			Name: buildRequestName(opVal.Summary, opVal.OperationId, method, path),
			Type: "http",
			Seq:  state.nextSeq,
		},
		HTTP: RequestHTTP{
			Method:  strings.ToUpper(method),
			URL:     buildURL(path),
			Params:  buildParams(opParams, piParams),
			Headers: buildHeaders(opParams, piParams, selected, responses),
			Body:    buildBody(selected),
			Auth:    resolveOperationAuth(opVal.Security, f.docSecurity, f.securitySchemes, f.log),
		},
		FileName: buildRequestFileName(opVal.OperationId, method, path),
	}

	if len(opVal.Tags) > 0 {
		req.Info.Tags = opVal.Tags
	}

	if f.config.IncludeDescriptionAsDocs && opVal.Description != "" {
		req.Docs = opVal.Description
	}

	// strip empty slices to keep YAML clean
	if len(req.HTTP.Params) == 0 {
		req.HTTP.Params = nil
	}
	if len(req.HTTP.Headers) == 0 {
		req.HTTP.Headers = nil
	}

	state.requests = append(state.requests, req)
}
