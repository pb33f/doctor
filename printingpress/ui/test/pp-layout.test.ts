import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/layout/layout.js';

// The layout markup as the theme's engine-layout.html writes it.
function layoutMarkup(embedded = false): string {
  const header = embedded ? '' : `<header class="pp-doc-header"><div class="logo"><span class="caret">$</span> <span class="name"><a class="doc-logo-link" href="index.html">API Catalog</a></span></div><div class="header-space"><div class="header-tools"><div class="theme-controls"><button type="button" class="theme-icon-button theme-mode-toggle" data-pp-theme-toggle="base" aria-label="Toggle dark/light" title="Toggle dark/light"><wa-icon name="sun" aria-hidden="true"></wa-icon></button><button type="button" class="theme-icon-button theme-tektronix-toggle" data-pp-theme-toggle="tektronix" aria-label="Toggle Tektronix" title="Toggle Tektronix"><wa-icon name="display" aria-hidden="true"></wa-icon></button></div></div></div></header>`;
  return `<pp-layout${embedded ? ' embedded' : ''}>${header}<div class="pp-split"><div class="nav-panel"><nav class="test-nav">NAV</nav></div><div class="pp-split-divider" role="separator" aria-orientation="vertical" aria-label="Resize the navigation" aria-valuemin="0" aria-valuemax="100" tabindex="0"><wa-icon name="grip-vertical" class="divider-vert" aria-hidden="true"></wa-icon></div><div class="content-panel"><main>CONTENT</main></div></div></pp-layout>`;
}

function mountLayout(embedded = false): HTMLElement {
  document.body.innerHTML = layoutMarkup(embedded);
  return document.querySelector('pp-layout') as HTMLElement;
}

function splitPosition(): string {
  return document.documentElement.style.getPropertyValue('--pp-split-position');
}

function divider(el: HTMLElement): HTMLElement {
  return el.querySelector('.pp-split-divider') as HTMLElement;
}

describe('pp-layout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.style.removeProperty('--pp-split-position');
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.setAttribute('theme', 'dark');
    document.documentElement.classList.add('sl-theme-dark');
  });

  it('keeps the header, navigation and content the page wrote', () => {
    const before = layoutMarkup();
    const el = mountLayout();

    expect(el.querySelector('.doc-logo-link')?.textContent).toBe('API Catalog');
    expect(el.querySelector('.nav-panel > .test-nav')?.textContent).toBe('NAV');
    expect(el.querySelector('.content-panel > main')?.textContent).toBe('CONTENT');
    expect(el.querySelector('pp-slot')).toBeNull();
    // Only the attributes the behaviour adds differ from what the page wrote.
    expect(document.body.querySelectorAll('pp-layout *').length).toBe(
      new DOMParser().parseFromString(before, 'text/html').querySelectorAll('pp-layout *').length + 2,
    );
  });

  it('gives each palette button a tooltip with its label', () => {
    const el = mountLayout();

    for (const button of el.querySelectorAll('[data-pp-theme-toggle]')) {
      const tooltip = el.querySelector(`wa-tooltip[for="${button.id}"]`);
      expect(button.id).not.toBe('');
      expect(tooltip?.textContent).toBe(button.getAttribute('aria-label'));
      expect(button.hasAttribute('title')).toBe(false);
    }
  });

  it('makes the palette buttons switch the palette', () => {
    const el = mountLayout();
    const modeButton = el.querySelector('.theme-mode-toggle') as HTMLElement;
    const tektronixButton = el.querySelector('.theme-tektronix-toggle') as HTMLElement;

    expect(modeButton.getAttribute('aria-label')).toBe('Switch to Roger Mode (light)');
    expect(tektronixButton.getAttribute('aria-label')).toBe('Enable Tektronix 4010 Mode');

    modeButton.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('light');
    expect(document.documentElement.getAttribute('theme')).toBe('light');
    expect(document.documentElement.classList.contains('sl-theme-dark')).toBe(false);
    expect(modeButton.querySelector('wa-icon')?.getAttribute('name')).toBe('moon');

    tektronixButton.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('tektronix');
    expect(localStorage.getItem('pb33f-base-theme')).toBe('light');
    expect(document.documentElement.getAttribute('theme')).toBe('tektronix');

    tektronixButton.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('light');
  });

  it('applies the stored split position, and falls back to 20% for a bad one', () => {
    sessionStorage.setItem('pp-split-position', '33');
    let el = mountLayout();
    expect(splitPosition()).toBe('33%');
    expect(divider(el).getAttribute('aria-valuenow')).toBe('33');

    sessionStorage.setItem('pp-split-position', '0');
    el = mountLayout();
    expect(splitPosition()).toBe('20%');
    expect(divider(el).getAttribute('data-pp-resize-ready')).toBe('true');
  });

  it('resizes the navigation column when the divider is dragged', () => {
    const el = mountLayout();
    const split = el.querySelector('.pp-split') as HTMLElement;
    split.getBoundingClientRect = () => ({left: 0, width: 1000} as DOMRect);

    divider(el).dispatchEvent(new MouseEvent('mousedown', {button: 0, clientX: 300, bubbles: true}));
    expect(splitPosition()).toBe('30%');
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 250}));
    expect(splitPosition()).toBe('25%');
    document.dispatchEvent(new MouseEvent('mouseup'));
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 500}));

    expect(splitPosition()).toBe('25%');
    expect(sessionStorage.getItem('pp-split-position')).toBe('25');
  });

  it('moves the divider with the keyboard', () => {
    const el = mountLayout();
    const press = (key: string, shiftKey = false) =>
      divider(el).dispatchEvent(new KeyboardEvent('keydown', {key, shiftKey, bubbles: true}));

    press('ArrowRight');
    expect(splitPosition()).toBe('21%');
    press('ArrowLeft', true);
    expect(splitPosition()).toBe('11%');
    press('Home');
    expect(splitPosition()).toBe('1%');
    press('End');
    expect(splitPosition()).toBe('100%');
    expect(sessionStorage.getItem('pp-split-position')).toBe('100');
  });

  it('works embedded, with no header', () => {
    const el = mountLayout(true);
    expect(el.hasAttribute('embedded')).toBe(true);
    expect(el.querySelector('.pp-doc-header')).toBeNull();
    expect(divider(el).getAttribute('data-pp-resize-ready')).toBe('true');
  });
});
