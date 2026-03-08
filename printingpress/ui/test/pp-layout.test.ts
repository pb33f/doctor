import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/pp-layout.js';

describe('pp-layout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render nav and content slots', async () => {
    const el = document.createElement('pp-layout');
    document.body.appendChild(el);
    await el.updateComplete;

    const slots = el.shadowRoot?.querySelectorAll('slot');
    expect(slots?.length).toBe(2);

    const slotNames = Array.from(slots || []).map((s) => s.getAttribute('name'));
    expect(slotNames).toContain('nav');
    expect(slotNames).toContain('content');
  });
});
