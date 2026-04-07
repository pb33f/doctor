import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import markdownCss from '../../styles/markdown.css.js';
import {renderMarkdown} from '../../utils/markdown.js';
import modelCardCss from './model-card.css.js';

@customElement('pp-model-card')
export class PpModelCard extends LitElement {
  static styles = [markdownCss, modelCardCss];

  @property() name = '';
  @property() href = '';
  @property() description = '';

  render() {
    return html`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${renderMarkdown(this.description)}
      </a>
    `;
  }
}
