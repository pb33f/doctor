import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import layoutCss from './layout.css.js';

const SPLIT_POS_KEY = 'pp-split-position';
const DEFAULT_POS = 20;

@customElement('pp-layout')
export class PpLayout extends LitElement {
  static styles = layoutCss;

  @state() title = '';
  @state() private splitPos = DEFAULT_POS;

  connectedCallback() {
    super.connectedCallback();
    this.title = this.getAttribute('data-title') || document.title || 'API Documentation';
    const saved = sessionStorage.getItem(SPLIT_POS_KEY);
    if (saved) {
      this.splitPos = parseFloat(saved);
    }
  }

  private onReposition(e: CustomEvent) {
    const pos = (e.target as any).position;
    if (typeof pos === 'number') {
      this.splitPos = pos;
      sessionStorage.setItem(SPLIT_POS_KEY, String(pos));
    }
  }

  render() {
    return html`
      <pb33f-header name=${this.title} url="index.html" fluid>
        <div class="theme-controls">
            <pb33f-theme-switcher></pb33f-theme-switcher>
        </div>
      </pb33f-header>
      <sl-split-panel position=${this.splitPos} @sl-reposition=${this.onReposition}>
        <sl-icon slot="divider" name="grip-vertical" class="divider-vert" aria-hidden="true"></sl-icon>
        <div slot="start" class="nav-panel">
          <slot name="nav"></slot>
        </div>
        <div slot="end" class="content-panel">
          <slot name="content"></slot>
        </div>
      </sl-split-panel>
    `;
  }
}
