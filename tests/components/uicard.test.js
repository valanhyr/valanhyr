import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiCard } from '../../src/components/ui/UiCard.js';

test('UiCard Component', async (t) => {
    const card = new UiCard();
    await t.test('should register and render', () => {
        assert.ok(global.customElements.get('ui-card'));
        card.connectedCallback();
        assert.match(card.shadowRoot.innerHTML, /class="[^"]*card[^"]*"/);
    });
});
