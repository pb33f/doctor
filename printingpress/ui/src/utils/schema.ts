export interface ComponentLinkData {
  name: string;
  componentType: string;
  typeSlug: string;
  slug: string;
}

const refSegmentToTypeSlug: Record<string, string> = {
  schemas: 'schemas',
  responses: 'responses',
  parameters: 'parameters',
  requestBodies: 'request-bodies',
  headers: 'headers',
  securitySchemes: 'security',
  examples: 'examples',
  links: 'links',
  callbacks: 'callbacks',
  pathItems: 'path-items',
};

export function sanitizeSlug(input: string): string {
  let s = input.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  s = s.toLowerCase();
  s = s.replace(/[/]/g, '-').replace(/[{}_.]/g, '-').replace(/ /g, '-');
  s = s.replace(/[^a-z0-9-]/g, '');
  s = s.replace(/-{2,}/g, '-');
  s = s.replace(/^-|-$/g, '');
  return s || 'unnamed';
}

export interface RefLink {
  name: string;
  href: string;
}

export function resolveRefLink(ref: string): RefLink | null {
  if (!ref || !ref.startsWith('#/components/')) return null;
  const parts = ref.replace('#/components/', '').split('/');
  if (parts.length !== 2) return null;
  const [segment, name] = parts;
  const typeSlug = refSegmentToTypeSlug[segment];
  if (!typeSlug) return null;
  return {name, href: `models/${typeSlug}/${sanitizeSlug(name)}.html`};
}

export function extractEnumValues(schemaJson: string): string[] | null {
  if (!schemaJson) return null;
  try {
    const s = JSON.parse(schemaJson);
    return Array.isArray(s.enum) ? s.enum : null;
  } catch {
    return null;
  }
}

export function deriveSchemaTypeFromJson(schemaJson: string): string {
  if (!schemaJson) return '';
  try {
    return deriveSchemaType(JSON.parse(schemaJson));
  } catch {
    return '';
  }
}

export function deriveSchemaType(schema: any): string {
  if (!schema) return '';
  if (schema.type === 'array' && schema.items) {
    const itemType = schema.items.type || schema.items.$ref?.split('/').pop() || 'any';
    return `Array<${itemType}>`;
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
