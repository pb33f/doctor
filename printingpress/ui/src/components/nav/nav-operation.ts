import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import navOperationCss from './nav-operation.css.js';
import {operationHref} from '../../utils/doc-links.js';
import '../shared/asyncapi-action.js';
import ppComponentsCss from '../../styles/pp-components.css.js';

@customElement('pp-nav-operation')
export class PpNavOperation extends LitElement {
  static styles = [ppComponentsCss, navOperationCss];

  @property() specKind = '';
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
        ${this.specKind === 'asyncapi'
          ? html`<pp-asyncapi-action action=${this.method} size="small"></pp-asyncapi-action>`
          : html`<pp-http-method method=${this.method}></pp-http-method>`}
        <span class="path">${this.path}</span>
      </a>
    `;
  }
}
