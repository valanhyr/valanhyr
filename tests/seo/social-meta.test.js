import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'index.html');

test('index.html contains OG/Twitter + theme-color tags', () => {
  const html = fs.readFileSync(indexPath, 'utf8');

  assert.match(html, /property="og:type"\s+content="website"/i);
  assert.match(html, /property="og:site_name"\s+content="Xisco Raya"/i);
  assert.match(html, /property="og:title"/i);
  assert.match(html, /property="og:description"/i);
  assert.match(html, /property="og:url"\s+content="https:\/\/valanhyr\.pages\.dev\/"/i);

  assert.match(html, /name="twitter:card"\s+content="summary"/i);
  assert.match(html, /name="twitter:title"/i);
  assert.match(html, /name="twitter:description"/i);

  assert.match(html, /name="color-scheme"\s+content="dark light"/i);
  assert.match(html, /name="theme-color"\s+content="#08080c"\s+media="\(prefers-color-scheme: dark\)"/i);
  assert.match(html, /name="theme-color"\s+content="#f5f5f7"\s+media="\(prefers-color-scheme: light\)"/i);
});
