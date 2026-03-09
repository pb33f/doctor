import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navTagCss from './nav-tag.css.js';

interface NavTag {
    Name: string;
    Summary: string;
    Children: NavTag[] | null;
    Operations: NavOperation[] | null;
    IsNavOnly: boolean;
}

interface NavOperation {
    Method: string;
    Path: string;
    Slug: string;
    Summary: string;
    Deprecated: boolean;
}

function tagContainsSlug(tag: NavTag, slug: string): boolean {
    if (!slug) return false;
    if (tag.Operations?.some((op) => op.Slug === slug)) return true;
    if (tag.Children?.some((child) => tagContainsSlug(child, slug))) return true;
    return false;
}

@customElement('pp-nav-tag')
export class PpNavTag extends LitElement {
    static styles = navTagCss;

    @property({type: Object}) tag: NavTag = {
        Name: '',
        Summary: '',
        Children: null,
        Operations: null,
        IsNavOnly: false,
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

    render() {
        const {tag, activeSlug, open} = this;
        const containsActive = tagContainsSlug(tag, activeSlug);
        return html`
            <div class="tag-header ${containsActive ? 'active' : ''}" @click=${this.toggle}>
                <sl-icon name=${open ? 'chevron-down' : 'chevron-right'} class="chevron"></sl-icon>
                <span class="tag-name">${tag.Summary || tag.Name}</span>
            </div>
            ${open
                    ? html`
                        <div class="tag-body">
                            ${tag.Operations?.length
                                    ? html`
                                        <ul>
                                            ${tag.Operations.map(
                                                    (op) => html`
                                                        <li>
                                                            <a
                                                                    href="operations/${op.Slug}.html"
                                                                    class="${op.Deprecated ? 'deprecated' : ''} ${op.Slug === activeSlug ? 'active' : ''}"
                                                            >
                                                                <pb33f-http-method tiny
                                                                        method=${op.Method}></pb33f-http-method>
                                                                <span class="op-title">${op.Summary || op.Path}</span>
                                                            </a>
                                                        </li>
                                                    `
                                            )}
                                        </ul>
                                    `
                                    : nothing}
                            ${tag.Children?.length
                                    ? html`
                                        <div class="children">
                                            ${tag.Children.map(
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
