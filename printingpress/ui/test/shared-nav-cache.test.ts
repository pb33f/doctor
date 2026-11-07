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

// The server writes the nav. The cache script only hands pp-nav its data.
async function runCacheScript() {
  document.body.innerHTML = '<pp-nav id="pp-nav" data-active="" data-pp-ssr><a class="nav-home" data-server="true">API OVERVIEW</a></pp-nav>';
  const payload = {attributes: {'pp-nav': {
    'data-nav': JSON.stringify([{name: 'Operations', summary: '', children: null, operations: [], isNavOnly: false}]),
    'data-pages': JSON.stringify([{title: 'Guide', slug: 'guide', href: 'guide.html'}]),
  }}};
  Object.defineProperty(globalThis, 'indexedDB', {configurable: true, value: indexedDBWith(payload)});
  delete (window as typeof window & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__;
  const nav = document.getElementById('pp-nav') as HTMLElement;
  const written = nav.querySelector('[data-server="true"]');
  new Function(standaloneSource)();
  const bootstrap = (window as typeof window & {
    __PP_BOOTSTRAP__?: {sharedPromise?: Promise<unknown>; stopAtPreview?: boolean};
  }).__PP_BOOTSTRAP__;
  await bootstrap?.sharedPromise;
  return {nav, written, bootstrap};
}

describe('shared nav cache script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hands pp-nav the cached nav data and leaves the server-written nav alone', async () => {
    const {nav, written, bootstrap} = await runCacheScript();

    expect(nav.getAttribute('data-pp-nav-cached')).toBe('true');
    expect(JSON.parse(nav.getAttribute('data-nav') ?? '[]')).toHaveLength(1);
    expect(JSON.parse(nav.getAttribute('data-pages') ?? '[]')).toHaveLength(1);
    expect(nav.firstElementChild).toBe(written);
    expect(nav.children).toHaveLength(1);
    expect(nav.hasAttribute('data-pp-preview-hold')).toBe(false);
    expect(bootstrap?.stopAtPreview).toBeUndefined();
  });
});
