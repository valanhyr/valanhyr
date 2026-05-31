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

    const robotsContent =
        'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const tagHasAttr = (tag, attrName, attrValue) =>
        new RegExp(`${attrName}\\s*=\\s*["']${escapeRegExp(attrValue)}["']`, 'i').test(tag);

    await t.test('includes robots meta tag', () => {
        const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

        assert.ok(
            metaTags.some(
                (tag) =>
                    tagHasAttr(tag, 'name', 'robots') &&
                    new RegExp(
                        `content\\s*=\\s*["'][^"']*${escapeRegExp(robotsContent)}[^"']*["']`,
                        'i'
                    ).test(tag)
            ),
            'Expected <meta> tag with name="robots" and required content'
        );
    });

    await t.test('includes sitemap link tag', () => {
        const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

        assert.ok(
            linkTags.some(
                (tag) =>
                    tagHasAttr(tag, 'rel', 'sitemap') &&
                    tagHasAttr(tag, 'href', '/sitemap.xml') &&
                    tagHasAttr(tag, 'type', 'application/xml')
            ),
            'Expected <link> tag with rel="sitemap" href="/sitemap.xml" type="application/xml"'
        );
    });
});
