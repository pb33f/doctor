import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import constraintsCss from '../../styles/constraints.css.js';
import schemaPropertiesCss from './schema-properties.css.js';
import {deriveSchemaType, resolveRefLink} from '../../utils/schema.js';
import {renderConstraints, renderSchemaType} from '../../utils/render-helpers.js';
import {getSchemaEntryByRef} from '../../utils/schema-registry.js';
import './ref-popover.js';

@customElement('pp-schema-properties')
export class PpSchemaProperties extends LitElement {
    static styles = [constraintsCss, ...schemaPropertiesCss];

    @property({attribute: 'schema-json'}) schemaJson = '';
    @property({type: Boolean, reflect: true}) compact = false;
    @state() private schema: any = null;
    @state() private oneOfSelectedIndex = 0;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('schemaJson') && this.schemaJson) {
            try {
                this.schema = JSON.parse(this.schemaJson);
            } catch {
                this.schema = null;
            }
            this.oneOfSelectedIndex = 0;
        }
    }

    private renderRefAnchor(ref: string, link: { name: string; href: string }) {
        const anchor = html`<a class="ref-type-link" href="${link.href}">\u279c ${link.name}</a>`;
        if (this.compact) return anchor;
        return html`
            <pp-ref-popover schema-ref="${ref}">${anchor}</pp-ref-popover>`;
    }

    private renderType(prop: any) {
        return renderSchemaType(prop, (ref, link) => this.renderRefAnchor(ref, link));
    }

    private renderPropertyRow(name: string, prop: any, required: Set<string>) {
        return html`
            <div class="property">
                <div class="prop-name-col">
                    ${required.has(name) ? html`<span class="required-badge">req</span>` : nothing}
                    <span class="prop-name">${name}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(prop)}
                    ${renderConstraints(prop, {labelSuffix: ':'})}
                </div>
                <div class="prop-desc-col">
                    ${prop.description ? prop.description : nothing}
                </div>
            </div>
        `;
    }

    private renderPropertyTable(properties: Record<string, any>, required: Set<string>) {
        const propEntries = Object.entries(properties);
        if (!propEntries.length) return nothing;
        return propEntries.map(([name, prop]: [string, any]) => {
            const variants = prop.oneOf ?? prop.anyOf;
            if (variants && Array.isArray(variants)) {
                if (this.compact) {
                    return this.renderPropertyRow(name, prop, required);
                }
                const label = 'polymorphic';
                return html`
                    <div class="property-oneof">
                        ${this.renderOneOf(variants, name, prop.description, required.has(name), label)}
                    </div>
                `;
            }
            return this.renderPropertyRow(name, prop, required);
        });
    }

    private renderCompositionRefs(refs: any[]) {
        return html`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${refs.map(entry => {
                    const link = resolveRefLink(entry.$ref);
                    if (!link) return nothing;
                    const registryEntry = getSchemaEntryByRef(entry.$ref);
                    const description = registryEntry?.description ?? '';
                    return html`
                        <div class="composition-ref-entry">
                            <span class="composition-ref-link">${this.renderRefAnchor(entry.$ref, link)}</span>
                            ${description ? html`<span class="composition-ref-desc">${description}</span>` : nothing}
                        </div>
                    `;
                })}
            </div>
        `;
    }

    private renderComposition(target: any) {
        const allOf: any[] = target.allOf;
        const refEntries: any[] = [];

        // Merge required from inline/constraint-only entries + top-level.
        const mergedRequired = new Set<string>(target.required || []);
        const mergedProperties: Record<string, any> = {};

        if (target.properties) {
            Object.assign(mergedProperties, target.properties);
        }

        for (const entry of allOf) {
            if (entry.$ref) {
                refEntries.push(entry);
            } else {
                if (entry.properties) {
                    Object.assign(mergedProperties, entry.properties);
                }
                if (entry.required) {
                    for (const r of entry.required) mergedRequired.add(r);
                }
            }
        }

        return html`
            ${refEntries.length ? this.renderCompositionRefs(refEntries) : nothing}
            ${Object.keys(mergedProperties).length
                ? this.renderPropertyTable(mergedProperties, mergedRequired)
                : nothing}
        `;
    }

    private renderOneOf(entries: any[], propName?: string, propDesc?: string, isRequired?: boolean, label?: string) {
        if (!entries.length) return nothing;
        const selected = entries[this.oneOfSelectedIndex] || entries[0];

        return html`
            <div class="oneof-property">
                <div class="oneof-left">
                    <div class="property">
                        <div class="prop-name-col">
                            ${propName ? html`
                                ${isRequired ? html`<span class="required-badge">req</span>` : nothing}
                                <span class="prop-name">${propName}</span>
                                ${label ? html`<div class="composition-label polymorphic">(${label})</div>` : nothing}
                            ` : nothing}
                        </div>
                        <div class="prop-type-col">
                            ${entries.length > 1 ? html`
                                <sl-dropdown skidding="5" distance="5">
                                    <sl-button slot="trigger" caret>
                                        ${selected.title || `Option ${this.oneOfSelectedIndex + 1}`}
                                    </sl-button>
                                    <sl-menu @sl-select=${this.handleOneOfSelect}>
                                        ${entries.map((e, i) => html`
                                            <sl-menu-item value="${i}">${e.title || `Option ${i + 1}`}</sl-menu-item>
                                        `)}
                                    </sl-menu>
                                </sl-dropdown>
                            ` : html`
                                <span class="prop-type">${selected.title || 'Option 1'}</span>
                            `}
                        </div>
                    </div>
                    ${propDesc ? html`<div class="oneof-prop-desc">${propDesc}</div>` : nothing}
                </div>
                <div class="oneof-desc-container">
                    ${this.renderOneOfOption(selected)}
                </div>
            </div>
        `;
    }

    private handleOneOfSelect(e: CustomEvent) {
        const value = e.detail?.item?.value;
        if (value === undefined) return;
        const idx = parseInt(value, 10);
        if (idx >= 0) this.oneOfSelectedIndex = idx;
    }

    private renderOneOfOption(entry: any) {
        if (entry.$ref) {
            const link = resolveRefLink(entry.$ref);
            if (!link) return nothing;
            const registryEntry = getSchemaEntryByRef(entry.$ref);
            return html`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(entry.$ref, link)}
                    ${registryEntry?.description ? html`<span class="oneof-option-desc">${registryEntry.description}</span>` : nothing}
                </div>
            `;
        }

        const required = new Set<string>(entry.required || []);
        return html`
            ${entry.description ? html`<div class="oneof-option-desc">${entry.description}</div>` : nothing}
            ${entry.properties ? this.renderPropertyTable(entry.properties, required) : nothing}
        `;
    }

    render() {
        if (!this.schema) return nothing;
        const target = this.schema.type === 'array'
            && (this.schema.items?.properties || this.schema.items?.allOf || this.schema.items?.oneOf || this.schema.items?.anyOf)
            ? this.schema.items
            : this.schema;

        if (target.allOf && Array.isArray(target.allOf)) {
            return this.renderComposition(target);
        }

        if (target.oneOf && Array.isArray(target.oneOf)) {
            return this.renderOneOf(target.oneOf, 'One of');
        }

        if (target.anyOf && Array.isArray(target.anyOf)) {
            return this.renderOneOf(target.anyOf, 'Any of');
        }

        const properties = target.properties || {};
        const required = new Set(target.required || []);
        const propEntries = Object.entries(properties);
        if (!propEntries.length) {
            const type = deriveSchemaType(target);
            if (!type && !target.description) return nothing;
            return html`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${type ? html`<span class="prop-type">${type}</span>` : nothing}
                        ${renderConstraints(target, {labelSuffix: ':'})}
                    </div>
                    <div class="prop-desc-col">
                        ${target.description ? target.description : nothing}
                    </div>
                </div>
            `;
        }

        return this.renderPropertyTable(properties, required);
    }
}
