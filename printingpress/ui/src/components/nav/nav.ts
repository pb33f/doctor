import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navCss from './nav.css.js';

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

interface NavModelGroup {
  Name: string;
  TypeSlug: string;
  Models: NavModel[] | null;
}

interface NavModel {
  Name: string;
  Slug: string;
  TypeSlug: string;
}

@customElement('pp-nav')
export class PpNav extends LitElement {
  static styles = navCss;

  @state() private tags: NavTag[] = [];
  @state() private modelGroups: NavModelGroup[] = [];
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
    const modelsRaw = this.getAttribute('data-models');
    if (modelsRaw) {
      try {
        this.modelGroups = JSON.parse(modelsRaw);
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
      ${this.modelGroups.length
        ? html`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map((group) => html`<pp-nav-model-group .group=${group} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `
        : nothing}
    `;
  }
}
