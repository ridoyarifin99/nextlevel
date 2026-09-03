const { defineConfig } = require('vite');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function getHtmlEntries() {
  return Object.fromEntries(
    fs
      .readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
      .map((entry) => [
        entry.name.replace(/\.html$/, ''),
        path.resolve(root, entry.name)
      ])
  );
}

function copyRuntimeDirectories() {
  return {
    name: 'nextlevel-copy-runtime-files',
    apply: 'build',
    writeBundle() {
      const outDir = path.resolve(root, 'dist');

      // Preserve the existing repository structure in the generated Vercel build.
      for (const directory of ['js', 'images', 'assets']) {
        const source = path.resolve(root, directory);
        const destination = path.resolve(outDir, directory);

        if (fs.existsSync(source)) {
          fs.cpSync(source, destination, {
            recursive: true,
            force: true
          });
        }
      }

      // Existing pages use classic assets directly from /src/.
      // Copy the required source runtime files so those URLs also work in production.
      const srcFiles = [
        'output.css',
        'all.min.css',
        'aos.css',
        'aos.js',
        'auth.js'
      ];

      const srcDestination = path.resolve(outDir, 'src');
      fs.mkdirSync(srcDestination, { recursive: true });

      for (const file of srcFiles) {
        const source = path.resolve(root, 'src', file);
        const destination = path.resolve(srcDestination, file);

        if (fs.existsSync(source)) {
          fs.copyFileSync(source, destination);
        }
      }
    }
  };
}

module.exports = defineConfig({
  root,
  base: '/',
  plugins: [copyRuntimeDirectories()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      // This repository is a multi-page HTML site, not a single SPA.
      input: getHtmlEntries()
    }
  }
});
