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

    async exportPNG() {
        const blob = await this.renderer?.exportPNG();
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

    zoomIn() { this.renderer?.zoomIn(); }
    zoomOut() { this.renderer?.zoomOut(); }
    resetZoom() { this.renderer?.resetZoom(); }

    openExpanded() {
        // Create dialog in document.body to escape all stacking contexts
        if (this.expandedDialog) {
            this.expandedDialog.remove();
        }

        const dialog = document.createElement('sl-dialog');
        dialog.label = this.name ? `${this.name} Class Diagram` : 'Class Diagram';
        dialog.classList.add('pp-expanded-diagram-dialog');
        this.expandedDialog = dialog;

        // Inject styles into document head (once)
        if (!document.getElementById('pp-expanded-dialog-styles')) {
            const style = document.createElement('style');
            style.id = 'pp-expanded-dialog-styles';
            style.textContent = `
                body.pp-dialog-open > pp-layout {
                    position: relative;
                    z-index: 0;
                }
                .pp-expanded-diagram-dialog {
                    --width: 90vw;
                    --sl-overlay-background-color: rgba(0, 0, 0, 0.80);
                    z-index: 10000;
                }
                .pp-expanded-diagram-dialog::part(panel) {
                    height: 90vh;
                    max-height: 90vh;
                    background: var(--background-color);
                    border: 1px solid var(--border-color-alpha);
                }
                .pp-expanded-diagram-dialog::part(header) {
                    background: var(--font-color);
                    border-bottom: none;
                    padding: 0.5rem 1rem;
                }
                .pp-expanded-diagram-dialog::part(title) {
                    font-size: 0.9rem;
                    color: var(--background-color);
                }
                .pp-expanded-diagram-dialog::part(close-button__base) {
                    color: var(--background-color);
                }
                .pp-expanded-diagram-dialog::part(body) {
                    padding: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .pp-expanded-diagram-dialog .expanded-toolbar {
                    display: flex;
                    gap: 15px;
                    padding: 0.5rem 1rem;
                    align-items: center;
                    background: var(--background-color);
                    border-bottom: 1px dashed var(--hrcolor);
                }
                .pp-expanded-diagram-dialog .expanded-toolbar sl-icon-button::part(base) {
                    color: var(--font-color-sub1);
                }
                .pp-expanded-diagram-dialog .expanded-toolbar sl-icon-button::part(base):hover {
                    color: var(--primary-color);
                }
                .pp-expanded-diagram-dialog .expanded-toolbar sl-button::part(base) {
                    font-size: 0.8rem;
                    color: var(--font-color-sub1);
                    gap: 0.35rem;
                }
                .pp-expanded-diagram-dialog .expanded-toolbar sl-button::part(label) {
                    padding: 0;
                }
                .pp-expanded-diagram-dialog .expanded-toolbar sl-button::part(base):hover {
                    color: var(--primary-color);
                }
                .pp-expanded-diagram-dialog .expanded-diagram-area {
                    flex: 1;
                    overflow: hidden;
                }
                .pp-expanded-diagram-dialog .expanded-diagram-area pb33f-mermaid-renderer {
                    height: 100%;
                }
            `;
            document.head.appendChild(style);
        }

        // Build toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'expanded-toolbar';

        const makeIconBtn = (name: string, label: string, handler: () => void) => {
            const btn = document.createElement('sl-icon-button');
            btn.setAttribute('name', name);
            btn.setAttribute('label', label);
            btn.addEventListener('click', handler);
            return btn;
        };
        const makeTextBtn = (text: string, iconName: string, handler: () => void) => {
            const btn = document.createElement('sl-button');
            btn.setAttribute('size', 'small');
            btn.setAttribute('variant', 'text');
            btn.textContent = text;
            const icon = document.createElement('sl-icon');
            icon.setAttribute('name', iconName);
            icon.setAttribute('slot', 'suffix');
            btn.appendChild(icon);
            btn.addEventListener('click', handler);
            return btn;
        };

        const mermaidRenderer = document.createElement('pb33f-mermaid-renderer') as MermaidRenderer;
        mermaidRenderer.diagram = this.diagram;
        mermaidRenderer.setAttribute('fit-width', '');

        toolbar.appendChild(makeIconBtn('zoom-in', 'Zoom In', () => mermaidRenderer.zoomIn()));
        toolbar.appendChild(makeIconBtn('zoom-out', 'Zoom Out', () => mermaidRenderer.zoomOut()));
        toolbar.appendChild(makeTextBtn('SVG', 'image-alt', () => {
            const svg = mermaidRenderer.exportSVG();
            if (svg) this.downloadFile(svg, 'image/svg+xml', 'class-diagram.svg');
        }));
        toolbar.appendChild(makeTextBtn('PNG', 'image', async () => {
            const blob = await mermaidRenderer.exportPNG();
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'class-diagram.png';
                a.click();
                URL.revokeObjectURL(url);
            }
        }));

        const diagramArea = document.createElement('div');
        diagramArea.className = 'expanded-diagram-area';
        diagramArea.appendChild(mermaidRenderer);

        dialog.appendChild(toolbar);
        dialog.appendChild(diagramArea);

        dialog.addEventListener('sl-hide', () => {
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
                <sl-icon-button name="zoom-in" label="Zoom In"
                    @click=${this.zoomIn}></sl-icon-button>
                <sl-icon-button name="zoom-out" label="Zoom Out"
                    @click=${this.zoomOut}></sl-icon-button>
                <sl-icon-button name="arrows-fullscreen" label="Expand"
                    @click=${this.openExpanded}></sl-icon-button>
                <sl-button size="small" variant="text" @click=${this.exportSVG}>
                    <sl-icon name="image-alt" slot="suffix"></sl-icon>
                    SVG
                </sl-button>
                <sl-button size="small" variant="text" @click=${this.exportPNG}>
                    <sl-icon name="image" slot="suffix"></sl-icon>
                    PNG
                </sl-button>
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
                        <div class="code-header">Mermaid Source</div>
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
        return this.wide ? this.renderWide() : this.renderNarrow();
    }
}
