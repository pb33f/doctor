import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {renderMarkdown} from '../../utils/markdown.js';
import {LightElement} from '@pb33f/printing-press-components/base/light-element.js';

@customElement('pp-model-card')
export class PpModelCard extends LightElement {

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
