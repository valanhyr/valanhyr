import { BaseComponent } from '../BaseComponent.js';

export class AppFooter extends BaseComponent {
    connectedCallback() {
        this.#render();
    }

    #render() {
        const year = new Date().getFullYear();
        
        this.render(`
            <style>
                :host { display: block; margin-top: 4rem; }
                
                footer {
                    border-top: 1px solid var(--glass-border);
                    padding: 3rem 1rem;
                    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
                    position: relative;
                    overflow: hidden;
                }

                .wrap {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .wrap { grid-template-columns: 1fr; text-align: center; }
                    .credits { justify-content: center; }
                }

                .system-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .brand {
                    font-family: var(--font-display);
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--primary);
                    font-size: 1.2rem;
                }

                .version {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    opacity: 0.4;
                }

                .shutdown-btn {
                    margin-top: 1rem;
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--secondary);
                    text-transform: uppercase;
                    cursor: pointer;
                    background: transparent;
                    border: 1px solid var(--secondary);
                    padding: 4px 12px;
                    border-radius: 4px;
                    transition: all 0.3s var(--ease);
                    width: fit-content;
                }

                @media (max-width: 768px) {
                    .shutdown-btn { margin-left: auto; margin-right: auto; }
                }

                .shutdown-btn:hover {
                    background: var(--secondary);
                    color: #fff;
                    box-shadow: 0 0 15px var(--secondary);
                }

                .credits {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-end;
                }

                @media (max-width: 768px) {
                    .credits { align-items: center; }
                }

                .tech-stack {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .back-top {
                    font-family: var(--font-mono);
                    text-decoration: none;
                    color: var(--text);
                    font-weight: 800;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: color 0.3s var(--ease);
                }

                .back-top:hover {
                    color: var(--primary);
                }

                .copyright {
                    margin-top: 2rem;
                    font-size: 0.75rem;
                    opacity: 0.3;
                    font-family: var(--font-mono);
                }
            </style>

            <footer>
                <div class="wrap">
                    <div class="system-info">
                        <div class="brand">VALANHYR.SYS</div>
                        <div class="version">BUILD_VER: 2.0.26 // KERNEL: VANILLA_V3</div>
                        <button class="shutdown-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">Term_Init(BackToTop)</button>
                    </div>

                    <div class="credits">
                        <a href="#top" class="back-top">
                            <span>▲</span> BACK_TO_TOP
                        </a>
                        <div class="tech-stack">
                            <ui-tag variant="secondary">VANILLA_JS</ui-tag>
                            <ui-tag variant="secondary">SANITY_CMS</ui-tag>
                            <ui-tag variant="secondary">WEB_COMPONENTS</ui-tag>
                        </div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div class="copyright">© ${year} // ALL_RIGHTS_RESERVED // NO_FRAMEWORKS_HARMED</div>
                </div>
            </footer>
        `);
    }
}

customElements.define('app-footer', AppFooter);
