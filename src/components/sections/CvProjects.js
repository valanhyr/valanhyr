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
                }
                .p {
                    background: var(--surface-2);
                    border: var(--border-width) solid var(--text);
                    padding: 1rem;
                    display: grid;
                    gap: var(--space-sm);
                }
                h3 { margin: 0; font-family: monospace; font-weight: 900; }
                p { margin: 0; }
                .stack { font-family: monospace; font-weight: 800; opacity: 0.85; }
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
                            <article class="p">
                                <h3>${p.name ?? 'Project'}</h3>
                                <p>${p.description ?? 'Short description: problem, solution, and what you owned.'}</p>
                                ${Array.isArray(p.highlights) && p.highlights.length ? `
                                    <ul>
                                        ${p.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                ${Array.isArray(p.stack) && p.stack.length ? `<div class="stack">${p.stack.join(' • ')}</div>` : ''}
                                <div class="links">
                                    ${(Array.isArray(p.links) ? p.links : []).slice(0, 2).map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
                                </div>
                            </article>
                        `).join('') : `
                            <article class="p">
                                <h3>CV Website (Vanilla)</h3>
                                <p>Neo-brutalist CV built with Web Components, data-driven JSON, and a canvas particle graph.</p>
                                <div class="stack">HTML • CSS • JavaScript</div>
                                <div class="links"><a href="#">Repo</a><a href="#">Demo</a></div>
                            </article>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-projects', CvProjects);
