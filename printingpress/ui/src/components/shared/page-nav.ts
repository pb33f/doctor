import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import pageNavCss from './page-nav.css.js';

interface NavSection {
    label: string;
    id: string;
    children?: NavSection[];
}

const COLLAPSED_KEY = 'pp-page-nav-collapsed';

@customElement('pp-page-nav')
export class PpPageNav extends LitElement {
    static styles = [pageNavCss];

    @property({attribute: 'page-title'}) pageTitle = '';
    @property({attribute: 'sections-json'}) sectionsJson = '';
    @state() private sections: NavSection[] = [];
    @state() private collapsed = false;
    @state() private activeId = '';

    private scrollContainer: Element | null = null;
    private rafId = 0;
    private scrollSpySuppressed = false;
    private suppressionTimerId = 0;
    private boundScrollHandler = () => this.onScroll();

    connectedCallback() {
        super.connectedCallback();
        this.collapsed = localStorage.getItem(COLLAPSED_KEY) === 'true';
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.scrollContainer?.removeEventListener('scroll', this.boundScrollHandler);
        if (this.suppressionTimerId) {
            window.clearTimeout(this.suppressionTimerId);
            this.suppressionTimerId = 0;
        }
    }

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('sectionsJson') && this.sectionsJson) {
            try {
                this.sections = JSON.parse(this.sectionsJson);
            } catch {
                this.sections = [];
            }
            // Populate response children after the responses component upgrades
            this.loadResponseChildren();
            // Set up scroll spy after sections are ready
            requestAnimationFrame(() => this.setupScrollSpy());
        }
    }

    private loadResponseChildren() {
        const responsesSection = this.sections.find(s => s.id === 'section-responses');
        if (!responsesSection) return;

        const tryLoad = () => {
            const respComp = document.getElementById('section-responses') as any;
            if (respComp && typeof respComp.getResponseNavItems === 'function') {
                responsesSection.children = respComp.getResponseNavItems();
                this.requestUpdate();
            }
        };

        // Try immediately, then retry after component upgrades
        tryLoad();
        if (!responsesSection.children?.length) {
            customElements.whenDefined('pp-operation-responses').then(() => {
                // Wait for render
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => tryLoad());
                });
            });
        }
    }

    private setupScrollSpy() {
        const layout = document.querySelector('pp-layout');
        this.scrollContainer = layout?.shadowRoot?.querySelector('.content-panel') || null;
        if (!this.scrollContainer) return;
        this.scrollContainer.addEventListener('scroll', this.boundScrollHandler, {passive: true});
    }

    private suppressScrollSpy() {
        this.scrollSpySuppressed = true;
        // Clear any existing timer so we don't resume prematurely
        if (this.suppressionTimerId) {
            window.clearTimeout(this.suppressionTimerId);
            this.suppressionTimerId = 0;
        }
    }

    private scheduleScrollSpyResume() {
        // Reset the timer on every scroll event during suppression.
        // The spy resumes only after scrolling has been idle for 150ms,
        // which means the smooth scroll animation has finished.
        if (this.suppressionTimerId) {
            window.clearTimeout(this.suppressionTimerId);
        }
        this.suppressionTimerId = window.setTimeout(() => {
            this.scrollSpySuppressed = false;
            this.suppressionTimerId = 0;
        }, 150);
    }

    private onScroll() {
        if (this.scrollSpySuppressed) {
            this.scheduleScrollSpyResume();
            return;
        }
        if (this.rafId) return;
        this.rafId = requestAnimationFrame(() => {
            this.rafId = 0;
            this.updateActiveSection();
        });
    }

    private updateActiveSection() {
        const threshold = 100;
        let activeId = '';

        // Check all top-level sections
        for (const s of this.sections) {
            const el = this.findElement(s.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= threshold) {
                    activeId = s.id;
                }
            }
            // Check children (response codes)
            if (s.children) {
                for (const c of s.children) {
                    const childEl = this.findElement(c.id);
                    if (childEl) {
                        const rect = childEl.getBoundingClientRect();
                        if (rect.top <= threshold) {
                            activeId = c.id;
                        }
                    }
                }
            }
        }
        if (activeId && activeId !== this.activeId) {
            this.activeId = activeId;
        }
    }

    private findElement(id: string): Element | null {
        const el = document.getElementById(id);
        if (el) return el;
        // Response IDs are inside pp-operation-responses shadow DOM
        const respComp = document.getElementById('section-responses');
        if (respComp?.shadowRoot) {
            return respComp.shadowRoot.getElementById(id);
        }
        return null;
    }

    private navigateTo(id: string) {
        // Suppress scroll spy so it doesn't override the clicked target
        // during the smooth scroll animation
        this.suppressScrollSpy();
        this.activeId = id;

        const el = this.findElement(id);
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth';

        const details = el.closest('sl-details') as any;
        if (details && !details.open) {
            details.addEventListener('sl-after-show', () => {
                el.scrollIntoView({behavior, block: 'center'});
            }, {once: true});
            details.open = true;
        } else {
            el.scrollIntoView({behavior, block: 'center'});
        }
    }

    private toggleCollapsed() {
        this.collapsed = !this.collapsed;
        localStorage.setItem(COLLAPSED_KEY, String(this.collapsed));
    }

    private statusColorClass(label: string): string {
        const code = label.substring(0, 1);
        if (code === '2') return 'status-2xx';
        if (code === '3') return 'status-3xx';
        if (code === '4') return 'status-4xx';
        if (code === '5') return 'status-5xx';
        return '';
    }

    render() {
        return html`
            <nav aria-label="Page sections">
                <div class="nav-header" @click=${this.toggleCollapsed}
                     aria-expanded=${!this.collapsed}>
                    <span class="nav-title">${this.pageTitle}</span>
                    <sl-icon name=${this.collapsed ? 'chevron-right' : 'chevron-down'}></sl-icon>
                </div>
                ${this.collapsed ? nothing : html`
                    <ul class="nav-sections">
                        ${this.sections.map(s => html`
                            <li>
                                <a href="#${s.id}"
                                   class=${s.id === this.activeId ? 'active' : ''}
                                   aria-current=${s.id === this.activeId ? 'true' : nothing}
                                   @click=${(e: Event) => { e.preventDefault(); this.navigateTo(s.id); }}>
                                    ${s.label}
                                </a>
                                ${s.children?.length ? html`
                                    <ul class="nav-children">
                                        ${s.children.map(c => html`
                                            <li>
                                                <sl-icon name="chevron-right"></sl-icon>
                                                <a href="#${c.id}"
                                                   class="${c.id === this.activeId ? 'active' : ''} ${this.statusColorClass(c.label)}"
                                                   @click=${(e: Event) => { e.preventDefault(); this.navigateTo(c.id); }}>
                                                    ${c.label}
                                                </a>
                                            </li>
                                        `)}
                                    </ul>
                                ` : nothing}
                            </li>
                        `)}
                    </ul>
                `}
            </nav>
        `;
    }
}
