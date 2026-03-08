import {LitElement, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import ppNavTagCss from './pp-nav-tag.css.js';

interface NavTag {
  Name: string;
  Summary: string;
  Children: NavTag[] | null;
  Operations: NavOperation[] | null;
  IsNavOnly: boolean;
}

interface NavOperation {
  Method: string;
  Path: string;
  Slug: string;
  Summary: string;
  Deprecated: boolean;
}

function tagContainsSlug(tag: NavTag, slug: string): boolean {
  if (!slug) return false;
  if (tag.Operations?.some((op) => op.Slug === slug)) return true;
  if (tag.Children?.some((child) => tagContainsSlug(child, slug))) return true;
  return false;
}

@customElement('pp-nav-tag')
export class PpNavTag extends LitElement {
  static styles = ppNavTagCss;

  @property({type: Object}) tag: NavTag = {
    Name: '',
    Summary: '',
    Children: null,
    Operations: null,
    IsNavOnly: false,
  };

  @property() activeSlug = '';

  render() {
    const {tag, activeSlug} = this;
    const isOpen = tagContainsSlug(tag, activeSlug);
    return html`
      <details ?open=${isOpen}>
        <summary>${tag.Name}</summary>
        ${tag.Operations?.length
          ? html`
              <ul>
                ${tag.Operations.map(
                  (op) => html`
                    <li>
                      <a
                        href="operations/${op.Slug}.html"
                        class="${op.Deprecated ? 'deprecated' : ''} ${op.Slug === activeSlug ? 'active' : ''}"
                      >
                        <pb33f-http-method method=${op.Method}></pb33f-http-method>
                        <span class="path">${op.Path}</span>
                      </a>
                    </li>
                  `
                )}
              </ul>
            `
          : nothing}
        ${tag.Children?.length
          ? html`
              <div class="children">
                ${tag.Children.map(
                  (child) => html`<pp-nav-tag .tag=${child} .activeSlug=${activeSlug}></pp-nav-tag>`
                )}
              </div>
            `
          : nothing}
      </details>
    `;
  }
}
