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

    const properties = el.shadowRoot?.querySelectorAll('.property');
    expect(properties?.length).toBe(2);

    const requiredBadge = el.shadowRoot?.querySelector('.required-badge');
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

    const heading = el.shadowRoot?.querySelector('h3');
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
});
