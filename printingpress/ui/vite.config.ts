import { defineConfig, Plugin, searchForWorkspaceRoot } from 'vite';
import path from 'path';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import postcss, { type Root } from 'postcss';

const require = createRequire(import.meta.url);
const cowboyCssPath = require.resolve('@pb33f/cowboy-components/cowboy-components.css');
const cowboyThemePath = require.resolve('@pb33f/cowboy-components/pb33f-theme.css');
const cowboyRoot = path.resolve(path.dirname(cowboyCssPath), '..');
const elkBundlePath = require.resolve('elkjs/lib/elk.bundled.js', {
  paths: [cowboyRoot, __dirname],
});

// Copy exported cowboy static CSS assets into ../static/ during build so they can
// be go:embed'd. The theme file needs a font-path rewrite for the hosted docs
// layout, but the source of truth remains cowboy-components.
function addWarningColorAlias(themeCss: string): string {
  return themeCss.replace(
    /(^\s*--warn-color:\s*[^;]+;\s*$)(?!\n\s*--warning-color:)/gm,
    '$1\n    --warning-color: var(--warn-color);'
  );
}

function copyCowboyStaticAssets() {
  return {
    name: 'copy-cowboy-static-assets',
    closeBundle() {
      const cowboyCssDest = path.resolve(__dirname, '../static/cowboy-components.css');
      copyFileSync(cowboyCssPath, cowboyCssDest);

      const themeDest = path.resolve(__dirname, '../static/pb33f-theme.css');
      const themeCss = addWarningColorAlias(readFileSync(cowboyThemePath, 'utf8'))
        .replaceAll("url('../fonts/", "url('fonts/")
        .replaceAll('url("../fonts/', 'url("fonts/');
      writeFileSync(themeDest, themeCss);
    },
  };
}

// The Web Awesome theme and the Printing Press component styles, written to
// ../static/ as single files for the page head. Only the theme tokens are
// taken from Web Awesome: its native and utility styles would restyle the
// whole page.
const webAwesomeThemePath = require.resolve('@awesome.me/webawesome/dist/styles/themes/default.css');
const ppComponentsCssPath = require.resolve('@pb33f/printing-press-components/styles/components.css');
const ppComponentsRoot = path.resolve(path.dirname(ppComponentsCssPath), '..');

// inlineCssImports replaces each @import url('...') with the file it names, so
// the result needs no further requests.
function inlineCssImports(file: string, seen = new Set<string>()): string {
  if (seen.has(file)) return '';
  seen.add(file);
  return readFileSync(file, 'utf8').replace(/@import\s+url\(['"]?([^'")]+)['"]?\)\s*;/g, (_m, rel: string) =>
    inlineCssImports(path.resolve(path.dirname(file), rel), seen));
}

// The Printing Press components render in light DOM. Their sheets are
// plain CSS under src/; styles/components.json names each component's sheets
// in cascade order. The build places them so the cascade matches the shadow
// roots they came from:
//
//   pp-host         a component's rules about itself. Page rules, and the
//                   rules of a component that renders it, beat these, as
//                   outer rules beat :host.
//   page            the page sheets (the head imports them into this layer).
//   pp-reset        inside a component, standard elements and the components
//                   it renders go back to browser defaults, so page rules do
//                   not reach them; inherited values still do.
//   pp-host-nested  host rules again, for components another component
//                   rendered (data-pp-owner names it), so the reset leaves
//                   them their own styles.
//   (no layer)      the rules about a component's insides. They win.
//
// Every block is an @scope from the component to the components inside it,
// so rules stay inside their component. Content a component's template put in
// another component's slot (a pp-slot it owns) stays in its scope, as slotted
// content stayed in its shadow root; content the page wrote stays out.
const uiSource = path.resolve(__dirname, 'src');
export const LAYER_ORDER = '@layer pp-host, page, pp-reset, pp-host-nested;';

interface ComponentStyles {
  nested: string[];
  components: Record<string, string[]>;
}

// The standard elements the reset reaches. Other custom elements are left
// alone: their own shadow styles must keep working.
const resetElements = ['a', 'abbr', 'address', 'article', 'aside', 'b', 'blockquote', 'br', 'button', 'caption', 'code', 'dd', 'del',
  'details', 'dfn', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hr', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'mark', 'nav', 'ol', 'p', 'pre', 'q', 's',
  'samp', 'section', 'select', 'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'tr', 'u', 'ul', 'var'];

const HOST = ':where(:scope:not(pp-slot)';

function stripLeadingComment(css: string): string {
  return css.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
}

// lastCompound is the part of a selector after its last top-level combinator.
function lastCompound(selector: string): string {
  let depth = 0;
  let cut = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (depth === 0 && (c === ' ' || c === '>' || c === '+' || c === '~')) cut = i + 1;
  }
  return selector.slice(cut).trim();
}

function isHostRule(selector: string): boolean {
  return lastCompound(selector).startsWith(HOST);
}

// splitHostRules keeps, in a copy of root, only the selectors that are (or
// are not) about the component itself.
function splitHostRules(root: Root, host: boolean): string {
  const copy = root.clone();
  copy.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes$/.test((rule.parent as {name: string}).name)) return;
    const kept = rule.selectors.filter((selector) => isHostRule(selector) === host);
    if (kept.length) rule.selectors = kept;
    else rule.remove();
  });
  copy.walkAtRules((atRule) => {
    if (atRule.nodes && atRule.nodes.length === 0) atRule.remove();
  });
  return copy.toString().trim();
}

function printingPressUiCss(): string {
  const manifest = JSON.parse(readFileSync(path.join(uiSource, 'styles/components.json'), 'utf8')) as ComponentStyles;
  const tags = Object.keys(manifest.components);
  // The library components (manifest.nested) are not boundaries: a component
  // styles the library components it draws, as it did when both sat in its
  // shadow root.
  const nested = `:scope :is(${[...tags].sort().join(', ')}) > *`;
  const limit = `${nested}, :scope pp-slot > *`;
  // insideLimit stops at nested components and at others' slots, but not at
  // the child of a nested component that holds a slot this component owns.
  const insideLimit = (tag: string) =>
    `${nested}:not(:has(pp-slot[data-pp-owner="${tag}"])), :scope pp-slot:not([data-pp-owner="${tag}"]) > *`;
  const nestedOwner = '[data-pp-owner]:not([data-pp-owner="page"])';
  const host: string[] = [];
  const hostNested: string[] = [];
  const inside: string[] = [];
  for (const [tag, sheets] of Object.entries(manifest.components)) {
    const text = sheets.map((sheet) => stripLeadingComment(readFileSync(path.join(uiSource, sheet), 'utf8'))).join('\n');
    const root = postcss.parse(text);
    const hostRules = splitHostRules(root, true);
    const insideRules = splitHostRules(root, false);
    if (hostRules) {
      host.push(`  @scope (${tag}) to (${limit}) {\n${hostRules}\n  }`);
      hostNested.push(`  @scope (${tag}${nestedOwner}) to (${limit}) {\n${hostRules}\n  }`);
    }
    if (insideRules) {
      inside.push(`@scope (${tag}) to (${insideLimit(tag)}) {\n${insideRules}\n}`);
    }
  }
  // Each component's reset covers its insides, its nested components' hosts,
  // and the content it owns in their slots; the page's content stays out.
  const resetRoots = tags;
  const nestedHosts = [...tags, ...manifest.nested].join(', ');
  const els = resetElements.join(', ');
  const reset = `@layer pp-reset {\n  @scope (${resetRoots.join(', ')}) to (:scope pp-slot[data-pp-owner="page"] > *) {\n    :where(${els}),\n    :where(${els})::before,\n    :where(${els})::after,\n    :where(${els})::marker,\n    :where(${nestedHosts}) {\n      all: revert;\n    }\n  }\n}`;
  const keyframes = stripLeadingComment(readFileSync(path.join(uiSource, 'styles/keyframes.css'), 'utf8'));
  return [
    '/* Printing Press component styles. Built from ui/src by vite.config.ts; edit the sources. */',
    LAYER_ORDER,
    `@layer pp-host {\n${host.join('\n\n')}\n}`,
    reset,
    `@layer pp-host-nested {\n${hostNested.join('\n\n')}\n}`,
    keyframes.trim(),
    inside.join('\n\n'),
  ].join('\n\n') + '\n';
}

function writeComponentStyles() {
  return {
    name: 'write-component-styles',
    closeBundle() {
      writeFileSync(path.resolve(__dirname, '../static/webawesome.css'), inlineCssImports(webAwesomeThemePath));
      copyFileSync(ppComponentsCssPath, path.resolve(__dirname, '../static/printing-press-components.css'));
      writeFileSync(path.resolve(__dirname, '../static/printing-press-ui.css'), printingPressUiCss());
    },
  };
}

const isLite = !!process.env.VITE_BUNDLE_LITE;

// In lite builds, stub out visualization components (class-diagram, mermaid,
// explorer, ELK) to produce a smaller bundle.
function stubVisualizationsInLite(): Plugin | null {
  if (!isLite) return null;
  return {
    name: 'stub-visualizations-lite',
    enforce: 'pre',
    resolveId(source: string) {
      if (source.includes('class-diagram') || source.includes('components/mermaid/mermaid')
          || source.includes('mermaid-renderer')
          || source.includes('focused-explorer') || source.includes('elk-layout-worker')
          || source.includes('graph-dependent-worker')
          || (source.includes('visualizer/explorer') && !source.includes('?worker'))) {
        return '\0stub-visualizations';
      }
    },
    load(id: string) {
      if (id === '\0stub-visualizations') {
        return 'export {}';
      }
    },
  };
}

// Stub all ?worker&inline imports from cowboy-components.
// The inline worker adapters (elk-layout-worker-inline.ts, graph-dependent-worker-inline.ts)
// replace these at runtime via ExplorerComponent.elkWorkerFactory / graphDependentWorkerFactory.
function stubWorkerInline(): Plugin {
  return {
    name: 'stub-worker-inline',
    enforce: 'pre',
    resolveId(source) {
      if (source.includes('.worker') && source.includes('?worker')) {
        // Return a clean virtual ID without the ?worker query so Vite's
        // worker plugin doesn't try to process it as a real worker entry.
        return { id: '\0stub-worker', external: false };
      }
      return null;
    },
    load(id) {
      if (id === '\0stub-worker') {
        return `export default class StubWorker {
          postMessage() {}
          addEventListener() {}
          removeEventListener() {}
          terminate() {}
          set onmessage(_fn) {}
          set onerror(_fn) {}
        }`;
      }
      return null;
    },
  };
}

export default defineConfig({
  resolve: {
    // The component library is linked from its own checkout; one copy of Lit
    // and Web Awesome serves both.
    dedupe: ['lit', '@awesome.me/webawesome'],
    alias: {
      '@report-elkjs': elkBundlePath,
    },
  },
  // The linked component library sits outside this folder; the dev server and
  // the tests may read it.
  server: {
    fs: { allow: [searchForWorkspaceRoot(process.cwd()), ppComponentsRoot] },
  },
  plugins: [copyCowboyStaticAssets(), writeComponentStyles(), stubVisualizationsInLite(), stubWorkerInline()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'PrintingPress',
      formats: ['iife'],
      fileName: () => isLite ? 'printing-press-lite.js' : 'printing-press.js',
    },
    // Do NOT externalize lit - static site must be fully self-contained
    cssCodeSplit: false,
    outDir: 'dist',
    minify: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['test/setup-internals.ts'],
  },
});
