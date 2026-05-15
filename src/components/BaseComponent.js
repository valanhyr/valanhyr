import { store } from '../store/state.js';

export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Helper to bind a property to the store
    bindState(key, callback) {
        store.subscribe(key, callback);
    }

    render(html) {
        this.shadowRoot.innerHTML = html;
    }
}
