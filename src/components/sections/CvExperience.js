import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvExperience extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
        this.#setupDynamicLine();
    }

    #setupDynamicLine() {
        const handleScroll = () => {
            const container = this.shadowRoot.querySelector('.timeline');
            const progressLine = this.shadowRoot.querySelector('.progress-line');
            if (!container || !progressLine) return;

            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Punto de activación: cuando el elemento llega al 70% de la pantalla (más natural)
            const triggerPoint = viewportHeight * 0.7;
            
            // Calculamos cuánto hemos progresado en el contenedor
            let progress = 0;
            if (rect.top < triggerPoint) {
                const totalHeight = rect.height;
                const distanceScrolled = triggerPoint - rect.top;
                progress = Math.min(100, Math.max(0, (distanceScrolled / totalHeight) * 100));
            }

            container.style.setProperty('--scroll-progress', `${progress}%`);

            // Marcamos los slots como 'reached' (alcanzados) si el progreso los ha pasado
            const slots = this.shadowRoot.querySelectorAll('.timeline-slot');
            slots.forEach(slot => {
                const slotRect = slot.getBoundingClientRect();
                if (slotRect.top < triggerPoint) {
                    slot.classList.add('reached');
                } else {
                    slot.classList.remove('reached');
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Usamos un pequeño timeout para asegurar que el DOM está listo
        setTimeout(handleScroll, 100);
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
                    position: relative;
                    padding-left: 3rem;
                }

                /* The background thin line */
                .timeline::before {
                    content: "";
                    position: absolute;
                    left: 1.5rem;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: var(--text);
                    opacity: 0.2;
                    transform: translateX(-50%);
                }

                /* The growing progress line */
                .progress-line {
                    position: absolute;
                    left: 1.5rem;
                    top: 0;
                    width: 6px;
                    height: var(--scroll-progress, 0%);
                    background: var(--text);
                    transform: translateX(-50%);
                    transition: height 0.15s ease-out;
                    box-shadow: 0 0 15px var(--secondary);
                    z-index: 2;
                }

                /* Container for Node + Card */
                .timeline-slot {
                    position: relative;
                    display: grid;
                }

                .item {
                    background: var(--surface-2);
                    border: var(--border-width) solid var(--text);
                    padding: 1.2rem;
                    transition: all 0.4s var(--ease);
                    z-index: 5;
                }

                .item:hover {
                    transform: translateX(12px);
                    background: var(--surface);
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                }

                /* The node dot - Truly Anchored to the line */
                .node {
                    position: absolute;
                    left: -1.5rem; /* Corrected: compensates for 3rem padding-left */
                    top: 1.8rem;
                    width: 1.2rem;
                    height: 1.2rem;
                    background: var(--surface-2);
                    border: var(--border-width) solid var(--text);
                    border-radius: 50%;
                    transform: scale(1) translateX(-50%);
                    transform-origin: center center;
                    transition: all 0.3s var(--ease);
                    z-index: 10;
                    pointer-events: none;
                }

                /* Highlight node when progress reaches it or hover */
                .timeline-slot.reached .node,
                .timeline-slot:hover .node {
                    box-shadow: 0 0 15px var(--secondary);
                    background: var(--secondary);
                    transform: scale(1.3) translateX(-50%);
                    border-color: var(--text);
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
                        <div class="progress-line"></div>
                        ${items.length ? items.map(it => `
                            <div class="timeline-slot">
                                <span class="node"></span>
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
                            </div>
                        `).join('') : `
                            <div class="timeline-slot">
                                <span class="node"></span>
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
                            </div>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-experience', CvExperience);
