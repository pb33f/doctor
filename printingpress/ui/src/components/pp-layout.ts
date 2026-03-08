import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import ppLayoutCss from './pp-layout.css.js';

@customElement('pp-layout')
export class PpLayout extends LitElement {
  static styles = ppLayoutCss;

  @state() title = '';

  connectedCallback() {
    super.connectedCallback();
    this.title = this.getAttribute('data-title') || document.title || 'API Documentation';
  }

  render() {
    return html`
      <pb33f-header name=${this.title} url="index.html" wide>
        <pb33f-theme-switcher></pb33f-theme-switcher>
      </pb33f-header>
      <slot name="nav"></slot>
      <slot name="content"></slot>
    `;
  }
}
