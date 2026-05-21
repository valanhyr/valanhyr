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

    showSkeleton(html) {
        this.shadowRoot.innerHTML = `
            <style>
                .skeleton {
                    background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            </style>
            ${html}
        `;
    }
}
