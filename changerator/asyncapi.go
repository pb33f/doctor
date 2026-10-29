package changerator

import (
	"fmt"
	"sort"

	dr "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libasyncapi"
	asyncChanges "github.com/pb33f/libasyncapi/what-changed"
	asyncModel "github.com/pb33f/libasyncapi/what-changed/model"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// AsyncAPIResult owns the source graphs and native change report for one comparison.
type AsyncAPIResult struct {
	Changerator *Changerator
	Changes     *asyncModel.DocumentChanges
	Left, Right *dr.AsyncDocument
}

// Preserve distinct edits to the same property (for example enum additions and
// removals), while collapsing repeated comparisons through shared references.
type asyncNodeChangeKey struct {
	node                                   *v3.Node
	property, original, modified           string
	originalEncoded, newEncoded, reference string
	changeType                             int
	breaking                               bool
}

// CompareAsyncAPI compares complete parsed documents using AsyncAPI rules and
// distributes their changes into doctor's shared node graph.
func CompareAsyncAPI(left, right libasyncapi.Document, config *asyncModel.BreakingRulesConfig) (*AsyncAPIResult, error) {
	if left == nil || right == nil || left.IsPartial() || right.IsPartial() {
		return nil, fmt.Errorf("complete AsyncAPI documents required")
	}
	changes := asyncChanges.CompareDocumentsWithConfig(left, right, config)
	if changes == nil {
		return nil, nil
	}
	l, err := dr.NewAsyncDocument(left)
	if err != nil {
		return nil, err
	}
	r, err := dr.NewAsyncDocument(right)
	if err != nil {
		l.Release()
		return nil, err
	}
	result := &AsyncAPIResult{Changes: changes, Left: l, Right: r}
	all := changes.GetAllChanges()
	scopes := make(map[*wc.Change]string, len(all))
	asyncChangeScopes(scopes, changes.ChannelChanges, "$.channels")
	asyncChangeScopes(scopes, changes.OperationChanges, "$.operations")
	asyncChangeScopes(scopes, changes.ServerChanges, "$.servers")
	if c := changes.ComponentsChanges; c != nil {
		asyncChangeScopes(scopes, c.SchemaChanges, "$.components.schemas")
		asyncChangeScopes(scopes, c.ChannelChanges, "$.components.channels")
		asyncChangeScopes(scopes, c.OperationChanges, "$.components.operations")
		asyncChangeScopes(scopes, c.ServerChanges, "$.components.servers")
		asyncChangeScopes(scopes, c.MessageChanges, "$.components.messages")
		asyncChangeScopes(scopes, c.SecuritySchemeChanges, "$.components.securitySchemes")
		asyncChangeScopes(scopes, c.ServerVariableChanges, "$.components.serverVariables")
		asyncChangeScopes(scopes, c.ParameterChanges, "$.components.parameters")
		asyncChangeScopes(scopes, c.CorrelationIDChanges, "$.components.correlationIds")
		asyncChangeScopes(scopes, c.ReplyChanges, "$.components.replies")
		asyncChangeScopes(scopes, c.ReplyAddressChanges, "$.components.replyAddresses")
		asyncChangeScopes(scopes, c.ExternalDocChanges, "$.components.externalDocs")
		asyncChangeScopes(scopes, c.TagChanges, "$.components.tags")
		asyncChangeScopes(scopes, c.OperationTraitChanges, "$.components.operationTraits")
		asyncChangeScopes(scopes, c.MessageTraitChanges, "$.components.messageTraits")
		asyncChangeScopes(scopes, c.ServerBindingsChanges, "$.components.serverBindings")
		asyncChangeScopes(scopes, c.ChannelBindingsChanges, "$.components.channelBindings")
		asyncChangeScopes(scopes, c.OperationBindingsChanges, "$.components.operationBindings")
		asyncChangeScopes(scopes, c.MessageBindingsChanges, "$.components.messageBindings")
	}
	nodesByPath := make(map[string]*v3.Node, len(r.Nodes))
	for _, n := range r.Nodes {
		nodesByPath[n.Id] = n
	}
	// Native reports retain repeated reference comparisons; node timelines do not.
	attached := make(map[asyncNodeChangeKey]bool)
	for _, ch := range all {
		n, path := r.LocateChange(ch, true, scopes[ch])
		old, oldPath := l.LocateChange(ch, false, scopes[ch])
		origin := ""
		if n != nil {
			origin = n.OriginLocation
			nodesByPath[n.Id] = n
		}
		if n == nil {
			n, path = old, oldPath
			if n != nil {
				origin = n.OriginLocation
			}
			if n != nil {
				if current := nodesByPath[n.Id]; current != nil {
					n = current
				}
			}
		}
		if n == nil {
			result.Release()
			return nil, fmt.Errorf("cannot locate AsyncAPI change to %q", ch.Property)
		}
		ch.Path = path
		ch.Type = n.Type
		if ch.Context != nil {
			ch.Context.DocumentLocation = origin
		}
		key := asyncNodeChangeKey{
			node: n, property: ch.Property, original: ch.Original, modified: ch.New,
			originalEncoded: ch.OriginalEncoded, newEncoded: ch.NewEncoded,
			reference: ch.Reference, changeType: ch.ChangeType, breaking: ch.Breaking,
		}
		if attached[key] {
			continue
		}
		attached[key] = true
		n.AppendChange(ChangeList{ch})
		n.RenderedChanges = append(n.RenderedChanges, ch)
		n.CleanedChanged = append(n.CleanedChanged, ch)
	}
	sort.SliceStable(all, func(i, j int) bool {
		if all[i].Path != all[j].Path {
			return all[i].Path < all[j].Path
		}
		return all[i].Property < all[j].Property
	})
	ctr := NewChangerator(&ChangeratorConfig{})
	ctr.ChangeReport = changes
	ctr.Changes = all
	ctr.ChangedNodes = r.Nodes
	ctr.ChangedEdges = r.Edges
	// Retain removed branches and their old-side source locations.
	known := make(map[string]bool, len(r.Nodes))
	for _, n := range r.Nodes {
		known[n.Id] = true
	}
	removed := false
	for _, n := range l.Nodes {
		if !known[n.Id] {
			removed = true
			ctr.ChangedNodes = append(ctr.ChangedNodes, n)
			if known[n.ParentId] {
				if p := nodesByPath[n.ParentId]; p != nil {
					p.Children = append(p.Children, n)
				}
			}
			nodesByPath[n.Id] = n
		}
	}
	// Keep containment into removed branches and references from removed sites.
	// A surviving site may have a new target, so its old reference must not return.
	if removed {
		edgeIDs := make(map[string]bool, len(ctr.ChangedEdges))
		for _, edge := range ctr.ChangedEdges {
			edgeIDs[edge.Id] = true
		}
		for _, edge := range l.Edges {
			source, target := edge.Sources[0], edge.Targets[0]
			if !edgeIDs[edge.Id] && (!known[source] || (!known[target] && nodesByPath[target].ParentId == source)) {
				ctr.ChangedEdges = append(ctr.ChangedEdges, edge)
				edgeIDs[edge.Id] = true
			}
		}
	}
	result.Changerator = ctr
	return result, nil
}

func asyncChangeScopes[T interface{ GetAllChanges() []*wc.Change }](scopes map[*wc.Change]string, children map[string]T, path string) {
	for key, child := range children {
		path := dr.AsyncObjectPath(path, key)
		for _, change := range child.GetAllChanges() {
			scopes[change] = path
		}
		asyncNestedScopes(scopes, child, path)
	}
}

func asyncNestedScopes(scopes map[*wc.Change]string, tree any, path string) {
	switch c := tree.(type) {
	case *asyncModel.ChannelChanges:
		asyncChangeScopes(scopes, c.MessageChanges, path+".messages")
		asyncChangeScopes(scopes, c.ParameterChanges, path+".parameters")
	case *asyncModel.ServerChanges:
		asyncChangeScopes(scopes, c.ServerVariableChanges, path+".variables")
	case *asyncModel.MessageChanges:
		asyncNestedScopes(scopes, c.PayloadChanges, path+".payload")
		asyncNestedScopes(scopes, c.HeadersChanges, path+".headers")
	case *wc.SchemaChanges:
		if c == nil {
			return
		}
		asyncChangeScopes(scopes, c.SchemaPropertyChanges, path+".properties")
		asyncChangeScopes(scopes, c.DependentSchemasChanges, path+".dependentSchemas")
		asyncChangeScopes(scopes, c.PatternPropertiesChanges, path+".patternProperties")
		for _, entry := range []struct {
			name  string
			value *wc.SchemaChanges
		}{{"items", c.ItemsChanges}, {"additionalProperties", c.AdditionalPropertiesChanges}, {"not", c.NotChanges}, {"if", c.IfChanges}, {"then", c.ThenChanges}, {"else", c.ElseChanges}, {"contains", c.ContainsChanges}, {"propertyNames", c.PropertyNamesChanges}, {"unevaluatedItems", c.UnevaluatedItemsChanges}, {"unevaluatedProperties", c.UnevaluatedPropertiesChanges}, {"contentSchema", c.ContentSchemaChanges}} {
			asyncNestedScopes(scopes, entry.value, path+"."+entry.name)
		}
	}
}

// Release releases both source graphs and native change references.
func (r *AsyncAPIResult) Release() {
	if r != nil {
		r.Left.Release()
		r.Right.Release()
		r.Left = nil
		r.Right = nil
		r.Changes = nil
		r.Changerator = nil
	}
}
