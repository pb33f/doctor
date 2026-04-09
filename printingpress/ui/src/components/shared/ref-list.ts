import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import refListCss from './ref-list.css.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

export interface OperationRef {
    method: string;
    path: string;
    slug: string;
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

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'QUERY'];

@customElement('pp-ref-list')
export class PpRefList extends LitElement {
    static styles = refListCss;

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
            if (this.filterValue) ops = ops.filter(o => o.method.toUpperCase() === this.filterValue);
            if (term) ops = ops.filter(o => o.path.toLowerCase().includes(term));
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

    private handleClear = () => {
        clearTimeout(this.searchTimeout);
        this.searchTerm = '';
    };

    private handleFilter(e: CustomEvent) {
        const value = e.detail?.item?.value;
        this.filterValue = value ?? '';
    }

    private renderToolbar() {
        const filterLabel = this.type === 'operations'
            ? (this.filterValue || 'ALL METHODS')
            : (TYPE_LABELS[this.filterValue]?.toUpperCase() || this.filterValue?.toUpperCase() || 'ALL TYPES');

        return html`
            <div class="toolbar">
                <sl-dropdown>
                    <sl-button slot="trigger" class="filter-btn" caret size="small">
                        ${this.type === 'operations' && this.filterValue
                            ? html`<pb33f-http-method method=${this.filterValue} tiny></pb33f-http-method>`
                            : filterLabel}
                    </sl-button>
                    <sl-menu @sl-select=${this.handleFilter}>
                        <sl-menu-item value="">
                            ${this.type === 'operations' ? 'ALL METHODS' : 'ALL TYPES'}
                        </sl-menu-item>
                        ${this.type === 'operations'
                            ? HTTP_METHODS.map(m => html`
                                <sl-menu-item value=${m}><pb33f-http-method method=${m}></pb33f-http-method></sl-menu-item>`)
                            : this.filterOptions.map(t => html`
                                <sl-menu-item value=${t}>
                                    ${TYPE_LABELS[t] || t}
                                </sl-menu-item>`)}
                    </sl-menu>
                </sl-dropdown>
                <sl-input
                    size="small"
                    placeholder=${this.type === 'operations' ? 'SEARCH PATHS...' : 'SEARCH NAMES...'}
                    aria-label=${this.type === 'operations' ? 'Filter by path' : 'Search components'}
                    clearable
                    @sl-input=${this.handleSearch}
                    @sl-clear=${this.handleClear}>
                </sl-input>
            </div>
        `;
    }

    private renderOperationItem(op: OperationRef) {
        return html`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:var(--global-padding-half) 0">
                <pb33f-http-method method=${op.method} tiny></pb33f-http-method>
                <a style="color:var(--font-color);text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none"
                   @mouseenter=${(e: Event) => (e.target as HTMLElement).style.setProperty('--op-path-text-decoration', 'underline')}
                   @mouseleave=${(e: Event) => (e.target as HTMLElement).style.setProperty('--op-path-text-decoration', 'none')}
                   @focus=${(e: Event) => (e.target as HTMLElement).style.setProperty('--op-path-text-decoration', 'underline')}
                   @blur=${(e: Event) => (e.target as HTMLElement).style.setProperty('--op-path-text-decoration', 'none')}
                   href="operations/${op.slug}.html">
                    <pb33f-render-operation-path path=${op.path} nowrap></pb33f-render-operation-path>
                </a>
            </div>
        `;
    }

    private renderComponentItem(comp: ComponentRef) {
        return html`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
                <pb33f-model-icon icon=${comp.componentType} size="medium"></pb33f-model-icon>
                <a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace"
                   @mouseenter=${(e: Event) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                   @mouseleave=${(e: Event) => (e.target as HTMLElement).style.textDecoration = 'none'}
                   href="models/${comp.typeSlug}/${comp.slug}.html"><span aria-hidden="true">\u279c</span> ${comp.name}</a>
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
                ? html`<pb33f-paginator-navigation
                            .values=${renderedItems as any}
                            .label=${this.heading}
                            hideSparks>
                        </pb33f-paginator-navigation>`
                : html`<div class="empty-state">No matching references</div>`}
        `;
    }
}
