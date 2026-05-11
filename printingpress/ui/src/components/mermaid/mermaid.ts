import {LitElement, html, nothing} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import '@pb33f/cowboy-components/components/mermaid/mermaid-renderer.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import type {MermaidRenderer} from '@pb33f/cowboy-components/components/mermaid/mermaid-renderer.js';
import '../shared/code-viewer.js';
import styles from '../class-diagram/class-diagram.css.js';

const sourceCollapsedKey = 'pp-inline-mermaid-source-collapsed';
const diagramHiddenKey = 'pp-inline-mermaid-hidden';

type DialogElement = HTMLElement & {
    label: string;
    show: () => void | Promise<void>;
};

@customElement('pp-mermaid')
export class PpMermaid extends LitElement {
    static styles = styles;

    @property({attribute: false}) diagram = '';
    @state() private rendererDiagram = '';
    @state() wide = false;
    @state() private renderFailed = false;
    @state() private sourceCollapsed = localStorage.getItem(sourceCollapsedKey) === 'true';
    @state() private diagramHidden = localStorage.getItem(diagramHiddenKey) === 'true';

    @query('pb33f-mermaid-renderer')
    renderer!: MermaidRenderer;

    private resizeObserver: ResizeObserver | null = null;
    private embeddedDataObserver: MutationObserver | null = null;
    private expandedDialog: HTMLElement | null = null;
    private renderCheckInterval = 0;
    private renderScheduleHandle = 0;

    private hydrateEmbeddedData() {
        const scriptEl = this.querySelector<HTMLScriptElement>('script.pp-mermaid-data');
        const diagram = this.readEmbeddedDiagram(scriptEl);
        if (diagram === this.diagram) return;
        this.diagram = diagram;
        this.setRenderFailed(false);
        this.setRendered(false);
        this.scheduleRenderer();
    }

    private readEmbeddedDiagram(scriptEl: HTMLScriptElement | null): string {
        if (!scriptEl) return '';
        const text = scriptEl.textContent || '';
        if (scriptEl.type === 'application/json') {
            try {
                const parsed = JSON.parse(text);
                return typeof parsed === 'string' ? parsed : '';
            } catch {
                return '';
            }
        }
        return text.replaceAll('<\\/', '</');
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.hydrateEmbeddedData();
            this.wide = this.offsetWidth >= 900;

            this.embeddedDataObserver = new MutationObserver(() => {
                this.hydrateEmbeddedData();
            });
            this.embeddedDataObserver.observe(this, {childList: true});

            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    this.wide = entry.contentRect.width >= 900;
                }
                this.scheduleRenderer();
            });
            this.resizeObserver.observe(this);
            this.scheduleRenderer();
        }, 0);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.clearRendererPolling();
        this.clearScheduledRender();
        this.embeddedDataObserver?.disconnect();
        this.embeddedDataObserver = null;
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.expandedDialog?.remove();
        this.expandedDialog = null;
    }

    updated(changed: Map<string, unknown>) {
        if (changed.has('diagram')) {
            this.setRenderFailed(false);
            this.setRendered(false);
            this.rendererDiagram = '';
            this.scheduleRenderer();
        }
        if ((changed.has('diagram') || changed.has('wide') || changed.has('diagramHidden')) &&
            this.diagram && !this.diagramHidden && !this.renderFailed) {
            this.scheduleRenderer();
        }
        if (changed.has('rendererDiagram') && this.rendererDiagram && this.renderer && !this.renderFailed) {
            this.watchRenderer(this.renderer);
        }
    }

    private setRenderFailed(failed: boolean) {
        this.renderFailed = failed;
        this.toggleAttribute('data-render-failed', failed);
        if (failed) {
            this.setRendered(false);
        }
    }

    private setRendered(rendered: boolean) {
        this.toggleAttribute('data-rendered', rendered);
    }

    private clearRendererPolling() {
        clearInterval(this.renderCheckInterval);
        this.renderCheckInterval = 0;
    }

    private clearScheduledRender() {
        clearTimeout(this.renderScheduleHandle);
        this.renderScheduleHandle = 0;
    }

    private canRenderDiagram(): boolean {
        if (!this.isConnected) return false;
        const style = getComputedStyle(this);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = this.getBoundingClientRect();
        return rect.width > 0 && this.getClientRects().length > 0;
    }

    private scheduleRenderer() {
        this.clearScheduledRender();
        if (!this.diagram || this.diagramHidden) {
            this.clearRendererPolling();
            this.rendererDiagram = '';
            this.setRendered(false);
            return;
        }
        if (this.renderFailed) {
            this.rendererDiagram = '';
            this.setRendered(false);
            return;
        }

        let attempts = 0;
        const tryRender = () => {
            if (!this.diagram || this.diagramHidden || this.renderFailed) return;
            if (this.canRenderDiagram()) {
                if (this.rendererDiagram !== this.diagram) {
                    this.rendererDiagram = this.diagram;
                }
                return;
            }
            if (attempts > 120) {
                this.renderScheduleHandle = window.setTimeout(() => requestAnimationFrame(tryRender), 500);
                return;
            }
            attempts += 1;
            this.renderScheduleHandle = window.setTimeout(() => requestAnimationFrame(tryRender), 50);
        };
        this.renderScheduleHandle = window.setTimeout(() => requestAnimationFrame(tryRender), 0);
    }

    private watchRenderer(renderer: MermaidRenderer) {
        this.clearRendererPolling();
        let attempts = 0;
        this.renderCheckInterval = window.setInterval(() => {
            if (!this.isConnected || this.diagramHidden || renderer !== this.renderer || !this.rendererDiagram) {
                this.clearRendererPolling();
                return;
            }
            attempts += 1;
            const root = renderer.shadowRoot;
            const hasError = !!root?.querySelector('.error');
            const hasSVG = !!root?.querySelector('svg');
            if (hasError) {
                this.clearRendererPolling();
                this.setRenderFailed(true);
                return;
            }
            if (hasSVG) {
                this.clearRendererPolling();
                this.setRendered(true);
                this.setRenderFailed(false);
                return;
            }
            if (attempts > 150) {
                this.clearRendererPolling();
                this.setRenderFailed(true);
            }
        }, 40);
    }

    private toggleSource() {
        this.sourceCollapsed = !this.sourceCollapsed;
        localStorage.setItem(sourceCollapsedKey, String(this.sourceCollapsed));
    }

    private toggleDiagram() {
        this.diagramHidden = !this.diagramHidden;
        localStorage.setItem(diagramHiddenKey, String(this.diagramHidden));
        this.clearScheduledRender();
        this.clearRendererPolling();
        this.setRenderFailed(false);
        if (this.diagramHidden) {
            this.rendererDiagram = '';
            this.setRendered(false);
        } else {
            this.scheduleRenderer();
        }
    }

    private copySource() {
        void navigator.clipboard?.writeText(this.diagram);
    }

    zoomIn() { this.renderer?.zoomIn(); }
    zoomOut() { this.renderer?.zoomOut(); }

    openExpanded() {
        if (this.expandedDialog) {
            this.expandedDialog.remove();
        }

        const dialog = document.createElement('sl-dialog') as DialogElement;
        dialog.label = 'DIAGRAM';
        dialog.classList.add('pp-expanded-diagram-dialog');
        this.expandedDialog = dialog;

        const toolbar = document.createElement('div');
        toolbar.className = 'expanded-toolbar';

        const wrapTooltip = (el: HTMLElement, tip: string) => {
            const tooltip = document.createElement('sl-tooltip');
            tooltip.setAttribute('content', tip);
            tooltip.appendChild(el);
            return tooltip;
        };
        const makeIconBtn = (name: string, label: string, tip: string, handler: () => void) => {
            const btn = document.createElement('sl-icon-button');
            btn.setAttribute('name', name);
            btn.setAttribute('label', label);
            btn.addEventListener('click', handler);
            return wrapTooltip(btn, tip);
        };

        const mermaidRenderer = document.createElement('pb33f-mermaid-renderer') as MermaidRenderer;
        mermaidRenderer.diagram = this.diagram;
        mermaidRenderer.setAttribute('fit-width', '');

        toolbar.appendChild(makeIconBtn('zoom-in', 'Zoom In', 'zoom in', () => mermaidRenderer.zoomIn()));
        toolbar.appendChild(makeIconBtn('zoom-out', 'Zoom Out', 'zoom out', () => mermaidRenderer.zoomOut()));

        const diagramArea = document.createElement('div');
        diagramArea.className = 'expanded-diagram-area';
        diagramArea.appendChild(mermaidRenderer);

        dialog.appendChild(toolbar);
        dialog.appendChild(diagramArea);
        dialog.addEventListener('sl-hide', (event: Event) => {
            if (event.target !== dialog) return;
            document.body.classList.remove('pp-dialog-open');
            this.expandedDialog?.remove();
            this.expandedDialog = null;
        });

        document.body.classList.add('pp-dialog-open');
        document.body.appendChild(dialog);
        requestAnimationFrame(() => void dialog.show());
    }

    renderToolbar() {
        return html`
            <div class="toolbar">
                <sl-tooltip content=${this.diagramHidden ? 'show diagram' : 'hide diagram'}>
                    <sl-icon-button name=${this.diagramHidden ? 'eye-slash' : 'eye'}
                        label=${this.diagramHidden ? 'Show Diagram' : 'Hide Diagram'}
                        class=${this.diagramHidden ? 'hide-toggle hidden' : 'hide-toggle'}
                        @click=${this.toggleDiagram}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="zoom in">
                    <sl-icon-button name="zoom-in" label="Zoom In"
                        @click=${this.zoomIn}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="zoom out">
                    <sl-icon-button name="zoom-out" label="Zoom Out"
                        @click=${this.zoomOut}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="expand fullscreen">
                    <sl-icon-button name="arrows-fullscreen" label="Expand"
                        @click=${this.openExpanded}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="copy mermaid source to clipboard">
                    <sl-icon-button name="copy" label="Copy Mermaid source to clipboard"
                        @click=${this.copySource}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content=${this.sourceCollapsed ? 'show source' : 'hide source'}>
                    <sl-icon-button name="braces" label=${this.sourceCollapsed ? 'Show Source' : 'Hide Source'}
                        @click=${this.toggleSource}></sl-icon-button>
                </sl-tooltip>
            </div>
        `;
    }

    renderCode() {
        return html`<pp-code-viewer .code=${this.diagram} language="mermaid" embedded></pp-code-viewer>`;
    }

    renderWide() {
        if (this.sourceCollapsed) {
            return html`
                <div class="diagram-wrapper">
                    <h2>DIAGRAM</h2>
                    ${this.renderToolbar()}
                    <div class="diagram-full">
                        <pb33f-mermaid-renderer .diagram=${this.rendererDiagram} fit-width></pb33f-mermaid-renderer>
                        <div class="collapse-tab" @click=${this.toggleSource}
                            role="button" tabindex="0"
                            @keydown=${(event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') this.toggleSource(); }}>
                            <sl-icon name="chevron-left"></sl-icon>
                        </div>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="diagram-wrapper">
                <h2>DIAGRAM</h2>
                ${this.renderToolbar()}
                <sl-split-panel class="diagram-split" position="60">
                    <div slot="start" class="diagram-view">
                        <pb33f-mermaid-renderer .diagram=${this.rendererDiagram} fit-width></pb33f-mermaid-renderer>
                    </div>
                    <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                    <div slot="end" class="code-view">
                        <div class="code-header">
                            MERMAID SOURCE
                            <sl-tooltip class="copy-source-btn" content="copy mermaid source to clipboard">
                                <sl-icon-button name="copy" label="Copy Mermaid source to clipboard"
                                    @click=${this.copySource}></sl-icon-button>
                            </sl-tooltip>
                            <sl-icon-button name="chevron-right" label="Collapse source"
                                class="collapse-btn"
                                @click=${this.toggleSource}></sl-icon-button>
                        </div>
                        <div class="code-content">
                            ${this.renderCode()}
                        </div>
                    </div>
                </sl-split-panel>
            </div>
        `;
    }

    renderNarrow() {
        return html`
            <div class="diagram-wrapper">
                <h2>DIAGRAM</h2>
                <div class="diagram-area">
                    <pb33f-mermaid-renderer .diagram=${this.rendererDiagram} fit-width></pb33f-mermaid-renderer>
                </div>
                ${this.renderToolbar()}
                ${this.sourceCollapsed ? nothing : html`
                    <sl-details class="code-section" summary="Mermaid Source">
                        ${this.renderCode()}
                    </sl-details>
                `}
            </div>
        `;
    }

    renderFallback() {
        return html`
            <div class="diagram-wrapper">
                <h2>DIAGRAM</h2>
                ${this.renderToolbar()}
                <pre class="pp-mermaid-fallback"><code class="language-mermaid">${this.diagram}</code></pre>
            </div>
        `;
    }

    render() {
        if (!this.diagram) return nothing;
        if (this.renderFailed) return this.renderFallback();
        if (this.diagramHidden) {
            return html`
                <div class="diagram-wrapper">
                    <h2>DIAGRAM</h2>
                    ${this.renderToolbar()}
                </div>
            `;
        }
        return this.wide ? this.renderWide() : this.renderNarrow();
    }
}
