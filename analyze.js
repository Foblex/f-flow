const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.resolve(__dirname, 'dist/f-flow-portal/browser');

try {
  execSync('ng build', { stdio: 'inherit' });
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
} catch (e) {
  process.exit(1);
}

const jsFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
const mapFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.js.map'));

const paired = jsFiles
  .map(js => {
    const map = mapFiles.find(m => m.startsWith(js));
    return map ? [path.join(distPath, js), path.join(distPath, map)] : null;
  })
  .filter(Boolean);

if (paired.length === 0) {
  process.exit(1);
}

// eslint-disable-next-line no-console
paired.forEach(([js]) => console.log('- ' + path.basename(js)));

try {
  const args = paired.map(([js, map]) => `"${js}" "${map}"`).join(' ');
  execSync(`npx source-map-explorer ${args}`, { stdio: 'inherit' });
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
} catch (e) {
  process.exit(1);
}
