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
                    width: 100%;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-sizing: border-box;
                    overflow: hidden;

                    background: linear-gradient(145deg, var(--surface), var(--surface-3));
                    box-shadow: 12px 12px 24px var(--shadow-dark), 
                                -8px -8px 16px var(--shadow-light);
                    border: 1px solid rgba(255,255,255,0.02);
                    padding: 1.5rem;
                    border-radius: var(--radius);

                    transition: all var(--dur) var(--ease);
                }

                /* Corner Brackets */
                .card::before, .card::after {
                    content: "";
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    pointer-events: none;
                    transition: border-color var(--dur) var(--ease);
                }

                .card::before {
                    top: -1px;
                    left: -1px;
                    border-top-color: rgba(255,255,255,0.05);
                    border-left-color: rgba(255,255,255,0.05);
                    border-top-left-radius: var(--radius);
                }

                .card::after {
                    bottom: -1px;
                    right: -1px;
                    border-bottom-color: rgba(255,255,255,0.05);
                    border-right-color: rgba(255,255,255,0.05);
                    border-bottom-right-radius: var(--radius);
                }

                :host([interactive]) .card {
                    cursor: pointer;
                }

                :host([interactive]) .card:hover {
                    transform: translateY(-6px);
                    box-shadow: 20px 20px 40px var(--shadow-dark), 
                                0 0 15px rgba(0, 255, 204, 0.1);
                    border-color: rgba(0, 255, 204, 0.2);
                }

                :host([interactive]) .card:hover::before {
                    border-top-color: var(--primary);
                    border-left-color: var(--primary);
                }

                :host([interactive]) .card:hover::after {
                    border-bottom-color: var(--primary);
                    border-right-color: var(--primary);
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
