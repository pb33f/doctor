import {LitElement, html, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import constraintsCss from '../../styles/constraints.css.js';
import modelPageCss from './model-page.css.js';
import '../shared/inline-code.js';
import '../shared/code-viewer.js';
import '../shared/schema-properties.js';
import '../shared/example-selector.js';

import {collectConstraints} from '../../utils/schema.js';

@customElement('pp-model-page')
export class PpModelPage extends LitElement {
  static styles = [sharedCss, constraintsCss, modelPageCss];

  @property({attribute: 'model-json'}) modelJson = '';
  @property() name = '';
  @property({attribute: 'raw-yaml'}) rawYaml = '';
  @property({attribute: 'schema-raw-yaml'}) schemaRawYaml = '';
  @property({attribute: 'schema-raw-json'}) schemaRawJson = '';
  @property({attribute: 'schema-start-line', type: Number}) schemaStartLine = 1;
  @property({attribute: 'start-line', type: Number}) startLine = 1;
  @property() location = '';
  @property({attribute: 'mock-json'}) mockJson = '';
  @state() private parsed: any = null;
  @state() private wide = false;
  @state() private exampleJson = '';
  private resizeObserver: ResizeObserver | null = null;
  private paneResizeObserver: ResizeObserver | null = null;
  private _sizePending = false;
  private _rafId = 0;
  @query('.schema-split') splitPanel!: HTMLElement;
  @query('.schema-props-pane') propsPane!: HTMLElement;
  @query('.schema-example-pane') examplePane!: HTMLElement;
  private observedPropsPane: HTMLElement | null = null;
  private observedExamplePane: HTMLElement | null = null;
  private observedPropsContent: Element | null = null;
  private observedExampleContent: Element | null = null;

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.wide = this.offsetWidth >= 900;
      if (typeof ResizeObserver === 'undefined') return;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.wide = entry.contentRect.width >= 900;
        }
      });
      this.resizeObserver.observe(this);
      this.paneResizeObserver = new ResizeObserver(() => {
        this.sizeSplitPanel();
      });
    }, 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this._rafId);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.paneResizeObserver?.disconnect();
    this.paneResizeObserver = null;
    this.observedPropsPane = null;
    this.observedExamplePane = null;
    this.observedPropsContent = null;
    this.observedExampleContent = null;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('wide') || changed.has('parsed') || changed.has('exampleJson')) {
      this.sizeSplitPanel();
    }
    this.syncPaneObservers();
  }

  private sizeSplitPanel() {
    if (!this.splitPanel || !this.propsPane || !this.examplePane || this._sizePending) return;
    this._sizePending = true;
    this._rafId = requestAnimationFrame(() => {
      this._sizePending = false;
      if (!this.splitPanel || !this.propsPane || !this.examplePane) return;

      const propsHeight = this.measurePaneContentHeight(this.propsPane);
      const exampleHeight = this.measurePaneContentHeight(this.examplePane);

      const vh = document.documentElement.clientHeight || 800;
      const propCount = this.parsed?.properties ? Object.keys(this.parsed.properties).length : 0;
      const preferredHeight = Math.max(propsHeight, exampleHeight);
      const minHeight = propCount >= 6 ? 300 : 220;
      const h = Math.max(minHeight, Math.min(preferredHeight, vh * 0.75));
      const splitStyle = getComputedStyle(this.splitPanel);
      const splitPadding = parseFloat(splitStyle.paddingTop) + parseFloat(splitStyle.paddingBottom);
      this.splitPanel.style.height = `${h + splitPadding}px`;
    });
  }

  private measurePaneContentHeight(pane: HTMLElement): number {
    const children = Array.from(pane.children) as HTMLElement[];
    const contentHeight = children.reduce((sum, child) => {
      return sum + Math.max(child.offsetHeight, child.scrollHeight);
    }, 0);
    const style = getComputedStyle(pane);
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return contentHeight + padding;
  }

  private syncPaneObservers() {
    if (!this.paneResizeObserver || typeof ResizeObserver === 'undefined') return;
    const nextPropsPane = this.propsPane ?? null;
    const nextExamplePane = this.examplePane ?? null;
    const nextPropsContent = nextPropsPane?.firstElementChild ?? null;
    const nextExampleContent = nextExamplePane?.firstElementChild ?? null;

    if (this.observedPropsPane !== nextPropsPane) {
      if (this.observedPropsPane) this.paneResizeObserver.unobserve(this.observedPropsPane);
      if (nextPropsPane) this.paneResizeObserver.observe(nextPropsPane);
      this.observedPropsPane = nextPropsPane;
    }

    if (this.observedExamplePane !== nextExamplePane) {
      if (this.observedExamplePane) this.paneResizeObserver.unobserve(this.observedExamplePane);
      if (nextExamplePane) this.paneResizeObserver.observe(nextExamplePane);
      this.observedExamplePane = nextExamplePane;
    }

    if (this.observedPropsContent !== nextPropsContent) {
      if (this.observedPropsContent) this.paneResizeObserver.unobserve(this.observedPropsContent);
      if (nextPropsContent instanceof Element) this.paneResizeObserver.observe(nextPropsContent);
      this.observedPropsContent = nextPropsContent;
    }

    if (this.observedExampleContent !== nextExampleContent) {
      if (this.observedExampleContent) this.paneResizeObserver.unobserve(this.observedExampleContent);
      if (nextExampleContent instanceof Element) this.paneResizeObserver.observe(nextExampleContent);
      this.observedExampleContent = nextExampleContent;
    }
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('modelJson') && this.modelJson) {
      try {
        this.parsed = JSON.parse(this.modelJson);
      } catch {
        this.parsed = null;
      }
    }
    if (changed.has('parsed') || changed.has('mockJson')) {
      const schema = this.parsed;
      if (schema?.example !== undefined) {
        this.exampleJson = JSON.stringify(schema.example, null, 2);
      } else {
        this.exampleJson = this.mockJson || '';
      }
    }
  }

  private renderExamples(data: any, schema: any) {
    if (data.examples) {
      const examplesMap: Record<string, string> = {};
      const descriptionsMap: Record<string, string> = {};
      for (const [name, ex] of Object.entries(data.examples as Record<string, any>)) {
        if (ex.value !== undefined) examplesMap[name] = JSON.stringify(ex.value, null, 2);
        const desc = ex.description || ex.summary || '';
        if (desc) descriptionsMap[name] = desc;
      }
      if (!Object.keys(examplesMap).length) return nothing;
      const descAttr = Object.keys(descriptionsMap).length ? JSON.stringify(descriptionsMap) : '';
      return html`<pp-example-selector mode="inline"
        examples-json=${JSON.stringify(examplesMap)}
        descriptions-json=${descAttr}></pp-example-selector>`;
    }
    const example = data.example ?? schema?.example;
    if (example !== undefined) {
      return html`<pp-example-selector mode="inline" mock-json=${JSON.stringify(example, null, 2)}></pp-example-selector>`;
    }
    return nothing;
  }

  private collectSchemaEntries(schema: any): Array<{label: string; value: unknown; isCode?: boolean}> {
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [];
    if (schema.type) entries.push({label: 'type', value: schema.type + (schema.format ? ` (${schema.format})` : ''), isCode: true});
    if (schema.default !== undefined) entries.push({label: 'default', value: JSON.stringify(schema.default), isCode: true});
    for (const c of collectConstraints(schema)) entries.push(c);
    if (schema.enum?.length) {
      entries.push({label: 'enum', value: html`<div class="enum-grid">${schema.enum.map((v: any) => html`<span class="enum-value">${JSON.stringify(v)}</span>`)}</div>`});
    }
    return entries;
  }

  private renderPropertyGrid(entries: Array<{label: string; value: unknown; isCode?: boolean}>) {
    if (!entries.length) return nothing;
    return html`
      <div class="property-grid">
        ${entries.map(e => html`
          <div class="property-grid-entry">
            <span class="property-grid-label">${e.label}</span>
            <span class="property-grid-value">${e.isCode ? html`<code>${e.value}</code>` : e.value}</span>
          </div>
        `)}
      </div>
    `;
  }

  private renderParameter(data: any) {
    const schema = data.schema || {};
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [
      {label: 'name', value: data.name},
      {label: 'in', value: data.in},
    ];
    if (data.required !== undefined) entries.push({label: 'required', value: String(data.required)});
    if (data.deprecated) entries.push({label: 'deprecated', value: 'true'});
    entries.push(...this.collectSchemaEntries(schema));

    return html`
      ${schema.type !== 'boolean' ? this.renderExamples(data, schema) : nothing}
      ${this.renderPropertyGrid(entries)}
    `;
  }

  private renderHeader(data: any) {
    const schema = data.schema || {};
    const entries: Array<{label: string; value: unknown; isCode?: boolean}> = [];
    if (data.required) entries.push({label: 'required', value: 'true'});
    if (data.deprecated) entries.push({label: 'deprecated', value: 'true'});
    entries.push(...this.collectSchemaEntries(schema));

    return html`
      ${this.renderExamples(data, schema)}
      ${this.renderPropertyGrid(entries)}
    `;
  }

  private renderSchema(schema: any) {
    const isComplex = schema.properties || schema.allOf || schema.oneOf || schema.anyOf;

    if (!isComplex) {
      const entries = this.collectSchemaEntries(schema);
      return html`
        ${schema.type !== 'boolean' && this.exampleJson
          ? html`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`
          : nothing}
        ${this.renderPropertyGrid(entries)}
      `;
    }

    const heading = schema.properties ? 'Properties' : (schema.allOf ? 'Composition' : 'Variants');

    if (this.wide && this.exampleJson) {
      return this.renderSchemaSplit(heading);
    }
    return this.renderSchemaStacked(heading);
  }

  private renderSchemaSplit(heading: string) {
    return html`
      <sl-split-panel class="schema-split" position="60">
        <div slot="start" class="split-pane schema-props-pane">
          <h3>${heading}</h3>
          <pp-schema-properties schema-json=${this.modelJson} compact></pp-schema-properties>
        </div>
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>
        <div slot="end" class="split-pane schema-example-pane">
          <pp-example-selector mode="inline" mock-json=${this.exampleJson} hide-label show-expand
            example-title="${this.name} Example"></pp-example-selector>
        </div>
      </sl-split-panel>
    `;
  }

  private renderSchemaStacked(heading: string) {
    return html`
      ${this.exampleJson
        ? html`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`
        : nothing}
      <h3>${heading}</h3>
      <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
    `;
  }

  render() {
    if (!this.parsed) return nothing;
    const data = this.parsed;

    // Parameter: has "in" field
    if (data.in) return this.renderParameter(data);

    // Header: has "schema" but no "in" and no "properties"
    if (data.schema && !data.properties && !data.in) return this.renderHeader(data);

    // Schema (default)
    return this.renderSchema(data);
  }
}
