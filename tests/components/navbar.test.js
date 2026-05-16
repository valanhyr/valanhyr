
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
        const { AppNavbar } = await import('../../src/components/layout/AppNavbar.js');
        const navbar = new AppNavbar();

        // Ensure registry works
        if (!global.customElements.registry['app-navbar']) {
            throw new Error('app-navbar not registered');
        }

        navbar.connectedCallback();

        const html = navbar.shadowRoot.innerHTML;
        if (!html.includes('<header>')) {
            throw new Error('AppNavbar did not render header');
        }
        if (!html.includes('CV.SYS') && !html.includes('Your Name')) {
            throw new Error('AppNavbar did not render brand fallback');
        }
        if (!html.includes('aria-label="Primary"')) {
            throw new Error('AppNavbar did not render primary nav');
        }

        console.log('✅ AppNavbar test passed!');
    } catch (err) {
        console.error('❌ AppNavbar test failed:', err.message);
        process.exit(1);
    }
}

runTest();
