import {LitElement, html, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import refPopoverCss from './ref-popover.css.js';
import {getSchemaEntry, getSchemaEntryByRef, type RegistryEntry} from '../../utils/schema-registry.js';
import './schema-properties.js';
import './code-viewer.js';
import './icon-title.js';

@customElement('pp-ref-popover')
export class PpRefPopover extends LitElement {
    static styles = refPopoverCss;

    @property({attribute: 'registry-key'}) registryKey = '';
    @property({attribute: 'schema-ref'}) schemaRef = '';
    @state() private active = false;
    @state() private entry: RegistryEntry | null = null;
    @state() private parsedData: any = null;

    private showTimeout?: number;
    private hideTimeout?: number;
    @query('.trigger') private trigger!: HTMLElement;

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.showTimeout);
        clearTimeout(this.hideTimeout);
        this.active = false;
    }

    private show() {
        clearTimeout(this.hideTimeout);
        this.showTimeout = window.setTimeout(() => {
            this.entry = (this.registryKey
                ? getSchemaEntry(this.registryKey)
                : getSchemaEntryByRef(this.schemaRef)) ?? null;
            if (this.entry) {
                try { this.parsedData = JSON.parse(this.entry.schemaJson); } catch { this.parsedData = null; }
                this.active = true;
            }
        }, 300);
    }

    private hide() {
        clearTimeout(this.showTimeout);
        this.hideTimeout = window.setTimeout(() => {
            this.active = false;
        }, 200);
    }

    private cancelHide() {
        clearTimeout(this.hideTimeout);
    }

    private resolveExample(): string | null {
        if (this.entry?.mockJson) return this.entry.mockJson;
        const data = this.parsedData;
        if (!data) return null;
        if (data.schema?.example !== undefined) return JSON.stringify(data.schema.example);
        if (data.example !== undefined) return JSON.stringify(data.example);
        if (Array.isArray(data.examples) && data.examples.length > 0) return JSON.stringify(data.examples[0]);
        return null;
    }

    private getSchemaJson(): string {
        if (!this.entry) return '';
        const data = this.parsedData;
        if (!data) return this.entry.schemaJson;
        // parameter or header — pass the nested schema object
        if (data.schema) return JSON.stringify(data.schema);
        return this.entry.schemaJson;
    }

    private formatJson(json: string): string {
        try { return JSON.stringify(JSON.parse(json), null, 2); }
        catch { return json; }
    }

    render() {
        const example = this.resolveExample();
        const schemaJson = this.getSchemaJson();
        return html`
            <span class="trigger"
                @mouseenter=${this.show}
                @mouseleave=${this.hide}
                @click=${() => { this.active = false; }}>
                <slot></slot>
            </span>
            ${this.active && this.entry ? html`
                <sl-popup
                    .anchor=${this.trigger}
                    placement="bottom-start"
                    strategy="fixed"
                    active
                    flip shift
                    distance="8">
                    <div class="pp-ref-popover-content"
                        @mouseenter=${this.cancelHide}
                        @mouseleave=${this.hide}>
                        <div class="popover-header">
                            <pp-icon-title icon=${this.entry.componentType} heading=${this.entry.name} level=${3} size="medium"></pp-icon-title>
                        </div>
                        <div class="popover-body">
                            <pp-schema-properties compact condensed schema-json=${schemaJson}></pp-schema-properties>
                        </div>
                        ${example ? html`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(example)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        ` : nothing}
                    </div>
                </sl-popup>
            ` : nothing}
        `;
    }
}
