// Printing Press - behaviour of server-written content
// Copyright 2024-2026 Princess Beef Heavy Industries, LLC
//
// The server writes page content (property tables, variants, examples, the
// model split) as markup, and the components it sits in never draw it again.
// These functions give that markup its behaviour.

import type {ShowExampleDetail} from '../components/shared/example-drawer.js';

/** selectVariant shows one variant of a variant group, and marks its tab and select. */
export function selectVariant(group: Element, index: number) {
  for (const tab of group.querySelectorAll<HTMLElement>(':scope > .pp-variant-tabs > .pp-variant-tab')) {
    tab.setAttribute('aria-selected', String(Number(tab.dataset.index) === index));
  }
  for (const panel of group.querySelectorAll<HTMLElement>(':scope > .pp-variant-panel')) {
    panel.hidden = Number(panel.dataset.index) !== index;
  }
  const select = group.querySelector<HTMLSelectElement>(':scope > .pp-variant-select');
  if (select) {
    select.value = String(index);
  }
}

/** bindVariantChoice makes the variant tabs and selects inside root choose a variant. */
export function bindVariantChoice(root: HTMLElement) {
  root.addEventListener('click', (event) => {
    const tab = (event.target as Element | null)?.closest?.('.pp-variant-tab') as HTMLElement | null;
    const group = tab?.closest('[data-pp-variants]');
    if (tab && group && root.contains(group)) {
      selectVariant(group, Number(tab.dataset.index));
    }
  });
  root.addEventListener('change', (event) => {
    const select = (event.target as Element | null)?.closest?.('.pp-variant-select') as HTMLSelectElement | null;
    const group = select?.closest('[data-pp-variants]');
    if (select && group && root.contains(group)) {
      selectVariant(group, Number(select.value));
    }
  });
}

/** shownExampleCode is the code of the example a selector shows now. */
function shownExampleCode(root: HTMLElement, from: Element): string {
  const entry = from.closest('.pp-example-entry') ?? root.querySelector('.pp-example-entry:not([hidden])');
  return entry?.querySelector('pre code')?.textContent ?? '';
}

/** showDrawerExample opens one of a drawer-mode selector's examples in the example drawer. */
function showDrawerExample(root: HTMLElement, index: string, language: string) {
  const data = Array.from(root.querySelectorAll<HTMLTemplateElement>('template.pp-example-data'))
    .find((template) => template.dataset.index === index);
  if (!data) {
    return;
  }
  let json = data.content.textContent ?? '';
  if (language === 'json') {
    try {
      json = JSON.stringify(JSON.parse(json), null, 2);
    } catch { /* show it as written */ }
  }
  root.dispatchEvent(new CustomEvent<ShowExampleDetail>('pp-show-example', {
    bubbles: true,
    composed: true,
    detail: {title: data.dataset.key ?? '', json, language: language as ShowExampleDetail['language']},
  }));
}

/** bindExampleActions makes an example selector's select and buttons work. */
export function bindExampleActions(root: HTMLElement, title: () => string, language: () => string) {
  root.addEventListener('change', (event) => {
    const select = (event.target as Element | null)?.closest?.('.pp-example-select') as HTMLSelectElement | null;
    if (!select || !root.contains(select)) {
      return;
    }
    if (select.hasAttribute('data-pp-example-show')) {
      showDrawerExample(root, select.value, language());
      select.value = '';
      return;
    }
    const index = Number(select.value);
    for (const element of root.querySelectorAll<HTMLElement>('.pp-example-entry, .pp-example-desc')) {
      element.hidden = Number(element.dataset.index) !== index;
    }
  });
  root.addEventListener('click', (event) => {
    const show = (event.target as Element | null)?.closest?.('button[data-pp-example-show]') as HTMLButtonElement | null;
    if (show && root.contains(show)) {
      showDrawerExample(root, show.dataset.ppExampleShow ?? '0', language());
      return;
    }
    const button = (event.target as Element | null)?.closest?.('[data-pp-example-action]') as HTMLElement | null;
    if (!button || !root.contains(button)) {
      return;
    }
    const code = shownExampleCode(root, button);
    switch (button.dataset.ppExampleAction) {
      case 'copy':
        void navigator.clipboard?.writeText(code);
        break;
      case 'expand':
        root.dispatchEvent(new CustomEvent<ShowExampleDetail>('pp-show-example', {
          bubbles: true,
          composed: true,
          detail: {title: title(), json: code, language: language() as ShowExampleDetail['language']},
        }));
        break;
      case 'hide':
        root.dispatchEvent(new CustomEvent('pp-hide-example', {bubbles: true, composed: true}));
        break;
    }
  });
}

const SPLIT_MIN = 1;
const SPLIT_MAX = 100;

/** The components that bind the schema splits they hold. */
const SPLIT_OWNERS = 'pp-model-page, pp-media-type-selector';

/**
 * bindSplits makes each schema split root holds (and no other component
 * inside it holds) resize from its divider, and its example hide and come back.
 */
export function bindSplits(root: HTMLElement) {
  for (const split of root.querySelectorAll<HTMLElement>('[data-pp-model-split]')) {
    if (split.parentElement?.closest(SPLIT_OWNERS) === root) {
      bindSplit(split);
    }
  }
}

function bindSplit(split: HTMLElement) {
  const divider = split.querySelector<HTMLElement>(':scope > .schema-split-divider');
  const restore = split.querySelector<HTMLElement>('[data-pp-example-restore]');
  const setPosition = (position: number) => {
    const clamped = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, position));
    split.style.setProperty('--schema-split-position', `${clamped}%`);
    divider?.setAttribute('aria-valuenow', String(Math.round(clamped)));
  };
  const positionFromClientX = (clientX: number) => {
    const rect = split.getBoundingClientRect();
    if (rect.width > 0) {
      setPosition(((clientX - rect.left) / rect.width) * 100);
    }
  };

  split.addEventListener('pp-hide-example', () => {
    split.setAttribute('data-example-hidden', '');
    if (restore) restore.hidden = false;
  });
  restore?.addEventListener('click', () => {
    split.removeAttribute('data-example-hidden');
    restore.hidden = true;
  });
  divider?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    divider.setPointerCapture?.(event.pointerId);
    positionFromClientX(event.clientX);
    const onMove = (move: PointerEvent) => positionFromClientX(move.clientX);
    const onEnd = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onEnd);
      document.removeEventListener('pointercancel', onEnd);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
    document.addEventListener('pointercancel', onEnd);
  });
  divider?.addEventListener('keydown', (event) => {
    const current = Number(divider.getAttribute('aria-valuenow')) || 60;
    const step = event.shiftKey ? 10 : 1;
    const next = ({ArrowLeft: current - step, ArrowRight: current + step, Home: SPLIT_MIN, End: SPLIT_MAX} as Record<string, number>)[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setPosition(next);
    }
  });
}

/** showChoice shows the child of root, among those matching selector, at index. */
function showChoice(root: HTMLElement, selector: string, index: number): HTMLElement | null {
  let shown: HTMLElement | null = null;
  for (const element of root.querySelectorAll<HTMLElement>(selector)) {
    element.hidden = Number(element.dataset.index) !== index;
    if (!element.hidden) {
      shown = element;
    }
  }
  return shown;
}

/**
 * bindMediaTypeChoice makes a media-type selector's select show the block of
 * the media type it names. Each block holds its own select; focus moves to the
 * select of the block that shows.
 */
export function bindMediaTypeChoice(root: HTMLElement) {
  root.addEventListener('change', (event) => {
    const select = (event.target as Element | null)?.closest?.('.pp-media-type-select') as HTMLSelectElement | null;
    if (!select || select.closest('pp-media-type-selector') !== root) {
      return;
    }
    const index = Number(select.value);
    const next = showChoice(root, ':scope > .pp-media-type-block', index)?.querySelector<HTMLSelectElement>('.pp-media-type-select');
    if (next && next !== select) {
      next.value = String(index);
      next.focus();
    }
  });
}

/** bindCurlChoice makes a cURL command's select show the variant it names. */
export function bindCurlChoice(root: HTMLElement) {
  root.addEventListener('change', (event) => {
    const select = (event.target as Element | null)?.closest?.('.pp-curl-select') as HTMLSelectElement | null;
    if (select && root.contains(select)) {
      showChoice(root, ':scope > .pp-curl-variant', Number(select.value));
    }
  });
}

/**
 * bindReveal makes the in-page links inside root (data-pp-reveal) open the
 * details their target sits in, then scroll the target into view.
 */
export function bindReveal(root: HTMLElement) {
  root.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[data-pp-reveal]') as HTMLAnchorElement | null;
    if (!link || !root.contains(link)) {
      return;
    }
    const target = document.getElementById(decodeURIComponent((link.getAttribute('href') ?? '').slice(1)));
    if (!target) {
      return;
    }
    event.preventDefault();
    const block: ScrollLogicalPosition = link.classList.contains('error-anchor') ? 'nearest' : 'center';
    const reveal = () => target.scrollIntoView({behavior: 'auto', block});
    const details = target.closest('wa-details') as (HTMLElement & {open: boolean; updateComplete?: Promise<unknown>}) | null;
    if (details && !details.open) {
      details.open = true;
      void (details.updateComplete ?? Promise.resolve()).then(reveal);
      return;
    }
    reveal();
  });
}
