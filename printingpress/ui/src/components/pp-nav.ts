import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import ppNavCss from './pp-nav.css.js';

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
  OperationID: string;
  Summary: string;
  Slug: string;
  Deprecated: boolean;
}

@customElement('pp-nav')
export class PpNav extends LitElement {
  static styles = ppNavCss;

  @state() private tags: NavTag[] = [];
  @state() private activeSlug = '';

  connectedCallback() {
    super.connectedCallback();
    const raw = this.getAttribute('data-nav');
    if (raw) {
      try {
        this.tags = JSON.parse(raw);
      } catch {
        // ignore parse errors
      }
    }
    this.activeSlug = this.getAttribute('data-active') || '';
  }

  render() {
    return html`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length
        ? html`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map((tag) => html`<pp-nav-tag .tag=${tag} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `
        : nothing}
    `;
  }
}
