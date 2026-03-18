import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/extensions.js';
import type { PpExtensions } from '../src/components/shared/extensions.js';

function create(): PpExtensions {
    const el = document.createElement('pp-extensions') as PpExtensions;
    document.body.appendChild(el);
    return el;
}

describe('pp-extensions', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render nothing when extensions-json is empty', async () => {
        const el = create();
        await el.updateComplete;
        expect(el.shadowRoot?.querySelectorAll('.ext-key').length).toBe(0);
    });

    it('should render nothing for invalid JSON', async () => {
        const el = create();
        el.extensionsJson = '{not valid';
        await el.updateComplete;
        expect(el.shadowRoot?.querySelectorAll('.ext-key').length).toBe(0);
    });

    it('should render scalar values as text', async () => {
        const el = create();
        el.extensionsJson = JSON.stringify([
            { key: 'x-beta', value: true },
            { key: 'x-sunset', value: '2026-06-01' },
        ]);
        await el.updateComplete;
        const keys = el.shadowRoot?.querySelectorAll('.ext-key');
        expect(keys?.length).toBe(2);
        expect(keys?.[0].textContent).toBe('x-beta');
        const values = el.shadowRoot?.querySelectorAll('.ext-value');
        expect(values?.[0].querySelector('.ext-scalar')?.textContent).toBe('true');
    });

    it('should render object values via pp-code-viewer', async () => {
        const el = create();
        el.extensionsJson = JSON.stringify([
            { key: 'x-rate-limit', value: { requests: 120 } },
        ]);
        await el.updateComplete;
        const viewer = el.shadowRoot?.querySelector('pp-code-viewer');
        expect(viewer).toBeTruthy();
    });

    it('should clear state when attribute becomes empty', async () => {
        const el = create();
        el.extensionsJson = JSON.stringify([{ key: 'x-a', value: 1 }]);
        await el.updateComplete;
        expect(el.shadowRoot?.querySelectorAll('.ext-key').length).toBe(1);
        el.extensionsJson = '';
        await el.updateComplete;
        expect(el.shadowRoot?.querySelectorAll('.ext-key').length).toBe(0);
    });
});
