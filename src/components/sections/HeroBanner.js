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
        const proofs = Array.isArray(cv?.hero?.proofs) ? cv.hero.proofs : [];

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
                    border: var(--border-width) solid var(--text);
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                    background: #000;
                    overflow: hidden;
                }

                particle-graph {
                    position: absolute;
                    inset: 0;
                }

                .content {
                    margin-top: var(--space-lg);
                    display: grid;
                    gap: var(--space-sm);
                    max-width: 860px;
                }

                .kicker {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                    font-family: monospace;
                    font-weight: 800;
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    border: var(--border-width) solid var(--text);
                    padding: 0.35rem 0.6rem;
                    background: var(--surface-2);
                }

                .tag.primary { background: var(--surface-2); }

                h1 {
                    font-size: clamp(2.1rem, 4vw, 3.2rem);
                    line-height: 1.03;
                    margin: 0;
                }

                p { margin: 0; }

                .proofs { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                .proofs li { font-weight: 800; }

                .ctaRow {
                    display: flex;
                    gap: var(--space-sm);
                    margin-top: var(--space-sm);
                    flex-wrap: wrap;
                }


                .identity {
                    margin-top: var(--space-sm);
                    font-family: monospace;
                    font-weight: 800;
                    opacity: 0.9;
                }

                @media (max-width: 650px) {
                    .stage { height: 520px; }
                    .overlay { margin: var(--space-md); }
                }
            </style>

            <section class="hero">
                <div class="stage" aria-label="Hero particle graph">
                    <particle-graph></particle-graph>
                </div>

                <div class="content">
                    <div class="kicker">
                        <span class="tag primary">${status}</span>
                        <span class="tag">${role}</span>
                        <span class="tag">${location}</span>
                    </div>

                    <h1>${headline}</h1>
                    <p>${subheadline}</p>
                    ${proofs.length ? `
  <ul class="proofs">
    ${proofs.slice(0, 3).map(p => `<li>${p}</li>`).join('')}
  </ul>
` : ''}

                    <div class="ctaRow">
                        <ui-button variant="primary" href="${primary.href}">${primary.label}</ui-button>
                        <ui-button href="${secondary.href}">${secondary.label}</ui-button>
                    </div>

                    <div class="identity">${name} • Curriculum Vitae</div>
                </div>
            </section>
        `);
    }
}

customElements.define('hero-banner', HeroBanner);
