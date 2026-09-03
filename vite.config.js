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

      // The repository contains the Font Awesome Pro CSS definitions, but its
      // matching webfont binaries are not stored in the repository. Production
      // therefore needs a reliable font source or the icon glyphs render blank.
      // Keep the existing CSS/design and provide the matching free Font Awesome
      // font files as a fallback for the solid/regular/brand icons used by pages.
      const iconCss = path.resolve(srcDestination, 'all.min.css');
      if (fs.existsSync(iconCss)) {
        fs.appendFileSync(iconCss, `\n\n/* Next Level production icon font fallback */\n@font-face{font-family:"Font Awesome 6 Pro";font-style:normal;font-weight:900;font-display:block;src:url("https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/webfonts/fa-solid-900.woff2") format("woff2")}\n@font-face{font-family:"Font Awesome 6 Pro";font-style:normal;font-weight:400;font-display:block;src:url("https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/webfonts/fa-regular-400.woff2") format("woff2")}\n@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:block;src:url("https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/webfonts/fa-brands-400.woff2") format("woff2")}\n.fa-basket-shopping-simple{--fa:"\\f291"}\n`);
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
