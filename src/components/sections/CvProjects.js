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

                /* Acordeón Container */
                .accordion {
                    display: flex;
                    width: 100%;
                    height: 400px;
                    gap: var(--space-sm);
                    margin-top: var(--space-md);
                }

                /* Individual Project Card */
                .project-card {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    border: var(--border-width) solid var(--text);
                    background: var(--surface-2);
                    transition: all 0.6s var(--ease);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }

                /* Comportamiento Dinámico: Solo uno expandido */
                .project-card.active {
                    flex: 4;
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                }

                .accordion:hover .project-card {
                    flex: 1;
                    box-shadow: none;
                }

                .accordion .project-card:hover {
                    flex: 4;
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                    background: var(--surface);
                }

                /* Visuals */
                .card-bg {
                    width: 100%;
                    height: 100%;
                    background: var(--surface);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: height 0.6s var(--ease);
                    position: relative;
                }

                .project-card:hover .card-bg,
                .accordion:not(:hover) .project-card.active .card-bg {
                    height: 40%;
                    border-bottom: var(--border-width) solid var(--text);
                }

                .project-card:hover .card-bg::after,
                .accordion:not(:hover) .project-card.active .card-bg::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: var(--secondary);
                    opacity: 0.1;
                }

                .card-label {
                    position: absolute;
                    bottom: var(--space-md);
                    left: var(--space-md);
                    font-family: monospace;
                    font-weight: 900;
                    background: var(--text);
                    color: var(--bg);
                    padding: 0.25rem 0.5rem;
                    transform-origin: left bottom;
                    transition: transform 0.4s var(--ease);
                    z-index: 10;
                    white-space: nowrap;
                }

                .project-card:hover .card-label,
                .accordion:not(:hover) .project-card.active .card-label {
                    transform: scale(1.2) translateY(-140px);
                }

                .card-content {
                    padding: var(--space-md);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.4s var(--ease);
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                    overflow: hidden;
                    pointer-events: none;
                }

                .project-card:hover .card-content,
                .accordion:not(:hover) .project-card.active .card-content {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }

                h3 { margin: 0; font-family: monospace; font-weight: 900; font-size: 1.2rem; }
                p { margin: 0; font-size: 0.9rem; line-height: 1.4; }
                
                .stack {
                    margin-top: auto;
                    font-family: monospace;
                    font-size: 0.8rem;
                    font-weight: 800;
                    opacity: 0.85;
                }

                .links { display: flex; gap: 0.5rem; margin-top: var(--space-xs); }
                a {
                    text-decoration: none;
                    color: var(--text);
                    border: 1px solid var(--text);
                    padding: 0.15rem 0.4rem;
                    background: var(--bg);
                    font-family: monospace;
                    font-size: 0.75rem;
                    font-weight: 900;
                }
                a:hover { background: var(--primary); }

                @media (max-width: 768px) {
                    .accordion { flex-direction: column; height: auto; }
                    .project-card { height: 120px; flex: none !important; }
                    .project-card.active, .project-card:hover { height: 280px; }
                    .card-label { transform: none !important; bottom: auto; top: var(--space-sm); right: var(--space-sm); left: auto; }
                }
            </style>

            <section id="projects" aria-label="Projects">
                <ui-card>
                    <div class="top">
                        <h2>Projects</h2>
                        <div class="hint">CV / Selected work</div>
                    </div>

                    <div class="accordion">
                        ${items.length ? items.map((p, index) => `
                            <div class="project-card ${index === 0 ? 'active' : ''}" onclick="this.parentElement.querySelectorAll('.project-card').forEach(c => c.classList.remove('active')); this.classList.add('active')">
                                <div class="card-bg">
                                    <div class="card-label">PROYECTO ${String(index + 1).padStart(2, '0')}</div>
                                </div>
                                <div class="card-content">
                                    <h3>${p.name ?? 'Project'}</h3>
                                    <p>${p.description ?? ''}</p>
                                    ${Array.isArray(p.stack) && p.stack.length ? `<div class="stack">${p.stack.join(' • ')}</div>` : ''}
                                    <div class="links">
                                        ${(Array.isArray(p.links) ? p.links : []).map(l => `<a href="${l.href}" target="_blank">${l.label}</a>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="project-card active">
                                <div class="card-bg">
                                    <div class="card-label">CV WEBSITE</div>
                                </div>
                                <div class="card-content">
                                    <h3>Portfolio (Vanilla JS)</h3>
                                    <p>Neo-brutalist CV built with Web Components and data-driven JSON.</p>
                                    <div class="stack">HTML • CSS • JavaScript</div>
                                </div>
                            </div>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-projects', CvProjects);
