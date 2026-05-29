import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '../src/components/shared/ref-popover.js';
import {
  resetRegistry,
  seedCachedSchemaModels,
  setSchemaRegistryEntries,
  type RegistryEntry,
} from '../src/utils/schema-registry.js';

describe('pp-ref-popover', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetRegistry();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetRegistry();
  });

  it('shows a popover when hovering a slotted schema reference link', async () => {
    const registry: Record<string, RegistryEntry> = {
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        href: 'models/schemas/note.html',
        pageDataBase: 'static/page-data/models/schemas/note',
        hasExample: true,
      },
    };
    setSchemaRegistryEntries(registry);
    seedCachedSchemaModels({
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        schemaJson: JSON.stringify({
          type: 'object',
          properties: {
            id: {type: 'string'},
          },
        }),
        mockJson: JSON.stringify({id: '123'}),
      },
    });

    const el = document.createElement('pp-ref-popover') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    el.setAttribute('schema-ref', '#/components/schemas/Note');

    const anchor = document.createElement('a');
    anchor.href = 'models/schemas/note.html';
    anchor.textContent = '-> Note';
    el.appendChild(anchor);

    document.body.appendChild(el);
    await el.updateComplete;
    await Promise.resolve();

    anchor.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true, composed: true}));
    await vi.advanceTimersByTimeAsync(300);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('sl-popup')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.pp-ref-popover-content')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('pp-icon-title')?.getAttribute('heading')).toBe('Note');
    const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
    expect(schemaProps?.hasAttribute('compact')).toBe(true);
    expect(schemaProps?.hasAttribute('condensed')).toBe(true);
    expect(schemaProps?.hasAttribute('constrained')).toBe(true);
    expect(schemaProps?.hasAttribute('popover')).toBe(false);
    expect(schemaProps?.hasAttribute('popover-context')).toBe(true);
  });

  it('stays open while moving into the popup and scrolling its contents', async () => {
    const registry: Record<string, RegistryEntry> = {
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        href: 'models/schemas/note.html',
        pageDataBase: 'static/page-data/models/schemas/note',
        hasExample: true,
      },
    };
    setSchemaRegistryEntries(registry);
    seedCachedSchemaModels({
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        schemaJson: JSON.stringify({
          type: 'object',
          properties: {
            id: {type: 'string'},
            description: {type: 'string'},
          },
        }),
        mockJson: JSON.stringify({id: '123', description: 'hello'}),
      },
    });

    const el = document.createElement('pp-ref-popover') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    el.setAttribute('schema-ref', '#/components/schemas/Note');

    const anchor = document.createElement('a');
    anchor.href = 'models/schemas/note.html';
    anchor.textContent = '-> Note';
    el.appendChild(anchor);

    document.body.appendChild(el);
    await el.updateComplete;
    await Promise.resolve();

    anchor.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true, composed: true}));
    await vi.advanceTimersByTimeAsync(300);
    await el.updateComplete;

    const popupContent = el.shadowRoot?.querySelector('.pp-ref-popover-content') as HTMLElement | null;
    expect(popupContent).toBeTruthy();

    anchor.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true, composed: true}));
    popupContent?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true, composed: true}));
    popupContent?.dispatchEvent(new WheelEvent('wheel', {bubbles: true, composed: true, deltaY: 120}));

    await vi.advanceTimersByTimeAsync(450);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('sl-popup')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.pp-ref-popover-content')).toBeTruthy();
  });

  it('grows the popover shell to fit wide rendered schema content', async () => {
    const registry: Record<string, RegistryEntry> = {
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        href: 'models/schemas/note.html',
        pageDataBase: 'static/page-data/models/schemas/note',
      },
    };
    setSchemaRegistryEntries(registry);
    seedCachedSchemaModels({
      'schemas/Note': {
        name: 'Note',
        componentType: 'schemas',
        typeSlug: 'schemas',
        slug: 'note',
        schemaJson: JSON.stringify({
          type: 'object',
          properties: {
            id: {type: 'string'},
          },
        }),
      },
    });

    const el = document.createElement('pp-ref-popover') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    el.setAttribute('schema-ref', '#/components/schemas/Note');
    const anchor = document.createElement('a');
    anchor.href = 'models/schemas/note.html';
    anchor.textContent = '-> Note';
    el.appendChild(anchor);
    document.body.appendChild(el);
    await el.updateComplete;
    await Promise.resolve();

    anchor.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true, composed: true}));
    await vi.advanceTimersByTimeAsync(300);
    await el.updateComplete;

    const popupContent = el.shadowRoot?.querySelector('.pp-ref-popover-content') as HTMLElement | null;
    expect(popupContent).toBeTruthy();

    Object.defineProperty(window, 'innerWidth', {value: 1000, configurable: true});
    Object.defineProperty(popupContent, 'scrollWidth', {value: 880, configurable: true});
    popupContent!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 650,
      bottom: 400,
      width: 650,
      height: 400,
      toJSON: () => ({}),
    });

    (el as any).measurePopoverWidth();
    await el.updateComplete;

    expect(popupContent?.getAttribute('style')).toContain('--ref-popover-width: 880px');

    Object.defineProperty(popupContent, 'scrollWidth', {value: 940, configurable: true});
    popupContent!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 880,
      bottom: 400,
      width: 880,
      height: 400,
      toJSON: () => ({}),
    });

    (el as any).measurePopoverWidth();
    await el.updateComplete;

    expect(popupContent?.getAttribute('style')).toContain('--ref-popover-width: 940px');
  });
});
