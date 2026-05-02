import {LitElement, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import './code-viewer.js';
import type {PpCodeViewer} from './code-viewer.js';
import exampleDrawerCss from './example-drawer.css.js';
import tooltipCss from '../../styles/tooltip.css.js';

export interface ShowExampleDetail {
  title: string;
  json: string;
  yaml?: string;
  language?: 'json' | 'yaml' | 'xml';
  rawMode?: boolean;
  highlightLines?: string;
  startLine?: number;
  location?: string;
  method?: string;
  path?: string;
  componentType?: string;
}

@customElement('pp-example-drawer')
export class PpExampleDrawer extends LitElement {
  static styles = [exampleDrawerCss, tooltipCss];

  @state() private title = '';
  @state() private json = '';
  @state() private yaml = '';
  @state() private format: 'json' | 'yaml' | 'xml' = 'json';
  @state() private rawMode = false;
  @state() private highlightLines = '';
  @state() private startLine = 1;
  @state() private location = '';
  @state() private method = '';
  @state() private path = '';
  @state() private componentType = '';
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
    const problems = document.querySelector('pp-problems-drawer') as HTMLElement | null;
    const problemsDrawer = problems?.shadowRoot?.querySelector('sl-drawer') as any;
    problemsDrawer?.hide?.();
    this.title = detail.title;
    this.json = detail.json;
    this.yaml = detail.yaml || '';
    this.rawMode = detail.rawMode ?? false;
    this.highlightLines = detail.highlightLines || '';
    this.startLine = detail.startLine ?? 1;
    this.location = detail.location || '';
    this.method = detail.method || '';
    this.path = detail.path || '';
    this.componentType = detail.componentType || '';
    if (detail.language) {
      this.format = detail.language;
    } else {
      const specFmt = document.body.getAttribute('data-spec-format');
      if (specFmt === 'yaml' && detail.yaml) {
        this.format = 'yaml';
      } else if (specFmt === 'json' && detail.json) {
        this.format = 'json';
      } else {
        this.format = detail.yaml ? 'yaml' : 'json';
      }
    }
    this.updateComplete.then(() => {
      const d = this.drawer;
      if (d && typeof d.show === 'function') {
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

  private async copyCurrentCode() {
    const code = this.copyText;
    if (!code) return;
    await navigator.clipboard.writeText(code);
  }

  private renderHeader() {
    if (this.method && this.path) {
      return html`
        <div class="rich-header">
          <pb33f-http-method method=${this.method}></pb33f-http-method>
          <pb33f-render-operation-path path=${this.path} nowrap></pb33f-render-operation-path>
        </div>
      `;
    }
    if (this.componentType) {
      return html`
        <div class="component-header">
          <pb33f-model-icon icon=${this.componentType} size="large"></pb33f-model-icon>
          <span class="drawer-component-title">${this.title}</span>
        </div>
      `;
    }
    return html`<h3 class="drawer-title">${this.title || 'Example'}</h3>`;
  }

  render() {
    const code = this.format === 'yaml' && this.yaml ? this.yaml : this.json;
    const lang = this.format;
    return html`
      <sl-drawer placement="end" no-header>
        <div class="drawer-header">
          ${this.renderHeader()}
          <div class="header-actions">
            ${this.yaml ? html`
              <div class="format-toggle">
                <button class="${this.format === 'json' ? 'active' : ''}"
                        ?disabled=${!this.json}
                        @click=${() => this.format = 'json'}>JSON</button>
                <button class="${this.format === 'yaml' ? 'active' : ''}"
                        @click=${() => this.format = 'yaml'}>YAML</button>
              </div>
            ` : ''}
            <sl-icon-button name="x-lg" label="Close" class="close-btn"
                @click=${() => this.drawer?.hide()}></sl-icon-button>
          </div>
        </div>
        <div class="code-container">
          <div class="floating-actions">
            <sl-tooltip class="floating-copy" content="copy example to clipboard">
              <sl-icon-button
                name="copy"
                label="Copy example to clipboard"
                @click=${this.copyCurrentCode}>
              </sl-icon-button>
            </sl-tooltip>
          </div>
          <pp-code-viewer
            .code=${code}
            .language=${lang}
            ?line-numbers=${this.rawMode}
            .pretty=${lang === 'json'}
            reserve-location
            .startLine=${this.startLine}
            .location=${this.location}
            highlight-lines=${this.highlightLines}
            embedded>
          </pp-code-viewer>
        </div>
      </sl-drawer>
    `;
  }
}
