import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import navOperationCss from './nav-operation.css.js';
import {operationHref} from '../../utils/doc-links.js';

@customElement('pp-nav-operation')
export class PpNavOperation extends LitElement {
  static styles = navOperationCss;

  @property() method = '';
  @property() path = '';
  @property() slug = '';
  @property({type: Boolean}) deprecated = false;

  render() {
    return html`
      <a
        href=${operationHref(this.slug)}
        class=${this.deprecated ? 'deprecated' : ''}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `;
  }
}
