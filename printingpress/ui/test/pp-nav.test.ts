import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/components/nav/nav.js';
import '../src/components/nav/nav-tag.js';
import '@pb33f/cowboy-components/components/http-method/http-method.js';

describe('pp-nav', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete document.body.dataset.ppBaseUrl;
    window.history.replaceState({}, '', '/');
  });

  it('should render with nav data', async () => {
    const navData = [
      {
        Name: 'Users',
        Summary: '',
        Children: null,
        Operations: [
          {
            Method: 'GET',
            Path: '/users',
            OperationID: 'getUsers',
            Summary: 'List users',
            Slug: 'getusers',
            Deprecated: false,
          },
        ],
        IsNavOnly: false,
      },
    ];

    const el = document.createElement('pp-nav');
    el.setAttribute('data-nav', JSON.stringify(navData));
    document.body.appendChild(el);
    await el.updateComplete;

    const homeLink = el.shadowRoot?.querySelector('.nav-home');
    expect(homeLink).toBeTruthy();
    expect(homeLink?.getAttribute('href')).toBe('http://localhost:3000/index.html');

    const tagEls = el.shadowRoot?.querySelectorAll('pp-nav-tag');
    expect(tagEls?.length).toBe(1);
  });

  it('resolves internal links against the configured page base on nested pages', async () => {
    document.body.dataset.ppBaseUrl = '/findings/';

    const navData = [
      {
        Name: 'Users',
        Summary: 'Users',
        Children: null,
        Operations: [
          {
            Method: 'GET',
            Path: '/users',
            OperationID: 'getUsers',
            Summary: 'List users',
            Slug: 'getusers',
            Deprecated: false,
          },
        ],
        IsNavOnly: false,
      },
    ];

    const el = document.createElement('pp-nav');
    el.setAttribute('data-nav', JSON.stringify(navData));
    el.setAttribute('data-active', 'getusers');
    document.body.appendChild(el);
    await el.updateComplete;

    const homeLink = el.shadowRoot?.querySelector('.nav-home');
    expect(homeLink?.getAttribute('href')).toBe('http://localhost:3000/findings/index.html');
  });

  it('should render empty when no data', async () => {
    const el = document.createElement('pp-nav');
    document.body.appendChild(el);
    await el.updateComplete;

    const tagEls = el.shadowRoot?.querySelectorAll('pp-nav-tag');
    expect(tagEls?.length).toBe(0);
  });

  it('uses the archive controls sender origin when requesting exports', async () => {
    const el = document.createElement('pp-nav');
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new MessageEvent('message', {
      data: {type: 'doctor:archive-controls', enabled: true},
      origin: 'https://host.example',
      source: window.parent,
    }));
    await el.updateComplete;

    const postMessage = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {});
    const button = el.shadowRoot?.querySelector('.archive-download-button') as HTMLElement | null;
    button?.click();

    expect(postMessage).toHaveBeenCalledWith({
      type: 'ppress:export',
      format: 'zip',
      diagnostics: false,
      llm: false,
    }, 'https://host.example');
  });

  it('prefers hosted archive export over a direct export URL when embedded by Doctor', async () => {
    const el = document.createElement('pp-nav');
    el.setAttribute('data-archive-export-url', '/ppress/docs/doc-1/export');
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new MessageEvent('message', {
      data: {type: 'doctor:archive-controls', enabled: true},
      origin: 'https://doctor.example',
      source: window.parent,
    }));
    await el.updateComplete;

    const postMessage = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {});
    const directExport = vi.spyOn(el as any, 'requestDirectArchiveExport');
    const button = el.shadowRoot?.querySelector('.archive-download-button') as HTMLElement | null;
    button?.click();

    expect(postMessage).toHaveBeenCalledWith({
      type: 'ppress:export',
      format: 'zip',
      diagnostics: false,
      llm: false,
    }, 'https://doctor.example');
    expect(directExport).not.toHaveBeenCalled();
  });

  it('does not navigate to the direct export URL while embedded before hosted controls arrive', async () => {
    const el = document.createElement('pp-nav');
    el.setAttribute('data-archive-export-url', '/ppress/docs/doc-1/export');
    document.body.appendChild(el);
    await el.updateComplete;

    vi.spyOn(el as any, 'isEmbeddedInHost').mockReturnValue(true);
    const directExport = vi.spyOn(el as any, 'requestDirectArchiveExport');
    const button = el.shadowRoot?.querySelector('.archive-download-button') as HTMLElement | null;
    button?.click();

    expect(directExport).not.toHaveBeenCalled();
  });

  it('sends the llm archive option when AI docs are included', async () => {
    const el = document.createElement('pp-nav');
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new MessageEvent('message', {
      data: {type: 'doctor:archive-controls', enabled: true},
      origin: 'https://host.example',
      source: window.parent,
    }));
    await el.updateComplete;

    const checkboxes = Array.from(el.shadowRoot?.querySelectorAll('sl-checkbox') || []);
    const aiDocs = checkboxes.find((checkbox) => checkbox.textContent?.trim() === 'AI docs?') as
      | (HTMLElement & {checked: boolean})
      | undefined;
    expect(aiDocs).toBeTruthy();
    if (!aiDocs) {
      return;
    }
    aiDocs.checked = true;
    aiDocs.dispatchEvent(new Event('sl-change'));
    await el.updateComplete;

    const postMessage = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {});
    const button = el.shadowRoot?.querySelector('.archive-download-button') as HTMLElement | null;
    button?.click();

    expect(postMessage).toHaveBeenCalledWith({
      type: 'ppress:export',
      format: 'zip',
      diagnostics: false,
      llm: true,
    }, 'https://host.example');
  });

  it('renders archive option labels with explanatory tooltips', async () => {
    const el = document.createElement('pp-nav');
    el.setAttribute('data-archive-export-url', '/_printing-press/export');
    document.body.appendChild(el);
    await el.updateComplete;

    const title = el.shadowRoot?.querySelector('.host-archive-controls-title');
    expect(title?.textContent?.trim()).toBe('export documentation');

    const tooltips = Array.from(el.shadowRoot?.querySelectorAll('sl-tooltip.archive-option-tooltip') || []);
    expect(tooltips.map((tooltip) => tooltip.getAttribute('content'))).toEqual([
      'INCLUDE QUALITY DIAGNOSTICS IN GENERATED DOCS',
      'INCLUDE llms.txt & AGENTIC READY VERSION OF DOCUMENTATION',
    ]);

    const labels = Array.from(el.shadowRoot?.querySelectorAll('sl-checkbox') || [])
      .map((checkbox) => checkbox.textContent?.trim());
    expect(labels).toEqual(['diagnostics?', 'AI docs?']);
  });

  it('renders archive controls when a direct export URL is configured', async () => {
    const el = document.createElement('pp-nav');
    el.setAttribute('data-archive-export-url', '/_printing-press/export');
    document.body.appendChild(el);
    await el.updateComplete;

    const controls = el.shadowRoot?.querySelector('.host-archive-controls');
    expect(controls).toBeTruthy();
  });
});
