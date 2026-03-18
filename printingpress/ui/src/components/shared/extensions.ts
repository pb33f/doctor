import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import extensionsCss from './extensions.css.js';
import './code-viewer.js';

interface ExtensionEntry {
  key: string;
  value: any;
}

@customElement('pp-extensions')
export class PpExtensions extends LitElement {
  static styles = extensionsCss;

  @property({attribute: 'extensions-json'}) extensionsJson = '';
  @state() private extensions: ExtensionEntry[] = [];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('extensionsJson')) {
      if (this.extensionsJson) {
        try { this.extensions = JSON.parse(this.extensionsJson); }
        catch { this.extensions = []; }
      } else {
        this.extensions = [];
      }
    }
  }

  private renderValue(value: any) {
    if (value === null || value === undefined) return nothing;
    if (typeof value === 'object') {
      return html`<pp-code-viewer code=${JSON.stringify(value, null, 2)} language="json"></pp-code-viewer>`;
    }
    return html`<span class="ext-scalar">${String(value)}</span>`;
  }

  render() {
    if (!this.extensions.length) return nothing;
    return html`<div class="ext-grid">
      ${this.extensions.map(ext => html`
        <div class="ext-key">${ext.key}</div>
        <div class="ext-value">${this.renderValue(ext.value)}</div>
      `)}
    </div>`;
  }
}
