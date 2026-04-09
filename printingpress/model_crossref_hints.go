package printingpress

import ppmodel "github.com/pb33f/doctor/printingpress/model"

func applyModelCrossRefHints(page *ppmodel.ModelPage) {
	if page == nil || page.CrossRefs == nil {
		return
	}

	operationCount := len(page.CrossRefs.UsedByOperations)
	componentCount := len(page.CrossRefs.UsedByModels) + len(page.CrossRefs.UsesModels)
	totalItems := operationCount + componentCount
	if totalItems == 0 {
		return
	}

	height := 0
	if operationCount > 0 {
		height += estimateRefListHeight(operationCount, true)
	}
	if len(page.CrossRefs.UsedByModels) > 0 {
		height += estimateRefListHeight(len(page.CrossRefs.UsedByModels), false)
	}
	if len(page.CrossRefs.UsesModels) > 0 {
		height += estimateRefListHeight(len(page.CrossRefs.UsesModels), false)
	}
	page.EstimatedCrossRefsHeight = height
}

func estimateRefListHeight(count int, operations bool) int {
	if count <= 0 {
		return 0
	}
	headingHeight := 56
	toolbarHeight := 0
	visibleRows := count
	if count > 20 {
		toolbarHeight = 54
		visibleRows = 20
	}
	rowHeight := 30
	if !operations {
		rowHeight = 26
	}
	paginatorHeight := 40
	return headingHeight + toolbarHeight + visibleRows*rowHeight + paginatorHeight
}
