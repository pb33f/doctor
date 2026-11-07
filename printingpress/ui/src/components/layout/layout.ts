// Printing Press - page layout behaviour
// Copyright 2024-2026 Princess Beef Heavy Industries, LLC
//
// The header, the navigation column, the divider and the main area are page
// markup (the theme's engine-layout.html), so the page looks right before any
// script runs. pp-layout draws nothing: it makes the divider resize the
// navigation column, and wires the header's palette buttons.

import '@awesome.me/webawesome/dist/components/icon/icon.js';
import {bindThemeSwitches, syncThemeButtons} from '../../utils/theme.js';

const SPLIT_POS_KEY = 'pp-split-position';
const SPLIT_POS_VAR = '--pp-split-position';
const DEFAULT_POS = 20;
const MIN_PERSISTED_SPLIT_POS = 1;
const KEY_STEP = 1;
const SHIFT_KEY_STEP = 10;

function readSplitPosition(): number {
  try {
    const raw = sessionStorage.getItem(SPLIT_POS_KEY);
    return normalizeSplitPosition(raw ? parseFloat(raw) : DEFAULT_POS);
  } catch {
    return DEFAULT_POS;
  }
}

function writeSplitPosition(position: number) {
  try {
    sessionStorage.setItem(SPLIT_POS_KEY, String(position));
  } catch {
    // Resizing still works when session storage is blocked.
  }
}

function normalizeSplitPosition(position: number): number {
  if (!Number.isFinite(position) || position < MIN_PERSISTED_SPLIT_POS || position > 100) {
    return DEFAULT_POS;
  }
  return position;
}

function clampSplitPosition(position: number): number {
  if (!Number.isFinite(position)) {
    return DEFAULT_POS;
  }
  return Math.min(100, Math.max(MIN_PERSISTED_SPLIT_POS, position));
}

export class PpLayout extends HTMLElement {
  private split: HTMLElement | null = null;
  private divider: HTMLElement | null = null;
  private position = DEFAULT_POS;
  private readonly onPointerDown = (event: PointerEvent) => this.startPointerDrag(event);
  private readonly onMouseDown = (event: MouseEvent) => this.startMouseDrag(event);
  private readonly onTouchStart = (event: TouchEvent) => this.startTouchDrag(event);
  private readonly onKeyDown = (event: KeyboardEvent) => this.moveByKey(event);

  connectedCallback() {
    this.split = this.querySelector(':scope > .pp-split');
    this.divider = this.split?.querySelector(':scope > .pp-split-divider') ?? null;
    this.position = readSplitPosition();
    this.applyPosition();
    this.divider?.addEventListener('pointerdown', this.onPointerDown);
    this.divider?.addEventListener('mousedown', this.onMouseDown);
    this.divider?.addEventListener('touchstart', this.onTouchStart, {passive: false});
    this.divider?.addEventListener('keydown', this.onKeyDown);
    this.divider?.setAttribute('data-pp-resize-ready', 'true');
    bindThemeSwitches();
    syncThemeButtons(this);
  }

  disconnectedCallback() {
    this.divider?.removeEventListener('pointerdown', this.onPointerDown);
    this.divider?.removeEventListener('mousedown', this.onMouseDown);
    this.divider?.removeEventListener('touchstart', this.onTouchStart);
    this.divider?.removeEventListener('keydown', this.onKeyDown);
    this.divider?.removeAttribute('data-pp-resize-ready');
    this.split = null;
    this.divider = null;
  }

  /** setPosition moves the divider to a percentage of the layout's width, and remembers it. */
  setPosition(position: number) {
    this.position = clampSplitPosition(position);
    this.applyPosition();
    writeSplitPosition(this.position);
  }

  // The head script sets the same property from session storage before the
  // first paint, so a stored width shows without a jump.
  private applyPosition() {
    document.documentElement.style.setProperty(SPLIT_POS_VAR, `${this.position}%`);
    this.divider?.setAttribute('aria-valuenow', String(Math.round(this.position)));
  }

  private positionFromClientX(clientX: number) {
    const rect = this.split?.getBoundingClientRect();
    if (!rect || rect.width <= 0) {
      return;
    }
    this.setPosition(((clientX - rect.left) / rect.width) * 100);
  }

  private moveByKey(event: KeyboardEvent) {
    const step = event.shiftKey ? SHIFT_KEY_STEP : KEY_STEP;
    const moves: Record<string, number> = {
      ArrowLeft: this.position - step,
      ArrowRight: this.position + step,
      Home: MIN_PERSISTED_SPLIT_POS,
      End: 100,
    };
    const next = moves[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    this.setPosition(next);
  }

  private startPointerDrag(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.divider?.setPointerCapture?.(event.pointerId);
    this.positionFromClientX(event.clientX);
    const onMove = (move: PointerEvent) => {
      move.preventDefault();
      this.positionFromClientX(move.clientX);
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

  // Browsers without pointer events, and tests, send mouse events.
  private startMouseDrag(event: MouseEvent) {
    if (event.button !== 0 || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    this.positionFromClientX(event.clientX);
    const onMove = (move: MouseEvent) => {
      move.preventDefault();
      this.positionFromClientX(move.clientX);
    };
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
  }

  private startTouchDrag(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    event.preventDefault();
    this.positionFromClientX(touch.clientX);
    const onMove = (move: TouchEvent) => {
      const moving = move.touches[0];
      if (!moving) {
        return;
      }
      move.preventDefault();
      this.positionFromClientX(moving.clientX);
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
}

if (!customElements.get('pp-layout')) {
  customElements.define('pp-layout', PpLayout);
}
