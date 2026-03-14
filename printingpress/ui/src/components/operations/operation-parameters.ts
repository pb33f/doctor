import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import operationParametersCss from './operation-parameters.css.js';

interface ParameterData {
  name: string;
  in: string;
  description: string;
  required: boolean;
  deprecated: boolean;
  schemaJson: string;
  mockJson?: string;
  examples?: Record<string, string>;
  ref?: {name: string; componentType: string; typeSlug: string; slug: string};
  rawJson?: string;
  rawYaml?: string;
}

interface ParsedSchema {
  type: string;
  enumValues: string[] | null;
}

function parseSchema(schemaJson: string): ParsedSchema {
  if (!schemaJson) return {type: '', enumValues: null};
  try {
    const s = JSON.parse(schemaJson);
    let type = '';
    if (s.type === 'array' && s.items) {
      const itemType = s.items.type || s.items.$ref?.split('/').pop() || 'any';
      type = `array<${itemType}>`;
    } else if (s.type) {
      type = Array.isArray(s.type) ? s.type.join(' | ') : s.type;
      if (s.format) type += ` (${s.format})`;
    } else if (s.oneOf) {
      type = 'oneOf';
    } else if (s.anyOf) {
      type = 'anyOf';
    } else if (s.allOf) {
      type = 'allOf';
    } else if (s.$ref) {
      type = s.$ref.split('/').pop();
    }
    return {type, enumValues: Array.isArray(s.enum) ? s.enum : null};
  } catch {
    return {type: '', enumValues: null};
  }
}

@customElement('pp-operation-parameters')
export class PpOperationParameters extends LitElement {
  static styles = [sharedCss, operationParametersCss];

  @property({attribute: 'parameters-json'}) parametersJson = '';
  @state() private params: ParameterData[] = [];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('parametersJson') && this.parametersJson) {
      try {
        this.params = JSON.parse(this.parametersJson);
      } catch {
        this.params = [];
      }
    }
  }

  render() {
    if (!this.params.length) return nothing;

    return html`
      <h3>Parameters</h3>
      ${this.params.map(p => {
        const schema = p.ref ? null : parseSchema(p.schemaJson);
        const type = p.ref ? p.ref.name : (schema?.type || '');
        return html`
          <div class="parameter">
            <span class="param-name">${p.name}</span>
            ${type
              ? p.ref
                ? html`<span class="param-type"><a href="models/${p.ref.typeSlug}/${p.ref.slug}.html">${type}</a></span>`
                : html`<span class="param-type">${type}</span>`
              : nothing}
            <span class="param-in">${p.in}</span>
            ${p.required
              ? html`<span class="required-badge">required</span>`
              : nothing}
            ${p.deprecated
              ? html`<span class="deprecated-badge">deprecated</span>`
              : nothing}
            ${p.description
              ? html`<div class="param-desc">${p.description}</div>`
              : nothing}
            ${schema?.enumValues
              ? html`<div class="enum-values">Enum: ${schema.enumValues.map((v: string, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${v}</span>`)}</div>`
              : nothing}
            ${p.rawJson || p.rawYaml
              ? html`<pp-raw-viewer-btn
                  title="${p.name} (${p.in})"
                  raw-json=${p.rawJson || ''}
                  raw-yaml=${p.rawYaml || ''}>
                </pp-raw-viewer-btn>`
              : nothing}
            ${p.mockJson || (p.examples && Object.keys(p.examples).length > 0)
              ? html`<pp-example-selector
                  mock-json=${p.mockJson || ''}
                  examples-json=${p.examples ? JSON.stringify(p.examples) : ''}>
                </pp-example-selector>`
              : nothing}
          </div>
        `;
      })}
    `;
  }
}
