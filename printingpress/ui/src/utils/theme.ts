// Printing Press - palette switching
// Copyright 2024-2026 Princess Beef Heavy Industries, LLC
//
// One place for the palette a page shows: dark or light, with tektronix as
// an overlay on either. Any button with data-pp-theme-toggle switches it, in
// the layout header or in a theme's own header; no component is needed.

export type ThemeName = 'dark' | 'light' | 'tektronix';
type BaseTheme = Exclude<ThemeName, 'tektronix'>;

export const THEME_KEY = 'pb33f-theme';
export const BASE_THEME_KEY = 'pb33f-base-theme';
export const THEME_CHANGE = 'pb33f-theme-change';

/** The attribute a palette button carries: "base" toggles dark and light, "tektronix" toggles the overlay. */
export const THEME_TOGGLE_ATTR = 'data-pp-theme-toggle';

function readStorage(key: string): string | null {
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
    // The palette still changes when storage is blocked.
  }
}

/** The palette the page shows now. */
export function activeTheme(): ThemeName {
  const stored = readStorage(THEME_KEY);
  if (stored === 'light' || stored === 'tektronix') {
    return stored;
  }
  const current = document.documentElement.getAttribute('theme');
  return current === 'light' || current === 'tektronix' ? current : 'dark';
}

/** Dark or light, under any tektronix overlay. */
export function baseTheme(): BaseTheme {
  const stored = readStorage(BASE_THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return activeTheme() === 'light' ? 'light' : 'dark';
}

/** applyTheme shows a palette, remembers it, and tells the page. */
export function applyTheme(theme: ThemeName, base: BaseTheme = theme === 'tektronix' ? baseTheme() : theme) {
  writeStorage(THEME_KEY, theme);
  writeStorage(BASE_THEME_KEY, base);
  const root = document.documentElement;
  root.setAttribute('theme', theme);
  root.classList.toggle('sl-theme-dark', theme !== 'light');
  root.classList.toggle('wa-dark', theme !== 'light');
  window.dispatchEvent(new CustomEvent(THEME_CHANGE, {detail: {theme}}));
  syncThemeButtons();
}

/** toggleBaseTheme swaps dark and light, and leaves tektronix. */
export function toggleBaseTheme() {
  const next: BaseTheme = baseTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next, next);
}

/** toggleTektronix turns the tektronix overlay on or off. */
export function toggleTektronix() {
  const base = baseTheme();
  applyTheme(activeTheme() === 'tektronix' ? base : 'tektronix', base);
}

function labelButton(button: Element, label: string) {
  button.setAttribute('title', label);
  button.setAttribute('aria-label', label);
}

/** syncThemeButtons gives every palette button its icon, label and state. */
export function syncThemeButtons(root: ParentNode = document) {
  const base = baseTheme();
  const active = activeTheme();
  for (const button of root.querySelectorAll(`[${THEME_TOGGLE_ATTR}]`)) {
    if (button.getAttribute(THEME_TOGGLE_ATTR) === 'tektronix') {
      labelButton(button, active === 'tektronix' ? 'Disable Tektronix 4010 Mode' : 'Enable Tektronix 4010 Mode');
      button.classList.toggle('tek-active', active === 'tektronix');
    } else {
      labelButton(button, base === 'dark' ? 'Switch to Roger Mode (light)' : 'Switch to PB33F Mode (dark)');
      button.querySelector('sl-icon, wa-icon')?.setAttribute('name', base === 'dark' ? 'sun' : 'moon');
    }
  }
}

let bound = false;

/** bindThemeSwitches makes every palette button on the page work, now and later. */
export function bindThemeSwitches() {
  if (bound) {
    return;
  }
  bound = true;
  document.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest?.(`[${THEME_TOGGLE_ATTR}]`);
    if (!button) {
      return;
    }
    if (button.getAttribute(THEME_TOGGLE_ATTR) === 'tektronix') {
      toggleTektronix();
    } else {
      toggleBaseTheme();
    }
  });
  syncThemeButtons();
}
