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
                    font-family: var(--font-main);

                    border: 1px solid var(--glass-border);
                    background: linear-gradient(145deg, #111, #080808);
                    padding: 12px 24px;
                    border-radius: 50px;
                    box-shadow: 6px 6px 12px var(--shadow-dark), 
                                -6px -6px 12px var(--shadow-light);

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
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    transform: translateX(-100%);
                    animation: sweep 4s infinite linear;
                    pointer-events: none;
                }

                .btn:hover {
                    border-color: var(--primary);
                    box-shadow: 0 0 15px var(--primary),
                                4px 4px 8px var(--shadow-dark), 
                                -4px -4px 8px var(--shadow-light);
                    transform: translateY(-2px);
                }

                .btn:active {
                    transform: translateY(0);
                    box-shadow: inset 4px 4px 8px var(--shadow-dark), 
                                inset -4px -4px 8px var(--shadow-light);
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
