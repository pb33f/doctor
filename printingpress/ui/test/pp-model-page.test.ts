import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/models/model-page.js';

describe('pp-model-page', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render schema properties', async () => {
    const el = document.createElement('pp-model-page');
    const schema = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'User name' },
        email: { type: 'string' },
      },
    };
    el.setAttribute('model-json', JSON.stringify(schema));
    el.setAttribute('name', 'User');
    document.body.appendChild(el);
    await el.updateComplete;

    const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
    expect(schemaProps).toBeTruthy();
    await (schemaProps as any)?.updateComplete;

    const properties = schemaProps?.shadowRoot?.querySelectorAll('.property');
    expect(properties?.length).toBe(2);

    const requiredBadge = schemaProps?.shadowRoot?.querySelector('.required-badge');
    expect(requiredBadge).toBeTruthy();
  });

  it('should show type information', async () => {
    const el = document.createElement('pp-model-page');
    el.setAttribute('model-json', JSON.stringify({ type: 'string', enum: ['a', 'b'] }));
    document.body.appendChild(el);
    await el.updateComplete;

    const content = el.shadowRoot?.textContent;
    expect(content).toContain('string');
  });

  it('should show Composition heading for allOf-only schema', async () => {
    const el = document.createElement('pp-model-page');
    const schema = {
      allOf: [
        { $ref: '#/components/schemas/Base' },
        { properties: { extra: { type: 'string' } } },
      ],
    };
    el.setAttribute('model-json', JSON.stringify(schema));
    document.body.appendChild(el);
    await el.updateComplete;

    const heading = el.shadowRoot?.querySelector('h2');
    expect(heading?.textContent).toBe('Composition');

    const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
    expect(schemaProps).toBeTruthy();
  });

  it('should not render schema dump in shadow DOM (moved to chroma light DOM)', async () => {
    const el = document.createElement('pp-model-page');
    el.setAttribute('model-json', JSON.stringify({ type: 'object', properties: { id: { type: 'integer' } } }));
    document.body.appendChild(el);
    await el.updateComplete;

    const pre = el.shadowRoot?.querySelector('pre');
    expect(pre).toBeNull();
  });

  it('should render content-bearing models with the media type selector', async () => {
    const el = document.createElement('pp-model-page');
    el.setAttribute('model-json', JSON.stringify({
      description: 'Accepted response',
      content: [{
        mediaType: 'application/json',
        schemaJson: JSON.stringify({
          type: 'object',
          required: ['requestId'],
          properties: {
            requestId: { type: 'string' },
          },
        }),
      }],
    }));
    document.body.appendChild(el);
    await el.updateComplete;

    const mediaTypeSelector = el.shadowRoot?.querySelector('pp-media-type-selector') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(mediaTypeSelector).toBeTruthy();
    await mediaTypeSelector.updateComplete;

    const schemaProps = mediaTypeSelector.shadowRoot?.querySelector('pp-schema-properties') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(schemaProps).toBeTruthy();
    await schemaProps.updateComplete;

    const properties = schemaProps.shadowRoot?.querySelectorAll('.property');
    expect(properties?.length).toBe(1);
  });

  it('should render raw response component content maps with the media type selector', async () => {
    const el = document.createElement('pp-model-page');
    el.setAttribute('model-json', JSON.stringify({
      description: 'Bad request response',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
            type: 'object',
            properties: {
              code: { type: 'string' },
            },
          },
        },
      },
    }));
    document.body.appendChild(el);
    await el.updateComplete;

    const mediaTypeSelector = el.shadowRoot?.querySelector('pp-media-type-selector') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(mediaTypeSelector).toBeTruthy();
    await mediaTypeSelector.updateComplete;

    const schemaProps = mediaTypeSelector.shadowRoot?.querySelector('pp-schema-properties') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(schemaProps).toBeTruthy();
    await schemaProps.updateComplete;

    const properties = schemaProps.shadowRoot?.querySelectorAll('.property');
    expect(properties?.length).toBe(1);

    const refLink = mediaTypeSelector.shadowRoot?.querySelector('.ref-link');
    expect(refLink).toBeNull();
  });

  it('should render example components with the shared example selector', async () => {
    const el = document.createElement('pp-model-page');
    el.setAttribute('model-json', JSON.stringify({
      summary: 'Finding example',
      value: {
        id: 'finding-1',
        status: 'open',
      },
    }));
    document.body.appendChild(el);
    await el.updateComplete;

    const exampleSelector = el.shadowRoot?.querySelector('pp-example-selector') as HTMLElement & {
      updateComplete?: Promise<unknown>;
    };
    expect(exampleSelector).toBeTruthy();
    await exampleSelector.updateComplete;

    expect(exampleSelector.getAttribute('mock-json')).toContain('finding-1');
  });
});
