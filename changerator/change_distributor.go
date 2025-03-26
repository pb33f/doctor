// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"context"
	"fmt"
	v3 "github.com/pb33f/doctor/model/high/v3"
	//"github.com/pb33f/libopenapi/datamodel/low"
	whatChanged "github.com/pb33f/libopenapi/what-changed"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
)

type ChangeratorChange whatChangedModel.Change

//
//func (c *ChangeratorChange) MarshalJSON() ([]byte, error) {
//
//}

type Changerator struct {
	Config       *ChangeratorConfig
	NodeChan     chan *v3.Node
	ChangedNodes []*v3.Node
	Changes      []any
	seen         map[string]*whatChangedModel.Change
}

const NodeChannel string = "node-channel"

/*
	// GetAllChanges returns all top level changes made to properties in this object
	GetAllChanges() []*model.Change

	// TotalChanges returns a count of all changes made on the object, including all children
	TotalChanges() int

	// TotalBreakingChanges returns a count of all breaking changes on this object
	TotalBreakingChanges() int
*/

func NewChangerator(config *ChangeratorConfig) *Changerator {
	seen := make(map[string]*whatChangedModel.Change)
	return &Changerator{Config: config, seen: seen}
}

func (t *Changerator) Changerate() *whatChangedModel.DocumentChanges {

	// get high level left and right docs
	leftDoc := t.Config.LeftDrDoc
	rightDoc := t.Config.RightDrDoc

	docChanges := whatChanged.CompareOpenAPIDocuments(leftDoc.Document.GoLow(), rightDoc.Document.GoLow())

	if docChanges == nil || len(docChanges.GetAllChanges()) == 0 {
		return nil
	}

	t.Config.DocumentChanges = docChanges
	t.NodeChan = make(chan *v3.Node)
	doneChan := make(chan struct{})
	go func() {
		for val := range t.NodeChan {

			//aux := &NodeChange{
			//	Id:                val.Id,
			//	IdHash:            val.IdHash,
			//	Type:              val.Type,
			//	Label:             val.Label,
			//	ArrayIndex:        val.ArrayIndex,
			//}

			for _, ch := range val.Changes.GetAllChanges() {
				ctx := ch.Context
				var hash string
				if ctx != nil {
					hash = fmt.Sprintf("%d:%d:%d:%d", ctx.OriginalLine, ctx.OriginalColumn,
						ctx.NewLine, ctx.NewColumn)
				}
				_, ok := t.seen[hash]

				if hash != "" && ok {
					continue
				}

				//var original map[string]any
				//var modified map[string]any
				//
				//// HERE <----- marshal nodes into ready to go maps.
				//
				//if ch.OriginalObject != nil {
				//	if rn, kk := ch.OriginalObject.(low.HasRootNode); kk {
				//		orig := rn.GetRootNode()
				//		if orig != nil {
				//			orig.Decode(&original)
				//		}
				//	}
				//}
				//
				//if ch.NewObject != nil {
				//	if rn, kk := ch.NewObject.(low.HasRootNode); kk {
				//		mod := rn.GetRootNode()
				//		if mod != nil {
				//			mod.Decode(&modified)
				//		}
				//	}
				//}

				t.Changes = append(t.Changes, ch)
			}
			t.ChangedNodes = append(t.ChangedNodes, val)
		}
		doneChan <- struct{}{}
	}()

	chCtx := context.WithValue(context.Background(), NodeChannel, t.NodeChan)
	ctx := context.WithValue(chCtx, v3.Context, docChanges)
	go t.Config.RightDrDoc.Travel(ctx, t)
	<-doneChan
	return docChanges

}

func (t *Changerator) GetDoctor() v3.Doctor {
	return t.Config.Doctor
}

func (t *Changerator) Visit(ctx context.Context, object any) {

	switch obj := object.(type) {
	case *v3.Document:
		t.VisitDocument(ctx, obj)
	case *v3.Info:
		t.VisitInfo(ctx, obj)
	case *v3.Server:
		PushChanges(ctx, obj, &whatChangedModel.ServerChanges{})
	case *v3.Contact:
		PushChanges(ctx, obj, &whatChangedModel.ContactChanges{})
	case *v3.License:
		PushChanges(ctx, obj, &whatChangedModel.LicenseChanges{})
	case *v3.Tag:
		PushChanges(ctx, obj, &whatChangedModel.TagChanges{})
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
		PushChanges(ctx, obj, &whatChangedModel.XMLChanges{})
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
		fmt.Printf("fuck off %v", obj)
		panic("MISSED SOMETHING")
	}
}
