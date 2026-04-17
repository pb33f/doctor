import {LitElement, html, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {ExplorerComponent} from '@pb33f/cowboy-components/components/visualizer/explorer.js';
import {ExplorerNodeClicked} from '@pb33f/cowboy-components/events/doctor.js';
import {createElkLayoutWorker} from '../../elk-layout-worker-inline.js';
import {createGraphDependentWorker} from '../../graph-dependent-worker-inline.js';
import {ensureModelGraphVisualization} from '../../utils/model-visualization.js';
import {docHref} from '../../utils/doc-links.js';
import styles from './focused-explorer.css.js';

// Set worker factories before any explorer element is created
ExplorerComponent.elkWorkerFactory = createElkLayoutWorker;
ExplorerComponent.graphDependentWorkerFactory = createGraphDependentWorker;

@customElement('pp-focused-explorer')
export class PpFocusedExplorer extends LitElement {
    static styles = styles;

    @property({attribute: 'node-id'}) nodeId = '';
    @property() name = '';
    @query('pb33f-explorer') private explorer!: ExplorerComponent;
    @query('.explorer-container') private explorerContainer!: HTMLDivElement;
    @state() private graphData: any = null;
    @state() private explorerHidden = localStorage.getItem('pp-explorer-hidden') === 'true';

    private _readyPoll = 0;
    private _readyTimeout = 0;
    private expandedDialog: HTMLElement | null = null;
    private _initializedExplorer: ExplorerComponent | null = null;
    private _fitRaf = 0;
    private _visibilityResizeObserver: ResizeObserver | null = null;
    private _tabShowHandler: ((event: Event) => void) | null = null;
    private embeddedDataObserver: MutationObserver | null = null;
    private visualizationLoaded = false;
    private readonly _handleExplorerNodeClick = (event: Event) => {
        const detail = (event as CustomEvent<{nodeId?: string}>).detail;
        const nodeId = detail?.nodeId;
        if (!nodeId) return;
        const href = this.graphData?.nodes?.find((node: any) => node?.id === nodeId)?.href;
        if (!href) return;
        window.location.href = docHref(href);
    };

    private hydrateEmbeddedData() {
        const scriptEl = this.querySelector('script.pp-graph-data');
        if (!scriptEl?.textContent) {
            this.graphData = null;
            return;
        }
        try {
            this.graphData = JSON.parse(scriptEl.textContent.trim());
        } catch {
            this.graphData = null;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.embeddedDataObserver = new MutationObserver(() => {
                this.hydrateEmbeddedData();
            });
            this.embeddedDataObserver.observe(this, {childList: true});
            if (!this.closest('sl-tab-group')) {
                void this.loadVisualizationData();
            }
        }, 0);
        this._setupVisibilityHooks();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._readyPoll);
        clearTimeout(this._readyTimeout);
        cancelAnimationFrame(this._fitRaf);
        this.embeddedDataObserver?.disconnect();
        this.embeddedDataObserver = null;
        this._visibilityResizeObserver?.disconnect();
        this._visibilityResizeObserver = null;
        if (this._tabShowHandler) {
            this.closest('sl-tab-group')?.removeEventListener('sl-tab-show', this._tabShowHandler);
            this._tabShowHandler = null;
        }
        this.expandedDialog?.remove();
        this.expandedDialog = null;
    }

    updated(changed: Map<string, unknown>) {
        if (changed.has('graphData') && this.graphData) {
            this._ensureExplorerReady();
        }
        if (changed.has('explorerHidden') && !this.explorerHidden && this.graphData) {
            this._ensureExplorerReady();
        }
    }

    private _setupVisibilityHooks() {
        if (!this._visibilityResizeObserver) {
            this._visibilityResizeObserver = new ResizeObserver(() => {
                if (!this.graphData || this.explorerHidden) return;
                this._scheduleViewportRefresh();
            });
            this._visibilityResizeObserver.observe(this);
        }

        if (!this._tabShowHandler) {
            const panel = this.closest('sl-tab-panel');
            const panelName = panel?.getAttribute('name');
            this._tabShowHandler = (event: Event) => {
                const detail = (event as CustomEvent<{ name?: string }>).detail;
                if (!panelName || detail?.name !== panelName) return;
                void this.loadVisualizationData().then(() => {
                    this._ensureExplorerReady();
                    this._scheduleViewportRefresh();
                });
            };
            this.closest('sl-tab-group')?.addEventListener('sl-tab-show', this._tabShowHandler);
        }
    }

    private async loadVisualizationData() {
        if (this.visualizationLoaded) return;
        this.visualizationLoaded = await ensureModelGraphVisualization('pp-model-explorer');
        if (this.visualizationLoaded) {
            this.hydrateEmbeddedData();
        }
    }

    private _scheduleViewportRefresh() {
        cancelAnimationFrame(this._fitRaf);
        this._fitRaf = requestAnimationFrame(() => {
            if (!this.graphData || this.explorerHidden) return;
            const explorerAny = this.explorer as any;
            if (!this.explorer || !explorerAny?.ready) return;
            void this._applyInitialViewport();
        });
    }

    private _cloneGraphData() {
        if (!this.graphData) return null;
        if (typeof structuredClone === 'function') {
            return structuredClone(this.graphData);
        }
        return JSON.parse(JSON.stringify(this.graphData));
    }

    private async _ensureExplorerReady() {
        await this.updateComplete;
        if (!this.explorer || !this.graphData || this.explorerHidden) return;
        await this._initExplorer();
    }

    private _fitGraphToViewport(): boolean {
        const explorer = this.explorer as any;
        const graphNodes = explorer?.graph?.children;
        const svg = explorer?.svgItem as SVGSVGElement | undefined;
        if (!svg || !graphNodes?.length) return false;

        const visibleNodes = graphNodes.filter((node: any) =>
            node &&
            node.id !== 'root' &&
            node.x !== undefined &&
            node.y !== undefined &&
            !node.filtered
        );
        if (!visibleNodes.length) return false;

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (const node of visibleNodes) {
            const width = node.width || 0;
            const height = node.height || 0;
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + width);
            maxY = Math.max(maxY, node.y + height);
        }

        const containerRect = this.explorerContainer?.getBoundingClientRect();
        const viewportWidth = containerRect?.width || this.explorer.getBoundingClientRect().width;
        const viewportHeight = containerRect?.height || this.explorer.getBoundingClientRect().height;
        if (!viewportWidth || !viewportHeight) return false;

        const boundsWidth = Math.max(1, maxX - minX);
        const boundsHeight = Math.max(1, maxY - minY);
        const padding = Math.max(80, Math.min(180, Math.max(boundsWidth, boundsHeight) * 0.12));

        let viewBoxWidth = boundsWidth + padding * 2;
        let viewBoxHeight = boundsHeight + padding * 2;
        const aspectRatio = viewportWidth / viewportHeight;
        const graphRatio = viewBoxWidth / viewBoxHeight;

        if (graphRatio > aspectRatio) {
            viewBoxHeight = viewBoxWidth / aspectRatio;
        } else {
            viewBoxWidth = viewBoxHeight * aspectRatio;
        }

        let centerX = minX + boundsWidth / 2;
        let centerY = minY + boundsHeight / 2;

        const maxInitialDimension = typeof explorer?.zoomMax === 'number'
            ? explorer.zoomMax * 0.9
            : Number.POSITIVE_INFINITY;
        if (Number.isFinite(maxInitialDimension)) {
            const dominantDimension = Math.max(viewBoxWidth, viewBoxHeight);
            if (dominantDimension > maxInitialDimension) {
                const scale = maxInitialDimension / dominantDimension;
                viewBoxWidth *= scale;
                viewBoxHeight *= scale;

                const focusNode = visibleNodes.find((node: any) => node.id === this.nodeId);
                if (focusNode) {
                    centerX = focusNode.x + (focusNode.width || 0) / 2;
                    centerY = focusNode.y + (focusNode.height || 0) / 2;
                }
            }
        }

        const viewBoxX = centerX - viewBoxWidth / 2;
        const viewBoxY = centerY - viewBoxHeight / 2;

        svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
        explorer.zoomX = viewBoxX;
        explorer.zoomY = viewBoxY;
        explorer.zoomW = viewBoxWidth;
        explorer.zoomH = viewBoxHeight;
        explorer.requestUpdate();
        return true;
    }

    private async _initExplorer() {
        if (!this.graphData) return;

        await this.updateComplete;
        if (!this.explorer) return;
        if (this._initializedExplorer === this.explorer) {
            return;
        }

        this.explorer.embeddedMode = true;
        this.explorer.renderEqualizer = false;
        this.explorer.hideExamples = true;

        if (this.nodeId) {
            this.explorer.povMode = true;
            this.explorer.povNodeId = this.nodeId;
            this.explorer.disablePovMode = false;
        }

        this.explorer.hideControls = true;
        const graphData = this._cloneGraphData();
        if (!graphData) return;
        this.explorer.updateGraphResponse(graphData);
        this._initializedExplorer = this.explorer;

        if (this.nodeId) {
            clearInterval(this._readyPoll);
            clearTimeout(this._readyTimeout);
            this._readyPoll = window.setInterval(() => {
                if ((this.explorer as any).ready) {
                    clearInterval(this._readyPoll);
                    this._applyInitialViewport();
                }
            }, 20);
            this._readyTimeout = window.setTimeout(() => clearInterval(this._readyPoll), 3000);
        }
    }

    private async _applyInitialViewport() {
        for (let attempt = 0; attempt < 12; attempt++) {
            await this.explorer.updateComplete;
            await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
            if (this._fitGraphToViewport()) return;
        }

        const targetNode = this.graphData.nodes?.find(
            (n: any) => n.id === this.nodeId
        );
        if (targetNode) {
            this.explorer.moveToNode(targetNode, false, true);
        }
    }

    private toggleExplorer() {
        this.explorerHidden = !this.explorerHidden;
        localStorage.setItem('pp-explorer-hidden', String(this.explorerHidden));
        if (this.explorerHidden) {
            this._initializedExplorer = null;
            return;
        }
        void this._ensureExplorerReady();
    }

    zoomIn() { this.explorer?.zoomIn(); }
    zoomOut() { this.explorer?.zoomOut(); }
    rotate() { this.explorer?.rotate(); }
    resetView() {
        if (!this.explorer || !this.graphData) return;
        (this.explorer as any).direction = 'RIGHT';
        const graphData = this._cloneGraphData();
        if (!graphData) return;
        this.explorer.updateGraphResponse(graphData);
        this._readyPoll = window.setInterval(() => {
            if ((this.explorer as any).ready) {
                clearInterval(this._readyPoll);
                this._applyInitialViewport();
            }
        }, 20);
        this._readyTimeout = window.setTimeout(() => clearInterval(this._readyPoll), 3000);
    }

    openExpanded() {
        if (this.expandedDialog) {
            this.expandedDialog.remove();
        }

        const dialog = document.createElement('sl-dialog');
        dialog.label = 'DEPENDENCY EXPLORER';
        if (this.name) {
            dialog.addEventListener('sl-after-show', () => {
                const titleEl = dialog.shadowRoot?.querySelector('[part="title"]');
                if (titleEl) {
                    titleEl.textContent = 'DEPENDENCY EXPLORER: ';
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
        const makeIconBtn = (iconName: string, label: string, tip: string, handler: () => void) => {
            const btn = document.createElement('sl-icon-button');
            btn.setAttribute('name', iconName);
            btn.setAttribute('label', label);
            btn.addEventListener('click', handler);
            return wrapTooltip(btn, tip);
        };
        const modalExplorer = document.createElement('pb33f-explorer') as ExplorerComponent;
        modalExplorer.embeddedMode = true;
        modalExplorer.renderEqualizer = false;
        modalExplorer.hideExamples = true;
        modalExplorer.hideControls = true;
        modalExplorer.addEventListener(ExplorerNodeClicked, this._handleExplorerNodeClick as EventListener);
        if (this.nodeId) {
            modalExplorer.povMode = true;
            modalExplorer.povNodeId = this.nodeId;
            modalExplorer.disablePovMode = false;
        }

        toolbar.appendChild(makeIconBtn('zoom-in', 'Zoom In', 'zoom in', () => modalExplorer.zoomIn()));
        toolbar.appendChild(makeIconBtn('zoom-out', 'Zoom Out', 'zoom out', () => modalExplorer.zoomOut()));
        toolbar.appendChild(makeIconBtn('arrow-clockwise', 'Rotate', 'rotate layout', () => modalExplorer.rotate()));
        toolbar.appendChild(makeIconBtn('x-diamond', 'Reset View', 'reset view', () => {
            (modalExplorer as any).direction = 'RIGHT';
            const graphData = this._cloneGraphData();
            if (!graphData) return;
            modalExplorer.updateGraphResponse(graphData);
        }));
        const diagramArea = document.createElement('div');
        diagramArea.className = 'expanded-diagram-area';
        diagramArea.appendChild(modalExplorer);

        dialog.appendChild(toolbar);
        dialog.appendChild(diagramArea);

        // Load graph data into modal explorer after it's in the DOM
        dialog.addEventListener('sl-after-show', () => {
            const graphData = this._cloneGraphData();
            if (!graphData) return;
            modalExplorer.updateGraphResponse(graphData);
        });

        dialog.addEventListener('sl-hide', (e: Event) => {
            if (e.target !== dialog) return;
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
                <sl-tooltip content=${this.explorerHidden ? 'show explorer' : 'hide explorer'}>
                    <sl-icon-button name=${this.explorerHidden ? 'eye-slash' : 'eye'}
                        label=${this.explorerHidden ? 'Show Explorer' : 'Hide Explorer'}
                        class=${this.explorerHidden ? 'hide-toggle hidden' : 'hide-toggle'}
                        @click=${this.toggleExplorer}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="zoom in">
                    <sl-icon-button name="zoom-in" label="Zoom In"
                        @click=${this.zoomIn}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="zoom out">
                    <sl-icon-button name="zoom-out" label="Zoom Out"
                        @click=${this.zoomOut}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="rotate layout">
                    <sl-icon-button name="arrow-clockwise" label="Rotate"
                        @click=${this.rotate}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="reset view">
                    <sl-icon-button name="x-diamond" label="Reset View"
                        @click=${this.resetView}></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="expand fullscreen">
                    <sl-icon-button name="arrows-fullscreen" label="Expand"
                        @click=${this.openExpanded}></sl-icon-button>
                </sl-tooltip>
            </div>
        `;
    }

    render() {
        if (!this.graphData) return nothing;
        if (this.explorerHidden) {
            return html`
                <div class="explorer-wrapper">
                    <h2>DEPENDENCY EXPLORER</h2>
                    ${this.renderToolbar()}
                </div>
            `;
        }
        return html`
            <div class="explorer-wrapper">
                <h2>DEPENDENCY EXPLORER</h2>
                ${this.renderToolbar()}
                <div class="explorer-container">
                    <pb33f-explorer @explorerNodeClicked=${this._handleExplorerNodeClick}></pb33f-explorer>
                </div>
            </div>
        `;
    }
}
