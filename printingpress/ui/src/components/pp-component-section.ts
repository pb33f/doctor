import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import ppComponentSectionCss from './pp-component-section.css.js';

@customElement('pp-component-section')
export class PpComponentSection extends LitElement {
  static styles = ppComponentSectionCss;

  @property({attribute: 'media-type'}) mediaType = '';
  @property({attribute: 'schema-json'}) schemaJson = '';
  @state() private parsed: any = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('schemaJson') && this.schemaJson) {
      try {
        this.parsed = JSON.parse(this.schemaJson);
      } catch {
        this.parsed = null;
      }
    }
  }

  render() {
    return html`
      ${this.mediaType
        ? html`<div class="media-type">${this.mediaType}</div>`
        : nothing}
      ${this.parsed
        ? html`<pre><code>${JSON.stringify(this.parsed, null, 2)}</code></pre>`
        : nothing}
    `;
  }
}
