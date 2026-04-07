import { defineConfig, Plugin } from 'vite';
import path from 'path';
import { copyFileSync } from 'fs';

const cowboyRoot = path.resolve(__dirname, 'node_modules/@pb33f/cowboy-components');

// Copy cowboy-components.css from the source package into ../static/ during build
// so it can be go:embed'd. This avoids committing a duplicate of the file.
function copyCowboyCSS() {
  return {
    name: 'copy-cowboy-css',
    closeBundle() {
      const src = path.join(cowboyRoot, 'src/css/cowboy-components.css');
      const dest = path.resolve(__dirname, '../static/cowboy-components.css');
      copyFileSync(src, dest);
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
      if (source.includes('class-diagram') || source.includes('mermaid-renderer')
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
    alias: {
      '@pb33f/cowboy-components': cowboyRoot + '/src',
      '@report-elkjs': path.resolve(cowboyRoot, 'node_modules/elkjs/lib/elk.bundled.js'),
    },
  },
  plugins: [copyCowboyCSS(), stubVisualizationsInLite(), stubWorkerInline()],
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
  },
});
