// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"sort"
	"strings"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type developerOperationPage struct {
	page      *ppmodel.OperationPage
	pathItem  *drV3.PathItem
	operation *drV3.Operation
}

type developerModelPage struct {
	page  *ppmodel.ModelPage
	owner drV3.Foundational
}

type developerPageTarget struct {
	href      string
	title     string
	kind      string
	method    string
	path      string
	operation string
	component string
}

type indexedDeveloperModelPage struct {
	ref   *developerModelPage
	order int
}

type developerPageIndex struct {
	operations map[drV3.Foundational]*developerOperationPage
	pathItems  map[drV3.Foundational][]*developerOperationPage
	models     map[drV3.Foundational]indexedDeveloperModelPage
}

type developerProblemMatches struct {
	operations []*developerOperationPage
	models     []*developerModelPage
}

func (pp *PrintingPress) registerDeveloperOperationPage(page *ppmodel.OperationPage, pathItem *drV3.PathItem, operation *drV3.Operation) {
	if !pp.developerModeEnabled() || page == nil || operation == nil {
		return
	}
	pp.devPageIndex = nil
	pp.devOperationPages = append(pp.devOperationPages, &developerOperationPage{
		page:      page,
		pathItem:  pathItem,
		operation: operation,
	})
}

func (pp *PrintingPress) registerDeveloperModelPage(page *ppmodel.ModelPage, owner drV3.Foundational) {
	if !pp.developerModeEnabled() || page == nil || owner == nil {
		return
	}
	if page.TypeSlug == typeSlugPathItems {
		return
	}
	pp.devPageIndex = nil
	pp.devModelPages = append(pp.devModelPages, &developerModelPage{
		page:  page,
		owner: owner,
	})
}

func (pp *PrintingPress) developerPageIndex() *developerPageIndex {
	if pp.devPageIndex == nil {
		pp.devPageIndex = pp.buildDeveloperPageIndex()
	}
	return pp.devPageIndex
}

func (pp *PrintingPress) buildDeveloperPageIndex() *developerPageIndex {
	index := &developerPageIndex{
		operations: make(map[drV3.Foundational]*developerOperationPage, len(pp.devOperationPages)),
		pathItems:  make(map[drV3.Foundational][]*developerOperationPage),
		models:     make(map[drV3.Foundational]indexedDeveloperModelPage, len(pp.devModelPages)),
	}
	for _, ref := range pp.devOperationPages {
		if ref == nil {
			continue
		}
		if ref.operation != nil {
			index.operations[ref.operation] = ref
		}
		if ref.pathItem != nil {
			index.pathItems[ref.pathItem] = append(index.pathItems[ref.pathItem], ref)
		}
	}
	for i, ref := range pp.devModelPages {
		if ref == nil || ref.owner == nil {
			continue
		}
		index.models[ref.owner] = indexedDeveloperModelPage{ref: ref, order: i}
	}
	return index
}

func (idx *developerPageIndex) matchResultOwner(owner drV3.Foundational) developerProblemMatches {
	if idx == nil || owner == nil {
		return developerProblemMatches{}
	}
	var operationRef *developerOperationPage
	var pathRefs []*developerOperationPage
	var operationAncestorSeen bool
	var modelRefs []indexedDeveloperModelPage

	for current := owner; current != nil; current = current.GetParent() {
		if _, ok := current.(*drV3.Operation); ok {
			operationAncestorSeen = true
			if operationRef == nil {
				operationRef = idx.operations[current]
			}
		}
		if !operationAncestorSeen && len(pathRefs) == 0 {
			pathRefs = idx.pathItems[current]
		}
		if indexed, ok := idx.models[current]; ok && indexed.ref != nil {
			modelRefs = append(modelRefs, indexed)
		}
	}
	models := orderedDeveloperModelPages(modelRefs)
	if operationRef != nil {
		return developerProblemMatches{operations: []*developerOperationPage{operationRef}, models: models}
	}
	if !operationAncestorSeen {
		return developerProblemMatches{operations: pathRefs, models: models}
	}
	return developerProblemMatches{models: models}
}

func orderedDeveloperModelPages(refs []indexedDeveloperModelPage) []*developerModelPage {
	if len(refs) == 0 {
		return nil
	}
	sort.SliceStable(refs, func(i, j int) bool {
		return refs[i].order < refs[j].order
	})
	models := make([]*developerModelPage, 0, len(refs))
	for _, ref := range refs {
		if ref.ref != nil {
			models = append(models, ref.ref)
		}
	}
	return models
}

func (pp *PrintingPress) pageForResult(result *drV3.RuleFunctionResult) (href, title string) {
	target := pp.pageTargetForResult(result)
	return target.href, target.title
}

func (pp *PrintingPress) pageTargetForResult(result *drV3.RuleFunctionResult) developerPageTarget {
	owner := resultOwner(result)
	if owner == nil {
		return pp.rootDeveloperTarget()
	}
	matches := pp.developerPageIndex().matchResultOwner(owner)
	if len(matches.operations) > 0 {
		return operationDeveloperTarget(matches.operations[0])
	}
	if len(matches.models) > 0 {
		return modelDeveloperTarget(matches.models[0])
	}
	return pp.rootDeveloperTarget()
}

func (pp *PrintingPress) rootDeveloperPageTarget() (href, title string) {
	target := pp.rootDeveloperTarget()
	return target.href, target.title
}

func (pp *PrintingPress) rootDeveloperTarget() developerPageTarget {
	title := "API Overview"
	if pp != nil && pp.site != nil && pp.site.Root != nil && strings.TrimSpace(pp.site.Root.Title) != "" {
		title = pp.site.Root.Title
	}
	return developerPageTarget{
		href:  pppaths.FileIndexHTML,
		title: title,
		kind:  "overview",
	}
}

func operationDeveloperTarget(ref *developerOperationPage) developerPageTarget {
	if ref == nil || ref.page == nil {
		return developerPageTarget{}
	}
	return developerPageTarget{
		href:      pppaths.OperationHTML(ref.page.Slug),
		title:     operationDeveloperTitle(ref.page),
		kind:      "operation",
		method:    ref.page.Method,
		path:      ref.page.Path,
		operation: ref.page.OperationID,
	}
}

func modelDeveloperTarget(ref *developerModelPage) developerPageTarget {
	if ref == nil || ref.page == nil {
		return developerPageTarget{}
	}
	return developerPageTarget{
		href:      pppaths.ModelHTML(ref.page.TypeSlug, ref.page.Slug),
		title:     ref.page.Name,
		kind:      "model",
		component: ref.page.ComponentType,
	}
}

func applyDeveloperPageTarget(problem *ppmodel.PageProblem, target developerPageTarget) {
	if problem == nil {
		return
	}
	problem.PageHref = target.href
	problem.PageTitle = target.title
	problem.PageKind = target.kind
	problem.PageMethod = target.method
	problem.PagePath = target.path
	problem.PageOperationID = target.operation
	problem.PageComponent = target.component
}

func resultOwner(result *drV3.RuleFunctionResult) drV3.Foundational {
	if result == nil || result.ParentObject == nil {
		return nil
	}
	owner, _ := result.ParentObject.(drV3.Foundational)
	return owner
}

func operationDeveloperTitle(page *ppmodel.OperationPage) string {
	if page == nil {
		return ""
	}
	if page.Summary != "" {
		return page.Summary
	}
	return strings.TrimSpace(page.Method + " " + page.Path)
}
