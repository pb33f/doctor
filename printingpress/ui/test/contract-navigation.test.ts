import {describe, expect, it} from 'vitest';
import {multiContractGroups, normalizeContractGroups} from '../src/utils/contract-navigation.js';

const validContract = (overrides: Record<string, unknown> = {}) => ({
  id: 'http',
  label: 'HTTP',
  specKind: 'openapi',
  href: 'index.html',
  ...overrides,
});

describe('contract navigation normalization', () => {
  it.each([
    {name: 'absent', raw: undefined},
    {name: 'null', raw: null},
    {name: 'empty text', raw: ''},
    {name: 'malformed JSON', raw: '['},
    {name: 'JSON null', raw: 'null'},
    {name: 'JSON object', raw: '{}'},
    {name: 'number root', raw: 42},
    {name: 'boolean root', raw: true},
    {name: 'object root', raw: {}},
  ])('returns no groups for $name input at the consumer boundary', ({raw}) => {
    expect(normalizeContractGroups(raw)).toEqual([]);
    expect(multiContractGroups(raw)).toEqual([]);
  });

  it.each([
    {name: 'null group', group: null},
    {name: 'primitive group', group: 7},
    {name: 'missing role', group: {label: 'HTTP API', contracts: [validContract()]}},
    {name: 'empty role', group: {role: '', label: 'HTTP API', contracts: [validContract()]}},
    {name: 'wrong role type', group: {role: 1, label: 'HTTP API', contracts: [validContract()]}},
    {name: 'missing label', group: {role: 'http-api', contracts: [validContract()]}},
    {name: 'empty label', group: {role: 'http-api', label: ' ', contracts: [validContract()]}},
    {name: 'wrong label type', group: {role: 'http-api', label: false, contracts: [validContract()]}},
    {name: 'missing contracts', group: {role: 'http-api', label: 'HTTP API'}},
    {name: 'non-array contracts', group: {role: 'http-api', label: 'HTTP API', contracts: {}}},
  ])('filters a group with $name', ({group}) => {
    expect(normalizeContractGroups([group])).toEqual([]);
  });

  it.each([
    {name: 'null contract', contract: null},
    {name: 'primitive contract', contract: 7},
    {name: 'missing id', contract: validContract({id: undefined})},
    {name: 'empty id', contract: validContract({id: ''})},
    {name: 'wrong id type', contract: validContract({id: 1})},
    {name: 'missing label', contract: validContract({label: undefined})},
    {name: 'empty label', contract: validContract({label: ' '})},
    {name: 'wrong label type', contract: validContract({label: false})},
    {name: 'missing specKind', contract: validContract({specKind: undefined})},
    {name: 'empty specKind', contract: validContract({specKind: ''})},
    {name: 'wrong specKind type', contract: validContract({specKind: {}})},
    {name: 'missing href', contract: validContract({href: undefined})},
    {name: 'empty href', contract: validContract({href: ' '})},
    {name: 'wrong href type', contract: validContract({href: 9})},
  ])('filters a $name', ({contract}) => {
    const groups = normalizeContractGroups([{
      role: 'http-api',
      label: 'HTTP API',
      contracts: [contract],
    }]);
    expect(groups).toEqual([]);
  });

  it('drops malformed groups and contracts while retaining valid values', () => {
    expect(normalizeContractGroups([
      null,
      {role: 'bad', contracts: [validContract()]},
      {role: 'http-api', label: 'HTTP API', contracts: [
        null,
        7,
        {},
        validContract(),
        validContract({id: ''}),
        validContract({href: 9}),
      ]},
    ])).toEqual([{
      role: 'http-api',
      label: 'HTTP API',
      contracts: [validContract({active: false, versions: []})],
    }]);
  });

  it.each([
    {name: 'missing', versions: undefined, expected: []},
    {name: 'null', versions: null, expected: []},
    {name: 'primitive', versions: 7, expected: []},
    {name: 'non-array object', versions: {}, expected: []},
    {name: 'invalid entries', versions: [null, 4, 'v1', {}, {label: 'v1'}, {href: 'v2.html'}], expected: []},
    {
      name: 'invalid labels and links',
      versions: [{label: '', href: 'bad.html'}, {label: 'v1', href: ''}, {label: 2, href: 'v2.html'}, {label: 'v3', href: false}],
      expected: [],
    },
    {
      name: 'wrong active types are ignored',
      versions: [{label: 'v3', href: 'v3.html', active: 'true'}, {label: 'v2', href: 'v2.html', active: 1}],
      expected: [{label: 'v3', href: 'v3.html', active: true}, {label: 'v2', href: 'v2.html', active: false}],
    },
    {
      name: 'first explicit active wins',
      currentVersion: 'v1',
      versions: [{label: 'v3', href: 'v3.html', active: true}, {label: 'v2', href: 'v2.html', active: true}, {label: 'v1', href: 'v1.html'}],
      expected: [{label: 'v3', href: 'v3.html', active: true}, {label: 'v2', href: 'v2.html', active: false}, {label: 'v1', href: 'v1.html', active: false}],
    },
    {
      name: 'currentVersion fallback',
      currentVersion: 'v1',
      versions: [{label: 'v2', href: 'v2.html'}, {label: 'v1', href: 'v1.html'}],
      expected: [{label: 'v2', href: 'v2.html', active: false}, {label: 'v1', href: 'v1.html', active: true}],
    },
    {
      name: 'first valid version fallback',
      currentVersion: 'missing',
      versions: [null, {label: 'v2', href: 'v2.html'}, {label: 'v1', href: 'v1.html'}],
      expected: [{label: 'v2', href: 'v2.html', active: true}, {label: 'v1', href: 'v1.html', active: false}],
    },
  ])('normalizes nested versions: $name', ({versions, currentVersion, expected}) => {
    const groups = normalizeContractGroups([{
      role: 'http-api',
      label: 'HTTP API',
      contracts: [validContract({active: 'true', currentVersion, versions})],
    }]);
    const contract = groups[0]?.contracts[0];
    expect(contract?.active).toBe(false);
    expect(contract?.versions).toEqual(expected);
    expect(contract?.versions.filter((version) => version.active)).toHaveLength(expected.length ? 1 : 0);
    expect(contract?.currentVersion).toBe(expected.find((version) => version.active)?.label ?? currentVersion);
  });

  it('normalizes invalid currentVersion values without throwing', () => {
    const groups = normalizeContractGroups([{
      role: 'events',
      label: 'Events',
      contracts: [validContract({currentVersion: 7, versions: [{label: 'v1', href: 'v1.html'}]})],
    }]);
    expect(groups[0]?.contracts[0]?.currentVersion).toBe('v1');
  });

  it('enables multi mode only after counting sanitized contracts', () => {
    const oneValid = [{role: 'http-api', label: 'HTTP API', contracts: [
      validContract(),
      validContract({id: '', label: 'Invalid'}),
    ]}];
    expect(normalizeContractGroups(oneValid)[0]?.contracts).toHaveLength(1);
    expect(multiContractGroups(oneValid)).toEqual([]);

    const twoValid = [{role: 'http-api', label: 'HTTP API', contracts: [
      validContract(),
      validContract({id: 'events', label: 'Events', specKind: 'asyncapi', href: 'events.html'}),
    ]}];
    expect(multiContractGroups(twoValid)[0]?.contracts).toHaveLength(2);
  });
});
