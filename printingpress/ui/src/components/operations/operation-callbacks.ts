import {LitElement, html, nothing} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import statusColorsCss from '../../styles/status-colors.css.js';
import operationCallbacksCss from './operation-callbacks.css.js';
import {ComponentLinkData} from '../../utils/schema.js';
import {HTTP_STATUS_TEXT, statusColorClass} from '../../utils/http.js';
import '../shared/schema-properties.js';
import '../shared/ref-popover.js';

interface MediaTypeData {
    mediaType: string;
    schemaJson: string;
    schemaRef?: ComponentLinkData;
    isArray?: boolean;
    itemsRef?: ComponentLinkData;
    itemsSchemaJson?: string;
}

interface ResponseData {
    statusCode: string;
    description: string;
    descHtml?: string;
    content?: MediaTypeData[];
    ref?: ComponentLinkData;
}

interface RequestBodyData {
    Description?: string;
    DescHTML?: string;
    Required?: boolean;
    Content?: MediaTypeData[];
    Ref?: ComponentLinkData;
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

    private renderRefLink(ref: ComponentLinkData) {
        return html`
            <pp-ref-popover registry-key="${ref.componentType}/${ref.name}">
                <a class="ref-link" href="models/${ref.typeSlug}/${ref.slug}.html">\u279c ${ref.name}</a>
            </pp-ref-popover>`;
    }

    private renderMediaType(mt: MediaTypeData) {
        if (mt.isArray && mt.itemsRef) {
            const propsJson = mt.itemsSchemaJson || mt.schemaJson;
            return html`
                <div class="media-type-ref">
                    <span class="media-type-label">${mt.mediaType}</span>
                    <span class="array-type">Array&lt;${html`<a class="ref-link" href="models/${mt.itemsRef.typeSlug}/${mt.itemsRef.slug}.html">\u279c ${mt.itemsRef.name}</a>`}&gt;</span>
                </div>
                ${propsJson ? html`<pp-schema-properties schema-json=${propsJson}></pp-schema-properties>` : nothing}
            `;
        }
        if (mt.schemaRef) {
            return html`
                <div class="media-type-ref">
                    <span class="media-type-label">${mt.mediaType}</span>
                    <a class="ref-link" href="models/${mt.schemaRef.typeSlug}/${mt.schemaRef.slug}.html">\u279c ${mt.schemaRef.name}</a>
                </div>
                ${mt.schemaJson ? html`<pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>` : nothing}
            `;
        }
        if (!mt.schemaJson) return nothing;
        return html`
            <div class="media-type-label">${mt.mediaType}</div>
            <pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>
        `;
    }

    private renderRequestBody(rb: RequestBodyData) {
        if (rb.Ref) {
            return html`<div class="callback-section-label">Request Body</div>${this.renderRefLink(rb.Ref)}`;
        }
        if (!rb.Content?.length) return nothing;
        return html`
            <div class="callback-section-label">Request Body${rb.Required ? ' (required)' : ''}</div>
            ${rb.DescHTML ? html`<div class="callback-desc">${unsafeHTML(rb.DescHTML)}</div>` : nothing}
            ${rb.Content.map(mt => this.renderMediaType(mt))}
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
                ${r.ref ? this.renderRefLink(r.ref) : nothing}
                ${!r.ref && r.content?.length ? r.content.map(mt => this.renderMediaType(mt)) : nothing}
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
                        ${cb.ref ? this.renderRefLink(cb.ref) : nothing}
                        ${cb.name}
                    </div>
                    ${cb.operations.map(op => this.renderCallbackOperation(op))}
                </div>
            `)}
        `;
    }
}
