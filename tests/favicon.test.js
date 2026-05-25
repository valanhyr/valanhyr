import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());

function read(file) {
  return fs.readFileSync(path.join(repoRoot, file), 'utf8');
}

test('favicon assets and <link rel="icon"> tags exist', () => {
  const index = read('index.html');

  // Tags + order (SVG variants first, ICO fallback last)
  const iDark = index.indexOf('href="favicon-dark.svg"');
  const iLight = index.indexOf('href="favicon-light.svg"');
  const iIco = index.indexOf('href="favicon.ico"');

  assert.ok(iDark !== -1, 'Missing favicon-dark.svg <link rel="icon">');
  assert.ok(iLight !== -1, 'Missing favicon-light.svg <link rel="icon">');
  assert.ok(iIco !== -1, 'Missing favicon.ico <link rel="icon">');

  assert.ok(iDark < iIco, 'Expected favicon-dark.svg to appear before favicon.ico');
  assert.ok(iLight < iIco, 'Expected favicon-light.svg to appear before favicon.ico');

  // Files
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon-dark.svg')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon-light.svg')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon.ico')));
});
