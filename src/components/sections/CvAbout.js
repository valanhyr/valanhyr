import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvAbout extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const about = cv?.about;

        const title = about?.title ?? 'About';
        const paragraphs = Array.isArray(about?.paragraphs) ? about.paragraphs : [
            cv?.basics?.summary ?? 'Write a short summary about your profile, values, and what you enjoy building.',
            'Keep it clear, specific, and impact-focused.'
        ];

        const highlights = Array.isArray(about?.highlights) ? about.highlights : [
            'Performance-first mindset',
            'Accessibility by default',
            'Clean architecture, zero-fluff code'
        ];

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
                h2 {
                    margin: 0;
                    font-size: 1.4rem;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }
                .hint {
                    font-family: monospace;
                    font-weight: 800;
                    opacity: 0.75;
                }
                .grid {
                    display: grid;
                    grid-template-columns: 1.35fr 1fr;
                    gap: var(--space-lg);
                }
                p { margin: 0 0 var(--space-sm) 0; }
                ul {
                    margin: 0;
                    padding-left: 1.25rem;
                    display: grid;
                    gap: 0.35rem;
                }
                li { font-weight: 700; }
                @media (max-width: 768px) {
                    .grid { grid-template-columns: 1fr; }
                }
            </style>

            <section id="about" aria-label="About">
                <ui-card>
                    <div class="top">
                        <h2>${title}</h2>
                        <div class="hint">CV / Summary</div>
                    </div>

                    <div class="grid">
                        <div>
                            ${paragraphs.map(p => `<p>${p}</p>`).join('')}
                        </div>
                        <div>
                            <ul>
                                ${highlights.map(h => `<li>${h}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-about', CvAbout);
