import { BaseComponent } from '../BaseComponent.js';

export class AppNavbar extends BaseComponent {
    connectedCallback() {
        this.render(`
            <style>
                nav {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 4px solid black;
                    padding: 1rem;
                    margin-bottom: 2rem;
                }
                .logo { font-weight: 900; font-size: 1.5rem; }
            </style>
            <nav>
                <div class="logo">PORTFOLIO.SYS</div>
                <div>[ HOME ] [ PROJECTS ] [ ABOUT ]</div>
            </nav>
        `);
    }
}
customElements.define('app-navbar', AppNavbar);
