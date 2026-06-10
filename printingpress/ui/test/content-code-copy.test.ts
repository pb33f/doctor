import {describe, it, expect, beforeEach, vi} from 'vitest';
import {enhanceContentCodeBlocks} from '../src/utils/content-code-copy.js';

describe('content code copy enhancer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('adds copy controls only to custom content code blocks', () => {
    document.body.innerHTML = `
      <div class="pp-content-page-markdown">
        <pre><code>go test ./printingpress/...</code></pre>
      </div>
      <pre><code>outside custom content</code></pre>
    `;

    enhanceContentCodeBlocks();
    enhanceContentCodeBlocks();

    const wrappers = document.querySelectorAll('.pp-content-code-block');
    expect(wrappers).toHaveLength(1);
    expect(wrappers[0]?.querySelector('pre')?.textContent).toBe('go test ./printingpress/...');
    const copy = document.querySelector('.pp-content-code-copy') as HTMLButtonElement | null;
    expect(copy?.tagName).toBe('BUTTON');
    expect(copy?.querySelector('sl-icon')?.getAttribute('name')).toBe('copy');
    expect(document.querySelectorAll('body > pre[data-pp-copy-ready]')).toHaveLength(0);
  });

  it('copies the code block text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText},
      configurable: true,
    });
    document.body.innerHTML = `
      <div class="pp-content-page-markdown">
        <pre><code>go mod tidy</code></pre>
      </div>
    `;

    enhanceContentCodeBlocks();
    (document.querySelector('.pp-content-code-copy') as HTMLElement).click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith('go mod tidy');
  });

  it('falls back when clipboard writes are rejected', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText},
      configurable: true,
    });
    document.body.innerHTML = `
      <div class="pp-content-page-markdown">
        <pre><code>go test ./...</code></pre>
      </div>
    `;

    enhanceContentCodeBlocks();
    (document.querySelector('.pp-content-code-copy') as HTMLElement).click();
    await Promise.resolve();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith('go test ./...');
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});
