package printingpress

import (
	"os"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestPrintingPress_WriteHTMLSite_RejectsRelativeBaseURL(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	outputDir := t.TempDir()
	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc, Title: "Burger Shop"})
	site, err := pp.pressSite()
	require.NoError(t, err)

	err = WriteHTMLSite(site, outputDir, "docs")
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrInvalidBaseURL)
	assert.Contains(t, err.Error(), "absolute path starting with '/' or an absolute URL with scheme and host")
}
