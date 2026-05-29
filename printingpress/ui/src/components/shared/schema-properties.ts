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
import markdownCss from '../../styles/markdown.css.js';
import schemaPropertiesCss from './schema-properties.css.js';
import {deriveSchemaType, resolveRefLink} from '../../utils/schema.js';
import {renderMarkdown} from '../../utils/markdown.js';
import {renderConstraints, renderSchemaType} from '../../utils/render-helpers.js';
import {getCachedSchemaModelByRef, getSchemaEntryByRef, preloadSchemaReferences} from '../../utils/schema-registry.js';
import './ref-popover.js';

const DEFAULT_COMPACT_NAME_WIDTH_PX = 200;
const MIN_COMPACT_NAME_WIDTH_PX = 180;
const REQUIRED_BADGE_SLOT_WIDTH_PX = 52;
const REQUIRED_BADGE_GAP_PX = 10;
const NAME_COLUMN_TRAILING_PADDING_PX = 20;
const PROPERTY_NAME_CHAR_WIDTH_PX = 10.5;
const DEFAULT_FONT_SIZE_PX = 16;

const POLYMORPHIC_CONSTRAINED_LEFT_WIDTH_FALLBACK_PX = 224;
const POLYMORPHIC_TAB_RAIL_MIN_WIDTH_PX = 160;
const POLYMORPHIC_TAB_RAIL_CONDENSED_MAX_WIDTH_PX = 260;
const POLYMORPHIC_TAB_RAIL_MAX_WIDTH_PX = 340;
const POLYMORPHIC_TAB_LABEL_BASE_WIDTH_PX = 56;
const POLYMORPHIC_TAB_LABEL_CHAR_WIDTH_PX = 9.5;
const POLYMORPHIC_CONSTRAINED_BODY_MIN_WIDTH_PX = 32;
const POLYMORPHIC_BODY_MIN_WIDTH_PX = 340;
const POLYMORPHIC_CONSTRAINED_LAYOUT_PADDING_PX = 40;
const POLYMORPHIC_LAYOUT_PADDING_PX = 72;
const POLYMORPHIC_TAB_RAIL_WIDTH_FALLBACK_PX = 250;
const POLYMORPHIC_CONDENSED_TAB_RAIL_WIDTH_FALLBACK_PX = 170;
const POLYMORPHIC_COMPACT_TAB_RAIL_WIDTH_FALLBACK_PX = 208;

@customElement('pp-schema-properties')
export class PpSchemaProperties extends LitElement {
    static styles = [constraintsCss, markdownCss, ...schemaPropertiesCss];

    @property({attribute: 'schema-json'}) schemaJson = '';
    @property({type: Boolean, reflect: true}) compact = false;
    @property({type: Boolean, reflect: true}) condensed = false;
    @property({type: Boolean, reflect: true}) constrained = false;
    @property({attribute: 'popover-context', type: Boolean, reflect: true}) popoverContext = false;
    @state() private schema: any = null;
    @state() private availableWidth = 0;
    @state() private polymorphicSelections: Record<string, number> = {};

    private resizeObserver: ResizeObserver | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.updateAvailableWidth();
        if (typeof ResizeObserver === 'undefined') return;
        this.resizeObserver = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect?.width ?? this.getBoundingClientRect().width;
            this.setAvailableWidth(width);
        });
        this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
    }

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('schemaJson') && this.schemaJson) {
            try {
                this.schema = JSON.parse(this.schemaJson);
                this.polymorphicSelections = {};
                this.computeNameColumnWidth();
                void this.primeReferencedSchemas(this.schema);
            } catch {
                this.schema = null;
            }
        }
    }

    private updateAvailableWidth() {
        this.setAvailableWidth(this.getBoundingClientRect().width);
    }

    private setAvailableWidth(width: number) {
        if (!Number.isFinite(width)) return;
        const next = Math.round(width);
        if (next !== this.availableWidth) {
            this.availableWidth = next;
        }
    }

    private async primeReferencedSchemas(schema: any) {
        await preloadSchemaReferences(schema);
        this.requestUpdate();
    }

    private parseRegistrySchema(ref: string, visited: Set<string>): any | null {
        if (visited.has(ref)) return null;
        const registryEntry = getCachedSchemaModelByRef(ref);
        if (!registryEntry?.schemaJson) return null;
        try {
            visited.add(ref);
            return JSON.parse(registryEntry.schemaJson);
        } catch {
            return null;
        }
    }

    private resolveRenderableTarget(target: any, visited = new Set<string>()): any {
        if (!target?.$ref) return target;
        return this.parseRegistrySchema(target.$ref, visited) ?? target;
    }

    private collectRenderedNameMetrics(schema: any, visited = new Set<string>()): {maxLen: number; hasRequired: boolean} {
        if (!schema || typeof schema !== 'object') {
            return {maxLen: 0, hasRequired: false};
        }

        let maxLen = 0;
        let hasRequired = false;

        const props = schema.properties;
        const required = new Set<string>(schema.required ?? []);
        if (props && typeof props === 'object') {
            for (const [name, prop] of Object.entries(props as Record<string, any>)) {
                maxLen = Math.max(maxLen, name.length);
                if (required.has(name)) hasRequired = true;
                const nested = this.collectRenderedNameMetrics(prop, visited);
                maxLen = Math.max(maxLen, nested.maxLen);
                hasRequired = hasRequired || nested.hasRequired;
            }
        }

        const compositionKeys = ['allOf', 'oneOf', 'anyOf'] as const;
        for (const key of compositionKeys) {
            const entries = schema[key];
            if (!Array.isArray(entries)) continue;
            for (const entry of entries) {
                if (entry?.$ref) {
                    if (key !== 'allOf') continue;
                    const referencedSchema = this.parseRegistrySchema(entry.$ref, visited);
                    if (!referencedSchema) continue;
                    const nested = this.collectRenderedNameMetrics(referencedSchema, visited);
                    maxLen = Math.max(maxLen, nested.maxLen);
                    hasRequired = hasRequired || nested.hasRequired;
                    continue;
                }
                const nested = this.collectRenderedNameMetrics(entry, visited);
                maxLen = Math.max(maxLen, nested.maxLen);
                hasRequired = hasRequired || nested.hasRequired;
            }
        }

        if (schema.items) {
            const items = schema.items;
            if (items.$ref) {
                const referencedSchema = this.parseRegistrySchema(items.$ref, visited);
                if (referencedSchema) {
                    const nested = this.collectRenderedNameMetrics(referencedSchema, visited);
                    maxLen = Math.max(maxLen, nested.maxLen);
                    hasRequired = hasRequired || nested.hasRequired;
                }
            } else {
                const nested = this.collectRenderedNameMetrics(items, visited);
                maxLen = Math.max(maxLen, nested.maxLen);
                hasRequired = hasRequired || nested.hasRequired;
            }
        }

        return {maxLen, hasRequired};
    }

    private computeNameColumnWidth() {
        if (!this.schema) return;
        const {maxLen} = this.collectRenderedNameMetrics(this.schema);
        const estimatedNameWidth = maxLen * PROPERTY_NAME_CHAR_WIDTH_PX;
        const width = Math.max(
            MIN_COMPACT_NAME_WIDTH_PX,
            REQUIRED_BADGE_SLOT_WIDTH_PX + REQUIRED_BADGE_GAP_PX + estimatedNameWidth + NAME_COLUMN_TRAILING_PADDING_PX,
        );
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
        const isRequired = required.has(name);
        return html`
            <div class="property">
                <div class="prop-name-col">
                    <span class="required-badge ${isRequired ? '' : 'required-badge-placeholder'}" aria-hidden=${isRequired ? 'false' : 'true'}>${isRequired ? 'req' : 'req'}</span>
                    <span class="prop-name ${isRequired ? 'required' : ''}">${name}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(prop)}
                    ${renderConstraints(prop, {labelSuffix: ':'})}
                </div>
                <div class="prop-desc-col">
                    ${renderMarkdown(prop.description)}
                </div>
            </div>
        `;
    }

    private renderPropertyTable(properties: Record<string, any>, required: Set<string>, path = '$.properties') {
        const propEntries = Object.entries(properties);
        if (!propEntries.length) return nothing;
        return propEntries.map(([name, prop]: [string, any]) => {
            const variants = prop.oneOf ?? prop.anyOf;
            if (variants && Array.isArray(variants)) {
                const label = 'polymorphic';
                return html`
                    <div class="property-oneof">
                        ${this.renderOneOf(variants, name, prop.description, required.has(name), label, `${path}.${name}`)}
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
                            ${description ? renderMarkdown(description, {className: 'composition-ref-desc pp-markdown'}) : nothing}
                        </div>
                    `;
                })}
            </div>
        `;
    }

    private mergePropertyMaps(base: Record<string, any>, incoming: Record<string, any>) {
        for (const [key, value] of Object.entries(incoming)) {
            base[key] = value;
        }
    }

    private collectCompositionData(target: any, visited = new Set<string>()) {
        const refEntries: any[] = [];
        const mergedRequired = new Set<string>(target?.required || []);
        const mergedProperties: Record<string, any> = {};

        if (target?.properties) {
            this.mergePropertyMaps(mergedProperties, target.properties);
        }

        const allOf: any[] = Array.isArray(target?.allOf) ? target.allOf : [];
        for (const entry of allOf) {
            if (entry?.$ref) {
                refEntries.push(entry);
                const referencedSchema = this.parseRegistrySchema(entry.$ref, visited);
                if (!referencedSchema) continue;
                const nested = this.collectCompositionData(referencedSchema, visited);
                if (nested.refEntries.length) {
                    refEntries.push(...nested.refEntries);
                }
                this.mergePropertyMaps(mergedProperties, nested.mergedProperties);
                for (const req of nested.mergedRequired) mergedRequired.add(req);
                continue;
            }

            if (entry?.allOf && Array.isArray(entry.allOf)) {
                const nested = this.collectCompositionData(entry, visited);
                if (nested.refEntries.length) {
                    refEntries.push(...nested.refEntries);
                }
                this.mergePropertyMaps(mergedProperties, nested.mergedProperties);
                for (const req of nested.mergedRequired) mergedRequired.add(req);
                continue;
            }

            if (entry?.properties) {
                this.mergePropertyMaps(mergedProperties, entry.properties);
            }
            if (entry?.required) {
                for (const req of entry.required) mergedRequired.add(req);
            }
        }

        return {refEntries, mergedRequired, mergedProperties};
    }

    private renderComposition(target: any) {
        const {refEntries, mergedRequired, mergedProperties} = this.collectCompositionData(target);
        const uniqueRefEntries = refEntries.filter((entry, index) => {
            return entry?.$ref && refEntries.findIndex((candidate) => candidate?.$ref === entry.$ref) === index;
        });

        return html`
            ${uniqueRefEntries.length ? this.renderCompositionRefs(uniqueRefEntries) : nothing}
            ${Object.keys(mergedProperties).length
                ? this.renderPropertyTable(mergedProperties, mergedRequired, '$.allOf.properties')
                : nothing}
        `;
    }

    private renderOneOf(entries: any[], propName?: string, propDesc?: string, isRequired?: boolean, label?: string, path = '$.oneOf') {
        if (!entries.length) return nothing;
        const selectionKey = this.getPolymorphicSelectionKey(path, entries);
        const selectedIndex = this.getSelectedPolymorphicIndex(selectionKey, entries);
        const selectedEntry = entries[selectedIndex];
        const selectedLabel = this.getPolymorphicOptionLabel(selectedEntry, selectedIndex);
        const useDropdown = this.shouldUsePolymorphicDropdown(entries, propName);
        const hasSelector = entries.length > 1;
        const propertyClasses = [
            'oneof-property',
            hasSelector ? '' : 'oneof-property-single',
            hasSelector && useDropdown && this.popoverContext ? 'oneof-property-popover-dropdown' : '',
        ].filter(Boolean).join(' ');

        return html`
            <div class=${propertyClasses}>
                <div class="oneof-left">
                    ${propName ? html`
                        <div class="oneof-prop-name">
                            <span class="required-badge ${isRequired ? '' : 'required-badge-placeholder'}" aria-hidden=${isRequired ? 'false' : 'true'}>req</span>
                            <span class="prop-name">${propName}</span>
                            ${label ? html`<div class="composition-label polymorphic">(${label})</div>` : nothing}
                        </div>
                    ` : nothing}
                    ${propDesc ? renderMarkdown(propDesc, {className: 'oneof-prop-desc pp-markdown'}) : nothing}
                </div>
                ${!hasSelector
                    ? html`
                        <div class="oneof-single-value">
                            ${this.renderOneOfSingleValue(selectedEntry)}
                        </div>
                        ${this.renderOneOfSingleBody(selectedEntry, `${path}[${selectedIndex}]`)}
                    `
                    : html`
                        <div class="oneof-desc-container">
                            ${useDropdown
                        ? html`
                            <div class="polymorphic-dropdown-row">
                                <sl-dropdown class="polymorphic-dropdown" skidding="5" distance="5">
                                    <sl-button slot="trigger" caret>${selectedLabel}</sl-button>
                                    <sl-menu @sl-select=${(event: CustomEvent) => this.handlePolymorphicSelect(event, selectionKey, entries.length)}>
                                        ${entries.map((entry, i) => html`
                                            <sl-menu-item value="${i}">${this.getPolymorphicOptionLabel(entry, i)}</sl-menu-item>
                                        `)}
                                    </sl-menu>
                                </sl-dropdown>
                            </div>
                            <div class="oneof-dropdown-panel">
                                ${this.renderOneOfOption(selectedEntry, `${path}[${selectedIndex}]`)}
                            </div>
                        `
                        : html`
                            <sl-tab-group class="oneof-tabs" placement="start">
                                ${entries.map((e, i) => html`
                                    <sl-tab slot="nav" panel="${selectionKey}-${i}" class="oneof-tab" ?active=${i === selectedIndex}>
                                        \u203A ${this.getPolymorphicOptionLabel(e, i)}
                                    </sl-tab>
                                `)}
                                ${entries.map((e, i) => html`
                                    <sl-tab-panel name="${selectionKey}-${i}" ?active=${i === selectedIndex}>
                                        ${this.renderOneOfOption(e, `${path}[${i}]`)}
                                    </sl-tab-panel>
                                `)}
                            </sl-tab-group>
                        `}
                        </div>
                    `}
            </div>
        `;
    }

    private getPolymorphicOptionLabel(entry: any, index: number) {
        return entry?.title || entry?.$ref?.split('/').pop() || `Option ${index + 1}`;
    }

    private getPolymorphicSelectionKey(path: string, entries: any[]) {
        const signature = entries.map((entry, index) => {
            return this.getPolymorphicOptionLabel(entry, index);
        }).join('|');
        return `${path}:${signature}`;
    }

    private getSelectedPolymorphicIndex(selectionKey: string, entries: any[]) {
        const selected = this.polymorphicSelections[selectionKey] ?? 0;
        return selected >= 0 && selected < entries.length ? selected : 0;
    }

    private handlePolymorphicSelect(event: CustomEvent, selectionKey: string, entryCount: number) {
        const value = event.detail?.item?.value;
        if (value === undefined) return;
        const selected = parseInt(value, 10);
        if (!Number.isFinite(selected) || selected < 0 || selected >= entryCount) return;
        this.polymorphicSelections = {
            ...this.polymorphicSelections,
            [selectionKey]: selected,
        };
    }

    private getCompactNameWidth() {
        const compactWidth = parseFloat(this.style.getPropertyValue('--compact-name-width'));
        return Number.isFinite(compactWidth) ? compactWidth : DEFAULT_COMPACT_NAME_WIDTH_PX;
    }

    private getCssLengthPx(value: string, fallback: number) {
        const trimmed = value.trim();
        const numeric = parseFloat(trimmed);
        if (!Number.isFinite(numeric)) return fallback;
        if (trimmed.endsWith('rem')) {
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            return numeric * (Number.isFinite(rootFontSize) ? rootFontSize : DEFAULT_FONT_SIZE_PX);
        }
        if (trimmed.endsWith('em')) {
            const hostFontSize = parseFloat(getComputedStyle(this).fontSize);
            return numeric * (Number.isFinite(hostFontSize) ? hostFontSize : DEFAULT_FONT_SIZE_PX);
        }
        return numeric;
    }

    private getPolymorphicConstrainedLeftWidth() {
        return this.getCssLengthPx(
            getComputedStyle(this).getPropertyValue('--polymorphic-constrained-left-width'),
            POLYMORPHIC_CONSTRAINED_LEFT_WIDTH_FALLBACK_PX,
        );
    }

    private getPolymorphicVerticalTabRailWidth() {
        const styles = getComputedStyle(this);
        if (this.compact) {
            return this.getCssLengthPx(styles.getPropertyValue('--polymorphic-compact-tab-rail-width'), POLYMORPHIC_COMPACT_TAB_RAIL_WIDTH_FALLBACK_PX);
        }
        if (this.condensed) {
            return this.getCssLengthPx(styles.getPropertyValue('--polymorphic-condensed-tab-rail-width'), POLYMORPHIC_CONDENSED_TAB_RAIL_WIDTH_FALLBACK_PX);
        }
        return this.getCssLengthPx(styles.getPropertyValue('--polymorphic-tab-rail-width'), POLYMORPHIC_TAB_RAIL_WIDTH_FALLBACK_PX);
    }

    private getPolymorphicLeftWidth(propName?: string) {
        if (!propName) return 0;
        const labelWidth = REQUIRED_BADGE_SLOT_WIDTH_PX + propName.length * PROPERTY_NAME_CHAR_WIDTH_PX;
        const preferredWidth = Math.max(this.getCompactNameWidth(), labelWidth);
        return this.constrained ? Math.min(preferredWidth, this.getPolymorphicConstrainedLeftWidth()) : preferredWidth;
    }

    private shouldUsePolymorphicDropdown(entries: any[], propName?: string) {
        if (this.popoverContext) return true;
        const availableWidth = this.availableWidth || this.getBoundingClientRect().width || this.offsetWidth;
        if (!availableWidth) return false;
        const longestLabel = entries.reduce((longest, entry, index) => {
            return Math.max(longest, this.getPolymorphicOptionLabel(entry, index).length);
        }, 0);
        const tabRailMaxWidth = this.condensed
            ? POLYMORPHIC_TAB_RAIL_CONDENSED_MAX_WIDTH_PX
            : POLYMORPHIC_TAB_RAIL_MAX_WIDTH_PX;
        const tabRailWidth = Math.max(
            POLYMORPHIC_TAB_RAIL_MIN_WIDTH_PX,
            Math.min(tabRailMaxWidth, POLYMORPHIC_TAB_LABEL_BASE_WIDTH_PX + longestLabel * POLYMORPHIC_TAB_LABEL_CHAR_WIDTH_PX),
        );
        const verticalTabRailWidth = this.getPolymorphicVerticalTabRailWidth();
        if (tabRailWidth > verticalTabRailWidth) return true;
        const leftWidth = this.getPolymorphicLeftWidth(propName);
        const layoutPadding = this.constrained ? POLYMORPHIC_CONSTRAINED_LAYOUT_PADDING_PX : POLYMORPHIC_LAYOUT_PADDING_PX;
        if (this.constrained) {
            return leftWidth + verticalTabRailWidth + POLYMORPHIC_CONSTRAINED_BODY_MIN_WIDTH_PX + layoutPadding > availableWidth;
        }
        return leftWidth + tabRailWidth + POLYMORPHIC_BODY_MIN_WIDTH_PX + layoutPadding > availableWidth;
    }

    private renderOneOfSingleValue(entry: any) {
        return html`
            ${this.renderType(entry)}
            ${renderConstraints(entry, {labelSuffix: ':'})}
        `;
    }

    private renderOneOfSingleBody(entry: any, path = '$.oneOf[0]') {
        if (entry.$ref) {
            return nothing;
        }

        const required = new Set<string>(entry.required || []);
        if (!entry.description && !entry.properties) return nothing;
        return html`
            <div class="oneof-single-panel">
                ${entry.description ? renderMarkdown(entry.description, {className: 'oneof-option-desc pp-markdown'}) : nothing}
                ${entry.properties
                    ? this.renderPropertyTable(entry.properties, required, `${path}.properties`)
                    : nothing}
            </div>
        `;
    }

    private renderOneOfOption(entry: any, path = '$.oneOf[0]') {
        if (entry.$ref) {
            const link = resolveRefLink(entry.$ref);
            if (!link) return nothing;
            const registryEntry = getSchemaEntryByRef(entry.$ref);
            return html`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(entry.$ref, link)}
                    ${registryEntry?.description ? renderMarkdown(registryEntry.description, {className: 'oneof-option-desc pp-markdown'}) : nothing}
                </div>
            `;
        }

        const required = new Set<string>(entry.required || []);
        const type = deriveSchemaType(entry);
        return html`
            ${entry.description ? renderMarkdown(entry.description, {className: 'oneof-option-desc pp-markdown'}) : nothing}
            ${entry.properties
                ? this.renderPropertyTable(entry.properties, required, `${path}.properties`)
                : type
                    ? html`<div class="oneof-option-scalar"><span class="prop-type">${type}</span>${renderConstraints(entry, {labelSuffix: ':'})}</div>`
                    : nothing}
        `;
    }

    render() {
        if (!this.schema) return nothing;
        const rootTarget = this.schema.type === 'array'
            && (this.schema.items?.properties || this.schema.items?.allOf || this.schema.items?.oneOf || this.schema.items?.anyOf)
            ? this.schema.items
            : this.schema;
        const target = this.resolveRenderableTarget(rootTarget);

        if (target.allOf && Array.isArray(target.allOf)) {
            return this.renderComposition(target);
        }

        if (target.oneOf && Array.isArray(target.oneOf)) {
            return this.renderOneOf(target.oneOf, 'ONE OF', undefined, undefined, 'polymorphic', '$.oneOf');
        }

        if (target.anyOf && Array.isArray(target.anyOf)) {
            return this.renderOneOf(target.anyOf, 'ANY OF', undefined, undefined, 'polymorphic', '$.anyOf');
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
                        ${renderMarkdown(target.description)}
                    </div>
                </div>
            `;
        }

        return this.renderPropertyTable(properties, required);
    }
}
