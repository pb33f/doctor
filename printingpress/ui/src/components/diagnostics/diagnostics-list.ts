import {LitElement, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {getPageDeveloperPayload, type PageDeveloperPayload, type PageProblem, type ProblemMetadata} from '../../utils/page-payload.js';
import {docHref} from '../../utils/doc-links.js';
import {pluralLabel, problemSeverityClass, problemSeverityIcon, problemSeverityLabel} from '../../utils/violations.js';
import {renderMarkdown} from '../../utils/markdown.js';
import markdownCss from '../../styles/markdown.css.js';
import diagnosticsListCss from './diagnostics-list.css.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@pb33f/cowboy-components/components/paginator/paginator-navigator.js';

enum ProblemSortView {
  LineNumber = 'Line Number',
  Severity = 'Severity',
}

const SORT_OPTIONS = Object.values(ProblemSortView);

interface ProblemGroup {
  key: string;
  title: string;
  icon: string;
  order: number;
  problems: PageProblem[];
}

const GROUP_LABELS: Record<string, string> = {
  operations: 'Operations',
  schemas: 'Schemas',
  parameters: 'Parameters',
  responses: 'Responses',
  requestBodies: 'Request Bodies',
  headers: 'Headers',
  securitySchemes: 'Security Schemes',
  examples: 'Examples',
  links: 'Links',
  callbacks: 'Callbacks',
  pathItems: 'Path Items',
};

const GROUP_ORDER: Record<string, number> = {
  operations: 10,
  schemas: 20,
  parameters: 30,
  responses: 40,
  requestBodies: 50,
  headers: 60,
  securitySchemes: 70,
  examples: 80,
  links: 90,
  callbacks: 100,
  pathItems: 110,
  overview: 900,
  unlinked: 1000,
};

@customElement('pp-diagnostics-list')
export class PpDiagnosticsList extends LitElement {
  static styles = [markdownCss, diagnosticsListCss];

  @state() private payload: PageDeveloperPayload | null = null;
  @state() private selectedSort: ProblemSortView = ProblemSortView.Severity;
  @state() private currentPage = 1;
  @state() private groupPages: Record<string, number> = {};
  @state() private groupSorts: Record<string, ProblemSortView> = {};
  @state() private activePanel = 'list-view';
  private readonly itemsPerPage = 20;
  private sortCache = new Map<string, {problems: PageProblem[]; sort: ProblemSortView; value: PageProblem[]}>();
  private groupCache: {problems: PageProblem[]; value: ProblemGroup[]} | null = null;

  async firstUpdated() {
    this.payload = await getPageDeveloperPayload();
  }

  private handleSortSelect(event: CustomEvent) {
    const value = event.detail?.item?.value;
    if (SORT_OPTIONS.includes(value)) {
      this.selectedSort = value as ProblemSortView;
      this.currentPage = 1;
    }
  }

  private handleGroupSortSelect(group: ProblemGroup, event: CustomEvent) {
    const value = event.detail?.item?.value;
    if (SORT_OPTIONS.includes(value)) {
      this.groupSorts = {
        ...this.groupSorts,
        [group.key]: value as ProblemSortView,
      };
      this.setGroupPage(group.key, 1, group.problems.length);
    }
  }

  private handleTabShow(event: CustomEvent) {
    const name = event.detail?.name;
    if (name === 'list-view' || name === 'grouped-view') {
      this.activePanel = name;
    }
  }

  private totalPages(totalItems: number): number {
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  }

  private handleFirstPage(event: Event) {
    event.stopPropagation();
    this.currentPage = 1;
  }

  private handlePreviousPage(event: Event) {
    event.stopPropagation();
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  private handleNextPage(event: Event) {
    event.stopPropagation();
    this.currentPage = Math.min(this.totalPages(this.payload?.problems.length || 0), this.currentPage + 1);
  }

  private handleLastPage(event: Event) {
    event.stopPropagation();
    this.currentPage = this.totalPages(this.payload?.problems.length || 0);
  }

  private groupCurrentPage(groupKey: string, totalItems: number): number {
    return Math.min(this.groupPages[groupKey] || 1, this.totalPages(totalItems));
  }

  private groupSort(groupKey: string): ProblemSortView {
    return this.groupSorts[groupKey] || ProblemSortView.Severity;
  }

  private setGroupPage(groupKey: string, page: number, totalItems: number) {
    this.groupPages = {
      ...this.groupPages,
      [groupKey]: Math.min(Math.max(1, page), this.totalPages(totalItems)),
    };
  }

  private handleGroupFirstPage(group: ProblemGroup, event: Event) {
    event.stopPropagation();
    this.setGroupPage(group.key, 1, group.problems.length);
  }

  private handleGroupPreviousPage(group: ProblemGroup, event: Event) {
    event.stopPropagation();
    this.setGroupPage(group.key, this.groupCurrentPage(group.key, group.problems.length) - 1, group.problems.length);
  }

  private handleGroupNextPage(group: ProblemGroup, event: Event) {
    event.stopPropagation();
    this.setGroupPage(group.key, this.groupCurrentPage(group.key, group.problems.length) + 1, group.problems.length);
  }

  private handleGroupLastPage(group: ProblemGroup, event: Event) {
    event.stopPropagation();
    this.setGroupPage(group.key, this.totalPages(group.problems.length), group.problems.length);
  }

  private location(problem: PageProblem): string {
    const line = problem.startLineNumber > 0 ? problem.startLineNumber : '-';
    const column = problem.startColumn > 0 ? problem.startColumn : '-';
    return `${line}:${column}`;
  }

  private metadata(problem: PageProblem): Partial<ProblemMetadata> {
    return this.payload?.metadata?.[problem.id] || {};
  }

  private problemHref(problem: PageProblem, metadata: Partial<ProblemMetadata> = this.metadata(problem)): string {
    return problem.pageHref || metadata.pageHref || '';
  }

  private componentLabel(component: string): string {
    if (GROUP_LABELS[component]) {
      return GROUP_LABELS[component];
    }
    return component
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private groupKey(problem: PageProblem): {key: string; title: string; icon: string; order: number} {
    const metadata = this.metadata(problem);
    const kind = problem.pageKind || metadata.pageKind || '';
    const component = problem.pageComponent || metadata.pageComponent || '';

    if (kind === 'operation') {
      return {
        key: 'operations',
        title: GROUP_LABELS.operations,
        icon: 'operations',
        order: GROUP_ORDER.operations,
      };
    }

    if (kind === 'model' && component) {
      return {
        key: component,
        title: this.componentLabel(component),
        icon: component,
        order: GROUP_ORDER[component] || 500,
      };
    }

    if (kind === 'overview') {
      return {
        key: 'overview',
        title: 'API Overview',
        icon: 'document',
        order: GROUP_ORDER.overview,
      };
    }

    return {
      key: 'unlinked',
      title: 'Unlinked',
      icon: 'document',
      order: GROUP_ORDER.unlinked,
    };
  }

  private renderTarget(problem: PageProblem) {
    const metadata = this.metadata(problem);
    const href = this.problemHref(problem, metadata);
    const title = problem.pageTitle || metadata.pageTitle || '';
    const kind = problem.pageKind || metadata.pageKind || '';
    const method = problem.pageMethod || metadata.pageMethod || '';
    const path = problem.pagePath || metadata.pagePath || '';
    const operationId = problem.pageOperationId || metadata.pageOperationId || '';
    const component = problem.pageComponent || metadata.pageComponent || '';
    const label = title || href;

    if (!href) {
      return html`<span class="page empty-page">${label}</span>`;
    }
    if (kind === 'operation' && method && (operationId || path)) {
      return html`
        <a class="page page-operation" href=${docHref(href)}>
          ${operationId
            ? html`<span class="operation-label">${operationId}</span>`
            : html`<pb33f-render-operation-path path=${path} nowrap></pb33f-render-operation-path>`}
          <pb33f-http-method mode="nav-naked" method=${method}></pb33f-http-method>
        </a>
      `;
    }
    if (kind === 'model' && component) {
      return html`
        <a class="page page-model" href=${docHref(href)}>
          <pb33f-model-icon icon=${component} size="small"></pb33f-model-icon>
          <span>${label}</span>
        </a>
      `;
    }
    return html`<a class="page" href=${docHref(href)}>${label}</a>`;
  }

  private renderProblemMessage(problem: PageProblem) {
    const message = renderMarkdown(problem.message, {className: 'message pp-markdown-inline', inline: true});
    const href = this.problemHref(problem);
    if (!href) {
      return message;
    }
    return html`<a class="message-link" href=${docHref(href)}>${message}</a>`;
  }

  private renderSummaryStat(count: number | undefined, severity: 'err' | 'warn' | 'info', icon: string, singular: string, plural?: string) {
    const value = count || 0;
    if (value <= 0) return nothing;
    return html`
      <div class="stat ${severity}">
        <sl-icon name=${icon} aria-hidden="true"></sl-icon>
        <span>${value}</span>
        <small>${pluralLabel(value, singular, plural)}</small>
      </div>
    `;
  }

  private lineCompare(a: PageProblem, b: PageProblem): number {
    return (a.startLineNumber - b.startLineNumber)
      || (a.startColumn - b.startColumn)
      || a.id.localeCompare(b.id);
  }

  private compareProblems(a: PageProblem, b: PageProblem, sort: ProblemSortView): number {
    switch (sort) {
      case ProblemSortView.LineNumber:
        return this.lineCompare(a, b);
      case ProblemSortView.Severity:
        return (b.severity - a.severity) || this.lineCompare(a, b);
      default:
        return this.lineCompare(a, b);
    }
  }

  private sortProblems(problems: PageProblem[], sort: ProblemSortView): PageProblem[] {
    return [...problems].sort((a, b) => this.compareProblems(a, b, sort));
  }

  private memoizedSortProblems(key: string, problems: PageProblem[], sort: ProblemSortView): PageProblem[] {
    const cached = this.sortCache.get(key);
    if (cached && cached.problems === problems && cached.sort === sort) {
      return cached.value;
    }
    const value = this.sortProblems(problems, sort);
    this.sortCache.set(key, {problems, sort, value});
    return value;
  }

  private groupedProblems(problems: PageProblem[]): ProblemGroup[] {
    if (this.groupCache?.problems === problems) {
      return this.groupCache.value;
    }
    const groups = new Map<string, ProblemGroup>();
    for (const problem of problems) {
      const descriptor = this.groupKey(problem);
      let group = groups.get(descriptor.key);
      if (!group) {
        group = {...descriptor, problems: []};
        groups.set(descriptor.key, group);
      }
      group.problems.push(problem);
    }
    const value = [...groups.values()].sort((a, b) => (a.order - b.order) || a.title.localeCompare(b.title));
    this.groupCache = {problems, value};
    return value;
  }

  private renderSortControl(selectedSort: ProblemSortView, onSelect: (event: CustomEvent) => void) {
    return html`
      <div class="sort-filter">
        <span class="sort-label">Sort:</span>
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret size="small">${selectedSort}</sl-button>
          <sl-menu @sl-select=${onSelect}>
            ${SORT_OPTIONS.map((value) => html`
              <sl-menu-item value=${value} type="checkbox" .checked=${selectedSort === value}>
                ${value}
              </sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }

  private renderProblemRow(problem: PageProblem) {
    return html`
      <div class="row ${problemSeverityClass(problem.severity)}">
        <span class="severity">
          <sl-icon
            class="severity-icon"
            name=${problemSeverityIcon(problem.severity)}
            label=${problemSeverityLabel(problem.severity)}
          ></sl-icon>
        </span>
        <span class="location">${this.location(problem)}</span>
        ${this.renderProblemMessage(problem)}
        ${this.renderTarget(problem)}
      </div>
    `;
  }

  private renderListView(problems: PageProblem[]) {
    const totalPages = this.totalPages(problems.length);
    const currentPage = Math.min(this.currentPage, totalPages);
    const startIndex = (currentPage - 1) * this.itemsPerPage;
    const pageProblems = problems.slice(startIndex, startIndex + this.itemsPerPage);
    return html`
      <div class="list-toolbar">
        ${this.renderSortControl(this.selectedSort, this.handleSortSelect)}
      </div>
      <div class="list">
        ${problems.length
          ? html`
            <pb33f-paginator
              .currentPage=${currentPage}
              .totalPages=${totalPages}
              .totalItems=${problems.length}
              .itemsPerPage=${this.itemsPerPage}
              label="Problems"
              @paginatorFirstPage=${this.handleFirstPage}
              @paginatorPreviousPage=${this.handlePreviousPage}
              @paginatorNextPage=${this.handleNextPage}
              @paginatorLastPage=${this.handleLastPage}
            ></pb33f-paginator>
            ${pageProblems.map((problem) => this.renderProblemRow(problem))}
          `
          : html`<div class="empty">No diagnostics found</div>`}
      </div>
    `;
  }

  private renderGroupedView(problems: PageProblem[]) {
    const groups = this.groupedProblems(problems);
    return html`
      <div class="grouped-list">
        ${groups.length
          ? groups.map((group) => this.renderProblemGroup(group))
          : html`<div class="empty">No diagnostics found</div>`}
      </div>
    `;
  }

  private renderProblemGroup(group: ProblemGroup) {
    const sortedProblems = this.memoizedSortProblems(`group:${group.key}`, group.problems, this.groupSort(group.key));
    const totalPages = this.totalPages(sortedProblems.length);
    const currentPage = this.groupCurrentPage(group.key, sortedProblems.length);
    const startIndex = (currentPage - 1) * this.itemsPerPage;
    const pageProblems = sortedProblems.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <section class="problem-group">
        <div class="group-header">
          <div class="group-title">
            <pb33f-model-icon icon=${group.icon} size="medium"></pb33f-model-icon>
            <h2>${group.title}</h2>
          </div>
          <div class="group-actions">
            ${this.renderSortControl(this.groupSort(group.key), (event: CustomEvent) => this.handleGroupSortSelect(group, event))}
            <span class="group-count">${group.problems.length} ${pluralLabel(group.problems.length, 'problem')}</span>
          </div>
        </div>
        <div class="list group-problems">
          <pb33f-paginator
            .currentPage=${currentPage}
            .totalPages=${totalPages}
            .totalItems=${group.problems.length}
            .itemsPerPage=${this.itemsPerPage}
            label="Problems"
            @paginatorFirstPage=${(event: Event) => this.handleGroupFirstPage(group, event)}
            @paginatorPreviousPage=${(event: Event) => this.handleGroupPreviousPage(group, event)}
            @paginatorNextPage=${(event: Event) => this.handleGroupNextPage(group, event)}
            @paginatorLastPage=${(event: Event) => this.handleGroupLastPage(group, event)}
          ></pb33f-paginator>
          ${pageProblems.map((problem) => this.renderProblemRow(problem))}
        </div>
      </section>
    `;
  }

  render() {
    if (!this.payload) return nothing;
    const counts = this.payload.siteCounts || this.payload.counts;
    const problems = this.payload.problems || [];
    return html`
      <div class="summary" role="group" aria-label="Sitewide diagnostics">
        ${this.renderSummaryStat(counts.errors, 'err', 'exclamation-square', 'error')}
        ${this.renderSummaryStat(counts.warns, 'warn', 'exclamation-triangle', 'warning')}
        ${this.renderSummaryStat(counts.infos, 'info', 'info-square', 'info', 'infos')}
        ${this.payload.orphanCount
          ? html`<div class="stat orphan"><span>${this.payload.orphanCount}</span><small>${pluralLabel(this.payload.orphanCount, 'orphan')}</small></div>`
          : nothing}
      </div>
      <sl-tab-group class="diagnostics-tabs" @sl-tab-show=${this.handleTabShow}>
        <sl-tab slot="nav" panel="list-view">LIST VIEW</sl-tab>
        <sl-tab slot="nav" panel="grouped-view">GROUPED VIEW</sl-tab>
        <sl-tab-panel name="list-view">
          ${this.activePanel === 'list-view'
            ? this.renderListView(this.memoizedSortProblems('list', problems, this.selectedSort))
            : nothing}
        </sl-tab-panel>
        <sl-tab-panel name="grouped-view">
          ${this.activePanel === 'grouped-view' ? this.renderGroupedView(problems) : nothing}
        </sl-tab-panel>
      </sl-tab-group>
    `;
  }
}
