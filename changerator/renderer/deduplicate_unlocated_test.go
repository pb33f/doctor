package renderer

import (
	"testing"

	"github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/require"
)

func TestDeduplicateChanges_UnlocatedChangesUseSourcePosition(t *testing.T) {
	line, column, otherLine := 21, 43, 30
	first := &model.Change{Property: "enum", ChangeType: model.PropertyAdded, New: "c",
		Context: &model.ChangeContext{NewLine: &line, NewColumn: &column}}
	repeat := *first
	repeat.Context = &model.ChangeContext{NewLine: &line, NewColumn: &column}
	elsewhere := *first
	elsewhere.Context = &model.ChangeContext{NewLine: &otherLine, NewColumn: &column}
	noContext := &model.Change{Property: "enum", ChangeType: model.PropertyAdded, New: "c"}
	noContextAgain := *noContext

	result := DeduplicateChanges([]*model.Change{first, &repeat, &elsewhere, noContext, &noContextAgain})

	require.Len(t, result, 4, "a repeat at one position collapses; positions and unknowns stay apart")
	require.Same(t, first, result[0])
}
