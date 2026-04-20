import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import layoutCss from './layout.css.js';
import sharedCss from "../../styles/shared.css";
import {docHref, headerTitleHref} from '../../utils/doc-links.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

const SPLIT_POS_KEY = 'pp-split-position';
const DEFAULT_POS = 20;

type HeaderVersionLink = {
  label: string;
  href: string;
  active?: boolean;
};

@customElement('pp-layout')
export class PpLayout extends LitElement {
  static styles = [layoutCss, sharedCss];

  @state() title = '';
  @state() private splitPos = DEFAULT_POS;
  @state() private currentVersion = '';
  @state() private versions: HeaderVersionLink[] = [];
  @state() private catalogHref = '';

  connectedCallback() {
    super.connectedCallback();
    this.title = this.getAttribute('data-title') || document.title || 'API Documentation';
    this.currentVersion = document.body?.dataset.ppCurrentVersion || '';
    this.versions = this.parseVersions(document.body?.dataset.ppVersions);
    this.catalogHref = document.body?.dataset.ppCatalogHref ? docHref(document.body.dataset.ppCatalogHref) : '';
    const saved = sessionStorage.getItem(SPLIT_POS_KEY);
    if (saved) {
      this.splitPos = parseFloat(saved);
    }
  }

  private onReposition(e: CustomEvent) {
    const pos = (e.target as any).position;
    if (typeof pos === 'number') {
      this.splitPos = pos;
      sessionStorage.setItem(SPLIT_POS_KEY, String(pos));
    }
  }

  private parseVersions(raw?: string): HeaderVersionLink[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((entry): entry is HeaderVersionLink =>
        !!entry && typeof entry.label === 'string' && typeof entry.href === 'string',
      );
    } catch {
      return [];
    }
  }

  private onVersionChange(event: Event) {
    const detail = (event as CustomEvent).detail;
    const item = detail?.item as { value?: string } | undefined;
    if (!item?.value) {
      return;
    }
    window.location.href = item.value;
  }

  private currentVersionLabel(): string {
    const active = this.versions.find((version) => version.active || version.label === this.currentVersion);
    return active?.label || this.currentVersion || this.versions[0]?.label || 'Version';
  }

  private currentVersionTriggerLabel(): string {
    return `Version: ${this.currentVersionLabel()}`;
  }

  render() {
    return html`
      <pb33f-header name=${this.title} url=${headerTitleHref()} fluid>
        <div class="header-tools">
          ${this.catalogHref || this.versions.length
            ? html`
                <div class="header-context">
                  ${this.catalogHref
                    ? html`
                        <a class="catalog-backlink" href=${this.catalogHref}>
                          <sl-icon name="arrow-90deg-up" aria-hidden="true"></sl-icon>
                          <span>API Catalog</span>
                        </a>
                      `
                    : null}
                  ${this.versions.length
                    ? html`
                        <div class="version-picker">
                          <sl-dropdown skidding="5" distance="5">
                            <sl-button slot="trigger" caret>${this.currentVersionTriggerLabel()}</sl-button>
                            <sl-menu @sl-select=${this.onVersionChange}>
                              ${this.versions.map(
                                (version) => html`
                                  <sl-menu-item value=${docHref(version.href)}>
                                    ${version.label}
                                  </sl-menu-item>
                                `,
                              )}
                            </sl-menu>
                          </sl-dropdown>
                        </div>
                      `
                    : null}
                </div>
              `
            : null}
          <div class="theme-controls">
            <pb33f-theme-switcher></pb33f-theme-switcher>
          </div>
        </div>
      </pb33f-header>
      <sl-split-panel position=${this.splitPos} @sl-reposition=${this.onReposition}>
        <sl-icon slot="divider" name="grip-vertical" class="divider-vert" aria-hidden="true"></sl-icon>
        <div slot="start" class="nav-panel">
          <slot name="nav"></slot>
        </div>
        <div slot="end" class="content-panel">
          <slot name="content"></slot>
        </div>
      </sl-split-panel>
    `;
  }
}
