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

      // Keep the existing repository structure. These are source directories;
      // they are copied only into Vite's generated build output.
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

      // AOS is an existing classic browser script loaded from src/aos.js.
      // Preserve the current source location and URL in production.
      const aosSource = path.resolve(root, 'src', 'aos.js');
      const aosDestination = path.resolve(outDir, 'src', 'aos.js');

      if (fs.existsSync(aosSource)) {
        fs.mkdirSync(path.dirname(aosDestination), { recursive: true });
        fs.copyFileSync(aosSource, aosDestination);
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
