import {LitElement, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import './code-viewer.js';
import type {PpCodeViewer} from './code-viewer.js';
import exampleDrawerCss from './example-drawer.css.js';

export interface ShowExampleDetail {
  title: string;
  json: string;
  yaml?: string;
  rawMode?: boolean;
  highlightLines?: string;
  startLine?: number;
  location?: string;
}

@customElement('pp-example-drawer')
export class PpExampleDrawer extends LitElement {
  static styles = [exampleDrawerCss];

  @state() private title = '';
  @state() private json = '';
  @state() private yaml = '';
  @state() private format: 'json' | 'yaml' = 'json';
  @state() private copied = false;
  @state() private rawMode = false;
  @state() private highlightLines = '';
  @state() private startLine = 1;
  @state() private location = '';
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
    this.rawMode = detail.rawMode ?? false;
    this.highlightLines = detail.highlightLines || '';
    this.startLine = detail.startLine ?? 1;
    this.location = detail.location || '';
    this.format = detail.json ? 'json' : (detail.yaml ? 'yaml' : 'json');
    this.updateComplete.then(() => {
      const d = this.drawer;
      if (d) {
        if (d.updateComplete) {
          d.updateComplete.then(() => d.show());
        } else {
          d.show();
        }
      }
    });
  };

  private get copyText(): string {
    const viewer = this.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    if (viewer) return viewer.displayCode;
    if (this.format === 'yaml' && this.yaml) return this.yaml;
    return this.json;
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
    const code = this.format === 'yaml' && this.yaml ? this.yaml : this.json;
    const lang = this.format === 'yaml' ? 'yaml' : 'json';
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
        <pp-code-viewer
          .code=${code}
          .language=${lang}
          ?line-numbers=${this.rawMode}
          .pretty=${lang === 'json'}
          .startLine=${this.startLine}
          .location=${this.location}
          highlight-lines=${this.highlightLines}>
        </pp-code-viewer>
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
