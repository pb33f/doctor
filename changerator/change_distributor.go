// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"fmt"
	v3 "github.com/pb33f/doctor/model/high/v3"
	whatChanged "github.com/pb33f/libopenapi/what-changed"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
	"sync"
)

type ChangeratorChange whatChangedModel.Change

type Changerator struct {
	Config       *ChangeratorConfig
	NodeChan     chan *modelChange
	ChangedNodes []*v3.Node
	ChangedEdges []*v3.Edge
	Changes      []*whatChangedModel.Change
	tmpEdges     []*v3.Edge
	tmpNodes     []*v3.Node
	seen         map[string]*whatChangedModel.Change

	// Deduplicator handles change deduplication across the hierarchy
	Deduplicator *ChangeDeduplicator

	// For context extraction
	rightDocContent []byte   // Original right document content
	rightDocLines   []string // Cached split lines for performance
	rightDocFormat  string   // "yaml" or "json"
	mutex           sync.Mutex
}

type modelChange struct {
	model             v3.Foundational
	node              *v3.Node
	referenceJSONPath string
	change            whatChanged.Changed
}

const NodeChannel string = "node-channel"

func NewChangerator(config *ChangeratorConfig) *Changerator {
	seen := make(map[string]*whatChangedModel.Change)
	return &Changerator{
		Config:          config,
		seen:            seen,
		Deduplicator:    NewChangeDeduplicator(),
		rightDocContent: config.RightDocContent,
	}
}

// generateChangeLocationHash creates a hash from a change's context location.
// This is used to detect duplicate changes at the same location.
func (t *Changerator) generateChangeLocationHash(ctx *whatChangedModel.ChangeContext) string {
	if ctx == nil {
		return ""
	}

	var a, b, c, d int
	if ctx.OriginalLine != nil {
		a = *ctx.OriginalLine
	}
	if ctx.OriginalColumn != nil {
		b = *ctx.OriginalColumn
	}
	if ctx.NewLine != nil {
		c = *ctx.NewLine
	}
	if ctx.NewColumn != nil {
		d = *ctx.NewColumn
	}

	return fmt.Sprintf("%d:%d:%d:%d", a, b, c, d)
}

// processChangeWithDedup processes a change and returns true if it should be kept (unique).
// Returns false if the change is a duplicate.
func (t *Changerator) processChangeWithDedup(ch *whatChangedModel.Change) bool {
	hash := t.generateChangeLocationHash(ch.Context)

	if hash == "" {
		return true
	}

	if _, ok := t.seen[hash]; ok {
		return false
	}

	t.seen[hash] = ch
	return true
}

func (t *Changerator) Changerate() *whatChangedModel.DocumentChanges {

	// get high-level left and right docs
	leftDoc := t.Config.LeftDrDoc
	rightDoc := t.Config.RightDrDoc

	// rotate rolodex ids
	leftDoc.Document.Rolodex.RotateId()
	rightDoc.Document.Rolodex.RotateId()

	docChanges := whatChanged.CompareOpenAPIDocuments(leftDoc.Document.GoLow(), rightDoc.Document.GoLow())

	if docChanges == nil || len(docChanges.GetAllChanges()) == 0 {
		return nil
	}

	t.Config.DocumentChanges = docChanges
	t.NodeChan = make(chan *modelChange)

	var referenceNodeeChanges []*modelChange

	doneChan := make(chan struct{})
	go func() {
		for val := range t.NodeChan {

			if val.referenceJSONPath != "" {
				referenceNodeeChanges = append(referenceNodeeChanges, val)
				continue
			}

			for _, c := range val.node.GetChanges() {
				for _, ch := range c.GetAllChanges() {
					if t.processChangeWithDedup(ch) {
						t.Changes = append(t.Changes, ch)
					}
				}
			}
			t.mutex.Lock()
			t.ChangedNodes = append(t.ChangedNodes, val.node)
			t.mutex.Unlock()
		}
		doneChan <- struct{}{}
	}()

	chCtx := context.WithValue(context.Background(), NodeChannel, t.NodeChan)
	cctx := context.WithValue(chCtx, v3.Context, docChanges)
	go t.Config.RightDrDoc.Travel(cctx, t)
	<-doneChan

	if len(referenceNodeeChanges) > 0 {
		t.NodeChan = make(chan *modelChange)
		chCtx = context.WithValue(context.Background(), NodeChannel, t.NodeChan)
		doneChan = make(chan struct{})
		// process referenced nodes with changes
		go func() {
			for val := range t.NodeChan {
				if val.node != nil && len(val.node.GetChanges()) > 0 {
					for _, q := range val.node.GetChanges() {
						for _, ch := range q.GetAllChanges() {
							if t.processChangeWithDedup(ch) {
								t.Changes = append(t.Changes, ch)
							}
						}
					}
					t.mutex.Lock()
					t.ChangedNodes = append(t.ChangedNodes, val.node)
					t.mutex.Unlock()
				}
			}
		}()
		nCtx := chCtx
		for _, rn := range referenceNodeeChanges {
			for _, n := range t.Config.Doctor.Nodes {
				if n.Id == rn.referenceJSONPath {
					if tr, ok := n.DrInstance.(v3.Companion); ok {
						nCtx = context.WithValue(nCtx, v3.Context, rn.change)
						tr.Travel(nCtx, t)
					}
				}
			}
		}
		close(t.NodeChan)
	}

	return docChanges

}

func (t *Changerator) GetDoctor() v3.Doctor {
	return t.Config.Doctor
}

// DeduplicateChanges removes duplicate changes using JSONPath + property as the unique key.
// This prevents the same change from appearing multiple times when a reference is used in multiple locations.
// Returns a deduplicated array of changes.
func (t *Changerator) DeduplicateChanges() []*whatChangedModel.Change {
	if t.Config == nil || t.Config.DocumentChanges == nil {
		return nil
	}

	allChanges := t.Config.DocumentChanges.GetAllChanges()
	if len(allChanges) == 0 {
		return allChanges
	}

	seen := make(map[string]bool)
	var deduplicated []*whatChangedModel.Change

	for _, change := range allChanges {
		key := change.Path + ":" + change.Property

		if !seen[key] {
			seen[key] = true
			deduplicated = append(deduplicated, change)
		}
	}

	return deduplicated
}

func (t *Changerator) Visit(ctx context.Context, object any) {

	switch obj := object.(type) {
	case *v3.Document:
		t.VisitDocument(ctx, obj)
	case *v3.Info:
		t.VisitInfo(ctx, obj)
	case *v3.Server:
		t.VisitServer(ctx, obj)
	case *v3.ServerVariable:
		PushChanges(ctx, obj, &whatChangedModel.ServerVariableChanges{})
	case *v3.Contact:
		PushChanges(ctx, obj, &whatChangedModel.ContactChanges{})
	case *v3.License:
		PushChanges(ctx, obj, &whatChangedModel.LicenseChanges{})
	case *v3.Tag:
		t.VisitTag(ctx, obj)
	case *v3.SecurityRequirement:
		PushChanges(ctx, obj, &whatChangedModel.SecurityRequirementChanges{})
	case *v3.Paths:
		t.VisitPaths(ctx, obj)
	case *v3.PathItem:
		t.VisitPathItem(ctx, obj)
	case *v3.Operation:
		t.VisitOperation(ctx, obj)
	case *v3.ExternalDoc:
		PushChanges(ctx, obj, &whatChangedModel.ExternalDocChanges{})
	case *v3.Example:
		PushChanges(ctx, obj, &whatChangedModel.ExampleChanges{})
	case *v3.XML:
		t.VisitXML(ctx, obj)
	case *v3.Components:
		t.VisitComponents(ctx, obj)
	case *v3.Schema:
		t.VisitSchema(ctx, obj)
	case *v3.MediaType:
		t.VisitMediaType(ctx, obj)
	case *v3.Header:
		t.VisitHeader(ctx, obj)
	case *v3.Encoding:
		t.VisitEncoding(ctx, obj)
	case *v3.Parameter:
		t.VisitParameter(ctx, obj)
	case *v3.RequestBody:
		t.VisitRequestBody(ctx, obj)
	case *v3.Responses:
		t.VisitResponses(ctx, obj)
	case *v3.Response:
		t.VisitResponse(ctx, obj)
	case *v3.Link:
		t.VisitLink(ctx, obj)
	case *v3.Callback:
		t.VisitCallback(ctx, obj)
	case *v3.SecurityScheme:
		t.VisitSecurityScheme(ctx, obj)
	case *v3.OAuthFlows:
		t.VisitOAuthFlows(ctx, obj)
	case *v3.OAuthFlow:
		PushChanges(ctx, obj, &whatChangedModel.OAuthFlowChanges{})
	default:
		if t.Config.Logger != nil {
			t.Config.Logger.Warn("[changerator] unknown type ", "type", obj)
		}
	}
}
