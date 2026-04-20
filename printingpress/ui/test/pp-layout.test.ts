import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/layout/layout.js';

describe('pp-layout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete document.body.dataset.ppCatalogHref;
    delete document.body.dataset.ppCurrentVersion;
    delete document.body.dataset.ppVersions;
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

  it('renders aggregate version controls when header context is present', async () => {
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
    const header = el.shadowRoot?.querySelector('pb33f-header');
    const backlink = el.shadowRoot?.querySelector('.catalog-backlink');
    const backlinkIcon = backlink?.querySelector('sl-icon');
    const headerContextChildren = Array.from(el.shadowRoot?.querySelector('.header-context')?.children ?? []);

    expect(dropdown).toBeTruthy();
    expect(backlink?.textContent).toContain('API Catalog');
    expect(backlinkIcon?.getAttribute('name')).toBe('arrow-90deg-up');
    expect(backlink?.getAttribute('href')).toBe('http://localhost:3000/index.html');
    expect(headerContextChildren[0]?.classList.contains('catalog-backlink')).toBe(true);
    expect(headerContextChildren[1]?.classList.contains('version-picker')).toBe(true);
    expect(button?.textContent).toContain('Version: v2');
    expect(items?.length).toBe(2);
    expect(header?.getAttribute('url')).toBe('http://localhost:3000/index.html');
    expect(el.shadowRoot?.querySelector('.service-name')).toBeNull();
    expect(el.shadowRoot?.querySelector('.versions-link')).toBeNull();
  });

  it('renders the catalog backlink when no versions are available', async () => {
    document.body.dataset.ppCatalogHref = '../../../../index.html';

    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const backlink = el.shadowRoot?.querySelector('.catalog-backlink');
    const backlinkIcon = backlink?.querySelector('sl-icon');
    const dropdown = el.shadowRoot?.querySelector('sl-dropdown');

    expect(backlink?.textContent).toContain('API Catalog');
    expect(backlinkIcon?.getAttribute('name')).toBe('arrow-90deg-up');
    expect(backlink?.getAttribute('href')).toBe('http://localhost:3000/index.html');
    expect(dropdown).toBeNull();
  });
});
