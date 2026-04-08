package terminal

import (
	"bytes"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPrintBanner_WritesProductMetadata(t *testing.T) {
	var buf bytes.Buffer

	PrintBanner(BannerOptions{
		Writer:      &buf,
		Palette:     PaletteForTheme(ThemeDark),
		ProductName: "printing-press",
		ProductURL:  "https://pb33f.io/printing-press/",
		Version:     "v1.2.3",
		Date:        "Tue, 08 Apr 2026 12:00:00 EDT",
	})

	output := buf.String()
	require.NotEmpty(t, output)
	assert.Contains(t, output, "https://pb33f.io/printing-press/")
	assert.Contains(t, output, "printing-press version: v1.2.3")
	assert.Contains(t, output, "compiled: Tue, 08 Apr 2026 12:00:00 EDT")
	assert.Contains(t, output, "@@@@@@@")
	assert.True(t, strings.HasSuffix(output, "\n\n"))
}
