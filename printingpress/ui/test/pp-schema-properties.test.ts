import {describe, it, expect, beforeAll, beforeEach} from 'vitest';
import {resetRegistry, seedCachedSchemaModels, setSchemaRegistryEntries} from '../src/utils/schema-registry.js';
import '../src/components/shared/schema-properties.js';
import type {PpSchemaProperties} from '../src/components/shared/schema-properties.js';

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

function registryEntry(key: string, description: string) {
    const parts = key.split('/');
    const name = parts[1];
    const typeSlug = parts[0];
    return {
        name,
        componentType: typeSlug,
        description,
        typeSlug,
        slug: name.toLowerCase(),
        href: `models/${typeSlug}/${name.toLowerCase()}.html`,
        pageDataBase: `static/page-data/models/${typeSlug}/${name.toLowerCase()}`,
    };
}

const registryEntries = {
    'schemas/WrapperCollection': registryEntry('schemas/WrapperCollection', 'A paginated collection wrapper'),
    'schemas/LinksSelf': registryEntry('schemas/LinksSelf', 'Self link'),
    'schemas/LinksPagination': registryEntry('schemas/LinksPagination', 'Pagination links'),
    'schemas/BookingPayment': registryEntry('schemas/BookingPayment', 'Payment details'),
    'schemas/CardSource': registryEntry('schemas/CardSource', 'Card payment source'),
    'schemas/BankSource': registryEntry('schemas/BankSource', 'Bank payment source'),
    'schemas/LinksBooking': registryEntry('schemas/LinksBooking', 'Booking links'),
    'schemas/WideOption': registryEntry('schemas/WideOption', 'Wide option payload'),
    'schemas/Error': registryEntry('schemas/Error', 'Error payload'),
};

// Fixed model fixture — seed before tests so ref lookups work
const modelFixture = {
    'schemas/WrapperCollection': {
        name: 'WrapperCollection',
        componentType: 'schemas',
        description: 'A paginated collection wrapper',
        typeSlug: 'schemas',
        slug: 'wrappercollection',
        schemaJson: '{"type":"object","properties":{"links":{"type":"object"}}}',
    },
    'schemas/LinksSelf': {
        name: 'LinksSelf',
        componentType: 'schemas',
        description: 'Self link',
        typeSlug: 'schemas',
        slug: 'linksself',
        schemaJson: '{"type":"object","properties":{"self":{"type":"string"}}}',
    },
    'schemas/LinksPagination': {
        name: 'LinksPagination',
        componentType: 'schemas',
        description: 'Pagination links',
        typeSlug: 'schemas',
        slug: 'linkspagination',
        schemaJson: '{"type":"object","properties":{"next":{"type":"string"}}}',
    },
    'schemas/BookingPayment': {
        name: 'BookingPayment',
        componentType: 'schemas',
        description: 'Payment details',
        typeSlug: 'schemas',
        slug: 'bookingpayment',
        schemaJson: JSON.stringify({
            type: 'object',
            properties: {
                amount: {type: 'number'},
                source: {
                    oneOf: [
                        {$ref: '#/components/schemas/CardSource'},
                        {$ref: '#/components/schemas/BankSource'},
                    ],
                },
            },
            required: ['amount', 'source'],
        }),
    },
    'schemas/CardSource': {
        name: 'CardSource',
        componentType: 'schemas',
        description: 'Card payment source',
        typeSlug: 'schemas',
        slug: 'cardsource',
        schemaJson: '{"type":"object","properties":{"object":{"type":"string"}}}',
    },
    'schemas/BankSource': {
        name: 'BankSource',
        componentType: 'schemas',
        description: 'Bank payment source',
        typeSlug: 'schemas',
        slug: 'banksource',
        schemaJson: '{"type":"object","properties":{"object":{"type":"string"}}}',
    },
    'schemas/LinksBooking': {
        name: 'LinksBooking',
        componentType: 'schemas',
        description: 'Booking links',
        typeSlug: 'schemas',
        slug: 'linksbooking',
        schemaJson: '{"type":"object","properties":{"booking":{"type":"string"}}}',
    },
    'schemas/WideOption': {
        name: 'WideOption',
        componentType: 'schemas',
        description: 'Wide option payload',
        typeSlug: 'schemas',
        slug: 'wideoption',
        schemaJson: JSON.stringify({
            type: 'object',
            properties: {
                very_long_property_name_for_compact_width: {type: 'string'},
            },
            required: ['very_long_property_name_for_compact_width'],
        }),
    },
    'schemas/Error': {
        name: 'Error',
        componentType: 'schemas',
        description: 'Error payload',
        typeSlug: 'schemas',
        slug: 'error',
        schemaJson: JSON.stringify({
            type: 'object',
            properties: {
                title: {type: 'string'},
                detail: {type: 'string'},
            },
            required: ['title'],
        }),
    },
} as const;

function seedRegistry() {
    setSchemaRegistryEntries(registryEntries);
    seedCachedSchemaModels(modelFixture);
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
        if (!('ResizeObserver' in globalThis)) {
            (globalThis as typeof globalThis & {ResizeObserver: typeof ResizeObserverStub}).ResizeObserver = ResizeObserverStub;
        }
        if (!('IntersectionObserver' in globalThis)) {
            (globalThis as typeof globalThis & {IntersectionObserver: typeof IntersectionObserverStub}).IntersectionObserver = IntersectionObserverStub;
        }
        seedRegistry();
    });

    beforeEach(() => {
        document.body.innerHTML = '';
        resetRegistry();
        seedRegistry();
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

        // Expanded refs contribute their properties to the merged table
        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('links');
        expect(propNames).toContain('self');

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

        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('links');
        expect(propNames).toContain('data');
    });

    it('expands top-level allOf refs into the merged property table', async () => {
        const schema = {
            allOf: [
                {$ref: '#/components/schemas/BookingPayment'},
                {
                    properties: {
                        links: {$ref: '#/components/schemas/LinksBooking'},
                    },
                },
            ],
        };
        const el = create(JSON.stringify(schema));
        await el.updateComplete;

        const refEntries = el.shadowRoot?.querySelectorAll('.composition-ref-entry');
        expect(refEntries?.length).toBe(1);

        const propertyNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propertyNames).toContain('amount');
        expect(propertyNames).toContain('source');
        expect(propertyNames).toContain('links');

        const sourceRow = Array.from(el.shadowRoot?.querySelectorAll('.property, .property-oneof') ?? [])
            .find((prop) => prop.querySelector('.prop-name')?.textContent?.trim() === 'source');
        const sourceTypeCol = sourceRow?.querySelector('.prop-type-col, .oneof-desc-container');
        const variantLinks = sourceTypeCol?.querySelectorAll('a.ref-type-link');
        expect(variantLinks?.length).toBe(2);

        const requiredBadges = Array.from(el.shadowRoot?.querySelectorAll('.required-badge') ?? []);
        expect(requiredBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('computes compact width from rendered inline polymorphic properties', async () => {
        const schema = {
            type: 'object',
            properties: {
                source: {
                    oneOf: [
                        {
                            title: 'inline_source',
                            type: 'object',
                            properties: {
                                very_long_inline_property_name_for_compact_width: {type: 'string'},
                            },
                        },
                    ],
                },
            },
        };
        const el = create(JSON.stringify(schema), true);
        await el.updateComplete;

        const compactWidth = el.style.getPropertyValue('--compact-name-width');
        expect(parseInt(compactWidth, 10)).toBeGreaterThan(300);
    });

    it('does not compute compact width from unexpanded polymorphic ref internals', async () => {
        const schema = {
            type: 'object',
            properties: {
                source: {
                    oneOf: [
                        {$ref: '#/components/schemas/WideOption'},
                    ],
                },
            },
        };
        const el = create(JSON.stringify(schema), true);
        await el.updateComplete;

        const compactWidth = el.style.getPropertyValue('--compact-name-width');
        expect(parseInt(compactWidth, 10)).toBeLessThan(300);
    });

    it('reserves enough compact width for required badge slots and long property names', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                very_long_property_name_for_compact_width: {type: 'string'},
            },
            required: ['very_long_property_name_for_compact_width'],
        }), true);
        await el.updateComplete;

        const compactWidth = el.style.getPropertyValue('--compact-name-width');
        expect(parseInt(compactWidth, 10)).toBeGreaterThan(240);
    });

    it('keeps vertical polymorphic tabs for short constrained layouts when they fit', async () => {
        const el = create(JSON.stringify({
            oneOf: [
                {title: 'bank_account', type: 'object', properties: {bank_name: {type: 'string'}}},
                {title: 'card', type: 'object', properties: {brand: {type: 'string'}}},
            ],
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        const tabs = el.shadowRoot?.querySelector('sl-tab-group');
        expect(tabs?.getAttribute('placement')).toBe('start');
        expect(el.shadowRoot?.querySelector('.polymorphic-dropdown')).toBeNull();
    });

    it('uses dropdown polymorphic selectors in popover layouts even when short labels fit', async () => {
        const el = create(JSON.stringify({
            oneOf: [
                {title: 'customer', type: 'object', properties: {id: {type: 'string'}}},
                {title: 'account', type: 'object', properties: {name: {type: 'string'}}},
            ],
        }), true);
        el.setAttribute('constrained', '');
        el.setAttribute('popover-context', '');
        await el.updateComplete;

        expect(el.shadowRoot?.querySelector('sl-tab-group')).toBeNull();
        const dropdown = el.shadowRoot?.querySelector('.polymorphic-dropdown');
        expect(dropdown).toBeTruthy();
        expect(dropdown?.querySelector('sl-button')?.textContent?.trim()).toBe('customer');
        expect(el.shadowRoot?.querySelector('.oneof-property-popover-dropdown')).toBeTruthy();
    });

    it('reserves the normal left badge slot for required polymorphic properties', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                meter: {
                    oneOf: [
                        {title: 'customer', type: 'string'},
                        {title: 'billing_meter', type: 'string'},
                    ],
                },
            },
            required: ['meter'],
        }), true);
        el.setAttribute('constrained', '');
        el.setAttribute('popover-context', '');
        await el.updateComplete;

        const propName = el.shadowRoot?.querySelector('.oneof-prop-name');
        expect(propName?.querySelector('.required-badge')?.textContent?.trim()).toBe('req');
        expect(propName?.querySelector('.required-badge-placeholder')).toBeNull();
        expect(propName?.querySelector('.prop-name')?.textContent?.trim()).toBe('meter');
    });

    it('uses a warning dropdown for long polymorphic labels in tight constrained layouts', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                external_account: {
                    oneOf: [
                        {title: 'external_account_payout_bank_account', type: 'object', properties: {bank_name: {type: 'string'}}},
                        {title: 'external_account_card', type: 'object', properties: {brand: {type: 'string'}}},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        (el as any).availableWidth = 420;
        el.requestUpdate();
        await el.updateComplete;

        expect(el.shadowRoot?.querySelector('sl-tab-group')).toBeNull();
        const dropdown = el.shadowRoot?.querySelector('.polymorphic-dropdown');
        expect(dropdown).toBeTruthy();
        const trigger = dropdown?.querySelector('sl-button');
        expect(trigger?.textContent?.trim()).toBe('external_account_payout_bank_account');
    });

    it('does not render a selector for single-option polymorphic schemas', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                settings: {
                    oneOf: [
                        {title: 'account_settings', type: 'object', properties: {tos_acceptance: {type: 'object'}}},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        expect(el.shadowRoot?.querySelector('sl-tab-group')).toBeNull();
        expect(el.shadowRoot?.querySelector('.polymorphic-dropdown')).toBeNull();
        expect(el.shadowRoot?.querySelector('.oneof-single-panel')).toBeTruthy();

        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.oneof-single-panel .prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('tos_acceptance');
    });

    it('renders single-option polymorphic refs in the value column', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                business_profile: {
                    description: 'Business information about the account.',
                    oneOf: [
                        {$ref: '#/components/schemas/WideOption'},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        expect(el.shadowRoot?.querySelector('sl-tab-group')).toBeNull();
        expect(el.shadowRoot?.querySelector('.polymorphic-dropdown')).toBeNull();
        expect(el.shadowRoot?.querySelector('.oneof-single-value .ref-type-link')?.textContent?.trim()).toContain('WideOption');
        expect(el.shadowRoot?.querySelector('.oneof-single-panel .ref-type-link')).toBeNull();
    });

    it('updates dropdown-selected polymorphic option content independently', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                external_account: {
                    oneOf: [
                        {title: 'external_account_payout_bank_account', type: 'object', properties: {bank_name: {type: 'string'}}},
                        {title: 'external_account_card', type: 'object', properties: {card_brand: {type: 'string'}}},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        (el as any).availableWidth = 420;
        el.requestUpdate();
        await el.updateComplete;

        let propNames = Array.from(el.shadowRoot?.querySelectorAll('.oneof-dropdown-panel .prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('bank_name');
        expect(propNames).not.toContain('card_brand');

        const menu = el.shadowRoot?.querySelector('.polymorphic-dropdown sl-menu');
        menu?.dispatchEvent(new CustomEvent('sl-select', {detail: {item: {value: '1'}}, bubbles: true, composed: true}));
        await el.updateComplete;

        propNames = Array.from(el.shadowRoot?.querySelectorAll('.oneof-dropdown-panel .prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).not.toContain('bank_name');
        expect(propNames).toContain('card_brand');
        const trigger = el.shadowRoot?.querySelector('.polymorphic-dropdown sl-button');
        expect(trigger?.textContent?.trim()).toBe('external_account_card');
    });

    it('uses dropdown when a label is too long for the vertical tab rail', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                business_profile: {
                    oneOf: [
                        {title: 'account_business_profile', type: 'object', properties: {business_type: {type: 'string'}}},
                        {title: 'account_settings', type: 'object', properties: {dashboard: {type: 'object'}}},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;

        (el as any).availableWidth = 740;
        el.requestUpdate();
        await el.updateComplete;

        expect(el.shadowRoot?.querySelector('sl-tab-group')).toBeNull();
        const trigger = el.shadowRoot?.querySelector('.polymorphic-dropdown sl-button');
        expect(trigger?.textContent?.trim()).toBe('account_business_profile');
    });

    it('caps constrained polymorphic fit decisions when nested names inflate compact width', async () => {
        const el = create(JSON.stringify({
            type: 'object',
            properties: {
                source: {
                    oneOf: [
                        {
                            title: 'bank_account',
                            type: 'object',
                            properties: {
                                absurdly_long_nested_property_name_that_should_not_size_the_polymorphic_rail: {type: 'string'},
                            },
                        },
                        {title: 'card', type: 'object', properties: {brand: {type: 'string'}}},
                    ],
                },
            },
        }), true);
        el.setAttribute('constrained', '');
        await el.updateComplete;
        expect(parseInt(el.style.getPropertyValue('--compact-name-width'), 10)).toBeGreaterThan(600);

        (el as any).availableWidth = 740;
        el.requestUpdate();
        await el.updateComplete;

        const tabs = el.shadowRoot?.querySelector('sl-tab-group');
        expect(tabs?.getAttribute('placement')).toBe('start');
        expect(el.shadowRoot?.querySelector('.polymorphic-dropdown')).toBeNull();
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
        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('links');
        expect(propNames).toContain('extra');
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

        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('links');
        expect(propNames).toContain('id');
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

    it('resolves a top-level $ref into the referenced schema properties', async () => {
        const el = create(JSON.stringify({
            $ref: '#/components/schemas/Error',
        }));
        await el.updateComplete;

        const propNames = Array.from(el.shadowRoot?.querySelectorAll('.prop-name') ?? [])
            .map((node) => node.textContent?.trim());
        expect(propNames).toContain('title');
        expect(propNames).toContain('detail');

        const scalarType = el.shadowRoot?.querySelector('.property.scalar .prop-type');
        expect(scalarType).toBeNull();
    });
});
