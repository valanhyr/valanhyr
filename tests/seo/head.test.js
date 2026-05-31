import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('index.html <head> SEO tags', async (t) => {
    const indexHtmlPath = path.resolve(__dirname, '..', '..', 'index.html');
    const html = await readFile(indexHtmlPath, 'utf8');

    await t.test('includes robots meta tag', () => {
        assert.match(
            html,
            /<meta\s+name=["']robots["']\s+content=["']index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1["']\s*>/i
        );
    });

    await t.test('includes sitemap link tag', () => {
        assert.match(
            html,
            /<link\s+rel=["']sitemap["']\s+type=["']application\/xml["']\s+href=["']\/sitemap\.xml["']\s*>/i
        );
    });
});
