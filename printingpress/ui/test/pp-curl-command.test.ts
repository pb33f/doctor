import {describe, it, expect, beforeEach} from 'vitest';
import '../src/components/operations/curl-command.js';
import type {PpCurlCommand} from '../src/components/operations/curl-command.js';

function create(curlJson: string): PpCurlCommand {
  const el = document.createElement('pp-curl-command') as PpCurlCommand;
  el.setAttribute('curl-json', curlJson);
  document.body.appendChild(el);
  return el;
}

describe('pp-curl-command', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing with empty variants', async () => {
    const el = create('[]');
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('terminal-example')).toBeNull();
  });

  it('renders a single command in terminal-example', async () => {
    const el = create(JSON.stringify([
      {label: 'Production · No Auth', serverUrl: 'https://api.example.com', command: "curl 'https://api.example.com/burgers'"},
    ]));
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('terminal-example')?.textContent).toContain("curl 'https://api.example.com/burgers'");
  });

  it('ignores invalid JSON safely', async () => {
    const el = create('not-json');
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('terminal-example')).toBeNull();
  });

  it('renders a dropdown for multiple variants', async () => {
    const el = create(JSON.stringify([
      {label: 'Production · No Auth', serverUrl: 'https://api.example.com', command: "curl 'https://api.example.com/burgers'"},
      {label: 'Production · Bearer Auth', serverUrl: 'https://api.example.com', command: "curl 'https://api.example.com/burgers' -H 'Authorization: Bearer YOUR_TOKEN'"},
    ]));
    await el.updateComplete;

    const menuItems = el.shadowRoot?.querySelectorAll('sl-menu-item');
    expect(menuItems?.length).toBe(2);
    expect(el.shadowRoot?.querySelector('sl-button')?.textContent).toContain('Production · No Auth');
  });

  it('changes displayed command when a different variant is selected', async () => {
    const el = create(JSON.stringify([
      {label: 'Production · No Auth', serverUrl: 'https://api.example.com', command: "curl 'https://api.example.com/burgers'"},
      {label: 'Production · Bearer Auth', serverUrl: 'https://api.example.com', command: "curl 'https://api.example.com/burgers' -H 'Authorization: Bearer YOUR_TOKEN'"},
    ]));
    await el.updateComplete;

    const menu = el.shadowRoot?.querySelector('sl-menu');
    menu?.dispatchEvent(new CustomEvent('sl-select', {
      detail: {
        item: {
          value: '1',
        },
      },
    }));
    await el.updateComplete;

    const terminal = el.shadowRoot?.querySelector('terminal-example');
    expect(terminal?.textContent).toContain('Authorization: Bearer YOUR_TOKEN');
    expect(el.shadowRoot?.querySelector('sl-button')?.textContent).toContain('Production · Bearer Auth');
  });
});
