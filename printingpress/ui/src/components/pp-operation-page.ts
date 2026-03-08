import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../styles/shared.css.js';
import ppOperationPageCss from './pp-operation-page.css.js';

@customElement('pp-operation-page')
export class PpOperationPage extends LitElement {
  static styles = [sharedCss, ppOperationPageCss];

  @property({attribute: 'operation-json'}) operationJson = '';
  @state() private parsed: any = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('operationJson') && this.operationJson) {
      try {
        this.parsed = JSON.parse(this.operationJson);
      } catch {
        this.parsed = null;
      }
    }
  }

  render() {
    if (!this.parsed) return nothing;
    return html`
      <h3>Raw Operation Definition</h3>
      <pre><code>${JSON.stringify(this.parsed, null, 2)}</code></pre>
    `;
  }
}
