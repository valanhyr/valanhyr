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
                .list { display: grid; gap: var(--space-md); }
                .item { background: var(--surface-2); border: var(--border-width) solid var(--text); padding: 1rem; }
                .row { display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; }
                .title { font-weight: 900; }
                .org { font-family: monospace; font-weight: 900; text-transform: uppercase; }
                .period { font-family: monospace; font-weight: 800; opacity: 0.8; }
                ul { margin: var(--space-sm) 0 0 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                li { font-weight: 700; }
            </style>

            <section id="education" aria-label="Education">
                <ui-card>
                    <div class="top">
                        <h2>Education</h2>
                        <div class="hint">CV / Studies & certs</div>
                    </div>

                    <div class="list">
                        ${items.length ? items.map(ed => `
                            <article class="item">
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
                            </article>
                        `).join('') : `
                            <article class="item">
                                <div class="row">
                                    <div>
                                        <div class="org">University / Bootcamp</div>
                                        <div class="title">Computer Science / Software Engineering</div>
                                    </div>
                                    <div class="period">2019 — 2023</div>
                                </div>
                                <ul>
                                    <li>Core CS fundamentals + web engineering.</li>
                                    <li>Optional: certifications, courses, workshops.</li>
                                </ul>
                            </article>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-education', CvEducation);
