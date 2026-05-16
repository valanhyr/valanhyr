import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvExperience extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const items = Array.isArray(cv?.experience) ? cv.experience : [];

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
                .timeline {
                    display: grid;
                    gap: var(--space-md);
                }
                .item {
                    background: var(--surface-2);
                    border: var(--border-width) solid var(--text);
                    padding: 1rem;
                }
                .row {
                    display: flex;
                    justify-content: space-between;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-sm);
                }
                .role { font-weight: 900; }
                .company { font-family: monospace; font-weight: 900; text-transform: uppercase; }
                .period { font-family: monospace; font-weight: 800; opacity: 0.8; }
                ul { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                li { font-weight: 700; }
                .stack { margin-top: var(--space-sm); font-family: monospace; font-weight: 800; opacity: 0.85; }
            </style>

            <section id="experience" aria-label="Experience">
                <ui-card>
                    <div class="top">
                        <h2>Experience</h2>
                        <div class="hint">CV / Timeline</div>
                    </div>

                    <div class="timeline">
                        ${items.length ? items.map(it => `
                            <article class="item">
                                <div class="row">
                                    <div>
                                        <div class="company">${it.company ?? 'Company'}</div>
                                        <div class="role">${it.role ?? 'Role'}</div>
                                    </div>
                                    <div class="period">${it.period ?? 'YYYY — YYYY'} • ${it.location ?? 'Remote'}</div>
                                </div>
                                <ul>
                                    ${(Array.isArray(it.achievements) ? it.achievements : []).slice(0, 6).map(a => `<li>${a}</li>`).join('')}
                                </ul>
                                ${Array.isArray(it.stack) && it.stack.length ? `<div class="stack">Stack: ${it.stack.join(' • ')}</div>` : ''}
                            </article>
                        `).join('') : `
                            <article class="item">
                                <div class="row">
                                    <div>
                                        <div class="company">Example Corp</div>
                                        <div class="role">Frontend Engineer</div>
                                    </div>
                                    <div class="period">2023 — Present • Remote</div>
                                </div>
                                <ul>
                                    <li>Built UI systems with strong accessibility standards.</li>
                                    <li>Improved performance and stability with measurable impact.</li>
                                    <li>Collaborated across product, design, and backend teams.</li>
                                </ul>
                                <div class="stack">Stack: HTML • CSS • JS • Node</div>
                            </article>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-experience', CvExperience);
