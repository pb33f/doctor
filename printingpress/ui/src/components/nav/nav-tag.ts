import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navTagCss from './nav-tag.css.js';
import {operationHref} from '../../utils/doc-links.js';
import {renderViolationBadges, type ViolationCounts} from '../../utils/violations.js';

interface NavTag {
    name: string;
    summary: string;
    children: NavTag[] | null;
    operations: NavOperation[] | null;
    isNavOnly: boolean;
    counts?: ViolationCounts;
}

interface NavOperation {
    method: string;
    path: string;
    slug: string;
    summary: string;
    deprecated: boolean;
    counts?: ViolationCounts;
}

function tagContainsSlug(tag: NavTag, slug: string): boolean {
    if (!slug) return false;
    if (tag.operations?.some((op) => op.slug === slug)) return true;
    if (tag.children?.some((child) => tagContainsSlug(child, slug))) return true;
    return false;
}

@customElement('pp-nav-tag')
export class PpNavTag extends LitElement {
    static styles = navTagCss;

    @property({type: Object}) tag: NavTag = {
        name: '',
        summary: '',
        children: null,
        operations: null,
        isNavOnly: false,
    };

    @property() activeSlug = '';
    @state() private open = false;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('tag') || changed.has('activeSlug')) {
            if (tagContainsSlug(this.tag, this.activeSlug)) {
                this.open = true;
            }
        }
    }

    private toggle() {
        this.open = !this.open;
    }

    private developerMode(): boolean {
        return document.body?.dataset.ppDeveloperMode === 'true';
    }

    render() {
        const {tag, activeSlug, open} = this;
        const containsActive = tagContainsSlug(tag, activeSlug);
        const dev = this.developerMode();
        return html`
            <div class="tag-header ${containsActive ? 'active' : ''} ${dev ? 'developer' : ''}" @click=${this.toggle}>
                <sl-icon name=${open ? 'chevron-down' : 'chevron-right'} class="chevron"></sl-icon>
                <span class="tag-name">${tag.summary || tag.name}</span>
                ${dev ? renderViolationBadges(tag.counts) : nothing}
            </div>
            ${open
                    ? html`
                        <div class="tag-body">
                            ${tag.operations?.length
                                    ? html`
                                        <ul>
                                            ${tag.operations.map(
                                                    (op) => html`
                                                        <li>
                                                            <a href=${operationHref(op.slug)} class="${op.deprecated ? 'deprecated' : ''} ${op.slug === activeSlug ? 'active' : ''} ${dev ? 'developer' : ''}">
                                                                <span class="op-title">${op.summary || op.path}</span>
                                                                <pb33f-http-method mode="nav-naked"
                                                                        method=${op.method}></pb33f-http-method>
                                                                ${dev ? renderViolationBadges(op.counts) : nothing}
                                                            </a>
                                                        </li>
                                                    `
                                            )}
                                        </ul>
                                    `
                                    : nothing}
                            ${tag.children?.length
                                    ? html`
                                        <div class="children">
                                            ${tag.children.map(
                                                    (child) => html`
                                                        <pp-nav-tag .tag=${child}
                                                                    .activeSlug=${activeSlug}></pp-nav-tag>`
                                            )}
                                        </div>
                                    `
                                    : nothing}
                        </div>
                    `
                    : nothing}
        `;
    }
}
