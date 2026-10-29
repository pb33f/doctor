package changerator

import wc "github.com/pb33f/libopenapi/what-changed/model"

// ChangeList is a borrowed flat view used by both comparison engines.
type ChangeList []*wc.Change

// GetAllChanges returns the existing view without allocating a copy.
func (c ChangeList) GetAllChanges() []*wc.Change { return c }

// GetPropertyChanges returns this flat view's direct changes.
func (c ChangeList) GetPropertyChanges() []*wc.Change { return c }

// PropertiesOnly is a no-op because a ChangeList contains only direct changes.
func (c ChangeList) PropertiesOnly() {}

// TotalChanges returns the number of changes in the view.
func (c ChangeList) TotalChanges() int { return len(c) }

// TotalBreakingChanges counts contract-breaking changes in the view.
func (c ChangeList) TotalBreakingChanges() int {
	n := 0
	for _, ch := range c {
		if ch.Breaking {
			n++
		}
	}
	return n
}
