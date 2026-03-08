import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import ppExampleBlockCss from './pp-example-block.css.js';

@customElement('pp-example-block')
export class PpExampleBlock extends LitElement {
  static styles = ppExampleBlockCss;

  @property() name = '';
  @property({attribute: 'example-json'}) exampleJson = '';
  @state() private parsed: any = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('exampleJson') && this.exampleJson) {
      try {
        this.parsed = JSON.parse(this.exampleJson);
      } catch {
        this.parsed = null;
      }
    }
  }

  render() {
    if (!this.parsed) return nothing;
    return html`
      <details>
        <summary>${this.name || 'Example'}</summary>
        <pre><code>${JSON.stringify(this.parsed, null, 2)}</code></pre>
      </details>
    `;
  }
}
