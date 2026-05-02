import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/code-viewer.js';
import type { PpCodeViewer } from '../src/components/shared/code-viewer.js';

function create(): PpCodeViewer {
    const el = document.createElement('pp-code-viewer') as PpCodeViewer;
    document.body.appendChild(el);
    return el;
}

describe('pp-code-viewer', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    // Basic rendering
    it('should render highlighted code without line numbers by default', async () => {
        const el = create();
        el.code = '{"a": 1}';
        el.language = 'json';
        await el.updateComplete;

        const pre = el.shadowRoot?.querySelector('pre');
        expect(pre).toBeTruthy();
        const tokens = el.shadowRoot?.querySelectorAll('.token');
        expect(tokens?.length).toBeGreaterThan(0);
        // No gutter in plain mode
        const lineNumbers = el.shadowRoot?.querySelectorAll('.line-number');
        expect(lineNumbers?.length).toBe(0);
    });

    it('should render highlighted mermaid source', async () => {
        const el = create();
        el.code = 'classDiagram\nclass Card {\n  +string name\n}';
        el.language = 'mermaid';
        await el.updateComplete;

        const pre = el.shadowRoot?.querySelector('pre.language-mermaid');
        expect(pre).toBeTruthy();
        const tokens = el.shadowRoot?.querySelectorAll('.token');
        expect(tokens?.length).toBeGreaterThan(0);
        expect(el.shadowRoot?.querySelector('.token.class-name')?.textContent).toBe('Card');
        expect(el.shadowRoot?.querySelector('.token.builtin')?.textContent).toBe('string');
        expect(el.shadowRoot?.querySelector('.token.property')?.textContent).toBe('name');
    });

    it('should render line numbers when line-numbers attribute is set', async () => {
        const el = create();
        el.code = '{"a": 1}\n{"b": 2}';
        el.language = 'json';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        expect(lineNums?.length).toBe(2);
        expect(lineNums?.[0].textContent).toBe('1');
        expect(lineNums?.[1].textContent).toBe('2');
    });

    it('should render correct number of lines matching content', async () => {
        const el = create();
        el.code = 'line1\nline2\nline3\nline4';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.length).toBe(4);
    });

    it('should render no tokens when code is empty', async () => {
        const el = create();
        await el.updateComplete;

        const tokens = el.shadowRoot?.querySelectorAll('.token');
        expect(tokens?.length).toBe(0);
    });

    // Interactive line selection
    it('should highlight a line when its number is clicked', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[1] as HTMLElement)?.click();
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[1].classList.contains('highlighted')).toBe(true);
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
    });

    it('should deselect when clicking the only selected line again', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[0] as HTMLElement)?.click();
        await el.updateComplete;

        let lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(true);

        (lineNums?.[0] as HTMLElement)?.click();
        await el.updateComplete;

        lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
    });

    it('should highlight a range with shift+click', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3\nd: 4\ne: 5';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[1] as HTMLElement)?.click();
        await el.updateComplete;

        (lineNums?.[3] as HTMLElement)?.dispatchEvent(
            new MouseEvent('click', { shiftKey: true, bubbles: true })
        );
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
        expect(lines?.[1].classList.contains('highlighted')).toBe(true);
        expect(lines?.[2].classList.contains('highlighted')).toBe(true);
        expect(lines?.[3].classList.contains('highlighted')).toBe(true);
        expect(lines?.[4].classList.contains('highlighted')).toBe(false);
    });

    // Pre-defined highlights
    it('should pre-highlight lines from highlight-lines attribute', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.highlightLines = '2';
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
        expect(lines?.[1].classList.contains('highlighted')).toBe(true);
        expect(lines?.[2].classList.contains('highlighted')).toBe(false);
    });

    it('should disable click selection when highlight-lines is set', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.highlightLines = '2';
        await el.updateComplete;

        // Click line 1 — should have no effect
        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[0] as HTMLElement)?.click();
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
        expect(lines?.[1].classList.contains('highlighted')).toBe(true);
    });

    it('should add locked class when highlight-lines is set', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.highlightLines = '1';
        await el.updateComplete;

        const container = el.shadowRoot?.querySelector('.lined-code');
        expect(container?.classList.contains('locked')).toBe(true);
    });

    it('should parse comma-separated highlight specs', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3\nd: 4\ne: 5\nf: 6\ng: 7\nh: 8';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.highlightLines = '1,3-5,8';
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(true);  // 1
        expect(lines?.[1].classList.contains('highlighted')).toBe(false); // 2
        expect(lines?.[2].classList.contains('highlighted')).toBe(true);  // 3
        expect(lines?.[3].classList.contains('highlighted')).toBe(true);  // 4
        expect(lines?.[4].classList.contains('highlighted')).toBe(true);  // 5
        expect(lines?.[5].classList.contains('highlighted')).toBe(false); // 6
        expect(lines?.[6].classList.contains('highlighted')).toBe(false); // 7
        expect(lines?.[7].classList.contains('highlighted')).toBe(true);  // 8
    });

    // State management
    it('should reset selection when code property changes', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[0] as HTMLElement)?.click();
        await el.updateComplete;

        let lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(true);

        // Change code — selection should reset
        el.code = 'x: 9\ny: 8';
        await el.updateComplete;

        lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
    });

    it('should reset selection when language property changes', async () => {
        const el = create();
        el.code = '{"a": 1}';
        el.language = 'json';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        (lineNums?.[0] as HTMLElement)?.click();
        await el.updateComplete;

        let lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(true);

        el.language = 'yaml';
        await el.updateComplete;

        lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.[0].classList.contains('highlighted')).toBe(false);
    });

    // Multi-line token safety
    it('should produce balanced HTML for each line when YAML has block scalars', async () => {
        const el = create();
        el.code = 'description: |\n  line one\n  line two\nname: test';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lines = el.shadowRoot?.querySelectorAll('.line');
        expect(lines?.length).toBe(4);
        lines?.forEach(line => {
            const content = line.querySelector('.line-content')?.innerHTML || '';
            const opens = (content.match(/<span/g) || []).length;
            const closes = (content.match(/<\/span>/g) || []).length;
            expect(opens).toBe(closes);
        });
    });

    // Pretty-print mode
    it('should pretty-print JSON when pretty attribute is set', async () => {
        const el = create();
        el.code = '{"a":1,"b":2}';
        el.language = 'json';
        el.pretty = true;
        await el.updateComplete;

        expect(el.displayCode).toContain('\n');
        expect(el.displayCode).toContain('  ');
    });

    it('should display raw JSON when pretty is false', async () => {
        const el = create();
        el.code = '{"a":1,"b":2}';
        el.language = 'json';
        el.pretty = false;
        await el.updateComplete;

        expect(el.displayCode).toBe('{"a":1,"b":2}');
    });

    it('displayCode should return pretty-printed JSON when pretty is true', async () => {
        const el = create();
        el.code = '{"x":42}';
        el.language = 'json';
        el.pretty = true;
        await el.updateComplete;

        const expected = JSON.stringify({x: 42}, null, 2);
        expect(el.displayCode).toBe(expected);
    });

    it('displayCode should return raw code when pretty is false', async () => {
        const el = create();
        el.code = '{"x":42}';
        el.language = 'json';
        el.pretty = false;
        await el.updateComplete;

        expect(el.displayCode).toBe('{"x":42}');
    });

    // Start line offset
    it('should offset line numbers by start-line', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.startLine = 42;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        expect(lineNums?.length).toBe(3);
        expect(lineNums?.[0].textContent).toBe('42');
        expect(lineNums?.[1].textContent).toBe('43');
        expect(lineNums?.[2].textContent).toBe('44');
    });

    it('should tag rendered rows with absolute line numbers', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2\nc: 3';
        el.language = 'yaml';
        el.lineNumbers = true;
        el.startLine = 42;
        await el.updateComplete;

        const row = el.shadowRoot?.querySelector('[data-line="43"]');
        expect(row?.textContent).toContain('43');
        expect(row?.textContent).toContain('b');
    });

    it('should default to start-line 1 when not set', async () => {
        const el = create();
        el.code = 'a: 1\nb: 2';
        el.language = 'yaml';
        el.lineNumbers = true;
        await el.updateComplete;

        const lineNums = el.shadowRoot?.querySelectorAll('.line-number');
        expect(lineNums?.[0].textContent).toBe('1');
    });

    // Location
    it('should render location below code when set', async () => {
        const el = create();
        el.code = 'a: 1';
        el.language = 'yaml';
        el.location = '/path/to/file.yaml';
        await el.updateComplete;

        const loc = el.shadowRoot?.querySelector('.location');
        expect(loc).toBeTruthy();
        expect(loc?.textContent).toBe('/path/to/file.yaml');
    });

    it('should not render location when empty', async () => {
        const el = create();
        el.code = 'a: 1';
        el.language = 'yaml';
        await el.updateComplete;

        const loc = el.shadowRoot?.querySelector('.location');
        expect(loc).toBeNull();
    });
});
