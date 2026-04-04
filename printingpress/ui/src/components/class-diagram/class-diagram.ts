import {LitElement, html, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import '@pb33f/cowboy-components/components/mermaid/mermaid-renderer.js';
import type {MermaidRenderer} from '@pb33f/cowboy-components/components/mermaid/mermaid-renderer.js';
import styles from './class-diagram.css.js';

@customElement('pp-class-diagram')
export class PpClassDiagram extends LitElement {
    static styles = styles;

    @property() name = '';
    @property({attribute: false}) diagram = '';
    @property({attribute: false}) highlightedHTML = '';
    @state() wide = false;
    @state() private sourceCollapsed = localStorage.getItem('pp-mermaid-source-collapsed') === 'true';
    @state() private diagramHidden = localStorage.getItem('pp-diagram-hidden') === 'true';

    @query('pb33f-mermaid-renderer')
    renderer!: MermaidRenderer;

    private resizeObserver: ResizeObserver | null = null;
    private expandedDialog: HTMLElement | null = null;

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            const scriptEl = this.querySelector('script.pp-mermaid-data');
            if (scriptEl?.textContent) {
                this.diagram = scriptEl.textContent.trim();
            }
            const highlightEl = this.querySelector('template.pp-mermaid-highlighted') as HTMLTemplateElement;
            if (highlightEl?.content) {
                const div = document.createElement('div');
                div.appendChild(highlightEl.content.cloneNode(true));
                this.highlightedHTML = div.innerHTML;
            }
            this.wide = this.offsetWidth >= 900;
            this.requestUpdate();

            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    this.wide = entry.contentRect.width >= 900;
                }
            });
            this.resizeObserver.observe(this);
        }, 0);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._zoomCheckInterval);
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.expandedDialog?.remove();
        this.expandedDialog = null;
    }

    exportSVG() {
        const svg = this.renderer?.exportSVG();
        if (!svg) return;
        this.downloadFile(svg, 'image/svg+xml', 'class-diagram.svg');
    }

    async exportPNG(renderer?: MermaidRenderer) {
        const r = renderer || this.renderer;
        const blob = await r?.exportPNG();
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'class-diagram.png';
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadFile(content: string, type: string, filename: string) {
        const blob = new Blob([content], {type});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    private _initialZoomDone = false;
    private _zoomCheckInterval = 0;

    updated(changed: Map<string, unknown>) {
        if ((changed.has('diagram') || changed.has('wide')) && !this._initialZoomDone && this.renderer && this.diagram) {
            this._initialZoomDone = true;
            this._zoomCheckInterval = this.pollRendererThenZoom(this.renderer, 2);
        }
    }

    // polls until the renderer's viewBox stabilizes after async mermaid render,
    // then zooms in the specified number of notches. returns the interval id.
    private pollRendererThenZoom(renderer: MermaidRenderer, zoomCount: number): number {
        let attempts = 0;
        const id = window.setInterval(() => {
            if (++attempts > 150) {
                clearInterval(id);
                return;
            }
            const r = renderer as any;
            if (!r?._svgElement) return;
            const svg = r._svgElement as SVGSVGElement;
            const viewBox = svg.viewBox?.baseVal;
            const zoomW = r.zoomW;
            if (viewBox && zoomW && Math.abs(viewBox.width - zoomW) < 1) {
                clearInterval(id);
                for (let i = 0; i < zoomCount; i++) r.zoomIn();
            }
        }, 20);
        return id;
    }

    private toggleSource() {
        this.sourceCollapsed = !this.sourceCollapsed;
        localStorage.setItem('pp-mermaid-source-collapsed', String(this.sourceCollapsed));
    }

    private toggleDiagram() {
        this.diagramHidden = !this.diagramHidden;
        localStorage.setItem('pp-diagram-hidden', String(this.diagramHidden));
        if (!this.diagramHidden) {
            this._initialZoomDone = false;
        }
    }

    zoomIn() { this.renderer?.zoomIn(); }
    zoomOut() { this.renderer?.zoomOut(); }
    resetZoom() { this.renderer?.resetZoom(); }

    openExpanded() {
        // create dialog in document.body to escape all stacking contexts
        if (this.expandedDialog) {
            this.expandedDialog.remove();
        }

        const dialog = document.createElement('sl-dialog');
        dialog.label = 'CLASS DIAGRAM';
        if (this.name) {
            // sl-dialog doesn't support rich title content, so we set it after render
            dialog.addEventListener('sl-after-show', () => {
                const titleEl = dialog.shadowRoot?.querySelector('[part="title"]');
                if (titleEl) {
                    titleEl.textContent = 'CLASS DIAGRAM: ';
                    const span = document.createElement('span');
                    span.style.color = 'var(--primary-color)';
                    span.style.textTransform = 'none';
                    span.textContent = this.name;
                    titleEl.appendChild(span);
                }
            });
        }
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
        const makeTextBtn = (text: string, iconName: string, tip: string, handler: () => void) => {
            const btn = document.createElement('sl-button');
            btn.setAttribute('size', 'small');
            btn.setAttribute('variant', 'text');
            btn.textContent = text;
            const icon = document.createElement('sl-icon');
            icon.setAttribute('name', iconName);
            icon.setAttribute('slot', 'suffix');
            btn.appendChild(icon);
            btn.addEventListener('click', handler);
            return wrapTooltip(btn, tip);
        };

        const mermaidRenderer = document.createElement('pb33f-mermaid-renderer') as MermaidRenderer;
        mermaidRenderer.diagram = this.diagram;
        mermaidRenderer.setAttribute('fit-width', '');

        toolbar.appendChild(makeIconBtn('zoom-in', 'Zoom In', 'zoom in', () => mermaidRenderer.zoomIn()));
        toolbar.appendChild(makeIconBtn('zoom-out', 'Zoom Out', 'zoom out', () => mermaidRenderer.zoomOut()));
        toolbar.appendChild(makeTextBtn('SVG', 'image-alt', 'export as SVG', () => {
            const svg = mermaidRenderer.exportSVG();
            if (svg) this.downloadFile(svg, 'image/svg+xml', 'class-diagram.svg');
        }));
        toolbar.appendChild(makeTextBtn('PNG', 'image', 'export as PNG', () => this.exportPNG(mermaidRenderer)));

        const diagramArea = document.createElement('div');
        diagramArea.className = 'expanded-diagram-area';
        diagramArea.appendChild(mermaidRenderer);

        dialog.appendChild(toolbar);
        dialog.appendChild(diagramArea);

        const modalZoomInterval = this.pollRendererThenZoom(mermaidRenderer, 3);

        dialog.addEventListener('sl-hide', (e: Event) => {
            if (e.target !== dialog) return;
            clearInterval(modalZoomInterval);
            document.body.classList.remove('pp-dialog-open');
            this.expandedDialog?.remove();
            this.expandedDialog = null;
        });

        document.body.classList.add('pp-dialog-open');
        document.body.appendChild(dialog);
        requestAnimationFrame(() => (dialog as any).show());
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
                <sl-tooltip content="export as SVG">
                    <sl-button size="small" variant="text" @click=${this.exportSVG}>
                        <sl-icon name="image-alt" slot="suffix"></sl-icon>
                        SVG
                    </sl-button>
                </sl-tooltip>
                <sl-tooltip content="export as PNG">
                    <sl-button size="small" variant="text" @click=${this.exportPNG}>
                        <sl-icon name="image" slot="suffix"></sl-icon>
                        PNG
                    </sl-button>
                </sl-tooltip>
            </div>
        `;
    }

    renderCode() {
        if (this.highlightedHTML) {
            return html`<pre class="chroma"><code>${unsafeHTML(this.highlightedHTML)}</code></pre>`;
        }
        return html`<pre><code>${this.diagram}</code></pre>`;
    }

    renderWide() {
        if (this.sourceCollapsed) {
            return html`
                <div class="diagram-wrapper">
                    <h2>CLASS DIAGRAM</h2>
                    ${this.renderToolbar()}
                    <div class="diagram-full">
                        <pb33f-mermaid-renderer
                            .diagram=${this.diagram}
                            fit-width>
                        </pb33f-mermaid-renderer>
                        <div class="collapse-tab" @click=${this.toggleSource}
                            role="button" tabindex="0"
                            @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') this.toggleSource(); }}>
                            <sl-icon name="chevron-left"></sl-icon>
                        </div>
                    </div>
                </div>
            `;
        }
        return html`
            <div class="diagram-wrapper">
                <h2>CLASS DIAGRAM</h2>
                ${this.renderToolbar()}
                <sl-split-panel class="diagram-split" position="60">
                    <div slot="start" class="diagram-view">
                        <pb33f-mermaid-renderer
                            .diagram=${this.diagram}
                            fit-width>
                        </pb33f-mermaid-renderer>
                    </div>
                    <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                    <div slot="end" class="code-view">
                        <div class="code-header">
                            MERMAID SOURCE
                            <sl-tooltip content="copy mermaid source to clipboard">
                                <sl-copy-button .value=${this.diagram} class="copy-source-btn"></sl-copy-button>
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
                <h2>CLASS DIAGRAM</h2>
                <div class="diagram-area">
                    <pb33f-mermaid-renderer
                        .diagram=${this.diagram}
                        fit-width>
                    </pb33f-mermaid-renderer>
                </div>
                ${this.renderToolbar()}
                <sl-details class="code-section" summary="Mermaid Source">
                    ${this.renderCode()}
                </sl-details>
            </div>
        `;
    }

    render() {
        if (!this.diagram) return nothing;
        if (this.diagramHidden) {
            return html`
                <div class="diagram-wrapper">
                    <h2>CLASS DIAGRAM</h2>
                    ${this.renderToolbar()}
                </div>
            `;
        }
        return this.wide ? this.renderWide() : this.renderNarrow();
    }
}
