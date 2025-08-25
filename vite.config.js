// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild', // 'esbuild' is the default for JS and CSS
    cssMinify: 'lightningcss', // Use Lightning CSS for CSS minification
  },
});