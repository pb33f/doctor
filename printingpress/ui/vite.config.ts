import { defineConfig } from 'vite';
import path from 'path';

const cowboyRoot = path.resolve(__dirname, 'node_modules/@pb33f/cowboy-components');

export default defineConfig({
  resolve: {
    alias: {
      '@pb33f/cowboy-components': cowboyRoot + '/src',
    },
  },
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
