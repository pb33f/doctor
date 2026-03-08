import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/pp-model-page.js';

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
});
