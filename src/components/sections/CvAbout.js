import { BaseComponent } from '../BaseComponent.js';
import { SanityService } from '../../services/SanityService.js';

export class CvAbout extends BaseComponent {
    async connectedCallback() {
        this.showSkeleton('<div class="skeleton" style="height: 200px;"></div>');
        try {
            const data = await SanityService.fetch('*[_type == "about"]');
            const aboutData = data[0] || {};
            if (Object.keys(aboutData).length === 0) {
                this.#renderEmpty();
            } else {
                this.#render(aboutData);
            }
        } catch (error) {
            console.error('Failed to fetch about:', error);
            this.showError('PROFILE_OFFLINE');
        }
    }

    #renderEmpty() {
        this.render(`
            <style>
                .empty { padding: 2rem; text-align: center; opacity: 0.5; font-family: var(--font-mono); }
            </style>
            <ui-card>
                <div class="empty">BIO_NOT_FOUND_IN_SYSTEM</div>
            </ui-card>
        `);
    }

    #render(data = {}) {
        const title = data.title ?? 'About';
        const paragraphs = Array.isArray(data.paragraphs) ? data.paragraphs : [
            'Write a short summary about your profile, values, and what you enjoy building.',
            'Keep it clear, specific, and impact-focused.'
        ];

        const highlights = Array.isArray(data.highlights) ? data.highlights : [
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
                <div class="top">
                    <h2>${title}</h2>
                    <div class="hint">CV / Summary</div>
                </div>

                <div class="grid">
                    <div>
                        ${paragraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                    <div>
                        <ui-card>
                            <ul>
                                ${highlights.map(h => `<li>${h}</li>`).join('')}
                            </ul>
                        </ui-card>
                    </div>
                </div>
            </section>
        `);
    }
}

customElements.define('cv-about', CvAbout);
