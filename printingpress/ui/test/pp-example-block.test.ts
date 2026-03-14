import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/example-block.js';

describe('pp-example-block', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render Prism-highlighted JSON inside details', async () => {
    const el = document.createElement('pp-example-block');
    el.setAttribute('name', 'Sample');
    el.setAttribute('example-json', '{"id": 1, "active": true}');
    document.body.appendChild(el);
    await el.updateComplete;

    const details = el.shadowRoot?.querySelector('details');
    expect(details).toBeTruthy();

    const summary = el.shadowRoot?.querySelector('summary');
    expect(summary?.textContent).toBe('Sample');

    // Prism should produce .token spans
    const tokens = el.shadowRoot?.querySelectorAll('.token');
    expect(tokens?.length).toBeGreaterThan(0);
  });

  it('should render nothing with invalid JSON', async () => {
    const el = document.createElement('pp-example-block');
    el.setAttribute('example-json', 'not-json');
    document.body.appendChild(el);
    await el.updateComplete;

    const details = el.shadowRoot?.querySelector('details');
    expect(details).toBeNull();
  });
});
