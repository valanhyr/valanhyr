// src/components/views/HomeView.js
import { BaseComponent } from '../BaseComponent.js';
import '../layout/AppFooter.js';

export class HomeView extends BaseComponent {
    connectedCallback() {
        this.#render();
        this.#setupRevealObserver();
    }

    #render() {
        this.render(`
            <style>
                :host { display: block; }
                main.content-sections {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    gap: 5rem; /* Espacio equilibrado entre secciones */
                    padding-top: 0;
                    padding-bottom: 4rem;
                }

                @media (max-width: 768px) {
                    main {
                        gap: var(--space-lg);
                    }
                }

                /* Anchor targets must be in the light DOM (not inside Shadow DOM). */
                cv-about,
                cv-platform,
                cv-skills,
                cv-experience,
                cv-projects,
                cv-education,
                cv-contact {
                    scroll-margin-top: 96px;
                }
            </style>

            <main id="top" class="content-sections">
                <hero-banner></hero-banner>
                <cv-about id="about" class="reveal-hidden"></cv-about>
                <cv-platform id="platform" class="reveal-hidden"></cv-platform>
                <cv-skills id="skills" class="reveal-hidden"></cv-skills>
                <cv-experience id="experience" class="reveal-hidden"></cv-experience>
                <cv-projects id="projects" class="reveal-hidden"></cv-projects>
                <cv-education id="education" class="reveal-hidden"></cv-education>
                <cv-contact id="contact" class="reveal-hidden"></cv-contact>
                <app-footer></app-footer>
            </main>
        `);
    }

    #setupRevealObserver() {
        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    // Una vez revelado, dejamos de observar para ahorrar recursos
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observamos todas las secciones con la clase reveal-hidden
        const sections = this.shadowRoot.querySelectorAll('.reveal-hidden');
        sections.forEach(section => observer.observe(section));
    }
}
customElements.define('home-view', HomeView);
