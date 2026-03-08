import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/pp-nav.js';
import '../src/components/pp-nav-tag.js';
import '@pb33f/cowboy-components/components/http-method/http-method.js';

describe('pp-nav', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render with nav data', async () => {
    const navData = [
      {
        Name: 'Users',
        Summary: '',
        Children: null,
        Operations: [
          {
            Method: 'GET',
            Path: '/users',
            OperationID: 'getUsers',
            Summary: 'List users',
            Slug: 'getusers',
            Deprecated: false,
          },
        ],
        IsNavOnly: false,
      },
    ];

    const el = document.createElement('pp-nav');
    el.setAttribute('data-nav', JSON.stringify(navData));
    document.body.appendChild(el);
    await el.updateComplete;

    const homeLink = el.shadowRoot?.querySelector('.nav-home');
    expect(homeLink).toBeTruthy();
    expect(homeLink?.getAttribute('href')).toBe('index.html');

    const tagEls = el.shadowRoot?.querySelectorAll('pp-nav-tag');
    expect(tagEls?.length).toBe(1);
  });

  it('should render empty when no data', async () => {
    const el = document.createElement('pp-nav');
    document.body.appendChild(el);
    await el.updateComplete;

    const tagEls = el.shadowRoot?.querySelectorAll('pp-nav-tag');
    expect(tagEls?.length).toBe(0);
  });
});
