import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { CvExperience } from '../../src/components/sections/CvExperience.js';

test('CvExperience Component', async (t) => {
    await t.test('should show skeleton then load experience', async () => {
        const component = new CvExperience();
        component.connectedCallback();
        
        // Should show skeleton initially
        assert.match(component.shadowRoot.innerHTML, /skeleton/i);

        // Wait for SanityService simulation delay (600ms in service + some buffer)
        await new Promise(r => setTimeout(r, 800));

        // Should render experience
        assert.match(component.shadowRoot.innerHTML, /Experience/i);
        // Verify that it renders some timeline items (assuming cv.json has experience data)
        assert.match(component.shadowRoot.innerHTML, /timeline-slot/);
    });
});
