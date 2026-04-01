import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import crossRefsCss from './cross-refs.css.js';
import './ref-list.js';
import type {OperationRef, ComponentRef} from './ref-list.js';

interface CrossRefData {
    usedByOperations?: OperationRef[];
    usedByModels?: ComponentRef[];
    usesModels?: ComponentRef[];
}

@customElement('pp-cross-refs')
export class PpCrossRefs extends LitElement {
    static styles = crossRefsCss;

    @property({attribute: 'refs-json'}) refsJson = '';
    @state() private refs: CrossRefData = {};

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('refsJson') && this.refsJson) {
            try {
                this.refs = JSON.parse(this.refsJson);
            } catch {
                this.refs = {};
            }
        }
    }

    render() {
        const {refs} = this;
        const hasOps = (refs.usedByOperations?.length ?? 0) > 0;
        const hasRefBy = (refs.usedByModels?.length ?? 0) > 0;
        const hasUses = (refs.usesModels?.length ?? 0) > 0;
        if (!hasOps && !hasRefBy && !hasUses) return nothing;

        return html`
            ${hasOps ? html`
                <pp-ref-list
                    type="operations"
                    heading="Consumed By"
                    .items=${refs.usedByOperations!}>
                </pp-ref-list>` : nothing}
            ${hasRefBy ? html`
                <pp-ref-list
                    type="components"
                    heading="Referenced By"
                    .items=${refs.usedByModels!}>
                </pp-ref-list>` : nothing}
            ${hasUses ? html`
                <pp-ref-list
                    type="components"
                    heading="References"
                    .items=${refs.usesModels!}>
                </pp-ref-list>` : nothing}
        `;
    }
}
