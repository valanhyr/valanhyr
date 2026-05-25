// tests/components/herobanner.test.js

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
        const { store } = await import('../../src/store/state.js');
        const { HeroBanner } = await import('../../src/components/sections/HeroBanner.js');

        if (!global.customElements.registry['hero-banner']) {
            throw new Error('hero-banner not registered');
        }

        // Set CV data before rendering
        store.state.cv = {
            basics: { name: 'Test Name', role: 'Frontend Lead', location: 'Remote', status: 'Open' },
            hero: {
                headline: 'Headline',
                subheadline: 'Sub',
                proofs: ['Proof 1', 'Proof 2', 'Proof 3'],
                primaryCta: { label: 'Contact', href: '#contact' },
                secondaryCta: { label: 'Download PDF', href: '#pdf' }
            }
        };

        const hero = new HeroBanner();
        hero.connectedCallback();

        const html = hero.shadowRoot.innerHTML;
        for (const p of ['Proof 1', 'Proof 2', 'Proof 3']) {
            if (!html.includes(p)) throw new Error('HeroBanner did not render proofs');
        }
        if (html.includes('border-radius: var(--radius-lg)')) {
            throw new Error('HeroBanner still includes card border radius');
        }
        if (html.includes('box-shadow:')) {
            throw new Error('HeroBanner still includes box shadow');
        }
        if (html.includes('border: 1px solid')) {
            throw new Error('HeroBanner still includes border');
        }
        if (!html.includes('.stage::after')) {
            throw new Error('HeroBanner is missing stage ::after');
        }

        console.log('✅ HeroBanner proofs test passed!');
    } catch (err) {
        console.error('❌ HeroBanner proofs test failed:', err.message);
        process.exit(1);
    }
}

runTest();
