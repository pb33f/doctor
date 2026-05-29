import {LitElement, html, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import refPopoverCss from './ref-popover.css.js';
import {
    getSchemaEntry,
    getSchemaEntryByRef,
    loadSchemaModel,
    loadSchemaModelByRef,
    type CanonicalModelData,
    type RegistryEntry,
} from '../../utils/schema-registry.js';
import './schema-properties.js';
import './code-viewer.js';
import './icon-title.js';

@customElement('pp-ref-popover')
export class PpRefPopover extends LitElement {
    static styles = refPopoverCss;
    private static readonly showDelayMs = 300;
    private static readonly hideDelayMs = 400;
    private static readonly popoverWidthTolerancePx = 2;
    private static readonly maxPopoverMeasureAttempts = 6;

    @property({attribute: 'registry-key'}) registryKey = '';
    @property({attribute: 'schema-ref'}) schemaRef = '';
    @state() private active = false;
    @state() private entry: RegistryEntry | null = null;
    @state() private model: CanonicalModelData | null = null;
    @state() private parsedData: any = null;
    @state() private popoverWidth = 0;

    private showTimeout?: number;
    private hideTimeout?: number;
    private measureFrame?: number;
    private showRequestId = 0;
    private popoverMeasureAttempts = 0;
    @query('.trigger') private trigger!: HTMLElement;
    @query('slot') private triggerSlot!: HTMLSlotElement;
    @query('.pp-ref-popover-content') private popoverContent?: HTMLElement;
    private triggerTargets = new Set<HTMLElement>();
    private pointerWithinTrigger = false;
    private pointerWithinPopup = false;
    private focusWithinPopup = false;

    private readonly onTriggerEnter = () => {
        this.pointerWithinTrigger = true;
        this.show();
    };

    private readonly onTriggerLeave = (event: Event) => {
        this.pointerWithinTrigger = false;
        const next = (event as MouseEvent | FocusEvent).relatedTarget as Node | null;
        if (this.containsInteractiveNode(next)) {
            return;
        }
        this.scheduleHide();
    };

    private readonly onSlotChange = () => {
        this.syncTriggerTargets();
    };

    private readonly onPopupEnter = () => {
        this.pointerWithinPopup = true;
        this.cancelHide();
    };

    private readonly onPopupLeave = (event: Event) => {
        this.pointerWithinPopup = false;
        const next = (event as MouseEvent | FocusEvent).relatedTarget as Node | null;
        if (this.containsInteractiveNode(next)) {
            return;
        }
        this.scheduleHide();
    };

    private readonly onPopupFocusIn = () => {
        this.focusWithinPopup = true;
        this.cancelHide();
    };

    private readonly onPopupFocusOut = (event: Event) => {
        const next = (event as FocusEvent).relatedTarget as Node | null;
        if (this.containsInteractiveNode(next)) {
            return;
        }
        this.focusWithinPopup = false;
        this.scheduleHide();
    };

    private readonly onPopupInteraction = () => {
        this.pointerWithinPopup = true;
        this.cancelHide();
    };

    firstUpdated() {
        this.syncTriggerTargets();
        this.triggerSlot?.addEventListener('slotchange', this.onSlotChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.showTimeout);
        clearTimeout(this.hideTimeout);
        this.showRequestId++;
        if (this.measureFrame) cancelAnimationFrame(this.measureFrame);
        this.triggerSlot?.removeEventListener('slotchange', this.onSlotChange);
        this.clearTriggerTargets();
        this.pointerWithinTrigger = false;
        this.pointerWithinPopup = false;
        this.focusWithinPopup = false;
        this.active = false;
        this.popoverWidth = 0;
    }

    protected updated(changed: Map<string, unknown>) {
        if (changed.has('active') || changed.has('model') || changed.has('parsedData')) {
            this.schedulePopoverMeasure(true);
            return;
        }
        if (changed.has('popoverWidth')) {
            this.schedulePopoverMeasure();
        }
    }

    private containsInteractiveNode(node: Node | null): boolean {
        if (!node) {
            return false;
        }
        return this.contains(node) || this.renderRoot.contains(node);
    }

    private isInteractivelyActive(): boolean {
        return this.pointerWithinTrigger || this.pointerWithinPopup || this.focusWithinPopup;
    }

    private clearTriggerTargets() {
        for (const target of this.triggerTargets) {
            target.removeEventListener('mouseenter', this.onTriggerEnter);
            target.removeEventListener('mouseleave', this.onTriggerLeave);
            target.removeEventListener('focusin', this.onTriggerEnter);
            target.removeEventListener('focusout', this.onTriggerLeave);
        }
        this.triggerTargets.clear();
    }

    private syncTriggerTargets() {
        this.clearTriggerTargets();

        const nextTargets = new Set<HTMLElement>();
        if (this.trigger) {
            nextTargets.add(this.trigger);
        }
        for (const element of this.triggerSlot?.assignedElements({flatten: true}) ?? []) {
            if (element instanceof HTMLElement) {
                nextTargets.add(element);
            }
        }

        for (const target of nextTargets) {
            target.addEventListener('mouseenter', this.onTriggerEnter);
            target.addEventListener('mouseleave', this.onTriggerLeave);
            target.addEventListener('focusin', this.onTriggerEnter);
            target.addEventListener('focusout', this.onTriggerLeave);
            this.triggerTargets.add(target);
        }
    }

    private show() {
        clearTimeout(this.hideTimeout);
        const requestId = ++this.showRequestId;
        this.showTimeout = window.setTimeout(async () => {
            this.entry = (this.registryKey
                ? getSchemaEntry(this.registryKey)
                : getSchemaEntryByRef(this.schemaRef)) ?? null;
            if (!this.entry || requestId !== this.showRequestId || !this.isInteractivelyActive()) return;

            this.model = (this.registryKey
                ? await loadSchemaModel(this.registryKey)
                : await loadSchemaModelByRef(this.schemaRef)) ?? null;
            if (!this.model || requestId !== this.showRequestId || !this.isInteractivelyActive()) return;

            try { this.parsedData = JSON.parse(this.model.schemaJson); } catch { this.parsedData = null; }
            this.popoverWidth = 0;
            this.popoverMeasureAttempts = 0;
            this.active = true;
        }, PpRefPopover.showDelayMs);
    }

    private scheduleHide() {
        clearTimeout(this.showTimeout);
        this.hideTimeout = window.setTimeout(() => {
            if (this.isInteractivelyActive()) {
                return;
            }
            this.active = false;
            this.popoverWidth = 0;
            this.popoverMeasureAttempts = 0;
        }, PpRefPopover.hideDelayMs);
    }

    private cancelHide() {
        clearTimeout(this.hideTimeout);
    }

    private resolveExample(): string | null {
        if (this.model?.mockJson) return this.model.mockJson;
        const data = this.parsedData;
        if (!data) return null;
        if (data.schema?.example !== undefined) return JSON.stringify(data.schema.example);
        if (data.example !== undefined) return JSON.stringify(data.example);
        if (Array.isArray(data.examples) && data.examples.length > 0) return JSON.stringify(data.examples[0]);
        return null;
    }

    private getSchemaJson(): string {
        if (!this.model) return '';
        const data = this.parsedData;
        if (!data) return this.model.schemaJson;
        // parameter or header — pass the nested schema object
        if (data.schema) return JSON.stringify(data.schema);
        return this.model.schemaJson;
    }

    private formatJson(json: string): string {
        try { return JSON.stringify(JSON.parse(json), null, 2); }
        catch { return json; }
    }

    private schedulePopoverMeasure(resetAttempts = false) {
        if (!this.active) return;
        if (resetAttempts) {
            this.popoverMeasureAttempts = 0;
        } else if (this.popoverMeasureAttempts >= PpRefPopover.maxPopoverMeasureAttempts) {
            return;
        }
        if (this.measureFrame) cancelAnimationFrame(this.measureFrame);
        this.measureFrame = requestAnimationFrame(() => {
            this.measureFrame = requestAnimationFrame(() => {
                this.measureFrame = undefined;
                this.measurePopoverWidth();
            });
        });
    }

    private getCssLengthPx(value: string, fallback = 0) {
        const trimmed = value.trim();
        const numeric = parseFloat(trimmed);
        if (!Number.isFinite(numeric)) return fallback;
        if (trimmed.endsWith('rem')) {
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            return numeric * (Number.isFinite(rootFontSize) ? rootFontSize : 16);
        }
        if (trimmed.endsWith('em')) {
            const hostFontSize = parseFloat(getComputedStyle(this).fontSize);
            return numeric * (Number.isFinite(hostFontSize) ? hostFontSize : 16);
        }
        return numeric;
    }

    private getPopoverViewportWidth() {
        const styles = getComputedStyle(this);
        const margin = this.getCssLengthPx(styles.getPropertyValue('--global-padding-double'));
        return Math.max(0, window.innerWidth - margin);
    }

    private collectRenderedWidth(element: HTMLElement, originLeft: number): number {
        const rect = element.getBoundingClientRect();
        let maxRight = rect.left - originLeft + element.scrollWidth;

        const visit = (root: ParentNode) => {
            for (const child of Array.from(root.children)) {
                if (!(child instanceof HTMLElement)) continue;
                const childRect = child.getBoundingClientRect();
                maxRight = Math.max(maxRight, childRect.left - originLeft + child.scrollWidth);
                if (child.shadowRoot) visit(child.shadowRoot);
                visit(child);
            }
        };
        if (element.shadowRoot) visit(element.shadowRoot);
        visit(element);
        return Math.ceil(maxRight);
    }

    private measurePopoverWidth() {
        const content = this.popoverContent;
        if (!content) return;
        this.popoverMeasureAttempts++;

        const contentRect = content.getBoundingClientRect();
        const desiredWidth = Math.min(
            this.collectRenderedWidth(content, contentRect.left),
            this.getPopoverViewportWidth(),
        );
        if (!Number.isFinite(desiredWidth) || desiredWidth <= 0) return;
        if (Math.abs(desiredWidth - contentRect.width) <= PpRefPopover.popoverWidthTolerancePx) return;
        this.popoverWidth = desiredWidth;
    }

    render() {
        const example = this.resolveExample();
        const schemaJson = this.getSchemaJson();
        const popoverStyle = this.popoverWidth > 0 ? `--ref-popover-width: ${this.popoverWidth}px` : '';
        return html`
            <span class="trigger" @click=${() => { this.active = false; }}>
                <slot></slot>
            </span>
            ${this.active && this.entry ? html`
                <sl-popup
                    .anchor=${this.trigger}
                    placement="bottom-start"
                    strategy="fixed"
                    active
                    flip shift
                    distance="8">
                    <div class="pp-ref-popover-content"
                        style=${popoverStyle}
                        @mouseenter=${this.onPopupEnter}
                        @mouseleave=${this.onPopupLeave}
                        @focusin=${this.onPopupFocusIn}
                        @focusout=${this.onPopupFocusOut}
                        @wheel=${this.onPopupInteraction}
                        @scroll=${this.onPopupInteraction}>
                        <div class="popover-header">
                            <pp-icon-title icon=${this.entry.componentType} heading=${this.entry.name} level=${3} size="medium"></pp-icon-title>
                        </div>
                        <div class="popover-body">
                            <pp-schema-properties compact condensed constrained popover-context schema-json=${schemaJson}></pp-schema-properties>
                        </div>
                        ${example ? html`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(example)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        ` : nothing}
                    </div>
                </sl-popup>
            ` : nothing}
        `;
    }
}
