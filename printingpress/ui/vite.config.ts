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

export default defineConfig({
  resolve: {
    alias: {
      '@pb33f/cowboy-components': cowboyRoot + '/src',
    },
  },
  plugins: [copyCowboyCSS()],
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
