import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import curlCommandCss from './curl-command.css.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@pb33f/cowboy-components/components/terminal/terminal-example.js';

interface CurlVariant {
  label: string;
  serverUrl: string;
  serverDescription?: string;
  securityLabel?: string;
  command: string;
}

@customElement('pp-curl-command')
export class PpCurlCommand extends LitElement {
  static styles = [curlCommandCss];

  @property({attribute: 'curl-json'}) curlJson = '';
  @state() private variants: CurlVariant[] = [];
  @state() private selectedIndex = 0;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('curlJson')) {
      try {
        const parsed = JSON.parse(this.curlJson);
        this.variants = Array.isArray(parsed) ? parsed : [];
      } catch {
        this.variants = [];
      }
      this.selectedIndex = 0;
    }
  }

  private renderSelector() {
    if (this.variants.length <= 1) return nothing;

    const current = this.variants[this.selectedIndex] || this.variants[0];
    if (!current) return nothing;

    return html`
      <div class="selector-row">
        <div class="selector">
          <sl-dropdown skidding="5" distance="5">
            <sl-button slot="trigger" caret>${current.label || `Variant ${this.selectedIndex + 1}`}</sl-button>
            <sl-menu @sl-select=${this.handleSelect}>
              ${this.variants.map((variant, index) => html`
                <sl-menu-item value="${index}">${variant.label || `Variant ${index + 1}`}</sl-menu-item>
              `)}
            </sl-menu>
          </sl-dropdown>
        </div>
      </div>
    `;
  }

  private handleSelect(e: CustomEvent) {
    const value = e.detail?.item?.value;
    if (value === undefined) return;
    const idx = parseInt(value, 10);
    if (idx >= 0 && idx < this.variants.length) {
      this.selectedIndex = idx;
    }
  }

  render() {
    if (this.variants.length === 0) return nothing;

    const current = this.variants[this.selectedIndex] || this.variants[0];
    if (!current) return nothing;

    return html`
      ${this.renderSelector()}
      <terminal-example>${current.command}</terminal-example>
    `;
  }
}
