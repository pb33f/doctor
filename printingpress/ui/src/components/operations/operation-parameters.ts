import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import operationParametersCss from './operation-parameters.css.js';
import {ComponentLinkData, deriveSchemaTypeFromJson, extractEnumValues} from '../../utils/schema.js';

interface ParameterData {
  name: string;
  in: string;
  description: string;
  required: boolean;
  deprecated: boolean;
  schemaJson: string;
  mockJson?: string;
  examples?: Record<string, string>;
  ref?: ComponentLinkData;
  rawJson?: string;
  rawYaml?: string;
  sourceLine?: number;
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
      ${this.params.map(p => {
        const type = deriveSchemaTypeFromJson(p.schemaJson);
        const enumValues = extractEnumValues(p.schemaJson);
        return html`
          <div class="parameter">
            ${p.ref
              ? html`<a class="ref-link param-name" href="models/${p.ref.typeSlug}/${p.ref.slug}.html">\u279c ${p.name}</a>`
              : html`<span class="param-name">${p.name}</span>`}
            ${type ? html`<span class="param-type">${type}</span>` : nothing}
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
            ${enumValues
              ? html`<div class="enum-values">Enum: ${enumValues.map((v: string, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${v}</span>`)}</div>`
              : nothing}
            ${!p.ref && (p.rawJson || p.rawYaml)
              ? html`<pp-raw-viewer-btn
                  title="${p.name} (${p.in})"
                  raw-json=${p.rawJson || ''}
                  raw-yaml=${p.rawYaml || ''}
                  start-line=${p.sourceLine || 1}>
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
