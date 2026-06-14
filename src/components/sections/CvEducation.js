import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvEducation extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const items = Array.isArray(cv?.education) ? cv.education : [];

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
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }
                .item-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    height: 100%;
                }
                .title { 
                    font-family: var(--font-display);
                    font-weight: 800; 
                    font-size: 1.2rem;
                    line-height: 1.2;
                    color: var(--text);
                }
                .org { 
                    font-family: var(--font-mono); 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    color: var(--secondary);
                    font-size: 0.8rem;
                    letter-spacing: 0.05em;
                }
                .period { 
                    font-family: var(--font-mono); 
                    font-weight: 500; 
                    opacity: 0.4; 
                    font-size: 0.75rem;
                }
                ul { 
                    margin: 0; 
                    padding: 0; 
                    list-style: none;
                    display: grid;
                    gap: 0.5rem;
                }
                li { 
                    font-size: 0.9rem;
                    color: var(--text-dim);
                    padding-left: 1.25rem;
                    position: relative;
                }
                li::before {
                    content: ">";
                    position: absolute;
                    left: 0;
                    color: var(--primary);
                    font-family: var(--font-mono);
                    font-weight: 900;
                }
                @media (max-width: 768px) { 
                    .grid { grid-template-columns: 1fr; } 
                }
            </style>

            <section id="education" aria-label="Education">
                <div class="top">
                    <h2>Education</h2>
                    <div class="hint">CV // Academic Uplinks</div>
                </div>

                <div class="grid">
                    ${items.length ? items.map(ed => `
                        <ui-card surface="2" interactive>
                            <div class="item-content">
                                <div class="row">
                                    <div>
                                        <div class="org">${ed.org ?? 'Institution'}</div>
                                        <div class="title">${ed.title ?? 'Degree / Certification'}</div>
                                    </div>
                                    <div class="period">${ed.period ?? 'YYYY'}</div>
                                </div>
                                ${(Array.isArray(ed.details) && ed.details.length) ? `
                                    <ul>${ed.details.slice(0, 4).map(d => `<li>${d}</li>`).join('')}</ul>
                                ` : ''}
                            </div>
                        </ui-card>
                    `).join('') : `
                        <ui-card surface="2" interactive>
                            <div class="item-content">
                                <div class="row">
                                    <div>
                                        <div class="org">University / Academy</div>
                                        <div class="title">Computer Science / Software Systems</div>
                                    </div>
                                    <div class="period">2019 — 2023</div>
                                </div>
                                <ul>
                                    <li>Advanced algorithms & data structure optimization.</li>
                                    <li>Full-stack architecture & distributed systems.</li>
                                </ul>
                            </div>
                        </ui-card>
                    `}
                </div>
            </section>
        `);
    }
}

customElements.define('cv-education', CvEducation);
