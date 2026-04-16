import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navCss from './nav.css.js';
import {overviewHref} from '../../utils/doc-links.js';

interface NavTag {
  name: string;
  summary: string;
  children: NavTag[] | null;
  operations: NavOperation[] | null;
  isNavOnly: boolean;
}

interface NavOperation {
  method: string;
  path: string;
  operationId: string;
  summary: string;
  slug: string;
  deprecated: boolean;
}

interface NavModelGroup {
  name: string;
  typeSlug: string;
  models: NavModel[] | null;
}

interface NavModel {
  name: string;
  slug: string;
  typeSlug: string;
}

@customElement('pp-nav')
export class PpNav extends LitElement {
  static styles = navCss;

  @property({attribute: 'data-nav'}) navJson = '';
  @property({attribute: 'data-models'}) modelsJson = '';
  @property({attribute: 'data-webhooks'}) webhooksJson = '';
  @property({attribute: 'data-active'}) activeSlug = '';
  @state() private tags: NavTag[] = [];
  @state() private modelGroups: NavModelGroup[] = [];
  @state() private webhooks: NavOperation[] = [];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('navJson')) {
      try {
        this.tags = this.navJson ? JSON.parse(this.navJson) || [] : [];
      } catch {
        this.tags = [];
      }
    }
    if (changed.has('modelsJson')) {
      try {
        this.modelGroups = this.modelsJson ? JSON.parse(this.modelsJson) || [] : [];
      } catch {
        this.modelGroups = [];
      }
    }
    if (changed.has('webhooksJson')) {
      try {
        this.webhooks = this.webhooksJson ? JSON.parse(this.webhooksJson) || [] : [];
      } catch {
        this.webhooks = [];
      }
    }
  }

  render() {
    return html`
      <a class="nav-home ${!this.activeSlug ? 'active' : ''}" href=${overviewHref()}>
        <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
        API OVERVIEW
      </a>
      ${this.tags.length
        ? html`
            <div class="nav-section nav-operations-section">
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
      ${this.webhooks.length
          ? html`
            <div class="nav-section nav-webhooks-section">
              <h4>Webhooks</h4>
              <pp-nav-tag
                .tag=${{name: 'Webhooks', summary: 'Webhooks', children: null, operations: this.webhooks, isNavOnly: false} as NavTag}
                .activeSlug=${this.activeSlug}
              ></pp-nav-tag>
            </div>
          `
          : nothing}
    `;
  }
}
