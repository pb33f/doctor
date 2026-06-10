import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/layout/layout.js';

describe('pp-layout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete document.body.dataset.ppCatalogHref;
    delete document.body.dataset.ppCurrentVersion;
    delete document.body.dataset.ppVersions;
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.setAttribute('theme', 'dark');
    document.documentElement.classList.add('sl-theme-dark');
  });

  it('should render nav and content slots', async () => {
    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const slots = el.shadowRoot?.querySelectorAll('slot');
    expect(slots?.length).toBe(2);

    const slotNames = Array.from(slots || []).map((s) => s.getAttribute('name'));
    expect(slotNames).toContain('nav');
    expect(slotNames).toContain('content');
  });

  it('binds spaced header titles without leaking text into header tools', async () => {
    const el = document.createElement('pp-layout');
    el.setAttribute('data-title', 'API Catalog');
    document.body.appendChild(el);
    await el.updateComplete;

    const logoLink = el.shadowRoot?.querySelector('.doc-logo-link') as HTMLAnchorElement | null;
    const headerTools = el.shadowRoot?.querySelector('.header-tools');

    expect(logoLink?.textContent).toBe('API Catalog');
    expect(headerTools?.textContent?.replace(/\s+/g, ' ').trim()).toBe('');
  });

  it('wires the split panel resize without leaked Lit event attributes', async () => {
    sessionStorage.setItem('pp-split-position', '0');

    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const split = el.shadowRoot?.querySelector('sl-split-panel') as HTMLElement & {position?: number};
    expect(split.getAttribute('position')).toBe('20');
    expect(split.outerHTML).not.toContain('@sl-reposition');

    split.position = 30;
    split.dispatchEvent(new CustomEvent('sl-reposition'));
    await el.updateComplete;

    expect(sessionStorage.getItem('pp-split-position')).toBe('30');
    expect(split.getAttribute('position')).toBe('30');
  });

  it('renders working Shoelace theme buttons directly in the header', async () => {
    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const switcher = el.shadowRoot?.querySelector('pb33f-theme-switcher');
    const modeButton = el.shadowRoot?.querySelector('.theme-mode-toggle') as HTMLElement | null;
    const tektronixButton = el.shadowRoot?.querySelector('.theme-tektronix-toggle') as HTMLElement | null;
    const buttons = el.shadowRoot?.querySelectorAll('.theme-controls button');

    expect(switcher).toBeNull();
    expect(buttons).toHaveLength(2);
    expect(modeButton?.querySelector('sl-icon')?.getAttribute('name')).toBe('sun');
    expect(modeButton?.getAttribute('aria-label')).toBe('Switch to Roger Mode (light)');
    expect(tektronixButton?.querySelector('sl-icon')?.getAttribute('name')).toBe('display');
    expect(tektronixButton?.getAttribute('aria-label')).toBe('Enable Tektronix 4010 Mode');

    modeButton?.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('light');
    expect(localStorage.getItem('pb33f-base-theme')).toBe('light');
    expect(document.documentElement.getAttribute('theme')).toBe('light');
    expect(document.documentElement.classList.contains('sl-theme-dark')).toBe(false);

    tektronixButton?.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('tektronix');
    expect(localStorage.getItem('pb33f-base-theme')).toBe('light');
    expect(document.documentElement.getAttribute('theme')).toBe('tektronix');
    expect(document.documentElement.classList.contains('sl-theme-dark')).toBe(true);

    tektronixButton?.click();
    expect(localStorage.getItem('pb33f-theme')).toBe('light');
    expect(localStorage.getItem('pb33f-base-theme')).toBe('light');
    expect(document.documentElement.getAttribute('theme')).toBe('light');
  });

  it('renders aggregate version controls without a redundant catalog backlink', async () => {
    document.body.dataset.ppCatalogHref = '../../../../index.html';
    document.body.dataset.ppCurrentVersion = 'v2';
    document.body.dataset.ppVersions = JSON.stringify([
      {label: 'v2', href: '../index.html', active: true},
      {label: 'v1', href: '../../v1/index.html'},
    ]);

    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
    const button = el.shadowRoot?.querySelector('sl-button');
    const items = el.shadowRoot?.querySelectorAll('sl-menu-item');
    const logoLink = el.shadowRoot?.querySelector('.doc-logo-link') as HTMLAnchorElement | null;
    const backlink = el.shadowRoot?.querySelector('.catalog-backlink');
    const headerContextChildren = Array.from(el.shadowRoot?.querySelector('.header-context')?.children ?? []);

    expect(dropdown).toBeTruthy();
    expect(backlink).toBeNull();
    expect(headerContextChildren[0]?.classList.contains('version-picker')).toBe(true);
    expect(button?.textContent).toContain('Version: v2');
    expect(items?.length).toBe(2);
    expect(logoLink?.href).toBe('http://localhost:3000/index.html');
    expect(el.shadowRoot?.querySelector('.service-name')).toBeNull();
    expect(el.shadowRoot?.querySelector('.versions-link')).toBeNull();
  });

  it('keeps catalog href on the header title without rendering a header backlink', async () => {
    document.body.dataset.ppCatalogHref = '../../../../index.html';

    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const logoLink = el.shadowRoot?.querySelector('.doc-logo-link') as HTMLAnchorElement | null;
    const backlink = el.shadowRoot?.querySelector('.catalog-backlink');
    const dropdown = el.shadowRoot?.querySelector('sl-dropdown');

    expect(logoLink?.href).toBe('http://localhost:3000/index.html');
    expect(backlink).toBeNull();
    expect(dropdown).toBeNull();
  });
});
