import {LitElement, html, nothing} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import statusColorsCss from '../../styles/status-colors.css.js';
import operationCallbacksCss from './operation-callbacks.css.js';
import {ComponentLinkData, MediaTypeData, ResponseData} from '../../utils/schema.js';
import {renderComponentRefLink} from '../../utils/render-helpers.js';
import {HTTP_STATUS_TEXT, statusColorClass} from '../../utils/http.js';
import '../shared/schema-properties.js';
import '../shared/ref-popover.js';
import '../shared/example-selector.js';
import '../shared/media-type-selector.js';

interface RequestBodyData {
    description?: string;
    descHtml?: string;
    required?: boolean;
    content?: MediaTypeData[];
    ref?: ComponentLinkData;
}

interface CallbackOperationData {
    expression: string;
    method: string;
    description?: string;
    descHtml?: string;
    requestBody?: RequestBodyData;
    responses?: ResponseData[];
}

interface CallbackData {
    name: string;
    ref?: ComponentLinkData;
    operations: CallbackOperationData[];
}

@customElement('pp-operation-callbacks')
export class PpOperationCallbacks extends LitElement {
    static styles = [sharedCss, refLinkCss, statusColorsCss, operationCallbacksCss];

    @property({attribute: 'callbacks-json'}) callbacksJson = '';
    @state() private callbacks: CallbackData[] = [];

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('callbacksJson') && this.callbacksJson) {
            try {
                this.callbacks = JSON.parse(this.callbacksJson);
            } catch {
                this.callbacks = [];
            }
        }
    }

    private renderRequestBody(rb: RequestBodyData) {
        if (rb.ref) {
            return html`<div class="callback-section-label">Request Body</div>${renderComponentRefLink(rb.ref, true)}`;
        }
        if (!rb.content?.length) return nothing;
        return html`
            <div class="callback-section-label">Request Body${rb.required ? ' (required)' : ''}</div>
            ${rb.descHtml ? html`<div class="callback-desc">${unsafeHTML(rb.descHtml)}</div>` : nothing}
            <pp-media-type-selector content-json=${JSON.stringify(rb.content)}></pp-media-type-selector>
        `;
    }

    private renderResponses(responses: ResponseData[]) {
        if (!responses?.length) return nothing;
        return html`
            <div class="callback-section-label">Responses</div>
            ${responses.map(r => html`
                <div class="callback-response">
                    <span class="callback-response-code ${statusColorClass(r.statusCode)}">${r.statusCode}</span>
                    <span class="callback-response-code">${HTTP_STATUS_TEXT[r.statusCode] || ''}</span>
                    ${r.descHtml
                        ? html`<span class="callback-response-desc">${unsafeHTML(r.descHtml)}</span>`
                        : r.description
                            ? html`<span class="callback-response-desc">${r.description}</span>`
                            : nothing}
                </div>
                ${r.ref ? renderComponentRefLink(r.ref, true) : nothing}
                ${!r.ref && r.content?.length
                    ? html`<pp-media-type-selector content-json=${JSON.stringify(r.content)}></pp-media-type-selector>`
                    : nothing}
            `)}
        `;
    }

    private renderCallbackOperation(op: CallbackOperationData) {
        return html`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pb33f-http-method method=${op.method}></pb33f-http-method>
                    <span class="callback-expression">${op.expression}</span>
                </div>
                ${op.descHtml ? html`<div class="callback-desc">${unsafeHTML(op.descHtml)}</div>` : nothing}
                ${op.requestBody ? this.renderRequestBody(op.requestBody) : nothing}
                ${this.renderResponses(op.responses ?? [])}
            </div>
        `;
    }

    render() {
        if (!this.callbacks.length) return nothing;
        return html`
            ${this.callbacks.map(cb => html`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${cb.ref ? renderComponentRefLink(cb.ref, true) : nothing}
                        ${cb.name}
                    </div>
                    ${cb.operations.map(op => this.renderCallbackOperation(op))}
                </div>
            `)}
        `;
    }
}
