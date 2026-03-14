import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/example-drawer.js';
import type { ShowExampleDetail } from '../src/components/shared/example-drawer.js';

describe('pp-example-drawer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render Prism-highlighted JSON when example event fires', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Test Example',
      json: '{"name": "test", "count": 42}',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const code = el.shadowRoot?.querySelector('pre.json code');
    expect(code).toBeTruthy();
    // Prism should produce .token spans
    const tokens = el.shadowRoot?.querySelectorAll('.token');
    expect(tokens?.length).toBeGreaterThan(0);
  });

  it('should render no tokens when no event has fired', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const tokens = el.shadowRoot?.querySelectorAll('.token');
    expect(tokens?.length).toBe(0);
  });

  it('should show format toggle when yaml is present', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Raw View',
      json: '{"a":1}',
      yaml: 'a: 1',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const toggle = el.shadowRoot?.querySelector('.format-toggle');
    expect(toggle).toBeTruthy();
    const buttons = el.shadowRoot?.querySelectorAll('.format-toggle button');
    expect(buttons?.length).toBe(2);
  });

  it('should not show format toggle when yaml is absent (example mode)', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Example Only',
      json: '{"a":1}',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const toggle = el.shadowRoot?.querySelector('.format-toggle');
    expect(toggle).toBeNull();
  });

  it('should default to JSON format when json is present', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Test',
      json: '{"b":2}',
      yaml: 'b: 2',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const jsonBtn = el.shadowRoot?.querySelector('.format-toggle button:first-child');
    expect(jsonBtn?.classList.contains('active')).toBe(true);
    const pre = el.shadowRoot?.querySelector('pre');
    expect(pre?.classList.contains('json')).toBe(true);
  });

  it('should default to YAML format when json is empty', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'YAML Only',
      json: '',
      yaml: 'c: 3',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const yamlBtn = el.shadowRoot?.querySelector('.format-toggle button:nth-child(2)');
    expect(yamlBtn?.classList.contains('active')).toBe(true);
    const pre = el.shadowRoot?.querySelector('pre');
    expect(pre?.classList.contains('yaml')).toBe(true);
  });

  it('should switch format when toggle buttons are clicked', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Toggle Test',
      json: '{"d":4}',
      yaml: 'd: 4',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    // Click YAML button
    const yamlBtn = el.shadowRoot?.querySelector('.format-toggle button:nth-child(2)') as HTMLButtonElement;
    yamlBtn?.click();
    await el.updateComplete;

    let pre = el.shadowRoot?.querySelector('pre');
    expect(pre?.classList.contains('yaml')).toBe(true);

    // Click JSON button
    const jsonBtn = el.shadowRoot?.querySelector('.format-toggle button:first-child') as HTMLButtonElement;
    jsonBtn?.click();
    await el.updateComplete;

    pre = el.shadowRoot?.querySelector('pre');
    expect(pre?.classList.contains('json')).toBe(true);
  });

  it('should disable JSON button when json is empty', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'No JSON',
      json: '',
      yaml: 'e: 5',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const jsonBtn = el.shadowRoot?.querySelector('.format-toggle button:first-child') as HTMLButtonElement;
    expect(jsonBtn?.disabled).toBe(true);
  });
});
