import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { CvSkills } from '../../src/components/sections/CvSkills.js';

test('CvSkills Component', async (t) => {
    await t.test('should show skeleton then load skills', async () => {
        const component = new CvSkills();
        component.connectedCallback();
        
        // Should show skeleton initially
        assert.match(component.shadowRoot.innerHTML, /skeleton/i);

        // Wait for SanityService simulation delay
        await new Promise(r => setTimeout(r, 800));

        // Should render skills
        assert.match(component.shadowRoot.innerHTML, /Skills/i);
        // Verify grid boxes (assuming data has groups)
        assert.match(component.shadowRoot.innerHTML, /class="box"/);
    });
});
