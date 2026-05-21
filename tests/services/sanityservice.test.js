import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { SanityService } from '../../src/services/SanityService.js';

test('SanityService', async (t) => {
    await t.test('fetch should return all data when no _type match', async () => {
        const data = await SanityService.fetch('*');
        assert.ok(data.basics);
        assert.equal(data.basics.name, 'Your Name');
    });

    await t.test('urlFor should return a builder', () => {
        const builder = SanityService.urlFor({ asset: { _ref: 'image-abc-png' } });
        assert.equal(typeof builder.width, 'function');
        assert.equal(typeof builder.height, 'function');
        assert.equal(typeof builder.url, 'function');
    });

    await t.test('ImageUrlBuilder should format URL correctly', () => {
        const url = SanityService.urlFor({ asset: { _ref: 'image-test-jpg' } })
            .width(200)
            .height(100)
            .url();
        assert.equal(url, 'assets/test.jpg?w=200&h=100');
    });

    await t.test('ImageUrlBuilder should handle raw strings', () => {
        const url = SanityService.urlFor('image-test-png').url();
        assert.equal(url, 'assets/test.png');
    });

    await t.test('fetch should filter by _type if match found', async () => {
        // Since current cv.json doesn't have _type, this should return empty array
        const data = await SanityService.fetch('*[_type == "project"]');
        assert.ok(Array.isArray(data));
        assert.equal(data.length, 0);
    });
});
