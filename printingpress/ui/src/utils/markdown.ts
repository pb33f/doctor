import {html, nothing} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {marked} from 'marked';

type ImportMetaWithEnv = ImportMeta & {
  env?: {
    VITE_BUNDLE_LITE?: string | boolean;
  };
};

function escapeHTML(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeScriptJSON(value: string): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026');
}

function renderMermaidBlock(code: string): string {
  if (!code.trim()) return '';

  return `<pp-mermaid><script type="application/json" class="pp-mermaid-data">${escapeScriptJSON(code)}</script><pre class="pp-mermaid-fallback"><code class="language-mermaid">${escapeHTML(code)}</code></pre></pp-mermaid>`;
}

const liteBuild = Boolean((import.meta as ImportMetaWithEnv).env?.VITE_BUNDLE_LITE);

marked.use({
  gfm: true,
  breaks: false,
  renderer: liteBuild ? undefined : {
    code(code: string, infostring: string | undefined) {
      if (document.body?.dataset.ppNoMermaid === 'true') return false;

      const language = infostring?.trim().split(/\s+/, 1)[0];
      if (!language || language.toLowerCase() !== 'mermaid') return false;

      return renderMermaidBlock(code);
    },
  },
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
