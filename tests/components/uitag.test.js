import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiTag } from '../../src/components/ui/UiTag.js';

test('UiTag Component', async (t) => {
    const tag = new UiTag();
    await t.test('should register and render', () => {
        assert.ok(global.customElements.get('ui-tag'));
        tag.connectedCallback();
        assert.match(tag.shadowRoot.innerHTML, /class="[^"]*tag[^"]*"/);
    });
});
