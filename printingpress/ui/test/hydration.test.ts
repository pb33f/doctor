import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';

const assetLoaderState = vi.hoisted(() => {
  const bodyData = new Map<string, string>();
  const responses = new Map<string, unknown>();
  const loadAsset = vi.fn((assetBase: string) => Promise.resolve(responses.get(assetBase) ?? null));
  return {
    bodyData,
    responses,
    loadAsset,
  };
});

const saddlebagState = vi.hoisted(() => {
  const bags = new Map<string, Map<string, unknown>>();

  function ensureBag(id: string) {
    let bag = bags.get(id);
    if (!bag) {
      bag = new Map<string, unknown>();
      bags.set(id, bag);
    }
    return bag;
  }

  const bagManager = {
    loadStatefulBags: vi.fn(() => Promise.resolve({db: undefined})),
    getBag: vi.fn((id: string) => {
      const bag = ensureBag(id);
      return {
        get: (key: string) => bag.get(key),
        set: (key: string, value: unknown) => bag.set(key, structuredClone(value)),
        reset: () => bag.clear(),
      };
    }),
  };

  return {
    bags,
    bagManager,
    ensureBag,
  };
});

vi.mock('../src/utils/asset-loader.js', () => ({
  getBodyData: (key: string) => {
    return assetLoaderState.bodyData.get(key) ?? '';
  },
  loadAsset: (assetBase: string) => assetLoaderState.loadAsset(assetBase),
}));

vi.mock('@pb33f/saddlebag', () => ({
  CreateBagManager: () => saddlebagState.bagManager,
}));

import '../src/components/nav/nav.js';
import '../src/components/models/model-page.js';
import '../src/components/shared/media-type-selector.js';
import type {PpModelPage} from '../src/components/models/model-page.js';
import {hydratePrintingPressPage} from '../src/utils/hydration.js';
import {resetRegistry} from '../src/utils/schema-registry.js';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function createIndexedDBStub() {
  return {
    open: () => {
      const request: {
        result?: { objectStoreNames: { contains: (name: string) => boolean }; close: () => void };
        onsuccess?: () => void;
        onerror?: () => void;
        onupgradeneeded?: () => void;
      } = {};
      queueMicrotask(() => {
        request.result = {
          objectStoreNames: {
            contains: (name: string) => name === 'bags',
          },
          close: () => {},
        };
        request.onsuccess?.();
      });
      return request;
    },
    deleteDatabase: () => {
      const request: {
        onsuccess?: () => void;
        onerror?: () => void;
        onblocked?: () => void;
      } = {};
      queueMicrotask(() => {
        request.onsuccess?.();
      });
      return request;
    },
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function sharedBagID(): string {
  return `printing-press:shared:${new URL('shared-asset', document.baseURI).href}`;
}

describe('printing-press hydration', () => {
  beforeAll(() => {
    if (!('ResizeObserver' in globalThis)) {
      (globalThis as typeof globalThis & {ResizeObserver: typeof ResizeObserverStub}).ResizeObserver = ResizeObserverStub;
    }
    if (!('IntersectionObserver' in globalThis)) {
      (globalThis as typeof globalThis & {IntersectionObserver: typeof IntersectionObserverStub}).IntersectionObserver = IntersectionObserverStub;
    }
    (globalThis as typeof globalThis & {indexedDB: ReturnType<typeof createIndexedDBStub>}).indexedDB = createIndexedDBStub();
  });

  beforeEach(() => {
    document.body.innerHTML = '<pp-nav id="pp-nav"></pp-nav><pp-model-page id="pp-model-page"></pp-model-page>';
    delete (globalThis as typeof globalThis & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__;
    assetLoaderState.bodyData.clear();
    assetLoaderState.bodyData.set('ppShared', 'shared-asset');
    assetLoaderState.bodyData.set('ppPage', 'page-asset');
    assetLoaderState.responses.clear();
    assetLoaderState.loadAsset.mockClear();
    saddlebagState.bags.clear();
    saddlebagState.bagManager.getBag.mockClear();
    saddlebagState.bagManager.loadStatefulBags.mockClear();
    resetRegistry();
  });

  it('waits for the shared registry before applying model payloads', async () => {
    const sharedPayload = deferred<any>();
    const pagePayload = deferred<any>();

    assetLoaderState.responses.set('shared-asset', sharedPayload.promise);
    assetLoaderState.responses.set('page-asset', pagePayload.promise);
    assetLoaderState.responses.set('base-model', {
      model: {
        name: 'Base',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'base',
        schemaJson: JSON.stringify({
          type: 'object',
          properties: {
            id: {type: 'string'},
          },
        }),
      },
    });

    const hydrationPromise = hydratePrintingPressPage();
    const modelPage = document.getElementById('pp-model-page') as PpModelPage;

    pagePayload.resolve({
      model: {
        name: 'Composite',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'composite',
        schemaJson: JSON.stringify({
          allOf: [
            {$ref: '#/components/schemas/Base'},
          ],
        }),
      },
    });

    await flushPromises();
    expect(modelPage.getAttribute('model-json')).toBeNull();

    sharedPayload.resolve({
      schemaRegistry: {
        'schemas/Base': {
          name: 'Base',
          componentType: 'schemas',
          typeSlug: 'schemas',
          slug: 'base',
          href: 'models/schemas/base.html',
          pageDataBase: 'base-model',
        },
      },
    });

    await hydrationPromise;
    await modelPage.updateComplete;

    const schemaProps = modelPage.shadowRoot?.querySelector('pp-schema-properties') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(schemaProps).toBeTruthy();

    let propertyNames: Array<string | undefined> = [];
    for (let i = 0; i < 5; i++) {
      await schemaProps.updateComplete;
      await flushPromises();
      propertyNames = Array.from(schemaProps.shadowRoot?.querySelectorAll('.prop-name') ?? [])
        .map((node) => node.textContent?.trim());
      if (propertyNames.includes('id')) {
        break;
      }
    }

    expect(modelPage.getAttribute('model-json')).toBeTruthy();
    expect(assetLoaderState.loadAsset).toHaveBeenCalledWith('base-model');
    expect(propertyNames).toContain('id');
  });

  it('waits for the shared registry before applying request body media types that preload refs', async () => {
    document.body.innerHTML = '<pp-nav id="pp-nav"></pp-nav><pp-media-type-selector id="pp-request-body-content"></pp-media-type-selector>';

    const sharedPayload = deferred<any>();
    const pagePayload = deferred<any>();

    assetLoaderState.responses.set('shared-asset', sharedPayload.promise);
    assetLoaderState.responses.set('page-asset', pagePayload.promise);
    assetLoaderState.responses.set('base-event-model', {
      model: {
        name: 'OCSFBaseEvent',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'ocsf-base-event',
        schemaJson: JSON.stringify({
          type: 'object',
          properties: {
            activity_id: {type: 'integer'},
          },
        }),
      },
    });

    const hydrationPromise = hydratePrintingPressPage();
    const requestBody = document.getElementById('pp-request-body-content') as HTMLElement & {
      updateComplete?: Promise<unknown>;
      shadowRoot?: ShadowRoot;
    };

    pagePayload.resolve({
      attributes: {
        'pp-request-body-content': {
          'content-json': JSON.stringify([{
            mediaType: 'application/json',
            isArray: true,
            itemsRef: {
              name: 'OCSFIngestEvent',
              componentType: 'schemas',
              typeSlug: 'schemas',
              slug: 'ocsf-ingest-event',
            },
            itemsSchemaJson: JSON.stringify({
              allOf: [
                {$ref: '#/components/schemas/OCSFBaseEvent'},
                {additionalProperties: true, type: 'object'},
              ],
              description: 'Concrete OCSF event payload accepted by the ingest endpoint.',
            }),
            mockJson: JSON.stringify([{activity_id: 1}]),
          }]),
        },
      },
    });

    await flushPromises();
    expect(requestBody.getAttribute('content-json')).toBeNull();

    sharedPayload.resolve({
      schemaRegistry: {
        'schemas/OCSFBaseEvent': {
          name: 'OCSFBaseEvent',
          componentType: 'schemas',
          typeSlug: 'schemas',
          slug: 'ocsf-base-event',
          href: 'models/schemas/ocsf-base-event.html',
          pageDataBase: 'base-event-model',
        },
      },
    });

    await hydrationPromise;
    await requestBody.updateComplete;

    let propertyNames: Array<string | undefined> = [];
    for (let i = 0; i < 5; i++) {
      await requestBody.updateComplete;
      await flushPromises();
      const schemaProps = requestBody.shadowRoot?.querySelector('pp-schema-properties') as HTMLElement & {
        updateComplete?: Promise<unknown>;
        shadowRoot?: ShadowRoot;
      } | null;
      if (schemaProps?.updateComplete) {
        await schemaProps.updateComplete;
      }
      propertyNames = Array.from(schemaProps?.shadowRoot?.querySelectorAll('.prop-name') ?? [])
        .map((node) => node.textContent?.trim());
      if (propertyNames.includes('activity_id')) {
        break;
      }
    }

    expect(requestBody.getAttribute('content-json')).toBeTruthy();
    expect(assetLoaderState.loadAsset).toHaveBeenCalledWith('base-event-model');
    expect(propertyNames).toContain('activity_id');
  });

  it('hydrates shared payload from the saddlebag cache before loading the shared asset', async () => {
    assetLoaderState.bodyData.set('ppSharedHash', 'hash-1');
    saddlebagState.ensureBag(sharedBagID()).set('shared-payload', {
      hash: 'hash-1',
      payload: {
        attributes: {
          'pp-nav': {
            'data-nav': JSON.stringify([{
              Name: 'Users',
              Summary: 'Users',
              Children: null,
              Operations: [],
              IsNavOnly: false,
            }]),
          },
        },
      },
    });

    await hydratePrintingPressPage();

    const nav = document.getElementById('pp-nav');
    expect(nav?.getAttribute('data-nav')).toContain('Users');
    expect(assetLoaderState.loadAsset.mock.calls.map((call) => call[0])).not.toContain('shared-asset');
  });

  it('invalidates a stale cached shared payload when the build hash changes', async () => {
    assetLoaderState.bodyData.set('ppSharedHash', 'hash-2');
    saddlebagState.ensureBag(sharedBagID()).set('shared-payload', {
      hash: 'hash-1',
      payload: {
        attributes: {
          'pp-nav': {
            'data-nav': JSON.stringify([{Name: 'Stale'}]),
          },
        },
      },
    });
    assetLoaderState.responses.set('shared-asset', {
      attributes: {
        'pp-nav': {
          'data-nav': JSON.stringify([{
            Name: 'Fresh',
            Summary: 'Fresh',
            Children: null,
            Operations: [],
            IsNavOnly: false,
          }]),
        },
      },
    });

    await hydratePrintingPressPage();

    const nav = document.getElementById('pp-nav');
    expect(nav?.getAttribute('data-nav')).toContain('Fresh');
    expect(assetLoaderState.loadAsset.mock.calls.map((call) => call[0])).toContain('shared-asset');
    expect(saddlebagState.ensureBag(sharedBagID()).get('shared-payload')).toEqual({
      hash: 'hash-2',
      payload: {
        attributes: {
          'pp-nav': {
            'data-nav': JSON.stringify([{
              Name: 'Fresh',
              Summary: 'Fresh',
              Children: null,
              Operations: [],
              IsNavOnly: false,
            }]),
          },
        },
      },
    });
  });
});
