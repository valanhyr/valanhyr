import './src/components/layout/AppNavbar.js';
import './src/components/views/HomeView.js';
import './src/components/graph/SkillGraph.js';

const app = document.getElementById('app');

function init() {
    app.innerHTML = `
        <app-navbar></app-navbar>
        <home-view></home-view>
    `;
}

init();
