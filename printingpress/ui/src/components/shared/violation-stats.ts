import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {getPageDeveloperPayload, type PageDeveloperPayload} from '../../utils/page-payload.js';
import {pluralLabel, violationTotal} from '../../utils/violations.js';
import violationStatsCss from './violation-stats.css.js';

@customElement('pp-violation-stats')
export class PpViolationStats extends LitElement {
  static styles = violationStatsCss;

  @property({attribute: 'data-scope-label'}) scopeLabel = '';
  @property({attribute: 'data-title'}) drawerTitle = '';
  @property({attribute: 'data-method'}) method = '';
  @property({attribute: 'data-path'}) path = '';
  @property({attribute: 'data-component-type'}) componentType = '';
  @state() private payload: PageDeveloperPayload | null = null;

  async firstUpdated() {
    this.payload = await getPageDeveloperPayload();
  }

  private resolveDrawerContext() {
    const root = this.getRootNode() as Document | ShadowRoot;
    const rawViewer = root.querySelector?.('#pp-operation-raw, #pp-model-raw') as HTMLElement | null;
    const iconTitle = root.querySelector?.('pp-icon-title[icon][heading]') as HTMLElement | null;
    const scopeLabel = this.scopeLabel.trim();
    const parsedOperation = /^(GET|PUT|POST|DELETE|PATCH|OPTIONS|HEAD|TRACE)\s+(.+)$/i.exec(scopeLabel);
    const method = this.method || rawViewer?.getAttribute('method') || parsedOperation?.[1] || '';
    const path = this.path || rawViewer?.getAttribute('path') || parsedOperation?.[2] || '';
    const componentType = this.componentType
      || rawViewer?.getAttribute('component-type')
      || iconTitle?.getAttribute('icon')
      || '';
    const title = this.drawerTitle
      || rawViewer?.getAttribute('title')
      || iconTitle?.getAttribute('heading')
      || scopeLabel
      || 'Diagnostics';

    return {title, method, path, componentType};
  }

  private showDetails() {
    if (!this.payload || !this.payload.problems.length) return;
    const context = this.resolveDrawerContext();
    window.dispatchEvent(new CustomEvent('pp-show-problems', {
      detail: {
        scopeLabel: context.title,
        title: context.title,
        method: context.method,
        path: context.path,
        componentType: context.componentType,
        problems: this.payload.problems,
        slices: this.payload.slices,
        metadata: this.payload.metadata,
      },
    }));
  }

  private renderStat(count: number | undefined, severity: 'err' | 'warn' | 'info', icon: string, singular: string, plural?: string) {
    const value = count || 0;
    if (value <= 0) return nothing;
    return html`
      <div class="stat ${severity}">
        <sl-icon name=${icon} aria-hidden="true"></sl-icon>
        <span class="label">${value}</span>
        <span class="violation">${pluralLabel(value, singular, plural)}</span>
      </div>
    `;
  }

  render() {
    const counts = this.payload?.counts;
    if (!this.payload || !counts || violationTotal(counts) === 0) {
      return nothing;
    }
    return html`
      <div class="stats" role="group" aria-label="Diagnostics">
        ${this.renderStat(counts.errors, 'err', 'exclamation-square', 'error')}
        ${this.renderStat(counts.warns, 'warn', 'exclamation-triangle', 'warning')}
        ${this.renderStat(counts.infos, 'info', 'info-square', 'info', 'infos')}
        <sl-button class="details-button" size="medium" @click=${this.showDetails}>
          OPEN PROBLEMS
        </sl-button>
      </div>
    `;
  }
}
