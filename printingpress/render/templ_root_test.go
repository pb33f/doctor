package render

import (
	"bytes"
	"context"
	"strings"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func TestRootPageAsyncAPIOperationUsesSharedActionAndPathRenderers(t *testing.T) {
	destination := "smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured"
	tests := []struct {
		action string
		code   string
	}{
		{action: "receive", code: "RCV"},
		{action: "send", code: "SND"},
	}

	for _, tt := range tests {
		t.Run(tt.action, func(t *testing.T) {
			op := &ppmodel.NavOperation{
				SpecKind: ppmodel.SpecKindValueAsyncAPI,
				Method:   tt.action,
				Path:     destination,
				Slug:     tt.action + "-light-measurement",
			}

			var buf bytes.Buffer
			if err := RootOperationItem(op, "").Render(context.Background(), &buf); err != nil {
				t.Fatalf("render root operation: %v", err)
			}

			html := buf.String()
			actionMarkup := `<pp-asyncapi-action action="` + tt.action + `" size="small">`
			pathMarkup := `<pb33f-render-operation-path path="` + destination + `"></pb33f-render-operation-path>`
			actionIndex := strings.Index(html, actionMarkup)
			pathIndex := strings.Index(html, pathMarkup)
			if actionIndex < 0 || pathIndex < 0 || actionIndex >= pathIndex {
				t.Fatalf("expected action before rendered destination, got:\n%s", html)
			}
			if !strings.Contains(html, `<span>`+tt.code+`</span>`) {
				t.Fatalf("expected %s action code, got:\n%s", tt.code, html)
			}
			for _, unwanted := range []string{
				`<pb33f-http-method`,
				`<code>` + destination + `</code>`,
			} {
				if strings.Contains(html, unwanted) {
					t.Fatalf("did not expect AsyncAPI root operation to contain %q: %s", unwanted, html)
				}
			}
		})
	}
}
