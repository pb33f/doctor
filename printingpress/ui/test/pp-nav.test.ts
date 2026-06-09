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

  it('renders conventional content pages before generated sections', async () => {
    document.body.dataset.ppBaseUrl = '/docs/';

    const pages = [
      {
        title: 'Quickstart',
        label: 'Start Here',
        slug: 'quickstart',
        href: 'quickstart.html',
      },
      {
        title: 'Service Guide',
        label: 'Guide',
        slug: 'guides/setup',
        href: 'guides/setup.html',
      },
    ];
    const navData = [
      {
        name: 'Users',
        summary: 'Users',
        children: null,
        operations: [],
        isNavOnly: false,
      },
    ];

    const el = document.createElement('pp-nav');
    el.setAttribute('data-pages', JSON.stringify(pages));
    el.setAttribute('data-nav', JSON.stringify(navData));
    el.setAttribute('data-active', 'content/guides/setup');
    document.body.appendChild(el);
    await el.updateComplete;

    const sectionHeadings = Array.from(el.shadowRoot?.querySelectorAll('.nav-section h4') || [])
      .map((heading) => heading.textContent?.trim());
    expect(sectionHeadings.slice(0, 2)).toEqual(['Guides', 'Operations']);

    const links = Array.from(el.shadowRoot?.querySelectorAll('.nav-page-link') || []);
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Start Here', 'Guide']);
    expect(links[0]?.getAttribute('href')).toBe('http://localhost:3000/docs/quickstart.html');
    expect(links[1]?.getAttribute('href')).toBe('http://localhost:3000/docs/guides/setup.html');
    expect(links[1]?.classList.contains('active')).toBe(true);
  });

  it('should render empty when no data', async () => {
    const el = document.createElement('pp-nav');
    document.body.appendChild(el);
    await el.updateComplete;

    const tagEls = el.shadowRoot?.querySelectorAll('pp-nav-tag');
    expect(tagEls?.length).toBe(0);
  });

  it('only shows guide fallback rows when content pages are expected', async () => {
    const empty = document.createElement('pp-nav');
    document.body.appendChild(empty);
    await empty.updateComplete;
    expect(empty.shadowRoot?.querySelector('.pp-nav-fallback-guides')).toBeNull();

    document.body.innerHTML = '';
    const withPages = document.createElement('pp-nav');
    withPages.setAttribute('data-has-content-pages', 'true');
    document.body.appendChild(withPages);
    await withPages.updateComplete;
    expect(withPages.shadowRoot?.querySelector('.pp-nav-fallback-guides')).not.toBeNull();
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

    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ppress:export',
      requestId: expect.any(Number),
      format: 'zip',
      diagnostics: false,
      llm: false,
    }), 'https://host.example');
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

    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ppress:export',
      requestId: expect.any(Number),
      format: 'zip',
      diagnostics: false,
      llm: false,
    }), 'https://doctor.example');
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

    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ppress:export',
      requestId: expect.any(Number),
      format: 'zip',
      diagnostics: false,
      llm: true,
    }), 'https://host.example');
  });

  it('shows a spinner and blocks duplicate hosted archive export requests until Doctor responds', async () => {
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
    await el.updateComplete;

    const request = postMessage.mock.calls[0]?.[0] as {requestId?: number} | undefined;
    expect(request?.requestId).toEqual(expect.any(Number));
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.textContent).not.toContain('export');
    expect(button?.querySelector('sl-spinner')).not.toBeNull();

    button?.click();
    expect(postMessage).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new MessageEvent('message', {
      data: {type: 'doctor:archive-export-complete', requestId: request?.requestId},
      origin: 'https://host.example',
      source: window.parent,
    }));
    await el.updateComplete;

    expect(button?.hasAttribute('disabled')).toBe(false);
    expect(button?.getAttribute('aria-busy')).toBe('false');
    expect(button?.textContent).toContain('export');
    expect(button?.querySelector('sl-spinner')).toBeNull();
  });

  it('keeps direct archive exports loading until the fetch-backed download finishes', async () => {
    const el = document.createElement('pp-nav');
    el.setAttribute('data-archive-export-url', '/_printing-press/export');
    document.body.appendChild(el);
    await el.updateComplete;

    let finishExport!: () => void;
    const exportPromise = new Promise<void>((resolve) => {
      finishExport = resolve;
    });
    const directExport = vi.spyOn(el as any, 'requestDirectArchiveExport').mockReturnValue(exportPromise);
    const button = el.shadowRoot?.querySelector('.archive-download-button') as HTMLElement | null;

    button?.click();
    await el.updateComplete;

    expect(directExport).toHaveBeenCalledWith('/_printing-press/export');
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.querySelector('sl-spinner')).not.toBeNull();

    button?.click();
    expect(directExport).toHaveBeenCalledTimes(1);

    finishExport();
    await exportPromise;
    await el.updateComplete;

    expect(button?.hasAttribute('disabled')).toBe(false);
    expect(button?.querySelector('sl-spinner')).toBeNull();
  });

  it('downloads direct archive exports with fetch so loading can track the response', async () => {
    const el = document.createElement('pp-nav') as any;
    document.body.appendChild(el);
    await el.updateComplete;
    el.includeDiagnostics = true;
    el.includeAIDocs = true;

    const response = new Response(new Blob(['archive']), {
      status: 200,
      headers: new Headers({'content-disposition': 'attachment; filename="docs.zip"'}),
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const createObjectURL = vi.fn(() => 'blob:docs');
    const revokeObjectURL = vi.fn();
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    Object.defineProperty(URL, 'createObjectURL', {configurable: true, value: createObjectURL});
    Object.defineProperty(URL, 'revokeObjectURL', {configurable: true, value: revokeObjectURL});

    try {
      await el.requestDirectArchiveExport('/_printing-press/export');
    } finally {
      Object.defineProperty(URL, 'createObjectURL', {configurable: true, value: originalCreateObjectURL});
      Object.defineProperty(URL, 'revokeObjectURL', {configurable: true, value: originalRevokeObjectURL});
    }

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/_printing-press/export?format=zip&diagnostics=1&llm=1',
      {method: 'GET', credentials: 'include'},
    );
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(clickSpy).toHaveBeenCalled();
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
