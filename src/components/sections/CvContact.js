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
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: var(--space-lg);
                    align-items: start;
                }
                .box { background: var(--surface-2); border: var(--border-width) solid var(--text); padding: 1rem; }
                .cta { font-weight: 900; font-size: 1.15rem; margin-bottom: var(--space-sm); }
                .mono { font-family: monospace; font-weight: 900; }
                .row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: var(--space-sm); }
                @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
            </style>

            <section id="contact" aria-label="Contact">
                <ui-card>
                    <div class="top">
                        <h2>Contact</h2>
                        <div class="hint">CV / Reach out</div>
                    </div>

                    <div class="grid">
                        <div class="box">
                            <div class="cta">${cta}</div>
                            <div>Best channel: <span class="mono">${email}</span></div>
                            <div class="row">
                                <ui-button variant="primary" href="mailto:${email}">Email me</ui-button>
                                <ui-button href="#about">About</ui-button>
                            </div>
                        </div>
                        <div class="box">
                            <div class="mono">Quick links</div>
                            <div class="row">
                                ${(Array.isArray(cv?.links) ? cv.links : []).slice(0, 4).map(l => `<ui-button href="${l.href}">${l.label}</ui-button>`).join('')}
                            </div>
                        </div>
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-contact', CvContact);
