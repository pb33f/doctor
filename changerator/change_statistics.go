// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"fmt"
	"github.com/pb33f/libopenapi/what-changed/model"
)

type ChangeStatistics struct {
	Additions     int
	Modifications int
	Deletions     int
}

func (t *Changerator) Calculatoratron() *ChangeStatistics {
	stats := &ChangeStatistics{}
	seen := make(map[string]*model.Change)
	if len(t.ChangedNodes) > 0 {
		for i := range t.ChangedNodes {

			c := t.ChangedNodes[i].Changes
			for _, cw := range c {
				for _, ch := range cw.GetAllChanges() {
					ctx := ch.Context
					var hash string
					if ctx != nil {
						hash = fmt.Sprintf("%d:%d:%d:%d", ctx.OriginalColumn, ctx.NewColumn, ctx.OriginalLine, ctx.OriginalColumn)
					}
					_, ok := seen[hash]

					if hash != "" && ok {
						continue // seen
					}

					switch ch.ChangeType {
					case model.Modified:
						stats.Modifications++
					case model.ObjectRemoved, model.PropertyRemoved:
						stats.Deletions++
					case model.ObjectAdded, model.PropertyAdded:
						stats.Additions++
					}
					if hash != "" {
						seen[hash] = ch
					}
				}
			}
		}
	}
	return stats
}
