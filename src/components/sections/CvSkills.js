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
                    gap: var(--space-md);
                }
                .box {
                    background: var(--surface-2);
                    border: var(--border-width) solid var(--text);
                    padding: 1rem;
                }
                .boxTop {
                    display: flex;
                    justify-content: space-between;
                    gap: var(--space-sm);
                    align-items: baseline;
                    margin-bottom: var(--space-sm);
                }
                h3 {
                    margin: 0;
                    font-family: monospace;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                .meta {
                    font-family: monospace;
                    font-weight: 800;
                    opacity: 0.75;
                }
                .chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }
                .chip {
                    border: 2px solid var(--text);
                    padding: 0.2rem 0.45rem;
                    font-family: monospace;
                    font-weight: 800;
                    background: var(--surface-2);
                }
                .chip:hover {
                    background: var(--primary);
                    color: var(--on-accent);
                }
                @media (max-width: 820px) {
                    .grid { grid-template-columns: 1fr; }
                }
            </style>

            <section id="skills" aria-label="Skills">
                <ui-card>
                    <div class="top">
                        <h2>Skills</h2>
                        <div class="hint">CV / Stack overview</div>
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
                                        ${leaves.map(s => `<span class="chip">${s}</span>`).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('') : `
                            <div class="box">
                                <h3>frontend</h3>
                                <div class="chips"><span class="chip">HTML</span><span class="chip">CSS</span><span class="chip">JavaScript</span></div>
                            </div>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-skills', CvSkills);
