import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/operations/operation-page.js';

describe('pp-operation-page', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render operation JSON', async () => {
    const el = document.createElement('pp-operation-page');
    const opData = {
      summary: 'Get users',
      operationId: 'getUsers',
      parameters: [{ name: 'limit', in: 'query' }],
    };
    el.setAttribute('operation-json', JSON.stringify(opData));
    document.body.appendChild(el);
    await el.updateComplete;

    const pre = el.shadowRoot?.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre?.textContent).toContain('getUsers');
  });

  it('should render nothing without data', async () => {
    const el = document.createElement('pp-operation-page');
    document.body.appendChild(el);
    await el.updateComplete;

    const pre = el.shadowRoot?.querySelector('pre');
    expect(pre).toBeNull();
  });
});
