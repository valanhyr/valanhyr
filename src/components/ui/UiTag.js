import { BaseComponent } from '../BaseComponent.js';

export class UiTag extends BaseComponent {
    static get observedAttributes() {
        return ['variant', 'interactive'];
    }

    connectedCallback() {
        this.#render();
    }

    attributeChangedCallback() {
        this.#render();
    }

    #render() {
        const variant = this.getAttribute('variant') || 'default';
        const interactive = this.hasAttribute('interactive');

        this.render(`
            <style>
                :host { 
                    display: inline-block;
                    vertical-align: middle;
                    max-width: 100%;
                    min-width: 0;
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.4rem 1rem;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border: 1px solid var(--glass-border);
                    background: var(--surface-2);
                    color: var(--text-dim);

                    /* Prevent long tag text from causing horizontal overflow */
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    transition: all var(--dur) var(--ease);

                    /* Cyber-Chip Shape */
                    clip-path: polygon(
                        0% 0%, 
                        calc(100% - 8px) 0%, 
                        100% 8px, 
                        100% 100%, 
                        8px 100%, 
                        0% calc(100% - 8px)
                    );
                }

                .tag.primary {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(0, 255, 204, 0.1);
                }

                .tag.secondary {
                    border-color: var(--secondary);
                    color: var(--secondary);
                    background: rgba(255, 0, 85, 0.1);
                }

                ${interactive ? `
                .tag {
                    cursor: pointer;
                }
                .tag:hover {
                    border-color: var(--primary);
                    color: var(--text);
                    background: rgba(0, 255, 204, 0.25);
                    box-shadow: 0 0 15px rgba(0, 255, 204, 0.3);
                    transform: translateY(-2px);
                }
                ` : ''}
            </style>
            <span class="tag ${variant}">
                <slot></slot>
            </span>
        `);
    }
}

customElements.define('ui-tag', UiTag);
