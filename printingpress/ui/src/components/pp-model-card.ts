import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import ppModelCardCss from './pp-model-card.css.js';

@customElement('pp-model-card')
export class PpModelCard extends LitElement {
  static styles = ppModelCardCss;

  @property() name = '';
  @property() href = '';
  @property() description = '';

  render() {
    return html`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description ? html`<p>${this.description}</p>` : ''}
      </a>
    `;
  }
}
