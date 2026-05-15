
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

        if (!view.shadowRoot.innerHTML.includes('WELCOME TO THE LAB')) {
            throw new Error('HomeView did not render title');
        }
        if (!view.shadowRoot.innerHTML.includes('<skill-graph>')) {
            throw new Error('HomeView did not render skill-graph placeholder');
        }
        console.log('✅ HomeView test passed!');
    } catch (err) {
        console.error('❌ HomeView test failed:', err.message);
        process.exit(1);
    }
}

runTest();
