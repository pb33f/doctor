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

interface HeaderData {
  name: string;
  description?: string;
  schemaType?: string;
  ref?: ComponentLinkData;
  example?: string;
  minimum?: number;
  maximum?: number;
  default?: string;
  enum?: string[];
  pattern?: string;
}

interface ResponseData {
  statusCode: string;
  description: string;
  content?: MediaTypeData[];
  headers?: HeaderData[];
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
  if (prop.properties) return prop;
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

  private renderRefLink(ref: ComponentLinkData) {
    return html`<a class="ref-link" href="models/${ref.typeSlug}/${ref.slug}.html">\u279c ${ref.name}</a>`;
  }

  private renderMediaType(mt: MediaTypeData) {
    if (mt.schemaRef) {
      return html`
        <div class="media-type-ref">
          <span class="media-type-label">${mt.mediaType}</span>
          ${this.renderRefLink(mt.schemaRef)}
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

  private computeCommonHeaders(): { common: HeaderData[], commonNames: Set<string> } {
    const counts = new Map<string, number>();
    const first = new Map<string, HeaderData>();
    for (const resp of this.responses) {
      for (const h of resp.headers ?? []) {
        counts.set(h.name, (counts.get(h.name) ?? 0) + 1);
        if (!first.has(h.name)) first.set(h.name, h);
      }
    }
    const common: HeaderData[] = [];
    const commonNames = new Set<string>();
    for (const [name, count] of counts) {
      if (count >= 2) {
        common.push(first.get(name)!);
        commonNames.add(name);
      }
    }
    return { common, commonNames };
  }

  private scrollToHeader(name: string) {
    const el = document.getElementById('header-' + name);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private renderHeaderConstraints(h: HeaderData) {
    const has = h.example !== undefined || h.minimum !== undefined || h.maximum !== undefined
      || h.default !== undefined || h.pattern || h.enum?.length;
    if (!has) return nothing;
    return html`
      <div class="header-constraints">
        ${h.example !== undefined ? html`<span class="constraint-label">example</span><span class="constraint-value">${h.example}</span>` : nothing}
        ${h.default !== undefined ? html`<span class="constraint-label">default</span><span class="constraint-value">${h.default}</span>` : nothing}
        ${h.minimum !== undefined ? html`<span class="constraint-label">min</span><span class="constraint-value">${h.minimum}</span>` : nothing}
        ${h.maximum !== undefined ? html`<span class="constraint-label">max</span><span class="constraint-value">${h.maximum}</span>` : nothing}
        ${h.pattern ? html`<span class="constraint-label">pattern</span><span class="constraint-value"><code>${h.pattern}</code></span>` : nothing}
        ${h.enum?.length ? html`<span class="constraint-label">enum</span><span class="constraint-value">${h.enum.map((v, i) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${v}</span>`)}</span>` : nothing}
      </div>
    `;
  }

  private renderHeaderEntry(h: HeaderData) {
    return html`
      <div class="header-entry">
        ${h.ref
          ? html`<a class="ref-link header-name" href="models/${h.ref.typeSlug}/${h.ref.slug}.html">\u279c ${h.name}</a>`
          : html`<span class="header-name">${h.name}</span>`}
        ${h.schemaType ? html`<span class="header-type">${h.schemaType}</span>` : nothing}
        ${h.description ? html`<div class="header-desc">${h.description}</div>` : nothing}
        ${this.renderHeaderConstraints(h)}
      </div>
    `;
  }

  private renderHeaders(headers: HeaderData[], commonNames: Set<string>) {
    if (!headers || !headers.length) return nothing;
    const unique = headers.filter(h => !commonNames.has(h.name));
    const common = headers.filter(h => commonNames.has(h.name));
    if (!unique.length && !common.length) return nothing;
    return html`
      <div class="headers-section">
        <div class="headers-label">Headers</div>
        ${common.length ? html`
          <div class="common-header-links">
            <span class="common-link-label">\u2191 common:</span>
            ${common.map(h => html`<a class="header-anchor" @click=${(e: Event) => { e.preventDefault(); this.scrollToHeader(h.name); }}>${h.name}</a>`)}
          </div>
        ` : nothing}
        ${unique.map(h => this.renderHeaderEntry(h))}
      </div>
    `;
  }

  private renderResponse(resp: ResponseData, commonNames: Set<string>) {
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
          ? this.renderRefLink(resp.ref)
          : resp.content?.map(mt => this.renderMediaType(mt)) ?? nothing}
        ${this.renderHeaders(resp.headers ?? [], commonNames)}
      </div>
    `;
  }

  render() {
    if (!this.responses.length) return nothing;
    const { commonNames } = this.computeCommonHeaders();

    return html`
      <h3>Responses</h3>
      ${this.responses.map(r => this.renderResponse(r, commonNames))}
    `;
  }
}
