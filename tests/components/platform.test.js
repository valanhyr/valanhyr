// tests/components/platform.test.js

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
        const { SanityService } = await import('../../src/services/SanityService.js');
        const { CvPlatform } = await import('../../src/components/sections/CvPlatform.js');

        if (!global.customElements.registry['cv-platform']) {
            throw new Error('cv-platform not registered');
        }

        // Keep this test deterministic: don't depend on cv.json.
        SanityService.fetch = async () => ([{
            title: 'Platform & Architecture',
            bullets: ['A', 'B', 'C']
        }]);

        const section = new CvPlatform();
        await section.connectedCallback();

        const html = section.shadowRoot.innerHTML;
        if (!html.includes('Platform & Architecture')) throw new Error('CvPlatform did not render title');
        for (const b of ['A', 'B', 'C']) {
            if (!html.includes(`<li>${b}</li>`)) throw new Error('CvPlatform did not render bullets');
        }

        console.log('✅ CvPlatform test passed!');
    } catch (err) {
        console.error('❌ CvPlatform test failed:', err.message);
        process.exit(1);
    }
}

runTest();
