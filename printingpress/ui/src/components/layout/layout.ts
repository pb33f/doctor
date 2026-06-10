import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import layoutCss from './layout.css.js';
import sharedCss from "../../styles/shared.css";
import {docHref, headerTitleHref} from '../../utils/doc-links.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

const SPLIT_POS_KEY = 'pp-split-position';
const DEFAULT_POS = 20;
const MIN_PERSISTED_SPLIT_POS = 1;
const PB33F_THEME = 'pb33f-theme';
const PB33F_BASE_THEME = 'pb33f-base-theme';
const PB33F_THEME_CHANGE = 'pb33f-theme-change';

type HostThemeName = 'dark' | 'light' | 'tektronix';

type HeaderVersionLink = {
  label: string;
  href: string;
  active?: boolean;
};

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Theme changes should still apply when storage is blocked.
  }
}

function labelThemeButton(button: HTMLElement, label: string) {
  button.setAttribute('label', label);
  button.setAttribute('title', label);
  button.setAttribute('aria-label', label);
}

function readSplitPosition() {
  try {
    const raw = sessionStorage.getItem(SPLIT_POS_KEY);
    const parsed = raw ? parseFloat(raw) : DEFAULT_POS;
    return normalizeSplitPosition(parsed);
  } catch {
    return DEFAULT_POS;
  }
}

function writeSplitPosition(position: number) {
  try {
    sessionStorage.setItem(SPLIT_POS_KEY, String(position));
  } catch {
    // Resizing should still work when session storage is blocked.
  }
}

function normalizeSplitPosition(position: number) {
  if (!Number.isFinite(position) || position < MIN_PERSISTED_SPLIT_POS || position > 100) {
    return DEFAULT_POS;
  }
  return position;
}

function clampSplitPosition(position: number) {
  if (!Number.isFinite(position)) {
    return DEFAULT_POS;
  }
  return Math.min(100, Math.max(MIN_PERSISTED_SPLIT_POS, position));
}

type SplitPanelElement = HTMLElement & { position?: number };
type UpdatingSplitPanelElement = SplitPanelElement & { updateComplete?: Promise<unknown> };

@customElement('pp-layout')
export class PpLayout extends LitElement {
  static styles = [layoutCss, sharedCss];

  @state() title = '';
  @state() private splitPos = DEFAULT_POS;
  @state() private currentVersion = '';
  @state() private versions: HeaderVersionLink[] = [];
  @state() private embedded = false;
  private splitPanel: SplitPanelElement | null = null;
  private splitDivider: HTMLElement | null = null;
  private splitHandle: HTMLElement | null = null;
  private readonly handleSplitReposition = (event: Event) => this.onReposition(event as CustomEvent);
  private readonly handleSplitHostPointerDown = (event: PointerEvent) => this.startHostPointerSplitDrag(event);
  private readonly handleSplitHostMouseDown = (event: MouseEvent) => this.startHostMouseSplitDrag(event);
  private readonly handleSplitPointerDown = (event: PointerEvent) => this.startPointerSplitDrag(event);
  private readonly handleSplitMouseDown = (event: MouseEvent) => this.startMouseSplitDrag(event);
  private readonly handleSplitTouchStart = (event: TouchEvent) => this.startTouchSplitDrag(event);

  connectedCallback() {
    super.connectedCallback();
    this.title = this.getAttribute('data-title') || document.title || 'API Documentation';
    this.currentVersion = document.body?.dataset.ppCurrentVersion || '';
    this.versions = this.parseVersions(document.body?.dataset.ppVersions);
    this.embedded = document.documentElement.hasAttribute('data-pp-embedded-docs') ||
      document.body?.dataset.ppEmbeddedDocs === 'true';
    this.toggleAttribute('embedded', this.embedded);
    this.splitPos = readSplitPosition();
  }

  disconnectedCallback() {
    this.splitPanel?.removeEventListener('sl-reposition', this.handleSplitReposition);
    this.splitPanel?.removeEventListener('pointerdown', this.handleSplitHostPointerDown);
    this.splitPanel?.removeEventListener('mousedown', this.handleSplitHostMouseDown);
    this.detachSplitDragTarget(this.splitDivider);
    this.detachSplitDragTarget(this.splitHandle);
    this.splitPanel = null;
    this.splitDivider = null;
    this.splitHandle = null;
    super.disconnectedCallback();
  }

  updated() {
    this.syncHeader();
    this.syncThemeControls();
    this.syncSplitPanel();
  }

  private syncHeader() {
    const logoLink = this.renderRoot?.querySelector('.doc-logo-link') as HTMLAnchorElement | null;
    if (!logoLink) {
      return;
    }
    logoLink.href = headerTitleHref();
  }

  private activeTheme(): HostThemeName {
    const storedTheme = readStorage(PB33F_THEME);
    if (storedTheme === 'light' || storedTheme === 'tektronix') {
      return storedTheme;
    }
    const documentTheme = document.documentElement.getAttribute('theme');
    if (documentTheme === 'light' || documentTheme === 'tektronix') {
      return documentTheme;
    }
    return 'dark';
  }

  private baseTheme(): Exclude<HostThemeName, 'tektronix'> {
    const storedBase = readStorage(PB33F_BASE_THEME);
    if (storedBase === 'light') {
      return 'light';
    }
    if (storedBase === 'dark') {
      return 'dark';
    }
    return this.activeTheme() === 'light' ? 'light' : 'dark';
  }

  private applyTheme(theme: HostThemeName, baseTheme: Exclude<HostThemeName, 'tektronix'> = this.baseTheme()) {
    const nextBaseTheme = theme === 'tektronix' ? baseTheme : theme;
    writeStorage(PB33F_THEME, theme);
    writeStorage(PB33F_BASE_THEME, nextBaseTheme);
    document.documentElement.setAttribute('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('sl-theme-dark');
    } else {
      document.documentElement.classList.add('sl-theme-dark');
    }
    window.dispatchEvent(new CustomEvent(PB33F_THEME_CHANGE, {detail: {theme}}));
    this.syncThemeControls();
  }

  private toggleBaseTheme() {
    const nextBaseTheme = this.baseTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextBaseTheme, nextBaseTheme);
  }

  private toggleTektronix() {
    const baseTheme = this.baseTheme();
    this.applyTheme(this.activeTheme() === 'tektronix' ? baseTheme : 'tektronix', baseTheme);
  }

  private syncThemeControls() {
    const modeButton = this.renderRoot?.querySelector('.theme-mode-toggle') as HTMLElement | null;
    const tektronixButton = this.renderRoot?.querySelector('.theme-tektronix-toggle') as HTMLElement | null;
    const baseTheme = this.baseTheme();
    const activeTheme = this.activeTheme();

    if (modeButton) {
      const modeLabel = baseTheme === 'dark' ? 'Switch to Roger Mode (light)' : 'Switch to PB33F Mode (dark)';
      const modeIcon = modeButton.querySelector('sl-icon');
      modeIcon?.setAttribute('name', baseTheme === 'dark' ? 'sun' : 'moon');
      labelThemeButton(modeButton, modeLabel);
      modeButton.onclick = () => this.toggleBaseTheme();
    }

    if (tektronixButton) {
      const tektronixLabel = activeTheme === 'tektronix' ? 'Disable Tektronix 4010 Mode' : 'Enable Tektronix 4010 Mode';
      labelThemeButton(tektronixButton, tektronixLabel);
      tektronixButton.classList.toggle('tek-active', activeTheme === 'tektronix');
      tektronixButton.onclick = () => this.toggleTektronix();
    }
  }

  private syncSplitPanel() {
    const split = this.renderRoot?.querySelector('sl-split-panel') as SplitPanelElement | null;
    if (!split) {
      return;
    }
    if (this.splitPanel !== split) {
      this.splitPanel?.removeEventListener('sl-reposition', this.handleSplitReposition);
      this.splitPanel?.removeEventListener('pointerdown', this.handleSplitHostPointerDown);
      this.splitPanel?.removeEventListener('mousedown', this.handleSplitHostMouseDown);
      split.addEventListener('sl-reposition', this.handleSplitReposition);
      split.addEventListener('pointerdown', this.handleSplitHostPointerDown);
      split.addEventListener('mousedown', this.handleSplitHostMouseDown);
      this.splitPanel = split;
    }
    if (split.position !== this.splitPos) {
      split.position = this.splitPos;
    }
    if (split.getAttribute('position') !== String(this.splitPos)) {
      split.setAttribute('position', String(this.splitPos));
    }
    this.syncSplitDivider(split);
    void (split as UpdatingSplitPanelElement).updateComplete?.then(() => this.syncSplitDivider(split));
    this.syncSplitHandle();
  }

  private syncSplitDivider(split: SplitPanelElement) {
    const divider = split.shadowRoot?.querySelector('.divider') as HTMLElement | null;
    if (!divider || this.splitDivider === divider) {
      return;
    }
    this.detachSplitDragTarget(this.splitDivider);
    this.attachSplitDragTarget(divider);
    this.splitDivider = divider;
  }

  private syncSplitHandle() {
    const handle = this.renderRoot?.querySelector('sl-icon.divider-vert') as HTMLElement | null;
    if (!handle || this.splitHandle === handle) {
      return;
    }
    this.detachSplitDragTarget(this.splitHandle);
    this.attachSplitDragTarget(handle);
    this.splitHandle = handle;
  }

  private attachSplitDragTarget(target: HTMLElement) {
    target.addEventListener('pointerdown', this.handleSplitPointerDown);
    target.addEventListener('mousedown', this.handleSplitMouseDown);
    target.addEventListener('touchstart', this.handleSplitTouchStart, {passive: false});
    target.setAttribute('data-pp-resize-ready', 'true');
  }

  private detachSplitDragTarget(target: HTMLElement | null) {
    target?.removeEventListener('pointerdown', this.handleSplitPointerDown);
    target?.removeEventListener('mousedown', this.handleSplitMouseDown);
    target?.removeEventListener('touchstart', this.handleSplitTouchStart);
    target?.removeAttribute('data-pp-resize-ready');
  }

  private isNearSplitDivider(clientX: number) {
    const dividerRect = this.splitDivider?.getBoundingClientRect() || this.splitHandle?.getBoundingClientRect();
    if (!dividerRect) {
      return false;
    }
    return clientX >= dividerRect.left - 8 && clientX <= dividerRect.right + 8;
  }

  private startHostPointerSplitDrag(event: PointerEvent) {
    if (!this.isNearSplitDivider(event.clientX)) {
      return;
    }
    this.startPointerSplitDrag(event);
  }

  private startHostMouseSplitDrag(event: MouseEvent) {
    if (!this.isNearSplitDivider(event.clientX)) {
      return;
    }
    this.startMouseSplitDrag(event);
  }

  private startPointerSplitDrag(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    this.setSplitPositionFromClientX(event.clientX);

    const onMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      this.setSplitPositionFromClientX(moveEvent.clientX);
    };
    const onEnd = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onEnd);
      document.removeEventListener('pointercancel', onEnd);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
    document.addEventListener('pointercancel', onEnd);
  }

  private startMouseSplitDrag(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.setSplitPositionFromClientX(event.clientX);

    const onMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      this.setSplitPositionFromClientX(moveEvent.clientX);
    };
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
  }

  private startTouchSplitDrag(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.setSplitPositionFromClientX(touch.clientX);

    const onMove = (moveEvent: TouchEvent) => {
      const movingTouch = moveEvent.touches[0];
      if (!movingTouch) {
        return;
      }
      moveEvent.preventDefault();
      this.setSplitPositionFromClientX(movingTouch.clientX);
    };
    const onEnd = () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    };
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
  }

  private setSplitPositionFromClientX(clientX: number) {
    if (!this.splitPanel) {
      return;
    }
    const rect = this.splitPanel.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }
    const pos = clampSplitPosition(((clientX - rect.left) / rect.width) * 100);
    this.splitPos = pos;
    this.splitPanel.position = pos;
    this.splitPanel.setAttribute('position', String(pos));
    writeSplitPosition(pos);
  }

  private onReposition(e: CustomEvent) {
    const pos = clampSplitPosition((e.target as SplitPanelElement).position ?? DEFAULT_POS);
    if (typeof pos === 'number') {
      this.splitPos = pos;
      writeSplitPosition(pos);
    }
  }

  private parseVersions(raw?: string): HeaderVersionLink[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((entry): entry is HeaderVersionLink =>
        !!entry && typeof entry.label === 'string' && typeof entry.href === 'string',
      );
    } catch {
      return [];
    }
  }

  private onVersionChange(event: Event) {
    const detail = (event as CustomEvent).detail;
    const item = detail?.item as { value?: string } | undefined;
    if (!item?.value) {
      return;
    }
    window.location.href = item.value;
  }

  private currentVersionLabel(): string {
    const active = this.versions.find((version) => version.active || version.label === this.currentVersion);
    return active?.label || this.currentVersion || this.versions[0]?.label || 'Version';
  }

  private currentVersionTriggerLabel(): string {
    return `Version: ${this.currentVersionLabel()}`;
  }

  render() {
    return html`
      ${this.embedded ? null : html`
        <header class="pp-doc-header">
          <div class="logo">
            <span class="caret">$</span>
            <span class="name"><a class="doc-logo-link">${this.title}</a></span>
          </div>
          <div class="header-space">
            <div class="header-tools">
              ${this.versions.length
                ? html`
                    <div class="header-context">
                      <div class="version-picker">
                        <sl-dropdown skidding="5" distance="5">
                          <sl-button slot="trigger" caret>${this.currentVersionTriggerLabel()}</sl-button>
                          <sl-menu @sl-select=${this.onVersionChange}>
                            ${this.versions.map(
                              (version) => html`
                                <sl-menu-item value=${docHref(version.href)}>
                                  ${version.label}
                                </sl-menu-item>
                              `,
                            )}
                          </sl-menu>
                        </sl-dropdown>
                      </div>
                    </div>
                  `
                : null}
              <div class="theme-controls">
                <button type="button" class="theme-icon-button theme-mode-toggle" aria-label="Toggle dark/light" title="Toggle dark/light">
                  <sl-icon name="sun" aria-hidden="true"></sl-icon>
                </button>
                <button type="button" class="theme-icon-button theme-tektronix-toggle" aria-label="Toggle Tektronix" title="Toggle Tektronix">
                  <sl-icon name="display" aria-hidden="true"></sl-icon>
                </button>
              </div>
            </div>
          </div>
        </header>
      `}
      <sl-split-panel position="20">
        <sl-icon slot="divider" name="grip-vertical" class="divider-vert" aria-hidden="true"></sl-icon>
        <div slot="start" class="nav-panel">
          <slot name="nav"></slot>
        </div>
        <div slot="end" class="content-panel">
          <slot name="content"></slot>
        </div>
      </sl-split-panel>
    `;
  }
}
