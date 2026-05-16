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
            ? `<a class="${cls}" href="${href}" ${target ? `target="${target}"` : ''} ${rel ? `rel="${rel}"` : ''}><slot></slot></a>`
            : `<button class="${cls}" type="${type}" ${disabled ? 'disabled' : ''}><slot></slot></button>`;

        this.render(`
            <style>
                :host { display: inline-block; }

                .btn {
                    appearance: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;

                    text-decoration: none;
                    color: var(--text);
                    font-weight: 900;
                    font-family: monospace;

                    border: var(--border-width) solid var(--text);
                    background: var(--surface-2);
                    padding: 0.75rem 1rem;
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);

                    cursor: pointer;
                    user-select: none;

                    transition:
                        transform var(--dur-fast) var(--ease),
                        box-shadow var(--dur-fast) var(--ease),
                        background var(--dur-fast) var(--ease),
                        color var(--dur-fast) var(--ease);
                }

                .btn:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: calc(var(--shadow-offset) + 2px) calc(var(--shadow-offset) + 2px) 0px var(--text);
                }

                .btn:active {
                    transform: translate(-1px, -1px);
                }

                .btn:focus-visible {
                    outline: var(--focus-ring);
                    outline-offset: 2px;
                }

                .btn.primary {
                    background: var(--secondary);
                    color: var(--on-accent);
                }

                .btn.primary:hover {
                    background: var(--primary);
                }

                .btn.ghost:hover {
                    background: var(--surface);
                }

                button.btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            </style>
            ${inner}
        `);
    }
}

customElements.define('ui-button', UiButton);
