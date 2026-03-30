import {LitElement, html, nothing} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import constraintsCss from '../../styles/constraints.css.js';
import refLinkCss from '../../styles/ref-link.css.js';
import statusColorsCss from '../../styles/status-colors.css.js';
import operationResponsesCss from './operation-responses.css.js';
import detailsCss from '../../styles/details.css.js';
import '../shared/code-viewer.js';
import '../shared/schema-properties.js';
import '../shared/ref-popover.js';
import {ComponentLinkData, MediaTypeData, ResponseData} from '../../utils/schema.js';
import {HTTP_STATUS_TEXT, statusColorClass} from '../../utils/http.js';
import {renderConstraints, renderComponentRefLink} from '../../utils/render-helpers.js';
import '../shared/extensions.js';
import '../shared/example-selector.js';
import '../shared/media-type-selector.js';

interface HeaderData {
    name: string;
    description?: string;
    schemaType?: string;
    ref?: ComponentLinkData;
    example?: string;
    minimum?: number;
    maximum?: number;
    default?: string;
    enum?: string[];
    pattern?: string;
    extensions?: Array<{key: string; value: any}>;
}

interface LinkData {
    name: string;
    operationId?: string;
    operationSlug?: string;
    operationRef?: string;
    description?: string;
    ref?: ComponentLinkData;
}

@customElement('pp-operation-responses')
export class PpOperationResponses extends LitElement {
    static styles = [sharedCss, constraintsCss, refLinkCss, statusColorsCss, operationResponsesCss, detailsCss];

    @property({attribute: 'responses-json'}) responsesJson = '';
    @property({attribute: 'common-headers-json'}) commonHeadersJson = '';
    @state() private responses: ResponseData[] = [];
    @state() private commonResponseHeaders: HeaderData[] = [];
    @state() private commonHeaderNames = new Set<string>();
    @state() private commonErrorKeys = new Set<string>();
    @state() private commonErrorResponses = new Map<string, {
        resp: ResponseData;
        codeDescs: Array<{ code: string; description: string }>
    }>();
    @state() private successResponses: ResponseData[] = [];
    @state() private redirectResponses: ResponseData[] = [];
    @state() private errorResponses: ResponseData[] = [];

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('responsesJson') && this.responsesJson) {
            try {
                this.responses = JSON.parse(this.responsesJson);
            } catch {
                this.responses = [];
            }
            const sorted = [...this.responses].sort((a, b) => parseInt(a.statusCode, 10) - parseInt(b.statusCode, 10));
            const success: ResponseData[] = [];
            const redirect: ResponseData[] = [];
            const error: ResponseData[] = [];
            for (const r of sorted) {
                const code = parseInt(r.statusCode, 10);
                if (code >= 400) {
                    error.push(r);
                } else if (code >= 300) {
                    redirect.push(r);
                } else {
                    success.push(r);
                }
            }
            this.successResponses = success;
            this.redirectResponses = redirect;
            this.errorResponses = error;

            const {commonKeys, commonResponses} = this.computeCommonErrors(error);
            this.commonErrorKeys = commonKeys;
            this.commonErrorResponses = commonResponses;
        }
        if (changed.has('commonHeadersJson') && this.commonHeadersJson) {
            try {
                this.commonResponseHeaders = JSON.parse(this.commonHeadersJson);
            } catch {
                this.commonResponseHeaders = [];
            }
            this.commonHeaderNames = new Set(this.commonResponseHeaders.map(h => h.name));
        }
    }

    public getResponseNavItems(): Array<{label: string; id: string}> {
        const items: Array<{label: string; id: string}> = [];
        for (const r of [...this.successResponses, ...this.redirectResponses, ...this.errorResponses]) {
            items.push({
                label: `${r.statusCode} ${HTTP_STATUS_TEXT[r.statusCode] || ''}`.trim(),
                id: `response-${r.statusCode}`,
            });
        }
        return items;
    }

    private renderRefLink(ref: ComponentLinkData, withPopover = false) {
        return renderComponentRefLink(ref, withPopover);
    }

    private scrollToHeader(name: string) {
        const el = this.shadowRoot?.getElementById('header-' + name);
        if (!el) return;
        // Expand the parent <sl-details> if collapsed
        const details = el.closest('sl-details') as any;
        if (details && !details.open) {
            details.open = true;
            details.updateComplete?.then(() => {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
            });
        } else {
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    private renderHeaderEntry(h: HeaderData) {
        return html`
            <div class="header-entry">
                <div class="header-name-col">
                    ${h.ref
                            ? html`
                                <pp-ref-popover registry-key="${h.ref.componentType}/${h.ref.name}"><a
                                        class="ref-link header-name" href="models/${h.ref.typeSlug}/${h.ref.slug}.html">\u279c
                                    ${h.name}</a></pp-ref-popover>`
                            : html`<span class="header-name">${h.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${h.schemaType ? html`<span class="header-type">${h.schemaType}</span>` : nothing}
                    ${renderConstraints(h, {includeExample: true})}
                </div>
                <div class="header-desc-col">
                    ${h.description || nothing}
                </div>
            </div>
            ${h.extensions?.length ? html`
                <div class="header-entry header-entry-extensions">
                    <div class="header-name-col">
                        &nbsp;    
                    </div>
                    <div class="header-type-col">
                        &nbsp;
                    </div>
                    <div class="header-desc-col">
                        <div class="header-extensions">
                            <h4>${h.name} Header Extensions</h4>
                            <pp-extensions extensions-json=${JSON.stringify(h.extensions)}></pp-extensions>
                        </div>
                    </div>
                </div>    
            ` : nothing}
        `;
    }

    private renderHeaders(headers: HeaderData[], commonNames: Set<string>) {
        if (!headers || !headers.length) return nothing;
        const unique = headers.filter(h => !commonNames.has(h.name));
        const common = headers.filter(h => commonNames.has(h.name));
        if (!unique.length && !common.length) return nothing;
        return html`
            <div class="headers-section">
                <h4 class="headers-label">Response Headers</h4>
                    ${unique.length ? html`
                        <div class="headers-values">
                            ${unique.map(h => this.renderHeaderEntry(h))}
                        </div>` : nothing}
                ${common.length ? html`
                    <div class="common-link-label">\u2191 common headers</div>
                    <ul class="common-header-list">
                        ${common.map(h => html`
                            <li><a class="header-anchor" @click=${(e: Event) => {
                                e.preventDefault();
                                this.scrollToHeader(h.name);
                            }}>${h.name}</a></li>
                        `)}
                    </ul>
                ` : nothing}
            </div>
        `;
    }

    private renderLinks(links: LinkData[]) {
        if (!links?.length) return nothing;
        return html`
            <div class="links-section">
                <h4 class="links-label">Response Links</h4>
                ${links.map(l => html`
                    <div class="link-entry">
                        <span class="link-name">${l.ref
                            ? html`<pp-ref-popover registry-key="links/${l.ref.name}"><a class="ref-link" href="models/${l.ref.typeSlug}/${l.ref.slug}.html">\u279c ${l.name}</a></pp-ref-popover>`
                            : l.name}</span>
                        ${l.operationId
                            ? html`<span class="link-target">\u2192 ${l.operationSlug
                                ? html`<a class="ref-link" href="operations/${l.operationSlug}.html">${l.operationId}</a>`
                                : l.operationId}</span>`
                            : nothing}
                        ${l.operationRef ? html`<span class="link-target">\u2192 ${l.operationRef}</span>` : nothing}
                        ${l.description ? html`<span class="link-desc">${l.description}</span>` : nothing}
                    </div>
                `)}
            </div>
        `;
    }

    /** Get a dedup key for an error response based on its schema/response ref. */
    private errorRefKey(resp: ResponseData): string | null {
        if (resp.ref) return `ref:${resp.ref.slug}`;
        if (resp.content?.length) {
            const mt = resp.content[0];
            if (mt.schemaRef) return `schema:${mt.schemaRef.slug}`;
            if (mt.isArray && mt.itemsRef) return `items:${mt.itemsRef.slug}`;
        }
        return null;
    }

    /**
     * Find error schemas used by 2+ status codes.
     * Returns the set of common ref keys, plus one representative response per key.
     */
    private computeCommonErrors(errors: ResponseData[]): {
        commonKeys: Set<string>;
        commonResponses: Map<string, { resp: ResponseData; codeDescs: Array<{ code: string; description: string }> }>;
    } {
        const counts = new Map<string, {
            resp: ResponseData;
            codeDescs: Array<{ code: string; description: string }>
        }>();
        for (const r of errors) {
            const key = this.errorRefKey(r);
            if (!key) continue;
            const existing = counts.get(key);
            if (existing) {
                existing.codeDescs.push({code: r.statusCode, description: r.description});
            } else {
                counts.set(key, {resp: r, codeDescs: [{code: r.statusCode, description: r.description}]});
            }
        }
        const commonKeys = new Set<string>();
        const commonResponses = new Map<string, {
            resp: ResponseData;
            codeDescs: Array<{ code: string; description: string }>
        }>();
        for (const [key, entry] of counts) {
            if (entry.codeDescs.length >= 2) {
                commonKeys.add(key);
                commonResponses.set(key, entry);
            }
        }
        return {commonKeys, commonResponses};
    }

    private scrollToCommonError(key: string) {
        const el = this.shadowRoot?.getElementById('common-error-' + key);
        el?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    private renderResponse(resp: ResponseData, commonNames: Set<string>, commonErrorKeys?: Set<string>) {
        const errorKey = commonErrorKeys ? this.errorRefKey(resp) : null;
        const isCommonError = errorKey != null && commonErrorKeys?.has(errorKey);

        return html`
            <div class="response" id="response-${resp.statusCode}">
                    <h3><span class="status-code ${statusColorClass(resp.statusCode)}">${resp.statusCode}</span> ${HTTP_STATUS_TEXT[resp.statusCode] || ''}
                        ${resp.rawJson || resp.rawYaml
                                ? html`
                                <pp-raw-viewer-btn
                                        title="Response ${resp.statusCode}"
                                        raw-json=${resp.rawJson || ''}
                                        raw-yaml=${resp.rawYaml || ''}
                                        start-line=${resp.sourceLine || 1}
                                        location=${resp.location || ''}>
                                </pp-raw-viewer-btn>`
                                : nothing}
                    </h3>
                    ${resp.descHtml ? html`<div class="response-desc">${unsafeHTML(resp.descHtml)}</div>` : nothing}
              
                ${isCommonError
                        ? html`
                            <div class="common-error-link">
                                ${resp.ref ? this.renderRefLink(resp.ref, true) : nothing}
                                ${!resp.ref && resp.content?.length ? this.renderMediaTypeHeader(resp.content[0]) : nothing}
                                <a class="error-anchor" @click=${(e: Event) => {
                                    e.preventDefault();
                                    this.scrollToCommonError(errorKey!);
                                }}>\u2191 see common example</a>
                            </div>`
                        : resp.ref
                                ? this.renderRefLink(resp.ref, true)
                                : resp.content?.length
                                    ? html`<pp-media-type-selector content-json=${JSON.stringify(resp.content)}></pp-media-type-selector>`
                                    : nothing}
                ${this.renderHeaders(resp.headers ?? [], commonNames)}
                ${this.renderLinks(resp.links ?? [])}
                ${resp.extensions?.length ? html`
                    <div class="response-extensions">
                        <h4>Response ${resp.statusCode} Extensions</h4>
                        <pp-extensions extensions-json=${JSON.stringify(resp.extensions)}></pp-extensions>
                    </div>` : nothing}
            </div>
        `;
    }

    /** Render just the media type label + ref link without the inline example. */
    private renderMediaTypeHeader(mt: MediaTypeData) {
        if (mt.isArray && mt.itemsRef) {
            return html`
                <span class="media-type-label">${mt.mediaType}</span>
                <span class="array-type">Array&lt;${this.renderRefLink(mt.itemsRef)}&gt;</span>
            `;
        }
        if (mt.schemaRef) {
            return html`
                <span class="media-type-label">${mt.mediaType}</span>
                ${this.renderRefLink(mt.schemaRef)}
            `;
        }
        return nothing;
    }

    private renderCommonErrors(
        commonResponses: Map<string, { resp: ResponseData; codeDescs: Array<{ code: string; description: string }> }>,
        commonNames: Set<string>,
    ) {
        if (!commonResponses.size) return nothing;
        return html`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...commonResponses.entries()].map(([key, {resp, codeDescs}]) => html`
                <div class="response common-error-response" id="common-error-${key}">
                    <div class="common-error-grid">
                        ${codeDescs.map(({code, description}) => html`
                            <div class="common-error-code"><span class="${statusColorClass(code)}">${code}</span> ${HTTP_STATUS_TEXT[code] || ''}</div>
                            <div class="common-error-desc">${description}</div>
                        `)}
                    </div>
                    ${resp.ref
                            ? this.renderRefLink(resp.ref, true)
                            : resp.content?.length
                                ? html`<pp-media-type-selector content-json=${JSON.stringify(resp.content)}></pp-media-type-selector>`
                                : nothing}
                    ${this.renderHeaders(resp.headers ?? [], commonNames)}
                </div>
            `)}
        `;
    }

    render() {
        if (!this.responses.length) return nothing;
        const commonNames = this.commonHeaderNames;
        const commonKeys = this.commonErrorKeys;
        const commonResponses = this.commonErrorResponses;

        return html`
            <h2>Responses</h2>
            ${this.successResponses.map(r => this.renderResponse(r, commonNames))}
            ${this.redirectResponses.length ? html`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Redirect Responses</h3></span>
                    ${this.redirectResponses.map(r => this.renderResponse(r, commonNames))}
                </sl-details>
            ` : nothing}
            ${this.commonResponseHeaders.length ? html`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span>
                    <div class="property-box">
                        ${this.commonResponseHeaders.map(h => html`
                            <div id="header-${h.name}">${this.renderHeaderEntry(h)}</div>
                        `)}
                    </div>
                </sl-details>
            ` : nothing}
            ${this.errorResponses.length || commonResponses.size ? html`
                <sl-details class="pp-details">
                    <div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div>
                    ${this.renderCommonErrors(commonResponses, commonNames)}
                    ${this.errorResponses.map(r => this.renderResponse(r, commonNames, commonKeys))}
                </sl-details>
            ` : nothing}
        `;
    }
}
