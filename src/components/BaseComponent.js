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

    showError(message = 'Connection Lost') {
        this.shadowRoot.innerHTML = `
            <style>
                .error-state {
                    padding: var(--space-lg);
                    text-align: center;
                    border: 1px solid var(--secondary);
                    background: rgba(255, 0, 85, 0.05);
                    border-radius: var(--radius);
                    color: var(--secondary);
                    font-family: var(--font-mono);
                }
                .glitch-text {
                    font-size: 1.2rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    animation: error-glitch 0.3s infinite;
                }
                @keyframes error-glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
            </style>
            <div class="error-state">
                <div class="glitch-text">CRITICAL_ERROR: ${message}</div>
                <p style="margin-top: 1rem; opacity: 0.7; font-size: 0.8rem;">RETRYING_CONNECTION...</p>
            </div>
        `;
    }
}
