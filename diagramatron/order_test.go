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

func TestECommerce_OrderSchema(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-ecommerce.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Get Order schema
	schema := drDoc.V3Document.Components.Schemas.GetOrZero("Order")
	require.NotNil(t, schema)

	// Render just the Order schema
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), schema, config)
	result := diagram.Render()

	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have OrderItem class
	assert.Contains(t, result, "class OrderItem", "Should have OrderItem class")

	// 2. Order.items should be OrderItem[] type
	assert.Contains(t, result, "OrderItem[]", "Order.items should be OrderItem array type")

	// 3. Should show relationship to OrderItem
	assert.Contains(t, result, "Order *-- OrderItem : items 0..*", "Should have relationship to OrderItem")

	// 4. Polymorphic properties should show union type notation (# means required/protected)
	assert.Contains(t, result, "#CardPayment | BankTransferPayment | DigitalWalletPayment payment", "Payment should be union type (required)")
	assert.Contains(t, result, "#ShippingFulfillment | PickupFulfillment | DigitalFulfillment fulfillment", "Fulfillment should be union type (required)")

	// 5. Should show relationships to all payment variants
	assert.Contains(t, result, "Order --> CardPayment : payment", "Should relate to CardPayment")
	assert.Contains(t, result, "Order --> BankTransferPayment : payment", "Should relate to BankTransferPayment")
	assert.Contains(t, result, "Order --> DigitalWalletPayment : payment", "Should relate to DigitalWalletPayment")

	// 6. Should show relationships to all fulfillment variants
	assert.Contains(t, result, "Order --> ShippingFulfillment : fulfillment", "Should relate to ShippingFulfillment")
	assert.Contains(t, result, "Order --> PickupFulfillment : fulfillment", "Should relate to PickupFulfillment")
	assert.Contains(t, result, "Order --> DigitalFulfillment : fulfillment", "Should relate to DigitalFulfillment")

	// 7. OrderItem should show its own polymorphism
	assert.Contains(t, result, "OrderItem --> PhysicalProduct : product", "OrderItem should relate to PhysicalProduct")
	assert.Contains(t, result, "OrderItem --> DigitalProduct : product", "OrderItem should relate to DigitalProduct")
	assert.Contains(t, result, "OrderItem --> ServiceProduct : product", "OrderItem should relate to ServiceProduct")

	// 8. Should have all the nested referenced classes
	assert.Contains(t, result, "class PhysicalProduct", "Should have PhysicalProduct")
	assert.Contains(t, result, "class Dimensions", "Should have Dimensions")
	assert.Contains(t, result, "class Address", "Should have Address")
}
