import {LitElement, html, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import operationResponsesCss from './operation-responses.css.js';

interface ComponentLinkData {
  name: string;
  componentType: string;
  typeSlug: string;
  slug: string;
}

interface MediaTypeData {
  mediaType: string;
  schemaJson: string;
  mockJson?: string;
  examples?: Record<string, string>;
  schemaRef?: ComponentLinkData;
}

interface ResponseData {
  statusCode: string;
  description: string;
  content?: MediaTypeData[];
  headers?: Record<string, string>;
  ref?: ComponentLinkData;
  rawJson?: string;
  rawYaml?: string;
  sourceLine?: number;
}

function getSchemaType(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'array' && prop.items) {
    const itemType = prop.items.type || prop.items.$ref?.split('/').pop() || 'any';
    return `array<${itemType}>`;
  }
  if (prop.type) {
    let t = Array.isArray(prop.type) ? prop.type.join(' | ') : prop.type;
    if (prop.format) t += ` (${prop.format})`;
    return t;
  }
  if (prop.oneOf) return 'oneOf';
  if (prop.anyOf) return 'anyOf';
  if (prop.allOf) return 'allOf';
  if (prop.$ref) return prop.$ref.split('/').pop();
  return '';
}

/** Return the nested schema to recurse into, if any. */
function getNestedSchema(prop: any): any | null {
  if (!prop) return null;
  // object with properties
  if (prop.properties) return prop;
  // array whose items have properties
  if (prop.type === 'array' && prop.items?.properties) return prop.items;
  return null;
}

@customElement('pp-operation-responses')
export class PpOperationResponses extends LitElement {
  static styles = [sharedCss, operationResponsesCss];

  @property({attribute: 'responses-json'}) responsesJson = '';
  @state() private responses: ResponseData[] = [];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('responsesJson') && this.responsesJson) {
      try {
        this.responses = JSON.parse(this.responsesJson);
      } catch {
        this.responses = [];
      }
    }
  }

  private renderProperty(name: string, prop: any, required: Set<string>, depth: number): TemplateResult {
    const type = getSchemaType(prop);
    const nested = getNestedSchema(prop);
    const isArrayItems = prop?.type === 'array' && nested;

    return html`
      <div class="property">
        <span class="prop-name">${name}</span>
        ${type ? html`<span class="prop-type">${type}</span>` : nothing}
        ${required.has(name)
          ? html`<span class="required-badge">required</span>`
          : nothing}
        ${prop.description
          ? html`<div class="prop-desc">${prop.description}</div>`
          : nothing}
        ${prop.enum
          ? html`<div class="enum-values">Enum: ${prop.enum.map((v: string, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${v}</span>`)}</div>`
          : nothing}
      </div>
      ${nested && depth < 4
        ? html`
            <div class="nested">
              ${isArrayItems ? html`<div class="items-label">items</div>` : nothing}
              ${this.renderSchemaProperties(nested, depth + 1)}
            </div>
          `
        : nothing}
    `;
  }

  private renderSchemaProperties(schema: any, depth = 0) {
    if (!schema) return nothing;

    const properties = schema.properties || {};
    const required = new Set<string>(schema.required || []);
    const propEntries = Object.entries(properties);

    if (!propEntries.length) {
      const t = getSchemaType(schema);
      return t ? html`<div class="schema-type">Type: ${t}</div>` : nothing;
    }

    return propEntries.map(([name, prop]: [string, any]) =>
      this.renderProperty(name, prop, required, depth)
    );
  }

  private renderMediaType(mt: MediaTypeData) {
    if (mt.schemaRef) {
      return html`
        <div class="media-type-ref">
          <span class="media-type-label">${mt.mediaType}</span>
          <a class="ref-link" href="models/${mt.schemaRef.typeSlug}/${mt.schemaRef.slug}.html">
            ${mt.schemaRef.name}
          </a>
        </div>
      `;
    }
    if (!mt.schemaJson) return nothing;
    let schema: any;
    try {
      schema = JSON.parse(mt.schemaJson);
    } catch {
      return nothing;
    }
    const hasExamples = mt.mockJson || (mt.examples && Object.keys(mt.examples).length > 0);
    return html`
      <div class="media-type-label">${mt.mediaType}</div>
      ${this.renderSchemaProperties(schema)}
      ${hasExamples
        ? html`<pp-example-selector
            mock-json=${mt.mockJson || ''}
            examples-json=${mt.examples ? JSON.stringify(mt.examples) : ''}>
          </pp-example-selector>`
        : nothing}
    `;
  }

  private renderResponse(resp: ResponseData) {
    return html`
      <div class="response">
        <h4>
          <span class="status-code">${resp.statusCode}</span>
          ${resp.description}
          ${resp.rawJson || resp.rawYaml
            ? html`<pp-raw-viewer-btn
                title="Response ${resp.statusCode}"
                raw-json=${resp.rawJson || ''}
                raw-yaml=${resp.rawYaml || ''}
                start-line=${resp.sourceLine || 1}>
              </pp-raw-viewer-btn>`
            : nothing}
        </h4>
        ${resp.ref
          ? html`<a class="ref-link" href="models/${resp.ref.typeSlug}/${resp.ref.slug}.html">${resp.ref.name}</a>`
          : resp.content?.map(mt => this.renderMediaType(mt)) ?? nothing}
      </div>
    `;
  }

  render() {
    if (!this.responses.length) return nothing;

    return html`
      <h3>Responses</h3>
      ${this.responses.map(r => this.renderResponse(r))}
    `;
  }
}
