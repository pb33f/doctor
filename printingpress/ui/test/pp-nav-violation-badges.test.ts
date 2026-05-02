import {describe, it, expect, beforeEach} from 'vitest';
import '../src/components/nav/nav-model-group.js';
import '../src/components/nav/nav-tag.js';
import '@pb33f/cowboy-components/components/http-method/http-method.js';

describe('nav violation badges', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.dataset.ppDeveloperMode = 'true';
  });

  it('renders all non-zero model group severity counts in severity order', async () => {
    const el = document.createElement('pp-nav-model-group') as any;
    el.group = {
      name: 'Schemas',
      typeSlug: 'schemas',
      counts: {errors: 1, warns: 10, infos: 2},
      models: [],
    };
    document.body.appendChild(el);
    await el.updateComplete;

    const badges = Array.from(el.shadowRoot?.querySelectorAll('.group-header .violation-badge') || []) as HTMLElement[];
    expect(badges.map((badge) => badge.className)).toEqual([
      'violation-badge error',
      'violation-badge warn',
      'violation-badge info',
    ]);
    expect(badges.map((badge) => badge.textContent?.trim().split(/\s+/)[0])).toEqual(['1', '10', '2']);
  });

  it('renders operation tag severity badges as a right-side group', async () => {
    const el = document.createElement('pp-nav-tag') as any;
    el.tag = {
      name: 'Bookings',
      summary: 'Bookings',
      children: null,
      operations: null,
      isNavOnly: false,
      counts: {errors: 0, warns: 5, infos: 1},
    };
    document.body.appendChild(el);
    await el.updateComplete;

    const badgeGroup = el.shadowRoot?.querySelector('.tag-header .violation-badges');
    const badges = Array.from(el.shadowRoot?.querySelectorAll('.tag-header .violation-badge') || []) as HTMLElement[];
    expect(badgeGroup).toBeTruthy();
    expect(badges.map((badge) => badge.className)).toEqual([
      'violation-badge warn',
      'violation-badge info',
    ]);
    expect(badges.map((badge) => badge.textContent?.trim().split(/\s+/)[0])).toEqual(['5', '1']);
  });
});
