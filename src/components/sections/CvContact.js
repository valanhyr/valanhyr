import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvContact extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const contact = cv?.contact ?? {};

        const email = contact.email ?? cv?.links?.find(l => String(l?.label).toLowerCase() === 'email')?.href?.replace('mailto:', '') ?? 'you@example.com';
        const cta = contact.cta ?? 'Let’s build something great.';

        this.render(`
            <style>
                :host { display: block; }
                section { scroll-margin-top: 96px; }
                .top {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-md);
                }
                h2 { margin: 0; font-size: 1.4rem; letter-spacing: 0.02em; text-transform: uppercase; }
                .hint { font-family: monospace; font-weight: 800; opacity: 0.75; }
                .grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    align-items: stretch;
                }
                .stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    height: 100%;
                }
                .cta { 
                    font-family: var(--font-display);
                    font-weight: 800; 
                    font-size: 1.5rem; 
                    line-height: 1.1;
                    color: var(--primary);
                }
                .label {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    opacity: 0.5;
                    margin-bottom: 0.25rem;
                }
                .email-val {
                    font-family: var(--font-mono);
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text);
                }
                .row { 
                    display: flex; 
                    gap: 0.75rem; 
                    flex-wrap: wrap; 
                    margin-top: auto; 
                }
                @media (max-width: 768px) { 
                    .grid { grid-template-columns: 1fr; } 
                }
            </style>

            <section id="contact" aria-label="Contact">
                <div class="top">
                    <h2>Contact</h2>
                    <div class="hint">CV // System Reach-out</div>
                </div>

                <div class="grid">
                    <ui-card surface="2">
                        <div class="stack">
                            <div class="cta">${cta}</div>
                            <div>
                                <div class="label">Primary Channel</div>
                                <div class="email-val">${email}</div>
                            </div>
                            <div class="row">
                                <ui-button variant="primary" href="mailto:${email}">Send Transmission</ui-button>
                            </div>
                        </div>
                    </ui-card>
                    
                    <ui-card surface="2">
                        <div class="stack">
                            <div>
                                <div class="label">Technical Links</div>
                                <div class="row" style="margin-top: 0.5rem;">
                                    ${(Array.isArray(cv?.links) ? cv.links : []).slice(0, 4).map(l => `<ui-button href="${l.href}">${l.label}</ui-button>`).join('')}
                                </div>
                            </div>
                            <div style="margin-top: auto; opacity: 0.4; font-size: 0.8rem; font-family: var(--font-mono);">
                                SYSTEM.STATUS: READY<br>
                                LOCATION: ${cv?.basics?.location ?? 'REMOTE'}
                            </div>
                        </div>
                    </ui-card>
                </div>
            </section>
        `);
    }
}

customElements.define('cv-contact', CvContact);
