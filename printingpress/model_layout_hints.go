package printingpress

import (
	"encoding/json"
	"math"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type modelLayoutHints struct {
	layoutMode           string
	propertyCount        int
	requiredCount        int
	estimatedBodyHeight  int
	estimatedSplitHeight int
}

func applyModelLayoutHints(page *ppmodel.ModelPage) {
	if page == nil || page.SchemaJSON == "" {
		return
	}

	hints := deriveModelLayoutHints(page.SchemaJSON, page.HasExamplePayload, page.MockJSON, page.Examples)
	page.LayoutMode = hints.layoutMode
	page.PropertyCount = hints.propertyCount
	page.RequiredCount = hints.requiredCount
	page.EstimatedBodyHeight = hints.estimatedBodyHeight
	page.EstimatedSplitHeight = hints.estimatedSplitHeight
}

func deriveModelLayoutHints(schemaJSON string, hasExample bool, mockJSON string, examples map[string]string) modelLayoutHints {
	var data map[string]any
	if err := json.Unmarshal([]byte(schemaJSON), &data); err != nil {
		return fallbackModelLayoutHints(hasExample, mockJSON, examples)
	}
	if !hasExample {
		hasExample = hasInlineExamples(data)
	}

	// Parameters and headers render as compact property grids, even when they
	// contain nested schema metadata.
	if _, ok := data["in"]; ok {
		return compactModelLayoutHints(data, hasExample, mockJSON, examples)
	}
	if _, hasSchema := data["schema"]; hasSchema && !hasObject(data["properties"]) {
		return compactModelLayoutHints(data, hasExample, mockJSON, examples)
	}

	propertyCount := len(objectKeys(data["properties"]))
	requiredCount := len(stringSlice(data["required"]))
	if schema := nestedObject(data, "schema"); schema != nil {
		propertyCount = maxInt(propertyCount, len(objectKeys(schema["properties"])))
		requiredCount = maxInt(requiredCount, len(stringSlice(schema["required"])))
	}

	compositionCount := len(arrayAny(data["allOf"])) + len(arrayAny(data["oneOf"])) + len(arrayAny(data["anyOf"]))
	isComplex := propertyCount > 0 || compositionCount > 0

	if !isComplex {
		bodyHeight := clampInt(160+exampleHeightEstimate(mockJSON, examples, hasExample)+countConstraintHints(data)*18, 180, 420)
		return modelLayoutHints{
			layoutMode:           "simple",
			propertyCount:        propertyCount,
			requiredCount:        requiredCount,
			estimatedBodyHeight:  bodyHeight,
			estimatedSplitHeight: bodyHeight,
		}
	}

	stackedHeight := 170 + maxInt(1, propertyCount)*44 + compositionCount*72 + exampleHeightEstimate(mockJSON, examples, hasExample)
	splitHeight := 260 + maxInt(1, propertyCount)*30 + compositionCount*56 + exampleHeightEstimate(mockJSON, examples, hasExample)/2

	layoutMode := "stacked"
	if hasExample {
		layoutMode = "split"
	}

	return modelLayoutHints{
		layoutMode:           layoutMode,
		propertyCount:        propertyCount,
		requiredCount:        requiredCount,
		estimatedBodyHeight:  clampInt(stackedHeight, 260, 1200),
		estimatedSplitHeight: clampInt(splitHeight, 320, 820),
	}
}

func compactModelLayoutHints(data map[string]any, hasExample bool, mockJSON string, examples map[string]string) modelLayoutHints {
	schema := nestedObject(data, "schema")
	propertyCount := len(objectKeys(schema["properties"]))
	requiredCount := len(stringSlice(schema["required"]))
	rowCount := 2 + boolInt(hasKey(data, "required")) + countConstraintHints(schema)
	if propertyCount > 0 {
		rowCount += propertyCount
	}
	bodyHeight := 120 + rowCount*28 + exampleHeightEstimate(mockJSON, examples, hasExample)/2
	bodyHeight = clampInt(bodyHeight, 160, 520)
	return modelLayoutHints{
		layoutMode:           "simple",
		propertyCount:        propertyCount,
		requiredCount:        requiredCount,
		estimatedBodyHeight:  bodyHeight,
		estimatedSplitHeight: bodyHeight,
	}
}

func fallbackModelLayoutHints(hasExample bool, mockJSON string, examples map[string]string) modelLayoutHints {
	bodyHeight := 240
	bodyHeight += exampleHeightEstimate(mockJSON, examples, hasExample)
	return modelLayoutHints{
		layoutMode:           "stacked",
		estimatedBodyHeight:  bodyHeight,
		estimatedSplitHeight: clampInt(bodyHeight, 320, 720),
	}
}

func exampleHeightEstimate(mockJSON string, examples map[string]string, hasExample bool) int {
	if !hasExample {
		return 0
	}
	maxLen := len(mockJSON)
	for _, example := range examples {
		maxLen = maxInt(maxLen, len(example))
	}
	switch {
	case maxLen > 6000:
		return 320
	case maxLen > 2500:
		return 260
	case maxLen > 900:
		return 220
	default:
		return 180
	}
}

func countConstraintHints(data map[string]any) int {
	keys := []string{"type", "format", "default", "minimum", "maximum", "minLength", "maxLength", "pattern", "enum"}
	count := 0
	for _, key := range keys {
		if hasKey(data, key) {
			count++
		}
	}
	return count
}

func hasInlineExamples(data map[string]any) bool {
	if hasKey(data, "example") || hasKey(data, "examples") {
		return true
	}
	if schema := nestedObject(data, "schema"); schema != nil {
		return hasKey(schema, "example") || hasKey(schema, "examples")
	}
	return false
}

func nestedObject(data map[string]any, keys ...string) map[string]any {
	current := data
	for _, key := range keys {
		next, ok := current[key].(map[string]any)
		if !ok {
			return nil
		}
		current = next
	}
	return current
}

func objectKeys(value any) []string {
	m, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	keys := make([]string, 0, len(m))
	for key := range m {
		keys = append(keys, key)
	}
	return keys
}

func stringSlice(value any) []string {
	items, ok := value.([]any)
	if !ok {
		return nil
	}
	out := make([]string, 0, len(items))
	for _, item := range items {
		if str, ok := item.(string); ok {
			out = append(out, str)
		}
	}
	return out
}

func arrayAny(value any) []any {
	items, ok := value.([]any)
	if !ok {
		return nil
	}
	return items
}

func hasObject(value any) bool {
	_, ok := value.(map[string]any)
	return ok
}

func hasKey(data map[string]any, key string) bool {
	if data == nil {
		return false
	}
	_, ok := data[key]
	return ok
}

func boolInt(value bool) int {
	if value {
		return 1
	}
	return 0
}

func clampInt(value, minValue, maxValue int) int {
	return int(math.Max(float64(minValue), math.Min(float64(maxValue), float64(value))))
}

func maxInt(left, right int) int {
	if left > right {
		return left
	}
	return right
}
