import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import '../src/components/shared/media-type-selector.js';
import type { PpMediaTypeSelector } from '../src/components/shared/media-type-selector.js';

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

function create(contentJson: string): PpMediaTypeSelector {
    const el = document.createElement('pp-media-type-selector') as PpMediaTypeSelector;
    el.setAttribute('content-json', contentJson);
    document.body.appendChild(el);
    return el;
}

const jsonMT = {
    mediaType: 'application/json',
    schemaJson: '{"type":"object","properties":{"id":{"type":"integer"}}}',
    mockJson: '{"id": 1}',
    schemaRef: { name: 'Pet', componentType: 'schemas', typeSlug: 'schemas', slug: 'pet' },
};

const xmlMT = {
    mediaType: 'application/xml',
    schemaJson: '{"type":"object","properties":{"id":{"type":"integer"}}}',
    mockJson: '{"id": 1}',
    mockXml: '<?xml version="1.0"?><root><id>1</id></root>',
    schemaRef: { name: 'Pet', componentType: 'schemas', typeSlug: 'schemas', slug: 'pet' },
};

const differentSchemaMT = {
    mediaType: 'text/plain',
    schemaJson: '{"type":"string"}',
    mockJson: '"hello"',
};

describe('pp-media-type-selector', () => {
    beforeAll(() => {
        if (!('ResizeObserver' in globalThis)) {
            (globalThis as typeof globalThis & {ResizeObserver: typeof ResizeObserverStub}).ResizeObserver = ResizeObserverStub;
        }
        if (!('IntersectionObserver' in globalThis)) {
            (globalThis as typeof globalThis & {IntersectionObserver: typeof IntersectionObserverStub}).IntersectionObserver = IntersectionObserverStub;
        }
    });

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render single media type without dropdown', async () => {
        const el = create(JSON.stringify([jsonMT]));
        await el.updateComplete;

        const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
        expect(dropdown).toBeNull();

        const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
        expect(schemaProps).toBeTruthy();

        const refLink = el.shadowRoot?.querySelector('.ref-link');
        expect(refLink?.textContent).toContain('Pet');
    });

    it('should suppress inline schema ref links when hide-ref-links is set', async () => {
        const el = create(JSON.stringify([jsonMT]));
        el.setAttribute('hide-ref-links', '');
        await el.updateComplete;

        const refLink = el.shadowRoot?.querySelector('.ref-link');
        expect(refLink).toBeNull();
    });

    it('should render dropdown for multiple media types', async () => {
        const el = create(JSON.stringify([jsonMT, xmlMT]));
        await el.updateComplete;

        const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
        expect(dropdown).toBeTruthy();
    });

    it('should detect identical schemas', async () => {
        const el = create(JSON.stringify([jsonMT, xmlMT]));
        await el.updateComplete;

        // Both have same schemaRef slug "pet"
        // Schema should render once (only one pp-schema-properties)
        const schemaProps = el.shadowRoot?.querySelectorAll('pp-schema-properties');
        expect(schemaProps?.length).toBe(1);
    });

    it('should detect different schemas', async () => {
        const el = create(JSON.stringify([jsonMT, differentSchemaMT]));
        await el.updateComplete;

        // Different schemas — should still only render selected one
        const schemaProps = el.shadowRoot?.querySelectorAll('pp-schema-properties');
        expect(schemaProps?.length).toBe(1);
    });

    it('should default to application/json index', async () => {
        const el = create(JSON.stringify([xmlMT, jsonMT]));
        await el.updateComplete;

        // Should select jsonMT (index 1) as default
        const button = el.shadowRoot?.querySelector('sl-button');
        expect(button?.textContent?.trim()).toBe('application/json');
    });

    it('should render nothing with empty array', async () => {
        const el = create('[]');
        await el.updateComplete;

        // No meaningful content (no schema-properties, no dropdown)
        const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
        const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
        expect(schemaProps).toBeNull();
        expect(dropdown).toBeNull();
    });

    it('should collapse and restore split examples', async () => {
        const el = create(JSON.stringify([jsonMT]));
        await el.updateComplete;

        (el as any).wide = true;
        await el.updateComplete;

        const exampleSelector = el.shadowRoot?.querySelector('pp-example-selector') as HTMLElement;
        expect(exampleSelector).toBeTruthy();
        expect(exampleSelector.hasAttribute('show-visibility-toggle')).toBe(true);

        exampleSelector.dispatchEvent(new CustomEvent('pp-hide-example'));
        await el.updateComplete;

        let split = el.shadowRoot?.querySelector('.schema-split');
        expect(split?.classList.contains('example-hidden')).toBe(true);

        const restore = el.shadowRoot?.querySelector('.example-restore') as HTMLElement;
        expect(restore).toBeTruthy();
        restore.click();
        await el.updateComplete;

        split = el.shadowRoot?.querySelector('.schema-split');
        expect(split?.classList.contains('example-hidden')).toBe(false);
    });

    it('renders split schema properties in constrained mode', async () => {
        const polymorphicMT = {
            mediaType: 'application/json',
            schemaJson: JSON.stringify({
                oneOf: [
                    {title: 'bank_account', type: 'object', properties: {bank_name: {type: 'string'}}},
                    {title: 'card', type: 'object', properties: {brand: {type: 'string'}}},
                ],
            }),
            mockJson: '{"object":"bank_account"}',
        };
        const el = create(JSON.stringify([polymorphicMT]));
        await el.updateComplete;

        (el as any).wide = true;
        await el.updateComplete;

        const schemaProps = el.shadowRoot?.querySelector('pp-schema-properties');
        expect(schemaProps?.hasAttribute('compact')).toBe(true);
        expect(schemaProps?.hasAttribute('constrained')).toBe(true);
    });
});
