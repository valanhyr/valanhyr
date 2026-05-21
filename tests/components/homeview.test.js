import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { HomeView } from '../../src/components/views/HomeView.js';

test('HomeView Component', async (t) => {
    const view = new HomeView();

    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('home-view'));
    });

    await t.test('should render all child sections in correct order', () => {
        view.connectedCallback();
        const html = view.shadowRoot.innerHTML;
        
        const sections = [
            'hero-banner', 
            'cv-about', 
            'cv-platform',
            'cv-skills', 
            'cv-experience', 
            'cv-projects', 
            'cv-education', 
            'cv-contact'
        ];
        
        for (const tag of sections) {
            assert.match(html, new RegExp(`<${tag}`), `Missing section: ${tag}`);
        }

        // Order checks
        const iAbout = html.indexOf('<cv-about');
        const iPlatform = html.indexOf('<cv-platform');
        const iSkills = html.indexOf('<cv-skills');
        const iExp = html.indexOf('<cv-experience');

        assert.ok(iAbout < iPlatform, 'About should be before Platform');
        assert.ok(iPlatform < iSkills, 'Platform should be before Skills');
        assert.ok(iSkills < iExp, 'Skills should be before Experience');
    });
});
