// tests/components/homeview.test.js

// Mock browser globals
class MockHTMLElement {
    constructor() {
        this.shadowRoot = { innerHTML: '' };
    }
    attachShadow() { return this.shadowRoot; }
}

global.HTMLElement = MockHTMLElement;

global.customElements = {
    define: (tag, cls) => {
        global.customElements.registry = global.customElements.registry || {};
        global.customElements.registry[tag] = cls;
    }
};

async function runTest() {
    try {
        const { HomeView } = await import('../../src/components/views/HomeView.js');
        const view = new HomeView();

        if (!global.customElements.registry['home-view']) {
            throw new Error('home-view not registered');
        }

        view.connectedCallback();

        const html = view.shadowRoot.innerHTML;

        const tags = [
            'hero-banner',
            'cv-about',
            'cv-platform',
            'cv-skills',
            'cv-experience',
            'cv-projects',
            'cv-education',
            'cv-contact'
        ];

        for (const tag of tags) {
            if (!html.includes(`<${tag}`)) {
                throw new Error(`HomeView did not render ${tag}`);
            }
        }

        // Order checks (skills before experience)
        const iSkills = html.indexOf('<cv-skills');
        const iExp = html.indexOf('<cv-experience');
        if (iSkills === -1 || iExp === -1 || iSkills > iExp) {
            throw new Error('Expected Skills section to appear before Experience');
        }

        // Platform should be between About and Skills
        const iAbout = html.indexOf('<cv-about');
        const iPlatform = html.indexOf('<cv-platform');
        if (iAbout === -1 || iPlatform === -1 || iSkills === -1 || !(iAbout < iPlatform && iPlatform < iSkills)) {
            throw new Error('Expected Platform section between About and Skills');
        }

        console.log('✅ HomeView test passed!');
    } catch (err) {
        console.error('❌ HomeView test failed:', err.message);
        process.exit(1);
    }
}

runTest();
