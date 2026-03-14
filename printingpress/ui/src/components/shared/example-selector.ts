import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import type {ShowExampleDetail} from './example-drawer.js';
import exampleSelectorCss from './example-selector.css.js';

interface ExamplesData {
  mockJson?: string;
  examples?: Record<string, string>;
}

@customElement('pp-example-selector')
export class PpExampleSelector extends LitElement {
  static styles = exampleSelectorCss;

  // Accepts a JSON object with { mockJson, examples }
  @property({attribute: 'examples-data'}) examplesData = '';
  // Or individual attributes for inline use in Lit templates
  @property({attribute: 'mock-json'}) mockJson = '';
  @property({attribute: 'examples-json'}) examplesJson = '';

  @state() private entries: Array<{key: string; json: string}> = [];

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
      entries.push({key: 'Generated Example', json: mock});
    }

    this.entries = entries;
  }

  private showExample(entry: {key: string; json: string}) {
    // Pretty-print if valid JSON
    let formatted = entry.json;
    try {
      formatted = JSON.stringify(JSON.parse(entry.json), null, 2);
    } catch { /* use as-is */ }

    const event = new CustomEvent<ShowExampleDetail>('pp-show-example', {
      bubbles: true,
      composed: true,
      detail: {title: entry.key, json: formatted},
    });
    document.dispatchEvent(event);
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
}
