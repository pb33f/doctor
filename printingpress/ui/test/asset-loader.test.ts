import {beforeEach, describe, expect, it, vi} from 'vitest';
import {loadAsset, runtimeAssetHref} from '../src/utils/asset-loader.js';

describe('runtime asset loading', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete document.body.dataset.ppBaseUrl;
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });

  it('resolves served JSON assets from the explicit page root instead of the current nested page', async () => {
    window.history.replaceState(
      {},
      '',
      'http://localhost:3000/services/harbor/versions/1-2-3/specs/tide-charts-api/operations/log-voyage.html',
    );
    document.body.dataset.ppBaseUrl = '../';
    const response = new Response(JSON.stringify({ok: true}), {
      status: 200,
      headers: new Headers({'content-type': 'application/json'}),
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);

    await expect(loadAsset('data/pages/models/schemas/buoy', '__PP_PAGE_DATA__', 'served')).resolves.toEqual({ok: true});

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/services/harbor/versions/1-2-3/specs/tide-charts-api/data/pages/models/schemas/buoy.json',
    );
  });

  it('preserves relative runtime assets when no explicit page root is configured', () => {
    window.history.replaceState({}, '', 'http://localhost:3000/operations/log-voyage.html');

    expect(runtimeAssetHref('data/pages/models/schemas/buoy', '.json')).toBe('data/pages/models/schemas/buoy.json');
  });

  it('resolves root paths and preserves scheme URLs', () => {
    document.body.dataset.ppBaseUrl = '../';

    expect(runtimeAssetHref('/docs/data/nav', '.json')).toBe('http://localhost:3000/docs/data/nav.json');
    expect(runtimeAssetHref('https://assets.example.com/docs/data/nav', '.json')).toBe(
      'https://assets.example.com/docs/data/nav.json',
    );
  });
});
