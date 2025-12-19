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

func TestECommerce_CreateOrderRequest(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-ecommerce.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Get CreateOrderRequest schema
	schema := drDoc.V3Document.Components.Schemas.GetOrZero("CreateOrderRequest")
	require.NotNil(t, schema)

	// Render
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), schema, config)
	result := diagram.Render()

	t.Logf("Generated diagram:\n%s", result)

	// 1. Should NOT have duplicate lowercase classes
	assert.NotContains(t, result, "class dimensions {", "Should not have lowercase dimensions class")
	assert.NotContains(t, result, "class address {", "Should not have lowercase address class")

	// 2. Should have proper PascalCase component classes
	assert.Contains(t, result, "class Dimensions", "Should have Dimensions component class")
	assert.Contains(t, result, "class Address", "Should have Address component class")

	// 3. Property types for oneOf should be 'oneOf'
	assert.Contains(t, result, "+oneOf? payment", "Payment should be oneOf type")
	assert.Contains(t, result, "+oneOf? fulfillment", "Fulfillment should be oneOf type")

	// 4. Should NOT have generated type names
	assert.NotContains(t, result, "schemas_CreateOrderRequest_Payment", "Should not have generated payment type name")
	assert.NotContains(t, result, "schemas_CreateOrderRequest_Fulfillment", "Should not have generated fulfillment type name")

	// 5. Property types for $refs should use schema names
	assert.Contains(t, result, "+OrderItem[]? items", "Items should be OrderItem array type")
	assert.Contains(t, result, "+GiftOptions? gift_options", "Gift options should be GiftOptions type")

	// 6. Nested $refs should use schema names (PhysicalProduct.dimensions)
	assert.Contains(t, result, "class PhysicalProduct", "Should have PhysicalProduct")
	assert.Contains(t, result, "+Dimensions? dimensions", "PhysicalProduct.dimensions should be Dimensions type")

	// 7. Should show proper relationships
	assert.Contains(t, result, "CreateOrderRequest --> CardPayment : payment", "Should relate to CardPayment")
	assert.Contains(t, result, "CreateOrderRequest --> ShippingFulfillment : fulfillment", "Should relate to ShippingFulfillment")
	assert.Contains(t, result, "PhysicalProduct *-- Dimensions : dimensions", "PhysicalProduct should compose Dimensions")
	assert.Contains(t, result, "CardPayment *-- Address : billing_address", "CardPayment should compose Address")

	// 8. Should show inheritance for payment/fulfillment types
	assert.Contains(t, result, "PaymentBase <|-- CardPayment : extends", "CardPayment should extend PaymentBase")
	assert.Contains(t, result, "FulfillmentBase <|-- ShippingFulfillment : extends", "ShippingFulfillment should extend FulfillmentBase")

	// 9. AnyOf customization should show multiple relationships
	assert.Contains(t, result, "OrderItem --> Engraving : customization", "Should relate to Engraving")
	assert.Contains(t, result, "OrderItem --> GiftWrap : customization", "Should relate to GiftWrap")
	assert.Contains(t, result, "OrderItem --> CustomMessage : customization", "Should relate to CustomMessage")

	// 10. Property type for anyOf should be 'anyOf'
	assert.Contains(t, result, "+anyOf? customization", "Customization should be anyOf type")
}
