import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import navModelGroupCss from './nav-model-group.css.js';

interface NavModelGroup {
    name: string;
    typeSlug: string;
    models: NavModel[] | null;
}

interface NavModel {
    name: string;
    slug: string;
    typeSlug: string;
}

function groupContainsSlug(group: NavModelGroup, slug: string): boolean {
    if (!slug) return false;
    return group.models?.some((m) => m.typeSlug + '/' + m.slug === slug) ?? false;
}

@customElement('pp-nav-model-group')
export class PpNavModelGroup extends LitElement {
    static styles = navModelGroupCss;

    @property({type: Object}) group: NavModelGroup = {
        name: '',
        typeSlug: '',
        models: null,
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

    protected updated(changed: Map<string, unknown>) {
        if (changed.has('activeSlug') || changed.has('group')) {
            if (this.open && this.activeSlug) {
                requestAnimationFrame(() => {
                    const active = this.renderRoot.querySelector('a.active');
                    active?.scrollIntoView({block: 'center', behavior: 'auto'});
                });
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
                <span>${group.name}</span>
            </div>
            ${open && group.models?.length
                ? html`
                    <div class="group-body">
                        <ul>
                            ${group.models.map(
                                (model) => {
                                    const modelSlug = model.typeSlug + '/' + model.slug;
                                    return html`
                                        <li>
                                            <a href="models/${model.typeSlug}/${model.slug}.html"
                                               class="${modelSlug === activeSlug ? 'active' : ''}">
                                                <span class="model-name">${model.name}</span>
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
