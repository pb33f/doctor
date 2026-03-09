import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import modelPageCss from './model-page.css.js';

@customElement('pp-model-page')
export class PpModelPage extends LitElement {
  static styles = [sharedCss, modelPageCss];

  @property({attribute: 'model-json'}) modelJson = '';
  @property() name = '';
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

  render() {
    if (!this.parsed) return nothing;

    const schema = this.parsed;
    const properties = schema.properties || {};
    const required = new Set(schema.required || []);
    const propEntries = Object.entries(properties);

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
                  ${prop.type
                    ? html`<span class="prop-type">${prop.type}</span>`
                    : nothing}
                  ${required.has(name)
                    ? html`<span class="required-badge">required</span>`
                    : nothing}
                  ${prop.description
                    ? html`<div class="prop-desc">${prop.description}</div>`
                    : nothing}
                </div>
              `
            )}
          `
        : nothing}
      <h3>Schema Definition</h3>
      <pre><code>${JSON.stringify(schema, null, 2)}</code></pre>
    `;
  }
}
