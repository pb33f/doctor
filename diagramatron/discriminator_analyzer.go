// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type DiscriminatorInfo struct {
	PropertyName string
	Mapping      map[string]string
	Implicit     bool // true if mapping inferred rather than explicitly defined
	BaseSchema   string
}

type discriminatorAnalyzer struct {
	cache *Cache[string, *DiscriminatorInfo]
}

func NewDiscriminatorAnalyzer() *discriminatorAnalyzer {
	return &discriminatorAnalyzer{
		cache: NewCache[string, *DiscriminatorInfo](128, 0.2),
	}
}

func (da *discriminatorAnalyzer) AnalyzeDiscriminator(schema *v3.Schema, getID func(any) string) *DiscriminatorInfo {
	if schema == nil {
		return nil
	}

	schemaID := getID(schema)

	if cached, exists := da.cache.Get(schemaID); exists {
		return cached
	}

	if schema.Discriminator == nil || schema.Discriminator.Value == nil || schema.Discriminator.Value.PropertyName == "" {
		return nil
	}

	disc := schema.Discriminator.Value

	info := &DiscriminatorInfo{
		PropertyName: disc.PropertyName,
		Mapping:      make(map[string]string),
		BaseSchema:   schemaID,
	}

	if disc.Mapping != nil && disc.Mapping.Len() > 0 {
		for pair := disc.Mapping.First(); pair != nil; pair = pair.Next() {
			info.Mapping[pair.Key()] = pair.Value()
		}
		info.Implicit = false
	} else {
		// infer mapping from oneOf/anyOf when not explicitly provided
		info.Mapping = da.DetectImplicitMapping(schema, getID)
		info.Implicit = true
	}

	da.cache.Set(schemaID, info)
	return info
}

func (da *discriminatorAnalyzer) DetectImplicitMapping(schema *v3.Schema, getID func(any) string) map[string]string {
	mapping := make(map[string]string)

	if schema == nil {
		return mapping
	}

	var compositionSchemas []*v3.SchemaProxy
	if schema.OneOf != nil && len(schema.OneOf) > 0 {
		compositionSchemas = schema.OneOf
	} else if schema.AnyOf != nil && len(schema.AnyOf) > 0 {
		compositionSchemas = schema.AnyOf
	}

	if len(compositionSchemas) == 0 {
		return mapping
	}

	discriminatorProp := schema.Discriminator.Value.PropertyName

	for _, subSchemaProxy := range compositionSchemas {
		if subSchemaProxy == nil {
			continue
		}

		schemaRef := getID(subSchemaProxy)
		discriminatorValue := da.extractDiscriminatorValueFromProxy(subSchemaProxy, discriminatorProp, getID)

		if discriminatorValue != "" {
			mapping[discriminatorValue] = schemaRef
		} else if subSchemaProxy.Value != nil && subSchemaProxy.Value.IsReference() {
			// fallback to schema name when value cannot be determined
			ref := subSchemaProxy.Value.GetReference()
			schemaName := ExtractSchemaNameFromReference(ref)
			mapping[schemaName] = schemaRef
		}
	}

	return mapping
}

func (da *discriminatorAnalyzer) extractDiscriminatorValueFromProxy(proxy *v3.SchemaProxy, propName string, getID func(any) string) string {
	if proxy == nil || proxy.Schema == nil {
		return ""
	}

	if proxy.Schema.Value != nil && proxy.Schema.Value.Properties != nil {
		for pair := proxy.Schema.Value.Properties.First(); pair != nil; pair = pair.Next() {
			if pair.Key() == propName {
				propSchemaProxy := pair.Value()
				value := da.extractDiscriminatorValue(propSchemaProxy)
				if value != "" {
					return value
				}
				break
			}
		}
	}

	// recursively check allOf schemas
	if proxy.Schema.AllOf != nil && len(proxy.Schema.AllOf) > 0 {
		for _, allOfProxy := range proxy.Schema.AllOf {
			value := da.extractDiscriminatorValueFromProxy(allOfProxy, propName, getID)
			if value != "" {
				return value
			}
		}
	}

	return ""
}

func (da *discriminatorAnalyzer) extractDiscriminatorValue(propProxy *base.SchemaProxy) string {
	if propProxy == nil {
		return ""
	}

	schema := propProxy.Schema()
	if schema == nil {
		return ""
	}

	if schema.Enum != nil && len(schema.Enum) == 1 {
		if schema.Enum[0] != nil {
			return schema.Enum[0].Value
		}
	}

	if schema.Const != nil {
		return schema.Const.Value
	}

	return ""
}

func (da *discriminatorAnalyzer) ClearCache() {
	da.cache.Clear()
}

func (da *discriminatorAnalyzer) GetDiscriminatorForProperty(schema *v3.Schema, propertyName string, getID func(any) string) *DiscriminatorInfo {
	info := da.AnalyzeDiscriminator(schema, getID)
	if info != nil && info.PropertyName == propertyName {
		return info
	}
	return nil
}
