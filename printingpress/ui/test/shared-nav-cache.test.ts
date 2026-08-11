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

async function executePreview(contracts: unknown, overviewLabel = 'API OVERVIEW') {
  document.body.innerHTML = '<pp-nav id="pp-nav" data-active=""><div class="pp-nav-fallback">OLD LEGACY</div></pp-nav>';
  document.body.dataset.ppServiceName = 'Orders';
  document.body.dataset.ppOverviewLabel = overviewLabel;
  document.body.dataset.ppContracts = typeof contracts === 'string' ? contracts : JSON.stringify(contracts);
  const payload = {attributes: {'pp-nav': {
    'data-nav': JSON.stringify([{name: 'Operations', summary: '', children: null, operations: [], isNavOnly: false}]),
  }}};
  Object.defineProperty(globalThis, 'indexedDB', {configurable: true, value: indexedDBWith(payload)});
  delete (window as typeof window & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__;
  new Function(standaloneSource)();
  const bootstrap = (window as typeof window & {__PP_BOOTSTRAP__?: {sharedPromise?: Promise<unknown>}}).__PP_BOOTSTRAP__;
  await bootstrap?.sharedPromise;
  return document.getElementById('pp-nav') as HTMLElement;
}

function validContractState(activeContract: 'http' | 'events') {
  return [
    {role: 'http-api', label: 'HTTP API', contracts: [{
      id: 'http',
      label: 'Orders HTTP',
      specKind: 'openapi',
      href: 'index.html',
      active: activeContract === 'http',
      currentVersion: 'v2',
      versions: [{label: 'v2', href: 'index.html', active: true}, {label: 'v1', href: '../v1/index.html'}],
    }]},
    {role: 'events', label: 'Events', contracts: [{
      id: 'events',
      label: 'Orders Events',
      specKind: 'asyncapi',
      href: '../events/index.html',
      active: activeContract === 'events',
      currentVersion: 'v3',
      versions: [{label: 'v3', href: '../events/index.html', active: true}, {label: 'v1', href: '../events/v1/index.html'}],
    }]},
  ];
}

const valid = validContractState('http');

describe('standalone shared-cache contract preview', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete document.body.dataset.ppContracts;
    delete document.body.dataset.ppOverviewLabel;
    delete document.body.dataset.ppServiceName;
  });

  it.each([
    {name: 'API', activeContract: 'http' as const, activeLabel: 'Orders HTTP', currentVersion: 'v2', overviewLabel: 'API OVERVIEW'},
    {name: 'Event', activeContract: 'events' as const, activeLabel: 'Orders Events', currentVersion: 'v3', overviewLabel: 'EVENT OVERVIEW'},
  ])('renders the first valid $name contract skeleton under its active owner', async ({activeContract, activeLabel, currentVersion, overviewLabel}) => {
    const nav = await executePreview(validContractState(activeContract), overviewLabel);
    const preview = nav.querySelector('.pp-nav-preview');
    expect(preview?.textContent).not.toContain('OLD LEGACY');
    expect(preview?.textContent).toContain('Orders');
    expect(Array.from(preview?.querySelectorAll('.contract-role-heading') ?? []).map((node) => node.textContent)).toEqual(['HTTP API', 'Events']);
    expect(Array.from(preview?.querySelectorAll('.contract-link') ?? []).map((node) => node.textContent)).toEqual(['Orders HTTP', 'Orders Events']);
    const activeItems = Array.from(preview?.querySelectorAll('.contract-item.active') ?? []);
    expect(activeItems).toHaveLength(1);
    const activeItem = activeItems[0];
    expect(activeItem?.querySelector('.contract-link')?.textContent).toBe(activeLabel);
    expect(activeItem?.querySelector('.contract-link')?.getAttribute('aria-current')).toBe('page');
    expect(activeItem?.getAttribute('data-current-version')).toBe(currentVersion);
    expect(activeItem?.getAttribute('data-version-count')).toBe('2');
    expect(activeItem?.querySelector('.contract-local-navigation')?.textContent).toContain(overviewLabel);
    expect(preview?.querySelectorAll('.contract-local-navigation')).toHaveLength(1);
  });

  it.each([
    {name: 'malformed JSON', contracts: '['},
    {name: 'non-array root', contracts: {}},
    {name: 'null and primitive groups', contracts: [null, 3]},
    {name: 'missing group fields', contracts: [{contracts: [{}, {}]}]},
    {name: 'non-array contracts', contracts: [{role: 'http-api', label: 'HTTP API', contracts: {}}]},
    {name: 'one valid contract', contracts: [valid[0]]},
    {name: 'invalid contracts sanitize to one', contracts: [{role: 'http-api', label: 'HTTP API', contracts: [
      {id: 'http', label: 'HTTP', specKind: 'openapi', href: 'index.html', active: true},
      null,
      4,
      {id: '', label: 'Broken', specKind: 'asyncapi', href: 'events.html'},
    ]}]},
  ])('preserves legacy preview behavior for $name', async ({contracts}) => {
    const nav = await executePreview(contracts);
    expect(nav.querySelector('.contract-navigation')).toBeNull();
    expect(nav.querySelector('.nav-home')?.textContent).toContain('API OVERVIEW');
  });

  it('filters nested versions and selects exactly one deterministic current version', async () => {
    const contracts = structuredClone(valid);
    contracts[0]!.contracts[0] = {
      ...contracts[0]!.contracts[0],
      currentVersion: 'v1',
      versions: [
        null,
        7,
        {label: '', href: 'bad.html'},
        {label: 'v3', href: 'v3.html', active: 'true'},
        {label: 'v2', href: 'v2.html', active: true},
        {label: 'v1', href: 'v1.html', active: true},
      ],
    } as any;
    const nav = await executePreview(contracts);
    const active = nav.querySelector('.contract-item.active');
    expect(active?.getAttribute('data-current-version')).toBe('v2');
    expect(active?.getAttribute('data-version-count')).toBe('3');
  });

  it('uses currentVersion and then the first valid version when no explicit active version survives', async () => {
    const contracts = structuredClone(valid);
    contracts[0]!.contracts[0] = {
      ...contracts[0]!.contracts[0],
      currentVersion: 'v1',
      versions: [{label: 'v2', href: 'v2.html'}, {label: 'v1', href: 'v1.html'}],
    } as any;
    let nav = await executePreview(contracts);
    expect(nav.querySelector('.contract-item.active')?.getAttribute('data-current-version')).toBe('v1');

    contracts[0]!.contracts[0] = {
      ...contracts[0]!.contracts[0],
      currentVersion: 3,
      versions: [{label: 'v2', href: 'v2.html'}, {label: 'v1', href: 'v1.html'}],
    } as any;
    nav = await executePreview(contracts);
    expect(nav.querySelector('.contract-item.active')?.getAttribute('data-current-version')).toBe('v2');
  });
});
