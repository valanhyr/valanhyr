import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { AppNavbar } from '../../src/components/layout/AppNavbar.js';

test('AppNavbar Component', async (t) => {
    const navbar = new AppNavbar();
    
    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('app-navbar'));
    });

    await t.test('should render header and primary nav', () => {
        navbar.connectedCallback();
        const html = navbar.shadowRoot.innerHTML;
        assert.match(html, /<header>/);
        assert.match(html, /aria-label="Primary"/);
    });
});
