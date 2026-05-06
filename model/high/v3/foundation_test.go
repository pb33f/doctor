package v3

import (
	"testing"

	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
)

func TestFoundation_GetSize_NoChanges(t *testing.T) {
	f := &Foundation{}
	h, w := f.GetSize()
	assert.Equal(t, HEIGHT, h)
	assert.Equal(t, WIDTH, w)
}

func TestFoundation_GetSize_WithPropertyChanges(t *testing.T) {
	changes := &wcModel.TagChanges{
		PropertyChanges: wcModel.NewPropertyChanges([]*wcModel.Change{
			{Property: "name", ChangeType: wcModel.Modified},
		}),
	}
	nc := &NodeChange{}
	nc.SetChanges(changes)
	f := &Foundation{Changes: []*NodeChange{nc}}

	h, w := f.GetSize()
	assert.Equal(t, HEIGHT*2, h, "should add HEIGHT for property changes")
	assert.Equal(t, WIDTH, w)
}

func TestFoundation_GetSize_WithNodeChanges(t *testing.T) {
	// simulates the changerator pushing changes directly to Node.Changes
	// (as happens for document-level Tags container nodes)
	node := &Node{}
	changes := &wcModel.TagChanges{
		PropertyChanges: wcModel.NewPropertyChanges([]*wcModel.Change{
			{Property: "tags", ChangeType: wcModel.ObjectAdded},
		}),
	}
	node.Changes = append(node.Changes, changes)

	f := &Foundation{Node: node}

	h, w := f.GetSize()
	assert.Equal(t, HEIGHT*2, h, "should add HEIGHT when Node has changes")
	assert.Equal(t, WIDTH, w)
}

func TestFoundation_GetSize_EmptyPropertyChanges(t *testing.T) {
	changes := &wcModel.TagChanges{
		PropertyChanges: wcModel.NewPropertyChanges(nil),
	}
	nc := &NodeChange{}
	nc.SetChanges(changes)
	f := &Foundation{Changes: []*NodeChange{nc}}

	h, _ := f.GetSize()
	assert.Equal(t, HEIGHT, h, "should not add HEIGHT for empty property changes")
}

func TestFoundation_GetSize_OnlyAddsHeightOnce(t *testing.T) {
	// both Foundation.Changes and Node.Changes have entries;
	// should only add HEIGHT once
	changes := &wcModel.TagChanges{
		PropertyChanges: wcModel.NewPropertyChanges([]*wcModel.Change{
			{Property: "x", ChangeType: wcModel.Modified},
		}),
	}
	nc := &NodeChange{}
	nc.SetChanges(changes)

	node := &Node{}
	node.Changes = append(node.Changes, changes)

	f := &Foundation{
		Changes: []*NodeChange{nc},
		Node:    node,
	}

	h, _ := f.GetSize()
	assert.Equal(t, HEIGHT*2, h, "should only add HEIGHT once even with both change sources")
}

func TestFoundation_GetSize_NodeChangesOnly_NoPropertyChanges(t *testing.T) {
	// Node has changes appended directly but Foundation.Changes is empty.
	// This is the document-level Tags container scenario where the
	// changerator appends to the Node directly.
	node := &Node{}
	changes := &wcModel.TagChanges{}
	node.Changes = append(node.Changes, changes)

	f := &Foundation{Node: node}

	h, _ := f.GetSize()
	assert.Equal(t, HEIGHT*2, h, "should add HEIGHT when Node has changes even without property changes")
}

func TestFoundation_GetSize_PreservesCalculatedNodeWidth(t *testing.T) {
	node := &Node{
		Width: calculateGraphNodeWidth("Security Requirements", "security", true, 1),
	}
	f := &Foundation{Node: node}

	h, w := f.GetSize()

	assert.Equal(t, HEIGHT, h)
	assert.Equal(t, node.Width, w)
	assert.GreaterOrEqual(t, w, 330, "GetSize should not collapse calculated title widths back to the default")
	assert.LessOrEqual(t, w, 380, "GetSize should preserve a tight calculated width")
}

func TestCalculateGraphNodeWidth_AccountsForTitleControls(t *testing.T) {
	withoutControls := calculateGraphNodeWidth("Security Requirements", "security", false, 0)
	withControls := calculateGraphNodeWidth("Security Requirements", "security", true, 1)

	assert.Greater(t, withControls, withoutControls)
	assert.GreaterOrEqual(t, withControls, 330, "array/container title rows need room for label, icon, count, and expand control")
	assert.LessOrEqual(t, withControls, 380, "array/container title rows should not over-expand")
}

func TestCalculateGraphNodeWidth_SpecialCaseWidthsAreMinimums(t *testing.T) {
	assert.GreaterOrEqual(t, calculateGraphNodeWidth("Security Schemes", "securitySchemes", false, 0), 230)
	assert.Greater(t,
		calculateGraphNodeWidth("Very Long Security Schemes Container", "securitySchemes", false, 0),
		230,
	)
}

func TestFoundation_AddRuleFunctionResult_ReparentsCopiedResult(t *testing.T) {
	source := &Foundation{}
	receiver := &Foundation{}
	result := &RuleFunctionResult{ParentObject: source}

	receiver.AddRuleFunctionResult(result)

	assert.Same(t, receiver, result.ParentObject)
	assert.Len(t, receiver.RuleResults, 1)
	assert.Same(t, result, receiver.RuleResults[0])
}

func TestFoundation_AddRuleFunctionResult_ReparentsSameDocumentDifferentReceiver(t *testing.T) {
	root := &Foundation{}
	root.SetPathSegment("$")
	source := &Foundation{Parent: root}
	source.SetPathSegment("source")
	receiver := &Foundation{Parent: root}
	receiver.SetPathSegment("receiver")
	result := &RuleFunctionResult{ParentObject: source}

	receiver.AddRuleFunctionResult(result)

	assert.Same(t, receiver, result.ParentObject)
	assert.Len(t, receiver.RuleResults, 1)
	assert.Same(t, result, receiver.RuleResults[0])
}

func TestFoundation_AddRuleFunctionResult_ReparentsCopiedResultWithSamePath(t *testing.T) {
	sourceRoot := &Foundation{}
	sourceRoot.SetPathSegment("$")
	source := &Foundation{Parent: sourceRoot}
	source.SetPathSegment("same")

	receiverRoot := &Foundation{}
	receiverRoot.SetPathSegment("$")
	receiver := &Foundation{Parent: receiverRoot}
	receiver.SetPathSegment("same")

	assert.Equal(t, source.GenerateJSONPath(), receiver.GenerateJSONPath())
	result := &RuleFunctionResult{ParentObject: source}

	receiver.AddRuleFunctionResult(result)

	assert.Same(t, receiver, result.ParentObject)
	assert.Len(t, receiver.RuleResults, 1)
	assert.Same(t, result, receiver.RuleResults[0])
}

func TestFoundation_AddRuleFunctionResult_RootAggregationKeepsChildParent(t *testing.T) {
	root := &Foundation{}
	child := &Foundation{Parent: root}
	result := &RuleFunctionResult{}

	child.AddRuleFunctionResult(result)

	assert.Same(t, child, result.ParentObject)
	assert.Len(t, child.RuleResults, 1)
	assert.Len(t, root.RuleResults, 1)
	assert.Same(t, result, child.RuleResults[0])
	assert.Same(t, result, root.RuleResults[0])
	assert.NotSame(t, root, result.ParentObject)
}
