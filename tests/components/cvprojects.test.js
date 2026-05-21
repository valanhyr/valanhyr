import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { CvProjects } from '../../src/components/sections/CvProjects.js';

test('CvProjects Component', async (t) => {
    await t.test('should show skeleton then load projects', async () => {
        const component = new CvProjects();
        component.connectedCallback();
        
        // Should show skeleton initially
        assert.match(component.shadowRoot.innerHTML, /skeleton/i);

        // Wait for SanityService simulation delay (600ms in service + some buffer)
        await new Promise(r => setTimeout(r, 800));

        // Should render projects
        assert.match(component.shadowRoot.innerHTML, /Projects/i);
    });
});
