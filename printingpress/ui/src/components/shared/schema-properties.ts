import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import schemaPropertiesCss from './schema-properties.css.js';
import {deriveSchemaType, resolveRefLink} from '../../utils/schema.js';

@customElement('pp-schema-properties')
export class PpSchemaProperties extends LitElement {
  static styles = schemaPropertiesCss;

  @property({attribute: 'schema-json'}) schemaJson = '';
  @state() private schema: any = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('schemaJson') && this.schemaJson) {
      try {
        this.schema = JSON.parse(this.schemaJson);
      } catch {
        this.schema = null;
      }
    }
  }

  private renderConstraints(prop: any) {
    const parts: Array<{label: string; value: any; isCode?: boolean}> = [];
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
          <span class="constraint-label">${p.label}:</span>
          <span class="constraint-value">${p.isCode ? html`<code>${p.value}</code>` : p.value}</span>
        `)}
        ${prop.enum?.length ? html` 
          <span class="constraint-label">enum:</span>
          <span class="constraint-value">${prop.enum.map((v: any, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${JSON.stringify(v)}</span>`)}</span>
        ` : nothing}
      </div>
    `;
  }

  private renderType(prop: any) {
    if (!prop) return nothing;

    if (prop.type === 'array' && prop.items?.$ref) {
      const link = resolveRefLink(prop.items.$ref);
      if (link) {
        return html`<span class="prop-type prop-type-link">Array&lt;<a class="ref-type-link" href="${link.href}">\u279c ${link.name}</a>&gt;</span>`;
      }
    }

    if (prop.$ref) {
      const link = resolveRefLink(prop.$ref);
      if (link) {
        return html`<span class="prop-type prop-type-link"><a class="ref-type-link" href="${link.href}">\u279c ${link.name}</a></span>`;
      }
    }

    const type = deriveSchemaType(prop);
    if (!type) return nothing;
    return html`<span class="prop-type">${type}</span>`;
  }

  render() {
    if (!this.schema) return nothing;
    // For arrays, render the items schema properties
    const target = this.schema.type === 'array' && this.schema.items?.properties
      ? this.schema.items
      : this.schema;
    const properties = target.properties || {};
    const required = new Set(target.required || []);
    const propEntries = Object.entries(properties);
    if (!propEntries.length) return nothing;

    return propEntries.map(
      ([name, prop]: [string, any]) => html`
        <div class="property">
          <div class="prop-name-col">
            <span class="prop-name">${name}</span>
            ${required.has(name)
              ? html`<span class="required-badge">req</span>`
              : nothing}
          </div>
          <div class="prop-type-col">
            ${this.renderType(prop)}
            ${this.renderConstraints(prop)}
          </div>
          <div class="prop-desc-col">
            ${prop.description ? prop.description : nothing}
          </div>
        </div>
      `
    );
  }
}
