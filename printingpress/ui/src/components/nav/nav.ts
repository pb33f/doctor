import {LitElement, html, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import navCss from './nav.css.js';
import tooltipCss from '../../styles/tooltip.css.js';
import {docHref, overviewHref} from '../../utils/doc-links.js';
import type {ViolationCounts} from '../../utils/violations.js';

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
    operationId: string;
    summary: string;
    slug: string;
    deprecated: boolean;
    counts?: ViolationCounts;
}

interface NavModelGroup {
    name: string;
    typeSlug: string;
    models: NavModel[] | null;
    counts?: ViolationCounts;
}

interface NavModel {
    name: string;
    slug: string;
    typeSlug: string;
    counts?: ViolationCounts;
}

@customElement('pp-nav')
export class PpNav extends LitElement {
    static styles = [navCss, tooltipCss];

    @property({attribute: 'data-nav'}) navJson = '';
    @property({attribute: 'data-models'}) modelsJson = '';
    @property({attribute: 'data-webhooks'}) webhooksJson = '';
    @property({attribute: 'data-active'}) activeSlug = '';
    @property({attribute: 'data-docs-expires-at'}) docsExpiresAt = '';
    @property({attribute: 'data-archive-export-url'}) archiveExportUrl = '';
    @state() private tags: NavTag[] = [];
    @state() private modelGroups: NavModelGroup[] = [];
    @state() private webhooks: NavOperation[] = [];
    @state() private expiryTick = 0;
    @state() private hostedArchiveControls = false;
    @state() private archiveFormat: 'zip' | 'tar.gz' = 'zip';
    @state() private includeDiagnostics = false;
    @state() private includeAIDocs = false;
    private archiveExportTargetOrigin = '';
    private expiryTimer?: number;
    private loggedEmptyState = false;
    private loggedContentState = false;
    private readonly hostMessageHandler = (event: MessageEvent) => this.handleHostMessage(event);

    private logPerf(stage: string, detail?: unknown) {
        const logger = (globalThis as Record<string, unknown>).__PP_LOG as ((stage: string, detail?: unknown) => void) | undefined;
        if (typeof logger === 'function') {
            logger(stage, detail);
        }
    }

    private previewHoldEnabled(): boolean {
        return this.getAttribute('data-pp-preview-hold') === 'true';
    }

    private developerMode(): boolean {
        return document.body?.dataset.ppDeveloperMode === 'true';
    }

    private hasHydratedNav(): boolean {
        return this.hasAttribute('data-nav') ||
            this.hasAttribute('data-models') ||
            this.hasAttribute('data-webhooks') ||
            this.hasAttribute('data-pp-nav-cached');
    }

    private hasNavContent(): boolean {
        return this.tags.length > 0 || this.modelGroups.length > 0 || this.webhooks.length > 0;
    }

    private archiveControlsEnabled(): boolean {
        return this.hostedArchiveControls || this.archiveExportUrl.trim() !== '';
    }

    private ensureExpiryTimer() {
        const timestamp = Date.parse(this.docsExpiresAt);
        if (Number.isNaN(timestamp)) {
            this.stopExpiryTimer();
            return;
        }
        if (Date.now() >= timestamp) {
            this.stopExpiryTimer();
            return;
        }
        if (this.expiryTimer === undefined) {
            this.expiryTimer = window.setInterval(() => {
                this.expiryTick++;
                if (Date.now() >= timestamp) {
                    this.stopExpiryTimer();
                }
            }, 1000);
        }
    }

    private stopExpiryTimer() {
        if (this.expiryTimer !== undefined) {
            window.clearInterval(this.expiryTimer);
            this.expiryTimer = undefined;
        }
    }

    private docsExpiryLabel(timestamp: number): TemplateResult {
        this.expiryTick;
        const seconds = Math.floor(Math.max(0, timestamp - Date.now()) / 1000);
        if (seconds <= 0) {
            return html`docs expired!`;
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes >= 2) {
            return html`docs expire in <strong>${minutes}</strong> minutes`;
        }
        if (minutes === 1) {
            return html`docs expire in <strong>under two minutes</strong>`;
        }
        return html`docs expiring in <strong>${seconds} second${seconds !== 1 ? 's' : ''}</strong>`;
    }

    private renderDocsExpiry() {
        const timestamp = Date.parse(this.docsExpiresAt);
        if (Number.isNaN(timestamp)) {
            return nothing;
        }
        const label = this.docsExpiryLabel(timestamp);
        const remaining = timestamp - Date.now();
        const expired = remaining <= 0;
        const critical = !expired && remaining < 60_000;
        return html`
            <div class="docs-expiry ${critical ? 'critical' : ''} ${expired ? 'expired' : ''}" aria-live="polite">${label}</div>`;
    }

    private renderHostedArchiveControls() {
        if (!this.archiveControlsEnabled()) {
            return nothing;
        }
        return html`
            <div class="host-archive-controls" aria-label="Documentation archive export">
                <div class="host-archive-controls-title">export documentation</div>
                <div class="host-archive-control-row">
                    <sl-tooltip
                        class="archive-option-tooltip"
                        content="INCLUDE QUALITY DIAGNOSTICS IN GENERATED DOCS"
                        placement="top">
                        <sl-checkbox
                            ?checked=${this.includeDiagnostics}
                            @sl-change=${this.handleIncludeDiagnosticsChange}>
                            diagnostics?
                        </sl-checkbox>
                    </sl-tooltip>
                    <sl-tooltip
                        class="archive-option-tooltip"
                        content="INCLUDE llms.txt & AGENTIC READY VERSION OF DOCUMENTATION"
                        placement="top">
                        <sl-checkbox
                            ?checked=${this.includeAIDocs}
                            @sl-change=${this.handleIncludeAIDocsChange}>
                            AI docs?
                        </sl-checkbox>
                    </sl-tooltip>
                    <sl-dropdown class="archive-format-dropdown" skidding="0" distance="4" hoist>
                        <sl-button slot="trigger" class="archive-format-trigger" size="small" caret>
                            <sl-icon slot="prefix" name="download"></sl-icon>
                            ${this.archiveFormat}
                        </sl-button>
                        <sl-menu @sl-select=${this.handleArchiveFormatSelect}>
                            <sl-menu-item value="zip" type="checkbox" .checked=${this.archiveFormat === 'zip'}>
                                zip
                            </sl-menu-item>
                            <sl-menu-item value="tar.gz" type="checkbox" .checked=${this.archiveFormat === 'tar.gz'}>
                                tar.gz
                            </sl-menu-item>
                        </sl-menu>
                    </sl-dropdown>
                    <sl-button
                        class="archive-download-button"
                        size="small"
                        @click=${this.requestArchiveExport}
                        aria-label="Download documentation archive">
                        export
                    </sl-button>
                </div>
            </div>
        `;
    }

    private handleArchiveFormatSelect(event: CustomEvent) {
        const value = event.detail?.item?.value;
        if (value === 'zip' || value === 'tar.gz') {
            this.archiveFormat = value;
        }
    }

    private handleIncludeDiagnosticsChange(event: Event) {
        this.includeDiagnostics = Boolean((event.target as HTMLInputElement | null)?.checked);
    }

    private handleIncludeAIDocsChange(event: Event) {
        this.includeAIDocs = Boolean((event.target as HTMLInputElement | null)?.checked);
    }

    private requestArchiveExport() {
        const directExportURL = this.archiveExportUrl.trim();
        if (directExportURL) {
            const url = new URL(directExportURL, window.location.href);
            url.searchParams.set('format', this.archiveFormat);
            if (this.includeDiagnostics) {
                url.searchParams.set('diagnostics', 'true');
            }
            if (this.includeAIDocs) {
                url.searchParams.set('llm', 'true');
            }
            window.location.assign(url.toString());
            return;
        }
        if (!this.hostedArchiveControls || !this.archiveExportTargetOrigin || !window.parent) {
            return;
        }
        window.parent.postMessage({
            type: 'ppress:export',
            format: this.archiveFormat,
            diagnostics: this.includeDiagnostics,
            llm: this.includeAIDocs,
        }, this.archiveExportTargetOrigin);
    }

    private handleHostMessage(event: MessageEvent) {
        if (event.source !== window.parent) {
            return;
        }
        const data = event.data as { type?: string; enabled?: boolean } | null;
        if (!data || typeof data !== 'object' || data.type !== 'doctor:archive-controls') {
            return;
        }
        this.hostedArchiveControls = data.enabled === true;
        this.archiveExportTargetOrigin = this.hostedArchiveControls ? event.origin : '';
    }

    private renderFallbackNav() {
        const operationRows = [100, 92, 84, 78, 88, 74];
        const modelRows = [96, 86, 82, 90, 76, 88, 80, 72];
        return html`
            <div class="pp-nav-fallback" aria-hidden="true">
                ${this.renderHostedArchiveControls()}
                ${this.renderDocsExpiry()}
                <div class="pp-nav-fallback-home">API OVERVIEW</div>
                ${this.developerMode()
                    ? html`<div class="pp-nav-fallback-home diagnostics">DIAGNOSTICS</div>`
                    : nothing}
                <div class="pp-nav-fallback-section">
                    <h4>Operations</h4>
                    <div class="pp-nav-fallback-list">
                        ${operationRows.map((width) => html`
                            <div class="pp-nav-fallback-row" style=${`width:${width}%;`}></div>`)}
                    </div>
                </div>
                <div class="pp-nav-fallback-section">
                    <h4>Models</h4>
                    <div class="pp-nav-fallback-list">
                        ${modelRows.map((width) => html`
                            <div class="pp-nav-fallback-row" style=${`width:${width}%;`}></div>`)}
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('message', this.hostMessageHandler);
        this.ensureExpiryTimer();
        const preview = this.querySelector('.pp-nav-preview');
        this.logPerf('nav:connected', {
            activeSlug: this.activeSlug,
            cached: this.hasAttribute('data-pp-nav-cached'),
            preview: !!preview,
            previewHold: this.previewHoldEnabled(),
        });
    }

    disconnectedCallback() {
        window.removeEventListener('message', this.hostMessageHandler);
        this.stopExpiryTimer();
        super.disconnectedCallback();
    }

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('navJson')) {
            try {
                this.tags = this.navJson ? JSON.parse(this.navJson) || [] : [];
            } catch {
                this.tags = [];
            }
        }
        if (changed.has('modelsJson')) {
            try {
                this.modelGroups = this.modelsJson ? JSON.parse(this.modelsJson) || [] : [];
            } catch {
                this.modelGroups = [];
            }
        }
        if (changed.has('webhooksJson')) {
            try {
                this.webhooks = this.webhooksJson ? JSON.parse(this.webhooksJson) || [] : [];
            } catch {
                this.webhooks = [];
            }
        }
        if (changed.has('docsExpiresAt')) {
            this.ensureExpiryTimer();
        }
    }

    updated() {
        const hasContent = this.tags.length > 0 || this.modelGroups.length > 0 || this.webhooks.length > 0;
        if (!hasContent && !this.loggedEmptyState) {
            this.loggedEmptyState = true;
            this.logPerf('nav:empty-render');
        }
        if (hasContent && !this.loggedContentState) {
            this.loggedContentState = true;
            this.logPerf('nav:content-render', {
                tags: this.tags.length,
                modelGroups: this.modelGroups.length,
                webhooks: this.webhooks.length,
            });
            if (this.previewHoldEnabled()) {
                this.logPerf('nav-preview:hold-active', {source: 'shadow-nav'});
                return;
            }
            const preview = this.querySelector('.pp-nav-preview');
            if (preview) {
                preview.remove();
                this.logPerf('nav-preview:removed', {source: 'shadow-nav'});
            }
        }
    }

    render() {
        if (this.previewHoldEnabled()) {
            return html`
                <slot></slot>`;
        }
        if (!this.hasNavContent() && !this.hasHydratedNav()) {
            return this.renderFallbackNav();
        }
        return html`
            ${this.renderHostedArchiveControls()}
            ${this.renderDocsExpiry()}
            <a class="nav-home ${!this.activeSlug ? 'active' : ''}" href=${overviewHref()}>
                <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
                API OVERVIEW
            </a>
            ${this.developerMode()
                    ? html`
                        <a class="nav-home diagnostics ${this.activeSlug === 'diagnostics' ? 'active' : ''}"
                           href=${docHref('diagnostics.html')}>
                            <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
                            DIAGNOSTICS
                        </a>
                    `
                    : nothing}
            ${this.tags.length
                    ? html`
                        <div class="nav-section nav-operations-section">
                            <h4>Operations</h4>
                            ${this.tags.map((tag) => html`
                                <pp-nav-tag .tag=${tag} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
                        </div>
                    `
                    : nothing}
            ${this.modelGroups.length
                    ? html`
                        <div class="nav-section nav-models-section">
                            <h4>Models</h4>
                            ${this.modelGroups.map((group) => html`
                                <pp-nav-model-group .group=${group}
                                                    .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
                        </div>
                    `
                    : nothing}
            ${this.webhooks.length
                    ? html`
                        <div class="nav-section nav-webhooks-section">
                            <h4>Webhooks</h4>
                            <pp-nav-tag
                                    .tag=${{
                                        name: 'Webhooks',
                                        summary: 'Webhooks',
                                        children: null,
                                        operations: this.webhooks,
                                        isNavOnly: false
                                    } as NavTag}
                                    .activeSlug=${this.activeSlug}
                            ></pp-nav-tag>
                        </div>
                    `
                    : nothing}
        `;
    }
}
