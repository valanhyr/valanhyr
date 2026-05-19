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
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.35rem 0.75rem;
                    border-radius: 50px;
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: 1px solid var(--glass-border);
                    background: var(--surface-2);
                    color: var(--text-dim);
                    white-space: nowrap;
                    transition: all var(--dur) var(--ease);
                }

                .tag.primary {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(0, 255, 255, 0.05);
                }

                .tag.secondary {
                    border-color: var(--secondary);
                    color: var(--secondary);
                    background: rgba(255, 0, 255, 0.05);
                }

                ${interactive ? `
                .tag {
                    cursor: pointer;
                }
                .tag:hover {
                    border-color: var(--primary);
                    color: var(--text);
                    background: rgba(0, 255, 255, 0.15);
                    box-shadow: 0 0 10px var(--primary);
                    transform: translateY(-1px);
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
