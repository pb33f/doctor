import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/components/shared/raw-viewer-btn.js';

describe('pp-raw-viewer-btn', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render an sl-button when raw-json is set', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-json', '{"a":1}');
    document.body.appendChild(el);
    await el.updateComplete;

    const btn = el.shadowRoot?.querySelector('sl-button');
    expect(btn).toBeTruthy();
  });

  it('should render an sl-button when raw-yaml is set', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-yaml', 'a: 1');
    document.body.appendChild(el);
    await el.updateComplete;

    const btn = el.shadowRoot?.querySelector('sl-button');
    expect(btn).toBeTruthy();
  });

  it('should render nothing when both are empty', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    document.body.appendChild(el);
    await el.updateComplete;

    const btn = el.shadowRoot?.querySelector('sl-button');
    expect(btn).toBeNull();
  });

  it('should dispatch pp-show-example with json and yaml', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('title', 'Test Title');
    el.setAttribute('raw-json', '{"x":1}');
    el.setAttribute('raw-yaml', 'x: 1');
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    document.addEventListener('pp-show-example', handler);

    const btn = el.shadowRoot?.querySelector('sl-button') as HTMLElement;
    btn?.click();

    expect(handler).toHaveBeenCalledOnce();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.title).toBe('Test Title');
    expect(detail.json).toBe('{"x":1}');
    expect(detail.yaml).toBe('x: 1');

    document.removeEventListener('pp-show-example', handler);
  });

  it('should dispatch pp-show-example with rawMode true', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-json', '{"a":1}');
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    document.addEventListener('pp-show-example', handler);

    const btn = el.shadowRoot?.querySelector('sl-button') as HTMLElement;
    btn?.click();

    expect(handler).toHaveBeenCalledOnce();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.rawMode).toBe(true);

    document.removeEventListener('pp-show-example', handler);
  });

  it('should pass highlight-lines through to event detail', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-json', '{"a":1}');
    el.setAttribute('highlight-lines', '3-5');
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    document.addEventListener('pp-show-example', handler);

    const btn = el.shadowRoot?.querySelector('sl-button') as HTMLElement;
    btn?.click();

    expect(handler).toHaveBeenCalledOnce();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.highlightLines).toBe('3-5');

    document.removeEventListener('pp-show-example', handler);
  });

  it('should pass start-line through to event detail', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-json', '{"a":1}');
    el.setAttribute('start-line', '42');
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    document.addEventListener('pp-show-example', handler);

    const btn = el.shadowRoot?.querySelector('sl-button') as HTMLElement;
    btn?.click();

    expect(handler).toHaveBeenCalledOnce();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.startLine).toBe(42);

    document.removeEventListener('pp-show-example', handler);
  });

  it('should pass location through to event detail', async () => {
    const el = document.createElement('pp-raw-viewer-btn');
    el.setAttribute('raw-json', '{"a":1}');
    el.setAttribute('location', '/specs/models.yaml');
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    document.addEventListener('pp-show-example', handler);

    const btn = el.shadowRoot?.querySelector('sl-button') as HTMLElement;
    btn?.click();

    expect(handler).toHaveBeenCalledOnce();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.location).toBe('/specs/models.yaml');

    document.removeEventListener('pp-show-example', handler);
  });
});
