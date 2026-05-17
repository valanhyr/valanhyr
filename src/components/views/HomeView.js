// src/components/views/HomeView.js
import { BaseComponent } from '../BaseComponent.js';

export class HomeView extends BaseComponent {
    connectedCallback() {
        this.render(`
            <style>
                :host { display: block; }
                main {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    gap: var(--space-xl);
                    padding-bottom: var(--space-xl);
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

            <main id="top">
                <hero-banner></hero-banner>
                <cv-about id="about"></cv-about>
                <cv-platform id="platform"></cv-platform>
                <cv-skills id="skills"></cv-skills>
                <cv-experience id="experience"></cv-experience>
                <cv-projects id="projects"></cv-projects>
                <cv-education id="education"></cv-education>
                <cv-contact id="contact"></cv-contact>
            </main>
        `);
    }
}
customElements.define('home-view', HomeView);
