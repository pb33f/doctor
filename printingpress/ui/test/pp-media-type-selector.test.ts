import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/shared/media-type-selector.js';
import type { PpMediaTypeSelector } from '../src/components/shared/media-type-selector.js';

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
});
