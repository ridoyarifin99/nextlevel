const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

for (const dir of ['assets', 'images', 'js', 'src']) {
  const source = path.join(root, dir);
  const target = path.join(dist, dir);
  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true, force: true });
  }
}

console.log('Copied static runtime directories into dist/.');
