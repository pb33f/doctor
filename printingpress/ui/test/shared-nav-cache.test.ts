import {beforeEach, describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';

const standaloneSource = readFileSync('../render/bootstrap_scripts/shared_nav_cache.js', 'utf8')
  .replace('__PP_SHARED_BASE__', JSON.stringify('shared'))
  .replace('__PP_SHARED_HASH__', JSON.stringify('hash'));

function indexedDBWith(payload: unknown) {
  return {
    open: () => {
      const request: any = {};
      queueMicrotask(() => {
        request.result = {
          objectStoreNames: {contains: (name: string) => name === 'bags'},
          transaction: () => ({
            objectStore: () => ({
              get: () => {
                const getRequest: any = {};
                queueMicrotask(() => {
                  getRequest.result = new Map([['shared-payload', {hash: 'hash', payload}]]);
                  getRequest.onsuccess?.();
                });
                return getRequest;
              },
            }),
          }),
          close: () => {},
        };
        request.onsuccess?.();
      });
      return request;
    },
    deleteDatabase: () => ({onsuccess: undefined, onerror: undefined, onblocked: undefined}),
  };
}

interface PreviewOptions {
  contracts?: unknown;
  includeContractsAttribute?: boolean;
  hold?: boolean;
}

async function executePreview(options: PreviewOptions = {}) {
  document.body.innerHTML = '<pp-nav id="pp-nav" data-active=""><div class="pp-nav-fallback"><div data-server-fallback="true"><div class="pp-nav-fallback-home">SERVER OVERVIEW</div><div class="pp-nav-fallback-section">SERVER OPERATIONS</div></div></div></pp-nav>';
  document.body.dataset.ppServiceName = 'Orders';
  document.body.dataset.ppOverviewLabel = 'API OVERVIEW';
  if (options.includeContractsAttribute !== false && options.contracts !== undefined) {
    document.body.dataset.ppContracts = typeof options.contracts === 'string'
      ? options.contracts
      : JSON.stringify(options.contracts);
  } else {
    delete document.body.dataset.ppContracts;
  }
  window.history.replaceState({}, '', options.hold ? '/?pp-debug-nav-preview=1' : '/');

  const payload = {attributes: {'pp-nav': {
    'data-nav': JSON.stringify([{name: 'Operations', summary: '', children: null, operations: [], isNavOnly: false}]),
    'data-pages': JSON.stringify([{title: 'Guide', slug: 'guide', href: 'guide.html'}]),
  }}};
  Object.defineProperty(globalThis, 'indexedDB', {configurable: true, value: indexedDBWith(payload)});
  delete (window as typeof window & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__;
  const nav = document.getElementById('pp-nav') as HTMLElement;
  const fallback = nav.querySelector('.pp-nav-fallback');
  new Function(standaloneSource)();
  const bootstrap = (window as typeof window & {
    __PP_BOOTSTRAP__?: {sharedPromise?: Promise<unknown>; stopAtPreview?: boolean};
  }).__PP_BOOTSTRAP__;
  await bootstrap?.sharedPromise;
  return {nav, fallback, bootstrap};
}

function validContractState() {
  return [
    {role: 'http-api', label: 'HTTP API', contracts: [{
      id: 'http', label: 'Orders HTTP', specKind: 'openapi', href: 'index.html',
    }]},
    {role: 'events', label: 'Events', contracts: [{
      id: 'events', label: 'Orders Events', specKind: 'asyncapi', href: '../events/index.html',
    }]},
  ];
}

describe('standalone shared-cache navigation preview', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.removeAttribute('data-pp-contracts');
    document.body.removeAttribute('data-pp-overview-label');
    document.body.removeAttribute('data-pp-service-name');
    window.history.replaceState({}, '', '/');
    localStorage.clear();
  });

  it.each([
    {name: 'valid contracts with no active owner', contracts: validContractState()},
    {name: 'malformed contract JSON', contracts: '['},
    {name: 'an empty contract array', contracts: []},
  ])('applies cached attributes but retains the server fallback for $name', async ({contracts}) => {
    const {nav, fallback} = await executePreview({contracts});

    expect(nav.getAttribute('data-pp-nav-cached')).toBe('true');
    expect(JSON.parse(nav.getAttribute('data-nav') ?? '[]')).toHaveLength(1);
    expect(JSON.parse(nav.getAttribute('data-pages') ?? '[]')).toHaveLength(1);
    expect(nav.querySelector('.pp-nav-fallback')).toBe(fallback);
    expect(nav.querySelector('[data-server-fallback="true"]')?.textContent).toContain('SERVER OVERVIEW');
    expect(fallback?.classList.contains('pp-nav-preview')).toBe(true);
    expect(nav.hasAttribute('data-pp-preview-hold')).toBe(false);
  });

  it('holds the retained server fallback when contract-aware preview hold is requested', async () => {
    const {nav, fallback, bootstrap} = await executePreview({contracts: validContractState(), hold: true});

    expect(nav.querySelector('.pp-nav-fallback')).toBe(fallback);
    expect(nav.querySelector('[data-server-fallback="true"]')).toBeTruthy();
    expect(fallback?.classList.contains('pp-nav-preview')).toBe(true);
    expect(nav.getAttribute('data-pp-preview-hold')).toBe('true');
    expect(bootstrap?.stopAtPreview).toBe(true);
  });

  it('keeps the legacy cached local preview for a single-contract page without data-pp-contracts', async () => {
    const singleContract = [validContractState()[0]];
    const {nav, fallback} = await executePreview({contracts: singleContract, includeContractsAttribute: false});

    expect(nav.querySelector('.pp-nav-fallback')).not.toBe(fallback);
    expect(nav.querySelector('.pp-nav-preview')).toBeTruthy();
    expect(nav.querySelector('[data-server-fallback="true"]')).toBeNull();
    expect(nav.querySelector('.nav-home')?.textContent).toContain('API OVERVIEW');
    expect(nav.querySelector('.nav-pages-section')?.textContent).toContain('Guide');
  });
});
