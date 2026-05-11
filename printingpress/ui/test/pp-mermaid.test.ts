import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '../src/components/mermaid/mermaid.js';
import type {PpMermaid} from '../src/components/mermaid/mermaid.js';

class ResizeObserverStub {
    observe() {}
    disconnect() {}
}

describe('pp-mermaid', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
        (globalThis as unknown as {ResizeObserver: typeof ResizeObserver}).ResizeObserver =
            ResizeObserverStub as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('does not mark hidden diagrams as failed while waiting to render', () => {
        vi.useFakeTimers();
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
            callback(0);
            return 1;
        });

        const el = document.createElement('pp-mermaid') as PpMermaid;
        el.diagram = 'graph TD\nA-->B';
        (el as any).canRenderDiagram = () => false;
        (el as any).scheduleRenderer();

        for (let i = 0; i < 130; i++) {
            vi.runOnlyPendingTimers();
        }

        expect(el.hasAttribute('data-render-failed')).toBe(false);
        expect((el as any).rendererDiagram).toBe('');
    });

    it('renders source fallback inside the shadow root after renderer failures', async () => {
        vi.useFakeTimers();
        const el = document.createElement('pp-mermaid') as PpMermaid;
        const script = document.createElement('script');
        script.type = 'application/json';
        script.className = 'pp-mermaid-data';
        script.textContent = JSON.stringify('graph TD\nA-->');
        el.diagram = 'graph TD\nA-->';
        el.appendChild(script);
        document.body.appendChild(el);
        vi.runOnlyPendingTimers();
        await el.updateComplete;

        (el as any).setRenderFailed(true);
        await el.updateComplete;

        const fallback = el.shadowRoot?.querySelector('.pp-mermaid-fallback');
        expect(fallback?.textContent).toContain('graph TD');
        expect(fallback?.textContent).toContain('A-->');
    });

    it('decodes json script data without changing literal closing tags', async () => {
        vi.useFakeTimers();
        const el = document.createElement('pp-mermaid') as PpMermaid;
        const script = document.createElement('script');
        script.type = 'application/json';
        script.className = 'pp-mermaid-data';
        script.textContent = '"graph TD\\nA[\\"\\u003cb\\u003eLabel\\u003c/b\\u003e\\"]"';
        el.appendChild(script);
        document.body.appendChild(el);

        vi.runOnlyPendingTimers();
        await el.updateComplete;

        expect(el.diagram).toBe('graph TD\nA["<b>Label</b>"]');
    });
});
