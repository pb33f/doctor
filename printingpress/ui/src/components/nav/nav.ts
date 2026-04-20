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
  private loggedEmptyState = false;
  private loggedContentState = false;

  private logPerf(stage: string, detail?: unknown) {
    const logger = (globalThis as Record<string, unknown>).__PP_LOG as ((stage: string, detail?: unknown) => void) | undefined;
    if (typeof logger === 'function') {
      logger(stage, detail);
    }
  }

  private previewHoldEnabled(): boolean {
    return this.getAttribute('data-pp-preview-hold') === 'true';
  }

  connectedCallback() {
    super.connectedCallback();
    const preview = this.querySelector('.pp-nav-preview');
    this.logPerf('nav:connected', {
      activeSlug: this.activeSlug,
      cached: this.hasAttribute('data-pp-nav-cached'),
      preview: !!preview,
      previewHold: this.previewHoldEnabled(),
    });
  }

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

  updated() {
    const hasContent = this.tags.length > 0 || this.modelGroups.length > 0 || this.webhooks.length > 0;
    if (!hasContent && !this.loggedEmptyState) {
      this.loggedEmptyState = true;
      this.logPerf('nav:empty-render');
    }
    if (hasContent && !this.loggedContentState) {
      this.loggedContentState = true;
      this.logPerf('nav:content-render', {
        tags: this.tags.length,
        modelGroups: this.modelGroups.length,
        webhooks: this.webhooks.length,
      });
      if (this.previewHoldEnabled()) {
        this.logPerf('nav-preview:hold-active', {source: 'shadow-nav'});
        return;
      }
      const preview = this.querySelector('.pp-nav-preview');
      if (preview) {
        preview.remove();
        this.logPerf('nav-preview:removed', {source: 'shadow-nav'});
      }
    }
  }

  render() {
    if (this.previewHoldEnabled()) {
      return html`<slot></slot>`;
    }
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
