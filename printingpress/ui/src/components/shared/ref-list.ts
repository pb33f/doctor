import {html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@pb33f/printing-press-components/paginator/paginated-list.js';
import {modelHref, operationHref} from '../../utils/doc-links.js';
import './asyncapi-action.js';
import {LightElement} from '@pb33f/printing-press-components/base/light-element.js';

export interface OperationRef {
    method: string;
    path: string;
    slug: string;
    operationId?: string;
}

export interface ComponentRef {
    name: string;
    componentType: string;
    typeSlug: string;
    slug: string;
}

const TYPE_LABELS: Record<string, string> = {
    schemas: 'Schemas',
    responses: 'Responses',
    parameters: 'Parameters',
    requestBodies: 'Request Bodies',
    headers: 'Headers',
    securitySchemes: 'Security Schemes',
    examples: 'Examples',
    links: 'Links',
    callbacks: 'Callbacks',
};

const METHOD_ORDER = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'QUERY', 'RECEIVE', 'SEND'];
const ASYNCAPI_ACTIONS = new Set(['receive', 'send']);

function normalizeMethod(method: string): string {
    return method.trim().toUpperCase();
}

function normalizeAsyncAction(method: string): string {
    return method.trim().toLowerCase();
}

function isAsyncAPIAction(method: string): boolean {
    return ASYNCAPI_ACTIONS.has(normalizeAsyncAction(method));
}

@customElement('pp-ref-list')
export class PpRefList extends LightElement {

    @property() type: 'operations' | 'components' = 'operations';
    @property() heading = '';
    @property({type: Array}) items: (OperationRef | ComponentRef)[] = [];

    @state() private filterValue = '';
    @state() private searchTerm = '';
    @state() private filteredItems: (OperationRef | ComponentRef)[] = [];
    @state() private filterOptions: string[] = [];

    private searchTimeout?: number;

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.searchTimeout);
    }

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('items')) {
            if (this.type === 'components') {
                const types = new Set((this.items as ComponentRef[]).map(c => c.componentType));
                this.filterOptions = [...types].sort();
            } else {
                const methods = new Set((this.items as OperationRef[]).map(o => normalizeMethod(o.method)).filter(Boolean));
                this.filterOptions = [...methods].sort((a, b) => {
                    const aIndex = METHOD_ORDER.indexOf(a);
                    const bIndex = METHOD_ORDER.indexOf(b);
                    if (aIndex !== -1 || bIndex !== -1) {
                        return (aIndex === -1 ? METHOD_ORDER.length : aIndex) - (bIndex === -1 ? METHOD_ORDER.length : bIndex);
                    }
                    return a.localeCompare(b);
                });
            }
        }

        if (changed.has('items') || changed.has('filterValue') || changed.has('searchTerm')) {
            this.filteredItems = this.computeFiltered();
        }
    }

    private computeFiltered(): (OperationRef | ComponentRef)[] {
        const term = this.searchTerm.toLowerCase();

        if (this.type === 'operations') {
            let ops = this.items as OperationRef[];
            if (this.filterValue) ops = ops.filter(o => normalizeMethod(o.method) === this.filterValue);
            if (term) {
                ops = ops.filter(o =>
                    o.path.toLowerCase().includes(term)
                    || (o.operationId ?? '').toLowerCase().includes(term));
            }
            return ops;
        } else {
            let comps = this.items as ComponentRef[];
            if (this.filterValue) comps = comps.filter(c => c.componentType === this.filterValue);
            if (term) comps = comps.filter(c => c.name.toLowerCase().includes(term));
            return comps;
        }
    }

    private handleSearch(e: Event) {
        clearTimeout(this.searchTimeout);
        const value = (e.target as HTMLInputElement).value;
        this.searchTimeout = window.setTimeout(() => {
            this.searchTerm = value;
        }, 150);
    }

    private handleFilter(e: Event) {
        this.filterValue = (e.target as HTMLSelectElement).value;
    }

    private renderOperationMethod(method: string) {
        if (isAsyncAPIAction(method)) {
            return html`<pp-asyncapi-action action=${normalizeAsyncAction(method)} size="small"></pp-asyncapi-action>`;
        }
        return html`<pp-http-method method=${method} tiny></pp-http-method>`;
    }

    // The toolbar is a native select and search input, so the server can
    // write it as it renders (crossRefs in content_refs.go).
    private renderToolbar() {
        const operations = this.type === 'operations';
        return html`
            <div class="toolbar">
                <select class="pp-ref-filter" aria-label=${operations ? 'Filter by method' : 'Filter by type'} @change=${this.handleFilter}>
                    <option value="">${operations ? 'ALL METHODS' : 'ALL TYPES'}</option>
                    ${this.filterOptions.map((option) => html`
                        <option value=${option} ?selected=${option === this.filterValue}>${operations ? option : TYPE_LABELS[option] || option}</option>`)}
                </select>
                <input
                    class="pp-ref-search"
                    type="search"
                    placeholder=${operations ? 'SEARCH OPERATIONS...' : 'SEARCH NAMES...'}
                    aria-label=${operations ? 'Filter by operation' : 'Search components'}
                    @input=${this.handleSearch}>
            </div>
        `;
    }

    private renderOperationLabel(op: OperationRef) {
        const operationID = op.operationId?.trim();
        if (operationID) {
            return html`<span
                class="operation-ref-title"
                style="display:block;color:var(--terminal-text);line-height:1;overflow-wrap:anywhere;word-break:break-word;">${operationID}</span>`;
        }
        return html`<pp-render-operation-path path=${op.path}></pp-render-operation-path>`;
    }

    private renderOperationItem(op: OperationRef) {
        return html`
            <div
                class="operation-ref-row"
                style="display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:baseline;column-gap:var(--global-padding);padding:var(--global-padding-half) 0;min-width:0;">
                <span
                    class="operation-ref-method"
                    style="display:inline-flex;align-items:baseline;justify-content:flex-start;min-width:0;line-height:1;">
                    ${this.renderOperationMethod(op.method)}
                </span>
                <a class="operation-ref-link"
                   style="display:block;min-width:0;max-width:100%;color:var(--terminal-text);line-height:1;text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none;"
                   @mouseenter=${(e: Event) => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                   @mouseleave=${(e: Event) => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                   @focus=${(e: Event) => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                   @blur=${(e: Event) => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                   href=${operationHref(op.slug)}>
                    ${this.renderOperationLabel(op)}
                </a>
            </div>
        `;
    }

    private renderComponentItem(comp: ComponentRef) {
        return html`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
                <pp-model-icon icon=${comp.componentType} size="medium"></pp-model-icon>
                <a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace"
                   @mouseenter=${(e: Event) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                   @mouseleave=${(e: Event) => (e.target as HTMLElement).style.textDecoration = 'none'}
                   href=${modelHref(comp.typeSlug, comp.slug)}><span aria-hidden="true">\u279c</span> ${comp.name}</a>
            </div>
        `;
    }

    render() {
        if (!this.items.length) return nothing;

        const renderedItems = this.type === 'operations'
            ? (this.filteredItems as OperationRef[]).map(op => this.renderOperationItem(op))
            : (this.filteredItems as ComponentRef[]).map(comp => this.renderComponentItem(comp));

        const showToolbar = this.items.length > 20;

        return html`
            <h2>${this.heading}</h2>
            ${showToolbar ? this.renderToolbar() : nothing}
            ${this.filteredItems.length
                ? html`<pp-paginated-list
                            .values=${renderedItems as any}
                            .label=${this.heading}>
                        </pp-paginated-list>`
                : html`<div class="empty-state">No matching references</div>`}
        `;
    }
}
