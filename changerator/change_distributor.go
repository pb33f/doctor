// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"fmt"
	"sync"

	"github.com/pb33f/doctor/changerator/renderer"
	v3 "github.com/pb33f/doctor/model/high/v3"
	asyncModel "github.com/pb33f/libasyncapi/what-changed/model"
	"github.com/pb33f/libopenapi/datamodel"
	lowV3 "github.com/pb33f/libopenapi/datamodel/low/v3"
	"github.com/pb33f/libopenapi/utils"
	whatChanged "github.com/pb33f/libopenapi/what-changed"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
)

type ChangeratorChange whatChangedModel.Change

type Changerator struct {
	// ChangeReport holds a non-OpenAPI engine's shared change view.
	ChangeReport whatChanged.Changed
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

	// ParameterNames maps a parameter's full JSONPath (e.g., "$.paths['/pets'].get.parameters[0]")
	// to its semantic name (e.g., "petId"). Populated during VisitParameter.
	ParameterNames map[string]string

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

// NodeIndex is the context key for the right document's nodes, keyed by canonical path.
const NodeIndex string = "node-index"

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

	docChanges := compareOpenAPIDocuments(leftDoc, rightDoc)

	if docChanges == nil || len(docChanges.GetAllChanges()) == 0 {
		return nil
	}

	// Rotate after comparison. libopenapi v0.38 uses Rolodex identity during
	// external-reference comparison, so rotating before the diff hides changes
	// when root refs have identical names.
	leftDoc.Document.Rolodex.RotateId()
	rightDoc.Document.Rolodex.RotateId()

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

	nodeIndex := t.nodeIndex()
	chCtx := context.WithValue(context.Background(), NodeChannel, t.NodeChan)
	chCtx = context.WithValue(chCtx, NodeIndex, nodeIndex)
	cctx := context.WithValue(chCtx, v3.Context, docChanges)
	go t.Config.RightDrDoc.Travel(cctx, t)
	<-doneChan

	if len(referenceNodeeChanges) > 0 {
		t.NodeChan = make(chan *modelChange)
		chCtx = context.WithValue(context.Background(), NodeChannel, t.NodeChan)
		chCtx = context.WithValue(chCtx, NodeIndex, nodeIndex)
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
			doneChan <- struct{}{}
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
		<-doneChan
	}

	t.placeUnattachedChanges(docChanges)
	return docChanges

}

// placeUnattachedChanges puts any change the walk could not place on the document
// root, so the graph can never report fewer changes than the comparison found. // of a placed change are skipped, and each change keeps its path and type for the reports.
func (t *Changerator) placeUnattachedChanges(docChanges *whatChangedModel.DocumentChanges) {
	if t.Config.Doctor == nil || t.Config.RightDrDoc == nil || t.Config.RightDrDoc.Node == nil {
		return
	}
	placed := make(map[string]bool)
	for _, node := range t.Config.Doctor.Nodes {
		for _, changed := range node.GetChanges() {
			for _, change := range changed.GetPropertyChanges() {
				placed[generateChangeHash(change)] = true
			}
		}
	}
	root := t.Config.RightDrDoc.Node
	var unattached []*whatChangedModel.Change
	for _, change := range docChanges.GetAllChanges() {
		if hash := generateChangeHash(change); !placed[hash] {
			placed[hash] = true
			unattached = append(unattached, change)
		}
	}
	if len(unattached) > 0 {
		root.AppendChange(&nodePropertyChanges{changes: unattached})
		t.mutex.Lock()
		t.ChangedNodes = append(t.ChangedNodes, root)
		t.mutex.Unlock()
	}
}

func compareOpenAPIDocuments(leftDoc, rightDoc *v3.Document) *whatChangedModel.DocumentChanges {
	if leftDoc == nil || rightDoc == nil || leftDoc.Document == nil || rightDoc.Document == nil {
		return nil
	}

	docChanges := whatChanged.CompareOpenAPIDocuments(leftDoc.Document.GoLow(), rightDoc.Document.GoLow())
	if docChanges != nil && len(docChanges.GetAllChanges()) > 0 {
		return docChanges
	}
	if !hasExternalReferencesForComparison(leftDoc) && !hasExternalReferencesForComparison(rightDoc) {
		return docChanges
	}

	rebuiltLeft, leftErr := rebuildLowDocumentForComparison(leftDoc)
	rebuiltRight, rightErr := rebuildLowDocumentForComparison(rightDoc)
	if leftErr != nil || rightErr != nil {
		return docChanges
	}

	rebuiltChanges := whatChanged.CompareOpenAPIDocuments(rebuiltLeft, rebuiltRight)
	if rebuiltChanges != nil && len(rebuiltChanges.GetAllChanges()) > 0 {
		return rebuiltChanges
	}
	return docChanges
}

func hasExternalReferencesForComparison(doc *v3.Document) bool {
	if doc == nil || doc.Document == nil || doc.Document.GoLow() == nil || doc.Document.GoLow().Index == nil {
		return false
	}
	idx := doc.Document.GoLow().Index
	if len(idx.GetAllExternalDocuments()) > 0 {
		return true
	}
	for _, ref := range idx.GetAllReferences() {
		if ref != nil && (utils.IsExternalRef(ref.Definition) || utils.IsExternalRef(ref.RawRef)) {
			return true
		}
	}
	return false
}

func rebuildLowDocumentForComparison(doc *v3.Document) (*lowV3.Document, error) {
	if doc == nil || doc.Document == nil || doc.Document.GoLow() == nil || doc.Document.GoLow().Index == nil {
		return nil, fmt.Errorf("document has no low-level index")
	}
	indexConfig := doc.Document.GoLow().Index.GetConfig()
	if indexConfig == nil || indexConfig.SpecInfo == nil {
		return nil, fmt.Errorf("document index has no spec info")
	}
	config := indexConfig.ToDocumentConfiguration()
	if config == nil {
		config = datamodel.NewDocumentConfiguration()
	}
	config.RemoteURLHandler = indexConfig.RemoteURLHandler
	config.LocalFS = indexConfig.FSHandler
	config.RemoteFS = indexConfig.FSHandler
	config.AvoidIndexBuild = indexConfig.AvoidBuildIndex
	config.SkipCircularReferenceCheck = indexConfig.AvoidCircularReferenceCheck
	config.ExtractRefsSequentially = indexConfig.ExtractRefsSequentially
	config.ExcludeExtensionRefs = indexConfig.ExcludeExtensionRefs
	return lowV3.CreateDocumentFromConfig(indexConfig.SpecInfo, config)
}

func (t *Changerator) GetDoctor() v3.Doctor {
	return t.Config.Doctor
}

func (t *Changerator) nodeIndex() map[string]*v3.Node {
	if t.Config == nil || t.Config.Doctor == nil {
		return nil
	}
	nodes := make(map[string]*v3.Node, len(t.Config.Doctor.Nodes))
	for _, node := range t.Config.Doctor.Nodes {
		if _, ok := nodes[node.Id]; !ok {
			nodes[node.Id] = node
		}
	}
	return nodes
}

// DeduplicateChanges removes changes that repeat one edit, which happens when a
// reference is used in multiple locations. Distinct edits to one property, such as
// an enum addition and removal, are kept so a breaking change is never hidden.
func (t *Changerator) DeduplicateChanges() []*whatChangedModel.Change {
	if t.ChangeReport == nil && (t.Config == nil || t.Config.DocumentChanges == nil) {
		return nil
	}

	var allChanges []*whatChangedModel.Change
	if _, async := t.ChangeReport.(*asyncModel.DocumentChanges); async && t.Changes != nil {
		// CompareAsyncAPI has already collected and sorted the native change tree.
		allChanges = t.Changes
	} else if t.ChangeReport != nil {
		allChanges = t.ChangeReport.GetAllChanges()
	} else {
		allChanges = t.Config.DocumentChanges.GetAllChanges()
	}
	if len(allChanges) == 0 {
		return allChanges
	}
	return renderer.DeduplicateChanges(allChanges)
}

// ResolveParameterName returns the semantic name for a parameter at the given
// JSONPath (e.g., "$.paths['/pets'].get.parameters[0]"), or empty string if unknown.
func (t *Changerator) ResolveParameterName(paramPath string) string {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	if t.ParameterNames == nil {
		return ""
	}
	return t.ParameterNames[paramPath]
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
		// OAuthFlow has no graph node, so PushChanges can't set Change.Type.
		// Set it explicitly on all property changes.
		if ch, ok := ctx.Value(v3.Context).(*whatChangedModel.OAuthFlowChanges); ok && ch != nil {
			for _, c := range ch.GetAllChanges() {
				if c.Type == "" {
					c.Type = "securityScheme"
				}
			}
		}
		PushChanges(ctx, obj, &whatChangedModel.OAuthFlowChanges{})
	default:
		if t.Config.Logger != nil {
			t.Config.Logger.Warn("[changerator] unknown type ", "type", obj)
		}
	}
}
