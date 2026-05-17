// src/components/sections/CvPlatform.js
import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvPlatform extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const platform = cv?.platform ?? {};

        const title = platform.title ?? 'Platform & Architecture';
        const bullets = Array.isArray(platform.bullets) ? platform.bullets : [];

        if (!cv) {
            this.render('');
            return;
        }

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
                .box { background: var(--surface-2); border: var(--border-width) solid var(--text); padding: 1rem; }
                ul { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                li { font-weight: 700; }
                .empty { font-family: monospace; font-weight: 800; opacity: 0.75; }
            </style>

            <section id="platform" aria-label="Platform and Architecture">
                <ui-card>
                    <div class="top">
                        <h2>${title}</h2>
                        <div class="hint">CV / Platform</div>
                    </div>

                    <div class="box">
                        ${bullets.length
                            ? `<ul>${bullets.slice(0, 6).map(b => `<li>${b}</li>`).join('')}</ul>`
                            : `<div class="empty">Add platform bullets in <code>src/store/cv.json</code>.</div>`
                        }
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-platform', CvPlatform);
