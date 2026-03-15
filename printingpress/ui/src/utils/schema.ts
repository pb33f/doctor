export interface ComponentLinkData {
  name: string;
  componentType: string;
  typeSlug: string;
  slug: string;
}

export function deriveSchemaType(schema: any): string {
  if (!schema) return '';
  if (schema.type === 'array' && schema.items) {
    const itemType = schema.items.type || schema.items.$ref?.split('/').pop() || 'any';
    return `array<${itemType}>`;
  }
  if (schema.type) {
    let t = Array.isArray(schema.type) ? schema.type.join(' | ') : schema.type;
    if (schema.format) t += ` (${schema.format})`;
    return t;
  }
  if (schema.oneOf) return 'oneOf';
  if (schema.anyOf) return 'anyOf';
  if (schema.allOf) return 'allOf';
  if (schema.$ref) return schema.$ref.split('/').pop() ?? '';
  return '';
}
