import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { CvAbout } from '../../src/components/sections/CvAbout.js';

test('CvAbout Component', async (t) => {
    await t.test('should show skeleton then load about content', async () => {
        const component = new CvAbout();
        component.connectedCallback();
        
        // Should show skeleton initially
        assert.match(component.shadowRoot.innerHTML, /skeleton/i);

        // Wait for SanityService simulation delay
        await new Promise(r => setTimeout(r, 800));

        // Should render content
        assert.match(component.shadowRoot.innerHTML, /CV \/ Summary/i);
        // Verify paragraphs (assuming data has paragraphs)
        assert.match(component.shadowRoot.innerHTML, /<p>/);
    });
});
