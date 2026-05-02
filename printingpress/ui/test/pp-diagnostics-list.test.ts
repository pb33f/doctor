import {beforeAll, beforeEach, describe, expect, it} from 'vitest';
import '../src/components/diagnostics/diagnostics-list.js';
import type {PpDiagnosticsList} from '../src/components/diagnostics/diagnostics-list.js';
import type {PageDeveloperPayload, PageProblem} from '../src/utils/page-payload.js';

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

function problem(overrides: Partial<PageProblem> = {}): PageProblem {
  return {
    category: 'rule',
    jsonPath: '$.components.schemas.Pet',
    endColumn: 1,
    endLineNumber: 12,
    message: 'property `pet_id` is snake_case not camelCase',
    severity: 4,
    startColumn: 9,
    startLineNumber: 12,
    source: 'vacuum',
    id: 'problem-1',
    sourceLocation: 'openapi.yaml',
    ...overrides,
  };
}

async function renderDiagnosticsList(payload: Partial<PageDeveloperPayload>) {
  (globalThis as typeof globalThis & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__ = {
    page: {
      developer: payload,
    },
  };

  const el = document.createElement('pp-diagnostics-list') as PpDiagnosticsList;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

describe('pp-diagnostics-list', () => {
  beforeAll(() => {
    if (!('ResizeObserver' in globalThis)) {
      (globalThis as typeof globalThis & {ResizeObserver: typeof ResizeObserverStub}).ResizeObserver = ResizeObserverStub;
    }
    if (!('IntersectionObserver' in globalThis)) {
      (globalThis as typeof globalThis & {IntersectionObserver: typeof IntersectionObserverStub}).IntersectionObserver = IntersectionObserverStub;
    }
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.dataset.ppDeveloperMode = 'true';
    document.body.dataset.ppBaseUrl = '/docs/';
    window.history.replaceState({}, '', '/');
    delete (globalThis as typeof globalThis & {__PP_BOOTSTRAP__?: unknown}).__PP_BOOTSTRAP__;
  });

  it('links problem text to the owning page target', async () => {
    const el = await renderDiagnosticsList({
      counts: {errors: 0, warns: 1, infos: 0},
      problems: [
        problem({
          pageHref: 'models/schemas/pet.html',
          pageTitle: 'Pet',
          pageKind: 'model',
          pageComponent: 'schemas',
        }),
      ],
      slices: {},
      metadata: {},
    });

    const messageLink = el.shadowRoot?.querySelector<HTMLAnchorElement>('.row .message-link');
    const targetLink = el.shadowRoot?.querySelector<HTMLAnchorElement>('.row .page');

    expect(messageLink?.getAttribute('href')).toBe('http://localhost:3000/docs/models/schemas/pet.html');
    expect(messageLink?.textContent?.trim()).toBe('property pet_id is snake_case not camelCase');
    expect(messageLink?.getAttribute('href')).toBe(targetLink?.getAttribute('href'));
  });

  it('uses problem metadata when the row does not carry a direct target', async () => {
    const el = await renderDiagnosticsList({
      counts: {errors: 0, warns: 1, infos: 0},
      problems: [problem({id: 'metadata-problem'})],
      slices: {},
      metadata: {
        'metadata-problem': {
          pageHref: 'operations/get-pets.html',
          pageTitle: 'get-pets',
          pageKind: 'operation',
          pageMethod: 'GET',
          pageOperationId: 'get-pets',
        },
      },
    });

    const messageLink = el.shadowRoot?.querySelector<HTMLAnchorElement>('.row .message-link');
    const targetLink = el.shadowRoot?.querySelector<HTMLAnchorElement>('.row .page');

    expect(messageLink?.getAttribute('href')).toBe('http://localhost:3000/docs/operations/get-pets.html');
    expect(messageLink?.getAttribute('href')).toBe(targetLink?.getAttribute('href'));
  });

  it('leaves unlinked problem text as plain text', async () => {
    const el = await renderDiagnosticsList({
      counts: {errors: 0, warns: 1, infos: 0},
      problems: [problem()],
      slices: {},
      metadata: {},
    });

    expect(el.shadowRoot?.querySelector('.row .message-link')).toBeNull();
    expect(el.shadowRoot?.querySelector('.row .message')).toBeTruthy();
  });
});
