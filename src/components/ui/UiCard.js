import { BaseComponent } from '../BaseComponent.js';

export class UiCard extends BaseComponent {
    connectedCallback() {
        this.#render();
    }

    #render() {
        const interactive = this.hasAttribute('interactive');

        this.render(`
            <style>
                :host { display: block; }

                .card {
                    background: var(--surface);
                    border: var(--border-width) solid var(--text);
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                    padding: 1.5rem;
                    transition: transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
                }

                :host([surface="2"]) .card {
                    background: var(--surface-2);
                }

                :host([rounded]) .card {
                    border-radius: var(--radius);
                }

                ${interactive ? `
                .card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: calc(var(--shadow-offset) + 2px) calc(var(--shadow-offset) + 2px) 0px var(--text);
                }
                ` : ''}
            </style>
            <div class="card"><slot></slot></div>
        `);
    }
}

customElements.define('ui-card', UiCard);
