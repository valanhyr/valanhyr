// src/components/sections/CvPlatform.js
import { BaseComponent } from '../BaseComponent.js';
import { SanityService } from '../../services/SanityService.js';

export class CvPlatform extends BaseComponent {
    async connectedCallback() {
        this.showSkeleton('<div class="skeleton" style="height: 240px;"></div>');
        try {
            const data = await SanityService.fetch('*[_type == "platform"]');
            const platformData = data[0] || {};
            if (!platformData.bullets || platformData.bullets.length === 0) {
                this.#renderEmpty();
            } else {
                this.#render(platformData);
            }
        } catch (error) {
            console.error('Failed to fetch platform:', error);
            this.showError('ARCH_LINK_FAILURE');
        }
    }

    #renderEmpty() {
        this.render(`
            <style>
                .empty { padding: 2rem; text-align: center; opacity: 0.5; font-family: var(--font-mono); }
            </style>
            <ui-card>
                <div class="empty">SYSTEM_ARCHITECTURE_NOT_LOADED</div>
            </ui-card>
        `);
    }

    #render(data = {}) {
        const title = data.title ?? 'Platform & Architecture';
        const bullets = Array.isArray(data.bullets) ? data.bullets : [];

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

                .blueprint {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-top: 1rem;
                    position: relative;
                }

                @media (max-width: 768px) {
                    .blueprint { grid-template-columns: 1fr; }
                }

                .visual {
                    background: var(--surface-2);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius);
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background-image: 
                        linear-gradient(var(--glass-border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--glass-border) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .visual::after {
                    content: "ARCHITECTURE_MODEL_01";
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    opacity: 0.3;
                }

                .core-box {
                    width: 80px;
                    height: 80px;
                    border: 2px solid var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-mono);
                    font-weight: 900;
                    font-size: 0.7rem;
                    color: var(--primary);
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
                    animation: pulse 4s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }

                ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 1rem; }
                li {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-left: 3px solid var(--secondary);
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }
            </style>

            <section id="platform" aria-label="Platform and Architecture">
                <div class="top">
                    <h2>${title}</h2>
                    <div class="hint">CV // System Architecture</div>
                </div>

                <div class="blueprint">
                    <div class="visual">
                        <div class="core-box">CORE_SYS</div>
                    </div>
                    <ui-card surface="2">
                        <ul>
                            ${bullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </ui-card>
                </div>
            </section>
        `);
    }
}

customElements.define('cv-platform', CvPlatform);
