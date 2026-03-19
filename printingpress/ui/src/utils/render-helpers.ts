import {html, nothing, TemplateResult} from 'lit';
import {collectConstraints} from './schema.js';

export interface RenderConstraintsOptions {
    includeExample?: boolean;
    labelSuffix?: string;
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
                <span class="constraint-label">enum${suffix}</span>
                <span class="constraint-value">${prop.enum.map((v: any, i: number) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${JSON.stringify(v)}</span>`)}</span>
            ` : nothing}
        </div>
    `;
}
