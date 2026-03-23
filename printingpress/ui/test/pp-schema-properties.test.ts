import {describe, it, expect, beforeAll, beforeEach} from 'vitest';
import {resetRegistry} from '../src/utils/schema-registry.js';
import '../src/components/shared/schema-properties.js';
import type {PpSchemaProperties} from '../src/components/shared/schema-properties.js';

// Fixed registry fixture — inject before tests so ref lookups work
const registryFixture = {
    'schemas/WrapperCollection': {
        name: 'WrapperCollection',
        componentType: 'schemas',
        description: 'A paginated collection wrapper',
        schemaJson: '{"type":"object","properties":{"links":{"type":"object"}}}',
    },
    'schemas/LinksSelf': {
        name: 'LinksSelf',
        componentType: 'schemas',
        description: 'Self link',
        schemaJson: '{"type":"object","properties":{"self":{"type":"string"}}}',
    },
    'schemas/LinksPagination': {
        name: 'LinksPagination',
        componentType: 'schemas',
        description: 'Pagination links',
        schemaJson: '{"type":"object","properties":{"next":{"type":"string"}}}',
    },
};

function injectRegistry() {
    let el = document.getElementById('pp-schema-registry');
    if (!el) {
        el = document.createElement('script');
        el.id = 'pp-schema-registry';
        el.setAttribute('type', 'application/json');
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(registryFixture);
}

function create(schemaJson: string, compact = false): PpSchemaProperties {
    const el = document.createElement('pp-schema-properties') as PpSchemaProperties;
    el.setAttribute('schema-json', schemaJson);
    if (compact) el.setAttribute('compact', '');
    document.body.appendChild(el);
    return el;
}

describe('pp-schema-properties allOf', () => {
    beforeAll(() => {
        injectRegistry();
    });

    beforeEach(() => {
        document.body.innerHTML = '';
        resetRegistry();
        injectRegistry();
    });

    it('renders composition refs for allOf with refs only', async () => {
        const schema = {
            allOf: [
                {$ref: '#/components/schemas/WrapperCollection'},
                {$ref: '#/components/schemas/LinksSelf'},
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const refs = el.shadowRoot?.querySelector('.composition-refs');
        expect(refs).toBeTruthy();

        const refEntries = el.shadowRoot?.querySelectorAll('.composition-ref-entry');
        expect(refEntries?.length).toBe(2);

        // No property table when all entries are refs
        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(properties?.length ?? 0).toBe(0);

        // "Composed from" label
        const label = el.shadowRoot?.querySelector('.composition-label');
        expect(label?.textContent).toContain('Composed from');
    });

    it('renders merged property table for allOf with inline only', async () => {
        const schema = {
            allOf: [
                {properties: {name: {type: 'string'}}},
                {properties: {age: {type: 'integer'}}},
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        // No composition refs section
        const refs = el.shadowRoot?.querySelector('.composition-refs');
        expect(refs).toBeNull();

        // Merged property table
        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(properties?.length).toBe(2);
    });

    it('renders both refs and properties for mixed allOf', async () => {
        const schema = {
            allOf: [
                {$ref: '#/components/schemas/WrapperCollection'},
                {properties: {data: {type: 'array'}}},
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const refs = el.shadowRoot?.querySelector('.composition-refs');
        expect(refs).toBeTruthy();

        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(properties?.length).toBe(1);
    });

    it('merges sibling properties at same level as allOf', async () => {
        const schema = {
            allOf: [
                {$ref: '#/components/schemas/WrapperCollection'},
            ],
            properties: {
                extra: {type: 'string'},
            },
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        // sibling properties should be in the table
        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(properties?.length).toBe(1);

        const propName = el.shadowRoot?.querySelector('.prop-name');
        expect(propName?.textContent).toBe('extra');
    });

    it('merges required from constraint-only allOf entries', async () => {
        const schema = {
            allOf: [
                {properties: {name: {type: 'string'}, email: {type: 'string'}}},
                {required: ['name']},
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const badge = el.shadowRoot?.querySelector('.required-badge');
        expect(badge).toBeTruthy();
    });

    it('renders nested allOf property type as linked ref names', async () => {
        const schema = {
            allOf: [
                {
                    properties: {
                        links: {
                            allOf: [
                                {$ref: '#/components/schemas/LinksSelf'},
                                {$ref: '#/components/schemas/LinksPagination'},
                            ],
                        },
                    },
                },
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        // The links property should show linked ref names
        const typeCol = el.shadowRoot?.querySelector('.prop-type-col');
        const refLinks = typeCol?.querySelectorAll('a.ref-type-link');
        expect(refLinks?.length).toBe(2);

        const separator = typeCol?.querySelector('.composition-separator');
        expect(separator).toBeTruthy();
    });

    it('falls back to allOf text for nested mixed allOf', async () => {
        const schema = {
            allOf: [
                {
                    properties: {
                        data: {
                            allOf: [
                                {$ref: '#/components/schemas/LinksSelf'},
                                {properties: {extra: {type: 'string'}}},
                            ],
                        },
                    },
                },
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const typeSpan = el.shadowRoot?.querySelector('.prop-type');
        expect(typeSpan?.textContent).toContain('allOf');
    });

    it('unwraps array items with allOf', async () => {
        const schema = {
            type: 'array',
            items: {
                allOf: [
                    {$ref: '#/components/schemas/WrapperCollection'},
                    {properties: {id: {type: 'integer'}}},
                ],
            },
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const refs = el.shadowRoot?.querySelector('.composition-refs');
        expect(refs).toBeTruthy();

        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(properties?.length).toBe(1);
    });

    it('renders composition in compact mode with compact attribute', async () => {
        const schema = {
            allOf: [
                {$ref: '#/components/schemas/WrapperCollection'},
            ],
        };
        const el = create(JSON.stringify(schema), true);
        await el.updateComplete;

        // Verify compact attribute is reflected and composition renders
        expect(el.hasAttribute('compact')).toBe(true);
        const refs = el.shadowRoot?.querySelector('.composition-refs');
        expect(refs).toBeTruthy();

        // CSS hides .composition-ref-desc and .composition-label in compact mode
        // (can't verify computed styles in jsdom, but the elements and CSS rules exist)
        const label = el.shadowRoot?.querySelector('.composition-label');
        expect(label).toBeTruthy();
    });

    it('renders nothing for empty allOf', async () => {
        const schema = {allOf: []};
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const refs = el.shadowRoot?.querySelector('.composition-refs');
        const properties = el.shadowRoot?.querySelectorAll('.property');
        expect(refs).toBeNull();
        expect(properties?.length ?? 0).toBe(0);
    });
});
