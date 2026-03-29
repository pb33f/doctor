import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import constraintsCss from '../../styles/constraints.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import operationParametersCss from './operation-parameters.css.js';
import {ComponentLinkData, deriveSchemaType} from '../../utils/schema.js';
import {renderConstraints} from '../../utils/render-helpers.js';
import '../shared/ref-popover.js';
import '../shared/extensions.js';

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
  location?: string;
  extensions?: Array<{key: string; value: any}>;
}

@customElement('pp-operation-parameters')
export class PpOperationParameters extends LitElement {
  static styles = [sharedCss, constraintsCss, refLinkCss, operationParametersCss];

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


  private inIcon(location: string): string {
    switch (location) {
      case 'cookie': return 'cookie';
      case 'header': return 'envelope';
      case 'path': return 'signpost';
      case 'query': return 'question-diamond';
      default: return 'question-diamond';
    }
  }

  private parseSchema(schemaJson: string): any {
    if (!schemaJson) return null;
    try { return JSON.parse(schemaJson); } catch { return null; }
  }

  render() {
    if (!this.params.length) return nothing;

    return html`
      ${this.params.map(p => {
        const schema = this.parseSchema(p.schemaJson);
        const type = deriveSchemaType(schema);
        return html`
          <div class="parameter">
            <div class="param-name-col">
              ${p.required
                  ? html`<span class="required-badge">req</span>`
                  : nothing}
              ${p.ref
                  ? html`
                    <pp-ref-popover registry-key="${p.ref.componentType}/${p.ref.name}"><a
                        class="ref-link param-name" href="models/${p.ref.typeSlug}/${p.ref.slug}.html">\u279c
                      ${p.name}</a></pp-ref-popover>`
                  : html`<span class="param-name">${p.name}</span>`}

              ${p.deprecated
                  ? html`<span class="deprecated-badge">deprecated</span>`
                  : nothing}
            </div>
            <div class="param-type-col">
              ${type ? html`<span class="param-type">${type}</span>` : nothing}
              ${renderConstraints(schema, {labelSuffix: ':'})}
            </div>
            <div class="param-in-col">
              <sl-icon class="param-in-icon" name="${this.inIcon(p.in)}"></sl-icon>
              <span class="param-in">${p.in}</span>
            </div>
            <div class="param-desc-col">
              ${p.description || nothing}
              ${!p.ref && (p.rawJson || p.rawYaml)
                  ? html`
                    <pp-raw-viewer-btn
                        title="${p.name} (${p.in})"
                        raw-json=${p.rawJson || ''}
                        raw-yaml=${p.rawYaml || ''}
                        start-line=${p.sourceLine || 1}
                        location=${p.location || ''}>
                    </pp-raw-viewer-btn>`
                  : nothing}
            </div>
            ${(!p.ref && (p.rawJson || p.rawYaml)) || p.mockJson || (p.examples && Object.keys(p.examples).length > 0)
                ? html`
                  <div class="param-extras">
                    ${p.mockJson || (p.examples && Object.keys(p.examples).length > 0)
                        ? html`
                          <pp-example-selector
                              mock-json=${p.mockJson || ''}
                              examples-json=${p.examples ? JSON.stringify(p.examples) : ''}>
                          </pp-example-selector>`
                        : nothing}
                  </div>
                ` : nothing}
          </div>
          ${p.extensions?.length ? html`
            <div class="parameter extensions">
            <div class="param-name-col">
              &nbsp;
            </div>
            <div class="param-type-col">
              &nbsp;
            </div>
            <div class="param-in-col">
              &nbsp;
            </div>
            <div class="param-desc-col">
                <h4>${p.name} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(p.extensions)}></pp-extensions>
            </div>
            </div>` : nothing}
          
        `;
      })}
    `;
  }
}
