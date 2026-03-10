import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navModelGroupCss from './nav-model-group.css.js';

interface NavModelGroup {
    Name: string;
    TypeSlug: string;
    Models: NavModel[] | null;
}

interface NavModel {
    Name: string;
    Slug: string;
    TypeSlug: string;
}

function groupContainsSlug(group: NavModelGroup, slug: string): boolean {
    if (!slug) return false;
    return group.Models?.some((m) => m.TypeSlug + '/' + m.Slug === slug) ?? false;
}

@customElement('pp-nav-model-group')
export class PpNavModelGroup extends LitElement {
    static styles = navModelGroupCss;

    @property({type: Object}) group: NavModelGroup = {
        Name: '',
        TypeSlug: '',
        Models: null,
    };

    @property() activeSlug = '';
    @state() private open = false;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('group') || changed.has('activeSlug')) {
            if (groupContainsSlug(this.group, this.activeSlug)) {
                this.open = true;
            }
        }
    }

    private toggle() {
        this.open = !this.open;
    }

    render() {
        const {group, activeSlug, open} = this;
        const containsActive = groupContainsSlug(group, activeSlug);
        return html`
            <div class="group-header ${containsActive ? 'active' : ''}" @click=${this.toggle}>
                <sl-icon name=${open ? 'chevron-down' : 'chevron-right'} class="chevron"></sl-icon>
                <span>${group.Name}</span>
            </div>
            ${open && group.Models?.length
                ? html`
                    <div class="group-body">
                        <ul>
                            ${group.Models.map(
                                (model) => {
                                    const modelSlug = model.TypeSlug + '/' + model.Slug;
                                    return html`
                                        <li>
                                            <a href="models/${model.TypeSlug}/${model.Slug}.html"
                                               class="${modelSlug === activeSlug ? 'active' : ''}">
                                                <span class="model-name">${model.Name}</span>
                                            </a>
                                        </li>
                                    `;
                                }
                            )}
                        </ul>
                    </div>
                `
                : nothing}
        `;
    }
}
