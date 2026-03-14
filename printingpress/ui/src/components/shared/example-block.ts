import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
Prism.manual = true;
import 'prismjs/components/prism-json.js';
import exampleBlockCss from './example-block.css.js';
import prismCss from '../../styles/prism.css.js';

@customElement('pp-example-block')
export class PpExampleBlock extends LitElement {
  static styles = [exampleBlockCss, prismCss];

  @property() name = '';
  @property({attribute: 'example-json'}) exampleJson = '';
  @state() private formatted = '';

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('exampleJson') && this.exampleJson) {
      try {
        const parsed = JSON.parse(this.exampleJson);
        this.formatted = JSON.stringify(parsed, null, 2);
      } catch {
        this.formatted = '';
      }
    }
  }

  render() {
    if (!this.formatted) return nothing;
    let highlighted: string;
    try {
      highlighted = Prism.highlight(this.formatted, Prism.languages['json'], 'json');
    } catch {
      highlighted = this.formatted;
    }
    return html`
      <details>
        <summary>${this.name || 'Example'}</summary>
        <pre class="json"><code>${unsafeHTML(highlighted)}</code></pre>
      </details>
    `;
  }
}
