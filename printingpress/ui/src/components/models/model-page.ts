import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import modelPageCss from './model-page.css.js';
import '../shared/inline-code.js';

@customElement('pp-model-page')
export class PpModelPage extends LitElement {
  static styles = [sharedCss, modelPageCss];

  @property({attribute: 'model-json'}) modelJson = '';
  @property() name = '';
  @property({attribute: 'raw-yaml'}) rawYaml = '';
  @property({attribute: 'schema-raw-yaml'}) schemaRawYaml = '';
  @property({attribute: 'schema-raw-json'}) schemaRawJson = '';
  @property({attribute: 'schema-start-line', type: Number}) schemaStartLine = 1;
  @property({attribute: 'start-line', type: Number}) startLine = 1;
  @property() location = '';
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

  private renderConstraints(prop: any) {
    const parts: Array<{label: string, value: any, isCode?: boolean}> = [];
    if (prop.example !== undefined) parts.push({label: 'example', value: JSON.stringify(prop.example)});
    if (prop.default !== undefined) parts.push({label: 'default', value: JSON.stringify(prop.default)});
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
    if (!parts.length && !prop.enum?.length) return nothing;
    return html`
      <div class="constraints">
        ${parts.map(p => html`
          <span class="constraint-label">${p.label}</span>
          <span class="constraint-value">${p.isCode ? html`<code>${p.value}</code>` : p.value}</span>
        `)}
        ${prop.enum?.length ? html`
          <span class="constraint-label">enum</span>
          <span class="constraint-value">${prop.enum.map((v: any, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${JSON.stringify(v)}</span>`)}</span>
        ` : nothing}
      </div>
    `;
  }

  private renderType(prop: any) {
    if (!prop) return nothing;
    let type = '';
    if (prop.type) {
      type = Array.isArray(prop.type) ? prop.type.join(' | ') : prop.type;
    }
    if (!type) return nothing;
    return html`
      <span class="prop-type">${type}</span>
      ${prop.format ? html`<span class="prop-format">(${prop.format})</span>` : nothing}
    `;
  }

  private renderExampleObjects(examples: Record<string, any>) {
    const entries = Object.entries(examples);
    if (!entries.length) return nothing;
    return html`
      <h3>Examples</h3>
      ${entries.map(([name, ex]) => html`
        <div class="example-object">
          <div class="example-header">
            <span class="prop-name">${name}</span>
            ${ex.summary ? html`<span class="example-summary">${ex.summary}</span>` : nothing}
          </div>
          ${ex.description ? html`<div class="prop-desc">${ex.description}</div>` : nothing}
          ${ex.value !== undefined
            ? html`<pp-inline-code raw-json=${JSON.stringify(ex.value, null, 2)} title=${name}></pp-inline-code>`
            : nothing}
          ${ex.externalValue ? html`<div class="example-external"><a href=${ex.externalValue}>${ex.externalValue}</a></div>` : nothing}
        </div>
      `)}
    `;
  }

  private renderComponentWithSchema(data: any, traitsHtml: unknown) {
    const schema = data.schema || {};
    const schemaJson = this.schemaRawJson || JSON.stringify(schema, null, 2);
    const schemaYaml = this.schemaRawYaml;
    return html`
      <div class="traits">
        <h3>Traits</h3>
        <div class="constraints">
          ${traitsHtml}
          ${schema.type ? html`
            <span class="constraint-label">type</span>
            <span class="constraint-value">${schema.type}${schema.format ? ` (${schema.format})` : ''}</span>
          ` : nothing}
        </div>
        ${this.renderConstraints(schema)}
      </div>
      ${data.examples ? this.renderExampleObjects(data.examples) : nothing}
      ${!data.examples && data.example !== undefined
        ? html`<pp-inline-code raw-json=${JSON.stringify(data.example, null, 2)} title="Example"></pp-inline-code>`
        : nothing}
      ${Object.keys(schema).length
        ? html`<pp-inline-code
            raw-json=${schemaJson}
            raw-yaml=${schemaYaml}
            start-line=${this.schemaStartLine}
            title="Schema"></pp-inline-code>`
        : nothing}
    `;
  }

  private renderParameter(data: any) {
    return this.renderComponentWithSchema(data, html`
      <span class="constraint-label">name</span>
      <span class="constraint-value">${data.name}</span>
      <span class="constraint-label">in</span>
      <span class="constraint-value">${data.in}</span>
      ${data.required !== undefined ? html`
        <span class="constraint-label">required</span>
        <span class="constraint-value">${data.required}</span>
      ` : nothing}
      ${data.deprecated ? html`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      ` : nothing}
    `);
  }

  private renderHeader(data: any) {
    return this.renderComponentWithSchema(data, html`
      ${data.required ? html`
        <span class="constraint-label">required</span>
        <span class="constraint-value">true</span>
      ` : nothing}
      ${data.deprecated ? html`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      ` : nothing}
    `);
  }

  private renderSchema(schema: any) {
    const properties = schema.properties || {};
    const required = new Set(schema.required || []);
    const propEntries = Object.entries(properties);

    const exampleJson = schema.example !== undefined
      ? JSON.stringify(schema.example, null, 2) : '';

    return html`
      ${schema.type
        ? html`<div><strong>Type:</strong> ${schema.type}</div>`
        : nothing}
      ${propEntries.length
        ? html`
            <h3>Properties</h3>
            ${propEntries.map(
              ([name, prop]: [string, any]) => html`
                <div class="property">
                  <span class="prop-name">${name}</span>
                  ${this.renderType(prop)}
                  ${required.has(name)
                    ? html`<span class="required-badge">required</span>`
                    : nothing}
                  ${prop.description
                    ? html`<div class="prop-desc">${prop.description}</div>`
                    : nothing}
                  ${this.renderConstraints(prop)}
                </div>
              `
            )}
          `
        : nothing}
      ${exampleJson
        ? html`<pp-inline-code raw-json=${exampleJson} title="Example"></pp-inline-code>`
        : nothing}
      <pp-inline-code
        raw-json=${this.modelJson}
        raw-yaml=${this.rawYaml}
        start-line=${this.startLine}
        location=${this.location}
        title="Schema"></pp-inline-code>
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
