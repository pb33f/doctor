import {html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import type {ShowExampleDetail} from './example-drawer.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';
import {LightElement} from '@pb33f/printing-press-components/base/light-element.js';

let rawViewerCount = 0;

@customElement('pp-raw-viewer-btn')
export class PpRawViewerBtn extends LightElement {

    @property({attribute: 'title'}) btnTitle = '';
    @property({attribute: 'raw-json'}) rawJson = '';
    @property({attribute: 'raw-yaml'}) rawYaml = '';
    @property({attribute: 'highlight-lines'}) highlightLines = '';
    @property({attribute: 'start-line', type: Number}) startLine = 1;
    @property() location = '';
    @property() method = '';
    @property() path = '';
    @property({attribute: 'component-type'}) componentType = '';
    @property({type: Boolean}) showTextLabel = false;

    private showRaw() {
        const event = new CustomEvent<ShowExampleDetail>('pp-show-example', {
            bubbles: true,
            composed: true,
            detail: {
                title: this.btnTitle || 'Raw Object',
                json: this.rawJson,
                yaml: this.rawYaml,
                rawMode: true,
                highlightLines: this.highlightLines || undefined,
                startLine: this.startLine > 1 ? this.startLine : undefined,
                location: this.location || undefined,
                method: this.method || undefined,
                path: this.path || undefined,
                componentType: this.componentType || undefined,
            },
        });
        this.dispatchEvent(event);
    }

    // The server writes the button; it stays until the raw object arrives.
    protected canReplaceServerMarkup(): boolean {
        return Boolean(this.rawJson || this.rawYaml);
    }

    private buttonID(): string {
        if (!this.id) {
            this.id = `pp-raw-viewer-${++rawViewerCount}`;
        }
        return `${this.id}-button`;
    }

    render() {
        if (!this.rawJson && !this.rawYaml) return nothing;
        const id = this.buttonID();
        return html`<span class="raw-viewer-box"><button type="button" id=${id} class="raw-viewer-button" aria-label="VIEW RAW OBJECT" @click=${this.showRaw}><wa-icon name="braces" aria-hidden="true"></wa-icon></button></span><wa-tooltip for=${id}>VIEW RAW OBJECT</wa-tooltip>`;
    }
}
