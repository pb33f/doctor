import {LitElement, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import type {ShowExampleDetail} from './example-drawer.js';
import rawViewerBtnCss from './raw-viewer-btn.css.js';

@customElement('pp-raw-viewer-btn')
export class PpRawViewerBtn extends LitElement {
    static styles = [rawViewerBtnCss];

    @property({attribute: 'title'}) btnTitle = '';
    @property({attribute: 'raw-json'}) rawJson = '';
    @property({attribute: 'raw-yaml'}) rawYaml = '';

    private showRaw() {
        const event = new CustomEvent<ShowExampleDetail>('pp-show-example', {
            bubbles: true,
            composed: true,
            detail: {title: this.btnTitle || 'Raw Object', json: this.rawJson, yaml: this.rawYaml},
        });
        document.dispatchEvent(event);
    }

    render() {
        if (!this.rawJson && !this.rawYaml) return nothing;
        return html`<button @click=${this.showRaw}>View Raw</button>`;
    }
}
