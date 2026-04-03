import { defineConfig } from 'vite';
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

// In lite builds, stub out the class-diagram import (and its mermaid dependency)
// to produce a smaller bundle without mermaid.js (~800KB savings).
function stubMermaidInLite() {
  if (!isLite) return null;
  return {
    name: 'stub-mermaid-lite',
    resolveId(source: string) {
      if (source.includes('class-diagram') || source.includes('mermaid-renderer')) {
        return '\0stub-class-diagram';
      }
    },
    load(id: string) {
      if (id === '\0stub-class-diagram') {
        return 'export {}';
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@pb33f/cowboy-components': cowboyRoot + '/src',
    },
  },
  plugins: [copyCowboyCSS(), stubMermaidInLite()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'PrintingPress',
      formats: ['iife'],
      fileName: () => 'printing-press.js',
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
