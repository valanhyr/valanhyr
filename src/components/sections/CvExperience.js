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
            
            const triggerPoint = viewportHeight * 0.7;
            
            let progress = 0;
            if (rect.top < triggerPoint) {
                const totalHeight = rect.height;
                const distanceScrolled = triggerPoint - rect.top;
                progress = Math.min(100, Math.max(0, (distanceScrolled / totalHeight) * 100));
            }

            container.style.setProperty('--scroll-progress', `${progress}%`);

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
                    font-family: var(--font-mono);
                    font-weight: 700;
                    opacity: 0.5;
                    font-size: 0.8rem;
                }
                .timeline {
                    display: grid;
                    gap: 2rem;
                    position: relative;
                    padding-left: 3rem;
                }

                .timeline::before {
                    content: "";
                    position: absolute;
                    left: 1.5rem;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--glass-border);
                    transform: translateX(-50%);
                }

                .progress-line {
                    position: absolute;
                    left: 1.5rem;
                    top: 0;
                    width: 2px;
                    height: var(--scroll-progress, 0%);
                    background: var(--primary);
                    transform: translateX(-50%);
                    transition: height 0.15s ease-out;
                    box-shadow: 0 0 15px var(--primary);
                    z-index: 2;
                }

                .timeline-slot {
                    position: relative;
                    display: grid;
                    opacity: 0;
                    transform: translateX(20px);
                    transition: all 0.6s var(--ease);
                }

                .timeline-slot.reached {
                    opacity: 1;
                    transform: translateX(0);
                }

                .item {
                    background: var(--surface);
                    box-shadow: 4px 4px 8px var(--shadow-dark), 
                                -4px -4px 8px var(--shadow-light);
                    border: 1px solid rgba(255,255,255,0.02);
                    padding: 1.5rem;
                    border-radius: var(--radius);
                    transition: all var(--dur) var(--ease);
                    z-index: 5;
                }

                .item:hover {
                    transform: translateX(10px);
                    border-color: rgba(255, 255, 255, 0.05);
                    box-shadow: 8px 8px 16px var(--shadow-dark), 
                                -8px -8px 16px var(--shadow-light);
                }

                .node {
                    position: absolute;
                    left: -1.5rem;
                    top: 2rem;
                    width: 0.75rem;
                    height: 0.75rem;
                    background: var(--bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 50%;
                    transform: scale(1) translateX(-50%);
                    transition: all 0.3s var(--ease);
                    z-index: 10;
                }

                .timeline-slot.reached .node {
                    box-shadow: 0 0 10px var(--primary);
                    background: var(--primary);
                    border-color: var(--primary);
                    transform: scale(1.2) translateX(-50%);
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                }
                .role { font-weight: 800; font-size: 1.1rem; }
                .company { 
                    font-family: var(--font-mono); 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    color: var(--secondary);
                }
                .period { 
                    font-family: var(--font-mono); 
                    font-weight: 500; 
                    opacity: 0.5; 
                    font-size: 0.8rem;
                }
                ul { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.5rem; color: var(--text-dim); }
                li { font-weight: 500; font-size: 0.95rem; }
                
                .stack { 
                    margin-top: 1.5rem; 
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }
            </style>

            <section id="experience" aria-label="Experience">
                <ui-card>
                    <div class="top">
                        <h2>Experience</h2>
                        <div class="hint">CV // System Timeline</div>
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
                                    ${Array.isArray(it.stack) && it.stack.length ? `
                                        <div class="stack">
                                            ${it.stack.map(s => `<ui-tag variant="default">${s}</ui-tag>`).join('')}
                                        </div>
                                    ` : ''}
                                </article>
                            </div>
                        `).join('') : `
                            <div class="timeline-slot reached">
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
                                    <div class="stack">
                                        <ui-tag>HTML</ui-tag>
                                        <ui-tag>CSS</ui-tag>
                                        <ui-tag>JS</ui-tag>
                                        <ui-tag>Node</ui-tag>
                                    </div>
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
