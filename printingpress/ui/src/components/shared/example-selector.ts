import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import type {ShowExampleDetail} from './example-drawer.js';
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';
import exampleSelectorCss from './example-selector.css.js';
import tooltipCss from '../../styles/tooltip.css.js';
import '../shared/code-viewer.js';

interface ExamplesData {
  mockJson?: string;
  examples?: Record<string, string>;
}

@customElement('pp-example-selector')
export class PpExampleSelector extends LitElement {
  static styles = [...exampleSelectorCss, tooltipCss];

  // Accepts a JSON object with { mockJson, examples }
  @property({attribute: 'examples-data'}) examplesData = '';
  // Or individual attributes for inline use in Lit templates
  @property({attribute: 'mock-json'}) mockJson = '';
  @property({attribute: 'examples-json'}) examplesJson = '';
  @property() mode: 'drawer' | 'inline' = 'drawer';
  @property({attribute: 'code-language'}) codeLanguage: 'json' | 'yaml' | 'xml' = 'json';

  @state() private entries: Array<{key: string; json: string}> = [];
  @state() private selectedIndex = 0;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('examplesData') || changed.has('mockJson') || changed.has('examplesJson')) {
      this.buildEntries();
    }
  }

  private buildEntries() {
    const entries: Array<{key: string; json: string}> = [];
    let mock = this.mockJson;
    let examples: Record<string, string> = {};

    // Parse composite data attribute
    if (this.examplesData) {
      try {
        const data: ExamplesData = JSON.parse(this.examplesData);
        if (data.mockJson) mock = data.mockJson;
        if (data.examples) examples = data.examples;
      } catch { /* ignore */ }
    }

    // Parse individual examples-json attribute
    if (this.examplesJson) {
      try {
        examples = {...examples, ...JSON.parse(this.examplesJson)};
      } catch { /* ignore */ }
    }

    // Named examples first
    for (const [key, json] of Object.entries(examples)) {
      if (json) entries.push({key, json});
    }

    // Generated mock last
    if (mock) {
      entries.push({key: '', json: mock});
    }

    this.entries = entries;
    this.selectedIndex = 0;
  }

  private showExample(entry: {key: string; json: string}) {
    let formatted = entry.json;
    if (this.codeLanguage === 'json') {
      try {
        formatted = JSON.stringify(JSON.parse(entry.json), null, 2);
      } catch { /* use as-is */ }
    }

    const event = new CustomEvent<ShowExampleDetail>('pp-show-example', {
      bubbles: true,
      composed: true,
      detail: {title: entry.key, json: formatted, language: this.codeLanguage},
    });
    this.dispatchEvent(event);
  }

  private handleSelect(e: CustomEvent) {
    const value = e.detail?.item?.value;
    if (value === undefined) return;
    const idx = parseInt(value, 10);
    if (idx >= 0 && idx < this.entries.length) {
      this.showExample(this.entries[idx]);
    }
  }

  render() {
    if (!this.entries.length) return nothing;

    if (this.mode === 'inline') {
      return this.renderInline();
    }

    // Single entry: simple button
    if (this.entries.length === 1) {
      const entry = this.entries[0];
      return html`
        <div class="selector">
          <button @click=${() => this.showExample(entry)}>${entry.key}</button>
        </div>
      `;
    }

    // Multiple entries: Shoelace dropdown
    return html`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((entry, i) => html`
              <sl-menu-item value="${i}">${entry.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }

  private inlineLabel(key: string) {
    return key.toLowerCase().includes('example') ? key : `${key} Example`;
  }

  private renderCodeBlock(code: string) {
    return html`
      <div class="code-container">
        <sl-copy-button .value=${code} class="floating-copy"></sl-copy-button>
        <pp-code-viewer .code=${code} .language=${this.codeLanguage}
            ?pretty=${this.codeLanguage === 'json'}></pp-code-viewer>
      </div>
    `;
  }

  private renderInline() {
    const current = this.entries[this.selectedIndex];

    if (this.entries.length === 1) {
      return html`
        <div class="inline-example-label">${this.inlineLabel(current.key)}</div>
        ${this.renderCodeBlock(current.json)}
      `;
    }

    return html`
      ${this.renderCodeBlock(current.json)}
      <sl-dropdown skidding="5" distance="5">
        <sl-button slot="trigger" caret>${this.inlineLabel(current.key)}</sl-button>
        <sl-menu @sl-select=${this.handleInlineSelect}>
          ${this.entries.map((e, i) => html`
            <sl-menu-item value="${i}">${this.inlineLabel(e.key)}</sl-menu-item>
          `)}
        </sl-menu>
      </sl-dropdown>
    `;
  }

  private handleInlineSelect(e: CustomEvent) {
    const value = e.detail?.item?.value;
    if (value === undefined) return;
    this.selectedIndex = parseInt(value, 10);
  }
}
