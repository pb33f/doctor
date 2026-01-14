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

	// 2. Should have Card and Bank_Account classes (oneOf variants)
	// Note: "Bank Account" title gets sanitized to "Bank_Account"
	assert.Contains(t, result, "class Card", "Should have Card variant class")
	assert.Contains(t, result, "class Bank_Account", "Should have Bank_Account variant class")

	// 3. Should NOT create a placeholder for property-level oneOf
	assert.NotContains(t, result, "<<oneOf>>", "Should not create placeholder for property-level oneOf")
	assert.NotContains(t, result, "Source_Choice", "Should not create placeholder")

	// 4. Should show direct relationships from BookingPayment to both variants
	assert.Contains(t, result, "BookingPayment --> Card : source", "Should have relationship to Card")
	assert.Contains(t, result, "BookingPayment --> Bank_Account : source", "Should have relationship to Bank_Account")

	// 5. Should have union type annotation for the source property
	assert.Contains(t, result, "Card | Bank_Account", "Should have union type annotation")

	// 6. Should have normal properties on BookingPayment
	assert.Contains(t, result, "id", "Should have id property")
	assert.Contains(t, result, "amount", "Should have amount property")
	assert.Contains(t, result, "status", "Should have status property")
}

func TestPolymorphism_SchemaLevelOneOf(t *testing.T) {
	// Test schema-level oneOf - creates placeholder class with inheritance to variants
	specYaml := `
openapi: 3.1.0
info:
  title: Schema Level OneOf Test
  version: 1.0.0
paths: {}
components:
  schemas:
    PaymentResponse:
      oneOf:
        - $ref: '#/components/schemas/PaymentSucceeded'
        - $ref: '#/components/schemas/PaymentPending'
      discriminator:
        propertyName: status
    PaymentSucceeded:
      type: object
      properties:
        id:
          type: string
          format: uuid
        status:
          type: string
          const: succeeded
        amount:
          type: number
      required:
        - id
        - status
    PaymentPending:
      type: object
      properties:
        id:
          type: string
          format: uuid
        status:
          type: string
          const: pending
        retryAfter:
          type: integer
      required:
        - id
        - status
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// Get the PaymentResponse schema (schema-level oneOf)
	paymentResponse := drDoc.V3Document.Components.Schemas.GetOrZero("PaymentResponse")
	require.NotNil(t, paymentResponse)

	// render the schema
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), paymentResponse, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// expectations for schema-level oneOf:
	// 1. Should create a placeholder with _Choice suffix
	assert.Contains(t, result, "PaymentResponse_Choice", "Should have placeholder with _Choice suffix")
	assert.Contains(t, result, "<<interface>>", "Placeholder should use interface stereotype (renders in Mermaid)")
	assert.Contains(t, result, "(oneOf)", "Placeholder should show (oneOf) indicator")

	// 2. Should have variant classes
	assert.Contains(t, result, "class PaymentSucceeded", "Should have PaymentSucceeded variant")
	assert.Contains(t, result, "class PaymentPending", "Should have PaymentPending variant")

	// 3. Should show inheritance from placeholder to variants
	assert.Contains(t, result, "PaymentResponse_Choice <|-- PaymentSucceeded", "Should inherit to PaymentSucceeded")
	assert.Contains(t, result, "PaymentResponse_Choice <|-- PaymentPending", "Should inherit to PaymentPending")

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

func TestPolymorphism_PropertyLevelAllOf(t *testing.T) {
	// Test property-level allOf - a property that is an allOf of multiple schemas
	// This is different from schema-level allOf (inheritance pattern)
	specYaml := `
openapi: 3.1.0
info:
  title: Property AllOf Test
  version: 1.0.0
paths: {}
components:
  schemas:
    Response:
      type: object
      properties:
        links:
          allOf:
            - $ref: '#/components/schemas/Links-Self'
            - $ref: '#/components/schemas/Links-Pagination'
    Links-Self:
      type: object
      properties:
        self:
          type: string
          format: uri
    Links-Pagination:
      type: object
      properties:
        next:
          type: string
          format: uri
        prev:
          type: string
          format: uri
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	response := drDoc.V3Document.Components.Schemas.GetOrZero("Response")
	require.NotNil(t, response)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), response, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have Response class with links property showing allOf type
	assert.Contains(t, result, "class Response", "Should have Response class")
	assert.Contains(t, result, "allOf? links", "Should show allOf type for links property")

	// 2. Should have Links-Self and Links-Pagination classes
	assert.Contains(t, result, "class Links_Self", "Should have Links_Self class")
	assert.Contains(t, result, "class Links_Pagination", "Should have Links_Pagination class")

	// 3. Should NOT create a placeholder for property-level allOf
	assert.NotContains(t, result, "<<allOf>>", "Should not create placeholder for property-level allOf")
	assert.NotContains(t, result, "Links_Union", "Should not create placeholder")
	assert.NotContains(t, result, "Links_Choice", "Should not create placeholder")

	// 4. Should show composition relationships from Response to both allOf members
	assert.Contains(t, result, "Response *-- Links_Self : links", "Should have composition relationship to Links_Self")
	assert.Contains(t, result, "Response *-- Links_Pagination : links", "Should have composition relationship to Links_Pagination")

	// 5. Should have 3 classes total (Response, Links_Self, Links_Pagination)
	assert.Equal(t, 3, len(diagram.Classes), "Should have exactly 3 classes")

	// 6. Should have 2 composition relationships
	assert.Equal(t, 2, len(diagram.Relationships), "Should have exactly 2 composition relationships")

	// 7. Links classes should have their properties
	assert.Contains(t, result, "self", "Links_Self should have self property")
	assert.Contains(t, result, "next", "Links_Pagination should have next property")
	assert.Contains(t, result, "prev", "Links_Pagination should have prev property")
}

// TestPolymorphism_SingleOptionAnyOf_NullableRef tests the common OAS 3.0 pattern
// where anyOf with a single $ref is used to represent a nullable reference.
// e.g., anyOf: [{$ref: '#/components/schemas/Foo'}] with nullable: true
func TestPolymorphism_SingleOptionAnyOf_NullableRef(t *testing.T) {
	specYaml := `
openapi: "3.1.0"
info:
  title: Nullable Reference Test
  version: "1.0"
paths: {}
components:
  schemas:
    Account:
      type: object
      properties:
        id:
          type: string
        business_profile:
          anyOf:
            - $ref: '#/components/schemas/BusinessProfile'
          nullable: true
          description: Business information about the account
        settings:
          oneOf:
            - $ref: '#/components/schemas/AccountSettings'
          nullable: true
    BusinessProfile:
      type: object
      properties:
        name:
          type: string
        url:
          type: string
          format: uri
    AccountSettings:
      type: object
      properties:
        timezone:
          type: string
        locale:
          type: string
`

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	account := drDoc.V3Document.Components.Schemas.GetOrZero("Account")
	require.NotNil(t, account)

	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), account, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// 1. Should have Account class
	assert.Contains(t, result, "class Account", "Should have Account class")

	// 2. Should have BusinessProfile and AccountSettings classes (pulled in via nullable refs)
	assert.Contains(t, result, "class BusinessProfile", "Should have BusinessProfile class")
	assert.Contains(t, result, "class AccountSettings", "Should have AccountSettings class")

	// 3. business_profile should show typed reference, not 'any'
	assert.Contains(t, result, "BusinessProfile? business_profile", "Should show typed nullable reference for business_profile")
	assert.NotContains(t, result, "any business_profile", "Should NOT show 'any' for single-option anyOf")
	assert.NotContains(t, result, "anyOf? business_profile", "Should NOT show 'anyOf' for single-option anyOf")

	// 4. settings should also show typed reference (single-option oneOf)
	assert.Contains(t, result, "AccountSettings? settings", "Should show typed nullable reference for settings")
	assert.NotContains(t, result, "any settings", "Should NOT show 'any' for single-option oneOf")
	assert.NotContains(t, result, "oneOf? settings", "Should NOT show 'oneOf' for single-option oneOf")

	// 5. Should have composition relationships from Account to both nullable refs
	assert.Contains(t, result, "Account *-- BusinessProfile : business_profile", "Should have composition relationship to BusinessProfile")
	assert.Contains(t, result, "Account *-- AccountSettings : settings", "Should have composition relationship to AccountSettings")

	// 6. Should have 3 classes total
	assert.Equal(t, 3, len(diagram.Classes), "Should have exactly 3 classes (Account, BusinessProfile, AccountSettings)")

	// 7. Should have 2 relationships
	assert.Equal(t, 2, len(diagram.Relationships), "Should have exactly 2 relationships")
}

