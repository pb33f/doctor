import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
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

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('schemaJson') && this.schemaJson) {
            try {
                this.schema = JSON.parse(this.schemaJson);
                this.computeNameColumnWidth();
            } catch {
                this.schema = null;
            }
        }
    }

    private computeNameColumnWidth() {
        if (!this.schema) return;
        let maxLen = 0;
        const props = this.schema.properties;
        const required = new Set<string>(this.schema.required ?? []);
        let hasRequired = false;
        if (props) {
            for (const name of Object.keys(props)) {
                if (name.length > maxLen) maxLen = name.length;
                if (required.has(name)) hasRequired = true;
            }
        }
        // ~8.5px per char in monospace + gap. Add 60px for REQ badge if any property is required.
        const badgeWidth = hasRequired ? 70 : 0;
        const width = Math.max(150, maxLen * 8.5 + badgeWidth + 16);
        this.style.setProperty('--compact-name-width', `${Math.round(width)}px`);
    }

    private renderRefAnchor(ref: string, link: { name: string; href: string }) {
        const anchor = html`<a class="ref-type-link" href="${link.href}">\u279c ${link.name}</a>`;
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
                    <span class="prop-name ${required.has(name) ? 'required' : ''}">${name}</span>
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

        return html`
            <div class="oneof-property">
                <div class="oneof-left">
                    ${propName ? html`
                        <div class="oneof-prop-name">
                            ${isRequired ? html`<span class="required-badge">req</span>` : nothing}
                            <span class="prop-name">${propName}</span>
                            ${label ? html`<div class="composition-label polymorphic">(${label})</div>` : nothing}
                        </div>
                    ` : nothing}
                    ${propDesc ? html`<div class="oneof-prop-desc">${propDesc}</div>` : nothing}
                </div>
                <div class="oneof-desc-container">
                    <sl-tab-group class="oneof-tabs" placement="start">
                        ${entries.map((e, i) => html`
                            <sl-tab slot="nav" panel="oneof-${i}" class="oneof-tab" ?active=${i === 0}>
                                \u203A ${e.title || e.$ref?.split('/').pop() || `Option ${i + 1}`}
                            </sl-tab>
                        `)}
                        ${entries.map((e, i) => html`
                            <sl-tab-panel name="oneof-${i}" ?active=${i === 0}>
                                ${this.renderOneOfOption(e)}
                            </sl-tab-panel>
                        `)}
                    </sl-tab-group>
                </div>
            </div>
        `;
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
        const type = deriveSchemaType(entry);
        return html`
            ${entry.description ? html`<div class="oneof-option-desc">${entry.description}</div>` : nothing}
            ${entry.properties
                ? this.renderPropertyTable(entry.properties, required)
                : type
                    ? html`<div class="oneof-option-scalar"><span class="prop-type">${type}</span>${renderConstraints(entry, {labelSuffix: ':'})}</div>`
                    : nothing}
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
            return this.renderOneOf(target.oneOf, 'ONE OF', undefined, undefined, 'polymorphic');
        }

        if (target.anyOf && Array.isArray(target.anyOf)) {
            return this.renderOneOf(target.anyOf, 'ANY OF', undefined, undefined, 'polymorphic');
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
