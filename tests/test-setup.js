/**
 * Simple DOM Mocks for testing Vanilla Web Components in Node.js
 * (Zero dependencies)
 */

class MockShadowRoot {
    constructor() {
        this.innerHTML = '';
    }
    querySelector(selector) {
        return null;
    }
    querySelectorAll(selector) {
        return [];
    }
    addEventListener(type, listener) {}
    removeEventListener(type, listener) {}
    getElementById(id) {
        return null;
    }
}

class MockHTMLElement {
    constructor() {
        this._shadowRoot = null;
        this.innerHTML = '';
        this.style = {};
        this.classList = {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {}
        };
        this.attributes = {};
    }

    attachShadow(options) {
        this._shadowRoot = new MockShadowRoot();
        return this._shadowRoot;
    }

    get shadowRoot() {
        return this._shadowRoot;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    hasAttribute(name) {
        return name in this.attributes;
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    addEventListener(type, listener) {}
    removeEventListener(type, listener) {}
    querySelector(selector) { return null; }
    querySelectorAll(selector) { return []; }

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
    get: (tag) => global.customElements.registry[tag],
    reset: () => {
        global.customElements.registry = {};
    }
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
