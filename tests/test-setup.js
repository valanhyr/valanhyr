/**
 * Simple DOM Mocks for testing Vanilla Web Components in Node.js
 * (Zero dependencies)
 */

class MockShadowRoot {
    constructor() {
        this.innerHTML = '';
    }
    querySelector(selector) {
        // Very basic mock for querying
        return null;
    }
}

class MockHTMLElement {
    constructor() {
        this._shadowRoot = null;
        this.innerHTML = '';
        this.style = {};
    }

    attachShadow(options) {
        this._shadowRoot = new MockShadowRoot();
        return this._shadowRoot;
    }

    get shadowRoot() {
        return this._shadowRoot;
    }

    connectedCallback() {}
    disconnectedCallback() {}
}

// Global Mocks
global.HTMLElement = MockHTMLElement;
global.customElements = {
    registry: {},
    define: (tag, cls) => {
        global.customElements.registry[tag] = cls;
    },
    get: (tag) => global.customElements.registry[tag]
};

global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
};

// If you need window or document mocks later, we can add them here
global.window = global;
global.document = {
    createElement: (tag) => new MockHTMLElement()
};
