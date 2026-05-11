import {beforeEach, describe, expect, it} from 'vitest';
import {
  documentSharedAssetBaseURL,
  normalizeSharedAssetBaseURL,
  printingPressStaticAssetHref,
} from '../src/utils/static-assets.js';

describe('printing press static asset URLs', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-pp-shared-asset-base-url');
    document.body.removeAttribute('data-pp-shared-asset-base-url');
  });

  it('preserves local static URLs when no shared asset base URL is configured', () => {
    expect(printingPressStaticAssetHref('shoelace')).toBe('static/shoelace');
    expect(printingPressStaticAssetHref('/shoelace/assets/icons/x.svg')).toBe('static/shoelace/assets/icons/x.svg');
  });

  it('resolves Shoelace assets against the shared static root', () => {
    document.documentElement.setAttribute('data-pp-shared-asset-base-url', '/ppress/static/v1/');

    expect(documentSharedAssetBaseURL()).toBe('/ppress/static/v1');
    expect(printingPressStaticAssetHref('shoelace')).toBe('/ppress/static/v1/shoelace');
    expect(printingPressStaticAssetHref('shoelace/assets/icons/x.svg')).toBe('/ppress/static/v1/shoelace/assets/icons/x.svg');
  });

  it('preserves origin-root shared static mounts', () => {
    document.documentElement.setAttribute('data-pp-shared-asset-base-url', '/');

    expect(documentSharedAssetBaseURL()).toBe('/');
    expect(printingPressStaticAssetHref('shoelace')).toBe('/shoelace');
    expect(printingPressStaticAssetHref('shoelace/assets/icons/x.svg')).toBe('/shoelace/assets/icons/x.svg');
  });

  it('normalizes explicit shared roots before joining asset paths', () => {
    expect(normalizeSharedAssetBaseURL(' https://assets.example.com/ppress/static/v1/// ')).toBe(
      'https://assets.example.com/ppress/static/v1'
    );
    expect(normalizeSharedAssetBaseURL(' / ')).toBe('/');
    expect(printingPressStaticAssetHref('/shoelace/assets/icons/x.svg', 'https://assets.example.com/ppress/static/v1/')).toBe(
      'https://assets.example.com/ppress/static/v1/shoelace/assets/icons/x.svg'
    );
    expect(printingPressStaticAssetHref('/shoelace/assets/icons/x.svg', '/')).toBe('/shoelace/assets/icons/x.svg');
  });
});
