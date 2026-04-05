import {LitElement, html, nothing, PropertyValues} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import sharedCss from '../../styles/shared.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import mediaTypeSelectorCss from './media-type-selector.css.js';
import {ComponentLinkData, MediaTypeData} from '../../utils/schema.js';
import {renderComponentRefLink} from '../../utils/render-helpers.js';
import '../shared/schema-properties.js';
import '../shared/ref-popover.js';
import '../shared/extensions.js';
import '../shared/example-selector.js';

@customElement('pp-media-type-selector')
export class PpMediaTypeSelector extends LitElement {
    static styles = [sharedCss, refLinkCss, mediaTypeSelectorCss];

    @property({attribute: 'content-json'}) contentJson = '';
    @state() private mediaTypes: MediaTypeData[] = [];
    @state() private selectedIndex = 0;
    @state() private schemasIdentical = false;
    @state() private wide = false;

    @query('.schema-split') splitPanel!: HTMLElement;
    @query('.schema-props-pane') propsPane!: HTMLElement;

    private resizeObserver: ResizeObserver | null = null;
    private _sizePending = false;
    private _rafId = 0;

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.wide = this.offsetWidth >= 900;
            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    this.wide = entry.contentRect.width >= 900;
                }
            });
            this.resizeObserver.observe(this);
        }, 0);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        cancelAnimationFrame(this._rafId);
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
    }

    updated(changed: Map<string, unknown>) {
        if (changed.has('wide') || changed.has('selectedIndex') || changed.has('mediaTypes')) {
            this.sizeSplitPanel();
        }
    }

    private sizeSplitPanel() {
        if (!this.splitPanel || !this.propsPane || this._sizePending) return;
        this._sizePending = true;
        this._rafId = requestAnimationFrame(() => {
            this._sizePending = false;
            if (!this.splitPanel || !this.propsPane) return;
            const children = Array.from(this.propsPane.children) as HTMLElement[];
            const contentHeight = children.reduce((sum, c) => sum + c.offsetHeight, 0);
            const style = getComputedStyle(this.propsPane);
            const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
            const propsHeight = contentHeight + padding;
            const vh = document.documentElement.clientHeight || 800;
            const mt = this.mediaTypes[this.selectedIndex];
            const propCount = this.getPropCount(mt);
            let h: number;
            if (propCount >= 6) {
                h = Math.max(300, Math.min(propsHeight, vh * 0.6));
            } else {
                h = Math.max(200, propsHeight);
            }
            const splitStyle = getComputedStyle(this.splitPanel);
            const splitPadding = parseFloat(splitStyle.paddingTop) + parseFloat(splitStyle.paddingBottom);
            this.splitPanel.style.height = `${h + splitPadding}px`;
        });
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
                    <span class="array-type">Array&lt;${renderComponentRefLink(mt.itemsRef)}&gt;</span>
                </div>`;
        }
        if (mt.schemaRef) {
            return html`
                <div class="media-type-ref">
                    <span class="media-type-label">${mt.mediaType}</span>
                    ${renderComponentRefLink(mt.schemaRef)}
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
        return html`
            <sl-split-panel class="schema-split" position="60">
                <div slot="start" class="split-pane schema-props-pane">
                    <pp-schema-properties schema-json=${schemaJson || ''} compact></pp-schema-properties>
                </div>
                <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                <div slot="end" class="split-pane schema-example-pane">
                    <pp-example-selector mode="inline" code-language=${language}
                        mock-json=${mock}
                        examples-json=${hasExamples ? JSON.stringify(mt.examples) : ''}
                        hide-label show-expand
                        example-title=${title}></pp-example-selector>
                </div>
            </sl-split-panel>
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
