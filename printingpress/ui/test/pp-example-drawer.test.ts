import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/code-viewer.js';
import '../src/components/shared/example-drawer.js';
import type { ShowExampleDetail } from '../src/components/shared/example-drawer.js';
import type { PpCodeViewer } from '../src/components/shared/code-viewer.js';

describe('pp-example-drawer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render pp-code-viewer with highlighted JSON when example event fires', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Test Example',
      json: '{"name": "test", "count": 42}',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer).toBeTruthy();
    await viewer!.updateComplete;

    // Prism should produce .token spans inside the viewer's shadow DOM
    const tokens = viewer!.shadowRoot?.querySelectorAll('.token');
    expect(tokens?.length).toBeGreaterThan(0);
  });

  it('should render no tokens when no event has fired', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer).toBeTruthy();
    await viewer!.updateComplete;

    const tokens = viewer!.shadowRoot?.querySelectorAll('.token');
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

    let viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.language).toBe('yaml');

    // Click JSON button
    const jsonBtn = el.shadowRoot?.querySelector('.format-toggle button:first-child') as HTMLButtonElement;
    jsonBtn?.click();
    await el.updateComplete;

    viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.language).toBe('json');
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

  // New tests for rawMode and highlightLines pass-through
  it('should pass line-numbers to code-viewer when rawMode is true', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Raw',
      json: '{"a":1}',
      rawMode: true,
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.lineNumbers).toBe(true);
  });

  it('should not set line-numbers on code-viewer when rawMode is false', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Example',
      json: '{"a":1}',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.lineNumbers).toBe(false);
  });

  it('should pass highlight-lines to code-viewer', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Highlighted',
      json: '{"a":1}\n{"b":2}\n{"c":3}',
      rawMode: true,
      highlightLines: '1-2',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.highlightLines).toBe('1-2');
  });

  it('should set pretty on code-viewer for JSON mode', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Pretty',
      json: '{"a":1}',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.pretty).toBe(true);
  });

  it('should set pretty on code-viewer for raw JSON mode too', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Raw',
      json: '{"a":1}',
      rawMode: true,
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.pretty).toBe(true);
  });

  it('should pass startLine to code-viewer', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Lines',
      json: '{"a":1}',
      rawMode: true,
      startLine: 42,
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.startLine).toBe(42);
  });

  it('should pass location to code-viewer', async () => {
    const el = document.createElement('pp-example-drawer');
    document.body.appendChild(el);
    await el.updateComplete;

    const detail: ShowExampleDetail = {
      title: 'Located',
      json: '{"a":1}',
      rawMode: true,
      location: '/specs/models.yaml',
    };
    document.dispatchEvent(new CustomEvent('pp-show-example', { detail }));
    await el.updateComplete;

    const viewer = el.shadowRoot?.querySelector('pp-code-viewer') as PpCodeViewer | null;
    expect(viewer?.location).toBe('/specs/models.yaml');
  });
});
