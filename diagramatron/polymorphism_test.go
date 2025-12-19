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

func TestPolymorphism_PropertyLevelOneOf(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Get the BookingPayment schema (has oneOf in source property)
	bookingPayment := drDoc.V3Document.Components.Schemas.GetOrZero("BookingPayment")
	require.NotNil(t, bookingPayment)

	// render from the schema
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), bookingPayment, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// expectations for property-level oneOf:
	// 1. Should have BookingPayment class
	assert.Contains(t, result, "class BookingPayment", "Should have BookingPayment class")

	// 2. Should have Card and BankAccount classes (oneOf variants)
	assert.Contains(t, result, "class Card", "Should have Card variant class")
	assert.Contains(t, result, "class BankAccount", "Should have BankAccount variant class")

	// 3. Should NOT create a placeholder for property-level oneOf
	assert.NotContains(t, result, "<<oneOf>>", "Should not create placeholder for property-level oneOf")
	assert.NotContains(t, result, "Source_Choice", "Should not create placeholder")

	// 4. Should show direct relationships from BookingPayment to both variants
	assert.Contains(t, result, "BookingPayment --> Card : source", "Should have relationship to Card")
	assert.Contains(t, result, "BookingPayment --> BankAccount : source", "Should have relationship to BankAccount")

	// 5. Should have normal properties on BookingPayment
	assert.Contains(t, result, "id", "Should have id property")
	assert.Contains(t, result, "amount", "Should have amount property")
	assert.Contains(t, result, "status", "Should have status property")
}

func TestPolymorphism_SchemaLevelOneOf(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Get POST /bookings/{bookingId}/payment 200 response (oneOf at schema level)
	paths := drDoc.V3Document.Paths
	paymentPath := paths.PathItems.GetOrZero("/bookings/{bookingId}/payment")
	require.NotNil(t, paymentPath)

	postOp := paymentPath.Post
	require.NotNil(t, postOp)

	response200 := postOp.Responses.Codes.GetOrZero("200")
	require.NotNil(t, response200)

	jsonContent := response200.Content.GetOrZero("application/json")
	require.NotNil(t, jsonContent)

	schema := jsonContent.SchemaProxy
	require.NotNil(t, schema)

	// render the schema
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), schema, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// expectations for schema-level oneOf:
	// 1. Should create a placeholder with _Choice suffix
	assert.Contains(t, result, "CreateBookingPayment200Response_Choice", "Should have placeholder with _Choice suffix")
	assert.Contains(t, result, "<<interface>>", "Placeholder should use interface stereotype (renders in Mermaid)")
	assert.Contains(t, result, "(oneOf)", "Placeholder should show (oneOf) indicator")

	// 2. Should have variant classes
	assert.Contains(t, result, "class PaymentSucceeded", "Should have PaymentSucceeded variant")
	assert.Contains(t, result, "class PaymentPending", "Should have PaymentPending variant")

	// 3. Should show inheritance from placeholder to variants
	assert.Contains(t, result, "CreateBookingPayment200Response_Choice <|-- PaymentSucceeded", "Should inherit to PaymentSucceeded")
	assert.Contains(t, result, "CreateBookingPayment200Response_Choice <|-- PaymentPending", "Should inherit to PaymentPending")

	// 4. Variant classes should have discriminator property (status with const value)
	assert.Contains(t, result, "status", "Variants should have status discriminator")
}

func TestPolymorphism_InlineAnyOfWithTitles(t *testing.T) {
	// Test inline anyOf with titled schemas - these should be rendered as separate classes
	specYaml := `
openapi: 3.1.0
info:
  title: Inline AnyOf Test
  version: 1.0.0
paths: {}
components:
  schemas:
    BookingPayment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        amount:
          type: number
        source:
          anyOf:
            - title: Card
              type: object
              properties:
                object:
                  type: string
                  const: card
                name:
                  type: string
                number:
                  type: string
              required:
                - name
                - number
            - title: BankAccount
              type: object
              properties:
                object:
                  type: string
                  const: bank_account
                name:
                  type: string
                account_number:
                  type: string
              required:
                - name
                - account_number
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	bookingPayment := drDoc.V3Document.Components.Schemas.GetOrZero("BookingPayment")
	require.NotNil(t, bookingPayment)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), bookingPayment, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have BookingPayment class
	assert.Contains(t, result, "class BookingPayment", "Should have BookingPayment class")

	// 2. Should have Card and BankAccount classes (inline anyOf variants with titles)
	assert.Contains(t, result, "class Card", "Should have Card variant class from inline anyOf with title")
	assert.Contains(t, result, "class BankAccount", "Should have BankAccount variant class from inline anyOf with title")

	// 3. Should have 3 classes total
	assert.Equal(t, 3, len(diagram.Classes), "Should have exactly 3 classes (BookingPayment, Card, BankAccount)")

	// 4. Should show relationships from BookingPayment to both variants
	assert.Contains(t, result, "BookingPayment --> Card : source", "Should have relationship to Card")
	assert.Contains(t, result, "BookingPayment --> BankAccount : source", "Should have relationship to BankAccount")

	// 5. Should have 2 relationships
	assert.Equal(t, 2, len(diagram.Relationships), "Should have exactly 2 relationships")

	// 6. Inline variant classes should have their properties
	assert.Contains(t, result, "object", "Card should have object property")
	assert.Contains(t, result, "name", "Card should have name property")
	assert.Contains(t, result, "number", "Card should have number property")
	assert.Contains(t, result, "account_number", "BankAccount should have account_number property")
}

func TestPolymorphism_InlineAllOfWithTitles(t *testing.T) {
	// Test inline allOf with titled schemas - these should be rendered as separate classes with inheritance
	specYaml := `
openapi: 3.1.0
info:
  title: Inline AllOf Test
  version: 1.0.0
paths: {}
components:
  schemas:
    ExtendedPayment:
      allOf:
        - title: BasePayment
          type: object
          properties:
            id:
              type: string
              format: uuid
            amount:
              type: number
          required:
            - id
            - amount
        - title: PaymentExtras
          type: object
          properties:
            metadata:
              type: object
            notes:
              type: string
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	extendedPayment := drDoc.V3Document.Components.Schemas.GetOrZero("ExtendedPayment")
	require.NotNil(t, extendedPayment)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), extendedPayment, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have ExtendedPayment class
	assert.Contains(t, result, "class ExtendedPayment", "Should have ExtendedPayment class")

	// 2. Should have BasePayment and PaymentExtras classes (inline allOf variants with titles)
	assert.Contains(t, result, "class BasePayment", "Should have BasePayment class from inline allOf with title")
	assert.Contains(t, result, "class PaymentExtras", "Should have PaymentExtras class from inline allOf with title")

	// 3. Should have 3 classes total
	assert.Equal(t, 3, len(diagram.Classes), "Should have exactly 3 classes (ExtendedPayment, BasePayment, PaymentExtras)")

	// 4. Should show inheritance relationships
	assert.Contains(t, result, "BasePayment <|-- ExtendedPayment : extends", "Should inherit from BasePayment")
	assert.Contains(t, result, "PaymentExtras <|-- ExtendedPayment : extends", "Should inherit from PaymentExtras")

	// 5. Should have 2 inheritance relationships
	assert.Equal(t, 2, len(diagram.Relationships), "Should have exactly 2 inheritance relationships")

	// 6. Base classes should have their properties
	assert.Contains(t, result, "id", "BasePayment should have id property")
	assert.Contains(t, result, "amount", "BasePayment should have amount property")
	assert.Contains(t, result, "metadata", "PaymentExtras should have metadata property")
	assert.Contains(t, result, "notes", "PaymentExtras should have notes property")
}

func TestPolymorphism_InlineWithoutTitles_UsesIndexedIDs(t *testing.T) {
	// Test inline composition without titles - should use indexed IDs to avoid collisions
	specYaml := `
openapi: 3.1.0
info:
  title: Inline Without Titles Test
  version: 1.0.0
paths: {}
components:
  schemas:
    Payment:
      type: object
      properties:
        source:
          anyOf:
            - type: object
              properties:
                card_number:
                  type: string
            - type: object
              properties:
                account_number:
                  type: string
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	payment := drDoc.V3Document.Components.Schemas.GetOrZero("Payment")
	require.NotNil(t, payment)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), payment, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have Payment class
	assert.Contains(t, result, "class Payment", "Should have Payment class")

	// 2. Should have 3 classes total (Payment + 2 indexed inline variants)
	assert.Equal(t, 3, len(diagram.Classes), "Should have exactly 3 classes (Payment + 2 inline variants)")

	// 3. Should have 2 relationships
	assert.Equal(t, 2, len(diagram.Relationships), "Should have exactly 2 relationships")

	// 4. Both inline variants should have their properties (no collision)
	assert.Contains(t, result, "card_number", "First variant should have card_number")
	assert.Contains(t, result, "account_number", "Second variant should have account_number")
}

func TestPolymorphism_ConfigDisabled_FlattensAllInline(t *testing.T) {
	// Test with RenderTitledInlineSchema disabled - should flatten all inline schemas
	specYaml := `
openapi: 3.1.0
info:
  title: Config Disabled Test
  version: 1.0.0
paths: {}
components:
  schemas:
    ExtendedPayment:
      allOf:
        - title: BasePayment
          type: object
          properties:
            id:
              type: string
            amount:
              type: number
        - title: PaymentExtras
          type: object
          properties:
            notes:
              type: string
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	extendedPayment := drDoc.V3Document.Components.Schemas.GetOrZero("ExtendedPayment")
	require.NotNil(t, extendedPayment)

	// Disable titled inline schema rendering
	config := DefaultMermaidConfig()
	config.RenderTitledInlineSchema = false

	diagram := Mermaidify(context.Background(), extendedPayment, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have ExtendedPayment class
	assert.Contains(t, result, "class ExtendedPayment", "Should have ExtendedPayment class")

	// 2. Should NOT have BasePayment or PaymentExtras as separate classes (config disabled)
	assert.NotContains(t, result, "class BasePayment", "Should NOT have BasePayment class when config disabled")
	assert.NotContains(t, result, "class PaymentExtras", "Should NOT have PaymentExtras class when config disabled")

	// 3. Should have only 1 class (all flattened into ExtendedPayment)
	assert.Equal(t, 1, len(diagram.Classes), "Should have only 1 class when config disabled")

	// 4. ExtendedPayment should have all properties flattened into it
	assert.Contains(t, result, "id", "Should have flattened id property")
	assert.Contains(t, result, "amount", "Should have flattened amount property")
	assert.Contains(t, result, "notes", "Should have flattened notes property")
}

