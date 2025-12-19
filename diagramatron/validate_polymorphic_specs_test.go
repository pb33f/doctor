// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"os"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPolymorphicSpecs_ECommerce(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-ecommerce.yaml")
	require.NoError(t, err, "Should load e-commerce spec")

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err, "Should parse e-commerce spec")

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs, "Should build valid model")

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Render full document
	diagram := Mermaidify(context.Background(), drDoc.V3Document, DefaultMermaidConfig())
	result := diagram.Render()

	t.Logf("E-Commerce diagram has %d classes and %d relationships",
		len(diagram.Classes), len(diagram.Relationships))

	// Should have polymorphic payment placeholders
	assert.Contains(t, result, "CardPayment", "Should have CardPayment")
	assert.Contains(t, result, "BankTransferPayment", "Should have BankTransferPayment")
	assert.Contains(t, result, "DigitalWalletPayment", "Should have DigitalWalletPayment")

	// Should have polymorphic fulfillment
	assert.Contains(t, result, "ShippingFulfillment", "Should have ShippingFulfillment")
	assert.Contains(t, result, "PickupFulfillment", "Should have PickupFulfillment")

	// Should show inheritance relationships
	assert.Contains(t, result, "<|--", "Should have inheritance relationships")

	// Should have nested oneOf (shipping method within ShippingFulfillment)
	assert.Contains(t, result, "StandardShipping", "Should have StandardShipping variant")

	// Write output to file for visual inspection
	err = os.WriteFile("../test_specs/polymorphic-ecommerce-diagram.mmd", []byte(result), 0644)
	require.NoError(t, err, "Should write diagram file")
	t.Logf("E-Commerce diagram written to test_specs/polymorphic-ecommerce-diagram.mmd")
}

func TestPolymorphicSpecs_Notifications(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-notifications.yaml")
	require.NoError(t, err, "Should load notifications spec")

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err, "Should parse notifications spec")

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs, "Should build valid model")

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Render full document
	diagram := Mermaidify(context.Background(), drDoc.V3Document, DefaultMermaidConfig())
	result := diagram.Render()

	t.Logf("Notifications diagram has %d classes and %d relationships",
		len(diagram.Classes), len(diagram.Relationships))

	// Should have content type variants
	assert.Contains(t, result, "EmailContent", "Should have EmailContent")
	assert.Contains(t, result, "SMSContent", "Should have SMSContent")
	assert.Contains(t, result, "PushContent", "Should have PushContent")

	// Should have channel variants
	assert.Contains(t, result, "EmailChannel", "Should have EmailChannel")
	assert.Contains(t, result, "SMSChannel", "Should have SMSChannel")

	// Should have delivery response oneOf placeholder (now uses interface stereotype)
	assert.Contains(t, result, "<<interface>>", "Should have oneOf placeholder with interface stereotype")
	assert.Contains(t, result, "(oneOf)", "Should show (oneOf) indicator")

	// Should have anyOf options
	assert.Contains(t, result, "PriorityOptions", "Should have PriorityOptions")
	assert.Contains(t, result, "RetryOptions", "Should have RetryOptions")

	// Write output to file for visual inspection
	err = os.WriteFile("../test_specs/polymorphic-notifications-diagram.mmd", []byte(result), 0644)
	require.NoError(t, err, "Should write diagram file")
	t.Logf("Notifications diagram written to test_specs/polymorphic-notifications-diagram.mmd")
}

func TestPolymorphicSpecs_CMS(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-cms.yaml")
	require.NoError(t, err, "Should load CMS spec")

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err, "Should parse CMS spec")

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs, "Should build valid model")

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Render full document
	diagram := Mermaidify(context.Background(), drDoc.V3Document, DefaultMermaidConfig())
	result := diagram.Render()

	t.Logf("CMS diagram has %d classes and %d relationships",
		len(diagram.Classes), len(diagram.Relationships))

	// Should have content type variants
	assert.Contains(t, result, "ArticleContent", "Should have ArticleContent")
	assert.Contains(t, result, "VideoContent", "Should have VideoContent")
	assert.Contains(t, result, "GalleryContent", "Should have GalleryContent")

	// Should have block types for article body
	assert.Contains(t, result, "TextBlock", "Should have TextBlock")
	assert.Contains(t, result, "ImageBlock", "Should have ImageBlock")
	assert.Contains(t, result, "CodeBlock", "Should have CodeBlock")

	// Should have video source variants
	assert.Contains(t, result, "YouTubeVideo", "Should have YouTubeVideo")
	assert.Contains(t, result, "VimeoVideo", "Should have VimeoVideo")

	// Should have allOf composition
	assert.Contains(t, result, "ContentBase", "Should have ContentBase")
	assert.Contains(t, result, "<|--", "Should have inheritance")

	// Write output to file for visual inspection
	err = os.WriteFile("../test_specs/polymorphic-cms-diagram.mmd", []byte(result), 0644)
	require.NoError(t, err, "Should write diagram file")
	t.Logf("CMS diagram written to test_specs/polymorphic-cms-diagram.mmd")
}
