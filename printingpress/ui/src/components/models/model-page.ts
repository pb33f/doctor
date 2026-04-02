import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import constraintsCss from '../../styles/constraints.css.js';
import modelPageCss from './model-page.css.js';
import '../shared/inline-code.js';
import '../shared/code-viewer.js';
import '../shared/schema-properties.js';
import '../shared/example-selector.js';

import {collectConstraints} from '../../utils/schema.js';

@customElement('pp-model-page')
export class PpModelPage extends LitElement {
  static styles = [sharedCss, constraintsCss, modelPageCss];

  @property({attribute: 'model-json'}) modelJson = '';
  @property() name = '';
  @property({attribute: 'raw-yaml'}) rawYaml = '';
  @property({attribute: 'schema-raw-yaml'}) schemaRawYaml = '';
  @property({attribute: 'schema-raw-json'}) schemaRawJson = '';
  @property({attribute: 'schema-start-line', type: Number}) schemaStartLine = 1;
  @property({attribute: 'start-line', type: Number}) startLine = 1;
  @property() location = '';
  @property({attribute: 'mock-json'}) mockJson = '';
  @state() private parsed: any = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('modelJson') && this.modelJson) {
      try {
        this.parsed = JSON.parse(this.modelJson);
      } catch {
        this.parsed = null;
      }
    }
  }

  private renderExamples(data: any, schema: any) {
    if (data.examples) {
      const examplesMap: Record<string, string> = {};
      const descriptionsMap: Record<string, string> = {};
      for (const [name, ex] of Object.entries(data.examples as Record<string, any>)) {
        if (ex.value !== undefined) examplesMap[name] = JSON.stringify(ex.value, null, 2);
        const desc = ex.description || ex.summary || '';
        if (desc) descriptionsMap[name] = desc;
      }
      if (!Object.keys(examplesMap).length) return nothing;
      const descAttr = Object.keys(descriptionsMap).length ? JSON.stringify(descriptionsMap) : '';
      return html`<pp-example-selector mode="inline"
        examples-json=${JSON.stringify(examplesMap)}
        descriptions-json=${descAttr}></pp-example-selector>`;
    }
    const example = data.example ?? schema?.example;
    if (example !== undefined) {
      return html`<pp-example-selector mode="inline" mock-json=${JSON.stringify(example, null, 2)}></pp-example-selector>`;
    }
    return nothing;
  }

  private collectSchemaEntries(schema: any): Array<{label: string; value: unknown; isCode?: boolean}> {
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [];
    if (schema.type) entries.push({label: 'type', value: schema.type + (schema.format ? ` (${schema.format})` : ''), isCode: true});
    if (schema.default !== undefined) entries.push({label: 'default', value: JSON.stringify(schema.default), isCode: true});
    for (const c of collectConstraints(schema)) entries.push(c);
    if (schema.enum?.length) {
      entries.push({label: 'enum', value: html`<div class="enum-grid">${schema.enum.map((v: any) => html`<span class="enum-value">${JSON.stringify(v)}</span>`)}</div>`});
    }
    return entries;
  }

  private renderPropertyGrid(entries: Array<{label: string; value: unknown; isCode?: boolean}>) {
    if (!entries.length) return nothing;
    return html`
      <div class="property-grid">
        ${entries.map(e => html`
          <div class="property-grid-entry">
            <span class="property-grid-label">${e.label}</span>
            <span class="property-grid-value">${e.isCode ? html`<code>${e.value}</code>` : e.value}</span>
          </div>
        `)}
      </div>
    `;
  }

  private renderParameter(data: any) {
    const schema = data.schema || {};
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [
      {label: 'name', value: data.name},
      {label: 'in', value: data.in},
    ];
    if (data.required !== undefined) entries.push({label: 'required', value: String(data.required)});
    if (data.deprecated) entries.push({label: 'deprecated', value: 'true'});
    entries.push(...this.collectSchemaEntries(schema));

    return html`
      ${schema.type !== 'boolean' ? this.renderExamples(data, schema) : nothing}
      ${this.renderPropertyGrid(entries)}
    `;
  }

  private renderHeader(data: any) {
    const schema = data.schema || {};
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [];
    if (data.required) entries.push({label: 'required', value: 'true'});
    if (data.deprecated) entries.push({label: 'deprecated', value: 'true'});
    entries.push(...this.collectSchemaEntries(schema));

    return html`
      ${this.renderExamples(data, schema)}
      ${this.renderPropertyGrid(entries)}
    `;
  }

  private renderSchema(schema: any) {
    const exampleJson = schema.example !== undefined
      ? JSON.stringify(schema.example, null, 2)
      : this.mockJson || '';
    const isComplex = schema.properties || schema.allOf || schema.oneOf || schema.anyOf;

    if (isComplex) {
      return html`
        ${exampleJson
          ? html`<pp-example-selector mode="inline" mock-json=${exampleJson}></pp-example-selector>`
          : nothing}
        <h3>${schema.properties ? 'Properties' : (schema.allOf ? 'Composition' : 'Variants')}</h3>
        <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
      `;
    }

    // Scalar schema — use property grid like parameters/headers
    const entries = this.collectSchemaEntries(schema);

    return html`
      ${schema.type !== 'boolean' && exampleJson
        ? html`<pp-example-selector mode="inline" mock-json=${exampleJson}></pp-example-selector>`
        : nothing}
      ${this.renderPropertyGrid(entries)}
    `;
  }

  render() {
    if (!this.parsed) return nothing;
    const data = this.parsed;

    // Parameter: has "in" field
    if (data.in) return this.renderParameter(data);

    // Header: has "schema" but no "in" and no "properties"
    if (data.schema && !data.properties && !data.in) return this.renderHeader(data);

    // Schema (default)
    return this.renderSchema(data);
  }
}
