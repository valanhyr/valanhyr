import { BaseComponent } from '../BaseComponent.js';

export class UiButton extends BaseComponent {
    static get observedAttributes() {
        return ['href', 'variant', 'target', 'rel', 'type', 'disabled'];
    }

    connectedCallback() {
        this.#render();
    }

    attributeChangedCallback() {
        this.#render();
    }

    #render() {
        const href = this.getAttribute('href');
        const variant = this.getAttribute('variant') || 'default';
        const target = this.getAttribute('target') || '';
        const rel = this.getAttribute('rel') || '';
        const type = this.getAttribute('type') || 'button';
        const disabled = this.hasAttribute('disabled');

        const cls = `btn ${variant}`;

        const inner = href
            ? `<a class="${cls}" href="${href}" ${target ? `target="${target}"` : ''} ${rel ? `rel="${rel}"` : ''}><div class="sweep"></div><slot></slot></a>`
            : `<button class="${cls}" type="${type}" ${disabled ? 'disabled' : ''}><div class="sweep"></div><slot></slot></button>`;

        this.render(`
            <style>
                :host { display: inline-block; }

                .btn {
                    appearance: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    position: relative;
                    overflow: hidden;

                    text-decoration: none;
                    color: var(--text);
                    font-weight: 700;
                    font-family: var(--font-mono);
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;

                    border: 1px solid var(--glass-border);
                    background: linear-gradient(145deg, var(--surface), var(--surface-3));
                    padding: 14px 28px;
                    border-radius: var(--radius);
                    box-shadow: 8px 8px 16px var(--shadow-dark), 
                                -4px -4px 12px var(--shadow-light);

                    cursor: pointer;
                    user-select: none;

                    transition: all var(--dur) var(--ease);
                }

                .sweep {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(0, 255, 204, 0.15),
                        transparent
                    );
                    transform: translateX(-100%);
                    animation: sweep 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                }

                @keyframes glitch-button {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 1px); }
                    40% { transform: translate(-2px, -1px); }
                    60% { transform: translate(2px, 1px); }
                    80% { transform: translate(2px, -1px); }
                    100% { transform: translate(0); }
                }

                .btn:hover {
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(0, 255, 204, 0.2),
                                4px 4px 8px var(--shadow-dark);
                    transform: translateY(-2px);
                    animation: glitch-button 0.2s infinite linear alternate-reverse;
                }

                .btn:active {
                    transform: translateY(0);
                    animation: none;
                    box-shadow: inset 4px 4px 8px var(--shadow-dark);
                }

                .btn:focus-visible {
                    outline: 2px solid var(--primary);
                    outline-offset: 4px;
                }

                .btn.primary {
                    border-color: var(--secondary);
                }

                .btn.primary:hover {
                    border-color: var(--primary);
                    box-shadow: 0 0 20px var(--primary);
                }

                button.btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    filter: grayscale(1);
                }
            </style>
            ${inner}
        `);
    }
}

customElements.define('ui-button', UiButton);
