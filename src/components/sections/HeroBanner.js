import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class HeroBanner extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;

        const name = cv?.basics?.name ?? 'Your Name';
        const role = cv?.basics?.role ?? 'Software Developer';
        const location = cv?.basics?.location ?? 'Remote';
        const status = cv?.basics?.status ?? 'Open to opportunities';

        const headline = cv?.hero?.headline ?? 'Modern web CV, built in vanilla.';
        const subheadline = cv?.hero?.subheadline ?? 'Professional, fast, accessible — without frameworks.';

        const primary = cv?.hero?.primaryCta ?? { label: 'Contact', href: '#contact' };
        const secondary = cv?.hero?.secondaryCta ?? { label: 'Download PDF', href: '#' };

        this.render(`
            <style>
                :host { display: block; }

                .hero {
                    margin-bottom: var(--space-xl);
                }

                .stage {
                    position: relative;
                    height: 440px;
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    background: #000;
                    overflow: hidden;
                    box-shadow: inset 0 0 30px rgba(0, 255, 255, 0.05);
                }

                particle-graph {
                    position: absolute;
                    inset: 0;
                }

                .content {
                    margin-top: 2rem;
                    display: grid;
                    gap: 1rem;
                    max-width: 860px;
                }

                .kicker {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                h1 {
                    font-size: clamp(2.1rem, 5vw, 4rem);
                    line-height: 1.03;
                    margin: 0;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }

                .typewriter {
                    display: inline-block;
                    overflow: hidden;
                    border-right: 3px solid var(--primary);
                    white-space: nowrap;
                    animation: 
                        typing 3s steps(40, end),
                        blink-caret .75s step-end infinite;
                    max-width: fit-content;
                }

                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }

                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: var(--primary); }
                }

                p { 
                    margin: 0;
                    font-size: 1.25rem;
                    color: var(--text-dim);
                    max-width: 600px;
                }

                .ctaRow {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }


                .identity {
                    margin-top: 2rem;
                    font-family: var(--font-mono);
                    font-weight: 700;
                    opacity: 0.6;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                @media (max-width: 650px) {
                    .stage { height: 320px; }
                }
            </style>

            <section class="hero">
                <div class="stage" aria-label="Hero particle graph">
                    <particle-graph></particle-graph>
                </div>

                <div class="content">
                    <div class="kicker">
                        <ui-tag variant="primary">${status}</ui-tag>
                        <ui-tag>${role}</ui-tag>
                        <ui-tag>${location}</ui-tag>
                    </div>

                    <h1><span class="typewriter">${headline}</span></h1>
                    <p>${subheadline}</p>

                    <div class="ctaRow">
                        <ui-button variant="primary" href="${primary.href}">${primary.label}</ui-button>
                        <ui-button href="${secondary.href}">${secondary.label}</ui-button>
                    </div>

                    <div class="identity">${name} // SYSTEM.PROTO</div>
                </div>
            </section>
        `);
    }
}

customElements.define('hero-banner', HeroBanner);
