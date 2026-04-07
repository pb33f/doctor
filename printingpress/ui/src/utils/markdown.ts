import {html, nothing} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {marked} from 'marked';

marked.use({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(
  markdown?: string,
  opts: {inline?: boolean; className?: string} = {},
) {
  if (!markdown) return nothing;

  const rendered = opts.inline
    ? marked.parseInline(markdown, {async: false})
    : marked.parse(markdown, {async: false});
  const className = opts.className ?? (opts.inline ? 'pp-markdown-inline' : 'pp-markdown');

  if (opts.inline) {
    return html`<span class=${className}>${unsafeHTML(String(rendered))}</span>`;
  }

  return html`<div class=${className}>${unsafeHTML(String(rendered))}</div>`;
}
