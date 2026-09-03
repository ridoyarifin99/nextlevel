const { defineConfig } = require('vite');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function copyRuntimeDirectories() {
  return {
    name: 'nextlevel-copy-runtime-files',
    apply: 'build',
    writeBundle() {
      const outDir = path.resolve(root, 'dist');

      // These folders are intentionally kept at the project root because
      // the existing HTML uses stable root-relative URLs such as /js/...,
      // /images/... and /assets/.... They are copied only into Vite's
      // generated build output; nothing is committed to dist.
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

      // AOS is currently loaded as a classic script from src/aos.js.
      // Keep that existing source structure and make the file available
      // at the same URL in the production build.
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
    sourcemap: false
  }
});
