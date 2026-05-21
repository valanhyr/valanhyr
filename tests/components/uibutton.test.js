import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiButton } from '../../src/components/ui/UiButton.js';

test('UiButton Component', async (t) => {
    const button = new UiButton();

    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('ui-button'));
    });

    await t.test('should render button element', () => {
        button.connectedCallback();
        assert.match(button.shadowRoot.innerHTML, /<button/);
    });
});
