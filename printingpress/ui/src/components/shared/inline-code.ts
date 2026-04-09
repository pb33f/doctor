import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import inlineCodeCss from './inline-code.css.js';
import tooltipCss from '../../styles/tooltip.css.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import './code-viewer.js';

@customElement('pp-inline-code')
export class PpInlineCode extends LitElement {
  static styles = [inlineCodeCss, tooltipCss];

  @property({attribute: 'raw-json'}) rawJson = '';
  @property({attribute: 'raw-yaml'}) rawYaml = '';
  @property({attribute: 'start-line', type: Number}) startLine = 1;
  @property() title = 'Schema';
  @property() location = '';
  @property({attribute: 'no-line-numbers', type: Boolean}) noLineNumbers = false;
  @state() private mode: 'json' | 'yaml' = 'yaml';

  connectedCallback() {
    super.connectedCallback();
    const fmt = document.body.getAttribute('data-spec-format');
    if (fmt === 'json' || fmt === 'yaml') {
      this.mode = fmt;
    }
  }

  render() {
    if (!this.rawJson && !this.rawYaml) return nothing;
    // Default to whichever is available
    const hasJson = !!this.rawJson;
    const hasYaml = !!this.rawYaml;
    const code = this.mode === 'yaml' && hasYaml ? this.rawYaml : this.rawJson;
    const lang = this.mode === 'yaml' && hasYaml ? 'yaml' : 'json';

    const showToggle = hasJson && hasYaml;
    return html`
      ${this.title || showToggle ? html`
      <div class="toolbar">
        ${this.title ? html`<h3>${this.title}</h3>` : nothing}
        ${showToggle ? html`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode === 'json' ? 'active' : ''}"
                    @click=${() => this.mode = 'json'}>JSON</button>
            <button class="toggle-btn ${this.mode === 'yaml' ? 'active' : ''}"
                    @click=${() => this.mode = 'yaml'}>YAML</button>
          </div>
        ` : nothing}
      </div>
      ` : nothing}
      <div class="code-container">
        <sl-tooltip class="floating-copy" content="copy code to clipboard">
          <sl-icon-button
            name="copy"
            label="Copy code to clipboard"
            @click=${() => navigator.clipboard.writeText(code)}>
          </sl-icon-button>
        </sl-tooltip>
        <pp-code-viewer
          code=${code}
          language=${lang}
          ?pretty=${lang === 'json'}
          ?line-numbers=${!this.noLineNumbers && (lang === 'json' ? (code.includes('\n') || code.startsWith('{') || code.startsWith('[')) : code.indexOf('\n') !== -1)}
          start-line=${this.startLine}
          location=${this.location}>
        </pp-code-viewer>
      </div>
    `;
  }
}
