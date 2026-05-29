import {LitElement, html, nothing, PropertyValues} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import sharedCss from '../../styles/shared.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import mediaTypeSelectorCss from './media-type-selector.css.js';
import {MediaTypeData} from '../../utils/schema.js';
import {renderComponentRefLink} from '../../utils/render-helpers.js';
import '../shared/schema-properties.js';
import '../shared/ref-popover.js';
import '../shared/extensions.js';
import '../shared/example-selector.js';

@customElement('pp-media-type-selector')
export class PpMediaTypeSelector extends LitElement {
    static styles = [sharedCss, refLinkCss, mediaTypeSelectorCss];

    @property({attribute: 'content-json'}) contentJson = '';
    @property({attribute: 'hide-ref-links', type: Boolean}) hideRefLinks = false;
    @state() private mediaTypes: MediaTypeData[] = [];
    @state() private selectedIndex = 0;
    @state() private schemasIdentical = false;
    @state() private wide = false;
    @state() private exampleHidden = false;

    @query('.schema-split') splitPanel!: HTMLElement;
    @query('.schema-props-pane') propsPane!: HTMLElement;
    @query('.schema-example-pane') examplePane!: HTMLElement;

    private resizeObserver: ResizeObserver | null = null;
    private paneResizeObserver: ResizeObserver | null = null;
    private _sizePending = false;
    private _rafId = 0;
    private _splitRepositioning = false;
    private _splitRepositionTimer = 0;
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
        window.clearTimeout(this._splitRepositionTimer);
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
        if (changed.has('wide') || changed.has('selectedIndex') || changed.has('mediaTypes') || changed.has('exampleHidden')) {
            this.sizeSplitPanel();
        }
        this.syncPaneObservers();
    }

    private sizeSplitPanel() {
        if (!this.splitPanel || !this.propsPane || !this.examplePane || this._sizePending || this._splitRepositioning) return;
        this._sizePending = true;
        this._rafId = requestAnimationFrame(() => {
            this._sizePending = false;
            if (!this.splitPanel || !this.propsPane || !this.examplePane || this._splitRepositioning) return;
            const propsHeight = this.measurePaneContentHeight(this.propsPane);
            const exampleHeight = this.exampleHidden ? 0 : this.measurePaneContentHeight(this.examplePane);
            const vh = document.documentElement.clientHeight || 800;
            const mt = this.mediaTypes[this.selectedIndex];
            const propCount = this.getPropCount(mt);
            const preferredHeight = this.exampleHidden ? propsHeight : Math.max(propsHeight, exampleHeight);
            const minHeight = propCount >= 6 ? 300 : 220;
            const maxHeight = vh * 0.75;
            const h = Math.max(minHeight, Math.min(preferredHeight, maxHeight));
            const splitStyle = getComputedStyle(this.splitPanel);
            const splitPadding = parseFloat(splitStyle.paddingTop) + parseFloat(splitStyle.paddingBottom);
            const nextHeight = Math.round(h + splitPadding);
            const currentHeight = parseFloat(this.splitPanel.style.height);
            if (!Number.isFinite(currentHeight) || Math.abs(currentHeight - nextHeight) >= 1) {
                this.splitPanel.style.height = `${nextHeight}px`;
            }
        });
    }

    private handleSplitReposition() {
        this._splitRepositioning = true;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = 0;
            this._sizePending = false;
        }
        window.clearTimeout(this._splitRepositionTimer);
        this._splitRepositionTimer = window.setTimeout(() => {
            this._splitRepositioning = false;
            this.sizeSplitPanel();
        }, 120);
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

    private getPropCount(mt: MediaTypeData): number {
        const json = (mt?.isArray && mt?.itemsSchemaJson) ? mt.itemsSchemaJson : mt?.schemaJson;
        if (!json) return 0;
        try {
            const schema = JSON.parse(json);
            return schema.properties ? Object.keys(schema.properties).length : 0;
        } catch { return 0; }
    }

    private isComplexWithExample(mt: MediaTypeData): boolean {
        if (!mt.schemaJson && !(mt.isArray && mt.itemsSchemaJson)) return false;
        const json = (mt.isArray && mt.itemsSchemaJson) ? mt.itemsSchemaJson : mt.schemaJson;
        if (!json) return false;
        try {
            const schema = JSON.parse(json);
            const isComplex = schema.properties || schema.allOf || schema.oneOf || schema.anyOf;
            const hasExample = !!(mt.mockJson || mt.mockYaml || mt.mockXml || (mt.examples && Object.keys(mt.examples).length));
            return !!isComplex && hasExample;
        } catch { return false; }
    }

    willUpdate(changed: PropertyValues) {
        if (changed.has('contentJson') && this.contentJson) {
            try {
                this.mediaTypes = JSON.parse(this.contentJson);
            } catch {
                this.mediaTypes = [];
            }
            // Default to application/json index if present
            const jsonIdx = this.mediaTypes.findIndex(
                mt => mt.mediaType.toLowerCase() === 'application/json'
            );
            this.selectedIndex = jsonIdx >= 0 ? jsonIdx : 0;

            // Check schema equality
            this.schemasIdentical = this.mediaTypes.length > 1 &&
                new Set(this.mediaTypes.map(mt => this.schemaFingerprint(mt))).size === 1;
        }
    }

    private schemaFingerprint(mt: MediaTypeData): string {
        if (mt.isArray && mt.itemsRef) return `array:${mt.itemsRef.slug}:${mt.itemsSchemaJson || mt.schemaJson}`;
        if (mt.schemaRef) return `ref:${mt.schemaRef.componentType}/${mt.schemaRef.slug}`;
        return `inline:${mt.schemaJson}`;
    }

    private getMockAndLanguage(mt: MediaTypeData): {mock: string; language: 'json' | 'yaml' | 'xml'} {
        const lower = mt.mediaType.toLowerCase();
        if ((lower.includes('yaml') || lower.includes('x-yaml')) && mt.mockYaml) {
            return {mock: mt.mockYaml, language: 'yaml'};
        }
        if (lower.includes('xml') && mt.mockXml) {
            return {mock: mt.mockXml, language: 'xml'};
        }
        return {mock: mt.mockJson || '', language: 'json'};
    }

    private renderSchemaHeader(mt: MediaTypeData) {
        if (mt.isArray && mt.itemsRef) {
            return html`
                <div class="media-type-ref">
                    <span class="media-type-label">${mt.mediaType}</span>
                    ${this.hideRefLinks
                        ? html`<span class="array-type">Array</span>`
                        : html`<span class="array-type">Array&lt;${renderComponentRefLink(mt.itemsRef)}&gt;</span>`}
                </div>`;
        }
        if (mt.schemaRef) {
            return html`
                <div class="media-type-ref">
                    <span class="media-type-label">${mt.mediaType}</span>
                    ${this.hideRefLinks ? nothing : renderComponentRefLink(mt.schemaRef)}
                </div>`;
        }
        if (!mt.schemaJson) return nothing;
        return html`<div class="media-type-label">${mt.mediaType}</div>`;
    }

    private renderSchemaProperties(mt: MediaTypeData) {
        if (mt.isArray && mt.itemsRef) {
            const propsJson = mt.itemsSchemaJson || mt.schemaJson;
            return propsJson ? html`<pp-schema-properties schema-json=${propsJson}></pp-schema-properties>` : nothing;
        }
        if (mt.schemaRef) {
            return mt.schemaJson ? html`<pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>` : nothing;
        }
        if (!mt.schemaJson) return nothing;
        return html`<pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>`;
    }

    private renderInlineExamples(mt: MediaTypeData, language: 'json' | 'yaml' | 'xml', mock: string) {
        const hasExamples = mt.examples && Object.keys(mt.examples).length > 0;
        if (!hasExamples && !mock) return nothing;
        return html`
            <pp-example-selector mode="inline" code-language=${language}
                examples-json=${hasExamples ? JSON.stringify(mt.examples) : ''}
                mock-json=${mock}>
            </pp-example-selector>
        `;
    }

    private renderExtensions(mt: MediaTypeData) {
        if (!mt.extensions?.length) return nothing;
        return html`
            <div class="media-type-extensions">
                <h4>${mt.mediaType} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(mt.extensions)}></pp-extensions>
            </div>
        `;
    }

    private renderRefInfo(mt: MediaTypeData) {
        if (this.hideRefLinks) return nothing;
        if (mt.isArray && mt.itemsRef) {
            return html`<span class="array-type">Array&lt;${renderComponentRefLink(mt.itemsRef)}&gt;</span>`;
        }
        if (mt.schemaRef) return renderComponentRefLink(mt.schemaRef);
        return nothing;
    }

    private renderDropdown(mt: MediaTypeData) {
        return html`
            <div class="media-type-ref">
                <sl-dropdown skidding="5" distance="5">
                    <sl-button slot="trigger" caret>${mt.mediaType}</sl-button>
                    <sl-menu @sl-select=${this.handleSelect}>
                        ${this.mediaTypes.map((m, i) => html`
                            <sl-menu-item value="${i}">${m.mediaType}</sl-menu-item>
                        `)}
                    </sl-menu>
                </sl-dropdown>
                ${this.renderRefInfo(mt)}
            </div>
        `;
    }

    private handleSelect(e: CustomEvent) {
        const value = e.detail?.item?.value;
        if (value === undefined) return;
        const idx = parseInt(value, 10);
        if (idx >= 0 && idx < this.mediaTypes.length) {
            this.selectedIndex = idx;
        }
    }

    private renderSplit(mt: MediaTypeData) {
        const schemaJson = (mt.isArray && mt.itemsSchemaJson) ? mt.itemsSchemaJson : mt.schemaJson;
        const {mock, language} = this.getMockAndLanguage(mt);
        const hasExamples = mt.examples && Object.keys(mt.examples).length > 0;
        const title = mt.mediaType || 'Example';
        const splitClass = this.exampleHidden ? 'schema-split example-hidden' : 'schema-split';
        const position = this.exampleHidden ? '100' : '60';
        return html`
            <sl-split-panel class=${splitClass} position=${position} @sl-reposition=${this.handleSplitReposition}>
                <div slot="start" class="split-pane schema-props-pane">
                    <pp-schema-properties schema-json=${schemaJson || ''} compact constrained></pp-schema-properties>
                </div>
                <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                <div slot="end" class="split-pane schema-example-pane">
                    ${this.exampleHidden ? this.renderExampleRestore() : html`
                        <pp-example-selector mode="inline" code-language=${language}
                            mock-json=${mock}
                            examples-json=${hasExamples ? JSON.stringify(mt.examples) : ''}
                            hide-label show-expand
                            show-visibility-toggle
                            example-title=${title}
                            @pp-hide-example=${this.hideExamplePane}></pp-example-selector>
                    `}
                </div>
            </sl-split-panel>
        `;
    }

    private hideExamplePane() {
        this.exampleHidden = true;
    }

    private showExamplePane() {
        this.exampleHidden = false;
    }

    private renderExampleRestore() {
        return html`
            <sl-tooltip class="example-restore-tooltip" content="show example">
                <sl-icon-button name="eye" label="Show example"
                    class="example-restore"
                    @click=${this.showExamplePane}></sl-icon-button>
            </sl-tooltip>
        `;
    }

    render() {
        if (!this.mediaTypes.length) return nothing;

        // Single media type: no dropdown
        if (this.mediaTypes.length === 1) {
            const mt = this.mediaTypes[0];
            if (this.wide && this.isComplexWithExample(mt)) {
                return html`
                    ${this.renderSchemaHeader(mt)}
                    ${this.renderSplit(mt)}
                    ${this.renderExtensions(mt)}
                `;
            }
            const {mock, language} = this.getMockAndLanguage(mt);
            return html`
                ${this.renderSchemaHeader(mt)}
                ${this.renderInlineExamples(mt, language, mock)}
                ${this.renderSchemaProperties(mt)}
                ${this.renderExtensions(mt)}
            `;
        }

        const selected = this.mediaTypes[this.selectedIndex];

        if (this.schemasIdentical) {
            const first = this.mediaTypes[0];
            if (this.wide && this.isComplexWithExample(selected)) {
                return html`
                    ${this.renderDropdown(selected)}
                    ${this.renderSplit(selected)}
                    ${this.renderExtensions(selected)}
                `;
            }
            const {mock, language} = this.getMockAndLanguage(selected);
            return html`
                ${this.renderDropdown(selected)}
                ${this.renderInlineExamples(selected, language, mock)}
                ${this.renderSchemaProperties(first)}
                ${this.renderExtensions(selected)}
            `;
        }

        // Different schemas: swap entire block
        if (this.wide && this.isComplexWithExample(selected)) {
            return html`
                ${this.renderDropdown(selected)}
                ${this.renderSplit(selected)}
                ${this.renderExtensions(selected)}
            `;
        }
        const {mock, language} = this.getMockAndLanguage(selected);
        return html`
            ${this.renderDropdown(selected)}
            ${this.renderInlineExamples(selected, language, mock)}
            ${this.renderSchemaProperties(selected)}
            ${this.renderExtensions(selected)}
        `;
    }
}
