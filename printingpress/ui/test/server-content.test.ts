import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import '../src/components/shared/media-type-selector.js';
import '../src/components/operations/curl-command.js';
import '../src/components/operations/operation-responses.js';
import '../src/components/operations/operation-parameters.js';
import '../src/components/shared/code-viewer.js';
import '../src/components/shared/cross-refs.js';
import '../src/components/shared/security-scheme.js';
import type { PpOperationResponses } from '../src/components/operations/operation-responses.js';

// Server markup as the Go content writers write it (content_*.go). The
// components keep it and give it behaviour.

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

async function mount<T extends HTMLElement>(markup: string, selector: string): Promise<T> {
    document.body.innerHTML = markup;
    const el = document.querySelector(selector) as T & {updateComplete?: Promise<unknown>};
    await el.updateComplete;
    return el;
}

function change(select: HTMLSelectElement, value: string) {
    select.value = value;
    select.dispatchEvent(new Event('change', {bubbles: true}));
}

const block = (index: number, mediaType: string, hidden: boolean) =>
    `<div class="pp-media-type-block" data-index="${index}"${hidden ? ' hidden' : ''}><div class="media-type-ref"><select class="pp-media-type-select" aria-label="Media type">` +
    `<option value="0"${index === 0 ? ' selected' : ''}>application/xml</option><option value="1"${index === 1 ? ' selected' : ''}>application/json</option></select></div>` +
    `<p class="body">${mediaType}</p></div>`;

describe('server-written content', () => {
    beforeAll(() => {
        (globalThis as any).ResizeObserver = ResizeObserverStub;
    });

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('keeps media-type blocks and switches them from each block select', async () => {
        const el = await mount<HTMLElement>(
            `<pp-media-type-selector id="pp-request-body-content" data-pp-owner="page" data-pp-ssr>${block(0, 'xml', true)}${block(1, 'json', false)}</pp-media-type-selector>`,
            'pp-media-type-selector');
        const blocks = () => Array.from(el.querySelectorAll<HTMLElement>(':scope > .pp-media-type-block')).map((b) => b.hidden);
        expect(blocks()).toEqual([true, false]);

        const shown = el.querySelector<HTMLSelectElement>('.pp-media-type-block[data-index="1"] .pp-media-type-select')!;
        change(shown, '0');

        expect(blocks()).toEqual([false, true]);
        expect(el.querySelector('.body:not([hidden])')?.textContent).toBe('xml');
        const next = el.querySelector<HTMLSelectElement>('.pp-media-type-block[data-index="0"] .pp-media-type-select')!;
        expect(next.value).toBe('0');
        expect(document.activeElement).toBe(next);
    });

    it('keeps cURL variants and switches them from the select', async () => {
        const el = await mount<HTMLElement>(
            `<pp-curl-command id="pp-operation-curl" data-pp-owner="page" data-pp-ssr><div class="selector-row"><div class="selector"><select class="pp-curl-select" aria-label="cURL variant"><option value="0">Prod</option><option value="1">Mock</option></select></div></div>` +
            `<pp-terminal-example class="pp-curl-variant" data-index="0" data-pp-owner="pp-curl-command" data-pp-ssr><button type="button" class="pp-terminal-example__copy">copy</button><pre>curl https://prod</pre></pp-terminal-example>` +
            `<pp-terminal-example class="pp-curl-variant" data-index="1" hidden data-pp-owner="pp-curl-command" data-pp-ssr><button type="button" class="pp-terminal-example__copy">copy</button><pre>curl https://mock</pre></pp-terminal-example></pp-curl-command>`,
            'pp-curl-command');

        change(el.querySelector<HTMLSelectElement>('.pp-curl-select')!, '1');

        const variants = Array.from(el.querySelectorAll<HTMLElement>('.pp-curl-variant'));
        expect(variants.map((v) => v.hidden)).toEqual([true, false]);
        expect(variants[1].querySelector('pre')?.textContent).toBe('curl https://mock');
    });

    it('keeps responses, lists them for the page nav, and opens a reveal link target', async () => {
        const el = await mount<PpOperationResponses>(
            `<pp-operation-responses id="section-responses" data-nav-label="Responses" data-pp-owner="page" data-pp-ssr><h2>Responses</h2>` +
            `<div class="response" id="response-200" data-nav-label="200 OK"><h3>200 OK</h3><ul><li><a class="header-anchor" href="#header-X-Rate" data-pp-reveal>X-Rate</a></li></ul></div>` +
            `<wa-details class="pp-details"><span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span><div id="header-X-Rate">X-Rate</div></wa-details>` +
            `<wa-details class="pp-details"><div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div><div class="response" id="response-404" data-nav-label="404 Not Found"></div></wa-details>` +
            `</pp-operation-responses>`,
            'pp-operation-responses');

        expect(el.querySelector('h2')?.textContent).toBe('Responses');
        expect(el.getResponseNavItems()).toEqual([
            {label: '200 OK', id: 'response-200'},
            {label: '404 Not Found', id: 'response-404'},
        ]);

        const target = document.getElementById('header-X-Rate')!;
        let scrolled = false;
        target.scrollIntoView = () => { scrolled = true; };
        const details = target.closest('wa-details') as HTMLElement & {open?: boolean};
        el.querySelector<HTMLAnchorElement>('a[data-pp-reveal]')!.click();
        await Promise.resolve();
        await Promise.resolve();

        expect(details.open).toBe(true);
        expect(scrolled).toBe(true);
    });

    it('opens a drawer-mode parameter example from its template', async () => {
        const el = await mount<HTMLElement>(
            `<pp-operation-parameters id="pp-operation-parameters" data-pp-owner="page" data-pp-ssr><div class="parameter"><div class="param-extras">` +
            `<pp-example-selector data-pp-owner="pp-operation-parameters" data-pp-ssr><div class="selector"><button type="button" data-pp-example-show="0">Example</button></div>` +
            `<template class="pp-example-data" data-index="0" data-key="">{&#34;id&#34;:1}</template></pp-example-selector></div></div></pp-operation-parameters>`,
            'pp-operation-parameters');
        let detail: {title: string; json: string; language: string} | null = null;
        document.addEventListener('pp-show-example', (event) => { detail = (event as CustomEvent).detail; }, {once: true});

        el.querySelector<HTMLButtonElement>('button[data-pp-example-show]')!.click();

        expect(el.querySelector('.parameter')).not.toBeNull();
        expect(detail).toEqual({title: '', json: '{\n  "id": 1\n}', language: 'json'});
    });

    it('highlights server-written YAML in place', async () => {
        const el = await mount<HTMLElement>(
            `<pp-code-viewer language="yaml" data-pp-highlight data-pp-owner="page" data-pp-ssr><pre class="language-yaml"><code>name: burger</code></pre></pp-code-viewer>`,
            'pp-code-viewer');

        expect(el.hasAttribute('data-pp-highlight')).toBe(false);
        expect(el.querySelector('code .token')).not.toBeNull();
        expect(el.querySelector('code')?.textContent).toBe('name: burger');
    });

    it('draws cross-refs again from refs-json with a native toolbar', async () => {
        const ops = Array.from({length: 21}, (_, i) => ({method: i % 2 ? 'get' : 'post', path: '/things/{id}', slug: 'op-' + i}));
        const refs = JSON.stringify({usedByOperations: ops});
        const el = await mount<HTMLElement & {updateComplete: Promise<unknown>}>(
            `<pp-cross-refs refs-json='${refs}' data-pp-owner="page" data-pp-ssr><pp-ref-list type="operations" heading="Consumed By" data-pp-owner="pp-cross-refs" data-pp-ssr><h2>Consumed By</h2></pp-ref-list></pp-cross-refs>`,
            'pp-cross-refs');
        const list = el.querySelector('pp-ref-list') as HTMLElement & {updateComplete: Promise<unknown>};
        await list.updateComplete;

        expect(list.querySelector('h2')?.textContent).toBe('Consumed By');
        const filter = list.querySelector<HTMLSelectElement>('select.pp-ref-filter')!;
        expect(Array.from(filter.options).map((o) => o.value)).toEqual(['', 'GET', 'POST']);
        expect(list.querySelector('input.pp-ref-search[type="search"]')).not.toBeNull();

        change(filter, 'GET');
        await list.updateComplete;
        const paginated = list.querySelector('pp-paginated-list') as HTMLElement & {updateComplete: Promise<unknown>};
        await paginated.updateComplete;
        expect(list.querySelectorAll('.operation-ref-row')).toHaveLength(10);
    });

    it('keeps a server-written security scheme', async () => {
        const el = await mount<HTMLElement & {updateComplete: Promise<unknown>}>(
            `<pp-security-scheme id="pp-model-security-scheme" data-pp-owner="page" data-pp-ssr><div class="scheme-properties"><div class="property"><span class="prop-name">type</span></div></div></pp-security-scheme>`,
            'pp-security-scheme');
        el.setAttribute('scheme-json', '{"type":"http"}');
        await el.updateComplete;

        expect(el.querySelector('.scheme-properties .prop-name')?.textContent).toBe('type');
        expect(el.querySelectorAll('.property')).toHaveLength(1);
    });
});
