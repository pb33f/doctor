import {modelHref} from './doc-links.js';

export interface ComponentLinkData {
  name: string;
  componentType: string;
  typeSlug: string;
  slug: string;
}

export interface ResponseData {
  statusCode: string;
  description: string;
  descHtml?: string;
  content?: MediaTypeData[];
  headers?: Array<{name: string; description?: string; schemaType?: string; ref?: ComponentLinkData; example?: string; minimum?: number; maximum?: number; default?: string; enum?: string[]; pattern?: string; extensions?: Array<{key: string; value: any}>}>;
  links?: Array<{name: string; operationId?: string; operationSlug?: string; operationRef?: string; description?: string; ref?: ComponentLinkData}>;
  ref?: ComponentLinkData;
  rawJson?: string;
  rawYaml?: string;
  sourceLine?: number;
  location?: string;
  extensions?: Array<{key: string; value: any}>;
}

export interface MediaTypeData {
  mediaType: string;
  schemaJson: string;
  mockJson?: string;
  mockYaml?: string;
  mockXml?: string;
  examples?: Record<string, string>;
  schemaRef?: ComponentLinkData;
  isArray?: boolean;
  itemsRef?: ComponentLinkData;
  itemsSchemaJson?: string;
  extensions?: Array<{key: string; value: any}>;
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
  return {name, href: modelHref(typeSlug, sanitizeSlug(name))};
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

export interface ConstraintPart {
  label: string;
  value: any;
  isCode?: boolean;
}

export function collectConstraints(prop: any, opts?: {includeExample?: boolean}): ConstraintPart[] {
  if (!prop) return [];
  const parts: ConstraintPart[] = [];
  if (opts?.includeExample) {
    if (prop.example !== undefined) parts.push({label: 'example', value: JSON.stringify(prop.example)});
    if (prop.default !== undefined) parts.push({label: 'default', value: JSON.stringify(prop.default)});
  }
  if (prop.minimum !== undefined) parts.push({label: 'min', value: prop.minimum});
  if (prop.maximum !== undefined) parts.push({label: 'max', value: prop.maximum});
  if (prop.exclusiveMinimum !== undefined) parts.push({label: 'exclusiveMin', value: prop.exclusiveMinimum});
  if (prop.exclusiveMaximum !== undefined) parts.push({label: 'exclusiveMax', value: prop.exclusiveMaximum});
  if (prop.minLength !== undefined) parts.push({label: 'minLength', value: prop.minLength});
  if (prop.maxLength !== undefined) parts.push({label: 'maxLength', value: prop.maxLength});
  if (prop.minItems !== undefined) parts.push({label: 'minItems', value: prop.minItems});
  if (prop.maxItems !== undefined) parts.push({label: 'maxItems', value: prop.maxItems});
  if (prop.uniqueItems) parts.push({label: 'uniqueItems', value: 'true'});
  if (prop.pattern) parts.push({label: 'pattern', value: prop.pattern, isCode: true});
  if (prop.multipleOf !== undefined) parts.push({label: 'multipleOf', value: prop.multipleOf});
  return parts;
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
