import { defineConfig, Plugin, searchForWorkspaceRoot } from 'vite';
import path from 'path';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

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

function writeComponentStyles() {
  return {
    name: 'write-component-styles',
    closeBundle() {
      writeFileSync(path.resolve(__dirname, '../static/webawesome.css'), inlineCssImports(webAwesomeThemePath));
      copyFileSync(ppComponentsCssPath, path.resolve(__dirname, '../static/printing-press-components.css'));
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
