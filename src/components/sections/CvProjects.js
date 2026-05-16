import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvProjects extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const items = Array.isArray(cv?.projects) ? cv.projects : [];

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
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: var(--space-md);
                    align-items: stretch;
                }

                article {
                    height: 100%;
                }

                ui-card {
                    height: 100%;
                }

                h3 { margin: 0; font-family: monospace; font-weight: 900; }
                p { margin: 0; }
                ul { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                li { font-weight: 700; }
                .content {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }

                .details {
                    flex: 1;
                    display: grid;
                    gap: var(--space-sm);
                    align-content: start;
                }

                .stack {
                    margin-top: auto;
                    font-family: monospace;
                    font-weight: 800;
                    opacity: 0.85;
                }

                .links { display: flex; gap: 0.5rem; flex-wrap: wrap; }

                a {
                    text-decoration: none;
                    color: var(--text);
                    border: var(--border-width) solid var(--text);
                    padding: 0.25rem 0.5rem;
                    background: var(--surface-2);
                    font-family: monospace;
                    font-weight: 900;
                }

                a:hover {
                    background: var(--secondary);
                    color: var(--on-accent);
                }
                @media (max-width: 980px) { .grid { grid-template-columns: 1fr; } }
            </style>

            <section id="projects" aria-label="Projects">
                <ui-card>
                    <div class="top">
                        <h2>Projects</h2>
                        <div class="hint">CV / Selected work</div>
                    </div>

                    <div class="grid">
                        ${items.length ? items.map(p => `
                            <article>
                                <ui-card surface="2" interactive>
                                    <div slot="header">
                                        <h3>${p.name ?? 'Project'}</h3>
                                    </div>

                                    <div class="content">
                                        <div class="details">
                                            <p>${p.description ?? 'Short description: problem, solution, and what you owned.'}</p>
                                            ${Array.isArray(p.highlights) && p.highlights.length ? `
                                                <ul>
                                                    ${p.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
                                                </ul>
                                            ` : ''}
                                        </div>

                                        ${Array.isArray(p.stack) && p.stack.length ? `<div class="stack">${p.stack.join(' • ')}</div>` : ''}
                                    </div>

                                    <div slot="footer" class="links">
                                        ${(Array.isArray(p.links) ? p.links : []).slice(0, 2).map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
                                    </div>
                                </ui-card>
                            </article>
                        `).join('') : `
                            <article>
                                <ui-card surface="2" interactive>
                                    <div slot="header"><h3>CV Website (Vanilla)</h3></div>
                                    <div class="content">
                                        <div class="details">
                                            <p>Neo-brutalist CV built with Web Components, data-driven JSON, and a canvas particle graph.</p>
                                        </div>
                                        <div class="stack">HTML • CSS • JavaScript</div>
                                    </div>
                                    <div slot="footer" class="links"><a href="#">Repo</a><a href="#">Demo</a></div>
                                </ui-card>
                            </article>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-projects', CvProjects);
