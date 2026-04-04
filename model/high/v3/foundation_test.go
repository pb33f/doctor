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
