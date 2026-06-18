import {beforeEach, describe, expect, it} from 'vitest';
import {docHref, headerTitleHref, modelHref, operationHref, overviewHref} from '../src/utils/doc-links.js';

describe('doc-links', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/');
  });

  it('resolves document links against the configured page base', () => {
    document.body.dataset.ppBaseUrl = '/harbor/';

    expect(overviewHref()).toBe('http://localhost:3000/harbor/index.html');
    expect(operationHref('get-tide')).toBe('http://localhost:3000/harbor/operations/get-tide.html');
    expect(modelHref('schemas', 'buoy')).toBe('http://localhost:3000/harbor/models/schemas/buoy.html');
    expect(docHref('tags/tides.html')).toBe('http://localhost:3000/harbor/tags/tides.html');
  });

  it('falls back to the document base when no explicit page base is set', () => {
    document.head.innerHTML = '<base href="/harbor/">';

    expect(overviewHref()).toBe('http://localhost:3000/harbor/index.html');
    expect(operationHref('get-tide')).toBe('http://localhost:3000/harbor/operations/get-tide.html');
    expect(modelHref('schemas', 'buoy')).toBe('http://localhost:3000/harbor/models/schemas/buoy.html');
  });

  it('resolves portable nested pages against the relative page base', () => {
    window.history.replaceState({}, '', 'http://localhost:3000/operations/get-health.html');
    document.body.dataset.ppBaseUrl = '../';

    expect(overviewHref()).toBe('http://localhost:3000/index.html');
    expect(operationHref('get-health')).toBe('http://localhost:3000/operations/get-health.html');
    expect(modelHref('schemas', 'buoy')).toBe('http://localhost:3000/models/schemas/buoy.html');
  });

  it('prefers the configured overview href when present', () => {
    window.history.replaceState({}, '', 'http://localhost:3000/services/users/versions/v2/specs/users/operations/list-health.html');
    document.body.dataset.ppBaseUrl = '../';
    document.body.dataset.ppOverviewHref = '../../../../index.html';

    expect(overviewHref()).toBe('http://localhost:3000/services/users/index.html');
  });

  it('prefers the configured catalog href for the header title when present', () => {
    window.history.replaceState({}, '', 'http://localhost:3000/services/users/versions/v2/specs/users/operations/list-health.html');
    document.body.dataset.ppBaseUrl = '../';
    document.body.dataset.ppCatalogHref = '../../../../../../index.html';
    document.body.dataset.ppOverviewHref = '../../../../index.html';

    expect(headerTitleHref()).toBe('http://localhost:3000/index.html');
    expect(overviewHref()).toBe('http://localhost:3000/services/users/index.html');
  });

  it('preserves literal hrefs', () => {
    document.body.dataset.ppBaseUrl = '/harbor/';

    expect(docHref('#responses')).toBe('#responses');
    expect(docHref('/harbor/index.html')).toBe('/harbor/index.html');
    expect(docHref('https://example.com/docs')).toBe('https://example.com/docs');
    expect(docHref('mailto:docs@example.com')).toBe('mailto:docs@example.com');
  });
});
