import { BaseComponent } from '../BaseComponent.js';

export class HomeView extends BaseComponent {
    connectedCallback() {
        this.render(`
            <h1>WELCOME TO THE LAB</h1>
            <skill-graph></skill-graph>
        `);
    }
}
customElements.define('home-view', HomeView);
