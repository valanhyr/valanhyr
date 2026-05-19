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
                    box-shadow: 6px 6px 12px var(--shadow-dark), 
                                -6px -6px 12px var(--shadow-light);
                    border: 1px solid rgba(255,255,255,0.02);
                    padding: 1.5rem;
                    border-radius: var(--radius);

                    transition: all var(--dur) var(--ease);
                }

                :host([surface="2"]) .card {
                    background: var(--surface-2);
                }

                .header {
                    margin-bottom: 1rem;
                }

                .body {
                    flex: 1;
                    min-height: 0;
                }

                .footer {
                    margin-top: 1rem;
                }

                :host(:not([data-has-header])) .header {
                    display: none;
                    margin-bottom: 0;
                }

                :host(:not([data-has-footer])) .footer {
                    display: none;
                    margin-top: 0;
                }

                :host([interactive]) .card {
                    cursor: pointer;
                }

                :host([interactive]) .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 10px 10px 20px var(--shadow-dark), 
                                -10px -10px 20px var(--shadow-light);
                    border-color: rgba(255, 255, 255, 0.05);
                }
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
