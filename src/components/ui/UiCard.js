import { BaseComponent } from '../BaseComponent.js';

export class UiCard extends BaseComponent {
    connectedCallback() {
        this.#render();
        this.#wireSlots();
        this.#updateSlotPresence();
    }

    #wireSlots() {
        const headerSlot = this.shadowRoot?.querySelector?.('slot[name="header"]');
        const footerSlot = this.shadowRoot?.querySelector?.('slot[name="footer"]');

        headerSlot?.addEventListener?.('slotchange', () => this.#updateSlotPresence());
        footerSlot?.addEventListener?.('slotchange', () => this.#updateSlotPresence());
    }

    #updateSlotPresence() {
        const headerSlot = this.shadowRoot?.querySelector?.('slot[name="header"]');
        const footerSlot = this.shadowRoot?.querySelector?.('slot[name="footer"]');

        const hasHeader = (headerSlot?.assignedElements?.({ flatten: true })?.length ?? 0) > 0;
        const hasFooter = (footerSlot?.assignedElements?.({ flatten: true })?.length ?? 0) > 0;

        if (hasHeader) this.setAttribute('data-has-header', 'true');
        else this.removeAttribute('data-has-header');

        if (hasFooter) this.setAttribute('data-has-footer', 'true');
        else this.removeAttribute('data-has-footer');
    }

    #render() {
        const interactive = this.hasAttribute('interactive');

        this.render(`
            <style>
                :host {
                    display: block;
                    height: 100%;
                }

                .card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;

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

                .header {
                    margin-bottom: var(--space-md);
                }

                .body {
                    flex: 1;
                    min-height: 0;
                }

                .footer {
                    margin-top: var(--space-md);
                }

                :host(:not([data-has-header])) .header {
                    display: none;
                    margin-bottom: 0;
                }

                :host(:not([data-has-footer])) .footer {
                    display: none;
                    margin-top: 0;
                }

                ${interactive ? `
                .card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: calc(var(--shadow-offset) + 2px) calc(var(--shadow-offset) + 2px) 0px var(--text);
                }
                ` : ''}
            </style>
            <div class="card">
                <div class="header" part="header"><slot name="header"></slot></div>
                <div class="body" part="body"><slot></slot></div>
                <div class="footer" part="footer"><slot name="footer"></slot></div>
            </div>
        `);
    }
}

customElements.define('ui-card', UiCard);
