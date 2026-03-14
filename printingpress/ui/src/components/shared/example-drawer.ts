import {LitElement, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
Prism.manual = true;
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-yaml.js';
import exampleDrawerCss from './example-drawer.css.js';
import prismCss from '../../styles/prism.css.js';

export interface ShowExampleDetail {
  title: string;
  json: string;
  yaml?: string;
}

@customElement('pp-example-drawer')
export class PpExampleDrawer extends LitElement {
  static styles = [exampleDrawerCss, prismCss];

  @state() private title = '';
  @state() private json = '';
  @state() private yaml = '';
  @state() private format: 'json' | 'yaml' = 'json';
  @state() private copied = false;
  @query('sl-drawer') private drawer: any;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('pp-show-example', this.handleShowExample);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pp-show-example', this.handleShowExample);
  }

  private handleShowExample = (e: Event) => {
    const detail = (e as CustomEvent<ShowExampleDetail>).detail;
    this.title = detail.title;
    this.json = detail.json;
    this.yaml = detail.yaml || '';
    this.format = detail.json ? 'json' : (detail.yaml ? 'yaml' : 'json');
    this.updateComplete.then(() => {
      const d = this.drawer;
      if (d) {
        // Ensure sl-drawer has finished its own upgrade/update before calling show
        if (d.updateComplete) {
          d.updateComplete.then(() => d.show());
        } else {
          d.show();
        }
      }
    });
  };

  private get displayJson(): string {
    if (!this.json) return '';
    try { return JSON.stringify(JSON.parse(this.json), null, 2); }
    catch { return this.json; }
  }

  private highlighted() {
    const isYaml = this.format === 'yaml' && this.yaml;
    const code = isYaml ? this.yaml : this.displayJson;
    if (!code) return '';
    const lang = isYaml ? 'yaml' : 'json';
    try {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } catch { return code; }
  }

  private get copyText(): string {
    if (this.format === 'yaml' && this.yaml) return this.yaml;
    return this.displayJson;
  }

  private async copyToClipboard() {
    const text = this.copyText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    } catch { /* clipboard API unavailable */ }
  }

  render() {
    return html`
      <sl-drawer label=${this.title || 'Example'} placement="end">
        ${this.yaml ? html`
          <div slot="header-actions" class="format-toggle">
            <button class="${this.format === 'json' ? 'active' : ''}"
                    ?disabled=${!this.json}
                    @click=${() => this.format = 'json'}>JSON</button>
            <button class="${this.format === 'yaml' ? 'active' : ''}"
                    @click=${() => this.format = 'yaml'}>YAML</button>
          </div>
        ` : ''}
        <pre class="${this.format}"><code>${unsafeHTML(this.highlighted())}</code></pre>
        <button
          slot="footer"
          class="copy-btn ${this.copied ? 'copied' : ''}"
          @click=${this.copyToClipboard}>
          ${this.copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </sl-drawer>
    `;
  }
}
