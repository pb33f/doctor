import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';

const assetLoaderState = vi.hoisted(() => {
  const responses = new Map<string, unknown>();
  const loadAsset = vi.fn((assetBase: string) => Promise.resolve(responses.get(assetBase) ?? null));
  return {
    responses,
    loadAsset,
  };
});

vi.mock('../src/utils/asset-loader.js', () => ({
  getBodyData: (key: string) => {
    if (key === 'ppShared') return 'shared-asset';
    if (key === 'ppPage') return 'page-asset';
    return '';
  },
  loadAsset: (assetBase: string) => assetLoaderState.loadAsset(assetBase),
}));

import '../src/components/models/model-page.js';
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

describe('printing-press hydration', () => {
  beforeAll(() => {
    if (!('ResizeObserver' in globalThis)) {
      (globalThis as typeof globalThis & {ResizeObserver: typeof ResizeObserverStub}).ResizeObserver = ResizeObserverStub;
    }
    if (!('IntersectionObserver' in globalThis)) {
      (globalThis as typeof globalThis & {IntersectionObserver: typeof IntersectionObserverStub}).IntersectionObserver = IntersectionObserverStub;
    }
  });

  beforeEach(() => {
    document.body.innerHTML = '<pp-model-page id="pp-model-page"></pp-model-page>';
    assetLoaderState.responses.clear();
    assetLoaderState.loadAsset.mockClear();
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
});
