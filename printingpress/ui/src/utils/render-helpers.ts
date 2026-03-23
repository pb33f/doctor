import {html, nothing, TemplateResult} from 'lit';
import {collectConstraints, resolveRefLink, deriveSchemaType, type RefLink} from './schema.js';

export interface RenderConstraintsOptions {
    includeExample?: boolean;
    labelSuffix?: string;
}

export type RefRenderer = (ref: string, link: RefLink) => TemplateResult;

export function renderSchemaType(
    prop: any,
    renderRef: RefRenderer
): TemplateResult | typeof nothing {
    if (!prop) return nothing;

    // Nested allOf/composition: show linked ref names when all entries are refs
    if (prop.allOf && Array.isArray(prop.allOf)) {
        const refLinks: Array<{ref: string; link: RefLink}> = [];
        let allRefs = true;
        for (const s of prop.allOf) {
            if (!s.$ref) { allRefs = false; continue; }
            const link = resolveRefLink(s.$ref);
            if (link) refLinks.push({ref: s.$ref, link});
        }
        if (allRefs && refLinks.length > 0) {
            return html`<span class="prop-type prop-type-link">
                ${refLinks.map((r, i) => html`
                    ${i > 0 ? html` <span class="composition-separator">&amp;</span> ` : nothing}
                    ${renderRef(r.ref, r.link)}
                `)}
            </span>`;
        }
    }

    // Array with allOf items (composition)
    if (prop.type === 'array' && prop.items?.allOf && Array.isArray(prop.items.allOf)) {
        const refLinks: Array<{ref: string; link: RefLink}> = [];
        let allRefs = true;
        for (const s of prop.items.allOf) {
            if (!s.$ref) { allRefs = false; continue; }
            const link = resolveRefLink(s.$ref);
            if (link) refLinks.push({ref: s.$ref, link});
        }
        if (allRefs && refLinks.length > 0) {
            return html`<span class="prop-type prop-type-link">Array&lt;${refLinks.map((r, i) => html`
                ${i > 0 ? html` <span class="composition-separator">&amp;</span> ` : nothing}
                ${renderRef(r.ref, r.link)}
            `)}&gt;</span>`;
        }
    }

    // Array with $ref items
    if (prop.type === 'array' && prop.items?.$ref) {
        const link = resolveRefLink(prop.items.$ref);
        if (link) {
            return html`<span class="prop-type prop-type-link">Array&lt;${renderRef(prop.items.$ref, link)}&gt;</span>`;
        }
    }

    // oneOf / anyOf: show option titles or ref names with "|" separator
    const variants = prop.oneOf ?? prop.anyOf;
    if (variants && Array.isArray(variants)) {
        const refLinks: Array<{ref: string; link: RefLink}> = [];
        let allRefs = true;
        for (const s of variants) {
            if (!s.$ref) { allRefs = false; break; }
            const link = resolveRefLink(s.$ref);
            if (link) refLinks.push({ref: s.$ref, link});
        }
        if (allRefs && refLinks.length > 0) {
            return html`<span class="prop-type prop-type-link">
                ${refLinks.map((r, i) => html`
                    ${i > 0 ? html` <span class="composition-separator">|</span> ` : nothing}
                    ${renderRef(r.ref, r.link)}
                `)}
            </span>`;
        }
        const titles = variants.map((e: any) => e.title).filter(Boolean);
        if (titles.length === variants.length) {
            return html`<span class="prop-type">${titles.join(' | ')}</span>`;
        }
    }

    // Direct $ref
    if (prop.$ref) {
        const link = resolveRefLink(prop.$ref);
        if (link) {
            return html`<span class="prop-type prop-type-link">${renderRef(prop.$ref, link)}</span>`;
        }
    }

    const type = deriveSchemaType(prop);
    if (!type) return nothing;
    return html`<span class="prop-type">${type}</span>`;
}

export function renderConstraints(prop: any, opts?: RenderConstraintsOptions): TemplateResult | typeof nothing {
    if (!prop) return nothing;
    const parts = collectConstraints(prop, {includeExample: opts?.includeExample});
    if (!parts.length && !prop.enum?.length) return nothing;
    const suffix = opts?.labelSuffix ?? '';
    return html`
        <div class="constraints">
            ${parts.map(p => html`
                <span class="constraint-label">${p.label}${suffix}</span>
                <span class="constraint-value">${p.isCode ? html`<code>${p.value}</code>` : p.value}</span>
            `)}
            ${prop.enum?.length ? html`
                <div class="enum-section">
                    <span class="constraint-label">enum${suffix}</span>
                    <div class="enum-grid">${prop.enum.map((v: any) => html`<span class="enum-value">${JSON.stringify(v)}</span>`)}</div>
                </div>
            ` : nothing}
        </div>
    `;
}
