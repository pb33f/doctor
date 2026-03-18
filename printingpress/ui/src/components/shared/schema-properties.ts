import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import constraintsCss from '../../styles/constraints.css.js';
import schemaPropertiesCss from './schema-properties.css.js';
import {deriveSchemaType, resolveRefLink, collectConstraints} from '../../utils/schema.js';
import './ref-popover.js';

@customElement('pp-schema-properties')
export class PpSchemaProperties extends LitElement {
    static styles = [constraintsCss, schemaPropertiesCss];

    @property({attribute: 'schema-json'}) schemaJson = '';
    @property({type: Boolean, reflect: true}) compact = false;
    @state() private schema: any = null;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('schemaJson') && this.schemaJson) {
            try {
                this.schema = JSON.parse(this.schemaJson);
            } catch {
                this.schema = null;
            }
        }
    }

    private renderConstraints(prop: any) {
        const parts = collectConstraints(prop);
        if (!parts.length && !prop.enum?.length) return nothing;
        return html`
            <div class="constraints">
                ${parts.map(p => html`
                    <span class="constraint-label">${p.label}:</span>
                    <span class="constraint-value">${p.isCode ? html`<code>${p.value}</code>` : p.value}</span>
                `)}
                ${prop.enum?.length ? html`
                    <span class="constraint-label">enum:</span>
                    <span class="constraint-value">${prop.enum.map((v: any, i: number) => html`${i > 0 ? ', ' : ''}<span
                            class="enum-value">${JSON.stringify(v)}</span>`)}</span>
                ` : nothing}
            </div>
        `;
    }

    private renderRefAnchor(ref: string, link: { name: string; href: string }) {
        const anchor = html`<a class="ref-type-link" href="${link.href}">\u279c ${link.name}</a>`;
        if (this.compact) return anchor;
        return html`
            <pp-ref-popover schema-ref="${ref}">${anchor}</pp-ref-popover>`;
    }

    private renderType(prop: any) {
        if (!prop) return nothing;

        if (prop.type === 'array' && prop.items?.$ref) {
            const link = resolveRefLink(prop.items.$ref);
            if (link) {
                return html`<span
                        class="prop-type prop-type-link">Array&lt;${this.renderRefAnchor(prop.items.$ref, link)}&gt;</span>`;
            }
        }

        if (prop.$ref) {
            const link = resolveRefLink(prop.$ref);
            if (link) {
                return html`<span class="prop-type prop-type-link">${this.renderRefAnchor(prop.$ref, link)}</span>`;
            }
        }

        const type = deriveSchemaType(prop);
        if (!type) return nothing;
        return html`<span class="prop-type">${type}</span>`;
    }

    render() {
        if (!this.schema) return nothing;
        // For arrays, render the items schema properties
        const target = this.schema.type === 'array' && this.schema.items?.properties
            ? this.schema.items
            : this.schema;
        const properties = target.properties || {};
        const required = new Set(target.required || []);
        const propEntries = Object.entries(properties);
        if (!propEntries.length) {
            // Scalar schema (e.g. parameter/header with type but no properties)
            const type = deriveSchemaType(target);
            if (!type && !target.description) return nothing;
            return html`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${type ? html`<span class="prop-type">${type}</span>` : nothing}
                        ${this.renderConstraints(target)}
                    </div>
                    <div class="prop-desc-col">
                        ${target.description ? target.description : nothing}
                    </div>
                </div>
            `;
        }

        return propEntries.map(
            ([name, prop]: [string, any]) => html`
                <div class="property">
                    <div class="prop-name-col">
                        ${required.has(name)
                                ? html`<span class="required-badge">req</span>`
                                : nothing}
                        <span class="prop-name">${name}</span>
                    </div>
                    <div class="prop-type-col">
                        ${this.renderType(prop)}
                        ${this.renderConstraints(prop)}
                    </div>
                    <div class="prop-desc-col">
                        ${prop.description ? prop.description : nothing}
                    </div>
                </div>
            `
        );
    }
}
