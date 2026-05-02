import {LitElement, html, nothing} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import type {PageProblem, ProblemMetadata, YamlSliceData} from '../../utils/page-payload.js';
import markdownCss from '../../styles/markdown.css.js';
import {renderMarkdown} from '../../utils/markdown.js';
import {problemSeverityClass, problemSeverityIcon, problemSeverityLabel} from '../../utils/violations.js';
import problemsDrawerCss from './problems-drawer.css.js';
import './code-viewer.js';

interface ShowProblemsDetail {
  scopeLabel?: string;
  title?: string;
  method?: string;
  path?: string;
  componentType?: string;
  problems?: PageProblem[];
  slices?: Record<string, YamlSliceData>;
  metadata?: Record<string, ProblemMetadata>;
}

@customElement('pp-problems-drawer')
export class PpProblemsDrawer extends LitElement {
  static styles = [markdownCss, problemsDrawerCss];

  @query('sl-drawer') private drawer: any;
  @query('pp-code-viewer') private viewer?: {scrollToLine(line: number): void};
  @state() private scopeLabel = 'Diagnostics';
  @state() private method = '';
  @state() private path = '';
  @state() private componentType = '';
  @state() private problems: PageProblem[] = [];
  @state() private slices: Record<string, YamlSliceData> = {};
  @state() private metadata: Record<string, ProblemMetadata> = {};
  @state() private selectedID = '';

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('pp-show-problems', this.handleShowProblems as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pp-show-problems', this.handleShowProblems as EventListener);
  }

  private handleShowProblems = async (event: CustomEvent<ShowProblemsDetail>) => {
    const detail = event.detail || {};
    this.scopeLabel = detail.title || detail.scopeLabel || 'Diagnostics';
    this.method = detail.method || '';
    this.path = detail.path || '';
    this.componentType = detail.componentType || '';
    this.problems = detail.problems || [];
    this.slices = detail.slices || {};
    this.metadata = detail.metadata || {};
    this.selectedID = this.problems[0]?.id || '';
    await this.updateComplete;
    this.closeExampleDrawer();
    if (this.drawer?.show) {
      this.drawer.show();
      await this.waitForDrawerShown();
      this.scrollSelectedIntoView();
    }
  };

  private closeExampleDrawer() {
    const example = document.querySelector('pp-example-drawer') as HTMLElement | null;
    const drawer = example?.shadowRoot?.querySelector('sl-drawer') as any;
    drawer?.hide?.();
  }

  private waitForDrawerShown(): Promise<void> {
    return new Promise((resolve) => {
      const drawer = this.drawer as HTMLElement | undefined;
      if (!drawer) {
        resolve();
        return;
      }
      drawer.addEventListener('sl-after-show', () => resolve(), {once: true});
    });
  }

  private selectProblem(problem: PageProblem) {
    this.selectedID = problem.id;
    this.updateComplete.then(() => this.scrollSelectedIntoView());
  }

  private scrollSelectedIntoView() {
    const selected = this.selectedProblem;
    if (!selected) return;
    this.viewer?.scrollToLine(selected.startLineNumber);
  }

  private get selectedProblem(): PageProblem | undefined {
    return this.problems.find((problem) => problem.id === this.selectedID) || this.problems[0];
  }

  private get selectedSlice(): YamlSliceData | undefined {
    const selected = this.selectedProblem;
    if (!selected) return undefined;
    const key = this.metadata[selected.id]?.sliceKey || selected.sliceKey || '';
    return key ? this.slices[key] : undefined;
  }

  private highlightLines(problem: PageProblem): string {
    const start = problem.startLineNumber;
    const end = problem.endLineNumber || start;
    if (start <= 0) return '';
    return end > start ? `${start}-${end}` : `${start}`;
  }

  private sliceLanguage(slice: YamlSliceData): 'json' | 'yaml' {
    return slice.file.toLowerCase().endsWith('.json') ? 'json' : 'yaml';
  }

  private displayLocation(location: string): string {
    return location.split(/[\\/]/).pop() || location;
  }

  private renderHeaderContext() {
    if (this.method && this.path) {
      return html`
        <div class="rich-header">
          <pb33f-http-method method=${this.method}></pb33f-http-method>
          <pb33f-render-operation-path path=${this.path} nowrap></pb33f-render-operation-path>
        </div>
      `;
    }
    if (this.componentType) {
      return html`
        <div class="component-header">
          <pb33f-model-icon icon=${this.componentType} size="large"></pb33f-model-icon>
          <span class="drawer-component-title">${this.scopeLabel}</span>
        </div>
      `;
    }
    return html`<h3>${this.scopeLabel}</h3>`;
  }

  render() {
    const selected = this.selectedProblem;
    const slice = this.selectedSlice;
    return html`
      <sl-drawer placement="bottom" no-header label="Diagnostics" style="--size: 50vh">
        <div class="drawer-header">
          <div class="drawer-title">
            ${this.renderHeaderContext()}
            <span class="problem-count">
              <span class="count-value">${this.problems.length}</span>
              <span class="count-label">problem${this.problems.length === 1 ? '' : 's'}</span>
            </span>
          </div>
          <sl-icon-button name="x-lg" label="Close" @click=${() => this.drawer?.hide()}></sl-icon-button>
        </div>
        <sl-split-panel position="35" class="split">
          <div slot="start" class="problem-list">
            ${this.problems.map((problem) => html`
              <button
                class="problem ${problemSeverityClass(problem.severity)} ${problem.id === selected?.id ? 'active' : ''}"
                @click=${() => this.selectProblem(problem)}
              >
                <span class="line">${problem.startLineNumber || '-'}</span>
                <sl-icon
                  class="severity-icon"
                  name=${problemSeverityIcon(problem.severity)}
                  label=${problemSeverityLabel(problem.severity)}
                ></sl-icon>
                ${renderMarkdown(problem.message, {className: 'message pp-markdown-inline', inline: true})}
              </button>
            `)}
          </div>
          <sl-icon slot="divider" name="grip-vertical"></sl-icon>
          <div slot="end" class="slice-panel">
            ${slice && selected
              ? html`
                <pp-code-viewer
                  .code=${slice.source}
                  .language=${this.sliceLanguage(slice)}
                  .startLine=${slice.firstLine}
                  .location=${this.displayLocation(slice.file || selected.sourceLocation || '')}
                  line-numbers
                  embedded
                  highlight-lines=${this.highlightLines(selected)}
                ></pp-code-viewer>
              `
              : html`<div class="empty">No source slice available</div>`}
          </div>
        </sl-split-panel>
      </sl-drawer>
    `;
  }
}
