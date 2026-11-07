import {beforeEach, describe, expect, it} from 'vitest';
import '../src/components/shared/ref-list.js';

describe('pp-ref-list', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function renderedValues(el: HTMLElement & {updateComplete: Promise<unknown>}) {
    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.querySelector('pp-paginated-list') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    await list?.updateComplete;

    return list?.querySelector('.pp-paginated-list__values');
  }

  it('renders AsyncAPI operation refs with directional actions and wrapping paths', async () => {
    const el = document.createElement('pp-ref-list') as HTMLElement & {
      type: 'operations';
      heading: string;
      items: Array<{method: string; path: string; slug: string; operationId?: string}>;
      updateComplete: Promise<unknown>;
    };

    el.type = 'operations';
    el.heading = 'Consumed By';
    el.items = [
      {
        method: 'receive',
        path: 'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured',
        slug: 'receive-light-measurement',
        operationId: 'receiveLightMeasurement',
      },
      {
        method: 'send',
        path: 'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on',
        slug: 'turn-on',
      },
    ];

    const values = await renderedValues(el);
    const actions = values?.querySelectorAll('pp-asyncapi-action');
    const methods = values?.querySelectorAll<HTMLElement>('.operation-ref-method');
    const paths = values?.querySelectorAll('pp-render-operation-path');
    const titles = values?.querySelectorAll('.operation-ref-title');

    expect(actions?.length).toBe(2);
    expect(methods?.[0]?.style.justifyContent).toBe('flex-start');
    expect(methods?.[0]?.style.alignItems).toBe('baseline');
    expect(methods?.[0]?.style.lineHeight).toBe('1');
    expect(methods?.[0]?.style.minWidth).toBe('0');
    expect(actions?.[0]?.getAttribute('action')).toBe('receive');
    expect(actions?.[0]?.getAttribute('size')).toBe('small');
    expect(actions?.[1]?.getAttribute('action')).toBe('send');
    expect(values?.querySelector('pp-http-method')).toBeNull();
    expect(titles?.length).toBe(1);
    expect(titles?.[0]?.textContent).toBe('receiveLightMeasurement');
    expect((titles?.[0] as HTMLElement | undefined)?.style.lineHeight).toBe('1');
    expect(paths?.length).toBe(1);
    expect(paths?.[0]?.hasAttribute('nowrap')).toBe(false);
  });

  it('keeps operation refs on the same left edge as component ref icons', async () => {
    const operations = document.createElement('pp-ref-list') as HTMLElement & {
      type: 'operations';
      heading: string;
      items: Array<{method: string; path: string; slug: string; operationId?: string}>;
      updateComplete: Promise<unknown>;
    };
    operations.type = 'operations';
    operations.heading = 'Consumed By';
    operations.items = [{
      method: 'receive',
      path: 'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured',
      slug: 'receive-light-measurement',
      operationId: 'receiveLightMeasurement',
    }];

    const opValues = await renderedValues(operations);
    const opRow = opValues?.querySelector<HTMLElement>('.operation-ref-row');
    const opMethod = opValues?.querySelector<HTMLElement>('.operation-ref-method');

    expect(opRow?.style.display).toBe('grid');
    expect(opRow?.style.gridTemplateColumns).toBe('max-content minmax(0,1fr)');
    expect(opRow?.style.alignItems).toBe('baseline');
    expect(opRow?.style.paddingLeft).toBe('');
    expect(opMethod?.style.justifyContent).toBe('flex-start');
    expect(opMethod?.style.alignItems).toBe('baseline');
    expect(opMethod?.style.minWidth).toBe('0');

    const components = document.createElement('pp-ref-list') as HTMLElement & {
      type: 'components';
      heading: string;
      items: Array<{name: string; componentType: string; typeSlug: string; slug: string}>;
      updateComplete: Promise<unknown>;
    };
    components.type = 'components';
    components.heading = 'Referenced By';
    components.items = [{
      name: 'lightMeasured',
      componentType: 'schemas',
      typeSlug: 'schemas',
      slug: 'light-measured',
    }];

    const compValues = await renderedValues(components);
    const compRow = compValues?.querySelector<HTMLElement>('pp-model-icon')?.parentElement as HTMLElement | null;

    expect(compRow?.style.display).toBe('flex');
    expect(compRow?.style.paddingLeft).toBe('0px');
  });
});
