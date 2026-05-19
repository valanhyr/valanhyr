import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

function collectLeaves(value, out = []) {
    if (Array.isArray(value)) {
        for (const v of value) collectLeaves(v, out);
        return out;
    }
    if (typeof value === 'string') {
        out.push(value);
        return out;
    }
    if (value && typeof value === 'object') {
        for (const v of Object.values(value)) collectLeaves(v, out);
    }
    return out;
}

export class CvSkills extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const groups = cv?.graph?.groups ?? {};

        const groupEntries = Object.entries(groups);

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
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 1.5rem;
                }
                .box {
                    background: var(--surface);
                    box-shadow: 4px 4px 8px var(--shadow-dark), 
                                -4px -4px 8px var(--shadow-light);
                    border: 1px solid rgba(255,255,255,0.02);
                    padding: 1.25rem;
                    border-radius: var(--radius);
                }
                .boxTop {
                    display: flex;
                    justify-content: space-between;
                    gap: var(--space-sm);
                    align-items: baseline;
                    margin-bottom: 1rem;
                }
                h3 {
                    margin: 0;
                    font-family: var(--font-mono);
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--secondary);
                    font-size: 1rem;
                }
                .meta {
                    font-family: var(--font-mono);
                    font-weight: 500;
                    opacity: 0.5;
                    font-size: 0.75rem;
                }
                .chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                ui-tag {
                    opacity: 0;
                    transform: translateY(10px);
                }

                :host(.reveal-visible) ui-tag {
                    animation: fadeInUp 0.4s var(--ease) forwards;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>

            <section id="skills" aria-label="Skills">
                <ui-card>
                    <div class="top">
                        <h2>Skills</h2>
                        <div class="hint">CV // Stack Overview</div>
                    </div>

                    <div class="grid">
                        ${groupEntries.length ? groupEntries.map(([key, val]) => {
                            const leaves = collectLeaves(val, []).slice(0, 14);
                            return `
                                <div class="box">
                                    <div class="boxTop">
                                        <h3>${String(key)}</h3>
                                        <div class="meta">${collectLeaves(val, []).length} items</div>
                                    </div>
                                    <div class="chips">
                                        ${leaves.map((s, i) => `<ui-tag interactive style="animation-delay: ${i * 0.05}s">${s}</ui-tag>`).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('') : `
                            <div class="box">
                                <h3>frontend</h3>
                                <div class="chips">
                                    <ui-tag interactive>HTML</ui-tag>
                                    <ui-tag interactive>CSS</ui-tag>
                                    <ui-tag interactive>JavaScript</ui-tag>
                                </div>
                            </div>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-skills', CvSkills);
