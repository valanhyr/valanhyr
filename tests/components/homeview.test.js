
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
        for (const tag of ['hero-banner', 'cv-about', 'cv-skills', 'cv-experience', 'cv-projects', 'cv-education', 'cv-contact']) {
            if (!html.includes(`<${tag}`)) {
                throw new Error(`HomeView did not render ${tag}`);
            }
        }

        console.log('✅ HomeView test passed!');
    } catch (err) {
        console.error('❌ HomeView test failed:', err.message);
        process.exit(1);
    }
}

runTest();
